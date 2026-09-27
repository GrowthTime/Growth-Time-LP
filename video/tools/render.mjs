#!/usr/bin/env node
/* ============================================================
   GTR motion — frame-accurate renderer
   Serves video/ over a local HTTP server, opens index.html?render=1
   in headless Chromium, seeks the timeline frame by frame and pipes
   the captures into ffmpeg (libx264). Several Chromium instances
   render disjoint frame ranges in parallel; segments are then
   concatenated losslessly and muxed with the soundtrack.

   Usage
     node tools/render.mjs --info                      # timeline + cues -> out/timeline.json
     node tools/render.mjs --stills 1.5,3,10           # PNG stills -> out/stills/
     node tools/render.mjs --sheet 0:20:1 [--cols 5]   # contact sheet -> out/sheet_0-20.png
     node tools/render.mjs --video [--fps 60] [--range 0:12] [--workers 3]
                           [--crf 17] [--audio audio/gtr-soundtrack.wav] [--out out/gtr.mp4]
   Requires: playwright (global), ffmpeg on PATH.
   ============================================================ */
import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { spawn } from 'node:child_process';
import path from 'node:path';
import os from 'node:os';

const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright')); }
catch { ({ chromium } = require('/opt/node22/lib/node_modules/playwright')); }

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const OUT = path.join(ROOT, 'out');
const W = 1920, H = 1080;

/* ---------------- args ---------------- */
const argv = process.argv.slice(2);
const arg = (name, def) => {
  const i = argv.indexOf('--' + name);
  if (i < 0) return def;
  const v = argv[i + 1];
  return v === undefined || v.startsWith('--') ? true : v;
};
const FFMPEG = process.env.FFMPEG || 'ffmpeg';

/* ---------------- static server ---------------- */
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2',
  '.json': 'application/json', '.mp3': 'audio/mpeg', '.wav': 'audio/wav', '.mp4': 'video/mp4' };
function serve() {
  return new Promise((resolve) => {
    const srv = createServer(async (req, res) => {
      try {
        const u = decodeURIComponent(new URL(req.url, 'http://x').pathname);
        const f = path.join(ROOT, u === '/' ? 'index.html' : u);
        if (!f.startsWith(ROOT)) throw new Error('nope');
        const data = await readFile(f);
        res.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' });
        res.end(data);
      } catch {
        res.writeHead(404); res.end();
      }
    });
    srv.listen(0, '127.0.0.1', () => resolve({ srv, port: srv.address().port }));
  });
}

async function openPage(port, { quiet = false } = {}) {
  const browser = await chromium.launch({
    args: ['--force-color-profile=srgb', '--hide-scrollbars', '--font-render-hinting=none',
      '--disable-background-timer-throttling', '--disable-renderer-backgrounding', '--autoplay-policy=no-user-gesture-required'],
  });
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  const errors = [];
  page.on('console', (m) => {
    if (m.type() === 'error' || m.type() === 'warning') {
      const line = `[${m.type()}] ${m.text()}`;
      errors.push(line);
      if (!quiet) console.log('  browser', line);
    }
  });
  page.on('pageerror', (e) => { errors.push('[pageerror] ' + e.message); console.log('  pageerror', e.message); });
  await page.goto(`http://127.0.0.1:${port}/index.html?render=1`, { waitUntil: 'load' });
  await page.waitForFunction(() => window.__gtr && window.__gtr.ready, null, { timeout: 120000 });
  const info = await page.evaluate(() => ({ duration: window.__gtr.duration, fps: window.__gtr.fps, cues: window.__gtr.cues, scenes: window.__gtr.scenes, music: window.__gtr.music }));
  const cdp = await page.context().newCDPSession(page);
  return { browser, page, cdp, info, errors };
}

async function grab(ctx, t, { format = 'jpeg', quality = 95, scale = 1 } = {}) {
  await ctx.page.evaluate((tt) => window.__seek(tt), t);
  const params = { format, optimizeForSpeed: true, captureBeyondViewport: false, fromSurface: true };
  if (format === 'jpeg') params.quality = quality;
  if (scale !== 1) params.clip = { x: 0, y: 0, width: W, height: H, scale };
  const { data } = await ctx.cdp.send('Page.captureScreenshot', params);
  return Buffer.from(data, 'base64');
}

function run(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: ['ignore', 'inherit', 'inherit'], ...opts });
    p.on('exit', (c) => (c === 0 ? resolve() : reject(new Error(`${cmd} exited ${c}`))));
  });
}

/* ---------------- modes ---------------- */
async function modeInfo(port) {
  const ctx = await openPage(port);
  await mkdir(OUT, { recursive: true });
  await writeFile(path.join(OUT, 'timeline.json'), JSON.stringify(ctx.info, null, 2));
  console.log(`duration ${ctx.info.duration}s · ${ctx.info.scenes.length} scenes · ${ctx.info.cues.length} cues → out/timeline.json`);
  if (ctx.errors.length) console.log(`${ctx.errors.length} console errors/warnings`);
  await ctx.browser.close();
}

async function modeStills(port) {
  const times = String(arg('stills')).split(',').map(Number);
  const dir = path.join(OUT, arg('dir', 'stills'));
  await mkdir(dir, { recursive: true });
  const ctx = await openPage(port);
  for (const t of times) {
    const buf = await grab(ctx, t, { format: 'png' });
    const f = path.join(dir, `t${t.toFixed(2).padStart(6, '0')}.png`);
    await writeFile(f, buf);
    console.log(f);
  }
  await ctx.browser.close();
}

async function modeSheet(port) {
  const [a, b, step] = String(arg('sheet')).split(':').map(Number);
  const cols = +arg('cols', 5);
  const scale = +arg('scale', 0.25);
  const ctx = await openPage(port);
  const tmp = path.join(OUT, `.sheet_${process.pid}`);
  await mkdir(tmp, { recursive: true });
  const times = [];
  for (let t = a; t <= b + 1e-6; t += step) times.push(+t.toFixed(3));
  await ctx.page.evaluate(() => {
    const d = document.createElement('div');
    d.id = '__label';
    d.style.cssText = 'position:fixed;left:0;top:0;z-index:99999;padding:6px 14px;background:rgba(0,0,0,.72);color:#fff;font:700 44px/1.1 Inter,sans-serif;';
    document.body.appendChild(d);
  });
  let i = 0;
  for (const t of times) {
    await ctx.page.evaluate((tt) => { document.getElementById('__label').textContent = tt.toFixed(2) + 's'; }, t);
    const buf = await grab(ctx, t, { format: 'jpeg', quality: 88, scale });
    await writeFile(path.join(tmp, `f${String(i++).padStart(4, '0')}.jpg`), buf);
  }
  await ctx.browser.close();
  const rows = Math.ceil(times.length / cols);
  const out = path.join(OUT, arg('out', `sheet_${a}-${b}.jpg`));
  await run(FFMPEG, ['-y', '-loglevel', 'error', '-framerate', '1', '-i', path.join(tmp, 'f%04d.jpg'),
    '-vf', `pad=iw+4:ih+4:2:2:color=black,tile=${cols}x${rows}`, '-frames:v', '1', '-q:v', '3', out]);
  await rm(tmp, { recursive: true, force: true });
  console.log(out, `(${times.length} frames, ${cols}x${rows})`);
}

async function modeVideo(port) {
  const probe = await openPage(port, { quiet: true });
  const fps = +arg('fps', probe.info.fps || 60);
  const [ra, rb] = arg('range') ? String(arg('range')).split(':').map(Number) : [0, probe.info.duration];
  await probe.browser.close();
  const f0 = Math.round(ra * fps), f1 = Math.round(rb * fps); // [f0, f1)
  const total = f1 - f0;
  const workers = Math.max(1, Math.min(+arg('workers', Math.max(1, os.cpus().length - 1)), total));
  const crf = String(arg('crf', 17));
  const preset = String(arg('preset', 'medium'));
  const out = path.resolve(ROOT, arg('out', 'out/gtr.mp4'));
  const segDir = path.join(OUT, `.segments_${process.pid}`);
  await mkdir(segDir, { recursive: true });
  console.log(`render ${total} frames @${fps}fps [${ra}s → ${rb}s] with ${workers} workers, crf ${crf}`);

  const per = Math.ceil(total / workers);
  const started = Date.now();
  let done = 0;
  const tick = setInterval(() => {
    const el = (Date.now() - started) / 1000;
    const rate = done / el;
    process.stdout.write(`\r  ${done}/${total} frames · ${rate.toFixed(1)} fps · eta ${rate ? Math.round((total - done) / rate) : '?'}s   `);
  }, 2000);

  const segs = [];
  await Promise.all(Array.from({ length: workers }, async (_, w) => {
    const a = f0 + w * per, b = Math.min(f1, a + per);
    if (a >= b) return;
    const seg = path.join(segDir, `seg${String(w).padStart(2, '0')}.mp4`);
    segs[w] = seg;
    const ctx = await openPage(port, { quiet: true });
    const ff = spawn(FFMPEG, ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
      '-vf', `scale=out_color_matrix=bt709:out_range=tv,format=yuv420p${arg('nograin') ? '' : ',vignette=angle=PI/7:mode=forward,noise=c0s=7:c0f=t'}`,
      '-c:v', 'libx264', '-preset', preset, '-crf', crf, '-tune', 'animation', '-aq-mode', '3',
      '-g', String(fps * 2), '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-color_range', 'tv',
      '-threads', '2', seg], { stdio: ['pipe', 'inherit', 'inherit'] });
    const ffDone = new Promise((res, rej) => ff.on('exit', (c) => (c === 0 ? res() : rej(new Error('ffmpeg seg ' + c)))));
    for (let f = a; f < b; f++) {
      const buf = await grab(ctx, f / fps, { format: 'jpeg', quality: 96 });
      if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
      done++;
    }
    ff.stdin.end();
    await ffDone;
    if (ctx.errors.length) console.log(`\n  worker ${w}: ${ctx.errors.length} console messages, first: ${ctx.errors[0]}`);
    await ctx.browser.close();
  }));
  clearInterval(tick);
  const secs = (Date.now() - started) / 1000;
  console.log(`\n  frames done in ${secs.toFixed(0)}s (${(total / secs).toFixed(1)} fps)`);

  const list = path.join(segDir, 'list.txt');
  await writeFile(list, segs.filter(Boolean).map((s) => `file '${s}'`).join('\n'));
  const silent = path.join(segDir, 'video.mp4');
  await run(FFMPEG, ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', silent]);
  await mkdir(path.dirname(out), { recursive: true });
  const audio = arg('audio');
  if (audio && existsSync(path.resolve(ROOT, audio))) {
    await run(FFMPEG, ['-y', '-loglevel', 'error', '-i', silent, '-ss', String(ra), '-i', path.resolve(ROOT, audio),
      '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '256k', '-ar', '48000', '-shortest', '-movflags', '+faststart', out]);
  } else {
    await run(FFMPEG, ['-y', '-loglevel', 'error', '-i', silent, '-c', 'copy', '-movflags', '+faststart', out]);
  }
  await rm(segDir, { recursive: true, force: true });
  console.log('→', out);
}

/* ---------------- main ---------------- */
const { srv, port } = await serve();
try {
  if (arg('info')) await modeInfo(port);
  else if (arg('stills')) await modeStills(port);
  else if (arg('sheet')) await modeSheet(port);
  else if (arg('video')) await modeVideo(port);
  else console.log('use --info | --stills t1,t2 | --sheet a:b:step | --video');
} finally {
  srv.close();
}
