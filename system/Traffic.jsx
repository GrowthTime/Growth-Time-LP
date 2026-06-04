// GT System — Mkt & Ads (paid-traffic / ROAS dashboard)
function TKpi({ title, value, delta, up, ico, col }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: 14, padding: 16, boxShadow: 'var(--shadow-sm)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 10.5, fontWeight: 600, color: '#737373', textTransform: 'uppercase', letterSpacing: '.04em' }}>{title}</div>
          <div style={{ fontSize: 21, fontWeight: 700, marginTop: 6, whiteSpace: 'nowrap' }}>{value}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11.5, fontWeight: 500, color: up ? '#059669' : '#dc2626', marginTop: 5 }}>
            <Icon name={up ? 'trending-up' : 'trending-down'} size={13} />{delta}
          </div>
        </div>
        <div style={{ padding: 9, borderRadius: 10, background: col + '1a' }}><Icon name={ico} size={18} color={col} /></div>
      </div>
    </div>
  );
}

function ConvFunnel() {
  const steps = [
    { n: 'Impressões', v: '842.500', w: 100 },
    { n: 'Cliques', v: '18.940', w: 80 },
    { n: 'Mensagens', v: '4.210', w: 60 },
    { n: 'Qualificados', v: '1.850', w: 40 },
    { n: 'Vendas', v: '312', w: 22 },
  ];
  const rates = ['2,2%', '22,2%', '43,9%', '16,9%'];
  const greens = ['#5fd9b4', '#43cf9f', '#34b78a', '#2a9a73', '#22855f'];
  return (
    <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: 14, padding: 22, boxShadow: 'var(--shadow-sm)' }}>
      <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 18 }}>Funil de Conversão</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
        {steps.map((s, i) => (
          <React.Fragment key={i}>
            <div style={{ width: `${s.w}%`, background: greens[i], color: '#fff', borderRadius: 8, padding: '12px 0', textAlign: 'center', position: 'relative', transition: 'all .3s' }}>
              <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '.06em', opacity: .85 }}>{s.n}</div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{s.v}</div>
              {i < 4 && <span style={{ position: 'absolute', right: -64, top: '50%', transform: 'translateY(50%)', fontSize: 11, fontWeight: 700, color: '#fff', background: '#10b981', padding: '2px 8px', borderRadius: 999 }}>{rates[i]}</span>}
            </div>
          </React.Fragment>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: (window.GT_MOBILE?'repeat(3,1fr)':'repeat(5,1fr)'), gap: 10, marginTop: 22, paddingTop: 16, borderTop: '1px solid #eee' }}>
        {[['CPM', 'R$ 12,40'], ['CPC', 'R$ 0,55'], ['CPMens', 'R$ 2,48'], ['CPL', 'R$ 5,64'], ['CPA', 'R$ 33,40']].map(([l, v]) => (
          <div key={l} style={{ textAlign: 'center', background: '#f7f8f8', border: '1px solid #f0f0f0', borderRadius: 10, padding: '10px 6px' }}>
            <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '.05em', color: '#737373', fontWeight: 600 }}>{l}</div>
            <div style={{ fontSize: 13.5, fontWeight: 700, marginTop: 3 }}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Traffic() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Mkt &amp; Ads</h1>
        <p style={{ fontSize: 14, color: '#737373', marginTop: 2 }}>Dashboard de campanhas e análise de performance</p>
      </div>

      <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid #eee', paddingBottom: 2 }}>
        {[['Anúncios', 'bar-chart-3', true], ['Instagram', 'instagram', false], ['Verificação de Dados', 'check', false]].map(([l, ic, on]) => (
          <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13.5, fontWeight: 600, padding: '9px 14px', color: on ? '#171717' : '#a3a3a3', borderBottom: on ? '2px solid #38cc9c' : '2px solid transparent', marginBottom: -2 }}>
            <Icon name={ic} size={15} color={on ? '#38cc9c' : '#a3a3a3'} />{l}
          </div>
        ))}
      </div>

      {/* Alert */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(243,179,21,.08)', border: '1px solid rgba(243,179,21,.25)', borderRadius: 12, padding: '12px 16px' }}>
        <span style={{ fontSize: 18 }}>⚡</span>
        <div style={{ fontSize: 13, color: '#5f5e5a' }}><b style={{ color: '#171717' }}>Taxa de Qualificação em alta:</b> 43,9% das mensagens viraram leads qualificados neste período (+6,2pp vs. anterior).</div>
      </div>

      <div style={{ fontSize: 17, fontWeight: 600 }}>Visão Geral</div>
      <div style={{ display: 'grid', gridTemplateColumns: (window.GT_MOBILE?'repeat(2,1fr)':'repeat(4,1fr)'), gap: 14 }}>
        <TKpi title="Investimento" value="R$ 24,8K" delta="8,2%" up ico="dollar-sign" col="#38cc9c" />
        <TKpi title="Mensagens" value="4.210" delta="14,1%" up ico="message-square" col="#10b981" />
        <TKpi title="Custo / Mensagem" value="R$ 2,48" delta="6,4%" up ico="target" col="#f59e0b" />
        <TKpi title="Leads Qualificados" value="1.850" delta="11,9%" up ico="users" col="#10b981" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: (window.GT_MOBILE?'repeat(2,1fr)':'repeat(4,1fr)'), gap: 14 }}>
        <TKpi title="Pedidos" value="312" delta="16,8%" up ico="shopping-bag" col="#10b981" />
        <TKpi title="Custo / Pedido" value="R$ 33,40" delta="5,1%" up ico="target" col="#f59e0b" />
        <TKpi title="Faturamento" value="R$ 178,5K" delta="21,4%" up ico="dollar-sign" col="#9333ea" />
        <div style={{ background: 'var(--gradient-primary)', borderRadius: 14, padding: 16, boxShadow: '0 4px 14px rgba(56,204,156,.35)', color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: 10.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.04em', opacity: .9 }}>ROAS</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: 2, fontFamily: 'Inter,sans-serif' }}>7,2x</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11.5, fontWeight: 500, opacity: .95 }}><Icon name="trending-up" size={13} color="#fff" />9,1% vs anterior</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: (window.GT_MOBILE?'1fr':'1.1fr 1fr'), gap: 22 }}>
        <ConvFunnel />
        {/* Top creatives */}
        <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: 14, padding: 22, boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 16 }}>Top 3 Criativos</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { n: 'Coleção Verão · Carrossel', roas: '9,4x', spend: 'R$ 8,2K', rank: 1 },
              { n: 'Grade Atacado · Vídeo 15s', roas: '7,8x', spend: 'R$ 6,9K', rank: 2 },
              { n: 'Depoimento Lojista · Reels', roas: '6,1x', spend: 'R$ 5,4K', rank: 3 },
            ].map((cr) => (
              <div key={cr.rank} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: '#f7f8f8', borderRadius: 12, border: '1px solid #f0f0f0' }}>
                <div style={{ height: 38, width: 38, borderRadius: 9, background: 'var(--gradient-primary)', color: '#fff', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>#{cr.rank}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cr.n}</div>
                  <div style={{ fontSize: 12, color: '#737373' }}>Investido {cr.spend}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 17, fontWeight: 700, color: '#27ae8f' }}>{cr.roas}</div>
                  <div style={{ fontSize: 10.5, color: '#737373' }}>ROAS</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 18, paddingTop: 16, borderTop: '1px solid #eee' }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Distribuição Regional · Top estados</div>
            {[['Ceará', 100, 'R$ 62K'], ['Bahia', 64, 'R$ 39K'], ['São Paulo', 52, 'R$ 32K'], ['Pernambuco', 41, 'R$ 25K']].map(([uf, w, v]) => (
              <div key={uf} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 12, width: 80, color: '#5f5e5a' }}>{uf}</span>
                <div style={{ flex: 1, height: 8, borderRadius: 999, background: '#f0f0f0', overflow: 'hidden' }}><div style={{ height: '100%', width: `${w}%`, background: 'var(--gradient-primary)', borderRadius: 999 }}></div></div>
                <span style={{ fontSize: 12, fontWeight: 600, width: 52, textAlign: 'right' }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
window.Traffic = Traffic;
