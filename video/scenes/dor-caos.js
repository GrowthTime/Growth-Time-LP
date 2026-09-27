/* S1 · dor-caos · [0–4] — the hook + ERRO 01 · SEM RESPOSTA  (STORYBOARD.md §2 S1)
   Frame 0: a giant red notification badge "1" races to 99+, then docks into the phone's
   "Conversas" header pill while the phone racks into focus. A swarm of unanswered
   customer bubbles pops around it, "Cliente chamando. / Ninguém responde." lands on the
   bar, timer pills age the messages, "Vou comprar em outro lugar." flies out, chip 01
   stamps and the frame tears apart (hand-off: match cut into dor-banido).
   Layers (back → front): camera world (phone rig, swarm | hero bubble) · HUD badge ·
   HUD headlines (+scrim) · HUD chip · tear canvas. Everything is a pure function of time. */
GTR.scene({
  id: 'dor-caos',
  build(root, ctx) {
    const { h, s, p, map, inv, clamp, lerp, noise, rng, E } = GTR;
    const C = KIT.C;

    /* ---------------- constants ---------------- */
    const P = 1400;                 // camera perspective
    const PX = 620, PY = 580;       // final phone centre (hand-off contract)
    const PK = 420 / 430;           // KIT.phone internal scale for w 420
    const PILL_OFF = [14 + 340 - 215, 14 + 92 - 450]; // "99+" pill centre vs phone centre (unscaled)
    const PINGS = [0, 0.25, 0.5, 0.625, 0.75, 0.875, 1.0];
    const RED = '#ef4444';
    const FONT_UI = "'Inter', system-ui, sans-serif";

    /* =========================================================
       1 · CAMERA WORLD
       ========================================================= */
    // soft red rim light behind the phone (2D, behind the camera: a flat plane inside the
    // 3D world would z-fight the rotated phone)
    const rim = GTR.glow(root, { x: PX, y: PY, r: 560, color: '239,68,68', a: 0.3 });
    const cam = KIT.camera(root, { perspective: P });
    const view = cam.view, world = cam.world;
    // hero bubble lives in its own 3D context (same camera) so the rotated phone never occludes it
    const heroWorld = h('div', { style: { position: 'absolute', inset: '0', transformStyle: 'preserve-3d', transformOrigin: '50% 50%' } }, view);

    // phone rig: rotateY about the phone centre (contract: rotateY 16° at the cut)
    const rig = h('div', { style: { position: 'absolute', left: '0', top: '0', width: '1920px', height: '1080px', transformOrigin: `${PX}px ${PY}px` } }, world);
    const phone = KIT.phone(rig, { x: PX, y: PY, w: 420 });
    phone.el.style.boxShadow = 'none';
    // status bar clock → late night (the store is closed; pays off in fix-ia at 23:47)
    const sbTime = phone.screen.firstChild && phone.screen.firstChild.firstChild;
    if (sbTime) sbTime.textContent = '23:52';

    // glass sheen over the screen; slides as the phone turns toward the headline
    const gloss = h('div', { style: { position: 'absolute', inset: '0', zIndex: 8, pointerEvents: 'none', borderRadius: '52px',
      background: 'linear-gradient(112deg, rgba(255,255,255,0) 30%, rgba(255,255,255,.16) 42%, rgba(255,255,255,0) 56%)', backgroundSize: '220% 100%' } }, phone.screen);

    /* ---- phone UI: WhatsApp-style conversation list ---- */
    const body = phone.body;
    body.style.background = '#fff';
    body.style.fontFamily = FONT_UI;
    const hdr = h('div', { style: { position: 'absolute', left: '0', top: '0', width: '402px', height: '76px' } }, body);
    h('div', { style: { position: 'absolute', left: '22px', top: '16px', fontSize: '31px', lineHeight: '44px', fontWeight: 800, letterSpacing: '-0.025em', color: '#111' } }, hdr).textContent = 'Conversas';
    // the "99+" pill — its centre is screen (340, 92) → body (340, 38)
    const pill99 = h('div', { style: { position: 'absolute', left: '305px', top: '20px', width: '70px', height: '36px', borderRadius: '18px', background: 'linear-gradient(180deg,#f87171,#dc2626)',
      color: '#fff', fontWeight: 800, fontSize: '19px', letterSpacing: '-0.01em', display: 'grid', placeItems: 'center', boxShadow: '0 6px 16px rgba(239,68,68,.45), 0 0 0 3px #fff', transformOrigin: '50% 50%', opacity: 0 } }, hdr);
    pill99.textContent = '99+';

    const search = h('div', { style: { position: 'absolute', left: '16px', top: '80px', width: '370px', height: '42px', borderRadius: '21px', background: '#f0f2f5', display: 'flex', alignItems: 'center', gap: '10px', padding: '0 16px', color: '#8696a0', fontSize: '16px' } }, body);
    search.innerHTML = GTR.iconSVG('search', { size: 19, color: '#8696a0' }) + '<span>Pesquisar</span>';
    const chipsRow = h('div', { style: { position: 'absolute', left: '16px', top: '134px', display: 'flex', gap: '8px' } }, body);
    [['Tudo', false], ['Não lidas', true], ['Favoritas', false], ['Grupos', false]].forEach(([tx, on]) => {
      const c = h('div', { style: { height: '32px', padding: '0 14px', borderRadius: '16px', display: 'flex', alignItems: 'center', fontSize: '14px', fontWeight: 600,
        background: on ? '#d9fdd3' : '#f0f2f5', color: on ? '#0b7a4b' : '#54656f' } }, chipsRow);
      c.textContent = tx;
    });

    const ROWS = [
      { name: 'Patrícia Modas', msg: 'Oi! Vi o anúncio da coleção verão', n: 3, time: '23:46', av: 'PM' },
      { name: '(85) 9 ••••-3344', msg: 'Oi, tem grade?', n: 2, time: '23:31' },
      { name: '(21) 9 ••••-2208', msg: 'Faz entrega em SP?', n: 5, time: '22:58' },
      { name: '(71) 9 ••••-1177', msg: 'Alguém aí?', n: 7, time: '21:10' },
      { name: '(11) 9 ••••-0932', msg: 'Tem a grade em preto?', n: 4, time: 'Ontem' },
      { name: '(81) 9 ••••-7765', msg: 'Pode me mandar o link?', n: 12, time: 'Ontem' },
    ];
    // unread counters tick up with the "tick" SFX (2.5 / 3.0 / 3.5)
    const BUMPS = [[2.5, [0, 5]], [3.0, [3, 1]], [3.5, [0, 5]]];
    const rowEls = ROWS.map((r, i) => {
      const row = h('div', { style: { position: 'absolute', left: '0', top: `${180 + i * 88}px`, width: '402px', height: '88px' } }, body);
      const av = h('div', { style: { position: 'absolute', left: '16px', top: '18px', width: '52px', height: '52px', borderRadius: '50%', display: 'grid', placeItems: 'center',
        background: r.av ? 'linear-gradient(135deg,#f9a8d4,#db2777)' : '#dfe5e7', color: '#fff', fontWeight: 800, fontSize: '19px' } }, row);
      av.innerHTML = r.av ? r.av : GTR.iconSVG('user', { size: 30, color: '#fff', sw: 2.2 });
      h('div', { style: { position: 'absolute', left: '82px', top: '17px', width: '220px', fontSize: '17px', fontWeight: 700, color: '#111', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }, row).textContent = r.name;
      h('div', { style: { position: 'absolute', right: '18px', top: '20px', fontSize: '13px', fontWeight: 600, color: '#1daa61' } }, row).textContent = r.time;
      h('div', { style: { position: 'absolute', left: '82px', top: '46px', width: '252px', fontSize: '15px', color: '#667781', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }, row).textContent = r.msg;
      const cnt = h('div', { style: { position: 'absolute', right: '18px', top: '45px', minWidth: '24px', height: '24px', padding: '0 7px', borderRadius: '12px', background: '#25d366', color: '#fff',
        fontSize: '13px', fontWeight: 800, display: 'grid', placeItems: 'center', transformOrigin: '50% 50%' } }, row);
      cnt.textContent = String(r.n);
      h('div', { style: { position: 'absolute', left: '82px', right: '0', bottom: '0', height: '1px', background: '#eef0f1' } }, row);
      return { row, cnt, base: r.n, last: r.n };
    });

    const nav = h('div', { style: { position: 'absolute', left: '0', right: '0', top: '738px', height: '80px', borderTop: '1px solid #eceff1', background: '#fff', display: 'flex', justifyContent: 'space-around', alignItems: 'flex-start', paddingTop: '10px' } }, body);
    [['message-circle', 'Conversas', true], ['circle-dot', 'Atualizações', false], ['users', 'Comunidades', false], ['phone', 'Ligações', false]].forEach(([ic, tx, on]) => {
      const it = h('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 600, color: on ? '#111' : '#54656f' } }, nav);
      it.innerHTML = `<span style="display:grid;place-items:center;width:58px;height:32px;border-radius:16px;background:${on ? '#d9fdd3' : 'transparent'}">${GTR.iconSVG(ic, { size: 22, color: on ? '#0b7a4b' : '#54656f' })}</span><span>${tx}</span>`;
    });

    /* ---- swarm: 12 unanswered customer bubbles ----
       Designed on screen at t = 2.5 (after the −200 px swarm shift); z drifts +80 px/s. */
    const swarm = h('div', { style: { position: 'absolute', left: '0', top: '0', width: '1920px', height: '1080px', transformStyle: 'preserve-3d' } }, world);
    // bubbles hugging the phone's near (left) edge ride in the front context so the rotated
    // phone never slices them while it slides past
    const swarmFront = h('div', { style: { position: 'absolute', left: '0', top: '0', width: '1920px', height: '1080px', transformStyle: 'preserve-3d' } }, heroWorld);
    const R = ctx.rand;
    // pop order is chosen so no bubble pops hidden behind the badge or the centred phone
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
    const SHIFT = 200;
    const bubbles = SW.map(([text, time, sx, sy, zd, ti, slot, front]) => {
      const wrap = h('div', { style: { position: 'absolute', left: '0', top: '0', width: 'max-content', transformOrigin: '50% 50%', opacity: 0 } }, front ? swarmFront : swarm);
      const el = KIT.bubble(wrap, { side: 'in', text, time, size: 20, maxW: 'none' });
      el.style.boxShadow = '0 14px 34px rgba(0,0,0,.38), 0 1px 1.5px rgba(0,0,0,.13)';
      el.style.whiteSpace = 'nowrap';
      let pill = null;
      if (ti >= 0) {
        pill = h('div', { style: { position: 'absolute', left: '10px', top: 'calc(100% + 8px)', display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '6px 12px 6px 10px', borderRadius: '999px',
          background: 'linear-gradient(rgba(239,68,68,.2),rgba(239,68,68,.2)), #1a0c0d', border: '1px solid rgba(239,68,68,.6)', color: '#fca5a5', fontFamily: FONT_UI, fontSize: '15px', fontWeight: 700,
          whiteSpace: 'nowrap', boxShadow: '0 8px 20px rgba(0,0,0,.4)', transformOrigin: '12% 0%', opacity: 0 } }, wrap);
        pill.innerHTML = GTR.iconSVG('clock', { size: 15, sw: 2.4 }) + `<span>${TIMERS[ti]}</span>`;
      }
      // world coords so the bubble sits at (sx, sy) on screen at t = 2.5 with depth zd
      const f = (P - zd) / P;
      return {
        wrap, el, pill, ti, zd,
        x: 960 + SHIFT + (sx - 960) * f,
        y: 540 + (sy - 540) * f,
        tp: 0.75 + slot * 0.125,
        rot: (R() - 0.5) * 7,
        ph: R() * 10,
      };
    });

    /* ---- hero bubble (own 3D context, same camera) ---- */
    const HERO_Z = 150;
    const heroF = (P - HERO_Z) / P;
    const HERO = { x: 960 + (380 - 960) * heroF, y: 540 + (820 - 540) * heroF };
    const heroWrap = h('div', { style: { position: 'absolute', left: '0', top: '0', width: 'max-content', transformOrigin: '50% 50%', opacity: 0 } }, heroWorld);
    const hero = KIT.bubble(heroWrap, { side: 'in', text: 'Vou comprar em outro lugar.', time: '23:51', size: 25, maxW: 'none' });
    hero.style.whiteSpace = 'nowrap';
    hero.style.padding = '13px 18px 10px';
    hero.style.borderRadius = '6px 22px 22px 22px';
    hero.style.boxShadow = '0 30px 70px rgba(0,0,0,.55), 0 0 0 2px rgba(239,68,68,.55), 0 0 40px rgba(239,68,68,.35)';

    /* =========================================================
       2 · HUD BADGE
       ========================================================= */
    const badgeWrap = h('div', { style: { position: 'absolute', left: '470px', top: '50px', width: '980px', height: '980px', transformOrigin: '50% 50%' } }, root);
    const rings = PINGS.map(() => h('div', { style: { position: 'absolute', inset: '0', borderRadius: '50%', border: '5px solid rgba(248,113,113,.9)', opacity: 0, boxShadow: '0 0 30px rgba(239,68,68,.45)' } }, badgeWrap));
    const badge = h('div', { style: { position: 'absolute', inset: '0', borderRadius: '50%', overflow: 'hidden',
      background: 'radial-gradient(circle at 35% 30%, #f87171, #dc2626 70%)',
      boxShadow: '0 0 160px rgba(239,68,68,.55), 0 40px 120px rgba(0,0,0,.35), inset 0 -40px 90px rgba(127,29,29,.5), inset 0 0 0 3px rgba(255,255,255,.14)' } }, badgeWrap);
    h('div', { style: { position: 'absolute', left: '15%', top: '3.5%', width: '70%', height: '40%', borderRadius: '50%',
      background: 'radial-gradient(ellipse at 50% 18%, rgba(255,255,255,.42), rgba(255,255,255,.08) 55%, rgba(255,255,255,0) 72%)' } }, badge);
    const num = h('div', { class: 'display', style: { position: 'absolute', left: '0', width: '980px', textAlign: 'center', color: '#fff', lineHeight: '1', whiteSpace: 'nowrap',
      textShadow: '0 16px 50px rgba(127,29,29,.5)' } }, badge);
    // analytic vertical centring of the glyphs (fonts are loaded before build)
    const mc = document.createElement('canvas').getContext('2d');
    const numTop = (size, txt) => {
      mc.font = `${size}px "Russo One"`;
      const m = mc.measureText(txt);
      const A = m.fontBoundingBoxAscent, D = m.fontBoundingBoxDescent;
      const glyphMid = (size + A - D) / 2 - (m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2;
      return 490 - glyphMid;
    };
    const TOP_BIG = numTop(520, '88'), TOP_PLUS = numTop(360, '99+');
    let numState = '';

    /* =========================================================
       3 · HUD HEADLINES (+ scrim)
       ========================================================= */
    const hud = h('div', { style: { position: 'absolute', inset: '0' } }, root);
    const scrim = h('div', { style: { position: 'absolute', left: '820px', top: '0', width: '1100px', height: '1080px', opacity: 0,
      background: 'linear-gradient(90deg, rgba(0,21,22,0) 0%, rgba(0,21,22,.62) 24%, rgba(0,21,22,.85) 48%, rgba(0,21,22,.85) 100%)' } }, hud);
    const hA = KIT.headline(hud, 'Cliente\nchamando.', { x: 1060, y: 360, size: 112, align: 'left', w: 760, split: 'chars', lh: 1.04 });
    const hB = KIT.headline(hud, '*Ninguém*\nresponde.', { x: 1060, y: 660, size: 112, align: 'left', w: 760, split: 'words', lh: 1.04 });
    const emB = hB.el.querySelector('.kit-em');
    const RED_GLOW = '0 0 30px rgba(239,68,68,.5)';
    emB.style.color = RED;
    emB.style.textShadow = RED_GLOW;
    [hA.el, hB.el].forEach((el) => { el.style.transformOrigin = '0% 50%'; el.dataset.baseTransform = 'translateY(-50%)'; });

    /* =========================================================
       4 · HUD CHIP
       ========================================================= */
    const chip = KIT.diagChip(root, { n: '01', err: 'SEM RESPOSTA', ok: 'RESPONDIDO', x: 120, y: 96 });

    /* =========================================================
       5 · TEAR (3.75–4.0): displacement + RGB split filter, torn bars
       ========================================================= */
    const fsvg = s('svg', { width: 0, height: 0, style: { position: 'absolute', left: '0', top: '0' } }, root);
    const filt = s('filter', { id: 'dc-tear', x: '-5%', y: '0%', width: '110%', height: '100%', 'color-interpolation-filters': 'sRGB' }, fsvg);
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

    /* =========================================================
       GSAP: headline reveals only (everything else in update)
       ========================================================= */
    const tl = ctx.tl();
    // DOR reveal: char cascade, y 90, alternating ±8°, stagger .025, back.out
    tl.fromTo(hA.units, { y: 90, opacity: 0, rotate: (i) => (i % 2 ? 8 : -8), scale: 0.9 },
      { y: 0, opacity: 1, rotate: 0, scale: 1, duration: 0.55, stagger: 0.025, ease: 'back.out(1.6)' }, 1.5);
    // "Ninguém responde." slams on the bar (blur-in word reveal, dur .45, with a scale slam)
    tl.fromTo(hB.units, { opacity: 0, scale: 1.45, filter: 'blur(14px)' },
      { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.45, stagger: 0.07, ease: 'expo.out' }, 2.0);
    tl.set({}, {}, 4.0);

    /* =========================================================
       SFX (local = global here)
       ========================================================= */
    PINGS.forEach((t, i) => ctx.cue('notify', t, { db: -4, pan: i % 2 ? 0.3 : -0.3 }));
    ctx.cue('whoosh', 0.8, { dur: 0.6, up: false });
    ctx.cue('impact', 1.0, { size: 0.6 });
    ctx.cue('impact', 2.0, { size: 0.8 });
    ctx.cue('error', 2.5, { db: -6 });
    [2.5, 3.0, 3.5].forEach((t) => ctx.cue('tick', t, { db: -4 }));
    ctx.cue('swoosh', 3.0);
    ctx.cue('glitch', 3.25, { dur: 0.12 });
    ctx.cue('glitch', 3.75, { dur: 0.3 });

    /* ---------------- helpers ---------------- */
    const shakeAmp = (t) => {
      let A = 3;
      if (t >= 1.0) A += 9 * Math.pow(1 - inv(t, 1.0, 1.25), 1.5);            // "99+" burst
      if (t >= 2.0) A += 5 * Math.pow(1 - inv(t, 2.0, 2.3), 2);                // headline slam
      A += 7 * p(t, 2.0, 3.75, 'power1.in');                                   // 3 → 10
      return A;
    };
    const kickAt = (t) => {
      let k = 0;
      for (const tp of PINGS) if (t >= tp && t < tp + 0.12) k += 0.04 * Math.pow(1 - (t - tp) / 0.12, 2);
      return k;
    };

    /* =========================================================
       UPDATE
       ========================================================= */
    return {
      tl,
      update(local, global) {
        const t = Math.max(0, local);

        /* ---- camera: identity + handheld shake ---- */
        const A = shakeAmp(t);
        const sx = noise(t * 8 + 0.37) * A * 1.4;
        const sy = noise(t * 8 + 50.37) * A * 1.4;
        const rz = noise(t * 5 + 9.37) * A * 0.03;
        const camT = `translate3d(${sx}px, ${sy}px, 0px) rotateZ(${rz}deg)`;
        world.style.transform = camT;
        heroWorld.style.transform = camT;

        /* ---- phone rig ---- */
        const grow = p(t, 0.75, 1.5, 'power3.inOut');
        const slide = p(t, 1.5, 2.0, 'power3.out');
        const psc = lerp(0.6, 1, grow);
        const pdx = lerp(340, 0, slide);
        const pry = lerp(0, 16, slide);
        rig.style.transform = `translateX(${pdx}px) rotateY(${pry}deg) scale(${psc})`;
        const blur = lerp(20, 0, grow);
        phone.el.style.filter = blur > 0.05 ? `saturate(.7) blur(${blur.toFixed(2)}px)` : 'saturate(.7)';
        rim.style.transform = `translate(${pdx + sx}px, ${sy}px) scale(${psc * (1 + 0.06 * Math.sin(t * 6))})`;
        gloss.style.backgroundPosition = `${lerp(100, 10, slide) - 6 * Math.sin(t * 0.8)}% 0`;
        rim.style.opacity = 0.35 + 0.65 * grow;

        // "99+" pill (appears as the badge docks) + tick pulses
        const pp = p(t, 1.4, 1.62, 'back.out(2.4)');
        let pulse = 0;
        for (const tb of [2.5, 3.0, 3.5]) if (t >= tb) pulse += 0.14 * Math.pow(1 - inv(t, tb, tb + 0.2), 2);
        pill99.style.opacity = clamp(inv(t, 1.4, 1.48));
        pill99.style.transform = `scale(${(0.4 + 0.6 * pp) * (1 + pulse)})`;

        // unread counters
        for (let i = 0; i < rowEls.length; i++) {
          const r = rowEls[i];
          let n = r.base, pop = 0;
          for (const [tb, idx] of BUMPS) if (idx.includes(i) && t >= tb) { n++; pop = Math.max(pop, 0.35 * Math.pow(1 - inv(t, tb, tb + 0.25), 2)); }
          if (n !== r.last) { r.cnt.textContent = String(n); r.last = n; }
          r.cnt.style.transform = `scale(${1 + pop})`;
        }

        /* ---- swarm ---- */
        swarm.style.transform = swarmFront.style.transform = `translateX(${-SHIFT * slide}px)`;
        for (const b of bubbles) {
          if (t < b.tp) { b.wrap.style.opacity = 0; continue; }
          const pop = p(t, b.tp, b.tp + 0.35, 'back.out(1.7)');
          const z = b.zd + 80 * (t - 2.5);
          const bob = noise(b.ph, t * 0.6) * 10;
          const rot = b.rot + noise(b.ph + 3, t * 0.5) * 2;
          b.wrap.style.opacity = clamp(inv(t, b.tp, b.tp + 0.1));
          b.wrap.style.transform = `translate3d(${b.x}px, ${b.y + bob}px, ${z}px) translate(-50%, -50%) rotate(${rot}deg) scale(${0.6 + 0.4 * pop})`;
          // depth of field + atmosphere (focus plane ≈ phone)
          const dof = Math.max(0, Math.abs(z + 40) - 170) / 140;
          const bright = 1 - 0.32 * clamp(-z / 650);
          let gray = 0;
          if (b.pill) {
            const ts = 2.25 + b.ti * 0.125;
            const q = p(t, ts, ts + 0.16, 'power4.out');
            b.pill.style.opacity = clamp(inv(t, ts, ts + 0.05));
            b.pill.style.transform = `rotate(-3deg) scale(${t < ts ? 1.6 : lerp(1.6, 1, q)})`;
            gray = 0.4 * p(t, ts, ts + 0.3, 'power2.out');
          }
          b.wrap.style.filter = `saturate(.7) grayscale(${gray.toFixed(3)}) brightness(${bright.toFixed(3)})${dof > 0.05 ? ` blur(${dof.toFixed(2)}px)` : ''}`;
        }

        /* ---- hero bubble: deep z → front-left, 3.00–3.35; grays out at 3.5 ---- */
        if (t < 3.0) heroWrap.style.opacity = 0;
        else {
          const f = p(t, 3.0, 3.35, 'expo.out');
          const z = lerp(-2600, HERO_Z, f) + 18 * Math.max(0, t - 3.35);
          const rot = lerp(-14, -2.5, p(t, 3.0, 3.5, 'back.out(2)'));
          const mblur = 7 * (1 - p(t, 3.0, 3.3, 'power2.out'));
          const g = p(t, 3.5, 3.8, 'power2.out');
          // "turns gray and fades to 0.6": dimmed to 60 % brightness but kept opaque so the
          // phone rows behind never show through the bubble
          heroWrap.style.opacity = clamp(inv(t, 3.0, 3.06));
          heroWrap.style.transform = `translate3d(${HERO.x}px, ${HERO.y + noise(7.7, t * 0.6) * 6}px, ${z}px) translate(-50%, -50%) rotate(${rot}deg)`;
          heroWrap.style.filter = `saturate(.7) grayscale(${g.toFixed(3)}) brightness(${lerp(1, 0.6, g).toFixed(3)})${mblur > 0.05 ? ` blur(${mblur.toFixed(2)}px)` : ''}`;
          hero.style.boxShadow = `0 30px 70px rgba(0,0,0,.55), 0 0 0 2px rgba(239,68,68,${(0.55 * (1 - g)).toFixed(3)}), 0 0 40px rgba(239,68,68,${(0.35 * (1 - g)).toFixed(3)})`;
        }

        /* ---- HUD badge: counter 1 → 99+, pull-back into the pill ---- */
        if (t >= 1.5) badgeWrap.style.display = 'none';
        else {
          badgeWrap.style.display = 'block';
          const e = p(t, 0.75, 1.5, 'expo.inOut');
          const tx = 960 + PILL_OFF[0] * PK * psc + sx, ty = PY + PILL_OFF[1] * PK * psc + sy;
          const bx = lerp(960, tx, e), by = lerp(540, ty, e);
          const bs = lerp(1, 0.05, e) * (1 + kickAt(t)) * (1 + 0.035 * p(t, 0, 0.9, 'sine.out'));
          badgeWrap.style.transform = `translate(${bx - 960}px, ${by - 540}px) scale(${bs})`;
          badgeWrap.style.opacity = 1 - inv(t, 1.4, 1.5);
          const txt = t < 1.0 ? String(Math.round(map(t, 0, 1.0, 1, 99, 'power2.in'))) : '99+';
          if (txt !== numState) {
            numState = txt;
            num.textContent = txt;
            const big = txt !== '99+';
            num.style.fontSize = big ? '520px' : '360px';
            num.style.top = `${big ? TOP_BIG : TOP_PLUS}px`;
          }
          rings.forEach((rg, i) => {
            const q = (t - PINGS[i]) / 0.7;
            if (q < 0 || q > 1) { rg.style.opacity = 0; return; }
            rg.style.opacity = 0.6 * Math.pow(1 - q, 1.6);
            rg.style.transform = `scale(${1 + 0.4 * E('power2.out')(q)})`;
          });
        }

        /* ---- HUD headlines: scrim + slam ---- */
        scrim.style.opacity = p(t, 1.5, 2.0, 'power2.out');
        const slam = t >= 2.0 ? 1 + 0.035 * Math.pow(1 - inv(t, 2.0, 2.25), 2) : 1;
        hB.el.dataset.baseTransform = `translateY(-50%) scale(${slam})`;

        /* ---- chip 01 ---- */
        chip.set(local, inv(t, 3.25, 3.43), 0);

        /* ---- tear (3.75–4.0) ---- */
        const amt = p(t, 3.75, 3.95, 'power1.in');
        const gseed = Math.floor(global * 30);
        KIT.glitch(view, amt, t, 11);
        view.style.clipPath = amt > 0.001 && rng(gseed + 7)() < 0.22 * amt
          ? (() => { const r = rng(gseed + 9); const y0 = Math.floor(r() * 70), y1 = y0 + 20 + Math.floor(r() * 25); return `polygon(0 ${y0}%, 100% ${y0}%, 100% ${y1}%, 0 ${y1}%)`; })()
          : '';
        KIT.glitch(hA.el, amt, t, 23);
        KIT.glitch(hB.el, amt, t, 37);
        emB.style.textShadow = amt > 0.001 && hB.el.style.textShadow ? `${hB.el.style.textShadow}, ${RED_GLOW}` : RED_GLOW;
        if (amt > 0.001) {
          const r = rng(gseed + 1);
          turb.setAttribute('seed', String((gseed % 997) + 1));
          disp.setAttribute('scale', String(140 * amt));
          const cx = (8 + r() * 8) * amt;
          offR.setAttribute('dx', String(cx));
          offGB.setAttribute('dx', String(-cx));
          view.style.filter = 'url(#dc-tear)';
          hud.style.filter = 'url(#dc-tear)';
        } else {
          view.style.filter = '';
          hud.style.filter = '';
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
          // hairline scan slivers
          tc.fillStyle = `rgba(255,255,255,${0.10 * amt})`;
          for (let i = 0; i < 10 * amt; i++) tc.fillRect(0, r() * 1080, 1920, 1 + r() * 2);
        }
      },
    };
  },
});
