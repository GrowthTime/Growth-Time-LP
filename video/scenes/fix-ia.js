/* ============================================================
   S6 · fix-ia · start 22.0 · dur 8.0 · pre 0.5 · z 20 — THE DROP
   Fix 01: one inbox for WhatsApp / Instagram / Messenger, API Oficial +
   Coexistência seeded, and an AI that answers at 23:47 in seconds and
   closes the order. Plants the "Vendas 1 · 4321" chip (paid off in S8).
   First visible frame (21.5): window small + dim behind the S5 gate dive.
   Last frame (30.0): full-frame #efeae2 dotted WhatsApp plate (→ S7).
   Everything that moves is a pure function of `local` (update); the tl
   only drives the HUD headline / pill / subline reveals.
   ============================================================ */
GTR.scene({
  id: 'fix-ia',
  build(root, ctx) {
    const { h, p, inv, clamp, lerp, noise } = GTR;
    const C = KIT.C;
    const I = (n, o = {}) => GTR.iconSVG(n, o);
    const vis = (el, a) => {
      el.style.opacity = a;
      el.style.visibility = a > 0.002 ? 'visible' : 'hidden';
    };
    // pop progress (may overshoot > 1 with back eases); 0 before `a`
    const pop = (t, a, d = 0.4, e = 'back.out(1.7)') => (t < a ? 0 : p(t, a, a + d, e));
    const mix = (c0, c1, k) => {
      const a = c0.match(/\w\w/g).map((x) => parseInt(x, 16));
      const b = c1.match(/\w\w/g).map((x) => parseInt(x, 16));
      return `rgb(${a.map((v, i) => Math.round(lerp(v, b[i], clamp(k)))).join(',')})`;
    };

    /* ---------------- geometry (world coords = screen coords at identity camera) ---------------- */
    const WIN = { x: 800, y: 150, w: 1000, h: 800 };
    const SIDE = 72, LIST = 340, CHAT = 588, BAR = 44, HEAD = 64, TOOL = 40;
    const LX = WIN.x + SIDE;                 // 872  list left
    const CY = WIN.y + BAR;                  // 194  content top
    const CHX = LX + LIST;                   // 1212 chat left
    const THY = CY + HEAD + TOOL;            // 298  thread top
    const THH = WIN.h - BAR - HEAD - TOOL;   // 652  thread height
    const PORTAL = { x: CHX + CHAT / 2, y: 392 }; // empty wallpaper between toolbar and first bubble
    const O = { x: 960, y: 540 };            // camera transform origin

    /* ================= WORLD (camera) ================= */
    const cam = KIT.camera(root, { perspective: 1600 });
    const world = cam.world;
    const halo = GTR.glow(world, { x: 1300, y: 560, r: 860, color: '21,219,168', a: 0.17 });
    const app = KIT.appWindow(world, { x: WIN.x, y: WIN.y, w: WIN.w, h: WIN.h, active: 'Mensagens' });
    app.el.style.boxShadow = '0 40px 120px rgba(0,0,0,.55), 0 0 0 1px rgba(255,255,255,.08), 0 0 80px rgba(21,219,168,.12)';

    // collapsed sidebar (real GTR collapsed state): icons only
    app.side.style.width = `${SIDE}px`;
    app.side.style.padding = '22px 12px';
    app.side.style.alignItems = 'stretch';
    const brand = app.side.firstChild;
    brand.style.padding = '2px 0 22px';
    brand.style.justifyContent = 'center';
    if (brand.children[1]) brand.children[1].style.display = 'none';
    for (const it of Object.values(app.nav)) {
      it.style.justifyContent = 'center';
      it.style.padding = '12px 0';
      it.style.position = 'relative';
      const sp = it.querySelector('span');
      if (sp) sp.style.display = 'none';
    }
    const navBadge = h('div', { style: {
      position: 'absolute', right: '2px', top: '3px', minWidth: '19px', height: '19px', padding: '0 5px', borderRadius: '999px',
      background: C.danger, color: '#fff', fontSize: '11px', fontWeight: 800, display: 'grid', placeItems: 'center',
      boxShadow: '0 0 0 2px #121212', fontVariantNumeric: 'tabular-nums',
    } }, app.nav['Mensagens']);

    // 45° glass sheen that sweeps the window on the drop (brand diagonal)
    const sheen = h('div', { style: { position: 'absolute', left: '0', top: '-300px', width: '260px', height: '1400px', zIndex: 20, pointerEvents: 'none',
      background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(21,219,168,.10) 30%, rgba(255,255,255,.38) 50%, rgba(21,219,168,.10) 70%, rgba(255,255,255,0))',
      mixBlendMode: 'screen' } }, app.el);

    /* ---------- conversation list ---------- */
    const list = h('div', { style: { position: 'absolute', left: '0', top: '0', width: `${LIST}px`, height: '100%', background: '#fff', borderRight: `1px solid ${C.border}` } }, app.content);
    const inst = h('div', { style: {
      position: 'absolute', left: '16px', right: '16px', top: '16px', height: '38px', borderRadius: '10px', background: C.bgAlt,
      border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: '8px', padding: '0 11px', fontSize: '13.5px',
      color: C.fg, whiteSpace: 'nowrap',
    } }, list);
    inst.innerHTML = `${I('smartphone', { size: 16, color: C.tealDark })}<span style="font-weight:700">Todas instâncias</span>`
      + `<span style="color:#a3a3a3">·</span><span style="display:inline-flex;align-items:center;gap:6px;color:${C.muted};font-weight:500">`
      + `<span style="width:7px;height:7px;border-radius:50%;background:#22c55e;box-shadow:0 0 0 3px rgba(34,197,94,.18)"></span>6 conectados</span>`
      + `<span style="margin-left:auto;display:flex">${I('chevron-down', { size: 16, color: '#a3a3a3' })}</span>`;
    const title = h('div', { style: { position: 'absolute', left: '16px', top: '66px', fontSize: '22px', fontWeight: 800, letterSpacing: '-0.01em', color: C.fg, lineHeight: '28px' } }, list);
    title.textContent = 'Conversas';
    // channel dock: 3 slots right-aligned on the title row
    const SLOT_Y = 80, SLOT_S = 24;
    const slotX = [252, 280, 308];
    const slotOutline = slotX.map((x) => h('div', { style: {
      position: 'absolute', left: `${x - SLOT_S / 2}px`, top: `${SLOT_Y - SLOT_S / 2}px`, width: `${SLOT_S}px`, height: `${SLOT_S}px`,
      borderRadius: `${SLOT_S * 0.3}px`, border: '1.5px dashed #d4d4d4',
    } }, list));
    // micro-pills (API Oficial / Coexistência) — set up S7
    const micro = h('div', { style: { position: 'absolute', left: '16px', top: '106px', display: 'flex', gap: '6px' } }, list);
    const microPill = (icon, text) => {
      const e = h('div', { style: {
        display: 'inline-flex', alignItems: 'center', gap: '5px', height: '24px', padding: '0 10px 0 8px', borderRadius: '999px',
        background: 'rgba(56,204,156,.1)', border: '1px solid rgba(56,204,156,.38)', color: '#1a9a78', fontSize: '11.5px', fontWeight: 700,
        whiteSpace: 'nowrap', transformOrigin: '0% 50%',
      } }, micro);
      e.innerHTML = I(icon, { size: 13, sw: 2.3 }) + `<span>${text}</span>`;
      return e;
    };
    const mpApi = microPill('badge-check', 'API Oficial');
    const mpCoex = microPill('arrow-right-left', 'Coexistência');
    const seg = h('div', { style: { position: 'absolute', left: '16px', right: '16px', top: '140px', height: '34px', borderRadius: '9px', background: '#f1f3f2', padding: '3px', display: 'flex', gap: '2px' } }, list);
    ['Todos', 'Não lidos', 'Leads', 'Clientes'].forEach((s, i) => {
      const e = h('div', { style: {
        flex: '1', display: 'grid', placeItems: 'center', borderRadius: '7px', fontSize: '12.5px', fontWeight: i === 0 ? 700 : 600,
        color: i === 0 ? C.fg : C.muted, background: i === 0 ? '#fff' : 'transparent', boxShadow: i === 0 ? '0 1px 3px rgba(0,0,0,.1)' : 'none', whiteSpace: 'nowrap',
      } }, seg);
      e.textContent = s;
    });
    const ROWS_Y = 186, ROW_H = 76, ROW_X = 28;
    const rowsBox = h('div', { style: { position: 'absolute', left: '0', right: '0', top: `${ROWS_Y}px`, bottom: '0', overflow: 'hidden', background: '#fff', borderTop: `1px solid ${C.border}` } }, list);

    const NEW = [
      { name: 'Patrícia Modas', ini: 'PM', bg: 'linear-gradient(135deg,#f472b6,#be185d)', ch: 'wa', msg: 'Oi! Vi o anúncio da coleção verão', timer: '13 min', unread: 3, badge: true, emoji: true, at: 1.60 },
      { name: 'lojinha.da.bia', ini: 'LB', bg: 'linear-gradient(135deg,#a78bfa,#6d28d9)', ch: 'ig', msg: 'Quanto fica a grade de 6?', timer: '47 min', unread: 2, at: 1.35 },
      { name: 'Revenda Bella', ini: 'RB', bg: 'linear-gradient(135deg,#f3b315,#a16207)', ch: 'fb', msg: 'Qual o mínimo do atacado?', timer: '2 h', unread: 1, at: 1.10 },
      { name: '(85) 9 ••••-3344', masked: true, ch: 'wa', msg: 'Oi, tem grade?', timer: '5 h', unread: 2, at: 0.85 },
      { name: '(21) 9 ••••-2208', masked: true, ch: 'wa', msg: 'Faz entrega em SP?', timer: '1 dia', unread: 4, at: 0.60 },
    ];
    const OLD = [
      { name: '(71) 9 ••••-1177', masked: true, ch: 'wa', msg: 'Você: Catálogo enviado!', when: 'ontem' },
      { name: '(11) 9 ••••-0932', masked: true, ch: 'wa', msg: 'Você: Temos sim, no preto.', when: 'ontem' },
      { name: '(81) 9 ••••-7765', masked: true, ch: 'wa', msg: 'Você: Link enviado.', when: 'ontem' },
    ];
    const flipFace = (parent, html, st) => h('div', { style: Object.assign({
      position: 'absolute', right: '0', top: '0', height: '22px', display: 'inline-flex', alignItems: 'center', gap: '4px',
      padding: '0 8px', borderRadius: '999px', fontSize: '12px', fontWeight: 700, whiteSpace: 'nowrap', backfaceVisibility: 'hidden',
      transformOrigin: '50% 50%',
    }, st) }, parent, html);
    const makeRow = (d, isNew) => {
      const wrap = h('div', { style: { position: 'absolute', left: '0', right: '0', top: '0', height: `${ROW_H}px`, overflow: 'hidden' } }, rowsBox);
      const inner = h('div', { style: { position: 'absolute', left: '0', right: '0', top: '0', height: `${ROW_H}px`, borderBottom: '1px solid #f0f0f0', background: '#fff' } }, wrap);
      const sel = h('div', { style: { position: 'absolute', inset: '0', background: '#effcf7', opacity: 0 } }, inner);
      const selBar = h('div', { style: { position: 'absolute', left: '0', top: '0', bottom: '0', width: '3px', background: C.teal, transform: 'scaleY(0)' } }, inner);
      const ring = h('div', { style: { position: 'absolute', left: '4px', right: '4px', top: '4px', bottom: '4px', borderRadius: '12px', border: `2px solid ${C.ouro}`, boxShadow: '0 0 18px rgba(243,179,21,.45), inset 0 0 14px rgba(243,179,21,.18)', opacity: 0 } }, inner);
      const av = h('div', { style: { position: 'absolute', left: '16px', top: '16px', width: '44px', height: '44px' } }, inner);
      const avc = KIT.avatar(av, { text: d.ini || '', size: 44, bg: d.masked ? '#eceff1' : d.bg });
      avc.style.fontFamily = 'var(--font-ui)';
      avc.style.fontSize = '17px';
      if (d.masked) avc.innerHTML = I('user', { size: 22, color: '#9ca3af' });
      const cb = KIT.channel(av, d.ch, 18);
      Object.assign(cb.style, { position: 'absolute', right: '-3px', bottom: '-3px', boxShadow: '0 0 0 2px #fff' });
      let emo = null;
      if (d.emoji) {
        emo = h('div', { style: { position: 'absolute', right: '-6px', top: '-6px', width: '22px', height: '22px', borderRadius: '50%', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,.18)', display: 'grid', placeItems: 'center' } }, av);
        emo.innerHTML = '<span class="emoji" style="font-size:12px;line-height:1;position:absolute">❄️</span><span class="emoji" style="font-size:12px;line-height:1;position:absolute;opacity:0">🔥</span>';
      }
      const nameLine = h('div', { style: { position: 'absolute', left: '72px', top: '15px', right: '44px', height: '22px', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' } }, inner);
      const nm = h('span', { style: { fontSize: '15px', fontWeight: 700, color: C.fg, letterSpacing: '-0.005em' } }, nameLine);
      nm.textContent = d.name;
      let bLead = null, bQual = null;
      if (d.badge) {
        const bw = h('span', { style: { position: 'relative', display: 'inline-block', height: '19px', width: '84px' } }, nameLine);
        bLead = h('span', { style: { position: 'absolute', left: '0', top: '0', height: '19px', display: 'inline-flex', alignItems: 'center', padding: '0 7px', borderRadius: '6px', background: '#eff6ff', color: '#2563eb', fontSize: '11px', fontWeight: 700, border: '1px solid #bfdbfe' } }, bw);
        bLead.textContent = 'Lead';
        bQual = h('span', { style: { position: 'absolute', left: '0', top: '0', height: '19px', display: 'inline-flex', alignItems: 'center', padding: '0 7px', borderRadius: '6px', background: C.teal, color: '#fff', fontSize: '11px', fontWeight: 800, opacity: 0, transformOrigin: '0% 50%' } }, bw);
        bQual.textContent = 'Qualificado';
      }
      const msgLine = h('div', { style: { position: 'absolute', left: '72px', top: '42px', right: '16px', height: '22px', display: 'flex', alignItems: 'center', gap: '8px' } }, inner);
      const msgBox = h('div', { style: { position: 'relative', flex: '1', minWidth: '0', height: '22px' } }, msgLine);
      const msg = h('div', { style: { position: 'absolute', left: '0', right: '0', top: '0', lineHeight: '22px', fontSize: '13.5px', color: C.muted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'flex', alignItems: 'center', gap: '4px' } }, msgBox);
      if (isNew) { msg.style.display = 'block'; msg.textContent = d.msg; }
      else msg.innerHTML = `${I('check-check', { size: 15, color: '#9ca3af' })}<span style="overflow:hidden;text-overflow:ellipsis">${d.msg}</span>`;
      let label = null;
      if (d.badge) {
        label = h('div', { style: { position: 'absolute', left: '72px', top: '72px', height: '22px', display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '0 8px', borderRadius: '6px', background: '#fef3c7', color: '#a16207', fontSize: '12px', fontWeight: 700, whiteSpace: 'nowrap', opacity: 0 } }, msgBox);
        label.innerHTML = I('trophy', { size: 13, sw: 2.3 }) + '<span>Pedido fechado pela IA · R$ 1.167</span>';
        inner.appendChild(label);
      }
      const row = { d, wrap, inner, sel, selBar, ring, emo, bLead, bQual, msg, label };
      if (isNew) {
        const flip = h('div', { style: { position: 'relative', flex: 'none', height: '22px', perspective: '300px' } }, msgLine);
        row.fRed = flipFace(flip, I('clock', { size: 12, sw: 2.4 }) + `<span>${d.timer}</span>`, { background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' });
        row.fOk = flipFace(flip, I('bot', { size: 13, sw: 2.3 }) + '<span>IA · agora</span>', { background: '#ddf7ee', color: '#11866a', border: '1px solid #a7e9d3' });
        row.flip = flip;
        row.unread = h('div', { style: { position: 'absolute', right: '16px', top: '16px', minWidth: '20px', height: '20px', padding: '0 6px', borderRadius: '999px', background: C.wa, color: '#fff', fontSize: '11px', fontWeight: 800, display: 'grid', placeItems: 'center' } }, inner);
        row.unread.textContent = d.unread;
      } else {
        const when = h('div', { style: { position: 'absolute', right: '16px', top: '17px', fontSize: '12px', color: '#a3a3a3', fontWeight: 500 } }, inner);
        when.textContent = d.when;
      }
      return row;
    };
    const rows = NEW.map((d) => makeRow(d, true));
    const oldRows = OLD.map((d) => makeRow(d, false));
    // size the flip boxes to their widest face (measured once; fonts are loaded)
    for (const r of rows) r.flip.style.width = `${Math.max(r.fRed.offsetWidth, r.fOk.offsetWidth)}px`;
    // Coexistência micro-pill: bounds in list coords (measured once) → pill-shaped pulse rings
    const coexL = 16 + mpApi.offsetWidth + 6, coexW = mpCoex.offsetWidth;
    const coexRings = [0, 0.14].map(() => h('div', { style: {
      position: 'absolute', left: `${coexL - 2}px`, top: '104px', width: `${coexW + 4}px`, height: '28px', borderRadius: '999px',
      border: `2px solid ${C.vibrant}`, boxShadow: '0 0 14px rgba(21,219,168,.7)', opacity: 0, pointerEvents: 'none', visibility: 'hidden',
    } }, list));

    /* ---------- chat column ---------- */
    const chat = h('div', { style: { position: 'absolute', left: `${LIST}px`, top: '0', width: `${CHAT}px`, height: '100%', background: C.bg } }, app.content);
    const head = h('div', { style: { position: 'absolute', left: '0', top: '0', right: '0', height: `${HEAD}px`, background: '#fff', borderBottom: `1px solid ${C.border}` } }, chat);
    const headIn = h('div', { style: { position: 'absolute', inset: '0', display: 'flex', alignItems: 'center', gap: '12px', padding: '0 18px' } }, head);
    const hav = h('div', { style: { position: 'relative', width: '40px', height: '40px', flex: 'none' } }, headIn);
    const havc = KIT.avatar(hav, { text: 'PM', size: 40, bg: 'linear-gradient(135deg,#f472b6,#be185d)' });
    havc.style.fontSize = '15px';
    const hcb = KIT.channel(hav, 'wa', 16);
    Object.assign(hcb.style, { position: 'absolute', right: '-3px', bottom: '-3px', boxShadow: '0 0 0 2px #fff' });
    const hTxt = h('div', { style: { display: 'flex', flexDirection: 'column', gap: '3px', lineHeight: 1.15 } }, headIn);
    h('div', { style: { fontSize: '16.5px', fontWeight: 700, color: C.fg } }, hTxt).textContent = 'Patrícia Modas';
    const hSub = h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: C.muted, fontWeight: 500 } }, hTxt);
    const instChip = h('span', { style: { display: 'inline-flex', alignItems: 'center', gap: '5px', height: '20px', padding: '0 8px', borderRadius: '6px', background: C.bgAlt, border: `1px solid ${C.border}`, color: '#404040', fontWeight: 600, whiteSpace: 'nowrap' } }, hSub);
    instChip.innerHTML = I('smartphone', { size: 12, color: C.tealDark, sw: 2.2 }) + '<span>Vendas 1 · </span>';
    const digits = h('span', { style: { position: 'relative', display: 'inline-block', fontVariantNumeric: 'tabular-nums' } }, instChip);
    digits.textContent = '4321';
    const plant = h('span', { style: { position: 'absolute', left: '0', right: '0', bottom: '-3px', height: '2px', borderRadius: '2px', background: C.vibrant, boxShadow: '0 0 6px rgba(21,219,168,.8)', transformOrigin: '0% 50%', transform: 'scaleX(0)' } }, digits);
    const online = h('span', { style: { display: 'inline-flex', alignItems: 'center', gap: '5px' } }, hSub);
    online.innerHTML = '<span style="width:7px;height:7px;border-radius:50%;background:#22c55e"></span>online';
    const hIcons = h('div', { style: { marginLeft: 'auto', display: 'flex', gap: '16px', color: '#a3a3a3' } }, headIn);
    hIcons.innerHTML = I('search', { size: 19 }) + I('ellipsis', { size: 19 });

    const tool = h('div', { style: { position: 'absolute', left: '0', top: `${HEAD}px`, right: '0', height: `${TOOL}px`, background: C.bgAlt, borderBottom: `1px solid ${C.border}` } }, chat);
    const toolIn = h('div', { style: { position: 'absolute', inset: '0', display: 'flex', alignItems: 'center', padding: '0 14px 0 16px' } }, tool);
    const watch = h('div', { style: { display: 'inline-flex', alignItems: 'center', gap: '7px', height: '26px', padding: '0 11px 0 9px', borderRadius: '999px', background: C.petroleo, color: C.vibrant, fontSize: '13.5px', fontWeight: 700, fontVariantNumeric: 'tabular-nums', transformOrigin: '0% 50%', boxShadow: '0 0 0 0 rgba(21,219,168,0)' } }, toolIn);
    watch.innerHTML = I('timer', { size: 15, sw: 2.3 });
    const watchTxt = h('span', { style: { minWidth: '42px' } }, watch);
    watchTxt.textContent = '0,0 s';
    const tog = h('div', { style: { marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#404040' } }, toolIn);
    const togIcon = h('span', { style: { display: 'flex' } }, tog, I('bot', { size: 17, sw: 2.2 }));
    h('span', {}, tog).textContent = 'IA · Atuar sozinha';
    const track = h('div', { style: { position: 'relative', width: '38px', height: '22px', borderRadius: '999px', background: '#d4d4d4' } }, tog);
    const knob = h('div', { style: { position: 'absolute', left: '3px', top: '3px', width: '16px', height: '16px', borderRadius: '50%', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,.25)' } }, track);

    const thread = h('div', { style: { position: 'absolute', left: '0', top: `${HEAD + TOOL}px`, right: '0', bottom: '0', overflow: 'hidden', background: C.bg } }, chat);
    // WhatsApp wallpaper: flat #efeae2 + its own dot layer (the dots fade before the dive lands so the
    // magnified pattern never double-exposes with the hand-off plate's fine 22 px dots)
    const waWall = h('div', { style: { position: 'absolute', inset: '0', background: C.waBg, visibility: 'hidden' } }, thread);
    const wall = h('div', { style: { position: 'absolute', inset: '0', backgroundImage: 'radial-gradient(rgba(0,0,0,.035) 1.2px, transparent 1.2px)', backgroundSize: '22px 22px' } }, waWall);
    const ripple = h('div', { style: { position: 'absolute', left: '0', top: '0', width: '200px', height: '200px', borderRadius: '50%', border: `3px solid ${C.vibrant}`, boxShadow: '0 0 24px rgba(21,219,168,.55), inset 0 0 24px rgba(21,219,168,.35)', visibility: 'hidden', pointerEvents: 'none' } }, thread);
    // empty state until a conversation is selected
    const empty = h('div', { style: { position: 'absolute', left: '0', right: '0', top: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', textAlign: 'center' } }, thread);
    empty.innerHTML = `<div style="width:76px;height:76px;border-radius:50%;background:#eef8f4;display:grid;place-items:center;color:${C.teal}">${I('messages-square', { size: 34, sw: 1.8 })}</div>`
      + `<div style="font-size:17px;font-weight:700;color:#404040">Selecione uma conversa</div>`
      + `<div style="font-size:13.5px;color:#a3a3a3;max-width:300px;line-height:1.45">WhatsApp, Instagram e Messenger<br>na mesma caixa de entrada</div>`;

    // top of the thread: date chip + system line (fill the wallpaper; cleared before the portal)
    const topBox = h('div', { style: { position: 'absolute', left: '0', right: '0', top: '22px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' } }, thread);
    const dateChip = h('div', { style: { height: '30px', padding: '0 16px', borderRadius: '9px', background: '#fff', boxShadow: '0 1px 1.5px rgba(0,0,0,.12)', display: 'grid', placeItems: 'center', fontSize: '14px', fontWeight: 600, color: '#54656f', letterSpacing: '0.02em' } }, topBox);
    dateChip.textContent = 'Hoje';
    const e2e = h('div', { style: { display: 'inline-flex', alignItems: 'center', gap: '8px', height: '32px', padding: '0 15px 0 13px', borderRadius: '9px', background: '#fdf4c5', color: '#5c5438', fontSize: '13.5px', fontWeight: 600, boxShadow: '0 1px 1.5px rgba(0,0,0,.1)', whiteSpace: 'nowrap' } }, topBox);
    e2e.innerHTML = I('lock', { size: 14, sw: 2.4, color: '#8a7a3a' }) + '<span>Conversa via API Oficial · Coexistência</span>';

    const PAD = 24, GAP = 14, BSZ = 20; // bubble text +12% (18 → 20)
    const item = (side) => h('div', { style: {
      position: 'absolute', left: '20px', right: '20px', bottom: `${PAD}px`, display: 'flex', flexDirection: 'column',
      alignItems: side === 'out' ? 'flex-end' : 'flex-start', gap: '6px', transformOrigin: side === 'out' ? '100% 100%' : '0% 100%',
    } }, thread);
    const itIn1 = item('in');
    KIT.bubble(itIn1, { side: 'in', size: BSZ, text: 'Oi! Vi o anúncio da coleção verão. Tem a grade do vestido midi?', time: '23:47', tag: { icon: 'megaphone', text: 'Veio do anúncio', color: '#2563eb' } });
    // system notice when the AI takes over (WhatsApp-style centred chip)
    const itSys = item('in');
    itSys.style.alignItems = 'center';
    itSys.style.transformOrigin = '50% 100%';
    const sysChip = h('div', { style: { display: 'inline-flex', alignItems: 'center', gap: '7px', height: '30px', padding: '0 14px', borderRadius: '10px', background: '#e3f7ef', border: '1px solid #b9ecd9', color: '#11866a', fontSize: '13px', fontWeight: 700, boxShadow: '0 1px 1.5px rgba(0,0,0,.08)', whiteSpace: 'nowrap' } }, itSys);
    sysChip.innerHTML = I('bot', { size: 15, sw: 2.3 }) + '<span>IA assumiu a conversa · fora do expediente</span>';
    const itTyp = item('out');
    const typLabel = h('div', { style: { display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: C.tealDark, paddingRight: '4px' } }, itTyp);
    typLabel.innerHTML = I('bot', { size: 15, sw: 2.3 }) + '<span>IA digitando…</span>';
    const typing = KIT.typing(itTyp, 'out');
    const itAi = item('out');
    itAi.style.paddingTop = '20px'; // room for the proof stamp on the bubble's top-left corner
    const aiB = KIT.bubble(itAi, { side: 'out', size: BSZ, html: 'Tem sim! Grade P ao GG, 6 peças, R$ 389 a grade. Monto com as 3 cores? <span class="emoji">😊</span>', time: '23:47', ticks: 'blue', tag: { icon: 'bot', text: 'IA', color: C.tealDark } });
    const stamp = h('div', { style: {
      position: 'absolute', left: '-16px', top: '-19px', display: 'inline-flex', alignItems: 'center', gap: '6px', height: '30px', padding: '0 12px 0 10px',
      borderRadius: '999px', background: C.vibrant, color: C.petroleo, fontSize: '15px', fontWeight: 800, whiteSpace: 'nowrap',
      boxShadow: '0 8px 22px rgba(21,219,168,.45), 0 0 0 2px #fff', transformOrigin: '20% 50%', zIndex: 3,
    } }, aiB);
    stamp.innerHTML = I('zap', { size: 15, sw: 2.5, color: C.petroleo }) + '<span>Respondido pela IA em 4s</span>';
    const itIn2 = item('in');
    KIT.bubble(itIn2, { side: 'in', size: BSZ, html: 'Fechei! Manda as 3 cores <span class="emoji">🙌</span>', time: '23:48' });
    // measure once (layout sizes are transform-independent)
    const hIn1 = itIn1.offsetHeight, hSys = itSys.offsetHeight, hTyp = itTyp.offsetHeight, hAi = itAi.offsetHeight, hIn2 = itIn2.offsetHeight;
    const aiW = aiB.offsetWidth, aiH = aiB.offsetHeight;
    // portal point: middle of the empty wallpaper between the toolbar and the top of the final stack
    const stackTop = WIN.y + WIN.h - (PAD + hIn2 + GAP + hAi + GAP + hSys + GAP + hIn1);
    PORTAL.y = Math.round((THY + stackTop) / 2);
    // AI bubble centre in world coords while it sits at the bottom (4.3–5.75)
    const AIC = { x: CHX + CHAT - 20 - aiW / 2, y: WIN.y + WIN.h - PAD - aiH / 2 };
    // wallpaper wipe origin = Coexistência pill centre, in thread-local coords
    const COEX_T = { x: coexL + coexW / 2 - LIST, y: 106 + 12 - (HEAD + TOOL) };
    const WIPE_R0 = Math.max(0, -COEX_T.x - 40);
    const WIPE_R1 = Math.hypot(CHAT - COEX_T.x, THH - COEX_T.y) + 80;
    // list-column centre: the S5 gate dive's vanishing point (960,540) lands on it during pre-roll
    const LISTC = { x: LX + LIST / 2, y: CY + (WIN.h - BAR) / 2 };
    console.warn('FIXIA-DBG', JSON.stringify({ hIn1, hSys, hTyp, hAi, hIn2, aiW, stackTop, PORTAL, topBox: topBox.offsetHeight, e2e: e2e.offsetWidth, label: rows[0].label.offsetWidth, COEX_T, WIPE_R0, WIPE_R1 }));

    /* ---------- flying channel badges (world layer, above the window) ---------- */
    const fly = h('div', { style: { position: 'absolute', left: '0', top: '0', width: '1920px', height: '1080px', pointerEvents: 'none' } }, world);
    const trailSvg = GTR.s('svg', { width: 1920, height: 1080, viewBox: '0 0 1920 1080', style: { position: 'absolute', left: '0', top: '0', overflow: 'visible' } }, fly);
    const defs = GTR.s('defs', {}, trailSvg);
    const FLY = [
      { kind: 'wa', col: '37,211,102', from: [-190, 780], ctrl: [360, 300], t0: 0.00, t1: 0.50, slot: 0, ease: 'power1.in' },
      { kind: 'ig', col: '221,42,123', from: [1060, -260], ctrl: [1000, 60], t0: 0.42, t1: 0.75, slot: 1, ease: 'power2.in' },
      { kind: 'fb', col: '0,122,255', from: [1500, 1340], ctrl: [1480, 520], t0: 0.62, t1: 1.00, slot: 2, ease: 'power2.in' },
    ].map((f, i) => {
      const to = [LX + slotX[f.slot], CY + SLOT_Y];
      const grad = GTR.s('linearGradient', { id: `fixia-tr${i}`, gradientUnits: 'userSpaceOnUse' }, defs);
      GTR.s('stop', { offset: '0%', 'stop-color': `rgb(${f.col})`, 'stop-opacity': 0 }, grad);
      GTR.s('stop', { offset: '70%', 'stop-color': `rgb(${f.col})`, 'stop-opacity': 0.35 }, grad);
      GTR.s('stop', { offset: '100%', 'stop-color': '#ffffff', 'stop-opacity': 0.85 }, grad);
      const trail = GTR.s('path', { fill: `url(#fixia-tr${i})`, stroke: 'none', style: { filter: `drop-shadow(0 0 10px rgba(${f.col},.8))` } }, trailSvg);
      const badge = KIT.channel(fly, f.kind, 96);
      Object.assign(badge.style, { position: 'absolute', left: '0', top: '0', transformOrigin: '50% 50%', boxShadow: `0 10px 30px rgba(0,0,0,.35), 0 0 30px rgba(${f.col},.55)` });
      const pulse = KIT.pulse(fly, { x: to[0], y: to[1], r: 64, color: C.vibrant, sw: 3 });
      return Object.assign(f, { to, grad, trail, badge, pulse });
    });
    const bez = (a, c, b, u) => [(1 - u) * (1 - u) * a[0] + 2 * (1 - u) * u * c[0] + u * u * b[0], (1 - u) * (1 - u) * a[1] + 2 * (1 - u) * u * c[1] + u * u * b[1]];
    const aiPulses = [0, 0.14].map(() => KIT.pulse(fly, { x: AIC.x, y: AIC.y, r: 240, color: C.vibrant, sw: 3 }));

    /* ================= HUD (outside the camera) ================= */
    const scrim = h('div', { style: { position: 'absolute', left: '-80px', top: '0', width: '1040px', height: '860px', background: 'radial-gradient(closest-side, rgba(0,21,22,.78), rgba(0,21,22,0))', pointerEvents: 'none' } }, root);

    // night badge: moon · 23:47 · Fora do expediente
    const night = h('div', { style: { position: 'absolute', left: '120px', top: '200px', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', gap: '18px' } }, root);
    const moon = h('div', { style: { width: '44px', height: '44px', display: 'grid', placeItems: 'center', color: '#e8eef2', filter: 'drop-shadow(0 0 12px rgba(200,230,255,.55))' } }, night, I('moon', { size: 32, sw: 2 }));
    const clock = h('div', { class: 'display', style: { fontSize: '56px', lineHeight: '56px', color: '#fff', display: 'flex', letterSpacing: '0.01em' } }, night);
    h('span', {}, clock).textContent = '23:4';
    const roll = h('span', { style: { display: 'inline-block', height: '56px', overflow: 'hidden', position: 'relative' } }, clock);
    const rollIn = h('span', { style: { display: 'flex', flexDirection: 'column' } }, roll);
    h('span', { style: { height: '56px' } }, rollIn).textContent = '7';
    h('span', { style: { height: '56px' } }, rollIn).textContent = '8';
    const offPill = h('div', { style: { display: 'inline-flex', alignItems: 'center', gap: '10px', height: '38px', padding: '0 16px 0 14px', borderRadius: '999px', background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.14)', color: 'rgba(255,255,255,.92)', fontSize: '16px', fontWeight: 600, whiteSpace: 'nowrap' } }, night);
    const offDot = h('span', { style: { width: '9px', height: '9px', borderRadius: '50%', background: C.warning, boxShadow: '0 0 10px rgba(249,115,22,.9)' } }, offPill);
    h('span', {}, offPill).textContent = 'Fora do expediente';

    const hA = KIT.headline(root, '3 canais.\n*1 caixa.*', { x: 120, y: 470, w: 680, align: 'left', size: 100, glow: true });
    const hB = KIT.headline(root, 'IA responde\nem *segundos*.', { x: 120, y: 470, w: 680, align: 'left', size: 88, glow: true });
    const pillRow = h('div', { style: { position: 'absolute', left: '120px', top: '618px', display: 'flex', gap: '12px' } }, root);
    const pills = [['message-circle', 'WhatsApp', '#25d366'], ['instagram', 'Instagram', '#f06292'], ['facebook', 'Messenger', '#3b8bff']].map(([ic, tx, col]) => {
      const e = h('div', { style: { display: 'inline-flex', alignItems: 'center', gap: '10px', height: '48px', padding: '0 20px 0 16px', borderRadius: '999px', background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.16)', color: '#fff', fontSize: '19px', fontWeight: 700, whiteSpace: 'nowrap', boxShadow: '0 10px 30px rgba(0,0,0,.3)' } }, pillRow);
      e.innerHTML = I(ic, { size: 21, color: col, sw: 2.2 }) + `<span>${tx}</span>`;
      return e;
    });
    const sub = h('div', { class: 'body', style: { position: 'absolute', left: '120px', top: '612px', fontSize: '36px', fontWeight: 600, color: 'rgba(255,255,255,.82)', whiteSpace: 'nowrap' } }, root);
    sub.textContent = 'Até com a loja fechada.';
    const subUnits = GTR.split(sub, 'words');
    // the actual sale, echoed on the HUD (6.3)
    const salePill = h('div', { style: {
      position: 'absolute', left: '120px', top: '690px', display: 'inline-flex', alignItems: 'center', gap: '10px', height: '46px', padding: '0 20px 0 15px',
      borderRadius: '999px', background: 'rgba(21,219,168,.13)', border: '1px solid rgba(21,219,168,.5)', color: C.vibrant, fontFamily: 'var(--font-ui)',
      fontSize: '19px', fontWeight: 700, whiteSpace: 'nowrap', transformOrigin: '0% 50%', visibility: 'hidden',
    } }, root);
    salePill.innerHTML = I('trophy', { size: 20, sw: 2.2 }) + '<span>Pedido fechado · <span style="color:#fff;font-weight:800;font-variant-numeric:tabular-nums">R$ 1.167</span></span>';

    // diagnostic chip (own wrapper so the portal can fade it without touching the stamp)
    const chipWrap = h('div', { style: { position: 'absolute', inset: '0', pointerEvents: 'none' } }, root);
    const chip = KIT.diagChip(chipWrap, { n: '01', err: 'SEM RESPOSTA', ok: 'RESPONDIDO', x: 120, y: 96 });

    // hand-off plate (identical to S7's first frame)
    const plate = h('div', { style: { position: 'absolute', inset: '0', zIndex: 200, backgroundColor: '#efeae2', backgroundImage: 'radial-gradient(rgba(0,0,0,.035) 1.2px, transparent 1.2px)', backgroundSize: '22px 22px', backgroundPosition: '0 0', opacity: 0 } }, root);

    /* ================= TIMELINE (HUD text only) ================= */
    const tl = ctx.tl();
    KIT.revealWords(tl, hA.units, 1.0);
    tl.fromTo(pills, { y: 26, opacity: 0, scale: 0.9 }, { y: 0, opacity: 1, scale: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(1.6)' }, 1.75);
    KIT.hideUnits(tl, hA.units, 3.75);
    tl.to(pills, { y: -24, opacity: 0, duration: 0.35, stagger: 0.04, ease: 'power2.in' }, 3.75);
    KIT.revealWords(tl, hB.units, 4.5);
    KIT.revealWords(tl, subUnits, 5.25, { y: 30, blur: 8, dur: 0.6, stagger: 0.05 });
    KIT.hideUnits(tl, hB.units, 7.0, { dur: 0.3 });
    KIT.hideUnits(tl, subUnits, 7.0, { dur: 0.3, stagger: 0.02 });
    tl.set({}, {}, 8);

    /* ================= SFX ================= */
    ctx.cue('tick', 0.25, { db: -6 });
    [0.5, 0.75, 1.0].forEach((t, i) => ctx.cue('swoosh', t, { pan: [-0.5, 0, 0.5][i] }));
    [0.6, 0.85, 1.1, 1.35, 1.6].forEach((t) => ctx.cue('notify', t, { db: -8 }));
    ctx.cue('pop', 2.0, { db: -8 });
    ctx.cue('notify', 2.5);
    ctx.cue('blip', 2.75, { freq: 1800, db: -6 });
    ctx.cue('pop', 3.0);
    ctx.cue('type', 3.0, { dur: 1.2, rate: 10, db: -12 });
    ctx.cue('ping', 4.3, { freq: 1760 });
    ctx.cue('blip', 4.3, { freq: 2000 });
    ctx.cue('shimmer', 4.45);
    ctx.cue('notify', 5.75, { db: -6 });
    [6.0, 6.125, 6.25, 6.375, 6.5].forEach((t, i) => ctx.cue('pop', t, { db: -6, pan: -0.4 + i * 0.2 }));
    ctx.cue('shimmer', 6.25, { db: -6 });
    ctx.cue('blip', 6.95, { freq: 1500, db: -10 });
    ctx.cue('whoosh', 7.1, { dur: 0.9, up: true });

    /* ================= per-frame ================= */
    const RES0 = 6.0, RES_STEP = 0.125;
    // world point → offset from the transform origin after scale/rotY/rotX (CSS order), before translate
    const D2R = Math.PI / 180;
    const rot = (P, s, rx, ry) => {
      const vx = (P.x - O.x) * s, vy = (P.y - O.y) * s;
      const x1 = vx * Math.cos(ry * D2R), z1 = -vx * Math.sin(ry * D2R);
      return { x: x1, y: vy * Math.cos(rx * D2R) - z1 * Math.sin(rx * D2R) };
    };
    const PRE0 = rot(LISTC, 0.86, 14, -12);
    const camAt = (t) => {
      let s, rx, ry, op = 1, aim;
      if (t < 0) {
        const k = inv(t, -0.5, 0);
        s = lerp(0.62, 0.86, k); rx = lerp(20, 14, k); ry = lerp(-18, -12, k); op = lerp(0.5, 1, p(t, -0.5, 0, 'power1.in'));
        aim = rot(LISTC, s, rx, ry);           // list column centred on the dive's vanishing point
      } else if (t < 1.2) {
        const k = p(t, 0, 1.2, 'power3.out');
        s = lerp(0.86, 1, p(t, 0, 1.2, 'back.out(1.7)')); // .86 → ~1.015 → 1
        rx = lerp(14, 4, k); ry = lerp(-12, -6, k);
        aim = { x: PRE0.x * (1 - k), y: PRE0.y * (1 - k) }; // glide to the final x 800 layout
      } else {
        const k = p(t, 1.2, 7.0, 'sine.inOut');
        s = lerp(1, 1.04, k); rx = 4; ry = lerp(-6, -3, k);
      }
      let x = aim ? -aim.x : 0, y = aim ? -aim.y : 0;
      // slow float so no frame is ever dead
      y += noise(3.3, t * 0.35) * 5;
      x += noise(9.1, t * 0.3) * 4;
      if (t >= 7.0) {
        const r = 1 - p(t, 7.0, 7.6, 'power2.inOut');
        rx *= r; ry *= r;
        // exponential dive (log-space) so the push feels like a constant-speed plunge that keeps accelerating
        const s0 = 1.04;
        const u = inv(t, 7.2, 8.0);
        s = s0 * Math.pow(9 / s0, Math.pow(u, 1.5));
        // keep the portal point W fixed on its 7.0 screen position, then drift it to frame centre
        const w0 = { x: O.x + s0 * (PORTAL.x - O.x) + x, y: O.y + s0 * (PORTAL.y - O.y) + y };
        const m = p(t, 7.2, 7.9, 'power2.in');
        const ws = { x: lerp(w0.x, O.x, m), y: lerp(w0.y, O.y, m) };
        x = ws.x - O.x - s * (PORTAL.x - O.x);
        y = ws.y - O.y - s * (PORTAL.y - O.y);
      }
      return { x, y, s, rx, ry, op };
    };

    return {
      tl,
      update(local) {
        const t = local;

        /* camera */
        const c = camAt(t);
        cam.set({ x: c.x, y: c.y, rx: c.rx, ry: c.ry, s: c.s });
        cam.view.style.opacity = c.op;
        halo.style.opacity = 0.7 + 0.3 * Math.sin(t * 1.3);
        const sx = p(t, 0.05, 0.85, 'power2.inOut');
        sheen.style.transform = `translateX(${lerp(-420, 1240, sx)}px) rotate(45deg)`;
        sheen.style.visibility = sx > 0 && sx < 1 ? 'visible' : 'hidden';

        /* flying channel badges */
        FLY.forEach((f) => {
          const u = inv(t, f.t0, f.t1);
          const flying = t >= f.t0 - 0.001;
          if (!flying) { f.badge.style.visibility = 'hidden'; f.trail.style.visibility = 'hidden'; }
          else {
            const e = GTR.E(f.ease)(u);
            const [bx, by] = bez(f.from, f.ctrl, f.to, e);
            let size = lerp(96, SLOT_S, GTR.E('power1.in')(u));
            if (t > f.t1) size = SLOT_S * (1 + 0.32 * Math.sin(Math.PI * inv(t, f.t1, f.t1 + 0.28)) * (1 - inv(t, f.t1, f.t1 + 0.28)));
            f.badge.style.visibility = 'visible';
            f.badge.style.transform = `translate(${bx - 48}px, ${by - 48}px) scale(${size / 96})`;
            f.badge.style.boxShadow = t > f.t1 ? '0 0 0 2px #fff, 0 2px 6px rgba(0,0,0,.2)' : `0 10px 30px rgba(0,0,0,.35), 0 0 30px rgba(${f.col},.55)`;
            // streak: bezier sampled back in time
            const ta = Math.max(f.t0, t - 0.1);
            if (t < f.t1 + 0.1 && t > f.t0) {
              const pts = [];
              const N = 12;
              for (let k = 0; k <= N; k++) {
                const tt = lerp(ta, Math.min(t, f.t1), k / N);
                pts.push(bez(f.from, f.ctrl, f.to, GTR.E(f.ease)(inv(tt, f.t0, f.t1))));
              }
              // tapered ribbon: 0 at the tail → ~40% of the badge at the head
              const wHead = Math.max(4, size * 0.4);
              const L = [], R = [];
              for (let k = 0; k <= N; k++) {
                const a0 = pts[Math.max(0, k - 1)], a1 = pts[Math.min(N, k + 1)];
                let dx = a1[0] - a0[0], dy = a1[1] - a0[1];
                const len = Math.hypot(dx, dy) || 1;
                dx /= len; dy /= len;
                const w = wHead * Math.pow(k / N, 1.3) / 2;
                L.push(`${(pts[k][0] - dy * w).toFixed(1)},${(pts[k][1] + dx * w).toFixed(1)}`);
                R.push(`${(pts[k][0] + dy * w).toFixed(1)},${(pts[k][1] - dx * w).toFixed(1)}`);
              }
              f.trail.setAttribute('d', `M${L.join(' L')} L${R.reverse().join(' L')} Z`);
              const a = pts[0], b = pts[pts.length - 1];
              f.grad.setAttribute('x1', a[0]); f.grad.setAttribute('y1', a[1]);
              f.grad.setAttribute('x2', b[0]); f.grad.setAttribute('y2', b[1]);
              f.trail.style.visibility = 'visible';
              f.trail.style.opacity = 1 - inv(t, f.t1, f.t1 + 0.1);
            } else f.trail.style.visibility = 'hidden';
          }
          f.pulse.set(inv(t, f.t1, f.t1 + 0.5));
          vis(slotOutline[f.slot], 1 - inv(t, f.t1 - 0.05, f.t1));
        });

        /* rows: drop in at the top, push the rest down */
        let yAcc = 0;
        const g = rows.map((r) => (t < r.d.at ? 0 : p(t, r.d.at, r.d.at + 0.42, 'back.out(1.5)')));
        const grow = ROW_X * p(t, 6.25, 6.6, 'power3.inOut');
        rows.forEach((r, k) => {
          const gk = g[k];
          const hk = ROW_H + (k === 0 ? grow : 0);
          r.wrap.style.top = `${yAcc}px`;
          r.wrap.style.height = `${hk * clamp(gk)}px`;
          if (k === 0) r.inner.style.height = `${hk}px`;
          r.wrap.style.visibility = gk > 0.001 ? 'visible' : 'hidden';
          r.inner.style.transform = `translateY(${-0.55 * hk * (1 - clamp(gk))}px)`;
          r.inner.style.opacity = clamp(gk * 1.6);
          yAcc += hk * gk;
          // resolve on 16ths (top → bottom)
          const rt = RES0 + k * RES_STEP;
          const fp = inv(t, rt, rt + 0.3);
          const a = GTR.E('power2.in')(inv(fp, 0, 0.45));
          const b = GTR.E('back.out(2)')(inv(fp, 0.45, 1));
          r.fRed.style.transform = `rotateX(${-90 * a}deg)`;
          r.fRed.style.visibility = fp >= 0.45 ? 'hidden' : 'visible';
          r.fOk.style.transform = `rotateX(${90 * (1 - b)}deg)`;
          r.fOk.style.visibility = fp > 0.45 ? 'visible' : 'hidden';
          const uAt = k === 0 ? 2.3 : rt;
          const uq = t < uAt ? 1 : 1 - p(t, uAt, uAt + 0.22, 'back.in(2)');
          r.unread.style.transform = `scale(${Math.max(0, uq)})`;
          r.unread.style.visibility = uq > 0.01 ? 'visible' : 'hidden';
        });
        oldRows.forEach((r, m) => {
          r.wrap.style.top = `${yAcc + ROW_H * m}px`;
          r.inner.style.opacity = 0.9;
        });
        // row 1 (Patrícia): selection, qualification, gold ring
        const r1 = rows[0];
        const selP = p(t, 2.25, 2.5, 'power3.out');
        r1.sel.style.opacity = selP;
        r1.selBar.style.transform = `scaleY(${selP})`;
        const q = p(t, RES0, RES0 + 0.3, 'back.out(2)');
        r1.bLead.style.opacity = 1 - inv(t, RES0, RES0 + 0.12);
        r1.bQual.style.opacity = clamp(q * 2);
        r1.bQual.style.transform = `scale(${t < RES0 ? 0.6 : lerp(0.6, 1, q)})`;
        const fire = inv(t, RES0, RES0 + 0.08);
        r1.emo.children[0].style.opacity = 1 - fire;
        r1.emo.children[1].style.opacity = fire;
        r1.emo.style.transform = `scale(${1 + 0.45 * Math.sin(Math.PI * inv(t, RES0, RES0 + 0.3))})`;
        const gold = p(t, 6.25, 6.55, 'power3.out');
        r1.ring.style.opacity = gold * (0.85 + 0.15 * Math.sin(t * 6));
        r1.ring.style.transform = `scale(${lerp(1.06, 1, gold)})`;
        const newMsg = t >= 5.85 ? 1 : 0;
        if (r1.msgState !== newMsg) {
          r1.msgState = newMsg;
          r1.msg.innerHTML = newMsg ? 'Fechei! Manda as 3 cores <span class="emoji">🙌</span>' : '';
          if (!newMsg) r1.msg.textContent = r1.d.msg;
        }
        r1.msg.style.color = newMsg ? mix('171717', '737373', inv(t, 5.85, 6.3)) : C.muted;
        r1.msg.style.fontWeight = newMsg && t < 6.3 ? 600 : 400;
        const lp = t < 6.3 ? 0 : p(t, 6.3, 6.65, 'back.out(1.8)');
        r1.label.style.opacity = clamp(lp * 2);
        r1.label.style.transform = `translateX(${(1 - clamp(lp)) * -10}px) scale(${lerp(0.8, 1, lp)})`;

        // sidebar unread counter: +1 per arrival, −1 when row 1 is opened (2.3), then −1 per resolve
        const readAt = (k) => (k === 0 ? 2.3 : RES0 + k * RES_STEP) + 0.1;
        const arrived = rows.filter((r) => t >= r.d.at + 0.05).length;
        const solved = rows.filter((r, k) => t >= readAt(k)).length;
        const nUn = arrived - solved;
        navBadge.textContent = nUn;
        const nb = nUn > 0 ? 1 : 0;
        navBadge.style.visibility = nb ? 'visible' : 'hidden';
        const evts = rows.map((r) => r.d.at + 0.05).concat(rows.map((r, k) => readAt(k)));
        const lastEv = evts.reduce((m, e) => (t >= e ? Math.max(m, e) : m), -9);
        navBadge.style.transform = `scale(${1 + 0.35 * Math.max(0, 1 - (t - lastEv) / 0.2)})`;

        /* list header micro-pills (2.0) */
        [mpApi, mpCoex].forEach((e, i) => {
          const k = pop(t, 2.0 + i * 0.08, 0.4, 'back.out(2)');
          vis(e, clamp(k * 2));
          const bump = i === 1 ? 1 + 0.14 * Math.sin(Math.PI * inv(t, 6.95, 7.3)) : 1;
          e.style.transform = `scale(${lerp(0.5, 1, k) * bump})`;
        });
        // 6.95: Coexistência pulses — the wallpaper wipe starts from it
        mpCoex.style.boxShadow = `0 0 ${18 * Math.sin(Math.PI * inv(t, 6.95, 7.45))}px rgba(21,219,168,.8)`;
        coexRings.forEach((rg, i) => {
          const e = GTR.E('power2.out')(inv(t, 6.95 + i * 0.14, 6.95 + i * 0.14 + 0.6));
          const on = e > 0 && e < 1;
          rg.style.visibility = on ? 'visible' : 'hidden';
          rg.style.opacity = on ? (1 - e) * 0.95 : 0;
          rg.style.transform = `scale(${1 + 0.35 * e}, ${1 + 1.3 * e})`;
        });

        /* chat: empty state → Patrícia */
        const chatIn = p(t, 2.25, 2.6, 'power3.out');
        vis(empty, 1 - p(t, 2.25, 2.4, 'power2.in'));
        vis(headIn, chatIn);
        headIn.style.transform = `translateY(${(1 - chatIn) * 10}px)`;
        vis(toolIn, p(t, 2.3, 2.6, 'power3.out'));
        // date chip + system line (2.35 / 2.45), cleared before the portal (6.9–7.15)
        const topOut = 1 - p(t, 6.9, 7.15, 'power2.in');
        [dateChip, e2e].forEach((e, i) => {
          const k = pop(t, 2.35 + i * 0.1, 0.4, 'back.out(1.6)');
          vis(e, clamp(k * 2) * topOut);
          e.style.transform = `translateY(${(1 - clamp(k)) * 8 - (1 - topOut) * 10}px) scale(${lerp(0.7, 1, k)})`;
        });
        plant.style.transform = `scaleX(${p(t, 2.75, 3.0, 'power2.out')})`;
        digits.style.color = t >= 2.75 ? mix('404040', '0f8f6f', inv(t, 2.75, 3.0)) : '#404040';

        // toggle ON at 3.0, stopwatch 3.0–4.3
        const on = p(t, 3.0, 3.2, 'power2.inOut');
        knob.style.transform = `translateX(${16 * on}px)`;
        track.style.background = mix('d4d4d4', '38cc9c', on);
        togIcon.style.color = on > 0.5 ? C.tealDark : '#404040';
        const wp = pop(t, 3.0, 0.35, 'back.out(2)');
        vis(watch, clamp(wp * 2));
        watch.style.transform = `scale(${lerp(0.6, 1, wp)})`;
        const secs = GTR.map(t, 3.0, 4.3, 0, 4, 'none');
        watchTxt.textContent = GTR.fmt.dec(t < 3.0 ? 0 : secs, 1) + ' s';
        const wg = Math.sin(Math.PI * inv(t, 4.3, 4.9));
        watch.style.boxShadow = `0 0 0 ${3 * wg}px rgba(21,219,168,.35), 0 0 ${24 * wg}px rgba(21,219,168,${0.7 * wg})`;

        /* thread: bubbles stack from the bottom */
        const gIn1 = pop(t, 2.5, 0.45, 'back.out(1.6)');
        const gTypIn = p(t, 3.0, 3.3, 'power3.out');
        const gTypOut = p(t, 4.3, 4.48, 'power2.inOut');
        const gTyp = t < 3.0 ? 0 : gTypIn * (1 - gTypOut);
        const gAi = pop(t, 4.3, 0.45, 'back.out(1.5)');
        const gSys = pop(t, 3.05, 0.4, 'back.out(1.6)');
        const gIn2 = pop(t, 5.75, 0.45, 'back.out(1.6)');
        const lift = (hh, gg) => (hh + GAP) * clamp(gg);
        itIn2.style.bottom = `${PAD}px`;
        itAi.style.bottom = `${PAD + lift(hIn2, gIn2)}px`;
        itTyp.style.bottom = `${PAD}px`;
        const bSys = PAD + lift(hTyp, gTyp) + lift(hAi, gAi) + lift(hIn2, gIn2);
        itSys.style.bottom = `${bSys}px`;
        itIn1.style.bottom = `${bSys + lift(hSys, gSys)}px`;
        const bub = (el, gg) => {
          vis(el, clamp(gg * 2.2));
          el.style.transform = `scale(${lerp(0.55, 1, gg)})`;
        };
        bub(itIn1, gIn1);
        bub(itAi, gAi);
        bub(itSys, gSys);
        bub(itIn2, gIn2);
        vis(itTyp, clamp(gTyp * 1.5));
        itTyp.style.transform = `scale(${lerp(0.7, 1, gTyp)})`;
        typing.update(t);
        // proof stamp + pulses
        const sp = pop(t, 4.45, 0.4, 'back.out(1.6)');
        vis(stamp, clamp(sp * 3));
        stamp.style.transform = `scale(${t < 4.45 ? 1.3 : lerp(1.3, 1, sp)}) rotate(${lerp(-4, 0, clamp(sp))}deg)`;
        aiPulses.forEach((pl, i) => pl.set(inv(t, 4.3 + i * 0.14, 4.3 + i * 0.14 + 0.7)));

        /* portal: wallpaper becomes WhatsApp, spreading out from the Coexistência pill (7.0–7.4) */
        const wp2 = p(t, 7.0, 7.4, 'power2.inOut');
        const R = lerp(WIPE_R0, WIPE_R1, wp2);
        waWall.style.visibility = wp2 > 0 ? 'visible' : 'hidden';
        const mask = wp2 >= 1 ? 'none' : `radial-gradient(circle at ${COEX_T.x}px ${COEX_T.y}px, #000 ${Math.max(0, R - 70)}px, transparent ${R}px)`;
        waWall.style.maskImage = mask;
        waWall.style.webkitMaskImage = mask;
        const rr = R - 36;
        const ron = wp2 > 0 && wp2 < 1;
        ripple.style.visibility = ron ? 'visible' : 'hidden';
        if (ron) {
          ripple.style.left = `${COEX_T.x - rr}px`;
          ripple.style.top = `${COEX_T.y - rr}px`;
          ripple.style.width = ripple.style.height = `${2 * rr}px`;
          ripple.style.opacity = 0.85 * (1 - GTR.E('power2.in')(wp2));
        }
        // the dive lands on flat #efeae2: dots out 7.55–7.75 (camera ≈ ×2 → ×3.5)
        wall.style.opacity = 1 - p(t, 7.55, 7.75, 'power1.inOut');

        /* HUD */
        const hudOut = 1 - p(t, 7.0, 7.3, 'power2.in');
        scrim.style.opacity = p(t, 0.6, 1.4, 'power2.out') * hudOut;
        const sk = pop(t, 6.3, 0.45, 'back.out(1.7)');
        vis(salePill, clamp(sk * 2) * hudOut);
        salePill.style.transform = `translate(${(1 - hudOut) * -30}px, ${(1 - clamp(sk)) * 14}px) scale(${lerp(0.75, 1, sk)})`;
        const sg = Math.sin(Math.PI * inv(t, 6.3, 7.0));
        salePill.style.boxShadow = `0 10px 30px rgba(0,0,0,.3), 0 0 ${10 + 22 * sg}px rgba(21,219,168,${0.15 + 0.3 * sg})`;
        const nIn = p(t, 2.5, 3.0, 'power3.out');
        vis(night, nIn * hudOut);
        night.style.transform = `translateY(-50%) translateX(${(1 - nIn) * -40 + (1 - hudOut) * -30}px)`;
        moon.style.transform = `rotate(${lerp(-60, 0, nIn) + noise(1.7, t * 0.4) * 6}deg)`;
        const rk = p(t, 5.75, 6.05, 'back.out(1.4)');
        rollIn.style.transform = `translateY(${-56 * rk}px)`;
        offDot.style.opacity = 0.55 + 0.45 * (0.5 + 0.5 * Math.cos(t * Math.PI * 2));

        /* chip: red at 0.25, flips on the proof frame (4.3), fades 7.5–7.8 */
        chip.set(t, inv(t, 0.25, 0.43), inv(t, 4.3, 4.8));
        chipWrap.style.opacity = 1 - p(t, 7.1, 7.4, 'power2.in');

        /* hand-off plate */
        const pl = p(t, 7.72, 7.96, 'power1.inOut');
        plate.style.opacity = pl;
        plate.style.display = pl > 0 ? 'block' : 'none';
      },
    };
  },
});
