// GT System — Link da bio = BioEditor.tsx do GTR: barra (loja · Bio ativa · Cores · Abrir /bio · Salvar), grid [1fr, 380px]:
// esquerda = Cabeçalho (fixo) + Blocos reordenáveis (↑↓, título/descrição, switch, corpo por tipo) + Redes sociais; direita = Prévia num iPhone (390px escalado a 0,85).
const bioBlockMeta = { consultora: ['Botão de consultora', 'O CTA que abre o WhatsApp com rodízio.'], banners: ['Banners', 'Carrossel de destaques da vitrine.'], vitrine: ['Vitrine', 'Catálogo e posts do Instagram.'], form: ['Formulário', 'Captação de contato direto na bio.'] };
const bioRedes = [['instagram', 'Instagram', 'https://instagram.com/sualoja'], ['tiktok', 'TikTok', 'https://tiktok.com/@sualoja'], ['youtube', 'YouTube', 'https://youtube.com/@sualoja'], ['facebook', 'Página no Facebook', 'https://facebook.com/sualoja']];
const bioSocialUrl = { instagram: 'https://instagram.com/modafashion', tiktok: 'https://tiktok.com/@modafashion', youtube: 'https://youtube.com/@modafashionatacado', facebook: 'https://facebook.com/modafashion' };
function BioSection({ children, style }) { return <section style={{ display: 'flex', flexDirection: 'column', gap: 12, borderRadius: 8, border: '1px solid #e5e5e5', background: '#fff', padding: 16, ...style }}>{children}</section>; }
function BioInput({ value, placeholder, onChange, textarea, rows }) {
  const st = { width: '100%', fontFamily: K.font, fontSize: 14, padding: textarea ? '9px 12px' : '0 12px', height: textarea ? 'auto' : 40, borderRadius: 8, border: '1px solid #e5e5e5', background: '#fff', outline: 'none', resize: 'vertical', color: '#171717' };
  return textarea ? <textarea value={value} placeholder={placeholder} rows={rows || 2} onChange={(e) => onChange(e.target.value)} style={st} /> : <input value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} style={st} />;
}
function BioEditor() {
  const M = K.M();
  const [cfg, setCfg] = React.useState(bioDefaultConfig);
  const [active, setActive] = React.useState(true);
  const set = (k, v) => setCfg((c) => ({ ...c, [k]: v }));
  const patch = (id, p) => setCfg((c) => ({ ...c, blocks: c.blocks.map((b) => (b.id === id ? { ...b, ...p } : b)) }));
  const move = (i, d) => setCfg((c) => { const bl = [...c.blocks]; const j = i + d; if (j < 0 || j >= bl.length) return c; [bl[i], bl[j]] = [bl[j], bl[i]]; return { ...c, blocks: bl }; });
  const remove = (id) => setCfg((c) => ({ ...c, blocks: c.blocks.filter((b) => b.id !== id) }));
  const addLink = () => setCfg((c) => ({ ...c, blocks: [...c.blocks, { id: 'b' + Date.now(), type: 'link', enabled: true, label: '', url: '' }] }));
  const IconBtn = ({ name, onClick, disabled, color }) => <button onClick={onClick} disabled={disabled} style={{ height: 24, width: 24, borderRadius: 6, border: 'none', background: 'transparent', cursor: disabled ? 'default' : 'pointer', opacity: disabled ? .35 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={name} size={15} color={color || '#171717'} /></button>;
  const Row = ({ label, children }) => <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: 6, border: '1px solid #e5e5e5', padding: '8px 12px', fontSize: 14 }}>{label}{children}</label>;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <K.Select value="s1" options={GT.stores.map((s) => [s.id, s.name])} width={200} small />
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, borderRadius: 8, border: '1px solid #e5e5e5', padding: '6px 12px', fontSize: 14, fontWeight: 500, background: '#fff' }}><K.Toggle on={active} onChange={setActive} small />Bio ativa</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, borderRadius: 8, border: '1px solid #e5e5e5', padding: '6px 12px', fontSize: 14, fontWeight: 500, background: '#fff' }} title="Cores do link da bio">Cores
            {[['primary', cfg.primary], ['accent', cfg.accent]].map(([k, v]) => <label key={k} style={{ height: 28, width: 36, borderRadius: 6, border: '1px solid #e5e5e5', background: v, display: 'block', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}><input type="color" value={v} onChange={(e) => set(k, e.target.value)} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }} /></label>)}
            <span style={{ fontSize: 12, color: '#737373', textDecoration: 'underline', cursor: 'pointer' }} onClick={() => { set('primary', '#1d1b19'); set('accent', '#111111'); }}>loja</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}><K.Btn small icon="external-link">Abrir /bio</K.Btn><K.Btn small primary>Salvar</K.Btn></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: M ? '1fr' : 'minmax(0,1fr) 380px', gap: 24, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <BioSection>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div><div style={{ fontSize: 14, fontWeight: 500 }}>Cabeçalho</div><div style={{ fontSize: 12, color: '#737373' }}>Logo, nome e uma frase de apresentação. Fica fixo no topo.</div></div>
              <K.Toggle on={cfg.showHero} onChange={(v) => set('showHero', v)} />
            </div>
            {cfg.showHero && <><BioInput value={cfg.headline} placeholder="Título (padrão: nome da loja)" onChange={(v) => set('headline', v)} /><BioInput textarea value={cfg.subheadline} placeholder="Frase de apresentação (opcional)" onChange={(v) => set('subheadline', v)} /></>}
          </BioSection>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div><div style={{ fontSize: 14, fontWeight: 500 }}>Blocos</div><div style={{ fontSize: 12, color: '#737373' }}>Reordene com as setas; ligue/desligue cada bloco.</div></div>
            <K.Btn small icon="plus" onClick={addLink}>Link externo</K.Btn>
          </div>
          {cfg.blocks.map((b, i) => { const isLink = b.type === 'link'; const meta = isLink ? null : bioBlockMeta[b.type]; return (
            <BioSection key={b.id}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}><IconBtn name="arrow-up" disabled={i === 0} onClick={() => move(i, -1)} /><IconBtn name="arrow-down" disabled={i === cfg.blocks.length - 1} onClick={() => move(i, 1)} /></div>
                <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 14, fontWeight: 500 }}>{isLink ? (b.label || 'Link externo') : meta[0]}</div><div style={{ fontSize: 12, color: '#737373', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{isLink ? (b.url || 'label + url') : meta[1]}</div></div>
                {isLink && <IconBtn name="trash-2" color="#dc2626" onClick={() => remove(b.id)} />}
                <K.Toggle on={b.enabled} onChange={(v) => patch(b.id, { enabled: v })} />
              </div>
              {b.enabled && b.type === 'consultora' && <BioInput value={b.label} placeholder="Falar com uma consultora" onChange={(v) => patch(b.id, { label: v })} />}
              {b.enabled && b.type === 'vitrine' && <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}><Row label="Produtos do catálogo"><K.Toggle on={b.catalogo} onChange={(v) => patch(b.id, { catalogo: v })} /></Row><Row label="Posts do Instagram"><K.Toggle on={b.ig} onChange={(v) => patch(b.id, { ig: v })} /></Row></div>}
              {b.enabled && b.type === 'banners' && <div style={{ fontSize: 12, color: '#737373' }}>Os banners vêm da Vitrine (Produtos › Vitrine › Banners). {b.items.length} ativos.</div>}
              {b.enabled && b.type === 'form' && <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}><BioInput value={b.title} placeholder="Texto do botão" onChange={(v) => patch(b.id, { title: v })} /><div style={{ fontSize: 12, color: '#737373' }}>Campos: WhatsApp (obrigatório) + {b.fields.filter((f) => f !== 'WhatsApp').join(', ')}. Cada envio vira um lead em Mensagens.</div></div>}
              {b.enabled && isLink && <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}><BioInput value={b.label} placeholder="Texto do link (ex.: Meu e-commerce)" onChange={(v) => patch(b.id, { label: v })} /><BioInput value={b.url} placeholder="https://…" onChange={(v) => patch(b.id, { url: v })} /><label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5 }}><K.Toggle on={!!b.featured} onChange={(v) => patch(b.id, { featured: v })} small />Destaque (cor principal)</label></div>}
            </BioSection>); })}
          <BioSection>
            <div><div style={{ fontSize: 14, fontWeight: 500 }}>Redes sociais</div><div style={{ fontSize: 12, color: '#737373' }}>Ícones no rodapé da bio. Preencha só as que usa — as em branco não aparecem.</div></div>
            {bioRedes.map(([k, l, ph]) => <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 128, flexShrink: 0, fontSize: 12, color: '#737373' }}>{l}</span><BioInput value={cfg.social[k] ? bioSocialUrl[k] : ''} placeholder={ph} onChange={(v) => set('social', { ...cfg.social, [k]: v })} /></div>)}
          </BioSection>
        </div>
        <div style={{ position: M ? 'static' : 'sticky', top: 16 }}>
          <div style={{ textAlign: 'center', fontSize: 12, color: '#737373', marginBottom: 8 }}>Prévia</div>
          <div style={{ margin: '0 auto', overflow: 'hidden', borderRadius: 32, border: '8px solid #262626', background: '#fff', boxShadow: '0 20px 25px -5px rgba(0,0,0,.1), 0 8px 10px -6px rgba(0,0,0,.1)', width: 390 * .85, height: 700 }}>
            <div style={{ width: 390, height: 700 / .85, transform: 'scale(.85)', transformOrigin: 'top left', overflowY: 'auto', overflowX: 'hidden', background: '#faf8f5', scrollbarWidth: 'none' }}>
              {active ? <PublicBio compact config={cfg} /> : <div style={{ padding: 40, textAlign: 'center', color: '#9a9085', fontSize: 14 }}>Bio desativada — ligue "Bio ativa" para publicar.</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
window.BioEditor = BioEditor;
