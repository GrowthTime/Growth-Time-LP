// GT System — PÁGINA PÚBLICA da bio = BioShell.tsx do GTR (tema .store-fashion: fundo #faf8f5, tinta #1d1b19, serifa no título,
// hero com degradê da cor da marca, CTA pill full-width na cor da marca com pilha de consultoras + "online agora", vitrine em carrossel 4:5,
// links pretos, form "Deixe seu contato", rodapé com ícones das redes). Usada em ?view=bio (tela inteira) e na prévia do editor (compact + config).
const bioTheme = { bg: '#faf8f5', surface: '#fff', ink: '#1d1b19', muted: '#9a9085', line: '#ece6de' };
const bioDisplay = { fontFamily: "'Cormorant Garamond', Georgia, 'Times New Roman', serif", fontWeight: 600, letterSpacing: '.01em', lineHeight: 1.05 };
const bioEyebrow = { fontSize: 10.5, letterSpacing: '.22em', textTransform: 'uppercase', color: bioTheme.muted };
const bioBtnTxt = { fontWeight: 500, letterSpacing: '.05em', textTransform: 'uppercase', fontSize: 11.5 };
const bioContrast = (hex) => { const c = hex.replace('#', ''); const r = parseInt(c.slice(0, 2), 16), g = parseInt(c.slice(2, 4), 16), b = parseInt(c.slice(4, 6), 16); return (r * 299 + g * 587 + b * 114) / 1000 > 150 ? '#1d1b19' : '#fff'; };
const bioDefaultConfig = () => ({ headline: GT.bio.title, subheadline: GT.bio.subtitle, showHero: true, blocks: GT.bio.blocks.map((b, i) => ({ ...b, id: 'b' + i })), social: { ...GT.bio.social }, primary: '#1d1b19', accent: '#111111' });

function BioHeroCTA({ label, rotation, primary, step }) {
  const ink = bioContrast(primary);
  const stack = rotation.slice(0, 3), extra = Math.max(0, rotation.length - 3);
  const cur = GT.seller(rotation[step % rotation.length]);
  return (
    <div style={{ padding: '0 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '12px 16px', borderRadius: 999, background: primary, color: ink, boxShadow: '0 12px 28px -12px rgba(0,0,0,.45)' }}>
        <span style={{ display: 'flex', alignItems: 'center' }}>
          {stack.map((id, i) => { const s = GT.seller(id); const on = rotation[step % rotation.length] === id; return <span key={id} style={{ display: 'grid', placeItems: 'center', height: 36, width: 36, borderRadius: 999, marginLeft: i ? -12 : 0, background: on ? '#fff' : 'rgba(255,255,255,.22)', color: on ? primary : ink, border: '2px solid rgba(255,255,255,.55)', fontSize: 11, fontWeight: 600, transition: 'all .3s', zIndex: on ? 2 : 1, boxShadow: on ? '0 0 0 2px #3fc58f' : 'none' }}>{s.initials}</span>; })}
          {extra > 0 && <span style={{ display: 'grid', placeItems: 'center', height: 36, width: 36, borderRadius: 999, marginLeft: -12, background: 'rgba(0,0,0,.35)', color: '#fff', border: '2px solid rgba(255,255,255,.55)', fontSize: 11, fontWeight: 600 }}>+{extra}</span>}
        </span>
        <span style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', lineHeight: 1.2, minWidth: 0 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, ...bioBtnTxt, fontSize: 11, whiteSpace: 'nowrap' }}><Icon name="message-circle" size={14} color={ink} />{label}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10.5, opacity: .9, marginTop: 2, whiteSpace: 'nowrap' }}><span style={{ display: 'inline-block', height: 8, width: 8, borderRadius: 999, background: '#34d399', animation: 'gtPulse 2s ease-out infinite' }}></span>online agora · responde em minutos</span>
        </span>
      </div>
      {/* rodízio — só na demonstração: mostra quem atende o próximo toque */}
      <div key={step} className="gt-pop" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 8, ...bioEyebrow, fontSize: 9.5 }}><Icon name="shuffle" size={10} color={bioTheme.muted} />rodízio · próximo toque → <b style={{ color: bioTheme.ink, letterSpacing: '.12em' }}>{cur.name.split(' ')[0]}</b></div>
    </div>
  );
}
function BioProductCard({ p, primary }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
      <div style={{ position: 'relative', aspectRatio: '4 / 5', width: '100%', overflow: 'hidden', background: p.grad, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="shirt" size={36} color="rgba(255,255,255,.75)" />
        {p.bait && <span style={{ position: 'absolute', left: 8, top: 8, padding: '2px 6px', fontSize: 10, color: '#fff', background: primary, ...bioBtnTxt }}>Isca</span>}
        <span style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 4 }}>{p.colors.slice(0, 4).map((c, i) => <span key={i} style={{ height: 4, width: 4, borderRadius: 999, background: 'rgba(255,255,255,.9)' }}></span>)}</span>
      </div>
      <div style={{ paddingTop: 6, fontSize: 13, letterSpacing: '.02em', color: bioTheme.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
      <div style={{ fontSize: 12, color: bioTheme.muted }}>Grade P ao GG · {GT.fmt.brl(p.gradePrice, 2)}</div>
    </div>
  );
}
function PublicBio({ compact, config }) {
  const cfg = config || bioDefaultConfig();
  const step = K.useScene(5, 3500);
  const bstep = K.useScene(3, 4000);
  const primary = cfg.primary || '#1d1b19', accent = cfg.accent || '#111';
  const enabled = cfg.blocks.filter((b) => b.enabled);
  const igItems = GT.igPosts.slice(0, 4);
  const render = (b) => {
    if (b.type === 'consultora') return <BioHeroCTA key={b.id} label={b.label} rotation={b.rotation} primary={primary} step={step} />;
    if (b.type === 'banners') return (
      <div key={b.id} style={{ padding: '0 16px' }}>
        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 16 }}>
          <div style={{ display: 'flex', transition: 'transform .6s ease', transform: `translateX(-${bstep * 100}%)` }}>
            {b.items.map((it, i) => <div key={i} style={{ position: 'relative', aspectRatio: '16 / 9', width: '100%', flexShrink: 0, background: it.grad }}><div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', padding: 16, background: 'linear-gradient(to top, rgba(0,0,0,.45), transparent)' }}><span style={{ color: '#fff', fontSize: 20, ...bioDisplay }}>{it.t}</span></div></div>)}
          </div>
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 10, display: 'flex', justifyContent: 'center', gap: 6 }}>{b.items.map((_, i) => <span key={i} style={{ height: 6, width: i === bstep ? 18 : 6, borderRadius: 999, background: i === bstep ? '#fff' : 'rgba(255,255,255,.55)', transition: 'all .3s' }}></span>)}</div>
        </div>
      </div>
    );
    if (b.type === 'vitrine') { const items = [...(b.catalogo ? GT.products.filter((p) => p.showcase).slice(0, 5) : [])]; return (
      <section key={b.id} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 10, padding: '0 16px' }}><h2 style={{ fontSize: 24, ...bioDisplay, color: bioTheme.ink, flexShrink: 0 }}>Vitrine</h2><span style={{ ...bioEyebrow, fontSize: 9.5, textAlign: 'right', lineHeight: 1.3 }}>toque para falar sobre a peça</span></div>
        <div style={{ display: 'flex', gap: 12, overflowX: 'auto', padding: '0 16px 4px', scrollSnapType: 'x mandatory', scrollbarWidth: 'none' }}>
          {items.map((p) => <div key={p.id} style={{ flex: '0 0 62%', scrollSnapAlign: 'start' }}><BioProductCard p={p} primary={primary} /></div>)}
          {b.ig && igItems.map((it) => <div key={it.id} style={{ flex: '0 0 62%', scrollSnapAlign: 'start' }}>
            <div style={{ position: 'relative', aspectRatio: '4 / 5', width: '100%', overflow: 'hidden', background: it.grad }}>{it.kind === 'Reels' && <span style={{ position: 'absolute', right: 8, top: 8, display: 'grid', placeItems: 'center', height: 24, width: 24, borderRadius: 999, background: 'rgba(0,0,0,.55)' }}><Icon name="play" size={12} color="#fff" /></span>}</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 6 }}><span style={{ ...bioEyebrow, display: 'flex', alignItems: 'center', gap: 4 }}><Icon name="instagram" size={11} color={bioTheme.muted} />post</span><span style={{ fontSize: 11, color: bioTheme.muted, textDecoration: 'underline', textUnderlineOffset: 2 }}>ver no Instagram</span></div>
          </div>)}
        </div>
      </section>); }
    if (b.type === 'link') return (
      <div key={b.id} style={{ padding: '0 16px' }}><div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', padding: '15px 16px', borderRadius: 999, background: b.featured ? primary : accent, color: bioContrast(b.featured ? primary : accent), ...bioBtnTxt, fontSize: 12 }}>{b.label}<Icon name="external-link" size={14} color={bioContrast(b.featured ? primary : accent)} /></div></div>
    );
    if (b.type === 'form') return (
      <div key={b.id} style={{ padding: '0 16px' }}>
        <div style={{ borderRadius: 16, border: '1px solid ' + bioTheme.line, background: bioTheme.surface, padding: 16 }}>
          <h2 style={{ fontSize: 24, marginBottom: 12, ...bioDisplay, color: bioTheme.ink }}>Deixe seu contato</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {['WhatsApp *', ...b.fields.filter((f) => f !== 'WhatsApp')].map((f) => <div key={f} style={{ height: 42, borderRadius: 10, border: '1px solid ' + bioTheme.line, display: 'flex', alignItems: 'center', padding: '0 12px', fontSize: 13, color: bioTheme.muted, background: '#fff' }}>{f}</div>)}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 44, borderRadius: 999, background: primary, color: bioContrast(primary), ...bioBtnTxt }}>{b.title}</div>
          </div>
        </div>
      </div>
    );
    return null;
  };
  const socials = Object.entries(cfg.social || {}).filter(([, v]) => v);
  const sIcon = { instagram: 'instagram', tiktok: 'video', youtube: 'play', facebook: 'globe' };
  return (
    <div style={{ background: bioTheme.bg, color: bioTheme.ink, fontFamily: 'Inter, system-ui, sans-serif', minHeight: '100%' }}>
      <div style={{ margin: '0 auto', maxWidth: 448, display: 'flex', flexDirection: 'column', gap: 28, paddingBottom: 64, minHeight: compact ? 0 : '100vh' }}>
        {cfg.showHero && <header style={{ position: 'relative', overflow: 'hidden', padding: '48px 24px 32px', textAlign: 'center', background: `radial-gradient(130% 90% at 50% -10%, ${primary}42, transparent 68%), linear-gradient(180deg, ${primary}17, transparent 40%)` }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'grid', placeItems: 'center', height: 80, width: 80, borderRadius: 999, background: primary, color: bioContrast(primary), fontSize: 30, ...bioDisplay }}>{(cfg.headline || 'M').slice(0, 1).toUpperCase()}</div>
            <h1 style={{ fontSize: 36, ...bioDisplay }}>{cfg.headline}</h1>
            {cfg.subheadline && <p style={{ maxWidth: 288, fontSize: 14, color: bioTheme.muted, lineHeight: 1.45 }}>{cfg.subheadline}</p>}
            <span style={{ ...bioEyebrow, display: 'inline-flex', alignItems: 'center', gap: 6, paddingTop: 4 }}><Icon name="instagram" size={13} color={bioTheme.muted} />Instagram</span>
          </div>
        </header>}
        {enabled.map(render)}
        {socials.length > 0 && <footer style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, padding: '8px 16px 0' }}>{socials.map(([k]) => <span key={k} style={{ display: 'grid', placeItems: 'center', height: 40, width: 40, borderRadius: 999, border: '1px solid ' + bioTheme.line, background: '#fff' }}><Icon name={sIcon[k] || 'globe'} size={17} color={bioTheme.ink} /></span>)}</footer>}
        <div style={{ textAlign: 'center', ...bioEyebrow, fontSize: 9.5 }}>feito com Growth Time</div>
      </div>
    </div>
  );
}
window.PublicBio = PublicBio;
window.bioDefaultConfig = bioDefaultConfig;
