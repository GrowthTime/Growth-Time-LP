/* ============================================================
   S8 · fix-rastreio   [36–44] · z 22 · pre 0 · post 0
   Fix 03: the S3 pipeline is healed — Clique → Conversa → Venda.
   The sale REWINDS to the creative that caused it, the ad flips to its
   real ROAS (5,6x) and the 4 digits of the WhatsApp instance
   ("Vendas 1 · 4321") fly into the campaign tag "[MF · 4321]".

   Hand-off in : ONE teal line (3 px + glow) across the full width at
                 y 460 (S7's last frame). It contracts into the two
                 pipeline connectors (same node positions as S3).
   Hand-off out: the empty dark stage (everything drifts up and fades).
   Everything that moves is a pure function of local time t (0…8);
   the tl only drives the HUD headline / caption word reveals.
   ============================================================ */
GTR.scene({
  id: 'fix-rastreio',
  build(root, ctx) {
    const { h, s, clamp, lerp, p, inv, noise, fract } = GTR;
    const C = KIT.C;
    const I = (n, o = {}) => GTR.iconSVG(n, o);
    const px = (v) => `${v}px`;
    const tl = ctx.tl();
    const vis = (el, a) => {
      el.style.opacity = a;
      el.style.visibility = a > 0.002 ? 'visible' : 'hidden';
    };
    // pop progress (overshoots with back eases); 0 before `a`
    const pop = (t, a, d = 0.5, e = 'back.out(1.6)') => (t < a ? 0 : p(t, a, a + d, e));
    const decay = (t, a, k = 4) => (t < a ? 0 : Math.exp(-(t - a) * k));
    const qb = (a, c, b, u) => (1 - u) * (1 - u) * a + 2 * u * (1 - u) * c + u * u * b;
    const mix = (c0, c1, k) => {
      const a = c0.match(/\w\w/g).map((x) => parseInt(x, 16));
      const b = c1.match(/\w\w/g).map((x) => parseInt(x, 16));
      return `rgb(${a.map((v, i) => Math.round(lerp(v, b[i], clamp(k)))).join(',')})`;
    };
    const MONO = "ui-monospace, 'DejaVu Sans Mono', 'Liberation Mono', monospace";
    const LIGHT_SHADOW = '0 40px 120px rgba(0,0,0,.55), 0 0 0 1px rgba(255,255,255,.08), 0 0 80px rgba(21,219,168,.12)';

    /* ---------------- geometry (world px = screen px at identity camera) ---------------- */
    const LINE_Y = 460;
    const AD = { x: 180, y: 250, w: 340, h: 420 };
    const CONV = { x: 780, y: 360, w: 360, h: 200 };
    const SALE = { x: 1480, y: 360, w: 320, h: 200 };
    const S1 = [520, 780], S2 = [1140, 1480];          // connector segments (y 460)
    const LABEL = { x: 180, y: 200 };                   // campaign tag, 36 px tall
    const EYE_Y = 700;
    const EYES = [[350, '01 · CLIQUE', 0.9], [960, '02 · CONVERSA', 1.5], [1640, '03 · VENDA', 2.0]];
    // push-in (3.5–4.1): world point F lands on screen point S at scale s
    const PUSH = { s: 1.26, F: [549, 435], S: [940, 436] };
    // pull-back (5.15–6.05, power2.inOut, log-scale zoom about a fixed screen point):
    // the pipeline becomes a strip at y ≈ 110–360. ≤ 0.03 scale change per frame @60fps.
    const PULL = { s: 0.55, x: -16, y: -250, t0: 5.15, t1: 6.05 };
    const TOP3 = { x: 510, y: 405, w: 900, h: 320 };
    // the Top 3 card only pops once the world is within ~3% of its final framing
    // (ad card bottom ≤ y 370), then its rows cascade.
    const T3_IN = 5.95;
    const ROW_AT = [6.05, 6.25, 6.45];
    const PULSE = { t0: 6.08, t1: 6.4 };                 // ad "5,6x" → row #1 "5,6x"
    const SWEEP = { t0: 3.5, t1: 3.8 };                  // chip flip: teal sweep ad → sale

    /* ================= BACK LAYERS ================= */
    // parallax dot plane (moves at 45% of the camera)
    const plane = h('div', { style: {
      position: 'absolute', left: '-240px', top: '-240px', width: '2400px', height: '1560px', pointerEvents: 'none', opacity: 0,
      backgroundImage: 'radial-gradient(rgba(21,219,168,0.2) 1.3px, transparent 1.7px)', backgroundSize: '40px 40px',
      WebkitMaskImage: 'radial-gradient(46% 44% at 50% 47%, #000 0%, rgba(0,0,0,.4) 55%, transparent 100%)',
      maskImage: 'radial-gradient(46% 44% at 50% 47%, #000 0%, rgba(0,0,0,.4) 55%, transparent 100%)',
      transformOrigin: '50% 50%',
    } }, root);
    // the S7 line halo (fades as the line contracts)
    const halo = h('div', { style: { position: 'absolute', left: '0', top: px(LINE_Y - 80), width: '1920px', height: '160px', pointerEvents: 'none',
      background: 'radial-gradient(60% 50% at 50% 50%, rgba(21,219,168,0.28), rgba(21,219,168,0) 72%)' } }, root);

    /* ================= WORLD (camera) ================= */
    const cam = KIT.camera(root, { perspective: 1500 });
    cam.view.style.zIndex = '1';
    const world = cam.world;
    world.style.transformStyle = 'flat';

    const gAd = GTR.glow(world, { x: 350, y: 460, r: 400, a: 0.16 });
    const gConv = GTR.glow(world, { x: 960, y: 460, r: 420, a: 0.16 });
    const gSale = GTR.glow(world, { x: 1640, y: 460, r: 380, a: 0.14 });
    [gAd, gConv, gSale].forEach((g) => { g.style.opacity = 0; });

    /* ---------- connectors (DOM: they ARE the S7 line at t=0) ---------- */
    const mkSeg = () => {
      const el = h('div', { style: { position: 'absolute', top: px(LINE_Y - 1.5), height: '3px', borderRadius: '2px', background: C.vibrant, overflow: 'hidden' } }, world);
      const flow = h('div', { style: { position: 'absolute', inset: '0', opacity: 0,
        backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.95) 0 7px, rgba(255,255,255,0) 7px 24px)' } }, el);
      return { el, flow };
    };
    const segA = mkSeg(), segB = mkSeg();

    // token canvas (below the cards: tokens slip "into" the nodes)
    const TK = GTR.canvas(world, { z: 0 });
    const tg = TK.ctx;

    /* ---------- campaign tag ---------- */
    const label = h('div', { style: {
      position: 'absolute', left: px(LABEL.x), top: px(LABEL.y), height: '36px', display: 'inline-flex', alignItems: 'center', gap: '10px',
      padding: '0 16px 0 12px', borderRadius: '999px', whiteSpace: 'nowrap',
      background: 'linear-gradient(180deg, rgba(255,255,255,.09), rgba(255,255,255,.03)), rgba(3,26,25,.88)',
      border: '1px solid rgba(255,255,255,.14)', boxShadow: '0 10px 30px rgba(0,0,0,.35)',
      fontFamily: MONO, fontSize: '18px', color: '#cbd5d1', transformOrigin: '0% 50%',
    } }, world);
    h('span', { style: { display: 'inline-grid', placeItems: 'center', color: C.vibrant } }, label, I('tag', { size: 16, sw: 2.2 }));
    const lTxt = h('span', { style: { position: 'relative' } }, label);
    h('span', {}, lTxt).textContent = '[MF · ';
    const lDigits = [...'4321'].map((ch) => {
      const d = h('span', { style: { display: 'inline-block', transformOrigin: '50% 60%' } }, lTxt);
      d.textContent = ch;
      return d;
    });
    const TAG_ROOM = 9;                                  // px opened between '1' and ']' when the box lands
    h('span', {}, lTxt).textContent = '] Coleção Verão · Carrossel';

    /* ---------- ad card (flips to its ROAS back face) ---------- */
    const adWrap = h('div', { style: { position: 'absolute', left: px(AD.x), top: px(AD.y), width: px(AD.w), height: px(AD.h), perspective: '1400px', transformOrigin: '50% 50%' } }, world);
    const adFlip = h('div', { style: { position: 'absolute', inset: '0', transformStyle: 'preserve-3d', transformOrigin: '50% 50%' } }, adWrap);
    const faceCss = {
      position: 'absolute', inset: '0', borderRadius: '18px', background: '#fff', border: `1px solid ${C.border}`, boxShadow: LIGHT_SHADOW,
      overflow: 'hidden', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', color: C.fg, fontFamily: 'var(--font-ui)',
    };
    const adFront = h('div', { style: Object.assign({}, faceCss) }, adFlip);
    const adBack = h('div', { style: Object.assign({}, faceCss, { transform: 'rotateY(180deg)', background: 'radial-gradient(130% 70% at 50% 42%, #effcf7 0%, #ffffff 70%)' }) }, adFlip);

    // front
    const fHead = h('div', { style: { position: 'absolute', left: '16px', right: '14px', top: '14px', height: '40px', display: 'flex', alignItems: 'center', gap: '10px' } }, adFront);
    const mfAv = KIT.avatar(fHead, { text: 'MF', size: 36, bg: 'linear-gradient(135deg,#fb7185,#be123c)' });
    mfAv.style.fontSize = '13px';
    mfAv.style.boxShadow = '0 0 0 2px #fff, 0 0 0 3.5px #f472b6';
    h('div', { style: { flex: '1', fontSize: '15px', whiteSpace: 'nowrap', color: '#171717', letterSpacing: '-0.005em' } }, fHead,
      '<b style="font-weight:700">modafashion</b><span style="color:#737373;font-weight:500"> · Patrocinado</span>');
    h('div', { style: { color: '#a3a3a3', display: 'flex' } }, fHead, I('ellipsis', { size: 20 }));
    const img = h('div', { style: { position: 'absolute', left: '16px', right: '16px', top: '64px', height: '244px', borderRadius: '12px', overflow: 'hidden', background: 'linear-gradient(135deg,#fb7185,#c2410c)' } }, adFront);
    h('div', { style: { position: 'absolute', right: '-70px', top: '-80px', width: '260px', height: '260px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,237,213,.8), rgba(255,237,213,0) 65%)' } }, img);
    h('div', { style: { position: 'absolute', left: '-40px', bottom: '-90px', width: '300px', height: '200px', borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(124,45,18,.45), rgba(124,45,18,0))' } }, img);
    h('div', { style: { position: 'absolute', left: '50%', top: '26px', marginLeft: '-60px', color: 'rgba(255,255,255,.95)', filter: 'drop-shadow(0 12px 22px rgba(124,45,18,.35))' } }, img, I('shirt', { size: 120, sw: 1.35 }));
    h('div', { class: 'display', style: { position: 'absolute', left: '18px', bottom: '34px', fontSize: '28px', color: '#fff', letterSpacing: '.02em', textShadow: '0 2px 14px rgba(124,45,18,.45)' } }, img, 'COLEÇÃO VERÃO');
    h('div', { style: { position: 'absolute', right: '12px', top: '12px', padding: '3px 9px', borderRadius: '999px', background: 'rgba(0,0,0,.32)', color: '#fff', fontSize: '12px', fontWeight: 700 } }, img, '1/3');
    const cdots = h('div', { style: { position: 'absolute', left: '0', right: '0', bottom: '14px', display: 'flex', justifyContent: 'center', gap: '6px' } }, img);
    [1, 0, 0].forEach((on) => h('span', { style: { width: '7px', height: '7px', borderRadius: '50%', background: on ? '#fff' : 'rgba(255,255,255,.5)' } }, cdots));
    h('div', { style: { position: 'absolute', left: '18px', right: '18px', top: '318px', fontSize: '14px', color: '#404040', whiteSpace: 'nowrap', overflow: 'hidden' } }, adFront,
      '<b style="font-weight:700">modafashion</b> Vestido midi · grade P ao GG');
    const CTA_TOP = 350, CTA_H = 52;
    const cta = h('div', { style: { position: 'absolute', left: '16px', right: '16px', top: px(CTA_TOP), height: px(CTA_H), borderRadius: '12px', background: '#f0f2f5', display: 'flex', alignItems: 'center', gap: '10px', padding: '0 14px 0 12px', fontSize: '16px', fontWeight: 700, color: '#111', transformOrigin: '50% 50%' } }, adFront);
    cta.innerHTML = `<span style="width:30px;height:30px;border-radius:50%;background:${C.wa};display:grid;place-items:center;color:#fff;flex:none">${I('message-circle', { size: 17, sw: 2.4 })}</span><span style="flex:1">Enviar mensagem</span>${I('chevron-right', { size: 20, color: '#737373' })}`;
    const CTA_C = [AD.x + AD.w / 2, AD.y + CTA_TOP + CTA_H / 2];

    // back
    const bHead = h('div', { style: { position: 'absolute', left: '18px', right: '18px', top: '16px', height: '48px', display: 'flex', alignItems: 'center', gap: '12px' } }, adBack);
    h('div', { style: { width: '48px', height: '48px', borderRadius: '11px', background: 'linear-gradient(135deg,#fb7185,#c2410c)', display: 'grid', placeItems: 'center', color: '#fff', flex: 'none' } }, bHead, I('shirt', { size: 26, sw: 1.8 }));
    h('div', { style: { lineHeight: 1.2, whiteSpace: 'nowrap' } }, bHead, '<div style="font-weight:700;font-size:17px;color:#171717">Coleção Verão</div><div style="font-weight:500;font-size:14px;color:#737373">Carrossel · Meta Ads</div>');
    h('div', { style: { position: 'absolute', left: '18px', right: '18px', top: '80px', height: '1px', background: '#ececec' } }, adBack);
    const bBody = h('div', { style: { position: 'absolute', left: '0', right: '0', top: '81px', bottom: '0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingBottom: '6px' } }, adBack);
    h('div', { style: { display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '15px', fontWeight: 800, letterSpacing: '0.24em', color: C.tealDark } }, bBody,
      I('trending-up', { size: 18, sw: 2.6 }) + '<span>ROAS</span>');
    const bigBox = h('div', { style: { position: 'relative', height: '118px', width: '100%', marginTop: '4px' } }, bBody);
    const big = h('div', { class: 'display', style: {
      position: 'absolute', left: '0', right: '0', top: '0', textAlign: 'center', fontSize: '110px', lineHeight: '118px', letterSpacing: '-0.01em',
      background: 'linear-gradient(90deg,#27ae8f,#15dba8)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', WebkitTextFillColor: 'transparent',
      transformOrigin: '50% 55%', opacity: 0,
    } }, bigBox, '5,6x');
    // the back face lands composed (header, ROAS eyebrow, invest line, CAPI pill); only "5,6x" stamps in
    h('div', { style: { marginTop: '10px', fontSize: '16px', fontWeight: 600, color: '#525252', whiteSpace: 'nowrap' } }, bBody, 'Invest. R$ 8.200 · Leads 720');
    const capi = h('div', { style: { marginTop: '26px' } }, bBody);
    const capiIn = h('div', { style: { display: 'inline-flex', alignItems: 'center', gap: '9px', padding: '9px 16px 9px 13px', borderRadius: '999px', whiteSpace: 'nowrap',
      background: '#ecfdf5', border: '1px solid rgba(21,219,168,.5)', color: '#0f766e', fontSize: '15px', fontWeight: 700, transformOrigin: '50% 50%' } }, capi);
    const capiIc = h('span', { style: { display: 'inline-grid', placeItems: 'center' } }, capiIn, I('send', { size: 17, sw: 2.3 }));
    h('span', {}, capiIn).textContent = 'Compra enviada à Meta';

    /* ---------- conversation card ---------- */
    const conv = h('div', { style: { position: 'absolute', left: px(CONV.x), top: px(CONV.y), width: px(CONV.w), height: px(CONV.h), borderRadius: '18px', overflow: 'hidden',
      background: '#fff', border: `1px solid ${C.border}`, boxShadow: LIGHT_SHADOW, fontFamily: 'var(--font-ui)', color: C.fg, transformOrigin: '50% 50%' } }, world);
    const cHead = h('div', { style: { position: 'relative', height: '76px', display: 'flex', alignItems: 'center', gap: '12px', padding: '0 16px', borderBottom: `1px solid ${C.border}` } }, conv);
    const cav = h('div', { style: { position: 'relative', width: '46px', height: '46px', flex: 'none' } }, cHead);
    const cavc = KIT.avatar(cav, { text: 'PM', size: 46, bg: 'linear-gradient(135deg,#f472b6,#be185d)' });
    cavc.style.fontSize = '17px';
    const cavb = KIT.channel(cav, 'wa', 18);
    Object.assign(cavb.style, { position: 'absolute', right: '-3px', bottom: '-3px', boxShadow: '0 0 0 2px #fff' });
    const cCol = h('div', { style: { display: 'flex', flexDirection: 'column', gap: '5px', lineHeight: 1.15 } }, cHead);
    h('div', { style: { fontSize: '17px', fontWeight: 700, color: C.fg, whiteSpace: 'nowrap' } }, cCol, 'Patrícia Modas');
    const instChip = h('span', { style: { position: 'relative', alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: '5px', height: '22px', padding: '0 8px',
      borderRadius: '6px', background: C.bgAlt, border: `1px solid ${C.border}`, color: '#404040', fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap' } }, cCol);
    instChip.innerHTML = I('smartphone', { size: 12, color: C.tealDark, sw: 2.2 }) + '<span>Vendas 1 · </span>';
    const cDigWrap = h('span', { style: { position: 'relative', display: 'inline-block', fontVariantNumeric: 'tabular-nums', fontWeight: 700 } }, instChip);
    const CHIP_ROOM = 3;                                 // px opened after the '·' when the box lands
    const cDigits = [...'4321'].map((ch) => {
      const d = h('span', { style: { display: 'inline-block', transformOrigin: '50% 60%' } }, cDigWrap);
      d.textContent = ch;
      return d;
    });
    h('div', { style: { marginLeft: 'auto', alignSelf: 'flex-start', marginTop: '18px', fontSize: '12.5px', color: '#a3a3a3', fontWeight: 500 } }, cHead, '23:47');
    const cBody = h('div', { style: { position: 'absolute', left: '0', right: '0', top: '76px', bottom: '0', background: C.waBg,
      backgroundImage: 'radial-gradient(rgba(0,0,0,.035) 1.2px, transparent 1.2px)', backgroundSize: '22px 22px', padding: '14px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' } }, conv);
    const typing = KIT.typing(cBody, 'in');
    Object.assign(typing.el.style, { position: 'absolute', left: '14px', top: '16px' });
    const bubble = KIT.bubble(cBody, { side: 'in', text: 'Oi! Vi o anúncio da coleção verão', time: '23:47', tag: { icon: 'megaphone', text: 'Anúncio', color: '#2563eb' }, size: 15.5, maxW: '320px' });

    /* ---------- sale card ---------- */
    const sale = h('div', { style: { position: 'absolute', left: px(SALE.x), top: px(SALE.y), width: px(SALE.w), height: px(SALE.h), borderRadius: '18px', overflow: 'hidden',
      background: '#fff', border: `1px solid ${C.border}`, boxShadow: LIGHT_SHADOW, fontFamily: 'var(--font-ui)', color: C.fg, transformOrigin: '50% 50%' } }, world);
    const skel = h('div', { style: { position: 'absolute', inset: '0', padding: '22px' } }, sale);
    const skBar = (w, hh, mt, r = 7) => h('div', { style: { width: px(w), height: px(hh), marginTop: px(mt), borderRadius: px(r), background: '#eef2f1' } }, skel);
    const skRow = h('div', { style: { display: 'flex', alignItems: 'center', gap: '10px' } }, skel);
    h('div', { style: { width: '26px', height: '26px', borderRadius: '50%', background: '#eef2f1' } }, skRow);
    h('div', { style: { width: '150px', height: '14px', borderRadius: '7px', background: '#eef2f1' } }, skRow);
    skBar(190, 12, 16);
    skBar(150, 40, 16, 10);
    skBar(96, 20, 18, 999);
    const skSheen = h('div', { style: { position: 'absolute', inset: '0', background: 'linear-gradient(100deg, rgba(255,255,255,0) 35%, rgba(255,255,255,.85) 50%, rgba(255,255,255,0) 65%)', backgroundSize: '260% 100%' } }, skel);
    const sc = h('div', { style: { position: 'absolute', inset: '0', padding: '20px 22px', display: 'flex', flexDirection: 'column', opacity: 0 } }, sale);
    const sTop = h('div', { style: { display: 'flex', alignItems: 'center', gap: '9px', whiteSpace: 'nowrap' } }, sc);
    const sCheck = h('span', { style: { display: 'inline-grid', placeItems: 'center', color: C.tealDark, transformOrigin: '50% 50%' } }, sTop, I('circle-check', { size: 24, sw: 2.4 }));
    h('span', { style: { fontSize: '18px', fontWeight: 800, letterSpacing: '-0.01em' } }, sTop, 'Pedido fechado');
    h('span', { style: { marginLeft: 'auto', fontSize: '12.5px', fontWeight: 500, color: '#a3a3a3' } }, sTop, '23:48');
    h('div', { style: { marginTop: '8px', fontSize: '16px', fontWeight: 500, color: '#737373', whiteSpace: 'nowrap' } }, sc, 'Vestido midi · 3 grades');
    const sVal = h('div', { style: { marginTop: '2px', fontSize: '46px', fontWeight: 800, letterSpacing: '-0.025em', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', transformOrigin: '0% 60%' } }, sc, 'R$ 0');
    const sFoot = h('div', { style: { marginTop: 'auto', display: 'flex', gap: '8px' } }, sc);
    h('span', { style: { padding: '4px 10px', borderRadius: '999px', background: C.bgAlt, border: `1px solid ${C.border}`, fontSize: '13px', fontWeight: 600, color: '#525252', whiteSpace: 'nowrap' } }, sFoot, '3 × R$ 389');

    /* ---------- ports on the card edges ---------- */
    // [x, pop time, token hit times]
    // time the chip-flip sweep (sine.inOut over S1[0] → S2[1]) passes world x
    const swHit = (x) => SWEEP.t0 + (SWEEP.t1 - SWEEP.t0) * Math.acos(1 - 2 * clamp(inv(x, S1[0], S2[1]))) / Math.PI;
    const ports = [[S1[0], 0.0, [1.0, 3.4]], [S1[1], 0.25, [1.5, 2.95]], [S2[0], 0.25, [1.5, 2.95]], [S2[1], 0.5, [2.0, 2.5]]].map(([x, at, hits]) => {
      hits = hits.concat([swHit(x)]);
      const el = h('div', { style: { position: 'absolute', left: px(x - 8), top: px(LINE_Y - 8), width: '16px', height: '16px', borderRadius: '50%', background: '#04201b',
        border: `3px solid ${C.vibrant}`, boxShadow: '0 0 12px rgba(21,219,168,.8)', transformOrigin: '50% 50%' } }, world);
      return { el, at: at + 0.3, x, hits };
    });

    /* ---------- eyebrows under the nodes ---------- */
    const eyes = EYES.map(([x, txt, at]) => {
      const e = KIT.eyebrow(world, txt, { x, y: EYE_Y - 12, align: 'center', size: 18, line: false });
      e.el.style.opacity = 0;
      return { el: e.el, at };
    });

    /* ---------- measure the two "4321" glyph runs (once, in build: fonts are loaded and
       nothing is transformed yet, so client rects are exact sub-pixel layout positions) ---------- */
    const WR = world.getBoundingClientRect();
    const WK = WR.width / 1920 || 1;
    const rectIn = (el) => {
      const r = el.getBoundingClientRect();
      return { x: (r.left - WR.left) / WK, y: (r.top - WR.top) / WK, w: r.width / WK, h: r.height / WK };
    };
    cDigWrap.style.marginLeft = px(CHIP_ROOM);            // measure the chip in its final (boxed) layout
    const boxOf = (els) => {
      const r = els.map(rectIn);
      const x0 = Math.min(...r.map((q) => q.x)), x1 = Math.max(...r.map((q) => q.x + q.w));
      const y0 = Math.min(...r.map((q) => q.y)), y1 = Math.max(...r.map((q) => q.y + q.h));
      return { x: x0, y: y0, w: x1 - x0, h: y1 - y0, cx: (x0 + x1) / 2, cy: (y0 + y1) / 2, pts: r.map((q) => [q.x + q.w / 2, q.y + q.h / 2]) };
    };
    const LB = boxOf(lDigits), CB = boxOf(cDigits);
    const BIG = rectIn(big);                              // "5,6x" line box (full card width, text centred)
    cDigWrap.style.marginLeft = '0px';

    // outline boxes, derived from the glyph runs: tag = '4' − 5 … '1' + 5 (the '1' → ']' gap is
    // opened by TAG_ROOM as the box lands); chip = '4' − 3.5 … '1' + 3.5 (clear of the '·').
    const mkBox = (b, l, r, pv, rad) => h('div', { style: {
      position: 'absolute', left: px(b.x - l), top: px(b.y - pv), width: px(b.w + l + r), height: px(b.h + 2 * pv), borderRadius: px(rad),
      border: `2px solid ${C.vibrant}`, boxShadow: '0 0 12px rgba(21,219,168,.75), inset 0 0 8px rgba(21,219,168,.3)', opacity: 0, transformOrigin: '50% 50%',
    } }, world);
    const boxL = mkBox(LB, 5, 5, 3, 6), boxC = mkBox(CB, 3.5, 3.5, 2, 5);

    // laser arc: leaves the chip box on its right (clear of the contact name), arcs over
    // the pipeline and drops onto the label box from above. Cubic P0 → P1 → P2 → P3.
    const LP0 = [CB.x + CB.w + 5, CB.cy], LP1 = [CB.x + CB.w + 165, CB.cy - 40];
    const LP2 = [LB.cx + 70, LB.y - 170], LP3 = [LB.cx, LB.y - 4];
    const cub = (a, b, c, d, u) => { const v = 1 - u; return v * v * v * a + 3 * v * v * u * b + 3 * v * u * u * c + u * u * u * d; };
    const svgUp = s('svg', { width: 1920, height: 1080, viewBox: '0 0 1920 1080', style: { position: 'absolute', left: '0', top: '0', overflow: 'visible', pointerEvents: 'none' } }, world);
    const laserD = `M${LP0[0]},${LP0[1]} C${LP1[0]},${LP1[1]} ${LP2[0]},${LP2[1]} ${LP3[0]},${LP3[1]}`;
    const laserGlow = s('path', { d: laserD, fill: 'none', stroke: 'rgba(21,219,168,0.35)', 'stroke-width': 8, 'stroke-linecap': 'round' }, svgUp);
    const laser = s('path', { d: laserD, fill: 'none', stroke: '#9ff5dd', 'stroke-width': 2.2, 'stroke-linecap': 'round' }, svgUp);
    laserGlow.style.filter = 'blur(3px)';
    const LLEN = laser.getTotalLength();
    [laser, laserGlow].forEach((q) => { q.style.strokeDasharray = `${LLEN}`; q.style.strokeDashoffset = `${LLEN}`; });
    const laserDot = s('circle', { r: 4, fill: '#eafff8', cx: -99, cy: -99 }, svgUp);
    laserDot.style.filter = 'drop-shadow(0 0 6px rgba(21,219,168,1))';
    const EQu = 0.5;
    const EQ = [cub(LP0[0], LP1[0], LP2[0], LP3[0], EQu), cub(LP0[1], LP1[1], LP2[1], LP3[1], EQu)];
    const eq = h('div', { style: { position: 'absolute', left: px(EQ[0] - 15), top: px(EQ[1] - 15), width: '30px', height: '30px', borderRadius: '50%', background: C.vibrant,
      color: '#04201b', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-ui)', fontWeight: 800, fontSize: '22px', lineHeight: 1,
      boxShadow: '0 0 0 4px rgba(4,32,27,.85), 0 0 22px rgba(21,219,168,.9)', opacity: 0, transformOrigin: '50% 50%' } }, world, '=');

    // flying digit clones: each rides its own copy of the laser curve, with a light trail.
    // lift-offs 3.80 + i·0.06, landings on 16ths 4.125 / 4.25 / 4.375 / 4.5
    const TRAIL_N = 9;
    const trailG = s('g', {}, svgUp);
    trailG.style.filter = 'drop-shadow(0 0 5px rgba(21,219,168,.9))';
    const clones = [...'4321'].map((ch, i) => {
      const el = h('div', { class: 'display', style: { position: 'absolute', left: '0', top: '0', fontSize: '40px', lineHeight: 1, color: C.vibrant,
        textShadow: '0 0 14px rgba(21,219,168,.85), 0 0 34px rgba(21,219,168,.45)', transformOrigin: '50% 50%', opacity: 0, whiteSpace: 'nowrap' } }, world, ch);
      const from = CB.pts[i], to = LB.pts[i];
      const dx = to[0] - LB.cx;
      const P = [from, [LP1[0] + (from[0] - CB.cx) * 0.4, LP1[1]], [LP2[0] + dx, LP2[1]], to];
      const at = (u) => [cub(P[0][0], P[1][0], P[2][0], P[3][0], u), cub(P[0][1], P[1][1], P[2][1], P[3][1], u)];
      const segs = Array.from({ length: TRAIL_N }, (_, k) => s('line', { stroke: k < 2 ? '#e8fff8' : C.vibrant, 'stroke-linecap': 'round', 'stroke-width': Math.max(1, 5 - k * 0.45), opacity: 0 }, trailG));
      const t0 = 3.8 + i * 0.06, t1 = 4.125 + i * 0.125;
      return { el, w: el.offsetWidth, h: el.offsetHeight, at, segs, t0, t1 };
    });

    /* ---------- click: pulse + cursor ---------- */
    const ctaPulse = KIT.pulse(world, { x: CTA_C[0], y: CTA_C[1], r: 90, color: C.vibrant, sw: 3 });
    const arrPulse = KIT.pulse(world, { x: S1[0], y: LINE_Y, r: 120, color: C.ouro, sw: 3 });
    const cursor = KIT.cursor(world);

    /* ================= HUD ================= */
    const streak = GTR.canvas(root, { z: 5 });
    streak.canvas.style.pointerEvents = 'none';
    const sg = streak.ctx;

    const hud = h('div', { style: { position: 'absolute', inset: '0', zIndex: 10, pointerEvents: 'none' } }, root);
    const band = h('div', { style: { position: 'absolute', left: '0', right: '0', bottom: '0', height: '380px', opacity: 0,
      background: 'linear-gradient(0deg, rgba(0,21,22,.9) 0%, rgba(0,21,22,0) 100%)' } }, hud);

    const hA = KIT.headline(hud, 'Cada real, *rastreado*.', { x: 960, y: 900, size: 104, glow: true, w: 1680 });
    const hB = KIT.headline(hud, 'ROAS real, *não estimado*.', { x: 960, y: 900, size: 100, glow: true, w: 1680 });
    const cap = h('div', { class: 'body', style: { position: 'absolute', left: '960px', top: '790px', transform: 'translate(-50%, -50%)', fontSize: '30px', fontWeight: 600,
      color: 'rgba(255,255,255,.82)', whiteSpace: 'nowrap', letterSpacing: '-0.005em' } }, hud);
    const capUnits = [['4', 1], ['dígitos', 1], ['ligam', 0], ['anúncio', 0], ['e', 0], ['número.', 0]].map(([w, em], i) => {
      if (i) cap.appendChild(document.createTextNode(' '));
      const u = h('span', { class: 'split-unit' }, cap, null);
      u.textContent = w;
      if (em) u.style.color = C.vibrant;
      return u;
    });

    // Top 3 Criativos (screen-space card, over the pulled-back pipeline)
    const top3 = h('div', { style: { position: 'absolute', left: px(TOP3.x), top: px(TOP3.y), width: px(TOP3.w), height: px(TOP3.h), borderRadius: '20px', background: '#fff',
      border: `1px solid ${C.border}`, boxShadow: LIGHT_SHADOW, padding: '20px 24px 18px', fontFamily: 'var(--font-ui)', color: C.fg, opacity: 0, transformOrigin: '50% 40%' } }, hud);
    const tHead = h('div', { style: { display: 'flex', alignItems: 'center', gap: '12px', height: '36px' } }, top3);
    h('div', { style: { width: '36px', height: '36px', borderRadius: '10px', background: '#fef3c7', color: '#d97706', display: 'grid', placeItems: 'center', flex: 'none' } }, tHead, I('trophy', { size: 20, sw: 2.2 }));
    h('div', { style: { fontSize: '22px', fontWeight: 800, letterSpacing: '-0.015em' } }, tHead, 'Top 3 Criativos');
    h('div', { style: { marginLeft: 'auto', width: '76px', textAlign: 'right', fontSize: '13px', fontWeight: 700, letterSpacing: '0.16em', color: '#a3a3a3', paddingRight: '16px', boxSizing: 'content-box' } }, tHead, 'ROAS');
    const tRows = h('div', { style: { marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px' } }, top3);
    const BAR_W = 250;
    const CREAT = [
      // row #1 IS the traced creative: same pink-orange art and shirt as the ad card
      { name: 'Coleção Verão · Carrossel', sub: 'Invest. R$ 8.200 · Leads 720', v: 5.6, grad: 'linear-gradient(135deg,#fb7185,#c2410c)', icon: 'shirt', at: ROW_AT[0] },
      { name: 'Grade Atacado · Vídeo 15s', v: 5.1, grad: 'linear-gradient(135deg,#38bdf8,#1d4ed8)', icon: 'play', at: ROW_AT[1] },
      { name: 'Depoimento Lojista · Reels', v: 3.7, grad: 'linear-gradient(135deg,#a78bfa,#6d28d9)', icon: 'play', at: ROW_AT[2] },
    ];
    const rows = CREAT.map((c, i) => {
      const gold = i === 0;
      const row = h('div', { style: { position: 'relative', height: '72px', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '16px', padding: '0 16px 0 12px',
        background: gold ? '#fffbeb' : '#fafafa', border: gold ? `2px solid ${C.ouro}` : `1px solid ${C.border}`, opacity: 0 } }, tRows);
      const rank = h('div', { style: { width: '34px', display: 'grid', placeItems: 'center', flex: 'none' } }, row);
      if (gold) rank.innerHTML = '<span class="emoji" style="font-size:28px;line-height:1">🥇</span>';
      else rank.innerHTML = `<span style="width:28px;height:28px;border-radius:50%;background:#eef2f1;color:#525252;font-size:14px;font-weight:800;display:grid;place-items:center">${i + 1}</span>`;
      const th = h('div', { style: { position: 'relative', width: '60px', height: '60px', borderRadius: '11px', background: c.grad, display: 'grid', placeItems: 'center', color: '#fff', flex: 'none', overflow: 'hidden' } }, row);
      h('div', { style: { position: 'absolute', right: '-20px', top: '-24px', width: '70px', height: '70px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,237,213,.6), rgba(255,237,213,0) 65%)' } }, th);
      if (c.icon === 'shirt') {
        // mini version of the ad art: shirt + carousel dots
        h('div', { style: { position: 'relative', marginTop: '-6px', color: 'rgba(255,255,255,.96)', display: 'grid', placeItems: 'center', filter: 'drop-shadow(0 4px 8px rgba(124,45,18,.35))' } }, th, I('shirt', { size: 32, sw: 1.6 }));
        const md = h('div', { style: { position: 'absolute', left: '0', right: '0', bottom: '6px', display: 'flex', justifyContent: 'center', gap: '3px' } }, th);
        [1, 0, 0].forEach((on) => h('span', { style: { width: '4px', height: '4px', borderRadius: '50%', background: on ? '#fff' : 'rgba(255,255,255,.5)' } }, md));
      } else {
        h('div', { style: { position: 'relative', width: '30px', height: '30px', borderRadius: '50%', background: 'rgba(0,0,0,.28)', display: 'grid', placeItems: 'center' } }, th, I(c.icon, { size: 16, sw: 2.4 }));
      }
      const nm = h('div', { style: { flex: '1', minWidth: '0', lineHeight: 1.25, whiteSpace: 'nowrap' } }, row);
      h('div', { style: { fontSize: '18px', fontWeight: 700, color: C.fg } }, nm, c.name);
      if (c.sub) h('div', { style: { fontSize: '13.5px', fontWeight: 500, color: '#737373' } }, nm, c.sub);
      const track = h('div', { style: { position: 'relative', width: px(BAR_W), height: '10px', borderRadius: '999px', background: '#eef2f1', flex: 'none', overflow: 'hidden' } }, row);
      const fill = h('div', { style: { position: 'absolute', left: '0', top: '0', bottom: '0', width: '0px', borderRadius: '999px',
        background: gold ? `linear-gradient(90deg, ${C.tealDark}, ${C.vibrant})` : 'linear-gradient(90deg, #7fcfb8, #38cc9c)' } }, track);
      // the true §1.8 value is printed from the row's first frame; only the bar animates
      const val = h('div', { style: { width: '76px', textAlign: 'right', fontSize: '24px', fontWeight: 800, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums', color: gold ? '#0f766e' : C.fg, flex: 'none', transformOrigin: '100% 55%' } }, row, GTR.fmt.x(c.v, 1));
      // light sheen that runs across row #1 when the pulse arrives
      const sheen = gold ? h('div', { style: { position: 'absolute', inset: '0', borderRadius: '12px', pointerEvents: 'none', opacity: 0,
        background: 'linear-gradient(100deg, rgba(21,219,168,0) 30%, rgba(21,219,168,.22) 46%, rgba(255,255,255,.55) 50%, rgba(21,219,168,.22) 54%, rgba(21,219,168,0) 70%)', backgroundSize: '300% 100%' } }, row) : null;
      return { row, fill, val, c, gold, sheen };
    });

    // pulse: the traced ad's "5,6x" (world, pulled back) → row #1's "5,6x" (HUD). Canvas above the card.
    const PK = GTR.canvas(hud, { z: 3 });
    PK.canvas.style.pointerEvents = 'none';
    const pg = PK.ctx;
    const R1V = rectIn(rows[0].val);                       // measured before any transform is applied
    const R1_END = [R1V.x + R1V.w - 26, R1V.y + R1V.h / 2];

    // top-right status pill
    const pillWrap = h('div', { style: { position: 'absolute', right: '120px', top: '100px', height: '40px', opacity: 0, transformOrigin: '100% 50%' } }, hud);
    const pill = h('div', { style: { height: '40px', display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '0 18px 0 14px', borderRadius: '999px', whiteSpace: 'nowrap',
      background: 'linear-gradient(180deg, rgba(255,255,255,.08), rgba(255,255,255,.02)), rgba(3,26,25,.9)', border: '1px solid rgba(21,219,168,.45)',
      color: C.vibrant, fontSize: '18px', fontWeight: 600, boxShadow: '0 10px 30px rgba(0,0,0,.35), 0 0 24px rgba(21,219,168,.18)' } }, pillWrap);
    const pIcA = h('span', { style: { display: 'inline-grid', placeItems: 'center', transformOrigin: '50% 50%' } }, pill, I('history', { size: 20, sw: 2.3 }));
    const pIcB = h('span', { style: { display: 'none', placeItems: 'center', transformOrigin: '50% 50%' } }, pill, I('circle-check', { size: 20, sw: 2.4 }));
    const pTxt = h('span', { style: { minWidth: '10px' } }, pill);

    // diagnostic chip
    const chipWrap = h('div', { style: { position: 'absolute', left: '0', top: '0', zIndex: 60 } }, root);
    const chip = KIT.diagChip(chipWrap, { n: '03', err: 'SEM RASTREIO', ok: 'RASTREADO', x: 120, y: 96 });

    /* ================= timeline (HUD text reveals) ================= */
    KIT.revealWords(tl, hA.units, 1.0);
    KIT.hideUnits(tl, hA.units, 3.5, { dur: 0.35, stagger: 0.03, y: -30 });
    KIT.revealWords(tl, hB.units, 4.0);
    KIT.revealWords(tl, capUnits, 4.75, { y: 30, blur: 8, dur: 0.6, stagger: 0.05 });

    /* ================= SFX ================= */
    ctx.cue('whoosh', 0.0, { dur: 0.4 });
    ctx.cue('blip', 0.0, { freq: 1200, db: -6 });
    ctx.cue('blip', 0.25, { freq: 1500, db: -6 });
    ctx.cue('blip', 0.5, { freq: 1800, db: -6 });
    ctx.cue('tick', 0.25, { db: -6 });
    ctx.cue('pop', 0.9);
    ctx.cue('swoosh', 1.0, { pan: -0.4 });
    ctx.cue('notify', 1.5, { db: -6 });
    ctx.cue('swoosh', 1.5, { pan: 0.4 });
    ctx.cue('blip', 2.3, { freq: 1600 });
    ctx.cue('type', 2.5, { dur: 0.3, rate: 20, db: -12 });
    ctx.cue('whoosh', 2.5, { dur: 0.9, up: false });
    ctx.cue('swoosh', 3.0);
    ctx.cue('impact', 3.5, { size: 0.6 });
    ctx.cue('pop', 3.5);
    ctx.cue('blip', 3.5, { freq: 2000 });
    [4.125, 4.25, 4.375, 4.5].forEach((tt) => ctx.cue('tick', tt));
    ctx.cue('ping', 4.5, { freq: 1760 });
    ctx.cue('pop', 4.62, { db: -10 });
    // Top 3 rows (shifted from 5.75/6.0/6.25 to follow the slower pull-back)
    ROW_AT.forEach((tt, i) => ctx.cue('blip', tt, { freq: [900, 1100, 1300][i] }));
    ctx.cue('shimmer', PULSE.t0, { db: -12 });
    ctx.cue('whoosh', 7.5, { dur: 0.5, up: true });

    /* ================= computed motion ================= */
    const pushXY = (sc) => ({ x: PUSH.S[0] - 960 - (PUSH.F[0] - 960) * sc, y: PUSH.S[1] - 540 - (PUSH.F[1] - 540) * sc });
    const camAt = (t) => {
      const amp = p(t, 0.3, 1.6, 'sine.inOut');
      const k1 = p(t, 3.5, 4.1, 'power3.inOut');
      const k2 = p(t, PULL.t0, PULL.t1, 'power2.inOut');
      const drift = amp * (1 - 0.6 * k1 * (1 - k2));
      const nx = noise(t * 0.27, 3.1) * 12 * drift, ny = noise(t * 0.27, 7.7) * 7 * drift;
      const b = { x: 0, y: 0, s: 1 + 0.03 * p(t, 0.3, 3.5, 'sine.inOut') };
      const sP = PUSH.s + 0.035 * p(t, 4.1, PULL.t0, 'sine.inOut');
      const P = pushXY(sP);
      const sQ = PULL.s + 0.02 * p(t, 5.6, 8.0, 'sine.inOut');
      const rwPan = Math.sin(Math.PI * p(t, 2.45, 3.55, 'sine.inOut'));   // 0 → 1 → 0 over the rewind
      b.x += 34 * rwPan;
      // A = the (drifting) push-in framing, B = the pulled-back framing
      const A = { x: lerp(b.x, P.x, k1), y: lerp(b.y, P.y, k1), s: lerp(b.s, sP, k1) };
      let x = A.x, y = A.y, sc = A.s;
      if (k2 > 0) {
        // log-scale zoom (constant perceived speed) about the fixed point of A→B:
        // every world point travels on a straight line toward it, no swimming.
        sc = Math.exp(lerp(Math.log(A.s), Math.log(sQ), k2));
        const w = (A.s - sc) / (A.s - sQ);
        x = lerp(A.x, PULL.x, w);
        y = lerp(A.y, PULL.y, w);
      }
      x += nx;
      y += ny;
      const ry = amp * (lerp(2.4, -2.4, p(t, 0.3, 3.5, 'sine.inOut')) * (1 - k1) + lerp(-1.6, 1.4, p(t, 3.5, 8, 'sine.inOut')) * k1) + noise(t * 0.2, 11) * 0.6 * amp;
      const rx = amp * (1.6 * (1 - k1) + 0.8 * k1 * (1 - k2) + 3 * k2) + noise(t * 0.2, 13) * 0.4 * amp;
      return { x, y, s: sc, rx, ry };
    };
    // world point → screen point, same maths as KIT.camera's CSS transform (origin 960,540;
    // translate · rotateX · rotateY · scale) under the view's 1500 px perspective.
    const PERSP = 1500;
    const camProj = (cm, wx, wy) => {
      const ax = (wx - 960) * cm.s, ay = (wy - 540) * cm.s;
      const ry = cm.ry * Math.PI / 180, rx = cm.rx * Math.PI / 180;
      const x1 = ax * Math.cos(ry), z1 = -ax * Math.sin(ry);
      const y2 = ay * Math.cos(rx) - z1 * Math.sin(rx), z2 = ay * Math.sin(rx) + z1 * Math.cos(rx);
      const k = PERSP / (PERSP - z2);
      return [960 + (x1 + cm.x) * k, 540 + (y2 + cm.y) * k];
    };
    const flowPhase = (t) => (t <= 2.5 ? 80 * t : t <= 3.4 ? 200 - 720 * (t - 2.5) : 200 - 648 + 80 * (t - 3.4));

    // ---- token helpers (canvas in world coords) ----
    const comet = (x, y, tailX, a, rad = 9) => {
      if (a <= 0.002) return;
      const L = Math.abs(x - tailX);
      tg.save();
      tg.globalAlpha = a;
      if (L > 2) {
        const g = tg.createLinearGradient(tailX, y, x, y);
        g.addColorStop(0, 'rgba(21,219,168,0)');
        g.addColorStop(1, 'rgba(160,255,228,0.95)');
        tg.strokeStyle = g;
        tg.lineWidth = 5;
        tg.lineCap = 'round';
        tg.shadowColor = 'rgba(21,219,168,1)';
        tg.shadowBlur = 14;
        tg.beginPath(); tg.moveTo(tailX, y); tg.lineTo(x, y); tg.stroke();
      }
      const rg = tg.createRadialGradient(x, y, 0, x, y, rad * 2.6);
      rg.addColorStop(0, 'rgba(255,255,255,1)');
      rg.addColorStop(0.25, 'rgba(160,255,228,0.95)');
      rg.addColorStop(0.55, 'rgba(21,219,168,0.45)');
      rg.addColorStop(1, 'rgba(21,219,168,0)');
      tg.shadowBlur = 0;
      tg.fillStyle = rg;
      tg.beginPath(); tg.arc(x, y, rad * 2.6, 0, Math.PI * 2); tg.fill();
      tg.restore();
    };
    const coin = (x, y, a, sc = 1) => {
      if (a <= 0.002) return;
      tg.save();
      tg.globalAlpha = a;
      tg.translate(x, y);
      tg.scale(sc, sc);
      const hg = tg.createRadialGradient(0, 0, 4, 0, 0, 34);
      hg.addColorStop(0, 'rgba(243,179,21,0.55)');
      hg.addColorStop(0.5, 'rgba(21,219,168,0.22)');
      hg.addColorStop(1, 'rgba(21,219,168,0)');
      tg.fillStyle = hg;
      tg.beginPath(); tg.arc(0, 0, 34, 0, Math.PI * 2); tg.fill();
      const cg = tg.createRadialGradient(-4, -5, 1, 0, 0, 14);
      cg.addColorStop(0, '#fff3c4');
      cg.addColorStop(0.45, '#f3b315');
      cg.addColorStop(1, '#b7791f');
      tg.fillStyle = cg;
      tg.shadowColor = 'rgba(243,179,21,0.9)';
      tg.shadowBlur = 16;
      tg.beginPath(); tg.arc(0, 0, 14, 0, Math.PI * 2); tg.fill();
      tg.shadowBlur = 0;
      tg.lineWidth = 2;
      tg.strokeStyle = C.vibrant;
      tg.beginPath(); tg.arc(0, 0, 17, 0, Math.PI * 2); tg.stroke();
      tg.fillStyle = '#5a3a06';
      tg.font = '800 11px Inter, sans-serif';
      tg.textAlign = 'center';
      tg.textBaseline = 'middle';
      tg.fillText('R$', 0, 0.5);
      tg.restore();
    };
    const spark = (x, y, r, col, a) => {
      if (a <= 0.002) return;
      tg.globalAlpha = a;
      tg.fillStyle = col;
      tg.beginPath(); tg.arc(x, y, r, 0, Math.PI * 2); tg.fill();
    };
    // rewind path: sale → conversation (2.5–2.95), conversation → ad (2.95–3.4)
    const rwX = (tt) => {
      if (tt < 2.5 || tt > 3.4) return null;
      if (tt < 2.95) return lerp(S2[1], S2[0], p(tt, 2.5, 2.95, 'sine.inOut'));
      return lerp(S1[1], S1[0], p(tt, 2.95, 3.4, 'sine.inOut'));
    };
    const burst = (t, t0, x, y, n, seed, life = 0.6, spread = 1) => {
      const tau = t - t0;
      if (tau < 0 || tau > life) return;
      const r = GTR.rng(seed);
      for (let k = 0; k < n; k++) {
        const ang = (r() - 0.5) * Math.PI * 2 * spread;
        const sp = 160 + r() * 360;
        const e = 1 - Math.exp(-tau * 5);
        const bx = x + Math.cos(ang) * sp * e / 5 * 1.2;
        const by = y + Math.sin(ang) * sp * e / 5 * 1.2 + 60 * tau * tau;
        spark(bx, by, 1.4 + r() * 2.4, k % 3 === 0 ? '#ffd46b' : k % 3 === 1 ? '#15dba8' : '#e8fff7', (1 - tau / life) * 0.95);
      }
    };

    const drawTokens = (t) => {
      tg.setTransform(1, 0, 0, 1, 0, 0);
      tg.clearRect(0, 0, 1920, 1080);
      tg.globalAlpha = 1;
      // forward: click → conversation → sale
      if (t >= 1.0 && t < 2.1) {
        const onA = t < 1.5;
        const q = onA ? p(t, 1.0, 1.5, 'power2.inOut') : p(t, 1.5, 2.0, 'power2.inOut');
        const [x0, x1] = onA ? S1 : S2;
        const x = lerp(x0, x1, q);
        const a = onA ? clamp(inv(t, 1.0, 1.06)) : clamp(1 - inv(t, 1.98, 2.06));
        comet(x, LINE_Y, Math.max(x0, x - 170), a, 11);
      }
      burst(t, 1.5, S1[1], LINE_Y, 14, 31, 0.45);
      burst(t, 2.0, S2[1], LINE_Y, 16, 32, 0.5);
      // rewind: money token with 3 ghost echoes
      if (t >= 2.45 && t < 3.75) {
        // sparks shed behind the coin
        for (let k = 0; k < 46; k++) {
          const te = 2.5 + k * 0.02;
          const tau = t - te;
          if (tau < 0 || tau > 0.55) continue;
          const ox = rwX(te);
          if (ox == null) continue;
          const r = GTR.rng(900 + k);
          const vx = 40 + r() * 220, vy = (r() - 0.5) * 170;
          spark(ox + vx * tau, LINE_Y + vy * tau + 140 * tau * tau, 1.3 + r() * 2.2, k % 2 ? '#ffd46b' : '#15dba8', (1 - tau / 0.55) * 0.9);
        }
        tg.globalAlpha = 1;
        [[0.12, 0.15], [0.08, 0.3], [0.04, 0.5], [0, 1]].forEach(([lag, a]) => {
          const x = rwX(t - lag);
          if (x == null) return;
          const edge = clamp(Math.min(inv(t - lag, 2.5, 2.56), 1 - inv(t - lag, 3.36, 3.4)));
          coin(x, LINE_Y, a * Math.max(edge, lag ? 0 : 0.2), lag ? 0.9 : 1);
        });
      }
      burst(t, 3.4, S1[0], LINE_Y, 26, 33, 0.7);
      // 3.5: chip flips to RASTREADO → one teal sweep runs the whole healed pipeline (ad → sale)
      if (t >= SWEEP.t0 && t < SWEEP.t1 + 0.14) {
        const x = lerp(S1[0], S2[1], p(t, SWEEP.t0, SWEEP.t1, 'sine.inOut'));
        const a = clamp(Math.min(inv(t, SWEEP.t0, SWEEP.t0 + 0.03), 1 - inv(t, SWEEP.t1, SWEEP.t1 + 0.14)));
        comet(x, LINE_Y, Math.max(S1[0], x - 360), a, 10);
      }
      // ambient packets once the pipeline is proven
      if (t >= 4.8) {
        for (let j = 0; j < 8; j++) {
          const st = 4.8 + j * 0.5;
          const tau = t - st;
          if (tau < 0 || tau > 1.2) continue;
          const a = 0.8 * clamp(Math.min(inv(tau, 0, 0.08), 1 - inv(tau, 1.12, 1.2)));
          const x = tau < 0.5 ? lerp(S1[0], S1[1], tau / 0.5) : tau < 0.7 ? null : lerp(S2[0], S2[1], (tau - 0.7) / 0.5);
          if (x == null) continue;
          comet(x, LINE_Y, Math.max(tau < 0.5 ? S1[0] : S2[0], x - 60), a, 5);
        }
      }
      tg.globalAlpha = 1;
    };

    return {
      tl,
      update(t) {
        /* ---------- camera + parallax plane ---------- */
        const cm = camAt(t);
        cam.set(cm);
        // zoom blur at the pull-back's peak speed (power2.inOut velocity², max ≈ 4.5 px)
        const pu = inv(t, PULL.t0, PULL.t1);
        const vel = pu > 0 && pu < 1 ? (pu < 0.5 ? 2 * pu : 2 * (1 - pu)) : 0;
        const mb = 4.5 * vel * vel;
        world.style.filter = mb > 0.08 ? `blur(${mb.toFixed(2)}px)` : 'none';
        const ex = p(t, 7.5, 7.95, 'power2.in');            // drift up
        const exA = p(t, 7.5, 7.95, 'sine.inOut');          // fade
        cam.view.style.transform = `translateY(${-60 * ex}px)`;
        cam.view.style.opacity = 1 - exA;
        plane.style.transform = `translate(${cm.x * 0.45}px, ${cm.y * 0.45 - 30 * ex}px) scale(${1 + (cm.s - 1) * 0.45})`;
        plane.style.opacity = 0.55 * p(t, 0.1, 0.9, 'power2.out') * (1 - exA);

        /* ---------- the S7 line contracts into the two connectors ---------- */
        const e0 = p(t, 0, 0.42, 'power3.inOut');
        const g0 = 1 - e0;
        const aL = lerp(0, S1[0], e0), aR = lerp(960, S1[1], e0);
        const bL = lerp(960, S2[0], e0), bR = lerp(1920, S2[1], e0);
        segA.el.style.left = px(aL); segA.el.style.width = px(aR - aL);
        segB.el.style.left = px(bL); segB.el.style.width = px(bR - bL);
        const segShadow = `0 0 ${lerp(5, 8, g0)}px rgba(21,219,168,1), 0 0 ${lerp(12, 22, g0)}px rgba(21,219,168,${lerp(0.55, 0.8, g0)}), 0 0 ${lerp(26, 60, g0)}px rgba(21,219,168,${lerp(0.2, 0.45, g0)})`;
        segA.el.style.boxShadow = segShadow;
        segB.el.style.boxShadow = segShadow;
        halo.style.opacity = 1 - p(t, 0, 0.4, 'power2.out');
        const fl = flowPhase(t);
        const fa = 0.55 * p(t, 0.35, 0.8, 'power2.out') + 0.35 * (t >= 2.5 && t <= 3.45 ? Math.sin(Math.PI * inv(t, 2.5, 3.45)) : 0);
        segA.flow.style.opacity = fa;
        segB.flow.style.opacity = fa;
        segA.flow.style.backgroundPosition = `${fl - aL}px 0`;
        segB.flow.style.backgroundPosition = `${fl - bL}px 0`;

        // residual light-speed streaks from S7, converged on the line, fading out
        streak.canvas.style.display = t < 0.32 ? 'block' : 'none';
        if (t < 0.32) {
          sg.clearRect(0, 0, 1920, 1080);
          const a = 0.9 * 0.3 * (1 - p(t, 0, 0.3, 'power2.out'));
          const sp = p(t, 0, 0.3, 'power2.out');
          KIT.streaks(sg, 6 + t, { n: 70, seed: 7, dir: 1, speed: 2600, len: 520, alpha: a, y0: LINE_Y - 30 * sp, y1: LINE_Y + 30 * sp });
          KIT.streaks(sg, 6 + t, { n: 24, seed: 71, dir: 1, speed: 3400, len: 760, alpha: a * 0.8, color: '220,255,245', y0: LINE_Y - 16 * sp, y1: LINE_Y + 16 * sp });
        }

        /* ---------- node pops ---------- */
        const pa = pop(t, 0.0), pc = pop(t, 0.25), ps = pop(t, 0.5);
        const fl3 = inv(t, 3.0, 3.4);
        const lift = 1 + 0.07 * Math.sin(Math.PI * fl3);
        adWrap.style.opacity = clamp(inv(t, 0.0, 0.22));
        adWrap.style.transform = `translateY(${24 * (1 - pa)}px) scale(${lerp(0.72, 1, pa) * lift})`;
        adFlip.style.transform = `rotateY(${180 * p(t, 3.0, 3.4, 'power2.inOut')}deg)`;
        label.style.opacity = clamp(inv(t, 0.08, 0.3));
        label.style.transform = `translateX(${-16 * (1 - p(t, 0.08, 0.5))}px)`;
        conv.style.opacity = clamp(inv(t, 0.25, 0.45));
        conv.style.transform = `translateY(${24 * (1 - pc)}px) scale(${lerp(0.72, 1, pc)})`;
        sale.style.opacity = clamp(inv(t, 0.5, 0.7));
        sale.style.transform = `translateY(${24 * (1 - ps)}px) scale(${lerp(0.72, 1, ps)})`;
        gAd.style.opacity = p(t, 0.0, 0.6) * (0.8 + 0.2 * Math.sin(t * 2.1)) + 0.9 * decay(t, 3.4, 2.2);
        gConv.style.opacity = p(t, 0.25, 0.85) * (0.8 + 0.2 * Math.sin(t * 2.1 + 1)) + 0.6 * decay(t, 1.5, 3);
        gSale.style.opacity = p(t, 0.5, 1.1) * (0.8 + 0.2 * Math.sin(t * 2.1 + 2)) + 0.6 * decay(t, 2.0, 3);
        ports.forEach((q) => {
          const k = pop(t, q.at, 0.4, 'back.out(3)');
          const hit = Math.max(...q.hits.map((ht) => decay(t, ht, 5)));
          q.el.style.opacity = clamp(inv(t, q.at, q.at + 0.1));
          q.el.style.transform = `scale(${Math.max(0, k) * (1 + 0.5 * hit)})`;
          q.el.style.boxShadow = `0 0 ${12 + 20 * hit}px rgba(21,219,168,${0.8})`;
        });

        /* ---------- click on the ad ---------- */
        const cIn = p(t, 0.45, 0.6, 'power2.out'), cOut = p(t, 1.15, 1.5, 'power2.in');
        const g = p(t, 0.5, 0.88, 'power3.inOut');
        const cx = qb(1200, 700, CTA_C[0] + 6, g) + 30 * cOut, cy = qb(900, 880, CTA_C[1] + 4, g) + 40 * cOut;
        vis(cursor.el, cIn * (1 - cOut));
        const press = t >= 0.9 && t < 1.25 ? inv(t, 0.9, 1.25) : 0;
        cursor.set(cx - 4, cy - 3, press);
        const ck = t >= 0.9 && t < 1.3 ? Math.sin(Math.PI * inv(t, 0.9, 1.3)) : 0;
        cta.style.transform = `scale(${1 - 0.04 * ck})`;
        cta.style.background = `linear-gradient(rgba(21,219,168,${0.28 * ck}), rgba(21,219,168,${0.28 * ck})), #f0f2f5`;
        ctaPulse.set(inv(t, 0.9, 1.45));

        // ad card ring: click, then the rewind arrival (and a quiet "origin found" halo)
        const adRing = Math.max(0.9 * decay(t, 0.9, 3.5), decay(t, 3.4, 2.4), t >= 3.4 ? 0.3 : 0);
        const adSh = `${LIGHT_SHADOW}, 0 0 0 ${1 + 2 * adRing}px rgba(21,219,168,${0.9 * adRing}), 0 0 ${60 * adRing}px rgba(21,219,168,${0.55 * adRing})`;
        adFront.style.boxShadow = adSh;
        adBack.style.boxShadow = adSh;
        arrPulse.set(inv(t, 3.4, 3.95));

        /* ---------- conversation ---------- */
        const approach = t < 1.5 ? p(t, 1.15, 1.5, 'power2.in') : 0;
        const cRing = Math.max(approach, decay(t, 1.5, 2.6), 0.85 * decay(t, 2.95, 4));
        const cFloor = t >= 1.5 ? 0.22 : 0;
        const cr = Math.max(cRing, cFloor);
        conv.style.boxShadow = `${LIGHT_SHADOW}, 0 0 0 ${1 + 2 * cr}px rgba(21,219,168,${0.9 * cr}), 0 0 ${60 * cRing}px rgba(21,219,168,${0.5 * cRing})`;
        vis(typing.el, GTR.win(t, 1.05, 1.5, 0.12, 0.08));
        typing.update(t);
        const pb = pop(t, 1.5, 0.45, 'back.out(1.7)');
        vis(bubble, clamp(inv(t, 1.5, 1.6)));
        bubble.style.transform = `scale(${lerp(0.6, 1, pb)})`;
        // "4321" in the instance chip lights up
        const dg = p(t, 3.7, 3.95, 'power2.out');
        cDigWrap.style.marginLeft = px(CHIP_ROOM * p(t, 3.6, 3.74, 'power2.inOut'));
        instChip.style.background = mix('f4f6f5', 'e7fbf4', dg);
        instChip.style.borderColor = mix('e5e5e5', '8fe6cb', dg);
        cDigits.forEach((d, i) => {
          const lift0 = 3.8 + i * 0.125;
          const kk = t >= lift0 && t < lift0 + 0.3 ? Math.sin(Math.PI * inv(t, lift0, lift0 + 0.3)) : 0;
          d.style.color = mix('404040', '0f766e', dg);
          d.style.textShadow = dg > 0 ? `0 0 ${10 * dg + 8 * kk}px rgba(21,219,168,${0.55 * dg + 0.4 * kk})` : 'none';
          d.style.transform = `translateY(${-3 * kk}px) scale(${1 + 0.25 * kk})`;
        });

        /* ---------- sale ---------- */
        skSheen.style.backgroundPosition = `${lerp(130, -30, fract(t * 0.9))}% 0`;
        const sIn = p(t, 1.9, 2.08, 'power2.out');
        skel.style.opacity = 1 - sIn;
        sc.style.opacity = sIn;
        sc.style.transform = `translateY(${8 * (1 - sIn)}px)`;
        sCheck.style.transform = `scale(${lerp(0.2, 1, pop(t, 1.9, 0.4, 'back.out(3)'))})`;
        const val = Math.round(1167 * p(t, 1.9, 2.3, 'power2.out'));
        sVal.textContent = GTR.fmt.brl(val);
        const vk = t >= 2.3 && t < 2.55 ? Math.sin(Math.PI * inv(t, 2.3, 2.55)) : 0;
        sVal.style.transform = `scale(${1 + 0.07 * vk})`;
        const pick = t >= 2.42 && t < 2.9 ? Math.sin(Math.PI * inv(t, 2.42, 2.9)) : 0;
        sVal.style.color = mix('171717', '0f9f7a', Math.max(vk * 0.6, pick));
        const sRing = Math.max(decay(t, 2.0, 2.6), 0.9 * decay(t, 2.5, 4), t >= 2.0 ? 0.18 : 0);
        sale.style.boxShadow = `${LIGHT_SHADOW}, 0 0 0 ${1 + 2 * sRing}px rgba(21,219,168,${0.9 * sRing}), 0 0 ${50 * sRing}px rgba(21,219,168,${0.45 * sRing})`;

        /* ---------- eyebrows ---------- */
        const eOut = p(t, 3.45, 3.75, 'power2.in');
        eyes.forEach(({ el, at }) => {
          const k = p(t, at, at + 0.45, 'power3.out');
          el.style.opacity = k * (1 - eOut);
          el.style.transform = `translateX(-50%) translateY(${14 * (1 - k) - 10 * eOut}px)`;
        });

        /* ---------- tokens ---------- */
        drawTokens(t);

        /* ---------- ROAS back face ---------- */
        const st = p(t, 3.5, 3.78, 'expo.out');
        big.style.opacity = clamp(inv(t, 3.5, 3.58));
        big.style.transform = `scale(${lerp(1.15, 1, st)})`;
        const emit = t >= PULSE.t0 - 0.06 && t < PULSE.t0 + 0.3 ? Math.sin(Math.PI * inv(t, PULSE.t0 - 0.06, PULSE.t0 + 0.3)) : 0;
        big.style.filter = t >= 3.5 ? `drop-shadow(0 0 ${lerp(34, 12, st) + 26 * emit}px rgba(21,219,168,${lerp(0.95, 0.35, st) + 0.6 * emit}))` : 'none';
        // the CAPI pill is on the face from the flip; it confirms ("sent") right after the stamp
        const sendK = t >= 3.72 && t < 4.22 ? Math.sin(Math.PI * inv(t, 3.72, 4.22)) : 0;
        capiIc.style.transform = `translate(${5 * sendK}px, ${-5 * sendK}px)`;
        capiIn.style.transform = `scale(${1 + 0.045 * sendK})`;
        capiIn.style.boxShadow = sendK > 0 ? `0 0 0 ${3 * sendK}px rgba(21,219,168,${0.22 * sendK}), 0 0 ${18 * sendK}px rgba(21,219,168,${0.35 * sendK})` : 'none';

        /* ---------- the 4 digits ---------- */
        clones.forEach((cl, i) => {
          const uAt = (tt) => GTR.E('power2.inOut')(inv(tt, cl.t0, cl.t1));
          const flying = t > cl.t0 && t < cl.t1;
          if (!flying) { cl.el.style.visibility = 'hidden'; cl.el.style.opacity = 0; }
          else {
            const u0 = inv(t, cl.t0, cl.t1);
            const u = uAt(t);
            const [x, y] = cl.at(u);
            const scl = lerp(lerp(0.34, 0.46, u), 1, Math.sin(Math.PI * u));
            cl.el.style.visibility = 'visible';
            cl.el.style.opacity = clamp(Math.min(u0 / 0.08, (1 - u0) / 0.1));
            cl.el.style.transform = `translate(${x - cl.w / 2}px, ${y - cl.h / 2}px) scale(${scl})`;
          }
          // light trail: the last ~0.1 s of the path
          cl.segs.forEach((sgm, k) => {
            const ta = t - k * 0.011, tb = t - (k + 1) * 0.011;
            if (ta <= cl.t0 || tb >= cl.t1 + 0.02) { sgm.setAttribute('opacity', 0); return; }
            const [x0, y0] = cl.at(uAt(Math.min(ta, cl.t1))), [x1, y1] = cl.at(uAt(Math.max(tb, cl.t0)));
            sgm.setAttribute('x1', x0); sgm.setAttribute('y1', y0);
            sgm.setAttribute('x2', x1); sgm.setAttribute('y2', y1);
            sgm.setAttribute('opacity', (1 - k / TRAIL_N) * 0.9 * (t < cl.t1 ? 1 : 1 - inv(t, cl.t1, cl.t1 + 0.1)));
          });
          // landed digit brightens
          const land = cl.t1;
          const lk = p(t, land - 0.03, land + 0.15, 'power2.out');
          const lp = t >= land - 0.03 && t < land + 0.3 ? Math.sin(Math.PI * inv(t, land - 0.03, land + 0.3)) : 0;
          const d = lDigits[i];
          d.style.color = mix('cbd5d1', '15dba8', lk);
          d.style.textShadow = lk > 0 ? `0 0 ${10 + 12 * lp}px rgba(21,219,168,${0.6 * lk + 0.3 * lp})` : 'none';
          d.style.transform = `scale(${1 + 0.35 * lp})`;
        });
        const bc = p(t, 3.72, 3.95, 'back.out(2)');
        boxC.style.opacity = clamp(inv(t, 3.72, 3.84));
        boxC.style.transform = `scale(${lerp(1.5, 1, bc)})`;
        lDigits[3].style.marginRight = px(TAG_ROOM * p(t, 4.34, 4.5, 'power2.inOut'));
        const bl = p(t, 4.45, 4.68, 'back.out(2)');
        boxL.style.opacity = clamp(inv(t, 4.45, 4.55));
        boxL.style.transform = `scale(${lerp(1.5, 1, bl)})`;
        const ld = p(t, 4.5, 4.75, 'power2.inOut');
        // draws from the label back to the chip, closing the loop
        laser.style.strokeDashoffset = `${-LLEN * (1 - ld)}`;
        laserGlow.style.strokeDashoffset = `${-LLEN * (1 - ld)}`;
        const lpulse = 0.75 + 0.25 * Math.sin(t * 6);
        laserGlow.style.opacity = ld > 0 ? lpulse : 0;
        // a light packet shuttles along the arc (label → chip), once per bar half
        if (t > 4.8) {
          const u = fract((t - 4.8) / 1.0);
          const pt = laser.getPointAtLength(LLEN * (1 - GTR.E('power1.inOut')(u)));
          laserDot.setAttribute('cx', pt.x);
          laserDot.setAttribute('cy', pt.y);
          laserDot.style.opacity = Math.min(1, u / 0.1, (1 - u) / 0.1) * 0.9;
        } else laserDot.style.opacity = 0;
        const qk = pop(t, 4.62, 0.4, 'back.out(2.5)');
        eq.style.opacity = clamp(inv(t, 4.62, 4.7));
        eq.style.transform = `scale(${Math.max(0, qk)})`;

        /* ---------- HUD ---------- */
        hud.style.transform = `translateY(${-60 * ex}px)`;
        hud.style.opacity = 1 - exA;
        chipWrap.style.transform = `translateY(${-60 * ex}px)`;
        chipWrap.style.opacity = 1 - exA;
        band.style.opacity = p(t, 0.85, 1.4, 'power2.out');
        const hx = noise(t * 0.22, 40) * 6, hy = noise(t * 0.22, 41) * 3;
        hA.el.style.transform = `translateY(-50%) translate(${hx}px, ${hy}px)`;
        hB.el.style.transform = `translateY(-50%) translate(${hx}px, ${hy}px)`;
        cap.style.transform = `translate(-50%, -50%) translate(${hx * 0.8}px, ${hy}px)`;

        // status pill: "rastreando a origem…" → "origem encontrada"
        const pv = p(t, 2.5, 2.62, 'power2.out') * (1 - p(t, 5.2, 5.5, 'power2.in'));
        pillWrap.style.opacity = pv;
        const pk = t >= 3.5 && t < 3.8 ? Math.sin(Math.PI * inv(t, 3.5, 3.8)) : 0;
        pillWrap.style.transform = `scale(${lerp(0.9, 1, p(t, 2.5, 2.75, 'back.out(2)')) + 0.08 * pk})`;
        if (t < 3.5) {
          pIcA.style.display = 'inline-grid';
          pIcB.style.display = 'none';
          pIcA.style.transform = `rotate(${-540 * p(t, 2.5, 3.45, 'power2.inOut')}deg)`;
          KIT.type(pTxt, 'rastreando a origem…', inv(t, 2.5, 2.8), false);
        } else {
          pIcA.style.display = 'none';
          pIcB.style.display = 'inline-grid';
          pIcB.style.transform = `scale(${lerp(0.3, 1, pop(t, 3.5, 0.35, 'back.out(3)'))})`;
          KIT.type(pTxt, 'origem encontrada', inv(t, 3.5, 3.72), false);
        }
        pill.style.borderColor = `rgba(21,219,168,${0.45 + 0.5 * pk})`;
        const gl = t >= 2.5 && t < 2.6 ? 1 - 0.4 * inv(t, 2.5, 2.6) : 0;
        KIT.glitch(pill, gl, t, 83);

        // Top 3 Criativos: hidden (and out of the frame's layout) until the pull-back has landed
        const tk = pop(t, T3_IN, 0.45, 'back.out(1.7)');
        vis(top3, clamp(inv(t, T3_IN, T3_IN + 0.1)));
        top3.style.transform = `translateY(${14 * (1 - tk)}px) scale(${lerp(0.94, 1, tk)})`;
        const land = decay(t, PULSE.t1, 3.2);
        rows.forEach((r) => {
          const at = r.c.at;
          const rk = p(t, at, at + 0.45, 'power3.out');
          r.row.style.opacity = clamp(inv(t, at, at + 0.15));
          r.row.style.transform = `translateX(${-24 * (1 - rk)}px)`;
          // true value printed from the first frame; only the bar grows (0 → value, 0.4 s)
          r.fill.style.width = px(BAR_W * (r.c.v / 5.6) * p(t, at, at + 0.4, 'power3.out'));
          if (r.gold) {
            const gs = Math.sin(t * 3);
            r.row.style.boxShadow = `0 0 ${14 + 10 * gs + 26 * land}px rgba(243,179,21,${0.25 + 0.12 * gs + 0.35 * land}), 0 0 0 ${3 * land}px rgba(21,219,168,${0.35 * land})`;
            const vk = t >= PULSE.t1 && t < PULSE.t1 + 0.32 ? Math.sin(Math.PI * inv(t, PULSE.t1, PULSE.t1 + 0.32)) : 0;
            r.val.style.transform = `scale(${1 + 0.16 * vk})`;
            r.val.style.textShadow = land > 0.01 ? `0 0 ${16 * land}px rgba(21,219,168,${0.8 * land})` : 'none';
            // sheen runs back from the value to the thumbnail (the rewind motif, once more)
            const shq = inv(t, PULSE.t1 - 0.02, PULSE.t1 + 0.45);
            r.sheen.style.opacity = shq > 0 && shq < 1 ? Math.sin(Math.PI * shq) : 0;
            r.sheen.style.backgroundPosition = `${lerp(0, 100, GTR.E('power2.out')(shq))}% 0`;
          }
        });

        // pulse: ad card "5,6x" (projected from the world) → row #1 "5,6x"
        pg.setTransform(1, 0, 0, 1, 0, 0);
        pg.clearRect(0, 0, 1920, 1080);
        if (t >= PULSE.t0 && t < PULSE.t1 + 0.5) {
          const P0 = camProj(cm, BIG.x + BIG.w / 2, BIG.y + BIG.h * 0.52);
          const rk0 = p(t, ROW_AT[0], ROW_AT[0] + 0.45, 'power3.out');
          const P3 = [R1_END[0] - 24 * (1 - rk0), R1_END[1] + 14 * (1 - tk)];
          const P1 = [P0[0] + 220, P0[1] + 100], P2 = [P3[0] - 100, P3[1] - 140];
          const at = (u) => [cub(P0[0], P1[0], P2[0], P3[0], u), cub(P0[1], P1[1], P2[1], P3[1], u)];
          const ue = (tt) => GTR.E('power2.inOut')(clamp(inv(tt, PULSE.t0, PULSE.t1)));
          if (t < PULSE.t1 + 0.1) {
            const fade = 1 - inv(t, PULSE.t1, PULSE.t1 + 0.1);
            const N = 16;
            pg.lineCap = 'round';
            for (let k = 0; k < N; k++) {
              const [xa, ya] = at(ue(t - (k * 0.12) / N)), [xb, yb] = at(ue(t - ((k + 1) * 0.12) / N));
              const a = (1 - k / N) * fade;
              pg.strokeStyle = k < 3 ? `rgba(232,255,248,${a})` : `rgba(21,219,168,${a * 0.9})`;
              pg.lineWidth = Math.max(1, 6 - k * 0.32);
              pg.shadowColor = 'rgba(21,219,168,0.9)';
              pg.shadowBlur = 12;
              pg.beginPath(); pg.moveTo(xa, ya); pg.lineTo(xb, yb); pg.stroke();
            }
            pg.shadowBlur = 0;
            if (t < PULSE.t1) {
              const [hx0, hy0] = at(ue(t));
              const rg = pg.createRadialGradient(hx0, hy0, 0, hx0, hy0, 22);
              rg.addColorStop(0, 'rgba(255,255,255,1)');
              rg.addColorStop(0.3, 'rgba(160,255,228,0.9)');
              rg.addColorStop(1, 'rgba(21,219,168,0)');
              pg.fillStyle = rg;
              pg.globalAlpha = clamp(inv(t, PULSE.t0, PULSE.t0 + 0.04));
              pg.beginPath(); pg.arc(hx0, hy0, 22, 0, Math.PI * 2); pg.fill();
              pg.globalAlpha = 1;
            }
          }
          // landing: a ring + sparks on the row's value
          const lt = t - PULSE.t1;
          if (lt >= 0 && lt < 0.5) {
            const q = lt / 0.5;
            pg.strokeStyle = `rgba(21,219,168,${0.85 * (1 - q)})`;
            pg.lineWidth = 2.5 * (1 - q) + 0.5;
            pg.beginPath(); pg.arc(P3[0], P3[1], 14 + 46 * GTR.E('expo.out')(q), 0, Math.PI * 2); pg.stroke();
            const r = GTR.rng(4077);
            for (let k = 0; k < 14; k++) {
              const ang = r() * Math.PI * 2, sp = 60 + r() * 90;
              const e = 1 - Math.exp(-lt * 7);
              pg.globalAlpha = (1 - q) * 0.95;
              pg.fillStyle = k % 3 === 0 ? '#ffd46b' : k % 3 === 1 ? '#15dba8' : '#e8fff7';
              pg.beginPath(); pg.arc(P3[0] + Math.cos(ang) * sp * e, P3[1] + Math.sin(ang) * sp * e, 1.3 + r() * 2, 0, Math.PI * 2); pg.fill();
            }
            pg.globalAlpha = 1;
          }
        }

        /* ---------- diagnostic chip ---------- */
        chip.set(t, inv(t, 0.25, 0.43), inv(t, 3.5, 4.0));
      },
    };
  },
});
