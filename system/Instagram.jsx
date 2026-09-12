// GT System — Mkt & Ads › Instagram. Sub-abas iguais ao real: Análises do Instagram (InstagramDashboard) · Link da bio (BioEditor) · Automações (AutomationsWorkspace).
// Análises = conta + filtros + TOP 3 POSTS AGORA + 4 KPIs + Evolução de Seguidores + Performance por Formato / Localização + Todos os Posts + Top Comentários + Relatório Semanal.
// Automações = lista (AutomationsList) e editor (AutomationEditor: 1·Gatilho 2·Resposta pública 3·Direct 4·Sequência 5·Fim) com o PhonePreview (Publicação | Direct) — a simulação roda sozinha.
function Instagram() {
  const initial = ['analises', 'bio', 'automacoes'].includes(window.GT_SUB) ? window.GT_SUB : 'analises';
  const [sub, setSub] = React.useState(initial);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <K.Tabs value={sub} onChange={setSub} tabs={[['analises', 'Análises do Instagram'], ['bio', 'Link da bio'], ['automacoes', 'Automações']]} />
      {sub === 'bio' ? <BioEditor /> : sub === 'automacoes' ? <IgAutomacoes /> : <IgAnalises />}
    </div>
  );
}

// ---------------- ANÁLISES ----------------
const igPostsAll = [
  ...GT.igPosts,
  { id: 'p7', title: 'Look do dia · saia plissada', kind: 'Vídeo', likes: 640, comments: 41, reach: 12800, date: '27/08', grad: 'linear-gradient(135deg,#fde68a,#fb7185)' },
  { id: 'p8', title: 'Kit 3 regatas básicas', kind: 'Carrossel', likes: 890, comments: 63, reach: 17600, date: '25/08', grad: 'linear-gradient(135deg,#ddd6fe,#7c3aed)' },
  { id: 'p9', title: 'Antes e depois do ateliê', kind: 'Vídeo', likes: 2210, comments: 154, reach: 44900, date: '22/08', grad: 'linear-gradient(135deg,#a7f3d0,#0ea5e9)' },
  { id: 'p10', title: 'Blazer oversized 2 cores', kind: 'Foto', likes: 720, comments: 38, reach: 11200, date: '20/08', grad: 'linear-gradient(135deg,#e7e5e4,#78716c)' },
];
const igKind = (k) => k === 'Reels' ? 'Vídeo' : k;
const igFmtK = (n) => n >= 1000 ? (n / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + 'K' : String(n);
const igCities = [['Fortaleza', 'CE', 36.2], ['Caucaia', 'CE', 5.1], ['Sobral', 'CE', 3.4], ['São Paulo', 'SP', 3.0], ['Recife', 'PE', 2.6], ['Salvador', 'BA', 2.2], ['Belém', 'PA', 1.9], ['Teresina', 'PI', 1.7], ['Natal', 'RN', 1.5], ['Juazeiro do Norte', 'CE', 1.3]];
const igStates = [['Ceará', 'CE', 52.4], ['São Paulo', 'SP', 9.8], ['Pernambuco', 'PE', 6.1], ['Bahia', 'BA', 5.7], ['Pará', 'PA', 4.2], ['Piauí', 'PI', 3.9], ['Maranhão', 'MA', 3.1], ['Rio Grande do Norte', 'RN', 2.8], ['Paraíba', 'PB', 2.2], ['Minas Gerais', 'MG', 1.9]];
const igFollowers12 = [41.2, 41.9, 42.6, 43.1, 43.9, 44.8, 45.3, 46.0, 46.4, 46.9, 47.6, 48.2];
const igComments = [
  { u: '@lojinha.da.bia', t: 'quero 😍', tag: 'Demanda', post: 'Conjunto linho — lançamento' },
  { u: '@revenda.dani', t: 'Comprei 2 grades mês passado e vendeu tudo em 1 semana!', tag: 'Testemunhos', post: 'Grade P ao GG por R$ 389' },
  { u: '@boutique.lu', t: 'preço da grade?', tag: 'Demanda', post: 'Live · aulão de grade' },
  { u: '@carol.modas', t: 'Lindo demais, parabéns pelo trabalho 👏', tag: 'Apoio', post: 'Bastidores da confecção' },
  { u: '@ateliê.mari', t: 'Tem no GG? E o mínimo pra atacado?', tag: 'Demanda', post: 'Cropped canelado 4 cores' },
];
function IgAnalises() {
  const M = K.M();
  const st = GT.igStats;
  const [loc, setLoc] = React.useState('cidade');
  const [showReach, setShowReach] = React.useState(false);
  const top3 = [...igPostsAll].sort((a, b) => b.reach - a.reach).slice(0, 3);
  const medal = ['🥇', '🥈', '🥉'];
  const kpiBorder = ['#3fc58f', '#3fc58f', '#f59e0b', '#f97316'];
  const W = 560, H = 190, pl = 40, pr = 12, pt = 12, pb = 26;
  const fx = (i) => pl + i * (W - pl - pr) / 11, fy = (v) => pt + (H - pt - pb) * (1 - (v - 40) / 10);
  const line = igFollowers12.map((v, i) => `${i ? 'L' : 'M'} ${fx(i)} ${fy(v)}`).join(' ');
  const months = ['Out', 'Nov', 'Dez', 'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set'];
  const formats = [['Vídeo', 4.1, 62], ['Carrossel', 2.9, 24], ['Foto', 1.6, 14]];
  const cols = [
    { h: 'Thumb', cell: (p) => <div style={{ height: 28, width: 28, borderRadius: 4, background: p.grad, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{igKind(p.kind) === 'Vídeo' && <Icon name="play" size={11} color="#fff" />}</div> },
    { h: 'Data ↕', cell: (p) => p.date + '/26' },
    { h: 'Tipo', cell: (p) => <K.Badge color={igKind(p.kind) === 'Vídeo' ? '#7c3aed' : igKind(p.kind) === 'Carrossel' ? '#2563eb' : '#0891b2'} bg={igKind(p.kind) === 'Vídeo' ? '#f3e8ff' : igKind(p.kind) === 'Carrossel' ? '#dbeafe' : '#cffafe'}>{igKind(p.kind)}</K.Badge> },
    { h: 'Alcance ⓘ ↕', cell: (p) => igFmtK(p.reach) },
    { h: 'Curtidas ↕', cell: (p) => GT.fmt.num(p.likes) },
    { h: 'Comentários ↕', cell: (p) => p.comments },
    { h: 'Salvamentos ⓘ ↕', cell: (p) => Math.round(p.likes * .06) },
    { h: 'Shares ↕', cell: (p) => Math.round(p.likes * .09) },
    { h: 'Eng. Alcance (%) ↕', cell: (p) => <span style={{ color: '#d97706', fontWeight: 600 }}>{((p.likes + p.comments * 2) / p.reach * 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%</span> },
    { h: '', cell: () => <Icon name="external-link" size={14} color="#737373" /> },
  ];
  const Card = ({ children, style }) => <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 12, padding: M ? 16 : 20, boxShadow: '0 1px 2px rgba(0,0,0,.05)', ...style }}>{children}</div>;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 14px 6px 6px', borderRadius: 999, background: '#fdf2f8', border: '1px solid #fbcfe8' }}>
          <div style={{ height: 32, width: 32, borderRadius: 999, background: 'linear-gradient(45deg,#f9ce34,#ee2a7b,#6228d7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="instagram" size={16} color="#fff" /></div>
          <div><div style={{ fontSize: 14, fontWeight: 600 }}>{GT.company.ig}</div><div style={{ fontSize: 10.5, color: '#737373', letterSpacing: '.04em' }}>{GT.company.name.toUpperCase()}</div></div>
        </div>
        <K.Btn icon="refresh-cw" small>Sincronizar</K.Btn>
      </div>
      <Card style={{ padding: 12 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <K.Select value="30" options={[['30', '30 dias'], ['7', '7 dias'], ['90', '90 dias']]} width={110} small />
          <K.Select value="all" options={[['all', 'Todos'], ['v', 'Vídeo'], ['c', 'Carrossel'], ['f', 'Foto']]} width={110} small />
          <K.Select value="all" options={[['all', 'Todos'], ['ad', 'Impulsionados'], ['org', 'Orgânicos']]} width={110} small />
          <div style={{ marginLeft: 'auto', height: 32, width: 32, borderRadius: 8, border: '1px solid #e5e5e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="refresh-cw" size={14} /></div>
        </div>
      </Card>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '.02em' }}>TOP 3 POSTS AGORA</div>
          <div style={{ display: 'flex', gap: 10, fontSize: 11, color: '#737373', flexWrap: 'wrap' }}>{[['eye', 'Viralizando'], ['message-circle', '+ Comentários'], ['bookmark', '+ Salvamentos'], ['heart', '+ Curtidas']].map(([i, l]) => <span key={l} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Icon name={i} size={12} />{l}</span>)}</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: M ? '1fr' : 'repeat(3,minmax(0,1fr))', gap: 16, marginTop: 14 }}>
          {top3.map((p, i) => (
            <div key={p.id} style={{ border: '1px solid ' + (i === 0 ? '#f59e0b' : '#e5e5e5'), borderRadius: 12, overflow: 'hidden', boxShadow: i === 0 ? '0 0 0 1px #f59e0b' : 'none' }}>
              <div style={{ position: 'relative', aspectRatio: '1 / 1', background: p.grad, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ position: 'absolute', top: 8, left: 8, fontSize: 16 }}>{medal[i]}</span>
                <K.Badge style={{ position: 'absolute', top: 8, right: 8 }} color="#fff" bg="rgba(0,0,0,.45)">{igKind(p.kind)}</K.Badge>
                {igKind(p.kind) === 'Vídeo' && <div style={{ height: 48, width: 48, borderRadius: 999, background: 'rgba(255,255,255,.85)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="play" size={20} color="#171717" /></div>}
              </div>
              <div style={{ padding: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#737373' }}><span>{p.date}</span><Icon name="external-link" size={13} color="#737373" /></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, marginTop: 8, fontSize: 12.5 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Icon name="eye" size={13} color="#737373" />{igFmtK(p.reach)}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Icon name="heart" size={13} color="#e11d48" />{GT.fmt.num(p.likes)}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Icon name="message-circle" size={13} color="#2563eb" />{p.comments}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Icon name="bookmark" size={13} color="#7c3aed" />{Math.round(p.likes * .06)}</span>
                </div>
                <button style={{ marginTop: 10, width: '100%', height: 32, borderRadius: 8, border: '1px solid #e5e5e5', background: '#fff', fontSize: 12.5, fontWeight: 500, cursor: 'pointer', fontFamily: K.font }}>Ver detalhes</button>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <div style={{ display: 'grid', gridTemplateColumns: M ? '1fr 1fr' : 'repeat(4,minmax(0,1fr))', gap: 14 }}>
        {[['Seguidores', igFmtK(st.followers), 'users', ''], ['Crescimento', '+' + igFmtK(st.followersDelta), 'trending-up', '+2,6%'], ['Alcance ⓘ', igFmtK(st.reach7d), 'eye', '+14,1%'], ['Engajamento por Alcance ⓘ', '2,75%', 'percent', '']].map(([l, v, ic, d], i) => (
          <div key={l} style={{ background: '#fff', border: '1px solid #e5e5e5', borderBottom: '3px solid ' + kpiBorder[i], borderRadius: 12, padding: 16, boxShadow: '0 1px 2px rgba(0,0,0,.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, color: '#737373' }}>{l}<Icon name={ic} size={16} color={kpiBorder[i]} /></div>
            <div style={{ fontSize: 24, fontWeight: 700, color: kpiBorder[i], marginTop: 8 }}>{v} {d && <span style={{ fontSize: 12, color: '#16a34a', fontWeight: 500 }}>{d}</span>}</div>
          </div>
        ))}
      </div>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><div style={{ fontSize: 16, fontWeight: 600 }}>Evolução de Seguidores</div><label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: '#404040' }}><K.Toggle on={showReach} onChange={setShowReach} small />Mostrar Alcance</label></div>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', marginTop: 10 }}>
          {[40, 42.5, 45, 47.5, 50].map((v) => <g key={v}><line x1={pl} x2={W - pr} y1={fy(v)} y2={fy(v)} stroke="#e5e5e5" strokeDasharray="3 3" /><text x={pl - 6} y={fy(v) + 4} textAnchor="end" fontSize="10.5" fill="#737373" fontFamily="Inter, sans-serif">{v}K</text></g>)}
          {months.map((m, i) => <text key={m} x={fx(i)} y={H - 8} textAnchor="middle" fontSize="10.5" fill="#737373" fontFamily="Inter, sans-serif">{m}</text>)}
          <path d={line} fill="none" stroke="#3fc58f" strokeWidth="2.5" />
          {igFollowers12.map((v, i) => <circle key={i} cx={fx(i)} cy={fy(v)} r="3" fill="#fff" stroke="#3fc58f" strokeWidth="2" />)}
          {showReach && <path d={igFollowers12.map((v, i) => `${i ? 'L' : 'M'} ${fx(i)} ${fy(40 + ((i * 37) % 7) + 1.5)}`).join(' ')} fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 3" />}
        </svg>
      </Card>
      <div style={{ display: 'grid', gridTemplateColumns: M ? '1fr' : '1fr 1fr', gap: 16 }}>
        <Card>
          <div style={{ fontSize: 16, fontWeight: 600 }}>Performance por Formato <span style={{ fontSize: 12, color: '#a3a3a3', fontWeight: 400 }}>ⓘ</span></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 16 }}>
            {formats.map(([n, eng, share]) => <div key={n}><div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}><span style={{ fontWeight: 500 }}>{n}</span><span style={{ color: '#737373' }}>{eng.toLocaleString('pt-BR')}% eng. · {share}% dos posts</span></div><div style={{ height: 8, background: '#f0f0f0', borderRadius: 999, marginTop: 6, overflow: 'hidden' }}><div style={{ width: eng / 5 * 100 + '%', height: '100%', background: 'linear-gradient(90deg,#3fc58f,#2fae7c)', borderRadius: 999 }}></div></div></div>)}
          </div>
          <div style={{ marginTop: 16, fontSize: 12.5, color: '#737373' }}>Vídeos alcançam <b style={{ color: '#171717' }}>2,5x</b> mais que fotos nesta conta. Bastidores e antes/depois são os que mais viralizam.</div>
        </Card>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 16, fontWeight: 600 }}><Icon name="map-pin" size={16} color="#e11d48" />Localização dos Seguidores</div>
          <K.Tabs value={loc} onChange={setLoc} size="sm" style={{ marginTop: 12, width: '100%' }} tabs={[['cidade', 'Por Cidade'], ['estado', 'Por Estado']]} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
            {(loc === 'cidade' ? igCities : igStates).map(([n, uf, pct], i) => (
              <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12.5 }}>
                <span style={{ height: 20, width: 20, borderRadius: 999, background: i < 3 ? 'linear-gradient(135deg,#a855f7,#ec4899)' : '#f5f5f5', color: i < 3 ? '#fff' : '#737373', fontSize: 10.5, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</span>
                <span style={{ width: M ? 110 : 130, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}><b style={{ fontWeight: 600 }}>{n}</b> <span style={{ color: '#a3a3a3' }}>({uf})</span></span>
                <div style={{ flex: 1, height: 6, background: '#f0f0f0', borderRadius: 999, overflow: 'hidden' }}><div style={{ width: pct / (loc === 'cidade' ? 36.2 : 52.4) * 100 + '%', height: '100%', background: 'linear-gradient(90deg,#a855f7,#ec4899)' }}></div></div>
                <span style={{ width: 40, textAlign: 'right', color: '#737373' }}>{pct.toLocaleString('pt-BR')}%</span>
                <span style={{ width: 36, textAlign: 'right', color: '#a3a3a3', fontSize: 11 }}>{igFmtK(Math.round(st.followers * pct / 100))}</span>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', fontSize: 11.5, color: '#a3a3a3', marginTop: 10 }}>+35 outras {loc === 'cidade' ? 'cidades' : 'localidades'}</div>
        </Card>
      </div>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <div style={{ fontSize: 16, fontWeight: 600 }}>Todos os Posts</div>
          <div style={{ display: 'flex', gap: 8 }}><div style={{ display: 'flex', alignItems: 'center', gap: 6, height: 32, padding: '0 10px', borderRadius: 8, border: '1px solid #e5e5e5', fontSize: 13, color: '#737373', width: 150 }}><Icon name="search" size={13} />Buscar...</div><K.Btn small icon="download">Exportar</K.Btn></div>
        </div>
        <div style={{ marginTop: 10 }}><K.Table dense cols={cols} rows={igPostsAll} /></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, fontSize: 12.5, color: '#737373' }}><span>1-10 de 33</span><div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>{['chevrons-left', 'chevron-left'].map((i) => <span key={i} style={{ height: 28, width: 28, borderRadius: 6, border: '1px solid #e5e5e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={i} size={13} /></span>)}<span style={{ padding: '0 8px' }}>1 / 4</span>{['chevron-right', 'chevrons-right'].map((i) => <span key={i} style={{ height: 28, width: 28, borderRadius: 6, border: '1px solid #e5e5e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={i} size={13} /></span>)}</div></div>
      </Card>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, flexWrap: 'wrap' }}>
          <div><div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 16, fontWeight: 600 }}><Icon name="message-circle" size={16} color="#3fc58f" />Top Comentários</div><div style={{ fontSize: 12.5, color: '#737373', marginTop: 2 }}>Comentários dos posts classificados por IA — modere e responda sem sair daqui.</div></div>
          <div style={{ textAlign: 'right', fontSize: 12, color: '#737373' }}><div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}><Icon name="refresh-cw" size={12} />Sincronizar comentários</div><label style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end', marginTop: 6 }}><K.Toggle on={false} small /><span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><K.Dot color="#ef4444" size={6} />Só comentários de anúncio</span></label></div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12, fontSize: 12 }}>
          {[['⚠️ Ofensivos', 0, '#fee2e2', '#b91c1c'], ['💛 Apoio', 1, '#fef9c3', '#a16207'], ['⭐ Testemunhos', 1, '#f3e8ff', '#7e22ce'], ['🛒 Demanda', 3, '#dbeafe', '#1d4ed8']].map(([l, n, bg, c]) => <K.Badge key={l} bg={bg} color={c}>{l} {n}</K.Badge>)}
          <span style={{ color: '#737373', textDecoration: 'underline', alignSelf: 'center' }}>mostrar neutros</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14 }}>
          {igComments.map((c, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: 12, border: '1px solid #f0f0f0', borderRadius: 10 }}>
              <div style={{ height: 30, width: 30, borderRadius: 999, background: 'linear-gradient(135deg,#f9a8d4,#fcd34d)', flexShrink: 0 }}></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13 }}><b>{c.u}</b> {c.t}</div>
                <div style={{ fontSize: 11.5, color: '#737373', marginTop: 3 }}>em <i>{c.post}</i> · <K.Badge bg={c.tag === 'Demanda' ? '#dbeafe' : c.tag === 'Apoio' ? '#fef9c3' : '#f3e8ff'} color={c.tag === 'Demanda' ? '#1d4ed8' : c.tag === 'Apoio' ? '#a16207' : '#7e22ce'}>{c.tag}</K.Badge>{c.tag === 'Demanda' && <span style={{ marginLeft: 8, color: '#2fae7c', fontWeight: 600 }}>→ Direct enviado pela automação</span>}</div>
              </div>
              <K.Btn small>Responder</K.Btn>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, flexWrap: 'wrap' }}>
          <div><div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 16, fontWeight: 600 }}><Icon name="file-text" size={16} color="#3fc58f" />Relatório Semanal — Orgânico</div><div style={{ fontSize: 12.5, color: '#737373', marginTop: 2 }}>Números da semana fechada + análise da IA e benchmark de moda, direto no painel. O envio para grupos de WhatsApp é feito pela equipe da GT.</div></div>
          <K.Btn small primary icon="sparkles">Gerar relatório</K.Btn>
        </div>
        <div style={{ marginTop: 14, background: '#f9fafb', borderRadius: 10, padding: 14, fontSize: 13, lineHeight: 1.6, color: '#404040', whiteSpace: 'pre-line' }}>{GT.reports[2].preview.join('\n')}</div>
        <div style={{ fontSize: 11.5, color: '#a3a3a3', marginTop: 8 }}>Gerado segunda 08:00 · semana 01–07/09</div>
      </Card>
    </div>
  );
}

// ---------------- AUTOMAÇÕES ----------------
const igTrig = { comment_post: ['Post específico', 'image'], comment_any: ['Qualquer post', 'message-circle'], comment_live: ['Live', 'radio'], story_reply: ['Story', 'video'] };
function IgAutomacoes() {
  const M = K.M();
  const [editing, setEditing] = React.useState('a1');
  const list = GT.igAutomations;
  if (editing) return <IgAutomationEditor a={list.find((x) => x.id === editing)} onBack={() => setEditing(null)} />;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, flexWrap: 'wrap' }}>
        <div><div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 18, fontWeight: 600 }}><Icon name="zap" size={18} />Automações do Instagram</div><div style={{ fontSize: 13.5, color: '#737373', marginTop: 2 }}>Comentário no post, na live ou resposta ao story → mensagem automática no Direct, com botões e sequência.</div></div>
        <K.Btn primary icon="zap">Nova automação</K.Btn>
      </div>
      {list.map((a) => { const [tl, ti] = igTrig[a.trigger]; const s = a.stats; return (
        <div key={a.id} style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', boxShadow: '0 1px 2px rgba(0,0,0,.05)' }}>
          <Icon name={ti} size={20} color="#737373" />
          <div style={{ flex: 1, minWidth: 160 }}><div style={{ fontSize: 14.5, fontWeight: 500 }}>{a.name}</div><div style={{ fontSize: 12, color: '#737373' }}>{tl}{a.keywords.length ? ' · palavra: ' + a.keywords.slice(0, 3).join(', ') : ''}{!a.active && <K.Badge tone="outline" style={{ marginLeft: 6, fontSize: 10 }}>rascunho</K.Badge>}</div></div>
          <div style={{ display: 'flex', gap: 16, textAlign: 'center', fontSize: 11.5, color: '#737373' }}>
            {[[s.comments, 'disparos'], [s.dms, 'DMs'], [s.answered, 'opt-ins'], [Math.round(s.answered / s.dms * 100) + '%', 'taxa']].map(([v, l]) => <div key={l}><div style={{ fontSize: 14, fontWeight: 600, color: '#171717' }}>{typeof v === 'number' ? GT.fmt.num(v) : v}</div>{l}</div>)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><K.Toggle on={a.active} small /><button onClick={() => setEditing(a.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex' }}><Icon name="pencil" size={16} color="#404040" /></button><Icon name="trash-2" size={16} color="#dc2626" /></div>
        </div>); })}
    </div>
  );
}
function IgCard({ title, right, children }) {
  return <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 12, boxShadow: '0 1px 2px rgba(0,0,0,.05)' }}><div style={{ padding: '14px 18px 10px', fontSize: 14, fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>{title}{right}</div><div style={{ padding: '0 18px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>{children}</div></div>;
}
const igChip = (t, on) => <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, padding: '3px 8px', borderRadius: 999, background: on ? '#171717' : '#f5f5f5', color: on ? '#fff' : '#171717' }}>{t}<Icon name="x" size={10} color={on ? '#fff' : '#737373'} /></span>;
function IgAutomationEditor({ a, onBack }) {
  const M = K.M();
  const [pub, setPub] = React.useState(a.publicReplyEnabled);
  const [trig, setTrig] = React.useState(a.trigger);
  const trigs = [['comment_post', 'Post específico', 'Comentário em posts escolhidos', 'image'], ['comment_any', 'Qualquer post', 'Comentário em qualquer post', 'message-circle'], ['comment_live', 'Live', 'Comentário durante a live', 'radio'], ['story_reply', 'Resposta a story', 'Quem responde seus stories', 'video']];
  const n = (i) => trig === 'story_reply' ? i - 1 : i;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><button onClick={onBack} style={{ height: 36, width: 36, borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="arrow-left" size={16} /></button><input defaultValue={a.name} style={{ height: 36, width: M ? 220 : 280, padding: '0 12px', borderRadius: 8, border: '1px solid #e5e5e5', fontFamily: K.font, fontSize: 14, fontWeight: 500, outline: 'none' }} /></div>
        <div style={{ display: 'flex', gap: 8 }}><K.Btn small icon="download">Salvar rascunho</K.Btn><K.Btn small primary icon="play">Ativar</K.Btn></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: M ? '1fr' : 'minmax(0,1fr) 380px', gap: 24, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <IgCard title="1 · Gatilho">
            <div style={{ display: 'grid', gridTemplateColumns: M ? '1fr 1fr' : 'repeat(4,1fr)', gap: 8 }}>
              {trigs.map(([v, l, d, ic]) => <button key={v} onClick={() => setTrig(v)} style={{ textAlign: 'left', padding: 10, borderRadius: 8, border: '1px solid ' + (trig === v ? '#3fc58f' : '#e5e5e5'), background: trig === v ? 'rgba(63,197,143,.05)' : '#fff', cursor: 'pointer', fontFamily: K.font }}><Icon name={ic} size={16} /><div style={{ fontSize: 12, fontWeight: 600, marginTop: 4 }}>{l}</div><div style={{ fontSize: 11, color: '#737373', lineHeight: 1.3 }}>{d}</div></button>)}
            </div>
            {trig === 'comment_post' && <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}><K.Btn small icon="plus" style={{ height: 32, fontSize: 12 }}>Escolher posts ({a.postIds.length})</K.Btn>{a.postIds.map((id) => { const p = GT.igPosts.find((x) => x.id === id); return <span key={id} style={{ position: 'relative', display: 'inline-block' }}><span style={{ display: 'block', height: 40, width: 40, borderRadius: 4, background: p.grad }}></span><span style={{ position: 'absolute', top: -6, right: -6, height: 16, width: 16, borderRadius: 999, background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="trash-2" size={10} color="#dc2626" /></span></span>; })}</div>}
            {trig !== 'comment_live' && <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#737373' }}>{trig === 'story_reply' ? 'Resposta ao story' : 'Comentário'}:<K.Select value="contains" options={[['any', 'qualquer um dispara'], ['contains', 'contém a palavra-chave'], ['exact', 'é exatamente a palavra']]} width={210} small /></div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', minHeight: 36, padding: 6, borderRadius: 8, border: '1px solid #e5e5e5', alignItems: 'center' }}>{a.keywords.map((k) => igChip(k, true))}<span style={{ fontSize: 12.5, color: '#a3a3a3', paddingLeft: 4 }}>Digite a palavra-chave e Enter (ex.: quero)</span></div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', minHeight: 36, padding: 6, borderRadius: 8, border: '1px solid #e5e5e5', alignItems: 'center' }}>{a.excludeKeywords.map((k) => igChip(k, false))}<span style={{ fontSize: 12.5, color: '#a3a3a3', paddingLeft: 4 }}>Nunca disparar se contiver… (opcional)</span></div>
            </div>}
            {trig === 'comment_live' && <div style={{ fontSize: 12, color: '#737373' }}>Comentários de live só chegam em tempo real com o app aprovado pela Meta (Advanced Access) — este gatilho fica pronto e é ligado após a aprovação.</div>}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, borderTop: '1px solid #e5e5e5', paddingTop: 10, fontSize: 12, flexWrap: 'wrap' }}><label style={{ display: 'flex', alignItems: 'center', gap: 8 }}><K.Toggle on small />1x por pessoa a cada</label><K.Select value="7" options={[['7', '7 dias'], ['30', '30 dias'], ['0', 'sempre']]} width={110} small /></div>
          </IgCard>
          {trig !== 'story_reply' && <IgCard title="2 · Resposta pública ao comentário" right={<K.Toggle on={pub} onChange={setPub} small />}>
            {pub ? <>
              {a.publicReplies.map((v, i) => <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'center' }}><input defaultValue={v} style={{ flex: 1, height: 32, padding: '0 10px', borderRadius: 8, border: '1px solid #e5e5e5', fontFamily: K.font, fontSize: 13, outline: 'none' }} /><Icon name="x" size={14} color="#737373" /></div>)}
              <K.Btn small icon="plus" style={{ height: 30, fontSize: 12, alignSelf: 'flex-start' }}>Adicionar variação</K.Btn>
              <div style={{ fontSize: 11.5, color: '#737373' }}>As variações são sorteadas a cada comentário — parece humano e evita bloqueio por repetição.</div>
            </> : <div style={{ fontSize: 12.5, color: '#737373' }}>Desligado — a pessoa recebe só o Direct.</div>}
          </IgCard>}
          <IgCard title={`${n(3)} · Mensagem no Direct${trig !== 'story_reply' ? ' (a isca)' : ''}`}>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>{[['Texto', 'type'], ['Imagem', 'image'], ['Botões', 'mouse-pointer-click'], ['Respostas rápidas', 'reply']].map(([l, ic]) => <K.Btn key={l} small icon={ic} style={{ height: 30, fontSize: 12 }}>{l}</K.Btn>)}</div>
            <textarea defaultValue={a.dm} rows={3} style={{ fontFamily: K.font, fontSize: 13.5, padding: 10, borderRadius: 8, border: '1px solid #e5e5e5', resize: 'vertical', outline: 'none' }} />
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>{['Quero a tabela 📄', 'Falar com consultora'].map((b) => <span key={b} style={{ fontSize: 12, padding: '5px 12px', borderRadius: 999, border: '1px solid #0ea5e9', color: '#0284c7', fontWeight: 500 }}>{b}</span>)}<span style={{ fontSize: 11.5, color: '#a3a3a3', alignSelf: 'center' }}>botões de resposta rápida</span></div>
          </IgCard>
          <IgCard title={`${n(4)} · Sequência (depois que a pessoa interagir)`}>
            {a.sequence.length ? a.sequence.map((s, i) => <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: 10, borderRadius: 8, background: '#f9fafb', fontSize: 13 }}><K.Badge tone="outline" icon="clock">após {s.after}</K.Badge><span>{s.t}</span></div>) : <div style={{ fontSize: 12.5, color: '#737373' }}>Sem sequência — só a isca.</div>}
            <K.Btn small icon="plus" style={{ height: 30, fontSize: 12, alignSelf: 'flex-start' }}>Adicionar passo</K.Btn>
          </IgCard>
          <IgCard title={`${n(5)} · Quando a sequência terminar`}>
            <K.Select value={a.end} options={[[a.end, a.end], ['q', 'Marcar como lead qualificado'], ['n', 'Nada — encerrar']]} width={M ? 260 : 320} small />
            <div style={{ fontSize: 11.5, color: '#737373' }}>No rodízio a conversa cai em Mensagens para a próxima consultora da fila, com o histórico do Direct.</div>
          </IgCard>
        </div>
        <IgPhonePreview a={a} pub={pub} />
      </div>
    </div>
  );
}
// PhonePreview real: alterna "Publicação" (post + comentários) e "Direct"; aqui a simulação roda sozinha para a demonstração.
function IgPhonePreview({ a, pub }) {
  const step = K.useScene(9, 1500);
  const [manual, setManual] = React.useState(null);
  const view = manual || (step < 4 ? 'post' : 'direct');
  const scene = GT.igCommentScene[0];
  const post = GT.igPosts.find((p) => p.id === a.postIds[0]) || GT.igPosts[0];
  const bubbles = [];
  if (step >= 4) bubbles.push({ from: 'biz', t: a.dm });
  if (step >= 5) bubbles.push({ from: 'qr' });
  if (step >= 6) bubbles.push({ from: 'user', t: 'Quero a tabela 📄' });
  if (step >= 7) bubbles.push({ from: 'biz', t: a.sequence[0] ? a.sequence[0].t : 'Obrigada! Já te mando.' });
  if (step >= 8) bubbles.push({ from: 'user', t: 'Quanto fica a grade de 6?' });
  const Bub = ({ b }) => b.from === 'qr'
    ? <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6, flexWrap: 'wrap' }}>{['Quero a tabela 📄', 'Falar com consultora'].map((q) => <span key={q} style={{ fontSize: 12, padding: '4px 12px', borderRadius: 999, border: '1px solid #38bdf8', color: '#0284c7', fontWeight: 500 }}>{q}</span>)}</div>
    : <div className="gt-pop" style={{ display: 'flex', justifyContent: b.from === 'user' ? 'flex-end' : 'flex-start' }}><div style={{ maxWidth: '78%', padding: '8px 12px', borderRadius: 16, fontSize: 13, lineHeight: 1.4, background: b.from === 'user' ? '#0ea5e9' : '#f5f5f5', color: b.from === 'user' ? '#fff' : '#171717', borderBottomRightRadius: b.from === 'user' ? 6 : 16, borderBottomLeftRadius: b.from === 'user' ? 16 : 6 }}>{b.t}</div></div>;
  return (
    <div style={{ position: 'sticky', top: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <K.Tabs size="sm" value={view} onChange={(v) => setManual(v)} tabs={[['post', 'Publicação'], ['direct', 'Direct']]} />
        <span style={{ fontSize: 11.5, color: '#737373', display: 'inline-flex', alignItems: 'center', gap: 4 }}><K.Dot color="#3fc58f" size={6} pulse />simulação ao vivo</span>
      </div>
      <div style={{ margin: '0 auto', width: 340, maxWidth: '100%', height: 640, borderRadius: 32, border: '8px solid #262626', background: '#fff', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0,0,0,.1), 0 8px 10px -6px rgba(0,0,0,.1)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderBottom: '1px solid #e5e5e5', fontSize: 14, fontWeight: 600 }}><Icon name="instagram" size={16} />{view === 'direct' ? 'Direct' : 'Publicação'}</div>
        {view === 'post' ? (
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <div style={{ aspectRatio: '4 / 3', background: post.grad, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ height: 44, width: 44, borderRadius: 999, background: 'rgba(255,255,255,.85)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="play" size={18} /></div></div>
            <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#a3a3a3', letterSpacing: '.06em' }}>COMENTÁRIOS</div>
              {step >= 1 && <div className="gt-pop" style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <div style={{ height: 28, width: 28, borderRadius: 999, background: 'linear-gradient(135deg,#f472b6,#fcd34d)', flexShrink: 0 }}></div>
                <div style={{ minWidth: 0, fontSize: 12 }}>
                  <div><b>{scene.user.replace('@', '')}</b> {scene.text}</div>
                  <div style={{ fontSize: 11, color: '#059669', fontWeight: 500, marginTop: 2 }}>✓ dispara a automação</div>
                  {step >= 2 && pub && <div className="gt-pop" style={{ display: 'flex', gap: 8, marginTop: 8 }}><div style={{ height: 20, width: 20, borderRadius: 999, background: '#262626', flexShrink: 0 }}></div><div><b>{GT.company.slug}</b> {a.publicReplies[0]}</div></div>}
                  {step >= 3 && <div className="gt-pop" style={{ fontSize: 11, color: '#0284c7', marginTop: 4 }}>📩 + mensagem no Direct (veja a outra visão)</div>}
                </div>
              </div>}
              {step === 0 && <div style={{ fontSize: 12, color: '#a3a3a3' }}>aguardando comentário…</div>}
            </div>
          </div>
        ) : (
          <>
            <div style={{ flex: 1, overflowY: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ textAlign: 'center', fontSize: 11, color: '#a3a3a3' }}>respondeu ao comentário de <b style={{ color: '#404040', fontWeight: 500 }}>{scene.user.replace('@', '')}</b></div>
              {bubbles.map((b, i) => <Bub key={i} b={b} />)}
              {step >= 8 && <div className="gt-pop" style={{ textAlign: 'center', fontSize: 11, color: '#2fae7c', marginTop: 4 }}>→ conversa aberta em Mensagens para Ana Silva</div>}
            </div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', padding: 8, borderTop: '1px solid #e5e5e5' }}><div style={{ flex: 1, height: 32, borderRadius: 8, border: '1px solid #e5e5e5', background: '#fafafa', fontSize: 13, color: '#a3a3a3', display: 'flex', alignItems: 'center', padding: '0 10px' }}>Simular resposta do cliente…</div><Icon name="send" size={16} color="#0284c7" /></div>
          </>
        )}
      </div>
    </div>
  );
}
window.Instagram = Instagram;
