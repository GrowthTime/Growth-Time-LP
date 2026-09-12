// GT System — Produtos = pages/Products.tsx do GTR: abas Lojas | Análise. Lojas: linha da loja + sub-abas Catálogo & preços · Vitrine (config da loja) · Consultoras.
// Análise = ProductsDashboard (KPIs, Receita no tempo, Curva ABC + Faturamento por categoria, Curva de tamanhos + Cores, Produto isca + Recompra, Ranking).
// A LOJA PÚBLICA (o que a lojista vê em modafashion.atacado.store) é <PublicStore/> em ?view=loja (&cart=1 abre a sacola por grade).
const prCatCount = (c) => GT.products.filter((p) => p.category === c).length;
const prMoney = (n, d = 2) => 'R$ ' + Number(n).toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d });
function Produtos() {
  const M = K.M();
  const initial = window.GT_TAB === 'analise' ? 'analise' : 'lojas';
  const [tab, setTab] = React.useState(initial);
  const initialSub = ['catalogo', 'vitrine', 'consultoras'].includes(window.GT_TAB) ? window.GT_TAB : 'catalogo';
  const [sub, setSub] = React.useState(initialSub);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: M ? 16 : 20 }}>
      <K.PageHead icon="package" title="Produtos" sub="Suas lojas e a análise de vendas" />
      <K.Tabs value={tab} onChange={setTab} tabs={[['lojas', 'Lojas', 'store'], ['analise', 'Análise', 'bar-chart-3']]} />
      {tab === 'lojas' ? <>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 14, flexWrap: 'wrap' }}><span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 500 }}><Icon name="store" size={16} />{GT.stores[0].name}</span><span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#737373', fontSize: 13 }}><Icon name="plus" size={13} />Nova loja</span></div>
        <K.Tabs value={sub} onChange={setSub} tabs={[['catalogo', 'Catálogo & preços'], ['vitrine', 'Vitrine'], ['consultoras', 'Consultoras']]} />
        {sub === 'catalogo' && <PrCatalogo />}
        {sub === 'vitrine' && <PrVitrine />}
        {sub === 'consultoras' && <PrConsultoras />}
      </> : <PrAnalise />}
    </div>
  );
}

// ---------- Catálogo & preços ----------
function PrCatalogo() {
  const M = K.M();
  const [cat, setCat] = React.useState('all');
  const [work, setWork] = React.useState(null);
  const [toggles, setToggles] = React.useState(() => Object.fromEntries(GT.products.map((p) => [p.id, p.active])));
  const rows = GT.products.filter((p) => cat === 'all' || p.category === cat).filter((p) => !work || (work === 'estoque' ? p.stock > 0 : work === 'semestoque' ? p.stock === 0 : work === 'ativos' ? toggles[p.id] : work === 'inativos' ? !toggles[p.id] : work === 'naloja' ? p.showcase : !p.showcase));
  const workFilters = [['semfoto', 'Sem foto', 12], ['semdesc', 'Sem descrição', 3], null, ['estoque', 'Com estoque', GT.products.filter((p) => p.stock > 0).length], ['semestoque', 'Sem estoque', GT.products.filter((p) => p.stock === 0).length], null, ['ativos', 'Ativos', GT.products.filter((p) => p.active).length], ['inativos', 'Inativos', GT.products.filter((p) => !p.active).length], null, ['naloja', 'Na loja', GT.products.filter((p) => p.showcase).length], ['foraloja', 'Fora da loja', GT.products.filter((p) => !p.showcase).length]];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ fontSize: 13, color: '#737373', background: 'rgba(245,245,245,.7)', borderRadius: 8, padding: '10px 12px' }}>Esta é a loja principal — o catálogo da empresa. Produtos, fotos e estoque aqui valem para todas as lojas.</div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 14, color: '#404040', background: '#fff', border: '1px solid #e5e5e5', borderRadius: 12, padding: '14px 16px', lineHeight: 1.5 }}><Icon name="info" size={16} color="#737373" style={{ flexShrink: 0, marginTop: 3 }} /><span>Catálogo sincronizado do ERP. Você pode editar fotos, vídeo, preço de venda, categoria, descrição, inativar e excluir. Estoque, modelos, custo e nome são atualizados pela sincronização — para travar o estoque de um produto, mude-o para <b>estoque manual</b>.</span></div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: 200, height: 40, borderRadius: 8, border: '1px solid #e5e5e5', background: '#fff', display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px', fontSize: 14, color: '#737373' }}><Icon name="search" size={15} />Buscar produto...</div>
        <K.Select value="all" options={[['all', 'Todas as linhas'], ['a', 'Verão 26'], ['b', 'Básicos']]} width={M ? 140 : 150} />
        <K.Select value="all" options={[['all', 'Todas as cores'], ['p', 'Preto'], ['b', 'Branco']]} width={M ? 140 : 150} />
        <K.Btn primary icon="plus">Novo produto</K.Btn>
      </div>
      <div>
        <div style={{ fontSize: 12, color: '#737373', marginBottom: 6 }}>Arraste para ordenar as seções da loja · clique para filtrar.</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <K.Chip label={'Todas · ' + GT.products.length} on={cat === 'all'} onClick={() => setCat('all')} />
          {GT.categories.map((c) => <button key={c} onClick={() => setCat(c)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 30, padding: '0 10px', borderRadius: 999, border: '1px solid ' + (cat === c ? '#3fc58f' : '#e5e5e5'), background: cat === c ? '#3fc58f' : '#fff', color: cat === c ? '#fff' : '#404040', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: K.font, letterSpacing: '.02em' }}><Icon name="grip-vertical" size={11} color={cat === c ? '#fff' : '#a3a3a3'} />{c.toUpperCase()} <span style={{ fontWeight: 400, opacity: .8 }}>· {prCatCount(c)}</span><Icon name="pencil" size={11} color={cat === c ? '#fff' : '#a3a3a3'} /></button>)}
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, height: 30, padding: '0 10px', borderRadius: 999, border: '1px dashed #d4d4d4', fontSize: 12, color: '#737373' }}><Icon name="plus" size={11} />Criar categoria</span>
        </div>
      </div>
      <div>
        <div style={{ fontSize: 12, color: '#737373', marginBottom: 6 }}>Filtros de trabalho</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
          {workFilters.map((f, i) => f ? <button key={f[0]} onClick={() => setWork(work === f[0] ? null : f[0])} style={{ height: 28, padding: '0 10px', borderRadius: 999, border: '1px solid ' + (work === f[0] ? '#3fc58f' : '#e5e5e5'), background: work === f[0] ? 'rgba(63,197,143,.1)' : '#fff', color: work === f[0] ? '#2fae7c' : '#737373', fontSize: 12, cursor: 'pointer', fontFamily: K.font }}>{f[1]} · {f[2]}</button> : <span key={'sep' + i} style={{ width: 1, height: 18, background: '#e5e5e5', margin: '0 4px' }}></span>)}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: M ? '1fr' : 'repeat(2,minmax(0,1fr))', gap: 10 }}>
        {rows.map((p) => { const on = toggles[p.id]; return (
          <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#fff', border: '1px solid #e5e5e5', borderRadius: 12, padding: 10, opacity: on ? 1 : .55 }}>
            <div style={{ height: 56, width: 56, borderRadius: 8, background: p.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon name="shirt" size={22} color="rgba(255,255,255,.8)" /></div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}><span style={{ fontSize: 14, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textTransform: 'uppercase' }}>{p.name}</span>{p.soldOut && <K.Badge tone="destructive" style={{ fontSize: 10 }}>Esgotado</K.Badge>}{p.manualOff && <K.Badge tone="outline" style={{ fontSize: 10 }}>desligado na mão</K.Badge>}</div>
              <div style={{ fontSize: 11, color: '#737373', display: 'flex', gap: 10, marginTop: 2, letterSpacing: '.04em' }}><span>{p.category.toUpperCase()}</span><span>ERP</span>{p.stock === 0 && <span style={{ color: '#dc2626' }}>SEM ESTOQUE</span>}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#2fae7c', marginTop: 2 }}>{prMoney(p.price)}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
              <K.Toggle on={on} onChange={(v) => setToggles((t) => ({ ...t, [p.id]: v }))} />
              <Icon name="pencil" size={16} color="#404040" /><Icon name="copy" size={16} color="#404040" /><Icon name="trash-2" size={16} color="#dc2626" />
            </div>
          </div>); })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, color: '#737373', flexWrap: 'wrap', gap: 8 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>Ver <K.Select value="20" options={[['20', '20'], ['50', '50']]} width={70} small /> por página · {GT.products.length} no total</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ height: 36, width: 36, borderRadius: 8, border: '1px solid #e5e5e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="chevron-left" size={14} /></span>1 / 1<span style={{ height: 36, width: 36, borderRadius: 8, border: '1px solid #e5e5e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="chevron-right" size={14} /></span></span>
      </div>
    </div>
  );
}

// ---------- Vitrine (configuração da loja pública, como o StoreEditor real) ----------
function PrVitrine() {
  const M = K.M();
  const s = GT.stores[0];
  const [tipo, setTipo] = React.useState('atacado');
  const Sec = ({ title, sub, children }) => <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>{title && <div><div style={{ fontSize: 14, fontWeight: 600 }}>{title}</div>{sub && <div style={{ fontSize: 12.5, color: '#737373', marginTop: 2 }}>{sub}</div>}</div>}{children}</div>;
  const Lbl = ({ children }) => <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 6 }}>{children}</div>;
  const Inp = ({ v, ph, mono, w }) => <div style={{ height: 40, borderRadius: 8, border: '1px solid #e5e5e5', display: 'flex', alignItems: 'center', padding: '0 12px', fontSize: 14, color: v ? '#171717' : '#a3a3a3', fontFamily: mono ? 'ui-monospace, monospace' : K.font, width: w || '100%', background: '#fff' }}>{v || ph}</div>;
  const redes = [['Instagram', 'https://instagram.com/modafashion'], ['TikTok', 'https://tiktok.com/@modafashion'], ['YouTube', 'https://youtube.com/@modafashionatacado'], ['Página no Facebook', ''], ['Pinterest', '']];
  return (
    <div style={{ maxWidth: 460, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Sec><div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><div><div style={{ fontSize: 14, fontWeight: 600 }}>Loja ativa</div><div style={{ fontSize: 12.5, color: '#737373' }}>Liga/desliga esta loja pública.</div></div><K.Toggle on /></div></Sec>
      <Sec>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><div style={{ height: 52, width: 52, borderRadius: 999, background: '#1d1b19', color: '#fff', display: 'grid', placeItems: 'center', fontFamily: 'Georgia, serif', fontSize: 22 }}>M</div><div><K.Btn small icon="upload">Trocar logo</K.Btn><div style={{ fontSize: 11.5, color: '#737373', marginTop: 4 }}>Já vem o logo da empresa.</div></div></div>
        <div><Lbl>Nome da loja</Lbl><Inp v={s.name} /></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12 }}><div><Lbl>WhatsApp (só números)</Lbl><Inp v="5585981234321" /><div style={{ fontSize: 11.5, color: '#737373', marginTop: 4 }}>Já vem de uma consultora.</div></div><div><Lbl>Cor principal</Lbl><div style={{ height: 40, width: 52, borderRadius: 8, border: '1px solid #e5e5e5', padding: 4 }}><div style={{ height: '100%', borderRadius: 4, background: '#1d1b19' }}></div></div></div></div>
      </Sec>
      <Sec title="Tipo de loja">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>{[['atacado', 'Atacado', 'Mostra revenda · domínio atacado.store'], ['varejo', 'Varejo', 'Sem revenda · domínio lojagt.com']].map(([k, l, d]) => <button key={k} onClick={() => setTipo(k)} style={{ textAlign: 'left', padding: '10px 12px', borderRadius: 8, border: '1px solid ' + (tipo === k ? '#3fc58f' : '#e5e5e5'), background: tipo === k ? 'rgba(63,197,143,.06)' : '#fff', cursor: 'pointer', fontFamily: K.font, boxShadow: tipo === k ? '0 0 0 1px #3fc58f' : 'none' }}><div style={{ fontSize: 14, fontWeight: 500 }}>{l}</div><div style={{ fontSize: 11.5, color: '#737373' }}>{d}</div></button>)}</div>
        <div><Lbl>Multiplicador de revenda sugerida</Lbl><Inp v="2" w={150} /></div>
      </Sec>
      <Sec title="Banners da loja" sub="Banners no topo desta loja. Formato recomendado: imagem larga (ex: 1200×450). Toque pode levar a uma categoria.">
        <K.Btn primary small icon="upload" style={{ alignSelf: 'flex-start' }}>Enviar banner</K.Btn>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{GT.bio.blocks[1].items.map((b, i) => <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}><div style={{ height: 40, width: 100, borderRadius: 6, background: b.grad, flexShrink: 0 }}></div><div style={{ flex: 1, fontSize: 13 }}>{b.t}</div><K.Badge tone="secondary">→ {['Conjuntos', 'Vestidos', 'Blusas'][i]}</K.Badge><Icon name="trash-2" size={14} color="#dc2626" /></div>)}</div>
      </Sec>
      <Sec title="Endereço da loja">
        <div><Lbl>Domínio</Lbl><K.Select value="a" options={[['a', 'atacado.store — loja de atacado'], ['b', 'lojagt.com — loja de varejo']]} width="100%" /></div>
        <div><Lbl>Subdomínio</Lbl><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Inp v="modafashion" mono /><span style={{ fontSize: 13, color: '#404040', whiteSpace: 'nowrap' }}>.atacado.store</span></div><div style={{ fontSize: 11.5, color: '#737373', marginTop: 4 }}>Já vem do nome da loja; troque se quiser.</div></div>
        <div><div style={{ fontSize: 11, fontWeight: 600, color: '#737373', letterSpacing: '.04em', marginBottom: 6 }}>LINK DA LOJA</div><div style={{ display: 'flex', gap: 8 }}><Inp v="https://modafashion.atacado.store" mono />{['copy', 'external-link'].map((i) => <span key={i} style={{ height: 40, width: 40, borderRadius: 8, border: '1px solid #e5e5e5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon name={i} size={15} /></span>)}</div></div>
      </Sec>
      <Sec title="Mais opções">
        <div><Lbl>Sobre a loja</Lbl><div style={{ minHeight: 70, borderRadius: 8, border: '1px solid #e5e5e5', padding: 10, fontSize: 14 }}>{GT.bio.subtitle}</div></div>
        <div><Lbl>Redes sociais</Lbl><div style={{ fontSize: 11.5, color: '#737373', marginBottom: 8 }}>Viram ícones no rodapé da loja. Preencha só as que usa — as em branco não aparecem. O Instagram já vem do Instagram conectado.</div><div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{redes.map(([l, v]) => <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 110, flexShrink: 0, fontSize: 12, color: '#737373' }}>{l}</span><Inp v={v} ph={'https://' + l.toLowerCase().replace('página no ', '') + '.com/sualoja'} /></div>)}</div></div>
        <div><Lbl>Observações no checkout</Lbl><Inp ph="Ex: frete a combinar..." /></div>
        <div><Lbl>Pedido mínimo</Lbl><div style={{ display: 'flex', gap: 8, alignItems: 'center' }}><K.Tabs size="sm" value="grade" onChange={() => {}} tabs={[['grade', 'Por grade fechada'], ['pecas', 'Por peças']]} /><span style={{ fontSize: 12, color: '#737373' }}>{s.minLabel}</span></div><div style={{ fontSize: 11.5, color: '#737373', marginTop: 6 }}>1 grade = P·1 M·2 G·2 GG·1 (6 pç). A sacola só anda de grade em grade.</div></div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><div><div style={{ fontSize: 13, fontWeight: 500 }}>Exigir token no link</div><div style={{ fontSize: 11.5, color: '#737373' }}>Esconde a loja atrás de token secreto.</div></div><K.Toggle on={false} /></div>
      </Sec>
      <K.Btn primary style={{ alignSelf: 'flex-start' }}>Salvar</K.Btn>
      <div style={{ fontSize: 12.5, color: '#737373' }}>Como a lojista vê: <b>modafashion.atacado.store</b> — abre a loja pública com a sacola por grade.</div>
    </div>
  );
}

// ---------- Consultoras ----------
function PrConsultoras() {
  const sellers = GT.sellers.filter((s) => s.role !== 'Suporte');
  const [on, setOn] = React.useState(() => Object.fromEntries(sellers.map((s) => [s.id, GT.stores[0].rotation.includes(s.id)])));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 12, padding: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 600 }}><Icon name="user-round-plus" size={16} />Consultoras que atendem esta loja</div>
        <div style={{ fontSize: 13, color: '#737373', marginTop: 4, lineHeight: 1.5 }}>Marque quais consultoras vendem esta loja. O Agente de IA de cada consultora vai apresentar e vender os produtos de <b>todas</b> as lojas marcadas para ela (a soma dos catálogos). Só aparecem consultoras com WhatsApp conectado.</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 12 }}>
          {sellers.map((s) => <button key={s.id} onClick={() => setOn((o) => ({ ...o, [s.id]: !o[s.id] }))} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderRadius: 8, border: '1px solid #e5e5e5', background: on[s.id] ? 'rgba(63,197,143,.04)' : '#fff', cursor: 'pointer', fontFamily: K.font, fontSize: 14, textAlign: 'left' }}>{on[s.id] ? <Icon name="circle-check" size={18} color="#3fc58f" /> : <span style={{ height: 18, width: 18, borderRadius: 999, border: '1.5px solid #86efac', display: 'inline-block' }}></span>}<span style={{ flex: 1 }}>{s.name}</span>{on[s.id] && <span style={{ fontSize: 11.5, color: '#2fae7c' }}>atende</span>}</button>)}
        </div>
      </div>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 600 }}><Icon name="users" size={16} />Links por consultora — {GT.stores[0].name}</div>
        <div style={{ fontSize: 13, color: '#737373', marginTop: 4 }}>Cada consultora com WhatsApp conectado tem um link próprio desta loja — o catálogo e os preços são os desta loja, e o pedido cai no WhatsApp dela.</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
          {sellers.filter((s) => on[s.id]).map((s) => { const chip = GT.chip(s.chipId); return (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#fff', border: '1px solid #e5e5e5', borderRadius: 12, padding: '12px 14px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 200 }}><div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 500 }}>{s.name.split(' ')[0]} - {chip.label}<K.Badge tone="qualificado" icon="wifi" style={{ fontSize: 10.5 }}>conectado</K.Badge></div><div style={{ fontSize: 12, color: '#737373', marginTop: 2 }}>55{chip.number.replace(/\D/g, '')} · https://modafashion.atacado.store?v={s.id}</div></div>
              <K.Btn small icon="copy">Copiar</K.Btn><Icon name="external-link" size={16} color="#404040" />
            </div>); })}
        </div>
      </div>
    </div>
  );
}

// ---------- Análise (ProductsDashboard) ----------
const prWeeks = [18, 24, 26, 25, 23, 25, 26, 27, 25, 30, 26, 33, 27, 27];
const prAbc = [...GT.products].sort((a, b) => b.revenue - a.revenue);
function PrAnalise() {
  const M = K.M();
  const kpi = [['RECEITA', prMoney(GT.kpis.grossSales), '+22%', true, '#ecfdf5', '#3fc58f', 'dollar-sign'], ['PEÇAS VENDIDAS', '12.410', '+31%', true, '#eff6ff', '#2563eb', 'package'], ['TICKET MÉDIO', prMoney(GT.kpis.ticket), '+5%', true, '#faf5ff', '#9333ea', 'receipt'], ['PEDIDOS', '1.284', '+18%', true, '#fefce8', '#ca8a04', 'shopping-bag'], ['CLIENTES NOVOS', '475', '+9%', true, '#f8fafc', '#475569', 'user-round-plus']];
  const total = prAbc.reduce((a, p) => a + p.revenue, 0);
  let acc = 0; const abc = prAbc.map((p) => { acc += p.revenue; const cum = acc / total; return { ...p, cum, cls: cum <= .8 ? 'A' : cum <= .95 ? 'B' : 'C' }; });
  const cats = GT.categories.map((c) => [c, GT.products.filter((p) => p.category === c).reduce((a, p) => a + p.revenue, 0)]).sort((a, b) => b[1] - a[1]);
  const catColors = ['#3fc58f', '#6366f1', '#f59e0b', '#ef4444', '#06b6d4', '#8b5cf6', '#ec4899', '#84cc16', '#f97316'];
  const catTotal = cats.reduce((a, c) => a + c[1], 0);
  const Card = ({ title, sub, right, children }) => <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 12, padding: M ? 16 : 20, boxShadow: '0 1px 2px rgba(0,0,0,.05)' }}><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}><div><div style={{ fontSize: 15, fontWeight: 600 }}>{title}</div>{sub && <div style={{ fontSize: 12, color: '#737373', marginTop: 2 }}>{sub}</div>}</div>{right}</div><div style={{ marginTop: 14 }}>{children}</div></div>;
  const W = 1040, H = 220, pl = 44, pr = 12, pt = 10, pb = 26, max = 40;
  const x = (i) => pl + i * (W - pl - pr) / (prWeeks.length - 1), y = (v) => pt + (H - pt - pb) * (1 - v / max);
  let d = `M ${x(0)} ${y(prWeeks[0])}`; for (let i = 1; i < prWeeks.length; i++) { const cx = (x(i - 1) + x(i)) / 2; d += ` C ${cx} ${y(prWeeks[i - 1])}, ${cx} ${y(prWeeks[i])}, ${x(i)} ${y(prWeeks[i])}`; }
  const weeks = ['15/06', '22/06', '29/06', '06/07', '13/07', '20/07', '27/07', '03/08', '10/08', '17/08', '24/08', '31/08', '07/09', '12/09'];
  // donut
  let ang = 0; const R = 90, r = 52; const arcs = cats.map((c, i) => { const a0 = ang, a1 = ang + c[1] / catTotal * Math.PI * 2; ang = a1; const p = (a, rr) => [110 + rr * Math.cos(a - Math.PI / 2), 110 + rr * Math.sin(a - Math.PI / 2)]; const [x0, y0] = p(a0, R), [x1, y1] = p(a1, R), [x2, y2] = p(a1, r), [x3, y3] = p(a0, r); const big = a1 - a0 > Math.PI ? 1 : 0; return <path key={c[0]} d={`M ${x0} ${y0} A ${R} ${R} 0 ${big} 1 ${x1} ${y1} L ${x2} ${y2} A ${r} ${r} 0 ${big} 0 ${x3} ${y3} Z`} fill={catColors[i % catColors.length]} stroke="#fff" strokeWidth="2" />; });
  const sizes = [['P', 18], ['M', 31], ['G', 30], ['GG', 21]]; const colors = [['Preto', 28], ['Off-white', 19], ['Terracota', 16], ['Verde oliva', 12], ['Bege', 10], ['Rosa', 8], ['Azul', 7]];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}><div style={{ fontSize: 14, color: '#404040' }}>Visão geral de vendas dos produtos. Cada gráfico tem seu próprio recorte.</div><K.Select value="90" options={[['90', 'Últimos 90 dias'], ['30', 'Últimos 30 dias'], ['7', 'Últimos 7 dias']]} width={180} /></div>
      <div style={{ display: 'grid', gridTemplateColumns: M ? '1fr 1fr' : 'repeat(4,minmax(0,1fr))', gap: 14 }}>
        {kpi.map(([l, v, dlt, up, bg, c, ic]) => <div key={l} style={{ background: bg, borderRadius: 12, padding: 16 }}><div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 600, color: '#737373', letterSpacing: '.04em' }}>{l}<Icon name={ic} size={15} color={c} /></div><div style={{ fontSize: 22, fontWeight: 700, marginTop: 8 }}>{v}</div><div style={{ fontSize: 11.5, marginTop: 4 }}><span style={{ color: up ? '#16a34a' : '#dc2626', fontWeight: 600 }}>{up ? '▲' : '▼'} {dlt}</span> <span style={{ color: '#737373' }}>vs. período anterior</span></div></div>)}
      </div>
      <div style={{ background: '#f5f5f5', borderRadius: 10, padding: '12px 16px', fontSize: 14, display: 'flex', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}><span>Receita bruta <b>{prMoney(GT.kpis.grossSales + GT.kpis.refunds)}</b> &nbsp;−&nbsp; Descontos <b style={{ color: '#dc2626' }}>{prMoney(GT.kpis.refunds)}</b> &nbsp;=&nbsp; Receita líquida <b style={{ color: '#2fae7c' }}>{prMoney(GT.kpis.grossSales)}</b></span><span style={{ fontSize: 11.5, color: '#737373' }}>líquida = total de pedidos (bate com o Dashboard)</span></div>
      <Card title="Receita no tempo" sub="Evolução do faturamento" right={<K.Select value="w" options={[['w', 'Por semana'], ['d', 'Por dia'], ['m', 'Por mês']]} width={120} small />}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto' }}>
          <defs><linearGradient id="prGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3fc58f" stopOpacity=".28" /><stop offset="100%" stopColor="#3fc58f" stopOpacity="0" /></linearGradient></defs>
          {[0, 10, 20, 30, 40].map((v) => <g key={v}><line x1={pl} x2={W - pr} y1={y(v)} y2={y(v)} stroke="#e5e5e5" strokeDasharray="3 3" /><text x={pl - 6} y={y(v) + 4} textAnchor="end" fontSize="11" fill="#737373" fontFamily="Inter, sans-serif">{v}k</text></g>)}
          {weeks.map((w, i) => <text key={w} x={x(i)} y={H - 8} textAnchor="middle" fontSize="10.5" fill="#737373" fontFamily="Inter, sans-serif">{w}</text>)}
          <path d={d + ` L ${x(prWeeks.length - 1)} ${y(0)} L ${x(0)} ${y(0)} Z`} fill="url(#prGrad)" /><path d={d} fill="none" stroke="#3fc58f" strokeWidth="2" />
        </svg>
      </Card>
      <div style={{ display: 'grid', gridTemplateColumns: M ? '1fr' : '1fr 1fr', gap: 16 }}>
        <Card title="Curva ABC (Pareto)" sub="A = ~80% da receita · B = +15% · C = resto">
          <svg viewBox="0 0 520 230" style={{ width: '100%', height: 'auto' }}>
            {abc.map((p, i) => { const bw = 480 / abc.length; const h = p.revenue / abc[0].revenue * 150; return <g key={p.id}><rect x={40 + i * bw + 4} y={170 - h} width={bw - 8} height={h} rx="2" fill={p.cls === 'A' ? '#3fc58f' : p.cls === 'B' ? '#f59e0b' : '#cbd5e1'} /><text x={40 + i * bw + bw / 2} y={186} textAnchor="end" fontSize="8.5" fill="#737373" fontFamily="Inter, sans-serif" transform={`rotate(-30 ${40 + i * bw + bw / 2} 186)`}>{p.name.slice(0, 16)}</text></g>; })}
            <polyline points={abc.map((p, i) => `${40 + i * 480 / abc.length + 240 / abc.length},${170 - p.cum * 150}`).join(' ')} fill="none" stroke="#6366f1" strokeWidth="1.5" />
            {abc.map((p, i) => <circle key={p.id} cx={40 + i * 480 / abc.length + 240 / abc.length} cy={170 - p.cum * 150} r="2.5" fill="#fff" stroke="#6366f1" />)}
            <line x1="40" x2="520" y1={170 - .8 * 150} y2={170 - .8 * 150} stroke="#ef4444" strokeDasharray="4 3" opacity=".7" />
            {[0, 25, 50, 75, 100].map((v) => <text key={v} x="518" y={173 - v * 1.5} fontSize="9" fill="#737373" textAnchor="end" fontFamily="Inter, sans-serif">{v}%</text>)}
          </svg>
          <div style={{ background: '#f9fafb', borderRadius: 8, padding: 12, fontSize: 12, color: '#404040', lineHeight: 1.5, marginTop: 8 }}><b>Como ler:</b> cada barra é um produto, do que mais fatura (esquerda) ao que menos fatura (direita). <span style={{ color: '#3fc58f' }}>●</span> <b>A</b> = campeões (~80% da receita) · <span style={{ color: '#f59e0b' }}>●</span> <b>B</b> = intermediários (até 95%) · <span style={{ color: '#cbd5e1' }}>●</span> <b>C</b> = cauda (o resto). A <span style={{ color: '#6366f1' }}>linha roxa</span> soma a receita acumulada até 100%; onde cruza a <span style={{ color: '#ef4444' }}>linha dos 80%</span> termina o grupo A.</div>
        </Card>
        <Card title="Faturamento por categoria" sub="Participação de cada categoria" right={<K.Select value="r" options={[['r', 'Por receita'], ['p', 'Por peças']]} width={120} small />}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <svg viewBox="0 0 220 220" style={{ width: 200, height: 200 }}>{arcs}</svg>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 12px', justifyContent: 'center', fontSize: 11.5 }}>{cats.map((c, i) => <span key={c[0]} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: catColors[i % catColors.length], fontWeight: 600, letterSpacing: '.03em' }}><span style={{ height: 9, width: 9, borderRadius: 999, background: catColors[i % catColors.length] }}></span>{c[0].toUpperCase()}</span>)}</div>
          </div>
        </Card>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: M ? '1fr' : '1fr 1fr', gap: 16 }}>
        <Card title="Curva de tamanhos" sub="Peças vendidas por tamanho — planeje a grade"><div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{sizes.map(([s, v]) => <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}><span style={{ width: 28, fontWeight: 600 }}>{s}</span><div style={{ flex: 1, height: 22, background: '#f5f5f5', borderRadius: 4, overflow: 'hidden' }}><div style={{ width: v / 31 * 100 + '%', height: '100%', background: '#3fc58f' }}></div></div><span style={{ width: 40, textAlign: 'right', color: '#737373' }}>{v}%</span></div>)}</div><div style={{ fontSize: 12, color: '#737373', marginTop: 10 }}>M e G somam 61% — a grade P·1 M·2 G·2 GG·1 bate com a venda.</div></Card>
        <Card title="Cores mais vendidas" sub="Peças vendidas por cor"><div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{colors.map(([c, v]) => <div key={c} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}><span style={{ width: 90, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c}</span><div style={{ flex: 1, height: 10, background: '#f5f5f5', borderRadius: 999, overflow: 'hidden' }}><div style={{ width: v / 28 * 100 + '%', height: '100%', background: '#6366f1', borderRadius: 999 }}></div></div><span style={{ width: 36, textAlign: 'right', color: '#737373' }}>{v}%</span></div>)}</div></Card>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: M ? '1fr' : '1fr 1fr', gap: 16 }}>
        <Card title="Produto isca" sub="O que mais converte cliente novo (1ª compra)"><div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{GT.ranking.bait.concat(['pr7']).map((id, i) => { const p = GT.products.find((x) => x.id === id); return <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}><span style={{ width: 18, color: '#737373' }}>{i + 1}</span><div style={{ height: 32, width: 32, borderRadius: 6, background: p.grad, flexShrink: 0 }}></div><span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</span><K.Badge tone="cliente">{[38, 27, 19][i]}% das 1ªs compras</K.Badge></div>; })}</div></Card>
        <Card title="Recompra por produto" sub="% dos compradores que voltam a comprar a peça"><div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{GT.ranking.repurchase.map((r) => { const p = GT.products.find((x) => x.id === r.id); return <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}><div style={{ height: 32, width: 32, borderRadius: 6, background: p.grad, flexShrink: 0 }}></div><span style={{ width: 150, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</span><div style={{ flex: 1, height: 8, background: '#f5f5f5', borderRadius: 999, overflow: 'hidden' }}><div style={{ width: r.rate + '%', height: '100%', background: '#3fc58f', borderRadius: 999 }}></div></div><span style={{ width: 36, textAlign: 'right', color: '#737373' }}>{r.rate}%</span></div>; })}</div></Card>
      </div>
      <Card title="Ranking de produtos" right={<K.Tabs size="sm" value="all" onChange={() => {}} tabs={[['all', 'Todos os produtos'], ['sold', 'Só com venda']]} />}>
        <K.Table dense cols={[{ h: '#', cell: (p, i) => i + 1 }, { h: 'Produto', cell: (p) => <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><span style={{ height: 24, width: 24, borderRadius: 4, background: p.grad, display: 'inline-block' }}></span>{p.name}</span> }, { h: 'Qtd', align: 'right', cell: (p) => GT.fmt.num(p.sold) }, { h: 'Receita', align: 'right', cell: (p) => prMoney(p.revenue) }, { h: '%', align: 'right', cell: (p) => (p.revenue / total * 100).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + '%' }, { h: 'ABC', align: 'center', cell: (p) => <K.Badge color="#fff" bg={p.cls === 'A' ? '#3fc58f' : p.cls === 'B' ? '#f59e0b' : '#94a3b8'}>{p.cls}</K.Badge> }, { h: 'Última venda', cell: (p) => p.sold > 100 ? 'hoje' : p.sold > 50 ? 'ontem' : '05/09' }]} rows={abc} />
      </Card>
    </div>
  );
}

// ---------- LOJA PÚBLICA (?view=loja) — visual da loja real (.store-fashion) ----------
function PublicStore() {
  const s = GT.stores[0];
  const th = { bg: '#faf8f5', ink: '#1d1b19', muted: '#9a9085', line: '#ece6de', primary: '#1d1b19' };
  const display = { fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, letterSpacing: '.01em' };
  const eyebrow = { fontSize: 10.5, letterSpacing: '.22em', textTransform: 'uppercase', color: th.muted };
  const cats = GT.categories.filter((c) => prCatCount(c) > 0);
  const [cat, setCat] = React.useState(cats[0]);
  const [open, setOpen] = React.useState(new URLSearchParams(location.search).get('cart') === '1');
  const [grades, setGrades] = React.useState({ pr1: 2, pr3: 1 });
  // celular = SEMPRE 2 colunas (como a loja real); a partir de 640px, quantas couberem de 180px
  const [vw, setVw] = React.useState(window.innerWidth);
  React.useEffect(() => { const f = () => setVw(window.innerWidth); window.addEventListener('resize', f); return () => window.removeEventListener('resize', f); }, []);
  const cols = vw < 640 ? 'repeat(2, minmax(0,1fr))' : 'repeat(auto-fill, minmax(180px, 1fr))';
  const items = Object.entries(grades).filter(([, n]) => n > 0).map(([id, n]) => ({ p: GT.products.find((x) => x.id === id), n }));
  const count = items.reduce((a, it) => a + it.n * 6, 0), subtotal = items.reduce((a, it) => a + it.n * it.p.gradePrice, 0);
  const list = GT.products.filter((p) => p.showcase && p.category === cat).concat(GT.products.filter((p) => p.showcase && p.category !== cat).slice(0, 2));
  return (
    <div style={{ minHeight: '100vh', background: th.bg, color: th.ink, fontFamily: 'Inter, system-ui, sans-serif', position: 'relative' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: (window.GT_NOTCH ? 40 : 14) + 'px 16px 14px', borderBottom: '1px solid ' + th.line, background: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}><div style={{ height: 44, width: 44, borderRadius: 999, flexShrink: 0, background: th.primary, color: '#fff', display: 'grid', placeItems: 'center', fontSize: 20, ...display }}>M</div><span style={{ fontSize: vw < 640 ? 19 : 22, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', ...display }}>{s.name}</span></div>
          <button onClick={() => setOpen(true)} style={{ position: 'relative', height: 40, width: 40, borderRadius: 8, border: '1px solid ' + th.line, background: '#fff', display: 'grid', placeItems: 'center', cursor: 'pointer' }}><Icon name="shopping-bag" size={18} color={th.ink} />{count > 0 && <span style={{ position: 'absolute', top: -6, right: -6, minWidth: 18, height: 18, borderRadius: 999, background: th.primary, color: '#fff', fontSize: 10, fontWeight: 600, display: 'grid', placeItems: 'center', padding: '0 4px' }}>{count}</span>}</button>
        </header>
        <nav style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '12px 16px', borderBottom: '1px solid ' + th.line, background: '#fff', scrollbarWidth: 'none' }}>{cats.map((c) => <button key={c} onClick={() => setCat(c)} style={{ flexShrink: 0, padding: '10px 18px', borderRadius: 999, border: '1px solid ' + (cat === c ? th.primary : th.line), background: cat === c ? th.primary : '#fff', color: cat === c ? '#fff' : th.ink, fontSize: 12, letterSpacing: '.08em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit' }}>{c}</button>)}</nav>
        <section style={{ padding: vw < 640 ? 12 : 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}><h2 style={{ fontSize: 26, ...display }}>{cat.toUpperCase()}</h2><div style={{ flex: 1, height: 1, background: th.line }}></div><span style={eyebrow}>{prCatCount(cat) * 12} peças</span></div>
          <div style={{ display: 'grid', gridTemplateColumns: cols, gap: vw < 640 ? '16px 10px' : '20px 12px' }}>
            {list.map((p) => (
              <button key={p.id} onClick={() => setGrades((g) => ({ ...g, [p.id]: (g[p.id] || 0) + 1 }))} style={{ textAlign: 'left', background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', fontFamily: 'inherit', color: th.ink }}>
                <div style={{ position: 'relative', aspectRatio: '4 / 5', background: p.grad, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="shirt" size={40} color="rgba(255,255,255,.75)" />{p.soldOut && <span style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,.6)', display: 'grid', placeItems: 'center', ...eyebrow, color: th.ink }}>Esgotado</span>}<span style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 4 }}>{p.colors.map((c, i) => <span key={i} style={{ height: 4, width: 4, borderRadius: 999, background: 'rgba(255,255,255,.9)' }}></span>)}</span></div>
                <div style={{ marginTop: 8, fontSize: 12.5, letterSpacing: '.06em', textTransform: 'uppercase', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                <div style={{ fontSize: 16, color: th.primary, ...display }}>{prMoney(p.price)}</div>
                <div style={{ fontSize: 11, color: th.muted }}>revenda sugerida <b style={{ color: th.ink }}>{prMoney(p.price * 2)}</b></div>
                <div style={{ fontSize: 11, color: th.muted }}>lucro {prMoney(p.price)}</div>
              </button>
            ))}
          </div>
        </section>
        <footer style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, padding: '24px 16px 40px' }}>{['instagram', 'video', 'play'].map((i) => <span key={i} style={{ height: 40, width: 40, borderRadius: 999, border: '1px solid ' + th.line, background: '#fff', display: 'grid', placeItems: 'center' }}><Icon name={i} size={17} color={th.ink} /></span>)}</footer>
      </div>
      <button style={{ position: 'fixed', right: 20, bottom: 20, height: 56, width: 56, borderRadius: 999, background: '#25D366', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,.2)', display: 'grid', placeItems: 'center', cursor: 'pointer' }}><Icon name="message-circle" size={24} color="#fff" /></button>
      {open && <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', zIndex: 50 }} onClick={() => setOpen(false)}>
        <aside onClick={(e) => e.stopPropagation()} style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 'min(420px, 100%)', background: '#fff', display: 'flex', flexDirection: 'column', boxShadow: '-10px 0 30px rgba(0,0,0,.15)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 18px', borderBottom: '1px solid ' + th.line }}><span style={{ fontSize: 22, ...display }}>Sua sacola</span><button onClick={() => setOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}><Icon name="x" size={20} /></button></div>
          <div style={{ flex: 1, overflowY: 'auto', padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {items.length === 0 && <div style={{ color: th.muted, fontSize: 14 }}>Sua sacola está vazia.</div>}
            {items.map(({ p, n }) => (
              <div key={p.id} style={{ display: 'flex', gap: 12 }}>
                <div style={{ height: 72, width: 58, background: p.grad, flexShrink: 0 }}></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, letterSpacing: '.04em', textTransform: 'uppercase', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                  <div style={{ ...eyebrow, marginTop: 2 }}>Grade fechada · {p.colors[0]}</div>
                  <div style={{ fontSize: 12, color: th.muted, marginTop: 2 }}>{n} grade{n > 1 ? 's' : ''} · P·1 M·2 G·2 GG·1 · {n * 6} peças</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid ' + th.line, borderRadius: 999 }}><button onClick={() => setGrades((g) => ({ ...g, [p.id]: Math.max(0, n - 1) }))} style={{ height: 32, width: 32, background: 'transparent', border: 'none', cursor: 'pointer', display: 'grid', placeItems: 'center' }}><Icon name="minus" size={12} /></button><span style={{ width: 28, textAlign: 'center', fontSize: 14 }}>{n}</span><button onClick={() => setGrades((g) => ({ ...g, [p.id]: n + 1 }))} style={{ height: 32, width: 32, background: 'transparent', border: 'none', cursor: 'pointer', display: 'grid', placeItems: 'center' }}><Icon name="plus" size={12} /></button></div>
                    <span style={{ fontSize: 15, ...display }}>{prMoney(n * p.gradePrice)}</span>
                    <button onClick={() => setGrades((g) => ({ ...g, [p.id]: 0 }))} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}><Icon name="trash-2" size={15} color={th.muted} /></button>
                  </div>
                </div>
              </div>
            ))}
            <div style={{ fontSize: 11.5, color: th.muted, background: th.bg, borderRadius: 8, padding: 10 }}>Nesta loja o pedido é por <b>grade fechada</b>: o +/− anda de grade em grade, nunca de peça em peça.</div>
          </div>
          <div style={{ borderTop: '1px solid ' + th.line, padding: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}><span style={eyebrow}>Subtotal · {count} peças</span><span style={{ fontSize: 22, ...display }}>{prMoney(subtotal)}</span></div>
            <button style={{ height: 50, borderRadius: 999, background: th.primary, color: '#fff', border: 'none', fontSize: 12, letterSpacing: '.08em', textTransform: 'uppercase', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'inherit' }}><Icon name="message-circle" size={16} color="#fff" />Finalizar pelo WhatsApp</button>
            <div style={{ textAlign: 'center', fontSize: 11, color: th.muted }}>o pedido cai no WhatsApp da consultora do rodízio · Marina</div>
          </div>
        </aside>
      </div>}
    </div>
  );
}
window.Produtos = Produtos;
window.PublicStore = PublicStore;
