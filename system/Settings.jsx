// GT System — Configurações = pages/Settings.tsx do GTR: abas Empresa · CRM · Integrações · Marketing · Verificação · WhatsApp · API.
// Empresa (CompanySettingsTab: logo, dados, horário de trabalho, usuários, segurança) · CRM (Configurações/IA/Regras) · Integrações (Meta Ads, ERP, e-mail) ·
// Marketing (funcionalidades de IA + relatórios) · Verificação (registros de tráfego) · WhatsApp (instâncias, respostas rápidas, mensagens automáticas) · API (chaves, endpoints).
const stTabs = [['company', 'Empresa', 'building'], ['crm', 'CRM', 'user-circle'], ['integrations', 'Integrações', 'link'], ['marketing', 'Marketing', 'trending-up'], ['data', 'Verificação', 'clipboard-check'], ['whatsapp', 'WhatsApp', 'message-circle'], ['api', 'API', 'key']];
function StCard({ title, sub, icon, right, children, style }) {
  return <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 12, padding: K.M() ? 16 : 24, boxShadow: '0 1px 2px rgba(0,0,0,.05)', ...style }}>{(title || right) && <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: children ? 16 : 0 }}><div><div style={{ fontSize: 18, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>{icon && <Icon name={icon} size={18} color="#3fc58f" />}{title}</div>{sub && <div style={{ fontSize: 13.5, color: '#737373', marginTop: 2 }}>{sub}</div>}</div>{right}</div>}{children}</div>;
}
function StField({ label, value, placeholder, full }) {
  return <div style={{ display: 'flex', flexDirection: 'column', gap: 6, gridColumn: full ? '1 / -1' : 'auto' }}><span style={{ fontSize: 13.5, fontWeight: 500 }}>{label}</span><div style={{ height: 40, borderRadius: 8, border: '1px solid #e5e5e5', background: value ? '#fff' : '#fafafa', display: 'flex', alignItems: 'center', padding: '0 12px', fontSize: 14, color: value ? '#171717' : '#a3a3a3' }}>{value || placeholder}</div></div>;
}
function Settings() {
  const M = K.M();
  const [tab, setTab] = React.useState(stTabs.some((t) => t[0] === window.GT_TAB) ? window.GT_TAB : 'company');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: M ? 16 : 20 }}>
      <K.PageHead icon="settings" title="Configurações" sub="Gerencie as configurações do sistema" />
      <K.Tabs value={tab} onChange={setTab} tabs={stTabs} style={{ width: M ? '100%' : 'auto' }} />
      {tab === 'company' && <StEmpresa />}
      {tab === 'crm' && <StCrm />}
      {tab === 'integrations' && <StIntegracoes />}
      {tab === 'marketing' && <StMarketing />}
      {tab === 'data' && <StVerificacao />}
      {tab === 'whatsapp' && <StWhatsApp />}
      {tab === 'api' && <StApi />}
    </div>
  );
}
function StEmpresa() {
  const M = K.M();
  const [rec, setRec] = React.useState(false);
  const users = [['Marina Alves', 'marina@modafashion.com.br', 'Admin', '12/02/2026'], ['Ana Silva', 'ana@modafashion.com.br', 'Consultora', '12/02/2026'], ['Júlia Costa', 'julia@modafashion.com.br', 'Consultora', '20/03/2026'], ['Bia Ramos', 'bia@modafashion.com.br', 'Consultora', '05/05/2026'], ['Paula Ribeiro', 'paula@modafashion.com.br', 'Consultora', '18/07/2026'], ['Bruna Lima', 'bruna@modafashion.com.br', 'Equipe', '02/08/2026']];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <StCard title="Logo da Empresa"><div style={{ display: 'flex', alignItems: 'center', gap: 16 }}><div style={{ height: 64, width: 64, borderRadius: 10, background: '#1d1b19', color: '#fff', display: 'grid', placeItems: 'center', fontFamily: 'Georgia, serif', fontSize: 26 }}>M</div><div><div style={{ display: 'flex', gap: 10, alignItems: 'center' }}><K.Btn small icon="upload">Alterar Logo</K.Btn><Icon name="x" size={16} color="#dc2626" /></div><div style={{ fontSize: 12, color: '#737373', marginTop: 6 }}>PNG, JPG até 2MB. Aparecerá na barra lateral.</div></div></div></StCard>
      <StCard title="Dados da Empresa"><div style={{ display: 'grid', gridTemplateColumns: M ? '1fr' : '1fr 1fr', gap: 16 }}><StField label="Nome da Empresa" value={GT.company.name} /><StField label="CNPJ" value="12.345.678/0001-90" /><StField label="E-mail de Contato" value="contato@modafashion.com.br" /><StField label="Telefone" value="(85) 3222-1000" /></div></StCard>
      <StCard title="Horário de Trabalho" icon="clock" sub="Define o horário padrão de atendimento. O tempo de resposta só será contabilizado dentro deste período.">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, background: '#fafafa', border: '1px solid #f0f0f0', borderRadius: 10, padding: '12px 14px' }}><div style={{ display: 'flex', gap: 10, alignItems: 'center' }}><Icon name="sun" size={16} color="#3fc58f" /><div><div style={{ fontSize: 14, fontWeight: 500 }}>Empresa em Recesso</div><div style={{ fontSize: 12, color: '#737373' }}>Quando ativo, o tempo de resposta de ninguém será contabilizado</div></div></div><K.Toggle on={rec} onChange={setRec} /></div>
        <div style={{ display: 'grid', gridTemplateColumns: M ? '1fr' : '1fr 1fr', gap: 16, marginTop: 16 }}>
          {[['Início do expediente', '08', '00'], ['Fim do expediente', '18', '00']].map(([l, h, m]) => <div key={l}><div style={{ fontSize: 13.5, fontWeight: 500, marginBottom: 6 }}>{l}</div><div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><K.Select value={h} options={[[h, h]]} width={70} /><span>:</span><K.Select value={m} options={[[m, m]]} width={70} /></div></div>)}
        </div>
        <div style={{ marginTop: 16 }}><div style={{ fontSize: 13.5, fontWeight: 500, marginBottom: 8 }}>Dias de trabalho</div><div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>{['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map((d, i) => <span key={d} style={{ height: 34, padding: '0 14px', borderRadius: 8, display: 'inline-flex', alignItems: 'center', fontSize: 13.5, fontWeight: 500, background: i < 6 ? '#3fc58f' : '#fff', color: i < 6 ? '#fff' : '#171717', border: '1px solid ' + (i < 6 ? '#3fc58f' : '#e5e5e5') }}>{d}</span>)}</div></div>
      </StCard>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}><K.Btn primary icon="download">Salvar Alterações</K.Btn></div>
      <StCard title={<span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>Usuários <K.Badge tone="secondary">{users.length}</K.Badge></span>} icon="users" right={<Icon name="chevron-up" size={18} color="#737373" />}>
        <div style={{ border: '1px solid #e5e5e5', borderRadius: 10, padding: 16, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 600 }}><Icon name="user-round-plus" size={16} />Criar Novo Usuário</div><div style={{ fontSize: 13, color: '#737373', marginTop: 2 }}>Adicione consultoras ou outros usuários ao sistema</div>
          <div style={{ display: 'grid', gridTemplateColumns: M ? '1fr' : '1fr 1fr 1fr 1fr auto', gap: 12, marginTop: 12, alignItems: 'end' }}><StField label="Nome" placeholder="Nome completo" /><StField label="Email" placeholder="email@exemplo.com" /><StField label="Senha" placeholder="Min. 6 caracteres" /><div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}><span style={{ fontSize: 13.5, fontWeight: 500 }}>Função</span><K.Select value="u" options={[['u', 'Usuário'], ['c', 'Consultora'], ['a', 'Admin']]} width="100%" /></div><K.Btn primary icon="user-round-plus" style={{ opacity: .6 }}>Criar</K.Btn></div>
        </div>
        <div style={{ border: '1px solid #e5e5e5', borderRadius: 10, overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#fafafa', borderBottom: '1px solid #e5e5e5', fontSize: 14, fontWeight: 600 }}>Usuários Cadastrados<span style={{ fontSize: 13, fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 6 }}><Icon name="refresh-cw" size={13} />Atualizar</span></div>
          <div style={{ padding: '0 8px' }}><K.Table cols={[{ h: 'Nome', cell: (u) => u[0] }, { h: 'Email', cell: (u) => u[1] }, { h: 'Função', cell: (u) => <K.Badge tone={u[2] === 'Admin' ? 'qualificado' : 'secondary'}>{u[2]}</K.Badge> }, { h: 'Criado em', cell: (u) => u[3] }, { h: 'Ações', align: 'right', cell: () => <Icon name="ellipsis" size={16} color="#404040" /> }]} rows={users} /></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', borderTop: '1px solid #e5e5e5', fontSize: 13, color: '#737373' }}>{users.length} usuários<span>1 / 1</span></div>
        </div>
      </StCard>
      <StCard title="Segurança" icon="shield" right={<Icon name="chevron-down" size={18} color="#737373" />} />
    </div>
  );
}
function StCrm() {
  const M = K.M();
  const [sub, setSub] = React.useState('config');
  const [wa, setWa] = React.useState(true); const [kb, setKb] = React.useState(false);
  const fields = [['Nome do Cliente', 'Nome de quem está comprando', true, true, true], ['Nome do Proprietário', 'Nome do responsável pela loja', true, true], ['WhatsApp', 'Número de contato', true, true], ['CPF/CNPJ', 'Documento do cliente', true, true], ['Cidade', 'Cidade do cliente', true, true], ['Estado', 'Estado do cliente', true, true], ['Endereço', 'Rua, número, bairro e complemento', true, false]];
  const Mod = ({ icon, bg, color, title, sub, on, onChange, children, badge }) => <StCard><div style={{ display: 'flex', alignItems: 'center', gap: 14 }}><div style={{ height: 48, width: 48, borderRadius: 10, background: bg, display: 'grid', placeItems: 'center', flexShrink: 0 }}><Icon name={icon} size={20} color={color} /></div><div style={{ flex: 1 }}><div style={{ fontSize: 16, fontWeight: 600 }}>{title}</div><div style={{ fontSize: 13.5, color: '#737373' }}>{sub}</div></div>{badge && <K.Badge tone={on ? 'cliente' : 'secondary'} icon={on ? 'circle-check' : undefined}>{on ? 'Ativo' : 'Desativado'}</K.Badge>}{onChange && <K.Toggle on={on} onChange={onChange} />}</div>{children && <div style={{ marginTop: 14, background: '#fafafa', border: '1px solid #f0f0f0', borderRadius: 10, padding: '12px 16px', fontSize: 14, color: '#404040' }}>{children}</div>}</StCard>;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <K.Tabs value={sub} onChange={setSub} tabs={[['config', 'Configurações', 'settings'], ['ia', 'Inteligência Artificial', 'brain'], ['regras', 'Regras do Sistema', 'settings']]} />
      {sub === 'config' && <>
        <Mod icon="message-square" bg="#dcfce7" color="#16a34a" title="Módulo WhatsApp" sub="Integração com WhatsApp e sincronizações automáticas" on={wa} onChange={setWa} badge><ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6 }}><li>Módulo de mensagens e aba WhatsApp disponíveis</li><li>Pedidos, mensagens e prospecção sincronizados automaticamente</li><li>Registro Diário manual substituído por dados em tempo real</li><li>Leads recebidos pelo WhatsApp aparecem em "Meus Leads"</li></ul></Mod>
        <Mod icon="kanban" bg="#dbeafe" color="#2563eb" title="Módulo Kanban" sub="Visualize leads e clientes em etapas personalizadas" on={kb} onChange={setKb} badge>Ative para visualizar leads e clientes em um quadro Kanban com etapas personalizáveis.</Mod>
        <Mod icon="user-round-plus" bg="#f3e8ff" color="#9333ea" title="Cadastro Manual de Leads" sub='Permite cadastrar leads manualmente na aba "Meus Leads"' on={false} onChange={() => {}} />
        <StCard title="Campos do Cadastro de Cliente" icon="type" sub="Configure quais campos aparecem no formulário e se são obrigatórios">
          <div style={{ border: '1px solid #e5e5e5', borderRadius: 10, overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 24, padding: '10px 16px', background: '#fafafa', fontSize: 13, color: '#737373', borderBottom: '1px solid #e5e5e5' }}><span>Campo</span><span>Visível</span><span>Obrigatório</span></div>
            {fields.map(([n, d, v, o, locked]) => <div key={n} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 24, padding: '12px 16px', borderBottom: '1px solid #f0f0f0', alignItems: 'center', opacity: locked ? .6 : 1 }}><div><div style={{ fontSize: 14, fontWeight: 500 }}>{n}</div><div style={{ fontSize: 12, color: '#737373' }}>{d}</div></div><span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: '#737373' }}><span style={{ height: 18, width: 18, borderRadius: 4, background: '#2563eb', display: 'grid', placeItems: 'center' }}><Icon name="check" size={12} color="#fff" /></span>Visível</span><span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: '#737373' }}><K.Toggle on={o} small />Obrigatório</span></div>)}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}><K.Btn primary>Salvar Configurações</K.Btn></div>
        </StCard>
      </>}
      {sub === 'ia' && <>
        <StCard title="Inteligência Artificial" icon="brain" sub="Em vez de você contar, a IA lê as conversas e qualifica os leads sozinha.">
          <div style={{ display: 'grid', gridTemplateColumns: M ? '1fr' : '1fr 1fr', gap: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}><span style={{ fontSize: 13.5, fontWeight: 500 }}>Janela de análise</span><K.Select value="7" options={[['7', 'Últimos 7 dias'], ['14', 'Últimos 14 dias']]} width="100%" /></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}><span style={{ fontSize: 13.5, fontWeight: 500 }}>Mínimo de mensagens para qualificar</span><K.Select value="2" options={[['2', '2 mensagens'], ['3', '3 mensagens']]} width="100%" /></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}><span style={{ fontSize: 13.5, fontWeight: 500 }}>Fuso horário</span><K.Select value="f" options={[['f', 'Fortaleza (GMT-3)'], ['m', 'Manaus (GMT-4)'], ['c', 'Cuiabá (GMT-4)']]} width="100%" /></div>
          </div>
          <div style={{ marginTop: 16 }}><div style={{ fontSize: 13.5, fontWeight: 500, marginBottom: 6 }}>Critérios de qualificação</div><div style={{ minHeight: 60, borderRadius: 8, border: '1px solid #e5e5e5', padding: 10, fontSize: 13.5 }}>Lojista com CNPJ ou loja física/online, interessada em comprar no atacado (mínimo 1 grade). Consumidora final não qualifica.</div></div>
          <div style={{ marginTop: 12 }}><div style={{ fontSize: 13.5, fontWeight: 500, marginBottom: 6 }}>Critérios para lead QUENTE</div><div style={{ minHeight: 44, borderRadius: 8, border: '1px solid #e5e5e5', padding: 10, fontSize: 13.5 }}>Pediu tabela, perguntou prazo de entrega ou pediu para montar a grade.</div></div>
        </StCard>
        <StCard title="Agente de IA no WhatsApp" icon="bot" sub="O agente atende, sugere respostas e vende os produtos das lojas marcadas para cada consultora." right={<K.Tabs size="sm" value="copiloto" onChange={() => {}} tabs={[['copiloto', 'Copiloto'], ['auto', 'Autônomo']]} />}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{GT.sellers.filter((s) => s.role !== 'Suporte').map((s) => <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 12, border: '1px solid #e5e5e5', borderRadius: 10, padding: '10px 14px' }}><K.SellerAvatar id={s.id} size={32} /><div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 500 }}>{s.name}</div><div style={{ fontSize: 12, color: '#737373' }}>{GT.chip(s.chipId).label} · sugere resposta na conversa</div></div><K.Toggle on small /></div>)}</div>
          <div style={{ fontSize: 12.5, color: '#737373', marginTop: 12 }}>{GT.fmt.num(GT.aiAgent.handled7d)} conversas ajudadas em 7 dias · 1ª resposta em {GT.aiAgent.avgFirstReply} (mediana). <u>Li e aceito o termo de responsabilidade</u>.</div>
        </StCard>
      </>}
      {sub === 'regras' && <StCard title="Regras do Sistema" icon="settings" sub="Automações de leads, temperatura e tiers."><div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{[['Avaliação de Temperatura', 'Quente = respondeu nas últimas 24h · Frio = 3 dias sem resposta · Congelado = 7 dias', true], ['Tiers de cliente', 'Ouro ≥ R$ 10 mil/mês · Prata ≥ R$ 3 mil · Bronze = comprou nos últimos 90 dias', true], ['Automações de Leads', 'Lead sem resposta há 1h → alerta para a gestora', true], ['Edição feita na mão não volta atrás', 'Preço, nome, SKU, telefone e endereço editados no GT não são desfeitos pelo sync do ERP', true]].map(([t, d, on]) => <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 12, border: '1px solid #e5e5e5', borderRadius: 10, padding: '12px 14px' }}><div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 500 }}>{t}</div><div style={{ fontSize: 12.5, color: '#737373' }}>{d}</div></div><K.Toggle on={on} /></div>)}</div></StCard>}
    </div>
  );
}
function StIntegracoes() {
  const M = K.M();
  const Head = ({ icon, bg, color, title, sub, right }) => <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}><div style={{ height: 44, width: 44, borderRadius: 10, background: bg, display: 'grid', placeItems: 'center', flexShrink: 0 }}><Icon name={icon} size={20} color={color} /></div><div style={{ flex: 1 }}><div style={{ fontSize: 16, fontWeight: 600 }}>{title}</div><div style={{ fontSize: 13.5, color: '#737373' }}>{sub}</div></div>{right}</div>;
  const syncs = ['14:30', '14:00', '13:30', '13:00', '12:30', '12:00'];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <StCard>
        <Head icon="globe" bg="#dbeafe" color="#2563eb" title="Meta Ads (Facebook/Instagram)" sub="Sincronize dados de investimento e campanhas direto da Graph API" right={<div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end' }}><K.Badge color="#fff" bg="#2563eb" icon="clock">Sync automático: a cada hora</K.Badge><K.Badge tone="cliente" icon="circle-check">Configurado</K.Badge><span style={{ fontSize: 11.5, color: '#737373' }}>Última sync: 12/09/2026 14:30</span></div>} />
        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e5e5e5', borderRadius: 10, padding: '10px 14px', fontSize: 14 }}><span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><Icon name="sliders-horizontal" size={15} />Contas de Anúncio Vinculadas</span><span style={{ fontSize: 13, color: '#737373' }}>Expandir</span></div>
        <div style={{ display: 'flex', gap: 10, marginTop: 12, flexWrap: 'wrap' }}><K.Btn primary icon="refresh-cw" style={{ background: '#2563eb', borderColor: '#2563eb', boxShadow: 'none' }}>Sincronização Recente</K.Btn><K.Btn icon="refresh-cw">Sincronização Completa</K.Btn></div>
        <div style={{ marginTop: 12, background: '#fafafa', border: '1px solid #f0f0f0', borderRadius: 10, padding: '12px 16px', fontSize: 12.5, color: '#404040' }}><div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 500, marginBottom: 6 }}><Icon name="info" size={14} />Como funciona</div><ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 3 }}><li><b>Sincronização Recente:</b> últimos 7 dias (incluindo hoje)</li><li><b>Sincronização Completa:</b> todo o histórico desde a primeira data com dados</li><li>Categorias de campanha (Vendas, Seguidores, etc.) configuradas pela equipe da GT</li><li>Métricas coletadas: <b>Investimento, Impressões, Cliques, Conversas iniciadas</b></li></ul></div>
      </StCard>
      <StCard title="Histórico de Sincronizações"><div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{syncs.map((h) => <div key={h} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e5e5e5', borderRadius: 10, padding: '10px 14px' }}><div><div style={{ fontSize: 14, fontWeight: 500 }}>12/09/2026 {h}</div><div style={{ fontSize: 12.5, color: '#737373' }}>42 registros processados • 0 novos • 42 atualizados</div></div><K.Badge tone="qualificado" icon="circle-check">Sucesso</K.Badge></div>)}<div style={{ textAlign: 'center', fontSize: 13, padding: 8, border: '1px solid #e5e5e5', borderRadius: 8, color: '#404040' }}>⌄ Ver mais</div></div></StCard>
      <StCard>
        <Head icon="table" bg="#ffedd5" color="#ea580c" title="Integração ERP" sub="Sincronize clientes e pedidos do seu sistema ERP" right={<K.Badge tone="cliente" icon="circle-check">Configurado</K.Badge>} />
        <div style={{ display: 'grid', gridTemplateColumns: M ? '1fr 1fr' : 'repeat(4,1fr)', gap: 12, marginTop: 16 }}>{[['users', 'Clientes', '3.280', '12/09 14:55'], ['shopping-bag', 'Pedidos', '26', '12/09 14:54'], ['wifi', 'Tempo Real', 'Ativo', ''], ['table', 'Provider', 'Alpha Sistemas', '']].map(([ic, l, v, t]) => <div key={l} style={{ border: '1px solid #e5e5e5', borderRadius: 10, padding: 12 }}><div style={{ fontSize: 12, color: '#737373', display: 'flex', alignItems: 'center', gap: 6 }}><Icon name={ic} size={13} />{l}</div><div style={{ fontSize: 15, fontWeight: 600, marginTop: 4 }}>{v}</div>{t && <div style={{ fontSize: 11, color: '#a3a3a3' }}>{t}</div>}</div>)}</div>
        <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e5e5e5', borderRadius: 10, padding: '10px 14px', fontSize: 14 }}><span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><Icon name="sliders-horizontal" size={15} />Configuração</span><Icon name="chevron-down" size={15} /></div>
        <div style={{ marginTop: 12 }}><K.Btn primary icon="refresh-cw" style={{ background: '#ea580c', borderColor: '#ea580c', boxShadow: 'none' }}>Sincronizar</K.Btn></div>
        <div style={{ fontSize: 12.5, color: '#737373', marginTop: 12 }}>Catálogo de produtos (Alpha Sistemas):</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}><K.Btn small icon="package">Só novidades</K.Btn><K.Btn small icon="refresh-cw">Parcial</K.Btn><K.Btn small icon="alert-triangle" style={{ color: '#a16207', borderColor: '#fcd34d' }}>Total (reset)</K.Btn><K.Btn small danger icon="trash-2" style={{ borderColor: '#fecaca' }}>Excluir catálogo</K.Btn><K.Btn small icon="zap" style={{ color: '#737373' }}>Webhook Ativo</K.Btn></div>
        <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 14, padding: '8px 0' }}>Log de Sincronização (20)<Icon name="chevron-down" size={15} /></div>
      </StCard>
      <StCard><Head icon="mail" bg="#f3e8ff" color="#9333ea" title="Notificações por E-mail" sub="Receba relatórios diários e alertas" right={<K.Badge tone="secondary">Em breve</K.Badge>} /></StCard>
    </div>
  );
}
function StMarketing() {
  const M = K.M();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <StCard title="Configurações de Marketing" icon="trending-up" sub="Gerencie as funcionalidades de IA para análise de marketing e anúncios." />
      <StCard title="Funcionalidades de IA" icon="sparkles">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{[['Insights Semanais do Instagram', 'Gera análises automáticas toda segunda-feira sobre crescimento de seguidores, viralização e audiência regional.', true], ['Transcrição de anúncios', 'Transcreve o áudio dos vídeos de anúncio para a IA analisar o que mais converte.', true], ['Top comentários', 'Classifica os comentários dos posts (demanda, apoio, testemunhos, ofensivos) para moderar e responder daqui.', true]].map(([t, d, on]) => <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 12, border: '1px solid #e5e5e5', borderRadius: 10, padding: '12px 14px' }}><div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 500 }}>{t}</div><div style={{ fontSize: 12.5, color: '#737373' }}>{d}</div></div><K.Toggle on={on} /></div>)}</div>
      </StCard>
      <StCard title="Relatórios automáticos" icon="message-circle" sub="Chegam no WhatsApp do dono e da gestora, sem abrir o sistema. Cada bloco só sai se o dado existir.">
        <div style={{ display: 'grid', gridTemplateColumns: M ? '1fr' : 'repeat(3,minmax(0,1fr))', gap: 12 }}>{GT.reports.map((r) => <div key={r.id} style={{ border: '1px solid #e5e5e5', borderRadius: 10, padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}><div><div style={{ fontSize: 14, fontWeight: 600 }}>{r.name}</div><div style={{ fontSize: 12, color: '#737373' }}>{r.when} · {r.to}</div></div><K.Toggle on={r.active} small /></div><div style={{ background: '#efeae2', borderRadius: 8, padding: 8 }}><div style={{ background: '#fff', borderRadius: 8, padding: '8px 10px', fontSize: 12, lineHeight: 1.45, whiteSpace: 'pre-line', maxHeight: 150, overflow: 'hidden' }}>{r.preview.slice(0, 7).join('\n').replace(/\*/g, '')}</div></div></div>)}</div>
      </StCard>
    </div>
  );
}
function StVerificacao() {
  const rows = [['12/09', 'Todas', 'R$ 880,00', 148, 'R$ 5,95', 'Meta'], ['11/09', 'Todas', 'R$ 910,00', 161, 'R$ 5,65', 'Meta'], ['10/09', 'Todas', 'R$ 760,00', 132, 'R$ 5,76', 'Meta'], ['09/09', 'Paula Ribeiro', 'R$ 120,00', 24, 'R$ 5,00', 'Manual'], ['08/09', 'Todas', 'R$ 840,00', 150, 'R$ 5,60', 'Meta']];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div><div style={{ fontSize: 18, fontWeight: 600 }}>Verificação de Dados</div><div style={{ fontSize: 13.5, color: '#737373' }}>Confira e corrija os registros de tráfego por consultora e por dia — investimento, mensagens geradas e custo por mensagem.</div></div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}><K.Select value="30" options={[['30', 'Últimos 30 Dias'], ['7', 'Últimos 7 Dias'], ['m', 'Este Mês']]} width={160} /><K.Select value="all" options={[['all', 'Todas as Consultoras'], ...GT.sellers.filter((s) => s.role !== 'Suporte').map((s) => [s.id, s.name])]} width={200} /><K.Tabs size="sm" value="lista" onChange={() => {}} tabs={[['lista', 'Lista'], ['cal', 'Calendário']]} /></div>
      <StCard title="Registros de Tráfego" sub="Entrada manual de dados quando a Meta não cobre (ex.: impulsionamento pelo celular).">
        <K.Table cols={[{ h: 'Data', cell: (r) => r[0] }, { h: 'Consultora', cell: (r) => r[1] }, { h: 'Investimento (R$)', align: 'right', cell: (r) => r[2] }, { h: 'Mensagens Facebook', align: 'right', cell: (r) => r[3] }, { h: 'Custo/Msg', align: 'right', cell: (r) => r[4] }, { h: 'Fonte', cell: (r) => <K.Badge tone={r[5] === 'Meta' ? 'secondary' : 'pendente'}>{r[5]}</K.Badge> }, { h: '', align: 'right', cell: () => <Icon name="pencil" size={14} color="#404040" /> }]} rows={rows} />
      </StCard>
    </div>
  );
}
function StWhatsApp() {
  const M = K.M();
  const inst = GT.chips.filter((c) => c.channel === 'whatsapp');
  const [aus, setAus] = React.useState(true); const [sau, setSau] = React.useState(true);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <StCard title="Instâncias WhatsApp" icon="message-circle" sub="Gerencie as conexões de WhatsApp da sua empresa" right={<K.Btn primary small icon="plus">Nova Instância</K.Btn>}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {inst.map((c) => { const sellers = c.sellerIds.map((id) => GT.seller(id)); return (
            <div key={c.id} style={{ border: '1px solid #e5e5e5', borderRadius: 10, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}><span style={{ fontSize: 15, fontWeight: 500 }}>{sellers[0].name.split(' ')[0]} - {c.label}</span><K.Badge tone={c.health === 'ok' ? 'cliente' : 'pendente'} icon="activity">{c.health === 'ok' ? 'Recebendo' : 'Reconectar'}</K.Badge>{c.provider === 'coexistence' && <K.Badge tone="outline">Coexistência</K.Badge>}</div>
                <div style={{ fontSize: 13, color: '#737373', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}><Icon name="smartphone" size={13} />55{c.number.replace(/\D/g, '')}</div>
                <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>{sellers.map((s) => <K.Badge key={s.id} tone="secondary" icon="users">{s.name.split(' ')[0]}</K.Badge>)}</div>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>{['activity', 'bot'].map((i) => <span key={i} style={{ height: 40, width: 40, borderRadius: 8, border: '1px solid #e5e5e5', display: 'grid', placeItems: 'center' }}><Icon name={i} size={16} /></span>)}<Icon name="message-circle" size={17} /><Icon name="pencil" size={17} /><Icon name="trash-2" size={17} color="#dc2626" /></div>
            </div>); })}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, fontSize: 13, color: '#737373' }}>1-{inst.length} de {inst.length}<div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>{['chevrons-left', 'chevron-left'].map((i) => <span key={i} style={{ height: 36, width: 36, borderRadius: 8, border: '1px solid #e5e5e5', display: 'grid', placeItems: 'center' }}><Icon name={i} size={14} /></span>)}<span style={{ padding: '0 8px' }}>1 / 1</span>{['chevron-right', 'chevrons-right'].map((i) => <span key={i} style={{ height: 36, width: 36, borderRadius: 8, border: '1px solid #e5e5e5', display: 'grid', placeItems: 'center' }}><Icon name={i} size={14} /></span>)}</div></div>
      </StCard>
      <StCard title="Respostas Rápidas" icon="zap" sub="Atalhos de texto para agilizar as conversas" right={<K.Btn primary small icon="plus">Nova Resposta</K.Btn>}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{[['/preco', 'Grade P ao GG (6 peças) por R$ 389. Acima de 3 grades o frete é por nossa conta 💚'], ['/horario', 'Atendemos de segunda a sábado, das 8h às 18h.'], ['/boasvindas', 'Oi! Que bom ter você aqui 😊 Me diz sua cidade que já te passo a tabela.']].map(([k, t]) => <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 12, border: '1px solid #e5e5e5', borderRadius: 10, padding: '10px 14px' }}><span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 13, background: '#f5f5f5', padding: '3px 8px', borderRadius: 6 }}>{k}</span><span style={{ flex: 1, fontSize: 13.5, color: '#404040' }}>{t}</span><Icon name="pencil" size={15} color="#404040" /><Icon name="trash-2" size={15} color="#dc2626" /></div>)}</div>
      </StCard>
      <StCard title="Mensagens Automáticas" icon="bookmark" sub="Configure respostas automáticas de ausência e saudação">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[['clock', '#fff7ed', '#ea580c', 'Mensagem de Ausência', 'Enviada quando você está fora do horário ou com atendimento pausado', aus, setAus], ['user-round-plus', '#ecfdf5', '#16a34a', 'Mensagem de Saudação', 'Enviada para novos leads ou contatos inativos', sau, setSau]].map(([ic, bg, c, t, d, on, set]) => <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 14, border: '1px solid #e5e5e5', borderRadius: 10, padding: '14px 16px' }}><div style={{ height: 40, width: 40, borderRadius: 999, background: bg, display: 'grid', placeItems: 'center' }}><Icon name={ic} size={18} color={c} /></div><div style={{ flex: 1 }}><div style={{ fontSize: 15, fontWeight: 500 }}>{t}</div><div style={{ fontSize: 13, color: '#737373' }}>{d}</div></div><K.Toggle on={on} onChange={set} /></div>)}
        </div>
        <div style={{ fontSize: 12, color: '#737373', marginTop: 10 }}>Saudação e ausência não contam como resposta no relatório do time.</div>
      </StCard>
    </div>
  );
}
function StApi() {
  const M = K.M();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <StCard title="Chaves de API" icon="key" sub="Integre o GT com o seu sistema: clientes, pedidos, produtos e vendedoras." right={<K.Btn primary small icon="plus">Nova chave</K.Btn>}>
        <K.Table cols={[{ h: 'Nome da chave', cell: (r) => r[0] }, { h: 'Chave', cell: (r) => <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12.5 }}>{r[1]}</span> }, { h: 'Criada em', cell: (r) => r[2] }, { h: 'Chamadas (30d)', align: 'right', cell: (r) => r[3] }, { h: '', align: 'right', cell: () => <K.Btn small danger>Revogar</K.Btn> }]} rows={[['ERP · integração principal', GT.integrations.api.key, '02/09/2026', GT.fmt.num(GT.integrations.api.calls30d)], ['Planilha da gestora', 'gt_live_••••••••••••a91c', '20/08/2026', '412']]} />
      </StCard>
      <StCard title="Endpoints disponíveis" icon="code">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{[['GET', '/v1/clientes', 'Lista clientes com tier, consultora e última compra'], ['GET', '/v1/pedidos', 'Pedidos do período com itens e origem'], ['POST', '/v1/pedidos', 'Cria pedido (cai no Ranking e na meta da vendedora)'], ['GET', '/v1/produtos', 'Catálogo com grade, estoque e preço'], ['GET', '/v1/vendedoras', 'Consultoras, números e metas'], ['POST', '/v1/webhooks', 'Avisa seu sistema a cada pedido ou lead novo']].map(([m, p, d]) => <div key={p + m} style={{ display: 'flex', alignItems: 'center', gap: 12, border: '1px solid #e5e5e5', borderRadius: 10, padding: '10px 14px', flexWrap: 'wrap' }}><K.Badge color="#fff" bg={m === 'GET' ? '#2563eb' : '#16a34a'} style={{ fontFamily: 'ui-monospace, monospace' }}>{m}</K.Badge><span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 13, minWidth: 130 }}>{p}</span><span style={{ fontSize: 13, color: '#737373', flex: 1 }}>{d}</span></div>)}</div>
        <div style={{ marginTop: 12 }}><K.Btn small icon="external-link">Documentação da API</K.Btn></div>
      </StCard>
    </div>
  );
}
window.Settings = Settings;
