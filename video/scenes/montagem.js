/* ============================================================
   S12 · montagem   [66–72] · z 26 · pre 0 · post 0
   Quick-fire tour of the ecosystem in three 2 s panels, cut by the
   brand's 45° diagonal wipe (KIT.diagWipe + KIT.diagClip):
     A (0–2)  loja online, light stage — store → sacola → Finalizar pelo WhatsApp
     B (2–4)  link da bio: WhatsApp button in rodízio between consultoras
     C (4–6)  fluxos (Beta) — the reactivation flow that would have saved
              Revenda Bella (her gold "RB" token runs the "sim" path).
   Hand-off in : Panel A's light stage cuts in on the bar (after S11's empty dark stage).
   Hand-off out: the scan turns the flow into its wireframe, which then clears under a
                 veil trailing the line (S13's veil, mirrored): last frame = the veiled
                 empty dark stage, teal scan line at y ≈ 1080. S13 opens on the same
                 veiled stage with its own scan from y 0 (a second pass, not a pop).
   tl → eyebrow / headline reveals only. Everything else is a pure
   function of local time in update().
   ============================================================ */
GTR.scene({
  id: 'montagem',
  build(root, ctx) {
    const { h, s, p, map, clamp, lerp, inv, noise, fract } = GTR;
    const C = KIT.C;
    const I = (n, o = {}) => GTR.iconSVG(n, o);
    const div = (parent, style, html) => h('div', { style }, parent, html == null ? null : html);
    const full = (parent, z, extra = {}) => div(parent, Object.assign({ position: 'absolute', left: '0', top: '0', width: '1920px', height: '1080px', zIndex: z }, extra));
    const E = (name) => GTR.E(name);
    const tl = ctx.tl();

    /* ---------------- timing (local s) ---------------- */
    const W1 = [1.75, 2.05], W2 = [3.75, 4.05];                // diagonal wipes
    const TAP1 = 0.62, SHEET = 0.80, TICKS = [0.90, 1.025, 1.15, 1.275], MIN = 1.35, TAP2 = 1.50, WA_POP = 1.55;
    // round-robin: a lead leaves the bio button every 8th note and lands on the next card (1,2,3,4,1)
    const LEADS = [0, 1, 2, 3, 4].map((k) => ({ t0: 2.20 + k * 0.25, t1: 2.50 + k * 0.25, card: k % 4 }));
    const SCAN = [5.70, 5.99];

    /* ---------------- shared phone pose (A and B match through the wipe) ---------------- */
    const PH = { x: 1340, y: 560, w: 400 }, PSC = PH.w / 430, PERSP = 1600;
    const pose = (t) => {
      const e = p(t, 0, 0.9, 'expo.out');
      return {
        dx: lerp(46, 0, e) - t * 4 + noise(t * 0.5, 2.2) * 4,
        dy: lerp(36, 0, e) + noise(t * 0.45, 8.1) * 6,
        ry: lerp(-24, -14, e) + map(t, 0.9, 4.1, 0, 5, 'sine.inOut') + noise(t * 0.35, 4.4) * 1.2,
        rx: lerp(6, 2, e) + noise(t * 0.3, 6.6) * 1.2,
      };
    };
    const phoneTf = (q) => `translate(${q.dx}px, ${q.dy}px) rotateY(${q.ry}deg) rotateX(${q.rx}deg) scale(${PSC})`;
    // phone-body coords (402 wide screen, body starts 54 px down) → phone local (unscaled, origin = centre)
    const bodyToLocal = (bx, by) => [14 + bx - 215, 14 + 54 + by - 450];
    // analytic projection of a phone-local point through scale → rotateX → rotateY → translate → perspective
    const project = (q, u, v) => {
      const a = (q.rx * Math.PI) / 180, b = (q.ry * Math.PI) / 180;
      const x = u * PSC, y = v * PSC;
      const y1 = y * Math.cos(a), z1 = y * Math.sin(a);
      const x2 = x * Math.cos(b) + z1 * Math.sin(b), z2 = -x * Math.sin(b) + z1 * Math.cos(b);
      const wx = PH.x + q.dx + x2, wy = PH.y + q.dy + y1;
      const k = PERSP / (PERSP - z2);
      return [960 + (wx - 960) * k, 540 + (wy - 540) * k];
    };
    const measure = (text, style) => {
      const m = h('span', { style: Object.assign({ position: 'absolute', left: '0', top: '0', whiteSpace: 'nowrap', visibility: 'hidden' }, style) }, root);
      m.textContent = text;
      const w = m.offsetWidth;
      m.remove();
      return w;
    };

    const TILES = [
      { name: 'Vestido midi', sub: 'R$ 389 a grade', g: 'linear-gradient(140deg,#f3a07f,#c2552f 70%,#a3401f)', price: true },
      { name: 'Conjunto linho', sub: 'Grade P ao GG', g: 'linear-gradient(140deg,#f1e7d6,#cdb48c)' },
      { name: 'Cropped', sub: 'Grade P ao GG', g: 'linear-gradient(140deg,#ddd3ff,#8b5cf6)' },
      { name: 'Saia plissada', sub: 'Grade P ao GG', g: 'linear-gradient(140deg,#c4eadb,#3f9f86)' },
    ];
    const CONS = [
      { ini: 'AS', name: 'Ana Silva', g: 'linear-gradient(135deg,#38cc9c,#066767)' },
      { ini: 'JC', name: 'Júlia Costa', g: 'linear-gradient(135deg,#a78bfa,#6d28d9)' },
      { ini: 'MA', name: 'Marina Alves', g: 'linear-gradient(135deg,#fbbf24,#c2410c)' },
      { ini: 'PR', name: 'Paula Ribeiro', g: 'linear-gradient(135deg,#60a5fa,#1d4ed8)' },
    ];

    /* =====================================================================
       PANEL A · loja online (light stage)
       ===================================================================== */
    const A = full(root, 1, { overflow: 'hidden' });
    const bgA = KIT.bg(A, { base: 'light', vignette: false, particles: 26, seed: 'montagem-a' });
    // brand diagonal band (same slant as the wipe) + soft corner shading
    const bandA = div(A, { position: 'absolute', left: '980px', top: '-420px', width: '560px', height: '1900px', transformOrigin: '50% 50%',
      background: 'linear-gradient(90deg, rgba(21,219,168,0), rgba(21,219,168,.075) 42%, rgba(21,219,168,.075) 58%, rgba(21,219,168,0))' });
    div(A, { position: 'absolute', inset: '0', background: 'radial-gradient(120% 100% at 45% 45%, rgba(11,43,41,0) 58%, rgba(11,43,41,.13) 100%)' });
    const floorA = div(A, { position: 'absolute', left: '1090px', top: '960px', width: '520px', height: '80px', borderRadius: '50%', zIndex: 2,
      background: 'radial-gradient(closest-side, rgba(11,43,41,.30), rgba(11,43,41,0))' });
    // floating product tiles (depth-of-field layers around the phone)
    const FLOAT = [
      { x: 1705, y: 290, sz: 150, g: TILES[1].g, rot: 12, blur: 2.5, depth: 0.55, z: 2 },
      { x: 1075, y: 858, sz: 112, g: TILES[2].g, rot: -11, blur: 5, depth: 0.35, z: 2 },
      { x: 1772, y: 640, sz: 88, g: TILES[3].g, rot: 20, blur: 1.2, depth: 0.8, z: 2 },
    ].map((f, i) => {
      const el = div(A, { position: 'absolute', left: `${f.x - f.sz / 2}px`, top: `${f.y - f.sz / 2}px`, width: `${f.sz}px`, height: `${f.sz}px`, borderRadius: `${f.sz * 0.16}px`,
        background: f.g, display: 'grid', placeItems: 'center', color: 'rgba(255,255,255,.75)', zIndex: f.z, filter: `blur(${f.blur}px)`,
        boxShadow: '0 24px 50px rgba(11,43,41,.22)' }, I('shirt', { size: f.sz * 0.42, sw: 1.6 }));
      return Object.assign(f, { el, i });
    });

    const rigA = full(A, 3, { perspective: `${PERSP}px`, perspectiveOrigin: '960px 540px' });
    const phA = KIT.phone(rigA, { x: PH.x, y: PH.y, w: PH.w });
    phA.el.firstChild.style.boxShadow = '0 60px 110px rgba(11,43,41,.36), 0 18px 40px rgba(11,43,41,.18), 0 0 0 2px rgba(255,255,255,.06) inset';

    /* ---------- store screen ---------- */
    const SA = phA.body;
    SA.style.background = '#ffffff';
    div(SA, { position: 'absolute', left: '14px', right: '14px', top: '4px', height: '40px', borderRadius: '20px', background: '#f1f4f3', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', fontSize: '14.5px', fontWeight: 600, color: '#374151' },
      I('lock', { size: 13, color: '#16a34a', sw: 2.6 }) + '<span>modafashion.atacado.store</span>');
    const headA = div(SA, { position: 'absolute', left: '18px', right: '18px', top: '54px', height: '48px', display: 'flex', alignItems: 'center', gap: '10px' });
    div(headA, { width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg,#38cc9c,#066767)', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: '15px', flex: 'none' }, 'MF');
    div(headA, { flex: '1', lineHeight: 1.15 }, '<div style="font-weight:800;font-size:17px;color:#111">Moda Fashion</div><div style="font-weight:700;font-size:12.5px;color:#27ae8f">Atacado</div>');
    div(headA, { color: '#374151', display: 'flex' }, I('search', { size: 21 }));
    const bagA = div(headA, { position: 'relative', color: '#111', display: 'flex', marginLeft: '8px' }, I('shopping-bag', { size: 23 }));
    const bagBadge = div(bagA, { position: 'absolute', right: '-8px', top: '-7px', width: '18px', height: '18px', borderRadius: '9px', background: '#15dba8', color: '#04201b', fontSize: '11px', fontWeight: 800, display: 'grid', placeItems: 'center', transform: 'scale(0)' }, '1');

    const banner = div(SA, { position: 'absolute', left: '16px', right: '16px', top: '112px', height: '170px', borderRadius: '18px', overflow: 'hidden', color: '#fff',
      background: 'linear-gradient(135deg,#fb7185 0%,#ea580c 68%,#c2410c 100%)' });
    div(banner, { position: 'absolute', right: '-22px', top: '-10px', transform: 'rotate(-12deg)', color: 'rgba(255,255,255,.22)', display: 'flex' }, I('shirt', { size: 180, sw: 1.3 }));
    div(banner, { position: 'absolute', left: '20px', top: '20px', fontSize: '11.5px', fontWeight: 800, letterSpacing: '.16em', opacity: 0.92 }, 'NOVA COLEÇÃO');
    div(banner, { position: 'absolute', left: '19px', top: '40px', fontFamily: 'var(--font-display)', fontSize: '34px', lineHeight: 1.04 }, 'Coleção<br>Verão');
    div(banner, { position: 'absolute', left: '20px', top: '124px', display: 'inline-flex', alignItems: 'center', gap: '3px', padding: '6px 10px 6px 14px', borderRadius: '999px', background: '#fff', color: '#c2410c', fontSize: '13px', fontWeight: 800 },
      'Ver peças' + I('chevron-right', { size: 15, sw: 2.6 }));
    const sheenA = div(banner, { position: 'absolute', top: '-40px', height: '260px', left: '0', width: '90px', background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.4), rgba(255,255,255,0))' });

    div(SA, { position: 'absolute', left: '18px', right: '18px', top: '296px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' },
      '<span style="font-weight:800;font-size:17px;color:#111">Destaques</span><span style="font-weight:700;font-size:13px;color:#27ae8f">Ver tudo</span>');
    const tilesA = TILES.map((tt, i) => {
      const c = i % 2, r = Math.floor(i / 2);
      const el = div(SA, { position: 'absolute', left: `${16 + c * 191}px`, top: `${328 + r * 214}px`, width: '179px', height: '204px' });
      const img = div(el, { position: 'relative', width: '179px', height: '146px', borderRadius: '14px', background: tt.g, display: 'grid', placeItems: 'center', color: 'rgba(255,255,255,.82)' }, I('shirt', { size: 58, sw: 1.6 }));
      div(img, { position: 'absolute', right: '8px', top: '8px', width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255,255,255,.9)', color: '#737373', display: 'grid', placeItems: 'center' }, I('heart', { size: 15, sw: 2.2 }));
      div(el, { marginTop: '8px', fontSize: '15px', fontWeight: 700, color: '#111', whiteSpace: 'nowrap' }, tt.name);
      div(el, { marginTop: '2px', fontSize: tt.price ? '14px' : '12.5px', fontWeight: tt.price ? 800 : 600, color: tt.price ? '#0b2b29' : '#8a8a8a', whiteSpace: 'nowrap' }, tt.sub);
      return { el, img };
    });

    /* ---------- bottom sheet: Sua sacola ---------- */
    const dimA = div(SA, { position: 'absolute', inset: '0', background: 'rgba(8,20,18,.42)', opacity: 0 });
    const SHEET_H = 452, SHEET_TOP = 818 - SHEET_H;
    const sheet = div(SA, { position: 'absolute', left: '0', right: '0', bottom: '0', height: `${SHEET_H}px`, background: '#fff', borderRadius: '26px 26px 0 0', boxShadow: '0 -14px 40px rgba(0,0,0,.2)' });
    div(sheet, { position: 'absolute', left: '179px', top: '10px', width: '44px', height: '5px', borderRadius: '3px', background: '#d4d4d4' });
    div(sheet, { position: 'absolute', left: '20px', right: '20px', top: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
      `<span style="font-weight:800;font-size:22px;color:#111">Sua sacola</span><span style="width:32px;height:32px;border-radius:50%;background:#f4f4f5;display:grid;place-items:center;color:#525252">${I('x', { size: 17, sw: 2.4 })}</span>`);
    const itemA = div(sheet, { position: 'absolute', left: '20px', right: '20px', top: '72px', height: '64px', display: 'flex', alignItems: 'center', gap: '14px' });
    div(itemA, { width: '64px', height: '64px', borderRadius: '12px', background: TILES[0].g, display: 'grid', placeItems: 'center', color: 'rgba(255,255,255,.85)', flex: 'none' }, I('shirt', { size: 30, sw: 1.8 }));
    div(itemA, { lineHeight: 1.3 }, '<div style="font-weight:700;font-size:16.5px;color:#111;white-space:nowrap">Vestido midi · terracota</div><div style="font-weight:600;font-size:14px;color:#737373">R$ 389 a grade</div>');
    div(sheet, { position: 'absolute', left: '20px', top: '152px', fontSize: '13.5px', fontWeight: 700, color: '#525252' }, 'Quantidade por tamanho');
    const steps = ['P', 'M', 'G', 'GG'].map((sz, i) => {
      const box = div(sheet, { position: 'absolute', left: `${20 + i * 92}px`, top: '178px', width: '84px', height: '84px', borderRadius: '14px', border: '1.5px solid #e5e5e5', background: '#fff' });
      div(box, { position: 'absolute', left: '0', right: '0', top: '10px', textAlign: 'center', fontSize: '15px', fontWeight: 800, color: '#111' }, sz);
      const row = div(box, { position: 'absolute', left: '8px', right: '8px', bottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' });
      div(row, { width: '22px', height: '22px', borderRadius: '50%', background: '#f4f4f5', color: '#a3a3a3', display: 'grid', placeItems: 'center' }, I('minus', { size: 13, sw: 3 }));
      const val = div(row, { fontSize: '17px', fontWeight: 800, color: '#a3a3a3', fontVariantNumeric: 'tabular-nums', display: 'inline-block' }, '0');
      const plus = div(row, { width: '22px', height: '22px', borderRadius: '50%', background: '#ecfdf5', color: '#27ae8f', display: 'grid', placeItems: 'center' }, I('plus', { size: 13, sw: 3 }));
      return { box, val, plus };
    });
    const minRow = div(sheet, { position: 'absolute', left: '20px', right: '20px', top: '278px', height: '24px', display: 'flex', alignItems: 'center', gap: '8px', transformOrigin: '0% 50%' });
    const minIc = div(minRow, { position: 'relative', width: '20px', height: '20px', flex: 'none' });
    const minIc0 = div(minIc, { position: 'absolute', inset: '0', color: '#a3a3a3', display: 'flex' }, I('circle', { size: 20, sw: 2.2 }));
    const minIc1 = div(minIc, { position: 'absolute', inset: '0', color: '#16a34a', display: 'flex', opacity: 0 }, I('circle-check', { size: 20, sw: 2.4 }));
    const minTxt = div(minRow, { position: 'relative', flex: '1', height: '20px' });
    const minT0 = div(minTxt, { position: 'absolute', left: '0', top: '0', fontSize: '14.5px', lineHeight: '20px', fontWeight: 700, color: '#737373', whiteSpace: 'nowrap' }, 'Pedido mínimo');
    const minT1 = div(minTxt, { position: 'absolute', left: '0', top: '0', fontSize: '14.5px', lineHeight: '20px', fontWeight: 800, color: '#16a34a', whiteSpace: 'nowrap', opacity: 0 }, 'Pedido mínimo atingido');
    const minBar = div(minRow, { width: '92px', height: '6px', borderRadius: '3px', background: '#eef2f1', overflow: 'hidden', flex: 'none' });
    const minFill = div(minBar, { width: '0%', height: '100%', borderRadius: '3px', background: '#38cc9c' });
    const totRow = div(sheet, { position: 'absolute', left: '20px', right: '20px', top: '314px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f0f0f0' });
    div(totRow, { fontSize: '15px', fontWeight: 600, color: '#737373' }, 'Total');
    const totV = div(totRow, { position: 'relative', width: '140px', height: '30px' });
    const tot0 = div(totV, { position: 'absolute', right: '0', top: '0', fontSize: '22px', lineHeight: '30px', fontWeight: 800, color: '#d4d4d4' }, '—');
    const tot1 = div(totV, { position: 'absolute', right: '0', top: '0', fontSize: '24px', lineHeight: '30px', fontWeight: 800, color: '#0b2b29', opacity: 0, transformOrigin: '100% 50%' }, 'R$ 389');
    const btnA = div(sheet, { position: 'absolute', left: '20px', right: '20px', top: '364px', height: '60px', borderRadius: '16px', background: '#25d366', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '18px', fontWeight: 800, overflow: 'hidden', boxShadow: '0 10px 24px rgba(37,211,102,.35)' },
      I('message-circle', { size: 23, sw: 2.3 }) + '<span>Finalizar pelo WhatsApp</span>');
    const ripA = div(btnA, { position: 'absolute', left: '0', top: '0', width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,.5)', opacity: 0 });
    // tap payoff: a white glint sweeping across the button + a 1–2 frame white flash
    const glintA = div(btnA, { position: 'absolute', top: '-20px', left: '0', width: '80px', height: '100px', opacity: 0,
      background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.85) 50%, rgba(255,255,255,0))' });
    const flashA = div(btnA, { position: 'absolute', inset: '0', background: '#fff', opacity: 0 });
    // touch indicator (iOS-simulator style)
    const touch = div(SA, { position: 'absolute', left: '0', top: '0', width: '54px', height: '54px', borderRadius: '50%', background: 'rgba(17,24,39,.2)', border: '2px solid rgba(255,255,255,.9)', boxShadow: '0 4px 14px rgba(0,0,0,.22)', opacity: 0, zIndex: 10 });
    const touchRing = div(SA, { position: 'absolute', left: '0', top: '0', width: '54px', height: '54px', borderRadius: '50%', border: '2.5px solid rgba(17,24,39,.35)', opacity: 0, zIndex: 10 });
    const TAPS = [
      { tIn: 0.38, tTap: TAP1, from: [196, 520], to: [100, 398] },
      { tIn: 1.22, tTap: TAP2, from: [336, 690], to: [358, SHEET_TOP + 396] },   // right end of the button: never covers the label
    ];

    // WhatsApp reward badge next to the phone after the tap
    const WA_C = [1616, 846];
    const waRing = KIT.pulse(A, { x: WA_C[0], y: WA_C[1], r: 110, color: '#25d366', sw: 3 });
    waRing.el.style.zIndex = 4;
    const waBadge = div(A, { position: 'absolute', left: `${WA_C[0] - 44}px`, top: `${WA_C[1] - 44}px`, width: '88px', height: '88px', borderRadius: '50%', background: 'linear-gradient(145deg,#3ae47d,#1fb457)', display: 'grid', placeItems: 'center', color: '#fff', zIndex: 5,
      boxShadow: '0 18px 40px rgba(18,140,126,.45), inset 0 1px 0 rgba(255,255,255,.35)', opacity: 0 }, I('message-circle', { size: 44, sw: 2.2 }));

    /* ---------- HUD A ---------- */
    const ebA = KIT.eyebrow(A, 'LOJA · ATACADO', { x: 120, y: 320, align: 'left', color: C.tealDark, size: 20 });
    ebA.el.style.zIndex = 6;
    const hA = KIT.headline(A, 'Sua loja\n*online*, pronta.', { size: 96, x: 120, y: 470, w: 1000, align: 'left', color: '#0b2b29' });
    hA.el.style.zIndex = 6;
    hA.el.querySelectorAll('.kit-em').forEach((e) => { e.style.color = C.tealDark; });
    tl.fromTo(ebA.line, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'expo.out' }, 0);
    tl.fromTo(ebA.label, { opacity: 0, x: -18 }, { opacity: 1, x: 0, duration: 0.45, ease: 'power3.out' }, 0.03);
    KIT.revealWords(tl, hA.units, 0.10, { dur: 0.6, stagger: 0.07 });

    /* =====================================================================
       PANEL B · link da bio em rodízio (dark stage)
       ===================================================================== */
    const B = full(root, 2, { overflow: 'hidden' });
    const glowB = GTR.glow(B, { x: 1340, y: 600, r: 560, color: '21,219,168', a: 0.2 });
    div(B, { position: 'absolute', left: '-80px', top: '150px', width: '1300px', height: '760px', background: 'radial-gradient(closest-side, rgba(0,21,22,.72), rgba(0,21,22,0))' });
    const rigB = full(B, 3, { perspective: `${PERSP}px`, perspectiveOrigin: '960px 540px' });
    const phB = KIT.phone(rigB, { x: PH.x, y: PH.y, w: PH.w });
    const SB = phB.body;
    SB.style.background = '#ffffff';
    const cover = div(SB, { position: 'absolute', left: '0', right: '0', top: '0', height: '168px', overflow: 'hidden', background: 'linear-gradient(135deg,#0b2b29 0%,#12574d 55%,#27ae8f 100%)' });
    div(cover, { position: 'absolute', inset: '0', backgroundImage: 'radial-gradient(rgba(255,255,255,.14) 1.2px, transparent 1.2px)', backgroundSize: '16px 16px' });
    div(SB, { position: 'absolute', left: '147px', top: '114px', width: '108px', height: '108px', borderRadius: '50%', background: 'linear-gradient(135deg,#38cc9c,#066767)', border: '5px solid #fff', boxShadow: '0 10px 24px rgba(0,0,0,.18)', display: 'grid', placeItems: 'center', color: '#fff', fontWeight: 800, fontSize: '34px' }, 'MF');
    div(SB, { position: 'absolute', left: '0', right: '0', top: '234px', textAlign: 'center', fontWeight: 800, fontSize: '26px', color: '#111' }, 'Moda Fashion');
    div(SB, { position: 'absolute', left: '0', right: '0', top: '270px', textAlign: 'center', fontWeight: 500, fontSize: '16px', color: '#737373' }, '@modafashion');
    const stackB = CONS.map((c, i) => div(SB, { position: 'absolute', left: `${112 + i * 43}px`, top: '314px', width: '48px', height: '48px', borderRadius: '50%', background: c.g, color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: '15px', boxShadow: '0 0 0 3px #fff', zIndex: 1 + i }, c.ini));
    const BTN_B = { top: 386, h: 66 };
    const btnB = div(SB, { position: 'absolute', left: '20px', right: '20px', top: `${BTN_B.top}px`, height: `${BTN_B.h}px`, borderRadius: '18px', background: '#25d366', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '19px', fontWeight: 800, boxShadow: '0 12px 26px rgba(37,211,102,.4)' },
      I('message-circle', { size: 24, sw: 2.3 }) + '<span>Falar com consultora</span>');
    const stB = div(SB, { position: 'absolute', left: '0', right: '0', top: '468px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', fontSize: '14.5px', fontWeight: 600, color: '#525252' });
    const onDot = div(stB, { width: '9px', height: '9px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 0 3px rgba(34,197,94,.22)', flex: 'none' });
    div(stB, {}, 'online agora · responde em minutos');
    [['store', 'Loja online'], ['shirt', 'Catálogo Coleção Verão'], ['map-pin', 'Onde estamos']].forEach(([ic, label], i) => div(SB, { position: 'absolute', left: '20px', right: '20px', top: `${516 + i * 68}px`, height: '56px', borderRadius: '16px', border: '1.5px solid #e5e5e5', display: 'flex', alignItems: 'center', gap: '12px', padding: '0 16px', fontSize: '16px', fontWeight: 700, color: '#111' },
      `<span style="color:#27ae8f;display:flex">${I(ic, { size: 20 })}</span><span style="flex:1">${label}</span><span style="color:#a3a3a3;display:flex">${I('chevron-right', { size: 18 })}</span>`));
    div(SB, { position: 'absolute', left: '0', right: '0', top: '742px', display: 'flex', justifyContent: 'center', gap: '26px', color: '#a3a3a3' }, I('instagram', { size: 22 }) + I('globe', { size: 22 }) + I('mail', { size: 22 }));
    const BTN_LOCAL = bodyToLocal(46, BTN_B.top + BTN_B.h / 2);   // leads leave from the button's leading edge

    /* ---------- consultant cards ---------- */
    const CARD = { y: 700, w: 200, h: 90 };
    const cardsB = CONS.map((c, i) => {
      const x = 120 + i * 220;
      const el = KIT.card(B, { x, y: CARD.y, w: CARD.w, h: CARD.h, pad: 0, radius: 18, dark: true });
      Object.assign(el.style, { zIndex: 4, display: 'flex', alignItems: 'center', gap: '12px', padding: '0 14px', transformOrigin: '50% 100%',
        background: 'linear-gradient(180deg, rgba(20,52,48,.94), rgba(7,28,27,.94))' });
      KIT.avatar(el, { text: c.ini, size: 46, bg: c.g });
      div(el, { lineHeight: 1.25, minWidth: 0 }, `<div style="font-weight:700;font-size:16.5px;white-space:nowrap">${c.name}</div><div style="font-weight:500;font-size:13px;color:rgba(255,255,255,.55)">consultora</div>`);
      const badge = div(el, { position: 'absolute', right: '-13px', top: '-13px', width: '38px', height: '38px', borderRadius: '50%', background: '#15dba8', color: '#04201b', display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: '15px',
        boxShadow: '0 0 0 3px #03201d, 0 0 22px rgba(21,219,168,.7)', transform: 'scale(0)' }, '+1');
      return { el, badge, x, port: [x + CARD.w + 13 - 19, CARD.y - 13 + 19], t0: 2.12 + i * 0.06 };
    });
    const leadCv = GTR.canvas(B, { z: 5 });
    const lx = leadCv.ctx;

    /* ---------- HUD B ---------- */
    const ebB = KIT.eyebrow(B, 'LINK DA BIO', { x: 120, y: 250, align: 'left', color: C.vibrant, size: 20 });
    ebB.el.style.zIndex = 6;
    const hB = KIT.headline(B, 'Botão de WhatsApp\nem *rodízio*.', { size: 88, x: 120, y: 400, w: 1040, align: 'left', glow: true });
    hB.el.style.zIndex = 6;
    tl.fromTo(ebB.line, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'expo.out' }, 1.96);
    tl.fromTo(ebB.label, { opacity: 0, x: -18 }, { opacity: 1, x: 0, duration: 0.45, ease: 'power3.out' }, 1.99);
    KIT.revealWords(tl, hB.units, 2.06, { dur: 0.5, stagger: 0.06 });

    /* =====================================================================
       PANEL C · fluxos (Beta) — dark flow canvas
       ===================================================================== */
    const Cp = full(root, 3, { overflow: 'hidden' });
    const gridC = div(Cp, { position: 'absolute', left: '-48px', top: '-48px', width: '2016px', height: '1176px',
      backgroundImage: 'radial-gradient(#ffffff14 1.5px, transparent 1.5px)', backgroundSize: '24px 24px',
      webkitMaskImage: 'radial-gradient(80% 75% at 50% 52%, #000 45%, transparent 100%)', maskImage: 'radial-gradient(80% 75% at 50% 52%, #000 45%, transparent 100%)' });
    const glowC = GTR.glow(Cp, { x: 960, y: 560, r: 780, color: '21,219,168', a: 0.1 });

    const NW = 250, NH = 80;
    const NODES = [
      { id: 'trig', x: 125, y: 500, w: NW, title: 'Gatilho', sub: 'Inativo há 60 dias', icon: 'zap', color: '#15dba8', at: 4.00, dashed: true },
      { id: 'wa', x: 465, y: 500, w: NW, title: 'Enviar WhatsApp', sub: 'coleção nova', icon: 'message-circle', color: '#25d366', at: 4.25 },
      { id: 'if', x: 805, y: 500, w: 210, title: 'Comprou?', sub: '', icon: 'git-fork', color: '#f59e0b', at: 4.50 },
      { id: 'end', x: 1125, y: 360, w: NW, title: 'Fim', sub: 'meta: compra', icon: 'target', color: '#15dba8', at: 4.75 },
      { id: 'wait', x: 1125, y: 640, w: NW, title: 'Aguardar 2 dias', sub: '', icon: 'clock', color: '#94a3b8', at: 4.75 },
      { id: 'sms', x: 1545, y: 640, w: NW, title: 'Enviar SMS', sub: '', icon: 'message-square', color: '#818cf8', at: 5.00 },
    ];
    const EDGES = [
      { a: [375, 540], b: [465, 540], col: '#15dba8', t0: 4.05, t1: 4.25 },
      { a: [715, 540], b: [805, 540], col: '#15dba8', t0: 4.30, t1: 4.50 },
      { a: [1015, 540], b: [1125, 400], col: '#16a34a', t0: 4.55, t1: 4.75, label: 'sim', lc: ['#4ade80', 'rgba(22,163,74,.16)', 'rgba(22,163,74,.7)'] },
      { a: [1015, 540], b: [1125, 680], col: '#dc2626', t0: 4.55, t1: 4.75, label: 'não', lc: ['#fca5a5', 'rgba(220,38,38,.16)', 'rgba(220,38,38,.7)'] },
      { a: [1375, 680], b: [1545, 680], col: '#15dba8', t0: 4.80, t1: 5.00, label: 'janela fechada', lc: ['#e9d5ff', 'rgba(168,85,247,.28)', '#a855f7'] },
    ];
    const edgeD = (e) => {
      const dx = (e.b[0] - e.a[0]) * 0.5;
      return `M${e.a[0]},${e.a[1]} C${e.a[0] + dx},${e.a[1]} ${e.b[0] - dx},${e.b[1]} ${e.b[0]},${e.b[1]}`;
    };
    // the Revenda Bella token path: through WhatsApp and "Comprou?", out on "sim", across "Fim" to its dock
    // (the dock sits on Fim's top-right corner; the token rides ABOVE the nodes and ends exactly on it)
    const DOCK = [1367, 368];
    const TOKEN_D = `M375,540 L805,540 L1015,540 C1070,540 1070,400 1125,400 C1250,400 1300,${DOCK[1]} ${DOCK[0]},${DOCK[1]}`;
    // gold trail = only the connector stretches of her route (nodes are 92 % opaque, a line under them would ghost through)
    // s0 = distance along TOKEN_D where each stretch starts
    const TRAIL = [{ d: 'M375,540 L465,540', s0: 0 }, { d: 'M715,540 L805,540', s0: 340 }, { d: 'M1015,540 C1070,540 1070,400 1125,400', s0: 640 }];
    const TOKEN_T = [4.30, 5.00];
    const FIM_OK = 5.02;
    const TOKEN_ROUTE = [0, 1, 2];                           // edges she travels (lit gold behind her)
    const RB_STYLE = { background: 'linear-gradient(135deg,#f3b315,#a16207)', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: '15px', fontFamily: 'var(--font-ui)',
      boxShadow: '0 0 0 3px #f3b315, 0 0 24px rgba(243,179,21,.65)' };

    const buildFlow = (parent, wire) => {
      const world = full(parent, 1, { transformOrigin: '960px 560px' });
      const svg = s('svg', { width: 1920, height: 1080, viewBox: '0 0 1920 1080', style: { position: 'absolute', left: '0', top: '0', overflow: 'visible' } }, world);
      const edges = EDGES.map((e) => {
        const path = s('path', { d: edgeD(e), fill: 'none', stroke: wire ? 'rgba(160,190,185,.45)' : e.col, 'stroke-width': wire ? 1.6 : 3, 'stroke-linecap': 'round' }, svg);
        const len = path.getTotalLength();
        if (wire) path.setAttribute('stroke-dasharray', '5 7');
        else { path.style.strokeDasharray = `${len}`; path.style.filter = `drop-shadow(0 0 6px ${e.col}aa)`; }
        const ports = [e.a, e.b].map((pt) => s('circle', { cx: pt[0], cy: pt[1], r: 5, fill: wire ? 'none' : '#06201d', stroke: wire ? 'rgba(160,190,185,.5)' : e.col, 'stroke-width': 2 }, svg));
        const packets = wire ? [] : [0, 1].map(() => s('circle', { r: 4.5, fill: '#fff', style: { filter: `drop-shadow(0 0 5px ${e.col})` } }, svg));
        let label = null;
        if (e.label) {
          const mid = path.getPointAtLength(len / 2);
          label = div(world, { position: 'absolute', left: `${mid.x}px`, top: `${mid.y}px`, zIndex: 3, padding: '4px 11px', borderRadius: '999px', whiteSpace: 'nowrap',
            fontSize: '13px', fontWeight: 800, letterSpacing: '.02em', fontFamily: 'var(--font-ui)',
            color: wire ? 'rgba(200,215,212,.5)' : e.lc[0], background: wire ? 'rgba(0,0,0,0)' : `linear-gradient(${e.lc[1]},${e.lc[1]}), #041a18`,
            border: wire ? '1px dashed rgba(160,190,185,.45)' : `1px solid ${e.lc[2]}`, transform: 'translate(-50%,-50%)' }, e.label);
        }
        return Object.assign({}, e, { path, len, ports, packets, label });
      });
      let token = null, tokenPath = null, tokenLen = 0, trail = [];
      if (!wire) {
        tokenPath = s('path', { d: TOKEN_D, fill: 'none', stroke: 'none' }, svg);
        tokenLen = tokenPath.getTotalLength();
        // gold trail: her route lights up behind her (only the connector stretches show; nodes cover the rest)
        trail = TRAIL.map((tr) => {
          const path = s('path', { d: tr.d, fill: 'none', stroke: '#f3b315', 'stroke-width': 3.5, 'stroke-linecap': 'round',
            style: { opacity: 0, filter: 'drop-shadow(0 0 5px rgba(243,179,21,.75))' } }, svg);
          const len = path.getTotalLength();
          path.style.strokeDasharray = `${len} ${len + 10}`;
          return { path, len, s0: tr.s0 };
        });
        token = div(world, Object.assign({ position: 'absolute', left: '-22px', top: '-22px', width: '44px', height: '44px', borderRadius: '50%', zIndex: 6, opacity: 0 }, RB_STYLE), 'RB');
      }
      const nodes = NODES.map((n) => {
        const el = KIT.flowNode(world, { x: n.x, y: n.y, w: n.w, title: n.title, sub: n.sub, icon: n.icon, color: n.color, dark: true });
        Object.assign(el.style, { height: `${NH}px`, zIndex: 4, transformOrigin: '50% 50%' });
        const tile = el.firstChild;
        if (wire) {
          Object.assign(el.style, { background: 'rgba(0,0,0,0)', border: '1.5px dashed rgba(160,190,185,.42)', boxShadow: 'none', color: 'rgba(210,225,222,.42)' });
          Object.assign(tile.style, { background: 'rgba(0,0,0,0)', border: '1px solid rgba(160,190,185,.35)', color: 'rgba(160,190,185,.6)' });
        } else if (n.dashed) {
          el.style.border = '1.5px dashed rgba(21,219,168,.65)';
        }
        return Object.assign({}, n, { el, tile });
      });
      let dock = null, dockCheck = null, okRing = null;
      const dockBox = { position: 'absolute', left: `${DOCK[0] - 22}px`, top: `${DOCK[1] - 22}px`, width: '44px', height: '44px', borderRadius: '50%', zIndex: 6 };
      const checkBox = { position: 'absolute', right: '-8px', bottom: '-6px', width: '22px', height: '22px', borderRadius: '50%', display: 'grid', placeItems: 'center' };
      if (!wire) {
        // the token hands off to the dock at TOKEN_T[1] (same pixels, same look) — no scale-from-0
        dock = div(world, Object.assign({}, dockBox, RB_STYLE, { opacity: 0 }), 'RB');
        dockCheck = div(dock, Object.assign({}, checkBox, { background: '#16a34a', color: '#fff', boxShadow: '0 0 0 2.5px #04201b', transform: 'scale(0)' }), I('check', { size: 14, sw: 3.2 }));
        okRing = KIT.pulse(world, { x: 1250, y: 400, r: 190, color: '#4ade80', sw: 3 });
        okRing.el.style.zIndex = 3;
      } else {
        // wireframe keeps the story payoff: RB + check as a gold/green outline once the scan has passed
        dock = div(world, Object.assign({}, dockBox, { border: '1.5px solid rgba(243,179,21,.75)', boxShadow: '0 0 14px rgba(243,179,21,.25)', color: 'rgba(243,179,21,.85)',
          display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: '15px', fontFamily: 'var(--font-ui)', boxSizing: 'border-box', opacity: 0 }), 'RB');
        dockCheck = div(dock, Object.assign({}, checkBox, { border: '1.5px solid rgba(74,222,128,.75)', color: 'rgba(74,222,128,.9)', background: '#03211e', boxSizing: 'border-box', right: '-9px', bottom: '-7px' }), I('check', { size: 13, sw: 2.6 }));
      }
      const set = (t) => {
        // camera: settle from a tilted plate, then a slow push
        const e = p(t, 3.75, 4.9, 'expo.out');
        const rx = lerp(14, 0, e) + noise(t * 0.4, 12.5) * 0.6;
        const sc = lerp(1.07, 1, e) + 0.028 * p(t, 4.6, 6.0, 'sine.inOut');
        world.style.transform = `perspective(1800px) translateY(${lerp(40, 0, e)}px) rotateX(${rx}deg) scale(${sc})`;
        if (wire) {
          // placeholders cross-fade out only once the live node/label covers them (live is opaque by at+0.08 /
          // t0+0.20), so a slot is never empty; they come back for the scan
          const back = t >= SCAN[0];
          for (const n of nodes) {
            n.el.style.opacity = back ? 1 : 1 - inv(t, n.at + 0.06, n.at + 0.14);          // dashed frame holds the slot
            const c = back ? 1 : 1 - inv(t, n.at, n.at + 0.05);                          // its text/icon dissolve into the live one
            for (const ch of n.el.children) ch.style.opacity = c;
          }
          for (const ed of edges) if (ed.label) ed.label.style.opacity = back ? 1 : 1 - inv(t, ed.t0 + 0.18, ed.t0 + 0.26);
          // her route stays gold in the wireframe
          edges.forEach((ed, i) => {
            if (!TOKEN_ROUTE.includes(i)) return;
            const col = back ? 'rgba(243,179,21,.7)' : 'rgba(160,190,185,.45)';
            ed.path.setAttribute('stroke', col);
            ed.ports.forEach((c) => c.setAttribute('stroke', back ? 'rgba(243,179,21,.75)' : 'rgba(160,190,185,.5)'));
          });
          dock.style.opacity = back ? 1 : 0;
          return;
        }
        // Revenda Bella's token position (drives the node pass-glow below)
        const tp = p(t, TOKEN_T[0], TOKEN_T[1], 'power1.inOut');
        const pt = tokenPath.getPointAtLength(tokenLen * tp);
        const tokOn = t >= TOKEN_T[0] - 0.06 && t < TOKEN_T[1];
        for (const n of nodes) {
          const k = p(t, n.at, n.at + 0.42, 'back.out(1.7)');
          n.el.style.opacity = clamp(inv(t, n.at, n.at + 0.08));
          n.el.style.transform = `translateY(${(1 - k) * 18}px) scale(${0.84 + 0.16 * k})`;
          const flash = t >= n.at ? 1 - inv(t, n.at, n.at + 0.6) : 0;
          const ok = n.id === 'end' ? p(t, FIM_OK, FIM_OK + 0.3, 'power2.out') : 0;
          if (n.id === 'end') {
            n.el.style.borderColor = ok > 0 ? `rgba(74,222,128,${0.35 + 0.55 * ok})` : 'rgba(21,219,168,.35)';
            n.tile.style.background = ok > 0.5 ? 'rgba(22,163,74,.3)' : '#15dba822';
            n.tile.style.color = ok > 0.5 ? '#4ade80' : '#15dba8';
          }
          const gl = Math.max(flash * 0.55, ok * 0.5);
          // gold rim-light while the token is crossing this node
          const cx = n.x + n.w / 2, cy = n.y + NH / 2;
          const pass = tokOn && Math.abs(pt.y - cy) < NH ? clamp(1 - Math.max(0, Math.abs(pt.x - cx) - n.w / 2 + 30) / 60) : 0;
          n.el.style.boxShadow = `0 20px 50px rgba(0,0,0,0.45), 0 0 30px rgba(21,219,168,${0.12 + gl * 0.5})` + (ok > 0 ? `, 0 0 40px rgba(74,222,128,${ok * 0.45})` : '')
            + (pass > 0 ? `, 0 0 0 1.5px rgba(243,179,21,${0.55 * pass}), 0 0 34px rgba(243,179,21,${0.3 * pass})` : '');
        }
        for (const ed of edges) {
          const d = p(t, ed.t0, ed.t1, 'power2.inOut');
          ed.path.style.strokeDashoffset = `${ed.len * (1 - d)}`;
          ed.path.style.opacity = d > 0 ? 1 : 0;
          ed.ports.forEach((pt, i) => { const k = p(t, i ? ed.t1 - 0.02 : ed.t0, (i ? ed.t1 - 0.02 : ed.t0) + 0.25, 'back.out(2.2)'); pt.setAttribute('r', 5 * Math.max(0, k)); pt.style.opacity = t >= ed.t0 ? 1 : 0; });
          if (ed.label) {
            const k = p(t, ed.t0 + 0.12, ed.t0 + 0.42, 'back.out(2)');
            ed.label.style.opacity = clamp(inv(t, ed.t0 + 0.12, ed.t0 + 0.2));
            ed.label.style.transform = `translate(-50%,-50%) scale(${0.6 + 0.4 * k})`;
          }
          // packets flow once the flow is live
          ed.packets.forEach((c, j) => {
            if (t < 5.0 || d < 1) { c.style.opacity = 0; return; }
            const q = fract((t - 5.0) / 0.62 + j * 0.5);
            const pt = ed.path.getPointAtLength(ed.len * q);
            c.setAttribute('cx', pt.x); c.setAttribute('cy', pt.y);
            c.style.opacity = Math.sin(Math.PI * q) * clamp(inv(t, 5.0, 5.15));
          });
        }
        // Revenda Bella's token: rides ABOVE the flow, leaves a gold trail, and becomes the dock at TOKEN_T[1]
        const tIn = p(t, TOKEN_T[0] - 0.06, TOKEN_T[0] + 0.2, 'back.out(2.4)');
        token.style.opacity = tokOn ? 1 : 0;
        token.style.transform = `translate(${pt.x}px, ${pt.y}px) scale(${Math.max(0, tIn)})`;
        for (const tr of trail) {
          const k = clamp(tokenLen * tp - tr.s0, 0, tr.len);
          tr.path.style.opacity = t >= TOKEN_T[0] && k > 0 ? 0.88 : 0;
          tr.path.style.strokeDashoffset = `${tr.len - k}`;
        }
        const docked = t >= TOKEN_T[1];
        const bump = docked ? Math.sin(Math.PI * inv(t, TOKEN_T[1], TOKEN_T[1] + 0.24)) : 0;
        dock.style.opacity = docked ? 1 : 0;
        dock.style.transform = `scale(${1 + 0.15 * bump})`;
        dock.style.boxShadow = `0 0 0 3px #f3b315, 0 0 ${24 + 16 * bump}px rgba(243,179,21,${0.65 + 0.25 * bump})`;
        dockCheck.style.transform = `scale(${Math.max(0, p(t, FIM_OK + 0.1, FIM_OK + 0.4, 'back.out(3)'))})`;
        okRing.set(inv(t, FIM_OK, FIM_OK + 0.6));
      };
      return { world, set };
    };

    const wireG = full(Cp, 1);
    const liveG = full(Cp, 2);
    const flowWire = buildFlow(wireG, true);
    const flowLive = buildFlow(liveG, false);

    /* ---------- HUD C: headline + BETA pill (live copy + wireframe copy for the scan) ---------- */
    const HC_TEXT = 'Fluxos, não só *disparos*.';
    const HC_SIZE = 88, HC_Y = 170, BETA_GAP = 26;
    const wHC = measure('Fluxos, não só disparos.', { fontFamily: "'Russo One'", fontSize: `${HC_SIZE}px`, letterSpacing: '-0.01em' });
    const betaStyle = { fontFamily: 'var(--font-ui)', fontSize: '16px', fontWeight: 800, letterSpacing: '.14em', padding: '8px 14px 8px 16px', borderRadius: '999px', whiteSpace: 'nowrap' };
    const wBeta = measure('BETA', Object.assign({}, betaStyle, { display: 'inline-block' }));
    const HC_X = Math.round(960 - (wHC + BETA_GAP + wBeta) / 2);
    const mkHudC = (parent, wire) => {
      const hc = KIT.headline(parent, HC_TEXT, { size: HC_SIZE, x: HC_X, y: HC_Y, w: wHC + 40, align: 'left', glow: !wire, split: wire ? false : 'words' });
      hc.el.style.zIndex = 6;
      hc.el.style.whiteSpace = 'nowrap';
      const beta = div(parent, Object.assign({ position: 'absolute', left: `${HC_X + wHC + BETA_GAP}px`, top: `${HC_Y - 4}px`, zIndex: 6, transformOrigin: '0% 50%' }, betaStyle,
        wire ? { color: 'rgba(0,0,0,0)', border: '1px dashed rgba(160,190,185,.45)', background: 'rgba(0,0,0,0)' } : { color: '#fff', border: '1px solid rgba(255,255,255,.25)', background: 'rgba(255,255,255,.1)' }), 'BETA');
      beta.style.transform = 'translateY(-50%)';
      if (wire) {
        hc.el.style.color = 'rgba(0,0,0,0)';
        hc.el.style.webkitTextStroke = '1.2px rgba(160,200,192,.5)';
        hc.el.querySelectorAll('.kit-em').forEach((e) => { e.style.color = 'rgba(0,0,0,0)'; e.style.webkitTextStroke = '1.2px rgba(21,219,168,.6)'; });
        beta.style.webkitTextStroke = '1px rgba(160,200,192,.5)';
      }
      return { hc, beta };
    };
    const hudWire = mkHudC(wireG, true);
    const hudLive = mkHudC(liveG, false);
    KIT.revealWords(tl, hudLive.hc.units, 4.10, { dur: 0.6, stagger: 0.07 });

    // scan line (turns the flow into its wireframe as it passes)
    // exit veil: S13's scan veil mirrored (clear at the line, rgba(0,12,13,.6) from 70 px up), trailing ABOVE the
    // line, so S12's last frame is S13's first — the veiled empty stage — and S13's scan reads as a second pass
    const SCAN_VEIL = 1180;
    const scanVeil = div(Cp, { position: 'absolute', left: '0', top: '0', width: '1920px', height: `${SCAN_VEIL}px`, zIndex: 7, pointerEvents: 'none',
      background: 'linear-gradient(0deg, rgba(0,12,13,0) 0px, rgba(0,12,13,.6) 70px, rgba(0,12,13,.6) 100%)', display: 'none' });
    const scanBand = div(Cp, { position: 'absolute', left: '0', top: '0', width: '1920px', height: '220px', zIndex: 8, pointerEvents: 'none',
      background: 'linear-gradient(0deg, rgba(21,219,168,.26), rgba(21,219,168,.06) 45%, rgba(21,219,168,0))', display: 'none' });
    const scanLine = div(Cp, { position: 'absolute', left: '0', top: '0', width: '1920px', height: '3px', zIndex: 9, background: '#b9fbe6',
      boxShadow: '0 0 6px 1px #15dba8, 0 0 22px 5px rgba(21,219,168,.75), 0 0 60px 12px rgba(21,219,168,.35)', display: 'none' });

    /* ---------------- wipe slab (shared by both cuts) ---------------- */
    const wipe = KIT.diagWipe(root, { z: 40 });

    /* ---------------- SFX ---------------- */
    ctx.cue('swoosh', 0.00);
    TICKS.forEach((tt) => ctx.cue('tick', tt, { db: -8 }));
    ctx.cue('blip', MIN, { freq: 1400 });
    ctx.cue('pop', TAP2);
    ctx.cue('whoosh', W1[0], { dur: 0.3 });
    LEADS.forEach((L) => ctx.cue('blip', L.t1, { freq: 1500, db: -10, pan: +(((cardsB[L.card].port[0] - 960) / 960).toFixed(2)) }));
    ctx.cue('whoosh', W2[0], { dur: 0.3 });
    NODES.filter((n, i) => i !== 4).forEach((n, i) => ctx.cue('blip', n.at, { freq: 1000 + i * 150, db: -6 }));
    ctx.cue('pop', 4.40);
    ctx.cue('swoosh', TOKEN_T[1]);                                    // RB docks on "Fim"
    ctx.cue('ping', FIM_OK + 0.12, { db: -9, pan: 0.42 });            // …and her check lands
    ctx.cue('glitch', SCAN[0], { dur: 0.1, db: -12 });

    /* ---------------- per-frame ---------------- */
    const setPhone = (ph, q) => { ph.el.style.transform = phoneTf(q); };

    const updateA = (t) => {
      bgA.update(t + 66);
      const q = pose(t);
      setPhone(phA, q);
      bandA.style.transform = `translateX(${-t * 14}px) rotate(35deg)`;
      floorA.style.transform = `translate(${q.dx * 0.9}px, 0) scale(${1 - q.dy * 0.002})`;
      for (const f of FLOAT) {
        const e = p(t, 0, 1.0, 'expo.out');
        const dx = noise(t * 0.4 + f.i * 3, 1.7) * 10 - t * 10 * f.depth;
        const dy = noise(t * 0.4 + f.i * 5, 9.3) * 12 + (1 - e) * 60 * f.depth;
        f.el.style.transform = `translate(${dx}px, ${dy}px) rotate(${f.rot + noise(t * 0.3, f.i) * 5}deg)`;
        f.el.style.opacity = 0.95;
      }
      // banner sheen + tiles stagger in
      sheenA.style.transform = `translateX(${map(t, 0.2, 0.9, -160, 460, 'power2.inOut')}px) skewX(-20deg)`;
      tilesA.forEach((tt, i) => {
        const k = p(t, -0.25 + i * 0.07, 0.3 + i * 0.07, 'power3.out');
        tt.el.style.opacity = 0.55 + 0.45 * clamp(inv(t, -0.1 + i * 0.07, 0.12 + i * 0.07));
        tt.el.style.transform = `translateY(${(1 - k) * 18}px)`;
      });
      const sel = p(t, TAP1, TAP1 + 0.15, 'power2.out');
      tilesA[0].img.style.boxShadow = sel > 0 ? `0 0 0 ${3 * sel}px #15dba8, 0 8px 22px rgba(21,219,168,${0.35 * sel})` : 'none';
      // sheet
      const sh = p(t, SHEET, SHEET + 0.4, 'expo.out');
      sheet.style.transform = `translateY(${(1 - sh) * (SHEET_H + 30)}px)`;
      dimA.style.opacity = p(t, SHEET, SHEET + 0.3, 'power2.out');
      let fill = 0;
      steps.forEach((st, i) => {
        const T = TICKS[i];
        const on = t >= T;
        st.val.textContent = on ? '1' : '0';
        st.val.style.color = on ? '#0b2b29' : '#a3a3a3';
        st.val.style.transform = `scale(${on ? 1 + 0.45 * (1 - p(t, T, T + 0.22, 'power2.out')) : 1})`;
        st.box.style.borderColor = on ? '#38cc9c' : '#e5e5e5';
        st.box.style.background = on ? '#f0fdf8' : '#fff';
        const fl = on ? 1 - inv(t, T, T + 0.2) : 0;
        st.plus.style.background = fl > 0 ? `rgba(56,204,156,${0.25 + 0.75 * fl})` : '#ecfdf5';
        st.plus.style.color = fl > 0.4 ? '#fff' : '#27ae8f';
        st.plus.style.transform = `scale(${1 - 0.2 * Math.sin(Math.PI * inv(t, T - 0.05, T + 0.1))})`;
        fill += p(t, T, T + 0.12, 'power2.out');
      });
      bagBadge.style.transform = `scale(${Math.max(0, p(t, TICKS[0], TICKS[0] + 0.3, 'back.out(2.5)'))})`;
      const mk = p(t, MIN, MIN + 0.14, 'power2.out');
      minFill.style.width = `${fill * 25}%`;
      minFill.style.background = mk > 0.5 ? '#16a34a' : '#38cc9c';
      minIc0.style.opacity = 1 - mk; minIc1.style.opacity = mk;
      minT0.style.opacity = 1 - mk; minT1.style.opacity = mk;
      minIc1.style.transform = `scale(${t >= MIN ? 1 + 0.35 * (1 - p(t, MIN, MIN + 0.3, 'power2.out')) : 1})`;
      minRow.style.transform = `scale(${1 + 0.05 * Math.sin(Math.PI * inv(t, MIN, MIN + 0.25))})`;
      tot0.style.opacity = 1 - mk;
      tot1.style.opacity = mk;
      tot1.style.transform = `scale(${t >= MIN ? 1 + 0.25 * (1 - p(t, MIN, MIN + 0.3, 'power2.out')) : 1})`;
      const en = p(t, MIN, MIN + 0.18, 'power2.out');
      const press = Math.sin(Math.PI * inv(t, TAP2, TAP2 + 0.16));
      const post = t >= TAP2 ? 1 - inv(t, TAP2 + 0.05, TAP2 + 0.45) : 0;
      btnA.style.opacity = lerp(0.45, 1, en);
      btnA.style.filter = `saturate(${lerp(0.5, 1, en)}) brightness(${1 - press * 0.08})`;
      btnA.style.transform = `scale(${1 - press * 0.03})`;
      btnA.style.boxShadow = `0 10px 24px rgba(37,211,102,${0.1 + 0.3 * en}), 0 0 ${30 * en + 24 * post}px rgba(37,211,102,${0.35 * en + 0.3 * post})`;
      const rk = p(t, TAP2, TAP2 + 0.4, 'power2.out');
      ripA.style.opacity = t >= TAP2 ? 0.6 * (1 - rk) : 0;
      ripA.style.transform = `translate(${TAPS[1].to[0] - 20 - 20}px, ${30 - 20}px) scale(${1 + rk * 9})`;
      flashA.style.opacity = t >= TAP2 ? 0.55 * (1 - inv(t, TAP2, TAP2 + 0.035)) : 0;
      const gk = inv(t, TAP2 + 0.01, TAP2 + 0.24);
      glintA.style.opacity = gk > 0 && gk < 1 ? 1 : 0;
      glintA.style.transform = `translateX(${lerp(-110, 440, E('power2.out')(gk))}px) skewX(-22deg)`;
      // touch indicator
      const tp = t < 1.0 ? TAPS[0] : TAPS[1];
      const mv = p(t, tp.tIn, tp.tTap - 0.04, 'power3.out');
      const tx = lerp(tp.from[0], tp.to[0], mv), ty = lerp(tp.from[1], tp.to[1], mv);
      const pr = Math.sin(Math.PI * inv(t, tp.tTap, tp.tTap + 0.14));
      touch.style.opacity = clamp(inv(t, tp.tIn, tp.tIn + 0.12)) * (1 - inv(t, tp.tTap + 0.12, tp.tTap + 0.3));
      touch.style.transform = `translate(${tx - 27}px, ${ty - 27}px) scale(${1 - 0.2 * pr})`;
      const rr = inv(t, tp.tTap, tp.tTap + 0.36);
      touchRing.style.opacity = rr > 0 && rr < 1 ? 0.9 * (1 - rr) : 0;
      touchRing.style.transform = `translate(${tp.to[0] - 27}px, ${tp.to[1] - 27}px) scale(${1 + 1.3 * E('power2.out')(rr)})`;
      // WhatsApp reward
      const wk = p(t, WA_POP, WA_POP + 0.4, 'back.out(2.2)');
      waBadge.style.opacity = clamp(inv(t, WA_POP, WA_POP + 0.08));
      waBadge.style.transform = `translate(${noise(t * 0.6, 3.3) * 4}px, ${-12 * p(t, WA_POP, 2.1, 'power2.out')}px) scale(${Math.max(0, wk)}) rotate(${lerp(-18, 0, clamp(wk))}deg)`;
      waRing.set(inv(t, WA_POP + 0.02, WA_POP + 0.55));
      // HUD parallax
      hA.el.style.transform = `translate(${-t * 5}px, -50%)`;
      ebA.el.style.transform = `translateX(${-t * 5}px)`;
    };

    const updateB = (t) => {
      const q = pose(t);
      setPhone(phB, q);
      glowB.style.transform = `translate(${q.dx}px, ${q.dy}px) scale(${1 + noise(t * 0.5, 4.2) * 0.06})`;
      // highlighted consultant in the stacked avatars rotates every 8th note
      const k = Math.floor((t - LEADS[0].t0) / 0.25);
      const idx = ((k % 4) + 4) % 4;
      const tk = LEADS[0].t0 + k * 0.25;
      // …and flashes teal the instant its lead leaves the button (rotation → lead → that consultant's card)
      const fl = k >= 0 && k < LEADS.length ? 1 - inv(t, tk, tk + 0.24) : 0;
      stackB.forEach((el, i) => {
        const on = i === idx;
        const e = on ? p(t, tk, tk + 0.14, 'power3.out') : 0;
        const f = on ? fl : 0;
        el.style.transform = `scale(${1 + 0.15 * e + 0.06 * f}) translateY(${-3 * e}px)`;
        el.style.boxShadow = on ? `inset 0 0 0 26px rgba(21,219,168,${0.6 * f}), 0 0 0 3px #fff, 0 0 0 ${3 + 3 * e + 2 * f}px #15dba8, 0 0 ${18 * e + 26 * f}px rgba(21,219,168,${0.8 + 0.2 * f})` : '0 0 0 3px #fff';
        el.style.filter = f > 0 ? `brightness(${1 + 0.35 * f})` : 'none';
        el.style.zIndex = on ? 9 : 1 + i;
      });
      // the button breathes on each departure
      let bp = 0;
      for (const L of LEADS) bp = Math.max(bp, Math.sin(Math.PI * inv(t, L.t0, L.t0 + 0.16)));
      btnB.style.transform = `scale(${1 - 0.03 * bp})`;
      btnB.style.filter = `brightness(${1 + 0.12 * bp})`;
      onDot.style.opacity = 0.55 + 0.45 * Math.max(0, Math.sin(t * Math.PI * 2));
      // cards
      cardsB.forEach((c, i) => {
        const e = p(t, c.t0, c.t0 + 0.45, 'back.out(1.5)');
        let n = 0, last = -1, glow = 0;
        for (const L of LEADS) if (L.card === i && t >= L.t1) { n++; last = L.t1; }
        if (last >= 0) glow = 1 - inv(t, last, last + 0.55);
        const bump = last >= 0 ? Math.sin(Math.PI * inv(t, last, last + 0.2)) : 0;
        c.el.style.opacity = clamp(inv(t, c.t0, c.t0 + 0.15));
        c.el.style.transform = `translateY(${(1 - e) * 36 - bump * 6}px) scale(${1 + 0.04 * bump})`;
        c.el.style.borderColor = glow > 0 ? `rgba(21,219,168,${0.25 + 0.6 * glow})` : 'rgba(255,255,255,0.12)';
        c.el.style.boxShadow = `0 30px 80px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08), 0 0 ${40 * glow}px rgba(21,219,168,${0.45 * glow})`;
        c.badge.textContent = `+${Math.max(1, n)}`;
        c.badge.style.transform = `scale(${n > 0 ? Math.max(0, 0.7 + 0.3 * p(t, last, last + 0.3, 'back.out(3)')) * (n > 0 ? 1 : 0) : 0})`;
        c.badge.style.opacity = n > 0 ? 1 : 0;
      });
      // leads (canvas)
      lx.clearRect(0, 0, 1920, 1080);
      const [sx, sy] = project(q, BTN_LOCAL[0], BTN_LOCAL[1]);
      for (const L of LEADS) {
        const [ex, ey] = cardsB[L.card].port;
        // departure ring on the button
        const rp = inv(t, L.t0, L.t0 + 0.4);
        if (rp > 0 && rp < 1) {
          lx.strokeStyle = `rgba(21,219,168,${0.85 * (1 - rp)})`;
          lx.lineWidth = 2.5;
          lx.beginPath(); lx.arc(sx, sy, 10 + 48 * E('power2.out')(rp), 0, Math.PI * 2); lx.stroke();
        }
        // arrival flash on the card badge
        const fa = inv(t, L.t1, L.t1 + 0.35);
        if (fa > 0 && fa < 1) {
          lx.strokeStyle = `rgba(21,219,168,${0.9 * (1 - fa)})`;
          lx.lineWidth = 3;
          lx.beginPath(); lx.arc(ex, ey, 16 + 46 * E('power2.out')(fa), 0, Math.PI * 2); lx.stroke();
        }
        const u = inv(t, L.t0, L.t1);
        if (u <= 0 || u >= 1) continue;
        const cx = (sx + ex) / 2, cy = Math.min(sy, ey) - 240;
        const bz = (kk) => { const a = 1 - kk; return [a * a * sx + 2 * a * kk * cx + kk * kk * ex, a * a * sy + 2 * a * kk * cy + kk * kk * ey]; };
        const kq = E('sine.inOut')(u);
        // comet trail (tapered polyline) + glowing head
        const N = 22;
        for (let i = N; i >= 1; i--) {
          const k0 = kq - i * 0.016, k1 = kq - (i - 1) * 0.016;
          if (k1 < 0) continue;
          const [x0, y0] = bz(Math.max(0, k0)), [x1, y1] = bz(k1);
          lx.strokeStyle = `rgba(21,219,168,${0.7 * (1 - i / (N + 1))})`;
          lx.lineWidth = 10 * (1 - i / (N + 2));
          lx.lineCap = 'round';
          lx.beginPath(); lx.moveTo(x0, y0); lx.lineTo(x1, y1); lx.stroke();
        }
        const [x, y] = bz(kq);
        const g = lx.createRadialGradient(x, y, 0, x, y, 44);
        g.addColorStop(0, 'rgba(21,219,168,0.8)');
        g.addColorStop(0.35, 'rgba(21,219,168,0.3)');
        g.addColorStop(1, 'rgba(21,219,168,0)');
        lx.fillStyle = g;
        lx.beginPath(); lx.arc(x, y, 44, 0, Math.PI * 2); lx.fill();
        lx.fillStyle = '#f0fffa';
        lx.beginPath(); lx.arc(x, y, 8.5, 0, Math.PI * 2); lx.fill();
      }
      hB.el.style.transform = `translate(${-(t - 2) * 5}px, -50%)`;
      ebB.el.style.transform = `translateX(${-(t - 2) * 5}px)`;
    };

    const updateC = (t) => {
      gridC.style.transform = `translate(${-(t - 4) * 8}px, ${-(t - 4) * 5}px)`;
      flowWire.set(t);
      flowLive.set(t);
      // the stage clears behind the scan: wireframe (incl. its headline, BETA pill and RB outline), dot grid and
      // glow hold a beat, then fade out under the trailing veil — nothing of S12 is left for the cut to pop
      const clr = 1 - inv(t, SCAN[0] + 0.14, SCAN[1] - 0.02);
      // wireframe placeholders under the live flow, stronger once the scan has passed
      wireG.style.opacity = (0.55 + 0.45 * inv(t, SCAN[0], SCAN[1])) * clr;
      gridC.style.opacity = clr;
      glowC.style.opacity = clr;
      hudWire.hc.el.style.opacity = t >= SCAN[0] ? 1 : 0;
      hudWire.beta.style.opacity = t >= SCAN[0] ? 1 : 0;
      const bk = p(t, 4.40, 4.75, 'back.out(2)');
      hudLive.beta.style.opacity = clamp(inv(t, 4.40, 4.5));
      hudLive.beta.style.transform = `translateY(-50%) scale(${0.6 + 0.4 * bk})`;
      // scan
      const sp = inv(t, SCAN[0], SCAN[1]);
      if (t >= SCAN[0]) {
        const y = 1080 * sp;
        liveG.style.clipPath = `inset(${y}px 0 0 0)`;
        const fl = 1 - 0.35 * (Math.floor(t * 60) % 3 === 0 ? 1 : 0) * (1 - inv(t, SCAN[0], SCAN[0] + 0.1));
        scanLine.style.display = 'block';
        scanLine.style.transform = `translateY(${y - 1.5}px)`;
        scanLine.style.opacity = fl;
        scanBand.style.display = 'block';
        scanBand.style.transform = `translateY(${y - 220}px)`;
        // veil builds as the line descends (the wireframe stays readable early), full S13 strength on the last frame
        scanVeil.style.display = 'block';
        scanVeil.style.transform = `translateY(${y - SCAN_VEIL}px)`;
        scanVeil.style.opacity = p(t, SCAN[0], SCAN[1], 'power2.in');
      } else {
        liveG.style.clipPath = 'none';
        scanLine.style.display = 'none';
        scanBand.style.display = 'none';
        scanVeil.style.display = 'none';
      }
    };

    return {
      tl,
      update(local) {
        const t = local;
        const w1 = p(t, W1[0], W1[1], 'power2.inOut');
        const w2 = p(t, W2[0], W2[1], 'power2.inOut');
        const showA = w1 < 1, showB = w1 > 0 && w2 < 1, showC = w2 > 0;
        A.style.display = showA ? '' : 'none';
        B.style.display = showB ? '' : 'none';
        Cp.style.display = showC ? '' : 'none';
        if (showA) { KIT.diagClip(A, w1, { invert: true }); updateA(t); }
        if (showB) { if (t < 3) KIT.diagClip(B, w1); else KIT.diagClip(B, w2, { invert: true }); updateB(t); }
        if (showC) { KIT.diagClip(Cp, w2); updateC(t); }
        wipe.set(t < 3 ? w1 : w2);
      },
    };
  },
});
