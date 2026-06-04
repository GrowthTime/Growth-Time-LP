#!/usr/bin/env node
// build.mjs — gera /home/gt/_lp_deploy2/dist/ (bundle otimizado p/ Cloudflare Pages)
// Offline e idempotente. Fontes editáveis ficam na raiz; o deploy sai de dist/.
//
//   node build.mjs
//   wrangler pages deploy dist/ --project-name=growth-time-lp --branch=preview|master
//
// O que faz (ver /home/gt/.claude/plans/eu-quero-que-voc-melodic-lerdorf.md):
//  - precompila os .jsx do system/ (+ bootstrap) UMA vez via o babel já vendado -> system.<hash>.js
//  - troca React dev por React production.min nos scripts do system/index.html, dropa o babel
//  - funde colors_and_type.css + fonts.css + landing.css em landing.<hash>.css (rewrite url files/ -> fonts/files/)
//  - svgo (best-effort) no brazil-map -> brazil-map.<hash>.svg
//  - content-hash em landing.js -> landing.<hash>.js
//  - reescreve index.html p/ os nomes hasheados
//  - emite _headers (immutable 1y nos assets hasheados, HTML sempre fresco)

import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, readdirSync, existsSync, unlinkSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname));
const DIST = path.join(ROOT, 'dist');
const require = createRequire(import.meta.url);
const read = (p) => readFileSync(p, 'utf8');
const sha8 = (data) => createHash('sha256').update(data).digest('hex').slice(0, 8);
const log = (...a) => console.log('•', ...a);

// ---------------------------------------------------------------------------
// 1. Limpa e copia o bundle inteiro p/ dist/ (sobrescreve os otimizados depois)
// ---------------------------------------------------------------------------
rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST, { recursive: true });
const SKIP = new Set(['dist', '.wrangler', 'node_modules', 'build.mjs', '.git']);
for (const entry of readdirSync(ROOT)) {
  if (SKIP.has(entry)) continue;
  cpSync(path.join(ROOT, entry), path.join(DIST, entry), { recursive: true });
}
log('copiado bundle -> dist/');

// ---------------------------------------------------------------------------
// 2. Precompila o system/ (10 jsx + bootstrap) -> system.<hash>.js
// ---------------------------------------------------------------------------
const Babel = require(path.join(ROOT, 'system/vendor/babel.min.js'));
const transpile = (code, file) => Babel.transform(code, { presets: ['react'], filename: file }).code;

const sysHtmlSrc = read(path.join(ROOT, 'system/index.html'));
// ordem dos .jsx vem do próprio HTML (não hardcode)
const jsxFiles = [...sysHtmlSrc.matchAll(/<script type="text\/babel" src="([^"]+)"><\/script>/g)].map(m => m[1]);
if (jsxFiles.length !== 10) throw new Error(`esperava 10 .jsx, achei ${jsxFiles.length}: ${jsxFiles}`);
// bootstrap inline = o único <script type="text/babel"> sem src
const bootstrapMatch = sysHtmlSrc.match(/<script type="text\/babel">([\s\S]*?)<\/script>/);
if (!bootstrapMatch) throw new Error('bootstrap inline <script type=text/babel> não encontrado');

const parts = [];
for (const f of jsxFiles) {
  parts.push(`/* ${f} */\n` + transpile(read(path.join(ROOT, 'system', f)), f));
}
parts.push('/* bootstrap */\n' + transpile(bootstrapMatch[1], 'bootstrap.jsx'));
const sysBundle = parts.join('\n;\n');
const sysName = `system.${sha8(sysBundle)}.js`;
writeFileSync(path.join(DIST, 'system', sysName), sysBundle);
log(`system bundle -> system/${sysName} (${(sysBundle.length/1024).toFixed(1)} KB)  [${jsxFiles.join(', ')}]`);

// reescreve dist/system/index.html: 13 scripts -> 3
let sysHtml = sysHtmlSrc
  .replace('vendor/react.development.js', 'vendor/react.production.min.js')
  .replace('vendor/react-dom.development.js', 'vendor/react-dom.production.min.js')
  .replace(/[ \t]*<script src="vendor\/babel\.min\.js"><\/script>\n?/, '')
  .replace(/[ \t]*<script type="text\/babel" src="[^"]+"><\/script>\n?/g, '')
  .replace(/<script type="text\/babel">[\s\S]*?<\/script>/, `<script src="${sysName}"></script>`);
writeFileSync(path.join(DIST, 'system/index.html'), sysHtml);

// ---------------------------------------------------------------------------
// 3. Funde o CSS -> landing.<hash>.css  (cascata: tokens -> @font-face -> landing)
// ---------------------------------------------------------------------------
const colors = read(path.join(ROOT, 'colors_and_type.css'))
  .replace(/@import\s+url\(['"]?fonts\/fonts\.css['"]?\)\s*;?/, '/* fonts merged below */');
const fonts = read(path.join(ROOT, 'fonts/fonts.css'))
  .replace(/url\(files\//g, 'url(fonts/files/');           // GOTCHA: path relativo à raiz agora
const landing = read(path.join(ROOT, 'landing.css'))
  .replace(/@import\s+url\(['"]?colors_and_type\.css['"]?\)\s*;?/, '/* tokens merged above */');
const mergedCss = colors + '\n\n' + fonts + '\n\n' + landing;
const cssName = `landing.${sha8(mergedCss)}.css`;
writeFileSync(path.join(DIST, cssName), mergedCss);
// sanidade: nenhuma url(files/...) não-reescrita e nenhum @import sobrando
if (/url\(files\//.test(mergedCss)) throw new Error('CSS merge: sobrou url(files/...) não reescrito');
if (/@import/.test(mergedCss)) throw new Error('CSS merge: sobrou @import no CSS fundido');
log(`css fundido -> ${cssName} (${(mergedCss.length/1024).toFixed(1)} KB)`);

// ---------------------------------------------------------------------------
// 4. content-hash no landing.js
// ---------------------------------------------------------------------------
const jsBuf = readFileSync(path.join(ROOT, 'landing.js'));
const jsName = `landing.${sha8(jsBuf)}.js`;
writeFileSync(path.join(DIST, jsName), jsBuf);
log(`js -> ${jsName}`);

// ---------------------------------------------------------------------------
// 5. brazil-map.svg: svgo best-effort + content-hash
// ---------------------------------------------------------------------------
let svgBuf = readFileSync(path.join(ROOT, 'brazil-map.svg'));
const rawSvgLen = svgBuf.length;
try {
  const cfg = path.join(DIST, '_svgo.config.mjs');
  writeFileSync(cfg, `export default { multipass:true, floatPrecision:2, plugins:[{name:'preset-default',params:{overrides:{removeViewBox:false}}}] };\n`);
  const tmpIn = path.join(DIST, '_map_in.svg');
  const tmpOut = path.join(DIST, '_map_out.svg');
  writeFileSync(tmpIn, svgBuf);
  execFileSync('npx', ['--yes', 'svgo', '--config', cfg, '-i', tmpIn, '-o', tmpOut], { stdio: 'pipe', timeout: 120000 });
  const optimized = readFileSync(tmpOut);
  // valida: ainda é svg com viewBox e razoável
  const s = optimized.toString('utf8');
  if (/<svg[^>]*viewBox/i.test(s) && optimized.length > 1000 && optimized.length < rawSvgLen) {
    svgBuf = optimized;
    log(`svg svgo OK: ${(rawSvgLen/1024).toFixed(0)} KB -> ${(svgBuf.length/1024).toFixed(0)} KB`);
  } else {
    log('svg svgo: saída suspeita, mantendo original');
  }
  for (const t of [cfg, tmpIn, tmpOut]) if (existsSync(t)) unlinkSync(t);
} catch (e) {
  log('svg svgo indisponível, mantendo original (' + (e.message || e).toString().split('\n')[0] + ')');
}
const svgName = `brazil-map.${sha8(svgBuf)}.svg`;
writeFileSync(path.join(DIST, svgName), svgBuf);
log(`svg -> ${svgName}`);

// ---------------------------------------------------------------------------
// 6. Reescreve dist/index.html p/ os nomes hasheados
// ---------------------------------------------------------------------------
let html = read(path.join(DIST, 'index.html'));
html = html.replace(/href="landing\.css(\?v=[^"]*)?"/, `href="${cssName}"`);
html = html.replace(/src="landing\.js(\?v=[^"]*)?"/, `src="${jsName}"`);
html = html.replace(/src="brazil-map\.svg"/, `src="${svgName}"`);
writeFileSync(path.join(DIST, 'index.html'), html);
// sanidade
for (const must of [cssName, jsName, svgName]) {
  if (!html.includes(must)) throw new Error(`index.html não referencia ${must}`);
}
if (/landing\.css\?v=|src="landing\.js\?v=|src="brazil-map\.svg"/.test(html)) throw new Error('index.html ainda referencia asset não-hasheado');
log('index.html reescrito');

// ---------------------------------------------------------------------------
// 7. _headers (cache imutável nos hasheados/estáveis; HTML sempre fresco)
// ---------------------------------------------------------------------------
const headers = `# Gerado por build.mjs — não editar à mão
/fonts/files/*
  cache-control: public, max-age=31536000, immutable
/system/vendor/react.production.min.js
  cache-control: public, max-age=31536000, immutable
/system/vendor/react-dom.production.min.js
  cache-control: public, max-age=31536000, immutable
/system/system.*.js
  cache-control: public, max-age=31536000, immutable
/landing.*.css
  cache-control: public, max-age=31536000, immutable
/landing.*.js
  cache-control: public, max-age=31536000, immutable
/brazil-map.*.svg
  cache-control: public, max-age=31536000, immutable
/*.html
  cache-control: public, max-age=0, must-revalidate
/
  cache-control: public, max-age=0, must-revalidate
`;
writeFileSync(path.join(DIST, '_headers'), headers);
log('_headers emitido');

// ---------------------------------------------------------------------------
// 8. Limpa do dist/ o que não é mais referenciado (evita bloat no deploy)
// ---------------------------------------------------------------------------
const purge = [
  'landing.css', 'landing.js', 'brazil-map.svg',          // versões não-hasheadas
  'system/vendor/babel.min.js',                            // não vai mais ao ar
  'system/vendor/react.development.js',
  'system/vendor/react-dom.development.js',
  ...jsxFiles.map(f => path.join('system', f)),            // compilados no bundle
];
for (const rel of purge) {
  const p = path.join(DIST, rel);
  if (existsSync(p)) unlinkSync(p);
}
log('purga de arquivos não-referenciados feita');

console.log('\n✅ build OK -> dist/');
console.log(`   css=${cssName}  js=${jsName}  svg=${svgName}  system=${sysName}`);
