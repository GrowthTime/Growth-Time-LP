// GT System — Metas (Combined Goal Progress: team + per-seller tiered)
// Mirrors CombinedGoalProgress.tsx + TieredProgress (bronze/prata/ouro).
function fmtBRL(v) {
  if (v >= 1000) return 'R$ ' + (v / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 0 }) + ' mil';
  return 'R$ ' + v.toLocaleString('pt-BR');
}

function TieredProgress({ current, ouro, bronze, prata, height = 16 }) {
  const pct = ouro > 0 ? Math.min((current / ouro) * 100, 100) : 0;
  const bPct = bronze ? (bronze / ouro) * 100 : null;
  const pPct = prata ? (prata / ouro) * 100 : null;
  // fill color by highest tier reached
  let fill = 'linear-gradient(90deg,#bd6b2f,#d98a4f)'; // bronze
  if (current >= ouro) fill = 'linear-gradient(90deg,#f3b315,#ffcf3f)'; // ouro
  else if (prata && current >= prata) fill = 'linear-gradient(90deg,#8b95a3,#b8c0cc)'; // prata
  else if (bronze && current >= bronze) fill = 'linear-gradient(90deg,#bd6b2f,#d98a4f)';
  if (!bronze && !prata) fill = 'var(--gradient-primary)';
  return (
    <div style={{ position: 'relative', height, borderRadius: 999, background: '#eef0ef', overflow: 'hidden', boxShadow: 'inset 0 1px 2px rgba(0,0,0,.06)' }}>
      <div style={{ position: 'absolute', inset: 0, width: pct + '%', background: fill, borderRadius: 999, transition: 'width .4s' }}></div>
      {bPct != null && <span style={{ position: 'absolute', left: bPct + '%', top: 0, bottom: 0, width: 2, background: 'rgba(0,0,0,.18)' }} title="Bronze"></span>}
      {pPct != null && <span style={{ position: 'absolute', left: pPct + '%', top: 0, bottom: 0, width: 2, background: 'rgba(0,0,0,.18)' }} title="Prata"></span>}
    </div>
  );
}

const TEAM = { current: 620000, ouro: 700000, bronze: 500000, prata: 600000, trend: 102, daily: 20000, days: 4 };
const SELLERS = [
  { id: 1, name: 'Ana Silva', av: 'AS', cur: 176000, ouro: 180000, bronze: 130000, prata: 160000, conv: 16, trend: 103, daily: 1000, days: 4 },
  { id: 2, name: 'Marina Alves', av: 'MA', cur: 198000, ouro: 210000, bronze: 150000, prata: 185000, conv: 18, trend: 101, daily: 3000, days: 4 },
  { id: 3, name: 'Júlia Costa', av: 'JC', cur: 142000, ouro: 160000, bronze: 115000, prata: 140000, conv: 14, trend: 96, daily: 4500, days: 4 },
  { id: 4, name: 'Bia Ramos', av: 'BR', cur: 104000, ouro: 150000, bronze: 105000, prata: 130000, conv: 11, trend: 82, daily: 11500, days: 4 },
];

function GoalProgress() {
  const teamPct = Math.round((TEAM.current / TEAM.ouro) * 100);
  const sorted = [...SELLERS].sort((a, b) => (b.cur / b.ouro) - (a.cur / a.ouro));
  return (
    <div style={gp.card}>
      {/* TEAM */}
      <div style={{ paddingBottom: 24, marginBottom: 24, borderBottom: '1px solid #eee' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ padding: 12, borderRadius: 12, background: 'rgba(56,204,156,.1)' }}><Icon name="target" size={26} color="#38cc9c" /></div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: 20, fontWeight: 700 }}>Meta da Equipe</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 2, color: '#737373' }}>
                <Icon name="chevron-right" size={16} color="#d4d4d4" style={{ transform: 'rotate(180deg)' }} />
                <span style={{ fontSize: 13, fontWeight: 500, minWidth: 78, textAlign: 'center', textTransform: 'capitalize' }}>mai 2026</span>
                <Icon name="chevron-right" size={16} color="#d4d4d4" />
              </div>
            </div>
            <p style={{ fontSize: 13, color: '#737373', marginTop: 1 }}>Progresso mensal consolidado</p>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 34, fontWeight: 700, color: '#121212' }}>{fmtBRL(TEAM.current)}</span>
            <span style={{ fontSize: 17, color: '#737373' }}>/ {fmtBRL(TEAM.ouro)}</span>
          </div>
          <TieredProgress current={TEAM.current} ouro={TEAM.ouro} bronze={TEAM.bronze} prata={TEAM.prata} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
            <span style={{ padding: '4px 12px', borderRadius: 999, fontWeight: 600, background: 'rgba(56,204,156,.1)', color: '#27ae8f' }}>{teamPct}% concluído</span>
            <span style={{ color: '#737373' }}>Faltam {fmtBRL(TEAM.ouro - TEAM.current)}</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 2 }}>
            <span style={{ ...gp.pill, background: 'rgba(16,185,129,.12)', color: '#059669' }}><Icon name="trending-up" size={13} />Projeção: {TEAM.trend}%</span>
            <span style={{ ...gp.pill, background: '#f3f3f3', color: '#737373' }}><Icon name="target" size={13} />{fmtBRL(TEAM.daily)}/dia</span>
            <span style={{ ...gp.pill, background: '#f3f3f3', color: '#737373' }}><Icon name="calendar" size={13} />{TEAM.days} dias úteis</span>
          </div>
        </div>
      </div>

      {/* PER SELLER */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div>
            <h4 style={{ fontSize: 16, fontWeight: 600 }}>Progresso por Vendedora</h4>
            <p style={{ fontSize: 12, color: '#737373' }}>Acompanhe cada meta individual</p>
          </div>
          <Icon name="target" size={18} color="#38cc9c" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {sorted.map((s) => {
            const pct = Math.round((s.cur / s.ouro) * 100);
            const done = s.cur >= s.ouro;
            return (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 8, borderRadius: 10 }}>
                <div style={{ height: 34, width: 34, borderRadius: 999, background: '#38cc9c', color: '#fff', fontWeight: 600, fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{s.av}</div>
                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 500 }}>{s.name}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#737373' }}>{pct}%</span>
                  </div>
                  <TieredProgress current={s.cur} ouro={s.ouro} bronze={s.bronze} prata={s.prata} height={6} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#737373' }}>
                    <span>{fmtBRL(s.cur)}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Icon name="trending-up" size={12} />{s.conv}% conv.</span>
                      {done ? <span style={{ color: '#059669', fontWeight: 600 }}>Meta atingida</span> : <span style={{ fontWeight: 600, color: s.trend >= 100 ? '#059669' : s.trend >= 85 ? '#ca8a04' : '#dc2626' }}>Proj. {s.trend}%</span>}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const gp = {
  card: { background: '#fff', borderRadius: 14, border: '1px solid #eee', padding: 24, boxShadow: 'var(--shadow-sm)' },
  pill: { display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600, padding: '5px 11px', borderRadius: 999 },
};
window.GoalProgress = GoalProgress;
window.TieredProgress = TieredProgress;
