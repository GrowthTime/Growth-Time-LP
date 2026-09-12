// GT System — sidebar igual ao GTR: trilho recolhido (64px, só ícones) que EXPANDE ao passar o mouse (256px, sobrepõe o conteúdo com sombra).
// Cores = tokens --sidebar-* do index.css (fundo 7%, accent 14%, primário verde).
function Sidebar({ active, onNavigate }) {
  const [open, setOpen] = React.useState(false);
  const items = [
    { id: 'dashboard', name: 'Dashboard', icon: 'layout-dashboard' },
    { id: 'area', name: 'Minha Área', icon: 'user-circle' },
    { id: 'conversas', name: 'Mensagens', icon: 'message-square', dot: true, sub: [['conversas', 'Conversas'], ['disparos', 'Disparos']] },
    { id: 'produtos', name: 'Produtos', icon: 'package' },
    { id: 'trafego', name: 'Mkt & Ads', icon: 'trending-up' },
    { id: 'config', name: 'Configurações', icon: 'settings' },
  ];
  const W = open ? 256 : 64;
  return (
    <div style={{ width: 64, flexShrink: 0, position: 'relative', zIndex: 30 }} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <aside style={{ ...sb.aside, width: W, boxShadow: open ? '0 25px 50px -12px rgba(0,0,0,.5)' : 'none' }}>
        <div style={{ ...sb.logoRow, justifyContent: open ? 'flex-start' : 'center', padding: open ? '0 16px' : '0 8px' }}>
          <img src="../assets/logo.png" alt="GT" style={{ height: 32, width: 32, objectFit: 'contain', flexShrink: 0 }} />
          {open && <div style={{ flex: 1, minWidth: 0 }}><div style={sb.brand}>Growth Time</div><div style={sb.brandSub}>Results</div></div>}
          {open && <div style={sb.companyChip}>{GT.company.logo}</div>}
        </div>
        <nav style={{ ...sb.nav, padding: open ? '16px 12px' : '16px 8px' }}>
          {items.map((it) => {
            const on = active === it.id;
            return (
              <div key={it.id}>
                <button onClick={() => onNavigate(it.id)} title={it.name} style={{ ...sb.link, ...(open ? {} : sb.linkC), ...(on ? sb.linkActive : {}) }}>
                  <span style={{ position: 'relative', display: 'flex' }}>
                    <Icon name={it.icon} size={20} color={on ? '#3fc58f' : 'rgba(245,245,245,.6)'} />
                    {it.dot && <span style={sb.dot}></span>}
                  </span>
                  {open && <span style={{ flex: 1, textAlign: 'left' }}>{it.name}</span>}
                </button>
                {open && on && it.sub && <div style={{ paddingLeft: 40, display: 'flex', flexDirection: 'column', gap: 2, marginTop: 2 }}>
                  {it.sub.map(([k, l]) => <button key={k} onClick={() => { window.GT_TAB = k === 'disparos' ? 'disparos' : ''; onNavigate(it.id, k); }} style={{ ...sb.subLink, ...((window.GT_TAB || 'conversas') === k ? sb.subOn : {}) }}>{l}</button>)}
                </div>}
              </div>
            );
          })}
        </nav>
        <div style={{ ...sb.userWrap, padding: open ? 16 : 8 }}>
          <div style={{ ...sb.userBox, padding: open ? 12 : 4, justifyContent: open ? 'flex-start' : 'center', gap: open ? 12 : 0 }}>
            <div style={sb.avatar}>MA</div>
            {open && <div style={{ flex: 1, minWidth: 0 }}><div style={sb.userName}>Marina Alves</div><div style={sb.userMail}>Admin</div></div>}
            {open && <Icon name="log-out" size={16} color="rgba(245,245,245,.6)" />}
          </div>
          {!open && <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}><Icon name="log-out" size={16} color="rgba(245,245,245,.6)" /></div>}
        </div>
      </aside>
    </div>
  );
}
const sb = {
  aside: { position: 'absolute', top: 0, left: 0, bottom: 0, background: '#121212', borderRight: '1px solid #242424', display: 'flex', flexDirection: 'column', transition: 'width .2s ease, box-shadow .2s', overflow: 'hidden' },
  logoRow: { height: 64, display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid #242424', flexShrink: 0 },
  brand: { fontSize: 14, fontWeight: 600, color: '#f5f5f5', lineHeight: 1.1, whiteSpace: 'nowrap' },
  brandSub: { fontSize: 12, color: '#3fc58f', fontWeight: 500 },
  companyChip: { height: 28, width: 28, borderRadius: 6, background: '#242424', border: '1px solid #2e2e2e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 600, color: '#f5f5f5', flexShrink: 0 },
  nav: { flex: 1, display: 'flex', flexDirection: 'column', gap: 4 },
  link: { display: 'flex', alignItems: 'center', gap: 12, height: 40, padding: '0 12px', borderRadius: 8, color: 'rgba(245,245,245,.7)', fontSize: 14, fontWeight: 400, background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif', width: '100%', whiteSpace: 'nowrap' },
  linkC: { justifyContent: 'center', padding: 0 },
  linkActive: { background: '#242424', color: '#3fc58f', fontWeight: 500 },
  subLink: { textAlign: 'left', fontSize: 13, color: 'rgba(245,245,245,.7)', background: 'transparent', border: 'none', padding: '6px 10px', borderRadius: 6, cursor: 'pointer', fontFamily: 'Inter, sans-serif' },
  subOn: { color: '#3fc58f', background: 'rgba(63,197,143,.1)' },
  dot: { position: 'absolute', top: -2, right: -3, height: 7, width: 7, borderRadius: 999, background: '#3fc58f', border: '1.5px solid #121212' },
  userWrap: { borderTop: '1px solid #242424', flexShrink: 0 },
  userBox: { display: 'flex', alignItems: 'center', borderRadius: 10, background: '#242424' },
  avatar: { height: 40, width: 40, borderRadius: 999, background: '#3fc58f', color: '#fff', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 14 },
  userName: { fontSize: 14, fontWeight: 500, color: '#f5f5f5', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  userMail: { fontSize: 12, color: 'rgba(245,245,245,.6)', whiteSpace: 'nowrap' },
};
window.Sidebar = Sidebar;
