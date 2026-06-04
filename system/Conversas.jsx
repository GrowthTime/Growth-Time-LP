// GT System — Conversas (WhatsApp CRM inbox, 3 columns)
const CONVOS = [
  { id: 1, name: 'Patrícia Modas', phone: '+55 85 99812-3344', initials: 'PM', temp: 'hot', qual: 'qualified', last: 'Fechei! Pode mandar a grade P ao GG 🙌', time: '2min', unread: 2,
    summary: 'Lojista de Fortaleza (CE). Quer grade completa P–GG da coleção verão. Já comprou 2x. Pronta para fechar pedido de atacado.', tier: 'ouro', total: 'R$ 12.480', orders: 8 },
  { id: 2, name: 'Revenda Bella', phone: '+55 11 98444-1290', initials: 'RB', temp: 'hot', qual: 'pending', last: 'Qual o mínimo do atacado?', time: '8min', unread: 1,
    summary: 'Revendedora de São Paulo. Perguntou mínimo do atacado e formas de pagamento. Lead novo vindo de anúncio. Qualificação pendente.', tier: 'prata', total: 'R$ 0', orders: 0 },
  { id: 3, name: 'Camila Atacado', phone: '+55 71 99655-7781', initials: 'CA', temp: 'cold', qual: 'qualified', last: 'Você: Te enviei o catálogo novo 👗', time: '1h', unread: 0,
    summary: 'Cliente de Salvador (BA). Compra recorrente. Recebeu catálogo da nova coleção, ainda não respondeu. Reativar.', tier: 'ouro', total: 'R$ 8.910', orders: 5 },
  { id: 4, name: 'Loja da Duda', phone: '+55 31 98123-0098', initials: 'LD', temp: 'frozen', qual: 'not_qualified', last: 'Obrigada, vou pensar', time: 'Ontem', unread: 0,
    summary: 'Contato de BH. Pediu preço, achou alto, parou de responder. Marcado como congelado. Base para disparo de reativação.', tier: 'bronze', total: 'R$ 1.240', orders: 1 },
  { id: 5, name: 'Grupo · Equipe Vendas', phone: '4 participantes', initials: 'EV', group: true, last: 'Marina: bati a meta de hoje! 🎉', time: '3h', unread: 0 },
];

const TEMP = { hot: { e: '🔥', t: 'Quente' }, cold: { e: '❄️', t: 'Frio' }, frozen: { e: '🧊', t: 'Congelado' } };
const QUAL = {
  qualified: { t: 'Qualificado', bg: 'rgba(34,197,94,.1)', fg: '#16a34a', bd: 'rgba(34,197,94,.3)' },
  pending: { t: 'Pendente', bg: 'rgba(234,179,8,.1)', fg: '#ca8a04', bd: 'rgba(234,179,8,.3)' },
  not_qualified: { t: 'Não Qualif.', bg: 'rgba(239,68,68,.1)', fg: '#dc2626', bd: 'rgba(239,68,68,.3)' },
};
const TIER = { ouro: { t: 'Ouro', c: '#f3b315' }, prata: { t: 'Prata', c: '#a3adba' }, bronze: { t: 'Bronze', c: '#bd6b2f' } };

function Inbox() {
  const [sel, setSel] = React.useState(1);
  const [filter, setFilter] = React.useState('all');
  const [draft, setDraft] = React.useState('');
  const [msgs, setMsgs] = React.useState({
    1: [
      { me: false, t: 'Oi! Vi o anúncio de vocês, tenho loja aqui em Fortaleza', at: '14:02' },
      { me: true, t: 'Oi Patrícia! Que ótimo 💚 Trabalhamos com atacado mínimo de 10 peças. Posso te mandar a grade?', at: '14:03' },
      { me: false, t: 'Pode sim!', at: '14:04' },
      { me: false, t: 'Fechei! Pode mandar a grade P ao GG 🙌', at: '14:06' },
    ],
    2: [{ me: false, t: 'Qual o mínimo do atacado?', at: '13:50' }],
    3: [{ me: true, t: 'Te enviei o catálogo novo 👗', at: '12:10' }],
    4: [{ me: false, t: 'Obrigada, vou pensar', at: 'Ontem' }],
    5: [{ me: false, t: 'Marina: bati a meta de hoje! 🎉', at: '11:00' }],
  });
  const c = CONVOS.find((x) => x.id === sel);
  const list = CONVOS.filter((x) => filter === 'all' ? true : filter === 'unread' ? x.unread > 0 : filter === 'leads' ? x.qual === 'pending' || x.qual === 'not_qualified' : x.qual === 'qualified');

  const send = () => {
    if (!draft.trim()) return;
    setMsgs((m) => ({ ...m, [sel]: [...(m[sel] || []), { me: true, t: draft, at: 'agora' }] }));
    setDraft('');
  };

  const M = window.GT_MOBILE;
  // mobile single-pane flow: inbox -> chat -> contact (mirrors Messages.tsx)
  const [mView, setMView] = React.useState('inbox');
  const openChat = (id) => { setSel(id); setMView('chat'); };
  if (M) {
    return (
      <div style={{ ...cv.wrap, flexDirection: 'column', minWidth: 0, height: 'auto', borderRadius: 12 }}>
        {mView === 'inbox' && (
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: '10px 12px', borderBottom: '1px solid #eee', background: '#f7f8f8' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}><Icon name="smartphone" size={15} color="#737373" /><span style={{ fontSize: 12.5, fontWeight: 500 }}>WhatsApp Moda Fashion</span><span style={{ height: 7, width: 7, borderRadius: 999, background: '#22c55e' }}></span></div>
            </div>
            <div style={{ padding: '12px 12px 10px', borderBottom: '1px solid #eee' }}>
              <div style={cv.search}><Icon name="search" size={15} color="#a3a3a3" /><input placeholder="Buscar conversa..." style={cv.searchInput} /></div>
              <div style={cv.tabs}>
                {[['all', 'Todos'], ['unread', 'Não lidos'], ['leads', 'Leads'], ['clients', 'Clientes']].map(([k, l]) => (
                  <button key={k} onClick={() => setFilter(k)} style={{ ...cv.tab, ...(filter === k ? cv.tabOn : {}) }}>{l}</button>
                ))}
              </div>
            </div>
            <div>
              {list.map((x) => (
                <button key={x.id} onClick={() => openChat(x.id)} style={cv.item}>
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <div style={{ ...cv.avatar, background: x.group ? 'rgba(59,130,246,.1)' : 'rgba(56,204,156,.1)', color: x.group ? '#2563eb' : '#27ae8f' }}>{x.group ? <Icon name="users" size={20} color="#2563eb" /> : x.initials}</div>
                    {x.temp && <span style={cv.tempDot}>{TEMP[x.temp].e}</span>}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                      <span style={{ fontWeight: 500, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{x.name}</span>
                      <span style={{ fontSize: 11, color: '#a3a3a3', whiteSpace: 'nowrap' }}>{x.time}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'center', marginTop: 2 }}>
                      <span style={{ fontSize: 12.5, color: x.unread ? '#171717' : '#737373', fontWeight: x.unread ? 500 : 400, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{x.last}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                        {x.qual && !x.group && <Badge q={x.qual} />}
                        {x.unread > 0 && <span style={cv.unread}>{x.unread}</span>}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
        {mView === 'chat' && (
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%', minHeight: 420 }}>
            <div style={{ ...cv.chatHead, cursor: 'pointer' }}>
              <button onClick={() => setMView('inbox')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}><Icon name="arrow-left" size={20} color="#171717" /></button>
              <div onClick={() => setMView('contact')} style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, cursor: 'pointer' }}>
                <div style={{ ...cv.avatar, height: 36, width: 36, background: 'rgba(56,204,156,.1)', color: '#27ae8f' }}>{c.initials}</div>
                <div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: 14 }}>{c.name}</div><div style={{ fontSize: 11.5, color: '#737373' }}>{c.phone}</div></div>
              </div>
              {c.temp && <span style={{ fontSize: 13 }}>{TEMP[c.temp].e}</span>}
            </div>
            <div style={{ ...cv.chatBody, flex: 1 }}>
              {(msgs[sel] || []).map((m, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: m.me ? 'flex-end' : 'flex-start' }}>
                  <div style={{ ...cv.bubble, ...(m.me ? cv.bubbleMe : cv.bubbleThem) }}>{m.t}<span style={{ fontSize: 10, opacity: .6, marginLeft: 8, display: 'inline-flex', alignItems: 'center', gap: 2 }}>{m.at}{m.me && <Icon name="check-check" size={12} color="#38cc9c" />}</span></div>
                </div>
              ))}
            </div>
            <div style={cv.composer}>
              <Icon name="paperclip" size={19} color="#a3a3a3" />
              <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} placeholder="Digite uma mensagem..." style={cv.composerInput} />
              <button onClick={send} style={cv.sendBtn}><Icon name="send" size={17} color="#fff" /></button>
            </div>
          </div>
        )}
        {mView === 'contact' && (
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderBottom: '1px solid #eee', background: '#fff' }}>
              <button onClick={() => setMView('chat')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}><Icon name="arrow-left" size={20} color="#171717" /></button>
              <span style={{ fontWeight: 600, fontSize: 14 }}>Detalhes do contato</span>
            </div>
            <div style={{ padding: 16 }}>
              <div style={{ textAlign: 'center', padding: '6px 0 14px' }}>
                <div style={{ ...cv.avatar, height: 64, width: 64, margin: '0 auto 10px', fontSize: 22, background: 'rgba(56,204,156,.1)', color: '#27ae8f' }}>{c.initials}</div>
                <div style={{ fontWeight: 600, fontSize: 16 }}>{c.name}</div>
                <div style={{ fontSize: 12.5, color: '#737373' }}>{c.phone}</div>
                {c.tier && <span style={{ display: 'inline-block', marginTop: 8, fontSize: 12, fontWeight: 600, color: TIER[c.tier].c, background: TIER[c.tier].c + '22', padding: '3px 12px', borderRadius: 999 }}>● {TIER[c.tier].t}</span>}
              </div>
              {c.qual && <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                <div style={cv.statBox}><div style={cv.statLab}>Total comprado</div><div style={cv.statVal}>{c.total}</div></div>
                <div style={cv.statBox}><div style={cv.statLab}>Pedidos</div><div style={cv.statVal}>{c.orders}</div></div>
              </div>}
              {c.summary && (
                <div style={cv.aiBox}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}><Icon name="sparkles" size={16} color="#38cc9c" /><span style={{ fontSize: 13, fontWeight: 600, color: '#27ae8f' }}>Resumo da conversa por IA</span></div>
                  <p style={{ fontSize: 12.5, lineHeight: 1.55, color: '#5f5e5a' }}>{c.summary}</p>
                </div>
              )}
              <div style={{ marginTop: 14 }}>
                <div style={cv.statLab}>Próximo passo sugerido</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6, fontSize: 13, fontWeight: 500, color: '#171717', background: '#fff', border: '1px solid #eee', borderRadius: 10, padding: '10px 12px' }}><Icon name="circle-check" size={16} color="#38cc9c" />Enviar tabela de grades e fechar pedido</div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
  return (
    <div style={{ ...cv.wrap }}>
      {/* Column 1: conversation list */}
      <div style={{ ...cv.listCol }}>
        <div style={{ padding: 14, borderBottom: '1px solid #eee' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 16, fontWeight: 600, marginBottom: 12 }}>
            <Icon name="message-square" size={17} color="#38cc9c" />Conversas
          </div>
          <div style={cv.search}><Icon name="search" size={15} color="#a3a3a3" /><input placeholder="Buscar conversa..." style={cv.searchInput} /></div>
          <div style={cv.tabs}>
            {[['all', 'Todos'], ['unread', 'Não lidos'], ['leads', 'Leads'], ['clients', 'Clientes']].map(([k, l]) => (
              <button key={k} onClick={() => setFilter(k)} style={{ ...cv.tab, ...(filter === k ? cv.tabOn : {}) }}>{l}</button>
            ))}
          </div>
        </div>
        <div style={{ overflowY: 'auto', flex: 1 }}>
          {list.map((x) => (
            <button key={x.id} onClick={() => setSel(x.id)} style={{ ...cv.item, ...(sel === x.id ? { background: '#f5f5f5' } : {}) }}>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <div style={{ ...cv.avatar, background: x.group ? 'rgba(59,130,246,.1)' : 'rgba(56,204,156,.1)', color: x.group ? '#2563eb' : '#27ae8f' }}>
                  {x.group ? <Icon name="users" size={20} color="#2563eb" /> : x.initials}
                </div>
                {x.temp && <span style={cv.tempDot} title={TEMP[x.temp].t}>{TEMP[x.temp].e}</span>}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                  <span style={{ fontWeight: 500, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{x.name}</span>
                  <span style={{ fontSize: 11, color: '#a3a3a3', whiteSpace: 'nowrap' }}>{x.time}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'center', marginTop: 2 }}>
                  <span style={{ fontSize: 12.5, color: x.unread ? '#171717' : '#737373', fontWeight: x.unread ? 500 : 400, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{x.last}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                    {x.qual && !x.group && <Badge q={x.qual} />}
                    {x.unread > 0 && <span style={cv.unread}>{x.unread}</span>}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Column 2: chat */}
      <div style={{ ...cv.chatCol, ...(M ? { minWidth: 0, minHeight: 340 } : {}) }}>
        <div style={cv.chatHead}>
          <div style={{ ...cv.avatar, height: 38, width: 38, background: 'rgba(56,204,156,.1)', color: '#27ae8f' }}>{c.initials}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{c.name}</div>
            <div style={{ fontSize: 12, color: '#737373' }}>{c.phone}</div>
          </div>
          {c.temp && <span style={{ fontSize: 13, color: '#737373', display: 'flex', alignItems: 'center', gap: 4 }}>{TEMP[c.temp].e} {TEMP[c.temp].t}</span>}
        </div>
        <div style={cv.chatBody}>
          {(msgs[sel] || []).map((m, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: m.me ? 'flex-end' : 'flex-start' }}>
              <div style={{ ...cv.bubble, ...(m.me ? cv.bubbleMe : cv.bubbleThem) }}>
                {m.t}
                <span style={{ fontSize: 10, opacity: .6, marginLeft: 8, display: 'inline-flex', alignItems: 'center', gap: 2 }}>{m.at}{m.me && <Icon name="check-check" size={12} color="#38cc9c" />}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={cv.composer}>
          <Icon name="paperclip" size={19} color="#a3a3a3" />
          <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} placeholder="Digite uma mensagem..." style={cv.composerInput} />
          <button onClick={send} style={cv.sendBtn}><Icon name="send" size={17} color="#fff" /></button>
        </div>
      </div>

      {/* Column 3: contact + AI summary */}
      <div style={{ ...cv.contactCol, ...(M ? { width: '100%', borderLeft: 'none', borderTop: '1px solid #eee' } : {}) }}>
        <div style={{ textAlign: 'center', padding: '6px 0 14px' }}>
          <div style={{ ...cv.avatar, height: 64, width: 64, margin: '0 auto 10px', fontSize: 22, background: 'rgba(56,204,156,.1)', color: '#27ae8f' }}>{c.initials}</div>
          <div style={{ fontWeight: 600, fontSize: 16 }}>{c.name}</div>
          <div style={{ fontSize: 12.5, color: '#737373' }}>{c.phone}</div>
          {c.tier && <span style={{ display: 'inline-block', marginTop: 8, fontSize: 12, fontWeight: 600, color: TIER[c.tier].c, background: TIER[c.tier].c + '22', padding: '3px 12px', borderRadius: 999 }}>● {TIER[c.tier].t}</span>}
        </div>
        {c.qual && <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          <div style={cv.statBox}><div style={cv.statLab}>Total comprado</div><div style={cv.statVal}>{c.total}</div></div>
          <div style={cv.statBox}><div style={cv.statLab}>Pedidos</div><div style={cv.statVal}>{c.orders}</div></div>
        </div>}
        {c.summary && (
          <div style={cv.aiBox}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
              <Icon name="sparkles" size={16} color="#38cc9c" />
              <span style={{ fontSize: 13, fontWeight: 600, color: '#27ae8f' }}>Resumo da conversa por IA</span>
            </div>
            <p style={{ fontSize: 12.5, lineHeight: 1.55, color: '#5f5e5a' }}>{c.summary}</p>
          </div>
        )}
        <div style={{ marginTop: 14 }}>
          <div style={cv.statLab}>Próximo passo sugerido</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6, fontSize: 13, fontWeight: 500, color: '#171717', background: '#fff', border: '1px solid #eee', borderRadius: 10, padding: '10px 12px' }}>
            <Icon name="circle-check" size={16} color="#38cc9c" />Enviar tabela de grades e fechar pedido
          </div>
        </div>
      </div>
    </div>
  );
}

function Conversas() {
  const [view, setView] = React.useState('conversas');
  const M = window.GT_MOBILE;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: M ? 10 : 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setView('conversas')} style={{ ...cv.topTab, ...(view === 'conversas' ? cv.topTabOn : {}) }}><Icon name="message-square" size={15} color={view === 'conversas' ? '#fff' : '#737373'} />Conversas</button>
          <button onClick={() => setView('disparos')} style={{ ...cv.topTab, ...(view === 'disparos' ? cv.topTabOn : {}) }}><Icon name="send" size={15} color={view === 'disparos' ? '#fff' : '#737373'} />{M ? 'Disparos' : 'Disparos Cloud API'}</button>
        </div>
        {!M && <div style={cv.instance}>
          <Icon name="smartphone" size={15} color="#737373" />
          <span style={{ fontSize: 13, fontWeight: 500 }}>WhatsApp Moda Fashion</span>
          <span style={{ height: 8, width: 8, borderRadius: 999, background: '#22c55e' }}></span>
          <span style={{ fontSize: 12, color: '#16a34a', fontWeight: 600 }}>Conectado</span>
        </div>}
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        {view === 'conversas' ? <Inbox /> : <Broadcasts />}
      </div>
    </div>
  );
}

function Broadcasts() {
  const campaigns = [
    { n: 'Lançamento Coleção Verão', status: 'Enviada', sent: 1840, read: 1421, audience: 'Base ativa · CE', when: 'Hoje 09:00' },
    { n: 'Reativação base parada', status: 'Enviando', sent: 612, read: 318, audience: 'Inativos 30d+', when: 'Agora' },
    { n: 'Grade nova P ao GG', status: 'Agendada', sent: 0, read: 0, audience: 'Revendedoras', when: 'Amanhã 10:00' },
  ];
  const ST = { 'Enviada': { bg: 'rgba(34,197,94,.1)', fg: '#16a34a' }, 'Enviando': { bg: 'rgba(56,204,156,.12)', fg: '#27ae8f' }, 'Agendada': { bg: 'rgba(234,179,8,.12)', fg: '#ca8a04' } };
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 18, height: '100%' }}>
      <div style={cv.bcCard}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 16, fontWeight: 600 }}>Campanhas de Disparo</div>
          <button style={cv.newBtn}><Icon name="plus" size={15} color="#fff" />Novo disparo</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {campaigns.map((c, i) => (
            <div key={i} style={{ border: '1px solid #eee', borderRadius: 12, padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div><div style={{ fontSize: 14.5, fontWeight: 600 }}>{c.n}</div><div style={{ fontSize: 12.5, color: '#737373', marginTop: 2 }}>{c.audience} · {c.when}</div></div>
                <span style={{ fontSize: 11.5, fontWeight: 600, padding: '3px 11px', borderRadius: 999, background: ST[c.status].bg, color: ST[c.status].fg }}>{c.status}</span>
              </div>
              <div style={{ display: 'flex', gap: 22 }}>
                <div><div style={{ fontSize: 11, color: '#a3a3a3' }}>Enviadas</div><div style={{ fontSize: 16, fontWeight: 700 }}>{c.sent.toLocaleString('pt-BR')}</div></div>
                <div><div style={{ fontSize: 11, color: '#a3a3a3' }}>Lidas</div><div style={{ fontSize: 16, fontWeight: 700, color: '#27ae8f' }}>{c.read.toLocaleString('pt-BR')}</div></div>
                <div style={{ flex: 1 }}><div style={{ fontSize: 11, color: '#a3a3a3' }}>Taxa de leitura</div>
                  <div style={{ height: 7, borderRadius: 999, background: '#f0f0f0', marginTop: 6, overflow: 'hidden' }}><div style={{ height: '100%', width: (c.sent ? Math.round(c.read / c.sent * 100) : 0) + '%', background: 'var(--gradient-primary)', borderRadius: 999 }}></div></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={cv.bcCard}>
        <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Novo disparo</div>
        <div style={{ fontSize: 12.5, color: '#737373', marginBottom: 16 }}>Template oficial · API Cloud Meta</div>
        <label style={cv.lbl}>Template</label>
        <div style={cv.field}>colecao_verao_2026 <Icon name="chevron-down" size={15} color="#a3a3a3" /></div>
        <label style={cv.lbl}>Público</label>
        <div style={cv.field}>Base ativa (1.840) <Icon name="chevron-down" size={15} color="#a3a3a3" /></div>
        <label style={cv.lbl}>Prévia</label>
        <div style={{ background: '#e9e2d8', borderRadius: 12, padding: 12 }}>
          <div style={{ ...cv.bubble, ...cv.bubbleThem, maxWidth: '100%', fontSize: 12.5 }}>Oi {'{{nome}}'}! 👋 Chegou a nova coleção verão na GT. Quer ver a grade completa P ao GG? Responda *SIM* 🛍️</div>
        </div>
        <button style={{ ...cv.newBtn, width: '100%', justifyContent: 'center', marginTop: 16 }}><Icon name="send" size={15} color="#fff" />Disparar para 1.840</button>
      </div>
    </div>
  );
}

function Badge({ q }) {
  const s = QUAL[q];
  return <span style={{ fontSize: 11, fontWeight: 500, padding: '2px 9px', borderRadius: 999, background: s.bg, color: s.fg, border: `1px solid ${s.bd}`, whiteSpace: 'nowrap' }}>{s.t}</span>;
}

const cv = {
  topTab: { display: 'flex', alignItems: 'center', gap: 7, fontSize: 13.5, fontWeight: 600, padding: '9px 16px', borderRadius: 10, border: '1px solid #eee', background: '#fff', color: '#737373', cursor: 'pointer', fontFamily: 'Inter,sans-serif' },
  topTabOn: { background: '#38cc9c', color: '#fff', border: '1px solid #38cc9c' },
  instance: { display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 10, border: '1px solid #eee', background: '#fff' },
  bcCard: { background: '#fff', borderRadius: 14, border: '1px solid #eee', padding: 20, boxShadow: 'var(--shadow-sm)', overflowY: 'auto' },
  newBtn: { display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, fontWeight: 600, padding: '9px 15px', borderRadius: 10, border: 'none', background: 'var(--gradient-primary)', color: '#fff', cursor: 'pointer', fontFamily: 'Inter,sans-serif' },
  lbl: { display: 'block', fontSize: 12, fontWeight: 600, color: '#737373', marginBottom: 6, marginTop: 12 },
  field: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13.5, padding: '10px 14px', borderRadius: 10, border: '1px solid #e5e5e5', background: '#fff' },
  wrap: { display: 'flex', height: '100%', minWidth: 940, background: '#fff', borderRadius: 14, border: '1px solid #eee', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' },
  listCol: { width: 320, borderRight: '1px solid #eee', display: 'flex', flexDirection: 'column', flexShrink: 0 },
  search: { display: 'flex', alignItems: 'center', gap: 8, background: '#f5f5f5', borderRadius: 9, padding: '8px 11px' },
  searchInput: { border: 'none', background: 'transparent', outline: 'none', fontSize: 13, flex: 1, fontFamily: 'Inter,sans-serif' },
  tabs: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 4, marginTop: 10, background: '#f5f5f5', borderRadius: 8, padding: 3 },
  tab: { fontSize: 11.5, fontWeight: 500, padding: '6px 4px', borderRadius: 6, border: 'none', background: 'transparent', color: '#737373', cursor: 'pointer', fontFamily: 'Inter,sans-serif' },
  tabOn: { background: '#fff', color: '#171717', boxShadow: 'var(--shadow-sm)' },
  item: { width: '100%', display: 'flex', gap: 11, padding: '11px 13px', border: 'none', borderBottom: '1px solid #f3f3f3', background: 'transparent', cursor: 'pointer', textAlign: 'left', alignItems: 'center', fontFamily: 'Inter,sans-serif' },
  avatar: { height: 42, width: 42, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 14 },
  tempDot: { position: 'absolute', bottom: -2, right: -2, fontSize: 14, lineHeight: 1 },
  unread: { height: 20, minWidth: 20, padding: '0 6px', borderRadius: 999, background: '#38cc9c', color: '#fff', fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  chatCol: { flex: 1, display: 'flex', flexDirection: 'column', minWidth: 340, background: '#f7f8f8' },
  chatHead: { display: 'flex', alignItems: 'center', gap: 11, padding: '12px 18px', borderBottom: '1px solid #eee', background: '#fff' },
  chatBody: { flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 10 },
  bubble: { maxWidth: '72%', padding: '9px 13px', borderRadius: 14, fontSize: 13.5, lineHeight: 1.45, boxShadow: 'var(--shadow-sm)' },
  bubbleMe: { background: '#dcf6ec', color: '#0b3a2c', borderBottomRightRadius: 4 },
  bubbleThem: { background: '#fff', color: '#171717', borderBottomLeftRadius: 4 },
  composer: { display: 'flex', alignItems: 'center', gap: 11, padding: '12px 16px', borderTop: '1px solid #eee', background: '#fff' },
  composerInput: { flex: 1, border: '1px solid #e5e5e5', borderRadius: 999, padding: '10px 16px', fontSize: 13.5, outline: 'none', fontFamily: 'Inter,sans-serif' },
  sendBtn: { height: 40, width: 40, borderRadius: 999, border: 'none', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 },
  contactCol: { width: 290, borderLeft: '1px solid #eee', padding: 18, flexShrink: 0, overflowY: 'auto', background: '#fff' },
  statBox: { flex: 1, background: '#f7f8f8', borderRadius: 10, padding: '10px 12px' },
  statLab: { fontSize: 11, color: '#737373', fontWeight: 500 },
  statVal: { fontSize: 15, fontWeight: 700, marginTop: 2 },
  aiBox: { background: 'linear-gradient(135deg,rgba(56,204,156,.08),rgba(56,204,156,.02))', border: '1px solid rgba(56,204,156,.2)', borderRadius: 12, padding: 14 },
};
window.Conversas = Conversas;
