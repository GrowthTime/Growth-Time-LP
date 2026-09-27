/* ============================================================
   S13 · sob-o-capo · start 72 · dur 8 · z 27   [72–80] · TECH POWER
   "Tecnologia que não dorme." — a network sphere where every node is one
   of the 124 real cloud functions, plus four hero stats (true numbers from
   the code), each alone on screen ≥ 1.4 s, rolled in like an odometer.
     0.00–0.40  teal scan line sweeps down and reveals the stage
     0.40–1.40  124 nodes fly into a Fibonacci sphere (micro-flash on landing)
     0.5 / 2.0 / 3.5 / 5.0   stat slot-rolls (sphere pulses on each)
     6.40–7.40  2×2 recap · 7.40–8.00 collapse → one teal point at (960, 540)
   Hand-off in : dark stage (grid fades in via space), scan line at y 0.
   Hand-off out: dark stage + single bright teal point r 6 with glow at (960, 540).
   tl → headline / chips / caption / recap reveals only. Canvas, stats
   (odometer digits, sheen, blur), scan and drift are pure fns in update().
   ============================================================ */
GTR.scene({
  id: 'sob-o-capo',
  build(root, ctx) {
    const { h, p, clamp, lerp, inv, noise, rng } = GTR;
    const E = GTR.E;
    const tl = ctx.tl();

    /* ---------- tiny cached setters (skip redundant DOM writes) ---------- */
    const st = (el, k, v) => { const c = el.__c || (el.__c = {}); if (c[k] !== v) { c[k] = v; el.style[k] = v; } };
    const layer = (z, extra = {}) => h('div', { style: Object.assign({ position: 'absolute', left: '0', top: '0', width: '1920px', height: '1080px', zIndex: z, pointerEvents: 'none' }, extra) }, root);

    /* ---------- timing (local s) ---------- */
    const SCAN = [0.0, 0.40];
    const HEAD_IN = 0.30, HEAD_OUT = 7.30;
    const FLY0 = 0.40, FLY_SPAN = 0.40, FLY_DUR = 0.60;          // last node lands at 1.40
    const TS = [0.5, 2.0, 3.5, 5.0];                              // stat slot-rolls
    const STAT4_OUT = 6.40;
    const CAPTION = 2.20, CHIP1 = 2.50, CHIP2 = 4.00;
    const RECAP = 6.40, FADE = 7.40;
    const COLL0 = 7.40, TRAVEL = [7.60, 7.95];

    /* ---------- geometry ---------- */
    const SPH = { x: 1360, y: 520 };
    const N = 124, F = 900, TILT = (18 * Math.PI) / 180;
    const RS = 360;                                   // on-screen silhouette radius
    const R = (RS / Math.sqrt(1 + (RS / F) ** 2));    // 3D radius that projects to RS with f 900 (≈334)
    const END = { x: 960, y: 540 };

    /* =====================================================================
       LAYERS: sphere (glow + canvas) < HUD < scan
       ===================================================================== */
    const sphL = layer(2);
    const halo = GTR.glow(sphL, { x: SPH.x, y: SPH.y, r: 620, color: '21,219,168', a: 0.2 });
    halo.style.opacity = 0;
    const { ctx: g } = GTR.canvas(sphL);
    const hud = layer(10);
    const scanL = layer(30);

    // additive glow sprite
    const sprite = document.createElement('canvas');
    sprite.width = sprite.height = 128;
    {
      const sg = sprite.getContext('2d');
      const gr = sg.createRadialGradient(64, 64, 0, 64, 64, 64);
      gr.addColorStop(0, 'rgba(150,255,225,1)');
      gr.addColorStop(0.16, 'rgba(21,219,168,0.6)');
      gr.addColorStop(0.45, 'rgba(21,219,168,0.14)');
      gr.addColorStop(1, 'rgba(21,219,168,0)');
      sg.fillStyle = gr;
      sg.fillRect(0, 0, 128, 128);
    }
    const blob = (x, y, size, a) => {
      if (a <= 0.003 || size <= 0.5) return;
      g.globalAlpha = Math.min(1, a);
      g.drawImage(sprite, x - size / 2, y - size / 2, size, size);
    };

    /* ---------- sphere data: 124 nodes on a Fibonacci sphere ---------- */
    const rr = rng('sob-o-capo:nodes');
    const GA = Math.PI * (3 - Math.sqrt(5));
    const nodes = [];
    for (let i = 0; i < N; i++) {
      const yy = 1 - ((i + 0.5) / N) * 2, rad = Math.sqrt(1 - yy * yy), phi = i * GA;
      // fly-in origin (view space, relative to the sphere centre): scattered around, biased right/behind
      const uz = rr() * 2 - 1, ua = rr() * Math.PI * 2, ur = Math.sqrt(1 - uz * uz);
      const dist = R * (1.8 + rr() * 1.7);
      const s0 = [Math.cos(ua) * ur * dist + 180, Math.sin(ua) * ur * dist * 0.75, clamp(uz * dist, -430, 2600)];
      const t0 = FLY0 + (i / (N - 1)) * FLY_SPAN;
      nodes.push({
        i, p: [Math.cos(phi) * rad * R, -yy * R, Math.sin(phi) * rad * R], s0, t0,
        land: t0 + 0.42, cd: rr() * 0.07, tw: rr() * 6.283,
        roll: 2.05 + (i / (N - 1)) * 0.55, // "124" roll-call: nodes light up one by one
      });
    }
    // edges to the 3 nearest neighbours (deduped) + adjacency for packets
    const edges = [];
    const adj = nodes.map(() => []);
    {
      const seen = new Set();
      for (const a of nodes) {
        const d = nodes.filter((b) => b !== a).map((b) => [b.i, (a.p[0] - b.p[0]) ** 2 + (a.p[1] - b.p[1]) ** 2 + (a.p[2] - b.p[2]) ** 2]);
        d.sort((u, v) => u[1] - v[1]);
        for (let k = 0; k < 3; k++) {
          const j = d[k][0], key = a.i < j ? `${a.i}-${j}` : `${j}-${a.i}`;
          if (seen.has(key)) continue;
          seen.add(key);
          edges.push([Math.min(a.i, j), Math.max(a.i, j)]);
          adj[a.i].push(j);
          adj[j].push(a.i);
        }
      }
    }
    // 24 packets: deterministic random walks on the edge graph
    const pr = rng('sob-o-capo:packets');
    const packets = Array.from({ length: 24 }, () => {
      let cur = Math.floor(pr() * N), prev = -1;
      const path = [cur];
      for (let k = 0; k < 40; k++) {
        const opts = adj[cur].filter((j) => j !== prev);
        const nx = opts.length ? opts[Math.floor(pr() * opts.length)] : adj[cur][0];
        prev = cur; cur = nx; path.push(cur);
      }
      return { path, speed: 1.7 + pr() * 1.6, ph: pr() * 3, t0: 1.25 + pr() * 0.5 };
    });

    /* ---------- projection ---------- */
    const COS_T = Math.cos(TILT), SIN_T = Math.sin(TILT);
    const angY = (t) => ((12 * t + 48 * p(t, 0.3, 2.6, 'power2.out')) * Math.PI) / 180;
    const center = (t) => ({
      x: SPH.x + noise(t * 0.22, 3.3) * 8,
      y: SPH.y + noise(t * 0.2, 7.1) * 8,
      z: lerp(0.965, 1.0, E('sine.inOut')(clamp(t / 7.4))), // slow push-in
    });
    const rotV = (v, ca, sa) => {
      const x1 = v[0] * ca + v[2] * sa, z1 = -v[0] * sa + v[2] * ca;
      return [x1, v[1] * COS_T - z1 * SIN_T, v[1] * SIN_T + z1 * COS_T];
    };
    const proj = (v, c) => {
      const k = F / (F + Math.max(-F * 0.62, v[2]));
      return [c.x + v[0] * k * c.z, c.y + v[1] * k * c.z, k, clamp((R - v[2]) / (2 * R))];
    };

    /* =====================================================================
       HUD · headline
       ===================================================================== */
    const headWrap = h('div', { style: { position: 'absolute', left: '0', top: '0', width: '1920px', height: '1080px' } }, hud);
    const head = KIT.headline(headWrap, 'Tecnologia que\nnão *dorme*.', { size: 84, x: 120, y: 220, w: 1100, align: 'left', glow: true });
    KIT.revealWords(tl, head.units, HEAD_IN, { y: 60, blur: 12, dur: 0.7, stagger: 0.07 });
    KIT.hideUnits(tl, head.units, HEAD_OUT, { y: -40, dur: 0.3, stagger: 0.03 });

    /* =====================================================================
       HUD · hero stats (odometer digits, gradient text, sheen)
       ===================================================================== */
    const STATS = [
      { num: '+260 mil', label: 'linhas de código próprio' },
      { num: '124', label: 'funções rodando na nuvem' },
      { num: '361', label: 'evoluções do banco em 10 meses' },
      { num: '129', label: 'tabelas com isolamento por empresa' },
    ];
    const NUM_FS = 170, LH = 220, NUM_CY = 560, LABEL_CY = 690;
    const mc = document.createElement('canvas').getContext('2d');
    const BASE_GRAD = 'linear-gradient(172deg, #15dba8 0%, #1ccfa2 48%, #27ae8f 100%)';
    const SHEEN_W = 420;
    const SHEEN_GRAD = 'linear-gradient(104deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 38%, rgba(225,255,246,.95) 50%, rgba(255,255,255,0) 62%, rgba(255,255,255,0) 100%)';
    const statsWrap = h('div', { style: { position: 'absolute', left: '0', top: '0', width: '1920px', height: '1080px' } }, hud);

    const makeStat = (def, k) => {
      mc.font = `${NUM_FS}px "Russo One"`;
      const ls = -0.01 * NUM_FS;
      const digitW = Math.ceil(Math.max(...'0123456789'.split('').map((d) => mc.measureText(d).width)));
      // tokens: digits roll (column = the final digit's own advance, so spacing is natural), the rest is static
      const toks = [];
      let x = 0;
      for (const ch of def.num) {
        const w = Math.ceil(mc.measureText(ch).width) + ls;
        toks.push({ ch, isD: /[0-9]/.test(ch), x, w });
        x += w;
      }
      const totalW = x;
      const wrap = h('div', { style: { position: 'absolute', left: '114px', top: `${NUM_CY - LH / 2}px`, width: `${totalW + 40}px`, height: `${LH}px`, display: 'none' } }, statsWrap);
      const row = h('div', { style: { position: 'absolute', left: '0', top: '0', height: `${LH}px`, width: `${totalW}px` } }, wrap);
      const glyphs = [];
      const gspan = (parent, ch, x0, w) => {
        const sp = h('span', { class: 'display', style: {
          display: 'block', width: `${w}px`, height: `${LH}px`, lineHeight: `${LH}px`, fontSize: `${NUM_FS}px`, letterSpacing: '0', textAlign: 'center',
          color: 'transparent', backgroundImage: `${SHEEN_GRAD}, ${BASE_GRAD}`, backgroundRepeat: 'no-repeat',
          backgroundSize: `${SHEEN_W}px ${LH}px, ${totalW}px ${LH}px`, backgroundPosition: `${-SHEEN_W - x0}px 0, ${-x0}px 0`,
          webkitBackgroundClip: 'text', backgroundClip: 'text', whiteSpace: 'pre',
        } }, parent);
        sp.textContent = ch;
        glyphs.push({ sp, x0 });
        return sp;
      };
      const cols = [];
      const digits = toks.filter((q) => q.isD);
      const PADX = 30;
      const MASK = 'linear-gradient(180deg, transparent 0%, #000 22%, #000 78%, transparent 100%)';
      for (const q of toks) {
        if (!q.isD) {
          const box = h('div', { style: { position: 'absolute', left: `${q.x}px`, top: '0', width: `${q.w}px`, height: `${LH}px` } }, row);
          gspan(box, q.ch, q.x, q.w);
          continue;
        }
        const box = h('div', { style: { position: 'absolute', left: `${q.x - PADX}px`, top: '0', width: `${q.w + 2 * PADX}px`, height: `${LH}px`,
          overflow: 'hidden', webkitMaskImage: MASK, maskImage: MASK } }, row);
        const j = digits.indexOf(q);
        const n = 6 + j * 3;
        const fin = +q.ch;
        const off = (q.w - digitW) / 2;
        const strip = h('div', { style: { position: 'absolute', left: `${PADX + off}px`, top: '0', width: `${digitW}px` } }, box);
        for (let s2 = 0; s2 <= n; s2++) gspan(strip, String((fin - n + s2 + 100) % 10), q.x + off, digitW);
        const land = TS[k] + 0.22 + (digits.length > 1 ? (0.13 * j) / (digits.length - 1) : 0.13);
        cols.push({ strip, n, land });
      }
      const label = h('div', { class: 'body', style: {
        position: 'absolute', left: '120px', top: `${LABEL_CY}px`, transform: 'translateY(-50%)', display: 'none', alignItems: 'center', gap: '18px',
        fontSize: '30px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,.8)', whiteSpace: 'nowrap',
      } }, statsWrap);
      const bar = h('span', { style: { display: 'inline-block', width: '40px', height: '3px', borderRadius: '2px', background: '#15dba8', boxShadow: '0 0 12px rgba(21,219,168,.7)', transformOrigin: '0% 50%', flex: 'none' } }, label);
      const lt = h('span', {}, label);
      lt.textContent = def.label;
      const T = TS[k];
      const out = k < 3 ? [TS[k + 1] - 0.1, TS[k + 1] + 0.08] : [STAT4_OUT - 0.05, STAT4_OUT + 0.12];
      return { wrap, row, label, bar, lt, cols, glyphs, totalW, T, out };
    };
    const stats = STATS.map(makeStat);

    const setStat = (S, t) => {
      const vis = t >= S.T && t <= S.out[1];
      st(S.wrap, 'display', vis ? 'block' : 'none');
      st(S.label, 'display', vis ? 'flex' : 'none');
      if (!vis) return;
      const ein = p(t, S.T, S.T + 0.2, 'power3.out');
      const eout = p(t, S.out[0], S.out[1], 'power2.in');
      const y = 60 * (1 - ein) - 60 * eout;
      const bl = 8 * (1 - ein) + 8 * eout;
      const op = inv(t, S.T, S.T + 0.12) * (1 - eout);
      st(S.wrap, 'transform', `translateY(${y.toFixed(2)}px)`);
      st(S.wrap, 'opacity', op.toFixed(3));
      st(S.wrap, 'filter', `blur(${bl.toFixed(2)}px) drop-shadow(0 0 26px rgba(21,219,168,${(0.34 + 0.25 * Math.exp(-Math.max(0, t - S.T - 0.35) * 4)).toFixed(3)}))`);
      // odometer columns
      for (const c of S.cols) {
        const q = p(t, S.T, c.land, 'expo.out');
        const q2 = p(t + 1 / 60, S.T, c.land, 'expo.out');
        const speed = (q2 - q) * c.n * 60; // digits per second
        st(c.strip, 'transform', `translateY(${(-q * c.n * LH).toFixed(2)}px)`);
        st(c.strip, 'filter', speed > 2 ? `blur(${Math.min(7, speed * 0.18).toFixed(2)}px)` : 'none');
      }
      // sheen sweep after landing
      const sh = p(t, S.T + 0.32, S.T + 1.0, 'power2.inOut');
      const sx = lerp(-SHEEN_W, S.totalW + 40, sh);
      for (const gl of S.glyphs) st(gl.sp, 'backgroundPosition', `${(sx - gl.x0).toFixed(1)}px 0, ${-gl.x0}px 0`);
      // label
      const lin = p(t, S.T + 0.06, S.T + 0.36, 'power3.out');
      const ly = 24 * (1 - lin) - 40 * eout;
      st(S.label, 'transform', `translateY(calc(-50% + ${ly.toFixed(2)}px))`);
      st(S.label, 'opacity', (inv(t, S.T + 0.06, S.T + 0.2) * (1 - eout)).toFixed(3));
      st(S.label, 'filter', `blur(${(6 * (1 - lin) + 6 * eout).toFixed(2)}px)`);
      st(S.bar, 'transform', `scaleX(${p(t, S.T + 0.1, S.T + 0.5, 'expo.out').toFixed(3)})`);
    };

    // progress segments (which of the 4 stats is up) — above the number
    const SEG = { x: 120, y: 446, w: 44, gap: 10 };
    const segWrap = h('div', { style: { position: 'absolute', left: `${SEG.x}px`, top: `${SEG.y}px`, display: 'flex', gap: `${SEG.gap}px`, opacity: 0 } }, statsWrap);
    const segs = TS.map(() => {
      const tr = h('div', { style: { position: 'relative', width: `${SEG.w}px`, height: '3px', borderRadius: '2px', background: 'rgba(255,255,255,.16)', overflow: 'hidden' } }, segWrap);
      const fi = h('div', { style: { position: 'absolute', left: '0', top: '0', bottom: '0', width: '100%', background: '#15dba8', transformOrigin: '0% 50%', transform: 'scaleX(0)', boxShadow: '0 0 8px rgba(21,219,168,.8)' } }, tr);
      return fi;
    });

    /* =====================================================================
       HUD · chips, caption
       ===================================================================== */
    const chipAt = (x, text, icon) => {
      const w = h('div', { style: { position: 'absolute', left: `${x}px`, top: '860px', transform: 'translateY(-50%)' } }, hud);
      const pill = KIT.pill(w, { text, icon, size: 18, pad: '11px 20px 11px 16px', bg: 'linear-gradient(rgba(21,219,168,.12),rgba(21,219,168,.12)), rgba(0,21,22,.55)' });
      pill.style.boxShadow = '0 10px 30px rgba(0,0,0,.35), 0 0 22px rgba(21,219,168,.12)';
      pill.style.transformOrigin = '0% 50%';
      pill.style.position = 'relative';
      pill.style.overflow = 'hidden';
      const sheen = h('div', { style: { position: 'absolute', top: '-4px', bottom: '-4px', left: '0', width: '56px', pointerEvents: 'none',
        background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(200,255,238,.38), rgba(255,255,255,0))', transform: 'translateX(-90px) skewX(-20deg)' } }, pill);
      pill.__sheen = sheen;
      pill.__w = pill.offsetWidth;
      return pill;
    };
    const chipA = chipAt(120, 'Criptografia AES-256', 'lock');
    const chipB = chipAt(470, '26+ rotinas automáticas 24/7', 'timer');
    const chipPop = (el, at) => tl.fromTo(el, { opacity: 0, scale: 0.7, y: 18 }, { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'back.out(1.6)' }, at);
    chipPop(chipA, CHIP1);
    chipPop(chipB, CHIP2);

    const cap = h('div', { class: 'ui', style: { position: 'absolute', left: `${SPH.x}px`, top: '940px', transform: 'translate(-50%,-50%)', whiteSpace: 'nowrap' } }, hud);
    const capIn = h('div', { style: { display: 'flex', alignItems: 'center', gap: '12px', fontSize: '18px', fontWeight: 500, color: '#9ca3af', letterSpacing: '0.01em' } }, cap);
    const capDot = h('span', { style: { width: '8px', height: '8px', borderRadius: '50%', background: '#15dba8', boxShadow: '0 0 10px #15dba8', flex: 'none' } }, capIn);
    h('span', {}, capIn).textContent = 'Cada ponto: uma função rodando na nuvem.';
    tl.fromTo(capIn, { opacity: 0, y: 14, filter: 'blur(6px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6, ease: 'power3.out' }, CAPTION);

    /* =====================================================================
       HUD · recap 2×2 (6.40–7.40)
       ===================================================================== */
    const RC = { x0: 120, x1: 530, y0: 470, y1: 632 };
    const recap = h('div', { style: { position: 'absolute', left: '0', top: '0', width: '1920px', height: '1080px' } }, hud);
    const hair = (style) => h('div', { style: Object.assign({ position: 'absolute', background: 'linear-gradient(90deg, rgba(21,219,168,.5), rgba(255,255,255,.12))' }, style) }, recap);
    const hLine = hair({ left: `${RC.x0}px`, top: '614px', width: '780px', height: '1px', transformOrigin: '0% 50%' });
    const vLine = hair({ left: '500px', top: '478px', width: '1px', height: '276px', transformOrigin: '50% 0%', background: 'linear-gradient(180deg, rgba(21,219,168,.5), rgba(255,255,255,.1))' });
    const cells = STATS.map((d, k) => {
      const x = k % 2 ? RC.x1 : RC.x0, y = k < 2 ? RC.y0 : RC.y1;
      const c = h('div', { style: { position: 'absolute', left: `${x}px`, top: `${y}px`, transformOrigin: '0% 50%' } }, recap);
      const n = h('div', { class: 'display', style: {
        fontSize: '64px', lineHeight: '76px', letterSpacing: '-0.01em', whiteSpace: 'nowrap', color: 'transparent',
        backgroundImage: BASE_GRAD, webkitBackgroundClip: 'text', backgroundClip: 'text', filter: 'drop-shadow(0 0 16px rgba(21,219,168,.3))',
      } }, c);
      n.textContent = d.num;
      const l = h('div', { class: 'ui', style: { marginTop: '6px', fontSize: '18px', fontWeight: 600, color: 'rgba(255,255,255,.72)', whiteSpace: 'nowrap' } }, c);
      l.textContent = d.label;
      return c;
    });
    tl.fromTo(hLine, { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 0.5, ease: 'expo.out' }, RECAP + 0.02);
    tl.fromTo(vLine, { scaleY: 0, opacity: 0 }, { scaleY: 1, opacity: 1, duration: 0.5, ease: 'expo.out' }, RECAP + 0.08);
    tl.fromTo(cells, { opacity: 0, scale: 0.86, y: 22 }, { opacity: 1, scale: 1, y: 0, duration: 0.45, stagger: 0.06, ease: 'back.out(1.6)' }, RECAP + 0.06);
    tl.fromTo(cells, { filter: 'blur(6px)' }, { filter: 'blur(0px)', duration: 0.3, stagger: 0.06, ease: 'power2.out' }, RECAP + 0.06);

    /* ---------- 7.40–7.70: every text fades (stagger .03) ---------- */
    const fadeOut = (els, at) => tl.to(els, { opacity: 0, y: -16, filter: 'blur(6px)', duration: 0.2, stagger: 0.03, ease: 'power2.in' }, at);
    tl.to([hLine, vLine], { opacity: 0, duration: 0.2, ease: 'power2.in' }, FADE);
    fadeOut(cells, FADE);
    fadeOut([chipA, chipB], FADE + 0.06);
    fadeOut([capIn], FADE + 0.12);

    /* =====================================================================
       SCAN (0–0.40): teal line sweeps down, the veil below it is the unrevealed stage
       ===================================================================== */
    const veil = h('div', { style: { position: 'absolute', left: '0', top: '0', width: '1920px', height: '1180px',
      background: 'linear-gradient(180deg, rgba(0,12,13,0) 0px, rgba(0,12,13,.82) 70px, rgba(0,12,13,.82) 100%)' } }, scanL);
    const band = h('div', { style: { position: 'absolute', left: '0', top: '0', width: '1920px', height: '240px',
      background: 'linear-gradient(0deg, rgba(21,219,168,.26), rgba(21,219,168,.06) 45%, rgba(21,219,168,0))' } }, scanL);
    const bandDots = h('div', { style: { position: 'absolute', inset: '0',
      backgroundImage: 'radial-gradient(rgba(120,255,215,.55) 1.3px, transparent 1.6px)', backgroundSize: '24px 24px',
      webkitMaskImage: 'linear-gradient(0deg, #000 0%, rgba(0,0,0,.35) 40%, transparent 100%)', maskImage: 'linear-gradient(0deg, #000 0%, rgba(0,0,0,.35) 40%, transparent 100%)' } }, band);
    const line = h('div', { style: { position: 'absolute', left: '0', top: '0', width: '1920px', height: '3px', background: '#b9fbe6',
      boxShadow: '0 0 6px 1px #15dba8, 0 0 22px 5px rgba(21,219,168,.75), 0 0 60px 12px rgba(21,219,168,.35)' } }, scanL);

    /* =====================================================================
       SFX
       ===================================================================== */
    ctx.cue('whoosh', 0.00, { dur: 0.4 });
    ctx.cue('glitch', 0.00, { dur: 0.1, db: -12 });
    ctx.cue('type', 0.40, { dur: 1.0, rate: 24, db: -12 });
    ctx.cue('impact', 0.50, { size: 0.5 });
    ctx.cue('blip', 0.50, { freq: 1400 });
    [1.9, 3.4, 4.9].forEach((tt) => ctx.cue('glitch', tt, { dur: 0.08, db: -10 }));
    [2.0, 3.5, 5.0].forEach((tt) => ctx.cue('impact', tt, { size: 0.5, db: -4 }));
    [[2.05, 1600], [3.55, 1800], [5.05, 2000]].forEach(([tt, f]) => ctx.cue('blip', tt, { freq: f }));
    ctx.cue('pop', CHIP1, { db: -6 });
    ctx.cue('pop', CHIP2, { db: -6 });
    ctx.cue('swoosh', RECAP);
    ctx.cue('whoosh', FADE, { dur: 0.6, up: false });
    ctx.cue('ping', TRAVEL[1], { freq: 1318.5 });

    /* =====================================================================
       CANVAS DRAW
       ===================================================================== */
    const scr = nodes.map(() => [0, 0, 1, 0.5, 0]); // x, y, k, front, alpha
    const pulseAt = (t, skipRoll = false) => {
      let v = 0;
      for (const T of TS) if (t >= T && !(skipRoll && T === 2.0)) v = Math.max(v, Math.exp(-(t - T) * 4.2));
      return v;
    };
    const pointPos = (t) => {
      const c0 = center(TRAVEL[0]);
      const k = p(t, TRAVEL[0], TRAVEL[1], 'expo.in');
      return [lerp(c0.x, END.x, k), lerp(c0.y, END.y, k)];
    };

    const draw = (t) => {
      g.setTransform(1, 0, 0, 1, 0, 0);
      g.globalAlpha = 1;
      g.globalCompositeOperation = 'source-over';
      g.clearRect(0, 0, 1920, 1080);
      const c = center(Math.min(t, TRAVEL[0]));
      const ay = angY(t), ca = Math.cos(ay), sa = Math.sin(ay);
      const pulse = pulseAt(t);
      const pulseN = pulseAt(t, true);
      const structA = p(t, 0.9, 1.8, 'power2.out') * (1 - p(t, COLL0, COLL0 + 0.14, 'power2.in'));

      // ---- node positions ----
      for (const n of nodes) {
        const o = scr[n.i];
        if (t < n.t0) { o[4] = 0; continue; }
        const tgt = rotV(n.p, ca, sa);
        const q = p(t, n.t0, n.t0 + FLY_DUR, 'power3.out');
        let v = [lerp(n.s0[0], tgt[0], q), lerp(n.s0[1], tgt[1], q), lerp(n.s0[2], tgt[2], q)];
        if (t >= COLL0) {
          const cq = p(t, COLL0 + n.cd, COLL0 + n.cd + 0.15, 'power3.in');
          v = [v[0] * (1 - cq), v[1] * (1 - cq), v[2] * (1 - cq)];
        }
        const pp = proj(v, c);
        o[0] = pp[0]; o[1] = pp[1]; o[2] = pp[2]; o[3] = pp[3];
        o[4] = inv(t, n.t0, n.t0 + 0.12) * (1 - inv(t, COLL0 + 0.1, COLL0 + 0.24));
      }

      // ---- volume: faint glass disc + silhouette ----
      const Rp = RS * c.z; // projected silhouette radius
      if (structA > 0.003) {
        const gr = g.createRadialGradient(c.x - Rp * 0.3, c.y - Rp * 0.35, 0, c.x, c.y, Rp);
        gr.addColorStop(0, `rgba(21,219,168,${0.07 * structA})`);
        gr.addColorStop(0.7, `rgba(21,219,168,${0.025 * structA})`);
        gr.addColorStop(1, `rgba(21,219,168,${0.09 * structA})`);
        g.fillStyle = gr;
        g.beginPath(); g.arc(c.x, c.y, Rp, 0, Math.PI * 2); g.fill();
        g.strokeStyle = `rgba(120,255,215,${0.12 * structA})`;
        g.lineWidth = 1.2;
        g.stroke();
      }

      // ---- edges ----
      if (structA > 0.003) {
        g.lineWidth = 1;
        for (const [a, b] of edges) {
          const A = scr[a], B = scr[b];
          if (A[4] <= 0 || B[4] <= 0) continue;
          const na = nodes[a], nb = nodes[b];
          const vis = Math.min(inv(t, na.land, na.land + 0.35), inv(t, nb.land, nb.land + 0.35));
          const fr = (A[3] + B[3]) / 2;
          const al = (0.05 + 0.17 * fr) * vis * structA * (1 + pulse * 1.2);
          if (al <= 0.003) continue;
          g.strokeStyle = `rgba(21,219,168,${al.toFixed(3)})`;
          g.beginPath(); g.moveTo(A[0], A[1]); g.lineTo(B[0], B[1]); g.stroke();
        }
      }

      // ---- nodes ----
      g.globalCompositeOperation = 'lighter';
      for (const n of nodes) {
        const o = scr[n.i];
        if (o[4] <= 0.003) continue;
        const fl = t >= n.land ? Math.exp(-(t - n.land) * 13) : 0;
        const rc = t >= n.roll ? Math.exp(-(t - n.roll) * 6) : 0;
        const tw = 0.85 + 0.15 * Math.sin(t * 3 + n.tw);
        const boost = Math.max(fl, rc, pulseN * 0.75);
        const wait = t >= 2.0 && t < n.roll ? 1 - 0.55 * p(t, 2.0, 2.12, 'power2.out') : 1;
        const r = clamp(3 * o[2], 2.5, 11) * (1 + 0.35 * rc);
        const a = o[4] * (0.3 + 0.7 * o[3]) * tw * wait;
        blob(o[0], o[1], r * (6 + 9 * boost), a * (0.45 + 0.55 * boost));
        g.globalAlpha = 1;
        g.fillStyle = `rgba(21,219,168,${clamp(a * (0.75 + 0.25 * boost)).toFixed(3)})`;
        g.beginPath(); g.arc(o[0], o[1], r, 0, Math.PI * 2); g.fill();
        const wc = clamp(a * (0.25 + 0.6 * o[3]) + boost * o[4] * 0.8);
        if (wc > 0.02) {
          g.fillStyle = `rgba(225,255,246,${wc.toFixed(3)})`;
          g.beginPath(); g.arc(o[0], o[1], r * 0.45, 0, Math.PI * 2); g.fill();
        }
      }

      // ---- packets ----
      const pkA = inv(t, 1.3, 1.7) * (1 - inv(t, COLL0, COLL0 + 0.1));
      if (pkA > 0.003) {
        for (const pk of packets) {
          if (t < pk.t0) continue;
          const hh = (t - pk.t0) * pk.speed + pk.ph;
          const hop = Math.floor(hh) % (pk.path.length - 1), fr = hh - Math.floor(hh);
          const A = scr[pk.path[hop]], B = scr[pk.path[hop + 1]];
          if (A[4] <= 0 || B[4] <= 0) continue;
          const x = lerp(A[0], B[0], fr), y = lerp(A[1], B[1], fr);
          const f0 = Math.max(0, fr - 0.45);
          const tx = lerp(A[0], B[0], f0), ty = lerp(A[1], B[1], f0);
          const dep = lerp(A[3], B[3], fr);
          const a = pkA * inv(t, pk.t0, pk.t0 + 0.2) * (0.35 + 0.65 * dep);
          const gr = g.createLinearGradient(tx, ty, x, y);
          gr.addColorStop(0, 'rgba(21,219,168,0)');
          gr.addColorStop(1, `rgba(170,255,228,${(0.85 * a).toFixed(3)})`);
          g.globalAlpha = 1;
          g.strokeStyle = gr;
          g.lineWidth = 2;
          g.beginPath(); g.moveTo(tx, ty); g.lineTo(x, y); g.stroke();
          blob(x, y, 26 * lerp(A[2], B[2], fr), a * 0.9);
          g.globalAlpha = 1;
          g.fillStyle = `rgba(235,255,250,${a.toFixed(3)})`;
          g.beginPath(); g.arc(x, y, 2.2, 0, Math.PI * 2); g.fill();
        }
      }
      g.globalCompositeOperation = 'source-over';
      g.globalAlpha = 1;

      // ---- pulse shockwave: equatorial ring expanding on each stat ----
      for (const T of TS) {
        if (T < 1 || t < T || t > T + 0.8) continue;
        const q = (t - T) / 0.8;
        const rad = R * (1.04 + 0.3 * E('power2.out')(q));
        const al = 0.6 * (1 - q) * (1 - q);
        g.lineWidth = 2;
        g.strokeStyle = `rgba(120,255,215,${al.toFixed(3)})`;
        g.beginPath();
        for (let s2 = 0; s2 <= 72; s2++) {
          const u = (s2 / 72) * Math.PI * 2;
          const x = Math.cos(u) * rad, z0 = Math.sin(u) * rad;
          // flatter perspective than the sphere so the wave hugs it and never reaches the HUD column
          const y = -z0 * SIN_T, z = z0 * COS_T, k = 1500 / (1500 + z);
          const P = [c.x + x * k * c.z, c.y + y * k * c.z];
          if (s2 === 0) g.moveTo(P[0], P[1]); else g.lineTo(P[0], P[1]);
        }
        g.stroke();
      }

      // ---- collapse core → travelling point → (960, 540) ----
      if (t >= COLL0 + 0.02) {
        g.globalCompositeOperation = 'lighter';
        const core = p(t, COLL0 + 0.02, COLL0 + 0.22, 'power2.out');
        const [px, py] = t < TRAVEL[0] ? [c.x, c.y] : pointPos(t);
        // trail while travelling (expo.in → a streak just before arrival)
        if (t > TRAVEL[0]) {
          const [qx, qy] = pointPos(Math.max(TRAVEL[0], t - 0.03));
          const d = Math.hypot(px - qx, py - qy);
          if (d > 1) {
            const gr = g.createLinearGradient(qx, qy, px, py);
            gr.addColorStop(0, 'rgba(21,219,168,0)');
            gr.addColorStop(1, 'rgba(150,255,225,.9)');
            g.globalAlpha = 1;
            g.strokeStyle = gr;
            g.lineCap = 'round';
            g.lineWidth = 8;
            g.beginPath(); g.moveTo(qx, qy); g.lineTo(px, py); g.stroke();
            g.lineWidth = 3;
            g.stroke();
          }
        }
        // implosion flare, settling to a calm glow
        const flare = Math.exp(-Math.max(0, t - (COLL0 + 0.2)) * 7) * core;
        const arrive = t >= TRAVEL[1] ? Math.exp(-(t - TRAVEL[1]) * 18) : 0;
        blob(px, py, 90 + 200 * flare + 120 * arrive, (0.75 + 0.25 * flare) * core);
        blob(px, py, 34, core);
        g.globalCompositeOperation = 'source-over';
        g.globalAlpha = 1;
        g.fillStyle = '#5ff5cf';
        g.beginPath(); g.arc(px, py, 6 * core, 0, Math.PI * 2); g.fill();
        g.fillStyle = 'rgba(240,255,250,.9)';
        g.beginPath(); g.arc(px, py, 3 * core, 0, Math.PI * 2); g.fill();
      }
      g.globalAlpha = 1;
      g.globalCompositeOperation = 'source-over';
      return { c, pulse };
    };

    /* =====================================================================
       UPDATE
       ===================================================================== */
    return {
      tl,
      update(local) {
        const t = Math.max(0, local);

        // scan
        const sy = 1080 * p(t, SCAN[0], SCAN[1], 'power1.inOut');
        const scanOn = t < SCAN[1] + 0.02;
        st(scanL, 'display', scanOn ? 'block' : 'none');
        if (scanOn) {
          st(veil, 'transform', `translateY(${sy.toFixed(1)}px)`);
          st(band, 'transform', `translateY(${(sy - 240).toFixed(1)}px)`);
          st(line, 'transform', `translateY(${(sy - 1.5).toFixed(1)}px)`);
          st(line, 'opacity', (1 - inv(t, SCAN[1] - 0.04, SCAN[1] + 0.02)).toFixed(3));
          st(band, 'opacity', (1 - inv(t, SCAN[1] - 0.08, SCAN[1] + 0.02)).toFixed(3));
        }

        // sphere
        const { c, pulse } = draw(t);
        const haloA = p(t, 0.5, 1.5, 'power2.out') * (1 - p(t, COLL0, COLL0 + 0.3, 'power2.in'));
        st(halo, 'opacity', clamp(haloA * (0.75 + 0.5 * pulse)).toFixed(3));
        st(halo, 'transform', `translate(${(c.x - SPH.x).toFixed(1)}px, ${(c.y - SPH.y).toFixed(1)}px) scale(${(c.z * (1 + 0.08 * pulse)).toFixed(3)})`);

        // HUD drift (slight counter-parallax to the sphere)
        const hx = noise(t * 0.18, 21.4) * 4 + t * 0.9, hy = noise(t * 0.16, 33.9) * 3;
        st(hud, 'transform', `translate(${hx.toFixed(2)}px, ${hy.toFixed(2)}px)`);

        // stats
        for (const S of stats) setStat(S, t);
        // progress segments
        const segA = inv(t, TS[0], TS[0] + 0.3) * (1 - inv(t, STAT4_OUT - 0.05, STAT4_OUT + 0.15));
        st(segWrap, 'opacity', segA.toFixed(3));
        segs.forEach((el, k) => {
          const endK = k < 3 ? TS[k + 1] : STAT4_OUT;
          st(el, 'transform', `scaleX(${inv(t, TS[k], endK).toFixed(4)})`);
        });
        // one sheen pass across each chip right after it pops
        [[chipA, CHIP1], [chipB, CHIP2]].forEach(([pl, at]) => {
          const q = p(t, at + 0.25, at + 0.9, 'power2.inOut');
          st(pl.__sheen, 'transform', `translateX(${lerp(-90, pl.__w + 40, q).toFixed(1)}px) skewX(-20deg)`);
        });
        // caption dot breathes
        st(capDot, 'opacity', (0.55 + 0.45 * Math.sin(t * Math.PI * 2)).toFixed(3));
      },
    };
  },
});
