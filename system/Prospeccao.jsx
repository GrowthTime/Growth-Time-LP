// GT System — Lista de Prospecção (CRMPriorityLists). Faithful to gt-system.
function ProspeccaoLists() {
  const reativacao = [
    { id: 'ouro', title: 'Clientes Ouro Inativos', desc: 'Prioridade máxima — clientes premium sem compra recente', ic: 'crown', col: '#ca8a04', bg: 'rgba(234,179,8,.1)',
      clients: [
        { n: 'Atacado Premium CE', s: 'Marina Alves', v: 'R$ 24.800', ad: true },
        { n: 'Boutique Aurora', s: 'Ana Silva', v: 'R$ 18.200', ad: false },
        { n: 'Modas Lúcia', s: 'Júlia Costa', v: 'R$ 15.640', ad: true },
        { n: 'Loja Vitrine SP', s: 'Marina Alves', v: 'R$ 12.900', ad: false },
      ] },
    { id: 'prata', title: 'Clientes Prata Inativos', desc: 'Prioridade importante — clientes intermediários inativos', ic: 'medal', col: '#64748b', bg: 'rgba(148,163,184,.12)',
      clients: [
        { n: 'Ateliê Sul', s: 'Ana Silva', v: 'R$ 7.300', ad: false },
        { n: 'Bella Confecções', s: 'Bia Ramos', v: 'R$ 6.150', ad: true },
        { n: 'Revenda Estrela', s: 'Júlia Costa', v: 'R$ 5.480', ad: false },
      ] },
    { id: 'bronze', title: 'Clientes Bronze Inativos', desc: 'Prioridade menor — clientes iniciais inativos', ic: 'award', col: '#b45309', bg: 'rgba(180,83,9,.1)',
      clients: [
        { n: 'Loja da Duda', s: 'Bia Ramos', v: 'R$ 1.240', ad: false },
        { n: 'Encanto Kids', s: 'Ana Silva', v: 'R$ 980', ad: true },
      ] },
  ];
  const fortalecer = [
    { id: 'ativos', title: 'Clientes Ativos', desc: 'Ordenados por valor total comprado (maior → menor)', ic: 'users', col: '#059669', bg: 'rgba(16,185,129,.1)',
      clients: [
        { n: 'Patrícia Modas', s: 'Marina Alves', v: 'R$ 12.480', ad: true },
        { n: 'Camila Atacado', s: 'Júlia Costa', v: 'R$ 8.910', ad: false },
        { n: 'Bella Store', s: 'Ana Silva', v: 'R$ 5.300', ad: true },
        { n: 'Moda & Cia', s: 'Bia Ramos', v: 'R$ 4.120', ad: true },
      ] },
    { id: 'do_mes', title: 'Clientes do Mês', desc: 'Ordenados por valor total comprado (maior → menor)', ic: 'star', col: '#38cc9c', bg: 'rgba(56,204,156,.1)',
      clients: [
        { n: 'Revenda Bella', s: 'Marina Alves', v: 'R$ 9.640', ad: true },
        { n: 'Fashion Norte', s: 'Júlia Costa', v: 'R$ 6.880', ad: false },
      ] },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <Category badge="Reativação" badgeBg="#ef4444" icon="history" cols={3} lists={reativacao} />
      <Category badge="Fortalecer Relacionamento" badgeBg="#38cc9c" icon="heart" cols={2} lists={fortalecer} />
    </div>
  );
}

function Category({ badge, badgeBg, icon, cols, lists }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, alignSelf: 'flex-start', fontSize: 12, fontWeight: 600, color: '#fff', background: badgeBg, padding: '5px 12px', borderRadius: 999 }}>
        <Icon name={icon} size={13} color="#fff" />{badge}
      </span>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols},1fr)`, gap: 14 }}>
        {lists.map((l) => <ProspCard key={l.id} list={l} />)}
      </div>
    </div>
  );
}

function ProspCard({ list }) {
  const [expanded, setExpanded] = React.useState(false);
  const shown = expanded ? list.clients : list.clients.slice(0, 3);
  return (
    <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #eee', boxShadow: 'var(--shadow-sm)', padding: 18 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, minWidth: 0 }}>
          <div style={{ padding: 7, borderRadius: 9, background: list.bg, flexShrink: 0 }}><Icon name={list.ic} size={16} color={list.col} /></div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600, lineHeight: 1.2 }}>{list.title}</div>
            <div style={{ fontSize: 11.5, color: '#a3a3a3', marginTop: 2, lineHeight: 1.35 }}>{list.desc}</div>
          </div>
        </div>
        <span style={{ fontSize: 12, fontWeight: 600, padding: '2px 9px', borderRadius: 7, background: '#f1f1f1', color: '#5f5e5a', flexShrink: 0 }}>{list.clients.length}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {shown.map((c, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '8px 10px', borderRadius: 9, background: '#f7f8f8' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, flex: 1 }}>
              <Icon name="store" size={15} color="#a3a3a3" />
              <div style={{ minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.n}</span>
                  {c.ad && <span style={{ fontSize: 9, fontWeight: 700, color: '#2563eb', background: 'rgba(37,99,235,.1)', padding: '1px 6px', borderRadius: 5, whiteSpace: 'nowrap' }}>📣 Anúncio</span>}
                </div>
                <div style={{ fontSize: 11.5, color: '#737373' }}>{c.s} · {c.v}</div>
              </div>
            </div>
            <button style={{ height: 32, width: 32, borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }} title="Abrir conversa"><Icon name="message-circle" size={16} color="#059669" /></button>
          </div>
        ))}
      </div>
      {list.clients.length > 3 && (
        <button onClick={() => setExpanded(!expanded)} style={{ width: '100%', marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, fontSize: 12.5, fontWeight: 500, color: '#737373', background: 'transparent', border: 'none', cursor: 'pointer', padding: '7px 0', fontFamily: 'Inter,sans-serif' }}>
          <Icon name={expanded ? 'chevron-up' : 'chevron-down'} size={14} color="#737373" />{expanded ? 'Mostrar menos' : `Ver todos (${list.clients.length})`}
        </button>
      )}
    </div>
  );
}
window.ProspeccaoLists = ProspeccaoLists;
