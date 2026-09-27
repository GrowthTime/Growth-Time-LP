/* ============================================================
   S10 · dashboard-funil · start 52.0 · dur 6.0 · z 24 · pre 0 · post 0  [52–58] · PEAK
   The whole funnel on one screen, from the first message to money in the till.

   Hand-off in  (52.0, white flash): the Guto button of S9 sits exactly where S9
     left it — 56 px at (1758, 958). The dashboard swings up into place AROUND it
     (the camera pivots on the button, rx 32° → 0), so the cut reads as one shot.
   Hand-off out (58.0): the camera dives into the dark "TV" button and the frame
     ends solid black; S11 powers the TV on from black.

   Camera shots (world transform-origin 960 540 after the crane, so
   screen = P + (w − F)·s, with F = world focus point, P = its screen position):
     0.00–1.30  pivot crane about the Guto button (rx 30 → 0, ry −8 → 0, s .84 → 1)
     1.30–2.50  slow push s 1 → 1.03
     2.50–3.20  to the purple "Valor Total de Vendas" block, s 1.7 (band 2.60, headline reveal 2.70)
     3.20–4.55  hold + push s 1.7 → 1.76; the dashboard drifts 12 px against the locked purple block
                3.28 teal underline under "caixa" + glint across R$ 620.000,00 · 3.55 +18,2% pill
     4.55–5.00  45° up-right whip to the TV button (s dips mid-move), headline gone by 4.70, click 5.00
     5.00–5.86  dolly into the dark gap between the monitor icon and "TV": pill covers the frame
                at 5.77 (teal rim flash as its edge leaves), glyphs leave to the sides by 5.83;
                black overlay 5.80–5.95 only cleans up the already dark frame
   The tl only reveals the HUD headline; everything else is a pure function of
   `local` in update().
   ============================================================ */
GTR.scene({
  id: 'dashboard-funil',
  build(root, ctx) {
    const { h, s: S, p, inv, clamp, lerp, noise } = GTR;
    const C = KIT.C;
    const I = (n, o = {}) => GTR.iconSVG(n, o);
    const tl = ctx.tl();

    /* ---------- tiny cached setters (no redundant DOM writes per frame) ---------- */
    const st = (el, k, v) => { const c = el.__c || (el.__c = {}); if (c[k] !== v) { c[k] = v; el.style[k] = v; } };
    const tx = (el, v) => { if (el.__t !== v) { el.__t = v; el.textContent = v; } };
    const vis = (el, a) => {
      a = clamp(a);
      st(el, 'opacity', String(+a.toFixed(4)));
      st(el, 'visibility', a > 0.002 ? 'visible' : 'hidden');
    };
    const pop = (t, a, d = 0.4, e = 'back.out(1.7)') => (t < a ? 0 : p(t, a, a + d, e));
    const bump = (t, a, d) => Math.sin(Math.PI * inv(t, a, a + d));
    const L2 = (a, b, k) => [lerp(a[0], b[0], k), lerp(a[1], b[1], k)];
    const geo = (a, b, k) => a * Math.pow(b / a, k);
    const n2 = (v) => v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const int = (v) => Math.round(v).toLocaleString('pt-BR');
    // absolutely positioned div
    const box = (parent, x, y, w, hh, style = {}, html = null) => h('div', { style: Object.assign({
      position: 'absolute', left: `${x}px`, top: `${y}px`, width: w != null ? `${w}px` : null, height: hh != null ? `${hh}px` : null,
    }, style) }, parent, html);

    /* ---------- geometry ---------- */
    const WIN = { x: 110, y: 70, w: 1700, h: 940 };
    const CO = [WIN.x + 248, WIN.y + 44];           // content origin on screen (358, 114)
    const CW = WIN.w - 248, CH = WIN.h - 44;         // content 1452 × 896
    const FAB = [1758, 958];                         // Guto button (S9 hand-off)
    const TVB = { x: 1158, y: 12, w: 80, h: 40 };    // TV button, content coords
    const TVC = [CO[0] + TVB.x + TVB.w / 2, CO[1] + TVB.y + TVB.h / 2]; // (1556, 146)
    const FUN = { x: 32, y: 296, w: 760, h: 584 };   // funnel card (content)
    const CHC = { x: 808, y: 296, w: 612, h: 584 };  // chart card (content)
    const BLK_X = FUN.x + 24, BLK_W = FUN.w - 48;    // funnel blocks 712 wide
    const BLK_H = [86, 86, 86, 86, 108], BLK_G = 6, BLK_Y0 = FUN.y + 82;
    const BLK_Y = BLK_H.map((_, i) => BLK_Y0 + BLK_H.slice(0, i).reduce((a, v) => a + v + BLK_G, 0));
    const PUR = { x: BLK_X, y: BLK_Y[4], w: BLK_W, h: BLK_H[4] };
    const PURC = [CO[0] + PUR.x + PUR.w / 2, CO[1] + PUR.y + PUR.h / 2]; // (770, 914)
    const HERO = { F: PURC, P: [960, 560], s: 1.7, s2: 1.76 };
    const T_CRANE = 1.3;
    const HY = 900;                                  // headline block centre (dark band under the window)
    const TV_P = [1250, 370];                        // TV button screen pos when the cursor clicks (thirds)
    // dark gap between the monitor icon ink (x 33.8) and the "T" ink (x 41.8) inside the 80 px pill
    // (measured in the browser: svg 17.5–34.5, span 41.5–62.5) → gap centre 37.8 = TVC.x − 2.2, half-width 4
    const TVF = [TVC[0] - 2.2, TVC[1]];
    const HOLD0 = 3.2, WHIP0 = 4.55, WHIP1 = 5.0;    // hero hold / 45° whip to the TV button (click at 5.00)
    const DRIFT = [-12, 7];                          // hold parallax: the dashboard slides (screen px), purple stays locked
    const driftAt = (t) => { const k = p(t, HOLD0, WHIP0, 'sine.in'); return [DRIFT[0] * k, DRIFT[1] * k]; };
    /* dive into the TV pill: ln(s/1.35) = A·u² + B·u⁸ over 5.00–5.86
       s 1.96 @5.5 · 9.3 @5.7 · 27 @5.76 (pill's straight edges leave) · 33 @5.77 (pill covers the frame)
       · 74 @5.80 · 240 @5.83 (icon/"TV" glyphs leave to the sides) · 760 @5.86 */
    const DIVE = { t0: WHIP1, t1: 5.86, A: 1.515, B: 4.82 };
    const diveS = (t) => { const u = inv(t, DIVE.t0, DIVE.t1); return 1.35 * Math.exp(DIVE.A * u * u + DIVE.B * Math.pow(u, 8)); };
    const S_END = diveS(DIVE.t1);

    /* ---------- camera (pure fn of t) ---------- */
    const camAt = (t) => {
      if (t < T_CRANE) {
        const k = p(t, 0, T_CRANE, 'power2.out');
        return { pivot: true, rx: 30 * (1 - k), ry: -8 * (1 - k), s: lerp(0.84, 1, k), x: 0, y: 0 };
      }
      let F, P, s;
      if (t < 2.5) {
        F = [960, 540]; P = [960, 540]; s = 1 + 0.03 * p(t, T_CRANE, 2.5, 'sine.inOut');
      } else if (t < HOLD0) {
        const k = p(t, 2.5, HOLD0, 'power3.inOut');
        F = L2([960, 540], HERO.F, k); P = L2([960, 540], HERO.P, k); s = geo(1.03, HERO.s, k);
      } else if (t < WHIP0) {
        const d = driftAt(t);
        F = HERO.F; P = [HERO.P[0] + d[0], HERO.P[1] + d[1]]; s = lerp(HERO.s, HERO.s2, p(t, HOLD0, WHIP0, 'sine.inOut'));
      } else if (t < WHIP1) {
        const k = p(t, WHIP0, WHIP1, 'power3.inOut');
        const d = driftAt(t);
        F = L2(HERO.F, TVF, k); P = L2([HERO.P[0] + d[0], HERO.P[1] + d[1]], TV_P, k); s = geo(HERO.s2, 1.35, k) * (1 - 0.2 * Math.sin(Math.PI * k));
      } else {
        F = TVF; P = L2(TV_P, [960, 540], p(t, WHIP1, 5.78, 'power2.inOut')); s = diveS(t);
      }
      return { pivot: false, rx: 0, ry: 0, s, x: P[0] - 960 - (F[0] - 960) * s, y: P[1] - 540 - (F[1] - 540) * s };
    };
    const proj = (w, c) => [960 + (w[0] - 960) * c.s + c.x, 540 + (w[1] - 540) * c.s + c.y];
    const unproj = (q, c) => [960 + (q[0] - 960 - c.x) / c.s, 540 + (q[1] - 540 - c.y) / c.s];

    /* ================= BACK LAYERS (under the window) ================= */
    const backGlow = GTR.glow(root, { x: 960, y: 560, r: 1000, color: '21,219,168', a: 0.16 });
    const dim = box(root, 0, 0, 1920, 1080, { background: '#000', pointerEvents: 'none' });

    /* ================= WORLD ================= */
    const cam = KIT.camera(root, { perspective: 1400 });
    const app = KIT.appWindow(cam.world, { x: WIN.x, y: WIN.y, w: WIN.w, h: WIN.h, active: 'Dashboard' });
    const content = app.content;
    content.style.fontFamily = 'var(--font-ui)';
    content.style.color = C.fg;

    /* ---------- top bar ---------- */
    const top = box(content, 0, 0, CW, 64, { background: '#fff', borderBottom: '1px solid #e5e5e5' });
    box(top, 24, 12, 320, 40, { borderRadius: '8px', background: '#f5f5f5', display: 'flex', alignItems: 'center', gap: '10px', padding: '0 14px', fontSize: '14px', color: '#737373', whiteSpace: 'nowrap' },
      I('search', { size: 16, color: '#737373' }) + '<span>Buscar consultora, registro...</span>');
    const tvBtn = box(top, TVB.x, TVB.y, TVB.w, TVB.h, { borderRadius: '20px', background: '#121212', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
      fontSize: '15px', fontWeight: 700, letterSpacing: '0.02em', boxShadow: '0 4px 12px rgba(0,0,0,.18)', transformOrigin: '50% 50%' },
      I('monitor-play', { size: 17, sw: 2.1 }) + '<span>TV</span>');
    const tvRing = box(top, TVB.x, TVB.y, TVB.w, TVB.h, { borderRadius: '20px', border: `2px solid ${C.vibrant}`, pointerEvents: 'none', transformOrigin: '50% 50%', opacity: 0 });
    const bell = box(top, 1258, 22, 20, 20, { color: '#404040' }, I('bell', { size: 20 }));
    box(bell, 12, -2, 9, 9, { borderRadius: '50%', background: C.danger, boxShadow: '0 0 0 2px #fff' });
    const UX = 1298;
    box(top, UX, 15, 34, 34, { borderRadius: '50%', background: '#3fc58f', color: '#fff', display: 'grid', placeItems: 'center', fontSize: '13px', fontWeight: 700, letterSpacing: '0.02em' }, 'MA');
    box(top, UX + 44, 14, 100, 36, { lineHeight: 1.15, whiteSpace: 'nowrap' },
      '<div style="font-size:14px;font-weight:600;color:#171717">Marina Alves</div><div style="font-size:12px;color:#737373">Admin</div>');
    // tooltip under the TV button (hover)
    const tip = box(content, TVB.x + TVB.w / 2 - 95, 62, 190, 30, { borderRadius: '7px', background: '#171717', color: '#fff', fontSize: '12.5px', fontWeight: 500,
      display: 'grid', placeItems: 'center', boxShadow: '0 8px 20px rgba(0,0,0,.25)', transformOrigin: '50% 0%', zIndex: 8, whiteSpace: 'nowrap' }, 'Modo apresentação (TV)');
    box(tip, 89, -5, 12, 12, { background: '#171717', transform: 'rotate(45deg)', borderRadius: '2px', zIndex: -1 });

    /* ---------- page header ---------- */
    box(content, 32, 82, 700, 34, { fontSize: '27px', fontWeight: 700, letterSpacing: '-0.015em', color: '#171717' }, 'Dashboard');
    box(content, 32, 118, 700, 22, { fontSize: '15.5px', color: '#737373' }, 'Funil de vendas e métricas de desempenho');
    const range = box(content, CW - 32 - 196, 92, 196, 40, { borderRadius: '9px', border: '1px solid #e5e5e5', background: '#fff', display: 'flex', alignItems: 'center', gap: '9px',
      padding: '0 14px', fontSize: '14.5px', fontWeight: 500, color: '#171717', boxShadow: '0 1px 2px rgba(0,0,0,.04)', whiteSpace: 'nowrap' },
      I('calendar', { size: 16, color: '#737373' }) + '<span>Últimos 30 dias</span>' + `<span style="margin-left:auto;display:flex">${I('chevron-down', { size: 16, color: '#737373' })}</span>`);
    void range;

    /* ---------- KPI row ---------- */
    const KPI = [
      { title: 'Clientes Novos', v: 1284, f: (v) => int(v), pct: '+12,4%', up: true, ico: 'users', bg: 'linear-gradient(135deg,#ecfdf5,#d1fae5)', ib: '#d1fae5', ic: '#059669' },
      { title: 'Valor Total de Vendas', v: 620000, f: (v) => 'R$ ' + int(v), pct: '+18,2%', up: true, ico: 'dollar-sign', bg: 'linear-gradient(135deg,#faf5ff,#f3e8ff)', ib: '#f3e8ff', ic: '#9333ea' },
      { title: 'Ticket Médio', v: 483, f: (v) => 'R$ ' + int(v), pct: '+5,1%', up: true, ico: 'receipt', bg: 'linear-gradient(135deg,#eff6ff,#dbeafe)', ib: '#dbeafe', ic: '#2563eb' },
      { title: 'CPA', v: 38.4, f: (v) => 'R$ ' + n2(v), pct: '−7,8%', up: false, ico: 'badge-dollar-sign', bg: 'linear-gradient(135deg,#f8fafc,#f1f5f9)', ib: '#e9eef4', ic: '#475569' },
    ];
    const KW = (CW - 64 - 3 * 16) / 4; // 335
    const kpis = KPI.map((d, i) => {
      const el = box(content, 32 + i * (KW + 16), 158, KW, 120, { borderRadius: '12px', background: d.bg, transformOrigin: '50% 100%',
        boxShadow: '0 10px 15px -3px rgba(0,0,0,.08), 0 4px 6px -4px rgba(0,0,0,.05)', border: '1px solid rgba(0,0,0,.035)' });
      box(el, 20, 18, KW - 90, 20, { fontSize: '15px', fontWeight: 500, color: '#737373', whiteSpace: 'nowrap' }, d.title);
      const val = box(el, 20, 42, KW - 90, 38, { fontSize: '30px', fontWeight: 700, letterSpacing: '-0.02em', color: '#171717', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', transformOrigin: '0% 60%' });
      const sub = box(el, 20, 88, KW - 30, 18, { display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', fontWeight: 500, color: '#059669', whiteSpace: 'nowrap' },
        I(d.up ? 'trending-up' : 'trending-down', { size: 15, sw: 2.3 }) + `<b style="font-weight:700">${d.pct}</b><span style="color:#737373;font-weight:500">vs período anterior</span>`);
      box(el, KW - 64, 18, 44, 44, { borderRadius: '10px', background: d.ib, display: 'grid', placeItems: 'center', color: d.ic }, I(d.ico, { size: 21 }));
      const at = 0.25 + i * 0.25;
      return { d, el, val, sub, at, c0: at + 0.05, lock: at + 1.05 };
    });

    /* ---------- funnel card ---------- */
    const funCard = box(content, FUN.x, FUN.y, FUN.w, FUN.h, { borderRadius: '14px', background: '#fff', border: '1px solid #e5e5e5', boxShadow: '0 1px 2px rgba(0,0,0,.04), 0 12px 32px rgba(0,0,0,.06)' });
    box(funCard, 24, 22, 500, 26, { fontSize: '19px', fontWeight: 600, color: '#171717' }, 'Funil de Vendas');
    box(funCard, 24, 50, 600, 20, { fontSize: '13.5px', color: '#737373', whiteSpace: 'nowrap' }, 'Jornada: Mensagens › Qualificação › Pedidos › Vendas');
    box(funCard, FUN.w - 24 - 34, 22, 34, 34, { borderRadius: '9px', border: '1px solid #e5e5e5', display: 'grid', placeItems: 'center', color: '#737373' }, I('filter', { size: 16 }));
    // loading skeletons (the real app shows these while the funnel query runs); a shimmer sweeps them
    const skels = BLK_H.map((hh, i) => {
      const sk = box(funCard, BLK_X - FUN.x, BLK_Y[i] - FUN.y, BLK_W, hh, { borderRadius: '8px', background: '#f3f4f4', overflow: 'hidden' });
      box(sk, 20, 16, 150, 12, { borderRadius: '6px', background: '#e7e9e9' });
      box(sk, 20, 38, i === 4 ? 220 : 110, 24, { borderRadius: '7px', background: '#e7e9e9' });
      const shim = box(sk, 0, 0, 260, hh, { background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.85) 50%, rgba(255,255,255,0))' });
      return { sk, shim };
    });

    const FB = [
      { label: 'Mensagens Recebidas', v: 12480, f: int, grad: 'linear-gradient(90deg,#06b6d4,#0e7490)', right: [['Leads Novos', '1.642']] },
      { label: 'Leads Qualificados', v: 1850, f: int, grad: 'linear-gradient(90deg,#10b981,#047857)', right: [['Taxa Qualif.', '42%'], ['CPL', 'R$ 13,41']] },
      { label: 'Pedidos Totais', v: 312, f: int, grad: 'linear-gradient(90deg,#f59e0b,#d97706)', right: [['Taxa Conversão', '16,8%'], ['Pedidos Novos', '241']] },
      { label: 'Custo por Pedido', v: 79.49, f: (v) => 'R$ ' + n2(v), grad: 'linear-gradient(90deg,#f97316,#ea580c)', right: [['Investimento', 'R$ 24.800,00']] },
      { label: 'Valor Total de Vendas', v: 620000, f: (v) => 'R$ ' + n2(v), grad: 'linear-gradient(90deg,#a855f7,#7e22ce)', hero: true },
    ];
    const blocks = FB.map((d, i) => {
      const y = BLK_Y[i] - FUN.y, hh = BLK_H[i];
      const rad = i === 0 ? '10px 10px 4px 4px' : i === 4 ? '4px 4px 12px 12px' : '4px';
      const wrap = box(funCard, BLK_X - FUN.x, y, BLK_W, hh, { borderRadius: rad, zIndex: d.hero ? 6 : null });
      const bg = box(wrap, 0, 0, BLK_W, hh, { borderRadius: rad, background: d.grad, transformOrigin: '0% 50%', overflow: 'hidden' });
      const flash = box(bg, 0, 0, BLK_W, hh, { background: 'linear-gradient(90deg, rgba(255,255,255,.55), rgba(255,255,255,.08))', opacity: 0 });
      const txt = box(wrap, 0, 0, BLK_W, hh, { color: '#fff' });
      let val, rightEl = null, foot = null, sheen = null, pill = null, glint = null;
      if (!d.hero) {
        box(txt, 20, 15, 400, 18, { fontSize: '13px', fontWeight: 500, opacity: 0.9, whiteSpace: 'nowrap' }, d.label);
        val = box(txt, 20, 35, 400, 34, { fontSize: '27px', fontWeight: 700, letterSpacing: '-0.01em', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' });
        rightEl = box(txt, BLK_W - 20 - 380, 17, 380, 50, { display: 'flex', justifyContent: 'flex-end', gap: '30px', textAlign: 'right' },
          d.right.map(([l, v]) => `<div><div style="font-size:11.5px;opacity:.85;white-space:nowrap">${l}</div><div style="font-size:16px;font-weight:600;margin-top:3px;white-space:nowrap">${v}</div></div>`).join(''));
      } else {
        box(txt, 0, 12, BLK_W, 18, { fontSize: '13px', fontWeight: 500, opacity: 0.92, textAlign: 'center' }, d.label);
        const VST = { fontSize: '31px', fontWeight: 800, letterSpacing: '-0.015em', textAlign: 'center', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', transformOrigin: '50% 55%' };
        val = box(txt, 0, 30, BLK_W, 38, VST);
        // teal glint that sweeps across the hero value (text-clipped copy of the number), paired with the "caixa" underline
        glint = box(txt, 0, 30, BLK_W, 38, Object.assign({}, VST, { color: 'transparent', backgroundRepeat: 'no-repeat', backgroundSize: '150px 100%',
          backgroundImage: 'linear-gradient(100deg, rgba(120,255,214,0) 0%, rgba(214,255,243,1) 50%, rgba(120,255,214,0) 100%)',
          webkitBackgroundClip: 'text', backgroundClip: 'text', filter: 'drop-shadow(0 0 9px rgba(21,219,168,.95))', opacity: 0 }));
        glint.textContent = d.f(d.v);
        box(txt, 20, 75, BLK_W - 40, 1, { background: 'rgba(255,255,255,.28)' });
        foot = box(txt, 20, 82, BLK_W - 40, 20, { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '12.5px', whiteSpace: 'nowrap' },
          '<div><span style="opacity:.85">Vendas Novas: </span><b style="font-weight:700">R$ 486.000,00</b></div><div style="text-align:right"><span style="opacity:.85">Vendas Base: </span><b style="font-weight:700">R$ 134.000,00</b></div>');
        sheen = box(bg, 0, -60, 170, hh + 120, { background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.55) 50%, rgba(255,255,255,0))', transform: 'translateX(-300px) rotate(20deg)' });
        pill = box(txt, BLK_W - 20 - 118, 33, 118, 30, { borderRadius: '999px', background: 'rgba(255,255,255,.2)', border: '1px solid rgba(255,255,255,.45)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', gap: '5px', fontSize: '14px', fontWeight: 700, transformOrigin: '100% 50%', boxShadow: '0 4px 14px rgba(59,7,100,.25)' },
          I('trending-up', { size: 15, sw: 2.4 }) + '<span>+18,2%</span>');
      }
      const at = 1.25 + i * 0.25;
      return { d, wrap, bg, flash, txt, val, rightEl, foot, sheen, pill, glint, at };
    });
    const pur = blocks[4];
    // hero veil + shockwaves (content coords; purple wrapper sits above the veil)
    const veil = box(content, 0, 0, CW, CH, { background: 'rgba(0,21,22,.55)', zIndex: 5, pointerEvents: 'none', opacity: 0 });
    const shock = [0, 1].map((i) => box(content, PUR.x, PUR.y, PUR.w, PUR.h, {
      borderRadius: '14px', border: `${i ? 1.5 : 2.5}px solid rgba(233,213,255,.95)`, boxShadow: '0 0 28px rgba(168,85,247,.75), inset 0 0 18px rgba(168,85,247,.4)',
      zIndex: 6, pointerEvents: 'none', transformOrigin: '50% 50%', opacity: 0 }));

    /* ---------- chart card ---------- */
    const chCard = box(content, CHC.x, CHC.y, CHC.w, CHC.h, { borderRadius: '14px', background: '#fff', border: '1px solid #e5e5e5', boxShadow: '0 1px 2px rgba(0,0,0,.04), 0 12px 32px rgba(0,0,0,.06)' });
    box(chCard, 24, 22, 360, 26, { fontSize: '19px', fontWeight: 600, color: '#171717' }, 'Evolução de Vendas');
    box(chCard, 24, 50, 360, 20, { fontSize: '13.5px', color: '#737373' }, 'Últimos 7 dias');
    box(chCard, CHC.w - 24 - 36 - 8 - 112, 24, 112, 36, { borderRadius: '8px', border: '1px solid #e5e5e5', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 10px 0 12px', fontSize: '13.5px', color: '#171717' },
      `<span>7 dias</span>${I('chevron-down', { size: 15, color: '#737373' })}`);
    box(chCard, CHC.w - 24 - 36, 24, 36, 36, { borderRadius: '8px', border: '1px solid #e5e5e5', display: 'grid', placeItems: 'center', color: '#171717' }, I('calendar', { size: 16 }));

    const G = { x: 24, y: 86, w: 564, h: 262, padL: 52, padR: 16, padT: 12, padB: 28, max: 40000 };
    const DAYS = [['Sáb', 18400], ['Dom', 6200], ['Seg', 27900], ['Ter', 31700], ['Qua', 24600], ['Qui', 29300], ['Sex', 33100]];
    const gx = (i) => G.padL + (i * (G.w - G.padL - G.padR)) / (DAYS.length - 1);
    const gy = (v) => G.padT + (G.h - G.padT - G.padB) * (1 - v / G.max);
    const svg = S('svg', { width: G.w, height: G.h, viewBox: `0 0 ${G.w} ${G.h}`, style: { position: 'absolute', left: `${G.x}px`, top: `${G.y}px`, overflow: 'visible' } }, chCard);
    const defs = S('defs', {}, svg);
    const lg = S('linearGradient', { id: 'dfGrad', x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
    S('stop', { offset: '5%', 'stop-color': '#3fc58f', 'stop-opacity': 0.34 }, lg);
    S('stop', { offset: '95%', 'stop-color': '#3fc58f', 'stop-opacity': 0 }, lg);
    const clip = S('clipPath', { id: 'dfClip' }, defs);
    const clipR = S('rect', { x: 0, y: -20, width: 0, height: G.h + 40 }, clip);
    [0, 10000, 20000, 30000, 40000].forEach((v) => {
      S('line', { x1: G.padL, x2: G.w - G.padR, y1: gy(v), y2: gy(v), stroke: '#e5e5e5', 'stroke-dasharray': '3 3' }, svg);
      S('text', { x: G.padL - 9, y: gy(v) + 4, 'text-anchor': 'end', 'font-size': 11.5, fill: '#737373', 'font-family': 'Inter, sans-serif', text: `R$${v / 1000}k` }, svg);
    });
    DAYS.forEach(([d], i) => {
      S('line', { x1: gx(i), x2: gx(i), y1: G.padT, y2: G.h - G.padB, stroke: '#eeeeee', 'stroke-dasharray': '3 3' }, svg);
      S('text', { x: gx(i), y: G.h - 8, 'text-anchor': 'middle', 'font-size': 11.5, fill: '#737373', 'font-family': 'Inter, sans-serif', text: d }, svg);
    });
    const pts = DAYS.map(([, v], i) => [gx(i), gy(v)]);
    let dPath = `M${pts[0][0]},${pts[0][1]}`;
    for (let i = 1; i < pts.length; i++) {
      const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], mx = (x0 + x1) / 2;
      dPath += ` C${mx},${y0} ${mx},${y1} ${x1},${y1}`;
    }
    S('path', { d: `${dPath} L${pts[6][0]},${gy(0)} L${pts[0][0]},${gy(0)} Z`, fill: 'url(#dfGrad)', 'clip-path': 'url(#dfClip)' }, svg);
    const line = S('path', { d: dPath, fill: 'none', stroke: '#3fc58f', 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, svg);
    const LEN = line.getTotalLength();
    line.style.strokeDasharray = `${LEN}`;
    const dots = pts.map(([x, y]) => S('circle', { cx: x, cy: y, r: 4.5, fill: '#fff', stroke: '#3fc58f', 'stroke-width': 2.5, style: { transformOrigin: `${x}px ${y}px`, transformBox: 'view-box' } }, svg));
    const headHalo = S('circle', { r: 14, fill: 'rgba(63,197,143,.22)' }, svg);
    const head = S('circle', { r: 6, fill: '#3fc58f', stroke: '#fff', 'stroke-width': 3 }, svg);
    const chTip = box(chCard, G.x + pts[6][0] - 132, G.y + pts[6][1] - 22, 118, 46, { borderRadius: '9px', background: '#171717', color: '#fff', padding: '6px 12px',
      boxShadow: '0 10px 24px rgba(0,0,0,.22)', lineHeight: 1.2, transformOrigin: '100% 50%', whiteSpace: 'nowrap' },
      '<div style="font-size:11.5px;color:#a3a3a3">Sex</div><div style="font-size:15px;font-weight:700">R$ 33.100</div>');

    // Base Ativa (stacked bars, 12 months)
    box(chCard, 24, 368, CHC.w - 48, 1, { background: '#e5e5e5' });
    box(chCard, 24, 384, 400, 22, { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', fontWeight: 600, color: '#171717' }, I('users', { size: 16, color: '#10b981' }) + '<span>Base Ativa</span>');
    box(chCard, 24, 408, 520, 18, { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#737373', whiteSpace: 'nowrap' },
      `<span style="color:#16a34a;font-weight:600;display:inline-flex;align-items:center;gap:3px">${I('trending-up', { size: 13, color: '#16a34a' })}+77</span><span style="color:rgba(22,163,74,.75);font-weight:500">(+39%)</span><span>· clientes ativos no fim de cada mês</span>`);
    box(chCard, CHC.w - 24 - 170, 388, 170, 18, { fontSize: '12px', color: '#737373', textAlign: 'right', whiteSpace: 'nowrap' }, '273 ativos em Set/26');
    const BASE = [[168, 22, 6], [176, 26, 8], [190, 31, 5], [181, 18, 9], [187, 21, 7], [195, 27, 6], [203, 24, 10], [208, 29, 8], [214, 25, 7], [219, 30, 9], [226, 28, 11], [231, 34, 8]];
    const MON = ['Out', 'Nov', 'Dez', 'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set'];
    const BB = { x: 24, y: 436, w: 500, h: 92, max: 300 };
    const bw = BB.w / BASE.length;
    const bars = BASE.map((v, i) => {
      const tot = v[0] + v[1] + v[2];
      const col = box(chCard, BB.x + i * bw + bw * 0.2, BB.y + BB.h * (1 - tot / BB.max), bw * 0.6, BB.h * tot / BB.max, { display: 'flex', flexDirection: 'column-reverse', transformOrigin: '50% 100%', borderRadius: '3px 3px 0 0', overflow: 'hidden' });
      [['#10b981', v[0]], ['#06b6d4', v[1]], ['#f97316', v[2]]].forEach(([c, n]) => h('div', { style: { height: `${(n / tot) * 100}%`, background: c, flex: 'none' } }, col));
      box(chCard, BB.x + i * bw, BB.y + BB.h + 5, bw, 14, { fontSize: '10px', color: '#737373', textAlign: 'center' }, MON[i]);
      return { col, at: 1.95 + i * 0.045 };
    });
    box(chCard, 24, 552, 460, 16, { display: 'flex', gap: '16px', fontSize: '11.5px', color: '#737373', whiteSpace: 'nowrap' },
      [['Continuaram ativos', '#10b981'], ['Novos', '#06b6d4'], ['Reativados', '#f97316']].map(([l, c]) => `<span style="display:inline-flex;align-items:center;gap:6px"><span style="width:9px;height:9px;border-radius:2px;background:${c}"></span>${l}</span>`).join(''));

    /* ---------- Guto button (floating, in the window) ---------- */
    const GUTO_BG = 'linear-gradient(135deg,#38cc9c,#2b9d78)';
    const mkFab = (parent, cx, cy) => {
      const el = box(parent, cx - 28, cy - 28, 56, 56, { borderRadius: '50%', background: GUTO_BG, display: 'grid', placeItems: 'center', color: '#fff', zIndex: 4,
        boxShadow: '0 14px 34px rgba(0,0,0,.4), 0 0 0 1px rgba(255,255,255,.14), 0 0 46px rgba(21,219,168,.55)' }, I('sparkles', { size: 25, sw: 2 }));
      box(el, 28 + 19.6 - 6.6, 28 - 19.6 - 6.6, 13.2, 13.2, { borderRadius: '50%', background: C.danger, boxShadow: '0 0 0 1.65px #fff, 0 0 9px rgba(239,68,68,.7)' });
      return el;
    };
    const fabW = mkFab(content, FAB[0] - CO[0], FAB[1] - CO[1]);
    const fabRing = box(content, FAB[0] - CO[0] - 28, FAB[1] - CO[1] - 28, 56, 56, { borderRadius: '50%', border: `2.5px solid ${C.vibrant}`, zIndex: 4, opacity: 0, pointerEvents: 'none' });

    // #121212 plate = the TV pill's interior. Once the glyphs have left (s ≥ 300) the frame is pure pill, and Chromium
    // stops rasterising the world past s ≈ 700, so the plate takes over (same colour → invisible swap) and the world hides.
    const pillFill = box(root, 0, 0, 1920, 1080, { background: '#121212', pointerEvents: 'none', visibility: 'hidden' });

    /* ================= HUD ================= */
    // bottom band scrim (headline sits on the dark stage under the window)
    const band = box(root, 0, 1080 - 420, 1920, 420, { background: 'linear-gradient(0deg, rgba(0,21,22,.92) 0%, rgba(0,21,22,.55) 45%, rgba(0,21,22,0) 100%)', pointerEvents: 'none', opacity: 0 });
    const hlWrap = box(root, 0, 0, 1920, 1080, { transformOrigin: `960px ${HY}px`, pointerEvents: 'none' });
    const hl = KIT.headline(hlWrap, 'Da mensagem ao *caixa*.', { x: 960, y: HY, size: 110, w: 1720, glow: true });
    hl.el.style.whiteSpace = 'nowrap';
    KIT.revealWords(tl, hl.units, 2.7, { dur: 0.65, stagger: 0.06 });
    // teal underline sweep under "caixa" (measured once: fonts are loaded before build)
    const caixa = hl.units.find((u) => u.textContent.trim() === 'caixa');
    const HL_TOP = HY - hl.el.offsetHeight / 2;
    const UL = { x: 100 + caixa.offsetLeft + 4, w: caixa.offsetWidth - 8, y: HL_TOP + caixa.offsetTop + caixa.offsetHeight * 0.80 + 9 };
    const ul = box(hlWrap, UL.x, UL.y, UL.w, 7, { borderRadius: '4px', background: 'linear-gradient(90deg, #0fb58b, #15dba8 70%, #b9ffe9)',
      boxShadow: '0 0 18px rgba(21,219,168,.75), 0 0 42px rgba(21,219,168,.35)', transformOrigin: '0% 50%', transform: 'scaleX(0)' });
    const ulHead = box(hlWrap, UL.x - 20, UL.y - 9, 40, 25, { borderRadius: '50%', pointerEvents: 'none',
      background: 'radial-gradient(closest-side, rgba(235,255,249,.95), rgba(21,219,168,.55) 45%, rgba(21,219,168,0))', opacity: 0 });
    const UL_T = 3.28;                               // "caixa" is ~92 % revealed here → underline + number glint land together

    // S9 hand-off button (HUD, frame-exact match) — swapped for the in-window one once the crane lands
    const fabGlow = GTR.glow(root, { x: FAB[0], y: FAB[1], r: 150, color: '21,219,168', a: 0.5 });
    fabGlow.style.transform = 'scale(0.887)';
    const fabH = mkFab(root, FAB[0], FAB[1]);
    fabH.style.zIndex = '';
    const fabHRing = box(root, FAB[0] - 50, FAB[1] - 50, 100, 100, { borderRadius: '50%', border: `3px solid ${C.vibrant}`, opacity: 0, pointerEvents: 'none' });

    // foreground bokeh (closer than the window: moves d× faster than the world → parallax depth)
    const BR = GTR.rng('df-bokeh');
    const BOKEH = [[160, 180], [1830, 260], [420, 1040], [1500, 1060], [1040, 60], [70, 700], [1880, 820]].map(([x, y], i) => {
      const r = 50 + BR() * 70, d = 1.25 + BR() * 0.35;
      const el = box(root, x - r, y - r, r * 2, r * 2, { borderRadius: '50%', pointerEvents: 'none',
        background: `radial-gradient(circle, rgba(${i % 3 === 1 ? '255,255,255' : '21,219,168'},.34) 0%, rgba(21,219,168,.12) 45%, rgba(21,219,168,0) 70%)` });
      return { el, x, y, r, d, ph: BR() * 10 };
    });
    // tunnel vignette for the dive (centre follows the TV button)
    const tunnel = box(root, 0, 0, 1920, 1080, { pointerEvents: 'none', opacity: 0 });
    const cursor = KIT.cursor(root);
    const { canvas: wc, ctx: w2 } = GTR.canvas(root);
    // §1.9: keeps the fx disclaimer corner (x < 380, y > 1020) dark while the window slides under it (whip + dive)
    // (ellipse 620×240 on the corner with a .9 plateau, so the caption itself sits on ≥ .85 dark, not just the corner)
    const discScrim = box(root, -620, 840, 1240, 480, { background: 'radial-gradient(closest-side, rgba(0,21,22,.94) 0%, rgba(0,21,22,.9) 48%, rgba(0,21,22,.55) 72%, rgba(0,21,22,0) 100%)', pointerEvents: 'none', opacity: 0 });
    // thin teal rim that flashes on the TV pill's edge as it leaves the frame (hands off to S11's white power-on line)
    const rim = box(root, 0, 0, 10, 10, { boxSizing: 'border-box', border: '3px solid rgba(190,255,236,.95)', pointerEvents: 'none', opacity: 0,
      boxShadow: '0 0 16px rgba(21,219,168,.9), 0 0 44px rgba(21,219,168,.55), inset 0 0 16px rgba(21,219,168,.7)' });
    const black = box(root, 0, 0, 1920, 1080, { background: '#000', pointerEvents: 'none', opacity: 0 });

    // radial warp streaks for the dive into the TV (pure fn of dive progress)
    const WR = GTR.rng('df-warp');
    const WARP = Array.from({ length: 90 }, () => ({ a: WR() * Math.PI * 2, ph: WR(), sp: 0.6 + WR() * 0.9, len: 0.5 + WR(), w: 1 + WR() * 2.2, white: WR() < 0.35 }));
    const drawWarp = (u, amt, ox, oy) => {
      w2.clearRect(0, 0, 1920, 1080);
      if (amt <= 0.002) { wc.style.display = 'none'; return; }
      wc.style.display = 'block';
      for (const q of WARP) {
        const f = GTR.fract(q.ph + u * q.sp);
        const r0 = 60 + Math.pow(f, 1.8) * 1250;
        const L = (40 + 360 * f) * q.len * (0.4 + amt);
        const cx = ox + Math.cos(q.a) * r0, cy = oy + Math.sin(q.a) * r0;
        const ex = ox + Math.cos(q.a) * (r0 + L), ey = oy + Math.sin(q.a) * (r0 + L);
        const g = w2.createLinearGradient(cx, cy, ex, ey);
        const col = q.white ? '255,255,255' : '21,219,168';
        g.addColorStop(0, `rgba(${col},0)`);
        g.addColorStop(1, `rgba(${col},${(0.25 + 0.55 * f) * amt})`);
        w2.strokeStyle = g;
        w2.lineWidth = q.w * (0.6 + f);
        w2.beginPath();
        w2.moveTo(cx, cy);
        w2.lineTo(ex, ey);
        w2.stroke();
      }
    };

    /* ================= SFX ================= */
    ctx.cue('whoosh', 0.0, { dur: 0.5, up: false });
    [0.25, 0.5, 0.75, 1.0].forEach((t, i) => ctx.cue('pop', t, { db: -6, pan: -0.45 + i * 0.3 }));
    [700, 880, 1040, 1240, 1480].forEach((f, i) => ctx.cue('blip', 1.25 + i * 0.25, { freq: f }));
    ctx.cue('whoosh', 2.5, { dur: 0.5, up: true });
    ctx.cue('impact', 3.0, { size: 0.6 });
    ctx.cue('shimmer', UL_T, { db: -10 });
    ctx.cue('swoosh', WHIP0, { db: -6, pan: 0.3 });
    ctx.cue('pop', 5.0);
    ctx.cue('whoosh', 5.2, { dur: 0.6, up: true });

    // headline ride-out reference (world point under the headline when the whip starts)
    const C45 = camAt(WHIP0);
    const HQ = unproj([960, HY], C45);

    return {
      tl,
      update(local) {
        const t = local;
        const c = camAt(t);

        /* ---------- camera ---------- */
        if (c.pivot) {
          st(cam.world, 'transformOrigin', `${FAB[0]}px ${FAB[1]}px`);
          cam.set({ rx: c.rx, ry: c.ry, s: c.s });
        } else {
          st(cam.world, 'transformOrigin', '960px 540px');
          cam.set({ x: c.x, y: c.y, s: c.s });
        }
        const inPill = !c.pivot && t > WHIP1 && c.s >= 300;
        st(pillFill, 'visibility', inPill ? 'visible' : 'hidden');
        st(cam.view, 'visibility', inPill ? 'hidden' : 'visible');
        // motion blur during the 45° whip to the TV button
        const wx = inv(t, WHIP0, WHIP1);
        const whip = t > WHIP0 && t < WHIP1 ? (wx < 0.5 ? 4 * wx * wx : (2 - 2 * wx) * (2 - 2 * wx)) : 0; // |d power3.inOut| / max
        st(app.el, 'filter', whip > 0.02 ? `blur(${(whip * 5).toFixed(2)}px)` : 'none');

        /* ---------- back layers ---------- */
        st(dim, 'opacity', String(0.7 * (1 - p(t, 0, 0.5, 'power2.out'))));
        st(backGlow, 'transform', `translate(${noise(3.3, t * 0.25) * 60}px, ${noise(7.1, t * 0.25) * 40}px) scale(${1 + 0.06 * noise(1.9, t * 0.3)})`);
        st(backGlow, 'opacity', String((0.8 + 0.2 * Math.sin(t * 1.4)) * (1 - p(t, 5.0, 5.6, 'power2.in'))));

        /* ---------- KPI cards ---------- */
        for (const k of kpis) {
          const e = pop(t, k.at, 0.55, 'back.out(1.4)');
          vis(k.el, p(t, k.at, k.at + 0.22, 'power1.out'));
          st(k.el, 'transform', `translateY(${24 * (1 - e)}px) scale(${lerp(0.96, 1, e)})`);
          const q = p(t, k.c0, k.lock, 'power2.out');
          tx(k.val, k.d.f(k.d.v * q));
          st(k.val, 'transform', `scale(${1 + 0.1 * bump(t, k.lock - 0.04, 0.3)})`);
          const sa = p(t, k.lock - 0.1, k.lock + 0.25, 'power2.out');
          vis(k.sub, sa);
          st(k.sub, 'transform', `translateX(${-8 * (1 - sa)}px)`);
        }

        // hold parallax: the camera drifts, the lifted purple block counter-moves so it stays locked on screen
        const dr = driftAt(t), dw = c.pivot ? 0 : (1 - p(t, WHIP0, WHIP0 + 0.25, 'power2.inOut')) / c.s;
        const ox = -dr[0] * dw, oy = -dr[1] * dw;

        /* ---------- funnel cascade ---------- */
        skels.forEach((k, i) => {
          const at = blocks[i].at;
          vis(k.sk, 1 - p(t, at + 0.05, at + 0.3, 'power2.out'));
          st(k.shim, 'transform', `translateX(${(-300 + GTR.fract(t * 0.9 - i * 0.08) * 1300).toFixed(1)}px)`);
        });
        for (const b of blocks) {
          const e = p(t, b.at, b.at + 0.55, 'expo.out');
          vis(b.wrap, p(t, b.at, b.at + 0.14, 'none'));
          st(b.wrap, 'transform', b === pur ? `translate(${(-40 * (1 - e) + ox).toFixed(2)}px, ${oy.toFixed(2)}px)` : `translateX(${-40 * (1 - e)}px)`);
          st(b.bg, 'transform', `scaleX(${lerp(0.6, 1, e)})`);
          st(b.flash, 'opacity', String(t < b.at ? 0 : 0.6 * (1 - p(t, b.at + 0.05, b.at + 0.45, 'power2.out'))));
          vis(b.txt, p(t, b.at + 0.08, b.at + 0.35, 'power2.out'));
          st(b.txt, 'transform', `translateX(${-14 * (1 - p(t, b.at + 0.08, b.at + 0.45, 'power3.out'))}px)`);
          tx(b.val, b.d.f(b.d.v * p(t, b.at + 0.05, b.at + 0.5, 'power2.out')));
          if (b.rightEl) vis(b.rightEl, p(t, b.at + 0.25, b.at + 0.5, 'power2.out'));
          if (b.foot) vis(b.foot, p(t, b.at + 0.3, b.at + 0.6, 'power2.out'));
        }

        /* ---------- hero: purple block ---------- */
        const heroOn = p(t, 2.9, 3.15, 'power2.out') * (1 - p(t, WHIP0, 4.85, 'power2.in'));
        const g = heroOn * (0.88 + 0.12 * Math.sin((t - 3) * 4.2));
        st(pur.wrap, 'boxShadow', heroOn > 0.002
          ? `0 0 0 ${(2.5 * g).toFixed(2)}px rgba(255,255,255,${(0.55 * g).toFixed(3)}), 0 22px 60px rgba(88,28,135,${(0.45 * g).toFixed(3)}), 0 0 ${(130 * g).toFixed(1)}px rgba(168,85,247,${(0.6 * g).toFixed(3)})`
          : 'none');
        vis(veil, 0.62 * p(t, 2.8, 3.2, 'power2.inOut') * (1 - p(t, 4.5, 4.8, 'power2.in')));
        const sh = p(t, 3.0, 3.55, 'power2.inOut');
        st(pur.sheen, 'transform', `translateX(${lerp(-300, BLK_W + 120, sh)}px) rotate(20deg)`);
        vis(pur.sheen, sh > 0 && sh < 1 ? 1 : 0);
        const vTr = `scale(${1 + 0.07 * bump(t, 2.97, 0.42)})`;
        st(pur.val, 'transform', vTr);
        // teal glint across "R$ 620.000,00", in sync with the "caixa" underline
        const gk = p(t, UL_T, UL_T + 0.46, 'power2.inOut');
        vis(pur.glint, gk > 0 && gk < 1 ? Math.min(1, Math.sin(Math.PI * gk) * 1.6) : 0);
        if (gk > 0 && gk < 1) {
          st(pur.glint, 'backgroundPosition', `${lerp(130, 440, gk).toFixed(1)}px 0px`);
          st(pur.glint, 'transform', vTr);
        }
        st(pur.val, 'textShadow', heroOn > 0.002 ? `0 0 ${(22 * g).toFixed(1)}px rgba(255,255,255,${(0.45 * g).toFixed(3)})` : 'none');
        const pp = pop(t, 3.55, 0.45, 'back.out(2)');     // pops as the glint reaches it
        vis(pur.pill, clamp(pp * 2) * (1 - p(t, WHIP0, 4.8, 'power2.in')));
        st(pur.pill, 'transform', `translateY(${(t > 3.55 ? -Math.sin((t - 3.55) * 3.6) : 0).toFixed(3)}px) scale(${lerp(0.6, 1, pp)})`);
        shock.forEach((el, i) => {
          const q = inv(t, 3.0 + i * 0.1, 3.5 + i * 0.1);
          const e = GTR.E('expo.out')(q);
          vis(el, q > 0 && q < 1 ? Math.pow(1 - q, 1.6) * (i ? 0.55 : 1) : 0);
          st(el, 'transform', `translate(${ox.toFixed(2)}px, ${oy.toFixed(2)}px) scale(${1 + e * (i ? 0.075 : 0.045)}, ${1 + e * (i ? 0.5 : 0.3)})`);
        });

        /* ---------- line chart + base bars ---------- */
        const pr = p(t, 1.5, 2.6, 'power1.inOut');
        line.style.strokeDashoffset = `${LEN * (1 - pr)}`;
        const hp = line.getPointAtLength(LEN * pr);
        clipR.setAttribute('width', Math.max(0, hp.x));
        head.setAttribute('cx', hp.x); head.setAttribute('cy', hp.y);
        headHalo.setAttribute('cx', hp.x); headHalo.setAttribute('cy', hp.y);
        const ha = pr > 0.001 ? 1 : 0;
        head.style.opacity = ha;
        headHalo.style.opacity = ha * (0.7 + 0.3 * Math.sin(t * 9));
        headHalo.setAttribute('r', 12 + 4 * Math.sin(t * 9));
        dots.forEach((d, i) => {
          // each data point pops as the drawing head reaches it
          const q = pr > 0.001 ? clamp((hp.x - pts[i][0] + 3) / 46) : 0;
          d.style.opacity = q > 0 ? 1 : 0;
          d.style.transform = `scale(${GTR.E('back.out(2.4)')(q)})`;
        });
        const tp = pop(t, 2.62, 0.4, 'back.out(1.8)');
        vis(chTip, clamp(tp * 2));
        st(chTip, 'transform', `translateY(${-6 * (1 - tp)}px) scale(${lerp(0.7, 1, tp)})`);
        for (const b of bars) {
          const e = pop(t, b.at, 0.42, 'back.out(1.3)');
          st(b.col, 'transform', `scaleY(${Math.max(0, e)})`);
          vis(b.col, t >= b.at ? 1 : 0);
        }

        /* ---------- Guto buttons ---------- */
        const hudFab = t < T_CRANE;
        vis(fabH, hudFab ? 1 : 0);
        vis(fabW, hudFab ? 0 : 1);
        st(fabGlow, 'opacity', String(0.92 * (1 - p(t, 0.15, 0.9, 'power2.out'))));
        const r1 = inv(t, 0.04, 0.6);
        vis(fabHRing, r1 > 0 && r1 < 1 ? (1 - r1) * 0.8 : 0);
        st(fabHRing, 'transform', `scale(${lerp(0.9, 2.3, GTR.E('power2.out')(r1))})`);
        const r2 = inv(t, 1.9, 2.5);
        vis(fabRing, r2 > 0 && r2 < 1 ? (1 - r2) * 0.7 : 0);
        st(fabRing, 'transform', `scale(${lerp(1, 1.9, GTR.E('power2.out')(r2))})`);

        /* ---------- TV button: hover, tooltip, click ---------- */
        const hov = p(t, 4.82, 4.95, 'power2.out') * (1 - p(t, 5.1, 5.5, 'power2.inOut')); // clean dark pill for the swallow
        st(tvBtn, 'boxShadow', `0 4px 12px rgba(0,0,0,.18), 0 0 0 ${(3 * hov).toFixed(2)}px rgba(21,219,168,${(0.45 * hov).toFixed(3)}), 0 0 ${(24 * hov).toFixed(1)}px rgba(21,219,168,${(0.5 * hov).toFixed(3)})`);
        st(tvBtn, 'transform', `scale(${1 - 0.08 * bump(t, 4.98, 0.22)})`);
        const tipIn = pop(t, 4.74, 0.3, 'back.out(1.8)') * (1 - p(t, 5.02, 5.14, 'power2.in'));
        vis(tip, clamp(tipIn * 1.5));
        st(tip, 'transform', `translateY(${6 * (1 - Math.min(1, tipIn))}px) scale(${lerp(0.85, 1, Math.min(1, tipIn))})`);
        const rq = inv(t, 5.0, 5.45);
        vis(tvRing, rq > 0 && rq < 1 ? (1 - rq) * 0.95 : 0);
        st(tvRing, 'transform', `scale(${1 + 0.9 * GTR.E('power2.out')(rq)}, ${1 + 1.6 * GTR.E('power2.out')(rq)})`);

        /* ---------- cursor (HUD) ---------- */
        if (t >= WHIP0 - 0.05 && t < 5.4) {
          const target = proj([TVC[0] + 8, TVC[1] + 6], c.pivot ? { s: 1, x: 0, y: 0 } : c);
          const k = p(t, WHIP0, 4.94, 'power2.inOut');
          const cx = lerp(1780, target[0], k) + Math.sin(Math.PI * k) * 50;
          const cy = lerp(700, target[1], k) + Math.sin(Math.PI * k) * 40;
          const press = t >= 4.98 ? inv(t, 4.98, 5.3) : 0;
          cursor.set(cx - 4, cy - 3, press);
          const ca = p(t, WHIP0, WHIP0 + 0.12, 'none') * (1 - p(t, 5.12, 5.36, 'power2.in'));
          vis(cursor.el, ca);
        } else {
          vis(cursor.el, 0);
        }

        /* ---------- headline (HUD, rides out with the camera) ---------- */
        let hx = 0, hy = 0, hs = 1;
        if (t > WHIP0 && !c.pivot) {
          const q = proj(HQ, c);
          hx = q[0] - 960; hy = q[1] - HY; hs = c.s / C45.s;
        }
        st(hlWrap, 'transform', `translate(${hx.toFixed(2)}px, ${hy.toFixed(2)}px) scale(${hs.toFixed(4)})`);
        // gone within the first 0.15 s of the whip, and blurred like the world it rides with
        const hOut = 1 - p(t, WHIP0, WHIP0 + 0.15, 'power2.in');
        st(hlWrap, 'opacity', String(hOut));
        st(hlWrap, 'filter', whip > 0.02 ? `blur(${(whip * 5).toFixed(2)}px)` : 'none');
        st(hlWrap, 'display', t < 2.65 || t > WHIP0 + 0.17 ? 'none' : 'block');
        vis(band, p(t, 2.6, 3.2, 'power2.out') * (1 - p(t, WHIP0, 4.85, 'power2.in')));
        // underline sweep under "caixa" + its hot head
        const ulk = p(t, UL_T, UL_T + 0.34, 'power3.out');
        st(ul, 'transform', `scaleX(${ulk.toFixed(4)})`);
        vis(ulHead, ulk > 0 ? 1 - p(t, UL_T + 0.18, UL_T + 0.46, 'power2.out') : 0);
        st(ulHead, 'transform', `translateX(${(UL.w * ulk).toFixed(1)}px)`);

        /* ---------- foreground bokeh ---------- */
        for (const b of BOKEH) {
          const cc = c.pivot ? { s: lerp(0.9, 1, c.s), x: 0, y: (1 - c.s) * 900 } : c;
          const sx = 960 + (b.x - 960) * cc.s * b.d + cc.x * b.d + noise(b.ph, t * 0.3) * 30;
          const sy = 540 + (b.y - 540) * cc.s * b.d + cc.y * b.d + noise(b.ph + 9, t * 0.3) * 24;
          const sc = Math.pow(cc.s, 0.6);
          st(b.el, 'transform', `translate(${(sx - b.x).toFixed(1)}px, ${(sy - b.y).toFixed(1)}px) scale(${sc.toFixed(3)})`);
          // discs cut by the frame edge read as lens smudges → they dim to ≤ .3 of their level as they cross it
          const rv = 0.7 * b.r * sc, edge = Math.min(sx, 1920 - sx, sy, 1080 - sy);
          const inF = GTR.smooth(clamp((edge / rv - 0.35) / 0.65));
          st(b.el, 'opacity', String(((0.5 + 0.35 * Math.sin(t * 1.3 + b.ph)) * lerp(0.3, 1, inF) * (1 - p(t, 5.2, 5.6, 'power2.in'))).toFixed(3)));
        }

        /* ---------- dive into the TV ---------- */
        const warpAmt = p(t, 5.15, 5.6, 'power2.in') * (1 - p(t, 5.85, 5.97, 'none'));
        const tvs = proj(TVF, c.pivot ? { s: 1, x: 0, y: 0 } : c);
        drawWarp(Math.log(c.s / 1.35) / Math.log(S_END / 1.35) * 3.2, warpAmt, tvs[0], tvs[1]);
        // soft tunnel that hugs the growing pill (keeps the light top bar readable around it), gone once the pill fills the frame
        const tun = 0.85 * p(t, 5.05, 5.6, 'power2.in') * (1 - p(Math.log(c.s), Math.log(12), Math.log(30), 'power1.inOut'));
        vis(tunnel, tun);
        if (tun > 0.002) st(tunnel, 'background', `radial-gradient(${Math.round(58 * c.s + 380)}px ${Math.round(29 * c.s + 300)}px at ${tvs[0].toFixed(1)}px ${tvs[1].toFixed(1)}px, rgba(0,0,0,0) 42%, rgba(0,8,9,.45) 72%, rgba(0,4,5,.82) 100%)`);
        // teal rim flash as the pill's edge crosses the frame (half-height 20·s passes 540 px): ~2 frames
        const rimK = t > WHIP1 ? inv(Math.log(20 * c.s), Math.log(370), Math.log(720)) : 0;
        const rimA = rimK > 0 && rimK < 1 ? Math.sin(Math.PI * rimK) : 0;
        vis(rim, rimA);
        if (rimA > 0) {
          const q = proj([CO[0] + TVB.x, CO[1] + TVB.y], c);
          st(rim, 'left', `${q[0].toFixed(1)}px`); st(rim, 'top', `${q[1].toFixed(1)}px`);
          st(rim, 'width', `${(TVB.w * c.s).toFixed(1)}px`); st(rim, 'height', `${(TVB.h * c.s).toFixed(1)}px`);
          st(rim, 'borderRadius', `${(TVB.h / 2 * c.s).toFixed(1)}px`);
        }
        vis(discScrim, p(t, 4.5, 4.65, 'power2.out') * (1 - p(t, 5.7, 5.8, 'power2.in')));
        st(black, 'opacity', String(p(t, 5.8, 5.95, 'sine.in')));
      },
    };
  },
});
