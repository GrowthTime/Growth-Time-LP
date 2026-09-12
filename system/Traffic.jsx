// GT System — Mkt & Ads: casca com as abas reais (Instagram · Anúncios · Rastreamento).
// Conteúdo de cada aba vive em Instagram.jsx / Anuncios.jsx / Rastreamento.jsx. Deep-link: ?screen=trafego&tab=instagram&sub=bio
function Traffic() {
  const initial = ['instagram', 'anuncios', 'rastreamento'].includes(window.GT_TAB) ? window.GT_TAB : 'anuncios';
  const [tab, setTab] = React.useState(initial);
  const M = window.GT_MOBILE;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: M ? 16 : 22 }}>
      <K.PageHead title="Mkt & Ads" sub="Dashboard de campanhas e análise de performance" />
      <K.UnderTabs value={tab} onChange={setTab} tabs={[['instagram', 'Instagram', 'instagram'], ['anuncios', 'Anúncios', 'bar-chart-3'], ['rastreamento', 'Rastreamento', 'radar']]} />
      {tab === 'instagram' && <Instagram />}
      {tab === 'anuncios' && <Anuncios />}
      {tab === 'rastreamento' && <Rastreamento />}
    </div>
  );
}
window.Traffic = Traffic;
