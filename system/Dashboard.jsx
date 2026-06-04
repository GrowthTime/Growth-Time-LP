// GT System — Dashboard screen (KPIs + Sales Funnel + chart + goal)
function KpiCard({ title, value, delta, up, ico, bg, col }) {
  return (
    <div style={{ background: bg, borderRadius: 14, padding: 18, boxShadow: 'var(--shadow-md)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 500, color: '#737373' }}>{title}</div>
          <div style={{ fontSize: 23, fontWeight: 700, marginTop: 6, letterSpacing: '-.01em' }}>{value}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 12, fontWeight: 500, color: up ? '#059669' : '#dc2626', marginTop: 6 }}>
            <Icon name={up ? 'arrow-up-right' : 'arrow-down-right'} size={13} />{delta} vs período anterior
          </div>
        </div>
        <div style={{ padding: 11, borderRadius: 12, background: col + '22' }}><Icon name={ico} size={19} color={col} /></div>
      </div>
    </div>
  );
}

function FunnelLevel({ title, value, grad, right, sub, radius }) {
  return (
    <div style={{ background: grad, color: '#fff', padding: '14px 18px', borderRadius: radius || 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 11, opacity: .85, fontWeight: 500 }}>{title}</div>
          <div style={{ fontSize: 23, fontWeight: 700 }}>{value}</div>
        </div>
        {right && <div style={{ textAlign: 'right' }}><div style={{ fontSize: 11, opacity: .85 }}>{right.l}</div><div style={{ fontSize: 16, fontWeight: 600 }}>{right.v}</div></div>}
      </div>
      {sub && <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid rgba(255,255,255,.2)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, fontSize: 11 }}>
        {sub.map((s, i) => <div key={i}><div style={{ opacity: .85 }}>{s.l}</div><div style={{ fontWeight: 600, fontSize: 13 }}>{s.v}</div></div>)}
      </div>}
    </div>
  );
}

function Sparkline() {
  // simple area chart svg
  const pts = [28, 32, 30, 38, 35, 44, 42, 52, 50, 60, 58, 70];
  const w = 480, h = 150, max = 80;
  const step = w / (pts.length - 1);
  const line = pts.map((p, i) => `${i * step},${h - (p / max) * h}`).join(' ');
  const area = `0,${h} ${line} ${w},${h}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: 150 }} preserveAspectRatio="none">
      <defs><linearGradient id="ar" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#38cc9c" stopOpacity="0.25" /><stop offset="100%" stopColor="#38cc9c" stopOpacity="0" /></linearGradient></defs>
      <polygon points={area} fill="url(#ar)" />
      <polyline points={line} fill="none" stroke="#38cc9c" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function Dashboard() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700 }}>Dashboard</h1>
          <p style={{ fontSize: 14, color: '#737373', marginTop: 2 }}>Funil de vendas e métricas de desempenho</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={ds.select}><Icon name="calendar" size={15} color="#737373" />Últimos 30 Dias<Icon name="chevron-down" size={15} color="#737373" /></div>
          <div style={ds.select}>Todas as Vendedoras<Icon name="chevron-down" size={15} color="#737373" /></div>
          <button style={ds.apply}><Icon name="check" size={15} />Aplicar</button>
        </div>
      </div>

      <div style={ds.period}>Exibindo dados de <b>01/05 – 30/05/2026</b> comparados com <b>01/04 – 30/04/2026</b></div>

      <div style={{ display: 'grid', gridTemplateColumns: (window.GT_MOBILE?'repeat(2,1fr)':'repeat(4,1fr)'), gap: 16 }}>
        <KpiCard title="Clientes Novos" value="1.284" delta="12,4%" up ico="users" bg="#ecfdf5" col="#059669" />
        <KpiCard title="Valor Total de Vendas" value="R$ 620 mil" delta="18,2%" up ico="dollar-sign" bg="#faf5ff" col="#9333ea" />
        <KpiCard title="Ticket Médio" value="R$ 483" delta="5,1%" up ico="receipt" bg="#eff6ff" col="#2563eb" />
        <KpiCard title="CPA · Custo p/ Aquisição" value="R$ 38,40" delta="7,8%" up={false} ico="target" bg="#f8fafc" col="#475569" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: (window.GT_MOBILE?'1fr':'1fr 1fr'), gap: 22 }}>
        {/* Sales funnel */}
        <div style={ds.card}>
          <div style={{ fontSize: 17, fontWeight: 600 }}>Funil de Vendas</div>
          <div style={{ fontSize: 13, color: '#737373', marginTop: 2, marginBottom: 14 }}>Jornada: Mensagens → Qualificação → Pedidos → Vendas</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <FunnelLevel title="Mensagens Recebidas" value="12.480" grad="linear-gradient(90deg,#06b6d4,#0891b2)" right={{ l: 'Topo do Funil', v: '' }} radius="10px 10px 0 0" />
            <FunnelLevel title="Leads Qualificados" value="1.850" grad="linear-gradient(90deg,#10b981,#059669)" right={{ l: 'Taxa Qualif.', v: '42%' }} sub={[{ l: 'Novos Qualificados', v: '1.642' }, { l: 'Não Identificados', v: '208' }]} />
            <FunnelLevel title="Pedidos Totais" value="312" grad="linear-gradient(90deg,#f59e0b,#d97706)" right={{ l: 'Conversão', v: '16,8%' }} sub={[{ l: 'Pedidos Novos', v: '241' }, { l: 'Pedidos Base', v: '71' }]} />
            <FunnelLevel title="Valor Total de Vendas" value="R$ 620 mil" grad="linear-gradient(90deg,#a855f7,#9333ea)" sub={[{ l: 'Vendas Novas', v: 'R$ 486 mil' }, { l: 'Vendas Base', v: 'R$ 134 mil' }]} radius="0 0 10px 10px" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 18, paddingTop: 16, borderTop: '1px solid #eee' }}>
            <div style={ds.hl}><div style={ds.hlLab}>Ticket Médio</div><div style={{ ...ds.hlVal, color: '#38cc9c' }}>R$ 483</div><div style={ds.hlSub}>por pedido</div></div>
            <div style={{ ...ds.hl, background: 'linear-gradient(135deg,rgba(16,185,129,.1),rgba(16,185,129,.04))', borderColor: 'rgba(16,185,129,.2)' }}><div style={ds.hlLab}>ROAS</div><div style={{ ...ds.hlVal, color: '#059669' }}>7,2x</div><div style={ds.hlSub}>retorno sobre investimento</div></div>
          </div>
        </div>

        {/* Chart + goal */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div style={ds.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ fontSize: 17, fontWeight: 600 }}>Evolução de Vendas</div>
              <div style={{ fontSize: 12, color: '#059669', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3 }}><Icon name="trending-up" size={14} />+18,2%</div>
            </div>
            <Sparkline />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#a3a3a3', marginTop: 4 }}><span>1 mai</span><span>10 mai</span><span>20 mai</span><span>30 mai</span></div>
          </div>
        </div>
      </div>

      {/* Metas — team goal + per-seller tiered progress */}
      <GoalProgress />

      {/* Métricas detalhadas do negócio */}
      <DetailedMetrics />
    </div>
  );
}

function VarBadge({ pct, up }) {
  const pos = up;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, fontSize: 12, fontWeight: 600, color: pos ? '#059669' : '#dc2626' }}>
      <Icon name={pos ? 'arrow-up-right' : 'arrow-down-right'} size={12} />{pct}
    </span>
  );
}

function DetailedMetrics() {
  const [open, setOpen] = React.useState(true);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <button onClick={() => setOpen(!open)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 14, fontWeight: 600, padding: '13px', borderRadius: 12, border: '1px dashed #cfcfcf', background: '#fff', cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}>
        <Icon name="bar-chart-3" size={16} color="#38cc9c" />{open ? 'Ocultar métricas detalhadas' : 'Ver métricas detalhadas'}<Icon name={open ? 'chevron-up' : 'chevron-down'} size={16} color="#737373" />
      </button>
      {open && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          {/* BLOCO B — Valor da Carteira */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}><Icon name="shopping-bag" size={19} color="#38cc9c" />Valor da Carteira</h3>
            {/* Receita média */}
            <div style={ds.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: 13, color: '#737373', fontWeight: 500 }}>Receita Média por Cliente Ativo</div>
                  <div style={{ fontSize: 26, fontWeight: 700, marginTop: 4 }}>R$ 2.924</div>
                  <div style={{ marginTop: 4 }}><VarBadge pct="8,2%" up /></div>
                  <div style={{ fontSize: 12, color: '#a3a3a3', marginTop: 4 }}>212 clientes ativos · R$ 620 mil total</div>
                </div>
                <div style={{ padding: 12, borderRadius: 12, background: 'rgba(56,204,156,.1)' }}><Icon name="users" size={20} color="#38cc9c" /></div>
              </div>
            </div>
            {/* Ticket médio novo vs recorrente */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div style={{ ...ds.card, border: '1px solid rgba(16,185,129,.3)' }}>
                <div style={{ fontSize: 13, color: '#737373', fontWeight: 500 }}>Ticket Médio — Novo</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#059669', marginTop: 4 }}>R$ 1.640</div>
                <div style={{ marginTop: 3 }}><VarBadge pct="5,4%" up /></div>
                <div style={{ fontSize: 12, color: '#a3a3a3', marginTop: 3 }}>148 pedidos · R$ 242 mil</div>
              </div>
              <div style={{ ...ds.card, border: '1px solid rgba(37,99,235,.3)' }}>
                <div style={{ fontSize: 13, color: '#737373', fontWeight: 500 }}>Ticket Médio — Recorrente</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#2563eb', marginTop: 4 }}>R$ 2.310</div>
                <div style={{ marginTop: 3 }}><VarBadge pct="3,1%" up /></div>
                <div style={{ fontSize: 12, color: '#a3a3a3', marginTop: 3 }}>164 pedidos · R$ 378 mil</div>
              </div>
            </div>
            {/* Crescimento de pedido recorrentes */}
            <div style={ds.card}>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>Crescimento de Pedido — Recorrentes</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                <div style={{ fontSize: 30, fontWeight: 700, color: '#059669' }}>+12,4%</div>
                <div style={{ fontSize: 13, color: '#737373' }}>crescimento médio<div style={{ marginTop: 2 }}><VarBadge pct="2,8pp" up /></div></div>
              </div>
              {[['Aumentaram (>+10%)', 96, 58, '#10b981'], ['Mantiveram (±10%)', 47, 28, '#f59e0b'], ['Diminuíram (<-10%)', 23, 14, '#ef4444']].map(([l, n, p, c]) => (
                <div key={l} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 5 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}><span style={{ height: 8, width: 8, borderRadius: 999, background: c }}></span>{l}</span>
                    <span style={{ fontWeight: 600 }}>{n} ({p}%)</span>
                  </div>
                  <div style={{ height: 8, borderRadius: 999, background: '#f0f0f0', overflow: 'hidden' }}><div style={{ height: '100%', width: p + '%', background: c, borderRadius: 999 }}></div></div>
                </div>
              ))}
            </div>
          </div>

          {/* BLOCO C — Retenção */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}><Icon name="heart" size={19} color="#38cc9c" />Retenção</h3>
            <div style={ds.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: 13, color: '#737373', fontWeight: 500 }}>Taxa de Recompra</div>
                  <div style={{ fontSize: 26, fontWeight: 700, marginTop: 4 }}>68%</div>
                  <div style={{ marginTop: 4 }}><VarBadge pct="4,5pp" up /></div>
                  <div style={{ fontSize: 12, color: '#a3a3a3', marginTop: 4 }}>142 voltaram de 209 do período anterior</div>
                </div>
                <div style={{ padding: 12, borderRadius: 12, background: 'rgba(245,158,11,.12)' }}><Icon name="repeat" size={20} color="#d97706" /></div>
              </div>
            </div>
            {/* Reativação */}
            <div style={ds.card}>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Taxa de Reativação</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 12, background: '#f7f8f8', borderRadius: 10, marginBottom: 12 }}>
                <div style={{ padding: 9, borderRadius: 10, background: 'rgba(16,185,129,.12)' }}><Icon name="user-check" size={19} color="#059669" /></div>
                <div><div style={{ fontSize: 24, fontWeight: 700 }}>31%</div><div style={{ fontSize: 12, color: '#a3a3a3' }}>29 reativados de 94 inativos</div></div>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead><tr style={{ textAlign: 'left', color: '#a3a3a3', fontSize: 11.5 }}><th style={{ padding: '6px 8px', fontWeight: 600 }}>Vendedora</th><th style={{ padding: '6px 8px', fontWeight: 600, textAlign: 'right' }}>Inativos</th><th style={{ padding: '6px 8px', fontWeight: 600, textAlign: 'right' }}>Reativados</th><th style={{ padding: '6px 8px', fontWeight: 600, textAlign: 'right' }}>Taxa %</th></tr></thead>
                <tbody>
                  {[['Marina Alves', 24, 11, 46], ['Ana Silva', 28, 9, 32], ['Júlia Costa', 22, 6, 27], ['Bia Ramos', 20, 3, 15]].map((r) => (
                    <tr key={r[0]} style={{ borderTop: '1px solid #f3f3f3' }}>
                      <td style={{ padding: '9px 8px', fontWeight: 500 }}>{r[0]}</td>
                      <td style={{ padding: '9px 8px', textAlign: 'right', color: '#a3a3a3' }}>{r[1]}</td>
                      <td style={{ padding: '9px 8px', textAlign: 'right' }}>{r[2]}</td>
                      <td style={{ padding: '9px 8px', textAlign: 'right', color: '#059669', fontWeight: 600 }}>{r[3]}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* LTV */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div style={{ ...ds.card, border: '1px solid rgba(147,51,234,.3)' }}>
                <div style={{ fontSize: 13, color: '#737373', fontWeight: 500 }}>LTV Médio</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#9333ea', marginTop: 4 }}>R$ 8.640</div>
                <div style={{ fontSize: 12, color: '#a3a3a3', marginTop: 8, lineHeight: 1.7 }}>Ticket médio: R$ 1.980<br />Frequência mensal: 1,18 pedidos/mês<br />Retenção média: 3,7 meses<br />148 clientes com 2+ pedidos</div>
              </div>
              <div style={{ ...ds.card, border: '1px solid rgba(16,185,129,.3)' }}>
                <div style={{ fontSize: 13, color: '#737373', fontWeight: 500 }}>Retorno por Cliente (LTV / CPA)</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#059669', marginTop: 4 }}>4,8x</div>
                <div style={{ fontSize: 12.5, color: '#737373', marginTop: 8 }}>Para cada <b>R$ 1</b> investido, o cliente gera <b style={{ color: '#171717' }}>R$ 4,80</b></div>
                <div style={{ fontSize: 12, color: '#a3a3a3', marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}><Icon name="dollar-sign" size={12} color="#a3a3a3" />CPA: R$ 38,40</div>
              </div>
            </div>
          </div>

          {/* BLOCO D — Safras (Cohort) */}
          <BlocoSafras />
        </div>
      )}
    </div>
  );
}

function BlocoSafras() {
  const [retention, setRetention] = React.useState(false);
  const months = ['Mai/25', 'Jun/25', 'Jul/25', 'Ago/25', 'Set/25', 'Out/25', 'Nov/25', 'Dez/25', 'Jan/26', 'Fev/26', 'Mar/26', 'Abr/26'];
  // build a triangular cohort matrix: row = safra, M0 highest then decays
  const rows = months.map((m, i) => {
    const clients = 18 + ((i * 7) % 26);
    const m0 = 28000 + ((i * 9301) % 64000); // base revenue at M0
    const maxOffset = months.length - 1 - i;
    const cells = [];
    let decay = 1;
    for (let o = 0; o <= maxOffset; o++) {
      if (o === 0) { cells.push({ rev: m0, ret: 100 }); decay = 1; continue; }
      // retention curve: sharp drop M0->M1, then stabilize
      decay = o === 1 ? 0.42 + ((i * 13) % 18) / 100 : decay * (0.78 + ((i + o) % 7) / 50);
      cells.push({ rev: Math.round(m0 * decay), ret: Math.round(100 * decay) });
    }
    return { month: m, clients, cells };
  });
  const maxOffset = months.length - 1;
  const maxRev = Math.max(...rows.flatMap((r) => r.cells.slice(1).map((c) => c.rev)), 1);
  const maxRet = Math.max(...rows.flatMap((r) => r.cells.slice(1).map((c) => c.ret)), 1);
  const fmtK = (v) => 'R$ ' + (v / 1000).toFixed(0) + 'k';
  function heat(val, max, isRet) {
    if (!val) return { background: 'transparent', color: '#cfcfcf' };
    const r = Math.min(val / max, 1);
    if (isRet) {
      if (r >= 0.7) return { background: '#059669', color: '#fff' };
      if (r >= 0.4) return { background: '#34d399', color: '#fff' };
      if (r >= 0.2) return { background: '#bbf7d0', color: '#065f46' };
      return { background: '#ecfdf5', color: '#047857' };
    }
    if (r >= 0.7) return { background: '#059669', color: '#fff' };
    if (r >= 0.4) return { background: '#34d399', color: '#fff' };
    if (r >= 0.15) return { background: '#fde68a', color: '#92400e' };
    return { background: '#fee2e2', color: '#b91c1c' };
  }
  // best cohort = highest revenue/client (accumulated)
  const best = rows.map((r) => ({ month: r.month, clients: r.clients, total: r.cells.reduce((a, c) => a + c.rev, 0) }))
    .map((r) => ({ ...r, perClient: Math.round(r.total / r.clients) }))
    .sort((a, b) => b.perClient - a.perClient)[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <h3 style={{ fontSize: 18, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}><Icon name="layers" size={19} color="#38cc9c" />Safras (Cohort)</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12.5 }}>
          <span style={{ fontWeight: retention ? 400 : 600, color: retention ? '#a3a3a3' : '#171717' }}>Receita</span>
          <button onClick={() => setRetention(!retention)} style={{ width: 42, height: 23, borderRadius: 999, border: 'none', background: retention ? '#38cc9c' : '#d4d4d4', cursor: 'pointer', padding: 2, display: 'flex', alignItems: 'center' }}>
            <span style={{ height: 19, width: 19, borderRadius: 999, background: '#fff', display: 'block', transform: retention ? 'translateX(19px)' : 'translateX(0)', transition: 'transform .2s', boxShadow: '0 1px 3px rgba(0,0,0,.2)' }}></span>
          </button>
          <span style={{ fontWeight: retention ? 600 : 400, color: retention ? '#171717' : '#a3a3a3' }}>Retenção %</span>
        </div>
      </div>

      <div style={ds.card}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ fontSize: 15, fontWeight: 600 }}>Tabela de Safras</div>
          <span style={{ fontSize: 12, color: '#a3a3a3', display: 'flex', alignItems: 'center', gap: 4 }}><Icon name="help-circle" size={13} color="#a3a3a3" />Clique numa célula para ver os clientes</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'separate', borderSpacing: 3, fontSize: 12, minWidth: 640 }}>
            <thead>
              <tr>
                <th style={{ padding: '6px 10px', textAlign: 'left', color: '#a3a3a3', fontWeight: 600, position: 'sticky', left: 0, background: '#fff' }}>Safra</th>
                {Array.from({ length: maxOffset + 1 }, (_, i) => <th key={i} style={{ padding: '6px 8px', textAlign: 'center', color: '#a3a3a3', fontWeight: 600, minWidth: 58 }}>M{i}</th>)}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.month}>
                  <td style={{ padding: '6px 10px', fontWeight: 600, whiteSpace: 'nowrap', position: 'sticky', left: 0, background: '#fff' }}>{r.month} <span style={{ color: '#a3a3a3', fontWeight: 400 }}>({r.clients})</span></td>
                  {Array.from({ length: maxOffset + 1 }, (_, o) => {
                    const cell = r.cells[o];
                    if (!cell) return <td key={o} style={{ padding: '7px 8px', textAlign: 'center', color: '#e0e0e0' }}>—</td>;
                    const val = retention ? cell.ret + '%' : fmtK(cell.rev);
                    const style = o === 0 ? { background: 'rgba(56,204,156,.12)', color: '#171717', fontWeight: 600 } : heat(retention ? cell.ret : cell.rev, retention ? maxRet : maxRev, retention);
                    return <td key={o} title={r.month + ' → M' + o} style={{ padding: '7px 8px', textAlign: 'center', borderRadius: 6, cursor: 'pointer', fontWeight: 500, ...style }}>{val}</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 12, fontSize: 11, color: '#a3a3a3', flexWrap: 'wrap' }}>
          <span>M0 = mês da 1ª compra</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>Menor<span style={{ display: 'inline-flex', gap: 2 }}><i style={{ width: 14, height: 12, borderRadius: 3, background: '#fee2e2', display: 'block' }}></i><i style={{ width: 14, height: 12, borderRadius: 3, background: '#fde68a', display: 'block' }}></i><i style={{ width: 14, height: 12, borderRadius: 3, background: '#34d399', display: 'block' }}></i><i style={{ width: 14, height: 12, borderRadius: 3, background: '#059669', display: 'block' }}></i></span>Maior</span>
        </div>
      </div>

      {/* Melhor Safra */}
      <div style={{ ...ds.card, border: '1px solid rgba(234,179,8,.3)', background: 'linear-gradient(135deg,rgba(234,179,8,.06),transparent)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          <div style={{ padding: 12, borderRadius: 12, background: 'rgba(234,179,8,.15)' }}><Icon name="trophy" size={20} color="#d97706" /></div>
          <div>
            <div style={{ fontSize: 13, color: '#737373', fontWeight: 500 }}>Melhor Safra dos últimos 12 meses</div>
            <div style={{ fontSize: 20, fontWeight: 700, marginTop: 2 }}>{best.month} <span style={{ fontSize: 13, fontWeight: 400, color: '#a3a3a3' }}>({best.clients} clientes)</span></div>
            <div style={{ fontSize: 13, color: '#737373', marginTop: 3 }}>R$ {best.perClient.toLocaleString('pt-BR')} receita/cliente · R$ {best.total.toLocaleString('pt-BR')} total</div>
          </div>
        </div>
      </div>
    </div>
  );
}

const ds = {
  select: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 500, padding: '9px 14px', borderRadius: 10, border: '1px solid #e5e5e5', background: '#fff', cursor: 'pointer' },
  apply: { display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, fontWeight: 600, padding: '9px 16px', borderRadius: 10, border: 'none', background: 'var(--gradient-primary)', color: '#fff', cursor: 'pointer', boxShadow: '0 2px 8px rgba(56,204,156,.3)', fontFamily: 'Inter,sans-serif' },
  period: { fontSize: 13, color: '#737373', textAlign: 'center', background: '#fff', border: '1px solid #eee', borderRadius: 12, padding: '12px 16px', boxShadow: 'var(--shadow-sm)' },
  card: { background: '#fff', borderRadius: 14, border: '1px solid #eee', padding: 22, boxShadow: 'var(--shadow-sm)' },
  hl: { background: 'linear-gradient(135deg,rgba(56,204,156,.1),rgba(56,204,156,.04))', border: '1px solid rgba(56,204,156,.2)', borderRadius: 12, padding: 16, textAlign: 'center' },
  hlLab: { fontSize: 12, color: '#737373', fontWeight: 500, marginBottom: 4 },
  hlVal: { fontSize: 23, fontWeight: 700 },
  hlSub: { fontSize: 11, color: '#737373', marginTop: 2 },
};
window.Dashboard = Dashboard;
