// GT System — Configurações (Settings). First layer: Empresa tab fully built.
function Settings() {
  const [tab, setTab] = React.useState('company');
  const tabs = [
    ['company', 'Empresa', 'building'],
    ['crm', 'CRM', 'user-circle'],
    ['integrations', 'Integrações', 'link'],
    ['marketing', 'Marketing', 'trending-up'],
    ['data', 'Verificação', 'clipboard-check'],
    ['whatsapp', 'WhatsApp', 'message-circle'],
    ['api', 'API', 'key'],
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 9 }}><Icon name="settings" size={24} color="#38cc9c" />Configurações</h1>
        <p style={{ fontSize: 14, color: '#737373', marginTop: 2 }}>Gerencie as configurações do sistema</p>
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', borderBottom: '1px solid #eee', paddingBottom: 2 }}>
        {tabs.map(([k, l, ic]) => {
          const on = tab === k;
          return (
            <button key={k} onClick={() => setTab(k)} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13.5, fontWeight: 600, padding: '9px 14px', color: on ? '#171717' : '#a3a3a3', background: 'transparent', border: 'none', borderBottom: on ? '2px solid #38cc9c' : '2px solid transparent', marginBottom: -2, cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}>
              <Icon name={ic} size={15} color={on ? '#38cc9c' : '#a3a3a3'} />{l}
            </button>
          );
        })}
      </div>

      {tab === 'company' ? <CompanyTab /> : <SettingsPlaceholder tab={tabs.find((t) => t[0] === tab)} />}
    </div>
  );
}

function Field({ label, value, type, full }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6, gridColumn: full ? '1 / -1' : 'auto' }}>
      <span style={{ fontSize: 12.5, fontWeight: 600, color: '#5f5e5a' }}>{label}</span>
      <input defaultValue={value} type={type || 'text'} style={st.input} />
    </label>
  );
}

function CompanyTab() {
  const days = [['seg', true], ['ter', true], ['qua', true], ['qui', true], ['sex', true], ['sáb', false], ['dom', false]];
  const [recess, setRecess] = React.useState(false);
  const users = [
    { n: 'Marina Alves', e: 'marina@modafashion.com.br', role: 'Administradora', rc: '#9333ea' },
    { n: 'Ana Silva', e: 'ana@modafashion.com.br', role: 'Vendedora', rc: '#27ae8f' },
    { n: 'Júlia Costa', e: 'julia@modafashion.com.br', role: 'Vendedora', rc: '#27ae8f' },
    { n: 'Carlos Tráfego', e: 'carlos@modafashion.com.br', role: 'Gestor de Tráfego', rc: '#2563eb' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* Dados da empresa */}
      <div style={st.card}>
        <div style={st.cardHead}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ padding: 10, borderRadius: 11, background: 'rgba(56,204,156,.1)' }}><Icon name="building" size={18} color="#38cc9c" /></div>
            <div><div style={st.headTitle}>Dados da Empresa</div><div style={{ fontSize: 12.5, color: '#737373' }}>Informações cadastrais e de contato</div></div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 0', borderBottom: '1px solid #f3f3f3', marginBottom: 18 }}>
          <div style={{ height: 64, width: 64, borderRadius: 16, background: '#121212', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src="../assets/logo.png" alt="logo" style={{ height: 34, width: 34, objectFit: 'contain' }} />
          </div>
          <div>
            <button style={st.outline}><Icon name="image" size={14} color="#171717" />Trocar logo</button>
            <div style={{ fontSize: 11.5, color: '#a3a3a3', marginTop: 6 }}>PNG ou SVG · máx 2MB</div>
          </div>
        </div>
        <div style={st.grid}>
          <Field label="Nome da empresa" value="Moda Fashion" full />
          <Field label="CNPJ" value="35.811.804/0001-55" />
          <Field label="Telefone / WhatsApp" value="+55 85 99812-3344" />
          <Field label="E-mail" value="contato@modafashion.com.br" />
          <Field label="Endereço" value="Av. Santos Dumont, 6740 — Aldeota, Fortaleza/CE" full />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 18 }}>
          <button style={st.primary}><Icon name="check" size={15} color="#fff" />Salvar alterações</button>
        </div>
      </div>

      {/* Horário de funcionamento */}
      <div style={st.card}>
        <div style={st.cardHead}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ padding: 10, borderRadius: 11, background: 'rgba(37,99,235,.1)' }}><Icon name="clock" size={18} color="#2563eb" /></div>
            <div><div style={st.headTitle}>Horário de Atendimento</div><div style={{ fontSize: 12.5, color: '#737373' }}>Define quando a IA e a equipe respondem</div></div>
          </div>
        </div>
        <div style={st.grid}>
          <Field label="Início" value="08:00" type="time" />
          <Field label="Fim" value="18:00" type="time" />
        </div>
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: '#5f5e5a', marginBottom: 8 }}>Dias de funcionamento</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {days.map(([d, on]) => (
              <DayToggle key={d} day={d} initial={on} />
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 18, padding: '14px 16px', background: '#f7f8f8', borderRadius: 12, border: '1px solid #f0f0f0' }}>
          <div><div style={{ fontSize: 14, fontWeight: 600 }}>Modo recesso</div><div style={{ fontSize: 12.5, color: '#737373' }}>Pausa disparos e respostas automáticas</div></div>
          <button onClick={() => setRecess(!recess)} style={{ ...st.switch, background: recess ? '#38cc9c' : '#d4d4d4' }}>
            <span style={{ ...st.knob, transform: recess ? 'translateX(20px)' : 'translateX(0)' }}></span>
          </button>
        </div>
      </div>

      {/* Usuários */}
      <div style={st.card}>
        <div style={st.cardHead}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 200 }}>
            <div style={{ padding: 10, borderRadius: 11, background: 'rgba(147,51,234,.1)', flexShrink: 0 }}><Icon name="users" size={18} color="#9333ea" /></div>
            <div><div style={st.headTitle}>Usuários &amp; Permissões</div><div style={{ fontSize: 12.5, color: '#737373' }}>{users.length} membros nesta empresa</div></div>
          </div>
          <button style={st.primary}><Icon name="plus" size={15} color="#fff" />Novo usuário</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {users.map((u, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 4px', borderBottom: i < users.length - 1 ? '1px solid #f3f3f3' : 'none' }}>
              <div style={{ height: 38, width: 38, borderRadius: 999, background: '#38cc9c', color: '#fff', fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{u.n.split(' ').map((x) => x[0]).slice(0, 2).join('')}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{u.n}</div>
                <div style={{ fontSize: 12.5, color: '#737373' }}>{u.e}</div>
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: u.rc, background: u.rc + '1a', padding: '3px 11px', borderRadius: 999 }}>{u.role}</span>
              <button style={st.iconBtn}><Icon name="more-vertical" size={16} color="#a3a3a3" /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DayToggle({ day, initial }) {
  const [on, setOn] = React.useState(initial);
  return (
    <button onClick={() => setOn(!on)} style={{ width: 46, height: 38, borderRadius: 10, fontSize: 12.5, fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'Inter,sans-serif', border: on ? '1px solid #38cc9c' : '1px solid #e5e5e5', background: on ? 'rgba(56,204,156,.12)' : '#fff', color: on ? '#27ae8f' : '#a3a3a3' }}>{day}</button>
  );
}

function SettingsPlaceholder({ tab }) {
  const desc = {
    crm: 'Pipeline, tags, qualificação automática e regras do agente de IA.',
    integrations: 'Google Sheets, Meta Ads e fontes de dados de tráfego.',
    marketing: 'Configurações de campanhas, criativos e atribuição.',
    data: 'Verificação e conciliação dos dados sincronizados.',
    whatsapp: 'Conexão da API oficial, números e templates.',
    api: 'Chaves de API e webhooks para integrações externas.',
  };
  return (
    <div style={{ ...st.card, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '56px 24px', gap: 12 }}>
      <div style={{ padding: 16, borderRadius: 16, background: '#f5f5f5' }}><Icon name={tab[2]} size={28} color="#a3a3a3" /></div>
      <div style={{ fontSize: 17, fontWeight: 600 }}>{tab[1]}</div>
      <div style={{ fontSize: 13.5, color: '#737373', maxWidth: 360, lineHeight: 1.5 }}>{desc[tab[0]]}</div>
      <span style={{ fontSize: 12, fontWeight: 600, color: '#27ae8f', background: 'rgba(56,204,156,.1)', padding: '5px 13px', borderRadius: 999, marginTop: 4 }}>Aba disponível no sistema completo</span>
    </div>
  );
}

const st = {
  card: { background: '#fff', borderRadius: 14, border: '1px solid #eee', padding: 22, boxShadow: 'var(--shadow-sm)' },
  cardHead: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 18, flexWrap: 'wrap' },
  headTitle: { fontSize: 16, fontWeight: 600, lineHeight: 1.25, whiteSpace: 'nowrap' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 },
  input: { fontFamily: 'Inter,sans-serif', fontSize: 14, padding: '10px 13px', borderRadius: 10, border: '1px solid #e5e5e5', background: '#fff', outline: 'none', width: '100%' },
  primary: { display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, fontWeight: 600, padding: '9px 16px', borderRadius: 10, border: 'none', background: 'var(--gradient-primary)', color: '#fff', cursor: 'pointer', boxShadow: '0 2px 8px rgba(56,204,156,.3)', fontFamily: 'Inter,sans-serif' },
  outline: { display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, fontWeight: 600, padding: '8px 14px', borderRadius: 10, border: '1px solid #e5e5e5', background: '#fff', cursor: 'pointer', fontFamily: 'Inter,sans-serif' },
  iconBtn: { height: 32, width: 32, borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  switch: { width: 44, height: 24, borderRadius: 999, border: 'none', cursor: 'pointer', padding: 2, display: 'flex', alignItems: 'center', transition: 'background .2s' },
  knob: { height: 20, width: 20, borderRadius: 999, background: '#fff', display: 'block', transition: 'transform .2s', boxShadow: '0 1px 3px rgba(0,0,0,.2)' },
};
window.Settings = Settings;
