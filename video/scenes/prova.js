/* ============================================================
   S14 · prova · start 80 · dur 6 · z 28 · pre 0 · post 0   [80–86] · PROOF
   Positioning and proof: "Performance, não vaidade.", national reach
   ("Do Ceará para todo o Brasil.") and the growth partners wall.
     0.00        white flash (global) · S13's teal point blooms into a shock
                 ring + anamorphic flare · "Performance," is already mid-slam
     0.50        "não vaidade." rises
     1.25        THE GAG — "vaidade." sags, grays and blurs; vanity chips gray
                 out and fall while the money chips glow; the vanity half of
                 the frame sinks into shade, the money half lights · subline
     2.76–2.86   the subline's full stop swells into the brand's teal dot
     2.80–3.10   part 1 exits (up, blur, fade)
     2.84–3.20   the dot flies (expo.inOut arc + comet tail) into Ceará
     3.15        LANDING — flash + shock ring; Ceará lights, the marker takes
                 over with a squash; state borders are born from it (3.15–3.9)
     3.25–4.15   five arcs fly out of Ceará · states light up in a wave
     3.25        "Do Ceará para todo o Brasil."   4.00 eyebrow
     4.10–4.60   all 11 partner logos pop into a 4/4/3 grid (x 1000–1740)
     4.15        last arc lands: shimmer across "todo o Brasil", the five
                 destination dots pulse in sequence
     5.20–5.55   grid + eyebrow fade/blur out (power2.out)
     5.30–5.80   map, arcs, pulses, Ceará label fade/blur out (power2.out)
     5.30–5.70   headline B lifts (y −30), fades/blurs out (power2.out,
                 front-loaded: ≤ 5% by 5.62, before S15's halves are legible)
   Hand-off in : white flash, "Performance," mid-reveal (S13 ends on a teal
                 point at 960,540 — the bloom starts exactly there).
   Hand-off out: empty dark stage (S15's halves slide in over 5.5–6.0 through
                 y ≈ 470–610, which is already clear by 5.5).
   tl → line 2 / gag / subline / headline B / eyebrow only. Line 1 (it has
   to be mid-reveal on frame 0), chips, burst, flying dot, map, arcs, grid,
   shimmer, parallax and exits are pure functions of local time in update().
   ============================================================ */
GTR.scene({
  id: 'prova',
  async build(root, ctx) {
    const { h, s, p, map, clamp, lerp, inv, noise, fract } = GTR;
    const E = GTR.E;
    const I = (n, o = {}) => GTR.iconSVG(n, o);
    const div = (parent, style, html) => h('div', { style }, parent, html == null ? null : html);
    const full = (parent, z) => div(parent, { position: 'absolute', left: '0', top: '0', width: '1920px', height: '1080px', zIndex: z, pointerEvents: 'none' });
    // cached style setter — skip redundant DOM writes
    const st = (el, k, v) => { const c = el.__c || (el.__c = {}); if (c[k] !== v) { c[k] = v; el.style[k] = v; } };
    const sa = (el, k, v) => { const c = el.__a || (el.__a = {}); if (c[k] !== v) { c[k] = v; el.setAttribute(k, v); } };
    const tl = ctx.tl();

    /* ---------------- timing (local s) ---------------- */
    const LEAD = 0.12;                       // line 1 is already mid-slam on frame 0
    const L2 = 0.50, GAG = 1.25, SUB = 1.25;
    const OUT1 = [2.80, 3.10];
    const DOT = [2.76, 2.86], FLY = [2.84, 3.20], LAND = 3.15;   // the subline's full stop detaches → Ceará (expo.inOut: ≥99.5% there at LAND)
    const MAP = [3.00, 3.60], HB = 3.25;
    const ARC0 = 3.25, ARC_STEP = 0.125, ARC_DUR = 0.40;
    const EB = 4.00, LOGO = 4.10, SHIM = 4.15;
    // staggered, front-loaded exit (S15's halves slide in over 5.5–6.0 through y ≈ 470–610;
    // they read from ≈5.62, so headline B must be gone by then — no two headlines at once)
    const OUT_GRID = [5.20, 5.55], OUT_MAP = [5.30, 5.80], OUT_HEAD = [5.30, 5.70];
    const DRIFT_END = 5.95;                  // map / HUD parallax span (independent of the exits)

    /* =====================================================================
       PART 1 · Performance, não vaidade.
       ===================================================================== */
    const P1 = full(root, 3);

    // --- hand-off burst: S13's teal point (960,540) blooms into the frame
    const burst = full(P1, 1);
    const bloom = GTR.glow(burst, { x: 960, y: 540, r: 780, color: '150,255,222', a: 0.55 });
    const ring1 = KIT.pulse(burst, { x: 960, y: 540, r: 900, color: 'rgba(21,219,168,.85)', sw: 3 });
    const ring2 = KIT.pulse(burst, { x: 960, y: 540, r: 560, color: 'rgba(255,255,255,.75)', sw: 2 });
    const flare = div(burst, { position: 'absolute', left: '0', top: '538px', width: '1920px', height: '4px', borderRadius: '2px', transformOrigin: '50% 50%',
      background: 'linear-gradient(90deg, rgba(21,219,168,0), rgba(21,219,168,.75) 28%, #f0fffa 50%, rgba(21,219,168,.75) 72%, rgba(21,219,168,0))',
      boxShadow: '0 0 22px rgba(21,219,168,.85)' });
    const core = div(burst, { position: 'absolute', left: '948px', top: '528px', width: '24px', height: '24px', borderRadius: '50%', background: '#eafff8',
      boxShadow: '0 0 24px #15dba8, 0 0 60px rgba(21,219,168,.8)' });

    // the gag splits the frame: the vanity half sinks into shade, the money half lights up
    const vanShade = div(P1, { position: 'absolute', left: '0', top: '0', width: '1920px', height: '1080px', opacity: 0,
      background: 'radial-gradient(ellipse 900px 760px at 240px 260px, rgba(2,7,8,.42), rgba(2,7,8,0) 100%), linear-gradient(96deg, rgba(3,9,10,.62) 0%, rgba(3,9,10,.44) 26%, rgba(3,9,10,.16) 44%, rgba(3,9,10,0) 58%)' });
    const moneyGlow = GTR.glow(P1, { x: 1480, y: 830, r: 620, color: '21,219,168', a: 0.24 });
    moneyGlow.style.opacity = 0;

    // ambient aura behind the headline (breathes on the beat)
    const aura = GTR.glow(P1, { x: 960, y: 500, r: 820, color: '21,219,168', a: 0.16 });

    // --- chips: vanity (gray, top-left) vs money (teal, bottom-right)
    const chipsL = full(P1, 2);
    const mkChip = (c, money) => {
      const wrap = div(chipsL, { position: 'absolute', left: `${c.x}px`, top: `${c.y}px`, transformOrigin: '50% 50%', opacity: 0 });
      let pill;
      if (money) {
        pill = KIT.pill(wrap, { text: c.text, icon: c.icon, size: 22, pad: '12px 22px 12px 18px' });
        pill.style.boxShadow = '0 16px 36px rgba(0,0,0,.35)';
        pill.style.background = 'linear-gradient(180deg, rgba(21,219,168,.20), rgba(21,219,168,.10)), rgba(0,21,22,.55)';
      } else {
        pill = div(wrap, { display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '12px 22px 12px 18px', borderRadius: '999px', whiteSpace: 'nowrap',
          background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.14)', color: '#9ca3af', fontFamily: 'var(--font-ui)', fontSize: '22px', fontWeight: 600,
          boxShadow: '0 16px 36px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.06)' },
        `<span style="display:flex;color:${c.col}">${I(c.icon, { size: 24, sw: 2.2 })}</span><span>${c.text}</span>`);
      }
      return Object.assign(c, { wrap, pill, money });
    };
    const VANITY = [
      { text: '3.320 curtidas', icon: 'heart', col: '#f472b6', x: 150, y: 150, d: 0.75, fx: -70, fy: -40 },
      { text: '48,2K seguidores', icon: 'users', col: '#a78bfa', x: 395, y: 222, d: 1.0, fx: -40, fy: -60 },
      { text: '187,4K alcance', icon: 'eye', col: '#60a5fa', x: 175, y: 292, d: 0.6, fx: -80, fy: -20 },
    ].map((c) => mkChip(c, false));
    const MONEY = [
      { text: 'Vendas', icon: 'banknote', x: 1290, y: 772, d: 0.85, fx: 60, fy: 50 },
      { text: 'ROAS', icon: 'chart-line', x: 1520, y: 842, d: 1.0, fx: 80, fy: 30 },
      { text: 'Retorno', icon: 'trending-up', x: 1350, y: 912, d: 0.7, fx: 40, fy: 70 },
      { text: 'Lucro', icon: 'piggy-bank', x: 1610, y: 752, d: 0.9, fx: 90, fy: 40 },
    ].map((c) => mkChip(c, true));

    // --- headline group (HUD; slow push)
    const head1 = full(P1, 3);
    head1.style.transformOrigin = '960px 540px';

    // line 1 "Performance," — gradient text + shimmer, per-char slam (update-driven)
    const L1Y = 420, L1S = 150;
    const l1 = div(head1, { position: 'absolute', left: '0', top: `${L1Y}px`, width: '1920px', transform: 'translateY(-50%)', textAlign: 'center', whiteSpace: 'nowrap',
      fontSize: `${L1S}px`, lineHeight: '1.08', letterSpacing: '-0.01em', filter: 'drop-shadow(0 0 26px rgba(21,219,168,.38))' });
    l1.className = 'display';
    const chars = Array.from('Performance,').map((ch) => {
      const el = h('span', { style: { display: 'inline-block', whiteSpace: 'pre', transformOrigin: '50% 90%', opacity: 0 } }, l1);
      el.textContent = ch;
      return { el, grad: ch !== ',' };
    });
    // measure once (fonts are loaded before build): continuous gradient across the split chars
    const x0 = chars[0].el.offsetLeft;
    const gradChars = chars.filter((c) => c.grad);
    const lastG = gradChars[gradChars.length - 1].el;
    const GW = lastG.offsetLeft + lastG.offsetWidth - x0;             // "Performance" width
    const L1W = chars[chars.length - 1].el.offsetLeft + chars[chars.length - 1].el.offsetWidth - x0;
    const SHW = 300;                                                 // shimmer band width
    chars.forEach((c) => {
      c.off = c.el.offsetLeft - x0;
      if (!c.grad) { c.el.style.color = '#ffffff'; return; }
      Object.assign(c.el.style, {
        backgroundImage: 'linear-gradient(100deg, rgba(255,255,255,0) 0%, rgba(236,255,249,.92) 50%, rgba(255,255,255,0) 100%), linear-gradient(90deg, #27ae8f 0%, #15dba8 62%, #2fe3b3 100%)',
        backgroundSize: `${SHW}px 100%, ${GW}px 100%`, backgroundRepeat: 'no-repeat, no-repeat',
        WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', WebkitTextFillColor: 'transparent',
      });
    });

    // line 2 "não vaidade." + subline (tl)
    const l2 = KIT.headline(head1, 'não vaidade.', { size: L1S, y: 590, w: 1800, lh: 1.08 });
    const vai = l2.units[1];
    vai.style.transformOrigin = '0% 100%';          // sags from its first letter, stays attached to "não"
    const sub = KIT.headline(head1, 'Medimos o que paga a conta', { size: 36, y: 762, w: 1400, font: 'body', weight: 700, color: 'rgba(255,255,255,.84)', ls: '0' });
    sub.el.className = 'body';
    // the full stop lives in its own span so it can detach and fly to Ceará
    const stopEl = h('span', {}, sub.units[sub.units.length - 1]);
    stopEl.textContent = '.';
    // measure its ink centre in stage px before any tween touches the units
    const rootR = root.getBoundingClientRect();
    const zoom = rootR.width / 1920 || 1;
    const stopR = stopEl.getBoundingClientRect();
    const mctx = document.createElement('canvas').getContext('2d');
    mctx.font = '700 36px "Open Sans"';
    const mm = mctx.measureText('.');
    const STOP0 = {
      x: (stopR.left - rootR.left) / zoom + (mm.actualBoundingBoxRight - mm.actualBoundingBoxLeft) / 2,
      y: (stopR.top - rootR.top) / zoom + mm.fontBoundingBoxAscent - (mm.actualBoundingBoxAscent - mm.actualBoundingBoxDescent) / 2,
      d: Math.max(6, mm.actualBoundingBoxRight + mm.actualBoundingBoxLeft),
    };

    KIT.revealWords(tl, l2.units, L2, { y: 56, dur: 0.45, stagger: 0.08, blur: 12 });
    // THE GAG — "vaidade." deflates (0.6 s, power2.in)
    tl.fromTo(vai, { color: '#ffffff', filter: 'blur(0px)', rotate: 0, y: 0, scale: 1, opacity: 1 },
      { color: '#6b7472', filter: 'blur(6px)', rotate: 6, y: 24, scale: 0.92, opacity: 0.35, duration: 0.6, ease: 'power2.in', immediateRender: false }, GAG);
    KIT.revealWords(tl, sub.units, SUB, { y: 30, dur: 0.6, stagger: 0.06, blur: 8 });

    /* =====================================================================
       PART 2 · Do Ceará para todo o Brasil + parcerias
       ===================================================================== */
    const P2 = full(root, 2);
    // map layer (map, arcs, pulses, Ceará label) — exits on its own curve
    const mapL = full(P2, 1);

    // map box (stage 160,190 · 700 wide) — viewBox 0 0 821 744
    const MX = 160, MY = 190, MW = 700, K = MW / 821, MH = 744 * K;
    const CE = { x: 602, y: 205 };                                   // arc origin (landing, verbatim) → stage (673, 365)
    const CES = { x: MX + CE.x * K, y: MY + CE.y * K };
    mapL.style.transformOrigin = `${CES.x}px ${CES.y + 150}px`;
    const ceGlow = GTR.glow(mapL, { x: CES.x, y: CES.y, r: 420, color: '21,219,168', a: 0.26 });
    const landFlash = GTR.glow(mapL, { x: CES.x, y: CES.y, r: 150, color: '150,255,225', a: 0.55 });
    const mapWrap = div(mapL, { position: 'absolute', left: `${MX}px`, top: `${MY}px`, width: `${MW}px`, height: `${MH}px`, transformOrigin: `${CE.x * K}px ${CE.y * K}px`, opacity: 0 });
    const mapSvg = await KIT.loadSVG('assets/brazil-map.svg', mapWrap);
    mapSvg.setAttribute('width', MW);
    mapSvg.setAttribute('height', MH);
    Object.assign(mapSvg.style, { position: 'absolute', left: '0', top: '0', overflow: 'visible' });
    const paths = Array.from(mapSvg.querySelectorAll('path'));
    const MAXD = 640;
    // the landing's origin sits on the Piauí/Ceará border; light Ceará itself via an interior point
    const cePt = new DOMPoint(630, 188);
    const fills = [], strokes = [];
    for (const el of paths) {
      const bb = el.getBBox();
      const d = Math.hypot(bb.x + bb.width / 2 - CE.x, bb.y + bb.height / 2 - CE.y);
      if (el.getAttribute('stroke')) {
        el.removeAttribute('stroke');
        el.setAttribute('stroke-width', 1.35);
        const len = el.getTotalLength();
        el.style.strokeDasharray = `${len} ${len}`;
        let ceS = false;
        try { ceS = el.isPointInFill(cePt); } catch (e) { ceS = false; }
        el.style.stroke = ceS ? 'rgba(120,255,214,.95)' : 'rgba(21,219,168,.5)';
        if (ceS) el.setAttribute('stroke-width', 2.4);
        strokes.push({ el, len, d, t0: LAND + (d / MAXD) * 0.45 });  // borders are born from the landing
      } else if ((el.getAttribute('fill') || 'none') !== 'none') {
        let isCE = false;
        try { isCE = el.isPointInFill(cePt); } catch (e) { isCE = false; }
        el.removeAttribute('fill');
        fills.push({ el, d, isCE, tw: ARC0 + 0.08 + (d / MAXD) * 1.0 });
      }
    }

    // arcs (verbatim from the landing) + packets + destination dots — same box as the map
    const arcSvg = s('svg', { width: MW, height: MH, viewBox: '0 0 821 744', style: { position: 'absolute', left: '0', top: '0', overflow: 'visible', filter: 'drop-shadow(0 0 6px rgba(21,219,168,.75))' } }, mapWrap);
    const ARCS = ['M602 205 Q470 150 350 235', 'M602 205 Q660 300 600 370', 'M602 205 Q500 320 430 425', 'M602 205 Q520 380 560 525', 'M602 205 Q430 430 470 650'];
    const SW = 2.5 / K;                                              // 2.5 px on screen
    const arcs = ARCS.map((d, i) => {
      const glowP = s('path', { d, fill: 'none', stroke: 'rgba(21,219,168,.22)', 'stroke-width': 9 / K, 'stroke-linecap': 'round' }, arcSvg);
      const path = s('path', { d, fill: 'none', stroke: '#15dba8', 'stroke-width': SW, 'stroke-linecap': 'round' }, arcSvg);
      const len = path.getTotalLength();
      [glowP, path].forEach((q) => { q.style.strokeDasharray = `${len} ${len}`; q.style.strokeDashoffset = `${len}`; });
      const N = 96, pts = [];
      for (let k = 0; k <= N; k++) { const q = path.getPointAtLength((len * k) / N); pts.push([q.x, q.y]); }
      const at = (q) => { const f = clamp(q) * N, k = Math.min(N - 1, Math.floor(f)), r = f - k; return [lerp(pts[k][0], pts[k + 1][0], r), lerp(pts[k][1], pts[k + 1][1], r)]; };
      const head = s('circle', { r: 5.5 / K, fill: '#f0fffa' }, arcSvg);
      const packets = [0, 1].map(() => s('circle', { r: 3.4 / K, fill: '#eafff8' }, arcSvg));
      const end = pts[N];
      const dest = s('g', { transform: `translate(${end[0]} ${end[1]}) scale(0)` }, arcSvg);
      const halo = s('circle', { r: 16 / K, fill: 'rgba(21,219,168,.22)' }, dest);
      s('circle', { r: 6 / K, fill: '#eafff8', stroke: '#15dba8', 'stroke-width': 2.4 / K }, dest);
      const ping = s('circle', { cx: end[0], cy: end[1], r: 8 / K, fill: 'none', stroke: '#15dba8', 'stroke-width': 2 / K, opacity: 0 }, arcSvg);
      const t0 = ARC0 + i * ARC_STEP;
      return { glowP, path, len, at, head, packets, dest, halo, ping, end, t0, t1: t0 + ARC_DUR };
    });
    // Ceará marker + beat pulses (SVG rings share the map's tilt)
    const ceRings = [0, 1].map(() => s('circle', { cx: CE.x, cy: CE.y, r: 10, fill: 'none', stroke: '#15dba8', 'stroke-width': 2.2 / K, opacity: 0 }, arcSvg));
    const landRing = s('circle', { cx: CE.x, cy: CE.y, r: 10, fill: 'none', stroke: '#eafff8', 'stroke-width': 2.6 / K, opacity: 0 }, arcSvg);
    const ceMark = s('g', { transform: `translate(${CE.x} ${CE.y}) scale(0)` }, arcSvg);
    const ceHalo = s('circle', { r: 24 / K, fill: 'rgba(21,219,168,.28)' }, ceMark);
    s('circle', { r: 8.5 / K, fill: '#f0fffa', stroke: '#15dba8', 'stroke-width': 3 / K }, ceMark);
    // "Ceará" pin label (map-local coords)
    const ceLab = div(mapWrap, { position: 'absolute', left: `${CE.x * K + 20}px`, top: `${CE.y * K - 64}px`, display: 'inline-flex', alignItems: 'center', gap: '7px',
      padding: '7px 14px 7px 10px', borderRadius: '999px', background: 'rgba(0,21,22,.78)', border: '1px solid rgba(21,219,168,.45)', color: '#fff',
      fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: '17px', whiteSpace: 'nowrap', boxShadow: '0 10px 26px rgba(0,0,0,.4), 0 0 18px rgba(21,219,168,.18)',
      transformOrigin: '0% 100%', opacity: 0 }, `<span style="display:flex;color:#15dba8">${I('map-pin', { size: 17, sw: 2.4 })}</span><span>Ceará</span>`);

    // --- HUD column: headline B (own exit layer) + eyebrow/partners grid (exits first)
    const hudB = full(P2, 4);
    const hudHead = full(hudB, 1);
    const hudGrid = full(hudB, 2);
    const HB_OPTS = { size: 88, x: 1000, y: 290, w: 860, align: 'left', glow: true };
    const HB_TXT = 'Do Ceará para\n*todo o Brasil*.';
    const hB = KIT.headline(hudHead, HB_TXT, HB_OPTS);
    KIT.revealWords(tl, hB.units, HB, { y: 60, dur: 0.7, stagger: 0.07, blur: 12 });
    // shimmer twin: an identical copy on top whose teal words carry only a moving white band
    const hBs = KIT.headline(hudHead, HB_TXT, HB_OPTS);
    hBs.el.style.opacity = 0;
    hBs.el.querySelectorAll('.kit-em').forEach((e) => { e.style.textShadow = 'none'; });
    const SHW2 = 240;
    const emIdx = [];
    hBs.units.forEach((u, i) => { if (u.parentElement.classList.contains('kit-em')) emIdx.push(i); else u.style.visibility = 'hidden'; });
    const em0 = hBs.units[emIdx[0]].offsetLeft;
    const emLast = hBs.units[emIdx[emIdx.length - 1]];
    const EMW = emLast.offsetLeft + emLast.offsetWidth - em0;
    const shimU = emIdx.map((i) => {
      const u = hBs.units[i];
      Object.assign(u.style, {
        backgroundImage: 'linear-gradient(100deg, rgba(255,255,255,0) 0%, rgba(240,255,250,.95) 50%, rgba(255,255,255,0) 100%)',
        backgroundSize: `${SHW2}px 100%`, backgroundRepeat: 'no-repeat', WebkitBackgroundClip: 'text', backgroundClip: 'text',
        color: 'transparent', WebkitTextFillColor: 'transparent',
      });
      return { u, src: hB.units[i], off: u.offsetLeft - em0 };
    });

    const eb = KIT.eyebrow(hudGrid, 'PARCERIAS DE CRESCIMENTO DA GROWTH TIME', { x: 1000, y: 480, align: 'left', size: 18 });
    tl.fromTo(eb.line, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'expo.out' }, EB);
    tl.fromTo(eb.label, { opacity: 0, x: -18 }, { opacity: 1, x: 0, duration: 0.45, ease: 'power3.out' }, EB + 0.03);

    // partners: 3-row grid (4/4/3) — all 11 logos on screen at once, x 1000–1740, rows drift in opposite directions
    // Real third-party marks (same set/heading as the landing's marquee): each needs the owner's written OK for use
    // in an ad — esp. 'uece' (public university seal ⇒ implied endorsement). Never put metrics next to a logo.
    // To drop one, delete it from its row: short rows auto-centre (4/3/3 without 'uece' verified).
    const PW = 170, PHT = 96, GAP = 20, STEP = PW + GAP, GX = 1000;
    const ROWS = [
      { files: ['clara-jeans', 'quids', 'moov', 'levoo'], y: 530, dir: -1 },
      { files: ['fornelle', 'clara-plus', 'uece', 'gl'], y: 650, dir: 1 },
      { files: ['lb', 'chefclaudia', 'q'], y: 770, dir: -1 },
    ];
    const plates = [];
    ROWS.forEach((row, r) => {
      const x0 = GX + (4 - row.files.length) * STEP / 2;              // short row centred under the others
      row.files.forEach((f, j) => {
        const el = KIT.logoPlate(hudGrid, `${f}.png`, { w: PW, h: PHT });
        Object.assign(el.style, { position: 'absolute', left: `${x0 + j * STEP}px`, top: `${row.y}px`, background: '#ffffff', isolation: 'isolate', transformOrigin: '50% 60%',
          border: '1px solid rgba(255,255,255,.85)', boxShadow: '0 14px 30px rgba(0,0,0,.42), 0 0 0 1px rgba(21,219,168,.10)', opacity: 0 });
        const im = el.firstChild;
        if (im) {
          im.style.mixBlendMode = 'multiply';
          if (f === 'lb') {                                           // thin gold mark on a speckled field: crop in + boost
            el.style.overflow = 'hidden';
            Object.assign(im.style, { position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -54%)', maxWidth: 'none', maxHeight: 'none', height: '132px',
              filter: 'contrast(1.35) saturate(1.5) brightness(.9)' });
          }
        }
        plates.push({ el, r, j, dir: row.dir, pop: LOGO + j * 0.04 + r * 0.06 });
      });
    });

    /* ---------------- flying full stop (lives above both parts) ---------------- */
    const flyL = full(root, 6);
    const FD = 24;                                                     // dot diameter at full size
    const mkDot = (a) => div(flyL, { position: 'absolute', left: `${-FD / 2}px`, top: `${-FD / 2}px`, width: `${FD}px`, height: `${FD}px`, borderRadius: '50%', opacity: 0,
      background: 'radial-gradient(circle at 42% 38%, #f4fffb 0%, #7ff5d2 38%, #33cc99 72%)', boxShadow: `0 0 ${14 * a}px rgba(21,219,168,.9), 0 0 ${40 * a}px rgba(21,219,168,.5)` });
    // comet tail: tapered round-capped segments along the recent path (overlap → one continuous streak)
    const NTR = 18, TDT = 0.0026;
    const tailSvg = s('svg', { width: 1920, height: 1080, viewBox: '0 0 1920 1080', style: { position: 'absolute', left: '0', top: '0', overflow: 'visible', filter: 'drop-shadow(0 0 7px rgba(21,219,168,.85))' } }, flyL);
    const trail = new Array(NTR);
    for (let k = NTR - 1; k >= 0; k--) {                               // head segments painted last (on top)
      const c = k / (NTR - 1);                                         // opaque segments (no overlap banding), bright → brand teal
      trail[k] = s('line', { stroke: `rgb(${Math.round(lerp(214, 21, c))},${Math.round(lerp(255, 219, c))},${Math.round(lerp(242, 168, c))})`, 'stroke-linecap': 'round', opacity: 0 }, tailSvg);
    }
    const fly = mkDot(1);
    // map translate (same formula as update) — the target is the Ceará point where the map sits at LAND
    const mapT = (t) => { const dr = E('sine.inOut')(inv(t, MAP[0], DRIFT_END)); return [lerp(-10, 12, dr), lerp(10, -6, dr)]; };
    const TGT = { x: CES.x + mapT(LAND)[0], y: CES.y + mapT(LAND)[1] };
    // where the stop sits when it detaches (head1 push + P1 lift at DOT[0])
    const hs0 = lerp(1, 1.035, E('sine.inOut')(inv(DOT[0], 0, OUT1[1])));
    const SRC = { x: 960 + (STOP0.x - 960) * hs0, y: 540 + (STOP0.y - 540) * hs0 - 40 * p(DOT[0], OUT1[0], OUT1[1], 'power2.in') };
    const CTRL = { x: SRC.x + 30, y: 80 };                             // arcs up over the headline, then drops into Ceará
    const flyAt = (q) => {
      const a = (1 - q) * (1 - q), b = 2 * (1 - q) * q, c = q * q;
      return [a * SRC.x + b * CTRL.x + c * TGT.x, a * SRC.y + b * CTRL.y + c * TGT.y];
    };

    /* ---------------- SFX ---------------- */
    // (no impact at 0: the "final" section's impactIn lands there)
    ctx.cue('pop', 0.50);
    ctx.cue('swoosh', 1.25, { up: false, dur: 0.5, db: -4 });
    ctx.cue('pop', DOT[0], { db: -8, freq: 1400 });
    ctx.cue('swoosh', FLY[0], { dur: 0.3 });
    ctx.cue('ping', LAND, { db: -9, freq: 1318.5 });
    [3.25, 3.5, 3.75, 4.0].forEach((t, i) => ctx.cue('blip', t, { db: -10, freq: 1300 + i * 200 }));
    ctx.cue('pop', LOGO);
    ctx.cue('shimmer', SHIM, { db: -9, pan: 0.4 });

    /* ---------------- per-frame ---------------- */
    return {
      tl,
      update(local) {
        const t = Math.max(0, local);

        /* ======== PART 1 ======== */
        const out1 = p(t, OUT1[0], OUT1[1], 'power2.in');
        const p1On = t < OUT1[1] + 0.02;
        st(P1, 'display', p1On ? 'block' : 'none');
        if (p1On) {
          st(P1, 'opacity', String(1 - out1));
          st(P1, 'transform', `translateY(${-40 * out1}px)`);
          st(P1, 'filter', out1 > 0.001 ? `blur(${(10 * out1).toFixed(2)}px)` : 'none');

          // burst
          const bOn = t < 0.9;
          st(burst, 'display', bOn ? 'block' : 'none');
          if (bOn) {
            const be = p(t, 0, 0.8, 'expo.out');
            st(bloom, 'opacity', String((1 - p(t, 0, 0.7, 'power2.out')) * 0.95));
            st(bloom, 'transform', `scale(${lerp(0.25, 1.5, be)})`);
            ring1.set(inv(t, 0, 0.8));
            ring2.set(inv(t, 0.05, 0.6));
            st(flare, 'transform', `scaleX(${lerp(0.08, 1.25, p(t, 0, 0.45, 'expo.out'))}) scaleY(${lerp(1.4, 0.4, inv(t, 0, 0.45))})`);
            st(flare, 'opacity', String(1 - p(t, 0.05, 0.5, 'power2.in')));
            st(core, 'opacity', String(1 - p(t, 0, 0.25, 'power2.in')));
            st(core, 'transform', `scale(${lerp(1, 2.4, p(t, 0, 0.25, 'expo.out'))})`);
          }
          // the gag's split: vanity half into shade, money half lit
          const sh = p(t, GAG, GAG + 0.6, 'power2.out');
          st(vanShade, 'opacity', String(sh));
          st(moneyGlow, 'opacity', String(sh * (0.85 + 0.15 * Math.sin(t * 3.1))));
          st(moneyGlow, 'transform', `translate(${(noise(t * 0.35, 9.3) * 24).toFixed(1)}px, ${(noise(t * 0.35, 3.9) * 16).toFixed(1)}px) scale(${lerp(0.8, 1, sh).toFixed(3)})`);
          // the full stop hands over to the flying dot
          st(stopEl, 'opacity', t >= DOT[0] ? '0' : '1');

          // aura breathing on beats
          const beat = Math.exp(-fract(t / 0.5) * 5);
          st(aura, 'opacity', String((0.75 + 0.25 * beat) * p(t, 0, 0.6, 'power2.out')));
          st(aura, 'transform', `translate(${noise(t * 0.3, 1.7) * 30}px, ${noise(t * 0.3, 5.1) * 20}px) scale(${1 + 0.04 * beat})`);

          // headline group push
          st(head1, 'transform', `scale(${lerp(1, 1.035, E('sine.inOut')(inv(t, 0, OUT1[1])))})`);

          // line 1 slam (per char) + shimmer sweeps
          const tt = t + LEAD;
          const sh1 = inv(t, 0.35, 1.15), sh2 = inv(t, 1.95, 2.75);
          const shw = sh1 > 0 && sh1 < 1 ? sh1 : sh2 > 0 && sh2 < 1 ? sh2 : -1;
          const shX = shw < 0 ? -SHW * 2 : lerp(-SHW, GW + SHW * 0.2, E('power2.inOut')(shw));
          chars.forEach((c, i) => {
            const a = i * 0.022;
            const q = inv(tt, a, a + 0.42);
            const e = E('back.out(1.5)')(q);
            const o = p(tt, a, a + 0.2, 'power2.out');
            st(c.el, 'opacity', String(o));
            st(c.el, 'transform', q >= 1 ? 'none' : `translateY(${lerp(84, 0, e).toFixed(2)}px) scale(${lerp(1.32, 1, e).toFixed(4)})`);
            st(c.el, 'filter', q >= 1 ? 'none' : `blur(${lerp(10, 0, E('power2.out')(q)).toFixed(2)}px)`);
            if (c.grad) st(c.el, 'backgroundPosition', `${(shX - SHW / 2 - c.off).toFixed(1)}px 0px, ${-c.off}px 0px`);
          });

          // chips: drift in, parallax, then the gag (vanity falls, money glows)
          const camX = map(t, 0, 3.1, 16, -16, 'sine.inOut');
          const camY = map(t, 0, 3.1, 8, -8, 'sine.inOut');
          VANITY.forEach((c, i) => {
            const t0 = 0.02 + i * 0.1;
            const e = p(t, t0, t0 + 0.8, 'expo.out');
            const fT = GAG + i * 0.07;
            const f = p(t, fT, fT + 0.6, 'power2.in');
            const g = p(t, GAG, GAG + 0.25, 'power2.out');
            const dx = lerp(c.fx, 0, e) + camX * c.d + noise(t * 0.4, i * 3.3) * 10 * c.d;
            const dy = lerp(c.fy, 0, e) + camY * c.d + noise(t * 0.4, i * 3.3 + 20) * 8 * c.d + 120 * f;
            const ry = noise(t * 0.3, i * 7.1) * 10 + lerp(-24, 0, e);
            const rz = (i % 2 ? 7 : -7) * f;
            st(c.wrap, 'transform', `translate(${dx.toFixed(2)}px, ${dy.toFixed(2)}px) perspective(800px) rotateY(${ry.toFixed(2)}deg) rotateZ(${rz.toFixed(2)}deg) scale(${lerp(0.86, 1, e) * (0.6 + 0.4 * c.d)})`);
            st(c.wrap, 'opacity', String(p(t, t0, t0 + 0.4, 'power2.out') * (1 - f) * lerp(0.7 + 0.3 * c.d, 0.55, g)));
            st(c.wrap, 'filter', g > 0.001 ? `grayscale(${g.toFixed(3)}) blur(${(f * 4 + (1 - c.d) * 1.2).toFixed(2)}px)` : `blur(${((1 - c.d) * 1.2).toFixed(2)}px)`);
          });
          MONEY.forEach((c, i) => {
            const t0 = 0.12 + i * 0.1;
            const e = p(t, t0, t0 + 0.8, 'expo.out');
            const gT = GAG + 0.05 + i * 0.07;
            const g = p(t, gT, gT + 0.35, 'power2.out');
            const pop = Math.sin(Math.PI * inv(t, gT, gT + 0.4)) * 0.08;
            const dx = lerp(c.fx, 0, e) - camX * c.d + noise(t * 0.4, i * 4.1 + 50) * 10 * c.d;
            const dy = lerp(c.fy, 0, e) - camY * c.d + noise(t * 0.4, i * 4.1 + 70) * 8 * c.d - 10 * g;
            const ry = noise(t * 0.3, i * 5.3 + 9) * 10 + lerp(24, 0, e);
            st(c.wrap, 'transform', `translate(${dx.toFixed(2)}px, ${dy.toFixed(2)}px) perspective(800px) rotateY(${ry.toFixed(2)}deg) scale(${((lerp(0.86, 1, e) + pop) * (0.7 + 0.3 * c.d)).toFixed(4)})`);
            st(c.wrap, 'opacity', String(p(t, t0, t0 + 0.4, 'power2.out') * lerp(0.72 + 0.2 * c.d, 1, g)));
            st(c.pill, 'boxShadow', `0 16px 36px rgba(0,0,0,.35), 0 0 ${(6 + 34 * g).toFixed(1)}px rgba(21,219,168,${(0.12 + 0.5 * g).toFixed(3)})`);
            st(c.pill, 'borderColor', `rgba(21,219,168,${(0.35 + 0.5 * g).toFixed(3)})`);
            st(c.pill, 'color', g > 0.5 ? '#5ff5c9' : '#15dba8');
          });
        }

        /* ======== FLYING FULL STOP (subline → Ceará) ======== */
        const fOn = t >= DOT[0] && t < LAND + 0.08;
        st(flyL, 'display', fOn ? 'block' : 'none');
        if (fOn) {
          const pop = p(t, DOT[0], DOT[1], 'back.out(2.2)');          // period swells into the brand dot, in place
          const col = p(t, DOT[0], DOT[1] + 0.04, 'power2.out');       // white text ink → teal
          const shrink = E('power2.in')(inv(t, FLY[0] + 0.12, LAND));  // lands at the marker's size
          const land = p(t, LAND - 0.015, LAND + 0.06, 'power2.out');
          const base = lerp(STOP0.d / FD, 0.92, pop) * lerp(1, 0.75, shrink);
          const posAt = (tt) => flyAt(E('expo.inOut')(inv(tt, FLY[0], FLY[1])));
          const P = posAt(t), Pb = posAt(t - 1 / 120);
          const vx = P[0] - Pb[0], vy = P[1] - Pb[1];
          const spd = Math.hypot(vx, vy);                                // px per half-frame
          const ang = spd > 0.5 ? Math.atan2(vy, vx) * 180 / Math.PI : 0;
          const str = 1 + Math.min(0.8, spd / 45);
          const filt = col < 0.999 ? `saturate(${col.toFixed(3)}) brightness(${lerp(2.2, 1, col).toFixed(3)})` : 'none';
          st(fly, 'opacity', String(1 - land));
          st(fly, 'filter', filt);
          st(fly, 'transform', `translate(${P[0].toFixed(2)}px, ${P[1].toFixed(2)}px) rotate(${ang.toFixed(2)}deg) scale(${(base * str).toFixed(4)}, ${(base / Math.sqrt(str)).toFixed(4)})`);
          trail.forEach((d, k) => {
            const A0 = posAt(t - k * TDT), A1 = posAt(t - (k + 1) * TDT);
            if (Math.hypot(A1[0] - A0[0], A1[1] - A0[1]) < 0.6) { sa(d, 'opacity', 0); return; }
            const fk = 1 - k / NTR;
            sa(d, 'x1', A0[0].toFixed(2)); sa(d, 'y1', A0[1].toFixed(2));
            sa(d, 'x2', A1[0].toFixed(2)); sa(d, 'y2', A1[1].toFixed(2));
            sa(d, 'stroke-width', (FD * base * lerp(0.08, 0.8, fk * fk)).toFixed(2));
            sa(d, 'opacity', 1);
          });
          st(tailSvg, 'opacity', (0.9 * (1 - land)).toFixed(3));
        }

        /* ======== PART 2 ======== */
        const p2On = t > MAP[0] - 0.05;
        st(P2, 'display', p2On ? 'block' : 'none');
        if (!p2On) return;
        // staggered exit: grid + eyebrow first, then the map and headline B (clear before S15's headline reads)
        const gOut = p(t, OUT_GRID[0], OUT_GRID[1], 'power2.out');
        const mOut = p(t, OUT_MAP[0], OUT_MAP[1], 'power2.out');
        const hOut = p(t, OUT_HEAD[0], OUT_HEAD[1], 'power2.out');
        st(hudGrid, 'opacity', String(1 - gOut));
        st(hudGrid, 'filter', gOut > 0.001 ? `blur(${(10 * gOut).toFixed(2)}px)` : 'none');
        st(hudGrid, 'transform', gOut > 0.001 ? `translateY(${(-14 * gOut).toFixed(2)}px)` : 'none');
        st(mapL, 'opacity', String(1 - mOut));
        st(mapL, 'filter', mOut > 0.001 ? `blur(${(12 * mOut).toFixed(2)}px)` : 'none');
        st(mapL, 'transform', mOut > 0.001 ? `scale(${(1 + 0.05 * mOut).toFixed(4)})` : 'none');
        st(hudHead, 'opacity', String(1 - hOut));
        st(hudHead, 'filter', hOut > 0.001 ? `blur(${(12 * hOut).toFixed(2)}px)` : 'none');
        st(hudHead, 'transform', hOut > 0.001 ? `translateY(${(-30 * hOut).toFixed(2)}px)` : 'none');

        // map: scale 1.08 → 1, slow 3D drift (every part of it animates itself in, so the wrapper stays opaque)
        const mi = p(t, MAP[0], MAP[1], 'power3.out');
        const drift = E('sine.inOut')(inv(t, MAP[0], DRIFT_END));
        const [mtx, mty] = mapT(t);
        st(mapWrap, 'opacity', '1');
        st(mapWrap, 'transform', `translate(${mtx.toFixed(2)}px, ${mty.toFixed(2)}px) perspective(1600px) rotateX(${lerp(12, 6, drift).toFixed(2)}deg) rotateY(${lerp(14, 6, drift).toFixed(2)}deg) scale(${lerp(1.08, 1, mi).toFixed(4)})`);
        const beatQ = fract(t / 0.5);
        const beat = Math.exp(-beatQ * 5);
        const born = p(t, LAND - 0.02, LAND + 0.4, 'power2.out');
        st(ceGlow, 'opacity', String(born * (0.7 + 0.3 * beat)));
        st(ceGlow, 'transform', `translate(${mtx.toFixed(1)}px, ${mty.toFixed(1)}px) scale(${(lerp(0.6, 1, born) + 0.05 * beat).toFixed(4)})`);
        // landing flash + shock ring
        const lf = inv(t, LAND - 0.02, LAND + 0.42);
        st(landFlash, 'display', lf > 0 && lf < 1 ? 'block' : 'none');
        if (lf > 0 && lf < 1) {
          st(landFlash, 'opacity', String((1 - E('power2.out')(lf)).toFixed(3)));
          st(landFlash, 'transform', `translate(${mtx.toFixed(1)}px, ${mty.toFixed(1)}px) scale(${lerp(0.25, 1.7, E('expo.out')(lf)).toFixed(4)})`);
        }
        const lr = inv(t, LAND, LAND + 0.75);
        sa(landRing, 'r', (lerp(10, 150, E('expo.out')(lr)) / K).toFixed(2));
        sa(landRing, 'opacity', lr > 0 && lr < 1 ? ((1 - lr) * 0.95).toFixed(3) : 0);

        // state borders draw outward from Ceará (born from the landing)
        for (const q of strokes) {
          const k = p(t, q.t0, q.t0 + 0.55, 'power2.out');
          st(q.el, 'strokeDashoffset', (q.len * (1 - k)).toFixed(1));
        }
        // fills: faint base, lit by the wave that follows the arcs; Ceará burns bright
        for (const q of fills) {
          let a;
          if (q.isCE) {
            a = 0.54 * p(t, LAND, LAND + 0.3, 'power2.out') + 0.14 * beat * p(t, 3.25, 3.5) + (t >= LAND ? 0.3 * Math.exp(-(t - LAND) * 6) : 0);
          } else {
            const lit = p(t, q.tw, q.tw + 0.2, 'power2.out');
            const fl = t >= q.tw ? Math.exp(-(t - q.tw) * 3.2) : 0;
            a = 0.035 * p(t, LAND, LAND + 0.5, 'power2.out') + 0.085 * lit + 0.2 * fl * lit;
          }
          st(q.el, 'fill', `rgba(21,219,168,${a.toFixed(3)})`);
        }

        // arcs: draw with a comet head, then packets loop out of Ceará
        arcs.forEach((A, i) => {
          const q = inv(t, A.t0, A.t1);
          const e = E('power2.inOut')(q);
          const off = (A.len * (1 - e)).toFixed(2);
          st(A.path, 'strokeDashoffset', off);
          st(A.glowP, 'strokeDashoffset', off);
          sa(A.path, 'opacity', q > 0 ? 1 : 0);
          sa(A.glowP, 'opacity', q > 0 ? 1 : 0);
          const hp = A.at(e);
          sa(A.head, 'cx', hp[0].toFixed(2));
          sa(A.head, 'cy', hp[1].toFixed(2));
          sa(A.head, 'opacity', q > 0 && q < 1 ? 1 : 0);
          // destination pop + the landing beat: the five dots pulse in sequence as the last arc lands
          const dp = E('back.out(2.5)')(inv(t, A.t1 - 0.02, A.t1 + 0.33));
          const pl = Math.sin(Math.PI * inv(t, SHIM + i * 0.07, SHIM + i * 0.07 + 0.3));
          sa(A.dest, 'transform', `translate(${A.end[0]} ${A.end[1]}) scale(${(dp * (1 + 0.6 * pl)).toFixed(4)})`);
          sa(A.halo, 'opacity', Math.min(1, 0.6 + 0.4 * beat + 0.4 * pl).toFixed(3));
          const pg = inv(t, A.t1, A.t1 + 0.6);
          sa(A.ping, 'r', (lerp(8, 44, E('expo.out')(pg)) / K).toFixed(2));
          sa(A.ping, 'opacity', pg > 0 && pg < 1 ? ((1 - pg) * 0.9).toFixed(3) : 0);
          // packets (after the arc is drawn)
          A.packets.forEach((c, k) => {
            const tp = t - A.t1 - 0.1 - k * 0.45;
            if (tp < 0) { sa(c, 'opacity', 0); return; }
            const pq = fract(tp / 0.9);
            const pt = A.at(E('power1.inOut')(pq));
            sa(c, 'cx', pt[0].toFixed(2));
            sa(c, 'cy', pt[1].toFixed(2));
            sa(c, 'opacity', (Math.sin(Math.PI * pq) * 0.95).toFixed(3));
          });
        });
        // Ceará marker: takes over from the flying dot with a squash, then pulses every beat
        const cmq = inv(t, LAND - 0.02, LAND + 0.32);
        const cm = t < LAND - 0.02 ? 0 : lerp(0.6, 1, E('back.out(3)')(cmq));
        const sq = Math.sin(Math.PI * inv(t, LAND - 0.02, LAND + 0.13));
        sa(ceMark, 'transform', `translate(${CE.x} ${CE.y}) scale(${(cm * (1 - 0.24 * sq)).toFixed(4)} ${(cm * (1 + 0.2 * sq)).toFixed(4)})`);
        sa(ceHalo, 'r', ((24 + 8 * beat) / K).toFixed(2));
        ceRings.forEach((c, k) => {
          const tq = t - 3.25 - k * 0.25;
          if (tq < 0) { sa(c, 'opacity', 0); return; }
          const q = fract(tq / 0.5);
          sa(c, 'r', (lerp(10, 70, E('power2.out')(q)) / K).toFixed(2));
          sa(c, 'opacity', ((1 - q) * (k ? 0.45 : 0.85)).toFixed(3));
        });
        const lb = p(t, 3.35, 3.75, 'back.out(1.8)');
        st(ceLab, 'opacity', String(p(t, 3.35, 3.55, 'power2.out')));
        st(ceLab, 'transform', `translateY(${lerp(12, 0, lb).toFixed(2)}px) scale(${lerp(0.7, 1, lb).toFixed(4)})`);

        // HUD column: counter-parallax to the map
        st(hudB, 'transform', `translateX(${lerp(12, -10, drift).toFixed(2)}px)`);

        // shimmer sweep across "todo o Brasil" when the last arc lands
        const sw = inv(t, SHIM, SHIM + 0.6);
        const swOn = sw > 0 && sw < 1;
        st(hBs.el, 'opacity', swOn ? '1' : '0');
        if (swOn) {
          const bx = lerp(-SHW2, EMW + SHW2 * 0.2, E('power2.inOut')(sw));
          for (const q of shimU) {
            st(q.u, 'transform', q.src.style.transform || 'none');
            st(q.u, 'backgroundPosition', `${(bx - SHW2 / 2 - q.off).toFixed(1)}px 0px`);
          }
        }

        // partners grid: pop left-to-right, rows drift ±12 px in opposite directions
        const du = Math.sin(Math.PI * (inv(t, 4.0, 6.0) - 0.5));
        for (const q of plates) {
          const on = t > q.pop - 0.01;
          st(q.el, 'display', on ? 'grid' : 'none');
          if (!on) continue;
          const k = E('back.out(1.7)')(inv(t, q.pop, q.pop + 0.4));
          const dx = q.dir * 12 * du;
          const dy = lerp(18, 0, p(t, q.pop, q.pop + 0.45, 'power3.out')) + Math.sin(t * 2.4 + q.j * 0.9 + q.r * 1.7) * 1.5;
          st(q.el, 'opacity', String(p(t, q.pop, q.pop + 0.22, 'power2.out')));
          st(q.el, 'transform', `translate(${dx.toFixed(2)}px, ${dy.toFixed(2)}px) scale(${lerp(0.8, 1, k).toFixed(4)})`);
        }
      },
    };
  },
});
