#!/usr/bin/env node
// Rewrites the <script> tags between <!-- scenes:start --> and <!-- scenes:end -->
// in index.html from the scene ids listed in js/timeline.js (+ any extra scenes/*.js
// that are not in the timeline are skipped). Scene file convention: scenes/<id>.js
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const tl = readFileSync(path.join(ROOT, 'js/timeline.js'), 'utf8');
const ids = [...new Set([...tl.matchAll(/["']?id["']?:\s*["']([^"']+)["']/g)].map((m) => m[1]))];
const tags = ids.map((id) => {
  const f = `scenes/${id}.js`;
  if (!existsSync(path.join(ROOT, f))) console.warn('missing', f);
  return `  <script src="${f}"></script>`;
});
const idx = path.join(ROOT, 'index.html');
const html = readFileSync(idx, 'utf8').replace(/<!-- scenes:start -->[\s\S]*?<!-- scenes:end -->/, `<!-- scenes:start -->\n${tags.join('\n')}\n  <!-- scenes:end -->`);
writeFileSync(idx, html);
console.log(`index.html: ${ids.length} scenes`);
