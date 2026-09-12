// GT System — Mensagens. Estrutura = pages/Messages.tsx do GTR: seletor "Todas instâncias" (é aqui que os VÁRIOS NÚMEROS aparecem),
// lista (ConversationList: avatar verde-claro + selo do canal + emoji de temperatura · nome · última msg · badge Cliente/Pendente/Qualificado · tempo de resposta · não lidas),
// conversa (ChatPanel: cabeçalho nome/telefone/badge · balões · abas Mensagem/Nota interna · composer) e "Informações do Contato" (ContactSidebar).
// Disparos vive como sub-item da sidebar (?tab=disparos) e renderiza <Disparos/>.
const cvClient = { 1: { total: 12480, ticket: 1560, orders: 8, last: '09/09/26', tier: 'Ouro', month: true }, 3: { total: 7494, ticket: 242, orders: 31, last: '08/09/26', tier: 'Prata' }, 6: { total: 21900, ticket: 1825, orders: 12, last: '11/09/26', tier: 'Ouro' }, 9: { total: 3120, ticket: 390, orders: 8, last: '02/09/26', tier: 'Prata' }, 8: { total: 1240, ticket: 620, orders: 2, last: '30/08/26', tier: 'Bronze' } };
const cvResp = { 1: ['agora', 'ok'], 2: ['1min', 'ok'], 3: ['agora', 'ok'], 4: ['2min', 'ok'], 5: ['3min', 'ok'], 6: ['5min', 'warn'], 7: ['13min', 'bad'], 8: ['1min', 'ok'], 9: ['agora', 'ok'], 10: ['4min', 'ok'], 11: ['', ''] };
const cvBadge = (c) => c.group ? ['Grupo', 'secondary'] : cvClient[c.id] ? ['Cliente', 'cliente'] : c.qual === 'qualified' ? ['Qualificado', 'qualificado'] : ['Pendente', 'pendente'];
const cvTemp = { hot: '🔥', cold: '❄️', frozen: '🧊' };
const cvSummary = { 1: ['Cliente recorrente pediu a grade completa do vestido midi; interessada nas 3 cores.', 'Enviar link de pagamento da grade P ao GG (terracota, off-white, verde).', 'Sem objeções · decisão tomada'], 2: ['Lead novo vindo do link da bio perguntando o pedido mínimo.', 'Responder o mínimo (1 grade) e pedir a cidade para calcular frete.', 'Objeção provável: valor mínimo'], 4: ['Comentou "quero" no post do conjunto linho e recebeu a tabela pela automação.', 'Responder o preço da grade de 6 e oferecer montar o pedido.', '—'] };
const cvAiReply = { 1: 'Patrícia, monto a grade mista com as 3 cores pra você? Acima de 3 grades o frete é por nossa conta 😉', 2: 'O mínimo é 1 grade (6 peças) por R$ 389. Me diz sua cidade que já calculo o frete!', 4: 'A grade de 6 sai por R$ 389 💚 Levando 2, a segunda vai com 5% off. Monto pra você?' };

function CvList({ rows, sel, onOpen, chipId, onChip, filter, onFilter, unread }) {
  const M = K.M();
  const opts = [['all', 'Todas instâncias'], ...GT.chips.map((c) => [c.id, c.label])];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      {/* seletor de instância (número) — como no real, no topo da lista */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderBottom: '1px solid #e5e5e5', background: 'rgba(245,245,245,.4)' }}>
        <Icon name="smartphone" size={16} color="#737373" />
        <K.Select value={chipId} onChange={onChip} options={opts} width={M ? 200 : 190} small />
        {chipId !== 'all' && <K.Dot color={GT.chip(chipId).health === 'ok' ? '#22c55e' : '#eab308'} size={8} />}
        <div style={{ marginLeft: 'auto', fontSize: 11.5, color: '#737373', whiteSpace: 'nowrap' }}>{GT.chips.filter((c) => c.status === 'connected').length} conectados</div>
      </div>
      <div style={{ padding: '14px 12px 10px', borderBottom: '1px solid #e5e5e5', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 17, fontWeight: 600 }}><Icon name="message-square" size={18} color="#3fc58f" />Conversas</div>
          <Icon name="tag" size={18} color="#404040" />
        </div>
        <div style={{ position: 'relative' }}><span style={{ position: 'absolute', left: 10, top: 9 }}><Icon name="search" size={15} color="#737373" /></span><input placeholder="Buscar conversa..." style={{ width: '100%', height: 36, padding: '0 12px 0 32px', borderRadius: 8, border: '1px solid #e5e5e5', fontFamily: K.font, fontSize: 14, outline: 'none', background: '#fff' }} /></div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 2, background: '#f5f5f5', borderRadius: 8, padding: 3 }}>
          {[['all', 'Todos'], ['unread', 'Não lidos'], ['leads', 'Leads'], ['clients', 'Clientes']].map(([k, l]) => <button key={k} onClick={() => onFilter(k)} style={{ height: 26, fontSize: 12, fontWeight: 500, borderRadius: 6, border: 'none', background: filter === k ? '#fff' : 'transparent', color: filter === k ? '#171717' : '#737373', boxShadow: filter === k ? '0 1px 2px rgba(0,0,0,.08)' : 'none', cursor: 'pointer', fontFamily: K.font }}>{l}</button>)}
        </div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
        {rows.map((c) => {
          const on = c.id === sel, [bl, bt] = cvBadge(c), r = cvResp[c.id] || ['', ''], n = unread[c.id] || 0;
          const waiting = r[1] === 'bad';
          return (
            <div key={c.id} className={c._pop ? 'gt-pop' : ''} onClick={() => onOpen(c.id)} style={{ display: 'flex', gap: 12, padding: '12px 14px', borderBottom: '1px solid #f0f0f0', cursor: 'pointer', background: on ? 'rgba(63,197,143,.08)' : waiting ? '#fef2f2' : '#fff', borderLeft: on ? '3px solid #3fc58f' : '3px solid transparent' }}>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <K.Avatar initials={c.initials} size={40} channel={c.channel} />
                {c.temp && <span style={{ position: 'absolute', bottom: -4, right: -6, fontSize: 13 }}>{cvTemp[c.temp]}</span>}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                  <div style={{ fontSize: 15, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}{cvClient[c.id] && cvClient[c.id].tier === 'Ouro' ? ' 💙' : ''}</div>
                  <div style={{ fontSize: 12, color: waiting ? '#dc2626' : '#737373', whiteSpace: 'nowrap' }}>{c.time}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginTop: 3 }}>
                  <div style={{ fontSize: 13, color: '#737373', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.last}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                    <K.Badge tone={bt}>{bl}</K.Badge>
                    {r[0] && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 11.5, color: r[1] === 'bad' ? '#dc2626' : r[1] === 'warn' ? '#a16207' : '#737373' }}><Icon name="clock" size={11} />{r[0]}</span>}
                    {n > 0 && <span style={{ minWidth: 20, height: 20, borderRadius: 999, background: '#3fc58f', color: '#fff', fontSize: 11.5, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 6px' }}>{n}</span>}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {!rows.length && <K.Empty icon="message-square" title="Nenhuma conversa" sub="Nada por aqui com esse filtro." />}
      </div>
    </div>
  );
}

function CvBubble({ m, channel }) {
  const me = m.k === 'me';
  return (
    <div style={{ display: 'flex', justifyContent: me ? 'flex-end' : 'flex-start', alignItems: 'flex-end', gap: 6 }}>
      {!me && <Icon name="ellipsis" size={14} color="#a3a3a3" style={{ marginBottom: 12, transform: 'rotate(90deg)' }} />}
      <div style={{ maxWidth: '78%', padding: '8px 12px', borderRadius: 12, fontSize: 14, lineHeight: 1.45, background: me ? '#3fc58f' : '#f5f5f5', color: me ? '#fff' : '#171717', borderBottomRightRadius: me ? 4 : 12, borderBottomLeftRadius: me ? 12 : 4 }}>
        {(m.auto || m.template) && <div style={{ fontSize: 10.5, opacity: .85, display: 'flex', alignItems: 'center', gap: 4, marginBottom: 3 }}><Icon name={m.auto ? 'bot' : 'badge-check'} size={11} color={me ? '#fff' : '#3fc58f'} />{m.auto ? 'Automação' : 'Template aprovado'}</div>}
        <span>{m.t}</span>
        <span style={{ fontSize: 10.5, opacity: .8, marginLeft: 8, whiteSpace: 'nowrap' }}>{m.time}{me && ' ✓✓'}</span>
      </div>
      {me && <Icon name="ellipsis" size={14} color="#a3a3a3" style={{ marginBottom: 12, transform: 'rotate(90deg)' }} />}
    </div>
  );
}

function CvChat({ c, extra, onSend, onBack, onTogglePanel, panelOpen }) {
  const M = K.M();
  const [tab, setTab] = React.useState('msg');
  const [draft, setDraft] = React.useState('');
  const [bl, bt] = cvBadge(c);
  const chip = GT.chip(c.chipId);
  const msgs = [...c.messages, ...(extra || [])];
  const ref = React.useRef(null);
  React.useEffect(() => { if (ref.current) ref.current.scrollTop = ref.current.scrollHeight; }, [c.id, msgs.length]);
  const windowOpen = c.temp !== 'frozen';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, background: '#fff' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderBottom: '1px solid #e5e5e5' }}>
        {M && <button onClick={onBack} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex' }}><Icon name="arrow-left" size={20} /></button>}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 16, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}{cvClient[c.id] && cvClient[c.id].tier === 'Ouro' ? ' 💙' : ''}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: '#737373', flexWrap: 'wrap' }}>
            <span>{c.phone}</span><K.Badge tone={bt}>{bl}</K.Badge>
            {chip && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><K.ChannelChip channel={c.channel} size={12} />{chip.label}{chip.channel === 'whatsapp' ? ' · ' + chip.short : ''}</span>}
          </div>
        </div>
        <button onClick={onTogglePanel} title="Informações do contato" style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex' }}><Icon name="user" size={18} color="#404040" /></button>
        <Icon name="more-vertical" size={18} color="#404040" />
      </div>
      <div ref={ref} style={{ flex: 1, overflowY: 'auto', minHeight: 0, padding: 16, display: 'flex', flexDirection: 'column', gap: 10, background: '#fafafa' }}>
        {c.group && <div style={{ alignSelf: 'center', fontSize: 11.5, color: '#737373', background: '#fff', border: '1px solid #e5e5e5', borderRadius: 999, padding: '3px 10px' }}>Grupo interno da equipe</div>}
        {msgs.map((m, i) => <CvBubble key={i} m={m} channel={c.channel} />)}
      </div>
      <div style={{ borderTop: '1px solid #e5e5e5', padding: '10px 12px 12px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {[['msg', 'Mensagem', 'message-square'], ['note', 'Nota interna', 'file-text']].map(([k, l, ic]) => <button key={k} onClick={() => setTab(k)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 30, padding: '0 12px', borderRadius: 8, border: 'none', background: tab === k ? 'rgba(63,197,143,.15)' : 'transparent', color: tab === k ? '#2fae7c' : '#737373', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: K.font }}><Icon name={ic} size={14} color={tab === k ? '#2fae7c' : '#737373'} />{l}</button>)}
          {!c.group && (windowOpen
            ? <span style={{ marginLeft: 'auto', fontSize: 11.5, color: '#737373', display: 'inline-flex', alignItems: 'center', gap: 4 }}><K.Dot color="#22c55e" size={6} />janela de 24h aberta</span>
            : <span style={{ marginLeft: 'auto', fontSize: 11.5, color: '#a16207', display: 'inline-flex', alignItems: 'center', gap: 4 }}><Icon name="lock" size={11} color="#a16207" />janela fechada · só template</span>)}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon name="paperclip" size={18} color="#404040" />
          <Icon name="file-text" size={18} color="#404040" />
          <Icon name="smile" size={18} color="#404040" />
          <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && draft.trim()) { onSend(draft.trim()); setDraft(''); } }} placeholder={tab === 'note' ? 'Nota interna (só a equipe vê)...' : windowOpen ? 'Mensagem...' : 'Escolha um template aprovado'} disabled={!windowOpen && tab === 'msg'} style={{ flex: 1, height: 40, padding: '0 12px', borderRadius: 8, border: '1px solid #e5e5e5', fontFamily: K.font, fontSize: 14, outline: 'none', background: '#fff', minWidth: 0 }} />
          <button onClick={() => { if (draft.trim()) { onSend(draft.trim()); setDraft(''); } }} style={{ height: 40, width: 40, borderRadius: 8, border: 'none', background: '#3fc58f', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}><Icon name={draft ? 'send' : 'mic'} size={18} color="#fff" /></button>
        </div>
      </div>
    </div>
  );
}

function CvPanel({ c, onClose, onUse }) {
  const st = cvClient[c.id], [bl, bt] = cvBadge(c), seller = GT.seller(c.sellerId), sum = cvSummary[c.id];
  const [ai, setAi] = React.useState(true);
  const [open, setOpen] = React.useState(false);
  const Sec = ({ title, children }) => <div style={{ paddingTop: 14, marginTop: 14, borderTop: '1px solid #e5e5e5' }}>{title && <div style={{ fontSize: 11, fontWeight: 600, color: '#737373', letterSpacing: '.05em', marginBottom: 8 }}>{title}</div>}{children}</div>;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, background: '#fff' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: '1px solid #e5e5e5' }}><div style={{ fontSize: 16, fontWeight: 600 }}>Informações do Contato</div><button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex' }}><Icon name="x" size={18} /></button></div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 16, fontWeight: 600 }}>{c.name}{st && st.tier === 'Ouro' ? ' 💙' : ''}</div>
          <div style={{ fontSize: 13, color: '#737373', marginTop: 2 }}>{c.phone}</div>
          <div style={{ marginTop: 8 }}><K.Badge tone={bt}>{bl}</K.Badge></div>
          {seller && <div style={{ fontSize: 12, color: '#737373', marginTop: 10, display: 'inline-flex', alignItems: 'center', gap: 4 }}><Icon name="user" size={12} />Consultora: {seller.name.split(' ')[0]}</div>}
          {c.origin && <div style={{ fontSize: 12, color: '#737373', marginTop: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}><Icon name={GT.originIcon[c.origin.type]} size={12} />Origem: {c.origin.label}</div>}
        </div>
        {!c.group && <div style={{ marginTop: 14, border: '1px solid #e5e5e5', borderRadius: 10, padding: 12 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <Icon name="bot" size={18} color="#3fc58f" />
            <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 14, fontWeight: 600 }}>Agente de IA</div><div style={{ fontSize: 12, color: '#737373' }}>Ativo nesta conversa (sugere/atende).</div></div>
            <K.Toggle on={ai} onChange={setAi} />
          </div>
          {ai && cvAiReply[c.id] && <div style={{ marginTop: 10, fontSize: 12.5, background: 'rgba(63,197,143,.08)', border: '1px solid rgba(63,197,143,.25)', borderRadius: 8, padding: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#2fae7c', marginBottom: 4 }}>SUGESTÃO</div><div style={{ color: '#171717', fontStyle: 'italic' }}>"{cvAiReply[c.id]}"</div>
            <button onClick={() => onUse(cvAiReply[c.id])} style={{ marginTop: 8, height: 30, padding: '0 12px', borderRadius: 8, border: '1px solid #3fc58f', background: '#fff', color: '#2fae7c', fontSize: 12.5, fontWeight: 600, cursor: 'pointer', fontFamily: K.font }}>Usar sugestão</button>
          </div>}
        </div>}
        {st && <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 }}>
          <K.Badge tone="secondary" icon="medal" style={{ background: '#e5e7eb', color: '#374151' }}>{st.tier}</K.Badge>
          {st.month && <K.Badge tone="qualificado">Cliente do Mês</K.Badge>}
        </div>}
        {st && <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 14 }}>
          {[['TOTAL', GT.fmt.brl(st.total)], ['TICKET MÉDIO', GT.fmt.brl(st.ticket)], ['PEDIDOS', st.orders], ['ÚLTIMA COMPRA', st.last]].map(([k, v]) => <div key={k}><div style={{ fontSize: 10.5, fontWeight: 600, color: '#737373', letterSpacing: '.04em' }}>{k}</div><div style={{ fontSize: 15, fontWeight: 600, marginTop: 2 }}>{v}</div></div>)}
        </div>}
        {!c.group && <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#404040', marginTop: 14 }}><Icon name="clock" size={14} color="#737373" />Tempo médio de resposta: <b>{c.id === 7 ? '13 min' : c.id === 6 ? '5 min' : '4 min'}</b></div>}
        {sum && <div style={{ marginTop: 14, border: '1px solid #e5e5e5', borderRadius: 10, padding: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13.5, fontWeight: 600 }}><Icon name="file-text" size={14} />Resumo da conversa</div>
          <button onClick={() => setOpen(!open)} style={{ marginTop: 10, width: '100%', height: 38, borderRadius: 8, border: '1px solid #e5e5e5', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 12px', fontSize: 13.5, cursor: 'pointer', fontFamily: K.font }}><span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Icon name="file-text" size={14} />Ver resumo</span><Icon name={open ? 'chevron-up' : 'chevron-down'} size={14} /></button>
          {open && <div style={{ marginTop: 10, fontSize: 12.5, color: '#404040', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div><b>Resumo</b><div>{sum[0]}</div></div><div><b>Próximo passo</b><div>{sum[1]}</div></div><div><b>Objeções da IA</b><div>{sum[2]}</div></div>
          </div>}
        </div>}
        <Sec title="TAGS"><button style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 34, padding: '0 12px', borderRadius: 8, border: '1px solid #e5e5e5', background: '#fff', fontSize: 13, cursor: 'pointer', fontFamily: K.font }}><Icon name="tag" size={14} />Adicionar tag</button></Sec>
      </div>
    </div>
  );
}

function Conversas() {
  if (window.GT_TAB === 'disparos') return <div style={{ width: '100%', minHeight: 0, overflowY: 'auto' }}><Disparos /></div>;
  const M = K.M();
  const [chipId, setChipId] = React.useState('all');
  const [filter, setFilter] = React.useState('all');
  const [sel, setSel] = React.useState(1);
  const [mView, setMView] = React.useState('list');
  const [panel, setPanel] = React.useState(!M);
  const [extra, setExtra] = React.useState({});
  const [unread, setUnread] = React.useState(() => Object.fromEntries(GT.conversations.map((c) => [c.id, c.unread])));
  const [arrived, setArrived] = React.useState([]);
  // encenação discreta: a cada ~5s uma conversa recebe uma mensagem nova e sobe (alternando os números/canais)
  const order = [6, 4, 3, 7, 1, 10, 8, 2];
  const lines = { 6: 'Fechou as 2 grades? Já separo aqui', 4: 'Consigo pagar no pix?', 3: 'Chegou a saia plissada?', 7: 'Vocês têm catálogo?', 1: 'Pode me mandar o link de pagamento', 10: 'Tem a grade em preto?', 8: 'Quero ver o catálogo 🙏', 2: 'Sou de Guarulhos' };
  const step = K.useScene(order.length, 5000);
  React.useEffect(() => {
    if (step === 0 && !arrived.length) return;
    const id = order[step];
    setExtra((e) => ({ ...e, [id]: [...(e[id] || []), { k: 'them', t: lines[id], time: 'agora' }] }));
    setArrived((a) => [id, ...a.filter((x) => x !== id)]);
    if (id !== sel) setUnread((u) => ({ ...u, [id]: (u[id] || 0) + 1 }));
  }, [step]);
  const base = GT.conversationsFor(chipId);
  const rows = [...base].sort((a, b) => { const ia = arrived.indexOf(a.id), ib = arrived.indexOf(b.id); return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib); })
    .map((c) => ({ ...c, _pop: arrived[0] === c.id, last: extra[c.id] ? extra[c.id][extra[c.id].length - 1].t : c.last, time: arrived.includes(c.id) ? (arrived.indexOf(c.id) === 0 ? 'agora' : arrived.indexOf(c.id) + 'min') : c.time }))
    .filter((c) => filter === 'all' || (filter === 'unread' ? (unread[c.id] || 0) > 0 : filter === 'leads' ? !cvClient[c.id] && !c.group : !!cvClient[c.id]));
  const open = (id) => { setSel(id); setUnread((u) => ({ ...u, [id]: 0 })); if (M) setMView('chat'); };
  const changeChip = (v) => { setChipId(v); const l = GT.conversationsFor(v); if (!l.some((x) => x.id === sel) && l[0]) { setSel(l[0].id); setUnread((u) => ({ ...u, [l[0].id]: 0 })); } };
  const cur = GT.conversations.find((c) => c.id === sel);
  const send = (t) => { setExtra((e) => ({ ...e, [sel]: [...(e[sel] || []), { k: 'me', t, time: 'agora' }] })); setArrived((a) => [sel, ...a.filter((x) => x !== sel)]); };
  const [useTxt, setUseTxt] = React.useState('');
  const chat = <CvChat key={sel + ':' + useTxt} c={cur} extra={extra[sel]} onSend={send} onBack={() => setMView('list')} onTogglePanel={() => setPanel(!panel)} panelOpen={panel} />;
  const list = <CvList rows={rows} sel={sel} onOpen={open} chipId={chipId} onChip={changeChip} filter={filter} onFilter={setFilter} unread={unread} />;
  const pan = <CvPanel c={cur} onClose={() => setPanel(false)} onUse={(t) => { send(t); }} />;
  if (M) return (
    <div style={{ width: '100%', height: '100%', minHeight: 0, background: '#fff', border: '1px solid #e5e5e5', borderRadius: 12, overflow: 'hidden', margin: '0 12px' }}>
      {mView === 'list' ? list : panel ? <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}><button onClick={() => setPanel(false)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 12px', border: 'none', borderBottom: '1px solid #e5e5e5', background: '#fff', fontSize: 13, cursor: 'pointer', fontFamily: K.font }}><Icon name="arrow-left" size={16} />Voltar à conversa</button><div style={{ flex: 1, minHeight: 0 }}>{pan}</div></div> : chat}
    </div>
  );
  return (
    <div style={{ display: 'grid', gridTemplateColumns: panel ? '340px minmax(0,1fr) 300px' : '340px minmax(0,1fr)', width: '100%', height: '100%', minHeight: 0, background: '#fff', border: '1px solid #e5e5e5', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 2px rgba(0,0,0,.05)' }}>
      <div style={{ borderRight: '1px solid #e5e5e5', minHeight: 0 }}>{list}</div>
      <div style={{ minHeight: 0, minWidth: 0 }}>{chat}</div>
      {panel && <div style={{ borderLeft: '1px solid #e5e5e5', minHeight: 0 }}>{pan}</div>}
    </div>
  );
}
window.Conversas = Conversas;
