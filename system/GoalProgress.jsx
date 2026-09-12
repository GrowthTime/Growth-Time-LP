// GT System — Metas (CombinedGoalProgress): meta da equipe + progresso por vendedora em 3 degraus (bronze/prata/ouro).
// Dados vêm de GT.team e GT.sellers (só quem tem meta — suporte fica de fora).
const gpFmt = (v) => 'R$ ' + Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); // formatCurrency do real
const gpSellers = () => GT.sellers.filter((s) => s.goalOuro > 0);
// Projeção da vendedora no mesmo ritmo da equipe (GT.team.trend): % da meta hoje × fator de ritmo.
const gpProj = (s) => Math.round((s.month / s.goalOuro) * (GT.team.trend / 100) / (GT.team.month / GT.team.goalOuro) * 100);
const gpTrendColor = (t) => t >= 100 ? '#059669' : t >= 85 ? '#ca8a04' : '#dc2626';

function GpTieredProgress({ current, ouro, bronze, prata, height = 16 }) {
  const pct = ouro > 0 ? Math.min((current / ouro) * 100, 100) : 0;
  const bPct = bronze ? (bronze / ouro) * 100 : null;
  const pPct = prata ? (prata / ouro) * 100 : null;
  // cor do preenchimento = maior degrau alcançado; abaixo do bronze é NEUTRO (cinza claro), para bronze < prata < ouro lerem como escada crescente
  let fill;
  if (current >= ouro) fill = 'linear-gradient(90deg,#f3b315,#ffcf3f)';
  else if (!bronze && !prata) fill = 'var(--gradient-primary)'; // meta sem degraus: verde do sistema
  else if (prata && current >= prata) fill = 'linear-gradient(90deg,#8b95a3,#b8c0cc)';
  else if (bronze && current >= bronze) fill = 'linear-gradient(90deg,#bd6b2f,#d98a4f)';
  else fill = 'linear-gradient(90deg,#b8bfc9,#d3d8df)';
  return (
    <div style={{ position: 'relative', height, borderRadius: 999, background: '#eef0ef', overflow: 'hidden', boxShadow: 'inset 0 1px 2px rgba(0,0,0,.06)' }}>
      <div style={{ position: 'absolute', inset: 0, width: pct + '%', background: fill, borderRadius: 999, transition: 'width .4s' }}></div>
      {bPct != null && <span style={{ position: 'absolute', left: bPct + '%', top: 0, bottom: 0, width: 2, background: 'rgba(0,0,0,.18)' }} title="Bronze"></span>}
      {pPct != null && <span style={{ position: 'absolute', left: pPct + '%', top: 0, bottom: 0, width: 2, background: 'rgba(0,0,0,.18)' }} title="Prata"></span>}
    </div>
  );
}

function GoalProgress() {
  const M = K.M();
  const T = GT.team;
  const teamPct = Math.round((T.month / T.goalOuro) * 100);
  const perDay = Math.round((T.goalOuro - T.month) / T.remainingWorkDays);
  const sorted = [...gpSellers()].sort((a, b) => (b.month / b.goalOuro) - (a.month / a.goalOuro));
  const tierReached = (cur, s) => cur >= s.goalOuro ? ['Ouro', K.c.gold] : cur >= s.goalPrata ? ['Prata', '#8b95a3'] : cur >= s.goalBronze ? ['Bronze', K.c.bronze] : null;
  return (
    <div style={gpS.card}>
      {/* META DA EQUIPE */}
      <div style={{ paddingBottom: 22, marginBottom: 22, borderBottom: '1px solid #eee' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ padding: M ? 9 : 12, borderRadius: 12, background: 'rgba(63,197,143,.1)', flexShrink: 0 }}><Icon name="target" size={M ? 20 : 26} color="#3fc58f" /></div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
              <h3 style={{ fontSize: M ? 17 : 20, fontWeight: 700 }}>Meta da Equipe</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 2, color: '#737373', flexShrink: 0 }}>
                <Icon name="chevron-left" size={16} color="#d4d4d4" />
                <span style={{ fontSize: 13, fontWeight: 500, minWidth: 70, textAlign: 'center' }}>set 2026</span>
                <Icon name="chevron-right" size={16} color="#d4d4d4" />
              </div>
            </div>
            <p style={{ fontSize: 13, color: '#737373', marginTop: 1 }}>Progresso mensal consolidado</p>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
            <span style={{ fontSize: M ? 28 : 34, fontWeight: 700, color: '#121212', letterSpacing: '-.01em' }}>{gpFmt(T.month)}</span>
            <span style={{ fontSize: M ? 15 : 18, color: '#737373' }}>/ {gpFmt(T.goalOuro)}</span>
          </div>
          <GpTieredProgress current={T.month} ouro={T.goalOuro} bronze={T.goalBronze} prata={T.goalPrata} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: '#737373', flexWrap: 'wrap', gap: 6 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><K.Dot color={K.c.bronze} size={7} />Bronze {gpFmt(T.goalBronze)}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><K.Dot color={K.c.silver} size={7} />Prata {gpFmt(T.goalPrata)}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><K.Dot color={K.c.gold} size={7} />Ouro {gpFmt(T.goalOuro)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, flexWrap: 'wrap', gap: 8 }}>
            <span style={{ padding: '4px 12px', borderRadius: 999, fontWeight: 600, background: 'rgba(63,197,143,.1)', color: '#2fae7c' }}>{teamPct}% concluído</span>
            <span style={{ color: '#737373' }}>Faltam {gpFmt(T.goalOuro - T.month)}</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 2 }}>
            <span style={{ ...gpS.pill, background: 'rgba(16,185,129,.12)', color: '#059669' }}><Icon name="trending-up" size={13} />Projeção: {T.trend}%</span>
            <span style={{ ...gpS.pill, background: '#f3f3f3', color: '#737373' }}><Icon name="target" size={13} />{gpFmt(perDay)}/dia</span>
            <span style={{ ...gpS.pill, background: '#f3f3f3', color: '#737373' }}><Icon name="calendar" size={13} />{T.remainingWorkDays} dias úteis</span>
          </div>
        </div>
      </div>

      {/* POR VENDEDORA */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <h4 style={{ fontSize: 16, fontWeight: 600 }}>Progresso por Consultora</h4>
            <p style={{ fontSize: 12, color: '#737373' }}>Acompanhe cada meta individual</p>
          </div>
          <Icon name="target" size={18} color="#3fc58f" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {sorted.map((s, i) => {
            const pct = Math.round((s.month / s.goalOuro) * 100);
            const done = s.month >= s.goalOuro;
            const tr = tierReached(s.month, s);
            const proj = gpProj(s);
            return (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 8px', borderRadius: 10, background: i === 0 ? 'rgba(63,197,143,.05)' : 'transparent' }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <K.Avatar initials={s.initials} size={34} solid />
                  {i === 0 && <span style={{ position: 'absolute', top: -6, right: -6, height: 16, width: 16, borderRadius: 999, background: K.c.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff' }}><Icon name="crown" size={9} color="#fff" /></span>}
                </div>
                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'center' }}>
                    <span style={{ fontSize: 14, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</span>
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 500, color: '#737373', whiteSpace: 'nowrap' }}>{pct}%</span>
                  </div>
                  <GpTieredProgress current={s.month} ouro={s.goalOuro} bronze={s.goalBronze} prata={s.goalPrata} height={6} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#737373', gap: 8 }}>
                    <span style={{ whiteSpace: 'nowrap', display: 'flex', gap: 10 }}><span>{gpFmt(s.month)}</span>{!done && <span style={{ fontWeight: 600, color: gpTrendColor(proj) }}>Proj. {proj}%</span>}<span>{gpFmt(Math.max(0, s.goalOuro - s.month) / Math.max(1, GT.team.remainingWorkDays))}/dia</span></span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 10, whiteSpace: 'nowrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Icon name="trending-up" size={12} />{s.conv}% conv.</span>
                      {done && <span style={{ color: '#059669', fontWeight: 600 }}>Meta atingida</span>}
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

const gpS = {
  card: { background: '#fff', borderRadius: 14, border: '1px solid #eee', padding: 22, boxShadow: 'var(--shadow-sm)' },
  pill: { display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600, padding: '5px 11px', borderRadius: 999 },
};
window.GoalProgress = GoalProgress;
window.GpTieredProgress = GpTieredProgress;
