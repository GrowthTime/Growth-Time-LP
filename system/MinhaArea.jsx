// GT System — Minha Área (SellerArea). Faithful to gt-system SellerArea.tsx.
function MinhaArea() {
  const [tab, setTab] = React.useState('checklist');
  const tabs = [
    ['checklist', 'Checklist do Dia', 'circle-check'],
    ['leads', 'Meus Leads', 'user-plus'],
    ['clientes', 'Meus Clientes', 'store'],
    ['equipe', 'Visão da Equipe', 'users'],
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700 }}>Minha Área</h1>
          <p style={{ fontSize: 14, color: '#737373', marginTop: 2 }}>Gerencie automações e acompanhe o desempenho da equipe</p>
        </div>
        <button style={ma.outline}><Icon name="clipboard-list" size={15} color="#171717" />Registro Diário</button>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {tabs.map(([k, l, ic]) => (
          <button key={k} onClick={() => setTab(k)} style={{ ...ma.tab, ...(tab === k ? ma.tabOn : {}) }}>
            <Icon name={ic} size={15} color={tab === k ? '#fff' : '#737373'} />{l}
          </button>
        ))}
      </div>

      {tab === 'checklist' && <Checklist />}
      {tab === 'leads' && <MeusLeads />}
      {tab === 'clientes' && <MeusClientes />}
      {tab === 'equipe' && <VisaoEquipe />}
    </div>
  );
}

/* ---------------- CHECKLIST DO DIA ---------------- */
function Checklist() {
  const init = [
    { t: 'Responder todos os leads novos do dia', kind: 'obrigatoria', done: false },
    { t: 'Fazer follow-up dos clientes sem resposta há 2 dias', kind: 'obrigatoria', done: false },
    { t: 'Enviar catálogo da nova coleção para base ativa', kind: 'comum', done: false },
    { t: 'Qualificar leads pendentes no CRM', kind: 'obrigatoria', done: true, at: '10:24' },
    { t: 'Postar story com peça do dia', kind: 'pessoal', done: true, at: '09:12' },
    { t: 'Registrar vendas fechadas no sistema', kind: 'comum', done: false },
  ];
  const [items, setItems] = React.useState(init);
  const [draft, setDraft] = React.useState('');
  const [hideDone, setHideDone] = React.useState(false);
  const done = items.filter((i) => i.done).length;
  const pct = items.length ? Math.round((done / items.length) * 100) : 0;
  const sorted = [...items].sort((a, b) => (a.obrigatoria === b.obrigatoria ? 0 : 0) || (a.done === b.done ? 0 : a.done ? 1 : -1));
  const shown = hideDone ? sorted.filter((i) => !i.done) : sorted;
  const BADGE = {
    obrigatoria: { t: 'Obrigatória', bg: '#38cc9c', fg: '#fff', bd: '#38cc9c' },
    pessoal: { t: 'Pessoal', bg: '#f1f1f1', fg: '#5f5e5a', bd: '#f1f1f1' },
    comum: { t: 'Comum', bg: '#fff', fg: '#737373', bd: '#e5e5e5' },
  };
  const leftColor = (it) => it.done ? '#d4d4d4' : it.kind === 'obrigatoria' ? '#38cc9c' : '#cfcfcf';
  const add = () => { if (!draft.trim()) return; setItems([...items, { t: draft.trim(), kind: 'pessoal', done: false }]); setDraft(''); };
  const toggle = (idx) => setItems(items.map((x, j) => j === sortedIndex(idx) ? { ...x, done: !x.done, at: !x.done ? agora() : null } : x));
  function sortedIndex(shownIdx) { return items.indexOf(shown[shownIdx]); }
  function agora() { const d = new Date(); return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2); }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Progresso do Dia */}
      <div style={{ ...ma.card, border: '1px solid rgba(56,204,156,.2)', background: 'linear-gradient(135deg,rgba(56,204,156,.06),transparent)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 17, fontWeight: 600, whiteSpace: 'nowrap' }}><Icon name="circle-check" size={19} color="#38cc9c" />Progresso do Dia</div>
          <button style={ma.outlineSm}><Icon name="history" size={14} color="#171717" />Histórico</button>
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
      <div style={ma.card}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 17, fontWeight: 600 }}>Tarefas do Dia<span style={ma.countBadge}>{items.length}</span></div>
          {done > 0 && <button onClick={() => setHideDone(!hideDone)} style={ma.ghostSm}><Icon name={hideDone ? 'eye' : 'eye-off'} size={14} color="#737373" />{hideDone ? `Mostrar concluídas (${done})` : 'Ocultar concluídas'}</button>}
        </div>
        <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
          <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && add()} placeholder="Adicionar nova tarefa..." style={{ ...ma.input, flex: 1 }} />
          <button onClick={add} style={ma.iconPrimary}><Icon name="plus" size={18} color="#fff" /></button>
          <button style={ma.iconOutline}><Icon name="settings" size={17} color="#737373" /></button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {shown.map((it, i) => {
            const b = BADGE[it.kind];
            return (
              <div key={i} onClick={() => toggle(i)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 10, border: '1px solid #eee', borderLeft: `4px solid ${leftColor(it)}`, background: it.done ? '#fafafa' : it.kind === 'obrigatoria' ? 'rgba(56,204,156,.04)' : '#fff', cursor: 'pointer' }}>
                <span style={{ height: 20, width: 20, borderRadius: 5, border: it.done ? 'none' : '2px solid #cfcfcf', background: it.done ? '#38cc9c' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{it.done && <Icon name="check" size={13} color="#fff" />}</span>
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

      {/* Amanhã */}
      <div style={{ ...ma.card, background: '#f7f8f8', border: '1px solid #eee' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14.5, fontWeight: 600, color: '#737373', marginBottom: 10 }}><Icon name="calendar" size={15} color="#737373" />Amanhã (04/06)<span style={{ ...ma.countBadge, background: '#fff', color: '#737373', border: '1px solid #e5e5e5' }}>3 tarefas</span></div>
        {['Revisar metas da semana', 'Disparo de reativação da base', 'Conferir criativos novos'].map((t, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 13.5, color: '#737373', padding: '4px 0' }}>
            <span style={{ height: 6, width: 6, borderRadius: 999, background: i === 0 ? '#38cc9c' : '#cfcfcf' }}></span>{t}
            {i === 0 && <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 600, padding: '2px 9px', borderRadius: 8, background: '#f1f1f1', color: '#5f5e5a' }}>Obrigatória</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- MEUS LEADS ---------------- */
function MeusLeads() {
  const leads = [
    { n: 'Revenda Bella', uf: 'SP', src: 'Anúncio · Coleção Verão', temp: '🔥', q: 'pending', t: '8min' },
    { n: 'Moda & Cia', uf: 'CE', src: 'Anúncio · Grade Atacado', temp: '🔥', q: 'qualified', t: '22min' },
    { n: 'Loja Encanto', uf: 'BA', src: 'Indicação', temp: '❄️', q: 'pending', t: '1h' },
    { n: 'Ateliê Norte', uf: 'PA', src: 'Anúncio · Reels', temp: '❄️', q: 'qualified', t: '3h' },
    { n: 'Boutique Lis', uf: 'PE', src: 'Anúncio · Carrossel', temp: '🧊', q: 'not_qualified', t: 'Ontem' },
  ];
  const Q = {
    qualified: { t: 'Qualificado', bg: 'rgba(34,197,94,.1)', fg: '#16a34a', bd: 'rgba(34,197,94,.3)' },
    pending: { t: 'Pendente', bg: 'rgba(234,179,8,.1)', fg: '#ca8a04', bd: 'rgba(234,179,8,.3)' },
    not_qualified: { t: 'Não Qualif.', bg: 'rgba(239,68,68,.1)', fg: '#dc2626', bd: 'rgba(239,68,68,.3)' },
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: (window.GT_MOBILE?'repeat(2,1fr)':'repeat(3,1fr)'), gap: 14 }}>
        {[['Leads do dia', '12', '#38cc9c', 'user-plus'], ['Qualificados', '7', '#059669', 'circle-check'], ['Pendentes', '4', '#ca8a04', 'clock']].map(([l, v, c, ic]) => (
          <div key={l} style={{ ...ma.card, padding: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ padding: 10, borderRadius: 11, background: c + '1a' }}><Icon name={ic} size={18} color={c} /></div>
            <div><div style={{ fontSize: 22, fontWeight: 700 }}>{v}</div><div style={{ fontSize: 12, color: '#737373' }}>{l}</div></div>
          </div>
        ))}
      </div>
      <div style={ma.card}>
        <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>Leads recebidos</div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {leads.map((l, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 4px', borderBottom: i < leads.length - 1 ? '1px solid #f3f3f3' : 'none' }}>
              <div style={{ position: 'relative' }}>
                <div style={{ height: 40, width: 40, borderRadius: 999, background: 'rgba(56,204,156,.1)', color: '#27ae8f', fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{l.n.slice(0, 2).toUpperCase()}</div>
                <span style={{ position: 'absolute', bottom: -2, right: -2, fontSize: 13 }}>{l.temp}</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{l.n} <span style={{ fontWeight: 400, color: '#a3a3a3', fontSize: 12 }}>· {l.uf}</span></div>
                <div style={{ fontSize: 12.5, color: '#737373' }}>{l.src}</div>
              </div>
              <span style={{ fontSize: 11.5, fontWeight: 500, padding: '3px 10px', borderRadius: 999, background: Q[l.q].bg, color: Q[l.q].fg, border: `1px solid ${Q[l.q].bd}` }}>{Q[l.q].t}</span>
              <span style={{ fontSize: 12, color: '#a3a3a3', width: 44, textAlign: 'right' }}>{l.t}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- MEUS CLIENTES ---------------- */
function MeusClientes() {
  const [view, setView] = React.useState('lista');
  const [filter, setFilter] = React.useState(null);
  const status = [
    { k: 'all', v: 348, l: 'Total de Clientes', ic: 'users', c: '#38cc9c', big: true },
    { k: 'do_mes', v: 28, l: 'Do Mês', ic: 'crown', c: '#d97706' },
    { k: 'ativo', v: 212, l: 'Ativos', ic: 'user-check', c: '#059669' },
    { k: 'inativo', v: 42, l: 'Inativos', ic: 'user-x', c: '#737373' },
  ];
  const tiers = [
    { k: 'ouro', v: 64, l: 'Ouro', ic: 'star', c: '#ca8a04', bd: 'rgba(234,179,8,.3)' },
    { k: 'prata', v: 118, l: 'Prata', ic: 'award', c: '#64748b', bd: 'rgba(148,163,184,.3)' },
    { k: 'bronze', v: 166, l: 'Bronze', ic: 'medal', c: '#b45309', bd: 'rgba(180,83,9,.3)' },
  ];
  const sub = [['lista', 'Lista', 'list'], ['prioridades', 'Lista de Prospecção', 'target'], ['kanban', 'Kanban', 'kanban']];
  const clients = [
    { n: 'Patrícia Modas', tier: 'ouro', total: 'R$ 12.480', last: '2 dias', orders: 8, st: 'ativo' },
    { n: 'Camila Atacado', tier: 'ouro', total: 'R$ 8.910', last: '5 dias', orders: 5, st: 'ativo' },
    { n: 'Bella Store', tier: 'prata', total: 'R$ 5.300', last: '8 dias', orders: 3, st: 'ativo' },
    { n: 'Loja da Duda', tier: 'bronze', total: 'R$ 1.240', last: '21 dias', orders: 1, st: 'inativo' },
  ];
  const TIER = { ouro: { t: 'Ouro', c: '#ca8a04' }, prata: { t: 'Prata', c: '#64748b' }, bronze: { t: 'Bronze', c: '#b45309' } };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Status cards */}
      <div style={{ display: 'grid', gridTemplateColumns: (window.GT_MOBILE?'repeat(2,1fr)':'repeat(4,1fr)'), gap: 12 }}>
        {status.map((s) => {
          const on = filter === s.k;
          return (
            <div key={s.k} onClick={() => setFilter(on ? null : s.k)} style={{ ...ma.card, padding: 16, cursor: 'pointer', border: s.big ? '1px solid rgba(56,204,156,.3)' : '1px solid #eee', background: s.big ? 'rgba(56,204,156,.05)' : '#fff', boxShadow: on ? '0 0 0 2px #38cc9c' : 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: s.big ? 30 : 22, fontWeight: 700, color: s.big ? '#27ae8f' : '#171717' }}>{s.v}</div>
                  <div style={{ fontSize: s.big ? 13 : 12, fontWeight: s.big ? 600 : 400, color: s.big ? '#27ae8f' : '#737373' }}>{s.l}</div>
                </div>
                <div style={{ padding: s.big ? 8 : 6, borderRadius: 10, background: s.c + '1a' }}><Icon name={s.ic} size={s.big ? 18 : 15} color={s.c} /></div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Tier cards */}
      <div style={{ display: 'grid', gridTemplateColumns: (window.GT_MOBILE?'repeat(2,1fr)':'repeat(3,1fr)'), gap: 12 }}>
        {tiers.map((s) => {
          const on = filter === s.k;
          return (
            <div key={s.k} onClick={() => setFilter(on ? null : s.k)} style={{ ...ma.card, padding: 14, cursor: 'pointer', border: `1px solid ${s.bd}`, display: 'flex', alignItems: 'center', gap: 12, boxShadow: on ? `0 0 0 2px ${s.c}` : 'var(--shadow-sm)' }}>
              <div style={{ padding: 8, borderRadius: 10, background: s.c + '1a' }}><Icon name={s.ic} size={18} color={s.c} /></div>
              <div><div style={{ fontSize: 22, fontWeight: 700 }}>{s.v}</div><div style={{ fontSize: 12, color: '#737373' }}>{s.l}</div></div>
            </div>
          );
        })}
      </div>
      {/* Sub-tabs */}
      <div style={{ display: 'flex', gap: 4, background: '#f5f5f5', borderRadius: 9, padding: 3, width: 'fit-content' }}>
        {sub.map(([k, l, ic]) => (
          <button key={k} onClick={() => setView(k)} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontWeight: 600, padding: '7px 13px', borderRadius: 7, border: 'none', cursor: 'pointer', fontFamily: 'Inter,sans-serif', background: view === k ? '#fff' : 'transparent', color: view === k ? '#171717' : '#737373', boxShadow: view === k ? 'var(--shadow-sm)' : 'none' }}>
            <Icon name={ic} size={13} color={view === k ? '#38cc9c' : '#a3a3a3'} />{l}
          </button>
        ))}
      </div>
      {/* Client list */}
      {view === 'prioridades' ? <ProspeccaoLists /> : (
      <div style={ma.card}>
        {view === 'kanban' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
            {[['Ouro', 'ouro'], ['Prata', 'prata'], ['Bronze', 'bronze']].map(([col, tk]) => (
              <div key={col} style={{ background: '#f7f8f8', borderRadius: 12, padding: 12, border: '1px solid #f0f0f0' }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: TIER[tk].c, marginBottom: 10 }}>● {col}</div>
                {clients.filter((c) => c.tier === tk).map((c, i) => (
                  <div key={i} style={{ background: '#fff', borderRadius: 10, padding: 10, marginBottom: 8, border: '1px solid #eee' }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{c.n}</div>
                    <div style={{ fontSize: 11.5, color: '#737373' }}>{c.total} · {c.orders} pedidos</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ textAlign: 'left', fontSize: 11.5, color: '#a3a3a3', textTransform: 'uppercase', letterSpacing: '.04em' }}>
              <th style={ma.th}>Cliente</th><th style={ma.th}>Tier</th><th style={ma.th}>Status</th><th style={ma.th}>Total</th><th style={ma.th}>Pedidos</th><th style={ma.th}>Última compra</th>
            </tr></thead>
            <tbody>
              {clients.map((c, i) => (
                <tr key={i} style={{ borderTop: '1px solid #f3f3f3' }}>
                  <td style={ma.td}><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><div style={{ height: 32, width: 32, borderRadius: 999, background: 'rgba(56,204,156,.1)', color: '#27ae8f', fontWeight: 600, fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{c.n.slice(0, 2).toUpperCase()}</div><span style={{ fontWeight: 500 }}>{c.n}</span></div></td>
                  <td style={ma.td}><span style={{ fontSize: 12, fontWeight: 600, color: TIER[c.tier].c, background: TIER[c.tier].c + '1a', padding: '2px 10px', borderRadius: 999 }}>● {TIER[c.tier].t}</span></td>
                  <td style={ma.td}><span style={{ fontSize: 12, fontWeight: 500, color: c.st === 'ativo' ? '#16a34a' : '#a3a3a3' }}>{c.st === 'ativo' ? 'Ativo' : 'Inativo'}</span></td>
                  <td style={{ ...ma.td, fontWeight: 600 }}>{c.total}</td>
                  <td style={ma.td}>{c.orders}</td>
                  <td style={{ ...ma.td, color: '#737373' }}>há {c.last}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {view === 'prioridades' && <div style={{ fontSize: 12.5, color: '#a3a3a3', marginTop: 12, textAlign: 'center' }}>Lista de prospecção priorizada por potencial de reativação.</div>}
      </div>
      )}
    </div>
  );
}

/* ---------------- VISÃO DA EQUIPE ---------------- */
function VisaoEquipe() {
  const obj = [
    { o: 'Preço / acima do orçamento', n: 34, pct: 100 },
    { o: 'Vai pensar / sem urgência', n: 27, pct: 79 },
    { o: 'Frete alto', n: 18, pct: 53 },
    { o: 'Mínimo do atacado', n: 12, pct: 35 },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
      <div>
        <h2 style={{ fontSize: 19, fontWeight: 600 }}>Visão da Equipe</h2>
        <p style={{ fontSize: 13.5, color: '#737373', marginTop: 2 }}>Acompanhe o desempenho, metas e progresso das vendedoras</p>
      </div>
      <GoalProgress />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <h3 style={{ fontSize: 17, fontWeight: 600 }}>Objeções da Equipe</h3>
          <div style={ma.select}>Este Mês <Icon name="chevron-down" size={14} color="#737373" /></div>
        </div>
        <div style={ma.card}>
          {obj.map((o, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: i < obj.length - 1 ? 12 : 0 }}>
              <span style={{ fontSize: 13.5, width: 200, color: '#5f5e5a' }}>{o.o}</span>
              <div style={{ flex: 1, height: 8, borderRadius: 999, background: '#f0f0f0', overflow: 'hidden' }}><div style={{ height: '100%', width: o.pct + '%', background: 'linear-gradient(90deg,#f59e0b,#ef4444)', borderRadius: 999 }}></div></div>
              <span style={{ fontSize: 13.5, fontWeight: 700, width: 36, textAlign: 'right' }}>{o.n}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const ma = {
  card: { background: '#fff', borderRadius: 14, border: '1px solid #eee', padding: 22, boxShadow: 'var(--shadow-sm)' },
  outline: { display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, fontWeight: 600, padding: '9px 16px', borderRadius: 10, border: '1px solid #e5e5e5', background: '#fff', cursor: 'pointer', fontFamily: 'Inter,sans-serif' },
  outlineSm: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontWeight: 600, padding: '7px 12px', borderRadius: 9, border: '1px solid #e5e5e5', background: '#fff', cursor: 'pointer', fontFamily: 'Inter,sans-serif' },
  ghostSm: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontWeight: 500, padding: '6px 10px', borderRadius: 8, border: 'none', background: 'transparent', color: '#737373', cursor: 'pointer', fontFamily: 'Inter,sans-serif' },
  tab: { display: 'flex', alignItems: 'center', gap: 7, fontSize: 13.5, fontWeight: 600, padding: '9px 16px', borderRadius: 10, border: '1px solid #eee', background: '#fff', color: '#737373', cursor: 'pointer', fontFamily: 'Inter,sans-serif' },
  tabOn: { background: '#38cc9c', color: '#fff', border: '1px solid #38cc9c' },
  select: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 500, padding: '8px 14px', borderRadius: 10, border: '1px solid #e5e5e5', background: '#fff', cursor: 'pointer' },
  input: { fontFamily: 'Inter,sans-serif', fontSize: 14, padding: '11px 14px', borderRadius: 10, border: '1px solid #e5e5e5', background: '#fff', outline: 'none' },
  iconPrimary: { height: 44, width: 44, minWidth: 44, borderRadius: 10, border: 'none', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
  iconOutline: { height: 44, width: 44, minWidth: 44, borderRadius: 10, border: '1px solid #e5e5e5', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
  countBadge: { fontSize: 12, fontWeight: 600, padding: '2px 9px', borderRadius: 999, background: '#f1f1f1', color: '#5f5e5a' },
  th: { padding: '8px 10px', fontWeight: 600 },
  td: { padding: '12px 10px', fontSize: 13.5 },
};
window.MinhaArea = MinhaArea;
