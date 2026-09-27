/* ============================================================
   S4 · dor-sumiu — ERRO 04 · CLIENTE OURO SUMIU + the collapse     [12–16 global]
   (STORYBOARD.md §2 S4, §1.6 chip, §1.7 Revenda Bella card — dark version)
   Hand-off in: S3's full-frame #000c0d overlay at .85 lifts (0–0.4) while the
   Revenda Bella card rises out of the dark. Her "Compras por mês" bars deflate
   on 16ths (3.200 → 0), leaving dashed ghosts of the missing money; "E ninguém
   percebeu." lands, a "há 4 meses sem comprar" sticker slaps the corner, the
   gold ring drains to gray (gold motes leak away), the card recedes, chip 04
   stamps into the log. Then critical failure: the four chips leave the log and
   stack at centre (×1.6) over a 20 % world, red brackets lock on, the frame
   tears (0.4 → 1) under red strobes. Hard cut to black (S5).
   Structure (back → front):
     ovl (S3 hand-off) · tearWrap › [ camera view › world (flat) › rig › glows · dust · card · sticker ]
                                     dim · hud (scrim, headline) · stackFx (glow, brackets) · chips
     strobe · torn-bars canvas
   tl = headline reveal/hide only; update() = everything else (pure fn of time).
   ============================================================ */
GTR.scene({
  id: 'dor-sumiu',
  build(root, ctx) {
    const { h, s, p, inv, clamp, lerp, noise, rng, fract, fmt } = GTR;
    const RED = '#ef4444', GOLD = '#f3b315';
    const FONT_UI = "'Inter', system-ui, sans-serif";
    const CARD = { x: 580, y: 180, w: 760, h: 440 };
    const CX = CARD.x + CARD.w / 2, CY = CARD.y + CARD.h / 2;       // 960, 400
    const PERSP = 1400;
    const AV = { x: CARD.x + 40 + 64, y: CARD.y + 40 + 64, r: 64 };  // avatar ring centre (screen px)

    /* ============================================================ S3 HAND-OFF OVERLAY */
    const ovl = h('div', { style: { position: 'absolute', inset: '0', background: '#000c0d', opacity: 0.85 } }, root);

    /* ============================================================ WORLD */
    const tearWrap = h('div', { style: { position: 'absolute', inset: '0' } }, root);
    const cam = KIT.camera(tearWrap, { perspective: PERSP });
    cam.world.style.transformStyle = 'flat';                        // 2D camera (translate / rotateZ / scale)
    const rig = h('div', { style: { position: 'absolute', left: '0', top: '0', width: '1920px', height: '1080px', transformOrigin: `${CX}px ${CY}px` } }, cam.world);
    const glowGold = GTR.glow(rig, { x: CX, y: CY, r: 560, color: '243,179,21', a: 0.15 });
    const glowRed = GTR.glow(rig, { x: CX, y: CY + 40, r: 700, color: '239,68,68', a: 0.3 });
    const { canvas: dustC, ctx: dc } = GTR.canvas(rig);

    /* ---- the Revenda Bella card (dark glass 760×440) ---- */
    const card = h('div', { style: {
      position: 'absolute', left: `${CARD.x}px`, top: `${CARD.y}px`, width: `${CARD.w}px`, height: `${CARD.h}px`, borderRadius: '24px', overflow: 'hidden',
      background: 'linear-gradient(180deg, rgba(255,255,255,.075), rgba(255,255,255,.02)), rgba(7,20,20,.9)',
      border: '1px solid rgba(255,255,255,.12)', color: '#fff', fontFamily: FONT_UI,
      boxShadow: '0 40px 120px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,.08)',
    } }, rig);
    const goldEdge = h('div', { style: { position: 'absolute', left: '0', right: '0', top: '0', height: '2px',
      background: 'linear-gradient(90deg, rgba(243,179,21,0) 4%, #f3b315 30%, #fde68a 50%, #f3b315 70%, rgba(243,179,21,0) 96%)', boxShadow: '0 0 18px rgba(243,179,21,.6)' } }, card);
    const goldWash = h('div', { style: { position: 'absolute', left: '0', top: '0', width: '420px', height: '300px',
      background: 'radial-gradient(closest-side, rgba(243,179,21,.16), rgba(243,179,21,0))', transform: 'translate(-110px,-110px)' } }, card);
    const sheen = h('div', { style: { position: 'absolute', left: '0', top: '-200px', width: '180px', height: '900px', opacity: 0,
      background: 'linear-gradient(90deg, rgba(255,236,170,0), rgba(255,236,170,.10) 50%, rgba(255,236,170,0))' } }, card);

    // avatar (120) inside a 3 px gold ring
    const avRing = h('div', { style: { position: 'absolute', left: '40px', top: '40px', width: '128px', height: '128px', borderRadius: '50%', padding: '1px',
      border: `3px solid ${GOLD}`, boxShadow: '0 0 24px rgba(243,179,21,.55)' } }, card);
    const av = KIT.avatar(avRing, { text: 'RB', size: 120, bg: 'linear-gradient(135deg,#f3b315,#a16207)' });
    Object.assign(av.style, { fontWeight: 800, fontSize: '46px', letterSpacing: '-0.02em', fontFamily: FONT_UI,
      boxShadow: 'inset 0 2px 0 rgba(255,255,255,.35), inset 0 -14px 28px rgba(120,53,15,.35)', textShadow: '0 2px 8px rgba(120,53,15,.45)' });

    // name · tier chip · line · last purchase
    const nameRow = h('div', { style: { position: 'absolute', left: '196px', top: '44px', display: 'flex', alignItems: 'center', gap: '16px', whiteSpace: 'nowrap' } }, card);
    h('div', { style: { fontSize: '40px', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: '48px' } }, nameRow).textContent = 'Revenda Bella';
    const tier = h('div', { style: { display: 'inline-flex', alignItems: 'center', gap: '7px', height: '34px', padding: '0 14px 0 10px', borderRadius: '999px',
      background: 'rgba(243,179,21,.18)', border: '1px solid rgba(243,179,21,.35)', color: '#f5c542', fontSize: '18px', fontWeight: 700 } }, nameRow);
    tier.innerHTML = '<span class="emoji" style="font-size:19px;line-height:1">🏅</span><span>Ouro</span>';
    h('div', { style: { position: 'absolute', left: '196px', top: '104px', fontSize: '20px', fontWeight: 500, color: 'rgba(255,255,255,.64)', whiteSpace: 'nowrap' } }, card)
      .textContent = 'Cliente desde 2024 · comprava todo mês';
    const last = h('div', { style: { position: 'absolute', left: '196px', top: '138px', display: 'inline-flex', alignItems: 'center', gap: '8px', height: '30px', padding: '0 12px',
      borderRadius: '8px', background: 'rgba(255,255,255,.06)', color: 'rgba(255,255,255,.55)', fontSize: '15px', fontWeight: 600, whiteSpace: 'nowrap' } }, card);
    last.innerHTML = GTR.iconSVG('calendar', { size: 16, sw: 2.2 }) + '<span>Última compra: maio/2026</span>';

    // chart header
    const hdr = h('div', { style: { position: 'absolute', left: '40px', right: '40px', top: '200px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' } }, card);
    const hl = h('div', { style: { display: 'flex', alignItems: 'center', gap: '9px', fontSize: '16px', fontWeight: 600, color: 'rgba(255,255,255,.78)' } }, hdr);
    hl.innerHTML = GTR.iconSVG('chart-column', { size: 18, color: 'rgba(255,255,255,.55)' }) + '<span>Compras por mês</span>';
    const hr = h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 500, color: 'rgba(255,255,255,.45)' } }, hdr);
    const legendSw = h('span', { style: { display: 'inline-block', width: '16px', height: '12px', borderRadius: '3px', border: '1.5px dashed rgba(248,113,113,.8)' } }, hr);
    h('span', {}, hr).textContent = 'esperado';

    // chart (680 × 150): 8 manual bars, ghosts, values, months
    const CH = { x: 40, y: 230, w: 680, h: 146 };
    const EH = 118;                                                   // bar height of R$ 3.200
    const GAP = 22, BW = (CH.w - 7 * GAP) / 8;
    const VALS = [3200, 2700, 1900, 900, 0, 0, 0, 0];
    const MONTHS = ['fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set'];
    const chart = h('div', { style: { position: 'absolute', left: `${CH.x}px`, top: `${CH.y}px`, width: `${CH.w}px`, height: `${CH.h}px` } }, card);
    h('div', { style: { position: 'absolute', left: '0', right: '0', bottom: '0', height: '1px', background: 'rgba(255,255,255,.14)' } }, chart);
    const bars = VALS.map((v, i) => {
      const x = i * (BW + GAP);
      const ghost = h('div', { style: { position: 'absolute', left: `${x}px`, bottom: '0', width: `${BW}px`, height: `${EH}px`, borderRadius: '9px 9px 3px 3px', opacity: 0,
        border: '1.5px dashed rgba(248,113,113,.75)', background: 'repeating-linear-gradient(135deg, rgba(239,68,68,.13) 0 5px, rgba(239,68,68,0) 5px 11px)' } }, chart);
      const bar = h('div', { style: { position: 'absolute', left: `${x}px`, bottom: '0', width: `${BW}px`, height: `${EH}px`, borderRadius: '9px 9px 3px 3px', transformOrigin: '50% 100%' } }, chart);
      const val = h('div', { style: { position: 'absolute', left: `${x - 10}px`, width: `${BW + 20}px`, textAlign: 'center', fontSize: '15px', fontWeight: 700, letterSpacing: '-0.01em',
        fontVariantNumeric: 'tabular-nums', color: 'rgba(255,255,255,.8)', whiteSpace: 'nowrap' } }, chart);
      const mon = h('div', { style: { position: 'absolute', left: `${x}px`, top: `${CH.h + 10}px`, width: `${BW}px`, textAlign: 'center', fontSize: '15px', fontWeight: 600, color: 'rgba(255,255,255,.5)' } }, chart);
      mon.textContent = MONTHS[i];
      return { v, ghost, bar, val, mon, t0: 0.25 + i * 0.125, lastTxt: '' };
    });

    /* ---- "há 4 meses sem comprar" sticker on the card's top-right corner ---- */
    const PILL = { x: CARD.x + CARD.w - 64, y: CARD.y + 4 };
    const pillPulse = KIT.pulse(rig, { x: PILL.x, y: PILL.y, r: 180, color: RED, sw: 3 });
    // heartbeat (2.0 / 2.18): the client's last pulse rings off the draining avatar
    const hbPulse = [0, 1].map(() => KIT.pulse(rig, { x: AV.x, y: AV.y, r: 170, color: 'rgba(248,113,113,.9)', sw: 2 }));
    const pill = h('div', { style: { position: 'absolute', left: `${PILL.x}px`, top: `${PILL.y}px`, display: 'inline-flex', alignItems: 'center', gap: '10px',
      padding: '0 20px 0 16px', height: '50px', borderRadius: '999px', whiteSpace: 'nowrap', fontFamily: FONT_UI, fontSize: '20px', fontWeight: 700, letterSpacing: '0.005em',
      background: 'linear-gradient(rgba(239,68,68,.16),rgba(239,68,68,.16)), #170b0c', border: '1.5px solid rgba(239,68,68,.7)', color: '#fca5a5',
      boxShadow: '0 16px 40px rgba(0,0,0,.5), 0 0 34px rgba(239,68,68,.35)', opacity: 0, transformOrigin: '50% 50%' } }, rig);
    pill.innerHTML = GTR.iconSVG('clock', { size: 21, sw: 2.4 }) + '<span>há 4 meses sem comprar</span>';

    /* ============================================================ HUD: headline */
    const hud = h('div', { style: { position: 'absolute', inset: '0' } }, tearWrap);
    const scrim = h('div', { style: { position: 'absolute', left: '0', right: '0', bottom: '0', height: '380px', opacity: 0,
      background: 'linear-gradient(0deg, rgba(0,21,22,.9) 0%, rgba(0,21,22,0) 100%)' } }, hud);
    const title = KIT.headline(hud, 'E ninguém *percebeu*.', { size: 116, x: 960, y: 860, w: 1500, split: 'words', lh: 1.05 });
    const em = title.el.querySelector('.kit-em');
    const RED_GLOW = '0 0 30px rgba(239,68,68,.5)';
    em.style.color = RED;
    em.style.textShadow = RED_GLOW;
    title.el.dataset.baseTransform = 'translateY(-50%)';
    title.units.forEach((u) => { u.style.willChange = 'auto'; });

    /* ============================================================ DIM ("everything else to 20 %": world + headline) */
    const dim = h('div', { style: { position: 'absolute', inset: '0', background: '#000c0d', opacity: 0 } }, tearWrap);

    /* ============================================================ STACK FX (above the dim) */
    const stackFx = h('div', { style: { position: 'absolute', inset: '0' } }, tearWrap);
    const stackGlow = GTR.glow(stackFx, { x: 960, y: 540, r: 640, color: '239,68,68', a: 0.3 });
    stackGlow.style.opacity = 0;
    const bsvg = s('svg', { width: 1920, height: 1080, viewBox: '0 0 1920 1080', style: { position: 'absolute', left: '0', top: '0', overflow: 'visible' } }, stackFx);
    bsvg.style.filter = 'drop-shadow(0 0 10px rgba(239,68,68,.8))';
    const brackets = [0, 1, 2, 3].map(() => s('path', { fill: 'none', stroke: '#f87171', 'stroke-width': 3, 'stroke-linecap': 'square', opacity: 0 }, bsvg));
    const scanLine = h('div', { style: { position: 'absolute', left: '0', top: '0', width: '1px', height: '2px', opacity: 0,
      background: 'linear-gradient(90deg, rgba(239,68,68,0), rgba(252,165,165,.9) 50%, rgba(239,68,68,0))', boxShadow: '0 0 14px rgba(239,68,68,.8)' } }, stackFx);

    /* ============================================================ CHIPS (the Act I log) */
    const chipLayer = h('div', { style: { position: 'absolute', inset: '0' } }, tearWrap);
    const CHIP_DEF = [
      ['01', 'SEM RESPOSTA', 'RESPONDIDO'], ['02', 'NÚMERO BANIDO', 'API OFICIAL'],
      ['03', 'SEM RASTREIO', 'RASTREADO'], ['04', 'CLIENTE OURO SUMIU', 'CLIENTE NA MIRA'],
    ];
    const STACK_Y = [402, 494, 586, 678];
    const SC = 1.6;
    const chips = CHIP_DEF.map(([n, err, ok], i) => {
      const wrap = h('div', { style: { position: 'absolute', inset: '0' } }, chipLayer);
      const c = KIT.diagChip(wrap, { n, err, ok, x: 120, y: 96 + i * 58 });
      const w = c.el.offsetWidth;                                     // measured once (fonts are loaded before build)
      return { c, wrap, w, y0: 96 + i * 58, x1: 960 - (w * SC) / 2, y1: STACK_Y[i] - 23, t0: 3.0 + (3 - i) * 0.06 };   // 04 leads: no chip crosses another
    });
    const maxW = Math.max(...chips.map((q) => q.w)) * SC;
    const BR = { x0: 960 - maxW / 2 - 56, x1: 960 + maxW / 2 + 56, y0: STACK_Y[0] - 37 - 42, y1: STACK_Y[3] + 37 + 42, arm: 54 };

    /* ============================================================ STROBE + TEAR */
    const strobe = h('div', { style: { position: 'absolute', inset: '0', background: 'rgb(239,68,68)', opacity: 0, display: 'none' } }, root);
    const fsvg = s('svg', { width: 0, height: 0, style: { position: 'absolute', left: '0', top: '0' } }, root);
    const filt = s('filter', { id: 'ds-tear', x: '-5%', y: '0%', width: '110%', height: '100%', 'color-interpolation-filters': 'sRGB' }, fsvg);
    const turb = s('feTurbulence', { type: 'fractalNoise', baseFrequency: '0.0006 0.038', numOctaves: 1, seed: 1, result: 'n' }, filt);
    const ct = s('feComponentTransfer', { in: 'n', result: 'bands' }, filt);
    s('feFuncR', { type: 'discrete', tableValues: '0.5 0.5 0.18 0.5 0.5 0.82 0.5 0.3 0.5 0.7 0.5 0.5' }, ct);
    s('feFuncG', { type: 'linear', slope: 0, intercept: 0.5 }, ct);
    const disp = s('feDisplacementMap', { in: 'SourceGraphic', in2: 'bands', scale: 0, xChannelSelector: 'R', yChannelSelector: 'G', result: 'd' }, filt);
    s('feColorMatrix', { in: 'd', type: 'matrix', values: '1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0', result: 'r' }, filt);
    const offR = s('feOffset', { in: 'r', dx: 0, dy: 0, result: 'ro' }, filt);
    s('feColorMatrix', { in: 'd', type: 'matrix', values: '0 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0', result: 'gb' }, filt);
    const offGB = s('feOffset', { in: 'gb', dx: 0, dy: 0, result: 'gbo' }, filt);
    s('feBlend', { in: 'ro', in2: 'gbo', mode: 'screen' }, filt);
    const { canvas: tearC, ctx: tc } = GTR.canvas(root, { z: 70, style: { pointerEvents: 'none' } });
    const TEAR_COLS = ['#000c0d', 'rgba(239,68,68,.5)', 'rgba(21,219,168,.35)'];

    /* ============================================================ GOLD MOTES (the client leaking away) */
    const DR = rng('dor-sumiu:dust');
    // soft glow sprites (gold and ash gray), cross-faded per mote as it ages
    const sprite = (rgb) => {
      const cv = document.createElement('canvas');
      cv.width = cv.height = 64;
      const g2 = cv.getContext('2d');
      const gr = g2.createRadialGradient(32, 32, 0, 32, 32, 32);
      gr.addColorStop(0, `rgba(${rgb},1)`);
      gr.addColorStop(0.16, `rgba(${rgb},.95)`);
      gr.addColorStop(0.34, `rgba(${rgb},.28)`);
      gr.addColorStop(1, `rgba(${rgb},0)`);
      g2.fillStyle = gr;
      g2.fillRect(0, 0, 64, 64);
      return cv;
    };
    const SPR_GOLD = sprite('253,214,90'), SPR_ASH = sprite('170,176,186');
    const MOTES = Array.from({ length: 110 }, () => {
      const a = DR() * Math.PI * 2;
      return { te: 1.45 + DR() * 1.0, a, sp: 26 + DR() * 70, up: 40 + DR() * 80, life: 0.9 + DR() * 0.9, r: 1.3 + DR() * 2.4, ph: DR() * 50 };
    });

    /* ============================================================ TIMELINE (DOM reveals only) */
    const tl = ctx.tl({ defaults: { ease: 'power3.out', force3D: false } });
    KIT.revealWords(tl, title.units, 1.0, { y: 64, blur: 14, dur: 0.6, stagger: 0.09 });
    KIT.hideUnits(tl, title.units, 3.0, { y: -30, dur: 0.24, stagger: 0.025, blur: 10, ease: 'power1.in' });
    tl.set({}, {}, 4.0);

    /* ============================================================ SFX */
    // falling blips — one per bar as it deflates (16ths, 0.25 → 1.125), 1200 Hz → 400 Hz
    for (let i = 0; i < 8; i++) ctx.cue('blip', 0.25 + i * 0.125, { freq: Math.round(1200 * Math.pow(1 / 3, i / 7)), db: -4, pan: -0.35 + i * 0.1 });
    ctx.cue('impact', 1.0, { size: 0.6 });
    ctx.cue('error', 1.5, { db: -6 });
    ctx.cue('heartbeat', 2.0);
    ctx.cue('tick', 2.5);
    ctx.cue('glitch', 3.0, { dur: 0.2 });
    ctx.cue('glitch', 3.25, { dur: 0.2 });
    [3.5, 3.625, 3.75, 3.875].forEach((tt, i) => ctx.cue('glitch', tt, { dur: 0.08, pan: i % 2 ? 0.5 : -0.5 }));

    /* ============================================================ helpers */
    const burst = (t, t0, k) => (t >= t0 ? Math.exp(-(t - t0) / k) : 0);
    const mix = (a, b, k) => a.map((v, i) => Math.round(lerp(v, b[i], k)));
    const TEAL = [56, 204, 156], AMBER = [245, 158, 11], REDC = [239, 68, 68];
    const barCol = (f) => (f >= 0.5 ? mix(AMBER, TEAL, (f - 0.5) / 0.5) : mix(REDC, AMBER, f / 0.5));
    const spike = (t, t0, d) => (t >= t0 && t < t0 + d ? Math.pow(1 - (t - t0) / d, 2) : 0);
    const STROBES = [3.5, 3.625, 3.75, 3.875];

    return {
      tl,
      update(local, g) {
        const t = Math.max(0, local);

        /* ---- S3 hand-off overlay lifts ---- */
        const ov = 0.85 * (1 - p(t, 0, 0.4, 'power2.out'));
        ovl.style.opacity = ov;
        ovl.style.display = ov > 0.002 ? 'block' : 'none';

        /* ---- camera: arrival settle, slow push, handheld shake (DOR) ---- */
        const hb = burst(t, 2.0, 0.07) + 0.7 * burst(t, 2.18, 0.07);          // heartbeat lub-dub
        const A = 3 + 5 * burst(t, 1.0, 0.14) + 4 * burst(t, 1.5, 0.12) + 5 * hb
          + 19 * p(t, 3.0, 3.5, 'power2.in') + 8 * spike(t, 3.0, 0.2) + 8 * spike(t, 3.25, 0.2);
        const shx = noise(g * 8 + 0.37) * A * 1.4, shy = noise(g * 8 + 50.37) * A * 1.4, shr = noise(g * 5 + 9.37) * A * 0.03;
        const camS = lerp(0.965, 1, p(t, 0, 0.9, 'power3.out')) + 0.03 * p(t, 0.9, 3.0, 'sine.inOut') + 0.012 * hb;
        cam.set({ x: shx, y: shy, rz: shr, s: camS });

        /* ---- card rig: rise (0–0.45), float, recede (2.0–2.5) ---- */
        const rise = p(t, 0, 0.45, 'power3.out');
        const rec = p(t, 2.0, 2.5, 'power2.inOut');
        const z = -500 * rec;
        const k = PERSP / (PERSP - z);
        const fx = noise(g * 0.35 + 4.1) * 8, fy = noise(g * 0.35 + 21.7) * 6;
        const ty = 40 * (1 - rise) + (540 - CY) * (1 - k) + fy;
        rig.style.transform = rec > 0.0005
          ? `translate(${fx.toFixed(2)}px, ${ty.toFixed(2)}px) perspective(${PERSP}px) translateZ(${z.toFixed(1)}px) rotateX(${(9 * rec).toFixed(2)}deg)`
          : `translate(${fx.toFixed(2)}px, ${ty.toFixed(2)}px)`;
        rig.style.opacity = clamp(inv(t, 0, 0.4)) * lerp(1, 0.35, rec);
        const cb = 10 * (1 - rise);
        card.style.filter = cb > 0.05 ? `saturate(.7) blur(${cb.toFixed(2)}px)` : 'saturate(.7)';
        const sh = inv(t, 0.3, 1.05);
        sheen.style.opacity = sh > 0 && sh < 1 ? Math.sin(Math.PI * sh) : 0;
        sheen.style.transform = `translateX(${lerp(-260, 900, GTR.E('power2.inOut')(sh))}px) rotate(45deg)`;

        /* ---- bars deflate on 16ths (0.25 + i·0.125) ---- */
        let lost = 0;
        for (const b of bars) {
          const q = p(t, b.t0, b.t0 + 0.34, 'expo.out');
          const v = lerp(3200, b.v, q);
          const f = v / 3200;
          const hpx = Math.max(EH * f, b.v === 0 ? 4 * q : 0);
          const col = barCol(f);
          const pulse = b.v === 3200 ? 0.07 * burst(t, b.t0, 0.09) * (t >= b.t0 ? 1 : 0) : 0;
          b.bar.style.height = `${hpx.toFixed(2)}px`;
          b.bar.style.transform = `scaleY(${1 + pulse})`;
          b.bar.style.background = `linear-gradient(180deg, rgb(${mix(col, [255, 255, 255], 0.22)}) 0%, rgb(${col}) 70%)`;
          b.bar.style.boxShadow = `0 0 22px rgba(${col},.35), inset 0 1px 0 rgba(255,255,255,.3)`;
          const loss = 1 - f;
          lost += loss;
          b.ghost.style.opacity = loss > 0.001 ? Math.pow(loss, 0.6) * (0.75 + 0.25 * (t > 1.5 ? Math.exp(-fract(g * 2) * 5) : 1)) : 0;
          const txt = fmt.int(Math.round(v / 10) * 10);
          if (txt !== b.lastTxt) { b.val.textContent = txt; b.lastTxt = txt; }
          b.val.style.bottom = `${(hpx + 8).toFixed(2)}px`;
          b.val.style.color = f < 0.02 ? '#f87171' : 'rgba(255,255,255,.82)';
          b.mon.style.color = b.v === 0 && q > 0.5 ? 'rgba(248,113,113,.9)' : 'rgba(255,255,255,.5)';
        }
        legendSw.style.opacity = clamp(lost / 2);

        /* ---- 1.5: sticker snaps; gold drains 1.5–2.3 ---- */
        const ps = p(t, 1.5, 1.74, 'back.out(2.2)');
        pill.style.opacity = clamp(inv(t, 1.5, 1.54));
        pill.style.transform = `translate(-50%, -50%) rotate(${lerp(-12, -4, ps).toFixed(2)}deg) scale(${(t < 1.5 ? 1.7 : lerp(1.7, 1, ps)).toFixed(4)})`;
        pillPulse.set(inv(t, 1.52, 1.95));
        hbPulse[0].set(inv(t, 2.0, 2.45));
        hbPulse[1].set(inv(t, 2.18, 2.63));
        const dr = p(t, 1.5, 2.3, 'power1.inOut');
        avRing.style.filter = dr > 0.001 ? `grayscale(${dr.toFixed(3)}) brightness(${lerp(1, 0.72, dr).toFixed(3)})` : 'none';
        avRing.style.boxShadow = `0 0 24px rgba(243,179,21,${(0.55 * (1 - dr)).toFixed(3)})`;
        avRing.style.opacity = lerp(1, 0.7, dr);
        tier.style.opacity = lerp(1, 0.4, dr);
        goldEdge.style.opacity = 1 - dr;
        goldWash.style.opacity = 1 - dr;
        const breathe = 1 + 0.06 * Math.sin(g * 6);
        glowGold.style.opacity = lerp(1, 0.08, dr);
        glowGold.style.transform = `scale(${breathe})`;
        glowRed.style.opacity = lerp(0.35, 1, dr) * (1 + 0.5 * hb);
        glowRed.style.transform = `scale(${breathe * (1 + 0.12 * hb)})`;

        /* ---- gold motes leak off the ring (1.45 → ~3.4) ---- */
        dc.globalAlpha = 1;
        dc.clearRect(0, 0, 1920, 1080);
        if (t > 1.45 && t < 3.6) {
          for (const m of MOTES) {
            const age = t - m.te;
            if (age <= 0 || age >= m.life) continue;
            const u = age / m.life;
            const d = AV.r + 4 + m.sp * age;
            const x = AV.x + Math.cos(m.a) * d + noise(m.ph, g * 0.9) * 22 * u + 18 * age;
            const y = AV.y + Math.sin(m.a) * d - m.up * age - 30 * age * age + noise(m.ph + 7, g * 0.9) * 14 * u;
            const al = clamp(u / 0.12) * Math.pow(1 - u, 1.3) * 0.95;
            const ash = clamp(u * 1.4);
            const sz = m.r * 7;
            dc.globalAlpha = al * (1 - ash);
            dc.drawImage(SPR_GOLD, x - sz / 2, y - sz / 2, sz, sz);
            dc.globalAlpha = al * ash * 0.8;
            dc.drawImage(SPR_ASH, x - sz / 2, y - sz / 2, sz, sz);
          }
        }

        /* ---- headline: scrim, drift, glow flare on "percebeu" ---- */
        scrim.style.opacity = p(t, 0.85, 1.35, 'power2.out') * (1 - p(t, 3.0, 3.4, 'power1.in'));
        const flare = burst(t, 1.25, 0.35) * (t >= 1.25 ? 1 : 0);

        /* ---- chips: log → centre stack (3.0–3.6), 16th blink ---- */
        let fly = 0;
        for (let i = 0; i < 4; i++) {
          const q = chips[i];
          q.c.set(g, i < 3 ? 1 : inv(t, 2.5, 2.68), 0);
          const e = p(t, q.t0, q.t0 + 0.42, 'expo.out');
          q.c.place(lerp(120, q.x1, e), lerp(q.y0, q.y1, e), lerp(1, SC, e));
          if (t >= 3.0) q.c.blink(g * 4);
          const mb = t > q.t0 ? 7 * (1 - p(t, q.t0, q.t0 + 0.28, 'power2.out')) : 0;
          q.wrap.style.filter = mb > 0.05 ? `blur(${mb.toFixed(2)}px)` : 'none';
          q.c.errFace.style.boxShadow = `0 10px 30px rgba(0,0,0,.35), 0 0 ${(28 * e).toFixed(1)}px rgba(239,68,68,${(0.4 * e).toFixed(3)})`;
          fly = Math.max(fly, e);
        }

        /* ---- critical failure: dim, glow, brackets, scan ---- */
        dim.style.opacity = 0.8 * p(t, 3.0, 3.4, 'power2.out');
        const beat16 = Math.exp(-fract(g * 8) * 4);
        stackGlow.style.opacity = p(t, 3.05, 3.45, 'power2.out') * (0.7 + 0.3 * beat16);
        const bq = p(t, 3.22, 3.52, 'expo.out');
        const off = 90 * (1 - bq);
        const { x0, x1, y0, y1, arm } = BR;
        const corners = [
          [x0 - off, y0 - off, 1, 1], [x1 + off, y0 - off, -1, 1], [x1 + off, y1 + off, -1, -1], [x0 - off, y1 + off, 1, -1],
        ];
        corners.forEach(([cx, cy, sx, sy], i) => {
          brackets[i].setAttribute('d', `M${cx},${cy + sy * arm} L${cx},${cy} L${cx + sx * arm},${cy}`);
          brackets[i].setAttribute('opacity', (bq * (t > 3.52 && fract(g * 8) > 0.5 ? 0.55 : 1)).toFixed(3));
        });
        const sl = fract((t - 3.3) / 0.5);
        const slOn = t > 3.3;
        scanLine.style.opacity = slOn ? (0.8 * Math.sin(Math.PI * sl)).toFixed(3) : 0;
        scanLine.style.transform = `translate(${x0 + 10}px, ${lerp(y0 + 8, y1 - 8, sl).toFixed(1)}px) scaleX(${(x1 - x0 - 20).toFixed(1)})`;
        scanLine.style.transformOrigin = '0 0';

        /* ---- tear: two hits (3.0, 3.25), then heavy 0.4 → 1 (3.5–4.0) ---- */
        const heavy = t >= 3.5 ? lerp(0.4, 1, p(t, 3.5, 3.95, 'power1.in')) : 0;
        const amt = Math.max(heavy, 0.45 * spike(t, 3.0, 0.2), 0.45 * spike(t, 3.25, 0.2));
        const gseed = Math.floor(g * 30);
        KIT.glitch(cam.view, amt, g, 11);
        cam.view.style.clipPath = amt > 0.001 && rng(gseed + 7)() < 0.22 * amt
          ? (() => { const r = rng(gseed + 9); const a0 = Math.floor(r() * 70), a1 = a0 + 20 + Math.floor(r() * 25); return `polygon(0 ${a0}%, 100% ${a0}%, 100% ${a1}%, 0 ${a1}%)`; })()
          : '';
        KIT.glitch(title.el, amt, g, 37);
        em.style.textShadow = `${amt > 0.001 && title.el.style.textShadow ? title.el.style.textShadow + ', ' : ''}${RED_GLOW}${flare > 0.01 ? `, 0 0 ${(60 * flare).toFixed(1)}px rgba(239,68,68,${(0.6 * flare).toFixed(3)})` : ''}`;
        if (amt > 0.001) {
          const r = rng(gseed + 1);
          const ca = (5 + r() * 5) * amt;
          chipLayer.style.textShadow = `${(-ca).toFixed(1)}px 0 rgba(255,0,80,.85), ${ca.toFixed(1)}px 0 rgba(0,255,220,.8)`;
          chipLayer.style.transform = `translate(${((r() - 0.5) * 14 * amt).toFixed(1)}px, ${((r() - 0.5) * 5 * amt).toFixed(1)}px)`;
          turb.setAttribute('seed', String((gseed % 997) + 1));
          disp.setAttribute('scale', String((160 * amt).toFixed(1)));
          const cx = (8 + r() * 8) * amt;
          offR.setAttribute('dx', cx.toFixed(1));
          offGB.setAttribute('dx', (-cx).toFixed(1));
          tearWrap.style.filter = 'url(#ds-tear)';
        } else {
          chipLayer.style.textShadow = '';
          chipLayer.style.transform = '';
          tearWrap.style.filter = '';
        }
        tc.clearRect(0, 0, 1920, 1080);
        tearC.style.display = amt > 0.001 ? 'block' : 'none';
        if (amt > 0.001) {
          const r = rng(gseed);
          const N = Math.round(6 * amt);
          for (let i = 0; i < N; i++) {
            const y = r() * 1080, hh = 6 + r() * 34;
            tc.fillStyle = TEAR_COLS[Math.floor(r() * 3)];
            const xa = r() < 0.5 ? 0 : r() * 900;
            tc.fillRect(xa, y, 1920 - xa * (r() < 0.5 ? 0 : 1), hh);
          }
          tc.fillStyle = `rgba(255,255,255,${(0.1 * amt).toFixed(3)})`;
          for (let i = 0; i < 10 * amt; i++) tc.fillRect(0, r() * 1080, 1920, 1 + r() * 2);
        }

        /* ---- red strobes on 16ths (the last one holds to the cut) ---- */
        let sa = 0;
        for (let i = 0; i < STROBES.length; i++) {
          const d = t - STROBES[i];
          if (d < 0) continue;
          if (i === STROBES.length - 1) sa = Math.max(sa, 0.25);
          else sa = Math.max(sa, d < 0.045 ? 0.25 : 0.25 * Math.max(0, 1 - (d - 0.045) / 0.05));
        }
        strobe.style.opacity = sa.toFixed(3);
        strobe.style.display = sa > 0.002 ? 'block' : 'none';
      },
    };
  },
});
