// GT System — Kit de UI compartilhado (mesma cara do mock: Inter, cards brancos raio 14, verde #3fc58f).
// Toda tela nova usa daqui para o conjunto parecer UM sistema. Exposto em window.K.
const K = {};
// Tokens = index.css do GTR (hsl → hex): primary 156 54% 51%, border 0 0% 90%, muted 96%, muted-fg 45%, fg 9%, bg 98%, sidebar 7%/14%, radius .75rem
K.c = { brand: '#3fc58f', brandDark: '#2fae7c', brandSoft: 'rgba(63,197,143,.12)', text: '#171717', muted: '#737373', faint: '#a3a3a3', line: '#e5e5e5', line2: '#f0f0f0', bg: '#fafafa', soft: '#f5f5f5', card: '#fff', dark: '#121212', darkAccent: '#242424', ok: '#16a34a', okBg: '#dcfce7', warn: '#a16207', warnBg: '#fef9c3', bad: '#dc2626', badBg: '#fee2e2', purple: '#9333ea', blue: '#2563eb', gold: '#f3b315', silver: '#a3adba', bronze: '#bd6b2f' };
K.r = 12; K.shadow = '0 1px 2px rgba(0,0,0,.05)';
K.font = 'Inter, sans-serif';
K.M = () => !!window.GT_MOBILE;

K.Card = ({ title, sub, right, children, style, pad = 22, flush }) => (
  <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 12, boxShadow: '0 1px 2px rgba(0,0,0,.05)', padding: flush ? 0 : pad, ...style }}>
    {(title || right) && (
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: children ? 14 : 0, padding: flush ? '18px 22px 0' : 0 }}>
        <div style={{ minWidth: 0 }}>
          {title && <div style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.2 }}>{title}</div>}
          {sub && <div style={{ fontSize: 12.5, color: '#737373', marginTop: 3 }}>{sub}</div>}
        </div>
        {right && <div style={{ flexShrink: 0 }}>{right}</div>}
      </div>
    )}
    {children}
  </div>
);

K.PageHead = ({ icon, title, sub, right }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
    <div>
      <h1 style={{ fontSize: K.M() ? 20 : 24, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 9 }}>{icon && <Icon name={icon} size={K.M() ? 20 : 24} color="#3fc58f" />}{title}</h1>
      {sub && <p style={{ fontSize: K.M() ? 13 : 14, color: '#737373', marginTop: 2 }}>{sub}</p>}
    </div>
    {right && <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>{right}</div>}
  </div>
);

// Abas = TabsList do shadcn: trilho cinza (muted) com a aba ativa branca. Todas as variantes usam o mesmo visual do sistema real.
K.Tabs = ({ tabs, value, onChange, size = 'md', style }) => { const h = size === 'sm' ? 32 : size === 'lg' ? 42 : 38; const fs = size === 'sm' ? 12.5 : 13.5; return (
  <div style={{ display: 'inline-flex', gap: 2, background: '#f5f5f5', borderRadius: 8, padding: 4, maxWidth: '100%', overflowX: 'auto', ...style }}>
    {tabs.map(([k, l, ic]) => { const on = value === k; return (
      <button key={k} onClick={() => onChange(k)} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, height: h - 8, fontSize: fs, fontWeight: 500, padding: '0 12px', borderRadius: 6, border: 'none', background: on ? '#fff' : 'transparent', color: on ? '#171717' : '#737373', boxShadow: on ? '0 1px 2px rgba(0,0,0,.08)' : 'none', cursor: 'pointer', fontFamily: K.font, whiteSpace: 'nowrap' }}>
        {ic && <Icon name={ic} size={15} color={on ? '#171717' : '#737373'} />}{l}
      </button>); })}
  </div>); };
K.PillTabs = (p) => <K.Tabs {...p} />;
K.UnderTabs = (p) => <K.Tabs {...p} />;
K.SegTabs = (p) => <K.Tabs size="sm" {...p} />;

// tone: cliente (verde claro) · pendente (amarelo claro) · qualificado (verde sólido) · outline · secondary (padrão cinza) · destructive
K.TONES = { secondary: ['#171717', '#f5f5f5', 'transparent'], cliente: ['#15803d', '#dcfce7', 'transparent'], pendente: ['#a16207', '#fef9c3', 'transparent'], qualificado: ['#fff', '#3fc58f', 'transparent'], outline: ['#171717', 'transparent', '#e5e5e5'], destructive: ['#fff', '#ef4444', 'transparent'], muted: ['#737373', '#f5f5f5', 'transparent'] };
K.Badge = ({ children, tone, color, bg, icon, style }) => { const t = K.TONES[tone] || K.TONES.secondary; const c = color || t[0], b = bg || t[1]; return (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11.5, fontWeight: 600, padding: '2px 9px', borderRadius: 999, color: c, background: b, border: '1px solid ' + (bg || color ? 'transparent' : t[2]), whiteSpace: 'nowrap', lineHeight: 1.5, ...style }}>{icon && <Icon name={icon} size={11} color={c} />}{children}</span>); };
K.Dot = ({ color = '#22c55e', size = 8, pulse }) => <span style={{ display: 'inline-block', height: size, width: size, borderRadius: 999, background: color, boxShadow: pulse ? `0 0 0 3px ${color}33` : 'none', flexShrink: 0 }}></span>;
K.STATUS = { ok: ['Conectado', '#16a34a', 'rgba(34,197,94,.1)'], attention: ['Atenção', '#ca8a04', 'rgba(234,179,8,.12)'], off: ['Desconectado', '#dc2626', 'rgba(220,38,38,.08)'], on: ['Ativo', '#16a34a', 'rgba(34,197,94,.1)'], paused: ['Pausado', '#737373', '#f5f5f5'] };
K.Status = ({ s = 'ok', label }) => { const [l, c, bg] = K.STATUS[s] || K.STATUS.ok; return <K.Badge color={c} bg={bg}><K.Dot color={c} size={6} />{label || l}</K.Badge>; };

K.Toggle = ({ on, onChange, small }) => (
  <button onClick={() => onChange && onChange(!on)} aria-pressed={on} style={{ width: small ? 32 : 40, height: small ? 18 : 22, borderRadius: 999, border: 'none', background: on ? '#3fc58f' : '#d4d4d4', position: 'relative', cursor: 'pointer', flexShrink: 0, transition: 'background .2s' }}>
    <span style={{ position: 'absolute', top: 2, left: on ? (small ? 16 : 20) : 2, height: small ? 14 : 18, width: small ? 14 : 18, borderRadius: 999, background: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,.2)', transition: 'left .2s' }}></span>
  </button>
);

K.Btn = ({ children, icon, primary, ghost, danger, small, onClick, style, full }) => (
  <button onClick={onClick} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, height: small ? 36 : 40, fontSize: 14, fontWeight: 500, padding: small ? '0 12px' : '0 16px', borderRadius: 8, cursor: 'pointer', fontFamily: K.font, width: full ? '100%' : 'auto',
    border: primary ? '1px solid #3fc58f' : ghost ? '1px solid transparent' : '1px solid #e5e5e5', background: primary ? '#3fc58f' : ghost ? 'transparent' : '#fff', color: primary ? '#fff' : danger ? '#dc2626' : '#171717', boxShadow: primary ? '0 1px 2px rgba(0,0,0,.05)' : 'none', ...style }}>
    {icon && <Icon name={icon} size={16} color={primary ? '#fff' : danger ? '#dc2626' : '#171717'} />}{children}
  </button>
);

// Selo do canal (logo no canto do avatar): WhatsApp verde / Instagram gradiente / Messenger azul / SMS roxo
K.ChannelChip = ({ channel = 'whatsapp', size = 16, style }) => { const ch = (window.GT && GT.channel[channel]) || { color: '#25D366', icon: 'phone' }; return (
  <span title={ch.label} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', height: size, width: size, borderRadius: 999, background: ch.color, border: '2px solid #fff', boxSizing: 'content-box', ...style }}>
    <Icon name={ch.icon} size={Math.round(size * .6)} color="#fff" strokeWidth={2.5} />
  </span>); };
// Como no GTR: contato = círculo verde-claro com iniciais verdes; solid = verde sólido com branco (vendedora, usuário logado). `color` só vale com `keepColor`.
K.Avatar = ({ initials, color, size = 40, channel, fontSize, style, ring, solid, keepColor }) => { const bg = solid ? (keepColor && color ? color : '#3fc58f') : 'rgba(63,197,143,.15)'; const fg = solid ? '#fff' : '#2fae7c'; return (
  <div style={{ position: 'relative', height: size, width: size, flexShrink: 0, ...style }}>
    <div style={{ height: size, width: size, borderRadius: 999, background: bg, color: fg, fontWeight: 600, fontSize: fontSize || Math.round(size * .36), display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: ring ? `0 0 0 2px #fff, 0 0 0 4px ${ring}` : 'none' }}>{initials}</div>
    {channel && <K.ChannelChip channel={channel} size={Math.round(size * .38)} style={{ position: 'absolute', bottom: -3, left: -3 }} />}
  </div>); };
K.SellerAvatar = ({ id, size = 32, channel, solid = true }) => { const s = GT.seller(id); return s ? <K.Avatar initials={s.initials} size={size} channel={channel} solid={solid} /> : null; };

K.Stat = ({ label, value, delta, up = true, icon, color = '#3fc58f', sub, style }) => (
  <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 12, padding: K.M() ? 16 : 20, boxShadow: '0 1px 2px rgba(0,0,0,.05)', ...style }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: '#737373', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</div>
        <div style={{ fontSize: K.M() ? 19 : 22, fontWeight: 700, marginTop: 5, letterSpacing: '-.01em', whiteSpace: 'nowrap' }}>{value}</div>
        {delta && <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11.5, fontWeight: 500, color: up ? '#059669' : '#dc2626', marginTop: 4 }}><Icon name={up ? 'arrow-up-right' : 'arrow-down-right'} size={12} />{delta}</div>}
        {sub && <div style={{ fontSize: 11.5, color: '#a3a3a3', marginTop: 4 }}>{sub}</div>}
      </div>
      {icon && <div style={{ height: 36, width: 36, borderRadius: 999, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon name={icon} size={17} color="#737373" /></div>}
    </div>
  </div>
);
K.Grid = ({ cols = 4, mcols = 2, gap = 14, children, style }) => <div style={{ display: 'grid', gridTemplateColumns: `repeat(${K.M() ? mcols : cols},minmax(0,1fr))`, gap, ...style }}>{children}</div>;

K.Table = ({ cols, rows, dense }) => (
  <div style={{ overflowX: 'auto' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: dense ? 12.5 : 13 }}>
      <thead><tr>{cols.map((c, i) => <th key={i} style={{ textAlign: c.align || 'left', fontSize: 11, fontWeight: 600, color: '#737373', textTransform: 'uppercase', letterSpacing: '.04em', padding: dense ? '8px 10px' : '10px 12px', borderBottom: '1px solid #eee', whiteSpace: 'nowrap' }}>{c.h}</th>)}</tr></thead>
      <tbody>{rows.map((r, ri) => <tr key={ri} style={{ borderBottom: '1px solid #f3f3f3' }}>{cols.map((c, ci) => <td key={ci} style={{ padding: dense ? '8px 10px' : '11px 12px', textAlign: c.align || 'left', whiteSpace: c.wrap ? 'normal' : 'nowrap', verticalAlign: 'middle' }}>{typeof c.cell === 'function' ? c.cell(r, ri) : r[c.k]}</td>)}</tr>)}</tbody>
    </table>
  </div>
);

K.Field = ({ label, value, placeholder, full, hint, right, textarea, onChange }) => (
  <label style={{ display: 'flex', flexDirection: 'column', gap: 6, gridColumn: full ? '1 / -1' : 'auto' }}>
    <span style={{ fontSize: 12.5, fontWeight: 500, color: '#404040', display: 'flex', justifyContent: 'space-between' }}>{label}{right}</span>
    {textarea
      ? <textarea defaultValue={value} placeholder={placeholder} rows={3} onChange={onChange} style={{ fontFamily: K.font, fontSize: 14, padding: '9px 12px', borderRadius: 8, border: '1px solid #e5e5e5', background: '#fff', color: '#171717', resize: 'vertical', outline: 'none' }} />
      : <input defaultValue={value} placeholder={placeholder} onChange={onChange} style={{ fontFamily: K.font, fontSize: 14, height: 40, padding: '0 12px', borderRadius: 8, border: '1px solid #e5e5e5', background: '#fff', color: '#171717', outline: 'none' }} />}
    {hint && <span style={{ fontSize: 11.5, color: '#a3a3a3' }}>{hint}</span>}
  </label>
);
K.Select = ({ value, options, onChange, icon, width = 200, small }) => (
  <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', width }}>
    {icon && <span style={{ position: 'absolute', left: 10, display: 'flex' }}><Icon name={icon} size={14} color="#737373" /></span>}
    <select value={value} onChange={(e) => onChange && onChange(e.target.value)} style={{ appearance: 'none', WebkitAppearance: 'none', width: '100%', height: small ? 32 : 40, padding: icon ? '0 30px 0 30px' : '0 30px 0 12px', borderRadius: 8, border: '1px solid #e5e5e5', background: '#fff', fontFamily: K.font, fontSize: small ? 12.5 : 13, fontWeight: 500, color: '#171717', cursor: 'pointer', outline: 'none' }}>
      {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
    </select>
    <span style={{ position: 'absolute', right: 9, display: 'flex', pointerEvents: 'none' }}><Icon name="chevron-down" size={14} color="#737373" /></span>
  </div>
);
K.Chip = ({ label, on, onClick, icon, count }) => (
  <button onClick={onClick} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, padding: '6px 11px', borderRadius: 999, border: '1px solid ' + (on ? '#3fc58f' : '#e5e5e5'), background: on ? '#3fc58f' : '#fff', color: on ? '#fff' : '#404040', cursor: 'pointer', fontFamily: K.font, whiteSpace: 'nowrap' }}>
    {icon && <Icon name={icon} size={13} color={on ? '#fff' : '#737373'} />}{label}{count != null && <span style={{ fontSize: 11, color: on ? 'rgba(255,255,255,.85)' : '#737373' }}>· {count}</span>}
  </button>
);
K.Progress = ({ value, color = '#3fc58f', height = 8, bg = '#f0f0f0' }) => (
  <div style={{ height, background: bg, borderRadius: 999, overflow: 'hidden' }}><div style={{ height: '100%', width: Math.max(0, Math.min(100, value)) + '%', background: color, borderRadius: 999, transition: 'width .6s' }}></div></div>
);
K.Kv = ({ items, cols = 2 }) => (
  <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols},minmax(0,1fr))`, gap: 12 }}>
    {items.map(([k, v], i) => <div key={i}><div style={{ fontSize: 11.5, color: '#737373' }}>{k}</div><div style={{ fontSize: 14, fontWeight: 600, marginTop: 2 }}>{v}</div></div>)}
  </div>
);
K.Empty = ({ icon = 'inbox', title, sub }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '40px 20px', color: '#a3a3a3', textAlign: 'center' }}>
    <Icon name={icon} size={30} color="#d4d4d4" /><div style={{ fontSize: 14, fontWeight: 600, color: '#737373' }}>{title}</div>{sub && <div style={{ fontSize: 12.5 }}>{sub}</div>}
  </div>
);
K.Note = ({ children, tone = 'info', icon }) => { const t = { info: ['rgba(63,197,143,.08)', 'rgba(63,197,143,.3)', '#2fae7c'], warn: ['rgba(243,179,21,.08)', 'rgba(243,179,21,.25)', '#ca8a04'], bad: ['rgba(220,38,38,.06)', 'rgba(220,38,38,.2)', '#dc2626'] }[tone]; return (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, background: t[0], border: '1px solid ' + t[1], borderRadius: 12, padding: '11px 14px', fontSize: 13, color: '#404040', lineHeight: 1.45 }}>{icon && <Icon name={icon} size={16} color={t[2]} style={{ flexShrink: 0, marginTop: 1 }} />}<div>{children}</div></div>); };

// Moldura de celular para prévias (bio pública, loja, Direct). width em px; conteúdo rola dentro.
K.Phone = ({ children, width = 300, height, bg = '#fff', style, chrome = true, url }) => (
  <div style={{ width, height: height || Math.round(width * 2.05), borderRadius: 36, background: '#0f0f0f', padding: 9, boxShadow: '0 18px 40px rgba(0,0,0,.22), inset 0 0 0 1px #333', position: 'relative', flexShrink: 0, ...style }}>
    <div style={{ position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)', width: Math.round(width * .32), height: 22, borderRadius: 999, background: '#0f0f0f', zIndex: 3 }}></div>
    <div style={{ height: '100%', borderRadius: 28, background: bg, overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {chrome && <div style={{ height: 46, flexShrink: 0, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 20px 5px', fontSize: 11.5, fontWeight: 600, color: '#171717' }}><span>9:41</span><span style={{ display: 'flex', gap: 4, alignItems: 'center' }}><Icon name="signal" size={12} /><Icon name="wifi" size={12} /><Icon name="battery" size={14} /></span></div>}
      {url && <div style={{ margin: '0 10px 6px', height: 26, borderRadius: 8, background: '#f1f1f1', fontSize: 11, color: '#555', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, flexShrink: 0 }}><Icon name="lock" size={10} color="#555" />{url}</div>}
      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>{children}</div>
    </div>
  </div>
);

// Texto "digitando…" animado (3 pontinhos) — usar nas encenações
K.Typing = ({ color = '#a3a3a3' }) => (
  <span style={{ display: 'inline-flex', gap: 3, alignItems: 'center', height: 10 }}>{[0, 1, 2].map((i) => <span key={i} style={{ height: 5, width: 5, borderRadius: 999, background: color, animation: `gtTyping 1s ${i * .18}s infinite` }}></span>)}</span>
);
// Helper de encenação: avança um índice a cada `ms`, em loop, só quando visível (economiza CPU nos iframes).
K.useScene = (steps, ms = 1600, loop = true) => {
  const [i, setI] = React.useState(0);
  React.useEffect(() => {
    let alive = true, t;
    const tick = () => { if (!alive) return; setI((v) => (v + 1 >= steps ? (loop ? 0 : v) : v + 1)); t = setTimeout(tick, ms); };
    t = setTimeout(tick, ms);
    const onVis = () => { if (document.hidden) clearTimeout(t); else { clearTimeout(t); t = setTimeout(tick, ms); } };
    document.addEventListener('visibilitychange', onVis);
    return () => { alive = false; clearTimeout(t); document.removeEventListener('visibilitychange', onVis); };
  }, [steps, ms, loop]);
  return i;
};
window.K = K;
