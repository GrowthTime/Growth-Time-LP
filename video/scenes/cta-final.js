/* ============================================================
   S15 · cta-final · start 86 · dur 8 · z 29 · pre 0.5 · post 0   [85.5–94] · END CARD
   The period of the brand promise flies up and becomes the logo's dot,
   closing the loop opened in S5 ("Ponto final no caos").
    -0.50–0.00  "Está na hora" whips in from the left, "de escalar" + the
                green dot from the right (update: pre-roll) · motion echoes
     0.00       LOCK [86.0] — 0.18 s lens-star glint on the flare line at the seam
                + anamorphic flare (both under the baseline, behind the type)
                (global teal flash + section impact live in timeline.js)
     0.00–2.00  hold, push 1 → 1.02 · the dot winds up from 1.70
     2.00–2.75  the dot pops and flies a 45° up-right arc into the logo-dot
                slot, lands with a squash · headline scales to .8 (2.0–2.6)
     2.20–3.60  GT mark assembles around the slot (KIT.logoAnim); wordmark
                GROWTH TIME + RESULTS (teal) = the S5 lockup
     3.00       lock pulse · 45° sheen across the mark · CTA button springs in
     3.50       button sheen · 3.60 reinforcement · 4.00/4.25 contacts
     4.50–8.00  hold — phyllotaxis dust spreads from the logo dot, button
                breathes, arrow nudges, rings at 5.0 / 7.0, final ring 7.5
   Hand-off in : S14 fading/blurring out underneath (85.5–86.0); scrim ramps in
                 over 85.5–85.92 (sine) with the halves' travel.
   Hand-off out: complete end card, no fade (last frame 93.98).
   tl → button spring, reinforcement words, contacts only. Everything else
   (halves, dot flight, logo, glows, canvases, pulses) is update(local).
   ============================================================ */
GTR.scene({
  id: 'cta-final',
  build(root, ctx) {
    const { h, s, p, clamp, lerp, inv, noise, fract } = GTR;
    const E = GTR.E;
    const I = (n, o = {}) => GTR.iconSVG(n, o);
    const st = (el, k, v) => { const c = el.__c || (el.__c = {}); if (c[k] !== v) { c[k] = v; el.style[k] = v; } };
    const div = (parent, style, html) => h('div', { style }, parent, html == null ? null : html);
    const full = (parent, z) => div(parent, { position: 'absolute', left: '0', top: '0', width: '1920px', height: '1080px', zIndex: z, pointerEvents: 'none' });
    const TEAL = '#15dba8', MARK = '#33cc99';
    const tl = ctx.tl();

    /* ---------------- timing (local s) ---------------- */
    const IN0 = -0.5;                        // halves start (pre-roll)
    const WIND = [1.70, 1.98];               // dot anticipation
    const LAUNCH = 2.0, POP = 2.16, LAND = 2.75;
    const SHRINK = [2.0, 2.6];
    const LOGO0 = 2.2;
    const LOCK2 = 3.0;
    const LSHEEN = [3.02, 3.62];
    const BSHEEN = [3.5, 4.2];
    const REINF = 3.6, C1 = 4.0, C2 = 4.25;
    const SPIRAL = [4.5, 6.5];
    const RING_A = 5.0, RING_B = 7.0, FIN = 7.5;
    const BREATH0 = 4.5;                     // button idle glow starts after the contacts land

    /* ---------------- layers ---------------- */
    // soft scrim behind the headline while S14 is still fading out below
    // (wide ellipse: S14's plate column x 1000–1800 and the map sit at ~35% under the incoming type)
    const scrim = full(root, 1);
    scrim.style.background = 'radial-gradient(1500px 560px at 960px 560px, rgba(0,21,22,.9), rgba(0,21,22,.6) 60%, rgba(0,21,22,.25) 100%)';
    scrim.style.opacity = 0;
    // directional (horizontal) motion-blur filters for the whip-in: one per half / echo
    const fSvg = s('svg', { width: 0, height: 0, style: 'position:absolute;left:0;top:0;width:0;height:0;overflow:hidden' }, root);
    const fDefs = s('defs', {}, fSvg);
    let fN = 0;
    const mkBlur = () => {
      const id = `cta-final-mb${fN++}`;
      const f = s('filter', { id, x: '-20%', y: '-40%', width: '140%', height: '180%', 'color-interpolation-filters': 'sRGB' }, fDefs);
      const g = s('feGaussianBlur', { stdDeviation: '0 0' }, f);
      return { url: `url(#${id})`, g, last: '' };
    };
    const back = full(root, 2);
    back.style.transformOrigin = '960px 540px';
    const card = full(root, 3);
    card.style.transformOrigin = '960px 540px';

    // soft pool behind the lower text block: the backdrop's stray particles sink back (fix: '• .' doubles)
    const lowScrim = div(card, { position: 'absolute', left: `${960 - 700}px`, top: `${845 - 175}px`, width: '1400px', height: '350px',
      background: 'radial-gradient(closest-side, rgba(0,21,22,.62), rgba(0,21,22,.5) 45%, rgba(0,21,22,.2) 78%, rgba(0,21,22,0) 100%)', opacity: 0 });
    // tighter text-protection capsules right behind each row (kills the '• .' particle doubles)
    const mkCap = (cy, w, hh) => div(card, { position: 'absolute', left: `${960 - w / 2}px`, top: `${cy - hh / 2}px`, width: `${w}px`, height: `${hh}px`,
      background: 'radial-gradient(closest-side, rgba(0,21,22,.8), rgba(0,21,22,.74) 62%, rgba(0,21,22,0) 100%)', opacity: 0 });
    const capR = mkCap(790, 940, 100);
    const capC = mkCap(888, 960, 124);
    const gHead = GTR.glow(back, { x: 960, y: 540, r: 860, color: '21,219,168', a: 0.12 });
    const gLogo = GTR.glow(back, { x: 960, y: 292, r: 470, color: '21,219,168', a: 0.2 });
    gHead.style.opacity = 0;
    gLogo.style.opacity = 0;
    const { ctx: spc } = GTR.canvas(back);

    /* ---------------- logo (top) ---------------- */
    const logo = KIT.logoAnim(card, { x: 960, y: 300, width: 460, withText: true, gray: '#e5e7eb', text: 'GROWTH TIME RESULTS' });
    const L = logo.logo;
    L.svg.style.display = 'block';                    // no inline baseline gap → exact box height
    // wordmark = the S5 lockup (GROWTH TIME #9CA3AF + RESULTS #15dba8), same proportions as ponto-final:
    // font/mark width 50/821, tracking justified to the mark (0.2–0.42 em), cap centre 76.3 units under
    // the mark (viewBox units). logoAnim keeps the per-letter fade; tracking + x are driven in update().
    const WM_MX0 = 30.32, WM_MX1 = 678.27;            // mark extent (viewBox)
    const WM_FS = (WM_MX1 - WM_MX0) * 50 / 821;       // ≈ 39.5 units ≈ 25 px
    const WM_N = 'GROWTH TIME RESULTS'.length;
    const wmCtx = document.createElement('canvas').getContext('2d');
    wmCtx.font = `${WM_FS}px "Russo One"`;
    const WM_W0 = wmCtx.measureText('GROWTH TIME RESULTS').width;   // zero-tracking advance
    const WM_LS1 = clamp((WM_MX1 - WM_MX0 - WM_W0) / (WM_N - 1), WM_FS * 0.2, WM_FS * 0.42);
    const WM_LS0 = WM_FS * 0.9;
    const wmX = (ls) => (WM_MX0 + WM_MX1) / 2 - (WM_W0 + (WM_N - 1) * ls) / 2;
    if (L.text) {
      L.text.setAttribute('fill', '#9CA3AF');
      L.text.style.fontSize = `${WM_FS.toFixed(2)}px`;
      L.text.setAttribute('y', (349.6 + 0.35 * WM_FS).toFixed(2));   // cap centre at 349.6 like S5
      [...L.text.childNodes].slice('GROWTH TIME '.length).forEach((ts) => ts.setAttribute('fill', TEAL));
    }
    const LK = 460 / 720;
    const LTOP = 300 - logo.el.offsetHeight / 2;
    const DOTX = 960 - 230 + 656.12 * LK;             // ≈ 1149.2
    const DOTY = LTOP + 253.27 * LK;                  // ≈ 334.0
    const DOT_R = 21.07 * LK;                         // ≈ 13.46
    // 45° sheen clipped to the five mark parts (echo of the S5 lock)
    const defs = s('defs', {}, L.svg);
    const cp = s('clipPath', { id: 'cta-final-markclip' }, defs);
    for (const k of ['g1', 'g2', 'arrow', 't', 'stem']) s('path', { d: GTR.LOGO_PATHS[k] }, cp);
    const sheenG = s('g', { 'clip-path': 'url(#cta-final-markclip)' }, L.svg);
    const lSheen = s('polygon', { fill: '#ffffff', opacity: 0.6, points: '0,0 0,0 0,0' }, sheenG);
    lSheen.style.display = 'none';

    /* ---------------- headline (two halves + DOM period) ---------------- */
    const FS = 128, GAP = 8, DOT = 26;
    const hl = full(card, 2);
    hl.style.zIndex = 'auto';
    hl.style.transformOrigin = '960px 540px';
    const mkLine = (parent) => {
      const el = div(parent, { position: 'absolute', left: '0', top: '0', whiteSpace: 'nowrap', fontSize: `${FS}px`, lineHeight: '1.08',
        letterSpacing: '-0.01em', color: '#ffffff', textShadow: '0 14px 44px rgba(0,0,0,.38)' });
      el.className = 'display';
      return el;
    };
    // measure once (fonts are loaded before build)
    const meas = mkLine(hl);
    meas.textContent = 'Está na hora de escalar';
    const wFull = meas.getBoundingClientRect().width;
    meas.remove();
    const halfA = mkLine(hl);
    halfA.textContent = 'Está na hora';
    const probe = h('span', { style: { display: 'inline-block', width: '0px', height: '0px', verticalAlign: 'baseline' } }, halfA);
    const BASE = probe.offsetTop;                     // baseline offset inside the line box
    probe.remove();
    const LINE_H = halfA.offsetHeight;
    const wA = halfA.getBoundingClientRect().width;
    const halfB = mkLine(hl);
    halfB.appendChild(document.createTextNode('de '));
    const esc = h('span', { style: { display: 'inline-block', textShadow: 'none' } }, halfB);
    esc.textContent = 'escalar';
    const wB = halfB.getBoundingClientRect().width;
    const wEsc = esc.getBoundingClientRect().width;
    const SPC = wFull - wA - wB;                      // the space between the halves
    const GW = Math.round(wEsc * 1.6);                // gradient period
    Object.assign(esc.style, {
      backgroundImage: 'linear-gradient(90deg, #27ae8f 0%, #15dba8 33.3%, #38cc9c 66.6%, #27ae8f 100%)',
      backgroundSize: `${GW}px 100%`, backgroundRepeat: 'repeat-x',
      WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', WebkitTextFillColor: 'transparent',
      filter: 'drop-shadow(0 0 22px rgba(21,219,168,.5)) drop-shadow(0 0 60px rgba(21,219,168,.22))',
    });
    const WG = wA + SPC + wB + GAP + DOT;             // text + dot, centred
    const X0 = Math.round(960 - WG / 2);
    const TOP = Math.round(540 - LINE_H / 2);
    const XB = X0 + wA + SPC;
    Object.assign(halfA.style, { left: `${X0}px`, top: `${TOP}px`, transformOrigin: '50% 50%' });
    Object.assign(halfB.style, { left: `${XB}px`, top: `${TOP}px`, transformOrigin: `${(wB + GAP + DOT) / 2}px 50%` });
    // the period: a DOM circle sitting on the baseline
    const dotIn = div(halfB, { position: 'absolute', left: `${wB + GAP}px`, top: `${BASE - DOT}px`, width: `${DOT}px`, height: `${DOT}px`,
      borderRadius: '50%', background: MARK, transformOrigin: '50% 50%', boxShadow: '0 0 14px rgba(21,219,168,.55)' });
    const DX = XB + wB + GAP + DOT / 2;               // dot centre (hl space, scale 1)
    const DY = TOP + BASE - DOT / 2;
    const SHIFT = (GAP + DOT) / 2;                    // re-centre the text once the dot has left
    // motion echoes for the whip-in (clones, pre-roll only)
    const ghosts = [1, 2].map((k) => {
      const a = halfA.cloneNode(true), b = halfB.cloneNode(true);
      hl.insertBefore(a, halfA);
      hl.insertBefore(b, halfA);
      a.style.display = b.style.display = 'none';
      return { k, a, b, esc: b.querySelector('span'), alpha: k === 1 ? 0.28 : 0.12, fa: mkBlur(), fb: mkBlur() };
    });
    const fA = mkBlur(), fB = mkBlur();
    // specular sweep across the locked phrase (hold 0.45–1.35): a masked bright copy
    const shine = mkLine(hl);
    shine.textContent = 'Está na hora de escalar';
    Object.assign(shine.style, { left: `${X0}px`, top: `${TOP}px`, color: '#f2fffb', textShadow: '0 0 22px rgba(21,219,168,.9)', display: 'none' });
    const SHINE = [0.45, 1.35];
    // lock glint + anamorphic flare, both BEHIND the type (inserted before halfA).
    // The glint is a small 4-point lens star sitting ON the flare line at the seam, i.e. below the
    // baseline, not in the word gap at cap height (a bar there read as 'hora/de'). Short vertical arm
    // (56 px, faded ends), wider horizontal arm riding the flare, hot core.
    const XS = X0 + wA + SPC / 2;
    const FLARE_Y = Math.round(TOP + BASE + 17);      // just under the baseline (= 598)
    const GL_W = 150, GL_H = 56;
    const glint = div(hl, { position: 'absolute', left: `${XS - GL_W / 2}px`, top: `${FLARE_Y + 1 - GL_H / 2}px`, width: `${GL_W}px`, height: `${GL_H}px`,
      transformOrigin: '50% 50%', opacity: 0 });
    const ray = 'rgba(234,255,248,0), #eafff8 50%, rgba(234,255,248,0)';
    div(glint, { position: 'absolute', left: `${GL_W / 2 - 1.5}px`, top: '0', width: '3px', height: `${GL_H}px`, borderRadius: '2px',
      background: `linear-gradient(180deg, ${ray})`, boxShadow: '0 0 12px rgba(21,219,168,.85)' });
    div(glint, { position: 'absolute', left: '0', top: `${GL_H / 2 - 1.5}px`, width: `${GL_W}px`, height: '3px', borderRadius: '2px',
      background: `linear-gradient(90deg, ${ray})`, boxShadow: '0 0 12px rgba(21,219,168,.85)' });
    div(glint, { position: 'absolute', left: `${GL_W / 2 - 16}px`, top: `${GL_H / 2 - 16}px`, width: '32px', height: '32px', borderRadius: '50%',
      background: 'radial-gradient(circle, #ffffff 0%, rgba(234,255,248,.9) 20%, rgba(21,219,168,.4) 48%, rgba(21,219,168,0) 72%)' });
    const flare = div(hl, { position: 'absolute', left: `${XS - 760}px`, top: `${FLARE_Y}px`, width: '1520px', height: '2px', borderRadius: '1px',
      background: 'linear-gradient(90deg, rgba(21,219,168,0), rgba(21,219,168,.75) 38%, #f0fffa 50%, rgba(21,219,168,.75) 62%, rgba(21,219,168,0))',
      boxShadow: '0 0 18px rgba(21,219,168,.8)', transformOrigin: `760px 50%`, opacity: 0 });
    hl.insertBefore(glint, halfA);
    hl.insertBefore(flare, halfA);

    /* ---------------- CTA button ---------------- */
    const blob = div(card, { position: 'absolute', left: `${960 - 560}px`, top: `${690 - 200}px`, width: '1120px', height: '400px', borderRadius: '50%',
      background: 'radial-gradient(closest-side, rgba(43,182,115,.34), rgba(21,219,168,.12) 55%, rgba(21,219,168,0) 100%)', opacity: 0, transformOrigin: '50% 50%' });
    const btnBox = div(card, { position: 'absolute', left: '0', top: `${690 - 46}px`, height: '92px', transformOrigin: '50% 50%' });
    const btn = div(btnBox, { position: 'relative', display: 'inline-flex', alignItems: 'center', gap: '18px', height: '92px', padding: '0 52px',
      borderRadius: '999px', overflow: 'hidden', background: 'linear-gradient(135deg, #2bb673, #27ae8f)', color: '#ffffff',
      fontFamily: 'var(--font-body)', fontWeight: '700', fontSize: '34px', letterSpacing: '0.005em', whiteSpace: 'nowrap',
      textShadow: '0 1px 2px rgba(0,50,35,.35)', border: '1px solid rgba(255,255,255,.22)' });
    const bLabel = h('span', { style: { position: 'relative', zIndex: 2 } }, btn);
    bLabel.textContent = 'Agende seu diagnóstico gratuito';
    const bArrow = h('span', { style: { position: 'relative', zIndex: 2, display: 'inline-flex' } }, btn, I('arrow-right', { size: 36, sw: 2.6 }));
    const bSheen = div(btn, { position: 'absolute', left: '0', top: '-24px', width: '130px', height: '140px', zIndex: 1,
      background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.35) 50%, rgba(255,255,255,0))', display: 'none' });
    const BW = btnBox.offsetWidth;
    btnBox.style.width = `${BW}px`;
    btnBox.style.left = `${Math.round(960 - BW / 2)}px`;

    /* ---------------- reinforcement + contacts ---------------- */
    const reinf = div(card, { position: 'absolute', left: '0', top: '790px', width: '1920px', textAlign: 'center', transform: 'translateY(-50%)',
      fontFamily: 'var(--font-body)', fontSize: '28px', fontWeight: '600', letterSpacing: '0.01em', color: 'rgba(255,255,255,.8)', whiteSpace: 'nowrap' });
    const rUnits = ['Sem', 'compromisso', '·', 'resposta', 'rápida', 'no', 'WhatsApp'].map((w, i) => {
      if (i) reinf.appendChild(document.createTextNode(' '));
      const u = h('span', { class: 'split-unit' }, reinf);
      u.textContent = w;
      if (w === '·') { u.style.color = TEAL; u.style.fontWeight = '800'; }
      return u;
    });
    const contacts = div(card, { position: 'absolute', left: '0', top: '888px', display: 'flex', alignItems: 'center', gap: '34px', transform: 'translateY(-50%)',
      fontFamily: 'var(--font-ui)', fontWeight: '600', fontSize: '30px', letterSpacing: '0.005em', color: 'rgba(255,255,255,.92)', whiteSpace: 'nowrap' });
    const mkC = (icon, text) => div(contacts, { display: 'inline-flex', alignItems: 'center', gap: '14px', transformOrigin: '50% 50%' },
      `<span style="display:inline-flex;color:${TEAL};filter:drop-shadow(0 0 8px rgba(21,219,168,.45))">${I(icon, { size: 30, sw: 2.2 })}</span><span>${text}</span>`);
    const cWeb = mkC('globe', 'growthtime.com.br');
    const cSep = div(contacts, { width: '8px', height: '8px', borderRadius: '50%', background: TEAL, boxShadow: '0 0 10px rgba(21,219,168,.7)', flex: 'none' });
    const cIg = mkC('instagram', '@growthtimebr');
    contacts.style.left = `${Math.round(960 - contacts.offsetWidth / 2)}px`;

    /* ---------------- dot flight + pulses (top) ---------------- */
    const pLock = KIT.pulse(card, { x: DOTX, y: DOTY, r: 160, color: TEAL, sw: 3 });
    const pA = KIT.pulse(card, { x: DOTX, y: DOTY, r: 110, color: 'rgba(21,219,168,.85)', sw: 2 });
    const pB = KIT.pulse(card, { x: DOTX, y: DOTY, r: 110, color: 'rgba(21,219,168,.85)', sw: 2 });
    const pFin = KIT.pulse(card, { x: DOTX, y: DOTY, r: 300, color: TEAL, sw: 3 });
    // rings travel BEHIND the mark, the wordmark and the headline (only the dot itself sits on top)
    for (const pu of [pLock, pA, pB, pFin]) card.insertBefore(pu.el, logo.el);
    const { ctx: trc } = GTR.canvas(card, { z: 'auto' });
    const landGlow = GTR.glow(card, { x: DOTX, y: DOTY, r: 70, color: '170,255,230', a: 0.85 });
    landGlow.style.opacity = 0;
    // landing spark: a quick 45° glint along the growth diagonal (echo of the S5 lock) + a faint cross
    const mkSpark = (len, w, rot, a) => div(card, { position: 'absolute', left: `${DOTX - w / 2}px`, top: `${DOTY - len / 2}px`, width: `${w}px`, height: `${len}px`,
      borderRadius: `${w}px`, background: `linear-gradient(180deg, rgba(234,255,248,0), rgba(234,255,248,${a}) 50%, rgba(234,255,248,0))`,
      boxShadow: '0 0 14px rgba(21,219,168,.85)', transformOrigin: '50% 50%', transform: `rotate(${rot}deg)`, display: 'none' });
    const spark = mkSpark(230, 4, 45, 1);
    const sparkX = mkSpark(84, 3, -45, 0.75);
    const fly = div(card, { position: 'absolute', left: '0', top: '0', width: `${DOT}px`, height: `${DOT}px`, borderRadius: '50%', background: MARK,
      transformOrigin: '50% 50%', display: 'none' });

    // flight path (card space). P0 = the period's centre at launch (hl scale 1.02, no shift).
    // Tight hook: springs steeply up off "escalar", arcs over and drops into the slot.
    const S_LAUNCH = 1.02;
    const P0 = [960 + (DX - 960) * S_LAUNCH, 540 + (DY - 540) * S_LAUNCH];
    const P3 = [DOTX, DOTY];
    const P1 = [P0[0] + 40, P0[1] - 170];             // steep rise off the headline
    const P2 = [1175, 120];                           // hooks down into the slot from above
    const bez = (u) => {
      const a = (1 - u) ** 3, b = 3 * u * (1 - u) ** 2, c = 3 * u * u * (1 - u), d = u ** 3;
      return [a * P0[0] + b * P1[0] + c * P2[0] + d * P3[0], a * P0[1] + b * P1[1] + c * P2[1] + d * P3[1]];
    };
    const dbez = (u) => {
      const a = 3 * (1 - u) ** 2, b = 6 * u * (1 - u), c = 3 * u * u;
      return [a * (P1[0] - P0[0]) + b * (P2[0] - P1[0]) + c * (P3[0] - P2[0]), a * (P1[1] - P0[1]) + b * (P2[1] - P1[1]) + c * (P3[1] - P2[1])];
    };
    const FLY_DUR = LAND - LAUNCH;
    // half linear, half sine.in: springs off at once, still accelerates into the slot (reaches it while the mark builds)
    const uAt = (t) => { const xi = inv(t, LAUNCH, LAND); return 0.5 * xi + 0.5 * (1 - Math.cos(xi * Math.PI / 2)); };
    const posAt = (t) => (t >= LAND ? P3 : bez(uAt(t)));
    const S_REST = (DOT_R * 2) / DOT;                 // DOM dot → logo dot size

    /* ---------------- headline transforms ---------------- */
    const hlS = (t) => (t < SHRINK[0] ? 1 + 0.02 * p(t, 0, 2, 'sine.inOut') : lerp(1.02, 0.8, p(t, SHRINK[0], SHRINK[1], 'power3.inOut')));
    const hlX = (t) => SHIFT * hlS(t) * p(t, SHRINK[0], SHRINK[1], 'power3.inOut');
    const D_OFF = 1150;
    const slideK = (t) => (t >= 0 ? 1 : p(t, IN0, 0, 'power3.out'));
    // whip: horizontal smear ∝ speed (power3.out → v ∝ q^(2/3)), slight stretch along the motion
    const placeHalf = (el, k, dir, fb, extraBlur = 0) => {
      const q = 1 - k;
      const v = q > 0 ? q ** (2 / 3) : 0;
      st(el, 'transform', q < 1e-4 ? 'none' : `translate(${(dir * D_OFF * q).toFixed(2)}px,0) rotate(${(dir * 2 * q).toFixed(3)}deg) scaleX(${(1 + 0.14 * v).toFixed(4)})`);
      const bx = 22 * v + extraBlur, by = 1.4 * v + extraBlur * 0.15;
      if (bx < 0.05) { st(el, 'filter', 'none'); return; }
      const sd = `${bx.toFixed(2)} ${by.toFixed(2)}`;
      if (fb.last !== sd) { fb.g.setAttribute('stdDeviation', sd); fb.last = sd; }
      st(el, 'filter', fb.url);
    };

    /* ---------------- phyllotaxis dust (from the logo dot) ---------------- */
    const GA = Math.PI * (3 - Math.sqrt(5));
    const SP_N = 620, SP_R = 1420;                   // sparse enough to stay texture; the spiral reads in the wave front
    const spr = GTR.rng('cta-final-spiral');
    const SPC_K = SP_R / Math.sqrt(SP_N);
    const dust = Array.from({ length: SP_N }, (_, i) => ({
      r: SPC_K * Math.sqrt(i + 0.5), th: i * GA,
      size: 1.5 + spr() * 2.0, a: 0.12 + spr() * 0.18, ph: spr() * 6.283, tw: 0.7 + spr() * 1.3,
    }));
    let spDirty = false, trDirty = false;
    const drawDust = (t) => {
      if (t < SPIRAL[0]) {
        if (spDirty) { spc.clearRect(0, 0, 1920, 1080); spDirty = false; }
        return;
      }
      spDirty = true;
      spc.clearRect(0, 0, 1920, 1080);
      const rot = (t - SPIRAL[0]) * 0.022;
      const span = SPIRAL[1] - SPIRAL[0];
      for (const d of dust) {
        const t0 = SPIRAL[0] + span * (d.r / SP_R);
        const q = (t - t0) / 0.45;
        if (q <= 0) continue;
        const qe = E('power3.out')(clamp(q));
        const rr = d.r * lerp(0.9, 1, qe);
        const x = DOTX + rr * Math.cos(d.th + rot), y = DOTY + rr * Math.sin(d.th + rot);
        if (x < -10 || x > 1930 || y < -10 || y > 1090) continue;
        const ex = (x - 960) / 700, ey = (y - 540) / 380;
        const m1 = GTR.smooth(clamp((Math.sqrt(ex * ex + ey * ey) - 1.0) / 0.38));
        const lx = (x - 960) / 540, ly = (y - 290) / 250;  // second clean zone: the logo and the air above it
        const m = m1 * GTR.smooth(clamp((Math.sqrt(lx * lx + ly * ly) - 1.0) / 0.45));
        if (m <= 0.001) continue;
        const front = q < 1 ? 4 * q * (1 - q) : 0;     // brighter while being born (the wave front)
        const tw = 0.72 + 0.28 * Math.sin(t * d.tw * 2 + d.ph);
        const al = clamp((d.a * tw + 0.55 * front) * m * qe);
        if (al < 0.004) continue;
        spc.fillStyle = `rgba(21,219,168,${al.toFixed(3)})`;
        spc.beginPath();
        spc.arc(x, y, d.size * (0.6 + 0.4 * qe + 0.6 * front), 0, Math.PI * 2);
        spc.fill();
      }
    };
    // comet trail: one tapered ribbon along the last ~0.3 s of the flight path
    const drawTrail = (t) => {
      if (t < LAUNCH || t > LAND + 0.34) {
        if (trDirty) { trc.clearRect(0, 0, 1920, 1080); trDirty = false; }
        return;
      }
      trDirty = true;
      trc.clearRect(0, 0, 1920, 1080);
      const N = 36, DT = 0.009;
      const pts = [];
      for (let j = N; j >= 0; j--) {
        const tj = t - j * DT;
        if (tj < LAUNCH) continue;
        pts.push({ q: posAt(tj), f: 1 - j / N });
      }
      if (pts.length < 3) return;
      const head = pts[pts.length - 1].q, tail = pts[0].q;
      if (Math.hypot(head[0] - tail[0], head[1] - tail[1]) < 3) return;
      const L = [], R = [];
      for (let i = 0; i < pts.length; i++) {
        const a = pts[Math.max(0, i - 1)].q, b = pts[Math.min(pts.length - 1, i + 1)].q;
        let nx = -(b[1] - a[1]), ny = b[0] - a[0];
        const nl = Math.hypot(nx, ny) || 1;
        nx /= nl; ny /= nl;
        const w = 0.6 + 11.5 * pts[i].f ** 1.3;
        L.push([pts[i].q[0] + nx * w, pts[i].q[1] + ny * w]);
        R.push([pts[i].q[0] - nx * w, pts[i].q[1] - ny * w]);
      }
      const fadeOut = 1 - p(t, LAND, LAND + 0.3, 'power2.out');
      const gr = trc.createLinearGradient(tail[0], tail[1], head[0], head[1]);
      gr.addColorStop(0, 'rgba(21,219,168,0)');
      gr.addColorStop(0.55, `rgba(21,219,168,${(0.28 * fadeOut).toFixed(3)})`);
      gr.addColorStop(1, `rgba(200,255,236,${(0.8 * fadeOut).toFixed(3)})`);
      trc.save();
      trc.shadowColor = 'rgba(21,219,168,.85)';
      trc.shadowBlur = 22;
      trc.fillStyle = gr;
      trc.beginPath();
      trc.moveTo(L[0][0], L[0][1]);
      for (let i = 1; i < L.length; i++) trc.lineTo(L[i][0], L[i][1]);
      for (let i = R.length - 1; i >= 0; i--) trc.lineTo(R[i][0], R[i][1]);
      trc.closePath();
      trc.fill();
      trc.restore();
    };

    /* ---------------- tl: button, reinforcement, contacts ---------------- */
    tl.fromTo(btnBox, { opacity: 0 }, { opacity: 1, duration: 0.14, ease: 'none' }, LOCK2);
    tl.fromTo(btnBox, { scale: 0.6 }, { scale: 1, duration: 0.6, ease: 'back.out(2.3)' }, LOCK2);
    KIT.revealWords(tl, rUnits, REINF, { y: 18, blur: 6, dur: 0.6, stagger: 0.045 });
    const popC = (el, at) => tl.fromTo(el, { y: 22, scale: 0.85, opacity: 0, filter: 'blur(6px)' },
      { y: 0, scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.5, ease: 'back.out(1.8)' }, at);
    popC(cWeb, C1);
    tl.fromTo(cSep, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, ease: 'back.out(3)' }, (C1 + C2) / 2);
    popC(cIg, C2);
    tl.set({}, {}, 8.0);

    /* ---------------- SFX ---------------- */
    ctx.cue('whoosh', -0.40, { dur: 0.4, pan: -0.6 });
    ctx.cue('whoosh', -0.40, { dur: 0.4, pan: 0.6 });
    ctx.cue('swoosh', 2.00, { up: true });
    ctx.cue('ping', 2.75, { freq: 1318.5 });
    ctx.cue('shimmer', 2.80);
    ctx.cue('pop', 3.00);
    ctx.cue('shimmer', 3.50);
    ctx.cue('blip', 4.00, { freq: 1600 });
    ctx.cue('blip', 4.25, { freq: 2000 });
    ctx.cue('ping', 7.50, { db: -10 });

    return {
      tl,
      update(t) {
        /* --- stage layers: scrim, parallax push/drift --- */
        // pre-roll: a soft 0.42 s sine ramp that tracks the halves' travel (full at -0.08, when they are ~in),
        // so S14 dims gradually under the incoming type instead of popping darker in 2–3 frames
        const scr = t < 0 ? p(t, IN0, -0.08, 'sine.inOut') : 1 - p(t, 0.3, 1.8, 'sine.inOut');
        st(scrim, 'opacity', scr.toFixed(3));
        st(scrim, 'display', scr > 0.002 ? 'block' : 'none');
        const cS = 1 + 0.018 * p(t, 2.6, 8.0, 'sine.inOut');
        const dx = noise(t * 0.22, 11.3) * 2.5, dy = noise(t * 0.22, 47.9) * 2;
        st(card, 'transform', `translate(${dx.toFixed(2)}px,${dy.toFixed(2)}px) scale(${cS.toFixed(5)})`);
        st(back, 'transform', `translate(${(-dx * 2.2).toFixed(2)}px,${(-dy * 2.2).toFixed(2)}px) scale(${(1 + 0.008 * p(t, 2.6, 8.0, 'sine.inOut')).toFixed(5)})`);
        const beat = 0.5 + 0.5 * Math.sin(t * Math.PI);           // 2 s breathing (bar)
        st(gHead, 'opacity', (p(t, -0.15, 0.5, 'power2.out') * (0.8 + 0.2 * beat)).toFixed(3));
        st(gLogo, 'opacity', (p(t, 2.5, 3.3, 'power2.out') * (0.78 + 0.22 * beat)).toFixed(3));

        /* --- headline halves (pre-roll whip) --- */
        const k = slideK(t);
        placeHalf(halfA, k, -1, fA);
        placeHalf(halfB, k, 1, fB);
        // dark halo keeps the white type legible over S14's plates during the pre-roll only
        const halo = 0.8 * (1 - p(t, -0.18, 0.02, 'power1.in'));
        const tsh = halo > 0.004 ? `0 14px 44px rgba(0,0,0,.38), 0 0 40px rgba(0,21,22,${halo.toFixed(3)}), 0 0 14px rgba(0,21,22,${(halo * 0.7).toFixed(3)})` : '0 14px 44px rgba(0,0,0,.38)';
        st(halfA, 'textShadow', tsh);
        st(halfB, 'textShadow', tsh);
        for (const g of ghosts) {
          const kg = slideK(t - 0.032 * g.k);
          const al = t < 0 ? g.alpha * clamp((1 - k) * 5) : 0;
          const on = al > 0.004;
          st(g.a, 'display', on ? 'block' : 'none');
          st(g.b, 'display', on ? 'block' : 'none');
          if (!on) continue;
          placeHalf(g.a, kg, -1, g.fa, 5 * g.k);
          placeHalf(g.b, kg, 1, g.fb, 5 * g.k);
          st(g.a, 'opacity', al.toFixed(3));
          st(g.b, 'opacity', al.toFixed(3));
          st(g.esc, 'backgroundPosition', `${(fract(t / 3) * GW).toFixed(1)}px 0px`);
        }
        const S = hlS(t);
        st(hl, 'transform', `translate(${hlX(t).toFixed(2)}px,0) scale(${S.toFixed(5)})`);
        st(esc, 'backgroundPosition', `${(fract(t / 3) * GW).toFixed(1)}px 0px`);

        // specular sweep
        const sh = inv(t, SHINE[0], SHINE[1]);
        const shOn = sh > 0 && sh < 1;
        st(shine, 'display', shOn ? 'block' : 'none');
        if (shOn) {
          const sx0 = lerp(-260, wFull + 260, E('power2.inOut')(sh));
          const m = `linear-gradient(100deg, rgba(0,0,0,0) ${(sx0 - 170).toFixed(1)}px, rgba(0,0,0,1) ${sx0.toFixed(1)}px, rgba(0,0,0,0) ${(sx0 + 170).toFixed(1)}px)`;
          st(shine, 'webkitMaskImage', m);
          st(shine, 'maskImage', m);
          st(shine, 'opacity', (0.8 * Math.sin(Math.PI * sh) ** 0.5).toFixed(3));
        }
        // lock glint (0.18 s star on the flare) + flare (0.45 s)
        const fk = inv(t, 0, 0.45);
        const fOn = t >= 0 && fk < 1;
        st(flare, 'display', fOn ? 'block' : 'none');
        if (fOn) {
          st(flare, 'opacity', (0.55 * (1 - fk) ** 2).toFixed(3));
          st(flare, 'transform', `scaleX(${lerp(0.15, 1.1, E('expo.out')(fk)).toFixed(3)})`);
        }
        const gk = inv(t, 0, 0.18);
        const gOn = t >= 0 && gk < 1;
        st(glint, 'display', gOn ? 'block' : 'none');
        if (gOn) {
          st(glint, 'opacity', ((1 - gk) ** 1.5).toFixed(3));
          st(glint, 'transform', `scale(${lerp(0.5, 1.15, E('expo.out')(gk)).toFixed(3)})`);
        }

        /* --- the period: wind-up in the headline, then the flight --- */
        const inHead = t < LAUNCH;
        st(dotIn, 'display', inHead ? 'block' : 'none');
        st(fly, 'display', inHead ? 'none' : 'block');
        if (inHead) {
          const ant = p(t, 1.0, LAUNCH, 'sine.in');
          st(dotIn, 'transform', `scale(${lerp(1, 0.82, p(t, WIND[0], WIND[1], 'power2.inOut')).toFixed(4)})`);
          st(dotIn, 'boxShadow', `0 0 ${(14 + 20 * ant).toFixed(1)}px rgba(21,219,168,${(0.55 + 0.35 * ant).toFixed(3)})`);
        } else {
          const [x, y] = posAt(t);
          let sc, sx = 1, sy = 1, ang = 0;
          if (t < POP) sc = lerp(0.82 * S_LAUNCH, 1.42, p(t, LAUNCH, POP, 'back.out(2.5)'));
          else sc = lerp(1.42, S_REST, p(t, POP, LAND, 'power2.inOut'));
          if (t < LAND) {
            // stretch along the velocity
            const u = uAt(t), xi = inv(t, LAUNCH, LAND);
            const du = (0.5 + 0.5 * (Math.PI / 2) * Math.sin(xi * Math.PI / 2)) / FLY_DUR;
            const [vx, vy] = dbez(u);
            const spd = Math.hypot(vx, vy) * du;
            const str = clamp(spd / 3200) * 0.45;
            ang = Math.atan2(vy, vx);
            sx = 1 + str;
            sy = 1 - str * 0.45;
          } else {
            // landing squash, decaying spring
            const q = t - LAND;
            const sq = 0.34 * Math.exp(-q * 13) * Math.cos(q * 32);
            sx = 1 + sq;
            sy = 1 - sq * 0.9;
            // the dot "beats" as it emits each ring
            for (const ti of [LOCK2, RING_A, RING_B, FIN]) if (t >= ti) sc *= 1 + 0.16 * Math.sin(Math.PI * clamp((t - ti) / 0.3));
          }
          st(fly, 'transform', `translate(${(x - DOT / 2).toFixed(2)}px,${(y - DOT / 2).toFixed(2)}px) rotate(${ang.toFixed(4)}rad) scale(${(sc * sx).toFixed(4)},${(sc * sy).toFixed(4)})`);
          const glowK = t < LAND ? 1 : Math.exp(-(t - LAND) * 3);
          st(fly, 'boxShadow', `0 0 ${(28 + 14 * glowK).toFixed(1)}px rgba(21,219,168,${(0.35 + 0.5 * glowK).toFixed(3)})`);
        }
        drawTrail(t);
        const lg = t >= LAND ? Math.exp(-(t - LAND) * 7) : 0;
        st(landGlow, 'display', lg > 0.004 ? 'block' : 'none');
        if (lg > 0.004) {
          st(landGlow, 'opacity', lg.toFixed(3));
          st(landGlow, 'transform', `scale(${(0.6 + 0.7 * (1 - lg)).toFixed(3)})`);
        }
        // 45° landing spark (0.28 s): shoots out along the diagonal, thins and fades
        const sk = inv(t, LAND, LAND + 0.28);
        const skOn = t >= LAND && sk < 1;
        st(spark, 'display', skOn ? 'block' : 'none');
        st(sparkX, 'display', skOn ? 'block' : 'none');
        if (skOn) {
          const grow = E('expo.out')(sk), fa = (1 - sk) ** 1.6;
          st(spark, 'opacity', fa.toFixed(3));
          st(spark, 'transform', `rotate(45deg) scale(${(1 - 0.5 * sk).toFixed(3)},${lerp(0.15, 1.15, grow).toFixed(3)})`);
          st(sparkX, 'opacity', (0.8 * fa).toFixed(3));
          st(sparkX, 'transform', `rotate(-45deg) scale(${(1 - 0.5 * sk).toFixed(3)},${lerp(0.2, 1, grow).toFixed(3)})`);
        }

        /* --- logo assembly around the slot --- */
        const lt = Math.max(0, (t - LOGO0) * 1.6);
        logo.set(lt);
        L.parts.dot.style.opacity = 0;                              // the flying period is the dot
        if (L.text) {
          // same collapse timing as logoAnim (1.15–2.1 logo-s), re-centred on the mark axis every frame
          const ls = lerp(WM_LS0, WM_LS1, p(lt, 1.15, 2.1, 'expo.out'));
          L.text.style.letterSpacing = `${ls.toFixed(3)}px`;          // logoAnim.set() rewrites it: no st() cache
          L.text.setAttribute('x', wmX(ls).toFixed(2));
        }
        const ls = inv(t, LSHEEN[0], LSHEEN[1]);
        const lsOn = ls > 0 && ls < 1;
        st(lSheen, 'display', lsOn ? 'inline' : 'none');
        if (lsOn) {
          const x = lerp(-360, 760, E('power2.inOut')(ls));
          lSheen.setAttribute('points', `${(x + 243).toFixed(1)},30 ${(x + 313).toFixed(1)},30 ${(x + 70).toFixed(1)},273 ${x.toFixed(1)},273`);
        }

        /* --- button life --- */
        const bOn = t >= LOCK2;
        // idle breathing waits for the contacts to land (from 4.5 [90.5]) so the lower half settles in sequence
        const breath = t < BREATH0 ? 0 : 0.5 - 0.5 * Math.cos((2 * Math.PI * (t - BREATH0)) / 4.2);
        const burst = bOn ? Math.exp(-(t - LOCK2) * 3.2) : 0;
        const g = clamp(0.35 + 0.65 * breath + 0.6 * burst);
        st(btn, 'boxShadow', `0 10px 26px rgba(43,182,115,.36), 0 0 ${(28 + 52 * g).toFixed(1)}px rgba(21,219,168,${(0.16 + 0.3 * g).toFixed(3)}), inset 0 1px 0 rgba(255,255,255,.35), inset 0 -3px 8px rgba(0,50,35,.16)`);
        st(blob, 'opacity', (p(t, LOCK2, LOCK2 + 0.6, 'power2.out')).toFixed(3));
        st(blob, 'transform', `scale(${(lerp(0.5, 0.72, p(t, LOCK2, LOCK2 + 0.6, 'power3.out')) + 0.53 * breath).toFixed(4)})`);
        st(lowScrim, 'opacity', p(t, REINF - 0.2, REINF + 0.6, 'power2.out').toFixed(3));
        st(capR, 'opacity', p(t, REINF - 0.1, REINF + 0.5, 'power2.out').toFixed(3));
        st(capC, 'opacity', p(t, C1 - 0.1, C1 + 0.5, 'power2.out').toFixed(3));
        const bs = inv(t, BSHEEN[0], BSHEEN[1]);
        const bsOn = bs > 0 && bs < 1;
        st(bSheen, 'display', bsOn ? 'block' : 'none');
        if (bsOn) st(bSheen, 'transform', `translateX(${lerp(-190, BW + 60, E('power2.inOut')(bs)).toFixed(1)}px) skewX(-20deg)`);
        // arrow nudge on every other beat from 4.5
        const nq = t >= 4.5 ? fract((t - 4.5) / 1.0) : 1;
        const nudge = nq < 0.34 ? Math.sin(Math.PI * nq / 0.34) : 0;
        st(bArrow, 'transform', `translateX(${(7 * nudge).toFixed(2)}px)`);

        /* --- pulses from the logo dot --- */
        pLock.set(E('power2.out')(inv(t, LOCK2, LOCK2 + 0.8)));
        pA.set(E('power2.out')(inv(t, RING_A, RING_A + 1.0)));
        pB.set(E('power2.out')(inv(t, RING_B, RING_B + 1.0)));
        pFin.set(E('power2.out')(inv(t, FIN, FIN + 0.48)));

        /* --- background dust --- */
        drawDust(t);
      },
    };
  },
});
