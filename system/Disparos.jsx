// GT System — Disparos = DispatchWorkspace do GTR: abas Fluxos · Modelos · Créditos · Configurações.
// Fluxos = FlowsList (linhas com status/gatilho/canais/contadores) e FlowEditor (canvas React Flow com Gatilho/Enviar/Aguardar/Condição/A-B/Tag/Fim + painel "Configurações do fluxo").
// Deep-link: ?tab=disparos&sub=fluxos|modelos|creditos|config ; &editor=1 abre o editor do 1º fluxo.
const dpBRL = (n) => 'R$ ' + Number(n).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const dpFlows = [
  { id: 'f1', name: 'Lançamento com follow-up', status: 'active', trigger: 'Disparo manual', channels: ['WhatsApp', 'SMS'], live: 412, sent7d: 3280, replies: 812, completed: 2868, converted: 96, total: 3280, updated: 'há 2 dias' },
  { id: 'f2', name: 'Recompra 21 dias', status: 'active', trigger: 'Inativo há 21 dias', channels: ['WhatsApp'], live: 233, sent7d: 640, replies: 121, completed: 1607, converted: 61, total: 1840, updated: 'há 5 dias' },
  { id: 'f3', name: 'Pós-venda + avaliação', status: 'paused', trigger: 'Novo pedido', channels: ['WhatsApp', 'E-mail'], live: 0, sent7d: 0, replies: 0, completed: 920, converted: 12, total: 920, updated: 'há 3 semanas' },
  { id: 'f4', name: 'Boas-vindas lead do anúncio', status: 'draft', trigger: 'Novo lead', channels: ['WhatsApp'], live: 0, sent7d: 0, replies: 0, completed: 0, converted: 0, total: 0, updated: 'ontem' },
];
const dpStatus = { active: ['Ativo', '#15803d', 'rgba(63,197,143,.15)', 'rgba(63,197,143,.3)'], paused: ['Pausado', '#a16207', 'rgba(245,158,11,.15)', 'rgba(245,158,11,.3)'], draft: ['Rascunho', '#737373', '#f5f5f5', 'transparent'] };
// grafo do fluxo f1 (posições no canvas 900×440)
const dpNodes = [
  { id: 'n0', type: 'trigger', x: 16, y: 168, label: 'Disparo manual' },
  { id: 'n1', type: 'send', ch: 'whatsapp', x: 190, y: 160, eyebrow: 'Enviar WhatsApp', summary: 'lancamento_colecao', sent: 3280 },
  { id: 'n2', type: 'condition', x: 396, y: 160, title: 'Tocou no botão?', detail: '"Quero ver" · em até 2 dias' },
  { id: 'n3', type: 'send', ch: 'whatsapp', x: 584, y: 40, eyebrow: 'Enviar WhatsApp', summary: 'Catálogo + link da grade · [Ver grade] [Falar com consultora]', sent: 812 },
  { id: 'n4', type: 'wait', x: 584, y: 176, label: 'Aguardar 2 dias' },
  { id: 'n5', type: 'send', ch: 'sms', x: 584, y: 300, eyebrow: 'Enviar SMS', summary: 'Oi {{nome}}, sua grade da coleção nova ainda está reservada…', sent: 640 },
  { id: 'n6', type: 'end', x: 800, y: 48, goal: 'compra' },
  { id: 'n7', type: 'tag', x: 800, y: 176, label: 'lead-quente' },
];
const dpEdges = [['n0', 'n1'], ['n1', 'n2', 'sim'.slice(0, 0)], ['n2', 'n3', 'sim'], ['n2', 'n4', 'não'], ['n4', 'n5', '', 'janela fechada'], ['n3', 'n6'], ['n4', 'n7']];
const dpSize = { trigger: [156, 58], send: [190, 74], condition: [170, 62], wait: [170, 44], end: [140, 58], tag: [160, 44] };
const dpGraphW = 960;

function Disparos() {
  const M = K.M();
  const initial = ['fluxos', 'modelos', 'creditos', 'config'].includes(window.GT_SUB) ? window.GT_SUB : 'fluxos';
  const [tab, setTab] = React.useState(initial);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%', padding: M ? '0 12px' : 0 }}>
      <K.Tabs value={tab} onChange={setTab} tabs={[['fluxos', 'Fluxos'], ['modelos', 'Modelos'], ['creditos', 'Créditos'], ['config', 'Configurações']]} />
      {tab === 'fluxos' && <DpFluxos />}
      {tab === 'modelos' && <DpModelos />}
      {tab === 'creditos' && <DpCreditos />}
      {tab === 'config' && <DpConfig />}
    </div>
  );
}

function DpFluxos() {
  const M = K.M();
  const [editing, setEditing] = React.useState(!M && new URLSearchParams(location.search).get('editor') !== '0' ? 'f1' : null);
  const [status, setStatus] = React.useState('all');
  if (editing) return <DpEditor flow={dpFlows.find((f) => f.id === editing)} onBack={() => setEditing(null)} />;
  const rows = dpFlows.filter((f) => status === 'all' || f.status === status);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
        <div><div style={{ fontSize: 18, fontWeight: 600 }}>Fluxos de disparo</div><div style={{ fontSize: 13.5, color: '#737373', marginTop: 2 }}>Sequências multicanal com gatilhos, condições e teste A/B.</div><div style={{ fontSize: 12, color: '#737373' }}>Comentário no Instagram → Direct fica em <u>Mkt & Ads › Instagram › Automações</u>.</div></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}><span style={{ fontSize: 13, fontWeight: 500 }}>Governança de envio</span><K.Btn icon="zap">Disparo único</K.Btn><K.Btn primary icon="plus">Novo fluxo</K.Btn></div>
      </div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 220, height: 40, borderRadius: 8, border: '1px solid #e5e5e5', background: '#fff', display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px', fontSize: 14, color: '#737373' }}><Icon name="search" size={15} />Buscar fluxo por nome…</div>
        <K.Select value={status} onChange={setStatus} options={[['all', 'Todos os status'], ['active', 'Ativos'], ['paused', 'Pausados'], ['draft', 'Rascunhos']]} width={170} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {rows.map((f) => { const st = dpStatus[f.status]; return (
          <div key={f.id} style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', boxShadow: '0 1px 2px rgba(0,0,0,.05)' }}>
            <button onClick={() => setEditing(f.id)} style={{ flex: 1, minWidth: 220, textAlign: 'left', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: K.font, padding: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}><span style={{ fontSize: 14.5, fontWeight: 500 }}>{f.name}</span><K.Badge color={st[1]} bg={st[2]} style={{ border: '1px solid ' + st[3] }}>{st[0]}</K.Badge><K.Badge tone="outline">{f.trigger}</K.Badge>{f.channels.map((c) => <K.Badge key={c} tone="secondary" style={{ fontSize: 10 }}>{c}</K.Badge>)}</div>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 12, color: '#737373', marginTop: 4 }}>
                {f.total ? <><span><Icon name="users" size={11} /> {f.live} em andamento</span><span>{GT.fmt.num(f.sent7d)} enviados em 7 dias</span>{f.replies > 0 && <span style={{ color: '#0284c7', fontWeight: 500 }}>{f.replies} resposta(s)</span>}<span>{GT.fmt.num(f.completed)} concluídos</span>{f.converted > 0 && <span style={{ color: '#16a34a' }}>{f.converted} conversões ({Math.round(f.converted / f.total * 100)}%)</span>}</> : <span>—</span>}
                <span>atualizado {f.updated}</span>
              </div>
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><K.Btn small icon="activity">Atividade</K.Btn><K.Toggle on={f.status === 'active'} small /><Icon name="more-vertical" size={16} color="#737373" /></div>
          </div>); })}
      </div>
    </div>
  );
}

function DpNode({ n, selected, onClick }) {
  const [w, h] = dpSize[n.type];
  const base = { position: 'absolute', left: n.x, top: n.y, width: w, minHeight: h, borderRadius: 8, border: '1px solid ' + (selected ? '#3fc58f' : '#e5e5e5'), background: '#fff', boxShadow: selected ? '0 0 0 2px rgba(63,197,143,.5)' : '0 1px 2px rgba(0,0,0,.05)', padding: '8px 12px', cursor: 'pointer', textAlign: 'left', fontFamily: K.font, color: '#171717' };
  const eyebrow = { fontSize: 10, textTransform: 'uppercase', letterSpacing: '.05em', color: '#737373' };
  const Handle = ({ side, color = '#737373', top = '50%' }) => <span style={{ position: 'absolute', [side]: -5, top, transform: 'translateY(-50%)', height: 10, width: 10, borderRadius: 999, background: color, border: '2px solid #fff' }}></span>;
  if (n.type === 'trigger') return <button onClick={onClick} style={{ ...base, borderStyle: 'dashed', background: 'rgba(63,197,143,.05)' }}><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Icon name="zap" size={16} color="#3fc58f" /><div><div style={eyebrow}>Gatilho</div><div style={{ fontSize: 14, fontWeight: 500 }}>{n.label}</div></div></div><Handle side="right" color="#3fc58f" /></button>;
  if (n.type === 'send') return <button onClick={onClick} style={base}><Handle side="left" /><div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}><Icon name={n.ch === 'sms' ? 'smartphone' : 'message-square'} size={16} color={n.ch === 'sms' ? '#0284c7' : '#16a34a'} /><div style={{ minWidth: 0 }}><div style={eyebrow}>{n.eyebrow}</div><div style={{ fontSize: 13.5, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{n.summary}</div>{n.sent > 0 && <div style={{ fontSize: 10, color: '#737373', marginTop: 2, display: 'flex', alignItems: 'center', gap: 3 }}><Icon name="circle-check" size={10} color="#737373" />{GT.fmt.num(n.sent)} enviados</div>}</div></div><Handle side="right" color="#3fc58f" /></button>;
  if (n.type === 'condition') return <button onClick={onClick} style={base}><Handle side="left" /><div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}><Icon name="split" size={16} color="#f59e0b" /><div><div style={eyebrow}>Condição</div><div style={{ fontSize: 14, fontWeight: 500 }}>{n.title}</div><div style={{ fontSize: 11.5, color: '#737373' }}>{n.detail}</div></div></div><Handle side="right" color="#16a34a" top="35%" /><Handle side="right" color="#dc2626" top="70%" /></button>;
  if (n.type === 'wait') return <button onClick={onClick} style={base}><Handle side="left" /><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Icon name="clock" size={16} color="#737373" /><div style={{ fontSize: 14, fontWeight: 500 }}>{n.label}</div></div><Handle side="right" color="#3fc58f" /></button>;
  if (n.type === 'tag') return <button onClick={onClick} style={base}><Handle side="left" /><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Icon name="tag" size={16} color="#3fc58f" /><div style={{ fontSize: 14, fontWeight: 500 }}>Tag: {n.label}</div></div><Handle side="right" color="#3fc58f" /></button>;
  return <button onClick={onClick} style={{ ...base, background: '#f5f5f5' }}><Handle side="left" /><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Icon name="flag" size={16} color="#171717" /><div><div style={{ fontSize: 14, fontWeight: 500 }}>Fim</div><div style={{ fontSize: 11.5, color: '#737373' }}>meta: {n.goal}</div></div></div></button>;
}
function DpCanvas({ sel, onSel }) {
  // "fit view" do React Flow: o grafo tem 1100×440 e é ESCALADO para caber na largura do canvas
  const ref = React.useRef(null);
  const [scale, setScale] = React.useState(.7);
  React.useEffect(() => { const f = () => { if (ref.current) setScale(Math.max(.42, Math.min(1, (ref.current.clientWidth - 24) / dpGraphW))); }; f(); window.addEventListener('resize', f); return () => window.removeEventListener('resize', f); }, []);
  const pos = (id) => { const n = dpNodes.find((x) => x.id === id); const [w, h] = dpSize[n.type]; return { n, w, h }; };
  const edge = ([a, b, lbl, note], i) => {
    const A = pos(a), B = pos(b);
    const y0 = A.n.type === 'condition' ? A.n.y + A.h * (lbl === 'sim' ? .35 : .70) : A.n.y + A.h / 2;
    const x0 = A.n.x + A.w, x1 = B.n.x, y1 = B.n.y + B.h / 2, cx = (x0 + x1) / 2;
    const col = lbl === 'sim' ? '#16a34a' : lbl === 'não' ? '#dc2626' : '#a3a3a3';
    return <g key={i}><path d={`M ${x0} ${y0} C ${cx} ${y0}, ${cx} ${y1}, ${x1} ${y1}`} fill="none" stroke={col} strokeWidth="1.5" />{lbl && <text x={cx} y={(y0 + y1) / 2 - 6} textAnchor="middle" fontSize="11" fill={col} fontFamily="Inter, sans-serif" fontWeight="600">{lbl}</text>}{note && <text x={cx} y={(y0 + y1) / 2 - 6} textAnchor="middle" fontSize="11" fill="#7c3aed" fontFamily="Inter, sans-serif">{note}</text>}</g>;
  };
  return (
    <div ref={ref} style={{ position: 'relative', minHeight: 500, borderRadius: 12, border: '1px solid #e5e5e5', background: '#fafafa', backgroundImage: 'radial-gradient(#d4d4d4 1px, transparent 1px)', backgroundSize: '16px 16px', overflow: 'hidden' }}>
      <div style={{ position: 'relative', width: dpGraphW, height: 440, transform: `scale(${scale})`, transformOrigin: 'top left', margin: '52px 12px 0' }}>
        <svg width={dpGraphW} height="440" style={{ position: 'absolute', inset: 0 }}>{dpEdges.map(edge)}</svg>
        {dpNodes.map((n) => <DpNode key={n.id} n={n} selected={sel === n.id} onClick={() => onSel(n.id)} />)}
      </div>
      <div style={{ position: 'absolute', left: 12, bottom: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>{['plus', 'minus', 'maximize-2'].map((i) => <span key={i} style={{ height: 28, width: 28, borderRadius: 6, border: '1px solid #e5e5e5', background: '#fff', display: 'grid', placeItems: 'center' }}><Icon name={i} size={13} /></span>)}</div>
      <div style={{ position: 'absolute', right: 12, bottom: 12, fontSize: 11, color: '#737373', background: '#fff', border: '1px solid #e5e5e5', borderRadius: 6, padding: '3px 8px' }}>{Math.round(scale * 100)}% · {dpNodes.length} passos</div>
      <div style={{ position: 'absolute', left: 12, right: 12, top: 12, display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}><span style={{ fontSize: 12, color: '#737373', marginRight: 4 }}>Adicionar passo</span>{[['Enviar', 'send'], ['Aguardar', 'clock'], ['Condição', 'split'], ['A/B', 'shuffle'], ['Tag', 'tag'], ['Fim', 'flag']].map(([l, ic]) => <span key={l} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, height: 28, padding: '0 10px', borderRadius: 999, border: '1px solid #e5e5e5', background: '#fff', fontSize: 12 }}><Icon name={ic} size={12} />{l}</span>)}</div>
    </div>
  );
}
function DpEditor({ flow, onBack }) {
  const M = K.M();
  const [sel, setSel] = React.useState(null);
  const node = dpNodes.find((n) => n.id === sel);
  const Field = ({ label, children, hint }) => <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}><div style={{ fontSize: 13, fontWeight: 500 }}>{label}</div>{children}{hint && <div style={{ fontSize: 11.5, color: '#737373' }}>{hint}</div>}</div>;
  const Sw = ({ label, hint, on = true }) => <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}><div><div style={{ fontSize: 13, fontWeight: 500 }}>{label}</div><div style={{ fontSize: 11.5, color: '#737373' }}>{hint}</div></div><K.Toggle on={on} small /></div>;
  const st = dpStatus[flow.status];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><button onClick={onBack} style={{ height: 36, width: 36, borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', display: 'grid', placeItems: 'center' }}><Icon name="arrow-left" size={16} /></button><input defaultValue={flow.name} style={{ height: 36, width: M ? 200 : 280, padding: '0 12px', borderRadius: 8, border: '1px solid #e5e5e5', fontFamily: K.font, fontSize: 14, fontWeight: 500, outline: 'none' }} /><K.Badge color={st[1]} bg={st[2]} style={{ border: '1px solid ' + st[3] }}>{st[0]}</K.Badge></div>
        <div style={{ display: 'flex', gap: 8 }}><K.Btn small icon="download">Salvar</K.Btn><K.Btn small icon="pause" style={{ background: '#f5f5f5', border: '1px solid #f5f5f5' }}>Pausar</K.Btn><K.Btn small primary icon="play">Ativar</K.Btn></div>
      </div>
      <div style={{ display: 'flex', gap: 10, fontSize: 12, color: '#404040', background: 'rgba(245,158,11,.1)', border: '1px solid rgba(245,158,11,.3)', borderRadius: 8, padding: '6px 12px' }}>Custo estimado: <b>até R$ 0,42/contato</b> (R$ 0,32 WhatsApp marketing + R$ 0,10 SMS) · 3.280 contatos ≈ R$ 1.378</div>
      <div style={{ display: 'grid', gridTemplateColumns: M ? '1fr' : 'minmax(0,1fr) 340px', gap: 12, alignItems: 'start' }}>
        <DpCanvas sel={sel} onSel={(id) => setSel(id === sel ? null : id)} />
        <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {node ? <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><div style={{ fontSize: 15, fontWeight: 600 }}>{node.type === 'send' ? node.eyebrow : node.type === 'condition' ? 'Condição' : node.type === 'wait' ? 'Aguardar' : node.type === 'trigger' ? 'Gatilho' : node.type === 'tag' ? 'Tag' : 'Fim'}</div><button onClick={() => setSel(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}><Icon name="x" size={16} /></button></div>
            {node.type === 'send' && <>
              <Field label="Canal"><K.Tabs size="sm" value={node.ch} onChange={() => {}} tabs={[['whatsapp', 'WhatsApp'], ['sms', 'SMS'], ['email', 'E-mail']]} /></Field>
              {node.ch === 'whatsapp' && node.id === 'n1' && <Field label="Template do WhatsApp" hint="Templates aprovados pela Meta abrem a janela de 24h."><K.Select value="t1" options={GT.templates.map((t) => [t.id, t.name + ' · ' + t.status])} width="100%" small /></Field>}
              {node.ch === 'whatsapp' && node.id !== 'n1' && <Field label="Mensagem" hint="Texto livre — só dentro da janela de 24h. Fora dela, o fluxo usa a regra 'Texto livre com a janela fechada'."><div style={{ minHeight: 70, borderRadius: 8, border: '1px solid #e5e5e5', padding: 10, fontSize: 13 }}>Aqui está o catálogo da coleção nova 💚 Grade P ao GG · R$ 389. Quer que eu monte a sua?</div></Field>}
              {node.ch === 'whatsapp' && <Field label="Botões de resposta (opcional)" hint="Cada botão vira uma saída na Condição 'Tocou no botão?'."><div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>{(node.id === 'n1' ? GT.templates[0].buttons : ['Ver grade', 'Falar com consultora']).map((b) => <K.Badge key={b} tone="outline">{b}</K.Badge>)}<K.Badge tone="secondary" icon="plus">botão</K.Badge></div></Field>}
              {node.ch === 'sms' && <Field label="SMS" hint='160 caracteres · rodapé "SAIR p/ parar" automático · R$ 0,10/envio'><div style={{ minHeight: 60, borderRadius: 8, border: '1px solid #e5e5e5', padding: 10, fontSize: 13 }}>{node.summary}</div></Field>}
              <div style={{ fontSize: 12, color: '#737373', borderTop: '1px solid #e5e5e5', paddingTop: 10 }}><b style={{ color: '#171717' }}>{GT.fmt.num(node.sent)}</b> enviados · 96% entregues · 78% lidos</div>
            </>}
            {node.type === 'condition' && <><Field label="Tipo de condição"><K.Select value="btn" options={[['btn', 'Tocou no botão'], ['reply', 'Respondeu'], ['bought', 'Comprou'], ['tag', 'Tem a tag']]} width="100%" small /></Field><Field label="Mensagem observada"><K.Select value="n1" options={[['n1', 'Enviar WhatsApp · lancamento_colecao']]} width="100%" small /></Field><Field label="Botão"><K.Select value="q" options={[['q', 'Quero ver'], ['d', 'Depois']]} width="100%" small /></Field><Field label="Esperar até"><K.Select value="2d" options={[['2d', '2 dias'], ['1d', '1 dia'], ['6h', '6 horas']]} width="100%" small /></Field><div style={{ fontSize: 12, color: '#737373' }}>Saída <b style={{ color: '#16a34a' }}>sim</b> = tocou · <b style={{ color: '#dc2626' }}>não</b> = passou o prazo sem tocar.</div></>}
            {node.type === 'wait' && <Field label="Aguardar"><div style={{ display: 'flex', gap: 8 }}><K.Select value="2" options={[['2', '2'], ['1', '1'], ['3', '3']]} width={80} small /><K.Select value="d" options={[['d', 'dias'], ['h', 'horas'], ['m', 'minutos']]} width={120} small /></div></Field>}
            {node.type === 'trigger' && <Field label="Gatilho"><K.Select value="manual" options={[['manual', 'Disparo manual'], ['new_order', 'Novo pedido'], ['new_lead', 'Novo lead'], ['tag_added', 'Tag adicionada'], ['inactive_days', 'Inativo há X dias']]} width="100%" small /></Field>}
            {node.type === 'tag' && <Field label="Qual tag adicionar?"><K.Select value="lq" options={[['lq', 'lead-quente'], ['vip', 'vip']]} width="100%" small /></Field>}
            {node.type === 'end' && <Field label="Meta atingida (opcional)" hint="Contatos que chegam aqui contam como conversão."><K.Select value="compra" options={[['compra', 'compra'], ['resposta', 'resposta'], ['none', 'sem meta']]} width="100%" small /></Field>}
            <K.Btn small danger icon="trash-2" style={{ alignSelf: 'flex-start' }}>Excluir passo</K.Btn>
          </> : <>
            <div style={{ fontSize: 15, fontWeight: 600 }}>Configurações do fluxo</div>
            <Field label="Gatilho"><K.Select value="manual" options={[['manual', 'Disparo manual'], ['new_order', 'Novo pedido'], ['new_lead', 'Novo lead'], ['tag_added', 'Tag adicionada'], ['inactive_days', 'Inativo há X dias']]} width="100%" small /></Field>
            <Field label="Reentrada"><K.Select value="never" options={[['never', 'Nunca reentrar (1 vez por contato)'], ['after', 'Pode reentrar depois de X dias']]} width="100%" small /></Field>
            <Field label="Limite de envios por dia (opcional)"><div style={{ height: 36, borderRadius: 8, border: '1px solid #e5e5e5', display: 'flex', alignItems: 'center', padding: '0 12px', fontSize: 13 }}>500</div></Field>
            <Sw label="Sair ao comprar" hint="Quem comprar sai do fluxo na hora." />
            <Sw label="Pausar ao responder" hint="Se o contato responder no WhatsApp, ele para de receber e a conversa vai para a consultora." />
            <Field label="Quando a janela de atendimento fechar"><K.Select value="template" options={[['stop', 'Parar o fluxo (sem custo)'], ['template', 'Continuar por template (reabre, mas custa)']]} width="100%" small /></Field>
            <Field label="Texto livre com a janela de atendimento fechada"><K.Select value="sms" options={[['nunca', 'Não usar texto livre fora da janela'], ['stop', 'Encerrar o fluxo neste passo (sem custo)'], ['template', 'Trocar pelo template de reabertura (custa)'], ['sms', 'Mandar por SMS (R$ 0,10)']]} width="100%" small /></Field>
            <div style={{ fontSize: 12, color: '#737373', borderTop: '1px solid #e5e5e5', paddingTop: 10 }}>Clique num passo do fluxo para editá-lo.</div>
          </>}
        </div>
      </div>
    </div>
  );
}

function DpModelos() {
  const M = K.M();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <div><div style={{ fontSize: 18, fontWeight: 600 }}>Modelos</div><div style={{ fontSize: 13.5, color: '#737373' }}>Templates do WhatsApp (aprovados pela Meta), SMS e e-mail que os fluxos usam.</div></div>
        <div style={{ display: 'flex', gap: 8 }}><K.Select value="all" options={[['all', 'Todos os canais'], ['wa', 'WhatsApp'], ['sms', 'SMS'], ['email', 'E-mail']]} width={160} small /><K.Btn primary small icon="plus">Novo modelo</K.Btn></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: M ? '1fr' : 'repeat(2,minmax(0,1fr))', gap: 12 }}>
        {GT.templates.map((t) => (
          <div key={t.id} style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><K.Badge tone="secondary" icon="message-square">Template do WhatsApp</K.Badge><span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 13 }}>{t.name}</span></div><K.Badge tone={t.status === 'Aprovado' ? 'cliente' : 'pendente'}>{t.status}</K.Badge></div>
            <div style={{ fontSize: 12, color: '#737373' }}>{t.category} · {t.lang} · {t.category === 'Marketing' ? 'R$ 0,32' : 'R$ 0,08'}/envio · <span style={{ color: '#a16207' }}>{t.category === 'Marketing' ? 'fora da janela de 24h' : 'utilidade'}</span></div>
            <div style={{ background: '#efeae2', borderRadius: 10, padding: 10 }}><div style={{ background: '#fff', borderRadius: 8, padding: '8px 10px', fontSize: 13, lineHeight: 1.45, maxWidth: 320 }}>{t.body}</div><div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>{t.buttons.map((b) => <span key={b} style={{ flex: 1, minWidth: 100, textAlign: 'center', background: '#fff', borderRadius: 8, padding: '6px 8px', fontSize: 12.5, color: '#0284c7', fontWeight: 500 }}>{b}</span>)}</div></div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}><K.Btn small ghost icon="pencil">Editar</K.Btn><K.Btn small ghost icon="copy">Duplicar</K.Btn></div>
          </div>
        ))}
        <div style={{ border: '1px dashed #d4d4d4', borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 8, justifyContent: 'center', color: '#737373', fontSize: 13 }}><K.Badge tone="secondary" icon="smartphone" style={{ alignSelf: 'flex-start' }}>SMS</K.Badge><div style={{ fontFamily: 'ui-monospace, monospace', color: '#171717' }}>reserva_grade_sms</div><div>Oi {'{{nome}}'}, sua grade da coleção nova ainda está reservada. Responda SIM para confirmar. SAIR p/ parar</div></div>
      </div>
    </div>
  );
}

function DpCreditos() {
  const M = K.M();
  const Card = ({ title, children, icon }) => <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 12, padding: 16, boxShadow: '0 1px 2px rgba(0,0,0,.05)' }}><div style={{ fontSize: 13, fontWeight: 500, color: '#737373', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>{icon && <Icon name={icon} size={14} color="#737373" />}{title}</div>{children}</div>;
  const c = GT.credits;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: M ? '1fr' : 'repeat(3,minmax(0,1fr))', gap: 12 }}>
        <Card title="Saldo de créditos" icon="wallet"><div style={{ fontSize: 24, fontWeight: 600 }}>{dpBRL(c.balance / 100 * 1)}</div><div style={{ fontSize: 11.5, color: '#737373', marginTop: 4 }}>alerta de saldo baixo em R$ 50,00</div></Card>
        <Card title="Consumo do mês"><div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13.5 }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><span>WhatsApp (templates)</span><b>{dpBRL(c.monthUsed * .32 / 100 * 10)}</b></div><div style={{ display: 'flex', justifyContent: 'space-between' }}><span>SMS</span><b>{dpBRL(64)}</b></div><div style={{ display: 'flex', justifyContent: 'space-between' }}><span>E-mail</span><b>{dpBRL(0)}</b></div></div><div style={{ fontSize: 11, color: '#737373', marginTop: 6 }}>Texto livre dentro da janela de 24h não custa nada.</div></Card>
        <Card title="Recargas do mês"><div style={{ fontSize: 24, fontWeight: 600 }}>{dpBRL(500)}</div><div style={{ fontSize: 11, color: '#737373', marginTop: 4 }}>1 recarga por Pix · 03/09</div></Card>
      </div>
      <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 12, padding: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}><Icon name="banknote" size={15} />Comprar créditos por Pix</div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', marginTop: 10, flexWrap: 'wrap' }}><div><div style={{ fontSize: 12, color: '#737373', marginBottom: 6 }}>Valor (R$ 20 a R$ 5.000)</div><div style={{ height: 40, width: 160, borderRadius: 8, border: '1px solid #e5e5e5', display: 'flex', alignItems: 'center', padding: '0 12px', fontSize: 14 }}>R$ 300,00</div></div><K.Btn primary icon="qr-code">Gerar Pix copia e cola</K.Btn><span style={{ fontSize: 12, color: '#737373' }}>Assim que o pagamento cair, o saldo é creditado sozinho.</span></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: M ? '1fr' : '1fr 1fr', gap: 12 }}>
        <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 12, padding: 16 }}><div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Preços por envio</div><K.Table dense cols={[{ h: 'Canal', k: 'c' }, { h: 'centavos/envio', align: 'right', k: 'v' }]} rows={[{ c: 'WhatsApp · marketing', v: '32' }, { c: 'WhatsApp · utilidade', v: '8' }, { c: 'WhatsApp · texto livre (janela aberta)', v: '0' }, { c: 'SMS', v: '10' }, { c: 'E-mail', v: '1' }]} /></div>
        <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 12, padding: 16 }}><div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Extrato</div><K.Table dense cols={[{ h: 'Data', k: 'd' }, { h: 'Descrição', k: 'x', wrap: true }, { h: 'Valor', align: 'right', cell: (r) => <span style={{ color: r.v < 0 ? '#dc2626' : '#16a34a', fontWeight: 500 }}>{(r.v < 0 ? '−' : '+') + dpBRL(Math.abs(r.v))}</span> }]} rows={[{ d: '12/09', x: 'Lançamento com follow-up · 121 WhatsApp', v: -38.72 }, { d: '11/09', x: 'Recompra 21 dias · 84 WhatsApp', v: -26.88 }, { d: '09/09', x: 'Aviso SMS · 640 envios', v: -64 }, { d: '03/09', x: 'Recarga via Pix', v: 500 }, { d: '01/09', x: 'Estorno · 12 falhas de entrega', v: 3.84 }]} /></div>
      </div>
    </div>
  );
}

function DpConfig() {
  const M = K.M();
  const Sec = ({ title, children }) => <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}><div style={{ fontSize: 14, fontWeight: 600 }}>{title}</div>{children}</div>;
  const F = ({ label, v, w }) => <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}><div style={{ fontSize: 12, color: '#737373' }}>{label}</div><div style={{ height: 36, width: w || '100%', borderRadius: 8, border: '1px solid #e5e5e5', display: 'flex', alignItems: 'center', padding: '0 12px', fontSize: 13 }}>{v}</div></div>;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: M ? '1fr' : '1fr 1fr', gap: 12, alignItems: 'start' }}>
      <Sec title="Governança geral">
        <div style={{ fontSize: 12, fontWeight: 500 }}>Horário de silêncio</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}><F label="Início" v="20:00" /><F label="Fim" v="08:00" /><F label="Fuso horário" v="America/Fortaleza" /></div>
        <F label="Canais que respeitam o silêncio" v="WhatsApp, SMS, E-mail" />
        <F label="Intervalo mínimo entre mensagens ao mesmo contato (min)" v="120" w={120} />
        <F label="Alerta de saldo baixo (R$)" v="50,00" w={120} />
        <F label="Base legal da sua lista (LGPD)" v="Clientes e leads que falaram com a loja pelo WhatsApp (legítimo interesse)" />
      </Sec>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Sec title="Canal SMS"><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><div><div style={{ fontSize: 13, fontWeight: 500 }}>SMS habilitado</div><div style={{ fontSize: 11.5, color: '#737373' }}>R$ 0,10 por envio · saldo próprio</div></div><K.Toggle on small /></div><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><div><div style={{ fontSize: 13, fontWeight: 500 }}>Rodapé "SAIR p/ parar"</div><div style={{ fontSize: 11.5, color: '#737373' }}>Quem responder SAIR entra na lista de bloqueio.</div></div><K.Toggle on small /></div></Sec>
        <Sec title="Canal E-mail"><F label="Nome do remetente" v="Moda Fashion" /><F label="Responder para (Reply-To)" v="contato@modafashion.com.br" /></Sec>
        <K.Btn primary style={{ alignSelf: 'flex-start' }}>Salvar</K.Btn>
      </div>
    </div>
  );
}
window.Disparos = Disparos;
