/* ============================================================
   S2 · dor-banido — ERRO 02 · NÚMERO BANIDO          [4–8 global]
   Match cut from S1: the same phone {x:620,y:580,w:420}, rotateY 16°,
   perspective 1400, the same list, swarm and hero bubble — now under a ban
   modal. The tear settles (0–0.25), the dead swarm drops out of frame, the
   chat rows die bottom-up, "O WhatsApp bloqueia." / "Sem aviso." / "Sem
   motivo.", a red lock slams onto the ban icon while a red scan drains the
   screen to gray, chip 02 stamps into the log, and the world whips out to
   the left (−900, blur 24) over streaks.
   Structure (back → front):
     tearWrap › whipWrap › camera view › world (flat, 2D camera)
         rim glow · ghostsBack · persp(1400) › rig(rotateY 16°) › phone + overlay · ghostsFront
     streaks canvas · HUD (scrim, headline, sublines) · chips · tear canvas
   The rig lives in its own perspective container so no other layer shares
   its 3D context (avoids Chromium plane splitting/clipping of the phone).
   Tl = DOM reveals; update() = camera, shake, tear, scan, chips, ghosts, streaks.
   ============================================================ */
GTR.scene({
  id: 'dor-banido',
  build(root, ctx) {
    const { h, s, p, clamp, lerp, noise, inv, fract, rng } = GTR;
    const RED = '#ef4444';
    const P = 1400;                                 // camera perspective (S1 contract)
    const PX = 620, PY = 580, PW = 420;             // S1 hand-off phone
    const FONT_UI = "'Inter', system-ui, sans-serif";
    const LOCK = { x: 215, y: 366 };                // lock centre in phone-local px (ban icon centre is y 380)

    /* ============================================================ WORLD */
    const tearWrap = h('div', { style: { position: 'absolute', inset: '0', zIndex: 1 } }, root);
    const whipWrap = h('div', { style: { position: 'absolute', inset: '0' } }, tearWrap);
    const cam = KIT.camera(whipWrap, { perspective: P });
    cam.world.style.transformStyle = 'flat';        // camera is 2D here (translate / rotateZ / scale)

    // red rim light behind the phone (S1: r 520, a .26, breathing with sin(t·6))
    const rim = GTR.glow(cam.world, { x: PX, y: PY, r: 520, color: '239,68,68', a: 0.26 });
    const ghostsBack = h('div', { style: { position: 'absolute', inset: '0' } }, cam.world);
    const persp = h('div', { style: { position: 'absolute', inset: '0', perspective: `${P}px`, perspectiveOrigin: '960px 540px' } }, cam.world);
    const rig = h('div', { style: { position: 'absolute', inset: '0', transformOrigin: `${PX}px ${PY}px`, transform: 'rotateY(16deg)' } }, persp);
    const ghostsFront = h('div', { style: { position: 'absolute', inset: '0' } }, cam.world);

    /* ---- phone (identical to S1's final state). Built twice: a colour copy and a
       grayscale(1) brightness(.55) copy that the red scan reveals top-down (2.5–2.9). ---- */
    const ROWS = [
      { name: 'Patrícia Modas', msg: 'Oi! Vi o anúncio da coleção verão', n: 5, time: '23:46', av: 'PM' },
      { name: '(85) 9 ••••-3344', msg: 'Oi, tem grade?', n: 3, time: '23:31' },
      { name: '(21) 9 ••••-2208', msg: 'Faz entrega em SP?', n: 5, time: '22:58' },
      { name: '(71) 9 ••••-1177', msg: 'Alguém aí?', n: 8, time: '21:10' },
      { name: '(11) 9 ••••-0932', msg: 'Tem a grade em preto?', n: 4, time: 'Ontem' },
      { name: '(81) 9 ••••-7765', msg: 'Pode me mandar o link?', n: 14, time: 'Ontem' },
    ];
    const buildPhone = (filter) => {
      const phone = KIT.phone(rig, { x: PX, y: PY, w: PW });
      phone.el.style.filter = filter;
      const sbTime = phone.screen.firstChild && phone.screen.firstChild.firstChild;
      if (sbTime) sbTime.textContent = '23:52';
      const body = phone.body;
      body.style.background = '#fff';
      body.style.fontFamily = FONT_UI;
      // chat list — blurred 6 px behind the modal
      const list = h('div', { style: { position: 'absolute', inset: '0', background: '#fff', filter: 'blur(6px)' } }, body);
      const hdr = h('div', { style: { position: 'absolute', left: '0', top: '0', width: '402px', height: '76px' } }, list);
      h('div', { style: { position: 'absolute', left: '22px', top: '16px', fontSize: '31px', lineHeight: '44px', fontWeight: 800, letterSpacing: '-0.025em', color: '#111' } }, hdr).textContent = 'Conversas';
      const pill99 = h('div', { style: { position: 'absolute', left: '305px', top: '20px', width: '70px', height: '36px', borderRadius: '18px', background: 'linear-gradient(180deg,#f87171,#dc2626)',
        color: '#fff', fontWeight: 800, fontSize: '19px', letterSpacing: '-0.01em', display: 'grid', placeItems: 'center', boxShadow: '0 6px 16px rgba(239,68,68,.45), 0 0 0 3px #fff', transformOrigin: '50% 50%' } }, hdr);
      pill99.textContent = '99+';
      const search = h('div', { style: { position: 'absolute', left: '16px', top: '80px', width: '370px', height: '42px', borderRadius: '21px', background: '#f0f2f5', display: 'flex', alignItems: 'center', gap: '10px', padding: '0 16px', color: '#8696a0', fontSize: '16px' } }, list);
      search.innerHTML = GTR.iconSVG('search', { size: 19, color: '#8696a0' }) + '<span>Pesquisar</span>';
      const chipsRow = h('div', { style: { position: 'absolute', left: '16px', top: '134px', display: 'flex', gap: '8px' } }, list);
      [['Tudo', false], ['Não lidas', true], ['Favoritas', false], ['Grupos', false]].forEach(([tx, on]) => {
        h('div', { style: { height: '32px', padding: '0 14px', borderRadius: '16px', display: 'flex', alignItems: 'center', fontSize: '14px', fontWeight: 600,
          background: on ? '#d9fdd3' : '#f0f2f5', color: on ? '#0b7a4b' : '#54656f' } }, chipsRow).textContent = tx;
      });
      const rows = ROWS.map((r, i) => {
        const row = h('div', { style: { position: 'absolute', left: '0', top: `${180 + i * 88}px`, width: '402px', height: '88px', overflow: 'hidden', background: '#ffffff' } }, list);
        const av = h('div', { style: { position: 'absolute', left: '16px', top: '18px', width: '52px', height: '52px', borderRadius: '50%', display: 'grid', placeItems: 'center',
          background: r.av ? 'linear-gradient(135deg,#f9a8d4,#db2777)' : '#dfe5e7', color: '#fff', fontWeight: 800, fontSize: '19px' } }, row);
        av.innerHTML = r.av ? r.av : GTR.iconSVG('user', { size: 30, color: '#fff', sw: 2.2 });
        h('div', { style: { position: 'absolute', left: '82px', top: '17px', width: '220px', fontSize: '17px', fontWeight: 700, color: '#111', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }, row).textContent = r.name;
        h('div', { style: { position: 'absolute', right: '18px', top: '20px', fontSize: '13px', fontWeight: 600, color: '#1daa61' } }, row).textContent = r.time;
        h('div', { style: { position: 'absolute', left: '82px', top: '46px', width: '252px', fontSize: '15px', color: '#667781', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }, row).textContent = r.msg;
        h('div', { style: { position: 'absolute', right: '18px', top: '45px', minWidth: '24px', height: '24px', padding: '0 7px', borderRadius: '12px', background: '#25d366', color: '#fff',
          fontSize: '13px', fontWeight: 800, display: 'grid', placeItems: 'center' } }, row).textContent = String(r.n);
        h('div', { style: { position: 'absolute', left: '82px', right: '0', bottom: '0', height: '1px', background: '#eef0f1' } }, row);
        return row;
      });
      const nav = h('div', { style: { position: 'absolute', left: '0', right: '0', top: '738px', height: '80px', borderTop: '1px solid #eceff1', background: '#fff', display: 'flex', justifyContent: 'space-around', alignItems: 'flex-start', paddingTop: '10px' } }, list);
      [['message-circle', 'Conversas', true], ['circle-dot', 'Atualizações', false], ['users', 'Comunidades', false], ['phone', 'Ligações', false]].forEach(([ic, tx, on]) => {
        const it = h('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 600, color: on ? '#111' : '#54656f' } }, nav);
        it.innerHTML = `<span style="display:grid;place-items:center;width:58px;height:32px;border-radius:16px;background:${on ? '#d9fdd3' : 'transparent'}">${GTR.iconSVG(ic, { size: 22, color: on ? '#0b7a4b' : '#54656f' })}</span><span>${tx}</span>`;
      });
      // ban modal
      h('div', { style: { position: 'absolute', inset: '0', background: 'rgba(11,20,26,0.52)' } }, body);
      const modal = h('div', { style: { position: 'absolute', left: '33px', top: '210px', width: '336px', padding: '34px 26px 24px', borderRadius: '20px', background: '#fff',
        textAlign: 'center', boxShadow: '0 24px 60px rgba(0,0,0,0.4)', transformOrigin: '50% 50%' } }, body);
      const banWrap = h('div', { style: { position: 'relative', width: '136px', height: '136px', margin: '0 auto' } }, modal);
      const banRing = h('div', { style: { position: 'absolute', inset: '0', borderRadius: '50%', border: `3px solid ${RED}`, opacity: 0 } }, banWrap);
      const banDisc = h('div', { style: { position: 'absolute', inset: '0', borderRadius: '50%', display: 'grid', placeItems: 'center',
        background: 'radial-gradient(circle at 35% 30%, #f87171, #dc2626 72%)', boxShadow: '0 12px 30px rgba(220,38,38,0.4), inset 0 2px 0 rgba(255,255,255,0.25)' } }, banWrap);
      banDisc.innerHTML = GTR.iconSVG('ban', { size: 96, color: '#fff', sw: 2.1 });
      h('div', { style: { marginTop: '30px', fontSize: '22px', fontWeight: 600, lineHeight: 1.34, color: '#111', letterSpacing: '-0.005em' } }, modal,
        'Esta conta não está mais autorizada a usar o WhatsApp');
      h('div', { style: { marginTop: '24px', height: '52px', borderRadius: '999px', background: '#e9edef', color: '#3b4a54', fontSize: '20px', fontWeight: 600, display: 'grid', placeItems: 'center' } }, modal, 'Saiba mais');
      return { phone, rows, pill99, modal, banRing, banDisc };
    };
    const PC = buildPhone('saturate(0.7)');                                  // DOR mode UI filter
    const PG = buildPhone('grayscale(1) brightness(0.55)');                  // drained copy
    const PHONES = [PC, PG];

    /* ---- screen overlay (same box as the phone, unfiltered): scan, glare, lock ---- */
    const ov = h('div', { style: { position: 'absolute', left: `${PX - 215}px`, top: `${PY - 450}px`, width: '430px', height: '900px', transform: `scale(${PC.phone.scale})`, transformOrigin: '50% 50%' } }, rig);
    const scr = h('div', { style: { position: 'absolute', left: '14px', top: '14px', width: '402px', height: '872px', borderRadius: '52px', overflow: 'hidden' } }, ov);
    const glare = h('div', { style: { position: 'absolute', left: '-60%', top: '-10%', width: '220%', height: '120%',
      background: 'linear-gradient(112deg, rgba(255,255,255,0) 44%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0) 56%)' } }, scr);
    const scan = h('div', { style: { position: 'absolute', left: '0', top: '0', width: '100%', height: '150px', display: 'none',
      background: 'linear-gradient(180deg, rgba(239,68,68,0) 0%, rgba(239,68,68,0.10) 60%, rgba(239,68,68,0.32) 100%)' } }, scr);
    h('div', { style: { position: 'absolute', left: '0', right: '0', bottom: '0', height: '3px', background: '#ff6b6b', boxShadow: '0 0 16px 4px rgba(239,68,68,0.85), 0 0 40px 10px rgba(239,68,68,0.35)' } }, scan);
    const lockPulse = KIT.pulse(ov, { x: LOCK.x, y: LOCK.y, r: 220, color: RED, sw: 4 });
    const lockPulse2 = KIT.pulse(ov, { x: LOCK.x, y: LOCK.y, r: 320, color: 'rgba(239,68,68,0.6)', sw: 2 });
    const LR = 98;
    const lockWrap = h('div', { style: { position: 'absolute', left: `${LOCK.x - LR}px`, top: `${LOCK.y - LR}px`, width: `${LR * 2}px`, height: `${LR * 2}px` } }, ov);
    const lockHalo = h('div', { style: { position: 'absolute', left: `${-LR}px`, top: `${-LR}px`, width: `${LR * 4}px`, height: `${LR * 4}px`, borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(239,68,68,0.42) 0%, rgba(239,68,68,0.14) 38%, rgba(239,68,68,0) 68%)' } }, lockWrap);
    const lockDisc = h('div', { style: { position: 'absolute', inset: '0', borderRadius: '50%', display: 'grid', placeItems: 'center',
      background: 'radial-gradient(circle at 50% 35%, #2a0c0e 0%, #110506 72%)', border: '2px solid rgba(239,68,68,0.8)',
      boxShadow: '0 0 0 8px rgba(239,68,68,0.10), 0 0 70px rgba(239,68,68,0.55), 0 30px 60px rgba(0,0,0,0.55), inset 0 0 40px rgba(239,68,68,0.18)' } }, lockWrap);
    lockDisc.innerHTML = GTR.iconSVG('lock', { size: 116, color: RED, sw: 2.1 });
    lockDisc.firstChild.style.filter = 'drop-shadow(0 0 14px rgba(239,68,68,0.75))';

    /* ---- ghosts: S1's swarm + hero bubble in their exact t = 4.0 state, then they drop dead ----
       (S1 places them in a preserve-3d world; here the same perspective is projected in 2D) */
    const SW = [
      ['Oi, tem grade?', '23:12', 250, 250, 0, 0],
      ['Qual o mínimo do atacado?', '22:47', 1330, 132, -380, -1],
      ['Ainda tem o vestido midi?', '22:31', 1550, 905, -260, -1],
      ['Faz entrega em SP?', '21:58', 225, 470, 90, 2],
      ['Tem no preto?', '21:40', 940, 250, -90, 1],
      ['Quanto fica a grade de 6?', '20:15', 1190, 968, -170, 4],
      ['Aceita Pix?', '19:52', 180, 690, -40, 3],
      ['Alguém aí?', '19:03', 950, 800, 30, 5],
      ['Oi??', '18:47', 1690, 222, -520, -1],
      ['Vocês têm catálogo?', '18:20', 720, 96, 150, -1],
      ['Pode me mandar o link?', '17:34', 250, 930, -200, -1],
      ['Chegou a saia plissada?', '16:08', 1100, 110, -620, -1],
    ];
    const TIMERS = ['sem resposta · 13 min', '47 min', '2 h', '5 h', '1 dia', '2 dias'];
    const R1 = rng('scene:dor-caos');                  // S1's ctx.rand stream → same tilts / bob phases
    const ghosts = SW.map(([text, time, sx, sy, zd, ti]) => {
      const rot = (R1() - 0.5) * 7, ph = R1() * 10;
      const zNow = zd + 120;                           // S1 drifts z +80 px/s from 2.5 → +120 at the cut
      const wrap = h('div', { style: { position: 'absolute', left: '0', top: '0', width: 'max-content', transformOrigin: '50% 50%' } }, zNow < 0 ? ghostsBack : ghostsFront);
      const el = KIT.bubble(wrap, { side: 'in', text, time, size: 20, maxW: 'none' });
      el.style.boxShadow = '0 14px 34px rgba(0,0,0,.38), 0 1px 1.5px rgba(0,0,0,.13)';
      el.style.whiteSpace = 'nowrap';
      if (ti >= 0) {
        const pill = h('div', { style: { position: 'absolute', left: '10px', top: 'calc(100% + 8px)', display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '6px 12px 6px 10px', borderRadius: '999px',
          background: 'linear-gradient(rgba(239,68,68,.2),rgba(239,68,68,.2)), #1a0c0d', border: '1px solid rgba(239,68,68,.6)', color: '#fca5a5', fontFamily: FONT_UI, fontSize: '15px', fontWeight: 700,
          whiteSpace: 'nowrap', boxShadow: '0 8px 20px rgba(0,0,0,.4)', transformOrigin: '12% 0%', transform: 'rotate(-3deg)' } }, wrap);
        pill.innerHTML = GTR.iconSVG('clock', { size: 15, sw: 2.4 }) + `<span>${TIMERS[ti]}</span>`;
      }
      const f = (P - zd) / P;
      return { wrap, zd, rot, ph, gray: ti >= 0 ? 0.4 : 0, x: 960 + (sx - 960) * f, y: 540 + (sy - 540) * f, sx };
    });
    // drop order: right → left, so the headline column is clear before the title lands (0.5)
    ghosts.slice().sort((a, b) => b.sx - a.sx).forEach((q, k) => { q.t0 = 0.03 + k * 0.035; q.spin = k % 2 ? 1 : -1; });
    const heroWrap = h('div', { style: { position: 'absolute', left: '0', top: '0', width: 'max-content', transformOrigin: '50% 50%' } }, ghostsFront);
    const hero = KIT.bubble(heroWrap, { side: 'in', text: 'Vou comprar em outro lugar.', time: '23:51', size: 25, maxW: 'none' });
    hero.style.whiteSpace = 'nowrap';
    hero.style.padding = '13px 18px 10px';
    hero.style.borderRadius = '6px 22px 22px 22px';
    hero.style.boxShadow = '0 30px 70px rgba(0,0,0,.55), 0 0 0 2px rgba(239,68,68,.55), 0 0 40px rgba(239,68,68,.35)';
    const HERO_Z = 150, heroF = (P - HERO_Z) / P;
    const HERO = { x: 960 + (380 - 960) * heroF, y: 540 + (820 - 540) * heroF, t0: 0.46 };

    /* ============================================================ STREAKS (whip) */
    const { canvas: stCanvas, ctx: sc } = GTR.canvas(root, { z: 2 });

    /* ============================================================ HUD */
    const hud = h('div', { style: { position: 'absolute', inset: '0', zIndex: 5 } }, root);
    // S1 scrim, carried over (same geometry) — darkens the headline column only
    const scrim = h('div', { style: { position: 'absolute', left: '820px', top: '0', width: '1100px', height: '1080px',
      background: 'linear-gradient(90deg, rgba(0,21,22,0) 0%, rgba(0,21,22,.62) 24%, rgba(0,21,22,.85) 48%, rgba(0,21,22,.85) 100%)' } }, hud);
    const hudText = h('div', { style: { position: 'absolute', inset: '0' } }, hud);
    const title = KIT.headline(hudText, 'O WhatsApp\n*bloqueia*.', { size: 112, x: 1060, y: 380, align: 'left', w: 760, split: 'chars', lh: 1.04 });
    title.el.querySelectorAll('.kit-em').forEach((em) => { em.style.color = RED; em.style.textShadow = '0 0 30px rgba(239,68,68,0.5)'; });
    const sub = (txt, y) => {
      const el = h('div', { class: 'body', style: { position: 'absolute', left: '1060px', top: `${y}px`, transform: 'translateY(-50%)', fontSize: '40px', fontWeight: 700,
        color: 'rgba(255,255,255,0.8)', whiteSpace: 'nowrap' } }, hudText);
      el.textContent = txt;
      return GTR.split(el, 'words');
    };
    const sub1 = sub('Sem aviso.', 600);
    const sub2 = sub('Sem motivo.', 660);

    // chips (children of root, like S1) — 01 already in the log, 02 stamps at 2.75
    const chip1 = KIT.diagChip(root, { n: '01', err: 'SEM RESPOSTA', ok: 'RESPONDIDO', x: 120, y: 96 });
    const chip2 = KIT.diagChip(root, { n: '02', err: 'NÚMERO BANIDO', ok: 'API OFICIAL', x: 120, y: 154 });

    /* ============================================================ TEAR (settle of S1's tear) */
    const fsvg = s('svg', { width: 0, height: 0, style: { position: 'absolute', left: '0', top: '0' } }, root);
    const filt = s('filter', { id: 'db-tear', x: '-5%', y: '0%', width: '110%', height: '100%', 'color-interpolation-filters': 'sRGB' }, fsvg);
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
    const { ctx: tc } = GTR.canvas(root, { z: 70, style: { pointerEvents: 'none' } });
    const TEAR_COLS = ['#000c0d', 'rgba(239,68,68,.5)', 'rgba(21,219,168,.35)'];

    /* ============================================================ TIMELINE (DOM reveals) */
    const tl = ctx.tl();
    tl.fromTo(PHONES.map((q) => q.modal), { scale: 1.035 }, { scale: 1, duration: 0.45, ease: 'power3.out' }, 0);
    // rows die bottom-up on 16ths (0.375 … 1.0): red flush, then collapse
    for (let i = 0; i < ROWS.length; i++) {
      const r = PHONES.map((q) => q.rows[ROWS.length - 1 - i]);
      const at = 0.375 + i * 0.125;
      tl.fromTo(r, { backgroundColor: '#ffffff' }, { backgroundColor: '#fecaca', duration: 0.07, ease: 'none' }, at);
      tl.fromTo(r, { height: 88, opacity: 1 }, { height: 0, opacity: 0, duration: 0.3, ease: 'power2.in' }, at + 0.05);
    }
    tl.fromTo(PHONES.map((q) => q.pill99), { scale: 1, opacity: 1 }, { scale: 0, opacity: 0, duration: 0.3, ease: 'back.in(2)' }, 1.05);
    // headline — DOR char cascade (y 90, rot ±8 alternating, stagger .025, back.out)
    tl.fromTo(title.units, { y: 90, opacity: 0, rotate: (i) => (i % 2 ? 8 : -8), scale: 0.9 },
      { y: 0, opacity: 1, rotate: 0, scale: 1, duration: 0.55, stagger: 0.025, ease: 'back.out(1.6)' }, 0.5);
    // sublines — short slams on the beat
    const slam = (units, at) => tl.fromTo(units, { y: 34, opacity: 0, scale: 1.08, filter: 'blur(10px)' },
      { y: 0, opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.42, stagger: 0.07, ease: 'power3.out' }, at);
    slam(sub1, 1.5);
    slam(sub2, 2.0);
    // lock slam (scale 2 → 1, back.out)
    tl.fromTo(lockWrap, { scale: 2 }, { scale: 1, duration: 0.45, ease: 'back.out(1.7)' }, 2.5);
    tl.fromTo(lockWrap, { opacity: 0 }, { opacity: 1, duration: 0.1, ease: 'none' }, 2.5);
    tl.set({}, {}, 4.0);

    /* ============================================================ SFX */
    ctx.cue('glitch', 0.0, { dur: 0.15, db: -6 });
    for (let i = 0; i < 6; i++) ctx.cue('tick', 0.375 + i * 0.125, { db: -10, pan: -0.35 });   // rows dying (on 16ths)
    ctx.cue('impact', 0.5, { size: 0.7 });
    ctx.cue('impact', 1.5, { size: 0.35, db: -4 });
    ctx.cue('impact', 2.0, { size: 0.35, db: -4 });
    ctx.cue('error', 2.5, { dur: 0.3 });
    ctx.cue('tick', 2.75);
    ctx.cue('whoosh', 3.55, { dur: 0.45, up: false });

    /* ============================================================ UPDATE */
    const burst = (t, t0, k) => (t >= t0 ? Math.exp(-(t - t0) / k) : 0);
    const SCR_H = 872;

    return {
      tl,
      update(t, g) {
        /* ---- tear settle: amt 0.6 → 0 over 0–0.25 (S1's filter + bars, world only) ---- */
        const amt = t < 0.25 ? 0.6 * (1 - p(t, 0, 0.25, 'power1.out')) : 0;
        const gseed = Math.floor(g * 30);
        KIT.glitch(tearWrap, amt, g, 11);
        if (amt > 0.001) {
          const r = rng(gseed + 1);
          turb.setAttribute('seed', String((gseed % 997) + 1));
          disp.setAttribute('scale', String(170 * amt));
          const cx = (10 + r() * 10) * amt;
          offR.setAttribute('dx', String(cx));
          offGB.setAttribute('dx', String(-cx));
          tearWrap.style.filter = 'url(#db-tear)';
          const rb = rng(gseed + 7);
          tearWrap.style.clipPath = rb() < 0.22 * amt
            ? (() => { const q = rng(gseed + 9); const y0 = Math.floor(q() * 70), y1 = y0 + 20 + Math.floor(q() * 25); return `polygon(0 ${y0}%, 100% ${y0}%, 100% ${y1}%, 0 ${y1}%)`; })()
            : '';
        } else {
          tearWrap.style.filter = '';
          tearWrap.style.clipPath = '';
        }
        tc.clearRect(0, 0, 1920, 1080);
        if (amt > 0.001) {
          const r = rng(gseed);
          const N = Math.round(6 * amt);
          for (let i = 0; i < N; i++) {
            const y = r() * 1080, hh = 6 + r() * 34;
            tc.fillStyle = TEAR_COLS[Math.floor(r() * 3)];
            const x0 = r() < 0.5 ? 0 : r() * 900;
            tc.fillRect(x0, y, 1920 - x0 * (r() < 0.5 ? 0 : 1), hh);
          }
          tc.fillStyle = `rgba(255,255,255,${0.10 * amt})`;
          for (let i = 0; i < 10 * amt; i++) tc.fillRect(0, r() * 1080, 1920, 1 + r() * 2);
        }

        /* ---- camera: S1 shake (A 10 → 3 settle, accents), push 1 → 1.05, truck, whip ---- */
        const A = lerp(10, 3, p(t, 0, 0.35, 'power2.out')) + 4 * burst(t, 0.5, 0.12) + 2 * burst(t, 1.5, 0.1) + 2 * burst(t, 2.0, 0.1) + 8 * burst(t, 2.5, 0.14);
        const shx = noise(g * 8 + 0.37) * A * 1.4, shy = noise(g * 8 + 50.37) * A * 1.4, shr = noise(g * 5 + 9.37) * A * 0.03;
        const truck = p(t, 0.15, 2.7, 'sine.inOut');                   // phone eases right/down (clears chip 02)
        const wp = p(t, 3.5, 4.0, 'power2.in');
        const wx = 130 * truck + 22 * p(t, 3.3, 3.5, 'sine.out') - 922 * wp;
        const push = 1 + 0.05 * p(t, 0, 3.5, 'sine.inOut') + 0.02 * wp;
        cam.set({ x: shx + wx, y: shy + 70 * truck, rz: shr, s: push });
        const blur = 24 * wp;
        whipWrap.style.filter = blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : 'none';

        /* ---- rim light breathes (S1 continuity) and flares on the lock ---- */
        rim.style.transform = `scale(${1 + 0.06 * Math.sin(g * 6)})`;
        rim.style.opacity = Math.min(1.6, 1 + 0.6 * burst(t, 2.5, 0.35));

        /* ---- ghosts: continue S1's drift, then fall, tilt, gray out, blur, fade ---- */
        for (const q of ghosts) {
          const tau = t - q.t0;
          const a = 1 - p(tau, 0.06, 0.5, 'power1.in');
          if (a <= 0.002) { q.wrap.style.display = 'none'; continue; }
          q.wrap.style.display = 'block';
          const z = q.zd + 80 * (g - 2.5);
          const k = P / (P - z);
          const fall = tau > 0 ? 0.5 * 2600 * tau * tau : 0;
          const X = 960 + (q.x - 960) * k;
          const Y = 540 + (q.y + noise(q.ph, g * 0.6) * 10 - 540) * k + fall;
          const rot = q.rot + noise(q.ph + 3, g * 0.5) * 2 + (tau > 0 ? q.spin * tau * 60 : 0);
          q.wrap.style.transform = `translate(${X}px, ${Y}px) translate(-50%, -50%) rotate(${rot}deg) scale(${k})`;
          q.wrap.style.opacity = a;
          const dof = Math.max(0, Math.abs(z + 40) - 170) / 140 + (tau > 0 ? 6 * p(tau, 0, 0.45) : 0);
          const bright = 1 - 0.32 * clamp(-z / 650);
          const gray = lerp(q.gray, 1, p(tau, 0, 0.2));
          q.wrap.style.filter = `saturate(.7) grayscale(${gray.toFixed(3)}) brightness(${bright.toFixed(3)})${dof > 0.05 ? ` blur(${dof.toFixed(2)}px)` : ''}`;
        }
        {
          const tau = t - HERO.t0;
          const a = 0.6 * (1 - p(tau, 0.06, 0.5, 'power1.in'));
          heroWrap.style.display = a > 0.002 ? 'block' : 'none';
          if (a > 0.002) {
            const z = HERO_Z + 18 * (g - 3.35);
            const k = P / (P - z);
            const fall = tau > 0 ? 0.5 * 2600 * tau * tau : 0;
            const X = 960 + (HERO.x - 960) * k;
            const Y = 540 + (HERO.y + noise(7.7, g * 0.6) * 6 - 540) * k + fall;
            heroWrap.style.transform = `translate(${X}px, ${Y}px) translate(-50%, -50%) rotate(${-2.5 + (tau > 0 ? -tau * 50 : 0)}deg) scale(${k})`;
            heroWrap.style.opacity = a;
            const bl = tau > 0 ? 6 * p(tau, 0, 0.45) : 0;
            heroWrap.style.filter = `saturate(.7) grayscale(1)${bl > 0.05 ? ` blur(${bl.toFixed(2)}px)` : ''}`;
          }
        }

        /* ---- ban icon heartbeat ring on beats until the lock ---- */
        const bq = fract(g * 2);
        for (const q of PHONES) {
          q.banRing.style.opacity = t < 2.5 ? (1 - bq) * 0.7 : 0;
          q.banRing.style.transform = `scale(${1 + bq * 0.55})`;
          q.banDisc.style.transform = `scale(${1 + 0.04 * Math.exp(-bq * 8)})`;
        }

        /* ---- red scan 2.5–2.9 drains the screen to gray ---- */
        const sp = p(t, 2.5, 2.9, 'power1.inOut');
        const scanY = t < 2.5 ? 0 : lerp(0, SCR_H + 6, sp);
        scan.style.display = t >= 2.5 && t <= 2.96 ? 'block' : 'none';
        scan.style.transform = `translateY(${scanY - 150}px)`;
        // gray copy revealed above the scan line (clip in phone-local px: screen top = 14)
        PG.phone.el.style.display = t >= 2.5 ? 'block' : 'none';
        PG.phone.el.style.clipPath = t >= 2.92 ? 'none' : `inset(0 0 ${(900 - (14 + clamp(scanY, 0, SCR_H))).toFixed(1)}px 0)`;
        PC.phone.el.style.display = t >= 2.92 ? 'none' : 'block';
        glare.style.transform = `translateX(${noise(g * 0.35 + 3) * 60 + t * 14}px)`;

        /* ---- lock pulses + breathing halo ---- */
        lockPulse.set(inv(t, 2.52, 3.15));
        lockPulse2.set(inv(t, 2.6, 3.35));
        lockHalo.style.opacity = t < 2.5 ? 0 : 0.7 + 0.3 * Math.exp(-fract(g * 2) * 5) + 0.6 * burst(t, 2.5, 0.2);

        /* ---- chips ---- */
        chip1.set(g, 1, 0);
        chip2.set(g, inv(t, 2.75, 2.93), 0);

        /* ---- HUD text: slow drift, exit −600 + fade 3.5–3.85; scrim fades with the whip ---- */
        const ex = p(t, 3.5, 3.85, 'power2.in');
        hudText.style.transform = `translateX(${-14 * p(t, 1.0, 3.5, 'none') - 600 * ex}px)`;
        hudText.style.opacity = 1 - p(t, 3.5, 3.76, 'power1.in');
        hudText.style.filter = ex > 0.01 ? `blur(${(14 * ex).toFixed(2)}px)` : 'none';
        scrim.style.opacity = 1 - p(t, 3.5, 3.95, 'power1.in');

        /* ---- streaks (dir −1) alpha 0 → 0.6 ---- */
        sc.clearRect(0, 0, 1920, 1080);
        const sa = 0.6 * p(t, 3.5, 4.0, 'power1.in');
        stCanvas.style.display = sa > 0.004 ? 'block' : 'none';
        if (sa > 0.004) KIT.streaks(sc, g, { dir: -1, alpha: sa, n: 54, seed: 21, speed: 2600, len: 460, color: '255,176,166' });
      },
    };
  },
});
