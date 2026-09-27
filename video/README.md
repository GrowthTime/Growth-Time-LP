# GTR — vídeo motion graphics

Vídeo de apresentação do **GTR (Growth Time Results)** feito em código: HTML/CSS/SVG/Canvas
animados por uma linha do tempo determinística, renderizados quadro a quadro no Chromium
headless e codificados em H.264 com uma trilha sonora sintetizada no mesmo compasso.

```
video/
  index.html          player (abre no navegador: play/pausa, barra de tempo, ← → pulam 1 s)
  js/timeline.js      EDL: ordem, início e duração de cada cena + arranjo musical + flashes
  js/engine.js        motor: registra cenas, faz seek(t), player, modo render
  js/lib.js           utilidades (easing, noise, rng, DOM/SVG builders, logo GT, formatação pt-BR)
  js/kit.js           componentes visuais da marca (fundo, headline, app GTR, celular, WhatsApp, KPIs, gráficos…)
  js/icons.js         subconjunto dos ícones lucide usados no app
  scenes/*.js         uma cena por arquivo (GTR.scene({...}))
  tools/render.mjs    renderizador (stills, contact sheet, vídeo)
  tools/soundtrack.py trilha + sound design procedurais (numpy)
  assets/             fontes da LP, logo, logos de clientes, cha-ching.mp3 do app
```

## Gerar o vídeo

```bash
node tools/sync-index.mjs                     # (re)gera as <script> das cenas a partir do timeline.js
node tools/render.mjs --info                  # exporta out/timeline.json (duração, cenas, cues de som)
python3 tools/soundtrack.py                   # audio/gtr-soundtrack.wav + .mp3
node tools/render.mjs --video --fps 60 --audio audio/gtr-soundtrack.wav --out out/gtr-apresentacao.mp4
```

Pré-requisitos: Node 18+, `playwright` (Chromium), `ffmpeg` com libx264 no PATH, Python 3 com `numpy` e `scipy`.

Prévia rápida: `node tools/render.mjs --sheet 20:30:0.5 --out sheet.jpg` (contact sheet) ou
`--stills 12.5,13` (PNGs em `out/stills/`). Para ver no navegador: `npx serve video` e abra `/`
(ou `/?t=12.5` para congelar num instante).

## Como escrever uma cena

```js
GTR.scene({
  id: 'meu-id',                     // = nome do arquivo scenes/meu-id.js e o id no timeline.js
  build(root, ctx) {                // root: div 1920×1080 da cena. ctx: {start, dur, cue, tl, rand, W, H}
    const bg = KIT.bg(root, { particles: 40 });
    const title = KIT.headline(root, 'Cada real *rastreado*.', { y: 540, size: 110 });
    const tl = ctx.tl();            // gsap.timeline({paused:true}) — tempo LOCAL da cena (0 = início)
    KIT.revealWords(tl, title.units, 0.2);
    ctx.cue('whoosh', 0.2);         // efeito sonoro no tempo local 0.2 s
    return {
      tl,                           // o motor faz tl.seek(local) a cada quadro
      update(local, global) {       // chamado a cada quadro, depois do tl
        bg.update(local);
      },
    };
  },
});
```

Regras (o render é paralelo e pula para qualquer quadro):

1. **Tudo é função do tempo.** Nada de `Date.now()`, `Math.random()`, `setTimeout`,
   `requestAnimationFrame`, transições/animações CSS, ou estado acumulado entre quadros.
   Aleatoriedade: `ctx.rand()` / `GTR.rng(seed)`. Movimento orgânico: `GTR.noise(x, y)`.
2. **DOM animado** → tweens no `tl` (GSAP). **Valores calculados** (contadores, canvas, texto
   digitado, gráficos, confete) → `update(local)` com `GTR.p / GTR.map / GTR.win`.
3. Uma cena só aparece entre `start - pre` e `start + dur + post`; fora disso fica `display:none`.
   Ela é responsável pela própria entrada e saída (ou por cobrir/descobrir a cena vizinha).
4. Palco fixo 1920×1080 px. Margem segura de títulos: 120 px nas laterais, 90 px em cima/baixo.
5. Fontes: `Russo One` (títulos, `.display`), `Inter` (UI), `Open Sans` (texto corrido), emoji via `.emoji`.
6. Cores: use `KIT.C` (teal `#38cc9c`, vibrant `#15dba8`, petróleo `#0b2b29/#001516`, tiers bronze/prata/ouro).

Cues de som disponíveis (`ctx.cue(nome, t, opts)`): `whoosh {dur, up}`, `swoosh`, `impact {size}`,
`boom`, `riser {dur}`, `blip {freq}`, `pop`, `ping`/`notify`, `glitch`, `type {dur, rate}`, `tick`,
`heartbeat`, `error`, `cash` (o cha-ching real do Modo TV), `shimmer`, `swell`. Todos aceitam `db`
(ganho em dB) e `pan` (-1..1).

## Direção de arte (vale para todas as cenas)

- **Palco:** escuro petróleo (`KIT.bg`), aurora teal sutil, grão global (cena `fx`). Painéis de UI do GTR
  em **claro** (`#fafafa`/branco) para contrastar — como o app real — com leve brilho teal ao redor.
- **Tipografia:** títulos em Russo One (H1 120–160 px, H2 72–96 px), palavra-chave em teal `#15dba8`
  (`*assim*` no `KIT.headline`), eyebrow Open Sans 700 caixa-alta 18–22 px com tracking .18em.
  UI em Inter. Nunca mais de ~6 palavras por título; cada bloco de texto fica ≥ 1,2 s legível.
- **Movimento:** entradas `power3.out`/`expo.out` 0,5–0,8 s com stagger 0,05–0,08 s; saídas
  `power2.in` 0,3–0,45 s; pops de UI `back.out(1.6)`; nada fica totalmente parado — use drift lento
  (`GTR.noise`) e parallax. Cortes e acentos caem no tempo da música (120 BPM → 0,5 s por batida).
- **Motivo da marca:** cortes a 45° e seta para cima/direita do logo GT; o ponto verde (full stop)
  como elemento de ligação. `KIT.diagWipe` faz a transição diagonal.
- **Profundidade:** sombras longas e suaves, glow teal, camadas com parallax (`KIT.camera` para push-in/rotação 3D).
- **Nomes/dados:** só os da demonstração pública (Moda Fashion, Ana Silva, Júlia Costa, Marina Alves,
  Patrícia Modas…) e números verdadeiros do código. Sem nomes de clientes reais.
