/* ============================================================
   S2 · dor-banido — ERRO 02 · NÚMERO BANIDO          [4–8 global]
   Match cut from S1: the same phone {x:620,y:580,w:420}, rotateY 16°,
   perspective 1400, the same list, swarm and hero bubble — now under a ban
   modal. The tear settles (0–0.25) on the world AND on S1's carried headline,
   the dead swarm + that headline drop out of frame, the chat rows die bottom-up
   (red flush, badge pops, slide + collapse), "O WhatsApp bloqueia." / "Sem aviso."
   / "Sem motivo.", a red lock slams onto the ban icon while a red scan drains the
   screen (and the rim light) to gray, chip 02 stamps into the log, and the world
   whips out to the left (−900; horizontal-led blur converging to 24 × 24) over
   streaks with hot heads.
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
    const LOCK = { x: 215, y: 352 };                // lock centre in phone-local px (ban icon centre is y 380)

    /* ============================================================ WORLD */
    const tearWrap = h('div', { style: { position: 'absolute', inset: '0', zIndex: 1 } }, root);
    const whipWrap = h('div', { style: { position: 'absolute', inset: '0' } }, tearWrap);
    const cam = KIT.camera(whipWrap, { perspective: P });
    cam.world.style.transformStyle = 'flat';        // camera is 2D here (translate / rotateZ / scale)

    // red rim light behind the phone (S1: r 560, a .3, breathing with sin(t·6)); drains to gray with the scan
    const rim = GTR.glow(cam.world, { x: PX, y: PY, r: 560, color: '239,68,68', a: 0.3 });
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
      // chat list — blurred 3 px behind the modal (light enough for the row deaths to read in the slivers)
      const list = h('div', { style: { position: 'absolute', inset: '0', background: '#fff', filter: 'blur(3px)' } }, body);
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
        const badge = h('div', { style: { position: 'absolute', right: '18px', top: '45px', minWidth: '24px', height: '24px', padding: '0 7px', borderRadius: '12px', background: '#25d366', color: '#fff',
          fontSize: '13px', fontWeight: 800, display: 'grid', placeItems: 'center', transformOrigin: '50% 50%' } }, row);
        badge.textContent = String(r.n);
        h('div', { style: { position: 'absolute', left: '82px', right: '0', bottom: '0', height: '1px', background: '#eef0f1' } }, row);
        return { row, badge };
      });
      const nav = h('div', { style: { position: 'absolute', left: '0', right: '0', top: '738px', height: '80px', borderTop: '1px solid #eceff1', background: '#fff', display: 'flex', justifyContent: 'space-around', alignItems: 'flex-start', paddingTop: '10px' } }, list);
      [['message-circle', 'Conversas', true], ['circle-dot', 'Atualizações', false], ['users', 'Comunidades', false], ['phone', 'Ligações', false]].forEach(([ic, tx, on]) => {
        const it = h('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 600, color: on ? '#111' : '#54656f' } }, nav);
        it.innerHTML = `<span style="display:grid;place-items:center;width:58px;height:32px;border-radius:16px;background:${on ? '#d9fdd3' : 'transparent'}">${GTR.iconSVG(ic, { size: 22, color: on ? '#0b7a4b' : '#54656f' })}</span><span>${tx}</span>`;
      });
      // ban modal
      h('div', { style: { position: 'absolute', inset: '0', background: 'rgba(11,20,26,0.35)' } }, body);
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
      // dark 7 px seat ring + tight contact shadow: the disc reads as deliberately seated over the modal's top edge
      boxShadow: '0 0 0 7px rgba(12,4,5,0.55), 0 0 0 8.5px rgba(239,68,68,0.22), 0 10px 18px rgba(0,0,0,0.45), 0 0 70px rgba(239,68,68,0.55), 0 30px 60px rgba(0,0,0,0.55), inset 0 0 40px rgba(239,68,68,0.18)' } }, lockWrap);
    lockDisc.innerHTML = GTR.iconSVG('lock', { size: 116, color: RED, sw: 2.1 });
    lockDisc.firstChild.style.filter = 'drop-shadow(0 0 14px rgba(239,68,68,0.75))';

    /* ---- ghosts: S1's swarm + hero bubble in their exact t = 4.0 state, then they drop dead ----
       (S1 places them in a preserve-3d world; here the same perspective is projected in 2D).
       SW is a VERBATIM copy of dor-caos.js's table (same order → same ctx.rand tilts / bob phases,
       same sx/sy/z, same front/back layer). Keep the two in sync if S1 changes. */
    const SW = [
      // text, time, sx, sy, z(at 2.5), timer index, pop slot (0.75 + slot·0.125), front layer
      ['Oi, tem grade?', '23:12', 285, 250, 0, 0, 0, 1],
      ['Qual o mínimo do atacado?', '22:47', 1330, 132, -380, -1, 1, 0],
      ['Ainda tem o vestido midi?', '22:31', 1540, 900, -260, -1, 2, 0],
      ['Faz entrega em SP?', '21:58', 290, 470, 90, 2, 3, 1],
      ['Pode me mandar o link?', '17:34', 275, 925, -200, -1, 4, 1],
      ['Quanto fica a grade de 6?', '20:15', 1200, 945, -170, 4, 5, 0],
      ['Aceita Pix?', '19:52', 240, 690, -40, 3, 6, 1],
      ['Alguém aí?', '19:03', 950, 800, 30, 5, 7, 0],
      ['Oi??', '18:47', 1805, 470, -460, -1, 8, 0],
      ['Vocês têm catálogo?', '18:20', 720, 110, 150, -1, 9, 1],
      ['Tem no preto?', '21:40', 940, 250, -90, 1, 10, 0],
      ['Chegou a saia plissada?', '16:08', 1655, 118, -650, -1, 11, 0],
    ];
    const TIMERS = ['sem resposta · 13 min', '47 min', '2 h', '5 h', '1 dia', '2 dias'];
    const R1 = rng('scene:dor-caos');                  // S1's ctx.rand stream → same tilts / bob phases
    const ghosts = SW.map(([text, time, sx, sy, zd, ti, , front]) => {
      const rot = (R1() - 0.5) * 7, ph = R1() * 10;
      const wrap = h('div', { style: { position: 'absolute', left: '0', top: '0', width: 'max-content', transformOrigin: '50% 50%' } }, front ? ghostsFront : ghostsBack);
      const el = KIT.bubble(wrap, { side: 'in', text, time, size: 20, maxW: 'none' });
      el.style.boxShadow = '0 14px 34px rgba(0,0,0,.38), 0 1px 1.5px rgba(0,0,0,.13)';
      el.style.whiteSpace = 'nowrap';
      if (ti >= 0) {
        const pill = h('div', { style: { position: 'absolute', left: '10px', top: 'calc(100% + 8px)', display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '6px 12px 6px 10px', borderRadius: '999px',
          background: 'linear-gradient(rgba(239,68,68,.2),rgba(239,68,68,.2)), #1a0c0d', border: '1px solid rgba(239,68,68,.6)', color: '#fca5a5', fontFamily: FONT_UI, fontSize: '15px', fontWeight: 700,
          whiteSpace: 'nowrap', boxShadow: '0 8px 20px rgba(0,0,0,.4)', transformOrigin: '12% 0%', transform: 'rotate(-3deg) scale(1)' } }, wrap);
        pill.innerHTML = GTR.iconSVG('clock', { size: 15, sw: 2.4 }) + `<span>${TIMERS[ti]}</span>`;
      }
      const f = (P - zd) / P;
      // fade window: gone before the fall reaches y ≈ 1000 (keeps the disclaimer band clean)
      const fadeEnd = clamp(Math.sqrt((2 * Math.max(0, 1000 - sy)) / 2600), 0.2, 0.5);
      return { wrap, zd, rot, ph, gray: ti >= 0 ? 0.4 : 0, x: 960 + (sx - 960) * f, y: 540 + (sy - 540) * f, sx, fadeEnd };
    });
    // drop order: right → left, so the headline column is clear before the title lands (0.5)
    ghosts.slice().sort((a, b) => b.sx - a.sx).forEach((q, k) => { q.t0 = 0.03 + k * 0.035; q.spin = k % 2 ? 1 : -1; });
    // hero bubble — S1's end state (t ≥ 3.8): grayscale 1, brightness .6, opaque, red ring faded out
    const heroWrap = h('div', { style: { position: 'absolute', left: '0', top: '0', width: 'max-content', transformOrigin: '50% 50%' } }, ghostsFront);
    const hero = KIT.bubble(heroWrap, { side: 'in', text: 'Vou comprar em outro lugar.', time: '23:51', size: 25, maxW: 'none' });
    hero.style.whiteSpace = 'nowrap';
    hero.style.padding = '13px 18px 10px';
    hero.style.borderRadius = '6px 22px 22px 22px';
    hero.style.boxShadow = '0 30px 70px rgba(0,0,0,.55), 0 0 0 2px rgba(239,68,68,0), 0 0 40px rgba(239,68,68,0)';
    const HERO_Z = 150, heroF = (P - HERO_Z) / P;
    const HERO = { x: 960 + (380 - 960) * heroF, y: 540 + (820 - 540) * heroF, t0: 0.46 };

    /* ---- debris: three dead gray bubbles sunk deep in the world — they keep the depth after the drop
       (left third + lower right, clear of the chips and of the disclaimer band x < 380, y > 1020) ---- */
    const DEBRIS = [
      // text, time, screen x, y, z, rot, alpha
      ['Alguém aí?', '19:03', 250, 640, -540, -6, 0.42],
      ['Oi??', '18:47', 345, 872, -320, 5, 0.34],
      ['Tem no preto?', '21:40', 1590, 905, -620, -4, 0.5],
    ].map(([text, time, sx, sy, z, rot, alpha], i) => {
      const wrap = h('div', { style: { position: 'absolute', left: '0', top: '0', width: 'max-content', transformOrigin: '50% 50%', display: 'none' } }, ghostsBack);
      const el = KIT.bubble(wrap, { side: 'in', text, time, size: 20, maxW: 'none' });
      el.style.whiteSpace = 'nowrap';
      el.style.boxShadow = '0 14px 34px rgba(0,0,0,.38)';
      return { wrap, sx, sy, k: P / (P - z), rot, alpha, ph: 20 + i * 7.3 };
    });

    /* ============================================================ STREAKS (whip) */
    const { canvas: stCanvas, ctx: sc } = GTR.canvas(root, { z: 2 });

    /* ============================================================ HUD */
    const hud = h('div', { style: { position: 'absolute', inset: '0', zIndex: 5 } }, root);
    // S1 scrim, carried over (same geometry) — darkens the headline column only
    const scrim = h('div', { style: { position: 'absolute', left: '820px', top: '0', width: '1100px', height: '1080px',
      background: 'linear-gradient(90deg, rgba(0,21,22,0) 0%, rgba(0,21,22,.62) 24%, rgba(0,21,22,.85) 48%, rgba(0,21,22,.85) 100%)' } }, hud);
    // S1's headline block carried across the cut (same geometry as dor-caos), torn, then it drops dead (0.08–0.5)
    const RED_GLOW = '0 0 30px rgba(239,68,68,0.5)';
    const carry = h('div', { style: { position: 'absolute', inset: '0' } }, hud);
    const cA = KIT.headline(carry, 'Cliente\nchamando.', { x: 1060, y: 360, size: 112, align: 'left', w: 760, split: 'chars', lh: 1.04 });
    const cB = KIT.headline(carry, '*Ninguém*\nresponde.', { x: 1060, y: 660, size: 112, align: 'left', w: 760, split: 'chars', lh: 1.04 });
    const cEm = cB.el.querySelector('.kit-em');
    cEm.style.color = RED;
    cEm.style.textShadow = RED_GLOW;
    [cA.el, cB.el].forEach((el) => { el.style.transformOrigin = '0% 50%'; el.dataset.baseTransform = 'translateY(-50%)'; });
    // per-unit drop: bottom line first (clears the way), top line last; small random lead per char
    const RC = rng('dor-banido:carry');
    const carryUnits = [];
    [[cA, 0], [cB, 2]].forEach(([hd, base]) => {
      const tops = hd.units.map((u) => u.offsetTop);                  // offsetParent = the headline block
      const minTop = Math.min(...tops);
      hd.units.forEach((u, i) => {
        u.style.willChange = 'auto';
        const line = base + (tops[i] - minTop > 20 ? 1 : 0);          // 0 Cliente · 1 chamando. · 2 Ninguém · 3 responde.
        carryUnits.push({ u, t0: 0.1 + (3 - line) * 0.025 + RC() * 0.03, vx: (RC() - 0.5) * 70, spin: (RC() - 0.5) * 120 });
      });
    });
    const hudText = h('div', { style: { position: 'absolute', inset: '0' } }, hud);
    const title = KIT.headline(hudText, 'O WhatsApp\n*bloqueia*.', { size: 112, x: 1060, y: 380, align: 'left', w: 760, split: 'chars', lh: 1.04 });
    title.el.querySelectorAll('.kit-em').forEach((em) => { em.style.color = RED; em.style.textShadow = RED_GLOW; });
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
    // whip motion blur: horizontal-led Gaussian that converges to the isotropic 24 px contract at 4.0 (S3's first frame)
    const wf = s('filter', { id: 'db-whip', x: '-10%', y: '-10%', width: '120%', height: '120%', 'color-interpolation-filters': 'sRGB' }, fsvg);
    const wBlur = s('feGaussianBlur', { in: 'SourceGraphic', stdDeviation: '0 0', edgeMode: 'none' }, wf);
    const { ctx: tc } = GTR.canvas(root, { z: 70, style: { pointerEvents: 'none' } });
    const TEAR_COLS = ['#000c0d', 'rgba(239,68,68,.5)', 'rgba(21,219,168,.35)'];

    /* ============================================================ TIMELINE (DOM reveals) */
    // force3D:false + will-change:auto → no GPU layers with a frozen raster scale, so text/UI stay crisp and
    // every frame rasterises identically whatever order the render workers seek in.
    const tl = ctx.tl({ defaults: { ease: 'power3.out', force3D: false } });
    [...title.units, ...sub1, ...sub2].forEach((u) => { u.style.willChange = 'auto'; });
    tl.fromTo(PHONES.map((q) => q.modal), { scale: 1.035 }, { scale: 1, duration: 0.45, ease: 'power3.out' }, 0);
    // rows die bottom-up on 16ths (0.375 … 1.0) — driven in update() (flush, badge pop, slide + collapse)
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
    tl.fromTo(lockWrap, { opacity: 0 }, { opacity: 1, duration: 0.05, ease: 'none' }, 2.5);
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
    // hot heads on every third KIT.streaks line: replays KIT.streaks' rng stream (seed 21, dir −1) so each head
    // sits exactly on the tip of an existing streak — S3 continues the very same lines after the cut
    const streakHeads = (c2, tt, a) => {
      const r = rng(21);
      c2.lineCap = 'round';
      for (let i = 0; i < 54; i++) {
        const y = r() * 1080, sp = 2600 * (0.5 + r()), L = 460 * (0.4 + r()), off = r() * 3000;
        const xx = 1920 - (((off + tt * sp) % 2600) - 340);
        const aa = a * (0.3 + r() * 0.7), lw = 1 + r() * 2;
        if (i % 3) continue;
        const core = c2.createLinearGradient(xx + L * 0.5, y, xx, y);
        core.addColorStop(0, 'rgba(255,190,180,0)');
        core.addColorStop(1, `rgba(255,232,226,${aa.toFixed(3)})`);
        c2.strokeStyle = core;
        c2.lineWidth = lw + 1.6;
        c2.beginPath(); c2.moveTo(xx + L * 0.5, y); c2.lineTo(xx, y); c2.stroke();
        const hg = c2.createRadialGradient(xx, y, 0, xx, y, 14);
        hg.addColorStop(0, `rgba(255,240,236,${(0.9 * aa).toFixed(3)})`);
        hg.addColorStop(0.35, `rgba(255,120,110,${(0.35 * aa).toFixed(3)})`);
        hg.addColorStop(1, 'rgba(239,68,68,0)');
        c2.fillStyle = hg;
        c2.fillRect(xx - 14, y - 14, 28, 28);
      }
    };
    const SCR_H = 872;

    return {
      tl,
      update(t, g) {
        /* ---- tear settle: amt 0.6 → 0 over 0–0.25 (S1's filter + bars on the world and the carried HUD) ---- */
        const amt = t < 0.25 ? 0.6 * (1 - p(t, 0, 0.25, 'power1.out')) : 0;
        const gseed = Math.floor(g * 30);
        KIT.glitch(tearWrap, amt, g, 11);
        KIT.glitch(cA.el, amt, g, 23);                                   // S1's per-headline seeds
        KIT.glitch(cB.el, amt, g, 37);
        cEm.style.textShadow = amt > 0.001 && cB.el.style.textShadow ? `${cB.el.style.textShadow}, ${RED_GLOW}` : RED_GLOW;
        hud.style.filter = amt > 0.001 ? 'url(#db-tear)' : '';
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
        cam.set({ x: shx + wx, y: shy + 12 * truck, rz: shr, s: push });
        // motion blur: horizontal smear tracks the whip velocity; the vertical term only catches up at the very
        // end so the last frame meets S3's isotropic blur 24 (u = 1 → 24 × 24)
        const u = inv(t, 3.5, 4.0);
        if (u > 0.002) {
          const bx = 24 * u + 10 * Math.sin(Math.PI * u), by = 24 * Math.pow(u, 5);
          wBlur.setAttribute('stdDeviation', `${bx.toFixed(2)} ${by.toFixed(2)}`);
          whipWrap.style.filter = 'url(#db-whip)';
        } else whipWrap.style.filter = 'none';

        /* ---- rim light breathes (S1 continuity), swells on the lock slam, then drains to gray with the scan ---- */
        const drain = p(t, 2.5, 2.9, 'power1.inOut');
        rim.style.transform = `scale(${(1 + 0.06 * Math.sin(g * 6)) * (1 + 0.28 * burst(t, 2.5, 0.3))})`;
        rim.style.filter = drain > 0.001 ? `grayscale(${(0.9 * drain).toFixed(3)})` : '';
        rim.style.opacity = 1 - 0.3 * drain;

        /* ---- chat rows die bottom-up on 16ths: red flush + badge pops red → 0, then the row slides left and collapses ---- */
        for (let i = 0; i < ROWS.length; i++) {
          const at = 0.375 + (ROWS.length - 1 - i) * 0.125;
          const fl = p(t, at, at + 0.06, 'power1.out');
          const c = p(t, at + 0.05, at + 0.35, 'power2.in');
          const bs = t < at ? 1 : Math.max(0, lerp(1, 1.5, p(t, at, at + 0.07, 'power2.out')) * (1 - p(t, at + 0.07, at + 0.24, 'power2.in')));
          const bg = `rgb(${Math.round(lerp(255, 245, fl))},${Math.round(lerp(255, 143, fl))},${Math.round(lerp(255, 143, fl))})`;
          for (const q of PHONES) {
            const { row, badge } = q.rows[i];
            row.style.backgroundColor = bg;
            row.style.height = `${(88 * (1 - c)).toFixed(2)}px`;
            row.style.opacity = 1 - c;
            row.style.transform = c > 0 ? `translateX(${(-34 * c).toFixed(2)}px)` : '';
            badge.style.background = t >= at ? RED : '#25d366';
            badge.style.boxShadow = t >= at ? '0 0 14px rgba(239,68,68,.9)' : 'none';
            badge.style.transform = `scale(${bs.toFixed(3)})`;
          }
        }

        /* ---- S1's headline, carried torn across the cut, drops dead char by char (bottom line first) ---- */
        carry.style.display = t < 0.7 ? 'block' : 'none';
        if (t < 0.7) {
          for (const c of carryUnits) {
            const tau = t - c.t0;
            if (tau <= 0) { c.u.style.transform = ''; c.u.style.opacity = 1; c.u.style.filter = ''; continue; }
            const fall = 520 * tau + 0.5 * 4200 * tau * tau;                // decisive drop: gone by 0.45 (title lands 0.5)
            c.u.style.transform = `translate(${(c.vx * tau).toFixed(2)}px, ${fall.toFixed(2)}px) rotate(${(c.spin * tau).toFixed(2)}deg)`;
            c.u.style.opacity = 1 - p(tau, 0.02, 0.24, 'power1.in');
            const gr = p(tau, 0, 0.08);
            c.u.style.filter = `grayscale(${gr.toFixed(3)}) brightness(${(1 - 0.35 * gr).toFixed(3)}) blur(${(7 * p(tau, 0, 0.24, 'power1.in')).toFixed(2)}px)`;
          }
        }

        /* ---- ghosts: continue S1's drift, then fall, tilt, gray out, blur, fade ---- */
        for (const q of ghosts) {
          const tau = t - q.t0;
          const a = 1 - p(tau, 0.06, q.fadeEnd, 'power1.in');
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
          const a = 1 - p(tau, 0.06, 0.37, 'power1.in');                 // gone before it reaches the disclaimer band
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
            heroWrap.style.filter = `saturate(.7) grayscale(1) brightness(0.6)${bl > 0.05 ? ` blur(${bl.toFixed(2)}px)` : ''}`;
          }
        }

        /* ---- debris: fades in once the swarm has dropped, sinks slowly, parallax against the truck ---- */
        for (const d of DEBRIS) {
          const a = d.alpha * p(t, 1.0, 1.9, 'sine.inOut') * (1 - 0.25 * drain);
          d.wrap.style.display = a > 0.003 ? 'block' : 'none';
          if (a <= 0.003) continue;
          const X = d.sx - 130 * truck * (1 - d.k) + noise(d.ph, g * 0.3) * 8;
          const Y = d.sy + 9 * (t - 1.0) + noise(d.ph + 5, g * 0.35) * 6;
          d.wrap.style.transform = `translate(${X.toFixed(2)}px, ${Y.toFixed(2)}px) translate(-50%, -50%) rotate(${(d.rot + noise(d.ph + 9, g * 0.4) * 2).toFixed(2)}deg) scale(${d.k.toFixed(3)})`;
          d.wrap.style.opacity = a;
          d.wrap.style.filter = `grayscale(1) brightness(0.55) blur(${(3 + 5 * (1 - d.k)).toFixed(2)}px)`;
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
        scan.style.opacity = 1 - p(t, 2.84, 2.96, 'power1.in');
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

        /* ---- HUD text: slow drift right (anticipation), exit −600 + fade 3.5–3.85; scrim fades with the whip ---- */
        const ex = p(t, 3.5, 3.85, 'power2.in');
        hudText.style.transform = `translateX(${10 * p(t, 1.0, 3.5, 'sine.inOut') - 600 * ex}px)`;
        hudText.style.opacity = 1 - p(t, 3.5, 3.76, 'power1.in');
        hudText.style.filter = ex > 0.01 ? `blur(${(14 * ex).toFixed(2)}px)` : 'none';
        scrim.style.opacity = 1 - p(t, 3.5, 3.95, 'power1.in');

        /* ---- streaks (dir −1) alpha 0 → 0.6 ---- */
        sc.clearRect(0, 0, 1920, 1080);
        const sa = 0.6 * p(t, 3.5, 4.0, 'power1.in');
        stCanvas.style.display = sa > 0.004 ? 'block' : 'none';
        if (sa > 0.004) {
          KIT.streaks(sc, g, { dir: -1, alpha: sa, n: 54, seed: 21, speed: 2600, len: 460, color: '255,176,166' });
          streakHeads(sc, g, Math.min(1, sa * 1.5) * (1 - 0.6 * p(t, 3.86, 4.0, 'sine.in')));   // eases toward S3's plain streaks
        }
      },
    };
  },
});
