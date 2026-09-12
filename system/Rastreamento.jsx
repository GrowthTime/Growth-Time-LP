// GT System — Mkt & Ads › Rastreamento = TrackingArea do GTR: sub-abas Origens (OriginsDashboard) · Links (LinksList) · Indicações (ReferrersList).
const rtBRL = (n, d = 0) => 'R$ ' + Number(n).toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d });
const rtOrigins = [
  { k: 'ads', label: 'Anúncio (Meta)', clicks: 4820, leads: 1610, gar: 1240, prov: 370, forms: 0, sales: 118, rev: 45900 },
  { k: 'bio', label: 'Link da bio', clicks: 1870, leads: 1104, gar: 980, prov: 124, forms: 212, sales: 38, rev: 14780 },
  { k: 'story', label: 'Story · cupom MF10', clicks: 960, leads: 402, gar: 360, prov: 42, forms: 0, sales: 21, rev: 8170 },
  { k: 'ref', label: 'Indicação', clicks: 112, leads: 64, gar: 64, prov: 0, forms: 0, sales: 9, rev: 3500 },
  { k: 'yt', label: 'YouTube · descrição', clicks: 340, leads: 121, gar: 98, prov: 23, forms: 0, sales: 6, rev: 2330 },
  { k: 'org', label: 'Orgânico (sem link)', clicks: 0, leads: 890, gar: 0, prov: 0, forms: 0, sales: 120, rev: 46600 },
];
const rtStates = [['CE', 'Ceará', 41], ['SP', 'São Paulo', 14], ['PE', 'Pernambuco', 9], ['BA', 'Bahia', 8], ['PA', 'Pará', 6], ['PI', 'Piauí', 5], ['MA', 'Maranhão', 4], ['RN', 'Rio Grande do Norte', 4], ['MG', 'Minas Gerais', 3], ['GO', 'Goiás', 2]];
function Rastreamento() {
  const initial = ['origens', 'links', 'indicacoes'].includes(window.GT_SUB) ? window.GT_SUB : 'origens';
  const [sub, setSub] = React.useState(initial);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <K.Tabs value={sub} onChange={setSub} tabs={[['origens', 'Origens'], ['links', 'Links'], ['indicacoes', 'Indicações']]} />
      {sub === 'origens' && <RtOrigens />}
      {sub === 'links' && <RtLinks />}
      {sub === 'indicacoes' && <RtIndicacoes />}
    </div>
  );
}
function RtCard({ children, style }) { return <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 12, padding: K.M() ? 14 : 18, boxShadow: '0 1px 2px rgba(0,0,0,.05)', ...style }}>{children}</div>; }
function RtOrigens() {
  const M = K.M();
  const tot = rtOrigins.reduce((a, r) => ({ clicks: a.clicks + r.clicks, leads: a.leads + r.leads, gar: a.gar + r.gar, prov: a.prov + r.prov, forms: a.forms + r.forms, sales: a.sales + r.sales, rev: a.rev + r.rev }), { clicks: 0, leads: 0, gar: 0, prov: 0, forms: 0, sales: 0, rev: 0 });
  const untracked = rtOrigins.find((r) => r.k === 'org').sales / tot.sales;
  const kpis = [['Cliques', GT.fmt.num(tot.clicks), 'mouse-pointer-click'], ['Leads', GT.fmt.num(tot.leads), 'users', `${GT.fmt.num(tot.gar)} garantidos · ${GT.fmt.num(tot.prov)} prováveis`], ['Form. preenchidos', GT.fmt.num(tot.forms), 'clipboard-list'], ['% Não rastreado', GT.fmt.pct(untracked * 100, 0), 'help-circle', 'vendas sem origem conhecida'], ['Vendas atribuídas', GT.fmt.num(tot.sales - 120), 'shopping-bag'], ['Receita (piso)', rtBRL(tot.rev - 46600), 'dollar-sign', 'só vendas com origem']];
  const cols = ['#3fc58f', '#6366f1', '#f59e0b', '#ec4899', '#0ea5e9', '#cbd5e1'];
  let ang = 0; const R = 80, r = 48, cx = 100, cy = 100;
  const slices = rtOrigins.map((o, i) => { const a0 = ang, a1 = ang + o.sales / tot.sales * Math.PI * 2; ang = a1; const p = (a, rr) => [cx + rr * Math.cos(a - Math.PI / 2), cy + rr * Math.sin(a - Math.PI / 2)]; const [x0, y0] = p(a0, R), [x1, y1] = p(a1, R), [x2, y2] = p(a1, r), [x3, y3] = p(a0, r); const big = a1 - a0 > Math.PI ? 1 : 0; return <path key={o.k} d={`M ${x0} ${y0} A ${R} ${R} 0 ${big} 1 ${x1} ${y1} L ${x2} ${y2} A ${r} ${r} 0 ${big} 0 ${x3} ${y3} Z`} fill={cols[i]} stroke="#fff" strokeWidth="2" />; });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, flexWrap: 'wrap' }}>
        <div><div style={{ fontSize: 18, fontWeight: 600 }}>Origens</div><div style={{ fontSize: 13.5, color: '#737373' }}>De onde vêm seus leads e vendas: anúncio, links rastreáveis, indicações e orgânico.</div></div>
        <K.Select value="30" options={[['7', 'Últimos 7 dias'], ['30', 'Últimos 30 dias'], ['90', 'Últimos 90 dias']]} width={170} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: M ? 'repeat(2,minmax(0,1fr))' : 'repeat(6,minmax(0,1fr))', gap: 12 }}>
        {kpis.map(([t, v, ic, sub]) => <div key={t} style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 12, padding: 14, boxShadow: '0 1px 2px rgba(0,0,0,.05)' }}><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 6 }}><div style={{ fontSize: 10.5, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.04em', color: '#737373', lineHeight: 1.2 }}>{t}</div><Icon name={ic} size={14} color="#a3a3a3" /></div><div style={{ fontSize: 20, fontWeight: 700, marginTop: 8, whiteSpace: 'nowrap' }}>{v}</div>{sub && <div style={{ fontSize: 10.5, color: '#737373', marginTop: 2 }}>{sub}</div>}</div>)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: M ? '1fr' : '1fr 1fr', gap: 16 }}>
        <RtCard>
          <div style={{ fontSize: 16, fontWeight: 600 }}>De onde vêm suas vendas</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 12, flexWrap: 'wrap' }}>
            <svg viewBox="0 0 200 200" style={{ width: 180, height: 180, flexShrink: 0 }}>{slices}<text x="100" y="96" textAnchor="middle" fontSize="20" fontWeight="700" fontFamily="Inter, sans-serif" fill="#171717">{tot.sales}</text><text x="100" y="114" textAnchor="middle" fontSize="10" fontFamily="Inter, sans-serif" fill="#737373">vendas</text></svg>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12.5, flex: 1, minWidth: 180 }}>{rtOrigins.map((o, i) => <div key={o.k} style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ height: 10, width: 10, borderRadius: 2, background: cols[i] }}></span><span style={{ flex: 1 }}>{o.k === 'org' ? 'Não rastreada' : o.label}</span><b>{o.sales}</b><span style={{ color: '#737373', width: 40, textAlign: 'right' }}>{Math.round(o.sales / tot.sales * 100)}%</span></div>)}</div>
          </div>
        </RtCard>
        <RtCard>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><div style={{ fontSize: 16, fontWeight: 600 }}>Distribuição regional</div><K.Tabs size="sm" value="v" onChange={() => {}} tabs={[['v', 'Vendas'], ['l', 'Leads']]} /></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginTop: 12 }}>{rtStates.map(([uf, n, p], i) => <div key={uf} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12.5 }}><span style={{ width: 24, height: 24, borderRadius: 6, background: i < 3 ? '#3fc58f' : '#f5f5f5', color: i < 3 ? '#fff' : '#737373', fontSize: 10.5, fontWeight: 600, display: 'grid', placeItems: 'center' }}>{uf}</span><span style={{ width: M ? 90 : 130, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{n}</span><div style={{ flex: 1, height: 8, background: '#f0f0f0', borderRadius: 999, overflow: 'hidden' }}><div style={{ width: p / 41 * 100 + '%', height: '100%', background: `rgba(63,197,143,${.35 + p / 41 * .65})` }}></div></div><span style={{ width: 36, textAlign: 'right', color: '#737373' }}>{p}%</span></div>)}</div>
          <div style={{ fontSize: 11.5, color: '#737373', marginTop: 10 }}>UF do telefone (DDD) e do endereço de entrega. 3 estados concentram 64% das vendas.</div>
        </RtCard>
      </div>
      <RtCard>
        <K.Table dense cols={[{ h: 'Origem', cell: (r) => <span style={{ fontWeight: 500 }}>{r.label}</span> }, { h: 'Cliques', align: 'right', cell: (r) => r.clicks ? GT.fmt.num(r.clicks) : '—' }, { h: 'Leads', align: 'right', cell: (r) => GT.fmt.num(r.leads) }, { h: 'Gar./Prov.', align: 'right', cell: (r) => r.gar ? `${GT.fmt.num(r.gar)} / ${r.prov}` : '—' }, { h: 'Formulários', align: 'right', cell: (r) => r.forms || '—' }, { h: 'Preencheu e não chamou', align: 'right', cell: (r) => r.forms ? <span style={{ color: '#a16207' }}>{Math.round(r.forms * .18)} <Icon name="eye" size={11} color="#a16207" /></span> : '—' }, { h: 'Vendas', align: 'right', cell: (r) => r.sales }, { h: 'Receita (piso)', align: 'right', cell: (r) => <span style={{ fontWeight: 600 }}>{rtBRL(r.rev)}</span> }]} rows={rtOrigins} />
      </RtCard>
    </div>
  );
}
function RtLinks() {
  const M = K.M();
  const rows = GT.trackingLinks;
  const chips = (l) => l.pool.map((id) => GT.chip(id).label).join(', ');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, flexWrap: 'wrap' }}>
        <div><div style={{ fontSize: 18, fontWeight: 600 }}>Links rastreáveis</div><div style={{ fontSize: 13.5, color: '#737373' }}>Cada link sabe para qual número mandou o clique, qual conversa abriu e quanto vendeu.</div></div>
        <div style={{ display: 'flex', gap: 8 }}><K.Btn small icon="qr-code">QR Code</K.Btn><K.Btn primary small icon="plus">Novo link</K.Btn></div>
      </div>
      <RtCard style={{ padding: M ? 8 : 12 }}>
        <K.Table cols={[{ h: 'Nome', cell: (l) => <div><div style={{ fontWeight: 500 }}>{l.name}</div><div style={{ fontSize: 12, color: '#737373', fontFamily: 'ui-monospace, monospace', display: 'flex', alignItems: 'center', gap: 6 }}>gt.link/{l.token}<Icon name="copy" size={12} color="#a3a3a3" /></div></div> }, { h: 'Formulário', cell: (l) => l.id === 'l2' ? <K.Badge tone="outline">Sim · 3 campos</K.Badge> : <K.Badge tone="secondary">Não</K.Badge> }, { h: 'No rodízio', cell: (l) => <K.Badge tone="outline">{l.dest === 'pool' ? (l.pool.length === 3 ? 'Todas as consultoras ativas' : chips(l)) : GT.chip(l.pool[0]).label}</K.Badge> }, { h: 'Cliques', align: 'right', cell: (l) => GT.fmt.num(l.clicks) }, { h: 'Leads', align: 'right', cell: (l) => GT.fmt.num(l.convos) }, { h: 'Status', cell: (l) => <K.Badge tone={l.id === 'l5' ? 'secondary' : 'qualificado'}>{l.id === 'l5' ? 'Pausada' : 'Ativa'}</K.Badge> }, { h: 'Ações', align: 'right', cell: () => <span style={{ display: 'inline-flex', gap: 10 }}><Icon name="bar-chart-3" size={15} color="#404040" /><Icon name="pencil" size={15} color="#404040" /><Icon name="qr-code" size={15} color="#404040" /><Icon name="more-vertical" size={15} color="#404040" /></span> }]} rows={rows} />
      </RtCard>
      <RtCard>
        <div style={{ fontSize: 14, fontWeight: 600 }}>Como funciona</div>
        <div style={{ display: 'grid', gridTemplateColumns: M ? '1fr' : 'repeat(3,1fr)', gap: 12, marginTop: 10, fontSize: 12.5, color: '#404040' }}>
          {[['mouse-pointer-click', 'Clique', 'A pessoa toca no link (anúncio, bio, story, indicação). O sistema grava a origem e escolhe a consultora da vez.'], ['message-square', 'Conversa', 'O WhatsApp abre com a mensagem pré-preenchida no número da consultora; a conversa nasce com a origem gravada.'], ['shopping-bag', 'Venda', 'Quando o pedido é registrado, a receita volta para a origem — anúncio, criativo, link ou indicadora.']].map(([ic, t, d]) => <div key={t} style={{ display: 'flex', gap: 10 }}><span style={{ height: 32, width: 32, borderRadius: 8, background: '#f5f5f5', display: 'grid', placeItems: 'center', flexShrink: 0 }}><Icon name={ic} size={15} color="#3fc58f" /></span><div><b>{t}</b><div style={{ color: '#737373' }}>{d}</div></div></div>)}
        </div>
      </RtCard>
    </div>
  );
}
function RtIndicacoes() {
  const M = K.M();
  const rows = [{ n: 'Patrícia Modas', w: '(85) 9 9812-3344', leads: 9, sales: 4, pts: 40, com: 'R$ 200,00', on: true }, { n: 'Fernanda Boutique', w: '(85) 9 9110-2200', leads: 7, sales: 3, pts: 30, com: 'R$ 150,00', on: true }, { n: 'Camila Atacado', w: '(71) 9 9655-7781', leads: 5, sales: 2, pts: 20, com: 'R$ 100,00', on: true }, { n: 'Ateliê Mariana', w: '(62) 9 9321-8877', leads: 2, sales: 0, pts: 0, com: 'R$ 0,00', on: false }];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, flexWrap: 'wrap' }}>
        <div><div style={{ fontSize: 18, fontWeight: 600 }}>Indicadores</div><div style={{ fontSize: 13.5, color: '#737373' }}>Clientes que indicam a loja. Cada uma tem um link de indicação e um painel de acompanhamento.</div></div>
        <div style={{ display: 'flex', gap: 8 }}><K.Btn small icon="settings">Regras de prêmio</K.Btn><K.Btn primary small icon="user-round-plus">Novo indicador</K.Btn></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: M ? '1fr 1fr' : 'repeat(4,minmax(0,1fr))', gap: 12 }}>
        {[['Indicadores ativos', '3'], ['Leads indicados', GT.referral.total], ['Vendas por indicação', GT.referral.converted], ['Receita', rtBRL(GT.referral.revenue)]].map(([l, v]) => <div key={l} style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 12, padding: 14 }}><div style={{ fontSize: 12, color: '#737373' }}>{l}</div><div style={{ fontSize: 20, fontWeight: 700, marginTop: 6 }}>{v}</div></div>)}
      </div>
      <RtCard style={{ padding: M ? 8 : 12 }}>
        <K.Table cols={[{ h: 'Nome', cell: (r) => <span style={{ fontWeight: 500 }}>{r.n}</span> }, { h: 'WhatsApp', k: 'w' }, { h: 'Leads', align: 'right', k: 'leads' }, { h: 'Vendas', align: 'right', k: 'sales' }, { h: 'Pontos', align: 'right', k: 'pts' }, { h: 'Comissão', align: 'right', k: 'com' }, { h: 'Status', cell: (r) => <K.Badge tone={r.on ? 'qualificado' : 'secondary'}>{r.on ? 'Ativa' : 'Pausada'}</K.Badge> }, { h: 'Ações', align: 'right', cell: () => <span style={{ display: 'inline-flex', gap: 10 }}><Icon name="copy" size={15} color="#404040" /><Icon name="external-link" size={15} color="#404040" /><Icon name="pencil" size={15} color="#404040" /></span> }]} rows={rows} />
      </RtCard>
      <RtCard>
        <div style={{ fontSize: 14, fontWeight: 600 }}>Como este indicador é premiado</div>
        <div style={{ display: 'grid', gridTemplateColumns: M ? '1fr' : '1fr 1fr', gap: 12, marginTop: 10 }}>
          <div><div style={{ fontSize: 12, color: '#737373', marginBottom: 6 }}>Tipo de recompensa</div><K.Tabs size="sm" value="v" onChange={() => {}} tabs={[['v', 'Valor por venda (R$)'], ['p', 'Percentual (%)'], ['pt', 'Pontos']]} /></div>
          <div><div style={{ fontSize: 12, color: '#737373', marginBottom: 6 }}>Valor por venda (R$)</div><div style={{ height: 36, width: 140, borderRadius: 8, border: '1px solid #e5e5e5', display: 'flex', alignItems: 'center', padding: '0 12px', fontSize: 13 }}>50,00</div></div>
        </div>
        <div style={{ fontSize: 12.5, color: '#404040', marginTop: 12, lineHeight: 1.5 }}><b>Como a comissão é atribuída:</b> a comissão vai para a indicadora quando o cliente compra pela primeira vez. Se houve mais de um clique de indicação, vale o <b>último</b>. Se o cliente já tinha vindo por outro canal (anúncio, formulário), a indicação <b>não</b> sobrescreve a origem.</div>
      </RtCard>
    </div>
  );
}
window.Rastreamento = Rastreamento;
