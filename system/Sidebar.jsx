// GT System — dark sidebar (mirrors gt-system Sidebar.tsx)
function Sidebar({ active, onNavigate }) {
  const items = [
    { id: 'dashboard', name: 'Dashboard', icon: 'layout-dashboard' },
    { id: 'area', name: 'Minha Área', icon: 'user-circle' },
    { id: 'conversas', name: 'Mensagens', icon: 'message-square', badge: 3 },
    { id: 'trafego', name: 'Mkt & Ads', icon: 'trending-up' },
    { id: 'config', name: 'Configurações', icon: 'settings' },
  ];
  return (
    <aside style={sb.aside}>
      <div style={sb.logoRow}>
        <img src="../assets/logo.png" alt="GT" style={{ height: 30, width: 30, objectFit: 'contain' }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={sb.brand}>Growth Time</div>
          <div style={sb.brandSub}>Results</div>
        </div>
        <div style={sb.companyChip}>MF</div>
      </div>

      <nav style={sb.nav}>
        {items.map((it) => {
          const on = active === it.id;
          return (
            <button key={it.id} onClick={() => onNavigate(it.id)}
              style={{ ...sb.link, ...(on ? sb.linkActive : {}) }}>
              <Icon name={it.icon} size={20} color={on ? '#38cc9c' : 'rgba(245,245,245,.6)'} />
              <span style={{ flex: 1, textAlign: 'left' }}>{it.name}</span>
              {it.badge && <span style={sb.badge}>{it.badge}</span>}
            </button>
          );
        })}
      </nav>

      <div style={sb.userWrap}>
        <div style={sb.userBox}>
          <div style={sb.avatar}>MA</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={sb.userName}>Marina Alves</div>
            <div style={sb.userMail}>marina@modafashion.com.br</div>
          </div>
          <Icon name="log-out" size={16} color="rgba(245,245,245,.6)" />
        </div>
      </div>
    </aside>
  );
}

const sb = {
  aside: { width: 248, background: '#121212', borderRight: '1px solid #242424', display: 'flex', flexDirection: 'column', height: '100%', flexShrink: 0 },
  logoRow: { height: 64, display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px', borderBottom: '1px solid #242424' },
  brand: { fontSize: 14, fontWeight: 600, color: '#f5f5f5', lineHeight: 1.1, whiteSpace: 'nowrap' },
  brandSub: { fontSize: 12, color: '#38cc9c', fontWeight: 500 },
  companyChip: { height: 28, width: 28, borderRadius: 6, background: '#242424', border: '1px solid #2e2e2e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 600, color: '#f5f5f5' },
  nav: { flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4 },
  link: { display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 8, color: 'rgba(245,245,245,.7)', fontSize: 14, fontWeight: 400, background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all .2s' },
  linkActive: { background: '#242424', color: '#38cc9c', fontWeight: 500 },
  adminLink: { color: '#f5f5f5', marginBottom: 14 },
  badge: { height: 20, minWidth: 20, padding: '0 6px', borderRadius: 999, background: '#38cc9c', color: '#fff', fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  userWrap: { borderTop: '1px solid #242424', padding: 16 },
  userBox: { display: 'flex', alignItems: 'center', gap: 12, padding: 12, borderRadius: 10, background: '#242424' },
  avatar: { height: 40, width: 40, borderRadius: 999, background: '#38cc9c', color: '#fff', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 14 },
  userName: { fontSize: 14, fontWeight: 500, color: '#f5f5f5', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  userMail: { fontSize: 12, color: 'rgba(245,245,245,.6)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
};
window.Sidebar = Sidebar;
