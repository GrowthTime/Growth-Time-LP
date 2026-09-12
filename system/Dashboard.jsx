// GT System — Dashboard. Estrutura = pages/Index.tsx do GTR: cabeçalho + filtros (Período · data · Consultora · Aplicar),
// "Exibindo dados de…", 4 KPIs em pastel (SummaryKPICards), Funil de Vendas (SalesFunnel) + Evolução de Vendas / Base Ativa (SalesChart),
// Meta da Equipe + Progresso por Consultora (CombinedGoalProgress) e Métricas detalhadas (Blocos B/C/D). Dados: GT.kpis / GT.team / GT.sellers.
const dbPeriod = { from: '13/08', to: '12/09/2026', prevFrom: '14/07', prevTo: '12/08/2026' };
const dbTicket = Math.round(GT.kpis.grossSales / GT.kpis.funnel.orders);
const dbLtv = 8680;   // ≈ ticket × 1,18 pedidos/mês × 3,7 meses
const dbCac = 1800;   // custo de aquisição por cliente (mídia + equipe) → LTV/CAC ≈ 4,8x
const dbBRL = (n, d = 2) => 'R$ ' + Number(n).toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d });

// ---- SummaryKPICards: card sem borda, gradiente pastel, ícone em quadrado suave ----
const dbKpiTone = {
  emerald: { bg: 'linear-gradient(135deg,#ecfdf5,#d1fae5)', ib: '#d1fae5', ic: '#059669' },
  purple: { bg: 'linear-gradient(135deg,#faf5ff,#f3e8ff)', ib: '#f3e8ff', ic: '#9333ea' },
  blue: { bg: 'linear-gradient(135deg,#eff6ff,#dbeafe)', ib: '#dbeafe', ic: '#2563eb' },
  slate: { bg: 'linear-gradient(135deg,#f8fafc,#f1f5f9)', ib: '#f1f5f9', ic: '#475569' },
};
function DbKpiCard({ title, value, pct, up, good = true, ico, tone }) {
  const t = dbKpiTone[tone];
  return (
    <div style={{ background: t.bg, borderRadius: 12, padding: 20, boxShadow: '0 10px 15px -3px rgba(0,0,0,.08), 0 4px 6px -4px rgba(0,0,0,.05)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: '#737373', lineHeight: 1.3 }}>{title}</div>
          <div style={{ fontSize: K.M() ? 22 : 24, fontWeight: 700, letterSpacing: '-.01em', lineHeight: 1.1 }}>{value}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 500, color: good ? '#059669' : '#dc2626' }}>
            <Icon name={up ? 'arrow-up-right' : 'arrow-down-right'} size={13} />{pct} vs período anterior
          </div>
        </div>
        <div style={{ padding: 12, borderRadius: 10, background: t.ib, flexShrink: 0 }}><Icon name={ico} size={20} color={t.ic} /></div>
      </div>
    </div>
  );
}

// ---- SalesFunnel: 5 blocos com gradiente (é assim no sistema real) ----
function DbFunnelBlock({ grad, radius, left, right, foot }) {
  return (
    <div style={{ background: grad, color: '#fff', padding: '14px 18px', borderRadius: radius || 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <div><div style={{ fontSize: 12, opacity: .9, fontWeight: 500 }}>{left.l}</div><div style={{ fontSize: 22, fontWeight: 700, marginTop: 2 }}>{left.v}</div></div>
        {right && <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {right.map((r, i) => <div key={i}><div style={{ fontSize: 11, opacity: .85 }}>{r.l}</div>{r.v !== '' && <div style={{ fontSize: 15, fontWeight: 600 }}>{r.v}</div>}</div>)}
        </div>}
      </div>
      {foot && <div style={{ marginTop: 10, paddingTop: 8, borderTop: '1px solid rgba(255,255,255,.25)', display: 'grid', gridTemplateColumns: foot.length > 1 ? '1fr 1fr' : '1fr', gap: 16, fontSize: 11.5 }}>
        {foot.map((f, i) => <div key={i} style={{ textAlign: foot.length > 1 && i === 1 ? 'left' : 'left' }}><span style={{ opacity: .85 }}>{f.l}{f.inline ? ': ' : ''}</span>{f.inline ? <b>{f.v}</b> : <div style={{ fontWeight: 600, fontSize: 13 }}>{f.v}</div>}</div>)}
      </div>}
    </div>
  );
}
function DbFunnel() {
  const kp = GT.kpis, f = kp.funnel;
  const roas = kp.grossSales / GT.ads.spend;
  return (
    <div style={dbS.card}>
      <div style={{ fontSize: 18, fontWeight: 600 }}>Funil de Vendas</div>
      <div style={{ fontSize: 13, color: '#737373', marginTop: 2, marginBottom: 14 }}>Jornada: Mensagens → Qualificação → Pedidos → Vendas</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <DbFunnelBlock grad="linear-gradient(90deg,#06b6d4,#0e7490)" radius="8px 8px 0 0" left={{ l: 'Mensagens Recebidas', v: GT.fmt.num(f.messages) }} right={[{ l: 'Topo do Funil', v: '' }]} foot={[{ l: 'Leads Novos', v: GT.fmt.num(f.newQualified), inline: true }]} />
        <DbFunnelBlock grad="linear-gradient(90deg,#10b981,#047857)" left={{ l: 'Leads Qualificados', v: GT.fmt.num(f.qualified) }} right={[{ l: 'Taxa Qualif. Novos', v: f.qualifiedRate + '%' }, { l: 'CPL', v: dbBRL(GT.ads.spend / f.qualified) }]} foot={[{ l: 'Novos Qualificados', v: GT.fmt.num(f.newQualified) }, { l: 'Não Identificados', v: GT.fmt.num(f.unidentified) }]} />
        <DbFunnelBlock grad="linear-gradient(90deg,#f59e0b,#d97706)" left={{ l: 'Pedidos Totais', v: GT.fmt.num(f.orders) }} right={[{ l: 'Taxa Conversão', v: GT.fmt.pct(f.conversion) + '' }, { l: 'Conversão Novos', v: GT.fmt.pct(f.newOrders / f.newQualified * 100) }]} foot={[{ l: 'Pedidos Novos', v: GT.fmt.num(f.newOrders) }, { l: 'Pedidos Base', v: GT.fmt.num(f.baseOrders) }]} />
        <DbFunnelBlock grad="linear-gradient(90deg,#f97316,#ea580c)" left={{ l: 'Custo por Pedido', v: dbBRL(GT.ads.spend / f.orders) }} right={[{ l: 'Investimento', v: dbBRL(GT.ads.spend) }]} foot={[{ l: 'CPA (Custo por Aquisição via Tráfego)', v: dbBRL(kp.cpa), inline: true }]} />
        <div style={{ background: 'linear-gradient(90deg,#a855f7,#7e22ce)', color: '#fff', padding: '14px 18px', borderRadius: '0 0 8px 8px', textAlign: 'center' }}>
          <div style={{ fontSize: 12, opacity: .9, fontWeight: 500 }}>Valor Total de Vendas</div>
          <div style={{ fontSize: 24, fontWeight: 700, marginTop: 2 }}>{dbBRL(kp.grossSales)}</div>
          <div style={{ marginTop: 10, paddingTop: 8, borderTop: '1px solid rgba(255,255,255,.25)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, fontSize: 11.5 }}>
            <div><div style={{ opacity: .85 }}>Vendas Novas</div><div style={{ fontWeight: 600, fontSize: 13 }}>{dbBRL(f.newSales)}</div></div>
            <div><div style={{ opacity: .85 }}>Vendas Base</div><div style={{ fontWeight: 600, fontSize: 13 }}>{dbBRL(f.baseSales)}</div></div>
          </div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 20, paddingTop: 16, borderTop: '1px solid #e5e5e5' }}>
        <div style={dbS.hl}><div style={dbS.hlLab}>Ticket Médio</div><div style={dbS.hlVal}>{dbBRL(kp.ticket)}</div><div style={dbS.hlSub}>por pedido</div></div>
        <div style={dbS.hl}><div style={dbS.hlLab}>ROAS</div><div style={dbS.hlVal}>{roas.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}x</div><div style={dbS.hlSub}>retorno sobre investimento</div></div>
      </div>
    </div>
  );
}

// ---- SalesChart: Evolução de Vendas (área, 7 dias) + Base Ativa (barras empilhadas, 12 meses) ----
const dbSales7 = [{ d: 'Sáb', v: 18400 }, { d: 'Dom', v: 6200 }, { d: 'Seg', v: 27900 }, { d: 'Ter', v: 31700 }, { d: 'Qua', v: 24600 }, { d: 'Qui', v: 29300 }, { d: 'Sex', v: 33100 }];
const dbBase12 = [
  { m: 'Out/25', c: 168, n: 22, r: 6 }, { m: 'Nov/25', c: 176, n: 26, r: 8 }, { m: 'Dez/25', c: 190, n: 31, r: 5 }, { m: 'Jan/26', c: 181, n: 18, r: 9 },
  { m: 'Fev/26', c: 187, n: 21, r: 7 }, { m: 'Mar/26', c: 195, n: 27, r: 6 }, { m: 'Abr/26', c: 203, n: 24, r: 10 }, { m: 'Mai/26', c: 208, n: 29, r: 8 },
  { m: 'Jun/26', c: 214, n: 25, r: 7 }, { m: 'Jul/26', c: 219, n: 30, r: 9 }, { m: 'Ago/26', c: 226, n: 28, r: 11 }, { m: 'Set/26', c: 231, n: 34, r: 8 },
];
function DbAreaChart({ data, height = 230 }) {
  const M = K.M();
  const W = 520, H = height, padL = M ? 34 : 56, padR = 8, padT = 10, padB = 26;
  const max = 40000, steps = [0, 10000, 20000, 30000, 40000];
  const x = (i) => padL + (i * (W - padL - padR)) / (data.length - 1);
  const y = (v) => padT + (H - padT - padB) * (1 - v / max);
  const pts = data.map((p, i) => [x(i), y(p.v)]);
  // curva monotone simples (bezier por ponto médio)
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) { const [x0, y0] = pts[i - 1], [x1, y1] = pts[i]; const cx = (x0 + x1) / 2; d += ` C ${cx} ${y0}, ${cx} ${y1}, ${x1} ${y1}`; }
  const area = d + ` L ${pts[pts.length - 1][0]} ${y(0)} L ${pts[0][0]} ${y(0)} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }} role="img" aria-label="Evolução de vendas">
      <defs><linearGradient id="dbGradVendas" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3fc58f" stopOpacity=".3" /><stop offset="95%" stopColor="#3fc58f" stopOpacity="0" /></linearGradient></defs>
      {steps.map((s) => <g key={s}><line x1={padL} x2={W - padR} y1={y(s)} y2={y(s)} stroke="#e5e5e5" strokeDasharray="3 3" /><text x={padL - 8} y={y(s) + 4} textAnchor="end" fontSize="11" fill="#737373" fontFamily="Inter, sans-serif">{M ? (s / 1000) + 'k' : 'R$' + (s / 1000) + 'k'}</text></g>)}
      {data.map((p, i) => <g key={i}><line x1={x(i)} x2={x(i)} y1={padT} y2={H - padB} stroke="#e5e5e5" strokeDasharray="3 3" /><text x={x(i)} y={H - 8} textAnchor="middle" fontSize="11" fill="#737373" fontFamily="Inter, sans-serif">{p.d}</text></g>)}
      <path d={area} fill="url(#dbGradVendas)" />
      <path d={d} fill="none" stroke="#3fc58f" strokeWidth="2" />
    </svg>
  );
}
function DbBaseChart({ data, height = 200 }) {
  const W = 520, H = height, padL = 34, padR = 8, padT = 8, padB = 26, max = 300;
  const bw = (W - padL - padR) / data.length, barW = bw * .62;
  const y = (v) => padT + (H - padT - padB) * (1 - v / max);
  const series = [['c', '#10b981'], ['n', '#06b6d4'], ['r', '#f97316']];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }} role="img" aria-label="Base ativa por mês">
      {[0, 100, 200, 300].map((s) => <g key={s}><line x1={padL} x2={W - padR} y1={y(s)} y2={y(s)} stroke="#e5e5e5" strokeDasharray="3 3" /><text x={padL - 6} y={y(s) + 4} textAnchor="end" fontSize="10.5" fill="#737373" fontFamily="Inter, sans-serif">{s}</text></g>)}
      {data.map((p, i) => { let acc = 0; const cx = padL + i * bw + bw / 2; return (
        <g key={p.m}>
          {series.map(([k, col], si) => { const v = p[k]; const y1 = y(acc + v), y0 = y(acc); acc += v; return <rect key={k} x={cx - barW / 2} y={y1} width={barW} height={Math.max(0, y0 - y1)} fill={col} rx={si === series.length - 1 ? 2 : 0} />; })}
          <text x={cx} y={H - 8} textAnchor="middle" fontSize="9.5" fill="#737373" fontFamily="Inter, sans-serif">{p.m}</text>
        </g>); })}
    </svg>
  );
}
function DbSalesChart() {
  const M = K.M();
  const last = dbBase12[dbBase12.length - 1], first = dbBase12[0];
  const tot = (p) => p.c + p.n + p.r;
  const growth = tot(last) - tot(first);
  return (
    <div style={dbS.card}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
        <div><div style={{ fontSize: 18, fontWeight: 600 }}>Evolução de Vendas</div><div style={{ fontSize: 13, color: '#737373' }}>Últimos 7 dias</div></div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <K.Select value="7" options={[['7', '7 dias'], ['30', '30 dias'], ['c', 'Personalizado']]} width={M ? 100 : 140} />
          {!M && <div style={{ height: 40, width: 40, borderRadius: 8, border: '1px solid #e5e5e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="calendar" size={16} color="#171717" /></div>}
        </div>
      </div>
      <div style={{ marginTop: 14 }}><DbAreaChart data={dbSales7} height={M ? 200 : 232} /></div>
      <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #e5e5e5' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
            <Icon name="users" size={16} color="#10b981" />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 600 }}>Base Ativa</div>
              <div style={{ fontSize: 12, color: '#737373', display: 'flex', gap: 6, flexWrap: 'wrap' }}><span style={{ color: '#16a34a', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 2 }}><Icon name="trending-up" size={12} color="#16a34a" />+{growth}</span><span style={{ color: 'rgba(22,163,74,.7)', fontWeight: 500 }}>(+{Math.round(growth / tot(first) * 100)}%)</span><span>· clientes ativos no fim de cada mês</span></div>
            </div>
          </div>
          <K.Select value="12" options={[['6', '6 meses'], ['12', '12 meses'], ['24', '24 meses']]} width={M ? 112 : 130} />
        </div>
        <DbBaseChart data={dbBase12} height={M ? 170 : 200} />
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 8, fontSize: 11.5, color: '#737373' }}>
          {[['Continuaram ativos', '#10b981'], ['Novos', '#06b6d4'], ['Reativados', '#f97316']].map(([l, c]) => <span key={l} style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><span style={{ height: 8, width: 8, borderRadius: 2, background: c }}></span>{l}</span>)}
          <span style={{ marginLeft: 'auto' }}>{tot(last)} ativos em {last.m}</span>
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const M = K.M();
  const kp = GT.kpis;
  const [showDetails, setShowDetails] = React.useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: M ? 16 : 24 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: M ? 20 : 24, fontWeight: 700 }}>Dashboard</h1>
            <p style={{ fontSize: M ? 14 : 16, color: '#737373', marginTop: 2 }}>Funil de vendas e métricas de desempenho</p>
          </div>
          {M ? <div style={{ height: 40, width: 40, borderRadius: 8, border: '1px solid #e5e5e5', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon name="download" size={16} /></div> : <K.Btn icon="download">Exportar</K.Btn>}
        </div>
        {/* Filtros */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: M ? 12 : 16, padding: 16, background: 'rgba(245,245,245,.6)', borderRadius: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 500, color: '#737373' }}>Período:</span>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <K.Select value="30" options={[['30', 'Últimos 30 Dias'], ['7', 'Últimos 7 Dias'], ['m', 'Este Mês'], ['h', 'Hoje']]} width={140} />
              <K.Btn icon="calendar">{dbPeriod.from} - {dbPeriod.to}</K.Btn>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 500, color: '#737373' }}>Consultora:</span>
            <K.Select value="all" options={[['all', 'Todas as Consultoras'], ...GT.sellers.filter((s) => s.role !== 'Suporte').map((s) => [s.id, s.name])]} width={180} />
          </div>
          <K.Btn primary icon="check">Aplicar</K.Btn>
        </div>
      </div>

      <div style={{ ...dbS.card, padding: '14px 16px', textAlign: 'center', fontSize: 14, color: '#737373' }}>Exibindo dados de <b style={{ color: '#171717', fontWeight: 500 }}>{dbPeriod.from} - {dbPeriod.to}</b>{M ? <span style={{ display: 'block', margin: '4px 0' }}>vs</span> : ' comparados com '}<b style={{ color: '#171717', fontWeight: 500 }}>{dbPeriod.prevFrom} - {dbPeriod.prevTo}</b></div>

      {/* SummaryKPICards */}
      <div style={{ display: 'grid', gridTemplateColumns: M ? 'minmax(0,1fr)' : 'repeat(4,minmax(0,1fr))', gap: 16 }}>
        <DbKpiCard title="Clientes Novos" value={GT.fmt.num(kp.newClients)} pct="12,4%" up ico="users" tone="emerald" />
        <DbKpiCard title="Valor Total de Vendas" value={dbBRL(kp.grossSales)} pct="18,2%" up ico="dollar-sign" tone="purple" />
        <DbKpiCard title="Ticket Médio" value={dbBRL(kp.ticket)} pct="5,1%" up ico="receipt" tone="blue" />
        <DbKpiCard title="CPA (Custo por Aquisição via Tráfego)" value={dbBRL(kp.cpa)} pct="7,8%" up={false} good ico="trending-up" tone="slate" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: M ? 'minmax(0,1fr)' : 'repeat(2,minmax(0,1fr))', gap: 24 }}>
        <DbFunnel />
        <DbSalesChart />
      </div>

      {/* CombinedGoalProgress */}
      <GoalProgress />

      {/* Métricas detalhadas (Blocos B, C, D) — recolhidas por padrão, como no real */}
      <button onClick={() => setShowDetails(!showDetails)} style={{ ...dbS.card, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 14, fontSize: 14, fontWeight: 500, color: '#171717', cursor: 'pointer', fontFamily: K.font }}>
        <Icon name="bar-chart-3" size={16} />{showDetails ? 'Ocultar métricas detalhadas' : 'Ver métricas detalhadas'}<Icon name={showDetails ? 'chevron-up' : 'chevron-down'} size={16} />
      </button>
      {showDetails && <DbDetailedMetrics />}
    </div>
  );
}

function DbVarBadge({ pct, up }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, fontSize: 12, fontWeight: 600, color: up ? '#059669' : '#dc2626' }}>
      <Icon name={up ? 'arrow-up-right' : 'arrow-down-right'} size={12} />{pct}
    </span>
  );
}

function DbDetailedMetrics() {
  const M = K.M();
  const [open, setOpen] = React.useState(true);
  const fn = GT.kpis.funnel; // tickets Novo/Recorrente derivados do MESMO funil do card acima (241 · R$ 486 mil / 71 · R$ 134 mil)
  const reat = [['marina', 24, 11], ['ana', 28, 9], ['julia', 22, 6], ['paula', 18, 5], ['bia', 20, 3]];
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
            <div style={dbS.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: 13, color: '#737373', fontWeight: 500 }}>Receita Média por Cliente Ativo</div>
                  <div style={{ fontSize: 26, fontWeight: 700, marginTop: 4 }}>R$ 2.924</div>
                  <div style={{ marginTop: 4 }}><DbVarBadge pct="8,2%" up /></div>
                  <div style={{ fontSize: 12, color: '#a3a3a3', marginTop: 4 }}>212 clientes ativos · {GT.fmt.brlK(GT.kpis.grossSales)} total</div>
                </div>
                <div style={{ padding: 12, borderRadius: 12, background: 'rgba(56,204,156,.1)' }}><Icon name="users" size={20} color="#38cc9c" /></div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div style={{ ...dbS.card, border: '1px solid rgba(16,185,129,.3)' }}>
                <div style={{ fontSize: 13, color: '#737373', fontWeight: 500 }}>Ticket Médio — Novo</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#059669', marginTop: 4 }}>{GT.fmt.brl(fn.newSales / fn.newOrders)}</div>
                <div style={{ marginTop: 3 }}><DbVarBadge pct="5,4%" up /></div>
                <div style={{ fontSize: 12, color: '#a3a3a3', marginTop: 3 }}>{fn.newOrders} pedidos · {GT.fmt.brlK(fn.newSales)}</div>
              </div>
              <div style={{ ...dbS.card, border: '1px solid rgba(37,99,235,.3)' }}>
                <div style={{ fontSize: 13, color: '#737373', fontWeight: 500 }}>Ticket Médio — Recorrente</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#2563eb', marginTop: 4 }}>{GT.fmt.brl(fn.baseSales / fn.baseOrders)}</div>
                <div style={{ marginTop: 3 }}><DbVarBadge pct="3,1%" up /></div>
                <div style={{ fontSize: 12, color: '#a3a3a3', marginTop: 3 }}>{fn.baseOrders} pedidos · {GT.fmt.brlK(fn.baseSales)}</div>
              </div>
            </div>
            <div style={dbS.card}>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>Crescimento de Pedido — Recorrentes</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                <div style={{ fontSize: 30, fontWeight: 700, color: '#059669' }}>+12,4%</div>
                <div style={{ fontSize: 13, color: '#737373' }}>crescimento médio<div style={{ marginTop: 2 }}><DbVarBadge pct="2,8pp" up /></div></div>
              </div>
              {[['Aumentaram (>+10%)', 96, 58, '#10b981'], ['Mantiveram (±10%)', 47, 28, '#f59e0b'], ['Diminuíram (<-10%)', 23, 14, '#ef4444']].map(([l, n, p, c]) => (
                <div key={l} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 5 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}><span style={{ height: 8, width: 8, borderRadius: 999, background: c }}></span>{l}</span>
                    <span style={{ fontWeight: 600 }}>{n} ({p}%)</span>
                  </div>
                  <K.Progress value={p} color={c} />
                </div>
              ))}
            </div>
          </div>

          {/* BLOCO C — Retenção */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}><Icon name="heart" size={19} color="#38cc9c" />Retenção</h3>
            <div style={dbS.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: 13, color: '#737373', fontWeight: 500 }}>Taxa de Recompra</div>
                  <div style={{ fontSize: 26, fontWeight: 700, marginTop: 4 }}>68%</div>
                  <div style={{ marginTop: 4 }}><DbVarBadge pct="4,5pp" up /></div>
                  <div style={{ fontSize: 12, color: '#a3a3a3', marginTop: 4 }}>142 voltaram de 209 do período anterior</div>
                </div>
                <div style={{ padding: 12, borderRadius: 12, background: 'rgba(245,158,11,.12)' }}><Icon name="repeat" size={20} color="#d97706" /></div>
              </div>
            </div>
            <div style={dbS.card}>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Taxa de Reativação</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 12, background: '#f7f8f8', borderRadius: 10, marginBottom: 12 }}>
                <div style={{ padding: 9, borderRadius: 10, background: 'rgba(16,185,129,.12)' }}><Icon name="user-check" size={19} color="#059669" /></div>
                <div><div style={{ fontSize: 24, fontWeight: 700 }}>30%</div><div style={{ fontSize: 12, color: '#a3a3a3' }}>34 reativados de 112 inativos</div></div>
              </div>
              <K.Table dense cols={M ? [
                { h: 'Vendedora', cell: (r) => <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><K.SellerAvatar id={r[0]} size={22} />{GT.seller(r[0]).name.split(' ')[0]}</span> },
                { h: 'Reativ./Inativos', align: 'right', cell: (r) => <span>{r[2]}<span style={{ color: '#a3a3a3' }}>/{r[1]}</span></span> },
                { h: 'Taxa %', align: 'right', cell: (r) => <span style={{ color: '#059669', fontWeight: 600 }}>{Math.round((r[2] / r[1]) * 100)}%</span> },
              ] : [
                { h: 'Vendedora', cell: (r) => <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><K.SellerAvatar id={r[0]} size={24} />{GT.seller(r[0]).name}</span> },
                { h: 'Inativos', align: 'right', cell: (r) => <span style={{ color: '#a3a3a3' }}>{r[1]}</span> },
                { h: 'Reativados', align: 'right', cell: (r) => r[2] },
                { h: 'Taxa %', align: 'right', cell: (r) => <span style={{ color: '#059669', fontWeight: 600 }}>{Math.round((r[2] / r[1]) * 100)}%</span> },
              ]} rows={reat} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: M ? 'minmax(0,1fr)' : 'repeat(2,minmax(0,1fr))', gap: 14 }}>
              <div style={{ ...dbS.card, border: '1px solid rgba(147,51,234,.3)' }}>
                <div style={{ fontSize: 13, color: '#737373', fontWeight: 500 }}>LTV Médio</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#9333ea', marginTop: 4 }}>{GT.fmt.brl(dbLtv)}</div>
                <div style={{ fontSize: 12, color: '#a3a3a3', marginTop: 8, lineHeight: 1.7 }}>Ticket médio: {GT.fmt.brl(dbTicket)}<br />Frequência mensal: 1,18 pedidos/mês<br />Retenção média: 3,7 meses<br />148 clientes com 2+ pedidos</div>
              </div>
              <div style={{ ...dbS.card, border: '1px solid rgba(16,185,129,.3)' }}>
                <div style={{ fontSize: 13, color: '#737373', fontWeight: 500 }}>Retorno por Cliente (LTV / CAC)</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#059669', marginTop: 4 }}>{GT.fmt.x(dbLtv / dbCac)}</div>
                <div style={{ fontSize: 12.5, color: '#737373', marginTop: 8 }}>Para cada <b>R$ 1</b> gasto para conquistar um cliente, ele devolve <b style={{ color: '#171717' }}>{GT.fmt.brl(dbLtv / dbCac, 2)}</b></div>
                <div style={{ fontSize: 12, color: '#a3a3a3', marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}><Icon name="dollar-sign" size={12} color="#a3a3a3" />CAC: {GT.fmt.brl(dbCac)} por cliente novo (mídia + equipe)</div>
              </div>
            </div>
          </div>

          {/* BLOCO D — Safras (Cohort) */}
          <DbSafras />
        </div>
      )}
    </div>
  );
}

function DbSafras() {
  const [retention, setRetention] = React.useState(false);
  const months = ['Set/25', 'Out/25', 'Nov/25', 'Dez/25', 'Jan/26', 'Fev/26', 'Mar/26', 'Abr/26', 'Mai/26', 'Jun/26', 'Jul/26', 'Ago/26'];
  // matriz triangular de safras: linha = safra, M0 mais alto e decaindo (valores determinísticos)
  const rows = months.map((m, i) => {
    const clients = 18 + ((i * 7) % 26);
    const m0 = 28000 + ((i * 9301) % 64000);
    const maxOffset = months.length - 1 - i;
    const cells = [];
    let decay = 1;
    for (let o = 0; o <= maxOffset; o++) {
      if (o === 0) { cells.push({ rev: m0, ret: 100 }); decay = 1; continue; }
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
  const best = rows.map((r) => ({ month: r.month, clients: r.clients, total: r.cells.reduce((a, c) => a + c.rev, 0) }))
    .map((r) => ({ ...r, perClient: Math.round(r.total / r.clients) }))
    .sort((a, b) => b.perClient - a.perClient)[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <h3 style={{ fontSize: 18, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}><Icon name="layers" size={19} color="#38cc9c" />Safras (Cohort)</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12.5 }}>
          <span style={{ fontWeight: retention ? 400 : 600, color: retention ? '#a3a3a3' : '#171717' }}>Receita</span>
          <K.Toggle on={retention} onChange={setRetention} />
          <span style={{ fontWeight: retention ? 600 : 400, color: retention ? '#171717' : '#a3a3a3' }}>Retenção %</span>
        </div>
      </div>

      <div style={dbS.card}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
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
      <div style={{ ...dbS.card, border: '1px solid rgba(234,179,8,.3)', background: 'linear-gradient(135deg,rgba(234,179,8,.06),transparent)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          <div style={{ padding: 12, borderRadius: 12, background: 'rgba(234,179,8,.15)' }}><Icon name="trophy" size={20} color="#d97706" /></div>
          <div>
            <div style={{ fontSize: 13, color: '#737373', fontWeight: 500 }}>Melhor Safra dos últimos 12 meses</div>
            <div style={{ fontSize: 20, fontWeight: 700, marginTop: 2 }}>{best.month} <span style={{ fontSize: 13, fontWeight: 400, color: '#a3a3a3' }}>({best.clients} clientes)</span></div>
            <div style={{ fontSize: 13, color: '#737373', marginTop: 3 }}>{GT.fmt.brl(best.perClient)} receita/cliente · {GT.fmt.brl(best.total)} total</div>
          </div>
        </div>
      </div>
    </div>
  );
}

const dbS = {
  card: { background: '#fff', borderRadius: 12, border: '1px solid #e5e5e5', padding: 24, boxShadow: '0 1px 2px rgba(0,0,0,.05)' },
  hl: { background: 'rgba(63,197,143,.08)', border: '1px solid rgba(63,197,143,.2)', borderRadius: 10, padding: '14px 12px', textAlign: 'center' },
  hlLab: { fontSize: 12, color: '#737373' },
  hlVal: { fontSize: 22, fontWeight: 700, color: '#2fae7c', marginTop: 4 },
  hlSub: { fontSize: 11.5, color: '#737373', marginTop: 2 },
};
window.Dashboard = Dashboard;
