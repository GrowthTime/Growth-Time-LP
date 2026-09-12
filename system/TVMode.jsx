// GT System — Modo TV (TVPresentation): placar de metas para a TV do escritório. 1280×720, SEM rolagem (grid com overflow hidden).
// Fiel a TVHeader + TVTeamSummary + TVSellerCard: metas em 3 degraus, Hoje · Semana · Projeção por vendedora.
// Regra do sistema real: meta da semana = meta do mês ÷ 4; meta do dia = meta da semana ÷ 5 dias úteis (seg–sex).
const tvFmt = (v) => 'R$ ' + Math.round(v).toLocaleString('pt-BR');
const tvCompact = (v) => v >= 1000 ? (v / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + ' mil' : tvFmt(v);
const tvWeekGoal = (goalMonth) => Math.round(goalMonth / 4);
const tvDayGoal = (goalMonth) => Math.round(goalMonth / 4 / 5);
// O mês da encenação é fixo (mesmo período do Dashboard e do bloco de metas); só o relógio é vivo.
const tvMonthLabel = 'Setembro de 2026';
// Roteiro FIXO de vendas ao vivo: uma a cada 5 s, 12 por ciclo (~1 min) e o ciclo RECOMEÇA do zero (K.useScene).
// Calibrado para que, num ciclo, só a Júlia (venda 6) e a Marina (venda 12) cruzem a meta do dia; Ana fica a R$ 40.
const tvSalesScript = [
  { id: 'julia', value: 890 }, { id: 'marina', value: 640 }, { id: 'paula', value: 1180 }, { id: 'ana', value: 520 },
  { id: 'bia', value: 1450 }, { id: 'julia', value: 1120 }, { id: 'marina', value: 380 }, { id: 'paula', value: 640 },
  { id: 'ana', value: 340 }, { id: 'bia', value: 980 }, { id: 'julia', value: 1340 }, { id: 'marina', value: 450 },
];
const tvSeed = () => GT.sellers.filter((s) => s.goalOuro > 0).map((s) => ({
  id: s.id, name: s.name, avatar: s.initials, color: s.color, chip: GT.chip(s.chipId),
  realizedMonth: s.month, goalOuro: s.goalOuro, goalPrata: s.goalPrata, goalBronze: s.goalBronze,
  realizedDay: s.day, goalDay: tvDayGoal(s.goalOuro), realizedWeek: s.week, goalWeek: tvWeekGoal(s.goalOuro),
}));
// Estado da grade derivado do passo da cena: passo 0 = números do Data.jsx; passo k = k primeiras vendas do roteiro somadas.
const tvApply = (step) => {
  const sold = {};
  tvSalesScript.slice(0, step).forEach((sc) => { sold[sc.id] = (sold[sc.id] || 0) + sc.value; });
  return tvSeed().map((s) => { const v = sold[s.id] || 0; return { ...s, realizedMonth: s.realizedMonth + v, realizedDay: s.realizedDay + v, realizedWeek: s.realizedWeek + v }; });
};
// CSS local: .gt-pop é o nome combinado do contrato, mas só o Conversas injeta a regra; .tv-pop garante a entrada suave no Modo TV (e no iframe da LP).
const tvCss = '@keyframes tvConfetti{0%{transform:translateY(0) rotate(0deg)}100%{transform:translateY(760px) rotate(540deg)}} @keyframes tvPop{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:none}} .tv-pop{animation:tvPop .5s cubic-bezier(.2,.8,.3,1) both}';
const tvHHMM = (d) => ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2);

function TVRankBadge({ rank }) {
  const cls = rank === 1
    ? { background: 'linear-gradient(135deg,#facc15,#d97706)', color: '#fff', boxShadow: '0 0 0 2px rgba(253,224,71,.5)' }
    : rank === 2
      ? { background: 'linear-gradient(135deg,#cbd5e1,#64748b)', color: '#fff', boxShadow: '0 0 0 2px rgba(226,232,240,.5)' }
      : rank === 3
        ? { background: 'linear-gradient(135deg,#d97706,#92400e)', color: '#fff', boxShadow: '0 0 0 2px rgba(217,119,6,.4)' }
        : { background: '#f1f1f1', color: '#5f5e5a', boxShadow: '0 0 0 1px #e5e5e5' };
  return (
    <div style={{ minWidth: 32, height: 32, borderRadius: 999, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, flexShrink: 0, ...cls }}>
      {rank === 1 ? <Icon name="crown" size={16} color="#fff" /> : rank}
    </div>
  );
}

// Só a MAIOR medalha ao lado do % (mês > semana > dia) — as outras já aparecem na faixa de parabéns; assim o nome nunca é espremido.
function TVMedals({ day, week, month }) {
  const m = month ? ['#d97706', 'rgba(245,158,11,.1)', '🏆', 'mês'] : week ? ['#7c3aed', 'rgba(124,58,237,.1)', '📈', 'semana'] : day ? ['#0284c7', 'rgba(14,165,233,.1)', '🔥', 'dia'] : null;
  if (!m) return null;
  const [c, bg, label, txt] = m;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10.5, fontWeight: 600, padding: '2px 8px', borderRadius: 999, background: bg, color: c, border: `1px solid ${c}40`, whiteSpace: 'nowrap' }}>{label} {txt}</span>
  );
}

function TVCongrats({ kind }) {
  const cfg = {
    mes: { text: '🏆 PARABÉNS! Meta do mês batida!', grad: 'linear-gradient(90deg,#fbbf24,#f97316)' },
    semana: { text: '📈 PARABÉNS! Meta da semana batida!', grad: 'linear-gradient(90deg,#8b5cf6,#a855f7)' },
    dia: { text: '🔥 PARABÉNS! Meta do dia batida!', grad: 'linear-gradient(90deg,#0ea5e9,#3b82f6)' },
  }[kind];
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 8, padding: '5px 12px', fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '.02em', fontSize: 11.5, background: cfg.grad, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
      {cfg.text}
    </div>
  );
}

// Caixa Hoje / Semana / Projeção (L3 do card real: "quebra, nunca clipa")
function TVMetricBox({ label, realized, goal, pct, proj, tone }) {
  return (
    <div style={{ borderRadius: 10, background: '#f7f8f8', padding: '9px 12px', minWidth: 0 }}>
      <div style={{ fontSize: 10, color: '#737373', textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 600 }}>{label}</div>
      {proj != null ? (
        <React.Fragment>
          <div style={{ fontWeight: 700, fontSize: 18, color: tone, lineHeight: 1.2 }}>{proj}%</div>
          <div style={{ fontSize: 11.5, color: '#737373' }}>{tvCompact(realized)} projetados</div>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, flexWrap: 'wrap', lineHeight: 1.2 }}>
            <span style={{ fontWeight: 700, fontSize: 16, whiteSpace: 'nowrap' }}>{tvFmt(realized)}</span>
            <span style={{ fontSize: 11, color: '#a3a3a3', whiteSpace: 'nowrap' }}>/ {tvCompact(goal)}</span>
          </div>
          <div style={{ fontSize: 11.5 }}>{realized >= goal ? <span style={{ color: '#059669', fontWeight: 600 }}>✓ bateu!</span> : <span style={{ color: '#a3a3a3' }}>falta <b style={{ color: '#171717' }}>{tvCompact(goal - realized)}</b></span>}</div>
        </React.Fragment>
      )}
    </div>
  );
}

function TVSellerCard({ s, flash, fresh }) {
  const isComplete = s.pctMonth >= 100;
  const topBadge = s.badgeMonth ? 'mes' : s.badgeWeek ? 'semana' : s.badgeDay ? 'dia' : null;
  const ring = flash
    ? '0 0 0 3px #15dba8, 0 0 30px rgba(21,219,168,.55)'
    : topBadge
    ? (topBadge === 'mes' ? '0 0 0 2px rgba(251,191,36,.7), 0 0 24px rgba(251,191,36,.35)' : topBadge === 'semana' ? '0 0 0 2px rgba(168,85,247,.6)' : '0 0 0 2px rgba(14,165,233,.6)')
    : s.rank === 1 ? '0 0 0 2px rgba(250,204,21,.6)' : 'var(--shadow-sm)';
  const projTone = s.trend >= 100 ? '#059669' : s.trend >= 85 ? '#ca8a04' : '#dc2626';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 14, padding: '16px 18px', borderRadius: 16, border: '1px solid #eee', background: flash ? 'rgba(21,219,168,.06)' : '#fff', boxShadow: ring, transition: 'box-shadow .25s, background .25s', minHeight: 0, overflow: 'hidden' }}>
      {topBadge && fresh && <TVCongrats kind={topBadge} />}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <TVRankBadge rank={s.rank} />
        <K.Avatar initials={s.avatar} color={s.color} size={44} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 18, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1.2 }}>{s.name}</div>
          <div style={{ fontSize: 12.5, color: '#737373', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}><b style={{ color: '#171717' }}>{tvFmt(s.realizedMonth)}</b> / {tvCompact(s.goalOuro)} <span style={{ color: '#a3a3a3' }}>· nº {s.chip.short}</span></div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3, flex: '0 0 auto' }}>
          <div style={{ fontWeight: 700, fontSize: 30, color: isComplete ? '#059669' : '#27ae8f', lineHeight: 1 }}>{Math.round(s.pctMonth)}%</div>
          <TVMedals day={s.badgeDay} week={s.badgeWeek} month={s.badgeMonth} />
        </div>
      </div>
      <GpTieredProgress current={s.realizedMonth} ouro={s.goalOuro} bronze={s.goalBronze} prata={s.goalPrata} height={12} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, fontSize: 11, color: '#737373', marginTop: -6 }}>
        {[['Bronze', s.goalBronze, K.c.bronze], ['Prata', s.goalPrata, K.c.silver], ['Ouro', s.goalOuro, K.c.gold]].map(([l, v, c]) => { const ok = s.realizedMonth >= v; return <span key={l} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontWeight: ok ? 700 : 500, color: ok ? '#171717' : '#737373' }}><K.Dot color={c} size={7} />{l} {tvCompact(v)}{ok ? ' ✓' : ''}</span>; })}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 10 }}>
        <TVMetricBox label="Hoje" realized={s.realizedDay} goal={s.goalDay} />
        <TVMetricBox label="Semana" realized={s.realizedWeek} goal={s.goalWeek} />
        <TVMetricBox label="Projeção" realized={s.trendProjection} proj={s.trend} tone={projTone} />
      </div>
    </div>
  );
}

function TVTeamSummary({ t }) {
  const pctMonth = Math.min(Math.round((t.realizedMonth / t.goalOuro) * 100), 100);
  const pctDay = Math.round((t.realizedDay / t.goalDay) * 100);
  const pctWeek = Math.round((t.realizedWeek / t.goalWeek) * 100);
  const head = (ic, txt) => <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#737373', textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 600 }}><Icon name={ic} size={14} color="#737373" />{txt}</div>;
  return (
    <div style={{ padding: '12px 28px', borderBottom: '1px solid #eee', background: '#f7f8f8', flexShrink: 0 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr .9fr', gap: 28 }}>
        {/* Mês */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {head('target', 'Meta do mês · equipe')}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-.01em' }}>{tvFmt(t.realizedMonth)}</span>
            <span style={{ fontSize: 13, color: '#a3a3a3' }}>/ {tvFmt(t.goalOuro)} <span style={{ fontSize: 11 }}>(ouro)</span></span>
            <span style={{ fontSize: 20, fontWeight: 700, color: pctMonth >= 100 ? '#059669' : '#27ae8f', marginLeft: 'auto' }}>{pctMonth}%</span>
          </div>
          <GpTieredProgress current={t.realizedMonth} ouro={t.goalOuro} bronze={t.goalBronze} prata={t.goalPrata} height={12} />
          <div style={{ display: 'flex', gap: 12, fontSize: 11, color: '#737373', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><K.Dot color={K.c.bronze} size={8} />Bronze {tvCompact(t.goalBronze)}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><K.Dot color={K.c.silver} size={8} />Prata {tvCompact(t.goalPrata)}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><K.Dot color={K.c.gold} size={8} />Ouro {tvCompact(t.goalOuro)}</span>
            <span style={{ marginLeft: 'auto', color: '#a3a3a3' }}>faltam <b style={{ color: '#171717' }}>{tvCompact(Math.max(0, t.goalOuro - t.realizedMonth))}</b></span>
          </div>
        </div>
        {/* Hoje & Semana — meta da semana = mês ÷ 4; meta do dia = semana ÷ 5 dias úteis (os números cumprem a regra) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {head('trending-up', 'Hoje & Semana')}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[['Hoje', t.realizedDay, t.goalDay, pctDay, 'meta da semana ÷ 5 dias úteis'], ['Semana', t.realizedWeek, t.goalWeek, pctWeek, 'meta do mês ÷ 4']].map(([l, r, g, p, rule]) => (
              <div key={l} style={{ borderRadius: 10, background: '#fff', border: '1px solid #eee', padding: '8px 10px', minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}><span style={{ fontSize: 11, color: '#a3a3a3' }}>{l}</span><span style={{ fontSize: 12, fontWeight: 700, color: p >= 100 ? '#059669' : '#27ae8f' }}>{p}%</span></div>
                <div style={{ fontWeight: 700, fontSize: 16, lineHeight: 1.2, whiteSpace: 'nowrap' }}>{tvFmt(r)}</div>
                <div style={{ fontSize: 11, color: '#a3a3a3', whiteSpace: 'nowrap' }}>de {tvFmt(g)}</div>
                <div style={{ fontSize: 10, color: '#a3a3a3', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{rule}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Projeção */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {head('line-chart', 'Projeção do mês')}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-.01em' }}>{tvFmt(t.trendProjection)}</span>
            <span style={{ fontSize: 20, fontWeight: 700, color: t.trendPercentage >= 100 ? '#059669' : '#ca8a04' }}>{t.trendPercentage}%</span>
          </div>
          <div style={{ fontSize: 12, color: '#a3a3a3' }}>{t.trendPercentage >= 100 ? 'no ritmo atual, a equipe bate a meta ouro' : 'no ritmo atual, a equipe fica abaixo do ouro'}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 'auto', paddingTop: 6, borderTop: '1px solid #eee', fontSize: 12, color: '#737373' }}>
            <Icon name="calendar" size={14} color="#737373" /><b style={{ color: '#171717' }}>{t.remainingWorkDays}</b> dias úteis restantes <span style={{ color: '#a3a3a3' }}>({t.elapsedWorkDays}/{t.totalWorkDays})</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function TVMode({ onClose }) {
  const T0 = GT.team;
  // Cena: passo 0 = placar do Data.jsx; passos 1..12 = vendas do roteiro; volta ao 0 e recomeça (pausa com a aba oculta).
  const step = K.useScene(tvSalesScript.length + 1, 5000);
  const [now, setNow] = React.useState(new Date());
  const [muted, setMuted] = React.useState(false);
  const [sale, setSale] = React.useState(null);           // toast da venda
  const [flash, setFlash] = React.useState(null);         // id da vendedora pulsando
  const atRef = React.useRef({});                         // hora em que cada venda do ciclo apareceu

  // relógio + ESC fecha
  React.useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose && onClose();
    window.addEventListener('keydown', onKey);
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => { window.removeEventListener('keydown', onKey); clearInterval(id); };
  }, []);

  // a cada passo da cena: toast + card piscando (timer limpo no cleanup); passo 0 = ciclo novo, tudo zera
  React.useEffect(() => {
    if (step === 0) { atRef.current = {}; setSale(null); setFlash(null); return; }
    const sc = tvSalesScript[step - 1];
    const who = GT.seller(sc.id);
    atRef.current[step] = tvHHMM(new Date());
    setSale({ id: sc.id, name: who.name, avatar: who.initials, color: who.color, value: sc.value, key: step });
    setFlash(sc.id);
    const t = setTimeout(() => setFlash(null), 1600);
    return () => clearTimeout(t);
  }, [step]);

  const data = React.useMemo(() => tvApply(step), [step]);
  const delta = tvSalesScript.slice(0, step).reduce((a, sc) => a + sc.value, 0);
  const recent = [];
  // No máximo 3 linhas (3×40 + 2×6 = 132 px) — a área da lista tem ~153 px; a 4ª estourava por cima do título e do rodapé.
  for (let k = step; k > 0 && recent.length < 3; k--) recent.push({ ...tvSalesScript[k - 1], at: atRef.current[k] || tvHHMM(now), key: k });

  const team = {
    ...T0,
    goalDay: Math.round(T0.goalWeek / 5),                 // meta do dia = meta da semana ÷ 5 dias úteis (mesma regra dos cards)
    realizedMonth: T0.month + delta,
    realizedDay: data.reduce((a, s) => a + s.realizedDay, 0),
    realizedWeek: data.reduce((a, s) => a + s.realizedWeek, 0),
    trendPercentage: Math.round(((T0.goalOuro * T0.trend / 100) + delta * T0.totalWorkDays / T0.elapsedWorkDays) / T0.goalOuro * 100),
    trendProjection: Math.round((T0.goalOuro * T0.trend / 100) + delta * T0.totalWorkDays / T0.elapsedWorkDays),
  };
  // projeção da vendedora no ritmo da equipe (mesma regra do card de metas)
  const paceFactor = (T0.trend / 100) / (T0.month / T0.goalOuro);
  const sellers = data
    .map((s) => ({ ...s, pctMonth: (s.realizedMonth / s.goalOuro) * 100 }))
    .map((s) => ({ ...s, trend: Math.round(s.pctMonth * paceFactor), trendProjection: Math.round(s.realizedMonth * paceFactor) }))
    .map((s) => ({ ...s, badgeMonth: s.realizedMonth >= s.goalOuro, badgeWeek: s.realizedWeek >= s.goalWeek, badgeDay: s.realizedDay >= s.goalDay }))
    .sort((a, b) => b.pctMonth - a.pctMonth)
    .map((s, i) => ({ ...s, rank: i + 1 }));
  const cols = sellers.length <= 4 ? 2 : 3;
  const rowsN = Math.ceil(sellers.length / cols);

  const pad = (n) => ('0' + n).slice(-2);
  const timeLabel = pad(now.getHours()) + ':' + pad(now.getMinutes()) + ':' + pad(now.getSeconds());
  const nDay = sellers.filter((s) => s.badgeDay).length;
  const nWeek = sellers.filter((s) => s.badgeWeek).length;
  // comemoração (igual à do real, com confete): quando uma vendedora passa a meta do DIA durante o roteiro, cobre a tela por 5 s
  const [party, setParty] = React.useState(null);
  const seenDay = React.useRef({});
  React.useEffect(() => {
    if (step === 0) { seenDay.current = {}; return; }
    const hit = sellers.find((x) => x.badgeDay && !seenDay.current[x.id]);
    if (hit) { seenDay.current[hit.id] = step; setParty(hit); const t = setTimeout(() => setParty(null), 2000); return () => clearTimeout(t); }
  }, [step]);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: '#fafafa', display: 'flex', flexDirection: 'column', overflow: 'hidden', fontFamily: K.font, color: '#171717' }}>
      <style>{tvCss}</style>
      {party && <div onClick={() => setParty(null)} style={{ position: 'absolute', inset: 0, zIndex: 50, background: 'rgba(17,24,39,.72)', backdropFilter: 'blur(6px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, cursor: 'pointer' }}>
        {Array.from({ length: 60 }).map((_, i) => <span key={i} style={{ position: 'absolute', left: ((i * 37) % 100) + '%', top: -20, width: 6 + (i % 3) * 3, height: 10 + (i % 4) * 4, background: ['#3fc58f', '#f59e0b', '#fff', '#a7f3d0', '#fde68a'][i % 5], borderRadius: 2, transform: `rotate(${(i * 53) % 360}deg)`, animation: `tvConfetti ${3 + (i % 5) * .6}s linear ${(i % 7) * .35}s infinite`, opacity: .9 }}></span>)}
        <div style={{ height: 140, width: 140, borderRadius: 999, background: 'radial-gradient(circle at 40% 35%, #fde68a, #f59e0b)', display: 'grid', placeItems: 'center', boxShadow: '0 0 60px rgba(245,158,11,.5)' }}><Icon name="trophy" size={64} color="#fff" strokeWidth={1.6} /></div>
        <div style={{ fontSize: 96, fontWeight: 900, color: '#fff', letterSpacing: '-.02em', lineHeight: 1, textShadow: '0 4px 24px rgba(0,0,0,.4)' }}>PARABÉNS!</div>
        <div style={{ fontSize: 40, fontWeight: 600, color: '#fff', textShadow: '0 2px 12px rgba(0,0,0,.4)' }}>{party.name} bateu a meta do DIA!</div>
        <div style={{ marginTop: 10, padding: '10px 22px', borderRadius: 999, background: 'rgba(0,0,0,.45)', color: '#fff', fontSize: 15, fontWeight: 500, border: '1px solid rgba(255,255,255,.2)' }}>🎉 Seguindo em frente! 🎉</div>
      </div>}
      {/* cabeçalho */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 28px', borderBottom: '1px solid #eee', background: 'rgba(255,255,255,.7)', backdropFilter: 'blur(8px)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <img src="../assets/logo.png" alt="GT" style={{ height: 28 }} />
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-.01em' }}>{GT.company.name}</h1>
            <span style={{ color: '#a3a3a3', fontSize: 16 }}>· Metas de {tvMonthLabel}</span>
          </div>
          <K.Badge color="#27ae8f" bg="rgba(56,204,156,.1)"><K.Dot color="#22c55e" size={6} pulse />ao vivo · {sellers.length} vendedoras</K.Badge>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <span style={{ fontSize: 22, fontWeight: 600, color: 'rgba(0,0,0,.55)', fontVariantNumeric: 'tabular-nums' }}>{timeLabel}</span>
          <button onClick={() => setMuted(!muted)} title="Som" style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#737373', display: 'flex' }}><Icon name={muted ? 'volume-x' : 'volume-2'} size={20} color="#737373" /></button>
          <button onClick={onClose} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 14, fontWeight: 600, color: '#737373', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}><Icon name="x" size={17} color="#737373" />Sair</button>
        </div>
      </header>

      <TVTeamSummary t={team} />

      {/* grade de vendedoras — linhas iguais, nada rola */}
      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', padding: 14, display: 'grid', gridTemplateColumns: `repeat(${cols},minmax(0,1fr))`, gridTemplateRows: `repeat(${rowsN},minmax(0,1fr))`, gap: 12 }}>
        {sellers.map((s) => <TVSellerCard key={s.id} s={s} flash={flash === s.id} fresh={seenDay.current[s.id] != null && step - seenDay.current[s.id] < 2} />)}
      </div>

      <TVSaleToast sale={sale} />
    </div>
  );
}

// Toast "Venda realizada!" (fica ~2,2 s de cada 5 s — curto para não tapar o card de baixo o ciclo inteiro): o contêiner fica SEMPRE montado (ref válido desde a 1ª venda); a animação roda em efeito próprio,
// disparado quando a venda exibida muda, e limpa rAF/timer no cleanup (troca de venda ou Sair no meio da animação).
function TVSaleToast({ sale }) {
  const [shown, setShown] = React.useState(null);
  const elRef = React.useRef(null);
  React.useEffect(() => { if (sale) setShown(sale); }, [sale && sale.key]);
  React.useEffect(() => {
    const el = elRef.current;
    if (!shown || !el) return;
    let alive = true, raf = 0, start = null; const dur = 520;
    // entrada via rAF (pop + sobe) — anima mesmo onde o relógio do CSS está congelado
    function frame(t) {
      if (!alive) return;
      if (start === null) start = t;
      const p = Math.min((t - start) / dur, 1);
      const k = p < 0.6 ? (p / 0.6) : 1;
      const back = p < 0.6 ? 1 - Math.pow(1 - p / 0.6, 3) : 1;
      const scale = 0.7 + 0.34 * back - (p > 0.6 ? (p - 0.6) / 0.4 * 0.04 : 0);
      el.style.opacity = Math.min(1, k * 1.4);
      el.style.transform = 'translateX(-50%) translateY(' + (30 * (1 - back)).toFixed(1) + 'px) scale(' + scale.toFixed(3) + ')';
      if (p < 1) raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    const out = setTimeout(() => {
      let s2 = null; const d2 = 400;
      function fout(t) {
        if (!alive) return;
        if (s2 === null) s2 = t;
        const p = Math.min((t - s2) / d2, 1);
        el.style.opacity = String(1 - p);
        el.style.transform = 'translateX(-50%) translateY(' + (-18 * p).toFixed(1) + 'px) scale(' + (1 - 0.05 * p).toFixed(3) + ')';
        if (p < 1) raf = requestAnimationFrame(fout); else setShown(null);
      }
      raf = requestAnimationFrame(fout);
    }, 1800);
    return () => { alive = false; cancelAnimationFrame(raf); clearTimeout(out); };
  }, [shown && shown.key]);
  return (
    <div ref={elRef} style={{ position: 'fixed', left: '50%', bottom: 36, zIndex: 120, transform: 'translateX(-50%) scale(.7)', opacity: 0, pointerEvents: 'none' }}>
      {shown && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'linear-gradient(135deg,#15dba8,#27ae8f)', color: '#fff', padding: '10px 20px', borderRadius: 16, boxShadow: '0 24px 60px rgba(21,219,168,.5)' }}>
          <div style={{ height: 40, width: 40, borderRadius: 999, background: 'rgba(255,255,255,.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>💰</div>
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', opacity: .9 }}>Venda realizada!</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 2 }}>
              <span style={{ fontSize: 24, lineHeight: 1, fontWeight: 800, letterSpacing: '-.01em' }}>{tvFmt(shown.value)}</span>
              <span style={{ fontSize: 15, opacity: .95 }}>· {shown.name}</span>
            </div>
          </div>
          <K.Avatar initials={shown.avatar} color="rgba(255,255,255,.22)" size={36} />
        </div>
      )}
    </div>
  );
}

window.TVMode = TVMode;
