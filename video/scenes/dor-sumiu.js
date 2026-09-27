/* ============================================================
   S4 · dor-sumiu — ERRO 04 · CLIENTE OURO SUMIU + the collapse     [12–16 global]
   (STORYBOARD.md §2 S4, §1.6 chip, §1.7 Revenda Bella card — dark version)
   Hand-off in: S3's full-frame #000c0d overlay at .85 lifts (0–0.4) while the
   Revenda Bella card rises out of the dark. Her "Compras por mês" bars deflate
   on 16ths (3.200 → 0), leaving dashed ghosts of the missing money; "E ninguém
   percebeu." lands, a "há 4 meses sem comprar" sticker slaps the corner (shock
   ring), the gold ring drains to gray (gold motes leak away), an ECG trace runs
   along the chart floor, beats twice with the heartbeat and flatlines through
   the empty months while the card recedes; chip 04 stamps into the log.
   Critical failure: the four chips leave the log and lock into a left-aligned
   stack at centre (×1.6, settled by ~3.30) over a 20 % world, red brackets lock
   on, the world tears (0.4 → 1) under red strobes while the stack stays clean;
   from 3.72 the chips break up in order (01 → 04, 0.05 s apart), so the last
   legible line is ERRO 04 · CLIENTE OURO SUMIU. Hard cut to black (S5).
   Structure (root z-order, back → front):
     0 ovl (S3 hand-off)
     1 tearWrap › [ camera view › world (flat) › rig › glows · cardGrp › [dust · card · ecg · shock · pill] ]
                  hud (scrim, headline) · dim                       ← world tear (#ds-tear)
     2 low torn-bars canvas (world)
     3 stackWrap › stackFx (glow, brackets, scan · #ds-tear-fx) · chips (one wrap + #ds-tear-cN each)
     4 strobe
     5 top torn-bars canvas (only over chips that have already broken)
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
    const AV = { x: CARD.x + 40 + 64, y: CARD.y + 40 + 64, r: 64 };  // avatar ring centre (screen px): 684, 284
    const layer = (z, parent = root) => h('div', { style: { position: 'absolute', inset: '0', zIndex: z } }, parent);

    /* ============================================================ S3 HAND-OFF OVERLAY */
    const ovl = h('div', { style: { position: 'absolute', inset: '0', zIndex: 0, background: '#000c0d', opacity: 0.85 } }, root);

    /* ============================================================ WORLD */
    const tearWrap = layer(1);
    // colour grade: space's orange Act I blob (1400,760) over the teal base reads khaki behind the card;
    // a low-green crimson wash that tracks it pulls the right half back to DOR red / petrol
    const GR = 720;
    const grade = h('div', { style: { position: 'absolute', left: `${1400 - GR}px`, top: `${760 - GR}px`, width: `${GR * 2}px`, height: `${GR * 2}px`, borderRadius: '50%', opacity: 0,
      background: 'radial-gradient(circle, rgba(150,10,48,.34) 0%, rgba(150,10,48,.2) 38%, rgba(150,10,48,0) 70%)', pointerEvents: 'none' } }, tearWrap);
    const cam = KIT.camera(tearWrap, { perspective: PERSP });
    cam.world.style.transformStyle = 'flat';                        // 2D camera (translate / rotateZ / scale)
    const rig = h('div', { style: { position: 'absolute', left: '0', top: '0', width: '1920px', height: '1080px', transformOrigin: `${CX}px ${CY}px` } }, cam.world);
    // gold stays local to the client (avatar); red owns the frame once she drains
    const glowGold = GTR.glow(rig, { x: AV.x, y: AV.y, r: 330, color: '243,179,21', a: 0.22 });
    const glowRed = GTR.glow(rig, { x: CX, y: CY + 40, r: 700, color: '239,68,68', a: 0.3 });
    // everything that belongs to the client (blurred + faded out of the brackets at 3.0–3.4)
    const cardGrp = h('div', { style: { position: 'absolute', left: '0', top: '0', width: '1920px', height: '1080px' } }, rig);
    const { canvas: dustC, ctx: dc } = GTR.canvas(cardGrp);

    /* ---- the Revenda Bella card (dark glass 760×440) ---- */
    const card = h('div', { style: {
      position: 'absolute', left: `${CARD.x}px`, top: `${CARD.y}px`, width: `${CARD.w}px`, height: `${CARD.h}px`, borderRadius: '24px', overflow: 'hidden',
      background: 'linear-gradient(180deg, rgba(255,255,255,.075), rgba(255,255,255,.02)), rgba(7,20,20,.9)',
      border: '1px solid rgba(255,255,255,.12)', color: '#fff', fontFamily: FONT_UI,
      boxShadow: '0 40px 120px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,.08)',
    } }, cardGrp);
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

    // name · tier chip · line · last purchase + ticket médio
    const nameRow = h('div', { style: { position: 'absolute', left: '196px', top: '44px', display: 'flex', alignItems: 'center', gap: '16px', whiteSpace: 'nowrap' } }, card);
    h('div', { style: { fontSize: '40px', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: '48px' } }, nameRow).textContent = 'Revenda Bella';
    const tier = h('div', { style: { display: 'inline-flex', alignItems: 'center', gap: '7px', height: '34px', padding: '0 14px 0 10px', borderRadius: '999px',
      background: 'rgba(243,179,21,.18)', border: '1px solid rgba(243,179,21,.35)', color: '#f5c542', fontSize: '18px', fontWeight: 700 } }, nameRow);
    tier.innerHTML = '<span class="emoji" style="font-size:19px;line-height:1">🏅</span><span>Ouro</span>';
    h('div', { style: { position: 'absolute', left: '196px', top: '102px', fontSize: '20px', fontWeight: 500, color: 'rgba(255,255,255,.64)', whiteSpace: 'nowrap' } }, card)
      .textContent = 'Cliente desde 2024 · comprava todo mês';
    const statRow = h('div', { style: { position: 'absolute', left: '196px', top: '136px', display: 'flex', alignItems: 'center', gap: '10px', whiteSpace: 'nowrap' } }, card);
    const statPill = (html) => {
      const el = h('div', { style: { display: 'inline-flex', alignItems: 'center', gap: '8px', height: '34px', padding: '0 13px 0 11px', borderRadius: '9px',
        background: 'rgba(255,255,255,.065)', border: '1px solid rgba(255,255,255,.06)', color: 'rgba(255,255,255,.7)', fontSize: '17px', fontWeight: 600, whiteSpace: 'nowrap' } }, statRow);
      el.innerHTML = html;
      return el;
    };
    statPill(GTR.iconSVG('calendar', { size: 18, sw: 2.2 }) + '<span>Última compra: maio/2026</span>');
    statPill(GTR.iconSVG('receipt', { size: 18, sw: 2.2 }) + '<span>Ticket médio</span><span style="color:#fff;font-weight:800;letter-spacing:-0.01em">R$ 2.340</span>');

    // chart header
    const hdr = h('div', { style: { position: 'absolute', left: '40px', right: '40px', top: '198px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' } }, card);
    const hl = h('div', { style: { display: 'flex', alignItems: 'center', gap: '9px', fontSize: '17px', fontWeight: 600, color: 'rgba(255,255,255,.8)' } }, hdr);
    hl.innerHTML = GTR.iconSVG('chart-column', { size: 19, color: 'rgba(255,255,255,.6)' }) + '<span>Compras por mês</span>';
    const hr = h('div', { style: { display: 'flex', alignItems: 'center', gap: '9px', fontSize: '16px', fontWeight: 600, color: 'rgba(255,255,255,.65)', opacity: 0 } }, hdr);
    h('span', { style: { display: 'inline-block', width: '18px', height: '13px', borderRadius: '3px', border: '1.5px dashed rgba(248,113,113,.9)' } }, hr);
    h('span', {}, hr).textContent = 'esperado';

    // chart (680 × 146): 8 manual bars, ghosts, values, months
    const CH = { x: 40, y: 230, w: 680, h: 146 };
    const EH = 106;                                                   // bar height of R$ 3.200
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
      const val = h('div', { style: { position: 'absolute', left: `${x - 12}px`, width: `${BW + 24}px`, textAlign: 'center', fontSize: '20px', fontWeight: 800, letterSpacing: '-0.015em',
        lineHeight: '24px', fontVariantNumeric: 'tabular-nums', color: 'rgba(255,255,255,.85)', whiteSpace: 'nowrap' } }, chart);
      const mon = h('div', { style: { position: 'absolute', left: `${x}px`, top: `${CH.h + 9}px`, width: `${BW}px`, textAlign: 'center', fontSize: '18px', fontWeight: 600, lineHeight: '22px', color: 'rgba(255,255,255,.7)' } }, chart);
      mon.textContent = MONTHS[i];
      return { v, ghost, bar, val, mon, t0: 0.25 + i * 0.125, lastTxt: '' };
    });

    /* ---- ECG along the chart floor: two beats in the mai|jun and jun|jul gaps, then flat (screen px) ---- */
    const ECG = { x: CARD.x + CH.x, y: CARD.y + CH.y + CH.h - 0.5 };            // chart origin-x, baseline y (620, 555.5)
    const ESPD = (BW + GAP) / 0.18;                                              // beats 0.18 s apart land one gap apart
    const EB1 = 3 * (BW + GAP) + BW + GAP / 2;                                   // gap mai|jun centre (chart x 340)
    const EBEATS = [{ x: EB1, A: 82 }, { x: EB1 + BW + GAP, A: 54 }];
    const ESTART = 150;                                                          // trace fades in from here (chart x)
    const ecgSvg = s('svg', { width: 1920, height: 1080, viewBox: '0 0 1920 1080', style: { position: 'absolute', left: '0', top: '0', overflow: 'visible', filter: 'drop-shadow(0 0 5px rgba(239,68,68,.85))' } }, cardGrp);
    const eg = s('linearGradient', { id: 'ds-ecg-g', gradientUnits: 'userSpaceOnUse', x1: ECG.x + ESTART, y1: 0, x2: ECG.x + ESTART + 150, y2: 0 }, s('defs', {}, ecgSvg));
    s('stop', { offset: 0, 'stop-color': '#f87171', 'stop-opacity': 0 }, eg);
    s('stop', { offset: 1, 'stop-color': '#f87171', 'stop-opacity': 1 }, eg);
    const ecgPath = s('path', { fill: 'none', stroke: 'url(#ds-ecg-g)', 'stroke-width': 2.6, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, ecgSvg);
    const ecgHead = s('circle', { r: 4.2, fill: '#fee2e2', opacity: 0 }, ecgSvg);
    const gauss = (u, w) => Math.exp(-(u * u) / (2 * w * w));
    const ecgY = (x) => {
      let y = 0;
      for (const b of EBEATS) {
        const d = x - b.x;
        if (d < -48 || d > 48) continue;
        y += b.A * (-0.08 * gauss(d + 30, 6) + 0.12 * gauss(d + 7, 2.2) - gauss(d, 2.8) + 0.3 * gauss(d - 6.5, 2.6) - 0.09 * gauss(d - 25, 7));
      }
      return y;
    };

    /* ---- "há 4 meses sem comprar" sticker on the card's top-right corner ---- */
    const PILL = { x: CARD.x + CARD.w - 64, y: CARD.y + 4 };
    // impact: soft red flash + a thick shock ring (0.25 s, fast fade)
    const pillFlash = GTR.glow(cardGrp, { x: PILL.x, y: PILL.y, r: 220, color: '239,68,68', a: 0.55 });
    pillFlash.style.opacity = 0;
    const SHOCK_R = 240;
    const shock = h('div', { style: { position: 'absolute', left: `${PILL.x - SHOCK_R}px`, top: `${PILL.y - SHOCK_R}px`, width: `${SHOCK_R * 2}px`, height: `${SHOCK_R * 2}px`,
      borderRadius: '50%', border: `6px solid ${RED}`, boxSizing: 'border-box', opacity: 0, display: 'none',
      boxShadow: '0 0 26px rgba(239,68,68,.75), inset 0 0 22px rgba(239,68,68,.55)' } }, cardGrp);
    // heartbeat (2.0 / 2.18): the client's last pulse rings off the draining avatar
    const hbPulse = [0, 1].map(() => KIT.pulse(cardGrp, { x: AV.x, y: AV.y, r: 170, color: 'rgba(248,113,113,.9)', sw: 2 }));
    const pill = h('div', { style: { position: 'absolute', left: `${PILL.x}px`, top: `${PILL.y}px`, display: 'inline-flex', alignItems: 'center', gap: '10px',
      padding: '0 20px 0 16px', height: '50px', borderRadius: '999px', whiteSpace: 'nowrap', fontFamily: FONT_UI, fontSize: '20px', fontWeight: 700, letterSpacing: '0.005em',
      background: 'linear-gradient(rgba(239,68,68,.16),rgba(239,68,68,.16)), #170b0c', border: '1.5px solid rgba(239,68,68,.7)', color: '#fca5a5',
      boxShadow: '0 16px 40px rgba(0,0,0,.5), 0 0 34px rgba(239,68,68,.35)', opacity: 0, transformOrigin: '50% 50%' } }, cardGrp);
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

    /* ============================================================ LOW TORN BARS (world, under the stack) */
    const { canvas: lowC, ctx: lc } = GTR.canvas(root, { z: 2, style: { pointerEvents: 'none' } });

    /* ============================================================ STACK (above the dim, outside the world tear) */
    const stackWrap = layer(3);
    stackWrap.style.transformOrigin = '960px 540px';
    const stackFx = layer('auto', stackWrap);
    const stackGlow = GTR.glow(stackFx, { x: 960, y: 540, r: 640, color: '239,68,68', a: 0.3 });
    stackGlow.style.opacity = 0;
    const bsvg = s('svg', { width: 1920, height: 1080, viewBox: '0 0 1920 1080', style: { position: 'absolute', left: '0', top: '0', overflow: 'visible' } }, stackFx);
    bsvg.style.filter = 'drop-shadow(0 0 10px rgba(239,68,68,.8))';
    const brackets = [0, 1, 2, 3].map(() => s('path', { fill: 'none', stroke: '#f87171', 'stroke-width': 3, 'stroke-linecap': 'square', opacity: 0 }, bsvg));
    const scanLine = h('div', { style: { position: 'absolute', left: '0', top: '0', width: '1px', height: '2px', opacity: 0, transformOrigin: '0 0',
      background: 'linear-gradient(90deg, rgba(239,68,68,0), rgba(252,165,165,.9) 50%, rgba(239,68,68,0))', boxShadow: '0 0 14px rgba(239,68,68,.8)' } }, stackFx);

    /* ---- chips (the Act I log) ---- */
    const chipLayer = layer('auto', stackWrap);
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
      return { c, wrap, w, y0: 96 + i * 58, y1: STACK_Y[i] - 23,
        t0: 3.0 + (3 - i) * 0.04,                                     // 04 leads: no chip crosses another; all settled by ~3.30
        tt: 3.72 + i * 0.05 };                                        // break-up order 01 → 04 (04 is the last legible line)
    });
    const maxW = Math.max(...chips.map((q) => q.w)) * SC;
    const SX = 960 - maxW / 2;                                        // one left edge for the whole stack: dots form a column
    const BR = { x0: 960 - maxW / 2 - 56, x1: 960 + maxW / 2 + 56, y0: STACK_Y[0] - 37 - 42, y1: STACK_Y[3] + 37 + 42, arm: 54 };
    const FLY = 0.30;

    /* ============================================================ STROBE + TEAR */
    const strobe = h('div', { style: { position: 'absolute', inset: '0', zIndex: 4, background: 'rgb(239,68,68)', opacity: 0, display: 'none' } }, root);
    const { canvas: topC, ctx: tc } = GTR.canvas(root, { z: 5, style: { pointerEvents: 'none' } });
    const fsvg = s('svg', { width: 0, height: 0, style: { position: 'absolute', left: '0', top: '0' } }, root);
    const mkTear = (id) => {
      const filt = s('filter', { id, x: '-5%', y: '0%', width: '110%', height: '100%', 'color-interpolation-filters': 'sRGB' }, fsvg);
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
      // returns the filter token for `amt` (or '' when idle); seed varies the band pattern
      return (amt, seed, r) => {
        if (amt <= 0.001) return '';
        turb.setAttribute('seed', String((seed % 997) + 1));
        disp.setAttribute('scale', (160 * amt).toFixed(1));
        const cx = (8 + r() * 8) * amt;
        offR.setAttribute('dx', cx.toFixed(1));
        offGB.setAttribute('dx', (-cx).toFixed(1));
        return `url(#${id})`;
      };
    };
    const tearWorld = mkTear('ds-tear');
    const tearFx = mkTear('ds-tear-fx');
    const tearChip = chips.map((_, i) => mkTear(`ds-tear-c${i}`));
    const TEAR_COLS = ['#000c0d', 'rgba(239,68,68,.5)', 'rgba(21,219,168,.35)'];
    const SLICE_COLS = ['#000c0d', '#000c0d', 'rgba(239,68,68,.55)', 'rgba(21,219,168,.4)', 'rgba(252,165,165,.55)'];

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
    const EXPO = GTR.E('expo.out');
    const flyE = (t, t0) => EXPO(inv(t, t0, t0 + FLY));

    return {
      tl,
      update(local, g) {
        const t = Math.max(0, local);

        /* ---- S3 hand-off overlay lifts ---- */
        const ov = 0.85 * (1 - p(t, 0, 0.4, 'power2.out'));
        ovl.style.opacity = ov;
        ovl.style.display = ov > 0.002 ? 'block' : 'none';

        /* ---- camera: arrival settle, slow push, handheld shake (DOR), lock-on push at 3.0 ---- */
        const hb = burst(t, 2.0, 0.07) + 0.7 * burst(t, 2.18, 0.07);          // heartbeat lub-dub
        const A = 3 + 5 * burst(t, 1.0, 0.14) + 4 * burst(t, 1.5, 0.12) + 5 * hb
          + 19 * p(t, 3.0, 3.5, 'power2.in') + 8 * spike(t, 3.0, 0.2) + 8 * spike(t, 3.25, 0.2);
        const shx = noise(g * 8 + 0.37) * A * 1.4, shy = noise(g * 8 + 50.37) * A * 1.4, shr = noise(g * 5 + 9.37) * A * 0.03;
        const camS = lerp(0.965, 1, p(t, 0, 0.9, 'power3.out')) + 0.03 * p(t, 0.9, 3.0, 'sine.inOut') + 0.012 * hb
          + 0.03 * p(t, 3.0, 3.45, 'power2.out');
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
        // 3.0–3.4: the client leaves the brackets — blur 8 px, 0.35 → 0.12
        const gone = p(t, 3.0, 3.4, 'power2.out');
        cardGrp.style.opacity = lerp(1, 0.34, gone);
        cardGrp.style.filter = gone > 0.002 ? `blur(${(8 * gone).toFixed(2)}px)` : '';
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
          b.val.style.bottom = `${(hpx + 7).toFixed(2)}px`;
          b.val.style.color = f < 0.02 ? '#f87171' : 'rgba(255,255,255,.88)';
          b.mon.style.color = b.v === 0 && q > 0.5 ? 'rgba(248,113,113,.95)' : 'rgba(255,255,255,.7)';
        }
        // "esperado" arrives with the first dashed ghost (≈ 0.5)
        hr.style.opacity = p(lost, 0.12, 0.9, 'power2.out');

        /* ---- 1.5: sticker snaps (flash + shock ring); gold drains 1.5–2.3 ---- */
        const ps = p(t, 1.5, 1.74, 'back.out(2.2)');
        pill.style.opacity = clamp(inv(t, 1.5, 1.54));
        pill.style.transform = `translate(-50%, -50%) rotate(${lerp(-12, -4, ps).toFixed(2)}deg) scale(${(t < 1.5 ? 1.7 : lerp(1.7, 1, ps)).toFixed(4)})`;
        pillFlash.style.opacity = (0.9 * burst(t, 1.5, 0.08)).toFixed(3);
        pillFlash.style.transform = `scale(${lerp(0.6, 1.1, p(t, 1.5, 1.7, 'expo.out')).toFixed(3)})`;
        const su = inv(t, 1.5, 1.75);
        if (su > 0 && su < 1) {
          const scl = lerp(0.3, 1, EXPO(su));
          shock.style.display = 'block';
          shock.style.transform = `scale(${scl.toFixed(4)})`;
          shock.style.borderWidth = `${(lerp(10, 3, su) / scl).toFixed(2)}px`;
          shock.style.opacity = (0.95 * Math.pow(1 - su, 3)).toFixed(3);
        } else shock.style.display = 'none';
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
        glowGold.style.opacity = (1 - dr).toFixed(3);
        glowGold.style.display = dr >= 0.999 ? 'none' : 'block';
        glowGold.style.transform = `scale(${breathe})`;
        glowRed.style.opacity = lerp(0.35, 1, dr) * (1 + 0.5 * hb);
        grade.style.opacity = (clamp(inv(t, 0, 0.4)) * lerp(0.7, 1, dr)).toFixed(3);
        grade.style.transform = `translate(${(noise(45.3, g * 0.12) * 200).toFixed(1)}px, ${(noise(72.2, g * 0.12) * 140).toFixed(1)}px)`;
        glowRed.style.transform = `scale(${breathe * (1 + 0.12 * hb)})`;

        /* ---- ECG on the chart floor: sweep 1.61 → 2.70, beats at 2.0 / 2.18, flatline ---- */
        const hx = EB1 + ESPD * (t - 2.0);                                         // head (chart x)
        if (hx > ESTART) {
          const end = Math.min(hx, CH.w);
          let d = '';
          for (let x = ESTART; x <= end; x += 1.5) d += `${d ? 'L' : 'M'}${(ECG.x + x).toFixed(1)},${(ECG.y + ecgY(x)).toFixed(2)}`;
          d += `L${(ECG.x + end).toFixed(1)},${(ECG.y + ecgY(end)).toFixed(2)}`;
          ecgPath.setAttribute('d', d);
          ecgPath.style.display = 'block';
          const headOn = hx < CH.w ? 1 : clamp(1 - (hx - CH.w) / 60);
          ecgHead.setAttribute('cx', (ECG.x + end).toFixed(1));
          ecgHead.setAttribute('cy', (ECG.y + ecgY(end)).toFixed(2));
          ecgHead.setAttribute('opacity', (headOn * clamp((hx - ESTART) / 80)).toFixed(3));
        } else {
          ecgPath.style.display = 'none';
          ecgHead.setAttribute('opacity', 0);
        }

        /* ---- gold motes leak off the ring (1.45 → ~3.4) ---- */
        dc.globalAlpha = 1;
        dc.clearRect(0, 0, 1920, 1080);
        if (t > 1.45 && t < 3.6) {
          for (const m of MOTES) {
            const age = t - m.te;
            if (age <= 0 || age >= m.life) continue;
            const u = age / m.life;
            const dd = AV.r + 4 + m.sp * age;
            const x = AV.x + Math.cos(m.a) * dd + noise(m.ph, g * 0.9) * 22 * u + 18 * age;
            const y = AV.y + Math.sin(m.a) * dd - m.up * age - 30 * age * age + noise(m.ph + 7, g * 0.9) * 14 * u;
            const al = clamp(u / 0.12) * Math.pow(1 - u, 1.3) * 0.95;
            const ash = clamp(u * 1.4);
            const sz = m.r * 7;
            dc.globalAlpha = al * (1 - ash);
            dc.drawImage(SPR_GOLD, x - sz / 2, y - sz / 2, sz, sz);
            dc.globalAlpha = al * ash * 0.8;
            dc.drawImage(SPR_ASH, x - sz / 2, y - sz / 2, sz, sz);
          }
        }

        /* ---- headline: scrim, glow flare on "percebeu" ---- */
        scrim.style.opacity = p(t, 0.85, 1.35, 'power2.out') * (1 - p(t, 3.0, 3.4, 'power1.in'));
        const flare = burst(t, 1.25, 0.35) * (t >= 1.25 ? 1 : 0);

        /* ---- tear amounts ----
           world (cam.view, headline, low bars): spikes at 3.0 / 3.25, heavy 0.4 → 1 from 3.5
           stack fx: heavy·inv(3.72, 3.95) · chip n: heavy·ramp from 3.72 + (n−1)·0.05            */
        const heavy = t >= 3.5 ? lerp(0.4, 1, p(t, 3.5, 3.95, 'power1.in')) : 0;
        const amt = Math.max(heavy, 0.45 * spike(t, 3.0, 0.2), 0.45 * spike(t, 3.25, 0.2));
        const fxAmt = heavy * inv(t, 3.72, 3.95);
        const gseed = Math.floor(g * 30);

        /* ---- chips: log → left-aligned centre stack (3.00–3.42, settled ≈ 3.30), 16th blink, ordered break-up ---- */
        const cAmt = [];
        for (let i = 0; i < 4; i++) {
          const q = chips[i];
          q.c.set(g, i < 3 ? 1 : inv(t, 2.5, 2.68), 0);
          const e = flyE(t, q.t0);
          q.c.place(lerp(120, SX, e), lerp(q.y0, q.y1, e), lerp(1, SC, e));
          if (t >= 3.0) q.c.blink(g * 4);
          // motion blur from velocity (dies within ~0.15 s of launch)
          const vel = flyE(t + 1 / 120, q.t0) - flyE(t - 1 / 120, q.t0);          // share of the path covered in one frame
          const mb = t > q.t0 && t < q.t0 + 0.15 ? Math.min(7, vel * 600 * 0.045) : 0;
          q.c.errFace.style.boxShadow = `0 10px 30px rgba(0,0,0,.35), 0 0 ${(28 * e).toFixed(1)}px rgba(239,68,68,${(0.4 * e).toFixed(3)})`;
          const a = heavy * p(t, q.tt, q.tt + 0.09, 'power2.out');
          cAmt.push(a);
          const r = rng(gseed * 7 + 31 * i + 3);
          const tear = tearChip[i](a, gseed + 101 * (i + 1), r);
          q.wrap.style.filter = [mb > 0.05 ? `blur(${mb.toFixed(2)}px)` : '', tear].filter(Boolean).join(' ');
          if (a > 0.001) {
            const ca = (5 + r() * 6) * a;
            q.wrap.style.textShadow = `${(-ca).toFixed(1)}px 0 rgba(255,0,80,.85), ${ca.toFixed(1)}px 0 rgba(0,255,220,.8)`;
            q.wrap.style.transform = `translate(${((r() - 0.5) * 22 * a).toFixed(1)}px, ${((r() - 0.5) * 6 * a).toFixed(1)}px)`;
          } else {
            q.wrap.style.textShadow = '';
            q.wrap.style.transform = '';
          }
        }

        /* ---- critical failure: dim, glow, brackets lock on, scan, slow push on the stack ---- */
        dim.style.opacity = 0.8 * p(t, 3.0, 3.4, 'power2.out');
        const beat16 = Math.exp(-fract(g * 8) * 4);
        stackGlow.style.opacity = p(t, 3.05, 3.45, 'power2.out') * (0.7 + 0.3 * beat16);
        const bq = p(t, 3.08, 3.4, 'expo.out');
        const off = 90 * (1 - bq);
        const { x0, x1, y0, y1, arm } = BR;
        const corners = [
          [x0 - off, y0 - off, 1, 1], [x1 + off, y0 - off, -1, 1], [x1 + off, y1 + off, -1, -1], [x0 - off, y1 + off, 1, -1],
        ];
        corners.forEach(([cx, cy, sx, sy], i) => {
          brackets[i].setAttribute('d', `M${cx},${cy + sy * arm} L${cx},${cy} L${cx + sx * arm},${cy}`);
          brackets[i].setAttribute('opacity', (bq * (t > 3.4 && fract(g * 8) > 0.5 ? 0.55 : 1)).toFixed(3));
        });
        const sl = fract((t - 3.3) / 0.5);
        const slOn = t > 3.3;
        scanLine.style.opacity = slOn ? (0.8 * Math.sin(Math.PI * sl)).toFixed(3) : 0;
        scanLine.style.transform = `translate(${x0 + 10}px, ${lerp(y0 + 8, y1 - 8, sl).toFixed(1)}px) scaleX(${(x1 - x0 - 20).toFixed(1)})`;
        const push = 1 + 0.022 * p(t, 3.3, 4.0, 'sine.inOut');
        stackWrap.style.transform = push > 1.0001 ? `scale(${push.toFixed(5)})` : '';
        stackFx.style.filter = tearFx(fxAmt, gseed + 53, rng(gseed + 5));

        /* ---- world tear: spikes (3.0, 3.25) hit only camera + headline; heavy from 3.5 ---- */
        KIT.glitch(cam.view, amt, g, 11);
        cam.view.style.clipPath = amt > 0.001 && rng(gseed + 7)() < 0.22 * amt
          ? (() => { const r = rng(gseed + 9); const a0 = Math.floor(r() * 70), a1 = a0 + 20 + Math.floor(r() * 25); return `polygon(0 ${a0}%, 100% ${a0}%, 100% ${a1}%, 0 ${a1}%)`; })()
          : '';
        KIT.glitch(title.el, amt, g, 37);
        em.style.textShadow = `${amt > 0.001 && title.el.style.textShadow ? title.el.style.textShadow + ', ' : ''}${RED_GLOW}${flare > 0.01 ? `, 0 0 ${(60 * flare).toFixed(1)}px rgba(239,68,68,${(0.6 * flare).toFixed(3)})` : ''}`;
        tearWrap.style.filter = tearWorld(amt, gseed, rng(gseed + 1));

        // low torn bars (world, under the stack)
        lc.clearRect(0, 0, 1920, 1080);
        lowC.style.display = amt > 0.001 ? 'block' : 'none';
        if (amt > 0.001) {
          const r = rng(gseed);
          const N = Math.round(6 * amt);
          for (let i = 0; i < N; i++) {
            const y = r() * 1080, hh = 6 + r() * 34;
            lc.fillStyle = TEAR_COLS[Math.floor(r() * 3)];
            const xa = r() < 0.5 ? 0 : r() * 900;
            lc.fillRect(xa, y, 1920 - xa * (r() < 0.5 ? 0 : 1), hh);
          }
          lc.fillStyle = `rgba(255,255,255,${(0.1 * amt).toFixed(3)})`;
          for (let i = 0; i < 10 * amt; i++) lc.fillRect(0, r() * 1080, 1920, 1 + r() * 2);
        }

        // top torn bars: only rows whose chips have already broken (an intact chip is never crossed)
        tc.clearRect(0, 0, 1920, 1080);
        const anyC = cAmt.some((a) => a > 0.001);
        topC.style.display = anyC ? 'block' : 'none';
        if (anyC) {
          const band = (i) => [540 + (STACK_Y[i] - 42 - 540) * push, 540 + (STACK_Y[i] + 42 - 540) * push];
          const blocked = (ya, yb) => cAmt.some((a, i) => { const [b0, b1] = band(i); return a < 0.05 && yb > b0 && ya < b1; });
          const r = rng(gseed + 77);
          // per-chip slices
          for (let i = 0; i < 4; i++) {
            const a = cAmt[i];
            if (a <= 0.001) continue;
            const [b0, b1] = band(i);
            const n = Math.round(4 * a);
            for (let j = 0; j < n; j++) {
              const hh = 3 + r() * 11, y = b0 + 6 + r() * (b1 - b0 - 12 - hh);
              const xa = 960 + (SX - 40 - 960) * push + r() * 120;
              const w = chips[i].w * SC * push + 80 - r() * 160;
              tc.fillStyle = SLICE_COLS[Math.floor(r() * SLICE_COLS.length)];
              tc.fillRect(xa + (r() - 0.5) * 60 * a, y, w, hh);
            }
          }
          // full-width bars, skipped where they would cross an intact chip
          const N = Math.round(5 * fxAmt);
          for (let i = 0; i < N; i++) {
            const y = r() * 1080, hh = 6 + r() * 30;
            const col = TEAR_COLS[Math.floor(r() * 3)];
            const xa = r() < 0.5 ? 0 : r() * 900;
            if (blocked(y, y + hh)) continue;
            tc.fillStyle = col;
            tc.fillRect(xa, y, 1920 - xa, hh);
          }
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
