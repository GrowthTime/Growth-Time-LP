/* ============================================================
   S3 · dor-dinheiro — ERRO 03 · SEM RASTREIO          [8–12 global]
   Whip-in from the right (continues S2's whip-left: +900 px, blur 24,
   the same warm streaks). Ad money runs as "R$" tokens along a dashed
   pipeline ANÚNCIO → WHATSAPP → VENDA; at 0.75 segment 2 snaps open
   (40–60 %), the broken ends droop and spit red sparks, and every token
   that reaches the gap tumbles into the dark, grays out and is gone. The
   sale node never resolves (scrambling value, "Não rastreado"), the
   "Investido" counter keeps climbing to R$ 24.800. "O dinheiro some." /
   "Qual anúncio vendeu? Ninguém sabe.", chip 03 stamps into the log, and
   the camera zooms through the gap into a #000c0d overlay (0.85) that
   S4 fades out.
   Structure (back → front):
     shakeWrap(rz) › whipWrap(blur, opacity) › world (2D camera, origin 0 0)
        bokehBack (distant falling tokens, parallax .5) · glows · path SVG ·
        ad card · sale card · token canvas · WA node · eyebrows · counter
     streaks canvas · HUD (bottom band, headline, subline) · overlay · chips
   Layout note: world coords are the storyboard's (S3 ↔ S8 contract); the
   camera frames them at scale 0.95 with the pipeline at screen y 520 so
   the ANÚNCIO eyebrow clears chip 03 (y 212–258) in the Act I log, and the
   "Investido" counter rides under segment 1 (the money leaving the ad)
   instead of under the card, where it crowded the bottom headline.
   Tl = DOM reveals (pill swap, headline, subline); update() = camera,
   whip, shake, zoom-through, tokens, sparks, path, counter, scramble, chips.
   ============================================================ */
GTR.scene({
  id: 'dor-dinheiro',
  build(root, ctx) {
    const { h, s, p, clamp, lerp, noise, inv, fract, rng, fmt } = GTR;
    const RED = '#ef4444';
    const FONT_UI = "'Inter', system-ui, sans-serif";

    /* ---------------- geometry (world px) ---------------- */
    const PY = 460;                                   // pipeline y
    const AD = { x: 180, y: 250, w: 340, h: 420 };
    const WA = { cx: 960, cy: 460, size: 110 };
    const SALE = { x: 1480, y: 370, w: 300, h: 180 };
    const S1 = [520, 905], S2 = [1015, 1480];
    const GAP_L = 1201, GAP_R = 1294, GAP_C = (GAP_L + GAP_R) / 2;   // 40–60 % of segment 2
    const K0 = 0.95, CY = 520;                        // camera framing (see header)
    const TX0 = 960 - K0 * 960, TY0 = CY - K0 * PY;
    const BREAK = 0.75;

    /* ---------------- token schedule ---------------- */
    const V = 1600;                                   // px/s → seg 1 ≈ .24 s, seg 2 ≈ .29 s
    const TOK_W = 54, TOK_H = 30;
    const X0 = S1[0] - TOK_W / 2;                     // spawns hidden inside the ad card edge
    const TOKENS = [];
    {
      const r = rng('dd-tokens');
      for (let k = 0; k * 0.125 + 0.25 <= 2.76; k++) {
        const t0 = 0.25 + k * 0.125;
        const tg = t0 + (GAP_L - X0) / V;             // reaches the left gap edge
        TOKENS.push({ t0, tg, falls: tg >= BREAK, tw: t0 + (WA.cx - X0) / V,
          spin: (r() < 0.5 ? -1 : 1) * (4 + r() * 6), kd: 5.5 + r() * 2.5, vy: -60 - r() * 140, sd: r() });
      }
    }

    /* ============================================================ WORLD */
    const shakeWrap = h('div', { style: { position: 'absolute', inset: '0', zIndex: 1, transformOrigin: '50% 50%' } }, root);
    const whipWrap = h('div', { style: { position: 'absolute', inset: '0' } }, shakeWrap);
    const world = h('div', { style: { position: 'absolute', left: '0', top: '0', width: '1920px', height: '1080px', transformOrigin: '0 0' } }, whipWrap);
    const layer = () => h('div', { style: { position: 'absolute', left: '0', top: '0', width: '1920px', height: '1080px' } }, world);

    /* ---- far bokeh: faint lost "R$" tokens drifting in the dark (parallax .5) ---- */
    const miniToken = (parent, { x, y, sc, blur, a, col }) => {
      const el = h('div', { style: { position: 'absolute', left: `${x - 27}px`, top: `${y - 15}px`, width: '54px', height: '30px', borderRadius: '9px',
        background: col, color: 'rgba(255,255,255,.8)', fontFamily: FONT_UI, fontWeight: 800, fontSize: '16px', display: 'grid', placeItems: 'center',
        opacity: a, filter: `blur(${blur}px)`, transformOrigin: '50% 50%' } }, parent);
      el.textContent = 'R$';
      return { el, sc };
    };
    const bokehBack = layer();
    const BACK = [];
    {
      const r = rng('dd-far');
      [[650, 150], [1090, 215], [1380, 120], [1720, 230], [1900, 620], [700, 770], [1540, 800], [1180, 690], [2000, 90], [880, 330]].forEach(([x, y], i) => {
        const sc = 0.62 + r() * 0.55;
        const tk = miniToken(bokehBack, { x, y, sc, blur: 2.6 + r() * 2.6, a: 0.13 + r() * 0.13, col: i % 3 === 1 ? '#5b6664' : '#1f7f69' });
        BACK.push(Object.assign(tk, { vy: 22 + r() * 50, vr: (r() - 0.5) * 50, r0: (r() - 0.5) * 70, ph: r() * 10 }));
      });
    }

    /* ---- glows (behind the pipeline) ---- */
    const glowLayer = layer();
    const waHalo = GTR.glow(glowLayer, { x: WA.cx, y: WA.cy, r: 190, color: '37,211,102', a: 0.2 });
    const adHalo = GTR.glow(glowLayer, { x: AD.x + AD.w / 2, y: AD.y + AD.h / 2, r: 330, color: '251,113,133', a: 0.08 });
    const gapGlow = GTR.glow(glowLayer, { x: GAP_C, y: PY + 20, r: 190, color: '239,68,68', a: 0.34 });
    const saleGlow = GTR.glow(glowLayer, { x: SALE.x + SALE.w / 2, y: SALE.y + SALE.h / 2, r: 260, color: '239,68,68', a: 0.14 });
    // the drop below the break: a soft dark well the tokens fall into
    const well = h('div', { style: { position: 'absolute', left: `${GAP_C - 300}px`, top: `${PY - 40}px`, width: '600px', height: '520px', borderRadius: '50%',
      background: 'radial-gradient(closest-side, rgba(0,8,9,.55), rgba(0,8,9,.25) 55%, rgba(0,8,9,0))', opacity: 0 } }, glowLayer);

    /* ---- pipeline (dashed 3 px) ---- */
    const svg = s('svg', { width: 1920, height: 1080, viewBox: '0 0 1920 1080', style: { position: 'absolute', left: '0', top: '0', overflow: 'visible' } }, world);
    const DASH = '12 10', PERIOD = 22;
    const rail = (d) => s('path', { d, fill: 'none', stroke: 'rgba(21,219,168,0.10)', 'stroke-width': 10, 'stroke-linecap': 'round' }, svg);
    const dashed = (d) => s('path', { d, fill: 'none', stroke: 'rgba(255,255,255,0.35)', 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-dasharray': DASH }, svg);
    const rail1 = rail(`M${S1[0]},${PY} L${S1[1]},${PY}`);
    const rail2 = rail('');
    const seg1 = dashed(`M${S1[0]},${PY} L${S1[1]},${PY}`);
    const seg2a = dashed('');
    const seg2b = dashed('');

    /* ---- ad card (dark glass) ---- */
    const glass = 'linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.035)), rgba(7,17,18,0.78)';
    const adCard = h('div', { style: { position: 'absolute', left: `${AD.x}px`, top: `${AD.y}px`, width: `${AD.w}px`, height: `${AD.h}px`, padding: '20px', borderRadius: '22px',
      background: glass, border: '1px solid rgba(255,255,255,0.13)', color: '#fff', fontFamily: FONT_UI, display: 'flex', flexDirection: 'column', gap: '12px',
      boxShadow: '0 40px 90px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.1)', filter: 'saturate(.7)' } }, world);
    const adHead = h('div', { style: { height: '36px', display: 'flex', alignItems: 'center', gap: '10px', flex: 'none' } }, adCard);
    adHead.innerHTML = `<span style="width:36px;height:36px;border-radius:50%;padding:2px;background:linear-gradient(45deg,#f58529,#dd2a7b 55%,#8134af);flex:none">`
      + `<span style="display:grid;place-items:center;width:100%;height:100%;border-radius:50%;background:#1a1414;border:2px solid #0d1516;font-size:12px;font-weight:800;color:#fff">MF</span></span>`
      + `<span style="font-size:16px;font-weight:700;white-space:nowrap">modafashion</span><span style="font-size:15px;font-weight:500;color:rgba(255,255,255,.55);white-space:nowrap">· Patrocinado</span>`
      + `<span style="margin-left:auto;display:grid;color:rgba(255,255,255,.6)">${GTR.iconSVG('ellipsis', { size: 20 })}</span>`;
    const adImg = h('div', { style: { position: 'relative', width: '300px', height: '250px', flex: 'none', borderRadius: '14px', overflow: 'hidden',
      background: 'linear-gradient(135deg,#fb7185,#c2410c)' } }, adCard);
    h('div', { style: { position: 'absolute', right: '-70px', top: '-70px', width: '220px', height: '220px', borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(255,237,180,.55), rgba(255,237,180,0) 70%)' } }, adImg);
    h('div', { style: { position: 'absolute', left: '-40px', bottom: '-90px', width: '260px', height: '200px', borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(120,20,40,.35), rgba(120,20,40,0) 70%)' } }, adImg);
    const shirt = h('div', { style: { position: 'absolute', left: '0', right: '0', top: '44px', display: 'grid', placeItems: 'center', color: '#fff',
      filter: 'drop-shadow(0 10px 18px rgba(80,10,20,.35))' } }, adImg);
    shirt.innerHTML = GTR.iconSVG('shirt', { size: 96, sw: 1.6 });
    h('div', { class: 'display', style: { position: 'absolute', left: '0', right: '0', top: '162px', textAlign: 'center', fontSize: '28px', color: '#fff',
      letterSpacing: '0.02em', textShadow: '0 4px 14px rgba(90,15,20,.35)' } }, adImg, 'COLEÇÃO VERÃO');
    h('div', { style: { position: 'absolute', right: '12px', top: '12px', padding: '4px 9px', borderRadius: '999px', background: 'rgba(0,0,0,.35)',
      fontSize: '12px', fontWeight: 600, color: '#fff' } }, adImg, '1/3');
    const dots = h('div', { style: { position: 'absolute', left: '0', right: '0', bottom: '14px', display: 'flex', justifyContent: 'center', gap: '6px' } }, adImg);
    [1, 0.5, 0.5].forEach((a) => h('span', { style: { width: '7px', height: '7px', borderRadius: '50%', background: `rgba(255,255,255,${a})` } }, dots));
    const sheen = h('div', { style: { position: 'absolute', left: '-160px', top: '-40px', width: '120px', height: '360px', transform: 'rotate(20deg)',
      background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.22), rgba(255,255,255,0))' } }, adImg);
    const cta = h('div', { style: { height: '46px', flex: 'none', borderRadius: '12px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.08)',
      display: 'flex', alignItems: 'center', gap: '10px', padding: '0 14px', fontSize: '16px', fontWeight: 600 } }, adCard);
    cta.innerHTML = `${GTR.iconSVG('message-circle', { size: 19, color: '#6ee7b7' })}<span>Enviar mensagem</span><span style="margin-left:auto;display:grid;color:rgba(255,255,255,.55)">${GTR.iconSVG('chevron-right', { size: 19 })}</span>`;
    const ctaFlash = h('div', { style: { position: 'absolute', inset: '0', borderRadius: '12px', background: 'rgba(21,219,168,.22)', opacity: 0, pointerEvents: 'none' } }, cta);
    cta.style.position = 'relative';

    /* ---- sale card (dark glass) — the value never resolves ---- */
    const saleCard = h('div', { style: { position: 'absolute', left: `${SALE.x}px`, top: `${SALE.y}px`, width: `${SALE.w}px`, height: `${SALE.h}px`, padding: '20px 22px',
      borderRadius: '20px', background: glass, border: '1px solid rgba(255,255,255,0.13)', color: '#fff', fontFamily: FONT_UI,
      boxShadow: '0 40px 90px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.1)', filter: 'saturate(.7)' } }, world);
    const saleRing = h('div', { style: { position: 'absolute', inset: '-1px', borderRadius: '20px', border: `1.5px dashed ${RED}`, opacity: 0, pointerEvents: 'none' } }, saleCard);
    const saleTop = h('div', { style: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px', fontWeight: 600, color: 'rgba(255,255,255,.6)' } }, saleCard);
    saleTop.innerHTML = `<span style="width:30px;height:30px;border-radius:9px;display:grid;place-items:center;background:rgba(255,255,255,.08);color:rgba(255,255,255,.75)">${GTR.iconSVG('shopping-bag', { size: 17 })}</span><span>Valor da venda</span>`;
    const saleVal = h('div', { style: { marginTop: '8px', height: '54px', display: 'flex', alignItems: 'baseline', gap: '2px', fontSize: '44px', fontWeight: 800,
      letterSpacing: '-0.01em', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' } }, saleCard);
    h('span', { style: { marginRight: '10px' } }, saleVal, 'R$');
    const glyphs = Array.from({ length: 5 }, () => h('span', { style: { display: 'inline-block', width: '0.62em', textAlign: 'center' } }, saleVal));
    const pillBox = h('div', { style: { position: 'relative', marginTop: '10px', height: '34px', perspective: '400px' } }, saleCard);
    const pillWait = h('div', { style: { position: 'absolute', left: '0', top: '0', height: '34px', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '0 14px 0 11px',
      borderRadius: '999px', background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.14)', color: 'rgba(255,255,255,.7)', fontSize: '15px', fontWeight: 600,
      whiteSpace: 'nowrap', transformOrigin: '50% 50%', backfaceVisibility: 'hidden' } }, pillBox);
    pillWait.innerHTML = `${GTR.iconSVG('loader-circle', { size: 16, sw: 2.4 })}<span>rastreando…</span>`;
    const loader = pillWait.firstChild;
    loader.style.transformOrigin = '50% 50%';
    const pillErr = h('div', { style: { position: 'absolute', left: '0', top: '0', height: '34px', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '0 15px 0 12px',
      borderRadius: '999px', background: 'linear-gradient(rgba(239,68,68,.2),rgba(239,68,68,.2)), #1a0c0d', border: '1px solid rgba(239,68,68,.6)', color: '#fca5a5',
      fontSize: '15px', fontWeight: 700, whiteSpace: 'nowrap', transformOrigin: '50% 50%', backfaceVisibility: 'hidden', boxShadow: '0 0 22px rgba(239,68,68,.25)' } }, pillBox);
    pillErr.innerHTML = `${GTR.iconSVG('eye-off', { size: 16, sw: 2.4 })}<span>Não rastreado</span>`;

    /* ---- token canvas (tokens + sparks) ---- */
    const { canvas: tokCanvas, ctx: tc } = GTR.canvas(world);
    tokCanvas.style.zIndex = '';

    /* ---- WhatsApp node (above the canvas: tokens pass behind it) ---- */
    const waWrap = h('div', { style: { position: 'absolute', left: `${WA.cx - WA.size / 2}px`, top: `${WA.cy - WA.size / 2}px`, width: `${WA.size}px`, height: `${WA.size}px`,
      transformOrigin: '50% 50%', filter: 'saturate(.7)' } }, world);
    const waIcon = KIT.channel(waWrap, 'wa', WA.size);
    waIcon.style.boxShadow = '0 24px 50px rgba(0,0,0,.45), 0 0 0 1px rgba(255,255,255,.12) inset, 0 0 40px rgba(37,211,102,.25)';
    const waPulses = [0, 1, 2].map(() => KIT.pulse(world, { x: WA.cx, y: WA.cy, r: 100, color: 'rgba(37,211,102,.7)', sw: 2 }));

    /* ---- eyebrows ---- */
    const eyebrow = (txt, x, y) => {
      const el = h('div', { class: 'body', style: { position: 'absolute', left: `${x}px`, top: `${y}px`, transform: 'translate(-50%, -50%)', fontSize: '18px', fontWeight: 700,
        letterSpacing: '0.18em', paddingLeft: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,.6)', whiteSpace: 'nowrap' } }, world);
      el.textContent = txt;
      return el;
    };
    eyebrow('Anúncio', AD.x + AD.w / 2, AD.y - 28);
    eyebrow('WhatsApp', WA.cx, WA.cy - WA.size / 2 - 28);
    const ebSale = eyebrow('Venda', SALE.x + SALE.w / 2, SALE.y - 28);
    const breakPulse = KIT.pulse(world, { x: GAP_C, y: PY, r: 150, color: 'rgba(239,68,68,.8)', sw: 3 });
    const breakPulse2 = KIT.pulse(world, { x: GAP_C, y: PY, r: 240, color: 'rgba(239,68,68,.45)', sw: 2 });

    /* ---- "Investido" counter ---- */
    const CNT = { x: S1[0] + 38, y: PY + 40 };
    const counter = h('div', { style: { position: 'absolute', left: `${CNT.x}px`, top: `${CNT.y}px`, fontFamily: FONT_UI, color: '#fff' } }, world);
    h('div', { style: { fontSize: '17px', fontWeight: 600, color: 'rgba(255,255,255,.6)', letterSpacing: '0.01em' } }, counter, 'Investido');
    const cRow = h('div', { style: { marginTop: '4px', display: 'flex', alignItems: 'center', gap: '14px' } }, counter);
    const cVal = h('div', { style: { fontSize: '44px', lineHeight: '52px', fontWeight: 800, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' } }, cRow, 'R$ 0');
    const cIcon = h('div', { style: { width: '34px', height: '34px', borderRadius: '10px', display: 'grid', placeItems: 'center', background: 'rgba(239,68,68,.16)',
      border: '1px solid rgba(239,68,68,.4)', color: RED, transformOrigin: '50% 50%' } }, cRow);
    cIcon.innerHTML = GTR.iconSVG('trending-up', { size: 20, sw: 2.4 });

    /* ============================================================ STREAKS (whip-in) */
    const { canvas: stCanvas, ctx: sc } = GTR.canvas(root, { z: 2 });

    /* ============================================================ HUD */
    const hud = h('div', { style: { position: 'absolute', inset: '0', zIndex: 5 } }, root);
    const band = h('div', { style: { position: 'absolute', left: '0', right: '0', bottom: '0', height: '380px',
      background: 'linear-gradient(0deg, rgba(0,21,22,.9) 0%, rgba(0,21,22,0) 100%)', opacity: 0 } }, hud);
    const hudText = h('div', { style: { position: 'absolute', inset: '0' } }, hud);
    const title = KIT.headline(hudText, 'O dinheiro *some*.', { size: 120, x: 960, y: 850, w: 1600, split: 'chars', lh: 1.04 });
    const em = title.el.querySelector('.kit-em');
    em.style.color = RED;
    em.style.textShadow = '0 0 30px rgba(239,68,68,0.5)';
    const subEl = h('div', { class: 'body', style: { position: 'absolute', left: '160px', width: '1600px', top: '950px', transform: 'translateY(-50%)', textAlign: 'center',
      fontSize: '36px', fontWeight: 600, color: 'rgba(255,255,255,.8)', whiteSpace: 'nowrap' } }, hudText);
    const subA = h('span', {}, subEl, 'Qual anúncio vendeu?');
    subEl.appendChild(document.createTextNode(' '));
    const subB = h('span', { style: { color: '#fff' } }, subEl, 'Ninguém sabe.');
    const subUnits = [...GTR.split(subA, 'words'), ...GTR.split(subB, 'words')];

    /* ---- end overlay (hand-off to S4: #000c0d at .85, chips above it) ---- */
    const overlay = h('div', { style: { position: 'absolute', inset: '0', zIndex: 50, background: '#000c0d', opacity: 0, display: 'none' } }, root);

    /* ---- chips: 01 + 02 already in the log, 03 stamps at 2.75 ---- */
    const chip1 = KIT.diagChip(root, { n: '01', err: 'SEM RESPOSTA', ok: 'RESPONDIDO', x: 120, y: 96 });
    const chip2 = KIT.diagChip(root, { n: '02', err: 'NÚMERO BANIDO', ok: 'API OFICIAL', x: 120, y: 154 });
    const chip3 = KIT.diagChip(root, { n: '03', err: 'SEM RASTREIO', ok: 'RASTREADO', x: 120, y: 212 });

    /* ============================================================ SPRITES */
    const sprite = (fill, ink, glow) => {
      const S = 2, M = 22, W = TOK_W + 2 * M, H = TOK_H + 2 * M;
      const cv = document.createElement('canvas');
      cv.width = W * S; cv.height = H * S;
      const c = cv.getContext('2d');
      c.scale(S, S);
      c.translate(M, M);
      if (glow) { c.shadowColor = glow; c.shadowBlur = 16; }
      c.beginPath(); c.roundRect(0, 0, TOK_W, TOK_H, 9); c.fillStyle = fill; c.fill();
      c.shadowBlur = 0; c.shadowColor = 'transparent';
      const gr = c.createLinearGradient(0, 0, 0, TOK_H);
      gr.addColorStop(0, 'rgba(255,255,255,.30)'); gr.addColorStop(0.5, 'rgba(255,255,255,0)'); gr.addColorStop(1, 'rgba(0,0,0,.12)');
      c.beginPath(); c.roundRect(0, 0, TOK_W, TOK_H, 9); c.fillStyle = gr; c.fill();
      c.lineWidth = 1; c.strokeStyle = 'rgba(255,255,255,.28)';
      c.beginPath(); c.roundRect(0.5, 0.5, TOK_W - 1, TOK_H - 1, 8.5); c.stroke();
      c.fillStyle = ink; c.font = `800 16px ${FONT_UI}`; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText('R$', TOK_W / 2, TOK_H / 2 + 1);
      return { cv, w: W, h: H };
    };
    const SP_TEAL = sprite('#27ae8f', '#fff', 'rgba(21,219,168,.85)');
    const SP_GRAY = sprite('#6b7472', 'rgba(255,255,255,.72)', null);
    const drawSprite = (sp, x, y, scl, rot, a) => {
      if (a <= 0.003) return;
      tc.save();
      tc.globalAlpha = a;
      tc.translate(x, y);
      if (rot) tc.rotate(rot);
      tc.drawImage(sp.cv, -sp.w / 2 * scl, -sp.h / 2 * scl, sp.w * scl, sp.h * scl);
      tc.restore();
    };

    /* ============================================================ SPARKS */
    const SPARK_COLS = ['255,214,200', '255,140,110', '239,68,68', '249,115,22'];
    const GRAV = 1500;
    // one spark: origin (x0,y0), birth tb, rng r; dir = +1 (sprays right, from the left edge) or −1
    const spark = (t, x0, y0, tb, r, dir, pow) => {
      const life = 0.18 + r() * 0.34;
      const age = t - tb;
      const up = r() < 0.78;                                         // mostly up and out over the gap, a few drip down
      const ang = up ? 0.12 + r() * 1.2 : 0.08 + r() * 0.6;
      const spd = (140 + r() * 460) * pow;
      const col = SPARK_COLS[Math.floor(r() * SPARK_COLS.length)];
      const w = 1.2 + r() * 1.6;
      if (age < 0 || age > life) return;
      const vx = Math.cos(ang) * spd * dir, vy = (up ? -1 : 1) * Math.sin(ang) * spd;
      const x = x0 + vx * age, y = y0 + vy * age + 0.5 * GRAV * age * age;
      const cvx = vx, cvy = vy + GRAV * age;
      const k = age / life;
      tc.strokeStyle = `rgba(${col},${(1 - k) * 0.95})`;
      tc.lineWidth = w * (1 - k * 0.5);
      tc.beginPath();
      tc.moveTo(x, y);
      tc.lineTo(x - cvx * 0.022, y - cvy * 0.022);
      tc.stroke();
    };

    /* ============================================================ TIMELINE (DOM reveals) */
    const tl = ctx.tl();
    // tracking pill fails exactly at the break
    tl.fromTo(pillWait, { rotateX: 0, opacity: 1 }, { rotateX: 90, opacity: 0.4, duration: 0.1, ease: 'power2.in' }, BREAK);
    tl.set(pillWait, { opacity: 0 }, BREAK + 0.1);
    tl.fromTo(pillErr, { rotateX: -90, opacity: 0 }, { rotateX: 0, opacity: 1, duration: 0.34, ease: 'back.out(2)' }, BREAK + 0.1);
    tl.fromTo(pillErr, { scale: 1.12 }, { scale: 1, duration: 0.4, ease: 'power3.out' }, BREAK + 0.1);
    // headline — DOR char cascade (y 90, rot ±8 alternating, stagger .025, back.out)
    tl.fromTo(title.units, { y: 90, opacity: 0, rotate: (i) => (i % 2 ? 8 : -8), scale: 0.9 },
      { y: 0, opacity: 1, rotate: 0, scale: 1, duration: 0.55, stagger: 0.025, ease: 'back.out(1.6)' }, 1.0);
    // subline — word reveal
    tl.fromTo(subUnits, { y: 34, opacity: 0, filter: 'blur(10px)' },
      { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.5, stagger: 0.07, ease: 'power3.out' }, 1.5);
    tl.set({}, {}, 4.0);

    /* ============================================================ SFX */
    ctx.cue('blip', 0.25, { freq: 1200, db: -8 });
    ctx.cue('blip', 0.5, { freq: 1200, db: -8 });
    ctx.cue('error', 0.75, { db: -8 });
    ctx.cue('swoosh', 0.8, { up: false });
    ctx.cue('impact', 1.0, { size: 0.6 });
    ctx.cue('tick', 2.75);
    ctx.cue('whoosh', 3.45, { dur: 0.5, up: false });

    /* ============================================================ UPDATE */
    const burst = (t, t0, k) => (t >= t0 ? Math.exp(-(t - t0) / k) : 0);
    const GL = '?#';
    const GSET = '0123456789?#';
    let lastSeed = -1;

    return {
      tl,
      update(t, g) {
        /* ---------- camera: whip-in, truck, handheld shake, zoom-through ---------- */
        const wi = p(t, 0, 0.4, 'power3.out');
        const whipX = 900 * (1 - wi);
        const truck = -60 * p(t, 0.4, 3.4, 'sine.inOut');
        const A = 3 + 7 * burst(t, BREAK, 0.12) + 5 * burst(t, 1.0, 0.12);
        const shx = noise(g * 8 + 0.61) * A * 1.4, shy = noise(g * 8 + 50.61) * A * 1.4, shr = noise(g * 5 + 9.61) * A * 0.03;
        let k = K0, tx = TX0 + whipX + truck + shx, ty = TY0 + shy;
        const zp = p(t, 3.4, 4.0, 'power2.in');
        const Z = lerp(1, 1.6, zp);
        if (Z !== 1) {
          const gx = tx + k * GAP_C, gy = ty + k * PY;
          tx = gx + Z * (tx - gx); ty = gy + Z * (ty - gy); k *= Z;
        }
        world.style.transform = `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px) scale(${k.toFixed(5)})`;
        shakeWrap.style.transform = `rotate(${shr.toFixed(4)}deg)`;
        const blur = 24 * (1 - wi) + 18 * zp;
        whipWrap.style.filter = blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : 'none';
        whipWrap.style.opacity = 1 - zp;

        /* ---------- parallax layers ---------- */
        bokehBack.style.transform = `translateX(${(-truck * 0.5).toFixed(2)}px)`;
        for (const b of BACK) {
          b.el.style.transform = `translate(${(noise(b.ph, g * 0.3) * 16).toFixed(2)}px, ${(t * b.vy).toFixed(2)}px) rotate(${(b.r0 + b.vr * t).toFixed(2)}deg) scale(${b.sc})`;
        }


        /* ---------- the break: gap edges, droop, glow ---------- */
        const bt = t - BREAK;
        const open = bt >= 0 ? p(t, BREAK, BREAK + 0.14, 'expo.out') : 0;
        const exL = lerp(GAP_C, GAP_L, open), exR = lerp(GAP_C, GAP_R, open);
        const droop = bt >= 0 ? 15 * (1 - Math.exp(-6 * bt) * Math.cos(17 * bt)) + noise(g * 1.3 + 4) * 2.5 : 0;
        const dropR = bt >= 0 ? 11 * (1 - Math.exp(-6 * bt) * Math.cos(15 * bt + 0.6)) + noise(g * 1.3 + 9) * 2 : 0;
        const yL = PY + droop, yR = PY + dropR;
        const flow = -(g * 90) % PERIOD;
        seg1.style.strokeDashoffset = flow;
        if (bt < 0) {
          seg2a.setAttribute('d', `M${S2[0]},${PY} L${GAP_C},${PY}`);
          seg2b.setAttribute('d', `M${GAP_C},${PY} L${S2[1]},${PY}`);
          rail2.setAttribute('d', `M${S2[0]},${PY} L${S2[1]},${PY}`);
        } else {
          seg2a.setAttribute('d', `M${S2[0]},${PY} L${exL - 34},${PY} Q${exL - 10},${PY} ${exL},${yL}`);
          seg2b.setAttribute('d', `M${exR},${yR} Q${exR + 10},${PY} ${exR + 34},${PY} L${S2[1]},${PY}`);
          rail2.setAttribute('d', `M${S2[0]},${PY} L${exL - 34},${PY} Q${exL - 10},${PY} ${exL},${yL}`);
        }
        seg2a.style.strokeDashoffset = flow;
        // right part: pattern continues seamlessly until the break, then the flow dies (frozen, red)
        const flowB = (bt < 0 ? flow : -((BREAK + ctx.start) * 90) % PERIOD) + (GAP_C - S2[0]);
        seg2b.style.strokeDashoffset = flowB.toFixed(2);
        const dead = p(t, BREAK, BREAK + 0.2, 'power2.out');
        seg2b.setAttribute('stroke', `rgba(${Math.round(lerp(255, 239, dead))},${Math.round(lerp(255, 68, dead))},${Math.round(lerp(255, 68, dead))},${lerp(0.35, 0.42, dead).toFixed(3)})`);
        rail1.style.opacity = rail2.style.opacity = 0.7 + 0.3 * Math.sin(g * Math.PI * 4);

        gapGlow.style.opacity = bt < 0 ? 0 : clamp(0.55 + 0.25 * noise(g * 6 + 2) + 0.9 * burst(t, BREAK, 0.18) + 0.5 * zp);
        gapGlow.style.transform = `scale(${(0.85 + 0.2 * open + 1.6 * p(t, 3.3, 4.0, 'power2.in')).toFixed(3)})`;
        breakPulse.set(inv(t, BREAK, BREAK + 0.45));
        breakPulse2.set(inv(t, BREAK + 0.05, BREAK + 0.65));
        const redE = p(t, BREAK, BREAK + 0.3);
        ebSale.style.color = `rgba(${Math.round(lerp(255, 252, redE))},${Math.round(lerp(255, 165, redE))},${Math.round(lerp(255, 165, redE))},${lerp(0.6, 0.85, redE).toFixed(3)})`;
        well.style.opacity = p(t, BREAK, BREAK + 0.6, 'power2.out');
        saleGlow.style.opacity = p(t, BREAK, BREAK + 0.3) * (0.75 + 0.25 * Math.exp(-fract(g * 2) * 4));
        waHalo.style.opacity = 0.8 + 0.2 * Math.sin(g * 4);
    
        /* ---------- tokens ---------- */
        tc.clearRect(0, 0, 1920, 1080);
        let ctaKick = 0, waKick = 0;
        const waRings = [];
        tc.save();
        tc.beginPath();
        tc.rect(S1[0], 0, S2[1] - S1[0], 1080);          // slide out of the ad card, into the sale card
        tc.clip();
        for (const q of TOKENS) {
          const tau = t - q.t0;
          ctaKick += burst(t, q.t0, 0.1);
          waKick += t >= q.tw ? Math.exp(-(t - q.tw) / 0.08) : 0;
          if (t >= q.tw && t < q.tw + 0.36) waRings.push(inv(t, q.tw, q.tw + 0.36));
          if (tau < 0) continue;
          if (q.falls && t >= q.tg) continue;             // drawn in the falling pass
          const x = X0 + V * tau;
          if (x > S2[1] + TOK_W) continue;
          // trail
          const L = 96;
          const gr = tc.createLinearGradient(x - L, 0, x - 20, 0);
          gr.addColorStop(0, 'rgba(21,219,168,0)');
          gr.addColorStop(1, 'rgba(21,219,168,0.55)');
          tc.fillStyle = gr;
          tc.fillRect(x - L, PY - 2, L - 20, 4);
          drawSprite(SP_TEAL, x, PY, 1, 0, 1);
        }
        tc.restore();
        // falling pass (gray-out, tumble, recede, fade — all gone before y ≈ 830)
        for (const q of TOKENS) {
          if (!q.falls || t < q.tg) continue;
          const f = t - q.tg;
          if (f > 0.75) continue;
          const vx = V * 0.9;
          const x = GAP_L + (vx / q.kd) * (1 - Math.exp(-q.kd * f));
          const y = yL + q.vy * f + 0.5 * 2200 * f * f;
          const scl = lerp(1, 0.55, p(f, 0, 0.7, 'power1.in'));
          const rot = q.spin * f;
          const gray = p(f, 0.02, 0.28, 'power1.out');
          const a = 1 - p(f, 0.2, 0.56, 'power1.in');
          drawSprite(SP_TEAL, x, y, scl, rot, a * (1 - gray));
          drawSprite(SP_GRAY, x, y, scl, rot, a * gray);
        }

        /* ---------- sparks + hot broken ends ---------- */
        if (bt >= 0) {
          tc.save();
          tc.globalCompositeOperation = 'lighter';
          tc.lineCap = 'round';
          // continuous spitting from both ends
          const DT = 0.018;
          const i1 = Math.floor(bt / DT), i0 = Math.max(0, i1 - 30);
          for (let i = i0; i <= i1; i++) {
            spark(t, exL, yL, BREAK + i * DT, rng(1000 + i), 1, 0.8);
            spark(t, exR, yR, BREAK + i * DT + 0.011, rng(5000 + i), -1, 0.7);
          }
          // the snap: a big burst from both ends
          for (let i = 0; i < 34; i++) {
            spark(t, exL, yL, BREAK, rng(9000 + i), 1, 1.7);
            spark(t, exR, yR, BREAK, rng(9500 + i), -1, 1.6);
          }
          // each token that tips over the edge kicks a small shower
          for (const q of TOKENS) {
            if (!q.falls || t < q.tg || t > q.tg + 0.6) continue;
            for (let i = 0; i < 9; i++) spark(t, GAP_L, yL, q.tg, rng(q.t0 * 1000 + i), 1, 1.1);
          }
          // glowing frayed ends
          for (const [ex, ey, ph] of [[exL, yL, 1], [exR, yR, 7]]) {
            const fl = 0.7 + 0.3 * noise(g * 14 + ph) + 0.8 * burst(t, BREAK, 0.12);
            const rg = tc.createRadialGradient(ex, ey, 0, ex, ey, 30);
            rg.addColorStop(0, `rgba(255,190,170,${clamp(0.9 * fl)})`);
            rg.addColorStop(0.25, `rgba(239,68,68,${clamp(0.55 * fl)})`);
            rg.addColorStop(1, 'rgba(239,68,68,0)');
            tc.fillStyle = rg;
            tc.fillRect(ex - 30, ey - 30, 60, 60);
          }
          tc.restore();
        }

        /* ---------- ad card: CTA flash per emission, image sheen ---------- */
        ctaFlash.style.opacity = clamp(ctaKick * 0.9);
        sheen.style.transform = `translateX(${(fract((g + 0.3) / 1.6) * 640).toFixed(1)}px) rotate(20deg)`;

        /* ---------- WhatsApp node: kick + rings on every passing token ---------- */
        waWrap.style.transform = `scale(${(1 + 0.07 * Math.min(1.5, waKick)).toFixed(4)})`;
        waPulses.forEach((pl, i) => pl.set(waRings[i] != null ? waRings[i] : 0));

        /* ---------- sale node: the value never resolves ---------- */
        const seed = Math.floor(t * 12);
        if (seed !== lastSeed) {
          lastSeed = seed;
          const r = rng(seed + 77);
          const force = Math.floor(r() * glyphs.length);           // always at least one unknown glyph
          for (const [gi, gl] of glyphs.entries()) {
            const ch = gi === force ? GL[Math.floor(r() * 2)] : GSET[Math.floor(r() * GSET.length)];
            gl.textContent = ch;
            gl.style.color = GL.includes(ch) ? '#fca5a5' : '#fff';
          }
        }
        saleVal.style.opacity = 0.82 + 0.18 * noise(g * 9 + 3);
        loader.style.transform = `rotate(${(t * 420).toFixed(1)}deg)`;
        saleRing.style.opacity = bt < 0 ? 0 : (0.35 + 0.5 * Math.exp(-fract(g * 2) * 5)) * p(t, BREAK, BREAK + 0.2);
        saleCard.style.borderColor = bt >= 0 && bt < 0.2 ? '#fff' : 'rgba(255,255,255,0.13)';

        /* ---------- "Investido" counter (power1.in) + beat pulse on the icon ---------- */
        const inv$ = 24800 * p(t, 0, 3.2, 'power1.in');
        cVal.textContent = fmt.brl(Math.round(inv$ / 10) * 10);
        cIcon.style.transform = `translateY(${(-3 * Math.exp(-fract(g * 2) * 6)).toFixed(2)}px) scale(${(1 + 0.1 * Math.exp(-fract(g * 2) * 6)).toFixed(3)})`;

        /* ---------- streaks (S2 continuity: dir −1, warm, 0.6 → 0) ---------- */
        sc.clearRect(0, 0, 1920, 1080);
        const sa = 0.6 * (1 - p(t, 0, 0.4, 'power2.out'));
        stCanvas.style.display = sa > 0.004 ? 'block' : 'none';
        if (sa > 0.004) KIT.streaks(sc, g, { dir: -1, alpha: sa, n: 54, seed: 21, speed: 2600, len: 460, color: '255,176,166' });
        // zoom-through: radial speed lines rushing out of the gap
        const zs = p(t, 3.42, 3.8, 'power2.out') * (1 - p(t, 3.72, 3.98, 'power1.in'));
        if (zs > 0.004) {
          stCanvas.style.display = 'block';
          const cx = tx + k * GAP_C, cy = ty + k * PY;
          const zt = t - 3.42;
          sc.lineCap = 'round';
          for (let i = 0; i < 64; i++) {
            const r = rng(4200 + i);
            const ang = r() * Math.PI * 2, sp = 900 + r() * 2200, len = (70 + r() * 260) * (0.4 + zs);
            const rr = ((r() * 1200 + zt * sp) % 1250) + 40;
            const x0 = cx + Math.cos(ang) * rr, y0 = cy + Math.sin(ang) * rr;
            const x1 = cx + Math.cos(ang) * (rr + len), y1 = cy + Math.sin(ang) * (rr + len);
            const gr = sc.createLinearGradient(x0, y0, x1, y1);
            const al = 0.42 * zs * (0.35 + r() * 0.65);
            gr.addColorStop(0, 'rgba(255,176,166,0)');
            gr.addColorStop(1, `rgba(255,176,166,${al.toFixed(3)})`);
            sc.strokeStyle = gr;
            sc.lineWidth = 1 + r() * 2;
            sc.beginPath(); sc.moveTo(x0, y0); sc.lineTo(x1, y1); sc.stroke();
          }
        }

        /* ---------- HUD: band, exit 3.4–3.7 ---------- */
        const hx = p(t, 3.4, 3.7, 'power2.in');
        band.style.opacity = p(t, 0.85, 1.3, 'power1.out') * (1 - p(t, 3.4, 3.9, 'power1.in'));
        hudText.style.opacity = 1 - hx;
        hudText.style.transform = `translateY(${(4 * noise(g * 0.4 + 12) + 24 * hx).toFixed(2)}px)`;
        hudText.style.filter = hx > 0.01 ? `blur(${(8 * hx).toFixed(2)}px)` : 'none';

        /* ---------- overlay 0 → .85 (3.6–4.0) ---------- */
        const ov = 0.85 * p(t, 3.6, 3.98, 'power1.inOut');
        overlay.style.opacity = ov;
        overlay.style.display = ov > 0.002 ? 'block' : 'none';

        /* ---------- chips ---------- */
        chip1.set(g, 1, 0);
        chip2.set(g, 1, 0);
        chip3.set(g, inv(t, 2.75, 2.93), 0);
      },
    };
  },
});
