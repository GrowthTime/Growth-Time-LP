// GT System — Modo TV (TVPresentation): light-mode goal leaderboard for the office TV.
// Faithful to src/pages/TVPresentation.tsx + TVHeader + TVTeamSummary + TVSellerCard.
function fmtBRL0(v) { return 'R$ ' + Math.round(v).toLocaleString('pt-BR'); }

function TVRankBadge({ rank }) {
  const cls = rank === 1
    ? { background: 'linear-gradient(135deg,#facc15,#d97706)', color: '#fff', boxShadow: '0 0 0 2px rgba(253,224,71,.5)' }
    : rank === 2
      ? { background: 'linear-gradient(135deg,#cbd5e1,#64748b)', color: '#fff', boxShadow: '0 0 0 2px rgba(226,232,240,.5)' }
      : rank === 3
        ? { background: 'linear-gradient(135deg,#d97706,#92400e)', color: '#fff', boxShadow: '0 0 0 2px rgba(217,119,6,.4)' }
        : { background: '#f1f1f1', color: '#5f5e5a', boxShadow: '0 0 0 1px #e5e5e5' };
  return (
    <div style={{ minWidth: 34, height: 34, borderRadius: 999, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 15, ...cls }}>
      {rank === 1 ? <Icon name="crown" size={17} color="#fff" /> : rank}
    </div>
  );
}

function TVMedals({ day, week, month }) {
  if (!day && !week && !month) return null;
  const chip = (c, bg, label, txt) => (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10.5, fontWeight: 600, padding: '2px 8px', borderRadius: 999, background: bg, color: c, border: `1px solid ${c}40` }}>{label} {txt}</span>
  );
  return (
    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
      {day && chip('#0284c7', 'rgba(14,165,233,.1)', '🔥', 'dia')}
      {week && chip('#7c3aed', 'rgba(124,58,237,.1)', '📈', 'semana')}
      {month && chip('#d97706', 'rgba(245,158,11,.1)', '🏆', 'mês')}
    </div>
  );
}

function TVCongrats({ kind }) {
  const cfg = {
    mes: { text: '🏆 PARABÉNS! Meta do mês batida!', grad: 'linear-gradient(90deg,#fbbf24,#f97316)' },
    semana: { text: '📈 PARABÉNS! Meta da semana batida!', grad: 'linear-gradient(90deg,#8b5cf6,#a855f7)' },
    dia: { text: '🔥 PARABÉNS! Meta do dia batida!', grad: 'linear-gradient(90deg,#0ea5e9,#3b82f6)' },
  }[kind];
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 8, padding: '6px 12px', fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '.02em', fontSize: 12, background: cfg.grad }}>
      {cfg.text}
    </div>
  );
}

function TVSellerCard({ s, flash }) {
  const isComplete = s.pctMonth >= 100;
  const topBadge = s.badgeMonth ? 'mes' : s.badgeWeek ? 'semana' : s.badgeDay ? 'dia' : null;
  const ring = flash
    ? '0 0 0 3px #15dba8, 0 0 30px rgba(21,219,168,.55)'
    : topBadge
    ? (topBadge === 'mes' ? '0 0 0 2px rgba(251,191,36,.7), 0 0 24px rgba(251,191,36,.35)' : topBadge === 'semana' ? '0 0 0 2px rgba(168,85,247,.6)' : '0 0 0 2px rgba(14,165,233,.6)')
    : s.rank === 1 ? '0 0 0 2px rgba(250,204,21,.6)' : 'var(--shadow-sm)';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 18, borderRadius: 16, border: '1px solid #eee', background: flash ? 'rgba(21,219,168,.06)' : '#fff', boxShadow: ring, transition: 'box-shadow .25s, background .25s' }}>
      {topBadge && <TVCongrats kind={topBadge} />}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <TVRankBadge rank={s.rank} />
        <div style={{ height: 42, width: 42, borderRadius: 999, background: 'rgba(56,204,156,.12)', color: '#27ae8f', fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{s.avatar}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 17, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</div>
          <div style={{ fontSize: 12, color: '#a3a3a3' }}>{fmtBRL0(s.realizedMonth)} / {fmtBRL0(s.goalOuro)}</div>
        </div>
        <div style={{ fontWeight: 700, fontSize: 30, color: isComplete ? '#059669' : '#27ae8f' }}>{Math.round(s.pctMonth)}%</div>
      </div>
      <TieredProgress current={s.realizedMonth} ouro={s.goalOuro} bronze={s.goalBronze} prata={s.goalPrata} height={10} />
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 10 }}>
        <div>
          <div style={{ fontSize: 10.5, color: '#a3a3a3' }}>Hoje</div>
          <div style={{ fontWeight: 700, fontSize: 14 }}>{fmtBRL0(s.realizedDay)} <span style={{ fontSize: 10.5, color: '#a3a3a3', fontWeight: 400 }}>/ {fmtBRL0(s.goalDay)}</span></div>
          <div style={{ fontSize: 10.5 }}>{s.realizedDay >= s.goalDay ? <span style={{ color: '#059669', fontWeight: 600 }}>✓ bateu!</span> : <span style={{ color: '#a3a3a3' }}>falta <b style={{ color: '#171717' }}>{fmtBRL0(s.goalDay - s.realizedDay)}</b></span>}</div>
        </div>
        <TVMedals day={s.badgeDay} week={s.badgeWeek} month={s.badgeMonth} />
      </div>
    </div>
  );
}

function TVTeamSummary({ t }) {
  const pctMonth = Math.min(Math.round((t.realizedMonth / t.goalOuro) * 100), 100);
  const pctDay = Math.round((t.realizedDay / t.goalDay) * 100);
  const pctWeek = Math.round((t.realizedWeek / t.goalWeek) * 100);
  return (
    <div style={{ padding: '16px 32px', borderBottom: '1px solid #eee', background: '#f7f8f8' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 28 }}>
        {/* Mês */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: '#737373', textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 600 }}><Icon name="target" size={14} color="#737373" />Meta do mês</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 26, fontWeight: 700 }}>{fmtBRL0(t.realizedMonth)}</span>
            <span style={{ fontSize: 13, color: '#a3a3a3' }}>/ {fmtBRL0(t.goalOuro)}</span>
            <span style={{ fontSize: 18, fontWeight: 700, color: pctMonth >= 100 ? '#059669' : '#27ae8f', marginLeft: 'auto' }}>{pctMonth}%</span>
          </div>
          <TieredProgress current={t.realizedMonth} ouro={t.goalOuro} bronze={t.goalBronze} prata={t.goalPrata} height={12} />
          <div style={{ display: 'flex', gap: 12, fontSize: 11, color: '#737373' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ height: 8, width: 8, borderRadius: 999, background: '#bd6b2f' }}></span>Bronze {fmtBRL0(t.goalBronze)}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ height: 8, width: 8, borderRadius: 999, background: '#a3adba' }}></span>Prata {fmtBRL0(t.goalPrata)}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ height: 8, width: 8, borderRadius: 999, background: '#f3b315' }}></span>Ouro {fmtBRL0(t.goalOuro)}</span>
          </div>
        </div>
        {/* Hoje & Semana */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: '#737373', textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 600 }}><Icon name="trending-up" size={14} color="#737373" />Hoje &amp; Semana</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[['Hoje', t.realizedDay, t.goalDay, pctDay], ['Semana', t.realizedWeek, t.goalWeek, pctWeek]].map(([l, r, g, p]) => (
              <div key={l} style={{ borderRadius: 10, background: '#fff', border: '1px solid #eee', padding: 10 }}>
                <div style={{ fontSize: 11, color: '#a3a3a3' }}>{l}</div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>{fmtBRL0(r)}</div>
                <div style={{ fontSize: 11, color: '#a3a3a3' }}>de {fmtBRL0(g)}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: p >= 100 ? '#059669' : '#27ae8f' }}>{p}%</div>
              </div>
            ))}
          </div>
        </div>
        {/* Projeção */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: '#737373', textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 600 }}><Icon name="trending-up" size={14} color="#737373" />Projeção</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontSize: 26, fontWeight: 700 }}>{fmtBRL0(t.trendProjection)}</span>
            <span style={{ fontSize: 18, fontWeight: 700, color: '#27ae8f' }}>{t.trendPercentage}%</span>
          </div>
          <div style={{ fontSize: 12, color: '#a3a3a3' }}>se mantiver o ritmo atual</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 'auto', paddingTop: 8, borderTop: '1px solid #eee', fontSize: 12, color: '#737373' }}>
            <Icon name="calendar" size={14} color="#737373" /><b style={{ color: '#171717' }}>{t.remainingWorkDays}</b> dias úteis restantes <span style={{ color: '#a3a3a3' }}>({t.elapsedWorkDays}/{t.totalWorkDays})</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function TVMode({ onClose }) {
  const team0 = { goalOuro: 700000, goalPrata: 600000, goalBronze: 500000, goalDay: 32000, goalWeek: 175000, trendPercentage: 102, remainingWorkDays: 4, elapsedWorkDays: 18, totalWorkDays: 22 };
  const seed = [
    { name: 'Marina Alves', avatar: 'MA', realizedMonth: 198000, goalOuro: 210000, goalPrata: 185000, goalBronze: 150000, realizedDay: 6200, goalDay: 9500, realizedWeek: 44000, goalWeek: 48000 },
    { name: 'Ana Silva', avatar: 'AS', realizedMonth: 168000, goalOuro: 180000, goalPrata: 160000, goalBronze: 130000, realizedDay: 5400, goalDay: 8200, realizedWeek: 38000, goalWeek: 42000 },
    { name: 'Júlia Costa', avatar: 'JC', realizedMonth: 138000, goalOuro: 160000, goalPrata: 140000, goalBronze: 115000, realizedDay: 4900, goalDay: 7300, realizedWeek: 31000, goalWeek: 38000 },
    { name: 'Bia Ramos', avatar: 'BR', realizedMonth: 101000, goalOuro: 150000, goalPrata: 130000, goalBronze: 105000, realizedDay: 3100, goalDay: 6800, realizedWeek: 19000, goalWeek: 35000 },
  ];
  const [data, setData] = React.useState(seed);
  const [now, setNow] = React.useState(new Date());
  const [muted, setMuted] = React.useState(false);
  const [sale, setSale] = React.useState(null);     // active sale toast
  const [flash, setFlash] = React.useState(null);   // seller name pulsing

  // clock
  React.useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => { window.removeEventListener('keydown', onKey); clearInterval(id); };
  }, []);

  // a sale happens every 5s with a random value + random seller
  const dataRef = React.useRef(data); dataRef.current = data;
  React.useEffect(() => {
    function ringSale() {
      const sellers = dataRef.current;
      const idx = Math.floor(Math.random() * sellers.length);
      const value = (Math.floor(Math.random() * 56) + 4) * 100; // R$400–R$6000
      const who = sellers[idx];
      setData((prev) => prev.map((s, i) => i === idx ? {
        ...s,
        realizedMonth: s.realizedMonth + value,
        realizedDay: s.realizedDay + value,
        realizedWeek: s.realizedWeek + value,
      } : s));
      setSale({ name: who.name, avatar: who.avatar, value, id: Date.now() });
      setFlash(who.name);
      setTimeout(() => setFlash(null), 1600);
      setTimeout(() => setSale((cur) => (cur && cur.name === who.name ? null : cur)), 3600);
    }
    const id = setInterval(ringSale, 5000);
    const kick = setTimeout(ringSale, 1200);
    return () => { clearInterval(id); clearTimeout(kick); };
  }, []);

  const team = {
    ...team0,
    realizedMonth: data.reduce((a, s) => a + s.realizedMonth, 0),
    realizedDay: data.reduce((a, s) => a + s.realizedDay, 0),
    realizedWeek: data.reduce((a, s) => a + s.realizedWeek, 0),
    trendProjection: Math.round(data.reduce((a, s) => a + s.realizedMonth, 0) * 1.14),
  };
  const sellers = data
    .map((s) => ({ ...s, pctMonth: (s.realizedMonth / s.goalOuro) * 100 }))
    .map((s) => ({ ...s, badgeMonth: s.realizedMonth >= s.goalOuro, badgeWeek: s.realizedWeek >= s.goalWeek, badgeDay: s.realizedDay >= s.goalDay }))
    .sort((a, b) => b.pctMonth - a.pctMonth)
    .map((s, i) => ({ ...s, rank: i + 1 }));

  const pad = (n) => ('0' + n).slice(-2);
  const monthLabel = now.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  const timeLabel = pad(now.getHours()) + ':' + pad(now.getMinutes()) + ':' + pad(now.getSeconds());

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: '#fafafa', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* header */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 32px', borderBottom: '1px solid #eee', background: 'rgba(255,255,255,.7)', backdropFilter: 'blur(8px)' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
          <img src="../assets/logo.png" alt="GT" style={{ height: 30 }} />
          <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-.01em' }}>Moda Fashion</h1>
          <span style={{ color: '#a3a3a3', fontSize: 17, textTransform: 'capitalize' }}>· Metas de {monthLabel}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <span style={{ fontSize: 22, fontWeight: 600, color: 'rgba(0,0,0,.55)', fontVariantNumeric: 'tabular-nums' }}>{timeLabel}</span>
          <button onClick={() => setMuted(!muted)} title="Som" style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#737373', display: 'flex' }}><Icon name={muted ? 'volume-x' : 'volume-2'} size={20} color="#737373" /></button>
          <button onClick={onClose} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 14, fontWeight: 600, color: '#737373', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}><Icon name="x" size={17} color="#737373" />Sair</button>
        </div>
      </header>

      <TVTeamSummary t={team} />

      {/* grid of seller cards */}
      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', padding: 16, display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gridAutoRows: 'min-content', gap: 12 }}>
        {sellers.map((s) => <TVSellerCard key={s.name} s={s} flash={flash === s.name} />)}
      </div>

      {/* live sale animation */}
      <TVSaleToast sale={sale} />
    </div>
  );
}

function TVSaleToast({ sale }) {
  const [shown, setShown] = React.useState(null);
  const elRef = React.useRef(null);
  React.useEffect(() => {
    if (!sale) return;
    setShown(sale);
    const el = elRef.current;
    if (!el) return;
    // rAF entrance (pop + rise) so it animates even where CSS clock is frozen
    let start = null; const dur = 520;
    function frame(t) {
      if (start === null) start = t;
      const p = Math.min((t - start) / dur, 1);
      const k = p < 0.6 ? (p / 0.6) : 1; // ease pop
      const back = p < 0.6 ? 1 - Math.pow(1 - p / 0.6, 3) : 1;
      const scale = 0.7 + 0.34 * back - (p > 0.6 ? (p - 0.6) / 0.4 * 0.04 : 0);
      el.style.opacity = Math.min(1, k * 1.4);
      el.style.transform = 'translateX(-50%) translateY(' + (30 * (1 - back)).toFixed(1) + 'px) scale(' + scale.toFixed(3) + ')';
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
    // exit fade
    const out = setTimeout(() => {
      let s2 = null; const d2 = 400;
      function fout(t) {
        if (s2 === null) s2 = t;
        const p = Math.min((t - s2) / d2, 1);
        if (el) { el.style.opacity = String(1 - p); el.style.transform = 'translateX(-50%) translateY(' + (-18 * p).toFixed(1) + 'px) scale(' + (1 - 0.05 * p).toFixed(3) + ')'; }
        if (p < 1) requestAnimationFrame(fout); else setShown(null);
      }
      requestAnimationFrame(fout);
    }, 3000);
    return () => clearTimeout(out);
  }, [sale && sale.id]);
  if (!shown) return null;
  const fmt = 'R$ ' + shown.value.toLocaleString('pt-BR');
  return (
    <div ref={elRef} style={{ position: 'fixed', left: '50%', bottom: 40, zIndex: 120, transform: 'translateX(-50%) scale(.7)', opacity: 0, pointerEvents: 'none' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'linear-gradient(135deg,#15dba8,#27ae8f)', color: '#fff', padding: '16px 26px', borderRadius: 18, boxShadow: '0 24px 60px rgba(21,219,168,.5)' }}>
        <div style={{ height: 52, width: 52, borderRadius: 999, background: 'rgba(255,255,255,.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>💰</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', opacity: .9 }}>Venda realizada!</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 2 }}>
            <span style={{ fontFamily: "'Russo One',sans-serif", fontSize: 30, lineHeight: 1 }}>{fmt}</span>
            <span style={{ fontSize: 15, opacity: .95 }}>· {shown.name}</span>
          </div>
        </div>
        <div style={{ height: 44, width: 44, borderRadius: 999, background: 'rgba(255,255,255,.22)', color: '#fff', fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{shown.avatar}</div>
      </div>
    </div>
  );
}

window.TVMode = TVMode;
