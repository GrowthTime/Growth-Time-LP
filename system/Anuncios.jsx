// GT System — Mkt & Ads › Anúncios = TrafficDashboard do GTR: filtro de período · alertas · Top 3 Criativos · Visão Geral (7 KPIs) ·
// Funil de Conversão (Impressões → Cliques → Mensagens → Qualificados → Vendas) · Performance por Campanhas (Campanhas/Conjuntos/Criativos) · Tendência ao Longo do Tempo.
const adBRL = (n, d = 2) => 'R$ ' + Number(n).toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d });
const adCreatives = [
  { name: 'Coleção Verão · Carrossel', spend: 8200, leads: 720, sales: 118, roas: 5.6, grad: 'linear-gradient(160deg,#e3d5c8,#8f7461)' },
  { name: 'Grade Atacado · Vídeo 15s', spend: 6900, leads: 540, sales: 91, roas: 5.1, grad: 'linear-gradient(160deg,#cfd9d2,#5b7d6b)' },
  { name: 'Depoimento Lojista · Reels', spend: 5400, leads: 350, sales: 52, roas: 3.7, grad: 'linear-gradient(160deg,#d8d3e0,#6e6386)' },
];
const adTrend = [[1.1, 210, 14], [.9, 170, 11], [1.3, 240, 17], [1.2, 230, 15], [.8, 150, 9], [.6, 120, 7], [1.4, 260, 19], [1.5, 280, 22], [1.2, 220, 16], [1.1, 210, 14], [1.6, 300, 24], [1.3, 250, 18], [1.0, 190, 13], [.7, 130, 8]];
function Anuncios() {
  const M = K.M();
  const a = GT.ads;
  const [tab, setTab] = React.useState('campanhas');
  const Card = ({ children, style }) => <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 12, padding: M ? 16 : 20, boxShadow: '0 1px 2px rgba(0,0,0,.05)', ...style }}>{children}</div>;
  const Kpi = ({ title, value, delta, up, good = true }) => <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 12, padding: 16, boxShadow: '0 1px 2px rgba(0,0,0,.05)' }}><div style={{ fontSize: 12.5, color: '#737373' }}>{title}</div><div style={{ fontSize: 22, fontWeight: 700, marginTop: 6 }}>{value}</div><div style={{ fontSize: 11.5, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4, color: good ? '#16a34a' : '#dc2626' }}><Icon name={up ? 'trending-up' : 'trending-down'} size={12} />{delta} <span style={{ color: '#737373' }}>vs anterior</span></div></div>;
  const funnel = [['Impressões', 412000, '#0ea5e9'], ['Cliques', 18400, '#6366f1'], ['Mensagens', a.msgs, '#3fc58f'], ['Qualificados', a.leads, '#f59e0b'], ['Vendas', a.orders, '#a855f7']];
  const rows = tab === 'campanhas' ? GT.adCampaigns.map((c) => ({ n: c.name, i: c.spend, m: c.msgs, cpm: c.spend / c.msgs, o: c.sales, r: c.revenue }))
    : tab === 'conjuntos' ? [['Lojistas · CE/PE/BA · 25-45', 9800, 1710, 128], ['Lookalike compradoras 1%', 7400, 1290, 96], ['Remarketing · visitou a bio', 4300, 720, 51], ['Interesses · moda atacado', 3300, 490, 37]].map(([n, i, m, o]) => ({ n, i, m, cpm: i / m, o, r: o * 389 }))
    : adCreatives.map((c) => ({ n: c.name, i: c.spend, m: Math.round(c.leads * 2.2), cpm: c.spend / (c.leads * 2.2), o: c.sales, r: c.sales * 389 }));
  const W = 1040, H = 220, pl = 46, pr = 46, pt = 12, pb = 26;
  const x = (i) => pl + i * (W - pl - pr) / (adTrend.length - 1);
  const yI = (v) => pt + (H - pt - pb) * (1 - v / 2), yM = (v) => pt + (H - pt - pb) * (1 - v / 320);
  const line = (k, fy) => adTrend.map((r, i) => `${i ? 'L' : 'M'} ${x(i)} ${fy(r[k])}`).join(' ');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', background: 'rgba(245,245,245,.6)', borderRadius: 12, padding: 12 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 500, color: '#404040' }}><Icon name="filter" size={14} />Período:</span>
        <K.Select value="30" options={[['30', 'Últimos 30 Dias'], ['7', 'Últimos 7 Dias'], ['m', 'Este Mês'], ['h', 'Hoje'], ['c', 'Personalizado']]} width={160} />
        <span style={{ fontSize: 13, color: '#737373' }}>14/08/2026 - 12/09/2026</span>
        <K.Btn small icon="refresh-cw" style={{ marginLeft: 'auto' }}>Atualizar</K.Btn>
      </div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', background: 'rgba(245,158,11,.08)', border: '1px solid rgba(245,158,11,.3)', borderRadius: 12, padding: '12px 16px', fontSize: 13 }}><Icon name="alert-triangle" size={16} color="#d97706" style={{ flexShrink: 0 }} /><div><b>Custo por Mensagem Subindo</b> — a campanha "[MF · 2255] Depoimento Lojista · Reels" está 38% acima da média do período. Vale revisar o criativo ou o público.</div></div>
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 16, fontWeight: 600 }}>🏆 Top 3 Criativos</div>
        <div style={{ display: 'grid', gridTemplateColumns: M ? '1fr' : 'repeat(3,minmax(0,1fr))', gap: 12, marginTop: 14 }}>
          {adCreatives.map((c, i) => (
            <div key={c.name} style={{ border: '1px solid #e5e5e5', borderRadius: 10, padding: 12, display: 'flex', gap: 12 }}>
              <div style={{ height: 64, width: 64, borderRadius: 8, background: c.grad, flexShrink: 0, display: 'grid', placeItems: 'center' }}><Icon name="play" size={18} color="rgba(255,255,255,.85)" /></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>#{i + 1} {c.name}</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6, marginTop: 8 }}>{[['Invest.', adBRL(c.spend, 0)], ['Leads', c.leads], ['ROAS', c.roas.toLocaleString('pt-BR', { minimumFractionDigits: 1 }) + 'x']].map(([l, v]) => <div key={l} style={{ background: '#f5f5f5', borderRadius: 6, padding: '6px 8px' }}><div style={{ fontSize: 10, color: '#737373' }}>{l}</div><div style={{ fontSize: 13, fontWeight: 600 }}>{v}</div></div>)}</div>
                <div style={{ display: 'flex', gap: 10, marginTop: 8, fontSize: 11.5, color: '#2fae7c' }}><span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}><Icon name="sparkles" size={11} color="#2fae7c" />Ver análise detalhada do criativo</span></div>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <div>
        <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Visão Geral</div>
        <div style={{ display: 'grid', gridTemplateColumns: M ? '1fr 1fr' : 'repeat(3,minmax(0,1fr))', gap: 12 }}>
          <Kpi title="Investimento" value={adBRL(a.spend)} delta="8,2%" up good />
          <Kpi title="Mensagens" value={GT.fmt.num(a.msgs)} delta="14,1%" up />
          <Kpi title="Custo/Mensagem" value={adBRL(a.cpm)} delta="6,4%" up={false} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: M ? '1fr 1fr' : 'repeat(4,minmax(0,1fr))', gap: 12, marginTop: 12 }}>
          <Kpi title="Leads Qualificados" value={GT.fmt.num(a.leads)} delta="11,9%" up />
          <Kpi title="Pedidos" value={GT.fmt.num(a.orders)} delta="16,8%" up />
          <Kpi title="Custo/Pedido" value={adBRL(a.cpo)} delta="5,1%" up={false} />
          <Kpi title="ROAS" value={a.roas.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) + 'x'} delta="9,1%" up />
        </div>
      </div>
      <Card>
        <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 14 }}>Funil de Conversão</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {funnel.map(([n, v, c], i) => { const pct = v / funnel[0][1]; const w = Math.max(18, Math.pow(pct, .35) * 100); return (
            <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ width: 100, fontSize: 13, fontWeight: 500 }}>{n}</span>
              <div style={{ flex: 1 }}><div style={{ height: 34, width: w + '%', margin: '0 auto', borderRadius: 6, background: c, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600 }}>{GT.fmt.num(v)}</div></div>
              <span style={{ width: 70, textAlign: 'right', fontSize: 12, color: '#737373' }}>{i ? (v / funnel[i - 1][1] * 100).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + '%' : '100%'}</span>
            </div>); })}
        </div>
      </Card>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}><div style={{ fontSize: 16, fontWeight: 600 }}>Performance por Campanhas</div><K.Tabs size="sm" value={tab} onChange={setTab} tabs={[['campanhas', 'Campanhas'], ['conjuntos', 'Conjuntos'], ['criativos', 'Criativos']]} /></div>
        <div style={{ marginTop: 12 }}>
          <K.Table dense cols={[{ h: 'Nome', cell: (r) => <span style={{ fontWeight: 500 }}>{tab === 'campanhas' ? <><span style={{ fontFamily: 'ui-monospace, monospace', background: '#f5f5f5', padding: '1px 6px', borderRadius: 4, fontSize: 12 }}>{r.n.slice(0, r.n.indexOf(']') + 1)}</span>{r.n.slice(r.n.indexOf(']') + 1)}</> : r.n}</span> }, { h: 'Investimento ↕', align: 'right', cell: (r) => adBRL(r.i) }, { h: 'Mensagens ↕', align: 'right', cell: (r) => GT.fmt.num(r.m) }, { h: 'Custo/Msg ↕', align: 'right', cell: (r) => adBRL(r.cpm) }, { h: 'Pedidos', align: 'right', cell: (r) => r.o }, { h: 'Receita', align: 'right', cell: (r) => <span style={{ color: '#2fae7c', fontWeight: 600 }}>{adBRL(r.r, 0)}</span> }, { h: 'ROAS', align: 'right', cell: (r) => (r.r / r.i).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + 'x' }]} rows={rows} />
        </div>
        {tab === 'campanhas' && <div style={{ fontSize: 12, color: '#737373', marginTop: 10 }}>Os 4 dígitos no nome da campanha (ex.: <b>4321</b>) ligam o anúncio ao número de WhatsApp — é assim que a venda volta para o criativo certo.</div>}
      </Card>
      <Card>
        <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 10 }}>Tendência ao Longo do Tempo</div>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto' }}>
          {[0, .5, 1, 1.5, 2].map((v) => <g key={v}><line x1={pl} x2={W - pr} y1={yI(v)} y2={yI(v)} stroke="#e5e5e5" strokeDasharray="3 3" /><text x={pl - 6} y={yI(v) + 4} textAnchor="end" fontSize="10.5" fill="#737373" fontFamily="Inter, sans-serif">R${v}k</text></g>)}
          {[0, 80, 160, 240, 320].map((v) => <text key={v} x={W - pr + 6} y={yM(v) + 4} fontSize="10.5" fill="#737373" fontFamily="Inter, sans-serif">{v}</text>)}
          {adTrend.map((r, i) => <text key={i} x={x(i)} y={H - 8} textAnchor="middle" fontSize="10" fill="#737373" fontFamily="Inter, sans-serif">{['30/08', '31/08', '01/09', '02/09', '03/09', '04/09', '05/09', '06/09', '07/09', '08/09', '09/09', '10/09', '11/09', '12/09'][i]}</text>)}
          <path d={line(0, yI)} fill="none" stroke="#6366f1" strokeWidth="2" /><path d={line(1, yM)} fill="none" stroke="#3fc58f" strokeWidth="2" /><path d={adTrend.map((r, i) => `${i ? 'L' : 'M'} ${x(i)} ${yM(r[2] * 10)}`).join(' ')} fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 3" />
        </svg>
        <div style={{ display: 'flex', gap: 16, fontSize: 12, color: '#737373', marginTop: 6, flexWrap: 'wrap' }}>{[['Investimento:', '#6366f1'], ['Mensagens:', '#3fc58f'], ['Pedidos:', '#f59e0b']].map(([l, c]) => <span key={l} style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><span style={{ height: 3, width: 16, background: c, borderRadius: 2 }}></span>{l}</span>)}</div>
      </Card>
    </div>
  );
}
window.Anuncios = Anuncios;
