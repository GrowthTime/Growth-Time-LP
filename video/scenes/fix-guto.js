/* ============================================================
   S9 · fix-guto · start 44.0 · dur 8.0 · z 23 · pre 0 · post 0
   Fix 04: Guto, the analytics copilot, finds the vanished gold client
   (Revenda Bella) and proves every number against the database.
   First frame (44.0): dark stage, the Guto button already rising into frame
   (centre y 1060, glow + red dot visible) on the bar line; it settles by 0.15,
   chip 04 stamps from 0.00 and the button → panel morph runs 0.15–0.70.
   Last frame (52.0): stage dimmed to ~70% black, the Guto button (56 px,
   teal gradient, white sparkles, red dot) centred at (1758, 958) → S10.
   The tl only drives the HUD headline reveals; everything else is a
   pure function of `local` in update().
   ============================================================ */
GTR.scene({
  id: 'fix-guto',
  build(root, ctx) {
    const { h, p, inv, clamp, lerp, noise } = GTR;
    const C = KIT.C;
    const E = GTR.E;
    const I = (n, o = {}) => GTR.iconSVG(n, o);
    const vis = (el, a) => {
      a = clamp(a);
      el.style.opacity = a;
      el.style.visibility = a > 0.002 ? 'visible' : 'hidden';
    };
    // pop progress (may overshoot > 1 with back eases); 0 before `a`
    const pop = (t, a, d = 0.4, e = 'back.out(1.7)') => (t < a ? 0 : p(t, a, a + d, e));
    const bump = (t, a, d) => Math.sin(Math.PI * inv(t, a, a + d));
    const hex = (c) => c.match(/\w\w/g).map((x) => parseInt(x, 16));
    const mix = (c0, c1, k) => {
      const a = hex(c0), b = hex(c1);
      return `rgb(${a.map((v, i) => Math.round(lerp(v, b[i], clamp(k)))).join(',')})`;
    };
    // layout offset of el inside a positioned ancestor (transform-independent)
    const offIn = (el, anc) => {
      let x = 0, y = 0, e = el;
      while (e && e !== anc) { x += e.offsetLeft; y += e.offsetTop; e = e.offsetParent; }
      return { x, y, w: el.offsetWidth, h: el.offsetHeight };
    };
    const MONO = "'DejaVu Sans Mono', ui-monospace, Menlo, Consolas, monospace";
    const GUTO_BG = 'linear-gradient(135deg,#38cc9c,#2b9d78)';

    /* ---------------- geometry (screen px) ---------------- */
    const P = { x: 700, y: 130, w: 680, h: 820, r: 20 };      // Guto panel
    const B0 = { x: 1760, y: 1060, d: 90 };                    // button start (already peeking in at 44.0)
    const B1 = { x: 1700, y: 960, d: 90 };                     // button rest
    const BE = { x: 1758, y: 958, d: 56 };                     // hand-off button (S10)
    const SX = 1440, SW = 360, SH = 130, SY = [300, 470, 640]; // source cards
    // trace risers: trace 0 runs straight into card 0; 1 and 2 drop down on risers 22 px apart
    // (trace 2's riser sits left of trace 1's → the routes nest without crossing)
    const VX = [0, 1418, 1396];
    const HX = 120, HY = 440, HW = 540;                        // headline column
    const T_VER = [4.0, 4.25, 4.5];                            // verification beats (bracket draws)
    const T_LNK = T_VER.map((v) => v + 0.03);                  // bracket → port glint
    const T_GO = T_VER.map((v) => v + 0.09);                   // trace launches from the bubble edge
    const ARR = T_VER.map((v) => v + 0.3);                     // trace arrival on the source card (stamp)
    const ASK = 'Alguma cliente ouro sumiu?';

    const btnRect = (c) => ({ x: c.x - c.d / 2, y: c.y - c.d / 2, w: c.d, h: c.d, r: c.d / 2 });
    const lerpRect = (a, b, k) => ({ x: lerp(a.x, b.x, k), y: lerp(a.y, b.y, k), w: lerp(a.w, b.w, k), h: lerp(a.h, b.h, k), r: lerp(a.r, b.r, k) });
    // slow lateral parallax of the panel (−6 → +6) + a breath of vertical float
    const panOff = (t) => ({ x: lerp(-6, 6, p(t, 0.9, 7.0, 'sine.inOut')), y: noise(4.2, t * 0.3) * 2 });
    const srcOff = (t) => noise(8.8, t * 0.28) * 3;

    /* ================= BACK LAYERS ================= */
    const glowP = GTR.glow(root, { x: 1040, y: 540, r: 780, color: '21,219,168', a: 0.15 });
    const glowS = GTR.glow(root, { x: 1620, y: 500, r: 440, color: '21,219,168', a: 0.12 });
    const scrim = h('div', { style: { position: 'absolute', left: '-80px', top: `${HY - 330}px`, width: '880px', height: '660px', pointerEvents: 'none',
      background: 'radial-gradient(closest-side, rgba(0,21,22,.78), rgba(0,21,22,0))' } }, root);

    /* ================= HUD HEADLINES ================= */
    const hA = KIT.headline(root, 'Pergunte\nao *Guto*.', { x: HX, y: HY, w: HW, align: 'left', size: 100, glow: true });
    const hB = KIT.headline(root, 'Ele não\ninventa\n*número*.', { x: HX, y: HY, w: HW, align: 'left', size: 92, glow: true });

    /* ================= SOURCE COLUMN ================= */
    // world camera: a slow push-in (1.025 around (1600, 540)) plus a brief push onto the answer bubble
    // while the brackets draw; back to identity before the hand-off button lands
    const world = h('div', { style: { position: 'absolute', inset: '0', transformOrigin: '0 0' } }, root);
    const srcCol = h('div', { style: { position: 'absolute', left: '0', top: '0', width: '1920px', height: '1080px', pointerEvents: 'none' } }, world);
    const eyebrow = KIT.eyebrow(srcCol, 'Fontes · sua base', { x: SX, y: 216, align: 'left', size: 18, line: false });
    eyebrow.el.style.gap = '10px';
    eyebrow.el.insertAdjacentHTML('afterbegin', I('database', { size: 19, sw: 2.2 }));
    const SRC = [
      { fn: 'buscar_cliente()', label: 'Revenda Bella · Status:', value: 'Ouro', col: C.ouro, emoji: '🏅' },
      { fn: 'vendas_por_mes()', label: 'Última compra:', value: 'maio/2026' },
      { fn: 'top_clientes()', label: 'Ticket médio:', value: 'R$ 2.340' },
    ].map((d, i) => {
      const g = h('div', { style: { position: 'absolute', left: `${SX}px`, top: `${SY[i] - 34}px`, width: `${SW}px`, height: `${SH + 34}px` } }, srcCol);
      const fn = h('div', { style: {
        position: 'absolute', left: '0', top: '0', height: '26px', display: 'inline-flex', alignItems: 'center', padding: '0 10px', borderRadius: '7px',
        background: 'rgba(21,219,168,.1)', border: '1px solid rgba(21,219,168,.22)', color: C.vibrant, fontFamily: MONO, fontSize: '14px', whiteSpace: 'nowrap',
      } }, g);
      fn.textContent = d.fn;
      const card = h('div', { style: {
        position: 'absolute', left: '0', top: '34px', width: `${SW}px`, height: `${SH}px`, borderRadius: '16px', overflow: 'hidden',
        background: 'linear-gradient(180deg, rgba(255,255,255,.085), rgba(255,255,255,.03)), rgba(4,28,28,.55)',
        border: '1px solid rgba(255,255,255,.12)', boxShadow: '0 30px 70px rgba(0,0,0,.45), inset 0 1px 0 rgba(255,255,255,.08)',
      } }, g);
      const flash = h('div', { style: { position: 'absolute', inset: '0', background: 'linear-gradient(100deg, rgba(21,219,168,.28), rgba(21,219,168,.04) 70%)', opacity: 0 } }, card);
      const label = h('div', { style: { position: 'absolute', left: '22px', top: '26px', fontSize: '15px', fontWeight: 600, color: 'rgba(255,255,255,.62)', whiteSpace: 'nowrap' } }, card);
      label.textContent = d.label;
      const sk = h('div', { style: { position: 'absolute', left: '22px', top: '64px', width: i === 0 ? '96px' : '168px', height: '24px', borderRadius: '7px', background: 'rgba(255,255,255,.13)' } }, card);
      const val = h('div', { style: {
        position: 'absolute', left: '22px', top: '56px', height: '40px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '32px', fontWeight: 800,
        letterSpacing: '-0.01em', color: d.col || '#fff', whiteSpace: 'nowrap', transformOrigin: '0% 50%', fontVariantNumeric: 'tabular-nums',
      } }, card);
      let emo = null;
      if (d.emoji) { emo = h('span', { class: 'emoji', style: { fontSize: '26px', lineHeight: 1 } }, val); emo.textContent = d.emoji; }
      const vtxt = h('span', {}, val);
      vtxt.textContent = d.value;
      const scan = h('div', { style: { position: 'absolute', left: '0', right: '0', top: '0', height: '2px',
        background: 'linear-gradient(90deg, rgba(21,219,168,0), #15dba8 50%, rgba(21,219,168,0))', boxShadow: '0 0 14px 2px rgba(21,219,168,.55)' } }, card);
      const slot = h('div', { style: { position: 'absolute', right: '22px', top: `${SH / 2 - 22}px`, width: '44px', height: '44px', borderRadius: '50%', border: '2px dashed rgba(255,255,255,.22)' } }, card);
      const stamp = h('div', { style: {
        position: 'absolute', right: '22px', top: `${SH / 2 - 22}px`, width: '44px', height: '44px', borderRadius: '50%', display: 'grid', placeItems: 'center',
        background: C.vibrant, color: C.petroleo, boxShadow: '0 0 0 5px rgba(21,219,168,.18), 0 0 28px rgba(21,219,168,.7)',
      } }, card, I('check', { size: 26, sw: 3.2 }));
      const ring = h('div', { style: { position: 'absolute', inset: '0', borderRadius: '16px', border: '1.5px solid rgba(21,219,168,.75)', boxShadow: 'inset 0 0 22px rgba(21,219,168,.18)', opacity: 0 } }, card);
      return { d, g, fn, card, flash, label, sk, val, vtxt, emo, scan, slot, stamp, ring, at: 1.6 + i * 0.15, solid: 2.0 + i * 0.06 };
    });

    /* ================= DIM OVERLAY (under the button) ================= */
    const dim = h('div', { style: { position: 'absolute', inset: '0', background: '#000', opacity: 0, pointerEvents: 'none' } }, world);
    const btnGlow = GTR.glow(world, { x: 0, y: 0, r: 150, color: '21,219,168', a: 0.5 });
    btnGlow.style.left = '-150px';
    btnGlow.style.top = '-150px';
    const ringEl = h('div', { style: { position: 'absolute', left: '0', top: '0', width: '100px', height: '100px', marginLeft: '-50px', marginTop: '-50px', borderRadius: '50%', border: `3px solid ${C.vibrant}`, opacity: 0, pointerEvents: 'none' } }, world);

    /* ================= GUTO: button ↔ panel (one morphing div) ================= */
    const morph = h('div', { style: { position: 'absolute', left: '0', top: '0', overflow: 'hidden', background: '#fff' } }, world);
    const content = h('div', { style: { position: 'absolute', left: '0', top: '0', width: `${P.w}px`, height: `${P.h}px`, transformOrigin: '0 0', fontFamily: 'var(--font-ui)', color: C.fg, background: '#fff' } }, morph);
    const mGrad = h('div', { style: { position: 'absolute', inset: '0', background: GUTO_BG } }, morph);
    const sheen = h('div', { style: { position: 'absolute', left: '0', top: '0', width: '200px', height: '1400px', pointerEvents: 'none', transformOrigin: '50% 50%',
      background: 'linear-gradient(90deg, rgba(21,219,168,0), rgba(21,219,168,.10) 35%, rgba(255,255,255,.55) 50%, rgba(21,219,168,.10) 65%, rgba(21,219,168,0))' } }, morph);
    const mIcon = h('div', { style: { position: 'absolute', left: '50%', top: '50%', width: '40px', height: '40px', marginLeft: '-20px', marginTop: '-20px', display: 'grid', placeItems: 'center', color: '#fff' } }, morph, I('sparkles', { size: 40, sw: 2 }));
    const redDot = h('div', { style: { position: 'absolute', left: '0', top: '0', width: '20px', height: '20px', borderRadius: '50%', background: C.danger, boxShadow: '0 0 0 2.5px #fff, 0 0 14px rgba(239,68,68,.7)', pointerEvents: 'none' } }, world);

    /* ---------- panel header ---------- */
    const head = h('div', { style: { position: 'absolute', left: '0', top: '0', right: '0', height: '72px', display: 'flex', alignItems: 'center', gap: '12px', padding: '0 20px', borderBottom: '1px solid #eeeeee' } }, content);
    const hAv = h('div', { style: { position: 'relative', width: '40px', height: '40px', flex: 'none', borderRadius: '50%', background: GUTO_BG, display: 'grid', placeItems: 'center', color: '#fff', boxShadow: '0 4px 12px rgba(56,204,156,.4)' } }, head, I('sparkles', { size: 20, sw: 2.2 }));
    h('span', { style: { position: 'absolute', right: '-1px', bottom: '-1px', width: '12px', height: '12px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 0 2px #fff' } }, hAv);
    h('div', { style: { lineHeight: 1.22 } }, head, '<div style="font-size:18px;font-weight:800;color:#171717;letter-spacing:-0.01em">Guto</div><div style="font-size:13px;font-weight:500;color:#737373">copiloto de análises</div>');
    h('div', { style: { marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '16px', color: '#a3a3a3' } }, head, I('maximize-2', { size: 17 }) + I('x', { size: 20 }));

    /* ---------- footer: input + note (+ badge above) ---------- */
    const FOOT_Y = 724;
    const input = h('div', { style: { position: 'absolute', left: '24px', right: '24px', top: `${FOOT_Y}px`, height: '48px', borderRadius: '12px', border: '1px solid #e5e5e5', background: '#fafafa', display: 'flex', alignItems: 'center', padding: '0 6px 0 16px', fontSize: '15px', color: '#a3a3a3' } }, content);
    h('span', {}, input).textContent = 'Pergunte sobre seus números…';
    h('div', { style: { marginLeft: 'auto', width: '36px', height: '36px', borderRadius: '10px', background: GUTO_BG, display: 'grid', placeItems: 'center', color: '#fff' } }, input, I('send', { size: 17, sw: 2.2 }));
    const noteRow = h('div', { style: { position: 'absolute', left: '0', right: '0', top: `${FOOT_Y + 58}px`, textAlign: 'center' } }, content);
    const note = h('span', { style: { position: 'relative', display: 'inline-block', fontSize: '13px', fontWeight: 400, color: C.muted, lineHeight: '18px' } }, noteRow);
    note.textContent = 'O Guto responde com base nos números desta tela.';
    const noteLine = h('div', { style: { position: 'absolute', left: '-6px', right: '-6px', bottom: '-4px', height: '2px', borderRadius: '2px', transformOrigin: '50% 50%',
      background: 'linear-gradient(90deg, rgba(21,219,168,0), #15dba8 18%, #0fb487 50%, #15dba8 82%, rgba(21,219,168,0))', boxShadow: '0 0 8px rgba(21,219,168,.6)' } }, note);
    const badgeRow = h('div', { style: { position: 'absolute', left: '0', right: '0', top: `${FOOT_Y - 56}px`, display: 'flex', justifyContent: 'center' } }, content);
    const badge = h('div', { style: {
      position: 'relative', overflow: 'hidden', display: 'inline-flex', alignItems: 'center', gap: '8px', height: '38px', padding: '0 18px 0 14px', borderRadius: '999px',
      background: '#ecfdf5', border: '1px solid #a7e9d3', color: '#0f8f6f', fontSize: '15px', fontWeight: 700, whiteSpace: 'nowrap',
      boxShadow: '0 6px 18px rgba(21,219,168,.18)',
    } }, badgeRow);
    badge.innerHTML = I('shield-check', { size: 18, sw: 2.3 }) + '<span>Cada número conferido na sua base</span>';
    const badgeSheen = h('div', { style: { position: 'absolute', top: '-10px', left: '0', width: '60px', height: '60px', background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.9), rgba(255,255,255,0))', transform: 'translateX(-80px) skewX(-20deg)' } }, badge);

    /* ---------- empty state + suggestion chips ---------- */
    const empty = h('div', { style: { position: 'absolute', left: '0', right: '0', top: '0', display: 'flex', flexDirection: 'column', alignItems: 'center' } }, content);
    const eAv = h('div', { style: { width: '64px', height: '64px', borderRadius: '50%', background: GUTO_BG, display: 'grid', placeItems: 'center', color: '#fff', boxShadow: '0 10px 26px rgba(56,204,156,.4)' } }, empty, I('sparkles', { size: 30, sw: 2 }));
    const eTitle = h('div', { style: { marginTop: '16px', fontSize: '22px', fontWeight: 800, color: '#171717', letterSpacing: '-0.01em' } }, empty);
    eTitle.textContent = 'Como posso ajudar?';
    const chipsBox = h('div', { style: { marginTop: '22px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' } }, empty);
    const CHIPS = ['Vou bater minha meta?', 'Quem eu chamo primeiro hoje?', ASK];
    const chips = CHIPS.map((tx) => {
      const e = h('div', { style: {
        display: 'inline-flex', alignItems: 'center', gap: '8px', height: '40px', padding: '0 18px 0 14px', borderRadius: '999px',
        background: '#ecfdf5', border: '1px solid rgba(39,174,143,.38)', color: C.tealDark, fontSize: '16px', fontWeight: 600, whiteSpace: 'nowrap',
      } }, chipsBox);
      e.innerHTML = I('sparkles', { size: 15, sw: 2.2 }) + `<span>${tx}</span>`;
      return e;
    });
    const EMPTY_H = empty.offsetHeight;
    empty.style.top = `${Math.round(72 + (FOOT_Y - 72) / 2 - EMPTY_H / 2)}px`;

    /* ---------- user bubble (flies out of chip 3) ---------- */
    const ub = h('div', { style: {
      position: 'absolute', left: '0', top: '0', padding: '11px 18px', background: C.teal, color: '#fff', fontSize: '17px', fontWeight: 600,
      whiteSpace: 'nowrap', borderRadius: '16px 4px 16px 16px', transformOrigin: '0 0', lineHeight: '24px',
    } }, content);
    ub.textContent = ASK;
    const UBW = ub.offsetWidth, UBH = ub.offsetHeight;
    const UB = { x: P.w - 24 - UBW, y: 96 };
    const C3 = offIn(chips[2], content);
    const K0 = 16 / 17;                                   // chip font / bubble font
    const C3L = offIn(chips[2].querySelector('span'), content);
    const FLY0 = { x: C3L.x - 18 * K0, y: C3L.y + C3L.h / 2 - (11 + 12) * K0 }; // bubble label sits exactly on the chip label

    /* ---------- Guto reply: status line + answer bubble ---------- */
    const AI_Y = UB.y + UBH + 24;
    const aiAv = h('div', { style: { position: 'absolute', left: '24px', top: `${AI_Y}px`, width: '34px', height: '34px', borderRadius: '50%', background: GUTO_BG, display: 'grid', placeItems: 'center', color: '#fff', boxShadow: '0 3px 10px rgba(56,204,156,.35)' } }, content);
    const aiIcon = h('div', { style: { display: 'grid', placeItems: 'center', width: '18px', height: '18px' } }, aiAv, I('sparkles', { size: 18, sw: 2.2 }));
    const status = h('div', { style: { position: 'absolute', left: '70px', top: `${AI_Y}px`, height: '34px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15.5px', fontWeight: 500, whiteSpace: 'nowrap' } }, content);
    const stCheck = h('span', { style: { display: 'inline-flex', color: C.tealDark, width: '17px' } }, status, I('circle-check', { size: 17, sw: 2.3 }));
    const stTxt = h('span', {}, status);
    stTxt.textContent = 'Interrogando os números (eles sempre confessam)…';
    Object.assign(stTxt.style, {
      backgroundImage: 'linear-gradient(90deg, #8f8f8f 0%, #8f8f8f 38%, #0fbf92 50%, #8f8f8f 62%, #8f8f8f 100%)', backgroundSize: '320% 100%',
      webkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
    });

    const ANS_Y = AI_Y + 46;
    const ans = h('div', { style: { position: 'absolute', left: '70px', top: `${ANS_Y}px`, background: '#f3f4f4', borderRadius: '4px 18px 18px 18px', padding: '15px 20px', overflow: 'hidden', transformOrigin: '0 0' } }, content);
    const ansText = h('div', { style: { position: 'relative', fontSize: '21px', fontWeight: 500, lineHeight: '32px', color: '#262626', whiteSpace: 'nowrap' } }, ans);
    const SEG = [
      { t: 'Sim. A ' }, { t: 'Revenda Bella', b: 1, g: 0 }, { t: ' (Ouro)', g: 0 }, { br: 1 },
      { t: 'está há ' }, { t: '4 meses', b: 1, g: 1 }, { t: ' sem comprar.' }, { br: 1 },
      { t: 'Ticket médio: ' }, { t: 'R$ 2.340', b: 1, g: 2 }, { t: '.' },
    ];
    const groups = [];
    const chars = [];
    for (const sg of SEG) {
      if (sg.br) { h('br', {}, ansText); continue; }
      let par = ansText;
      if (sg.g != null) {
        if (!groups[sg.g]) groups[sg.g] = h('span', { style: { whiteSpace: 'nowrap' } }, ansText);
        par = groups[sg.g];
      }
      if (sg.b) par = h('span', { style: { fontWeight: 700, color: C.petroleo } }, par);
      for (const ch of sg.t) { const sp = h('span', {}, par); sp.textContent = ch; chars.push(sp); }
    }
    const caret = h('div', { style: { position: 'absolute', left: '0', top: '0', width: '2.5px', height: '24px', borderRadius: '2px', background: C.teal } }, ansText);
    const NCH = chars.length;
    const cpos = chars.map((c) => ({ x: c.offsetLeft, y: c.offsetTop, w: c.offsetWidth }));
    const lineTops = [...new Set(cpos.map((c) => c.y))].sort((a, b) => a - b);
    const lineStart = lineTops.map((y) => cpos.findIndex((c) => c.y === y));
    const ANS_W = ans.offsetWidth, ANS_H = ans.offsetHeight;
    const ANS_PAD = ANS_H - 32 * lineTops.length;
    const T_TYPE0 = 2.0, T_TYPE1 = 3.0;
    const typeN = (t) => Math.floor(clamp(inv(t, T_TYPE0, T_TYPE1)) * NCH + 1e-6);
    const lineAt = lineStart.map((i) => T_TYPE0 + (i / NCH) * (T_TYPE1 - T_TYPE0));
    // the bubble grows with the typed text: prefix max of the right edge of the first n chars
    const prefR = [0];
    for (let i = 0; i < NCH; i++) prefR.push(Math.max(prefR[i], cpos[i].x + cpos[i].w));
    const ANS_PX = ANS_W - prefR[NCH];                    // horizontal padding (both sides)
    // "Guto is typing…" dots that fill the bubble before the answer arrives (1.66–2.0)
    const DOT_D = 9, DOT_G = 6;
    const DOTS_W = Math.round(ANS_PX + 3 * DOT_D + 2 * DOT_G + 4);
    const dotsBox = h('div', { style: { position: 'absolute', left: `${ANS_PX / 2}px`, top: `${ANS_PAD / 2}px`, height: '32px', display: 'flex', alignItems: 'center', gap: `${DOT_G}px` } }, ans);
    const dots = [0, 1, 2].map(() => h('div', { style: { width: `${DOT_D}px`, height: `${DOT_D}px`, borderRadius: '50%', background: '#9aa3a1' } }, dotsBox));
    const T_BUB = 1.66;                                   // bubble (with dots) pops in
    let ansW = ANS_W;                                     // current bubble width (read by the traces)
    ans.style.width = `${ANS_W}px`;

    /* ---------- verification brackets (content coords) ---------- */
    const brSvg = GTR.s('svg', { width: P.w, height: P.h, viewBox: `0 0 ${P.w} ${P.h}`, style: { position: 'absolute', left: '0', top: '0', overflow: 'visible', pointerEvents: 'none' } }, content);
    const BR_COL = '#0fb487';
    const ROOM = 7; // px of breathing room each bracketed value gains when it gets boxed
    const BR = groups.map((g) => {
      const r = offIn(g, content);
      const b = { x: r.x - 4, y: r.y - 2, w: r.w + 8, h: r.h + 4 };
      const grp = GTR.s('g', {}, brSvg);
      const hl = GTR.s('rect', { x: b.x, y: b.y, width: b.w, height: b.h, rx: 6, fill: 'rgba(21,219,168,.17)' }, grp);
      hl.style.transformBox = 'fill-box';
      hl.style.transformOrigin = '0% 50%';
      const L = 11;
      const X0 = b.x, Y0 = b.y, X1 = b.x + b.w, Y1 = b.y + b.h;
      const corners = [
        `M${X0},${Y0 + L} L${X0},${Y0} L${X0 + L},${Y0}`,
        `M${X1 - L},${Y0} L${X1},${Y0} L${X1},${Y0 + L}`,
        `M${X1},${Y1 - L} L${X1},${Y1} L${X1 - L},${Y1}`,
        `M${X0 + L},${Y1} L${X0},${Y1} L${X0},${Y1 - L}`,
      ].map((d) => {
        const pth = GTR.s('path', { d, fill: 'none', stroke: BR_COL, 'stroke-width': 2.8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, grp);
        pth.style.strokeDasharray = `${2 * L}`;
        return pth;
      });
      return Object.assign(b, { g, grp, hl, corners, L, m: 0 });
    });
    // right edge of each typed line (for the bubble width while values gain room)
    const lineRight = lineTops.map((y) => Math.max(...cpos.filter((c) => c.y === y).map((c) => c.x + c.w)));
    const LR_MAX = Math.max(...lineRight);

    /* ---------- client card (§1.7, light) ---------- */
    const CC_Y = ANS_Y + ANS_H + 14;
    const CC_W = P.w - 70 - 24;
    const cc = h('div', { style: {
      position: 'absolute', left: '70px', top: `${CC_Y}px`, width: `${CC_W}px`, padding: '18px', borderRadius: '16px', background: '#fff',
      border: `1px solid ${C.border}`, boxShadow: '0 1px 2px rgba(0,0,0,.04), 0 14px 34px rgba(0,0,0,.09)', transformOrigin: '0% 0%',
    } }, content);
    const ccRow = h('div', { style: { display: 'flex', alignItems: 'center', gap: '18px' } }, cc);
    const ccAv = KIT.avatar(ccRow, { text: 'RB', size: 72, bg: 'linear-gradient(135deg,#f3b315,#a16207)' });
    Object.assign(ccAv.style, { fontFamily: 'var(--font-ui)', fontWeight: 800, fontSize: '26px' });
    const ccInfo = h('div', { style: { display: 'flex', flexDirection: 'column', gap: '9px', minWidth: '0' } }, ccRow);
    const ccName = h('div', { style: { display: 'flex', alignItems: 'center', gap: '10px' } }, ccInfo);
    h('span', { style: { fontSize: '24px', fontWeight: 800, color: '#171717', letterSpacing: '-0.015em' } }, ccName).textContent = 'Revenda Bella';
    const tier = h('span', { style: { display: 'inline-flex', alignItems: 'center', gap: '5px', height: '26px', padding: '0 11px 0 8px', borderRadius: '999px', background: 'rgba(243,179,21,.18)', color: '#a16207', fontSize: '14px', fontWeight: 700 } }, ccName);
    tier.innerHTML = '<span class="emoji" style="font-size:14px;line-height:1">🏅</span><span>Ouro</span>';
    const alert = h('div', { style: { alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: '6px', height: '28px', padding: '0 12px 0 10px', borderRadius: '999px', background: 'rgba(239,68,68,.1)', color: '#dc2626', fontSize: '14px', fontWeight: 700, whiteSpace: 'nowrap' } }, ccInfo);
    alert.innerHTML = I('clock', { size: 15, sw: 2.4 }) + '<span>há 4 meses sem comprar</span>';
    const waBtn = h('div', { style: { position: 'relative', overflow: 'hidden', marginTop: '16px', height: '46px', borderRadius: '12px', background: C.wa, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '9px', fontSize: '16px', fontWeight: 700, boxShadow: '0 6px 16px rgba(37,211,102,.28)' } }, cc);
    waBtn.innerHTML = I('message-circle', { size: 20, sw: 2.3 }) + '<span>Chamar no WhatsApp</span>';
    const waSheen = h('div', { style: { position: 'absolute', top: '-20px', left: '0', width: '90px', height: '90px', background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.55), rgba(255,255,255,0))', transform: 'translateX(-120px) skewX(-20deg)' } }, waBtn);
    const CC_H = cc.offsetHeight;

    /* ---------- next step ---------- */
    const NS_Y = CC_Y + CC_H + 18;
    const next = h('div', { style: { position: 'absolute', left: '70px', top: `${NS_Y}px`, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '17px', fontWeight: 600, color: C.tealDark, whiteSpace: 'nowrap' } }, content);
    next.innerHTML = I('arrow-right', { size: 19, sw: 2.4 }) + '<span>Próximo passo: chamar hoje com a coleção nova.</span>';

    /* ================= TRACES (canvas, above the panel) ================= */
    const { canvas: cv, ctx: g2 } = GTR.canvas(world);
    cv.style.pointerEvents = 'none';
    // port i: the bubble's right edge, at the vertical middle of the answer line holding value i
    // (screen coords of the un-pushed world; the canvas lives in the same world)
    const LINE_OF = BR.map((b) => lineTops.indexOf(cpos[chars.findIndex((c) => b.g.contains(c))].y));
    const port = (i, t) => {
      const o = panOff(t);
      return { x: P.x + o.x + 70 + ansW, y: P.y + o.y + ANS_Y + ANS_PAD / 2 + lineTops[LINE_OF[i]] + 16 };
    };
    // bracket right edge (screen), for the bracket → port glint
    const brRight = (i, t) => { const o = panOff(t), b = BR[i]; return P.x + o.x + b.x + b.m + b.w; };
    // polyline for trace i: port → right (clear of all copy) → rounded riser → into the card
    const tracePts = (i, t) => {
      const q = port(i, t);
      const sx = q.x + 6, sy = q.y, ex = SX - 1;
      const pts = [[sx, sy]];
      if (i === 0) {
        pts.push([ex, sy]);                                   // straight into card 0 (its middle band)
      } else {
        const vx = VX[i], ty = SY[i] + SH / 2 + srcOff(t);
        const dir = ty >= sy ? 1 : -1;
        const r = Math.min(12, Math.abs(ty - sy) / 2);
        const corner = (ax, ay, cx, cy, bx, by) => { for (let k = 1; k <= 6; k++) { const u = k / 6; pts.push([(1 - u) * (1 - u) * ax + 2 * (1 - u) * u * cx + u * u * bx, (1 - u) * (1 - u) * ay + 2 * (1 - u) * u * cy + u * u * by]); } };
        pts.push([vx - r, sy]);
        corner(vx - r, sy, vx, sy, vx, sy + dir * r);
        pts.push([vx, ty - dir * r]);
        corner(vx, ty - dir * r, vx, ty, vx + r, ty);
        pts.push([ex, ty]);
      }
      const cum = [0];
      for (let k = 1; k < pts.length; k++) cum.push(cum[k - 1] + Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]));
      return { pts, cum, len: cum[cum.length - 1] };
    };
    const at = (tr, d) => {
      d = clamp(d, 0, tr.len);
      let k = 1;
      while (k < tr.cum.length - 1 && tr.cum[k] < d) k++;
      const a = tr.pts[k - 1], b = tr.pts[k];
      const u = (d - tr.cum[k - 1]) / ((tr.cum[k] - tr.cum[k - 1]) || 1);
      return [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];
    };
    const strokeTo = (tr, d) => {
      g2.beginPath();
      g2.moveTo(tr.pts[0][0], tr.pts[0][1]);
      for (let k = 1; k < tr.pts.length; k++) {
        if (tr.cum[k] <= d) g2.lineTo(tr.pts[k][0], tr.pts[k][1]);
        else { const q = at(tr, d); g2.lineTo(q[0], q[1]); break; }
      }
      g2.stroke();
    };
    const dot = (x, y, r, a) => {
      const gr = g2.createRadialGradient(x, y, 0, x, y, r * 3.2);
      gr.addColorStop(0, `rgba(255,255,255,${a})`);
      gr.addColorStop(0.3, `rgba(21,219,168,${a * 0.9})`);
      gr.addColorStop(1, 'rgba(21,219,168,0)');
      g2.fillStyle = gr;
      g2.beginPath();
      g2.arc(x, y, r * 3.2, 0, Math.PI * 2);
      g2.fill();
    };
    // connector port on the bubble edge: teal ring + white core, with an ignition pulse
    const portNode = (x, y, a, ig) => {
      g2.globalAlpha = a;
      if (ig > 0 && ig < 1) {
        g2.strokeStyle = `rgba(21,219,168,${0.7 * (1 - ig)})`;
        g2.lineWidth = 2;
        g2.beginPath();
        g2.arc(x, y, 5 + 13 * E('power2.out')(ig), 0, Math.PI * 2);
        g2.stroke();
      }
      g2.fillStyle = '#15dba8';
      g2.beginPath();
      g2.arc(x, y, 5.5, 0, Math.PI * 2);
      g2.fill();
      g2.fillStyle = '#ffffff';
      g2.beginPath();
      g2.arc(x, y, 2.3, 0, Math.PI * 2);
      g2.fill();
      g2.globalAlpha = 1;
    };
    // bracket → port glint: a short 30%-alpha comet along the line's middle (transient, never a solid trace)
    const glint = (x0, x1, y, u, a) => {
      if (u <= 0 || u >= 1) return;
      const hx = lerp(x0, x1, E('power2.inOut')(u));
      const tail = Math.min(46, hx - x0);
      const gr = g2.createLinearGradient(hx - tail, y, hx, y);
      gr.addColorStop(0, 'rgba(21,219,168,0)');
      gr.addColorStop(1, `rgba(21,219,168,${0.3 * a * Math.sin(Math.PI * u)})`);
      g2.strokeStyle = gr;
      g2.lineWidth = 3;
      g2.beginPath();
      g2.moveTo(hx - tail, y);
      g2.lineTo(hx, y);
      g2.stroke();
    };

    /* ---------- value packets: each trace's head carries the value it fetches ---------- */
    const PK = SRC.map((s, i) => {
      const e = h('div', { style: {
        position: 'absolute', left: '0', top: '0', height: '24px', padding: '0 10px', display: 'inline-flex', alignItems: 'center', borderRadius: '999px',
        background: '#062624', border: '1px solid rgba(21,219,168,.85)', color: i === 0 ? '#ffd24a' : '#eafff7', fontFamily: 'var(--font-ui)',
        fontSize: '13px', fontWeight: 700, letterSpacing: '0.01em', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums', transformOrigin: '50% 50%',
        boxShadow: '0 0 16px rgba(21,219,168,.55), 0 6px 14px rgba(0,0,0,.4)', pointerEvents: 'none', visibility: 'hidden',
      } }, world);
      e.textContent = s.d.value;
      const vw = s.val.offsetWidth;
      return { e, w: e.offsetWidth, hh: e.offsetHeight, vx: SX + 22 + vw / 2, vy: SY[i] + 56 + 20 }; // value centre in its card
    });

    /* ================= CURSOR + CHIP ================= */
    const cursor = KIT.cursor(root);
    const chipWrap = h('div', { style: { position: 'absolute', inset: '0', pointerEvents: 'none' } }, root);
    const chip = KIT.diagChip(chipWrap, { n: '04', err: 'CLIENTE OURO SUMIU', ok: 'CLIENTE NA MIRA', x: 120, y: 96 });

    /* ================= TIMELINE (HUD headlines only) ================= */
    const tl = ctx.tl();
    KIT.revealWords(tl, hA.units, 0.3);
    KIT.hideUnits(tl, hA.units, 3.6);
    KIT.revealWords(tl, hB.units, 4.0);
    KIT.hideUnits(tl, hB.units, 7.4, { dur: 0.3, stagger: 0.02 });
    tl.set({}, {}, 8);

    /* ================= SFX ================= */
    ctx.cue('pop', 0.0, { db: -6, pan: 0.6 });
    ctx.cue('tick', 0.0, { db: -6 });                                               // chip 04 stamps on the bar line
    ctx.cue('whoosh', 0.15, { dur: 0.5, pan: 0.3 });
    [0.9, 1.0, 1.1].forEach((t) => ctx.cue('pop', t, { db: -8 }));
    ctx.cue('pop', 1.4);
    ctx.cue('shimmer', 1.6, { db: -8 });
    [[1.6, 1300], [1.75, 1500], [1.9, 1700]].forEach(([t, f]) => ctx.cue('blip', t, { freq: f, db: -10, pan: 0.6 }));
    ctx.cue('blip', 2.0, { freq: 2000 });
    ctx.cue('pop', 2.0);
    ctx.cue('type', 2.0, { dur: 1.0, rate: 22, db: -6 });
    ctx.cue('pop', 3.0);
    ctx.cue('shimmer', 3.2);
    T_VER.forEach((t, i) => ctx.cue('blip', t, { freq: 2000 + i * 200, pan: 0.2 + i * 0.2 }));
    ARR.forEach((t, i) => ctx.cue('tick', t, { db: -8, pan: 0.55 + i * 0.05 }));   // check stamps land
    ctx.cue('ping', 5.0);
    ctx.cue('swoosh', 7.34, { up: false, dur: 0.42 });                              // panel folds into Guto
    ctx.cue('pop', 7.75, { db: -6, pan: 0.6 });                                      // red dot lands (hand-off)

    /* ================= per-frame ================= */
    const shadowFor = (k) => `0 ${lerp(14, 40, k)}px ${lerp(34, 120, k)}px rgba(0,0,0,${lerp(0.4, 0.55, k)}), 0 0 0 1px rgba(255,255,255,${lerp(0.14, 0.08, k)}), 0 0 ${lerp(46, 80, k)}px rgba(21,219,168,${lerp(0.55, 0.12, k)})`;

    return {
      tl,
      update(local) {
        const t = local;
        const o = panOff(t);
        // camera: s1 = slow push around (1600, 540); s2 = push onto the answer bubble while the
        // brackets draw (3.85–4.8), released 5.2–6.6. Composite: p' = S·p + T (origin 0 0).
        const s1 = 1 + 0.025 * p(t, 1.0, 7.0, 'sine.inOut') * (1 - p(t, 7.2, 7.8, 'power2.inOut'));
        const s2 = 1 + 0.038 * p(t, 3.85, 4.8, 'sine.inOut') * (1 - p(t, 5.2, 6.6, 'sine.inOut'));
        const FX = 950, FY = 400;
        const camS = s1 * s2;
        const camX = FX * (1 - s2) + s2 * 1600 * (1 - s1), camY = FY * (1 - s2) + s2 * 540 * (1 - s1);
        world.style.transform = `translate(${camX.toFixed(3)}px, ${camY.toFixed(3)}px) scale(${camS.toFixed(5)})`;

        /* ---------- button ↔ panel morph ---------- */
        let R, k;
        if (t < 0.15) {
          const e = p(t, 0, 0.15, 'back.out(1.7)');
          R = btnRect({ x: lerp(B0.x, B1.x, e), y: lerp(B0.y, B1.y, e), d: B0.d });
          k = 0;
        } else if (t < 7.2) {
          const m = p(t, 0.15, 0.7, 'expo.out');
          R = lerpRect(btnRect(B1), { x: P.x + o.x, y: P.y + o.y, w: P.w, h: P.h, r: P.r }, m);
          k = m;
        } else {
          // fold back into the button: a readable shrink (power3, not expo) that keeps the white
          // panel + content until w < ~250, and rounds off early so it is a circle by w ≈ 140
          const m = p(t, 7.2, 7.85, 'power3.inOut');
          const o0 = panOff(7.2);
          R = lerpRect({ x: P.x + o0.x, y: P.y + o0.y, w: P.w, h: P.h, r: P.r }, btnRect(BE), m);
          R.r = lerp(P.r, Math.min(R.w, R.h) / 2, p(m, 0.45, 0.8, 'power1.inOut'));
          k = 1 - m;
          // landing settle
          const sb = 0.07 * bump(t, 7.79, 0.18);
          if (sb > 0) R = { x: R.x - R.w * sb / 2, y: R.y - R.h * sb / 2, w: R.w * (1 + sb), h: R.h * (1 + sb), r: R.r * (1 + sb) };
        }
        morph.style.left = `${R.x}px`;
        morph.style.top = `${R.y}px`;
        morph.style.width = `${R.w}px`;
        morph.style.height = `${R.h}px`;
        morph.style.borderRadius = `${R.r}px`;
        morph.style.boxShadow = shadowFor(k);
        const cx = R.x + R.w / 2, cy = R.y + R.h / 2;
        mGrad.style.opacity = t < 7 ? 1 - p(t, 0.15, 0.33, 'power1.inOut') : p(t, 7.56, 7.68, 'power1.inOut');
        const iconA = t < 7 ? 1 - inv(t, 0.15, 0.25) : inv(t, 7.62, 7.77);
        vis(mIcon, iconA);
        mIcon.style.transform = `scale(${R.w / 90}) rotate(${noise(2.2, t * 0.8) * 10}deg)`;
        const cA = t < 7 ? p(t, 0.21, 0.55, 'power2.out') : 1 - p(t, 7.52, 7.63, 'power2.in');
        vis(content, cA);
        content.style.transform = `scale(${R.w / P.w}, ${R.h / P.h})`;
        const shp = p(t, 0.47, 1.1, 'power2.inOut');
        sheen.style.transform = `translate(${lerp(-360, P.w + 120, shp)}px, -200px) rotate(45deg)`;
        sheen.style.visibility = shp > 0 && shp < 1 ? 'visible' : 'hidden';
        // red dot (button states only)
        const dA = t < 7 ? 1 - inv(t, 0.15, 0.21) : pop(t, 7.75, 0.22, 'back.out(3)');
        const dD = 0.2 * R.w + 2;
        vis(redDot, clamp(dA * 3));
        redDot.style.transform = `translate(${cx + 0.35 * R.w - 10}px, ${cy - 0.35 * R.h - 10}px) scale(${(dD / 20) * Math.max(0, dA)})`;
        // button glow + pulses
        const gA = t < 7 ? 1 - p(t, 0.15, 0.45, 'power2.out') : p(t, 7.59, 8.0, 'power2.out');
        btnGlow.style.opacity = gA * (0.85 + 0.15 * Math.sin(t * 5));
        btnGlow.style.transform = `translate(${cx}px, ${cy}px) scale(${lerp(0.7, 1, R.w / 90)})`;
        // pulse ring rides the morph rect centre (it sits under the morph div, so the growing panel
        // swallows it) and is gone by 0.24 — never left hanging after the button starts to morph.
        // Intro: fires on the bar line (0.00) so the first frames carry the button's pulse.
        // Outro: rings out from the landed button into the cut (still expanding at 8.0).
        const intro = t < 4;
        const pr = intro ? inv(t, 0.0, 0.34) : inv(t, 7.8, 8.08);
        const ringA = intro ? 0.8 * (1 - inv(t, 0.14, 0.24)) : 0.6;
        ringEl.style.transform = `translate(${cx}px, ${cy}px) scale(${lerp(0.9, 2.1, E('power2.out')(pr))})`;
        ringEl.style.opacity = pr > 0 && pr < 1 ? (1 - pr) * ringA : 0;

        /* ---------- back glows ---------- */
        glowP.style.opacity = p(t, 0.25, 1.05, 'power2.out') * (1 - p(t, 7.25, 7.8, 'power2.in')) * (0.85 + 0.15 * Math.sin(t * 1.2));
        glowP.style.transform = `translate(${noise(1.1, t * 0.2) * 40}px, ${noise(5.5, t * 0.2) * 30}px)`;
        glowS.style.opacity = p(t, 1.6, 2.4, 'power2.out') * (1 - p(t, 7.15, 7.5, 'power2.in'));

        /* ---------- empty state + chips ---------- */
        const out = p(t, 1.42, 1.62, 'power2.in');
        vis(eAv, 1 - out);
        vis(eTitle, 1 - out);
        eAv.style.transform = `translateY(${-14 * out}px) scale(${1 + 0.04 * Math.sin(t * 3)})`;
        eTitle.style.transform = `translateY(${-14 * out}px)`;
        chips.forEach((c, i) => {
          const a = pop(t, 0.9 + i * 0.1, 0.42, 'back.out(1.8)');
          if (i === 2) {
            vis(c, clamp(a * 2) * (1 - inv(t, 1.4, 1.47)));
            c.style.transform = `translateY(${(1 - clamp(a)) * 12}px) scale(${lerp(0.82, 1, a)})`;
          } else {
            vis(c, clamp(a * 2) * (1 - out));
            c.style.transform = `translateY(${(1 - clamp(a)) * 12 + out * 16}px) scale(${lerp(0.82, 1, a)})`;
          }
        });

        /* ---------- user bubble: flight from chip 3 ---------- */
        const fu = p(t, 1.4, 1.62, 'power3.inOut');
        vis(ub, t >= 1.4 ? 1 : 0);
        {
          const sc = lerp(K0, 1, fu);
          const x0 = FLY0.x, y0 = FLY0.y;
          const x = lerp(x0, UB.x, fu), y = lerp(y0, UB.y, fu) - 46 * Math.sin(Math.PI * fu);
          ub.style.transform = `translate(${x}px, ${y}px) scale(${sc * (1 + 0.04 * bump(t, 1.6, 0.18))})`;
          ub.style.background = mix('ecfdf5', '38cc9c', fu);
          ub.style.color = mix('27ae8f', 'ffffff', fu);
          const rr = lerp(UBH / 2, 16, fu), r2 = lerp(UBH / 2, 4, fu);
          ub.style.borderRadius = `${rr}px ${r2}px ${rr}px ${rr}px`;
          ub.style.boxShadow = `inset 0 0 0 1px rgba(39,174,143,${0.38 * (1 - fu)}), 0 ${4 * fu}px ${14 * fu}px rgba(56,204,156,${0.35 * fu})`;
        }

        /* ---------- Guto status line + answer ---------- */
        const stA = pop(t, 1.58, 0.35, 'power3.out');
        vis(aiAv, stA);
        aiAv.style.transform = `scale(${lerp(0.6, 1, pop(t, 1.58, 0.4, 'back.out(2)'))})`;
        vis(status, stA);
        status.style.transform = `translateX(${(1 - stA) * -10}px)`;
        const thinking = t < 3.0;
        aiIcon.style.transform = `rotate(${thinking ? (t - 1.58) * 540 : 540 * 1.42 + 180 * p(t, 3.0, 3.4, 'power3.out')}deg) scale(${thinking ? 1 + 0.12 * Math.sin(t * 14) : 1})`;
        const done = p(t, 3.0, 3.3, 'power2.out');
        stTxt.style.backgroundPosition = `${lerp(100, 0, ((t - 1.58) / 0.8) % 1)}% 0`;
        stTxt.style.backgroundImage = done < 1
          ? `linear-gradient(90deg, #8f8f8f 0%, #8f8f8f 38%, rgba(15,191,146,${1 - done}) 50%, #8f8f8f 62%, #8f8f8f 100%)`
          : 'linear-gradient(90deg, #8f8f8f, #8f8f8f)';
        stCheck.style.width = `${17 * done}px`;
        stCheck.style.opacity = done;
        status.style.gap = `${8 * done}px`;

        // bubble pops at 1.66 holding "typing" dots; the answer replaces them from 2.0 and the
        // bubble widens with the typed text
        const aA = pop(t, T_BUB, 0.35, 'back.out(1.6)');
        vis(ans, clamp(aA * 3));
        const dotsA = 1 - inv(t, 1.98, 2.06);
        vis(dotsBox, dotsA);
        dots.forEach((d, i) => {
          const ph = Math.max(0, Math.sin((t - T_BUB) * 2 * Math.PI * 2.4 - i * 0.9));
          d.style.transform = `translateY(${-5 * ph}px)`;
          d.style.opacity = 0.45 + 0.55 * ph;
        });
        const n = typeN(t);
        for (let i = 0; i < NCH; i++) chars[i].style.visibility = i < n ? 'visible' : 'hidden';
        let hLines = 1;
        for (let kk = 1; kk < lineAt.length; kk++) hLines += p(t, lineAt[kk], lineAt[kk] + 0.1, 'power2.out');
        ans.style.height = `${ANS_PAD + 32 * hLines}px`;
        ans.style.transform = `scale(${lerp(0.9, 1, aA) * (1 + 0.025 * bump(t, 2.0, 0.22))})`;
        const cp = n < NCH ? cpos[n] : { x: cpos[NCH - 1].x + cpos[NCH - 1].w, y: cpos[NCH - 1].y };
        caret.style.transform = `translate(${cp.x + 1}px, ${cp.y + 4}px)`;
        caret.style.opacity = t >= 2.0 && t < 3.3 && (t < 3.0 || Math.floor(t * 4) % 2 === 0) ? 1 : 0;

        /* ---------- client card ---------- */
        const ccP = pop(t, 3.0, 0.45, 'back.out(1.5)');
        vis(cc, clamp(ccP * 2.5));
        cc.style.transform = `translateY(${(1 - clamp(ccP)) * 18}px) scale(${lerp(0.94, 1, ccP)})`;
        const gold = p(t, 3.2, 3.8, 'power2.inOut');
        ccAv.style.filter = `grayscale(${1 - gold})`;
        ccAv.style.boxShadow = `0 0 0 3px ${mix('b5b5b5', 'f3b315', gold)}, 0 0 ${24 * gold + 8 * gold * Math.sin(t * 4)}px rgba(243,179,21,${0.55 * gold})`;
        tier.style.opacity = lerp(0.4, 1, gold);
        tier.style.filter = `grayscale(${1 - gold})`;
        const ws = p(t, 3.6, 3.95, 'power2.inOut');
        waSheen.style.transform = `translateX(${lerp(-120, CC_W + 40, ws)}px) skewX(-20deg)`;
        waSheen.style.visibility = ws > 0 && ws < 1 ? 'visible' : 'hidden';

        const nsP = p(t, 3.4, 3.8, 'power3.out');
        vis(next, nsP);
        next.style.transform = `translateX(${(1 - nsP) * -14}px)`;
        next.style.clipPath = `inset(-4px ${100 - 100 * p(t, 3.4, 3.75, 'power2.out')}% -4px -4px)`;

        /* ---------- verification: brackets, traces, stamps ---------- */
        let extraW = 0;
        BR.forEach((b, i) => {
          const t0 = T_VER[i];
          b.m = ROOM * p(t, t0 - 0.08, t0 + 0.14, 'power2.out');
          b.g.style.margin = `0 ${b.m}px`;
          b.grp.setAttribute('transform', `translate(${b.m.toFixed(2)},0)`);
          extraW = Math.max(extraW, lineRight[i] + 2 * b.m - LR_MAX);
          const dp = p(t, t0, t0 + 0.18, 'power2.out');
          b.corners.forEach((c) => {
            c.style.strokeDashoffset = `${2 * b.L * (1 - dp)}`;
            c.style.opacity = t >= t0 ? 1 : 0;
          });
          b.hl.style.transform = `scaleX(${p(t, t0 + 0.02, t0 + 0.24, 'power3.out')})`;
          b.hl.style.opacity = t >= t0 ? 1 : 0;
          // the bracket glows as its trace launches (links bracket → port → card without a line on the copy)
          const gl = bump(t, T_LNK[i], 0.5);
          b.hl.setAttribute('fill', `rgba(21,219,168,${(0.17 + 0.16 * gl).toFixed(3)})`);
          b.grp.style.filter = gl > 0.01 ? `drop-shadow(0 0 ${(6 * gl).toFixed(2)}px rgba(21,219,168,${(0.85 * gl).toFixed(3)}))` : 'none';
        });
        ansW = Math.max(DOTS_W, prefR[n] + ANS_PX) + extraW;
        ans.style.width = `${ansW}px`;
        // brackets fade with the source column (7.15–7.45), as the panel starts to fold
        brSvg.style.opacity = 1 - p(t, 7.15, 7.45, 'power2.in');
        g2.clearRect(0, 0, 1920, 1080);
        const trA = 1 - p(t, 7.15, 7.45, 'power2.in');
        if (t >= T_VER[0] && trA > 0) {
          g2.save();
          g2.lineCap = 'round';
          g2.lineJoin = 'round';
          BR.forEach((b, i) => {
            const t0 = T_VER[i];
            if (t < t0) return;
            const q0 = port(i, t);
            // 1) bracket → port: brief 30%-alpha glint along the middle of the line (no solid trace on copy)
            glint(brRight(i, t) + 4, q0.x, q0.y, inv(t, T_LNK[i], T_GO[i] + 0.02), trA);
            // 2) port node on the bubble edge ignites
            portNode(q0.x, q0.y, trA * clamp(inv(t, T_GO[i] - 0.05, T_GO[i]) * 1.5), inv(t, T_GO[i] - 0.02, T_GO[i] + 0.36));
            if (t < T_GO[i]) return;
            // 3) trace runs port → card
            const tr = tracePts(i, t);
            const u = p(t, T_GO[i], ARR[i], 'power2.in');
            const headD = tr.len * u;
            g2.globalAlpha = trA;
            g2.strokeStyle = 'rgba(21,219,168,.35)';
            g2.lineWidth = 7;
            strokeTo(tr, headD);
            g2.strokeStyle = '#15dba8';
            g2.lineWidth = 2.2;
            strokeTo(tr, headD);
            if (u < 1) {
              const q = at(tr, headD);
              dot(q[0], q[1], 5, 1 * trA);
            } else {
              // steady data packets flowing port → card
              for (let m = 0; m < 2; m++) {
                const f = GTR.fract((t - ARR[i]) / 1.1 + m / 2 + i * 0.17);
                const q = at(tr, tr.len * f);
                dot(q[0], q[1], 3.2, trA * 0.85 * Math.sin(Math.PI * f));
              }
              const q = at(tr, tr.len);
              dot(q[0], q[1], 4, trA * (0.6 + 0.4 * (1 - inv(t, ARR[i], ARR[i] + 0.4))));
            }
            g2.globalAlpha = 1;
          });
          g2.restore();
        }

        /* ---------- value packets (DOM pills riding the trace heads) ---------- */
        PK.forEach((k2, i) => {
          const t0 = T_GO[i], ar = ARR[i];
          // on arrival the pill dives onto the card's value and dissolves into it (value flashes + stamp)
          const dv = inv(t, ar, ar + 0.14);
          if (t < t0 || dv >= 1 || trA <= 0) { k2.e.style.visibility = 'hidden'; return; }
          const tr = tracePts(i, t);
          const u = p(t, t0, ar, 'power2.in');
          const q = at(tr, Math.max(tr.len * u, k2.w / 2 + 10));
          const so2 = srcOff(t);
          const dm = E('power2.out')(dv);
          const x = lerp(q[0], k2.vx, dm), y = lerp(q[1], k2.vy + so2, dm);
          const sc = lerp(0.55, 1, pop(t, t0, 0.16, 'back.out(2)')) * lerp(1, 0.6, dm);
          k2.e.style.visibility = 'visible';
          k2.e.style.opacity = clamp(inv(t, t0, t0 + 0.05)) * (1 - E('power1.out')(dv)) * trA;
          k2.e.style.transform = `translate(${(x - k2.w / 2).toFixed(2)}px, ${(y - k2.hh / 2).toFixed(2)}px) scale(${sc.toFixed(4)})`;
        });

        /* ---------- source column ---------- */
        const so = srcOff(t);
        const colOut = 1 - p(t, 7.15, 7.45, 'power2.in');
        const ebA = p(t, 1.5, 1.85, 'power3.out');
        vis(eyebrow.el, ebA * colOut);
        eyebrow.el.style.transform = `translate(${(1 - ebA) * 24}px, ${so}px)`;
        SRC.forEach((s, i) => {
          const a = p(t, s.at, s.at + 0.35, 'power3.out');
          vis(s.g, a * colOut);
          s.g.style.transform = `translate(${(1 - a) * 40}px, ${so}px)`;
          const solid = p(t, s.solid, s.solid + 0.22, 'power2.out');
          s.card.style.opacity = lerp(0.42, 1, solid);
          s.fn.style.opacity = lerp(0.55, 1, solid);
          // scanning line while dim
          const sp = GTR.fract((t - s.at) / 0.55);
          s.scan.style.transform = `translateY(${sp * SH}px)`;
          s.scan.style.opacity = (t >= s.at ? 1 : 0) * (1 - solid);
          // skeleton → decoded value
          const dec = inv(t, s.solid, s.solid + 0.28);
          vis(s.sk, 1 - clamp(dec * 3));
          vis(s.val, t >= s.solid ? 1 : 0);
          if (dec < 1) KIT.scramble(s.vtxt, s.d.value, dec, 31 + i * 7);
          else if (s.vtxt.textContent !== s.d.value) s.vtxt.textContent = s.d.value;
          if (s.emo) vis(s.emo, inv(t, s.solid + 0.2, s.solid + 0.3));
          // verification arrival
          const ar = ARR[i];
          const fl = t >= ar ? Math.exp(-(t - ar) * 5) : 0;
          s.flash.style.opacity = fl;
          s.ring.style.opacity = p(t, ar, ar + 0.2, 'power2.out') * (0.8 + 0.2 * Math.sin(t * 3 + i));
          s.val.style.transform = `scale(${1 + 0.1 * bump(t, ar, 0.3)})`;
          s.val.style.color = t >= ar ? mix(i === 0 ? 'f3b315' : 'ffffff', i === 0 ? 'ffd24a' : '15dba8', fl) : (s.d.col || '#fff');
          const st = pop(t, ar, 0.4, 'back.out(2.2)');
          vis(s.stamp, clamp(st * 3));
          s.stamp.style.transform = `scale(${t < ar ? 1.8 : lerp(1.8, 1, st)}) rotate(${lerp(-25, 0, clamp(st))}deg)`;
          vis(s.slot, 1 - inv(t, ar, ar + 0.1));
        });

        /* ---------- badge + footer note ---------- */
        const bP = pop(t, 5.0, 0.42, 'back.out(2.2)');
        vis(badge, clamp(bP * 3));
        badge.style.transform = `scale(${t < 5 ? 1.3 : lerp(1.3, 1, bP)})`;
        const bs = p(t, 5.1, 5.6, 'power2.inOut');
        badgeSheen.style.transform = `translateX(${lerp(-80, 360, bs)}px) skewX(-20deg)`;
        // footer note: teal underline sweeps out from the centre at 5.4, text warms to teal and
        // settles slightly tinted (constant weight → no layout jitter)
        const nl = p(t, 5.4, 5.78, 'power3.out');
        noteLine.style.transform = `scaleX(${nl.toFixed(4)})`;
        noteLine.style.opacity = t < 5.4 ? 0 : lerp(1, 0.55, p(t, 5.9, 6.5, 'power2.inOut'));
        const nb = p(t, 5.4, 5.6, 'power2.out') * lerp(1, 0.45, p(t, 5.9, 6.5, 'power2.inOut'));
        note.style.color = mix('737373', '0f8f6f', nb);

        /* ---------- cursor ---------- */
        const tgt = { x: P.x + o.x + C3.x + C3.w * 0.62, y: P.y + o.y + C3.y + C3.h * 0.55 };
        const cm = p(t, 1.0, 1.38, 'power2.inOut');
        const away = p(t, 1.5, 1.95, 'power2.in');
        const cxp = lerp(1330, tgt.x, cm) + away * 70, cyp = lerp(1010, tgt.y, cm) + away * 90;
        const press = t >= 1.4 && t < 1.66 ? inv(t, 1.4, 1.66) : 0;
        cursor.set(cxp - 4, cyp - 3, press);
        vis(cursor.el, p(t, 1.0, 1.12, 'power1.out') * (1 - p(t, 1.62, 1.9, 'power1.in')));

        /* ---------- HUD ---------- */
        const hudOut = 1 - p(t, 7.4, 7.75, 'power2.in');
        scrim.style.opacity = p(t, 0.15, 0.85, 'power2.out') * hudOut;
        hA.el.style.transform = `translateY(-50%) translateX(${lerp(6, -4, inv(t, 0.3, 4.0))}px)`;
        hB.el.style.transform = `translateY(-50%) translateX(${lerp(10, -10, p(t, 4.0, 7.7, 'sine.inOut'))}px)`;

        /* ---------- chip: red at 0.00 (bar line), flips on the answer (2.0), fades 7.6–7.9 ---------- */
        chip.set(t, inv(t, 0.0, 0.18), inv(t, 2.0, 2.5));
        chipWrap.style.opacity = 1 - p(t, 7.6, 7.9, 'power2.in');

        /* ---------- hand-off dim ---------- */
        const dm = 0.7 * p(t, 7.6, 7.95, 'power1.inOut');
        dim.style.opacity = dm;
        dim.style.display = dm > 0.001 ? 'block' : 'none';
      },
    };
  },
});
