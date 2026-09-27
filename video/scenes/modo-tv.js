/* ============================================================
   S11 · modo-tv · start 58 · dur 8 · z 25   [58–66] · PARABÉNS
   Modo TV do GTR (TVMode.jsx recriado 1:1 num 1280×720 lógico ×1.25):
   a TV liga do preto, cada venda toca (cha-ching) com toast + anel no card,
   Bia cruza o Bronze, a câmera mergulha no card da Ana, ela cruza o Ouro
   e o PARABÉNS dispara com confete no flash dourado [62.0]. Sai inclinando:
   o tilt atravessa o corte (TV ainda ~22% visível no último quadro).
   Tudo é função pura do tempo: o tl só revela textos HUD; o resto é update().
   ============================================================ */
GTR.scene({
  id: 'modo-tv',
  build(root, ctx) {
    const { h, p, clamp, lerp, inv } = GTR;
    const E = GTR.E;
    const tl = ctx.tl();

    /* ---------- tiny cached setters (no redundant DOM writes per frame) ---------- */
    const st = (el, k, v) => { const c = el.__c || (el.__c = {}); if (c[k] !== v) { c[k] = v; el.style[k] = v; } };
    const tx = (el, v) => { if (el.__t !== v) { el.__t = v; el.textContent = v; } };
    const hx = (el, v) => { if (el.__h !== v) { el.__h = v; el.innerHTML = v; } };
    const ic = (name, size, color = 'currentColor', sw = 2) => GTR.iconSVG(name, { size, color, sw });
    const brl = (v) => 'R$ ' + Math.round(v).toLocaleString('pt-BR');
    const compact = (v) => (v >= 1000 ? (v / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + ' mil' : brl(v));
    const f2 = (v) => v.toFixed(2);
    const bump = (a, d = 0.35) => (a < 0 || a > d ? 0 : Math.sin(Math.PI * a / d));

    /* ---------- demo data (STORYBOARD §1.8 + system/Data.jsx) ---------- */
    const PACE = 1.02 / (620000 / 700000); // projeção no ritmo da equipe (GT.team.trend 102%)
    const S = {
      ana:    { name: 'Ana Silva',     ini: 'AS', month: 176000, ouro: 180000, prata: 160000, bronze: 130000, day: 8100, week: 41200, chip: '4321' },
      marina: { name: 'Marina Alves',  ini: 'MA', month: 198000, ouro: 210000, prata: 185000, bronze: 150000, day: 9400, week: 47500, chip: '4321' },
      julia:  { name: 'Júlia Costa',   ini: 'JC', month: 142000, ouro: 160000, prata: 140000, bronze: 115000, day: 6200, week: 33800, chip: '7788' },
      carla:  { name: 'Carla Mendes',  ini: 'CM', month: 79000,  ouro: 110000, prata: 95000,  bronze: 75000,  day: 3200, week: 18600, chip: '7788' },
      paula:  { name: 'Paula Ribeiro', ini: 'PR', month: 86000,  ouro: 120000, prata: 100000, bronze: 80000,  day: 4100, week: 21000, chip: '2255' },
      bia:    { name: 'Bia Ramos',     ini: 'BR', month: 104000, ouro: 150000, prata: 130000, bronze: 105000, day: 3900, week: 24100, chip: '7788' },
    };
    for (const k in S) { S[k].goalDay = S[k].ouro / 20; S[k].goalWeek = S[k].ouro / 4; }
    const ORDER = ['ana', 'marina', 'julia', 'carla', 'paula', 'bia'];
    const SALES = [
      { t: 0.5, id: 'julia', v: 890 },
      { t: 1.0, id: 'paula', v: 1180 },
      { t: 1.5, id: 'bia', v: 1450 },
      { t: 2.0, id: 'marina', v: 640 },
      { t: 3.0, id: 'ana', v: 4400 },
    ];
    const T_OURO = 3.875;
    // counting progress of a sale (0..1). Ana's hero count lands on R$ 180.000 exactly at 3.875 (Ouro).
    const saleQ = (sl, t) => {
      if (sl.id !== 'ana') return p(t, sl.t, sl.t + 0.3, 'power3.out');
      if (t < 3) return 0;
      if (t < T_OURO) return (4000 / 4400) * E('power1.inOut')(inv(t, 3, T_OURO));
      return 4000 / 4400 + (400 / 4400) * p(t, T_OURO, 3.95, 'power2.out');
    };
    const addFor = (id, t) => SALES.reduce((a, sl) => a + (sl.id === id ? sl.v * saleQ(sl, t) : 0), 0);
    const addAll = (t) => SALES.reduce((a, sl) => a + sl.v * saleQ(sl, t), 0);
    // Bia's Bronze crossing time (numeric, deterministic)
    const crossT = (() => { let a = 1.5, b = 2; for (let i = 0; i < 30; i++) { const m = (a + b) / 2; if (S.bia.month + addFor('bia', m) >= S.bia.bronze) b = m; else a = m; } return b; })();

    const TIER = {
      bronze: { col: '#bd6b2f', rgb: '189,107,47', fill: 'linear-gradient(90deg,#bd6b2f,#d98a4f)' },
      prata: { col: '#a3adba', rgb: '139,149,163', fill: 'linear-gradient(90deg,#8b95a3,#b8c0cc)' },
      ouro: { col: '#f3b315', rgb: '243,179,21', fill: 'linear-gradient(90deg,#f3b315,#ffcf3f)' },
    };
    const FILL_NONE = 'linear-gradient(90deg,#b8bfc9,#d3d8df)';

    /* =====================================================================
       WORLD (camera) — TV bezel, black power-on plate, screen with the UI
       ===================================================================== */
    const cam = KIT.camera(root, { perspective: 1600 });
    const W = cam.world;
    const tvGlow = GTR.glow(W, { x: 960, y: 560, r: 1050, color: '21,219,168', a: 0.2 });
    const bezel = h('div', { style: {
      position: 'absolute', left: '150px', top: '80px', width: '1620px', height: '920px', borderRadius: '12px',
      background: 'linear-gradient(180deg,#232323,#161616)',
      boxShadow: '0 30px 80px rgba(0,0,0,.5), 0 60px 160px rgba(0,0,0,.35), 0 0 0 1px rgba(255,255,255,.07), inset 0 1px 0 rgba(255,255,255,.10)',
    } }, W);
    const led = h('div', { style: { position: 'absolute', left: '807px', bottom: '3px', width: '5px', height: '4px', borderRadius: '2px', background: '#15dba8', boxShadow: '0 0 6px #15dba8, 0 0 14px rgba(21,219,168,.8)' } }, bezel);
    // tilt-out accent: a teal glint racing right→left along the bezel's lower edge (the top edge is above frame
    // in the pulled-back framing), chasing lower third B out of frame (7.55–7.9)
    const glint = h('div', { style: { position: 'absolute', left: '0', bottom: '-1px', width: '1620px', height: '4px', borderRadius: '2px', opacity: 0, pointerEvents: 'none',
      background: 'linear-gradient(90deg, rgba(21,219,168,0) 0%, rgba(21,219,168,.9) 42%, #eafff8 50%, rgba(21,219,168,.9) 58%, rgba(21,219,168,0) 100%)',
      backgroundSize: '34% 100%', backgroundRepeat: 'no-repeat', filter: 'drop-shadow(0 0 6px rgba(21,219,168,.95)) drop-shadow(0 0 16px rgba(21,219,168,.6))' } }, bezel);
    const plate = h('div', { style: { position: 'absolute', left: '-900px', top: '-700px', width: '3720px', height: '2480px', background: '#000' } }, W);
    const screen = h('div', { style: {
      position: 'absolute', left: '160px', top: '90px', width: '1600px', height: '900px', overflow: 'hidden', borderRadius: '3px',
      background: '#fafafa', transformOrigin: '50% 50%',
    } }, W);
    const ui = h('div', { style: {
      position: 'absolute', left: '0', top: '0', width: '1280px', height: '720px', transform: 'scale(1.25)', transformOrigin: '0 0',
      background: '#fafafa', color: '#171717', fontFamily: 'var(--font-ui)', overflow: 'hidden',
    } }, screen);
    // glass: slow diagonal sheen + edge falloff, then the power-on bloom
    const glass = h('div', { style: { position: 'absolute', inset: '0', pointerEvents: 'none',
      background: 'linear-gradient(112deg, rgba(255,255,255,0) 38%, rgba(255,255,255,.075) 47%, rgba(255,255,255,0) 56%)',
      backgroundSize: '220% 100%', boxShadow: 'inset 0 0 70px rgba(0,0,0,.10)' } }, screen);
    const bloom = h('div', { style: { position: 'absolute', inset: '0', background: 'radial-gradient(90% 90% at 50% 50%, #ffffff 0%, #e9fff7 60%, #bff5e2 100%)', pointerEvents: 'none' } }, screen);
    const pline = h('div', { style: {
      position: 'absolute', left: '160px', top: '538px', width: '1600px', height: '4px', borderRadius: '2px', background: '#fff',
      boxShadow: '0 0 14px #fff, 0 0 40px rgba(21,219,168,.95), 0 0 110px rgba(21,219,168,.6)', transformOrigin: '50% 50%',
    } }, W);

    /* ---------------- UI · header (0–56) ---------------- */
    const header = h('div', { style: {
      position: 'absolute', left: '0', top: '0', width: '1280px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 28px', borderBottom: '1px solid #eee', background: 'rgba(255,255,255,.85)',
    } }, ui);
    const hL = h('div', { style: { display: 'flex', alignItems: 'center', gap: '14px' } }, header);
    const logo = GTR.logo({ withText: false, gray: '#9CA3AF', green: '#33cc99' });
    logo.svg.setAttribute('width', '64');
    logo.svg.style.display = 'block';
    hL.appendChild(logo.svg);
    h('div', { style: { display: 'flex', alignItems: 'baseline', gap: '10px' } }, hL,
      '<span style="font-size:22px;font-weight:700;letter-spacing:-.01em">Moda Fashion</span><span style="color:#a3a3a3;font-size:16px">· Metas de Setembro de 2026</span>');
    const live = h('span', { style: { display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', fontWeight: 600, padding: '2px 9px', borderRadius: '999px', color: '#27ae8f', background: 'rgba(56,204,156,.1)', lineHeight: 1.5, whiteSpace: 'nowrap' } }, hL);
    const liveDot = h('span', { style: { width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', flex: 'none' } }, live);
    h('span', {}, live).textContent = 'ao vivo · 6 vendedoras';
    const hR = h('div', { style: { display: 'flex', alignItems: 'center', gap: '18px', color: '#737373' } }, header);
    const clock = h('span', { style: { fontSize: '22px', fontWeight: 600, color: 'rgba(0,0,0,.55)', fontVariantNumeric: 'tabular-nums' } }, hR);
    h('span', { style: { display: 'flex' } }, hR, ic('volume-2', 20, '#737373'));
    h('span', { style: { display: 'flex', alignItems: 'center', gap: '7px', fontSize: '14px', fontWeight: 600 } }, hR, ic('x', 17, '#737373') + '<span>Sair</span>');

    /* ---------------- tiered progress bar (GpTieredProgress) ---------------- */
    const tierBar = (parent, marks, height) => {
      const wrap = h('div', { style: { position: 'relative', height: `${height}px` } }, parent);
      const track = h('div', { style: { position: 'absolute', inset: '0', borderRadius: '999px', background: '#eef0ef', overflow: 'hidden', boxShadow: 'inset 0 1px 2px rgba(0,0,0,.06)' } }, wrap);
      const fill = h('div', { style: { position: 'absolute', left: '0', top: '0', bottom: '0', width: '0%', borderRadius: '999px', background: FILL_NONE, overflow: 'hidden' } }, track);
      const sheen = h('div', { style: { position: 'absolute', top: '0', bottom: '0', width: '45%', left: '-50%', background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.85), rgba(255,255,255,0))', opacity: 0 } }, fill);
      marks.forEach((m) => h('span', { style: { position: 'absolute', left: `${m * 100}%`, top: '0', bottom: '0', width: '2px', background: 'rgba(0,0,0,.18)' } }, track));
      const set = (cur, b, pr, o) => {
        st(fill, 'width', `${f2(clamp(cur / o) * 100)}%`);
        st(fill, 'background', cur >= o ? TIER.ouro.fill : cur >= pr ? TIER.prata.fill : cur >= b ? TIER.bronze.fill : FILL_NONE);
      };
      const shine = (k) => { st(sheen, 'opacity', k > 0 && k < 1 ? '1' : '0'); st(sheen, 'left', `${f2(lerp(-50, 110, k))}%`); };
      return { wrap, track, fill, set, shine };
    };
    const dot = (col, size = 8) => `<span style="display:inline-block;width:${size}px;height:${size}px;border-radius:999px;background:${col};flex:none"></span>`;

    /* ---------------- UI · team strip (56–204) ---------------- */
    const strip = h('div', { style: {
      position: 'absolute', left: '0', top: '56px', width: '1280px', height: '148px', padding: '14px 28px', borderBottom: '1px solid #eee', background: '#f7f8f8',
      display: 'grid', gridTemplateColumns: '1.2fr 1fr .9fr', gap: '28px',
    } }, ui);
    const colHead = (parent, icon, text) => h('div', { style: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#737373', textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 600 } }, parent, ic(icon, 14, '#737373') + `<span>${text}</span>`);
    // col 1 · meta do mês
    const c1 = h('div', { style: { display: 'flex', flexDirection: 'column', gap: '7px', minWidth: '0' } }, strip);
    colHead(c1, 'target', 'Meta do mês · equipe');
    const c1r = h('div', { style: { display: 'flex', alignItems: 'baseline', gap: '8px' } }, c1);
    const teamVal = h('span', { style: { fontSize: '26px', fontWeight: 700, letterSpacing: '-.01em', fontVariantNumeric: 'tabular-nums' } }, c1r);
    h('span', { style: { fontSize: '13px', color: '#a3a3a3' } }, c1r, '/ R$ 700.000 <span style="font-size:11px">(ouro)</span>');
    const teamPct = h('span', { style: { fontSize: '20px', fontWeight: 700, color: '#27ae8f', marginLeft: 'auto', fontVariantNumeric: 'tabular-nums' } }, c1r);
    const teamBar = tierBar(c1, [500 / 700, 600 / 700], 12);
    const c1l = h('div', { style: { display: 'flex', gap: '12px', fontSize: '11px', color: '#737373', alignItems: 'center' } }, c1);
    h('span', { style: { display: 'flex', alignItems: 'center', gap: '4px' } }, c1l, dot(TIER.bronze.col) + 'Bronze 500 mil');
    h('span', { style: { display: 'flex', alignItems: 'center', gap: '4px' } }, c1l, dot(TIER.prata.col) + 'Prata 600 mil');
    h('span', { style: { display: 'flex', alignItems: 'center', gap: '4px' } }, c1l, dot(TIER.ouro.col) + 'Ouro 700 mil');
    const faltam = h('span', { style: { marginLeft: 'auto', color: '#a3a3a3' } }, c1l);
    // col 2 · hoje & semana
    const c2 = h('div', { style: { display: 'flex', flexDirection: 'column', gap: '7px', minWidth: '0' } }, strip);
    colHead(c2, 'trending-up', 'Hoje &amp; Semana');
    const c2g = h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' } }, c2);
    const hsBox = (label, goal, rule) => {
      const b = h('div', { style: { borderRadius: '10px', background: '#fff', border: '1px solid #eee', padding: '8px 10px', minWidth: '0' } }, c2g);
      const top = h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' } }, b);
      h('span', { style: { fontSize: '11px', color: '#a3a3a3' } }, top).textContent = label;
      const pct = h('span', { style: { fontSize: '12px', fontWeight: 700, color: '#27ae8f', fontVariantNumeric: 'tabular-nums' } }, top);
      const val = h('div', { style: { fontWeight: 700, fontSize: '16px', lineHeight: 1.25, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' } }, b);
      h('div', { style: { fontSize: '11px', color: '#a3a3a3', whiteSpace: 'nowrap' } }, b).textContent = 'de ' + brl(goal);
      h('div', { style: { fontSize: '10px', color: '#a3a3a3', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }, b).textContent = rule;
      return { b, pct, val, goal };
    };
    const hojeT = hsBox('Hoje', 35000, 'meta da semana ÷ 5 dias úteis');
    const semT = hsBox('Semana', 175000, 'meta do mês ÷ 4');
    // col 3 · projeção (estática)
    const c3 = h('div', { style: { display: 'flex', flexDirection: 'column', gap: '7px', minWidth: '0' } }, strip);
    colHead(c3, 'chart-line', 'Projeção do mês');
    h('div', { style: { display: 'flex', alignItems: 'baseline', gap: '8px' } }, c3,
      '<span style="font-size:26px;font-weight:700;letter-spacing:-.01em">R$ 714.000</span><span style="font-size:20px;font-weight:700;color:#059669">102%</span>');
    h('div', { style: { fontSize: '12px', color: '#a3a3a3' } }, c3).textContent = 'no ritmo atual, a equipe bate a meta ouro';
    h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px', marginTop: 'auto', paddingTop: '7px', borderTop: '1px solid #eee', fontSize: '12px', color: '#737373' } }, c3,
      ic('calendar', 14, '#737373') + '<b style="color:#171717">4</b> dias úteis restantes <span style="color:#a3a3a3">(18/22)</span>');

    /* ---------------- UI · seller cards (grid 212–712) ---------------- */
    const CW = (1280 - 28 - 24) / 3, CH = 244;
    const slot = (i) => ({ x: 14 + (i % 3) * (CW + 12), y: 212 + Math.floor(i / 3) * (CH + 12) });
    const RANK_BG = {
      1: 'background:linear-gradient(135deg,#facc15,#d97706);color:#fff;box-shadow:0 0 0 2px rgba(253,224,71,.5)',
      2: 'background:linear-gradient(135deg,#cbd5e1,#64748b);color:#fff;box-shadow:0 0 0 2px rgba(226,232,240,.5)',
      3: 'background:linear-gradient(135deg,#d97706,#92400e);color:#fff;box-shadow:0 0 0 2px rgba(217,119,6,.4)',
      n: 'background:#f1f1f1;color:#5f5e5a;box-shadow:0 0 0 1px #e5e5e5',
    };
    const rankHTML = (r) => `<div style="min-width:32px;height:32px;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;${RANK_BG[r] || RANK_BG.n}">${r === 1 ? ic('crown', 16, '#fff') : r}</div>`;
    const cards = {};
    ORDER.forEach((id, i) => {
      const d = S[id];
      const pos = slot(i);
      const el = h('div', { style: {
        position: 'absolute', left: '0', top: '0', width: `${CW}px`, height: `${CH}px`, transform: `translate(${pos.x}px, ${pos.y}px)`,
        display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '16px 18px', borderRadius: '16px', border: '1px solid #eee',
        background: '#fff', overflow: 'hidden', boxShadow: '0 1px 2px rgba(0,0,0,.04), 0 2px 8px rgba(0,0,0,.04)',
      } }, ui);
      let congrats = null, congratsIn = null;
      if (id === 'ana') {
        congrats = h('div', { style: { height: '0px', marginBottom: '0px', overflow: 'hidden', flex: 'none', borderRadius: '8px' } }, el);
        congratsIn = h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', height: '26px', borderRadius: '8px', fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '.02em', fontSize: '11.5px', background: 'linear-gradient(90deg,#fbbf24,#f97316)', whiteSpace: 'nowrap' } }, congrats,
          '<span class="emoji" style="font-size:13px">🏆</span><span>PARABÉNS! Meta do mês batida!</span>');
      }
      const row = h('div', { style: { display: 'flex', alignItems: 'center', gap: '10px', flex: 'none' } }, el);
      const rank = h('div', { style: { display: 'flex', flex: 'none' } }, row);
      h('div', { style: { width: '44px', height: '44px', borderRadius: '999px', background: 'rgba(63,197,143,.15)', color: '#2fae7c', fontWeight: 600, fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' } }, row).textContent = d.ini;
      const info = h('div', { style: { flex: '1', minWidth: '0' } }, row);
      const nameRow = h('div', { style: { fontWeight: 700, fontSize: '18px', whiteSpace: 'nowrap', lineHeight: 1.2 } }, info);
      const nameEl = h('span', {}, nameRow);
      nameEl.textContent = d.name;
      const sub = h('div', { style: { fontSize: '12.5px', color: '#737373', whiteSpace: 'nowrap' } }, info);
      const val = h('b', { style: { color: '#171717', fontVariantNumeric: 'tabular-nums' } }, sub);
      h('span', {}, sub, ` / ${compact(d.ouro)} <span style="color:#a3a3a3">· nº ${d.chip}</span>`);
      const right = h('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '3px', flex: 'none' } }, row);
      const pct = h('div', { style: { fontWeight: 700, fontSize: '30px', color: '#27ae8f', lineHeight: 1, fontVariantNumeric: 'tabular-nums' } }, right);
      let medal = null;
      if (id === 'ana') {
        medal = h('span', { style: { display: 'none', alignItems: 'center', gap: '4px', fontSize: '10.5px', fontWeight: 600, padding: '2px 8px', borderRadius: '999px', background: 'rgba(245,158,11,.1)', color: '#d97706', border: '1px solid #d9770640', whiteSpace: 'nowrap', transformOrigin: '100% 50%' } }, right,
          '<span class="emoji">🏆</span> mês');
      }
      const barHold = h('div', { style: { marginTop: '14px', position: 'relative', flex: 'none' } }, el);
      const bar = tierBar(barHold, [d.bronze / d.ouro, d.prata / d.ouro], 12);
      // tier pulse rings (on the bar marks)
      const rings = ['bronze', 'prata', 'ouro'].map((k) => {
        const m = d[k] / d.ouro;
        return h('div', { style: { position: 'absolute', left: `calc(${(m * 100).toFixed(2)}% - 16px)`, top: '-10px', width: '32px', height: '32px', borderRadius: '50%', border: `3px solid ${TIER[k].col}`, opacity: 0, pointerEvents: 'none' } }, barHold);
      });
      const leg = h('div', { style: { marginTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#737373', flex: 'none' } }, el);
      const legItems = ['bronze', 'prata', 'ouro'].map((k) => {
        const it = h('span', { style: { display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 500, color: '#737373', padding: '1px 6px', margin: '0 -6px', borderRadius: '999px', transformOrigin: '50% 50%' } }, leg);
        it.innerHTML = dot(TIER[k].col, 7) + `<span>${k[0].toUpperCase() + k.slice(1)} ${compact(d[k])}</span>`;
        const ck = h('span', { style: { display: 'none', color: '#059669' } }, it, ic('check', 12, '#059669', 3));
        return { k, it, ck };
      });
      const boxes = h('div', { style: { marginTop: '14px', display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: '8px', flex: 'none' } }, el);
      // Hoje / Semana / Projeção — goal sits on the label row so nothing ever clips at 1280 px
      const mBox = (label, goal) => {
        const b = h('div', { style: { borderRadius: '10px', background: '#f7f8f8', padding: '9px 10px', minWidth: '0' } }, boxes);
        const top = h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '4px', whiteSpace: 'nowrap' } }, b);
        h('span', { style: { fontSize: '10px', color: '#737373', textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 600 } }, top).textContent = label;
        if (goal) h('span', { style: { fontSize: '9.5px', color: '#a3a3a3', fontWeight: 500 } }, top).textContent = 'meta ' + compact(goal);
        return b;
      };
      const mk = (label, goal) => {
        const b = mBox(label, goal);
        const v = h('div', { style: { fontWeight: 700, fontSize: '16px', lineHeight: 1.3, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' } }, b);
        const s2 = h('div', { style: { fontSize: '11.5px', whiteSpace: 'nowrap', transformOrigin: '0% 50%' } }, b);
        return { b, v, s2, goal };
      };
      const hoje = mk('Hoje', d.goalDay);
      const sem = mk('Semana', d.goalWeek);
      const pb = mBox('Projeção');
      const projPct = h('div', { style: { fontWeight: 700, fontSize: '16px', lineHeight: 1.3, fontVariantNumeric: 'tabular-nums' } }, pb);
      const projSub = h('div', { style: { fontSize: '11.5px', color: '#737373', whiteSpace: 'nowrap' } }, pb);
      cards[id] = { id, d, el, pos, rank, val, pct, medal, bar, barHold, rings, legItems, hoje, sem, projPct, projSub, congrats, congratsIn, info, nameEl, rankNow: -1 };
    });
    // Ana's gold sparkles (DOM → crisp at any zoom)
    const anaSpark = [];
    {
      const r = GTR.rng('modo-tv:spark');
      const holder = h('div', { style: { position: 'absolute', left: '0', top: '0', width: '0', height: '0', pointerEvents: 'none' } }, cards.ana.el.parentNode);
      for (let i = 0; i < 16; i++) {
        const sz = 3 + r() * 5;
        const e = h('div', { style: { position: 'absolute', left: '0', top: '0', width: `${sz}px`, height: `${sz}px`, borderRadius: '50%', background: i % 3 ? '#fcd34d' : '#fff', boxShadow: '0 0 8px rgba(252,211,77,.9)', opacity: 0 } }, holder);
        anaSpark.push({ e, a: -Math.PI * (0.1 + r() * 0.8) + (r() - 0.5) * 0.6, v: 60 + r() * 110, d: r() * 0.08 });
      }
    }
    // layout offsets inside Ana's card — measured after the first update(0) fills every text (see end of build)
    const BAR_END = { x: 0, y: 0 };
    // extra gold ring on Ana's Ouro mark, fired on the global gold flash [62.0]
    const anaThumpRing = h('div', { style: { position: 'absolute', left: 'calc(100% - 22px)', top: '-16px', width: '44px', height: '44px', borderRadius: '50%', border: '3px solid #fbbf24', boxShadow: '0 0 18px rgba(251,191,36,.8)', opacity: 0, pointerEvents: 'none' } }, cards.ana.barHold);

    /* ---------------- UI · toast feed (top-right: over the static PROJEÇÃO DO MÊS column) ----------------
       Newest on top, max 2, opaque, 4 px apart over a blanked column (nothing can show through).
       The oldest slides right + fades in 0.15 s instead of being pushed out of the column.
       Ana's hero sale gets its own big HUD toast in the zoomed shot (below). */
    const FEED = SALES.filter((sl) => sl.id !== 'ana');
    const FEED_GAP = 4;
    const FEED_BOX = { x: 0, y: 0, w: 339, h: 120 }; // measured from c3 after update(0)
    const toastHTML = (sl, k) => {
      const d = S[sl.id];
      return `<div style="width:${34 * k}px;height:${34 * k}px;border-radius:999px;background:linear-gradient(135deg,#15dba8,#27ae8f);display:grid;place-items:center;flex:none;box-shadow:0 ${4 * k}px ${12 * k}px rgba(21,219,168,.45)">${ic('sparkles', 18 * k, '#fff', 2.2)}</div>` +
        `<div style="line-height:1.15;min-width:0">` +
        `<div style="font-size:${10.5 * k}px;font-weight:800;letter-spacing:.12em;color:#1f8f73;text-transform:uppercase">Venda realizada</div>` +
        `<div style="display:flex;align-items:baseline;gap:${7 * k}px;margin-top:${2 * k}px;white-space:nowrap"><span style="font-size:${22 * k}px;font-weight:800;letter-spacing:-.01em;color:#0b2b29;font-variant-numeric:tabular-nums">${brl(sl.v)}</span><span style="font-size:${13 * k}px;font-weight:600;color:#2b5e53">· ${d.name}</span></div></div>`;
    };
    const toasts = FEED.map((sl, i) => {
      const el = h('div', { style: {
        position: 'absolute', left: '0', top: '0', width: '339px', height: '58px', borderRadius: '13px',
        background: 'linear-gradient(#e9fbf4,#c3f1db)', border: '1px solid rgba(21,219,168,.8)',
        boxShadow: '0 10px 24px rgba(11,43,41,.16), 0 0 22px rgba(21,219,168,.38)', display: 'flex', alignItems: 'center', gap: '12px', padding: '0 14px',
        transformOrigin: '100% 50%', opacity: 0, zIndex: 5 + i, overflow: 'hidden',
      } }, ui, toastHTML(sl, 1));
      const sheen = h('div', { style: { position: 'absolute', top: '0', bottom: '0', left: '0', width: '40%', background: 'linear-gradient(100deg, rgba(255,255,255,0), rgba(255,255,255,.75), rgba(255,255,255,0))', opacity: 0, pointerEvents: 'none' } }, el);
      return { el, sl, sheen, i };
    });
    const FEED_OUT = [2.70, 2.76]; // the last two leave (slot 1 first) as the camera starts its dive

    /* =====================================================================
       HUD — lower thirds (outside the camera)
       ===================================================================== */
    const mc = document.createElement('canvas').getContext('2d');
    mc.font = '84px "Russo One"';
    const measure = (s) => mc.measureText(s).width - 0.84 * s.length; // KIT.headline ls −0.01em
    const BAND_Y = 860, BAND_H = 130;
    const makeBand = (text, extraW) => {
      const tw = measure(text.replace(/\*/g, ''));
      const bw = Math.max(1240, Math.round(120 + tw + extraW + 190));
      const wrap = h('div', { style: { position: 'absolute', left: '0', top: `${BAND_Y}px`, width: `${bw + 60}px`, height: `${BAND_H}px`, pointerEvents: 'none' } }, root);
      h('div', { style: { position: 'absolute', left: '0', top: '0', width: `${bw}px`, height: `${BAND_H}px`, background: 'rgba(0,21,22,.82)', backdropFilter: 'blur(10px)', webkitBackdropFilter: 'blur(10px)',
        clipPath: `polygon(0 0, ${bw}px 0, ${bw - BAND_H}px ${BAND_H}px, 0 ${BAND_H}px)` } }, wrap);
      h('div', { style: { position: 'absolute', left: '0', top: '0', width: `${bw - 6}px`, height: '1px', background: 'linear-gradient(90deg, rgba(21,219,168,0), rgba(21,219,168,.55) 70%, rgba(21,219,168,.9))' } }, wrap);
      const svg = GTR.s('svg', { width: bw + 60, height: BAND_H, viewBox: `0 0 ${bw + 60} ${BAND_H}`, style: { position: 'absolute', left: '0', top: '0', overflow: 'visible' } }, wrap);
      GTR.s('polygon', { points: `${bw + 22},0 ${bw + 36},0 ${bw + 36 - BAND_H},${BAND_H} ${bw + 22 - BAND_H},${BAND_H}`, fill: 'rgba(21,219,168,.35)' }, svg);
      const edge = GTR.s('line', { x1: bw, y1: 0, x2: bw - BAND_H, y2: BAND_H, stroke: '#15dba8', 'stroke-width': 4, 'stroke-linecap': 'square' }, svg);
      edge.style.filter = 'drop-shadow(0 0 8px rgba(21,219,168,.9))';
      const inner = h('div', { style: { position: 'absolute', left: '0', top: '0', width: `${bw}px`, height: `${BAND_H}px` } }, wrap);
      const hl = KIT.headline(inner, text, { size: 84, x: 120, y: BAND_H / 2 + 3, w: Math.ceil(tw + 40), align: 'left', glow: true, split: 'words' });
      hl.el.style.whiteSpace = 'nowrap';
      return { wrap, inner, hl, bw, tw };
    };
    // A · "Cada venda toca." + live equalizer
    const bandA = makeBand('Cada venda *toca*.', 150);
    const eq = h('div', { style: { position: 'absolute', left: `${Math.round(120 + bandA.tw + 44)}px`, top: '0', height: `${BAND_H}px`, display: 'flex', alignItems: 'center', gap: '12px' } }, bandA.inner);
    h('span', { style: { display: 'flex', color: '#15dba8', filter: 'drop-shadow(0 0 10px rgba(21,219,168,.6))' } }, eq, ic('volume-2', 40, '#15dba8', 2.2));
    const eqHold = h('div', { style: { display: 'flex', alignItems: 'center', gap: '6px', height: '56px' } }, eq);
    const eqBars = Array.from({ length: 6 }, () => h('span', { style: { width: '7px', height: '56px', borderRadius: '4px', background: 'linear-gradient(180deg,#4dd9ac,#15dba8)', boxShadow: '0 0 10px rgba(21,219,168,.55)', transformOrigin: '50% 50%' } }, eqHold));
    // B · "Bronze, Prata, Ouro." + medals
    const bandB = makeBand('Bronze, Prata, *Ouro*.', 3 * 48 + 2 * 14 + 10);
    {
      const u = bandB.hl.units; // ['Bronze,', 'Prata,', 'Ouro', '.']
      u[0].style.color = '#e39a62';
      u[1].style.color = '#cfd6df';
      for (const x of u) if (x.parentNode.classList.contains('kit-em')) { x.style.color = '#f3b315'; }
      const em = bandB.hl.el.querySelector('.kit-em');
      if (em) { em.style.color = '#f3b315'; em.style.textShadow = '0 0 30px rgba(243,179,21,.6), 0 0 80px rgba(243,179,21,.3)'; }
    }
    const MEDAL = [
      ['linear-gradient(135deg,#f0b27f,#bd6b2f 55%,#86461a)', 'rgba(189,107,47,.7)'],
      ['linear-gradient(135deg,#f8fafc,#a3adba 55%,#6b7686)', 'rgba(203,213,225,.6)'],
      ['linear-gradient(135deg,#ffe58a,#f3b315 55%,#b7800b)', 'rgba(243,179,21,.85)'],
    ];
    const medX0 = Math.round(120 + bandB.tw + 40);
    const medals = MEDAL.map(([bg, gl], i) => {
      const m = h('div', { style: { position: 'absolute', left: `${medX0 + i * 62}px`, top: `${BAND_H / 2 - 24}px`, width: '48px', height: '48px', borderRadius: '50%', background: bg,
        display: 'grid', placeItems: 'center', boxShadow: `0 6px 16px rgba(0,0,0,.4), 0 0 22px ${gl}, inset 0 2px 0 rgba(255,255,255,.45)`, transform: 'scale(0)' } }, bandB.inner, ic('award', 24, '#fff', 2.2));
      m.firstChild.style.filter = 'drop-shadow(0 1px 1px rgba(0,0,0,.35))';
      return m;
    });
    const medalRing = h('div', { style: { position: 'absolute', left: `${medX0 + 2 * 62 + 24 - 40}px`, top: `${BAND_H / 2 - 40}px`, width: '80px', height: '80px', borderRadius: '50%', border: '3px solid #f3b315', opacity: 0 } }, bandB.inner);
    const medalSheen = h('div', { style: { position: 'absolute', inset: '0', borderRadius: '50%', background: 'linear-gradient(115deg, rgba(255,255,255,0) 35%, rgba(255,255,255,.85) 50%, rgba(255,255,255,0) 65%)', backgroundSize: '300% 100%', mixBlendMode: 'screen' } }, medals[2]);

    // band slide in/out (tl owns the wrap/inner transforms). B enters at 6.15, over the clean UI (overlay gone).
    const T_B = 6.15;
    tl.fromTo(bandA.wrap, { x: -(bandA.bw + 90) }, { x: 0, duration: 0.35, ease: 'power3.out' }, 1.0);
    tl.fromTo(bandA.inner, { x: -140, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45, ease: 'power3.out' }, 1.04);
    tl.to(bandA.wrap, { x: -(bandA.bw + 90), duration: 0.32, ease: 'power2.in' }, 2.75);
    tl.fromTo(bandB.wrap, { x: -(bandB.bw + 90) }, { x: 0, duration: 0.35, ease: 'power3.out' }, T_B);
    tl.fromTo(bandB.inner, { x: -140, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45, ease: 'power3.out' }, T_B + 0.04);
    tl.to(bandB.wrap, { x: -(bandB.bw + 90), duration: 0.33, ease: 'power2.in' }, 7.6);

    /* =====================================================================
       HUD — Ana's hero toast (zoomed shot, bottom-right, ~1.3× the TV toast)
       ===================================================================== */
    const HT = { w: 560, h: 96, x: 1800 - 560, y: 980 - 96 };
    // frosted halo behind it: defocuses + whitens the busy UI fragments around the toast (white UI → reads as glow)
    const heroFrost = h('div', { style: {
      position: 'absolute', left: `${HT.x - 130}px`, top: `${HT.y - 80}px`, width: `${HT.w + 460}px`, height: `${HT.h + 170}px`, pointerEvents: 'none', display: 'none', zIndex: 2,
      background: 'radial-gradient(closest-side, rgba(250,251,251,.94) 62%, rgba(250,251,251,.6) 82%, rgba(250,251,251,0) 100%)',
      backdropFilter: 'blur(7px)', webkitBackdropFilter: 'blur(7px)',
      webkitMaskImage: 'radial-gradient(closest-side, #000 70%, transparent 100%)', maskImage: 'radial-gradient(closest-side, #000 70%, transparent 100%)',
    } }, root);
    const heroToast = h('div', { style: {
      position: 'absolute', left: `${HT.x}px`, top: `${HT.y}px`, width: `${HT.w}px`, height: `${HT.h}px`, borderRadius: '20px',
      background: 'linear-gradient(#e9fbf4,#c3f1db)', border: '1.5px solid rgba(21,219,168,.9)',
      boxShadow: '0 28px 70px rgba(0,21,22,.42), 0 10px 24px rgba(0,21,22,.22), 0 0 0 1px rgba(255,255,255,.4) inset, 0 0 46px rgba(21,219,168,.55)',
      display: 'none', alignItems: 'center', gap: '18px', padding: '0 24px', transformOrigin: '100% 50%', opacity: 0, zIndex: 2,
    } }, root, toastHTML(SALES[4], 1.6));
    const heroIcon = heroToast.firstChild;
    const heroClip = h('div', { style: { position: 'absolute', inset: '0', borderRadius: '20px', overflow: 'hidden', pointerEvents: 'none' } }, heroToast);
    const heroSheen = h('div', { style: { position: 'absolute', top: '0', bottom: '0', left: '0', width: '38%', background: 'linear-gradient(100deg, rgba(255,255,255,0), rgba(255,255,255,.8), rgba(255,255,255,0))' } }, heroClip);
    const heroPing = h('div', { style: { position: 'absolute', left: '24px', top: `${HT.h / 2 - 27}px`, width: '54px', height: '54px', borderRadius: '50%', border: '3px solid #15dba8', boxShadow: '0 0 12px rgba(21,219,168,.7)', opacity: 0, pointerEvents: 'none' } }, heroToast);

    /* =====================================================================
       HUD — PARABÉNS overlay (4.0–6.35) + confetti
       Dark petróleo scrim (blur 16) lighter/warmer behind the trophy + a vignette that
       follows the TV's left edge so the space/UI seam dissolves into one dark field.
       ===================================================================== */
    const party = h('div', { style: { position: 'absolute', inset: '0', display: 'none', pointerEvents: 'none', zIndex: 2 } }, root);
    const scrim = h('div', { style: { position: 'absolute', inset: '0',
      background: 'radial-gradient(circle 620px at 960px 350px, rgba(52,36,4,.64) 0%, rgba(10,26,20,.79) 48%, rgba(0,21,22,.86) 100%)',
      backdropFilter: 'blur(16px)', webkitBackdropFilter: 'blur(16px)', opacity: 0 } }, party);
    const vig = h('div', { style: { position: 'absolute', inset: '0', opacity: 0 } }, party);
    const vigR = 'radial-gradient(ellipse 1250px 720px at 960px 430px, rgba(0,8,9,0) 58%, rgba(0,8,9,.55) 100%)';
    const pc = h('div', { style: { position: 'absolute', inset: '0', transformOrigin: '50% 48%' } }, party);
    bandA.wrap.style.zIndex = '3';
    bandB.wrap.style.zIndex = '3';
    const goldGlow = GTR.glow(pc, { x: 960, y: 400, r: 760, color: '243,179,21', a: 0.26 });
    const rays = h('div', { style: {
      position: 'absolute', left: `${960 - 700}px`, top: `${330 - 700}px`, width: '1400px', height: '1400px', borderRadius: '50%',
      background: 'repeating-conic-gradient(from 0deg, rgba(253,230,138,.16) 0deg 5deg, rgba(253,230,138,0) 5deg 15deg)',
      webkitMaskImage: 'radial-gradient(closest-side, #000 8%, rgba(0,0,0,.5) 40%, transparent 72%)', maskImage: 'radial-gradient(closest-side, #000 8%, rgba(0,0,0,.5) 40%, transparent 72%)',
    } }, pc);
    const trophyRing = h('div', { style: { position: 'absolute', left: `${960 - 150}px`, top: `${330 - 150}px`, width: '300px', height: '300px', borderRadius: '50%', border: '4px solid #fde68a', opacity: 0 } }, pc);
    const trophy = h('div', { style: {
      position: 'absolute', left: `${960 - 80}px`, top: `${330 - 80}px`, width: '160px', height: '160px', borderRadius: '50%',
      background: 'radial-gradient(circle at 40% 35%, #fde68a, #f59e0b)', display: 'grid', placeItems: 'center',
      boxShadow: '0 0 0 6px rgba(253,230,138,.18), 0 0 70px rgba(245,158,11,.65), 0 20px 50px rgba(0,0,0,.35), inset 0 3px 0 rgba(255,255,255,.5)', transform: 'scale(0)',
    } }, pc, ic('trophy', 76, '#fff', 1.7));
    trophy.firstChild.style.filter = 'drop-shadow(0 2px 3px rgba(146,64,14,.45))';
    const pTitle = KIT.headline(pc, 'PARABÉNS!', { size: 170, y: 548, w: 1600, split: 'chars', ls: '0.01em' });
    pTitle.el.style.textShadow = '0 6px 30px rgba(0,0,0,.35), 0 0 60px rgba(243,179,21,.5)';
    const pLine = KIT.headline(pc, 'Ana Silva bateu a meta do *MÊS!*', { size: 44, y: 690, w: 1600, font: 'ui', weight: 800, ls: '-0.01em', lh: 1.2 });
    pLine.el.style.textShadow = '0 2px 14px rgba(0,0,0,.45)';
    for (const u of pLine.units) {
      if (u.parentNode.classList.contains('kit-em')) {
        Object.assign(u.style, { background: 'linear-gradient(90deg,#fcd34d,#fde68a 50%,#fb923c)', webkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', paddingRight: '2px' });
        u.parentNode.style.textShadow = 'none';
        u.parentNode.style.filter = 'drop-shadow(0 0 18px rgba(251,191,36,.55))';
        u.parentNode.style.marginLeft = '0.26em';
      }
    }
    const pill = h('div', { style: {
      position: 'absolute', left: '960px', top: '782px', display: 'inline-flex', alignItems: 'center', gap: '12px', padding: '13px 30px', borderRadius: '999px',
      background: 'rgba(0,0,0,.45)', color: '#fff', fontSize: '24px', fontWeight: 600, border: '1px solid rgba(255,255,255,.22)', whiteSpace: 'nowrap',
      boxShadow: '0 10px 30px rgba(0,0,0,.3)',
    } }, pc, '<span class="emoji">🎉</span><span>Seguindo em frente!</span><span class="emoji">🎉</span>');
    KIT.revealChars(tl, pTitle.units, 4.1, { stagger: 0.03, y: 90, dur: 0.55 });
    KIT.revealWords(tl, pLine.units, 4.35, { y: 40, dur: 0.5, stagger: 0.045, blur: 10 });
    tl.fromTo(pill, { xPercent: -50, yPercent: -50, scale: 0.6, opacity: 0 }, { xPercent: -50, yPercent: -50, scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.8)' }, 4.7);

    const conf = GTR.canvas(root, { style: { pointerEvents: 'none', zIndex: 4 } });
    const CONF = { colors: ['#38cc9c', '#2ba37b', '#4dd9ac', '#ffffff', '#f3b315'], life: 3.5 };

    /* =====================================================================
       SFX (STORYBOARD S11) — no impact at 4.0: the parabéns section plays it
       ===================================================================== */
    ctx.cue('blip', 0.0, { freq: 600 });
    ctx.cue('swoosh', 0.0);
    ctx.cue('cash', 0.5);
    ctx.cue('cash', 1.0, { db: -4 });
    ctx.cue('cash', 1.5, { db: -4 });
    ctx.cue('blip', 1.5, { freq: 1200 });
    ctx.cue('cash', 2.0, { db: -6 });
    ctx.cue('whoosh', 2.75, { dur: 0.7, up: true });
    ctx.cue('cash', 3.0);
    ctx.cue('blip', 3.25, { freq: 900 });
    ctx.cue('blip', 3.5, { freq: 1200 });
    ctx.cue('blip', 3.875, { freq: 1600 });
    ctx.cue('shimmer', 4.1);
    ctx.cue('pop', 4.5);
    ctx.cue('pop', 4.7, { db: -6 });
    ctx.cue('swoosh', 6.0);
    // medals pop 6.25 / 6.5 / 6.75 (band B enters at 6.15, after the overlay content has gone)
    ctx.cue('blip', 6.25, { freq: 900 });
    ctx.cue('blip', 6.5, { freq: 1200 });
    ctx.cue('blip', 6.75, { freq: 1600 });
    ctx.cue('shimmer', 6.75);
    ctx.cue('whoosh', 7.65, { dur: 0.35 });

    /* =====================================================================
       CAMERA
       ===================================================================== */
    const camAt = (t) => {
      // settle after power-on: s .92 → 1 (0–2.75) with a slight 3D lean that straightens
      const kA = p(t, 0, 2.75, 'power2.out');
      let s = lerp(0.92, 1.0, kA), x = 0, y = 0;
      let rx = lerp(5, 0.8, kA), ry = lerp(-4, -1.2, kA);
      // dive onto Ana's card (433,507) → screen (960,500) at s 1.9, then a slow push while it stays centred
      const kB = p(t, 2.75, 3.5, 'power3.inOut');
      if (kB > 0) {
        const sB = lerp(1.9, 1.96, p(t, 3.5, 6.0, 'sine.inOut'));
        const xB = 527 * sB, yB = 33 * sB - 40;
        s = lerp(s, sB, kB); x = lerp(x, xB, kB); y = lerp(y, yB, kB); rx = lerp(rx, 0, kB); ry = lerp(ry, 0, kB);
      }
      // pull back to the whole TV (bottom edge kept above the disclaimer band, y ≤ 1015)
      const kC = p(t, 6.0, 6.7, 'power3.inOut');
      if (kC > 0) {
        const sC = lerp(1.08, 1.1, p(t, 6.4, 7.8, 'sine.inOut'));
        const xC = lerp(0, -14, p(t, 6.4, 7.8, 'sine.inOut'));
        const yC = 473 - 460 * sC;
        const ryC = lerp(0, -1.6, p(t, 6.4, 7.8, 'sine.inOut'));
        s = lerp(s, sC, kC); x = lerp(x, xC, kC); y = lerp(y, yC, kC); ry = lerp(ry, ryC, kC);
      }
      // tilt out — carries through the cut: starts 7.5 so it is ~93% done on the last frame (7.983)
      // and still accelerating there (power2.in) → S12 cuts in on motion, not on an empty stage
      const kD = p(t, 7.5, 8.0, 'power2.in');
      rx += -12 * kD; y += -200 * kD;
      return { x, y, s, rx, ry, kD };
    };
    // camera push reads as a deliberate move: gaussian "motion" blur scaled by the easing slope
    const slope = (ease, t, a, b) => {
      const u = inv(t, a, b), hh = 0.004;
      if (u <= 0 || u >= 1) return 0;
      const f = E(ease);
      return (f(Math.min(1, u + hh)) - f(Math.max(0, u - hh))) / (2 * hh) / 3; // 1 at the power3.inOut peak
    };
    const motionBlur = (t) => Math.max(3.2 * slope('power3.inOut', t, 2.75, 3.5), 2.2 * slope('power3.inOut', t, 6.0, 6.7));

    /* =====================================================================
       UPDATE — everything time-driven
       ===================================================================== */
    const RING_TEAL = (k) => `0 0 0 ${f2(3 * k)}px rgba(21,219,168,${f2(k)}), 0 0 ${f2(30 * k)}px rgba(21,219,168,${f2(0.55 * k)})`;
    const BASE_SHADOW = '0 1px 2px rgba(0,0,0,.04), 0 2px 8px rgba(0,0,0,.04)';

    // one hit on the gold flash [62.0]: Ana's card thumps 1 → 1.06 → 1 (3.97–4.22), gold border + Ouro ring re-fire
    const T_THUMP = 3.97;
    const thumpK = (t) => { const a = t - T_THUMP; if (a < 0 || a > 0.25) return 0; return a < 0.06 ? E('power2.out')(a / 0.06) : 1 - E('power2.inOut')(inv(a, 0.06, 0.25)); };

    const update = (local) => {
      const t = Math.max(0, local);

      /* ---- camera ---- */
      const c = camAt(t);
      cam.set({ x: c.x, y: c.y, s: c.s, rx: c.rx, ry: c.ry });
      const mb = Math.max(10 * c.kD, motionBlur(t));
      st(cam.view, 'filter', mb > 0.12 ? `blur(${f2(mb)}px)` : 'none');
      // soft-tailed fade that never reaches 0: the tilting TV is still ~.22 on the last frame (no dark dropout)
      st(cam.view, 'opacity', f2(1 - 0.78 * p(t, 7.55, 8.0, 'sine.inOut')));

      /* ---- power-on ---- */
      const lineX = p(t, 0, 0.12, 'power2.out');
      const open = p(t, 0.12, 0.3, 'power3.out');
      st(pline, 'display', t < 0.3 ? 'block' : 'none');
      st(pline, 'transform', `scale(${f2(lineX)}, ${f2(1 + 2.5 * open)})`);
      st(pline, 'opacity', f2(1 - p(t, 0.12, 0.24, 'power1.out')));
      st(screen, 'visibility', t >= 0.12 ? 'visible' : 'hidden');
      st(screen, 'transform', `scaleY(${lerp(0.004, 1, open).toFixed(4)})`);
      const bl = t < 0.12 ? 1 : 1 - p(t, 0.16, 0.62, 'power2.out');
      st(bloom, 'opacity', f2(bl));
      st(bloom, 'display', bl > 0.002 ? 'block' : 'none');
      st(plate, 'opacity', f2(1 - p(t, 0.2, 0.6, 'power1.inOut')));
      st(plate, 'display', t < 0.6 ? 'block' : 'none');
      st(led, 'opacity', t >= 0.05 ? '1' : '0');
      // room light: flare at power-on + a lift on every cha-ching
      let hit = 0;
      for (const sl of SALES) if (t >= sl.t) hit += Math.exp(-(t - sl.t) * 4.5);
      const flare = Math.exp(-Math.pow((t - 0.32) / 0.22, 2));
      st(tvGlow, 'opacity', f2(clamp(0.8 + 0.9 * flare + 0.35 * hit, 0, 2)));
      st(tvGlow, 'transform', `scale(${f2(1 + 0.12 * flare + 0.03 * hit)})`);
      st(glass, 'backgroundPosition', `${f2(88 - t * 5 - c.ry * 6)}% 0`);
      const gk = inv(t, 7.55, 7.9);
      st(glint, 'opacity', gk > 0 && gk < 1 ? f2(Math.sin(Math.PI * gk)) : '0');
      st(glint, 'backgroundPosition', `${f2(lerp(130, -30, E('power2.inOut')(gk)))}% 0`);

      /* ---- header ---- */
      tx(clock, `15:42:${String(7 + Math.floor(t)).padStart(2, '0')}`);
      const ph = GTR.fract(t * 2);
      st(liveDot, 'boxShadow', `0 0 0 ${f2(1 + ph * 4)}px rgba(34,197,94,${f2(0.45 * (1 - ph))})`);

      /* ---- team strip ---- */
      const add = addAll(t);
      const team = 620000 + add;
      tx(teamVal, brl(team));
      tx(teamPct, Math.round((team / 700000) * 100) + '%');
      teamBar.set(team, 500000, 600000, 700000);
      hx(faltam, `faltam <b style="color:#171717">${Math.round((700000 - team) / 1000)} mil</b>`);
      for (const [box, base] of [[hojeT, 34900], [semT, 186200]]) {
        const v = base + add;
        const pc2 = Math.floor((v / box.goal) * 100);
        tx(box.val, brl(v));
        tx(box.pct, pc2 + '%');
        st(box.pct, 'color', pc2 >= 100 ? '#059669' : '#27ae8f');
      }

      /* ---- seller cards ---- */
      // live ranking: Paula (72,7%) passes Carla (71,8%) after her sale → cards trade places
      const kSwap = p(t, 1.1, 1.45, 'power3.inOut');
      const T_FLIP = 1.28; // badge flips edge-on at the swap midpoint and comes back with the new rank
      const ranks = { ana: 1, marina: 2, julia: 3, carla: t >= T_FLIP ? 5 : 4, paula: t >= T_FLIP ? 4 : 5, bia: 6 };
      const flipDeg = t < T_FLIP ? 90 * p(t, 1.16, T_FLIP, 'power2.in') : 90 * (1 - p(t, T_FLIP, 1.42, 'back.out(2)'));
      for (const id of ORDER) {
        const cd = cards[id], d = cd.d;
        const a = addFor(id, t);
        const month = d.month + a, day = d.day + a, week = d.week + a;
        // position (swap) + lift
        let px = cd.pos.x, py = cd.pos.y, sc = 1, z = 1;
        if (id === 'paula' || id === 'carla') {
          const to = slot(id === 'paula' ? 3 : 4);
          px = lerp(cd.pos.x, to.x, kSwap);
          const b = Math.sin(Math.PI * kSwap);
          sc = id === 'paula' ? 1 + 0.035 * b : 1 - 0.025 * b;
          py += id === 'paula' ? -10 * b : 6 * b;
          z = id === 'paula' ? 3 : 2;
        }
        // sale ring (1.0 s), Ana's gold ring after Ouro
        let ring = 0, tint = 0;
        for (const sl of SALES) if (sl.id === id) { const k = GTR.win(t, sl.t, sl.t + 1.0, 0.08, 0.4); ring = Math.max(ring, k); tint = Math.max(tint, k); }
        let shadow;
        if (id === 'ana' && t >= T_OURO) {
          const g = p(t, T_OURO, T_OURO + 0.25, 'power2.out');
          const fl = Math.max(Math.exp(-(t - T_OURO) * 3.2), t >= T_THUMP ? Math.exp(-(t - T_THUMP) * 4) : 0); // re-fires on the gold flash
          shadow = `0 0 0 ${f2(2 + 2.5 * fl)}px rgba(251,191,36,${f2(Math.min(1, 0.7 * g + 0.3 * fl))}), 0 0 ${f2(24 + 40 * fl)}px rgba(251,191,36,${f2(0.35 + 0.45 * fl)}), ${BASE_SHADOW}`;
          tint = 0;
        } else {
          shadow = ring > 0.001 ? `${RING_TEAL(ring)}, ${BASE_SHADOW}` : BASE_SHADOW;
        }
        if (kSwap > 0 && kSwap < 1 && id === 'paula') shadow += ', 0 24px 40px rgba(0,0,0,.14)';
        if (id === 'ana') sc = 1 + 0.06 * thumpK(t);
        st(cd.el, 'transform', `translate(${f2(px)}px, ${f2(py)}px) scale(${sc.toFixed(4)})`);
        st(cd.el, 'zIndex', String(z));
        st(cd.el, 'boxShadow', shadow);
        st(cd.el, 'background', tint > 0.001 ? `linear-gradient(rgba(21,219,168,${f2(0.07 * tint)}),rgba(21,219,168,${f2(0.07 * tint)})), #fff` : (id === 'ana' && t >= T_OURO ? `linear-gradient(rgba(251,191,36,${f2(0.06 * p(t, T_OURO, 4.3))}),rgba(251,191,36,0) 60%), #fff` : '#fff'));
        // rank badge (+ rotateX flip on the swap)
        if (cd.rankNow !== ranks[id]) { cd.rankNow = ranks[id]; cd.rank.innerHTML = rankHTML(ranks[id]); }
        if (id === 'paula' || id === 'carla') st(cd.rank, 'transform', `perspective(140px) rotateX(${f2(flipDeg)}deg)`);
        // numbers
        tx(cd.val, brl(month));
        const pctM = (month / d.ouro) * 100;
        tx(cd.pct, Math.round(pctM) + '%');
        st(cd.pct, 'color', pctM >= 100 ? '#059669' : '#27ae8f');
        cd.bar.set(month, d.bronze, d.prata, d.ouro);
        for (const [bx, v] of [[cd.hoje, day], [cd.sem, week]]) {
          tx(bx.v, brl(v));
          const ok = v >= bx.goal;
          hx(bx.s2, ok
            ? `<span style="display:inline-flex;align-items:center;gap:3px;color:#059669;font-weight:700">${ic('check', 12, '#059669', 3)}bateu!</span>`
            : `<span style="color:#a3a3a3">falta <b style="color:#171717">${compact(bx.goal - v)}</b></span>`);
        }
        const tr = Math.round(pctM * PACE);
        tx(cd.projPct, tr + '%');
        st(cd.projPct, 'color', tr >= 100 ? '#059669' : tr >= 85 ? '#ca8a04' : '#dc2626');
        tx(cd.projSub, compact(month * PACE));
        // legend checks — reached tiers; Bia pops her Bronze live; Ana gets a roll call 3.25 / 3.5 / 3.875
        for (const li of cd.legItems) {
          const reached = month >= d[li.k] - 0.5;
          let popAt = null;
          if (id === 'bia' && li.k === 'bronze') popAt = crossT;
          if (id === 'ana') popAt = { bronze: 3.25, prata: 3.5, ouro: T_OURO }[li.k];
          const shown = popAt != null ? t >= popAt : reached;
          st(li.ck, 'display', shown ? 'inline-flex' : 'none');
          st(li.it, 'fontWeight', shown ? '700' : '500');
          st(li.it, 'color', shown ? '#171717' : '#737373');
          if (popAt != null && t >= popAt) {
            const ag = t - popAt;
            const cs = E('back.out(3)')(inv(ag, 0, 0.3));
            st(li.ck, 'transform', `scale(${f2(cs)})`);
            st(li.it, 'transform', `scale(${(1 + 0.22 * bump(ag, 0.4)).toFixed(4)})`);
            const hl = 1 - p(ag, 0.5, 1.4, 'power1.in');
            const tc = TIER[li.k];
            st(li.it, 'background', `rgba(${tc.rgb},${f2(0.2 * hl)})`);
            st(li.it, 'boxShadow', `0 0 0 1px rgba(${tc.rgb},${f2(0.55 * hl)})`);
            const rg = cd.rings[['bronze', 'prata', 'ouro'].indexOf(li.k)];
            const rp = inv(ag, 0, 0.6);
            st(rg, 'opacity', rp > 0 && rp < 1 ? f2(0.9 * (1 - rp)) : '0');
            st(rg, 'transform', `scale(${f2(0.4 + 1.1 * E('power2.out')(rp))})`);
          } else {
            st(li.ck, 'transform', 'scale(1)');
            st(li.it, 'transform', 'scale(1)');
            st(li.it, 'background', 'transparent');
            st(li.it, 'boxShadow', 'none');
          }
        }
        // sheen across the fill when a new tier colour lands
        if (id === 'bia') cd.bar.shine(p(t, crossT, crossT + 0.55, 'power2.inOut'));
        if (id === 'ana') cd.bar.shine(p(t, T_OURO, T_OURO + 0.6, 'power2.inOut'));
      }
      // Ana extras: gold bar glow, medal pill, congrats strip, flash ring, sparkles
      {
        const cd = cards.ana;
        const g = t >= T_OURO ? 1 : 0;
        const fl = t >= T_OURO ? Math.exp(-(t - T_OURO) * 3) : 0;
        st(cd.bar.track, 'boxShadow', g ? `inset 0 1px 2px rgba(0,0,0,.06), 0 0 ${f2(10 + 20 * fl)}px rgba(243,179,21,${f2(0.45 + 0.4 * fl)})` : 'inset 0 1px 2px rgba(0,0,0,.06)');
        st(cd.medal, 'display', t >= T_OURO + 0.05 ? 'inline-flex' : 'none');
        st(cd.medal, 'transform', `scale(${f2(E('back.out(2.4)')(inv(t, T_OURO + 0.05, T_OURO + 0.4)))})`);
        const kc = p(t, 6.1, 6.55, 'power3.out');
        st(cd.congrats, 'height', `${f2(26 * kc)}px`);
        st(cd.congrats, 'marginBottom', `${f2(10 * kc)}px`);
        st(cd.congratsIn, 'transform', `translateY(${f2(-26 * (1 - kc))}px)`);
        // Ouro ring re-fires on the flash (bigger, softer)
        const tr2 = inv(t, T_THUMP, T_THUMP + 0.55);
        st(anaThumpRing, 'opacity', tr2 > 0 && tr2 < 1 ? f2(0.95 * (1 - tr2)) : '0');
        st(anaThumpRing, 'transform', `scale(${f2(0.5 + 1.9 * E('power2.out')(tr2))})`);
        // gold sparkles burst from the bar end at the Ouro crossing
        const bx0 = cd.pos.x + BAR_END.x, by0 = cd.pos.y + BAR_END.y;
        for (const sp of anaSpark) {
          const ag = t - T_OURO - sp.d;
          const vis = ag > 0 && ag < 0.9;
          st(sp.e, 'opacity', vis ? f2(1 - inv(ag, 0.35, 0.9)) : '0');
          if (vis) {
            const dd = sp.v * (1 - Math.exp(-ag * 5)) / 1.0;
            st(sp.e, 'transform', `translate(${f2(bx0 + Math.cos(sp.a) * dd)}px, ${f2(by0 + Math.sin(sp.a) * dd + 60 * ag * ag)}px)`);
          }
        }
      }

      /* ---- toast feed: top-right over the (blanked) PROJEÇÃO column; newest on top, max 2 ----
         A new toast pops into slot 0 and pushes the previous one down to slot 1; the toast that
         would fall to slot 2 slides right + fades in 0.15 s (it never leaves the column). */
      st(c3, 'opacity', f2(t < 1.5 ? 1 - p(t, 0.4, 0.52, 'power1.inOut') : p(t, 2.95, 3.25, 'power1.inOut')));
      const slotH = FEED_BOX.h / 2 + FEED_GAP / 2;
      toasts.forEach((to) => {
        const i = to.i, age = t - to.sl.t;
        const exitAt = i + 2 < FEED.length ? FEED[i + 2].t - 0.06 : FEED_OUT[FEED.length - 1 - i === 0 ? 1 : 0];
        const ex = p(t, exitAt, exitAt + 0.15, 'power2.in');
        const vis = age >= 0 && ex < 1;
        st(to.el, 'display', vis ? 'flex' : 'none');
        if (!vis) return;
        const push = i + 1 < FEED.length ? p(t, FEED[i + 1].t, FEED[i + 1].t + 0.3, 'power3.out') : 0;
        const sc = age < 0.3 ? lerp(0.7, 1.04, E('power2.out')(age / 0.3)) : lerp(1.04, 1, E('power2.inOut')(inv(age, 0.3, 0.5)));
        const slideIn = 26 * (1 - E('power3.out')(inv(age, 0, 0.35)));
        st(to.el, 'transform', `translate(${f2(FEED_BOX.x + slideIn + 90 * ex)}px, ${f2(FEED_BOX.y + push * slotH)}px) scale(${sc.toFixed(4)})`);
        st(to.el, 'opacity', f2(Math.min(1, age / 0.08) * (1 - ex)));
        const sh = inv(age, 0.18, 0.62);
        st(to.sheen, 'opacity', sh > 0 && sh < 1 ? '1' : '0');
        st(to.sheen, 'transform', `translateX(${f2(lerp(-150, 900, E('power2.inOut')(sh)))}px)`);
      });

      /* ---- Ana's hero toast (HUD, zoomed shot): slides in 3.0–3.5, leaves under the gold flash ---- */
      {
        const a = t - 3.0;
        const ex = p(t, 3.93, 4.06, 'power2.in');
        const vis = a >= 0 && ex < 1;
        st(heroToast, 'display', vis ? 'flex' : 'none');
        st(heroFrost, 'display', vis ? 'block' : 'none');
        if (vis) {
          st(heroFrost, 'opacity', f2(p(a, 0.04, 0.4, 'power2.out') * (1 - ex)));
          st(heroFrost, 'transform', `translateX(${f2(120 * (1 - E('power3.out')(inv(a, 0, 0.5))) + 80 * ex)}px)`);
          const kin = E('power3.out')(inv(a, 0, 0.5));
          const sc = a < 0.28 ? lerp(0.86, 1.03, E('power2.out')(a / 0.28)) : lerp(1.03, 1, E('power2.inOut')(inv(a, 0.28, 0.5)));
          const fy = Math.sin(a * 2.6) * 3 * p(a, 0.4, 0.8, 'sine.inOut');
          st(heroToast, 'transform', `translate(${f2(180 * (1 - kin) + 120 * ex)}px, ${f2(fy)}px) scale(${sc.toFixed(4)})`);
          st(heroToast, 'opacity', f2(Math.min(1, a / 0.1) * (1 - ex)));
          const sh = inv(a, 0.3, 0.85);
          st(heroSheen, 'opacity', sh > 0 && sh < 1 ? '1' : '0');
          st(heroSheen, 'transform', `translateX(${f2(lerp(-260, 820, E('power2.inOut')(sh)))}px)`);
          const pr = inv(a, 0.12, 0.62);
          st(heroPing, 'opacity', pr > 0 && pr < 1 ? f2(0.85 * (1 - pr)) : '0');
          st(heroPing, 'transform', `scale(${f2(1 + 0.6 * E('power2.out')(pr))})`);
          st(heroIcon, 'transform', `scale(${f2(1 + 0.14 * bump(a - 0.05, 0.3))})`);
        }
      }

      /* ---- lower third A equalizer (reacts to each cha-ching) ---- */
      if (t > 0.95 && t < 3.2) {
        eqBars.forEach((b, k) => {
          let env = 0;
          for (const sl of SALES) if (t >= sl.t) env += Math.exp(-(t - sl.t) * 5.5);
          const wob = 0.5 + 0.5 * Math.sin(t * 19 + k * 1.9) * Math.cos(t * 7 + k);
          const hgt = clamp(0.18 + 0.2 * (0.5 + 0.5 * Math.sin(t * 6 + k * 2.3)) + 0.75 * clamp(env) * wob, 0.12, 1);
          st(b, 'transform', `scaleY(${f2(hgt)})`);
        });
      }
      /* ---- lower third B medals 6.25 / 6.50 / 6.75 ---- */
      medals.forEach((m, i) => {
        const a2 = t - (6.25 + i * 0.25);
        const k = a2 <= 0 ? 0 : E('back.out(2.2)')(inv(a2, 0, 0.4));
        const fl = a2 > 0 ? Math.exp(-a2 * 4) : 0;
        st(m, 'transform', `scale(${f2(k * (1 + 0.1 * fl))}) rotate(${f2(-40 * (1 - E('power3.out')(inv(a2, 0, 0.5))))}deg)`);
      });
      {
        const a3 = t - 6.75;
        const rp = inv(a3, 0, 0.7);
        st(medalRing, 'opacity', rp > 0 && rp < 1 ? f2(0.9 * (1 - rp)) : '0');
        st(medalRing, 'transform', `scale(${f2(0.5 + 1.1 * E('power2.out')(rp))})`);
        st(medalSheen, 'backgroundPosition', `${f2(lerp(120, -40, p(t, 7.0, 7.5, 'power2.inOut')))}% 0`);
      }

      /* ---- PARABÉNS overlay ---- */
      const pOn = t >= 4.0 && t < 6.36;
      st(party, 'display', pOn ? 'block' : 'none');
      if (pOn) {
        const out = p(t, 6.0, 6.12, 'power2.in');           // content leaves first (scale-up + blur)…
        const outS = p(t, 6.12, 6.35, 'power1.inOut');      // …scrim + backdrop blur hold until 6.12, then lift
        const sO = f2(p(t, 4.0, 4.2, 'power2.out') * (1 - outS));
        st(scrim, 'opacity', sO);
        st(vig, 'opacity', sO);
        // vignette: kill the TV-edge seam (dark space | blurred UI) by ramping the UI side to the same dark
        const seam = 960 + (150 - 960) * c.s + c.x;
        st(vig, 'background', `linear-gradient(90deg, rgba(0,12,13,.9) 0px, rgba(0,12,13,.9) ${f2(seam + 16)}px, rgba(0,12,13,.62) ${f2(seam + 130)}px, rgba(0,12,13,.22) ${f2(seam + 330)}px, rgba(0,12,13,0) ${f2(seam + 520)}px, rgba(0,12,13,0) 1420px, rgba(0,12,13,.62) 1920px), ${vigR}`);
        st(pc, 'opacity', f2(1 - out));
        st(pc, 'transform', `scale(${(1 + 0.06 * out).toFixed(4)})`);
        st(pc, 'filter', out > 0.001 ? `blur(${f2(8 * out)}px)` : 'none');
        const ta = t - 4.0;
        const ts = ta < 0.3 ? lerp(0, 1.15, E('power3.out')(ta / 0.3)) : lerp(1.15, 1, E('power2.inOut')(inv(ta, 0.3, 0.5)));
        const fy = Math.sin(ta * 2.4) * 6 * p(ta, 0.4, 1.0, 'sine.inOut');
        st(trophy, 'transform', `translateY(${f2(fy)}px) scale(${ts.toFixed(4)})`);
        const tr = inv(ta, 0.05, 0.75);
        st(trophyRing, 'opacity', tr > 0 && tr < 1 ? f2(0.8 * (1 - tr)) : '0');
        st(trophyRing, 'transform', `scale(${f2(0.45 + 0.9 * E('power2.out')(tr))})`);
        st(rays, 'transform', `rotate(${f2(ta * 11)}deg) scale(${f2(0.6 + 0.4 * E('power3.out')(inv(ta, 0, 0.6)))})`);
        st(rays, 'opacity', f2(p(ta, 0, 0.5)));
        st(goldGlow, 'opacity', f2(p(ta, 0, 0.4) * (0.85 + 0.15 * Math.sin(ta * 3.1))));
      }

      /* ---- confetti (4.0 cannons, 4.5 centre burst; life 3.5 s) ---- */
      const g2 = conf.ctx;
      const cOn = t >= 4.0 && t <= 7.55;
      st(conf.canvas, 'display', cOn ? 'block' : 'none');
      if (cOn) {
        g2.clearRect(0, 0, 1920, 1080);
        const ca = t - 4.0;
        KIT.confetti(g2, ca, { x: 0, y: 900, angle: -Math.PI / 3, spread: 0.9, n: 120, power: 1700, seed: 1101, colors: CONF.colors, life: CONF.life });
        KIT.confetti(g2, ca, { x: 1920, y: 900, angle: (-2 * Math.PI) / 3, spread: 0.9, n: 120, power: 1700, seed: 1102, colors: CONF.colors, life: CONF.life });
        KIT.confetti(g2, t - 4.5, { x: 960, y: 420, n: 80, power: 1150, seed: 1103, colors: CONF.colors, life: CONF.life - 0.5 });
      }
    };

    // measure once, with real texts in place (offset* = layout values, unaffected by transforms)
    update(0);
    {
      const bh = cards.ana.barHold;
      BAR_END.x = bh.offsetLeft + bh.offsetWidth;
      BAR_END.y = bh.offsetTop + 6;
      // feed box = the PROJEÇÃO DO MÊS column (strip is the offsetParent)
      FEED_BOX.x = strip.offsetLeft + c3.offsetLeft;
      FEED_BOX.y = strip.offsetTop + c3.offsetTop;
      FEED_BOX.w = c3.offsetWidth;
      FEED_BOX.h = c3.offsetHeight;
      const th = (FEED_BOX.h - FEED_GAP) / 2;
      for (const to of toasts) { to.el.style.width = `${FEED_BOX.w}px`; to.el.style.height = `${th}px`; }
    }
    update(0);

    return { tl, update };
  },
});
