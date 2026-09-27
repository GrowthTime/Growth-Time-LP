/* ============================================================
   GTR motion — visual kit (window.KIT)
   Shared, on-brand building blocks so every scene looks like one film.
   Components return plain DOM + small setter functions. They never
   animate on their own: scenes drive them from tl (GSAP) or update(t).
   ============================================================ */
(function () {
  const { h, s, clamp, lerp, p, map, noise, rng, fmt } = GTR;
  const KIT = (window.KIT = {});

  KIT.C = {
    teal: '#38cc9c', vibrant: '#15dba8', logo: '#00cf9a', mark: '#33cc99', tealDark: '#27ae8f', action: '#2bb673',
    petroleo: '#0b2b29', deep: '#001516', ink: '#121212', gray: '#9ca3af',
    bg: '#fafafa', bgAlt: '#f4f6f5', fg: '#171717', muted: '#737373', border: '#e5e5e5',
    danger: '#ef4444', warning: '#f97316',
    bronze: '#bd6b2f', prata: '#a3adba', ouro: '#f3b315',
    wa: '#25d366', waDark: '#128c7e', waOut: '#d9fdd3', waBg: '#efeae2', tick: '#53bdeb',
    ig: 'linear-gradient(45deg,#f58529,#dd2a7b 50%,#8134af)', meta: '#0866ff',
    cyan: '#06b6d4', emerald: '#10b981', amber: '#f59e0b', purple: '#a855f7',
  };
  const C = KIT.C;

  /* ------------------------------------------------------------------
     BACKGROUNDS
     ------------------------------------------------------------------ */
  // Deep petróleo stage with drifting aurora blobs + optional grid/particles.
  // opts: {aurora:true, grid:false, particles:0, hue:'teal', vignette:true, tint:'#001516'}
  KIT.bg = (root, opts = {}) => {
    const o = Object.assign({ aurora: true, grid: false, particles: 0, vignette: true, base: 'deep', seed: 'bg' }, opts);
    const wrap = h('div', { class: 'kit-bg', style: { position: 'absolute', inset: '0', overflow: 'hidden' } }, root);
    wrap.style.background = o.base === 'light'
      ? 'radial-gradient(120% 70% at 50% 0%, #e7f5ef, #fafafa 60%)'
      : 'radial-gradient(130% 90% at 50% 35%, #0b2b29 0%, #041c1c 45%, #001516 75%, #000c0d 100%)';
    const blobs = [];
    if (o.aurora) {
      const cols = o.base === 'light' ? ['21,219,168', '56,204,156', '6,103,103'] : ['21,219,168', '56,204,156', '6,103,103'];
      const cfg = [
        { x: 520, y: 330, r: 620, a: o.base === 'light' ? 0.18 : 0.22 },
        { x: 1440, y: 700, r: 700, a: o.base === 'light' ? 0.14 : 0.18 },
        { x: 1100, y: 180, r: 520, a: o.base === 'light' ? 0.12 : 0.16 },
      ];
      cfg.forEach((c, i) => {
        const b = GTR.glow(wrap, { x: c.x, y: c.y, r: c.r, color: cols[i], a: c.a });
        blobs.push({ el: b, ...c, i });
      });
    }
    let grid = null;
    if (o.grid) grid = KIT.gridFloor(wrap, typeof o.grid === 'object' ? o.grid : {});
    let parts = null;
    if (o.particles) {
      const { canvas, ctx } = GTR.canvas(wrap);
      parts = { canvas, ctx, n: o.particles, r: rng(o.seed) };
      parts.list = Array.from({ length: o.particles }, () => ({
        x: parts.r() * 1920, y: parts.r() * 1080, z: 0.3 + parts.r() * 0.7, s: parts.r(), ph: parts.r() * 10,
      }));
    }
    if (o.vignette) {
      h('div', { style: { position: 'absolute', inset: '0', pointerEvents: 'none',
        background: 'radial-gradient(120% 100% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)' } }, wrap);
    }
    return {
      el: wrap,
      grid,
      update(t, speed = 1) {
        for (const b of blobs) {
          const dx = noise(b.i * 3.1, t * 0.08 * speed) * 160;
          const dy = noise(b.i * 7.7 + 11, t * 0.08 * speed) * 110;
          const sc = 1 + noise(b.i * 1.3 + 5, t * 0.1 * speed) * 0.12;
          b.el.style.transform = `translate(${dx}px,${dy}px) scale(${sc})`;
        }
        if (grid) grid.update(t * speed);
        if (parts) KIT.drawParticles(parts, t * speed);
      },
    };
  };

  // Synthwave-ish perspective grid floor (pure CSS 3D) — scroll with update(t)
  KIT.gridFloor = (parent, opts = {}) => {
    const o = Object.assign({ color: 'rgba(21,219,168,0.22)', size: 80, top: 560, speed: 60, fade: true }, opts);
    const holder = h('div', { style: { position: 'absolute', left: '0', right: '0', top: `${o.top}px`, bottom: '0', perspective: '700px', perspectiveOrigin: '50% 0%', overflow: 'hidden' } }, parent);
    const plane = h('div', { style: {
      position: 'absolute', left: '-100%', width: '300%', top: '0', height: '2400px', transformOrigin: '50% 0%', transform: 'rotateX(72deg)',
      backgroundImage: `linear-gradient(${o.color} 1.5px, transparent 1.5px), linear-gradient(90deg, ${o.color} 1.5px, transparent 1.5px)`,
      backgroundSize: `${o.size}px ${o.size}px`,
    } }, holder);
    if (o.fade) {
      holder.style.webkitMaskImage = 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.6) 35%, #000 70%)';
      holder.style.maskImage = 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.6) 35%, #000 70%)';
    }
    return { el: holder, plane, update(t) { plane.style.backgroundPosition = `0px ${(t * o.speed) % o.size}px`; } };
  };

  // floating particle dust (call from update)
  KIT.drawParticles = (P, t) => {
    const c = P.ctx;
    c.clearRect(0, 0, 1920, 1080);
    for (const q of P.list) {
      const x = (q.x + noise(q.ph, t * 0.05) * 120 + t * 12 * q.z) % 1960 - 20;
      const y = (q.y - t * 18 * q.z + 2000) % 1100 - 10;
      const a = (0.25 + 0.6 * q.s) * (0.6 + 0.4 * Math.sin(t * 1.5 + q.ph));
      c.fillStyle = `rgba(21,219,168,${a * q.z})`;
      const r = 1 + q.z * 2;
      c.beginPath();
      c.arc(x, y, r, 0, Math.PI * 2);
      c.fill();
    }
  };

  /* ------------------------------------------------------------------
     TYPOGRAPHY
     ------------------------------------------------------------------ */
  // Headline in Russo One. Wrap highlighted words in *asterisks* → teal.
  // returns {el, units} where units are split spans (words by default)
  KIT.headline = (parent, text, opts = {}) => {
    const o = Object.assign({ size: 96, x: 960, y: 540, w: 1600, align: 'center', font: 'display', color: '#fff',
      split: 'words', lh: 1.08, weight: 400, glow: false, anchor: 'center', ls: '-0.01em' }, opts);
    const el = h('div', { class: o.font === 'display' ? 'display' : 'ui', style: {
      position: 'absolute', width: `${o.w}px`, fontSize: `${o.size}px`, lineHeight: o.lh, color: o.color,
      textAlign: o.align, fontWeight: o.weight, letterSpacing: o.ls,
    } }, parent);
    const left = o.align === 'center' ? o.x - o.w / 2 : o.align === 'right' ? o.x - o.w : o.x;
    el.style.left = `${left}px`;
    el.style.top = `${o.y}px`;
    if (o.anchor === 'center') el.style.transform = 'translateY(-50%)';
    // parse *em* segments
    const parts = String(text).split(/(\*[^*]+\*|\n)/);
    const units = [];
    for (const part of parts) {
      if (!part) continue;
      if (part === '\n') { h('br', {}, el); continue; }
      const em = part.startsWith('*') && part.endsWith('*');
      const span = h('span', { class: em ? 'kit-em' : '' }, el);
      span.textContent = em ? part.slice(1, -1) : part;
      if (em) {
        span.style.color = C.vibrant;
        if (o.glow) span.style.textShadow = '0 0 30px rgba(21,219,168,0.55), 0 0 80px rgba(21,219,168,0.25)';
      }
      if (o.split) units.push(...GTR.split(span, o.split));
    }
    if (o.glow && !o.split) el.classList.add('glow-text');
    return { el, units };
  };

  // Eyebrow / kicker: "02 — ATENDER" style
  KIT.eyebrow = (parent, text, opts = {}) => {
    const o = Object.assign({ x: 960, y: 300, align: 'center', color: C.vibrant, size: 20, line: true }, opts);
    const el = h('div', { class: 'body', style: {
      position: 'absolute', top: `${o.y}px`, fontSize: `${o.size}px`, fontWeight: 700, letterSpacing: '0.18em',
      textTransform: 'uppercase', color: o.color, display: 'flex', alignItems: 'center', gap: '16px', whiteSpace: 'nowrap',
    } }, parent);
    if (o.align === 'center') { el.style.left = `${o.x}px`; el.style.transform = 'translateX(-50%)'; }
    else if (o.align === 'right') { el.style.right = `${1920 - o.x}px`; }
    else el.style.left = `${o.x}px`;
    let line = null;
    if (o.line) line = h('span', { style: { display: 'inline-block', width: '48px', height: '2px', background: o.color, borderRadius: '2px', transformOrigin: 'left center' } }, el);
    const label = h('span', {}, el);
    label.textContent = text;
    return { el, line, label };
  };

  // Standard word reveal (rise + un-blur) onto a GSAP timeline
  KIT.revealWords = (tl, units, at = 0, opts = {}) => {
    const o = Object.assign({ y: 60, dur: 0.7, stagger: 0.07, blur: 12, ease: 'power3.out' }, opts);
    tl.fromTo(units, { y: o.y, opacity: 0, filter: `blur(${o.blur}px)` },
      { y: 0, opacity: 1, filter: 'blur(0px)', duration: o.dur, stagger: o.stagger, ease: o.ease }, at);
    return tl;
  };
  // Char cascade (for short punchy words)
  KIT.revealChars = (tl, units, at = 0, opts = {}) => {
    const o = Object.assign({ y: 80, dur: 0.55, stagger: 0.028, rot: 0, ease: 'back.out(1.6)' }, opts);
    tl.fromTo(units, { y: o.y, opacity: 0, rotate: o.rot, scale: 0.9 },
      { y: 0, opacity: 1, rotate: 0, scale: 1, duration: o.dur, stagger: o.stagger, ease: o.ease }, at);
    return tl;
  };
  KIT.hideUnits = (tl, units, at, opts = {}) => {
    const o = Object.assign({ y: -40, dur: 0.4, stagger: 0.03, blur: 8, ease: 'power2.in' }, opts);
    tl.to(units, { y: o.y, opacity: 0, filter: `blur(${o.blur}px)`, duration: o.dur, stagger: o.stagger, ease: o.ease }, at);
    return tl;
  };

  // Decode/scramble effect: shows `text` resolved progressively from random glyphs (pure fn of progress)
  const GLYPHS = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%&$@*+=<>/';
  KIT.scramble = (el, text, prog, seed = 1) => {
    const n = text.length;
    const r = rng(seed + Math.floor(prog * 40));
    let out = '';
    for (let i = 0; i < n; i++) {
      const ch = text[i];
      const th = i / n;
      if (ch === ' ' || prog >= 1 || prog > th * 0.7 + 0.3) out += ch;
      else if (prog > th * 0.7) out += GLYPHS[Math.floor(r() * GLYPHS.length)];
      else out += ' ';
    }
    el.textContent = out;
  };
  // Typewriter: reveal characters by progress; caret optional
  KIT.type = (el, text, prog, caret = true, t = 0) => {
    const n = Math.round(clamp(prog) * text.length);
    const blink = caret && prog < 1.02 && Math.floor(t * 2.2) % 2 === 0;
    el.textContent = text.slice(0, n) + (caret && (prog < 1 || blink) ? '▍' : '');
  };

  /* ------------------------------------------------------------------
     SURFACES
     ------------------------------------------------------------------ */
  // Desktop app window replicating GTR: dark sidebar + light content.
  // opts: {x,y,w,h, active:'Dashboard', url:'app.growthtime.com.br', title}
  KIT.NAV = [
    ['layout-dashboard', 'Dashboard'], ['target', 'Minha Área'], ['message-circle', 'Mensagens'],
    ['package', 'Produtos'], ['megaphone', 'Mkt & Ads'], ['settings', 'Configurações'],
  ];
  KIT.appWindow = (parent, opts = {}) => {
    const o = Object.assign({ x: 160, y: 110, w: 1600, h: 860, active: 'Dashboard', url: 'gtr.growthtime.com.br', sidebar: true, chrome: true, radius: 18 }, opts);
    const el = h('div', { class: 'kit-app', style: {
      position: 'absolute', left: `${o.x}px`, top: `${o.y}px`, width: `${o.w}px`, height: `${o.h}px`,
      borderRadius: `${o.radius}px`, overflow: 'hidden', background: C.bg, color: C.fg, fontFamily: 'var(--font-ui)',
      boxShadow: '0 40px 120px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.08), 0 0 80px rgba(21,219,168,0.12)',
      display: 'flex', flexDirection: 'column',
    } }, parent);
    let bar = null;
    if (o.chrome) {
      bar = h('div', { style: { height: '44px', flex: 'none', background: '#1b1b1b', display: 'flex', alignItems: 'center', gap: '8px', padding: '0 18px' } }, el);
      ['#ff5f57', '#febc2e', '#28c840'].forEach((c) => h('span', { style: { width: '13px', height: '13px', borderRadius: '50%', background: c, display: 'inline-block' } }, bar));
      const url = h('div', { style: { marginLeft: '24px', flex: '1', maxWidth: '520px', height: '28px', borderRadius: '8px', background: '#2a2a2a', color: '#a3a3a3', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', padding: '0 12px' } }, bar);
      url.innerHTML = GTR.iconSVG('lock', { size: 14, color: '#6ee7b7' }) + `<span>${o.url}</span>`;
    }
    const body = h('div', { style: { flex: '1', display: 'flex', minHeight: '0' } }, el);
    let side = null;
    const navEls = {};
    if (o.sidebar) {
      side = h('div', { style: { width: '248px', flex: 'none', background: C.ink, color: '#f5f5f5', padding: '22px 14px', display: 'flex', flexDirection: 'column', gap: '4px' } }, body);
      const brand = h('div', { style: { display: 'flex', alignItems: 'center', gap: '12px', padding: '4px 10px 22px' } }, side);
      GTR.img('assets/icon.png', { style: { width: '38px', height: '38px' } }, brand);
      h('div', { style: { lineHeight: '1.15' } }, brand, `<div style="font-weight:600;font-size:17px">Growth Time</div><div style="font-weight:600;font-size:14px;color:${C.teal}">Results</div>`);
      for (const [ic, label] of KIT.NAV) {
        const item = h('div', { style: { display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 12px', borderRadius: '10px', fontSize: '15.5px', fontWeight: 500, color: '#d4d4d4' } }, side);
        item.innerHTML = GTR.iconSVG(ic, { size: 19 }) + `<span>${label}</span>`;
        navEls[label] = item;
      }
    }
    const content = h('div', { class: 'kit-app-content', style: { flex: '1', position: 'relative', overflow: 'hidden', background: C.bg } }, body);
    const setActive = (label) => {
      for (const [k, it] of Object.entries(navEls)) {
        const on = k === label;
        it.style.background = on ? 'rgba(56,204,156,0.14)' : 'transparent';
        it.style.color = on ? C.teal : '#d4d4d4';
      }
    };
    setActive(o.active);
    return { el, bar, side, content, nav: navEls, setActive };
  };

  // Smartphone frame. screen is a 390×844 logical canvas scaled to fit w.
  KIT.phone = (parent, opts = {}) => {
    const o = Object.assign({ x: 960, y: 540, w: 400, dark: false, shadow: true }, opts);
    const sc = o.w / 430;
    const W0 = 430, H0 = 900;
    const el = h('div', { class: 'kit-phone', style: {
      position: 'absolute', left: `${o.x - W0 / 2}px`, top: `${o.y - H0 / 2}px`, width: `${W0}px`, height: `${H0}px`,
      transform: `scale(${sc})`, transformOrigin: '50% 50%',
    } }, parent);
    const frame = h('div', { style: {
      position: 'absolute', inset: '0', borderRadius: '64px', padding: '14px',
      background: 'linear-gradient(145deg, #3a3f44, #101214 40%, #2a2e32 70%, #0b0c0d)',
      boxShadow: o.shadow ? '0 50px 120px rgba(0,0,0,0.6), 0 0 0 2px rgba(255,255,255,0.06) inset, 0 0 60px rgba(21,219,168,0.15)' : 'none',
    } }, el);
    const screen = h('div', { class: 'kit-phone-screen', style: {
      position: 'relative', width: '402px', height: '872px', borderRadius: '52px', overflow: 'hidden',
      background: o.dark ? '#0b0b0b' : '#fff', color: o.dark ? '#fff' : C.fg, fontFamily: 'var(--font-ui)',
    } }, frame);
    // status bar
    const sb = h('div', { style: { position: 'absolute', top: '0', left: '0', right: '0', height: '54px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 34px', fontSize: '17px', fontWeight: 600, zIndex: 5, color: o.dark ? '#fff' : '#000' } }, screen);
    sb.innerHTML = `<span>9:41</span><span style="display:flex;gap:6px;align-items:center">${GTR.iconSVG('signal', { size: 17 })}${GTR.iconSVG('wifi', { size: 17 })}<span style="display:inline-block;width:26px;height:12px;border-radius:4px;border:1.5px solid currentColor;position:relative"><span style="position:absolute;inset:1.5px;right:5px;background:currentColor;border-radius:2px"></span></span></span>`;
    h('div', { style: { position: 'absolute', top: '11px', left: '50%', width: '124px', height: '36px', marginLeft: '-62px', borderRadius: '20px', background: '#000', zIndex: 6 } }, screen);
    const body = h('div', { style: { position: 'absolute', top: '54px', left: '0', right: '0', bottom: '0', overflow: 'hidden' } }, screen);
    return { el, screen, body, scale: sc };
  };

  // WhatsApp-style chat inside a container (phone body or card)
  KIT.waChat = (parent, opts = {}) => {
    const o = Object.assign({ name: 'Patrícia · Loja', status: 'online', initials: 'P', channel: 'wa', header: true }, opts);
    const wrap = h('div', { style: { position: 'absolute', inset: '0', display: 'flex', flexDirection: 'column', background: C.waBg } }, parent);
    let head = null;
    if (o.header) {
      head = h('div', { style: { height: '72px', flex: 'none', background: '#f7f7f7', borderBottom: '1px solid #e2e2e2', display: 'flex', alignItems: 'center', gap: '12px', padding: '0 16px' } }, wrap);
      head.innerHTML = `${GTR.iconSVG('chevron-left', { size: 26, color: '#0a84ff' })}<div style="width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,#25d366,#128c7e);color:#fff;display:grid;place-items:center;font-weight:700;font-size:19px">${o.initials}</div><div style="line-height:1.2"><div style="font-weight:600;font-size:18px">${o.name}</div><div class="kit-wa-status" style="font-size:14px;color:#6b7280">${o.status}</div></div>`;
    }
    const list = h('div', { style: { flex: '1', position: 'relative', padding: '18px 14px', display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'flex-end', overflow: 'hidden',
      backgroundImage: 'radial-gradient(rgba(0,0,0,0.035) 1.2px, transparent 1.2px)', backgroundSize: '22px 22px' } }, wrap);
    const add = (b) => KIT.bubble(list, b);
    return { el: wrap, head, list, add };
  };
  // chat bubble: {side:'in'|'out', text, time:'10:42', ticks:'blue'|'gray'|null, tag:{icon,text,color}, ai:false}
  KIT.bubble = (parent, b) => {
    const out = b.side === 'out';
    const el = h('div', { class: 'kit-bubble', style: {
      alignSelf: out ? 'flex-end' : 'flex-start', maxWidth: b.maxW || '78%', position: 'relative',
      background: out ? C.waOut : '#fff', color: '#111', borderRadius: out ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
      padding: '10px 14px 8px', fontSize: `${b.size || 18}px`, lineHeight: 1.35, boxShadow: '0 1px 1.5px rgba(0,0,0,0.13)',
      transformOrigin: out ? '100% 0%' : '0% 0%',
    } }, parent);
    if (b.tag) {
      const tg = h('div', { style: { display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: b.tag.color || C.tealDark, marginBottom: '4px' } }, el);
      tg.innerHTML = (b.tag.icon ? GTR.iconSVG(b.tag.icon, { size: 14 }) : '') + `<span>${b.tag.text}</span>`;
      h('br', {}, el);
    }
    const txt = h('span', { class: 'kit-bubble-text' }, el);
    txt.innerHTML = b.html || '';
    if (!b.html) txt.textContent = b.text || '';
    const meta = h('span', { style: { float: 'right', marginLeft: '10px', marginTop: '6px', fontSize: '12px', color: '#667781', display: 'inline-flex', alignItems: 'center', gap: '3px' } }, el);
    meta.innerHTML = `${b.time || '10:42'}${out && b.ticks ? GTR.iconSVG('check-check', { size: 16, color: b.ticks === 'blue' ? C.tick : '#8696a0' }) : ''}`;
    return el;
  };
  // typing indicator bubble (3 dots). returns {el, update(t)}
  KIT.typing = (parent, side = 'in') => {
    const el = h('div', { style: { alignSelf: side === 'out' ? 'flex-end' : 'flex-start', background: side === 'out' ? C.waOut : '#fff', borderRadius: '16px', padding: '14px 18px', display: 'flex', gap: '6px', boxShadow: '0 1px 1.5px rgba(0,0,0,0.13)' } }, parent);
    const dots = [0, 1, 2].map(() => h('span', { style: { width: '9px', height: '9px', borderRadius: '50%', background: '#9ca3af', display: 'inline-block' } }, el));
    return { el, update(t) { dots.forEach((d, i) => { const k = Math.max(0, Math.sin(t * 7 - i * 0.9)); d.style.transform = `translateY(${-k * 5}px)`; d.style.opacity = 0.45 + 0.55 * k; }); } };
  };

  // Light card (system UI)
  KIT.card = (parent, opts = {}) => {
    const o = Object.assign({ x: 0, y: 0, w: 320, h: 160, pad: 22, radius: 14, dark: false, abs: true }, opts);
    const el = h('div', { class: 'kit-card', style: {
      position: o.abs ? 'absolute' : 'relative', left: o.abs ? `${o.x}px` : null, top: o.abs ? `${o.y}px` : null,
      width: `${o.w}px`, height: o.h ? `${o.h}px` : null, padding: `${o.pad}px`, borderRadius: `${o.radius}px`,
      background: o.dark ? 'linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))' : '#fff',
      border: o.dark ? '1px solid rgba(255,255,255,0.12)' : `1px solid ${C.border}`,
      color: o.dark ? '#fff' : C.fg,
      boxShadow: o.dark ? '0 30px 80px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08)' : '0 1px 2px rgba(0,0,0,0.04), 0 12px 32px rgba(0,0,0,0.06)',
      fontFamily: 'var(--font-ui)',
    } }, parent);
    return el;
  };

  // KPI card: {label, value, sub, icon, color, tint}
  KIT.kpi = (parent, opts = {}) => {
    const o = Object.assign({ label: 'Vendas', value: 'R$ 0', sub: '', icon: 'trending-up', color: C.teal, tint: '#ecfdf5', dark: false }, opts);
    const el = KIT.card(parent, o);
    el.style.display = 'flex';
    el.style.flexDirection = 'column';
    el.style.gap = '10px';
    const top = h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '16px', fontWeight: 500, color: o.dark ? '#a3a3a3' : C.muted } }, el);
    top.innerHTML = `<span>${o.label}</span><span style="width:40px;height:40px;border-radius:10px;display:grid;place-items:center;background:${o.dark ? 'rgba(21,219,168,0.14)' : o.tint};color:${o.color}">${GTR.iconSVG(o.icon, { size: 21 })}</span>`;
    const val = h('div', { style: { fontSize: `${o.valueSize || 38}px`, fontWeight: 800, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' } }, el);
    val.textContent = o.value;
    let sub = null;
    if (o.sub) {
      sub = h('div', { style: { fontSize: '14px', fontWeight: 600, color: o.subColor || C.tealDark, display: 'flex', alignItems: 'center', gap: '4px' } }, el);
      sub.innerHTML = o.sub;
    }
    return { el, val, sub };
  };

  // pill / chip
  KIT.pill = (parent, opts = {}) => {
    const o = Object.assign({ text: '', icon: null, bg: 'rgba(21,219,168,0.14)', color: C.vibrant, size: 18, border: 'rgba(21,219,168,0.35)', pad: '10px 18px', emoji: null }, opts);
    const el = h('div', { class: 'kit-pill', style: {
      display: 'inline-flex', alignItems: 'center', gap: '10px', padding: o.pad, borderRadius: '999px', background: o.bg, color: o.color,
      fontSize: `${o.size}px`, fontWeight: 700, border: `1px solid ${o.border}`, whiteSpace: 'nowrap', fontFamily: 'var(--font-ui)',
    } }, parent);
    el.innerHTML = (o.emoji ? `<span class="emoji">${o.emoji}</span>` : '') + (o.icon ? GTR.iconSVG(o.icon, { size: o.size + 2 }) : '') + `<span>${o.text}</span>`;
    if (o.x != null) Object.assign(el.style, { position: 'absolute', left: `${o.x}px`, top: `${o.y}px` });
    return el;
  };

  // avatar circle with initials
  KIT.avatar = (parent, opts = {}) => {
    const o = Object.assign({ text: 'A', size: 44, bg: 'linear-gradient(135deg,#38cc9c,#066767)', color: '#fff' }, opts);
    const el = h('div', { style: { width: `${o.size}px`, height: `${o.size}px`, borderRadius: '50%', background: o.bg, color: o.color, display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: `${o.size * 0.42}px`, flex: 'none' } }, parent);
    el.textContent = o.text;
    return el;
  };

  // channel badge (WhatsApp / Instagram / Messenger / API Oficial)
  KIT.channel = (parent, kind = 'wa', size = 44) => {
    const bg = { wa: C.wa, ig: C.ig, fb: 'linear-gradient(135deg,#00b2ff,#006aff)', sms: '#6366f1', mail: '#0ea5e9' }[kind];
    const icon = { wa: 'message-circle', ig: 'instagram', fb: 'facebook', sms: 'message-square', mail: 'mail' }[kind];
    const el = h('div', { style: { width: `${size}px`, height: `${size}px`, borderRadius: `${size * 0.3}px`, background: bg, display: 'grid', placeItems: 'center', color: '#fff', flex: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' } }, parent);
    el.innerHTML = GTR.iconSVG(icon, { size: size * 0.56, sw: 2.2 });
    return el;
  };

  /* ------------------------------------------------------------------
     DATA VIZ (all driven by a progress 0..1)
     ------------------------------------------------------------------ */
  // Line/area chart. data = array of numbers. returns {svg, set(prog)}
  KIT.lineChart = (parent, opts = {}) => {
    const o = Object.assign({ w: 600, h: 220, data: [3, 4, 3.5, 5, 6, 5.5, 7, 8, 9.5], color: C.teal, fill: true, sw: 4, dots: false, grid: true, smooth: true, dark: false }, opts);
    const svg = s('svg', { width: o.w, height: o.h, viewBox: `0 0 ${o.w} ${o.h}`, overflow: 'visible' }, parent);
    const max = Math.max(...o.data) * 1.08, min = Math.min(0, Math.min(...o.data));
    const pts = o.data.map((v, i) => [(i / (o.data.length - 1)) * o.w, o.h - ((v - min) / (max - min)) * o.h]);
    if (o.grid) for (let i = 1; i < 4; i++) s('line', { x1: 0, x2: o.w, y1: (o.h * i) / 4, y2: (o.h * i) / 4, stroke: o.dark ? 'rgba(255,255,255,0.08)' : '#eee', 'stroke-width': 1 }, svg);
    let d = `M${pts[0][0]},${pts[0][1]}`;
    for (let i = 1; i < pts.length; i++) {
      if (o.smooth) {
        const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
        const mx = (x0 + x1) / 2;
        d += ` C${mx},${y0} ${mx},${y1} ${x1},${y1}`;
      } else d += ` L${pts[i][0]},${pts[i][1]}`;
    }
    const id = 'lg' + Math.floor(rng(o.w * 7 + o.h + o.data.length)() * 1e9);
    const defs = s('defs', {}, svg);
    const grad = s('linearGradient', { id, x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
    s('stop', { offset: '0%', 'stop-color': o.color, 'stop-opacity': 0.32 }, grad);
    s('stop', { offset: '100%', 'stop-color': o.color, 'stop-opacity': 0 }, grad);
    const clipId = id + 'c';
    const clip = s('clipPath', { id: clipId }, defs);
    const clipRect = s('rect', { x: 0, y: -50, width: 0, height: o.h + 100 }, clip);
    let area = null;
    if (o.fill) area = s('path', { d: `${d} L${o.w},${o.h} L0,${o.h} Z`, fill: `url(#${id})`, 'clip-path': `url(#${clipId})` }, svg);
    const line = s('path', { d, fill: 'none', stroke: o.color, 'stroke-width': o.sw, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, svg);
    const len = line.getTotalLength();
    line.style.strokeDasharray = `${len}`;
    const head = s('circle', { r: o.sw * 1.8, fill: o.color, stroke: '#fff', 'stroke-width': 2.5 }, svg);
    const set = (pr) => {
      pr = clamp(pr);
      line.style.strokeDashoffset = `${len * (1 - pr)}`;
      clipRect.setAttribute('width', o.w * pr);
      const pt = line.getPointAtLength(len * pr);
      head.setAttribute('cx', pt.x);
      head.setAttribute('cy', pt.y);
      head.style.opacity = pr > 0.001 && pr < 1 ? 1 : pr >= 1 ? 1 : 0;
    };
    set(0);
    return { svg, line, area, head, set, pts };
  };

  // Vertical bars. returns {el, bars, set(prog)} — cascades left→right
  KIT.bars = (parent, opts = {}) => {
    const o = Object.assign({ w: 520, h: 200, data: [4, 6, 5, 8, 7, 9, 12], color: C.teal, gap: 14, radius: 8, highlightLast: true, labels: null, dark: false }, opts);
    const el = h('div', { style: { position: 'relative', width: `${o.w}px`, height: `${o.h}px`, display: 'flex', alignItems: 'flex-end', gap: `${o.gap}px` } }, parent);
    const max = Math.max(...o.data);
    const bars = o.data.map((v, i) => {
      const col = h('div', { style: { flex: '1', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', gap: '8px' } }, el);
      const b = h('div', { style: { width: '100%', height: `${(v / max) * 100}%`, borderRadius: `${o.radius}px ${o.radius}px 3px 3px`, transformOrigin: '50% 100%',
        background: o.highlightLast && i === o.data.length - 1 ? `linear-gradient(180deg, ${C.vibrant}, ${C.tealDark})` : (o.dark ? 'rgba(56,204,156,0.45)' : 'rgba(56,204,156,0.35)') } }, col);
      if (o.labels) { const l = h('div', { style: { fontSize: '13px', color: o.dark ? '#a3a3a3' : C.muted, fontWeight: 500 } }, col); l.textContent = o.labels[i]; }
      return b;
    });
    const set = (pr) => bars.forEach((b, i) => { const k = GTR.E('back.out(1.4)')(clamp(pr * 1.6 - i * (0.6 / bars.length))); b.style.transform = `scaleY(${Math.max(0, k)})`; });
    set(0);
    return { el, bars, set };
  };

  // Progress ring. returns {el, set(prog)}
  KIT.ring = (parent, opts = {}) => {
    const o = Object.assign({ size: 180, sw: 16, color: C.vibrant, track: 'rgba(255,255,255,0.1)', cap: 'round' }, opts);
    const r = (o.size - o.sw) / 2, c = 2 * Math.PI * r;
    const svg = s('svg', { width: o.size, height: o.size, viewBox: `0 0 ${o.size} ${o.size}`, style: { transform: 'rotate(-90deg)' } }, parent);
    s('circle', { cx: o.size / 2, cy: o.size / 2, r, fill: 'none', stroke: o.track, 'stroke-width': o.sw }, svg);
    const arc = s('circle', { cx: o.size / 2, cy: o.size / 2, r, fill: 'none', stroke: o.color, 'stroke-width': o.sw, 'stroke-linecap': o.cap, 'stroke-dasharray': c }, svg);
    const set = (pr) => arc.setAttribute('stroke-dashoffset', c * (1 - clamp(pr)));
    set(0);
    return { el: svg, arc, set };
  };

  // Goal bar with Bronze / Prata / Ouro milestones. returns {el, set(prog)}; prog 0..1 of the Ouro target
  KIT.tierBar = (parent, opts = {}) => {
    const o = Object.assign({ w: 700, h: 22, marks: [0.6, 0.8, 1.0], dark: true, labels: true }, opts);
    const el = h('div', { style: { position: 'relative', width: `${o.w}px`, height: `${o.h + (o.labels ? 44 : 0)}px` } }, parent);
    const track = h('div', { style: { position: 'absolute', left: 0, top: 0, width: '100%', height: `${o.h}px`, borderRadius: '999px', background: o.dark ? 'rgba(255,255,255,0.1)' : '#eef2f1', overflow: 'hidden' } }, el);
    const fill = h('div', { style: { position: 'absolute', left: 0, top: 0, bottom: 0, width: '0%', borderRadius: '999px', background: `linear-gradient(90deg, ${C.tealDark}, ${C.vibrant})`, boxShadow: '0 0 24px rgba(21,219,168,0.6)' } }, track);
    const tiers = [['Bronze', C.bronze], ['Prata', C.prata], ['Ouro', C.ouro]];
    const marks = tiers.map(([name, col], i) => {
      const x = o.marks[i] * o.w;
      const m = h('div', { style: { position: 'absolute', left: `${x}px`, top: `-6px`, width: `${o.h + 12}px`, height: `${o.h + 12}px`, marginLeft: `-${(o.h + 12) / 2}px`, borderRadius: '50%', background: '#0b2b29', border: `3px solid ${col}`, display: 'grid', placeItems: 'center', boxShadow: `0 0 0 0 ${col}` } }, el);
      let lab = null;
      if (o.labels) {
        lab = h('div', { style: { position: 'absolute', left: `${x}px`, top: `${o.h + 14}px`, transform: 'translateX(-50%)', fontSize: '15px', fontWeight: 700, color: col, letterSpacing: '0.04em', whiteSpace: 'nowrap' } }, el);
        lab.textContent = name;
      }
      return { m, lab, col, at: o.marks[i] };
    });
    const set = (pr) => {
      fill.style.width = `${clamp(pr) * 100}%`;
      for (const mk of marks) {
        const hit = pr >= mk.at - 1e-3;
        mk.m.style.background = hit ? mk.col : '#0b2b29';
        mk.m.style.boxShadow = hit ? `0 0 22px ${mk.col}` : 'none';
      }
    };
    set(0);
    return { el, fill, marks, set };
  };

  /* ------------------------------------------------------------------
     FX
     ------------------------------------------------------------------ */
  // deterministic confetti burst drawn on a 2D context. t = seconds since burst.
  KIT.confetti = (ctx2d, t, opts = {}) => {
    const o = Object.assign({ x: 960, y: 540, n: 160, seed: 5, colors: [C.vibrant, C.ouro, '#ffffff', C.teal, '#f472b6', '#60a5fa'], power: 1400, gravity: 1500, spread: Math.PI * 2, angle: -Math.PI / 2, life: 3 }, opts);
    if (t < 0 || t > o.life) return;
    const r = rng(o.seed);
    for (let i = 0; i < o.n; i++) {
      const a = o.angle + (r() - 0.5) * o.spread;
      const v = o.power * (0.35 + r() * 0.65);
      const drag = 1.6 + r() * 1.2;
      // closed-form with linear drag: x = v/k (1 - e^{-kt})
      const e = Math.exp(-drag * t);
      const x = o.x + Math.cos(a) * v / drag * (1 - e) + Math.sin(t * (2 + r() * 3) + i) * 12;
      const y = o.y + Math.sin(a) * v / drag * (1 - e) + (o.gravity / drag) * (t - (1 - e) / drag) * 0.55;
      const rot = t * (4 + r() * 8) + i;
      const w = 8 + r() * 10, hh = 5 + r() * 6;
      const col = o.colors[i % o.colors.length];
      const alpha = clamp(1 - (t - (o.life - 0.8)) / 0.8);
      ctx2d.save();
      ctx2d.globalAlpha = alpha;
      ctx2d.translate(x, y);
      ctx2d.rotate(rot);
      ctx2d.scale(1, Math.cos(rot * 1.7));
      ctx2d.fillStyle = col;
      ctx2d.fillRect(-w / 2, -hh / 2, w, hh);
      ctx2d.restore();
    }
  };

  // expanding ring pulse (DOM) — call set(prog)
  KIT.pulse = (parent, opts = {}) => {
    const o = Object.assign({ x: 960, y: 540, r: 200, color: C.vibrant, sw: 3 }, opts);
    const el = h('div', { style: { position: 'absolute', left: `${o.x - o.r}px`, top: `${o.y - o.r}px`, width: `${o.r * 2}px`, height: `${o.r * 2}px`, borderRadius: '50%', border: `${o.sw}px solid ${o.color}`, opacity: 0, pointerEvents: 'none' } }, parent);
    const set = (pr) => { el.style.transform = `scale(${0.2 + pr * 0.8})`; el.style.opacity = pr <= 0 || pr >= 1 ? 0 : (1 - pr) * 0.9; };
    set(0);
    return { el, set };
  };

  // mouse cursor sprite. returns {el, set(x,y,pressed)}
  KIT.cursor = (parent) => {
    const el = h('div', { style: { position: 'absolute', left: '0', top: '0', width: '40px', height: '40px', zIndex: 50, pointerEvents: 'none', filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.4))' } }, parent);
    el.innerHTML = '<svg width="34" height="40" viewBox="0 0 24 28"><path d="M3 2 L3 22 L8.5 17 L12 25.5 L15.5 24 L12 15.8 L19.5 15.5 Z" fill="#fff" stroke="#111" stroke-width="1.6" stroke-linejoin="round"/></svg>';
    const ring = h('div', { style: { position: 'absolute', left: '-18px', top: '-18px', width: '40px', height: '40px', borderRadius: '50%', border: `3px solid ${C.vibrant}`, opacity: 0 } }, el);
    const set = (x, y, press = 0) => {
      el.style.transform = `translate(${x}px, ${y}px) scale(${1 - press * 0.12})`;
      ring.style.opacity = press > 0 ? (1 - press) * 0.9 : 0;
      ring.style.transform = `scale(${0.4 + press * 1.4})`;
    };
    set(-100, -100);
    return { el, set };
  };

  // speed streaks / light lines canvas draw (pure fn)
  KIT.streaks = (ctx2d, t, opts = {}) => {
    const o = Object.assign({ n: 40, seed: 3, color: '21,219,168', dir: 1, speed: 1400, len: 260, alpha: 0.5, y0: 0, y1: 1080 }, opts);
    const r = rng(o.seed);
    for (let i = 0; i < o.n; i++) {
      const y = o.y0 + r() * (o.y1 - o.y0);
      const sp = o.speed * (0.5 + r());
      const L = o.len * (0.4 + r());
      const off = r() * 3000;
      const x = ((off + t * sp) % 2600) - 340;
      const xx = o.dir > 0 ? x : 1920 - x;
      const g = ctx2d.createLinearGradient(xx - L * o.dir, y, xx, y);
      g.addColorStop(0, `rgba(${o.color},0)`);
      g.addColorStop(1, `rgba(${o.color},${o.alpha * (0.3 + r() * 0.7)})`);
      ctx2d.strokeStyle = g;
      ctx2d.lineWidth = 1 + r() * 2;
      ctx2d.beginPath();
      ctx2d.moveTo(xx - L * o.dir, y);
      ctx2d.lineTo(xx, y);
      ctx2d.stroke();
    }
  };

  // Count-up text setter: KIT.count(el, value, formatter)
  KIT.count = (el, v, f = fmt.int) => { el.textContent = f(v); };

  // Flow node for dispatch canvas: {title, sub, icon, color}
  KIT.flowNode = (parent, opts = {}) => {
    const o = Object.assign({ x: 0, y: 0, w: 260, title: 'Enviar WhatsApp', sub: '', icon: 'send', color: C.teal, dark: true }, opts);
    const el = h('div', { style: {
      position: 'absolute', left: `${o.x}px`, top: `${o.y}px`, width: `${o.w}px`, padding: '16px 18px', borderRadius: '16px',
      background: o.dark ? 'rgba(10,32,30,0.92)' : '#fff', border: `1.5px solid ${o.dark ? 'rgba(21,219,168,0.35)' : C.border}`,
      boxShadow: o.dark ? '0 20px 50px rgba(0,0,0,0.45), 0 0 30px rgba(21,219,168,0.12)' : '0 12px 30px rgba(0,0,0,0.08)',
      display: 'flex', alignItems: 'center', gap: '14px', color: o.dark ? '#fff' : C.fg, fontFamily: 'var(--font-ui)',
    } }, parent);
    el.innerHTML = `<div style="width:44px;height:44px;border-radius:12px;display:grid;place-items:center;flex:none;background:${o.color}22;color:${o.color}">${GTR.iconSVG(o.icon, { size: 22 })}</div><div style="line-height:1.25;min-width:0"><div style="font-weight:700;font-size:17px">${o.title}</div>${o.sub ? `<div style="font-size:14px;opacity:.65">${o.sub}</div>` : ''}</div>`;
    return el;
  };
  // SVG connector path between two points with draw progress. returns {path, set(prog)}
  KIT.connector = (svg, a, b, opts = {}) => {
    const o = Object.assign({ color: C.vibrant, sw: 3, dash: false, curve: 0.5 }, opts);
    const dx = (b[0] - a[0]) * o.curve;
    const d = o.vertical
      ? `M${a[0]},${a[1]} C${a[0]},${a[1] + (b[1] - a[1]) * o.curve} ${b[0]},${b[1] - (b[1] - a[1]) * o.curve} ${b[0]},${b[1]}`
      : `M${a[0]},${a[1]} C${a[0] + dx},${a[1]} ${b[0] - dx},${b[1]} ${b[0]},${b[1]}`;
    const path = s('path', { d, fill: 'none', stroke: o.color, 'stroke-width': o.sw, 'stroke-linecap': 'round' }, svg);
    const len = path.getTotalLength();
    path.style.strokeDasharray = `${len}`;
    const dot = s('circle', { r: o.sw * 2, fill: o.color }, svg);
    const set = (pr, pulse = null) => {
      path.style.strokeDashoffset = `${len * (1 - clamp(pr))}`;
      const q = pulse == null ? pr : pulse;
      const pt = path.getPointAtLength(len * clamp(q));
      dot.setAttribute('cx', pt.x);
      dot.setAttribute('cy', pt.y);
      dot.style.opacity = q > 0 && q < 1 ? 1 : 0;
    };
    set(0);
    return { path, dot, len, set };
  };

  /* ------------------------------------------------------------------
     CAMERA / TRANSITIONS / LOADERS
     ------------------------------------------------------------------ */
  // 3D camera rig: put content inside `world`; drive with set({x,y,z,rx,ry,rz,s}).
  // z > 0 moves the world toward the viewer (push-in).
  KIT.camera = (parent, opts = {}) => {
    const o = Object.assign({ perspective: 1400, origin: '50% 50%' }, opts);
    const view = h('div', { style: { position: 'absolute', inset: '0', perspective: `${o.perspective}px`, perspectiveOrigin: o.origin, overflow: 'hidden' } }, parent);
    const world = h('div', { style: { position: 'absolute', inset: '0', transformStyle: 'preserve-3d', transformOrigin: '50% 50%' } }, view);
    const set = ({ x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, s: sc = 1 } = {}) => {
      world.style.transform = `translate3d(${x}px, ${y}px, ${z}px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${sc})`;
    };
    set();
    return { view, world, set };
  };

  // Brand wipe (the 45°-ish "/" cut of the GT mark). The wipe line sweeps left→right.
  //  KIT.diagX(prog)          → x of the line at the bottom edge (top edge is x + SLANT)
  //  (apply diagClip to a full-frame, untransformed container such as the scene root)
  //  KIT.diagClip(el, prog)   → clip-path revealing the region LEFT of the line (incoming content);
  //                             pass {invert:true} to keep the region RIGHT of it (outgoing content)
  //  KIT.diagWipe(parent,o)   → teal slab riding just ahead of the line; set(prog)
  KIT.SLANT = 760;
  KIT.diagX = (prog) => lerp(-KIT.SLANT - 40, 1960, clamp(prog));
  KIT.diagClip = (el, prog, opts = {}) => {
    const x = KIT.diagX(prog), S = KIT.SLANT;
    if (prog <= 0) { el.style.clipPath = opts.invert ? 'none' : 'polygon(0 0,0 0,0 0)'; return; }
    if (prog >= 1) { el.style.clipPath = opts.invert ? 'polygon(0 0,0 0,0 0)' : 'none'; return; }
    el.style.clipPath = opts.invert
      ? `polygon(${x + S}px 0, 3000px 0, 3000px 1080px, ${x}px 1080px)`
      : `polygon(-10px 0, ${x + S}px 0, ${x}px 1080px, -10px 1080px)`;
  };
  KIT.diagWipe = (parent, opts = {}) => {
    const o = Object.assign({ color: C.vibrant, width: 220, z: 40, glow: true, second: 'rgba(21,219,168,0.35)', gap: 26, secondWidth: 60 }, opts);
    const svg = s('svg', { width: 1920, height: 1080, viewBox: '0 0 1920 1080', style: { position: 'absolute', left: '0', top: '0', zIndex: o.z, pointerEvents: 'none', overflow: 'visible' } }, parent);
    const main = s('polygon', { fill: o.color }, svg);
    const thin = s('polygon', { fill: o.second }, svg);
    if (o.glow) main.style.filter = 'drop-shadow(0 0 30px rgba(21,219,168,0.7))';
    const S = KIT.SLANT;
    const band = (el, x0, w) => el.setAttribute('points', `${x0 + S},0 ${x0 + S + w},0 ${x0 + w},1080 ${x0},1080`);
    const set = (pr) => {
      const vis = pr > 0 && pr < 1;
      svg.style.display = vis ? 'block' : 'none';
      if (!vis) return;
      const x = KIT.diagX(pr);
      band(main, x, o.width);
      band(thin, x + o.width + o.gap, o.secondWidth);
    };
    set(0);
    return { el: svg, set };
  };

  // RGB-split glitch for an element (sets text-shadow + small jitter). amt 0..1, t = time for jitter
  KIT.glitch = (el, amt, t, seed = 1) => {
    if (amt <= 0.001) { el.style.textShadow = ''; el.style.transform = el.dataset.baseTransform || ''; el.style.clipPath = ''; return; }
    const r = rng(seed + Math.floor(t * 30));
    const dx = (r() - 0.5) * 18 * amt, dy = (r() - 0.5) * 6 * amt;
    el.style.textShadow = `${-6 * amt}px 0 rgba(255,0,80,0.85), ${6 * amt}px 0 rgba(0,255,220,0.85)`;
    el.style.transform = `${el.dataset.baseTransform || ''} translate(${dx}px, ${dy}px)`;
    const y0 = Math.floor(r() * 80), y1 = y0 + 8 + Math.floor(r() * 20);
    el.style.clipPath = r() < 0.5 * amt ? `polygon(0 ${y0}%, 100% ${y0}%, 100% ${y1}%, 0 ${y1}%)` : '';
  };

  // Load an SVG file inline (await inside build). Returns the <svg> element.
  KIT.loadSVG = async (url, parent) => {
    const txt = await (await fetch(url)).text();
    const wrap = document.createElement('div');
    wrap.innerHTML = txt.trim();
    const svg = wrap.querySelector('svg');
    if (parent) parent.appendChild(svg);
    return svg;
  };

  // Light plate for client logos (some are dark ink). returns the plate element
  KIT.logoPlate = (parent, file, opts = {}) => {
    const o = Object.assign({ w: 220, h: 110, light: true }, opts);
    const el = h('div', { style: { width: `${o.w}px`, height: `${o.h}px`, borderRadius: '18px', display: 'grid', placeItems: 'center', flex: 'none',
      background: o.light ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 16px 40px rgba(0,0,0,0.35)' } }, parent);
    GTR.img(`assets/logos/${file}`, { style: { maxWidth: `${o.w - 40}px`, maxHeight: `${o.h - 30}px`, objectFit: 'contain' } }, el);
    return el;
  };

  // Animated GT logo assembly. Parts slide in along the mark's 45° growth diagonal and lock.
  // KIT.logoAnim(parent, {x, y, width, gray, green, withText, glow}) → {el, logo, set(t)}
  // t = seconds since the assembly starts; fully assembled at ~1.6 s (text done ~2.1 s).
  KIT.logoAnim = (parent, opts = {}) => {
    const o = Object.assign({ x: 960, y: 540, width: 900, gray: '#e5e7eb', green: '#33cc99', withText: true, glow: true, dist: 420 }, opts);
    const L = GTR.logo({ gray: o.gray, green: o.green, withText: o.withText });
    const box = h('div', { style: { position: 'absolute', left: `${o.x - o.width / 2}px`, top: `${o.y}px`, width: `${o.width}px`, transform: 'translateY(-50%)' } }, parent);
    box.appendChild(L.svg);
    L.svg.style.width = '100%';
    L.svg.style.height = 'auto';
    L.svg.style.overflow = 'visible';
    if (o.glow) L.svg.style.filter = 'drop-shadow(0 0 28px rgba(21,219,168,0.35))';
    const d = o.dist / Math.SQRT2;
    // [part, delay, dx, dy, ease]
    const plan = [
      ['g1', 0.00, -d, -d], ['g2', 0.08, -d, d], ['t', 0.16, d, -d],
      ['arrow', 0.34, -d * 1.6, d * 1.6], ['stem', 0.42, -d * 1.2, d * 1.2],
    ];
    const letters = L.text ? GTR.split(L.text, 'chars') : [];
    // SVG <text> can't hold spans with split(); rebuild as tspans
    if (L.text) {
      const txt = o.text || 'GROWTH TIME';
      L.text.textContent = '';
      letters.length = 0;
      for (const ch of txt) { const ts = s('tspan', {}, L.text); ts.textContent = ch; letters.push(ts); }
    }
    const set = (t) => {
      for (const [k, dl, dx, dy] of plan) {
        const pr = p(t, dl, dl + 0.9, 'expo.out');
        const el = L.parts[k];
        el.setAttribute('transform', `translate(${dx * (1 - pr)}, ${dy * (1 - pr)})`);
        el.style.opacity = clamp(p(t, dl, dl + 0.25, 'none'));
      }
      // dot: drops in with a bounce, then a pulse
      const dp = p(t, 0.95, 1.55, 'bounce.out');
      L.parts.dot.setAttribute('transform', `translate(0, ${-260 * (1 - dp)})`);
      L.parts.dot.style.opacity = t >= 0.95 ? 1 : 0;
      // wordmark: letters rise with collapsing tracking
      letters.forEach((ts, i) => {
        const q = p(t, 1.15 + i * 0.035, 1.6 + i * 0.035, 'power3.out');
        ts.style.opacity = q;
        ts.setAttribute('dy', 0);
      });
      if (L.text) L.text.style.letterSpacing = `${lerp(60, 21, p(t, 1.15, 2.1, 'expo.out'))}px`;
    };
    set(0);
    return { el: box, logo: L, set };
  };

  // Diagnostic chip — the film's through-line (ERRO 0n → 0n · OK).
  // KIT.diagChip(parent, {n:'01', err:'SEM RESPOSTA', ok:'RESPONDIDO', x:120, y:96})
  // → {el, set(t, stamp, flip)}  t = time (blink), stamp/flip = raw progress 0..1
  //   stamp: scale 1.6→1 + fade-in (expo.out) with a white border flash at the start
  //   flip:  error face rotates away (rotateX 0→-90), OK face rotates in (90→0), then a 1.08 pop
  KIT.diagChip = (parent, opts = {}) => {
    const o = Object.assign({ n: '01', err: 'SEM RESPOSTA', ok: 'RESPONDIDO', x: 120, y: 96, size: 17 }, opts);
    const el = h('div', { class: 'kit-diag', style: { position: 'absolute', left: `${o.x}px`, top: `${o.y}px`, height: '46px', perspective: '600px', transformOrigin: '0% 50%', zIndex: 30 } }, parent);
    const face = (kind) => {
      const f = h('div', { style: {
        position: kind === 'err' ? 'relative' : 'absolute', left: '0', top: '0', height: '46px', display: 'inline-flex', alignItems: 'center', gap: '10px',
        padding: '0 20px', borderRadius: '999px', whiteSpace: 'nowrap', fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: `${o.size}px`,
        letterSpacing: '0.14em', textTransform: 'uppercase', backfaceVisibility: 'hidden', transformOrigin: '50% 50%',
        background: kind === 'err' ? 'rgba(239,68,68,0.12)' : 'rgba(21,219,168,0.14)',
        border: `1px solid ${kind === 'err' ? 'rgba(239,68,68,0.5)' : 'rgba(21,219,168,0.5)'}`,
        color: kind === 'err' ? '#fca5a5' : C.vibrant,
        boxShadow: kind === 'err' ? '0 0 24px rgba(239,68,68,0.18)' : '0 0 28px rgba(21,219,168,0.28)',
      } }, el);
      return f;
    };
    const fe = face('err');
    const dot = h('span', { style: { width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 10px #ef4444', flex: 'none' } }, fe);
    h('span', {}, fe).textContent = `ERRO ${o.n} · ${o.err}`;
    const fo = face('ok');
    fo.innerHTML = GTR.iconSVG('circle-check', { size: 18, sw: 2.4 }) + `<span>${o.n} · ${o.ok}</span>`;
    const set = (t, stamp = 1, flip = 0) => {
      const sp = p(stamp, 0, 1, 'expo.out');
      el.style.opacity = clamp(stamp * 4);
      el.style.display = stamp <= 0 ? 'none' : 'block';
      const pop = flip > 0.75 ? 1 + 0.08 * Math.sin(Math.PI * clamp((flip - 0.75) / 0.25)) : 1;
      el.style.transform = `scale(${lerp(1.6, 1, sp) * pop})`;
      const flash = stamp > 0 && stamp < 0.12;
      fe.style.borderColor = flash ? '#fff' : 'rgba(239,68,68,0.5)';
      dot.style.opacity = GTR.fract(t * 2) < 0.5 ? 1 : 0.15;
      const a = p(flip, 0, 0.5, 'power2.in'), b = p(flip, 0.5, 1, 'power2.out');
      fe.style.transform = `rotateX(${-90 * a}deg)`;
      fe.style.visibility = flip >= 0.5 ? 'hidden' : 'visible';
      fo.style.transform = `rotateX(${90 * (1 - b)}deg)`;
      fo.style.visibility = flip > 0.5 ? 'visible' : 'hidden';
    };
    set(0, 0, 0);
    return { el, errFace: fe, okFace: fo, set };
  };
})();
