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
   backdrop gets an even-odd clip-path hole shaped like the arrow/stem gap
   (opened like a blade, lit, rim-lit), so S6 is seen THROUGH the gap until
   ×40 fills the frame; then backdrop and parts fade into the 22.0 flash.
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
    // motion smear: N copies spaced evenly in distance between now and 0.075 s ago
    const TRAIL_N = 12, TRAIL_LAG = 0.075;
    const TRAILS = Array.from({ length: TRAIL_N }, (_, j) => j);
    const fillOf = (k) => (k === 'arrow' || k === 'stem' ? 'url(#pf-green)' : 'url(#pf-gray)');
    const trailG = s('g', {}, svg);
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
    const CPS = 38, T_TYPE = 0.625, T_DIS = 2.4, DIS_STAG = 0.012;
    let nonSpace = 0;
    const charInfo = chars.map((sp, i) => {
      const space = TXT[i] === ' ';
      const info = { sp, space, ti: T_TYPE + i / CPS, x: sp.offsetLeft, w: sp.offsetWidth, di: space ? -1 : nonSpace };
      if (!space) nonSpace++;
      info.td = T_DIS + Math.max(0, info.di) * DIS_STAG;
      return info;
    });

    /* ---------- dust: glyph-sampled particles + ambient specks ---------- */
    const R = GTR.rng('pf-dust');
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
      const STEP = 3;
      for (let y = 0; y < chh; y += STEP) {
        for (let x = 0; x < cw; x += STEP) {
          if (img[(y * cw + x) * 4 + 3] < 110) continue;
          const lx = x - PADX;
          const ci = charInfo.find((c) => !c.space && lx >= c.x - 1 && lx < c.x + c.w + 1);
          if (!ci) continue;
          const linger = R() < 0.13;
          dust.push({
            x0: TX_X + lx + (R() - 0.5) * 2, y0: TX_BASE - PADY + y + (R() - 0.5) * 2,
            t0: ci.td + ((lx - ci.x) / Math.max(1, ci.w)) * 0.07 + R() * 0.05,
            v: linger ? 20 + R() * 40 : 110 + R() * 260,
            acc: linger ? 0 : 380 + R() * 620,
            ang: -Math.PI / 4 + (R() - 0.5) * 0.9,
            life: linger ? 2.6 + R() * 1.4 : 0.5 + R() * 0.7,
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
    // portal = the 45° gap between the green arrow and the stem (viewBox), with pointed tips
    // running into the neighbouring channels; opened like a blade (across-axis scaled by w)
    const PORTAL = [[497.04, 127.13], [523.04, 123.14], [497.04, 171.15], [448.82, 219.37], [417.82, 228.36], [448.82, 175.35]];
    const RIMS = [[[497.04, 127.13], [448.82, 175.35]], [[497.04, 171.15], [448.82, 219.37]]];
    const SQ = Math.SQRT1_2;
    const portalVB = (w) => PORTAL.map(([x, y]) => {
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
    ctx.cue('blip', 3.75, { freq: 2000 });
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
      const r = lerp(DOT_R0, DOT_R, p(t, 2.4, 2.65, 'expo.out'));
      return { x: lerp(960, PX, m), y: lerp(540, PY, m), r, sc: t < 0.5 ? 0 : p(t, 0.5, 0.8, 'back.out(3)') };
    };
    const sheenC = (t) => lerp(MX0 + 285 - 180, MX1 + WM_Y + 40 + 200, p(t, T_LOCK, T_LOCK + 0.5, 'power2.inOut'));

    return {
      update(local) {
        const t = local;
        const gsRaw = gsAt(Math.min(t, T_DIVE));
        group.style.transform = `scale(${gsRaw})`;

        /* gate-dive transform (vb → screen), shared by the canvas, the portal clip and the dust */
        const T_FULL = 5.95;
        const e = t >= T_DIVE ? E('expo.in')(inv(t, T_DIVE, T_FULL)) : 0;
        const over = Math.max(0, t - T_FULL) * 600;          // keep diving past ×40 until the cut
        const gs5 = gsAt(T_DIVE);
        const Gs0x = O.x + gs5 * (GX - O.x), Gs0y = O.y + gs5 * (GY - O.y);
        const Gsx = lerp(Gs0x, 960, e), Gsy = lerp(Gs0y, 540, e);
        const th = (-12 * Math.PI / 180) * e;
        const cosT = Math.cos(th), sinT = Math.sin(th);
        const SD = K * gs5 * (lerp(1, 40, e) + over);
        const vb2s = (x, y) => {
          const dx = (x - G_VB[0]) * SD, dy = (y - G_VB[1]) * SD;
          return [Gsx + cosT * dx - sinT * dy, Gsy + sinT * dx + cosT * dy];
        };
        const diveOn = t >= T_DIVE;
        const portalW = p(t, T_DIVE, 5.72, 'power2.out');

        /* backdrop + pads (portal cut out during the dive) */
        const bOp = 1 - p(t, 5.8, 5.95, 'power1.in');
        vis(bgWrap, bOp);
        if (diveOn && portalW > 0.001) {
          const pts = portalVB(portalW).map(([x, y]) => vb2s(x, y));
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
            const q = p(t, c.td, c.td + 0.28, 'power2.in');
            vis(c.sp, 1 - p(t, c.td, c.td + 0.18, 'power1.in'));
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
            const past = offAt(k, t - TRAIL_LAG);
            const dist = Math.hypot(past[0] - o[0], past[1] - o[1]);
            TRAILS.forEach((j) => {
              const f = (j + 1) / TRAIL_N;
              const ot = [lerp(o[0], past[0], f), lerp(o[1], past[1], f)];
              const ta = 0.17 * Math.pow(1 - f, 1.3) * partOp(k, t - TRAIL_LAG * f) * clamp(dist / 30);
              tr(P.trails[j], ot);
              P.trails[j].style.opacity = ta;
              P.trails[j].style.display = ta > 0.003 ? '' : 'none';
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
            const t0 = 3.5 + j * 0.022;
            const q = p(t, t0, t0 + 0.3, 'power3.out');
            vis(sp, p(t, t0, t0 + 0.18, 'power1.out'));
            sp.style.transform = `translateY(${((1 - q) * 34).toFixed(2)}px)`;
            sp.style.filter = q < 0.999 ? `blur(${((1 - q) * 6).toFixed(2)}px)` : '';
          });
          const w = p(t, 3.75, 4.05, 'power2.inOut');
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
          const pa = 1 - p(t, 5.82, 5.98, 'power1.in');
          vc.save();
          vc.translate(Gsx, Gsy);
          vc.rotate(th);
          vc.scale(SD, SD);
          vc.translate(-G_VB[0], -G_VB[1]);
          // light spilling through the opening gap (under the parts)
          const lA = p(t, T_DIVE, 5.6, 'power2.out') * (1 - p(t, 5.66, 5.9, 'power1.in'));
          if (lA > 0.003 && portalW > 0.001) {
            const pv = portalVB(portalW);
            vc.beginPath();
            pv.forEach(([x, y], i) => (i ? vc.lineTo(x, y) : vc.moveTo(x, y)));
            vc.closePath();
            const hw = 22.01 * portalW;
            const lg = vc.createLinearGradient(G_VB[0] - hw * SQ, G_VB[1] - hw * SQ, G_VB[0] + hw * SQ, G_VB[1] + hw * SQ);
            lg.addColorStop(0, 'rgba(21,219,168,0.75)');
            lg.addColorStop(0.5, 'rgba(236,255,249,1)');
            lg.addColorStop(1, 'rgba(21,219,168,0.75)');
            vc.globalAlpha = lA;
            vc.fillStyle = lg;
            vc.fill();
          }
          vc.globalAlpha = pa;
          for (const k of KEYS) {
            vc.fillStyle = k === 'arrow' || k === 'stem' ? CG_GREEN : CG_GRAY;
            vc.fill(P2D[k]);
          }
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
          // rim light on the two gap edges
          const rA = p(t, T_DIVE, 5.6, 'power2.out') * (1 - p(t, 5.7, 5.88, 'power1.in'));
          if (rA > 0.003) {
            vc.save();
            vc.globalAlpha = rA;
            vc.strokeStyle = '#c8fff0';
            vc.lineWidth = 2.5;
            vc.lineCap = 'round';
            vc.shadowColor = 'rgba(21,219,168,0.95)';
            vc.shadowBlur = 18;
            for (const [a, b] of RIMS) {
              const A = vb2s(a[0], a[1]), B = vb2s(b[0], b[1]);
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
        if (t >= T_DIS) {
          for (let pass = 0; pass < 2; pass++) {
            dc.fillStyle = pass === 0 ? '#2ee6b4' : '#ffffff';
            for (const q of dust) {
              const age = t - q.t0;
              if (age <= 0 || age >= q.life) continue;
              const dd = q.v * age + 0.5 * q.acc * age * age;
              const sw = 16 * age;
              const x = q.x0 + Math.cos(q.ang) * dd + noise(q.seed, age * 1.2) * sw;
              const y = q.y0 + Math.sin(q.ang) * dd + noise(q.seed + 50, age * 1.2) * sw;
              let al;
              if (q.linger) al = Math.min(1, age / 0.25) * (1 - inv(age, q.life - 0.9, q.life)) * 0.5 * (0.65 + 0.35 * Math.sin(t * 3 + q.seed));
              else al = Math.pow(1 - age / q.life, 1.4);
              const white = 1 - clamp(age / 0.3);
              al *= pass === 0 ? 1 - white * 0.6 : white;
              al *= fadeDive;
              if (al <= 0.004) continue;
              const [X, Y] = place(x, y, q.z);
              if (X < -10 || X > 1930 || Y < -10 || Y > 1090) continue;
              dc.globalAlpha = clamp(al);
              const r = q.size * (1 + 2.5 * e);
              dc.fillRect(X - r / 2, Y - r / 2, r, r);
            }
          }
        }
        dc.globalAlpha = 1;
        dustCv.style.display = t >= 2.0 ? 'block' : 'none';
      },
    };
  },
});
