/* ============================================================
   S5 · ponto-final · start 16.0 · dur 6.0 · z 30 · pre 0 · post 0  [16–22]
   The turning point. Hard cut from the Act I collapse to black and
   silence → a single green dot → it becomes the period of
   "Ponto final no caos" → the letters dissolve into dust drifting up
   the brand's 45° diagonal → the GT mark assembles around the dot →
   GROWTH TIME RESULTS lockup, LOCK on the bar (20.0) → gate dive
   through the arrow/stem gap into S6 (z 20, pre 0.5) behind.
   First frame: solid #000c0d. Last frame: backdrop 0, mark on a canvas
   at ~×40 around the gap with parts faded out.
   Gate dive (5.5–6.0): the SVG mark swaps (pixel-matched) to a canvas; the
   backdrop (opacity 1 until 5.93) gets an even-odd clip-path hole = a real
   matte: the slit inside the green stroke opens 0→1 (5.5–5.62, brief glint),
   then widens 1→3.5 and reaches into the channels (5.62–5.92), so S6 is only
   ever seen THROUGH the mark. Gray parts sink to dark silhouettes (×3–×6) and
   go 5.86–5.94; the rim-lit green gate holds to 5.90 and goes by 5.98, with
   a zoom blur and 45° speed streaks off the rims.
   Everything is a pure function of `local` (computed in update()).
   ============================================================ */
GTR.scene({
  id: 'ponto-final',
  build(root, ctx) {
    const { h, s, p, inv, clamp, lerp, noise } = GTR;
    const C = KIT.C;
    const E = GTR.E;
    const vis = (el, a) => {
      el.style.opacity = a;
      el.style.visibility = a > 0.002 ? 'visible' : 'hidden';
    };
    root.style.pointerEvents = 'none';

    /* ---------------- geometry (STORYBOARD S5 constants) ---------------- */
    const K = 900 / 710;                                   // logo viewBox → px
    const VB = { x: 0, y: 20, w: 710, h: 265 };
    const BOX = { x: 510, y: 272 };                        // svg top-left on stage
    const toS = (vx, vy) => [BOX.x + (vx - VB.x) * K, BOX.y + (vy - VB.y) * K];
    const DOT_VB = [656.12, 253.27], DOT_RVB = 21.07;
    const [PX, PY] = toS(DOT_VB[0], DOT_VB[1]);           // ≈ (1342, 568)
    const DOT_R = DOT_RVB * K;                             // ≈ 26.7
    const DOT_R0 = 11;
    const G_VB = [472.93, 173.25];                         // gap arrow ↔ stem
    const [GX, GY] = toS(G_VB[0], G_VB[1]);               // ≈ (1109, 466)
    const MX0 = toS(30.32, 0)[0], MX1 = toS(678.27, 0)[0];
    const MARK_W = MX1 - MX0;                              // ≈ 821
    const LCX = (MX0 + MX1) / 2;                           // ≈ 959 (lockup axis)
    const O = { x: LCX, y: 496 };                          // group scale origin (lockup centre)
    const WM_Y = 690;                                      // wordmark line centre
    const GRAY = '#9CA3AF', GREEN = '#33cc99';
    const GLOW = 'drop-shadow(0 0 28px rgba(21,219,168,.35))';

    /* ---------------- layers ---------------- */
    const bgWrap = h('div', { style: { position: 'absolute', inset: '0' } }, root);
    h('div', { style: { position: 'absolute', inset: '0', background: '#000c0d' } }, bgWrap);
    const pad = GTR.glow(bgWrap, { x: LCX, y: 470, r: 700, color: '21,219,168', a: 0.22 });
    const padLow = GTR.glow(bgWrap, { x: LCX, y: 820, r: 560, color: '6,103,103', a: 0.28 });
    const { canvas: dustCv, ctx: dc } = GTR.canvas(root);   // dust lives behind the mark
    const group = h('div', { style: { position: 'absolute', inset: '0', transformOrigin: `${O.x}px ${O.y}px` } }, root);

    /* ---------- the mark (SVG, assembly 2.5–3.7) ---------- */
    const svg = s('svg', { width: 900, height: +(VB.h * K).toFixed(2), viewBox: `${VB.x} ${VB.y} ${VB.w} ${VB.h}`, overflow: 'visible',
      style: { position: 'absolute', left: `${BOX.x}px`, top: `${BOX.y}px`, overflow: 'visible', filter: GLOW } }, group);
    const defs = s('defs', {}, svg);
    const vgrad = (id, c0, c1) => {
      const g = s('linearGradient', { id, gradientUnits: 'userSpaceOnUse', x1: 0, y1: 30, x2: 0, y2: 273 }, defs);
      s('stop', { offset: '0%', 'stop-color': c0 }, g);
      s('stop', { offset: '100%', 'stop-color': c1 }, g);
    };
    vgrad('pf-gray', '#b3bac5', '#939aa6');
    vgrad('pf-green', '#3ddcaa', '#2fbf8e');
    // 45° sheen band (lock). Offsets are in stage (x+y) px from the band line; alpha.
    const SHEEN = [[-150, 0], [-34, 0.5], [-4, 0.6], [16, 0], [46, 0], [54, 0.34], [66, 0.34], [74, 0]];
    const SH0 = SHEEN[0][0], SH1 = SHEEN[SHEEN.length - 1][0];
    const sheenGrad = s('linearGradient', { id: 'pf-sheen', gradientUnits: 'userSpaceOnUse', x1: 0, y1: 0, x2: 1, y2: 1 }, defs);
    SHEEN.forEach(([o, a]) => s('stop', { offset: ((o - SH0) / (SH1 - SH0)).toFixed(4), 'stop-color': '#ffffff', 'stop-opacity': a }, sheenGrad));
    const bandA = (off) => {                                // band alpha at (x+y) offset from the line
      if (off <= SH0 || off >= SH1) return 0;
      for (let i = 1; i < SHEEN.length; i++) {
        if (off <= SHEEN[i][0]) {
          const [o0, a0] = SHEEN[i - 1], [o1, a1] = SHEEN[i];
          return lerp(a0, a1, (off - o0) / (o1 - o0));
        }
      }
      return 0;
    };
    const vbSum = (c) => (c - BOX.x - BOX.y) / K + VB.x + VB.y;   // stage x+y → viewBox x+y

    const KEYS = ['g1', 'g2', 't', 'arrow', 'stem'];
    // motion smear: up to TRAIL_MAX copies spaced ≤ TRAIL_STEP px apart between now and 0.075 s
    // ago, then Gaussian-blurred as a group so it reads as blur, never as stacked echoes
    const TRAIL_MAX = 56, TRAIL_LAG = 0.075, TRAIL_STEP = 4;
    const TRAILS = Array.from({ length: TRAIL_MAX }, (_, j) => j);
    const fillOf = (k) => (k === 'arrow' || k === 'stem' ? 'url(#pf-green)' : 'url(#pf-gray)');
    const tBlur = s('filter', { id: 'pf-tblur', filterUnits: 'userSpaceOnUse', x: -900, y: -800, width: 2600, height: 2000,
      'color-interpolation-filters': 'sRGB' }, defs);
    s('feGaussianBlur', { stdDeviation: 4.5 }, tBlur);
    const trailG = s('g', { filter: 'url(#pf-tblur)' }, svg);
    const partG = s('g', {}, svg);
    const flashG = s('g', {}, svg);
    const sheenG = s('g', {}, svg);
    const parts = {};
    for (const k of KEYS) {
      const d = GTR.LOGO_PATHS[k];
      parts[k] = {
        trails: TRAILS.map(() => s('path', { d, fill: fillOf(k) }, trailG)),
        el: s('path', { d, fill: fillOf(k) }, partG),
        fl: s('path', { d, fill: '#ffffff' }, flashG),
        sh: s('path', { d, fill: 'url(#pf-sheen)' }, sheenG),
      };
    }
    // [t0, dx, dy (stage px), dur]; arrow rushes past its seat to (+18,−18) and springs back
    const PLAN = {
      g1: { t0: 2.5, dx: -420, dy: -420, dur: 0.6 },
      g2: { t0: 2.625, dx: -420, dy: 420, dur: 0.6 },
      t: { t0: 2.75, dx: 0, dy: -520, dur: 0.6 },
      arrow: { t0: 2.875, dx: -600, dy: 600, dur: 0.7, over: true },
      stem: { t0: 3.0, dx: -260, dy: 260, dur: 0.6 },
    };
    const offAt = (k, t) => {
      const q = PLAN[k];
      const u = inv(t, q.t0, q.t0 + q.dur);
      if (!q.over) {
        const e = E('expo.out')(u);
        return [q.dx * (1 - e), q.dy * (1 - e)];
      }
      const A = 0.5;
      if (u < A) {
        const e = E('expo.out')(u / A);
        return [lerp(q.dx, 18, e), lerp(q.dy, -18, e)];
      }
      const e = E('back.out(2)')((u - A) / (1 - A));
      return [lerp(18, 0, e), lerp(-18, 0, e)];
    };
    const partOp = (k, t) => p(t, PLAN[k].t0, PLAN[k].t0 + 0.12, 'power1.out');
    const tr = (el, o) => el.setAttribute('transform', `translate(${(o[0] / K).toFixed(3)} ${(o[1] / K).toFixed(3)})`);

    /* ---------- "Ponto final no caos" (period = the green dot) ---------- */
    const TXT = 'Ponto final no caos';
    const tx = h('div', { class: 'display', style: { position: 'absolute', left: '0', top: '0', fontSize: '84px', lineHeight: '1', whiteSpace: 'nowrap', color: '#f4f7f6' } }, group);
    const chars = Array.from(TXT).map((ch) => {
      const sp = h('span', { style: { display: 'inline-block', whiteSpace: 'pre' } }, tx);
      sp.textContent = ch;
      return sp;
    });
    const txProbe = h('span', { style: { display: 'inline-block', width: '0', height: '0' } }, tx);
    const Wt = tx.offsetWidth;
    const TX_BASE = PY + DOT_R0 - 0.5;                      // dot sits on the baseline like a period
    const TX_X = PX - 19 - Wt;
    tx.style.left = `${TX_X}px`;
    tx.style.top = `${TX_BASE - txProbe.offsetTop}px`;
    // dissolve runs RIGHT → LEFT from the dot (the dot swallows the sentence): 's' goes first
    const CPS = 38, T_TYPE = 0.625, T_DIS = 2.4, DIS_STAG = 0.012, DIS_DUR = 0.2, DIS_FADE = 0.11;
    let nonSpace = 0;
    const charInfo = chars.map((sp, i) => {
      const space = TXT[i] === ' ';
      const info = { sp, space, ti: T_TYPE + i / CPS, x: sp.offsetLeft, w: sp.offsetWidth, di: space ? -1 : nonSpace };
      if (!space) nonSpace++;
      return info;
    });
    const N_GLYPH = nonSpace;
    charInfo.forEach((c) => { c.td = T_DIS + (c.space ? 0 : (N_GLYPH - 1 - c.di) * DIS_STAG); });

    /* ---------- dust: glyph-sampled particles + ambient specks ---------- */
    const R = GTR.rng('pf-dust');
    const DUST_END = 3.4;
    const dust = [];
    {
      const PADX = 24, PADY = 110;
      const cw = Math.ceil(Wt + PADX * 2), chh = PADY + 40;
      const oc = document.createElement('canvas');
      oc.width = cw; oc.height = chh;
      const o2 = oc.getContext('2d');
      o2.font = '84px "Russo One"';
      o2.fillStyle = '#fff';
      o2.textBaseline = 'alphabetic';
      for (const ci of charInfo) if (!ci.space) o2.fillText(ci.sp.textContent, PADX + ci.x, PADY);
      const img = o2.getImageData(0, 0, cw, chh).data;
      const STEP = 5;
      for (let y = 0; y < chh; y += STEP) {
        for (let x = 0; x < cw; x += STEP) {
          if (img[(y * cw + x) * 4 + 3] < 110) continue;
          const lx = x - PADX;
          const ci = charInfo.find((c) => !c.space && lx >= c.x - 1 && lx < c.x + c.w + 1);
          if (!ci) continue;
          // lift along the brand's 45° diagonal (+1,−1): ≥ 220 px in 0.8 s, ±20° jitter;
          // within a glyph the right edge lets go first (same right → left sweep as the letters)
          const linger = R() < 0.1;
          const t0 = ci.td + ((ci.x + ci.w - lx) / Math.max(1, ci.w)) * 0.06 + R() * 0.04;
          dust.push({
            x0: TX_X + lx + (R() - 0.5) * 2, y0: TX_BASE - PADY + y + (R() - 0.5) * 2, t0,
            v: linger ? 120 + R() * 60 : 90 + R() * 80,
            acc: linger ? 160 : 520 + R() * 380,
            ang: -Math.PI / 4 + (R() - 0.5) * (40 * Math.PI / 180),
            // everything is gone by local 3.4 [19.4], before the wordmark rises
            life: Math.min(linger ? 0.95 + R() * 0.25 : 0.65 + R() * 0.35, DUST_END - t0),
            size: linger ? 1.2 + R() * 1.6 : 1.5 + R() * 1.5,
            seed: R() * 100, z: 0.7 + R() * 1.1, linger,
          });
        }
      }
    }
    const amb = Array.from({ length: 70 }, () => ({
      x: 260 + R() * 1400, y: 150 + R() * 780, v: 6 + R() * 16, z: 0.5 + R() * 1.5,
      size: 0.8 + R() * 1.8, a: 0.12 + R() * 0.35, tw: R() * 10, seed: R() * 100,
    }));

    /* ---------- wordmark GROWTH TIME RESULTS ---------- */
    const WM_SIZE = 50;
    const mkWord = (parent, text, color, cls) => Array.from(text).map((ch) => {
      const sp = h('span', { class: cls || '', style: { display: 'inline-block', whiteSpace: 'pre', color } }, parent);
      sp.textContent = ch;
      return sp;
    });
    const wmStyle = { position: 'absolute', left: '0', top: '0', fontSize: `${WM_SIZE}px`, lineHeight: '1', whiteSpace: 'nowrap', letterSpacing: '0px' };
    const wm = h('div', { class: 'display', style: Object.assign({}, wmStyle) }, group);
    const wmA = mkWord(wm, 'GROWTH TIME ', GRAY);
    const resWrap = h('span', { style: { display: 'inline-block', whiteSpace: 'pre' } }, wm);
    const wmB = mkWord(resWrap, 'RESULTS', C.vibrant);
    wmB[wmB.length - 1].style.letterSpacing = '0px';
    resWrap.style.textShadow = '0 0 22px rgba(21,219,168,.45)';
    const wmProbe = h('span', { style: { display: 'inline-block', width: '0', height: '0' } }, wm);
    // measure at zero tracking: width grows by 18·ls (19 glyph cells, the last carries none)
    const W0 = wm.offsetWidth, RES_L0 = resWrap.offsetLeft, RES_W0 = resWrap.offsetWidth;
    const NGAP = wmA.length + wmB.length - 1;
    const LS_FINAL = clamp((MARK_W - W0) / NGAP, WM_SIZE * 0.2, WM_SIZE * 0.42); // justify to the mark width
    const LS_START = WM_SIZE * 0.9;
    const mc = document.createElement('canvas').getContext('2d');
    mc.font = `${WM_SIZE}px "Russo One"`;
    const CAP = mc.measureText('H').actualBoundingBoxAscent;
    const WM_TOP = WM_Y + CAP / 2 - wmProbe.offsetTop;
    wm.style.top = `${WM_TOP}px`;
    const wmW = (ls) => W0 + NGAP * ls;
    const wmLetters = wmA.filter((sp) => sp.textContent !== ' ');
    // wipe edge riding RESULTS' clip
    const wipeEdge = h('div', { style: { position: 'absolute', top: `${-8}px`, width: '3px', height: `${WM_SIZE + 16}px`, marginLeft: '-1.5px', borderRadius: '2px',
      background: '#bafff0', boxShadow: '0 0 14px 3px rgba(21,219,168,.85), 0 0 40px rgba(21,219,168,.55)', opacity: 0 } }, wm);
    wipeEdge.style.top = `${wmProbe.offsetTop - CAP - 8}px`;
    wipeEdge.style.height = `${CAP + 16}px`;

    // sheen duplicate (static at final tracking; per-glyph 45° gradient clipped to text)
    const wmSheen = h('div', { class: 'display', style: Object.assign({}, wmStyle, { letterSpacing: `${LS_FINAL}px`, left: `${LCX - wmW(LS_FINAL) / 2}px`, top: `${WM_TOP}px` }) }, group);
    const shSpans = [...mkWord(wmSheen, 'GROWTH TIME ', 'transparent'), ...mkWord(wmSheen, 'RESULTS', 'transparent')];
    shSpans[shSpans.length - 1].style.letterSpacing = '0px';
    const shBoxes = shSpans.map((sp) => {
      Object.assign(sp.style, { webkitBackgroundClip: 'text', backgroundClip: 'text', webkitTextFillColor: 'transparent' });
      return { sp, bx: LCX - wmW(LS_FINAL) / 2 + sp.offsetLeft, by: WM_TOP + sp.offsetTop, blank: sp.textContent === ' ' };
    });

    /* ---------- the dot (DOM circle for the whole scene until the dive) ---------- */
    const pingRing = KIT.pulse(group, { x: 960, y: 540, r: 80, color: GREEN, sw: 2 });
    const halo = h('div', { style: { position: 'absolute', left: '-130px', top: '-130px', width: '260px', height: '260px', borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(51,204,153,.36) 0%, rgba(51,204,153,.15) 35%, rgba(51,204,153,0) 70%)' } }, group);
    const dot = h('div', { style: { position: 'absolute', left: '0', top: '0', borderRadius: '50%', overflow: 'hidden',
      background: `radial-gradient(circle at 38% 32%, #5cf0c2 0%, ${GREEN} 55%, #2bb584 100%)` } }, group);
    const dotShine = h('div', { style: { position: 'absolute', inset: '0', background: '#fff', opacity: 0 } }, dot);
    const lockRing = KIT.pulse(group, { x: PX, y: PY, r: 260, color: C.vibrant, sw: 3 });
    const lockRing2 = KIT.pulse(group, { x: PX, y: PY, r: 430, color: 'rgba(21,219,168,.6)', sw: 1.5 });

    /* ---------- gate-dive canvas (5.5–6.0) ---------- */
    const { canvas: diveCv, ctx: vc } = GTR.canvas(root);
    diveCv.style.filter = GLOW;
    const P2D = Object.fromEntries(KEYS.map((k) => [k, new Path2D(GTR.LOGO_PATHS[k])]));
    const cgrad = (c0, c1) => { const g = vc.createLinearGradient(0, 30, 0, 273); g.addColorStop(0, c0); g.addColorStop(1, c1); return g; };
    const CG_GRAY = cgrad('#b3bac5', '#939aa6');
    const CG_GREEN = cgrad('#3ddcaa', '#2fbf8e');
    const zCv = document.createElement('canvas');                // offscreen zoom-blur buffer
    zCv.width = 1920; zCv.height = 1080;
    const zc = zCv.getContext('2d');
    const ZG_GREEN = (() => { const g = zc.createLinearGradient(0, 30, 0, 273); g.addColorStop(0, '#3ddcaa'); g.addColorStop(1, '#2fbf8e'); return g; })();
    // portal = the 45° gap between the green arrow and the stem (viewBox), with pointed tips
    // running into the neighbouring channels; opened like a blade (across-axis scaled by w)
    const PORTAL = [[497.04, 127.13], [523.04, 123.14], [497.04, 171.15], [448.82, 219.37], [417.82, 228.36], [448.82, 175.35]];
    const RIMS = [[[497.04, 127.13], [448.82, 175.35]], [[497.04, 171.15], [448.82, 219.37]]];
    const SQ = Math.SQRT1_2;
    // kt = how far the pointed tips reach into the neighbouring channels (0 = the pure slit,
    // clipped at the stem's own vertical edges, so early on S6 shows only inside the green stroke)
    const PORTAL_SLIT = PORTAL.map(([x, y], i) => {
      if (i === 1) return [(PORTAL[0][0] + PORTAL[2][0]) / 2, (PORTAL[0][1] + PORTAL[2][1]) / 2];
      if (i === 4) return [(PORTAL[3][0] + PORTAL[5][0]) / 2, (PORTAL[3][1] + PORTAL[5][1]) / 2];
      return [x, y];
    });
    const portalVB = (w, kt = 1) => PORTAL.map(([x1, y1], i) => [lerp(PORTAL_SLIT[i][0], x1, kt), lerp(PORTAL_SLIT[i][1], y1, kt)]).map(([x, y]) => {
      const rx = x - G_VB[0], ry = y - G_VB[1];
      const al = (rx - ry) * SQ, ac = (rx + ry) * SQ * w;   // along (1,−1), across (1,1)
      return [G_VB[0] + (al + ac) * SQ, G_VB[1] + (-al + ac) * SQ];
    });

    /* ---------------- SFX ---------------- */
    ctx.cue('ping', 0.5, { db: -4 });
    ctx.cue('type', 0.625, { dur: 0.5, rate: 36, db: -8 });
    ctx.cue('shimmer', 2.0, { db: -6 });
    [2.5, 2.625, 2.75].forEach((t, i) => ctx.cue('swoosh', t, { pan: [-0.6, -0.3, 0][i] }));
    ctx.cue('whoosh', 2.875, { dur: 0.35, up: true, pan: 0.3 });
    ctx.cue('swoosh', 3.0, { pan: 0.6 });
    ctx.cue('swell', 2.8, { dur: 1.2 });
    ctx.cue('blip', 3.5, { freq: 1600 });
    ctx.cue('blip', 3.625, { freq: 2000 });
    ctx.cue('ping', 4.0, { freq: 1760 });
    ctx.cue('shimmer', 4.0);
    ctx.cue('whoosh', 5.4, { dur: 0.6, up: true });

    /* ---------------- time functions ---------------- */
    const T_LOCK = 4.0, T_DIVE = 5.5;
    const gsAt = (t) => {
      if (t < 1.125) return 1;
      if (t < 2.4) return lerp(1, 1.02, p(t, 1.125, 2.4, 'sine.inOut'));
      if (t < T_LOCK) return lerp(1.02, 1.04, p(t, 2.4, T_LOCK, 'power1.in'));
      if (t < 4.25) return lerp(1.04, 1, p(t, T_LOCK, 4.25, 'back.out(2.2)'));
      return lerp(1, 1.015, p(Math.min(t, T_DIVE), 4.25, T_DIVE, 'sine.inOut'));
    };
    const dotAt = (t) => {
      const m = p(t, 0.625, 1.125, 'power3.inOut');
      // grows only once the neighbouring 's' has let go (never covers a live glyph)
      const r = lerp(DOT_R0, DOT_R, p(t, 2.48, 2.76, 'expo.out'));
      return { x: lerp(960, PX, m), y: lerp(540, PY, m), r, sc: t < 0.5 ? 0 : p(t, 0.5, 0.8, 'back.out(3)') };
    };
    const sheenC = (t) => lerp(MX0 + 285 - 180, MX1 + WM_Y + 40 + 200, p(t, T_LOCK, T_LOCK + 0.5, 'power2.inOut'));

    /* gate dive (5.5–6.0): G (the arrow/stem gap) → frame centre, ×1 → ×40, −12° roll */
    const T_FULL = 5.95;
    const GS5 = gsAt(T_DIVE);
    const Gs0x = O.x + GS5 * (GX - O.x), Gs0y = O.y + GS5 * (GY - O.y);
    const diveXf = (t) => {
      const e = t >= T_DIVE ? E('expo.in')(inv(t, T_DIVE, T_FULL)) : 0;
      const over = Math.max(0, t - T_FULL) * 600;          // keep diving past ×40 until the cut
      const th = (-12 * Math.PI / 180) * e;
      return { e, Gsx: lerp(Gs0x, 960, e), Gsy: lerp(Gs0y, 540, e), th, cosT: Math.cos(th), sinT: Math.sin(th),
        SD: K * GS5 * (lerp(1, 40, e) + over) };
    };
    const xfPt = (X, x, y) => {
      const dx = (x - G_VB[0]) * X.SD, dy = (y - G_VB[1]) * X.SD;
      return [X.Gsx + X.cosT * dx - X.sinT * dy, X.Gsy + X.sinT * dx + X.cosT * dy];
    };
    const applyXf = (X) => { vc.translate(X.Gsx, X.Gsy); vc.rotate(X.th); vc.scale(X.SD, X.SD); vc.translate(-G_VB[0], -G_VB[1]); };
    // the matte: blade opens 0 → 1 (5.5–5.62), then keeps widening 1 → 3.5 so the opening frames
    // the window before the backdrop goes (5.93–5.98)
    const portalAt = (t) => (t < 5.62 ? p(t, T_DIVE, 5.62, 'power2.out') : 1 + 2.5 * p(t, 5.62, 5.92, 'power3.in'));
    const mixHex = (a, b, k) => {
      const A = parseInt(a.slice(1), 16), B = parseInt(b.slice(1), 16);
      const ch = (sh) => Math.round(lerp((A >> sh) & 255, (B >> sh) & 255, k));
      return `rgb(${ch(16)},${ch(8)},${ch(0)})`;
    };

    return {
      update(local) {
        const t = local;
        const gsRaw = gsAt(Math.min(t, T_DIVE));
        group.style.transform = `scale(${gsRaw})`;

        /* gate-dive transform (vb → screen), shared by the canvas, the portal clip and the dust */
        const X = diveXf(t);
        const { e, Gsx, Gsy, th, cosT, sinT, SD } = X;
        const vb2s = (x, y) => xfPt(X, x, y);
        const diveOn = t >= T_DIVE;
        const portalW = portalAt(t);

        /* backdrop + pads (portal cut out during the dive) */
        // the backdrop stays a solid matte (only the gap is cut) until the opening frames S6
        const bOp = 1 - p(t, 5.93, 5.98, 'power1.in');
        vis(bgWrap, bOp);
        if (diveOn && portalW > 0.001) {
          const pts = portalVB(portalW, p(t, 5.74, 5.86, 'power2.in')).map(([x, y]) => vb2s(x, y));
          const hole = pts.map(([x, y]) => `${x.toFixed(1)}px ${y.toFixed(1)}px`).join(', ');
          bgWrap.style.clipPath = `polygon(evenodd, -20px -20px, 1940px -20px, 1940px 1100px, -20px 1100px, -20px -20px, ${hole}, ${pts[0][0].toFixed(1)}px ${pts[0][1].toFixed(1)}px)`;
        } else bgWrap.style.clipPath = '';
        const lockK = t >= T_LOCK ? 1 - p(t, T_LOCK, T_LOCK + 0.9, 'power2.out') : 0;
        const padIn = p(t, 2.0, 4.0, 'sine.inOut');
        vis(pad, padIn * (0.9 + 0.1 * Math.sin(t * 2.1)) * (1 + 0.35 * lockK));
        pad.style.transform = `translate(${noise(1.7, t * 0.3) * 24}px, ${noise(8.2, t * 0.3) * 18}px) scale(${1 + 0.05 * padIn})`;
        vis(padLow, p(t, 3.0, 4.5, 'sine.inOut') * 0.8);

        /* sentence: type in, hold, dissolve */
        for (const c of charInfo) {
          if (c.space) continue;
          if (t < c.td) {
            const a = p(t, c.ti, c.ti + 0.05, 'none');
            const y = (1 - p(t, c.ti, c.ti + 0.16, 'power2.out')) * 10;
            vis(c.sp, a);
            c.sp.style.transform = `translateY(${y.toFixed(2)}px)`;
            c.sp.style.filter = '';
          } else {
            const q = p(t, c.td, c.td + DIS_DUR, 'power2.in');
            vis(c.sp, 1 - p(t, c.td, c.td + DIS_FADE, 'power1.out'));
            c.sp.style.transform = `translate(${(18 * q).toFixed(2)}px, ${(-30 * q).toFixed(2)}px)`;
            c.sp.style.filter = `blur(${(8 * q).toFixed(2)}px)`;
          }
        }

        /* dot + halo */
        const d = dotAt(t);
        const onDom = t >= 0.5 && t < T_DIVE;
        if (onDom) {
          const r = d.r * d.sc;
          dot.style.display = 'block';
          dot.style.width = dot.style.height = `${(2 * r).toFixed(2)}px`;
          dot.style.left = `${(d.x - r).toFixed(2)}px`;
          dot.style.top = `${(d.y - r).toFixed(2)}px`;
          const flare = lockK;
          dot.style.boxShadow = `0 0 ${(14 + 26 * flare).toFixed(1)}px rgba(21,219,168,${(0.55 + 0.4 * flare).toFixed(2)}), 0 0 ${(40 + 60 * flare).toFixed(1)}px rgba(21,219,168,${(0.25 + 0.3 * flare).toFixed(2)})`;
          const cSh = sheenC(t);
          dotShine.style.opacity = t >= T_LOCK && t < T_LOCK + 0.6 ? bandA(PX + PY - cSh) * 1.2 : 0;
          const breathe = 1 + 0.06 * Math.sin((t - 0.5) * Math.PI * 1.6);
          const hs = d.sc * (0.75 + 0.5 * (d.r / DOT_R)) * breathe * (1 + 0.7 * flare);
          halo.style.display = 'block';
          halo.style.transform = `translate(${d.x.toFixed(2)}px, ${d.y.toFixed(2)}px) scale(${hs.toFixed(4)})`;
          halo.style.opacity = 0.9 + 0.1 * flare;
        } else {
          dot.style.display = 'none';
          halo.style.display = 'none';
        }
        pingRing.set(t < 0.92 ? p(t, 0.5, 0.92, 'power2.out') : 0);
        lockRing.set(t >= T_LOCK ? p(t, T_LOCK, T_LOCK + 0.75, 'power2.out') : 0);
        lockRing2.set(t >= T_LOCK + 0.08 ? p(t, T_LOCK + 0.08, T_LOCK + 1.0, 'power2.out') : 0);

        /* mark assembly (SVG) */
        const svgOn = t >= PLAN.g1.t0 && t < T_DIVE;
        svg.style.display = svgOn ? 'block' : 'none';
        if (svgOn) {
          for (const k of KEYS) {
            const P = parts[k], q = PLAN[k];
            const o = offAt(k, t);
            const op = partOp(k, t);
            tr(P.el, o);
            P.el.style.opacity = op;
            // copies evenly spaced in distance (≤ TRAIL_STEP px) along the (straight) flight line
            const past = offAt(k, t - TRAIL_LAG);
            const dist = Math.hypot(past[0] - o[0], past[1] - o[1]);
            const n = Math.round(clamp(Math.ceil(dist / TRAIL_STEP), 6, TRAIL_MAX));
            const aEach = (2.1 / n) * clamp(dist / 40);
            TRAILS.forEach((j) => {
              const el = P.trails[j];
              if (j >= n || aEach < 0.002) { el.style.display = 'none'; return; }
              const f = (j + 1) / n;
              const ot = [lerp(o[0], past[0], f), lerp(o[1], past[1], f)];
              const ta = aEach * Math.pow(1 - f, 1.2) * partOp(k, t - TRAIL_LAG * f);
              tr(el, ot);
              el.style.opacity = ta;
              el.style.display = ta > 0.002 ? '' : 'none';
            });
            const land = q.t0 + (q.over ? 0.2 : 0.17);
            const fa = t >= land ? 0.38 * (1 - p(t, land, land + 0.4, 'power2.out')) : 0;
            tr(P.fl, o);
            P.fl.style.opacity = fa;
            P.fl.style.display = fa > 0.003 ? '' : 'none';
            tr(P.sh, o);
          }
        }
        /* lock sheen (mark + wordmark + dot) */
        const shOn = t >= T_LOCK && t < T_LOCK + 0.55;
        sheenG.style.display = shOn ? '' : 'none';
        wmSheen.style.display = shOn ? '' : 'none';
        if (shOn) {
          const c = sheenC(t);
          const a = vbSum(c + SH0), b = vbSum(c + SH1);
          sheenGrad.setAttribute('x1', (a / 2).toFixed(3));
          sheenGrad.setAttribute('y1', (a / 2).toFixed(3));
          sheenGrad.setAttribute('x2', (b / 2).toFixed(3));
          sheenGrad.setAttribute('y2', (b / 2).toFixed(3));
          for (const bx of shBoxes) {
            if (bx.blank) continue;
            const base = c - bx.bx - bx.by;
            bx.sp.style.backgroundImage = `linear-gradient(135deg, ${SHEEN.map(([o2, al]) => `rgba(255,255,255,${al}) ${((base + o2) / Math.SQRT2).toFixed(1)}px`).join(', ')})`;
          }
        }

        /* wordmark */
        const wmOn = t >= 3.5 && t < 5.62;
        wm.style.display = wmOn ? '' : 'none';
        if (wmOn) {
          const ls = lerp(LS_START, LS_FINAL, p(t, 3.5, 3.95, 'expo.out'));
          wm.style.letterSpacing = `${ls.toFixed(2)}px`;
          wm.style.left = `${(LCX - wmW(ls) / 2).toFixed(2)}px`;
          wmLetters.forEach((sp, j) => {
            const t0 = 3.5 + j * 0.018;
            const q = p(t, t0, t0 + 0.3, 'power3.out');
            vis(sp, p(t, t0, t0 + 0.18, 'power1.out'));
            sp.style.transform = `translateY(${((1 - q) * 34).toFixed(2)}px)`;
            sp.style.filter = q < 0.999 ? `blur(${((1 - q) * 6).toFixed(2)}px)` : '';
          });
          // RESULTS wipe completes by 3.95, so the 4.0 LOCK flash lands on the whole lockup
          const w = p(t, 3.64, 3.95, 'power2.inOut');
          resWrap.style.clipPath = `inset(-40% ${((1 - w) * 100).toFixed(2)}% -40% -4%)`;
          vis(resWrap, w > 0 ? 1 : 0);
          const resL = RES_L0 + wmA.length * ls, resW = RES_W0 + (wmB.length - 1) * ls;
          wipeEdge.style.left = `${(resL + w * resW).toFixed(2)}px`;
          vis(wipeEdge, Math.sin(Math.PI * w) * 0.95);
          const dq = p(t, 5.4, 5.6, 'power2.in');
          wm.style.transform = `translateY(${(40 * dq).toFixed(2)}px)`;
          wm.style.filter = dq > 0 ? `blur(${(6 * dq).toFixed(2)}px)` : '';
          wm.style.opacity = 1 - dq;
        }

        /* ---------- gate dive (canvas) ---------- */
        vc.setTransform(1, 0, 0, 1, 0, 0);
        vc.clearRect(0, 0, 1920, 1080);
        diveCv.style.display = diveOn ? 'block' : 'none';
        if (diveOn) {
          const pa = 1 - p(t, 5.90, 5.98, 'power1.in');          // the green gate holds, then goes
          // the gray parts fall away first: they sink into shadow as they pass ×3–×6 (depth cue),
          // staying opaque so S6 is only ever seen THROUGH the mark's openings, then go before the gate
          const ga = 1 - p(t, 5.86, 5.94, 'power1.in');
          const dk = p(t, 5.58, 5.78, 'power1.in');
          // 1) a brief glint as the blade opens; by 5.62 the gap is a clean matte onto S6
          const lA = 0.8 * p(t, T_DIVE, 5.54, 'power2.out') * (1 - p(t, 5.55, 5.62, 'power1.in'));
          if (lA > 0.003 && portalW > 0.001) {
            vc.save();
            applyXf(X);
            const pv = portalVB(Math.min(1, portalW), 0);
            vc.beginPath();
            pv.forEach(([x, y], i) => (i ? vc.lineTo(x, y) : vc.moveTo(x, y)));
            vc.closePath();
            const hw = 22.01 * Math.min(1, portalW);
            const lg = vc.createLinearGradient(G_VB[0] - hw * SQ, G_VB[1] - hw * SQ, G_VB[0] + hw * SQ, G_VB[1] + hw * SQ);
            lg.addColorStop(0, 'rgba(21,219,168,0.75)');
            lg.addColorStop(0.5, 'rgba(236,255,249,1)');
            lg.addColorStop(1, 'rgba(21,219,168,0.75)');
            vc.globalAlpha = lA;
            vc.fillStyle = lg;
            vc.fill();
            vc.restore();
          }
          // 2) zoom blur: where the green gate was a moment ago (smaller), under the sharp copy.
          // 8 sub-frames drawn offscreen, then composited once with a Gaussian blur (no steps)
          const Xp = diveXf(t - 0.012);
          const zv = 1 - Xp.SD / SD;                               // relative zoom over the shutter
          const zbA = pa * clamp((zv - 0.02) / 0.06);
          if (zbA > 0.003) {
            zc.setTransform(1, 0, 0, 1, 0, 0);
            zc.clearRect(0, 0, 1920, 1080);
            const ZN = 8;
            for (let j = 1; j <= ZN; j++) {
              const f = j / ZN;
              const Xf = { Gsx: lerp(Gsx, Xp.Gsx, f), Gsy: lerp(Gsy, Xp.Gsy, f), th: lerp(th, Xp.th, f), SD: SD * Math.pow(Xp.SD / SD, f) };
              zc.setTransform(1, 0, 0, 1, 0, 0);
              zc.translate(Xf.Gsx, Xf.Gsy); zc.rotate(Xf.th); zc.scale(Xf.SD, Xf.SD); zc.translate(-G_VB[0], -G_VB[1]);
              zc.globalAlpha = 0.16 * Math.pow(1 - f + 1 / ZN, 1.2);
              zc.fillStyle = ZG_GREEN;
              zc.fill(P2D.arrow);
              zc.fill(P2D.stem);
            }
            vc.save();
            vc.globalAlpha = zbA;
            vc.filter = `blur(${(2 + 10 * clamp(zv / 0.16)).toFixed(1)}px)`;
            vc.drawImage(zCv, 0, 0);
            vc.restore();
          }
          // 2b) the rims stretch into 45° speed streaks with the zoom rate: light shooting out of
          // the gap BEHIND the mark (hidden by the parts, seen only through openings / past the mark)
          const rA = p(t, T_DIVE, 5.6, 'power2.out') * (1 - p(t, 5.90, 5.96, 'power1.in'));
          const rimS = RIMS.map(([a, b]) => [vb2s(a[0], a[1]), vb2s(b[0], b[1])]);
          const L = clamp(zv - 0.03, 0, 0.17) * 6500;
          if (rA > 0.003 && L > 4) {
            vc.save();
            vc.lineCap = 'round';
            vc.shadowColor = 'rgba(21,219,168,0.9)';
            vc.shadowBlur = 14;
            for (const [A, B] of rimS) {
              const len = Math.hypot(B[0] - A[0], B[1] - A[1]);
              const ux = (B[0] - A[0]) / len, uy = (B[1] - A[1]) / len;
              for (const [P, sg] of [[A, -1], [B, 1]]) {
                const Q = [P[0] + sg * ux * L, P[1] + sg * uy * L];
                const gr = vc.createLinearGradient(P[0], P[1], Q[0], Q[1]);
                gr.addColorStop(0, 'rgba(200,255,240,0.9)');
                gr.addColorStop(1, 'rgba(200,255,240,0)');
                vc.globalAlpha = rA;
                vc.strokeStyle = gr;
                vc.lineWidth = 2 + 2 * clamp(zv / 0.15);
                vc.beginPath();
                vc.moveTo(P[0], P[1]);
                vc.lineTo(Q[0], Q[1]);
                vc.stroke();
              }
            }
            vc.restore();
          }
          // 3) the mark
          vc.save();
          applyXf(X);
          if (ga > 0.003) {
            vc.globalAlpha = ga;
            vc.fillStyle = dk > 0 ? cgrad(mixHex('#b3bac5', '#16272b', dk), mixHex('#939aa6', '#0b181a', dk)) : CG_GRAY;
            vc.fill(P2D.g1);
            vc.fill(P2D.g2);
            vc.fill(P2D.t);
          }
          vc.globalAlpha = pa;
          vc.fillStyle = CG_GREEN;
          vc.fill(P2D.arrow);
          vc.fill(P2D.stem);
          // the dot, matching the DOM dot (gradient + halo) so the 5.5 swap is invisible
          const HR = 130 * Math.SQRT2 * 1.25 * (1 + 0.06 * Math.sin((t - 0.5) * Math.PI * 1.6)) / K; // DOM halo: farthest-corner
          const hg = vc.createRadialGradient(DOT_VB[0], DOT_VB[1], 0, DOT_VB[0], DOT_VB[1], HR);
          hg.addColorStop(0, 'rgba(51,204,153,0.25)');
          hg.addColorStop(0.35, 'rgba(51,204,153,0.1)');
          hg.addColorStop(0.7, 'rgba(51,204,153,0)');
          vc.fillStyle = hg;
          vc.fillRect(DOT_VB[0] - HR, DOT_VB[1] - HR, HR * 2, HR * 2);
          const dg = vc.createRadialGradient(DOT_VB[0] - DOT_RVB * 0.24, DOT_VB[1] - DOT_RVB * 0.36, 0, DOT_VB[0], DOT_VB[1], DOT_RVB * 1.25);
          dg.addColorStop(0, '#5cf0c2');
          dg.addColorStop(0.55, GREEN);
          dg.addColorStop(1, '#2bb584');
          vc.fillStyle = dg;
          for (const [blur, a] of [[40, 0.12], [14, 0.4]]) {
            vc.shadowColor = `rgba(21,219,168,${a})`;
            vc.shadowBlur = blur;
            vc.beginPath();
            vc.arc(DOT_VB[0], DOT_VB[1], DOT_RVB, 0, Math.PI * 2);
            vc.fill();
          }
          vc.restore();
          // 4) rim light on the two gap edges (crisp, over the parts)
          if (rA > 0.003) {
            vc.save();
            vc.lineCap = 'round';
            vc.shadowColor = 'rgba(21,219,168,0.95)';
            vc.shadowBlur = 18;
            vc.globalAlpha = rA;
            vc.strokeStyle = '#c8fff0';
            vc.lineWidth = 2.5 + 2 * clamp(zv / 0.15);
            for (const [A, B] of rimS) {
              vc.beginPath();
              vc.moveTo(A[0], A[1]);
              vc.lineTo(B[0], B[1]);
              vc.stroke();
            }
            vc.restore();
          }
        }

        /* ---------- dust ---------- */
        dc.clearRect(0, 0, 1920, 1080);
        const gsP = (z) => 1 + (gsRaw - 1) * (1 + 0.8 * z);
        const place = (x, y, z) => {
          const g = gsP(z);
          let X = O.x + g * (x - O.x), Y = O.y + g * (y - O.y);
          if (e > 0) {
            const m = 1 + (40 * z - 1) * e;
            const dx = (X - Gs0x) * m, dy = (Y - Gs0y) * m;
            X = Gsx + cosT * dx - sinT * dy;
            Y = Gsy + sinT * dx + cosT * dy;
          }
          return [X, Y];
        };
        const fadeDive = 1 - e;
        // ambient specks (fade in with the pad; parallax depth)
        const ambA = p(t, 2.0, 3.2, 'sine.inOut') * fadeDive;
        if (ambA > 0.003) {
          dc.fillStyle = '#7ff5d3';
          for (const a of amb) {
            const x = a.x + a.v * t * a.z * 0.7 + noise(a.seed, t * 0.25) * 30;
            const y = a.y - a.v * t * a.z * 0.7 + noise(a.seed + 40, t * 0.25) * 22;
            const [X, Y] = place(x, y, a.z);
            const al = ambA * a.a * (0.6 + 0.4 * Math.sin(t * 2.3 + a.tw));
            if (al <= 0.003 || X < -10 || X > 1930 || Y < -10 || Y > 1090) continue;
            dc.globalAlpha = al;
            const r = a.size * (0.7 + 0.5 * a.z) * (1 + 2 * e);
            dc.fillRect(X - r / 2, Y - r / 2, r, r);
          }
        }
        // glyph dust
        const dustOut = 1 - p(t, DUST_END - 0.3, DUST_END, 'power1.in');
        if (t >= T_DIS && t < DUST_END) {
          for (let pass = 0; pass < 2; pass++) {
            dc.fillStyle = dc.strokeStyle = pass === 0 ? '#2ee6b4' : '#ffffff';
            dc.lineCap = 'round';
            for (const q of dust) {
              const age = t - q.t0;
              if (age <= 0 || age >= q.life) continue;
              const dd = q.v * age + 0.5 * q.acc * age * age;
              const sw = 7 * age;
              const x = q.x0 + Math.cos(q.ang) * dd + noise(q.seed, age * 1.2) * sw;
              const y = q.y0 + Math.sin(q.ang) * dd + noise(q.seed + 50, age * 1.2) * sw;
              let al;
              if (q.linger) al = Math.min(1, age / 0.2) * (1 - inv(age, q.life * 0.45, q.life)) * 0.55 * (0.65 + 0.35 * Math.sin(t * 3 + q.seed));
              else al = Math.min(1, age / 0.05) * (1 - E('power1.in')(inv(age, q.life * 0.35, q.life)));
              const white = 1 - clamp(age / 0.18);
              al *= pass === 0 ? 0.85 * (1 - white * 0.6) : white;
              al *= fadeDive * dustOut;
              if (al <= 0.004) continue;
              const [X, Y] = place(x, y, q.z);
              if (X < -10 || X > 1930 || Y < -10 || Y > 1090) continue;
              dc.globalAlpha = clamp(al);
              const r = q.size * (1 + 2.5 * e);
              // motion-blurred along the 45° lift: streak length ∝ current speed
              const len = q.linger ? 0 : clamp((q.v + q.acc * age) * 0.028, 0, 18) * (0.55 + 0.35 * q.z);
              if (len < 2) { dc.fillRect(X - r / 2, Y - r / 2, r, r); continue; }
              dc.lineWidth = r * 0.75;
              dc.beginPath();
              dc.moveTo(X, Y);
              dc.lineTo(X - Math.cos(q.ang) * len, Y - Math.sin(q.ang) * len);
              dc.stroke();
            }
          }
        }
        dc.globalAlpha = 1;
        dustCv.style.display = t >= 2.0 ? 'block' : 'none';
      },
    };
  },
});
