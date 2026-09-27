/* ============================================================
   S7 · fix-oficial   [30–36] · z 21 · pre 0 · post 0
   Fix 02: the same conversation lives on the phone app AND on the
   official Meta Cloud API (Coexistência), with a number-health check
   every 30 min. Never implies that bans become impossible.

   Hand-off in : full-frame #efeae2 WhatsApp wallpaper plate (S6's last frame).
                 It morphs into the phone screen rect (302,175,355×771,r46).
   Hand-off out: dark stage, streaks fading, ONE bright teal line
                 (3 px + glow) across the full width at y 460 (S8's pipeline).
   Everything is a pure function of local time t (0…6).
   ============================================================ */
GTR.scene({
  id: 'fix-oficial',
  build(root, ctx) {
    const { h, s, clamp, lerp, p, noise, fract } = GTR;
    const C = KIT.C;
    const tl = ctx.tl();
    const icon = (n, o) => GTR.iconSVG(n, o);
    const mod = (a, m) => ((a % m) + m) % m;
    const px = (v) => `${v}px`;

    /* ---------------- geometry (world px; camera at identity) ---------------- */
    const PH = { x: 480, y: 578, w: 360 };                  // a touch smaller/lower than S1–S2's phone so the chip
    const K = PH.w / 430;                                    // at (120,96) stays clear through the camera orbit
    const SCR = { x: PH.x + (14 - 215) * K, y: PH.y + (14 - 450) * K, w: 402 * K, h: 872 * K, r: 52 * K };
    const PLATE0 = { x: -120, y: -80, w: 2160, h: 1240 };    // covers the frame under the world's ry −6°
    const A = [666, 600], B = [1000, 640];                  // bridge ends (phone edge → cloud card edge, + port rings)
    // card and health strip share one width so the right-hand column has a single clean edge
    const CARD = { x: 1000, y: 520, w: 620, h: 240 };
    const STRIP = { x: 1000, y: 790, w: 620, h: 96 };
    const HEAD = { x: 900, y: 292 };                         // headline block centre (left-aligned at x)
    const SUB_Y = 446;
    const LINE_Y = 460;
    const GLASS = 'linear-gradient(180deg, rgba(255,255,255,0.09), rgba(255,255,255,0.025)), rgba(3,26,25,0.8)';

    /* ================= WORLD (inside the 3D camera) ================= */
    const cam = KIT.camera(root, { perspective: 1500 });
    cam.view.style.zIndex = '1';
    const world = cam.world;
    // Flat world: children carry their own perspective() so there is no preserve-3d plane
    // splitting/sorting (it produced clipped-shadow artifacts). Depth = DOM order + fake parallax.
    world.style.transformStyle = 'flat';
    // horizontal motion blur for the light-speed exit (applied to the camera view)
    const fsvg = s('svg', { width: 0, height: 0, style: { position: 'absolute', left: '0', top: '0' } }, root);
    const filt = s('filter', { id: 'fo-mblur', x: '-10%', y: '-10%', width: '120%', height: '120%', 'color-interpolation-filters': 'sRGB' }, s('defs', {}, fsvg));
    const fblur = s('feGaussianBlur', { stdDeviation: '0 0' }, filt);

    const gPhone = GTR.glow(world, { x: PH.x, y: PH.y, r: 470, a: 0.2 });
    const gCard = GTR.glow(world, { x: CARD.x + CARD.w / 2, y: 690, r: 600, a: 0.14 });

    /* ---------- phone: WhatsApp Business app, same chat as S6 ---------- */
    const phone = KIT.phone(world, { x: PH.x, y: PH.y, w: PH.w });
    const frame = phone.el.firstChild;
    // move the bezel paint to its own layer so it can fade in without fading the screen
    const bezel = h('div', { style: {
      position: 'absolute', inset: '0', borderRadius: '64px',
      background: 'linear-gradient(145deg, #3a3f44, #101214 40%, #2a2e32 70%, #0b0c0d)',
      boxShadow: '0 50px 120px rgba(0,0,0,0.6), 0 0 0 2px rgba(255,255,255,0.06) inset, 0 0 70px rgba(21,219,168,0.18)',
    } });
    frame.insertBefore(bezel, frame.firstChild);
    frame.style.background = 'none';
    frame.style.boxShadow = 'none';

    const app = h('div', { style: { position: 'absolute', inset: '0', display: 'flex', flexDirection: 'column', background: '#fff' } }, phone.body);
    const bar = h('div', { style: { height: '58px', flex: 'none', display: 'flex', alignItems: 'center', gap: '10px', padding: '0 14px 0 16px', background: '#fff', borderBottom: '1px solid #ededed' } }, app);
    h('div', { style: { width: '32px', height: '32px', borderRadius: '50%', background: C.wa, display: 'grid', placeItems: 'center', color: '#fff', flex: 'none' } }, bar, icon('message-circle', { size: 18, sw: 2.4 }));
    h('div', { style: { flex: '1', fontWeight: 700, fontSize: '19px', color: '#111', letterSpacing: '-0.01em', whiteSpace: 'nowrap' } }, bar, 'WhatsApp Business');
    // status pill: off ("Conectando…", grey, spinner) until the bridge lands at 1.5, then green "Conectado"
    const conn = h('div', { style: { display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '5px 11px', borderRadius: '999px', background: '#e5e7eb', color: '#6b7280', fontSize: '13px', fontWeight: 700, flex: 'none', transformOrigin: '50% 50%' } }, bar);
    const connMark = h('span', { style: { position: 'relative', width: '12px', height: '12px', flex: 'none', display: 'inline-block' } }, conn);
    const connSpin = h('span', { style: { position: 'absolute', inset: '0', display: 'grid', placeItems: 'center' } }, connMark, icon('loader-circle', { size: 12, sw: 2.8 }));
    const connDot = h('span', { style: { position: 'absolute', left: '2.5px', top: '2.5px', width: '7px', height: '7px', borderRadius: '50%', background: '#fff', display: 'none' } }, connMark);
    const connTxt = h('span', {}, conn);
    connTxt.textContent = 'Conectando…';

    const chatBox = h('div', { style: { position: 'relative', flex: '1', minHeight: '0' } }, app);
    const chat = KIT.waChat(chatBox, { name: 'Patrícia Modas', status: 'online', initials: 'P' });
    // WhatsApp's real system notice for businesses on the Cloud API (yellow, lock icon). Its space is
    // reserved from frame 0 (flex-end list, sits above "Hoje") so its pop at 1.6 shifts nothing.
    const notice = h('div', { style: { alignSelf: 'center', maxWidth: '322px', marginBottom: '6px', padding: '9px 14px 10px', borderRadius: '10px', background: '#fff5c4', color: '#54656f',
      fontSize: '15px', lineHeight: 1.36, fontWeight: 500, textAlign: 'center', boxShadow: '0 1px 1.5px rgba(0,0,0,0.1)', transformOrigin: '50% 50%', opacity: 0 } }, chat.list,
      `<span style="display:inline-block;vertical-align:-2px;margin-right:5px;color:#8a7a36">${icon('lock', { size: 14, sw: 2.4 })}</span>Esta empresa usa um serviço seguro da Meta para gerenciar esta conversa. <span style="color:#027eb5">Toque para saber mais.</span>`);
    const day = h('div', { style: { alignSelf: 'center', marginBottom: '4px', padding: '5px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.92)', color: '#54656f', fontSize: '13px', fontWeight: 600, boxShadow: '0 1px 1.5px rgba(0,0,0,0.1)' } }, chat.list);
    day.textContent = 'Hoje';
    chat.add({ side: 'in', tag: { icon: 'megaphone', text: 'Veio do anúncio' }, text: 'Oi! Vi o anúncio da coleção verão. Tem a grade do vestido midi?', time: '23:47', size: 18 });
    const aiB = chat.add({ side: 'out', tag: { icon: 'bot', text: 'IA' }, html: 'Tem sim! Grade P ao GG, 6 peças, R$ 389 a grade. Monto com as 3 cores? <span class="emoji">😊</span>', time: '23:47', ticks: 'blue', size: 18 });
    const AIB_SHADOW = '0 1px 1.5px rgba(0,0,0,0.13)';
    chat.add({ side: 'in', html: 'Fechei! Manda as 3 cores <span class="emoji">🙌</span>', time: '23:48', size: 18 });

    const inp = h('div', { style: { height: '82px', flex: 'none', background: '#f6f5f3', display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '10px 12px 0 14px', borderTop: '1px solid #e7e5e0' } }, app);
    h('div', { style: { width: '38px', height: '38px', display: 'grid', placeItems: 'center', color: '#0a84ff', flex: 'none' } }, inp, icon('plus', { size: 26, sw: 2 }));
    h('div', { style: { flex: '1', height: '38px', borderRadius: '19px', background: '#fff', border: '1px solid #e2e2e2', color: '#9ca3af', fontSize: '16px', display: 'flex', alignItems: 'center', padding: '0 14px' } }, inp, 'Mensagem');
    h('div', { style: { width: '38px', height: '38px', borderRadius: '50%', background: C.waDark, display: 'grid', placeItems: 'center', color: '#fff', flex: 'none' } }, inp, icon('mic', { size: 19, sw: 2.2 }));
    h('div', { style: { position: 'absolute', bottom: '8px', left: '50%', width: '134px', height: '5px', marginLeft: '-67px', borderRadius: '3px', background: '#111', zIndex: 7 } }, phone.screen);
    // world-space origin of the chat wallpaper's dot grid (the plate's dots converge onto it)
    const LIST = { x: SCR.x, y: SCR.y + (54 + chatBox.offsetTop + chat.list.offsetTop) * K };

    /* ---------- bridge (SVG in the world plane) ---------- */
    const svg = s('svg', { width: 1920, height: 1080, viewBox: '0 0 1920 1080', style: { position: 'absolute', left: '0', top: '0', overflow: 'visible' } }, world);
    svg.style.filter = 'drop-shadow(0 0 6px rgba(21,219,168,0.7))';
    const bdx = (B[0] - A[0]) * 0.5;
    const D = `M${A[0]},${A[1]} C${A[0] + bdx},${A[1]} ${B[0] - bdx},${B[1]} ${B[0]},${B[1]}`;
    const track = s('path', { d: D, fill: 'none', stroke: 'rgba(255,255,255,0.28)', 'stroke-width': 2, 'stroke-dasharray': '2 9', 'stroke-linecap': 'round' }, svg);
    const tube = s('path', { d: D, fill: 'none', stroke: 'rgba(21,219,168,0.22)', 'stroke-width': 14, 'stroke-linecap': 'round' }, svg);
    const bridge = KIT.connector(svg, A, B, { color: C.vibrant, sw: 4, curve: 0.5 });
    tube.style.strokeDasharray = `${bridge.len}`;
    // packets: 4 outbound (teal) + 4 inbound (white), each a head + 3 ghost trail circles
    const PK = [];
    for (let d = 0; d < 2; d++) {
      for (let j = 0; j < 4; j++) {
        const col = d === 0 ? C.vibrant : '#ffffff';
        const radii = [5.2, 4.2, 3.4, 2.8];
        const circles = radii.map((r) => s('circle', { r, fill: col, cx: -99, cy: -99 }, svg));
        PK.push({ d, j, circles, radii });
      }
    }
    const port = (pt) => s('circle', { cx: pt[0], cy: pt[1], r: 0, fill: '#04201b', stroke: C.vibrant, 'stroke-width': 3 }, svg);
    const portA = port(A), portB = port(B);
    // the proof packet: one oversized bright packet rides the draw head and lands on port B at 1.5
    const hg = s('radialGradient', { id: 'fo-halo' }, s('defs', {}, svg));
    s('stop', { offset: '0%', 'stop-color': '#dffff6', 'stop-opacity': 0.95 }, hg);
    s('stop', { offset: '32%', 'stop-color': C.vibrant, 'stop-opacity': 0.55 }, hg);
    s('stop', { offset: '100%', 'stop-color': C.vibrant, 'stop-opacity': 0 }, hg);
    const bigTrail = [6.5, 5, 3.8].map((r) => s('circle', { r, fill: '#bafff0', cx: -99, cy: -99, opacity: 0 }, svg));
    const bigHalo = s('circle', { r: 26, fill: 'url(#fo-halo)', cx: -99, cy: -99, opacity: 0 }, svg);
    const bigCore = s('circle', { r: 8, fill: '#ffffff', cx: -99, cy: -99, opacity: 0 }, svg);
    const BIG_T0 = 1.2, BIG_T1 = 1.5;

    /* ---------- Coexistência pill (world plane, above the wire) ---------- */
    const coex = KIT.pill(world, { text: 'Coexistência · App + Cloud', icon: 'arrow-right-left', size: 17, bg: '#062c26', border: 'rgba(21,219,168,0.6)', pad: '9px 16px' });
    coex.style.position = 'absolute';
    coex.style.boxShadow = '0 10px 30px rgba(0,0,0,0.45), 0 0 24px rgba(21,219,168,0.25)';
    const coexW = coex.offsetWidth, coexH = coex.offsetHeight;
    coex.style.left = px((A[0] + B[0]) / 2 - coexW / 2);
    coex.style.top = px(560 - coexH / 2);
    coex.style.transformOrigin = '50% 100%';

    /* ---------- Cloud API card ---------- */
    const card = KIT.card(world, { x: CARD.x, y: CARD.y, w: CARD.w, h: CARD.h, dark: true, pad: 0, radius: 20 });
    Object.assign(card.style, { background: GLASS, overflow: 'hidden', padding: '24px 28px', transformOrigin: '50% 50%' });
    h('div', { style: { position: 'absolute', right: '-26px', top: '-40px', color: 'rgba(21,219,168,0.075)' } }, card, icon('cloud', { size: 210, sw: 1.4 }));
    const cHead = h('div', { style: { position: 'relative', display: 'flex', alignItems: 'center', gap: '14px' } }, card);
    h('div', { style: { width: '46px', height: '46px', borderRadius: '13px', display: 'grid', placeItems: 'center', background: 'rgba(21,219,168,0.14)', border: '1px solid rgba(21,219,168,0.32)', color: C.vibrant, flex: 'none' } }, cHead, icon('shield-check', { size: 24, sw: 2.2 }));
    h('div', { style: { fontWeight: 700, fontSize: '24px', letterSpacing: '-0.01em', color: '#fff', whiteSpace: 'nowrap' } }, cHead, 'Cloud API · Oficial Meta');
    h('div', { style: { position: 'relative', height: '1px', background: 'rgba(255,255,255,0.1)', margin: '18px 0 12px' } }, card);
    const lines = ['Templates aprovados', 'Janela de 24h sob controle', 'Mais estável'].map((txt) => {
      const row = h('div', { style: { position: 'relative', display: 'flex', alignItems: 'center', gap: '12px', height: '34px', fontSize: '20px', fontWeight: 600, color: 'rgba(255,255,255,0.92)', whiteSpace: 'nowrap' } }, card);
      const ic = h('span', { style: { display: 'inline-grid', placeItems: 'center', color: C.vibrant } }, row, icon('circle-check', { size: 22, sw: 2.3 }));
      h('span', {}, row).textContent = txt;
      return { row, ic };
    });
    // skeleton placeholders (shimmer) that each real line replaces when it pops
    const skel = lines.map(({ row }, i) => {
      const wrap = h('div', { style: { position: 'absolute', left: '28px', top: px(row.offsetTop + 6), height: '22px', display: 'flex', alignItems: 'center', gap: '12px', pointerEvents: 'none' } });
      card.insertBefore(wrap, lines[0].row);
      h('div', { style: { width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(255,255,255,0.07)', flex: 'none' } }, wrap);
      const bar = h('div', { style: { width: px([200, 262, 128][i]), height: '12px', borderRadius: '6px', flex: 'none',
        background: 'linear-gradient(90deg, rgba(255,255,255,0.05) 20%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.05) 80%)', backgroundSize: '300% 100%' } }, wrap);
      return { wrap, bar, at: 2.5 + i * 0.25 };
    });
    const sheen = h('div', { style: { position: 'absolute', inset: '0', pointerEvents: 'none', opacity: 0,
      background: 'linear-gradient(105deg, rgba(255,255,255,0) 38%, rgba(255,255,255,0.16) 50%, rgba(255,255,255,0) 62%)', backgroundSize: '250% 100%' } }, card);

    /* ---------- health strip with ECG ---------- */
    const strip = KIT.card(world, { x: STRIP.x, y: STRIP.y, w: STRIP.w, h: STRIP.h, dark: true, pad: 0, radius: 18 });
    Object.assign(strip.style, { background: GLASS, display: 'flex', alignItems: 'center', gap: '14px', padding: '0 18px', transformOrigin: '50% 50%' });
    h('div', { style: { width: '44px', height: '44px', borderRadius: '12px', display: 'grid', placeItems: 'center', background: 'rgba(21,219,168,0.14)', border: '1px solid rgba(21,219,168,0.32)', color: C.vibrant, flex: 'none' } }, strip, icon('activity', { size: 22, sw: 2.3 }));
    Object.assign(strip.style, { overflow: 'hidden' });
    const stripTxt = h('div', { style: { flex: 'none', lineHeight: 1.25, whiteSpace: 'nowrap' } }, strip,
      '<div style="font-weight:700;font-size:19px;color:#fff">Saúde do número</div><div style="font-weight:500;font-size:15px;color:rgba(255,255,255,0.62)">checada a cada 30 min</div>');
    const ok = h('div', { style: { display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 13px', borderRadius: '999px', flex: 'none',
      background: 'rgba(37,211,102,0.12)', border: '1px solid rgba(37,211,102,0.45)', color: '#4ade80', fontSize: '15px', fontWeight: 800, letterSpacing: '0.06em' } }, strip);
    const okMark = h('span', { style: { position: 'relative', width: '14px', height: '14px', flex: 'none', display: 'inline-block' } }, ok);
    const okDot = h('span', { style: { position: 'absolute', left: '2.5px', top: '2.5px', width: '9px', height: '9px', borderRadius: '50%', background: C.wa } }, okMark);
    const okChk = h('span', { style: { position: 'absolute', left: '-2px', top: '-2px', width: '18px', height: '18px', display: 'grid', placeItems: 'center', color: '#4ade80', opacity: 0 } }, okMark, icon('check', { size: 16, sw: 3.4 }));
    h('span', {}, ok).textContent = 'ok';
    // the ECG takes whatever the fixed items leave (padding 18·2, icon 44, three 14 px gaps)
    const ECG = { W: Math.floor(STRIP.w - 36 - 44 - 3 * 14 - stripTxt.offsetWidth - ok.offsetWidth), H: 58, S: 2 };
    const ecgCv = h('canvas', { width: ECG.W * ECG.S, height: ECG.H * ECG.S, style: { width: px(ECG.W), height: px(ECG.H), flex: 'none', display: 'block' } });
    strip.insertBefore(ecgCv, ok);
    const eg = ecgCv.getContext('2d');
    // scan sheen that sweeps the strip on each 30-min check (3.5 / 4.5)
    const scan = h('div', { style: { position: 'absolute', top: '0', bottom: '0', left: '0', width: '220px', pointerEvents: 'none', opacity: 0,
      background: 'linear-gradient(90deg, rgba(21,219,168,0), rgba(21,219,168,0.14) 60%, rgba(160,255,228,0.28) 92%, rgba(21,219,168,0))' } }, strip);
    const CHECKS = [3.5, 4.5];

    const pulseB = KIT.pulse(world, { x: B[0], y: B[1], r: 110, color: C.vibrant, sw: 3 });
    const pulseA = KIT.pulse(world, { x: A[0], y: A[1], r: 70, color: C.vibrant, sw: 2 });

    /* ---------- the wallpaper plate (S6 hand-off), on top of the world ---------- */
    const plate = h('div', { style: {
      position: 'absolute', backgroundColor: '#efeae2',
      backgroundImage: 'radial-gradient(rgba(0,0,0,0.035) 1.2px, transparent 1.2px)', backgroundSize: '22px 22px',
    } }, world);

    /* ================= HUD ================= */
    const streak = GTR.canvas(root, { z: 5 });
    streak.canvas.style.pointerEvents = 'none';
    const sg = streak.ctx;

    const hud = h('div', { style: { position: 'absolute', inset: '0', zIndex: 10, pointerEvents: 'none' } }, root);
    const scrim = h('div', { style: { position: 'absolute', opacity: 0, background: 'radial-gradient(closest-side, rgba(0,21,22,0.72), rgba(0,21,22,0))' } }, hud);
    const head = KIT.headline(hud, 'API *Oficial*\nda Meta.', { x: HEAD.x, y: HEAD.y, size: 100, align: 'left', w: 860, glow: true });
    head.el.style.width = 'max-content';
    const headW = head.el.offsetWidth, headH = head.el.offsetHeight;
    head.el.style.width = '860px';
    const sub = h('div', { class: 'body', style: { position: 'absolute', left: px(HEAD.x + 4), top: px(SUB_Y), transform: 'translateY(-50%)', fontSize: '36px', fontWeight: 600, color: 'rgba(255,255,255,0.8)', whiteSpace: 'nowrap', letterSpacing: '-0.005em' } }, hud);
    sub.textContent = 'O app e a API, juntos.';
    const subW = sub.offsetWidth;
    const subUnits = GTR.split(sub, 'words');
    {
      const x0 = HEAD.x - 150, x1 = HEAD.x + Math.max(headW, subW) + 150;
      const y0 = HEAD.y - headH / 2 - 120, y1 = SUB_Y + 30 + 120;
      Object.assign(scrim.style, { left: px(x0), top: px(y0), width: px(x1 - x0), height: px(y1 - y0) });
    }

    // S8 hand-off line
    const lineWrap = h('div', { style: { position: 'absolute', left: '0', top: px(LINE_Y - 80), width: '1920px', height: '160px', zIndex: 20, pointerEvents: 'none', opacity: 0 } }, root);
    const lineHalo = h('div', { style: { position: 'absolute', inset: '0', background: 'radial-gradient(60% 50% at 50% 50%, rgba(21,219,168,0.28), rgba(21,219,168,0) 72%)' } }, lineWrap);
    const line = h('div', { style: { position: 'absolute', left: '0', top: '78.5px', width: '1920px', height: '3px', background: C.vibrant, transformOrigin: '50% 50%',
      boxShadow: '0 0 8px rgba(21,219,168,1), 0 0 22px rgba(21,219,168,0.8), 0 0 60px rgba(21,219,168,0.45)' } }, lineWrap);

    // diagnostic chip (wrapped so the scene can fade it without touching the kit's own opacity)
    const chipWrap = h('div', { style: { position: 'absolute', left: '0', top: '0', zIndex: 60 } }, root);
    const chip = KIT.diagChip(chipWrap, { n: '02', err: 'NÚMERO BANIDO', ok: 'API OFICIAL', x: 120, y: 96 });

    /* ================= timeline (DOM pops) ================= */
    tl.fromTo(scrim, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: 'power2.out' }, 0.9);
    KIT.revealWords(tl, head.units, 1.0);
    tl.fromTo(coex, { opacity: 0, scale: 0.6, y: 10 }, { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'back.out(2)' }, 1.6);
    KIT.revealWords(tl, subUnits, 2.0, { y: 34, blur: 8, dur: 0.6, stagger: 0.06 });
    lines.forEach(({ row, ic }, i) => {
      const at = 2.5 + i * 0.25;
      tl.fromTo(row, { opacity: 0, x: -18 }, { opacity: 1, x: 0, duration: 0.5, ease: 'power3.out' }, at);
      tl.fromTo(ic, { scale: 0, rotate: -90 }, { scale: 1, rotate: 0, duration: 0.5, ease: 'back.out(2.4)' }, at);
    });
    KIT.hideUnits(tl, head.units, 4.98, { dur: 0.26, stagger: 0.02, y: -30 });
    KIT.hideUnits(tl, subUnits, 5.0, { dur: 0.24, stagger: 0.015, y: -20 });
    tl.to(scrim, { opacity: 0, duration: 0.3, ease: 'power2.in' }, 5.0);
    tl.to(coex, { opacity: 0, y: -12, duration: 0.28, ease: 'power2.in' }, 5.0);

    /* ================= SFX ================= */
    ctx.cue('whoosh', 0.0, { dur: 0.6, up: false });
    ctx.cue('tick', 0.25, { db: -6 });
    ctx.cue('swoosh', 0.6);
    ctx.cue('pop', 1.5);
    ctx.cue('blip', 1.5, { freq: 2000 });
    ctx.cue('shimmer', 1.6);
    ctx.cue('pop', 2.5);
    ctx.cue('pop', 2.75);
    ctx.cue('pop', 3.0);
    ctx.cue('blip', 3.5, { freq: 1000, db: -12 });
    ctx.cue('blip', 4.5, { freq: 1000, db: -12 });
    ctx.cue('whoosh', 5.0, { dur: 0.9, up: true });

    /* ================= computed motion ================= */
    // packet phase: real time until 5.0, then ramps to ×6 speed over 5.0–5.4 (closed form)
    const PH_R = 0.4, PH_M = 5;
    const phase = (t) => {
      if (t <= 5) return t;
      if (t <= 5 + PH_R) { const u = t - 5; return t + (PH_M * u * u) / (2 * PH_R); }
      return t + PH_M * (PH_R / 2) + PH_M * (t - 5 - PH_R);
    };
    const speedAt = (t) => 1 + PH_M * clamp((t - 5) / PH_R);

    const drawPackets = (t, LEN) => {
      const P = phase(t), spd = speedAt(t);
      const on = t >= 1.6;
      for (const pk of PK) {
        const base = 1.6 + (pk.d === 1 ? 0.0625 : 0);
        const nMax = Math.floor((P - base) / 0.125);
        const n = nMax - pk.j;
        const q = (P - base - n * 0.125) / 0.5;
        const vis = on && n >= 0 && q >= 0 && q < 1;
        const big = pk.d === 1 && mod(n, 8) === 0 ? 1.35 : 1;   // one inbound "message" packet per second
        pk.circles.forEach((c, g) => {
          c.setAttribute('r', pk.radii[g] * big);
          if (!vis) { c.style.opacity = 0; return; }
          const qq = q - g * 0.028 * spd;
          if (qq <= 0) { c.style.opacity = 0; return; }
          const u = pk.d === 0 ? qq : 1 - qq;
          const pt = bridge.path.getPointAtLength(LEN * clamp(u));
          c.setAttribute('cx', pt.x);
          c.setAttribute('cy', pt.y);
          const edge = Math.min(1, qq / 0.08, (1 - qq) / 0.08);
          c.style.opacity = clamp(edge) * [1, 0.5, 0.28, 0.14][g];
        });
      }
    };

    // ECG: scrolls left at 240 px/s, a beat on every global multiple of 0.5 s (local too: start 30.0)
    const gauss = (d, mu, sg2, a) => a * Math.exp(-((d - mu) * (d - mu)) / (2 * sg2 * sg2));
    const ecgVal = (tau) => {
      const b = Math.round(tau * 2) / 2;
      let v = 0.035 * noise(tau * 9, 3.3);
      if (b < 3.0) return v;
      const d = tau - b;
      v += gauss(d, -0.13, 0.028, 0.13) + gauss(d, -0.026, 0.008, -0.16) + gauss(d, 0, 0.0115, 1)
        + gauss(d, 0.024, 0.01, -0.34) + gauss(d, 0.15, 0.04, 0.24);
      return v;
    };
    // inbound "message" packets (n % 8 == 0) reach port A at 2.1625 + k → the IA bubble answers with a teal glow
    const aiGlow = (t) => {
      if (t < 2.1 || t >= 5) return 0;
      const e = mod(t - 2.1625, 1);
      return e < 0.18 ? Math.pow(1 - e / 0.18, 1.4) : 0;
    };

    const drawECG = (t) => {
      const Wc = ECG.W, Hc = ECG.H, BASE = 38, AMP = 30;
      eg.setTransform(ECG.S, 0, 0, ECG.S, 0, 0);
      eg.clearRect(0, 0, Wc, Hc);
      // scrolling monitor grid
      eg.shadowBlur = 0;
      eg.lineWidth = 1;
      eg.strokeStyle = 'rgba(21,219,168,0.09)';
      const off = mod(t * 240, 22);
      eg.beginPath();
      for (let x = Wc - off; x > 0; x -= 22) { eg.moveTo(x + 0.5, 3); eg.lineTo(x + 0.5, Hc - 3); }
      eg.moveTo(0, BASE + 0.5); eg.lineTo(Wc, BASE + 0.5);
      eg.stroke();
      // trace
      const g = eg.createLinearGradient(0, 0, Wc, 0);
      g.addColorStop(0, 'rgba(21,219,168,0)');
      g.addColorStop(0.3, 'rgba(21,219,168,0.55)');
      g.addColorStop(1, 'rgba(120,255,214,1)');
      eg.strokeStyle = g;
      eg.lineWidth = 2;
      eg.lineJoin = 'round';
      eg.lineCap = 'round';
      eg.shadowColor = 'rgba(21,219,168,0.9)';
      eg.shadowBlur = 7;
      eg.beginPath();
      let hy = BASE;
      for (let x = 0; x <= Wc - 6; x += 0.5) {
        const tau = t - (Wc - 6 - x) / 240;
        const y = BASE - ecgVal(tau) * AMP;
        if (x === 0) eg.moveTo(x, y); else eg.lineTo(x, y);
        hy = y;
      }
      eg.stroke();
      // write head
      eg.fillStyle = '#d7fff2';
      eg.shadowBlur = 12;
      eg.beginPath();
      eg.arc(Wc - 6, hy, 3.2, 0, Math.PI * 2);
      eg.fill();
    };

    return {
      tl,
      update(t) {
        /* ---- camera: slow orbit, then back to identity for the exit (world px = screen px) ---- */
        const orb = p(t, 1.2, 5.2, 'sine.inOut');
        const back = p(t, 5.0, 5.6, 'power2.inOut');
        cam.set({ ry: lerp(lerp(-6, 4, orb), 0, back), s: lerp(lerp(1, 1.06, orb), 1, back) });
        cam.view.style.opacity = 1 - p(t, 5.9, 5.98, 'power1.in');
        /* ---- light-speed exit: phone and cloud split apart, the bridge stretches into the y-460 line ---- */
        const rise = p(t, 5.15, 5.65, 'power2.inOut');
        const split = p(t, 5.2, 5.8, 'power3.in');
        const calm = 1 - rise;                        // idle floats die out so the wire lands exactly on y 460
        const dyP = (LINE_Y - A[1]) * rise, dyC = (LINE_Y - B[1]) * rise;
        const dxP = -1050 * split, dxC = 1150 * split;
        const mb = p(t, 5.3, 5.8, 'power2.in');
        fblur.setAttribute('stdDeviation', `${(44 * mb).toFixed(2)} 0`);
        const exitFilter = mb > 0.001 ? `url(#fo-mblur) brightness(${(1 + 0.8 * mb).toFixed(3)})` : 'none';

        /* ---- plate morph: full frame → phone screen (0–0.6) ---- */
        if (t < 0.6) {
          const m = p(t, 0, 0.6, 'power3.inOut');
          const L = lerp(PLATE0.x, SCR.x, m), T = lerp(PLATE0.y, SCR.y, m);
          plate.style.display = 'block';
          plate.style.left = px(L);
          plate.style.top = px(T);
          plate.style.width = px(lerp(PLATE0.w, SCR.w, m));
          plate.style.height = px(lerp(PLATE0.h, SCR.h, m));
          plate.style.borderRadius = px(lerp(0, SCR.r, m));
          plate.style.backgroundPosition = `${mod(-L, 22)}px ${mod(-T, 22)}px`;
          plate.style.boxShadow = `0 ${40 * m}px ${120 * m}px rgba(0,0,0,${0.5 * m})`;
          plate.style.opacity = 1 - p(t, 0.45, 0.6, 'power1.inOut');
        } else plate.style.display = 'none';

        /* ---- phone ---- */
        bezel.style.opacity = p(t, 0.3, 0.6, 'power2.out');
        const pry = 14 * p(t, 0.6, 1.2, 'power3.out');
        const fy = noise(t * 0.35, 1.7) * 7 * calm, frx = noise(t * 0.3, 8.1) * 1.2 * calm;
        phone.el.style.transform = `perspective(1500px) translate3d(${dxP}px, ${fy + dyP}px, 0) rotateY(${pry}deg) rotateX(${frx}deg) scale(${K})`;
        phone.el.style.filter = exitFilter;
        gPhone.style.opacity = (0.35 + 0.65 * p(t, 0.4, 1.2) + 0.35 * Math.exp(-Math.max(0, t - 1.5) * 3) * (t >= 1.5)) * (1 - p(t, 5.1, 5.7));
        gPhone.style.transform = `translate(${lerp(14, -14, orb)}px, 0) scale(${1 + 0.06 * noise(t * 0.4, 4)})`;
        const bump = t >= 1.5 && t < 1.85 ? Math.sin(Math.PI * (t - 1.5) / 0.35) : 0;
        conn.style.transform = `scale(${1 + 0.16 * bump})`;
        conn.style.boxShadow = `0 0 ${16 * bump}px rgba(37,211,102,${0.8 * bump})`;

        /* ---- cloud card ---- */
        const ce = p(t, 0.6, 1.2, 'power3.out');
        const cfy = noise(t * 0.33, 12.5) * 6 * calm;
        card.style.opacity = clamp(p(t, 0.6, 1.0, 'power2.out'));
        card.style.transform = `perspective(1500px) translate3d(${500 * (1 - ce) + dxC}px, ${cfy + dyC}px, 0) rotateY(${lerp(-40, -12, ce)}deg)`;
        card.style.filter = exitFilter;
        const ring = t < 1.5 ? 0 : 0.25 + 0.75 * Math.exp(-(t - 1.5) * 3.2);
        card.style.boxShadow = `0 30px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08), 0 0 0 ${1 + ring}px rgba(21,219,168,${0.1 + 0.7 * ring}), 0 0 ${24 + 40 * ring}px rgba(21,219,168,${0.3 * ring})`;
        for (const sk of skel) {
          sk.wrap.style.opacity = 1 - p(t, sk.at, sk.at + 0.22, 'power1.out');
          sk.bar.style.backgroundPosition = `${100 - 100 * fract(t / 1.1 + sk.at)}% 0`;
        }
        const shp = p(t, 1.5, 2.2, 'power2.inOut');
        sheen.style.opacity = t > 1.5 && t < 2.2 ? 1 : 0;
        sheen.style.backgroundPosition = `${lerp(100, 0, shp)}% 0`;
        gCard.style.opacity = (0.2 + 0.8 * ce) * (1 - p(t, 5.1, 5.7));
        gCard.style.transform = `translate(${lerp(-16, 16, orb)}px, 0) scale(${1 + 0.07 * noise(t * 0.4, 9)})`;

        /* ---- health strip ---- */
        const se = p(t, 2.85, 3.35, 'power3.out');
        strip.style.opacity = clamp(p(t, 2.85, 3.15, 'power2.out'));
        strip.style.transform = `perspective(1500px) translate3d(${dxC}px, ${40 * (1 - se) + noise(t * 0.33, 21) * 5 * calm + dyC}px, 0) rotateY(-12deg)`;
        strip.style.filter = exitFilter;
        if (t > 2.8) drawECG(t);
        else { eg.setTransform(1, 0, 0, 1, 0, 0); eg.clearRect(0, 0, ecgCv.width, ecgCv.height); }
        const bk = t >= 3.0 ? Math.exp(-fract(t * 2) * 7) : 0.5;
        okDot.style.opacity = 0.35 + 0.65 * bk;
        okDot.style.transform = `scale(${1 + 0.4 * bk})`;
        okDot.style.boxShadow = `0 0 ${4 + 12 * bk}px rgba(37,211,102,${0.4 + 0.6 * bk})`;

        /* ---- bridge (its ends ride the phone and the card; flattens to y 460 on exit) ---- */
        const P0 = [A[0] + dxP, A[1] + dyP], P3 = [B[0] + dxC, B[1] + dyC];
        const hd = (P3[0] - P0[0]) * 0.5;
        const dNow = `M${P0[0]},${P0[1]} C${P0[0] + hd},${P0[1]} ${P3[0] - hd},${P3[1]} ${P3[0]},${P3[1]}`;
        bridge.path.setAttribute('d', dNow);
        tube.setAttribute('d', dNow);
        track.style.opacity = p(t, 0.9, 1.2, 'power2.out') * (1 - p(t, 1.2, 1.5));
        const bd = p(t, 1.2, 1.5, 'power2.inOut');
        bridge.set(bd);
        const drawn = bd >= 1;
        bridge.path.style.strokeDasharray = drawn ? 'none' : `${bridge.len}`;
        tube.style.strokeDasharray = drawn ? 'none' : `${bridge.len}`;
        tube.style.strokeDashoffset = `${bridge.len * (1 - bd)}`;
        tube.style.opacity = (0.7 + 0.3 * Math.sin(t * 5)) * (1 - 0.6 * rise);
        portA.setAttribute('r', 7 * GTR.E('back.out(3)')(GTR.inv(t, 1.15, 1.4)));
        portB.setAttribute('r', 7 * GTR.E('back.out(3)')(GTR.inv(t, 1.5, 1.75)));
        portA.setAttribute('cx', P0[0]); portA.setAttribute('cy', P0[1]);
        portB.setAttribute('cx', P3[0]); portB.setAttribute('cy', P3[1]);
        pulseA.set(GTR.inv(t, 1.2, 1.7));
        pulseB.set(p(t, 1.5, 2.2, 'power2.out'));
        drawPackets(t, drawn ? bridge.path.getTotalLength() : bridge.len);

        /* ---- HUD ---- */
        const hx = lerp(8, -8, orb), hy = noise(t * 0.25, 30) * 4;
        head.el.style.transform = `translateY(-50%) translate(${hx}px, ${hy}px)`;
        sub.style.transform = `translateY(-50%) translate(${hx * 0.8}px, ${hy}px)`;

        chip.set(t, GTR.inv(t, 0.25, 0.43), GTR.inv(t, 1.5, 2.0));
        chipWrap.style.opacity = 1 - p(t, 5.0, 5.25, 'power2.in');

        /* ---- light-speed streaks → converge into the y-460 line ---- */
        sg.clearRect(0, 0, 1920, 1080);
        if (t >= 5.0) {
          const cv = p(t, 5.8, 6.0, 'power2.inOut');
          const a = 0.9 * p(t, 5.0, 5.55, 'power2.in') * (1 - 0.7 * p(t, 5.85, 6.0, 'power2.in'));
          KIT.streaks(sg, t, { n: 70, seed: 7, dir: 1, speed: 2600, len: 520, alpha: a, y0: lerp(30, LINE_Y, cv), y1: lerp(1050, LINE_Y, cv) });
          KIT.streaks(sg, t, { n: 24, seed: 71, dir: 1, speed: 3400, len: 760, alpha: a * 0.8, color: '220,255,245', y0: lerp(200, LINE_Y, cv), y1: lerp(880, LINE_Y, cv) });
        }
        const la = p(t, 5.82, 5.95, 'power2.out');
        lineWrap.style.opacity = la;
        line.style.transform = `scaleX(${lerp(0.3, 1, p(t, 5.8, 5.96, 'expo.out'))})`;
        lineHalo.style.opacity = 0.6 + 0.4 * la;
      },
    };
  },
});
