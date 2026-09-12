// GT System — Minha Área (SellerArea.tsx) vista pela gestora Marina Alves (GT.sellers[0]), que atende no Vendas 1 (4321).
// Topo: "Atendimento de hoje" (contado pelo NÚMERO, não pelo cadastro) + "Meus números". Abas: Checklist · Leads · Clientes · Equipe.
const maMe = () => GT.seller('marina');
const maMyChips = () => GT.chips.filter((c) => c.sellerIds.includes('marina'));
// Contagens do dia no número da vendedora (o sistema real conta por chip, não por vendedora atribuída)
const maHoje = { contatos: 62, novos: 21, qualificados: 26, pedidos: 9, mediana: '4 min', ate15: 91, semResposta: 2,
  origem: [['Anúncio', 28, '#2563eb', 'megaphone'], ['Orgânico / base', 15, '#3fc58f', 'search'], ['Link da bio', 11, '#0ea5e9', 'link-2'], ['Disparo', 8, '#8b5cf6', 'send']] };
const maProvider = { coexistence: 'API oficial · coexistência (celular continua funcionando)', cloud_api: 'API oficial (Cloud API)', instagram: 'Instagram Direct', messenger: 'Messenger' };
const maTemp = { hot: { e: '🔥', t: 'Quente' }, cold: { e: '❄️', t: 'Frio' }, frozen: { e: '🧊', t: 'Congelado' } };
const maQual = {
  qualified: { t: 'Qualificado', bg: 'rgba(34,197,94,.1)', fg: '#16a34a', bd: 'rgba(34,197,94,.3)' },
  pending: { t: 'Pendente', bg: 'rgba(234,179,8,.1)', fg: '#ca8a04', bd: 'rgba(234,179,8,.3)' },
  not_qualified: { t: 'Não Qualif.', bg: 'rgba(239,68,68,.1)', fg: '#dc2626', bd: 'rgba(239,68,68,.3)' },
};
const maTier = { ouro: { t: 'Ouro', c: '#ca8a04' }, prata: { t: 'Prata', c: '#64748b' }, bronze: { t: 'Bronze', c: '#b45309' } };

function MinhaArea() {
  const M = K.M();
  const [tab, setTab] = React.useState(['checklist', 'leads', 'clientes', 'equipe'].includes(window.GT_TAB) ? window.GT_TAB : 'checklist');
  const tabs = [['checklist', 'Checklist do Dia', 'circle-check'], ['leads', 'Meus Leads', 'user-round-plus'], ['clientes', 'Meus Clientes', 'store'], ['equipe', 'Visão da Equipe', 'users']];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: M ? 16 : 22 }}>
      <K.PageHead title="Minha Área" sub="Gerencie automações e acompanhe o desempenho da equipe" />
      {/* abas centralizadas, ativa = pílula verde cheia (SellerArea real) */}
      <div style={{ display: 'flex', gap: 6, justifyContent: M ? 'flex-start' : 'center', overflowX: 'auto', paddingBottom: 2 }}>
        {tabs.map(([k, l, ic]) => { const on = tab === k; return (
          <button key={k} onClick={() => setTab(k)} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, height: 36, padding: '0 14px', borderRadius: 8, border: 'none', background: on ? '#3fc58f' : 'transparent', color: on ? '#fff' : '#404040', fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: K.font, whiteSpace: 'nowrap' }}>
            <Icon name={ic} size={16} color={on ? '#fff' : '#404040'} />{l}
          </button>); })}
      </div>
      {tab === 'checklist' && <MaChecklist />}
      {tab === 'leads' && <MaLeads />}
      {tab === 'clientes' && <MaClientes />}
      {tab === 'equipe' && <MaEquipe />}
    </div>
  );
}

/* ---------------- ATENDIMENTO DE HOJE (por número) ---------------- */
function MaAtendimentoHoje() {
  const M = K.M();
  const me = maMe();
  const chip = GT.chip(me.chipId);
  const h = maHoje;
  const tiles = [
    ['Contatos únicos', GT.fmt.num(h.contatos), `${h.novos} novos · ${h.contatos - h.novos} da base`, 'users', '#3fc58f'],
    ['Leads qualificados', GT.fmt.num(h.qualificados), `${Math.round((h.qualificados / h.contatos) * 100)}% dos contatos`, 'circle-check', '#059669'],
    ['Pedidos fechados', GT.fmt.num(h.pedidos), GT.fmt.brlK(chip.sellerIds.reduce((a, id) => a + GT.seller(id).day, 0)) + ' hoje no número', 'shopping-bag', '#9333ea'],
    ['1ª resposta (mediana)', h.mediana, `${h.ate15}% em até 15 min`, 'timer', '#2563eb'],
  ];
  return (
    <K.Card
      title={<span style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>Atendimento de hoje <K.Badge color="#2fae7c" bg="rgba(63,197,143,.1)" style={{ fontSize: 12 }}><K.ChannelChip channel="whatsapp" size={11} style={{ border: 'none' }} />{chip.label} ({chip.short})</K.Badge></span>}
      sub={M ? 'contado pelo número que você atende, não pelo cadastro' : 'contado pelo número que você atende, não pelo cadastro — quem escreveu no ' + chip.short + ' conta aqui, mesmo sem vendedora atribuída'}
      right={<K.Badge color="#2fae7c" bg="rgba(63,197,143,.1)"><K.Dot color="#22c55e" size={6} pulse />ao vivo</K.Badge>}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 10 }}>
        {tiles.map(([l, v, s, ic, c]) => (
          <div key={l} style={{ border: '1px solid #f0f0f0', borderRadius: 12, padding: M ? '10px 12px' : '12px 14px', background: '#fafafa', minWidth: 0, display: 'flex', alignItems: 'center', gap: M ? 9 : 12 }}>
            <div style={{ padding: M ? 7 : 9, borderRadius: 10, background: c + '1a', flexShrink: 0 }}><Icon name={ic} size={M ? 15 : 17} color={c} /></div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#737373', textTransform: 'uppercase', letterSpacing: '.04em', lineHeight: 1.25 }}>{l}</div>
              <div style={{ fontSize: 22, fontWeight: 700, marginTop: 2, letterSpacing: '-.01em', lineHeight: 1.15 }}>{v}</div>
              <div style={{ fontSize: 11.5, color: '#a3a3a3', marginTop: 2 }}>{s}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6, gap: 8 }}>
          <span style={{ fontWeight: 600, color: '#737373', textTransform: 'uppercase', letterSpacing: '.04em', fontSize: 11 }}>De onde vieram os {h.contatos} contatos</span>
          {!M && <span style={{ color: '#a3a3a3' }}>pelo link que abriu a conversa</span>}
        </div>
        <div style={{ display: 'flex', height: 10, borderRadius: 999, overflow: 'hidden', gap: 2 }}>
          {h.origem.map(([l, n, c]) => <div key={l} title={l + ': ' + n} style={{ width: (n / h.contatos) * 100 + '%', background: c }}></div>)}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: M ? 8 : 14, marginTop: 7, fontSize: 12, color: '#404040' }}>
          {h.origem.map(([l, n, c, ic]) => <span key={l} style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><K.Dot color={c} size={7} />{l} <b>{n}</b></span>)}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 12.5, color: '#737373', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Icon name="users-round" size={14} color="#737373" />Número compartilhado com {chip.sellerIds.filter((id) => id !== me.id).map((id) => GT.seller(id).name).join(', ')} — os totais acima são do número inteiro.
        </span>
        {h.semResposta > 0
          ? <K.Badge color="#ca8a04" bg="rgba(234,179,8,.12)" icon="alert-triangle">{h.semResposta} leads sem resposta há mais de 1h</K.Badge>
          : <K.Badge color="#16a34a" bg="rgba(34,197,94,.1)" icon="check-check">Nenhum lead sem resposta</K.Badge>}
      </div>
    </K.Card>
  );
}

/* ---------------- MEUS NÚMEROS ---------------- */
function MaMeusNumeros() {
  const chips = maMyChips();
  const me = maMe();
  return (
    <K.Card title="Meus números" sub="Onde você atende hoje" right={<K.Badge>{chips.length} {chips.length === 1 ? 'número' : 'números'}</K.Badge>}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {chips.map((c) => (
          <div key={c.id} style={{ border: '1px solid #eee', borderRadius: 12, padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <K.Avatar initials={c.short} color={c.channel === 'whatsapp' ? '#25D366' : '#0084FF'} size={38} fontSize={12} channel={c.channel} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>{c.label}{c.purpose && c.purpose !== c.label.split(' ')[0] && <span style={{ fontSize: 12, color: '#a3a3a3', fontWeight: 500 }}>· {c.purpose}</span>}</div>
                <div style={{ fontSize: 12.5, color: '#737373' }}>{c.number}</div>
              </div>
              <K.Status s={c.health} />
            </div>
            <div style={{ fontSize: 12, color: '#737373', display: 'flex', alignItems: 'center', gap: 6 }}><Icon name="shield-check" size={13} color="#3fc58f" />{maProvider[c.provider]}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
              <K.Badge color="#404040" bg="#f5f5f5" icon="message-square">{c.convosToday} conversas hoje</K.Badge>
              {c.quality && <K.Badge color="#404040" bg="#f5f5f5" icon="activity">Qualidade {c.quality}</K.Badge>}
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginLeft: 'auto' }}>
                {c.sellerIds.map((id) => <span key={id} title={GT.seller(id).name} style={{ marginLeft: -6 }}><K.Avatar initials={GT.seller(id).initials} color={GT.seller(id).color} size={22} fontSize={9} ring="#fff" /></span>)}
              </span>
            </div>
            {c.campaignTag && <div style={{ fontSize: 11.5, color: '#a3a3a3', lineHeight: 1.45 }}><Icon name="megaphone" size={12} color="#a3a3a3" style={{ verticalAlign: '-2px', marginRight: 5 }} />Campanhas da Meta casam pelos 4 dígitos: <b style={{ color: '#737373' }}>{c.campaignTag}</b></div>}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#737373', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 6 }}>Chegaram agora no {chips[0].short}</div>
        {GT.conversationsFor(chips[0].id).filter((c) => !c.group).slice(0, 3).map((c) => (
          <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '6px 0', borderTop: '1px solid #f3f3f3' }}>
            <K.Avatar initials={c.initials} color={GT.seller(c.sellerId).color} size={26} fontSize={10} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name} <span style={{ fontWeight: 400, color: '#a3a3a3', fontSize: 11.5 }}>· {maTemp[c.temp].e} {c.origin.label}</span></div>
              <div style={{ fontSize: 11.5, color: '#737373', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.last}</div>
            </div>
            <span style={{ fontSize: 11, color: '#a3a3a3', whiteSpace: 'nowrap' }}>{c.time}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 10, fontSize: 12, color: '#a3a3a3', lineHeight: 1.45 }}><Icon name="info" size={13} color="#a3a3a3" style={{ verticalAlign: '-2px', marginRight: 5 }} />Suas vendas no mês: <b style={{ color: '#171717' }}>{GT.fmt.brlK(me.month)}</b> de {GT.fmt.brlK(me.goalOuro)} (meta ouro) · {Math.round((me.month / me.goalOuro) * 100)}%</div>
    </K.Card>
  );
}

/* ---------------- CHECKLIST DO DIA ---------------- */
function MaChecklist() {
  const M = K.M();
  const init = [
    { t: 'Responder todos os leads novos do dia', kind: 'obrigatoria', done: false },
    { t: 'Fazer follow-up dos clientes sem resposta há 2 dias', kind: 'obrigatoria', done: false },
    { t: 'Enviar catálogo da nova coleção para a base ativa', kind: 'comum', done: false },
    { t: 'Qualificar leads pendentes no CRM', kind: 'obrigatoria', done: true, at: '10:24' },
    { t: 'Postar story com a peça do dia', kind: 'pessoal', done: true, at: '09:12' },
    { t: 'Registrar vendas fechadas no sistema', kind: 'comum', done: false },
  ];
  const [items, setItems] = React.useState(init);
  const [draft, setDraft] = React.useState('');
  const [hideDone, setHideDone] = React.useState(false);
  const done = items.filter((i) => i.done).length;
  const pct = items.length ? Math.round((done / items.length) * 100) : 0;
  const sorted = [...items].sort((a, b) => (a.done === b.done ? 0 : a.done ? 1 : -1));
  const shown = hideDone ? sorted.filter((i) => !i.done) : sorted;
  const BADGE = {
    obrigatoria: { t: 'Obrigatória', bg: '#3fc58f', fg: '#fff', bd: '#3fc58f' },
    pessoal: { t: 'Pessoal', bg: '#f1f1f1', fg: '#5f5e5a', bd: '#f1f1f1' },
    comum: { t: 'Comum', bg: '#fff', fg: '#737373', bd: '#e5e5e5' },
  };
  const leftColor = (it) => it.done ? '#d4d4d4' : it.kind === 'obrigatoria' ? '#3fc58f' : '#cfcfcf';
  const MaTop = () => (<>
    <div style={{ background: 'linear-gradient(135deg,rgba(63,197,143,.06),#fff)', border: '1px solid rgba(63,197,143,.25)', borderRadius: 12, padding: 20, display: 'flex', alignItems: 'center', gap: 14 }}>
      <Icon name="users" size={20} color="#3fc58f" />
      <div><div style={{ fontSize: 14, fontWeight: 500, marginBottom: 8 }}>Visualizar checklist de:</div><K.Select value="me" options={[['me', 'Meu checklist (pessoal)'], ...GT.sellers.filter((x) => x.role !== 'Suporte' && x.id !== 'marina').map((x) => [x.id, x.name])]} width={280} /></div>
    </div>
    <div style={{ background: 'linear-gradient(135deg,rgba(63,197,143,.05),rgba(37,99,235,.03))', border: '1px solid rgba(63,197,143,.25)', borderRadius: 12, padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 500 }}><Icon name="activity" size={16} color="#3fc58f" />Resumo do Dia (Tempo Real)<Icon name="circle-check" size={14} color="#22c55e" style={{ marginLeft: 'auto' }} /></div>
      <div style={{ display: 'grid', gridTemplateColumns: M ? '1fr' : 'repeat(3,minmax(0,1fr))', gap: 12, marginTop: 14 }}>
        {[['message-square', 'Mensagens', '26', '○ 36 outros'], ['shopping-cart', 'Pedidos', '9', '🔄 5 base (R$ 8.400,00)'], ['phone', 'Prospecção Ativa', '14', 'conversas abertas por você']].map(([ic, l, v, sub]) => <div key={l} style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 10, padding: 14 }}><div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: '#737373' }}><Icon name={ic} size={13} />{l}</div><div style={{ fontSize: 24, fontWeight: 700, marginTop: 4 }}>{v}</div><div style={{ fontSize: 12, color: '#737373' }}>{sub}</div></div>)}
      </div>
      <div style={{ marginTop: 12, fontSize: 12, color: '#737373' }}>Contado pelo número que você atende (Vendas 1 · 4321), em tempo real — o registro diário manual não é mais necessário.</div>
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}><div><div style={{ fontSize: 20, fontWeight: 600 }}>Checklist de Hoje</div><div style={{ fontSize: 14, color: '#737373' }}>sábado, 12 de setembro</div></div><K.Btn icon="calendar">Alterar data</K.Btn></div>
  </>);
  const add = () => { if (!draft.trim()) return; setItems([...items, { t: draft.trim(), kind: 'pessoal', done: false }]); setDraft(''); };
  const agora = () => { const d = new Date(); return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2); };
  const toggle = (it) => setItems(items.map((x) => x === it ? { ...x, done: !x.done, at: !x.done ? agora() : null } : x));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <MaTop />
      {/* Progresso do Dia */}
      <div style={{ ...maS.card, border: '1px solid rgba(63,197,143,.2)', background: 'linear-gradient(135deg,rgba(63,197,143,.06),transparent)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 17, fontWeight: 600, whiteSpace: 'nowrap' }}><Icon name="circle-check" size={19} color="#3fc58f" />Progresso do Dia</div>
          <K.Btn small icon="history">Histórico</K.Btn>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 13.5, fontWeight: 500 }}>Tarefas Concluídas</span>
          <span style={{ fontSize: 13.5, color: '#737373' }}>{done} de {items.length}</span>
        </div>
        <div style={{ height: 12, borderRadius: 999, background: '#eef0ef', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: pct + '%', background: 'var(--gradient-primary)', borderRadius: 999, transition: 'width .3s' }}></div>
        </div>
        <p style={{ fontSize: 11.5, color: '#a3a3a3', marginTop: 8 }}>Nota: o progresso oficial (exibido para gestores) conta apenas tarefas obrigatórias.</p>
      </div>

      {/* Tarefas do Dia */}
      <div style={maS.card}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, gap: 8, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 17, fontWeight: 600 }}>Tarefas do Dia<span style={maS.countBadge}>{items.length}</span></div>
          {done > 0 && <button onClick={() => setHideDone(!hideDone)} style={maS.ghostSm}><Icon name={hideDone ? 'eye' : 'eye-off'} size={14} color="#737373" />{hideDone ? `Mostrar concluídas (${done})` : 'Ocultar concluídas'}</button>}
        </div>
        <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
          <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && add()} placeholder="Adicionar nova tarefa..." style={{ ...maS.input, flex: 1, minWidth: 0 }} />
          <button onClick={add} style={maS.iconPrimary}><Icon name="plus" size={18} color="#fff" /></button>
          {!M && <button style={maS.iconOutline}><Icon name="settings" size={17} color="#737373" /></button>}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {shown.map((it, i) => {
            const b = BADGE[it.kind];
            return (
              <div key={i} onClick={() => toggle(it)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 10, border: '1px solid #eee', borderLeft: `4px solid ${leftColor(it)}`, background: it.done ? '#fafafa' : it.kind === 'obrigatoria' ? 'rgba(63,197,143,.04)' : '#fff', cursor: 'pointer' }}>
                <span style={{ height: 20, width: 20, borderRadius: 5, border: it.done ? 'none' : '2px solid #cfcfcf', background: it.done ? '#3fc58f' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{it.done && <Icon name="check" size={13} color="#fff" />}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: it.done ? '#a3a3a3' : '#171717', textDecoration: it.done ? 'line-through' : 'none' }}>{it.t}</div>
                  {it.done && it.at && <div style={{ fontSize: 11.5, color: '#a3a3a3', display: 'flex', alignItems: 'center', gap: 4, marginTop: 3 }}><Icon name="clock" size={11} color="#a3a3a3" />Concluída às {it.at}</div>}
                </div>
                {!it.done && <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 8, background: b.bg, color: b.fg, border: `1px solid ${b.bd}`, flexShrink: 0 }}>{b.t}</span>}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

/* ---------------- MEUS LEADS ---------------- */
function MaLeads() {
  const M = K.M();
  const leads = GT.conversations.filter((c) => !c.group && c.qual && c.chipId !== 'sup');
  const nQual = leads.filter((l) => l.qual === 'qualified').length;
  const nPend = leads.filter((l) => l.qual === 'pending').length;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: M ? 'repeat(2,minmax(0,1fr))' : 'repeat(4,minmax(0,1fr))', gap: 14 }}>
        {[['Leads recentes', leads.length, '#3fc58f', 'user-plus'], ['Qualificados', nQual, '#059669', 'circle-check'], ['Pendentes', nPend, '#ca8a04', 'clock'], ['Vindos de anúncio', leads.filter((l) => l.origin && l.origin.type === 'ad').length, '#2563eb', 'megaphone']].map(([l, v, c, ic]) => (
          <div key={l} style={{ ...maS.card, padding: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ padding: 10, borderRadius: 11, background: c + '1a', flexShrink: 0 }}><Icon name={ic} size={18} color={c} /></div>
            <div><div style={{ fontSize: 22, fontWeight: 700 }}>{v}</div><div style={{ fontSize: 12, color: '#737373' }}>{l}</div></div>
          </div>
        ))}
      </div>
      <div style={maS.card}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6, gap: 8, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>Leads recebidos</div>
            <div style={{ fontSize: 12, color: '#737373', marginTop: 1 }}>todas as vendedoras · todos os números — os totais do topo são só do 4321</div>
          </div>
          <span style={{ fontSize: 12, color: '#a3a3a3' }}>Temperatura e qualificação definidas pela IA · origem pelo link que abriu a conversa</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {leads.map((l, i) => {
            const q = maQual[l.qual];
            return (
              <div key={l.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 4px', borderBottom: i < leads.length - 1 ? '1px solid #f3f3f3' : 'none' }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <K.Avatar initials={l.initials} color={GT.seller(l.sellerId).color} size={40} channel={l.channel} />
                  <span style={{ position: 'absolute', top: -4, right: -4, fontSize: 12 }}>{maTemp[l.temp].e}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.name} {!M && <span style={{ fontWeight: 400, color: '#a3a3a3', fontSize: 12 }}>· {l.city}</span>}</div>
                  <div style={{ fontSize: 12.5, color: '#737373', display: 'flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}><Icon name={GT.originIcon[l.origin.type]} size={12} color="#a3a3a3" />{l.origin.label}</div>
                </div>
                {!M && <span style={{ fontSize: 12, color: '#737373', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 6 }}><K.SellerAvatar id={l.sellerId} size={22} />{GT.seller(l.sellerId).name.split(' ')[0]}</span>}
                <span style={{ fontSize: 11.5, fontWeight: 500, padding: '3px 10px', borderRadius: 999, background: q.bg, color: q.fg, border: `1px solid ${q.bd}`, whiteSpace: 'nowrap' }}>{q.t}</span>
                {!M && <span style={{ fontSize: 12, color: '#a3a3a3', width: 44, textAlign: 'right' }}>{l.time}</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ---------------- MEUS CLIENTES ---------------- */
function MaClientes() {
  const M = K.M();
  const [view, setView] = React.useState(({ lista: 'lista', prospeccao: 'prioridades', prioridades: 'prioridades', kanban: 'kanban' })[window.GT_SUB] || 'lista');
  const [filter, setFilter] = React.useState(null);
  const status = [
    { k: 'all', v: 348, l: 'Total de Clientes', ic: 'users', c: '#3fc58f', big: true },
    { k: 'do_mes', v: 28, l: 'Do Mês', ic: 'crown', c: '#d97706' },
    { k: 'ativo', v: 212, l: 'Ativos', ic: 'user-check', c: '#059669' },
    { k: 'inativo', v: 42, l: 'Inativos', ic: 'user-x', c: '#737373' },
  ];
  const tiers = [
    { k: 'ouro', v: 64, l: 'Ouro', ic: 'star', c: '#ca8a04', bd: 'rgba(234,179,8,.3)' },
    { k: 'prata', v: 118, l: 'Prata', ic: 'award', c: '#64748b', bd: 'rgba(148,163,184,.3)' },
    { k: 'bronze', v: 166, l: 'Bronze', ic: 'medal', c: '#b45309', bd: 'rgba(180,83,9,.3)' },
  ];
  const sub = [['lista', 'Lista', 'list'], ['prioridades', M ? 'Prospecção' : 'Lista de Prospecção', 'target'], ['kanban', 'Kanban', 'kanban']];
  // clientes da carteira (nomes de GT.conversations)
  const clients = [
    { c: GT.conversations[0], tier: 'ouro', total: 12480, last: '2 dias', orders: 8, st: 'ativo' },
    { c: GT.conversations[5], tier: 'ouro', total: 9640, last: 'hoje', orders: 6, st: 'ativo' },
    { c: GT.conversations[2], tier: 'prata', total: 8910, last: '5 dias', orders: 5, st: 'ativo' },
    { c: GT.conversations[7], tier: 'bronze', total: 3500, last: '12 dias', orders: 1, st: 'ativo' },
    { c: GT.conversations[4], tier: 'bronze', total: 1240, last: '33 dias', orders: 1, st: 'inativo' },
  ];
  const shown = clients.filter((x) => !filter || filter === 'all' || x.tier === filter || x.st === filter || (filter === 'do_mes' && x.last === 'hoje'));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Status */}
      <div style={{ display: 'grid', gridTemplateColumns: M ? 'repeat(2,minmax(0,1fr))' : 'repeat(4,minmax(0,1fr))', gap: 12 }}>
        {status.map((s) => {
          const on = filter === s.k;
          return (
            <div key={s.k} onClick={() => setFilter(on ? null : s.k)} style={{ ...maS.card, padding: 16, cursor: 'pointer', border: s.big ? '1px solid rgba(63,197,143,.3)' : '1px solid #eee', background: s.big ? 'rgba(63,197,143,.05)' : '#fff', boxShadow: on ? '0 0 0 2px #3fc58f' : 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: s.big ? 30 : 22, fontWeight: 700, color: s.big ? '#2fae7c' : '#171717' }}>{s.v}</div>
                  <div style={{ fontSize: s.big ? 13 : 12, fontWeight: s.big ? 600 : 400, color: s.big ? '#2fae7c' : '#737373' }}>{s.l}</div>
                </div>
                <div style={{ padding: s.big ? 8 : 6, borderRadius: 10, background: s.c + '1a' }}><Icon name={s.ic} size={s.big ? 18 : 15} color={s.c} /></div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Tiers */}
      <div style={{ display: 'grid', gridTemplateColumns: M ? 'repeat(3,minmax(0,1fr))' : 'repeat(3,minmax(0,1fr))', gap: 12 }}>
        {tiers.map((s) => {
          const on = filter === s.k;
          return (
            <div key={s.k} onClick={() => setFilter(on ? null : s.k)} style={{ ...maS.card, padding: M ? 12 : 14, cursor: 'pointer', border: `1px solid ${s.bd}`, display: 'flex', alignItems: 'center', gap: 10, boxShadow: on ? `0 0 0 2px ${s.c}` : 'var(--shadow-sm)' }}>
              <div style={{ padding: 8, borderRadius: 10, background: s.c + '1a', flexShrink: 0 }}><Icon name={s.ic} size={18} color={s.c} /></div>
              <div><div style={{ fontSize: 22, fontWeight: 700 }}>{s.v}</div><div style={{ fontSize: 12, color: '#737373' }}>{s.l}</div></div>
            </div>
          );
        })}
      </div>
      {/* Sub-abas */}
      <K.SegTabs tabs={sub} value={view} onChange={setView} style={{ alignSelf: 'flex-start' }} />
      {view === 'prioridades' ? <ProspeccaoLists /> : (
      <div style={{ ...maS.card, padding: M ? 14 : 22 }}>
        {view === 'kanban' ? (
          <div style={{ display: 'grid', gridTemplateColumns: M ? '1fr' : 'repeat(3,minmax(0,1fr))', gap: 12 }}>
            {[['Ouro', 'ouro'], ['Prata', 'prata'], ['Bronze', 'bronze']].map(([col, tk]) => (
              <div key={col} style={{ background: '#f7f8f8', borderRadius: 12, padding: 12, border: '1px solid #f0f0f0' }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: maTier[tk].c, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}><K.Dot color={maTier[tk].c} size={8} />{col} <span style={{ color: '#a3a3a3', fontWeight: 500 }}>· {clients.filter((x) => x.tier === tk).length}</span></div>
                {clients.filter((x) => x.tier === tk).map((x) => (
                  <div key={x.c.id} style={{ background: '#fff', borderRadius: 10, padding: 10, marginBottom: 8, border: '1px solid #eee' }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{x.c.name}</div>
                    <div style={{ fontSize: 11.5, color: '#737373' }}>{GT.fmt.brl(x.total)} · {x.orders} {x.orders === 1 ? 'pedido' : 'pedidos'} · {x.c.city}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <K.Table dense={M} cols={M ? [
            // celular: 3 colunas que cabem em 414 px (a de 7 rolava de lado sem pista) — tier vira a 2ª linha do cliente, como na tabela de reativação do Dashboard
            { h: 'Cliente', cell: (x) => <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}><K.Avatar initials={x.c.initials} color="#2fae7c" size={28} fontSize={11} channel={x.c.channel} /><div style={{ minWidth: 0, maxWidth: 150 }}><div style={{ fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{x.c.name}</div><div style={{ fontSize: 11, fontWeight: 600, color: maTier[x.tier].c }}>● {maTier[x.tier].t} <span style={{ color: '#a3a3a3', fontWeight: 400 }}>· {x.st === 'ativo' ? 'ativo' : 'inativo'}</span></div></div></div> },
            { h: 'Total', align: 'right', cell: (x) => <b style={{ whiteSpace: 'nowrap' }}>{GT.fmt.brl(x.total)}</b> },
            { h: 'Vend.', cell: (x) => <K.SellerAvatar id={x.c.sellerId} size={22} /> },
          ] : [
            { h: 'Cliente', cell: (x) => <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><K.Avatar initials={x.c.initials} color="#2fae7c" size={32} fontSize={12} channel={x.c.channel} /><div><div style={{ fontWeight: 500 }}>{x.c.name}</div><div style={{ fontSize: 11.5, color: '#a3a3a3' }}>{x.c.city}</div></div></div> },
            { h: 'Tier', cell: (x) => <span style={{ fontSize: 12, fontWeight: 600, color: maTier[x.tier].c, background: maTier[x.tier].c + '1a', padding: '2px 10px', borderRadius: 999 }}>● {maTier[x.tier].t}</span> },
            { h: 'Status', cell: (x) => <span style={{ fontSize: 12, fontWeight: 500, color: x.st === 'ativo' ? '#16a34a' : '#a3a3a3' }}>{x.st === 'ativo' ? 'Ativo' : 'Inativo'}</span> },
            { h: 'Total', align: 'right', cell: (x) => <b>{GT.fmt.brl(x.total)}</b> },
            { h: 'Pedidos', align: 'right', cell: (x) => x.orders },
            { h: 'Última compra', cell: (x) => <span style={{ color: '#737373' }}>{x.last === 'hoje' ? 'hoje' : 'há ' + x.last}</span> },
            { h: 'Vendedora', cell: (x) => <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><K.SellerAvatar id={x.c.sellerId} size={22} />{GT.seller(x.c.sellerId).name.split(' ')[0]}</span> },
          ]} rows={shown} />
        )}
      </div>
      )}
    </div>
  );
}

/* ---------------- VISÃO DA EQUIPE ---------------- */
function MaEquipe() {
  const M = K.M();
  const obj = [
    { o: 'Preço / acima do orçamento', n: 34 },
    { o: 'Vai pensar / sem urgência', n: 27 },
    { o: 'Frete alto', n: 18 },
    { o: 'Mínimo do atacado (1 grade)', n: 12 },
    { o: 'Prazo de entrega', n: 7 },
  ];
  const max = obj[0].n;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div>
        <h2 style={{ fontSize: 19, fontWeight: 600 }}>Visão da Equipe</h2>
        <p style={{ fontSize: 13.5, color: '#737373', marginTop: 2 }}>Acompanhe o desempenho, metas e progresso das vendedoras</p>
      </div>
      <GoalProgress />
      <div style={{ display: 'grid', gridTemplateColumns: M ? 'minmax(0,1fr)' : 'repeat(2,minmax(0,1fr))', gap: 16 }}>
        <K.Card title="Objeções da Equipe" sub="Motivos de não-compra identificados pela IA nas conversas" right={<K.Select value="mes" options={[['mes', 'Este Mês'], ['sem', 'Esta Semana']]} width={130} small />}>
          {obj.map((o, i) => (
            <div key={i} style={{ marginBottom: i < obj.length - 1 ? 12 : 0 }}>
              {M && <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#5f5e5a', marginBottom: 5 }}><span>{o.o}</span><b style={{ color: '#171717' }}>{o.n}</b></div>}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {!M && <span style={{ fontSize: 13, width: 210, color: '#5f5e5a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flexShrink: 0 }}>{o.o}</span>}
                <div style={{ flex: 1 }}><K.Progress value={(o.n / max) * 100} color="linear-gradient(90deg,#f59e0b,#ef4444)" /></div>
                {!M && <span style={{ fontSize: 13.5, fontWeight: 700, width: 30, textAlign: 'right' }}>{o.n}</span>}
              </div>
            </div>
          ))}
        </K.Card>
        <K.Card title="Atendimento por número" sub="Conversas de hoje e 1ª resposta (mediana) em cada chip">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {GT.chips.filter((c) => c.channel === 'whatsapp').map((c, i) => {
              const med = ['4 min', '6 min', '18 min', '3 min'][i];
              const slow = i === 2;
              return (
                <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <K.Avatar initials={c.short} color={slow ? '#ca8a04' : '#25D366'} size={32} fontSize={10} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.label} <span style={{ color: '#a3a3a3', fontWeight: 400, fontSize: 12 }}>· {c.sellerIds.map((id) => GT.seller(id).name.split(' ')[0]).join(', ')}</span></div>
                    <div style={{ fontSize: 12, color: '#737373' }}>{c.convosToday} conversas hoje</div>
                  </div>
                  <K.Badge color={slow ? '#ca8a04' : '#16a34a'} bg={slow ? 'rgba(234,179,8,.12)' : 'rgba(34,197,94,.1)'} icon="timer">{med}</K.Badge>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 12, fontSize: 11.5, color: '#a3a3a3' }}>Saudações e mensagens de ausência não contam como resposta.</div>
        </K.Card>
      </div>
    </div>
  );
}

const maS = {
  card: { background: '#fff', borderRadius: 14, border: '1px solid #eee', padding: 22, boxShadow: 'var(--shadow-sm)' },
  ghostSm: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontWeight: 500, padding: '6px 10px', borderRadius: 8, border: 'none', background: 'transparent', color: '#737373', cursor: 'pointer', fontFamily: 'Inter,sans-serif' },
  input: { fontFamily: 'Inter,sans-serif', fontSize: 14, padding: '11px 14px', borderRadius: 10, border: '1px solid #e5e5e5', background: '#fff', outline: 'none' },
  iconPrimary: { height: 44, width: 44, minWidth: 44, borderRadius: 10, border: 'none', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
  iconOutline: { height: 44, width: 44, minWidth: 44, borderRadius: 10, border: '1px solid #e5e5e5', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
  countBadge: { fontSize: 12, fontWeight: 600, padding: '2px 9px', borderRadius: 999, background: '#f1f1f1', color: '#5f5e5a' },
};
window.MinhaArea = MinhaArea;
