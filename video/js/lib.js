/* ============================================================
   GTR motion — helper library (window.GTR)
   Everything here is deterministic: no Date.now, no Math.random.
   Scenes must render as a pure function of time so any frame can
   be rendered in any order (parallel render workers seek freely).
   ============================================================ */
(function () {
  const GTR = (window.GTR = window.GTR || {});
  GTR.W = 1920;
  GTR.H = 1080;

  /* ---------------- math ---------------- */
  const clamp = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
  const lerp = (a, b, t) => a + (b - a) * t;
  // raw progress of t through [a,b], clamped 0..1
  const inv = (t, a, b) => (b === a ? (t >= b ? 1 : 0) : clamp((t - a) / (b - a)));
  // eased progress; ease = gsap ease string ("power3.out", "expo.inOut", "back.out(1.7)") or fn
  const easeCache = {};
  const E = (ease) => {
    if (typeof ease === 'function') return ease;
    if (!ease) return (x) => x;
    if (!easeCache[ease]) easeCache[ease] = gsap.parseEase(ease);
    return easeCache[ease];
  };
  const p = (t, a, b, ease = 'power3.out') => E(ease)(inv(t, a, b));
  // map t in [a,b] -> [c,d] with easing
  const map = (t, a, b, c, d, ease = 'power3.out') => lerp(c, d, p(t, a, b, ease));
  // window: 0 -> 1 during [a, a+inD], 1 until b-outD, -> 0 at b
  const win = (t, a, b, inD = 0.4, outD = 0.4, easeIn = 'power3.out', easeOut = 'power3.in') =>
    t < a || t > b ? 0 : Math.min(p(t, a, a + inD, easeIn), 1 - p(t, b - outD, b, easeOut));
  const fract = (x) => x - Math.floor(x);
  const smooth = (x) => x * x * (3 - 2 * x);

  GTR.clamp = clamp;
  GTR.lerp = lerp;
  GTR.inv = inv;
  GTR.E = E;
  GTR.p = p;
  GTR.map = map;
  GTR.win = win;
  GTR.fract = fract;
  GTR.smooth = smooth;

  /* ---------------- deterministic random ---------------- */
  GTR.hash = (str) => {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  };
  // mulberry32 — returns fn() in [0,1)
  GTR.rng = (seed) => {
    let a = (typeof seed === 'string' ? GTR.hash(seed) : seed >>> 0) || 1;
    const f = () => {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    f.range = (lo, hi) => lo + (hi - lo) * f();
    f.int = (lo, hi) => Math.floor(lo + (hi - lo + 1) * f());
    f.pick = (arr) => arr[Math.floor(f() * arr.length)];
    return f;
  };

  // value noise 1D/2D/3D (smooth, deterministic) — good for organic drift
  const perm = new Uint8Array(512);
  (() => {
    const r = GTR.rng(1337);
    const p0 = Array.from({ length: 256 }, (_, i) => i);
    for (let i = 255; i > 0; i--) {
      const j = Math.floor(r() * (i + 1));
      [p0[i], p0[j]] = [p0[j], p0[i]];
    }
    for (let i = 0; i < 512; i++) perm[i] = p0[i & 255];
  })();
  const grad = (h, x, y, z) => {
    const u = h < 8 ? x : y;
    const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  };
  const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10);
  // classic Perlin noise, returns ~[-1,1]
  GTR.noise = (x, y = 0, z = 0) => {
    const X = Math.floor(x) & 255, Y = Math.floor(y) & 255, Z = Math.floor(z) & 255;
    x -= Math.floor(x); y -= Math.floor(y); z -= Math.floor(z);
    const u = fade(x), v = fade(y), w = fade(z);
    const A = perm[X] + Y, AA = perm[A] + Z, AB = perm[A + 1] + Z;
    const B = perm[X + 1] + Y, BA = perm[B] + Z, BB = perm[B + 1] + Z;
    return lerp(
      lerp(lerp(grad(perm[AA] & 15, x, y, z), grad(perm[BA] & 15, x - 1, y, z), u),
           lerp(grad(perm[AB] & 15, x, y - 1, z), grad(perm[BB] & 15, x - 1, y - 1, z), u), v),
      lerp(lerp(grad(perm[AA + 1] & 15, x, y, z - 1), grad(perm[BA + 1] & 15, x - 1, y, z - 1), u),
           lerp(grad(perm[AB + 1] & 15, x, y - 1, z - 1), grad(perm[BB + 1] & 15, x - 1, y - 1, z - 1), u), v),
      w);
  };

  /* ---------------- DOM builders ---------------- */
  // h('div', {class:'x', style:{left:'10px'}}, parent, 'inner html')
  GTR.h = (tag, attrs = {}, parent = null, html = null) => {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v == null) continue;
      if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
      else if (k === 'class') el.className = v;
      else if (k === 'text') el.textContent = v;
      else el.setAttribute(k, v);
    }
    if (html != null) el.innerHTML = html;
    if (parent) parent.appendChild(el);
    return el;
  };
  const SVGNS = 'http://www.w3.org/2000/svg';
  GTR.s = (tag, attrs = {}, parent = null) => {
    const el = document.createElementNS(SVGNS, tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v == null) continue;
      if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
      else if (k === 'text') el.textContent = v;
      else el.setAttribute(k, v);
    }
    if (parent) parent.appendChild(el);
    return el;
  };
  GTR.css = (el, styles) => {
    for (const k in styles) el.style[k] = styles[k];
    return el;
  };

  /* ---------------- icons (lucide subset in js/icons.js) ---------------- */
  // returns an SVG string; name = kebab-case lucide name (e.g. 'message-circle')
  GTR.iconSVG = (name, { size = 24, color = 'currentColor', sw = 2, cls = '' } = {}) => {
    const inner = (window.GTR_ICONS || {})[name];
    if (!inner) {
      console.warn('[GTR] missing icon', name);
      return `<svg class="gt-icon ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24"></svg>`;
    }
    return `<svg class="gt-icon ${cls}" xmlns="${SVGNS}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
  };
  GTR.icon = (name, opts = {}, parent = null) => {
    const wrap = document.createElement('span');
    wrap.innerHTML = GTR.iconSVG(name, opts);
    const svg = wrap.firstChild;
    if (parent) parent.appendChild(svg);
    return svg;
  };

  /* ---------------- text ---------------- */
  // splits el's text into spans. mode: 'chars' | 'words'. Returns array of spans.
  // Keeps words together (no mid-word wrapping) when splitting chars.
  GTR.split = (el, mode = 'chars') => {
    const text = el.textContent;
    el.textContent = '';
    const units = [];
    const words = text.split(/(\s+)/);
    for (const w of words) {
      if (!w) continue;
      if (/^\s+$/.test(w)) {
        el.appendChild(document.createTextNode(' '));
        continue;
      }
      if (mode === 'words') {
        const s = GTR.h('span', { class: 'split-unit' }, el);
        s.textContent = w;
        units.push(s);
      } else {
        const wordWrap = GTR.h('span', { style: { display: 'inline-block', whiteSpace: 'nowrap' } }, el);
        for (const ch of Array.from(w)) {
          const s = GTR.h('span', { class: 'split-unit' }, wordWrap);
          s.textContent = ch;
          units.push(s);
        }
      }
    }
    return units;
  };

  /* ---------------- number formatting (pt-BR) ---------------- */
  GTR.fmt = {
    int: (n) => Math.round(n).toLocaleString('pt-BR'),
    dec: (n, d = 1) => n.toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d }),
    brl: (n, d = 0) => 'R$ ' + n.toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d }),
    pct: (n, d = 0) => n.toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d }) + '%',
    x: (n, d = 1) => n.toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d }) + 'x',
    time: (sec) => {
      const m = Math.floor(sec / 60), s = Math.floor(sec % 60);
      return `${m}:${String(s).padStart(2, '0')}`;
    },
  };

  /* ---------------- brand logo ----------------
     The GT mark from images/GT_logo_logo_horizontal_cinzaverde.svg
     (viewBox 0 0 720 400; the mark lives in y 30..273, x 6..678).
     Returns {svg, parts:{g1,g2,arrow,t,stem,dot}, text} so scenes can
     animate each piece. opts: {gray, green, withText, width}           */
  GTR.LOGO_PATHS = {
    g1: 'M168.65,123.19H30.32v-20.43C30.57,60.47,63.7,30,107.68,30h221.5l-33.95,33.95l-102.07-0.01c-13.34-0.08-24.22,10.67-24.3,24.01L168.65,123.19z',
    g2: 'M417.13,103.48l-0.01,103.57l-43.4,43.42v-62.59l-67.54,66.35c-12.53,12.38-29.14,19.15-46.76,19.04l-153.17,0c-42.31-0.25-76.2-35.41-75.94-77.72l0-43.84h138.46v24.8c0,14.4,10.22,24.28,23.56,24.36l74.46,0.44c5.44,0.03,10.55-2.06,14.41-5.88l55.53-55.15h-72.26l36.8-36.8H417.13z',
    arrow: 'M340.82,63.94 L374.77,30 L497.04,30 L497.04,127.13 L448.82,175.35 L448.82,63.94z',
    t: 'M678.27,63.94V30H523.78v243.12l56.02,0.33c18.82,0.11,35.57-15.12,35.68-33.94V63.94H678.27z',
    stem: 'M497.04,171.15 L448.82,219.37 L448.82,273.27 L497.04,273.27z',
  };
  GTR.logo = (opts = {}) => {
    const gray = opts.gray || '#9CA3AF';
    const green = opts.green || '#33cc99';
    const withText = opts.withText !== false;
    const vb = withText ? '0 0 720 400' : '0 20 710 265';
    const svg = GTR.s('svg', { viewBox: vb, xmlns: SVGNS, class: 'gt-logo', overflow: 'visible' });
    if (opts.width) svg.setAttribute('width', opts.width);
    const g = GTR.s('g', {}, svg);
    const parts = {};
    for (const [k, d] of Object.entries(GTR.LOGO_PATHS)) {
      const isGreen = k === 'arrow' || k === 'stem';
      parts[k] = GTR.s('path', { d, fill: isGreen ? green : gray, 'data-part': k }, g);
    }
    parts.dot = GTR.s('circle', { cx: 656.12, cy: 253.27, r: 21.07, fill: green, 'data-part': 'dot' }, g);
    let text = null;
    if (withText) {
      text = GTR.s('text', {
        x: 36.5, y: 370.63,
        fill: gray,
        style: { fontFamily: "'Russo One', sans-serif", fontSize: '52.6px', letterSpacing: '21px' },
        text: opts.text || 'GROWTH TIME',
      }, g);
    }
    return { svg, g, parts, text };
  };

  /* ---------------- reusable visual bits ---------------- */
  // radial glow blob element (cheap: plain radial-gradient, no filter)
  GTR.glow = (parent, { x = 960, y = 540, r = 400, color = '21,219,168', a = 0.35 } = {}) =>
    GTR.h('div', {
      style: {
        position: 'absolute', left: `${x - r}px`, top: `${y - r}px`, width: `${r * 2}px`, height: `${r * 2}px`,
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(${color},${a}) 0%, rgba(${color},${a * 0.45}) 35%, rgba(${color},0) 70%)`,
        pointerEvents: 'none',
      },
    }, parent);

  // full-size canvas helper — returns {canvas, ctx}
  GTR.canvas = (parent, { w = 1920, h = 1080, z = 0, style = {} } = {}) => {
    const c = GTR.h('canvas', { width: w, height: h, style: Object.assign({ position: 'absolute', left: '0', top: '0', width: `${w}px`, height: `${h}px`, zIndex: z }, style) }, parent);
    return { canvas: c, ctx: c.getContext('2d') };
  };

  // images: resolves when decoded (engine awaits GTR.pending before first seek)
  GTR.pending = [];
  GTR.img = (src, attrs = {}, parent = null) => {
    const im = GTR.h('img', Object.assign({ src, draggable: 'false' }, attrs), parent);
    GTR.pending.push(im.decode().catch(() => console.warn('[GTR] image failed', src)));
    return im;
  };
})();
