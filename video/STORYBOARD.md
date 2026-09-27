# PONTO FINAL · Do caos à máquina
**GTR (Growth Time Results): tech promo film · 94 s (47 bars at 120 BPM) · 1920×1080 · 60 fps · PT‑BR · no voice‑over**

## Creative concept

The film takes the brand's own punctuation, the green full stop of the GT mark, and makes it the turning point of a diagnosis.

**Act I: the diagnosis.** Act I puts the viewer inside the worst day of a lojista who sells on WhatsApp. It opens on a full‑frame red notification badge racing from 1 to 99+. Each of four pains is stamped on screen as a red system error in a HUD log:
- ERRO 01 · SEM RESPOSTA
- ERRO 02 · NÚMERO BANIDO
- ERRO 03 · SEM RASTREIO
- ERRO 04 · CLIENTE OURO SUMIU

At 16 s the collapse cuts to black and total silence. A single green dot appears and becomes the period of "Ponto final no caos". The letters dissolve, and the GT mark assembles around the dot along its 45° growth diagonals. The mark locks on the bar and the camera dives through the 45° gap between the green chevron and the green stem, straight into the product. The drop lands at 22 s.

**Act II: the fixes.** The machine fixes each error in the same order, and each chip flips from red ERRO to a teal check on the exact frame the proof lands:
- **01:** the AI answers a lead at 23:47 with the store closed.
- **02:** the same chat appears on the phone app. The desktop wallpaper literally becomes WhatsApp, a pun on Coexistência, then the scene cuts to the official Meta API.
- **03:** the sale rewinds to the ad that created it, and the chip's 4 digits lock ROAS 5,6x.
- **04:** Guto finds the vanished gold client and proves every number against the database.

**Act III: performance, proof and CTA.**
- The film climbs into the funnel and Modo TV: cha‑ching on every beat, then Ana crosses Ouro and PARABÉNS fires with confetti on a gold flash.
- A quick tour of loja, rodízio and fluxos (Beta) follows.
- Next is the machine under the hood: a sphere of 124 real cloud functions and true numbers.
- "Performance, não vaidade." comes next, then "Do Ceará para todo o Brasil".
- The film closes on "Está na hora de escalar.", whose period flies up and becomes the logo's dot.

The CTA "Agende seu diagnóstico gratuito" pays off the whole device: the viewer has just watched four errors diagnosed and fixed.

---

## 0. Spec sheet and edit decision list

| # | id | start | dur | end | z | pre | post | act | music section(s) |
|---|---|---|---|---|---|---|---|---|---|
| 1 | `dor-caos` | 0 | 4 | 4 | 10 | 0 | 0 | I · hook + ERRO 01 | dor-gancho |
| 2 | `dor-banido` | 4 | 4 | 8 | 11 | 0 | 0 | I · ERRO 02 | dor-escalada |
| 3 | `dor-dinheiro` | 8 | 4 | 12 | 12 | 0 | 0 | I · ERRO 03 | dor-escalada |
| 4 | `dor-sumiu` | 12 | 4 | 16 | 13 | 0 | 0 | I · ERRO 04 + collapse | dor-colapso |
| 5 | `ponto-final` | 16 | 6 | 22 | **30** | 0 | 0 | II · silence, dot, logo, gate dive | silencio, revelacao, logo |
| 6 | `fix-ia` | 22 | 8 | 30 | 20 | **0.5** | 0 | III · 01 fixed (DROP) | drop-atender |
| 7 | `fix-oficial` | 30 | 6 | 36 | 21 | 0 | 0 | III · 02 fixed | oficial |
| 8 | `fix-rastreio` | 36 | 8 | 44 | 22 | 0 | 0 | III · 03 fixed | medir |
| 9 | `fix-guto` | 44 | 8 | 52 | 23 | 0 | 0 | III · 04 fixed | guto-pensa, guto-responde |
| 10 | `dashboard-funil` | 52 | 6 | 58 | 24 | 0 | 0 | IV · peak | pico-dash |
| 11 | `modo-tv` | 58 | 8 | 66 | 25 | 0 | 0 | IV · peak | tv-vendas, parabens |
| 12 | `montagem` | 66 | 6 | 72 | 26 | 0 | 0 | IV · ecosystem | montagem |
| 13 | `sob-o-capo` | 72 | 8 | 80 | 27 | 0 | 0 | V · tech power | sob-o-capo |
| 14 | `prova` | 80 | 6 | 86 | 28 | 0 | 0 | V · proof | final |
| 15 | `cta-final` | 86 | 8 | 94 | 29 | **0.5** | 0 | V · CTA / end card | cta, outro |
| – | `space` (existing) | 0 | 94 | 94 | 0 | – | – | global backdrop | – |
| – | `fx` (existing) | 0 | 94 | 94 | 100 | – | – | grain, flashes, disclaimer | – |

**Timing and layer rules**
- Every scene starts on a bar line (an even second), and the film ends on bar 47 at 94.0 s. There are no gaps.
- Only two pre‑rolls exist: S6 (behind the S5 gate dive) and S15 (the headline halves). Both are driven in `update()`.
- z order matters only in overlaps. S5 (z 30) sits above S6 (z 20) so that S6 shows through the gate dive. S15 (z 29) sits above S14 (z 28).

Times inside each scene are **local** seconds; **[brackets] are global**.

---

## 1. Global rules (every engineer reads this first)

### 1.1 Engine contract (hard)
- `engine.js` calls `tl.seek(Math.max(0, local))`, so the **GSAP timeline is frozen during `pre`**.
  - Anything that moves at local < 0 must be computed in `update(local)` with `GTR.p / GTR.map / GTR.inv`. Only S6 and S15 have pre‑rolls.
  - A `fromTo` tween placed later on the tl renders its *from* state at seek(0). That keeps elements hidden during pre, which is what we want.
- **Division of labour:**
  - The tl handles DOM pops and reveals (headlines, cards, pills).
  - `update()` handles cameras (`KIT.camera.set` every frame), counters, canvases, typewriters, the chip stamp and flip, clip‑paths and shake.
  - Never let the tl and `update()` write the same property of the same element.
- **Determinism:** use `ctx.rand` or `GTR.rng(seed)` and `GTR.noise`. Never use `Date.now`, `Math.random`, or CSS transitions or animations.
- **Measuring:**
  - Fonts are loaded before `build()` (the engine awaits `document.fonts.load`), so measuring text width once in `build()` is allowed.
  - Never measure per frame. Never use `getBoundingClientRect` on transformed elements; compute positions from your layout constants (formulas are given where needed).

### 1.2 Stage and backgrounds
- The global `space` layer (z 0) is the stage. Its mood is keyframed in `GTR.TIMELINE.space.keys` (see JSON).
  - **Act I (0–16):** `danger:1`, which gives red blobs and red dust.
  - **16–21.4:** `dim:1`, which gives black.
  - **From 21.9:** teal aurora.
  - **72–80:** grid floor.
  - **From 87:** grid.
- **Scene roots stay transparent.** Do **not** call `KIT.bg()` in scenes. There are three exceptions:
  - S5 draws its own full‑frame `#000c0d` backdrop.
  - S11 has a black power‑on plate.
  - S12 Panel A uses `KIT.bg({base:'light'})`.
- Light GTR UI panels (`#fafafa` / `#fff`, 1 px `#e5e5e5`, radius 12–18) float on the dark stage. Give them the appWindow shadow (`0 40px 120px rgba(0,0,0,.55), 0 0 80px rgba(21,219,168,.12)`).

### 1.3 Two visual modes

| | **DOR** (S1–S4) | **MÁQUINA** (S5–S15) |
|---|---|---|
| Accent in headlines | `*em*` recoloured `#ef4444`, glow `0 0 30px rgba(239,68,68,.5)` (after `KIT.headline`, restyle `.kit-em`) | `*em*` = `#15dba8` with `glow:true`. Tier words use tier colours. |
| Camera | `KIT.camera` + handheld shake: `x += noise(t*8)*A`, `y += noise(t*8+50)*A`, `rz += noise(t*5+9)*A*0.03` (A in px, per scene). HUD never shakes. | Smooth push‑ins, orbits and 3D settles. No shake. |
| UI filter | `filter: saturate(.7)` on UI panels | none |
| Headline reveal | `KIT.revealChars` (y 90, rot ±8 alternating, stagger .025, back.out) | `KIT.revealWords` (y 60, blur 12, dur .7, stagger .07); exits with `KIT.hideUnits` |

- **Glitch discipline:** heavy tear/RGB‑split is used **only** at S1 3.75–4.0 (plus its 0.25 s settle at S2 0.0–0.25) and at S4 3.0–4.0. No other scene glitches its frame.
- **Torn bars helper (S1 and S4 only):** a full‑frame canvas with N = round(6·amt) horizontal bars. Each bar has h 6–40 px and y = rng()·1080. Colours are `#000c0d`, `rgba(239,68,68,.5)` and `rgba(21,219,168,.35)`. The seed is `GTR.rng(Math.floor(global*30))`. The whole world also gets `KIT.glitch(worldEl, amt, t, seed)` for RGB split.

### 1.4 HUD, scrims and type
- **HUD** means a child of the scene root **outside** `KIT.camera`. That covers headlines, the diagnostic chip, stopwatches and lower thirds.
- **Scrims:**
  - Behind any headline that sits over or next to a light panel, use a div `radial-gradient(closest-side, rgba(0,21,22,.78), rgba(0,21,22,0))` sized to the text block + 140 px on each side.
  - Bottom headlines use a band `linear-gradient(0deg, rgba(0,21,22,.9) 0%, rgba(0,21,22,0) 100%)`, 380 px tall, at the bottom of the frame.
- **Type sizes:**
  - H1: Russo One 110–170.
  - H2 beside UI: 84–104.
  - Sublines: Open Sans 600 30–40, `rgba(255,255,255,.8)`.
  - Eyebrows: Open Sans 700 18, uppercase, tracking .18em, `#15dba8` (on light: `#27ae8f`).
  - UI: Inter.
- **Safe margins** for titles: 120 px left/right, 90 px top/bottom. Every headline is ≤ 6 words and fully revealed for ≥ 1.2 s (timings below already comply).
- **Widths:** headline widths below were measured from `russoone-latin.woff2`, so the line breaks given are the ones that fit.

### 1.5 Glyph policy (hard)
- The shipped latin subsets of Inter, Open Sans and Russo One **do not contain** ✓ ● → ↗ ↘ ⇄ ◀ ⏩ (verified).
  - Use lucide icons instead: `check`, `circle-check`, `arrow-right`, `trending-up`, `trending-down`, `arrow-right-left`, `history`, and so on.
  - Use a CSS circle for any "●".
- **Safe characters:** · (U+00B7), • (U+2022), … (U+2026), — (U+2014), › (U+203A), ×, and all Portuguese accents.
- Emoji go **only** inside `<span class="emoji">`.
- Never type a closing "." after a headline that uses the green dot as its period (S5, S15). There, the dot is a DOM circle.

### 1.6 Diagnostic chip (the through‑line device)

The S1 engineer adds this to `kit.js` **before** other scenes start: `KIT.diagChip`. It is used by S1–S4 and S6–S9.

```
KIT.diagChip(parent, {n:'01', err:'SEM RESPOSTA', ok:'RESPONDIDO', x:120, y:96})
  → { el, stamp(p), flip(p), blink(local), place(x, y, scale) }   // all pure setters, call from update()
```

- **Container:**
  - `position:absolute; left:x; top:y; height:46px; perspective:600px; z-index:60`.
  - Two stacked faces (`backface-visibility:hidden`), pill radius 999, padding 0 20 px.
  - Text: Inter 700 17 px, uppercase, tracking .14em. Shadow: `0 10px 30px rgba(0,0,0,.35)`.
- **Error face:** readable on dark **and** light backgrounds.
  - Background `linear-gradient(rgba(239,68,68,.16),rgba(239,68,68,.16)), #170b0c`, border `1px solid rgba(239,68,68,.55)`, text `#fca5a5`.
  - A leading 10 px CSS dot `#ef4444`, visible when `fract(local*2) < .5` (`blink`).
  - Text: `ERRO 01 · SEM RESPOSTA`.
- **OK face:**
  - Background `linear-gradient(rgba(21,219,168,.16),rgba(21,219,168,.16)), #04201b`, border `rgba(21,219,168,.55)`, text `#15dba8`.
  - Leading lucide `circle-check` at 18 px. Text: `01 · RESPONDIDO`.
- **`stamp(p)`**, p over 0.18 s:
  - scale `lerp(1.6, 1, expo.out(p))`, opacity p.
  - The border is white while p < 0.25.
- **`flip(p)`**, p over 0.5 s:
  - The error face does `rotateX(-90·power2.in(inv(p,0,.4)))deg`.
  - The OK face does `rotateX(90·(1-power2.out(inv(p,.4,.8))))deg`.
  - The whole chip scales `1 + 0.08·sin(π·inv(p,.8,1))`.
- **Labels:**

| n | error face | OK face |
|---|---|---|
| 01 | ERRO 01 · SEM RESPOSTA | 01 · RESPONDIDO |
| 02 | ERRO 02 · NÚMERO BANIDO | 02 · API OFICIAL |
| 03 | ERRO 03 · SEM RASTREIO | 03 · RASTREADO |
| 04 | ERRO 04 · CLIENTE OURO SUMIU | 04 · CLIENTE NA MIRA |

- **Positions:**
  - Act I log: chip *n* at x 120, y `96 + (n−1)·58`. Chips from earlier pains are present and static from frame 0 of each later pain scene.
  - Fix scenes S6–S9: one chip at (120, 96). It stamps red early and **flips on the proof moment**. Each state stays on screen ≥ 1.2 s.

### 1.7 Shared composition: the "Revenda Bella" client card (S4 dark ↔ S9 light)

| element | spec |
|---|---|
| Avatar | "RB", `linear-gradient(135deg,#f3b315,#a16207)`, white Inter 800. Ring 3 px `#f3b315` with glow `0 0 24px rgba(243,179,21,.55)`. Size 120 px (S4) / 72 px (S9). |
| Name | "Revenda Bella", Inter 800, 40 px (S4) / 24 px (S9) |
| Tier chip | `<span class="emoji">🏅</span> Ouro`. Text `#a16207` on `rgba(243,179,21,.18)`, Inter 700, radius 999. |
| Alert pill | lucide `clock` + "há 4 meses sem comprar". Bg `rgba(239,68,68,.14)`; text `#fca5a5` on dark, `#dc2626` on light. |
| S4 only | Line "Cliente desde 2024 · comprava todo mês" and the "Compras por mês" bars |
| S9 only | Button "Chamar no WhatsApp" (`#25d366`, lucide `message-circle`) |

### 1.8 Demo data (single source of truth: never deviate)

**People**
- Only these demo names appear: Moda Fashion, Ana Silva, Júlia Costa, Marina Alves, Carla Mendes, Paula Ribeiro, Bia Ramos (these seven are *sellers only*), Patrícia Modas, Revenda Bella, lojinha.da.bia (these three are *customers only*).
- Unknown leads appear as masked numbers: `(85) 9 ••••-3344`, `(21) 9 ••••-2208`, `(71) 9 ••••-1177`, `(11) 9 ••••-0932`, `(81) 9 ••••-7765`.

**Patrícia Modas's story (S1, S6, S7, S8)**
- She came from the ad `[MF · 4321] Coleção Verão · Carrossel`, on WhatsApp instance `Vendas 1 · 4321`.
- The AI answers her at 23:47. Her order is Vestido midi, 3 grades × R$ 389 = **R$ 1.167**.

**Revenda Bella (S4, S6, S9)**
- Ouro client since 2024. Compras por mês fev–set: 3.200 · 2.700 · 1.900 · 900 · 0 · 0 · 0 · 0.
- Última compra maio/2026, so "há 4 meses sem comprar". **Ticket médio R$ 2.340.**

**Ads**
- Investido R$ 24.800.
- Top 3 Criativos:

| # | creative | ROAS |
|---|---|---|
| 1 | Coleção Verão · Carrossel (Invest. R$ 8.200 · Leads 720) | 5,6x |
| 2 | Grade Atacado · Vídeo 15s | 5,1x |
| 3 | Depoimento Lojista · Reels | 3,7x |

- Never show the Dashboard's 25,00x or the Anúncios 7,20x.

**Dashboard (setembro 2026)**
- KPIs:

| KPI | value | change |
|---|---|---|
| Clientes Novos | 1.284 | +12,4% |
| Valor Total de Vendas | R$ 620.000 | +18,2% |
| Ticket Médio | R$ 483 | +5,1% |
| CPA | R$ 38,40 | −7,8%, shown green |

- Funnel: 12.480 · 1.850 · 312 · R$ 79,49 · R$ 620.000,00.
- 7‑day chart, Sáb–Sex: 18.400 · 6.200 · 27.900 · 31.700 · 24.600 · 29.300 · 33.100.

**TV (Metas de Setembro de 2026)**
- Team: R$ 620.000 / R$ 700.000, 89%. Tiers: Bronze 500 mil · Prata 600 mil · Ouro 700 mil.
- Sales script, running total and %:

| seller | sale | team total | team % |
|---|---|---|---|
| Júlia | 890 | 620.890 | 89% |
| Paula | 1.180 | 622.070 | 89% |
| Bia | 1.450 | 623.520 | 89% |
| Marina | 640 | 624.160 | 89% |
| Ana | 4.400 | **628.560** | **90%** |

- The legend's "faltam N mil" is live: `Math.round((700000−total)/1000)`, giving 80 → 79 → 78 → 76 → 76 → 71.

**Tech (true, from the code)**

| on screen | source count |
|---|---|
| +260 mil linhas de código | 262.149 lines |
| 124 funções rodando na nuvem | 124 business edge functions |
| 361 evoluções do banco em 10 meses | 361 migrations, Dez/2025–Set/2026 |
| 129 tabelas com isolamento por empresa | RLS on 129 tables |
| Criptografia AES‑256 | AES‑256‑GCM |
| 26+ rotinas automáticas 24/7 | ≥26 pg_cron jobs |
| Saúde do número checada a cada 30 min | `whatsapp-cloud-health` cron |

**Instagram vanity numbers (S14):** 3.320 curtidas · 48,2K seguidores · 187,4K alcance.

### 1.9 Disclaimer, SFX rules, flashes
- **Disclaimer:** "Imagens e dados ilustrativos" is drawn by `fx` (bottom‑left) during `[[0.4,15.6],[22.4,71.6]]`. Keep x < 380, y > 1020 free of content in those spans. There are no per‑scene demo captions.
- **SFX:**
  - Sections with `impactIn` place the impact themselves at **20.0, 22.0, 46.0, 52.0, 62.0, 80.0 and 86.0**. Scenes must **not** cue `impact`/`boom` at those instants.
  - `cash` (the real cha‑ching) is reserved for S11.
- **Flashes** are global, via `fx` (see JSON). There is no flash at 16.0: that cut goes to black and silence.

---

## 2. Scenes

### S1 · `dor-caos` · start 0.0 · dur 4.0 · z 10 · pre 0 · post 0  [0–4]

**Purpose.** The hook stops the scroll on frame 0 with a red badge exploding to 99+, then shows pain 01: messages nobody answers.

**Contract.**
- **First frame:** fully composed, no fade. The giant red badge "1" fills the frame over red‑mode space.
- **Last frame (4.0):** heavily torn (amt 1.0) over this final layout:
  - The phone `KIT.phone({x:620, y:580, w:420})` is wrapped in a div with `rotateY(16deg)` (origin at the phone centre), inside `KIT.camera({perspective:1400})` at identity plus shake.
  - The headline column is at x 1060.
  - Chip 01 is at (120, 96).

**On‑screen copy**
- **Badge:** "1" counting up to "99+".
- **Phone list header:** "Conversas" plus a red pill "99+".
- **Rows** (name · last message · green unread count):

| name | last message | unread |
|---|---|---|
| Patrícia Modas | Oi! Vi o anúncio da coleção verão | 3 |
| (85) 9 ••••-3344 | Oi, tem grade? | 2 |
| (21) 9 ••••-2208 | Faz entrega em SP? | 5 |
| (71) 9 ••••-1177 | Alguém aí? | 7 |
| (11) 9 ••••-0932 | Tem a grade em preto? | 4 |
| (81) 9 ••••-7765 | Pode me mandar o link? | 12 |

- **Swarm bubbles (12):** "Oi, tem grade?" · "Qual o mínimo do atacado?" · "Ainda tem o vestido midi?" · "Faz entrega em SP?" · "Tem no preto?" · "Quanto fica a grade de 6?" · "Aceita Pix?" · "Alguém aí?" · "Oi??" · "Vocês têm catálogo?" · "Pode me mandar o link?" · "Chegou a saia plissada?"
- **Hero bubble:** "Vou comprar em outro lugar."
- **Timer pills:** "sem resposta · 13 min" / "47 min" / "2 h" / "5 h" / "1 dia" / "2 dias".
- **Headline A:** `Cliente\nchamando.` (Russo One 112; 608 px wide).
- **Headline B:** `*Ninguém*\nresponde.` ("Ninguém" in red).
- **Chip:** ERRO 01 · SEM RESPOSTA.

**Layers, back to front**
1. Camera world: phone, swarm, and the hero bubble. `saturate(.7)`.
2. HUD badge.
3. HUD headlines.
4. HUD chip.
5. Tear canvas.

**Choreography**
- **0.00: frame 0.**
  - A 980 px circle at (960, 540): `radial-gradient(circle at 35% 30%, #f87171, #dc2626 70%)`, glow `0 0 160px rgba(239,68,68,.55)`, an inner top highlight.
  - Numeral in Russo One 520 px, white, centred.
  - The phone is already present behind it at scale 0.6, blur 20.
  - Shake A = 3 px.
- **0.00–1.00: counter.**
  - `n = round(map(local, 0, 1.0, 1, 99, 'power2.in'))`.
  - Each notify ping kicks the badge scale +4%, decaying over 0.12 s. Compute this in `update` as the sum over ping times.
  - **1.00:** the text becomes "99+" (360 px). Shake burst to 12 px for 0.2 s.
- **0.75–1.50: pull‑back.**
  - The badge scales 1 → 0.05 (expo.inOut) and translates to the dock target **D ≈ (1096, 244)**.
  - D is computed analytically as `(960 + (14+340−215)·k, 580 + (14+92−450)·k)` with `k = 420/430`. The phone is at x 960 during this move, and (340, 92) is the "99+" pill centre in the 402×872 screen coordinates.
  - At the same time the phone goes scale 0.6 → 1, blur 20 → 0.
  - **1.50:** the badge is hidden and the phone's own pill shows "99+".
- **0.75–2.125: swarm.**
  - 12 bubbles (`KIT.bubble` in absolutely positioned wrappers) pop on 16ths (`0.75 + i·0.125`; scale 0.6 → 1, back.out).
  - They sit on a deterministic spiral around the phone: x ±700, y ±380, translateZ −600…+300 (`ctx.rand`).
  - They drift toward the camera at +80 px/s in translateZ.
- **1.50–2.00:** the phone slides to x 620, rotateY 0 → 16° (power3.out). The swarm shifts −200 px.
  - A right‑half scrim appears: `linear-gradient(90deg, transparent, rgba(0,21,22,.85) 55%)`.
  - **Headline A** appears: x 1060, left‑aligned, block centre y 360, `revealChars` at 1.50.
- **2.00 [bar]: Headline B** at block centre y 660, `revealWords` (dur .45), red accent. The red flash (global) fires.
- **2.25–2.875:** timer pills (`KIT.pill`, bg `rgba(239,68,68,.16)`, text `#fca5a5`, 14 px) snap onto 6 bubbles at 2.25 + i·0.125. Those bubbles go grayscale 0.4.
- **3.00–3.35:** "Vou comprar em outro lugar." flies from deep z to the front‑left over the phone (x 380, y 820, scale 1.4). At 3.5 it turns gray and fades to 0.6.
- **3.25:** chip 01 stamps at (120, 96).
- **2.0–3.75:** shake grows 3 → 10 px.
- **3.75–4.00:** heavy tear: amt 0 → 1 on the world and the headlines, plus the torn‑bars canvas. Hard cut.
- **Readability:** A is readable 1.95–3.75 (1.8 s), B is readable 2.45–3.75 (1.3 s).

**Kit.** `KIT.camera`, `KIT.phone`, `KIT.bubble`, `KIT.pill`, `KIT.headline`, `revealChars`, `revealWords`, `KIT.glitch`, `KIT.diagChip`, `GTR.noise`.

**SFX**
- `notify {db:-4}` at 0, .25, .5, .625, .75, .875, 1.0 (pan alternating ±0.3).
- `impact {size:.6}` at 1.00.
- `whoosh {dur:.6, up:false}` at 0.80.
- `impact {size:.8}` at 2.00.
- `error {db:-6}` at 2.50.
- `tick {db:-4}` at 2.5, 3.0, 3.5.
- `swoosh` at 3.00.
- `glitch {dur:.12}` at 3.25.
- `glitch {dur:.3}` at 3.75.

---

### S2 · `dor-banido` · start 4.0 · dur 4.0 · z 11 · pre 0 · post 0  [4–8]

**Purpose.** Pain 02: the number is banned without warning and the conversations are lost.

**Contract.**
- **First frame:** a match cut. The phone and camera are exactly as S1 ended: `KIT.phone({x:620,y:580,w:420})`, rotateY 16°, perspective 1400. Residual tear amt 0.6. Chip 01 at (120, 96).
- **Last frame:** the world is whipped out to translateX −900 with blur 24, streaks at alpha 0.6, and chips 01 and 02 remain.

**On‑screen copy**
- **Ban modal on the phone:** a red circle with a lucide `ban` icon (96 px) and the text "Esta conta não está mais autorizada a usar o WhatsApp". Gray button "Saiba mais".
- **Headline:** `O WhatsApp\n*bloqueia*.` (112 px).
- **Sublines:** `Sem aviso.` · `Sem motivo.`
- **Chip:** ERRO 02 · NÚMERO BANIDO.

**Choreography**
- **0.00–0.25:** the tear settles 0.6 → 0. This is the only glitch in this scene.
  - The modal is present: a white card with radius 20, text in Inter 600 22 `#111`, centred.
  - The list behind it is blurred 6 px.
- **0.30–1.20:** the rows behind the modal collapse from the bottom up (height → 0 and fade, stagger 0.08). The header pill "99+" shrinks to nothing.
- **0.50:** the headline appears: x 1060, left, block centre y 380. `revealChars`, red accent on "bloqueia".
- **1.50:** "Sem aviso." (Open Sans 700 40, 80% white) at x 1060, y 600.
- **2.00:** "Sem motivo." at y 660.
- **2.50:** a lucide `lock` (120 px, `#ef4444`) slams onto the phone screen (scale 2 → 1, back.out).
  - The phone goes to `grayscale(1) brightness(.55)`.
  - A red scanline sweeps down the screen over 2.5–2.9.
- **2.75:** chip 02 stamps at (120, 154).
- **Camera** (`update`): push 1 → 1.05 over 0–3.5, shake A = 3.
- **3.50–4.00: whip.**
  - World translateX 0 → −900, blur 0 → 24 (power2.in).
  - The HUD texts slide −600 and fade over 3.5–3.85.
  - A canvas `KIT.streaks` runs (dir −1), alpha 0 → 0.6.
- **Readability:** the headline is readable 1.0–3.5; "Sem motivo." is readable 2.3–3.5.

**Kit.** `KIT.camera`, `KIT.phone`, `KIT.headline`, `KIT.streaks`, `KIT.diagChip`.

**SFX**
- `glitch {dur:.15, db:-6}` at 0.00.
- `tick {db:-10}` at 0.4, 0.6, 0.8, 1.0 (rows dying).
- `impact {size:.7}` at 0.50.
- `impact {size:.35, db:-4}` at 1.50 and 2.00.
- `error {dur:.3}` at 2.50.
- `tick` at 2.75.
- `whoosh {dur:.45, up:false}` at 3.55.

---

### S3 · `dor-dinheiro` · start 8.0 · dur 4.0 · z 12 · pre 0 · post 0  [8–12]

**Purpose.** Pain 03: ad money flows out and vanishes before it becomes a traceable sale.

**Contract.**
- **First frame:** the world is at translateX +900 with blur 24 and streaks (the whip‑in).
- **Last frame:** the world is zoomed through the gap. A full‑frame `#000c0d` overlay sits at opacity 0.85. Chips 01–03 remain.

**On‑screen copy**
- **Eyebrows:** ANÚNCIO · WHATSAPP · VENDA.
- **Ad card:**
  - Header "modafashion · Patrocinado".
  - Image "COLEÇÃO VERÃO".
  - CTA bar "Enviar mensagem".
- **Under the ad:** the label "Investido" with a counter R$ 0 → **R$ 24.800**.
- **Sale node:** the value never resolves. It shows "R$ " followed by 5 glyphs from `0123456789?#`, reseeded 12× per second by `GTR.rng(floor(local*12))`. Under it, a red pill "Não rastreado".
- **Headline:** `O dinheiro *some*.` (120 px; 1023 px wide).
- **Subline:** `Qual anúncio vendeu? Ninguém sabe.`
- **Chip:** ERRO 03 · SEM RASTREIO.

**Layout** (world). S8 reuses the same node positions.
- **Ad card:** dark glass 340×420 at top‑left (180, 250).
  - Image block 300×250, `linear-gradient(135deg,#fb7185,#c2410c)`, with a lucide `shirt` icon and "COLEÇÃO VERÃO" in Russo One 28.
- **WhatsApp node:** `KIT.channel('wa',110)` centred at (960, 460).
- **Sale node:** dark glass 300×180 at top‑left (1480, 370).
- **Eyebrows:** Open Sans 700 18, 60% white, at y 215 / 380 / 335 above each node.
- **Path:** SVG, dashed 3 px `rgba(255,255,255,.35)`.
  - Segment 1: (520, 460) → (905, 460).
  - Segment 2: (1015, 460) → (1480, 460).
- **Counter:** "Investido" at (180, 690), with the value in Inter 800 44 white at y 720.

**Choreography**
- **0.00–0.40** (`update`): whip‑in. World translateX +900 → 0, blur 24 → 0 (power3.out). Streaks alpha 0.6 → 0.
- **0.00–3.20:** the counter climbs (power1.in), with a small red lucide `trending-up` beside it.
- **0.20–2.80: token stream** (canvas).
  - Tokens are "R$" chips: rounded rects 54×30, fill `#27ae8f`, Inter 800 16 white.
  - One is emitted every 0.125 s from the ad card. Each takes 0.3 s per segment.
- **0.75: the break.**
  - Segment 2 opens a gap from 40% to 60% of its length (x 1201–1294). Red sparks spit from the gap edges.
  - Tokens reaching the gap fall (`y += ½·2200·τ²`), spin, turn gray (`#6b7472`) and fade before y 1000.
- **1.00:** the headline appears (centred, y 850), `revealChars`, red "some".
- **1.50:** the subline appears (Open Sans 600 36, y 950), `revealWords`.
- **2.75:** chip 03 stamps at (120, 212).
- **Camera** (`update`): truck translateX 0 → −60 over 0.4–3.4.
- **3.40–4.00: zoom‑through.**
  - World scale 1 → 1.6 with origin at the gap centre (1247, 460). Blur 0 → 18, opacity 1 → 0 (power2.in).
  - HUD texts fade over 3.4–3.7.
  - The black overlay goes 0 → 0.85 over 3.6–4.0.
  - No glitch.
- **Readability:** the headline is readable 1.5–3.4; the subline 1.9–3.4.

**Kit.** `KIT.camera`, `KIT.card({dark:true})`, `KIT.channel`, `KIT.pill`, `KIT.headline`, `KIT.streaks`, `GTR.canvas`, `KIT.count`, `KIT.diagChip`.

**SFX**
- `blip {freq:1200, db:-8}` at 0.25 and 0.50.
- `error {db:-8}` at 0.75.
- `swoosh {up:false}` at 0.80 (tokens fall).
- `impact {size:.6}` at 1.00.
- `tick` at 2.75.
- `whoosh {dur:.5, up:false}` at 3.45.

---

### S4 · `dor-sumiu` · start 12.0 · dur 4.0 · z 13 · pre 0 · post 0  [12–16]

**Purpose.** Pain 04: the gold client who bought every month quietly stops, and nobody notices. Then Act I collapses.

**Contract.**
- **First frame:** the full‑frame `#000c0d` overlay is at 0.85 (matches S3). Chips 01–03 sit in the log.
- **Last frame (16.0):** a torn, red‑strobed frame. **Hard cut to black and silence.**

**On‑screen copy**
- **Card:** see §1.7, dark version.
- **Mini chart:** "Compras por mês", fev mar abr mai jun jul ago set.
- **Alert pill:** "há 4 meses sem comprar".
- **Headline:** `E ninguém *percebeu*.` (116 px; 1223 px wide).
- **Chip:** ERRO 04 · CLIENTE OURO SUMIU.

**Choreography**
- **0.00–0.40:**
  - The overlay goes 0.85 → 0.
  - The card rises (y +40 → 0, blur 10 → 0, opacity 0 → 1).
  - The card is dark glass 760×440, top‑left (580, 180). The avatar is at left, the name, chip and line are to its right, and the chart spans the bottom (600×150).
- **0.25–1.50: bars deflate.**
  - 8 manual divs (not `KIT.bars`), all starting at a uniform height of 3.200.
  - On 8ths (0.25 + i·0.125, i = 0..7) each falls to its real value: 3.200 · 2.700 · 1.900 · 900 · 0 · 0 · 0 · 0.
  - Colour lerps teal `#38cc9c` → amber `#f59e0b` → red `#ef4444` as each bar shrinks.
  - Empty months keep a dashed outline of the expected 3.200 bar: the missing money.
- **1.00:** the headline appears (centred, y 860), `revealWords`, red "percebeu".
- **1.50:**
  - The alert pill snaps onto the card's top‑right corner.
  - The gold ring drains to gray over 1.5–2.3 (grayscale 0 → 1). The Ouro chip fades to 40%.
- **2.00–2.50:** the card recedes (translateZ 0 → −500, opacity → .35).
- **2.50:** chip 04 stamps at (120, 270).
- **3.00:** the headline hides.
- **3.00–3.50: critical failure.**
  - Shake ramps to 22 px (world).
  - The **4 chips detach from the log** and fly to the centre at scale 1.6, stacked with centres at y 402, 494, 586, 678 (x centred; expo.out, stagger .06).
  - Everything else dims to 20%.
  - Chip dots blink on 16ths.
- **3.50–4.00:**
  - Heavy tear, amt 0.4 → 1.
  - Red strobe overlays `rgba(239,68,68,.25)` hit at 3.5, 3.625, 3.75, 3.875.
- **4.00:** end. There is no impact: the drop is withheld.
- **Readability:** the headline is readable 1.5–3.0.

**Kit.** `KIT.card({dark:true})`, `KIT.avatar`, `KIT.pill`, `KIT.headline`, `KIT.camera`, `KIT.glitch`, `KIT.diagChip`.

**SFX**
- Falling `blip {db:-4}` at 0.25, 0.5, 0.75, 1.0, 1.25, 1.5 (freq 1200, 1000, 820, 660, 520, 400).
- `impact {size:.6}` at 1.00.
- `error {db:-6}` at 1.50.
- `heartbeat` at 2.00.
- `tick` at 2.50.
- `glitch {dur:.2}` at 3.00 and 3.25.
- `glitch {dur:.08}` at 3.5, 3.625, 3.75, 3.875 (pan ±.5).
- Nothing after 3.9.

---

### S5 · `ponto-final` · start 16.0 · dur 6.0 · z 30 · pre 0 · post 0  [16–22]

**Purpose.** The turning point: silence, the green dot as a full stop, the GT mark assembled from its parts, the GROWTH TIME RESULTS lockup, and a dive through the logo into the product.

**Contract.**
- **First frame:** solid `#000c0d`. S5 owns a full‑frame backdrop at opacity 1, and `space` is dimmed.
- **Last frame (22.0):**
  - The backdrop is at 0.
  - The mark is rendered on a canvas at ×40 around the gap, with parts at opacity 0.
  - S6's inbox is visible behind (S6 z 20, pre 0.5).

**On‑screen copy**
- `Ponto final no caos` (Russo One 84, 831 px wide). The green dot is its period; do not type a ".".
- Wordmark: `GROWTH TIME` (gray `#9CA3AF`) followed by `RESULTS` (`#15dba8`), Russo One 50, one line.

**Geometry** (constants)
- `GTR.logo({withText:false})`, whose viewBox is `0 20 710 265`, displayed at width 900: `k = 900/710 = 1.2676`.
  - Box top‑left (510, 272). Mark bbox x 548–1369, y 285–593, which is visually centred.
  - The logo's dot lands at **P = (1342, 568)**, r = 21.07·k = **26.7 px**.
  - Hide `parts.dot`. A separate DOM circle is the dot for the whole scene.
- **Text:** measure its width Wt once in `build()`. Place it left‑aligned at `x = 1342 − 19 − Wt` (≈ 492), with baseline y ≈ 578. Measure the ascent with `ctx.measureText().fontBoundingBoxAscent` so the dot sits on the baseline like a period.
- **Gap point:** G = viewBox (472.93, 173.25), which is screen **(1109, 466)**.

**Choreography**
- **0.00–0.50:** black and silence. Only the `fx` grain runs.
- **0.50:** the dot pops at (960, 540): r 11, `#33cc99`, halo `GTR.glow` r 120 at `a .35`. Scale 0 → 1, back.out(3), 0.3 s.
- **0.625–1.125:**
  - The dot glides (960, 540) → P (power3.inOut).
  - The text types left to right (`KIT.type`, no caret, 38 cps), so the sentence arrives at its period.
- **1.125–2.40:** hold. Fully readable for 1.28 s. The group pushes 1 → 1.02.
- **2.00 [18.0]:** the pad enters. A `GTR.glow` teal (r 700, a .22) behind the mark fades in over 2.0–4.0.
- **2.40–2.65:**
  - The letters dissolve: `hideUnits` on chars (stagger .012, y −30, blur 8), plus canvas particles that drift up‑right at 45°.
  - The dot grows r 11 → 26.7.
- **2.50–3.70: the mark assembles around the fixed dot.**
  - Offsets are screen px; divide by k to get SVG `translate`.
  - Each part has a 30%‑opacity trail copy lagging 0.05 s.

| local | part | enters from | ease |
|---|---|---|---|
| 2.500 | g1 | (−420, −420) | expo.out 0.6 s |
| 2.625 | g2 | (−420, +420) | expo.out 0.6 s |
| 2.750 | t | (0, −520) | expo.out 0.6 s |
| 2.875 | arrow | (−600, +600) | overshoot to (+18, −18) then back.out(2), 0.7 s |
| 3.000 | stem | (−260, +260) | expo.out 0.6 s |

- **3.50–3.95:** "GROWTH TIME" rises under the mark (line centre y 690). Letters stagger .03, and tracking collapses .9em → .34em.
- **3.75–4.05:** "RESULTS" wipes in left to right (`clip-path inset`). The whole line is centred at x 960.
- **4.00 [20.0, bar]: LOCK.**
  - The group scale snaps 1.04 → 1 (0.25 s, back.out).
  - `KIT.pulse` (r 260) fires from P.
  - A 45° white sheen band sweeps across mark and wordmark over 4.0–4.5. Build it as a white rect rotated 45° inside an SVG `clipPath` made of copies of the 5 part paths, opacity .55.
  - The global teal flash fires. The section places the impact.
- **4.05–5.40:** hold. The lockup is fully readable 4.05–5.4 (1.35 s).
- **5.40–5.60:** the wordmark drops (y +40, blur 6, fade).
- **5.50–6.00: GATE DIVE.**
  - At 5.5, swap the SVG for a canvas that draws `new Path2D(GTR.LOGO_PATHS[k])` plus the dot, with `ctx.setTransform`. This stays cheap and crisp at any scale.
  - Let `e = expo.in(inv(local, 5.5, 6.0))`:
    - G's screen position goes `lerp((1109,466), (960,540), e)`.
    - Scale = k·lerp(1, 40, e).
    - rotateZ = −12°·e.
  - The backdrop opacity goes 1 → 0 over 5.5–5.9, revealing `space` (aurora up) and S6's window.
  - The parts' opacity goes 1 → 0 over 5.8–6.0.

**Kit.** `GTR.logo`, `KIT.pulse`, `KIT.type`, `KIT.hideUnits`, `GTR.glow`, `GTR.canvas`.

**SFX**
- `ping {db:-4}` at 0.50 (the first sound after the cut).
- `type {dur:.5, rate:36, db:-8}` at 0.625.
- `shimmer {db:-6}` at 2.00.
- `swoosh` at 2.5, 2.625 and 2.75 (pan −.6, −.3, 0).
- `whoosh {dur:.35, up:true, pan:.3}` at 2.875.
- `swoosh {pan:.6}` at 3.0.
- `swell {dur:1.2}` at 2.80.
- `blip {freq:1600}` at 3.50 and `blip {freq:2000}` at 3.75.
- `ping {freq:1760}` and `shimmer` at 4.00.
- `whoosh {dur:.6, up:true}` at 5.40.

---

### S6 · `fix-ia` · start 22.0 · dur 8.0 · z 20 · pre 0.5 · post 0  [21.5–30] · THE DROP

**Purpose.** Fix 01. It covers three differentiators:
- One inbox for WhatsApp, Instagram and Messenger.
- API Oficial and Coexistência seeded in the header.
- An AI that answers at 23:47, with the store closed, in seconds, and closes the order.

It also plants the `Vendas 1 · 4321` chip.

**Contract.**
- **First visible frame (21.5):** the window small and dim behind the S5 dive.
- **Last frame (30.0):** a full‑frame hand‑off plate `#efeae2` with `background-image: radial-gradient(rgba(0,0,0,.035) 1.2px, transparent 1.2px); background-size: 22px 22px; background-position: 0 0`.

**On‑screen copy**
- **Chip:** ERRO 01 · SEM RESPOSTA → `01 · RESPONDIDO`.
- **Night badge (HUD):** lucide `moon`, "23:47", and a pill "Fora do expediente".
- **List header:**
  - "Todas instâncias · 6 conectados" (smartphone icon).
  - Micro‑pills "API Oficial" (badge‑check) and "Coexistência" (arrow‑right‑left).
  - Title "Conversas".
  - Segmented control `Todos | Não lidos | Leads | Clientes`.
- **Rows** (final order, top to bottom):

| # | contact | channel | last message | red timer |
|---|---|---|---|---|
| 1 | Patrícia Modas | WA | Oi! Vi o anúncio da coleção verão | 13 min · badge "Lead" |
| 2 | lojinha.da.bia | IG | Quanto fica a grade de 6? | 47 min |
| 3 | Revenda Bella | Messenger | Qual o mínimo do atacado? | 2 h |
| 4 | (85) 9 ••••-3344 | WA | Oi, tem grade? | 5 h |
| 5 | (21) 9 ••••-2208 | WA | Faz entrega em SP? | 1 dia |

- **Chat:**
  - Header: "Patrícia Modas" with a chip "Vendas 1 · 4321".
  - Toolbar: toggle "IA · Atuar sozinha".
  - Incoming (tag: megaphone + "Veio do anúncio"): "Oi! Vi o anúncio da coleção verão. Tem a grade do vestido midi?" (23:47).
  - Typing label: "IA digitando…" (bot icon).
  - Stopwatch: `0,0 s` → `4,0 s`.
  - AI reply (tag: bot + "IA"): "Tem sim! Grade P ao GG, 6 peças, R$ 389 a grade. Monto com as 3 cores? <span class="emoji">😊</span>"
  - Stamp: "Respondido pela IA em 4s" (zap icon).
  - Incoming: "Fechei! Manda as 3 cores <span class="emoji">🙌</span>" (23:48).
  - Row label: "Pedido fechado pela IA" (trophy icon).
- **Headline A:** `3 canais.\n*1 caixa.*` (100 px).
- **Pills:** WhatsApp · Instagram · Messenger.
- **Headline B:** `IA responde\nem *segundos*.` (88 px; 614 px wide).
- **Subline:** `Até com a loja fechada.`

**Layout**
- **Window:** `KIT.camera({perspective:1600})` contains `KIT.appWindow({x:800, y:150, w:1000, h:800, active:'Mensagens'})`.
- **Sidebar collapsed:** `side.style.width='72px'`, hide the label spans and brand text. This matches the real collapsed sidebar.
  - Content is 928×756: list 340 | chat 588.
  - Chat: header 64 px, toolbar 40 px (`#f4f6f5`) holding the stopwatch pill on the left and the AI toggle on the right, then the thread.
- **HUD left column** (x 120, width 660):
  - Chip at (120, 96).
  - Night badge row centred at y 200: moon 30 px, "23:47" Russo One 56, pill Inter 600 16 on `rgba(255,255,255,.08)` with an orange CSS dot `#f97316`.
  - Headlines: block centre y 470.
  - Pills and subline: y 640.
  - A radial scrim behind the column.

**Choreography**
- **Camera** (`update`, piecewise):
  - **−0.5 → 0:** s .62 → .86, rx 20° → 14°, ry −18° → −12°, world opacity .5 → 1.
  - **0 → 1.2:** rx 14 → 4, ry −12 → −6, s .86 → 1 (power3.out).
  - **1.2 → 7.0:** ry −6 → −3, s 1 → 1.04 (sine.inOut).
  - **7.0 → 8.0:** portal (below).
- **0.00 [22.0, drop, white flash]:** settle begins.
- **0.25:** chip 01 stamps **red** at (120, 96).
- **0.20–1.00:** three `KIT.channel` badges (wa, ig, fb at 96 px) streak in from the left, the top and the bottom.
  - They converge on the list header at ≈ (1042, 234) and shrink to 20 px.
  - They land at 0.5 / 0.75 / 1.0, each with a teal `KIT.pulse` (r 60).
- **0.60–1.60: rows arrive bottom‑up.**
  - Row 5 at 0.60, 4 at 0.85, 3 at 1.10, 2 at 1.35, 1 at 1.60.
  - Each new row drops in at the top (height 0 → 76, y −12 → 0, back.out) and pushes the others down.
  - Avatars are 44 px, with an 18 px channel mini‑badge on the corner and ❄️ in an `.emoji` span.
  - The red timer pill sits on the right (bg `#fef2f2`, text `#dc2626`).
- **1.00:** Headline A, `revealWords`.
- **1.75:** pills (lucide `message-circle` / `instagram` / `facebook`), stagger .1.
- **2.00:** the "API Oficial" and "Coexistência" micro‑pills pop in the list header. This sets up S7.
- **2.25:** row 1 is selected (3 px teal left border, bg `#f0fdf8`). The chat header populates.
- **2.50:** the incoming bubble pops. The night badge appears.
- **2.75:** a 2 px teal underline draws under "4321" in the header chip (0.25 s). This is the plant.
- **3.00:** the toggle switches on (the knob slides 0.2 s; the track goes `#d4d4d4` → `#38cc9c`).
- **3.00–4.30:**
  - `KIT.typing('out')` runs, with the label above it.
  - The stopwatch pill (bg `#0b2b29`, text `#15dba8`, lucide `timer`) shows `fmt.dec(map(local,3.0,4.3,0,4,'none'),1)+' s'`.
- **3.75:** Headline A and the pills hide.
- **4.30:**
  - The AI reply bubble pops (blue ticks). `KIT.pulse` teal (r 220) fires around it.
  - **The chip flips** to `01 · RESPONDIDO`. It was red for 4.05 s.
- **4.45:** the stamp snaps onto the bubble's top‑left corner (scale 1.3 → 1, rotate −4° → 0, back.out(1.6)). Solid pill: bg `#15dba8`, text `#0b2b29`, Inter 800 16.
- **4.50:** Headline B, `revealWords`. It is readable 5.0–7.0.
- **5.25:** the subline appears. It is readable 5.6–7.0.
- **5.75:** the incoming "Fechei!…" bubble pops.
- **6.00–6.625:** rows resolve on 16ths, top to bottom.
  - Each timer flips (rotateX) to a teal pill "IA · agora" (bot icon), and the counters clear.
  - Row 1: ❄️ → 🔥, and its badge goes "Lead" → "Qualificado" (solid `#38cc9c`).
- **6.25:** a gold ring appears on row 1 (inset 2 px `#f3b315` plus glow) with the micro‑label "Pedido fechado pela IA" (trophy icon, `#a16207` on `#fef3c7`, Inter 700 12).
- **7.00–8.00: Coexistência portal.**
  - 7.0–7.3: HUD texts and the night badge exit. The chip fades over 7.5–7.8.
  - 7.0–7.4: the chat column background tweens `#fafafa` → `#efeae2` and gains the WhatsApp dot pattern.
  - 7.2–8.0: the camera scales about W ≈ **(1506, 360)**, an empty wallpaper area between the toolbar and the first bubble. Scale 1.04 → 9 (expo.in); rotations → 0 by 7.6.
  - 7.85–8.0: the hand‑off plate fades 0 → 1 on top.

**Kit.** `KIT.camera`, `KIT.appWindow`, `KIT.channel`, `KIT.avatar`, `KIT.pill`, `KIT.bubble`, `KIT.typing`, `KIT.pulse`, `KIT.headline`, `KIT.diagChip`.

**SFX** (no impact at 0: the section places it)
- `tick {db:-6}` at 0.25.
- `swoosh` at 0.5, 0.75, 1.0 (pan −.5, 0, .5).
- `notify {db:-8}` at 0.6, 0.85, 1.1, 1.35, 1.6.
- `pop {db:-8}` at 2.0.
- `notify` at 2.50.
- `blip {freq:1800, db:-6}` at 2.75.
- `pop` at 3.00.
- `type {dur:1.2, rate:10, db:-12}` at 3.00.
- `ping {freq:1760}` and `blip {freq:2000}` at 4.30.
- `shimmer` at 4.45.
- `notify {db:-6}` at 5.75.
- `pop {db:-6}` at 6.0, 6.125, 6.25, 6.375, 6.5 (pan L to R).
- `shimmer {db:-6}` at 6.25.
- `whoosh {dur:.9, up:true}` at 7.10.

---

### S7 · `fix-oficial` · start 30.0 · dur 6.0 · z 21 · pre 0 · post 0  [30–36]

**Purpose.** Fix 02. The same conversation lives on the phone app **and** the API: Coexistência on the official Meta Cloud API, with a health check every 30 minutes. Never imply bans become impossible.

**Contract.**
- **First frame:** the full‑frame `#efeae2` dotted plate (identical to S6's last frame).
- **Last frame:** the dark stage, streaks fading, and one bright teal horizontal line, 3 px with glow, **spanning the full width at y 460**.

**On‑screen copy**
- **Chip:** ERRO 02 · NÚMERO BANIDO → `02 · API OFICIAL`.
- **Phone:**
  - App bar "WhatsApp Business" with a pill "Conectado" (`#25d366`, white).
  - Chat "Patrícia Modas / online" with the same 3 bubbles as S6 (AI tag included).
- **Bridge pill:** `Coexistência · App + Cloud` (arrow‑right‑left icon).
- **Cloud card:**
  - Title `Cloud API · Oficial Meta` (shield‑check icon).
  - Lines, each with a circle‑check icon: `Templates aprovados` · `Janela de 24h sob controle` · `Mais estável`.
- **Health strip:** `Saúde do número · checada a cada 30 min` (activity icon), with a pill `ok` (blinking CSS green dot).
- **Headline:** `API *Oficial*\nda Meta.` (100 px).
- **Subline:** `O app e a API, juntos.`

**Layout** (world, `KIT.camera` perspective 1500)
- **Phone:** `KIT.phone({x:480, y:560, w:380})`, flat until 0.6.
  - Its screen rect is **(302, 175, 355×771), radius 46**, from `(x+(14−215)k, y+(14−450)k)` with `k = 380/430`.
- **Headline:** HUD, x 900, left, block centre y 300.
- **Subline:** x 900, y 440.
- **Cloud card:** dark glass, top‑left (1000, 520), 520×240.
- **Bridge:** `KIT.connector` from (680, 600) to (1000, 640), curve .5, 4 px `#15dba8` with a drop‑shadow glow. The pill sits at the midpoint (≈ 840, 585).
- **Health strip:** dark glass, top‑left (1000, 790), 700×96. The ECG canvas is 380×60 inside it.

**Choreography**
- **0.00–0.60:** the plate morphs its left/top/width/height/border‑radius from full frame into the phone screen rect (power3.inOut).
  - The phone frame fades in around it over 0.3–0.6.
  - The plate fades over 0.45–0.6, revealing the chat on the same wallpaper.
- **0.25:** chip 02 stamps red.
- **0.60–1.20:**
  - The phone goes rotateY 0 → 14°.
  - The cloud card enters from x +500 with rotateY −40° → −12°, opacity 0 → 1 (power3.out).
- **1.00:** the headline appears, `revealWords`. Readable 1.5–5.0.
- **1.20–1.60:** the bridge draws.
- **1.50:** **the chip flips** to `02 · API OFICIAL`. It was red for 1.25 s.
- **1.60:** the Coexistência pill pops. From then on the bridge carries packets: 4 dots each way, `q = fract((local − k·0.125)/0.5)`, teal outbound and white inbound.
- **2.00:** the subline appears. Readable 2.4–5.0.
- **2.50 / 2.75 / 3.00:** the card lines pop in (Inter 600 20).
- **3.00–5.60:**
  - The ECG scrolls left at 240 px/s, with spikes on every beat (global multiples of 0.5).
  - The "ok" dot blinks on beats.
- **Camera** (`update`): world ry −6° → +4°, s 1 → 1.06 over 1.2–5.2 (sine.inOut).
- **5.00–6.00: light‑speed exit.**
  - Packets speed up ×6.
  - `KIT.streaks` (dir 1) alpha 0 → .9.
  - HUD texts exit over 5.0–5.3.
  - The world goes blur 0 → 10 and `brightness` 1 → 1.8 over 5.4–5.9.
  - Over 5.85–6.0 the streaks converge vertically into the single line at y 460.

**Kit.** `KIT.camera`, `KIT.phone`, `KIT.waChat`, `KIT.bubble`, `KIT.card({dark:true})`, `KIT.connector`, `KIT.pill`, `KIT.streaks`, `KIT.headline`, `KIT.diagChip`, `GTR.canvas`.

**SFX**
- `whoosh {dur:.6, up:false}` at 0.00.
- `tick {db:-6}` at 0.25.
- `swoosh` at 0.60.
- `pop` and `blip {freq:2000}` at 1.50.
- `shimmer` at 1.60.
- `pop` at 2.5, 2.75, 3.0.
- `blip {freq:1000, db:-12}` at 3.5 and 4.5.
- `whoosh {dur:.9, up:true}` at 5.00.
- The section's swellOut covers the cut.

---

### S8 · `fix-rastreio` · start 36.0 · dur 8.0 · z 22 · pre 0 · post 0  [36–44]

**Purpose.** Fix 03. The S3 pipeline is healed: Clique → Conversa → Venda. The sale **rewinds** to the creative that caused it, and the chip's 4 digits lock real ROAS per creative.

**Contract.**
- **First frame:** the teal line at y 460 across the full width (teal flash, global).
- **Last frame:** the empty dark stage.

**On‑screen copy**
- **Chip:** ERRO 03 · SEM RASTREIO → `03 · RASTREADO`.
- **Campaign label:** mono `[MF · 4321] Coleção Verão · Carrossel` (`ui-monospace` 18, `#cbd5d1` on a dark glass pill).
- **Ad card** (light):
  - Front: "modafashion · Patrocinado", image "COLEÇÃO VERÃO", CTA "Enviar mensagem" (message‑circle).
  - Back: "ROAS", **"5,6x"**, "Invest. R$ 8.200 · Leads 720", "Compra enviada à Meta" (send icon).
- **Conversation card:** avatar PM, "Patrícia Modas", chip `Vendas 1 · 4321`, bubble "Oi! Vi o anúncio da coleção verão", tag "Anúncio" (megaphone).
- **Sale card:** "Pedido fechado" (circle‑check), "Vestido midi · 3 grades", **"R$ 1.167"**.
- **Eyebrows:** `01 · CLIQUE` · `02 · CONVERSA` · `03 · VENDA`.
- **HUD:** "rastreando a origem…" (history icon).
- **Match badge:** "=".
- **Headline A:** `Cada real, *rastreado*.` (104 px).
- **Headline B:** `ROAS real, *não estimado*.` (100 px; 1278 px wide, one line).
- **Caption:** `4 dígitos ligam anúncio e número.`
- **Top 3 card:** "Top 3 Criativos" (trophy), rows as in §1.8. Row #1 has an amber border and 🥇.

**Layout** (world; same positions as S3)
- **Ad card:** light 340×420 at top‑left (180, 250). The campaign label sits at (180, 205).
- **Conversation card:** light 360×200 at top‑left (780, 360).
- **Sale card:** light 320×200 at top‑left (1480, 360).
- **Connectors:** solid `#15dba8` 3 px, (520, 460) → (780, 460) and (1140, 460) → (1480, 460).
- **Eyebrows:** at y 700, centred under each node (x 350 / 960 / 1640).
- **Headlines:** HUD, centred at y 900, over a bottom scrim band.

**Choreography**
- **0.00–0.40:** the y‑460 line contracts into the two connector segments. Nodes pop at 0.00 / 0.25 / 0.50 (back.out).
- **0.25:** chip 03 stamps red.
- **0.50–0.90:** `KIT.cursor` glides from (1200, 900) to the CTA at (350, 640) and **clicks at 0.90**. Eyebrow 01 appears.
- **1.00–1.50:** a glowing teal token with a trail runs connector 1. The conversation card gets a teal ring. The bubble and eyebrow 02 appear at 1.50.
- **1.00:** Headline A appears. Readable 1.5–3.5.
- **1.50–2.00:** the token runs connector 2.
- **1.90–2.30:** the sale card shows "Pedido fechado", and the value counts R$ 0 → R$ 1.167 (`fmt.brl`). Eyebrow 03 appears at 2.0.
- **2.50–3.40: REWIND.**
  - The HUD pill appears top‑right (right edge x 1800, y 120; Inter 600 18 teal). `KIT.type` over 2.5–2.8. It gets a 0.1 s `KIT.glitch` on the pill only.
  - A money token (teal and gold particles) runs **back**: segment 2 over 2.5–2.95, then segment 1 over 2.95–3.4. Use `connector.set(1, 1−q)`, with 3 ghost echoes lagging .04 / .08 / .12 at alpha .5 / .3 / .15.
- **3.00–3.40:** the ad card flips rotateY 0 → 180° (power2.inOut) to its back face.
- **3.50:**
  - "5,6x" stamps (Russo One 110, gradient text `#27ae8f → #15dba8`, scale 1.15 → 1).
  - **The chip flips** to `03 · RASTREADO`. It was red for 3.25 s.
  - Headline A hides.
- **3.50–4.10:** the camera pushes s 1 → 1.3 so the campaign label and the conversation chip are both large in frame.
- **3.80–4.75: the 4 digits.**
  - The "4321" in the conversation chip glows.
  - Four glyph clones (Russo One 40, `#15dba8`) lift off at 3.8 and arc on beziers (apex −120 px) into the campaign label's "4321", landing at 4.125 / 4.25 / 4.375 / 4.5.
  - Each landed digit brightens. Both strings get 2 px teal outline boxes (radius 6, glow).
  - Over 4.5–4.75 a thin teal laser line draws between the boxes, and an "=" badge (24 px teal circle, Inter 800) pops at its midpoint.
- **4.00:** Headline B appears. Readable 4.5–7.5.
- **4.75:** the caption appears (Open Sans 600 30, y 790). Readable 5.1–7.5.
- **5.50–6.20:** pull‑back. World s 1.3 → 0.55, translateY −250. The pipeline becomes a strip at y ≈ 80–380.
- **5.75 / 6.00 / 6.25: Top 3 Criativos.**
  - A light card, 900×300, top‑left (510, 420). Its rows cascade in.
  - Each row has a 64 px gradient thumbnail with a play icon, the name, and a ROAS bar with width ∝ value.
- **7.50–8.00:** everything drifts up 60 px and fades out.

**Kit.** `KIT.camera`, `KIT.card`, `KIT.connector`, `KIT.cursor`, `KIT.count`, `KIT.type`, `KIT.headline`, `KIT.pill`, `KIT.diagChip`, SVG for boxes and laser.

**SFX**
- `whoosh {dur:.4}` at 0.00.
- `blip {db:-6}` at 0 / .25 / .5 (freq 1200 / 1500 / 1800).
- `tick {db:-6}` at 0.25.
- `pop` at 0.90.
- `swoosh {pan:-.4}` at 1.00.
- `notify {db:-6}` at 1.50.
- `swoosh {pan:.4}` at 1.50.
- `blip {freq:1600}` at 2.30.
- `type {dur:.3, rate:20, db:-12}` and `whoosh {dur:.9, up:false}` at 2.50.
- `swoosh` at 3.00.
- `impact {size:.6}`, `pop` and `blip {freq:2000}` at 3.50.
- `tick` at 4.125, 4.25, 4.375, 4.5.
- `ping {freq:1760}` at 4.50.
- `blip` at 5.75 / 6.0 / 6.25 (freq 900 / 1100 / 1300).
- `whoosh {dur:.5, up:true}` at 7.50.

---

### S9 · `fix-guto` · start 44.0 · dur 8.0 · z 23 · pre 0 · post 0  [44–52]

**Purpose.** Fix 04. Guto, the analytics copilot, finds the vanished gold client and **proves** every number against the database.

**Contract.**
- **First frame:** the dark stage; the Guto button is below frame.
- **Last frame:** the stage dimmed to about 70% black. The Guto button (56 px, `linear-gradient(135deg,#38cc9c,#2b9d78)`, white `sparkles`, red dot) is centred at **(1758, 958)**.

**On‑screen copy**
- **Chip:** ERRO 04 · CLIENTE OURO SUMIU → `04 · CLIENTE NA MIRA`.
- **Panel header:** sparkles in a gradient circle, "Guto", "copiloto de análises".
- **Chips:** `Vou bater minha meta?` · `Quem eu chamo primeiro hoje?` · `Alguma cliente ouro sumiu?`
- **User bubble:** `Alguma cliente ouro sumiu?`
- **Loading line:** `Interrogando os números (eles sempre confessam)…`
- **Answer:** `Sim. A **Revenda Bella** (Ouro) está há **4 meses** sem comprar. Ticket médio: **R$ 2.340**.`
- **Client card:** §1.7, light version.
- **Next step** (arrow‑right icon): `Próximo passo: chamar hoje com a coleção nova.`
- **Source eyebrow:** `FONTES · SUA BASE` (database icon).
- **Source cards** (mono tool chip above each):

| tool chip | card content |
|---|---|
| `buscar_cliente()` | "Revenda Bella · Status: Ouro" |
| `vendas_por_mes()` | "Última compra: maio/2026" |
| `top_clientes()` | "Ticket médio: R$ 2.340" |

- **Badge** (shield‑check): `Cada número conferido na sua base`.
- **Footer:** `O Guto responde com base nos números desta tela.`
- **Headline A:** `Pergunte\nao *Guto*.` (100 px).
- **Headline B:** `Ele não\ninventa\n*número*.` (92 px).

**Layout**
- **Headlines:** HUD, x 120, width 540, block centre y 440, left.
- **Guto panel:** light card, top‑left (700, 130), 680×820, radius 20.
  - Header 72 px; thread; footer with input "Pergunte sobre seus números…" and the footer line (Inter 400 13 `#737373`).
- **Source column:** eyebrow at (1440, 250). Dark glass cards 360×130 at top‑left (1440, 300 / 470 / 640). Mono chips (`ui-monospace` 14, `#15dba8` on `rgba(21,219,168,.1)`) sit 34 px above each card.
- **Beams:** a canvas overlay, full frame.

**Choreography**
- **0.00–0.30:** the Guto button (90 px) rises from (1760, 1180) to centre (1700, 960) with back.out. Idle `KIT.pulse`.
- **0.10:** chip 04 stamps red at (120, 96).
- **0.30–0.90:** **the button morphs into the panel.** One div animates left/top/width/height/radius from the button rect (1655, 915, 90, 90, r 45) to the panel rect (expo.out). Content fades in from 0.7.
- **0.50:** Headline A, `revealWords`. Readable 1.0–3.6.
- **0.90 / 1.00 / 1.10:** the chips pop (outlined pills, bg `#ecfdf5`, text `#27ae8f`, Inter 600 16).
- **1.20–1.40:** the cursor glides to chip 3 and **clicks at 1.40**.
- **1.40–1.60:** the chip flies into the right‑aligned user bubble (bg `#38cc9c`, white).
- **1.60–2.00:**
  - The loading row shows a rotating sparkles icon and the shimmer text: gradient text sweep with `background-position` driven by local.
  - The source cards appear dim, each with a scanning teal line, at 1.60 / 1.75 / 1.90.
- **2.00 [46.0, drums return, teal flash]:**
  - **The chip flips** to `04 · CLIENTE NA MIRA`. It was red for 1.9 s.
  - The answer types into the Guto bubble (`#f5f5f5`, Inter 500 21) over 2.0–3.0. Build it from spans and reveal characters progressively so the bold spans (`#0b2b29`, 700) survive.
  - The source cards turn solid.
- **3.00:** the client card pops under the answer (the S4 callback).
  - The avatar starts gray and re‑golds over 3.2–3.8 (grayscale 1 → 0, ring glow up).
  - The WhatsApp button gets a sheen at 3.6.
- **3.40:** the next‑step line appears (Inter 600 17, `#27ae8f`).
- **3.60:** Headline A hides. **4.00:** Headline B appears. Readable 4.5–7.0.
- **4.00 / 4.25 / 4.50: verification.**
  - Teal corner brackets draw around "Revenda Bella (Ouro)", then "4 meses", then "R$ 2.340".
  - From each bracket, a teal 2 px canvas bezier with a travelling packet runs to the matching source card.
  - On arrival (+0.2 s) that card's value flashes and a `circle-check` stamp lands on it.
- **5.00:** the badge snaps in above the footer. **5.40:** the footer line brightens briefly.
- **5.0–7.0:** parallax. Headlines x +10 → −10; panel −6 → +6.
- **7.00–7.80:**
  - The reverse morph returns the panel to the 56 px button at (1758, 958).
  - Headline B, the source cards and the brackets fade over 7.0–7.3.
  - The chip fades over 7.5–7.8.
  - A dim overlay goes 0 → .7 over 7.3–7.9.

**Kit.** `KIT.card`, `KIT.pill`, `KIT.cursor`, `KIT.avatar`, `KIT.pulse`, `KIT.headline`, `KIT.diagChip`, `GTR.canvas`, SVG brackets.

**SFX** (no impact at 2.0: the section's impactIn plays there)
- `pop {db:-6}` at 0.00.
- `tick {db:-6}` at 0.10.
- `whoosh {dur:.5}` at 0.30.
- `pop {db:-8}` at 0.9, 1.0, 1.1.
- `pop` at 1.40.
- `shimmer {db:-8}` at 1.60.
- `blip {db:-10}` at 1.6 / 1.75 / 1.9 (freq 1300 / 1500 / 1700).
- `blip {freq:2000}` and `pop` at 2.00.
- `type {dur:1.0, rate:22, db:-6}` at 2.00.
- `pop` at 3.00.
- `shimmer` at 3.20.
- `blip` at 4.0 / 4.25 / 4.5 (freq 2000 / 2200 / 2400).
- `ping` at 5.00.
- `swoosh {up:false}` at 7.00.

---

### S10 · `dashboard-funil` · start 52.0 · dur 6.0 · z 24 · pre 0 · post 0  [52–58] · PEAK

**Purpose.** The whole funnel on one screen, from the first message to money in the till.

**Contract.**
- **First frame:** a white flash (global). The window is tilted back (rx 32°) with the Guto button at its bottom‑right.
- **Last frame:** solid black (overlay 1.0).

**On‑screen copy**
- **Top bar:** search "Buscar consultora, registro...", button `TV` (monitor‑play, dark pill), bell, avatar "MA · Marina Alves · Admin".
- **Header:** `Dashboard` / `Funil de vendas e métricas de desempenho`, chip `Últimos 30 dias`.
- **KPIs:** as §1.8, using the mock tints:
  - Clientes Novos: emerald `#ecfdf5` / `#059669`.
  - Valor Total de Vendas: purple `#faf5ff` / `#9333ea`.
  - Ticket Médio: blue `#eff6ff` / `#2563eb`.
  - CPA: slate `#f8fafc` / `#475569`.
  - Arrows are lucide `trending-up` / `trending-down` icons.
- **Funnel:** `Funil de Vendas`, subtitle `Jornada: Mensagens › Qualificação › Pedidos › Vendas`.

| block | value | gradient |
|---|---|---|
| Mensagens Recebidas | 12.480 | cyan `#06b6d4→#0e7490` |
| Leads Qualificados | 1.850 | emerald `#10b981→#047857` |
| Pedidos Totais | 312 | amber `#f59e0b→#d97706` |
| Custo por Pedido | R$ 79,49 | orange `#f97316→#ea580c` |
| Valor Total de Vendas | R$ 620.000,00 | purple `#a855f7→#7e22ce`, 96 px tall |

- **Chart:** `Evolução de Vendas` · `Últimos 7 dias` (`KIT.lineChart`, stroke `#3fc58f`).
- **Headline:** `Da mensagem\nao *caixa*.` (110 px).

**Layout**
- `KIT.appWindow({x:110, y:70, w:1700, h:940, active:'Dashboard'})`, full sidebar. Content spans x 358–1810, y 114–1010.
- **Top bar:** 64 px, y 114–178. TV button centre (1600, 146), 80×40, bg `#121212`, white icon and "TV".
- **Page header:** at (390, 205).
- **KPI row:** y 280–410, four cards 330×130 at x 390 / 736 / 1082 / 1428.
- **Funnel card:** x 390–1150, y 430–990. Blocks 700 wide, 84 tall, gap 10, from y 520. **Purple block centre ≈ (760, 944).**
- **Chart card:** x 1166–1790, y 430–990 (chart 560×300).
- **Guto button:** (1758, 958), 56 px, red dot.

**Choreography** (camera in `update`; the world's transform‑origin is 960 540, so `screen = 960 + (p−960)·s + x`)
- **0.00–1.20: crane down.** World rx 32° → 3°, y +180 → 0, s .8 → 1 (power3.out).
- **0.25 / 0.50 / 0.75 / 1.00:** KPI cards pop (y 24 → 0, scale .96 → 1).
  - Counters run 0.3–1.8 (power2.out, pt‑BR).
  - On lock, the number pops 1.1 → 1.
- **1.25 / 1.50 / 1.75 / 2.00 / 2.25:** funnel blocks cascade (x −40 → 0, scaleX .6 → 1). Each value counts up within 0.5 s.
- **1.50–3.00:** the line chart draws.
- **2.50–3.20:** camera to `{x:380, y:−647, s:1.7}`, which puts the purple block at screen ≈ (1000, 580) (power3.inOut). The purple block gets a glow and a sheen at 3.0.
- **3.00:** the headline appears (HUD, x 120, left, block centre y 250) with a top‑left scrim. Readable 3.5–5.2, then it hides.
- **4.50–5.00:** camera to `{x:−640·s, y:394·s, s:1.35}`, which centres the TV button (power3.inOut). `KIT.cursor` enters and **clicks at 5.00**.
- **5.00–6.00:**
  - s 1.35 → 24 (expo.in), keeping `x = −640·s, y = 394·s`, so the dark TV tile swallows the frame.
  - A full‑frame black overlay goes 0 → 1 over 5.6–6.0.

**Kit.** `KIT.camera`, `KIT.appWindow`, `KIT.kpi`, `KIT.card`, `KIT.lineChart`, `KIT.count`, `KIT.cursor`, `KIT.headline`.

**SFX** (no impact at 0)
- `whoosh {dur:.5, up:false}` at 0.00.
- `pop {db:-6}` at 0.25, 0.5, 0.75, 1.0.
- `blip` at 1.25–2.25 (freq 700 / 880 / 1040 / 1240 / 1480).
- `whoosh {dur:.5, up:true}` at 2.50.
- `impact {size:.6}` at 3.00.
- `pop` at 5.00.
- `whoosh {dur:.6, up:true}` at 5.20.

---

### S11 · `modo-tv` · start 58.0 · dur 8.0 · z 25 · pre 0 · post 0  [58–66] · PARABÉNS

**Purpose.** Modo TV. Every sale rings cha‑ching, Bronze/Prata/Ouro tiers are crossed on screen, Ana hits Ouro, and PARABÉNS fires with confetti on the gold flash.

**Contract.**
- **First frame:** solid black (S11's own full‑frame black plate).
- **Last frame:** the empty dark stage (the TV has tilted out).

**On‑screen copy**
- **Header:** `Moda Fashion` · `· Metas de Setembro de 2026`, pill `ao vivo · 6 vendedoras` (pulsing CSS dot), clock `15:42:07` (+ floor(local)), volume‑2 icon, `Sair` (x icon).
- **Team strip** (`#f7f8f8`, 3 columns):
  - **META DO MÊS · EQUIPE** (target icon): `R$ 620.000` / `R$ 700.000`, `89%`, tier bar, legend `Bronze 500 mil · Prata 600 mil · Ouro 700 mil · faltam 80 mil`. Value, % and "faltam" update live.
  - **HOJE & SEMANA:** Hoje `R$ 34.900` de R$ 35.000 and Semana `R$ 186.200` de R$ 175.000, both `+ Σ sales so far`.
  - **PROJEÇÃO DO MÊS:** `R$ 714.000 · 102%`, static.
- **Seller cards** (3×2):

| # | seller | month / goal | % | tier marks |
|---|---|---|---|---|
| 1 | Ana Silva (crown) | R$ 176.000 / 180 mil | 98% | .722 / .889 / 1 (130/160/180 mil) |
| 2 | Marina Alves | R$ 198.000 / 210 mil | 94% | .7 / .85 / 1 |
| 3 | Júlia Costa | R$ 142.000 / 160 mil | 89% | .7 / .85 / 1 |
| 4 | Carla Mendes | R$ 79.000 / 110 mil | 72% | .7 / .85 / 1 |
| 5 | Paula Ribeiro | R$ 86.000 / 120 mil | 72% | .7 / .85 / 1 |
| 6 | Bia Ramos | R$ 104.000 / 150 mil | 69% | .7 / .85 / 1 (Bronze = 105 mil) |

- **Toasts:** real app style. `VENDA REALIZADA` (sparkles icon), value, seller.
- **Celebration:**
  - `PARABÉNS!`
  - `Ana Silva bateu a meta do *MÊS!*` ("MÊS!" in gradient text `#fcd34d → #fde68a → #fb923c`).
  - Pill: `<span class="emoji">🎉</span> Seguindo em frente! <span class="emoji">🎉</span>`
- **Card strip:** `<span class="emoji">🏆</span> PARABÉNS! META DO MÊS BATIDA!` (`#fbbf24 → #f97316`).
- **Lower third A:** `Cada venda *toca*.` (84 px).
- **Lower third B:** `Bronze, Prata, *Ouro*.` (84 px). "Ouro" is `#f3b315` with a gold glow.

**Layout**
- **TV:** inside `KIT.camera({perspective:1600})`. Bezel 10 px `#1a1a1a`, radius 12, shadow `0 30px 80px rgba(0,0,0,.5)`, box (150, 80, 1620×920).
  - The screen is at (160, 90). The UI is built at a logical 1280×720 in a div scaled ×1.25.
  - Logical layout: header 0–56, strip 64–204, grid 212–712. Cards 405×244, gap 12, at x 16 / 433 / 850, y 212 / 468.
  - Ana's card maps to stage (180, 355)–(686, 660), centre **(433, 507)**.
- **Toast stack:** bottom‑**right** of the TV screen (right edge at stage x 1735, bottom at y 970), max 4, newest at the bottom, older ones rising.
  - Style: `linear-gradient(#e7faf3, #bdf0d6)`, 1 px teal border, glow, value Inter 800 28.
  - (The real app stacks bottom‑left; we mirror it so the lower third stays clear.)
- **Lower third:** HUD dark glass band `rgba(0,21,22,.82)` with `backdrop-filter: blur(10px)`, x 0–1240, y 860–990. Headline at x 120. The medals sit at x 1010 / 1066 / 1122.

**Choreography**
- **0.00–0.30: power‑on.**
  - A white line at the screen centre: scaleX 0 → 1 (0–0.12), then the screen opens scaleY .004 → 1 (0.12–0.30) with a bloom.
  - The black plate fades over 0.2–0.6, revealing the bezel and `space`.
  - Camera s .92 → 1.0 over 0–2.75.
- **Each sale:**
  - A toast pops (scale .7 → 1.04 → 1, rise 30 px, 0.5 s).
  - The seller's card rings `0 0 0 3px #15dba8, 0 0 30px rgba(21,219,168,.55)` for 1.0 s.
  - Their value and % tick up, as do the team strip, Hoje and Semana.

| local | sale | extra |
|---|---|---|
| 0.50 | Júlia · R$ 890 | |
| 1.00 | Paula · R$ 1.180 | |
| 1.50 | Bia · R$ 1.450 | Crosses **Bronze** (105.450/150 mil): her mini bar turns bronze `#bd6b2f→#d98a4f` and a "Bronze" label with a check icon pops |
| 2.00 | Marina · R$ 640 | |
| 3.00 | **Ana · R$ 4.400** | Hero sale, see 3.0 below |

- **1.00:** lower third A slides in (x −1240 → 0, 0.35 s). Readable 1.4–2.75, then it slides out.
- **2.75–3.50:** camera to `{x:1001, y:22, s:1.9}`, which puts Ana's card at about (960, 500) at 961×580 (power3.inOut).
- **3.00:** Ana's sale. Her value counts 176.000 → 180.400 over 3.0–3.9.
  - **3.25:** the Bronze tick pops a check icon.
  - **3.50:** the Prata tick pops a check icon (a roll call of tiers already reached).
  - **3.875:** the fill crosses **Ouro**. Its gradient switches to `#f3b315 → #ffcf3f`, the Ouro tick glows with a check.
  - Her % goes 98 → 100 and her HOJE box shows a check with "bateu!". The team reaches 628.560 · 90% · "faltam 71 mil".
- **4.00 [62.0, bar, gold flash]: PARABÉNS overlay** (HUD, full frame).
  - Scrim `rgba(17,24,39,.72)` (optional blur 6 px if the render budget allows) over 4.0–4.2.
  - A 160 px gold circle `radial-gradient(#fde68a,#f59e0b)` with glow and a white `trophy` icon bounces in 0 → 1.15 → 1 (4.0–4.5).
  - **4.10:** "PARABÉNS!" (Russo One 170, white, gold text‑shadow) with `revealChars` at stagger .03.
  - **4.40:** the "Ana Silva…" line (Inter 800 44). **4.70:** the pill.
  - **Confetti** (full‑frame canvas above the overlay, `KIT.confetti`):
    - Cannons at 4.00: (0, 900) at angle −60°, and (1920, 900) at −120°. Spread .9, n 120 each, power 1700.
    - Centre burst at 4.50: (960, 420), n 80.
    - Colours `#38cc9c #2ba37b #4dd9ac #ffffff #f3b315`. Life 3.5 s.
  - **Readability:** PARABÉNS 4.5–6.0; the line 4.8–6.0.
- **6.00 [bar]:**
  - The overlay fades out over 6.0–6.3.
  - The camera pulls back to s 1.1 over 6.0–6.6.
  - Ana's card strip slides down (6.1).
  - Lower third B slides in. Medal discs (44 px, bronze / prata / ouro gradients) pop at 6.00 / 6.25 / 6.50. Readable 6.4–7.6.
- **7.60–8.00:** tilt out. World rx −12°, y −200, blur 10, opacity → 0. The band slides out left.

**Kit.** `KIT.camera`, `KIT.card`, `KIT.avatar`, `KIT.tierBar({dark:false, labels:false})` (the team bar uses marks `[.714,.857,1]`), `KIT.pill`, `KIT.count`, `KIT.confetti`, `KIT.headline`, `KIT.revealChars`.

**SFX** (no impact at 4.0: the section plays it)
- `blip {freq:600}` and `swoosh` at 0.00.
- `cash` at 0.50.
- `cash {db:-4}` at 1.00 and 1.50.
- `cash {db:-6}` at 2.00.
- `blip {freq:1200}` at 1.50 (Bronze).
- `whoosh {dur:.7, up:true}` at 2.75.
- `cash` at 3.00.
- `blip` at 3.25 / 3.5 / 3.875 (freq 900 / 1200 / 1600).
- `shimmer` at 4.10.
- `pop` at 4.50.
- `pop {db:-6}` at 4.70.
- `swoosh` at 6.00.
- `blip` at 6.0 / 6.25 / 6.5 (freq 900 / 1200 / 1600).
- `shimmer` at 6.50.
- `whoosh {dur:.35}` at 7.65.

---

### S12 · `montagem` · start 66.0 · dur 6.0 · z 26 · pre 0 · post 0  [66–72]

**Purpose.** A quick‑fire tour of the ecosystem in three 2‑second panels separated by 45° brand wipes:
- A: the online store.
- B: the bio button with consultant rotation.
- C: flows (Beta), shown as the reactivation flow that would have saved Revenda Bella.

**Contract.**
- **First frame:** Panel A's light stage cuts in on the bar.
- **Last frame:** the dark flow canvas, mostly wireframed, with a teal scan line at y ≈ 1080.

**On‑screen copy**
- **A**
  - Eyebrow `LOJA · ATACADO`. Headline `Sua loja\n*online*, pronta.` (96 px, ink `#0b2b29`, accent `#27ae8f`).
  - Phone: URL pill `modafashion.atacado.store`, banner `Coleção Verão`.
  - Tiles: `Vestido midi · R$ 389 a grade` · `Conjunto linho` · `Cropped` · `Saia plissada`.
  - Sheet: `Sua sacola` · `Vestido midi · terracota` · `Quantidade por tamanho` with P M G GG · `Pedido mínimo atingido` (circle‑check) · `R$ 389` · button `Finalizar pelo WhatsApp`.
- **B**
  - Eyebrow `LINK DA BIO`. Headline `Botão de WhatsApp\nem *rodízio*.` (88 px).
  - Phone: avatar `MF`, `Moda Fashion`, `@modafashion`, button `Falar com consultora`, and `online agora · responde em minutos` with a CSS green dot.
  - Cards: `Ana Silva` · `Júlia Costa` · `Marina Alves` · `Paula Ribeiro`, each with a counter `+1`.
- **C**
  - Headline `Fluxos, não só *disparos*.` (88 px) plus a pill `BETA`.
  - Nodes:
    - `Gatilho · Inativo há 60 dias`
    - `Enviar WhatsApp · coleção nova`
    - `Comprou?`
    - `Fim · meta: compra`
    - `Aguardar 2 dias`
    - `Enviar SMS`, with a purple label `janela fechada`.
  - Branch pills `sim` / `não`.

**Choreography**
- **Panel A (0–2.0)**
  - Its container holds `KIT.bg({base:'light'})`.
  - Phone: `KIT.phone({x:1340, y:560, w:400})` with rotateY −14°. Tiles are gradient squares with a `shirt` icon.
  - **0.00:** eyebrow (y 320, x 120). **0.10:** headline (x 120, block centre y 470, `revealWords`). Readable 0.5–1.8.
  - **0.80:** the sheet slides up.
  - Steppers tick 0 → 1 at 0.90 / 1.025 / 1.15 / 1.275. "Pedido mínimo atingido" appears at 1.35.
  - **1.50:** the cursor taps "Finalizar pelo WhatsApp" (`#25d366`, tap ring).
- **1.75–2.05:** `KIT.diagWipe(root).set(p)` runs, with `KIT.diagClip(panelB, p)`.
- **Panel B (2.0–4.0), dark**
  - Same phone position. Above the button, 4 stacked avatars (AS, JC, MA, PR). The highlighted one (teal ring, scale 1.15) rotates every 8th note.
  - **2.00:** eyebrow at (120, 250). **2.20:** headline (x 120, block centre y 400). Readable 2.6–3.85.
  - Consultant cards 200×90 at y 700, x 120 / 340 / 560 / 780.
  - **2.50–3.50 round‑robin:** every 0.25 s a glowing lead dot leaves the phone button along a bezier to the next card in turn (1, 2, 3, 4, 1). That card's counter pops "+1".
- **3.75–4.05:** a second diagonal wipe.
- **Panel C (4.0–6.0), dark**
  - Dotted grid: `radial-gradient(#ffffff14 1.5px, transparent 1.5px)` at 24 px.
  - Nodes are `KIT.flowNode({dark:true, w:290})`:

| node | position (top‑left) | icon | pops at |
|---|---|---|---|
| Gatilho · Inativo há 60 dias (dashed border) | (140, 440) | zap | 4.00 |
| Enviar WhatsApp · coleção nova | (480, 440) | message‑circle | 4.25 |
| Comprou? | (820, 440) | git‑fork | 4.50 |
| Fim · meta: compra | (1160, 320) | target | 4.75 |
| Aguardar 2 dias | (1160, 580) | clock | 4.75 |
| Enviar SMS | (1500, 580) | message‑square | 5.00 |

  - `KIT.connector`s draw between pops. **sim** is `#16a34a` and **não** is `#dc2626`, with small pill labels. The purple label `janela fechada` (`#a855f7`) sits on the SMS edge.
  - Packets flow along the connectors after 5.0.
  - **4.10:** headline (centred, y 170). **4.40:** BETA pill right after it (Inter 800 16, tracking .14em, bg `rgba(255,255,255,.1)`, border `rgba(255,255,255,.25)`). Readable 4.5–5.7.
  - **5.70–6.00:** a horizontal teal scan line (3 px, glow) sweeps top to bottom. The area it passes turns wireframe: `filter: grayscale(1) brightness(.6)` plus 30% opacity.

**Kit.** `KIT.bg` (light), `KIT.phone`, `KIT.cursor`, `KIT.avatar`, `KIT.card`, `KIT.flowNode`, `KIT.connector`, `KIT.diagWipe`, `KIT.diagClip`, `KIT.pill`, `KIT.eyebrow`, `KIT.headline`.

**SFX**
- `swoosh` at 0.00.
- `tick {db:-8}` at 0.9, 1.025, 1.15, 1.275.
- `blip {freq:1400}` at 1.35.
- `pop` at 1.50.
- `whoosh {dur:.3}` at 1.75.
- `blip {freq:1500, db:-10}` at 2.5, 2.75, 3.0, 3.25, 3.5 (pan follows the card).
- `whoosh {dur:.3}` at 3.75.
- `blip` at 4.0, 4.25, 4.5, 4.75, 5.0 (freq 1000 rising to 1600).
- `pop` at 4.40.
- `swoosh` at 5.00.
- `glitch {dur:.1, db:-12}` at 5.70.

---

### S13 · `sob-o-capo` · start 72.0 · dur 8.0 · z 27 · pre 0 · post 0  [72–80]

**Purpose.** Tech power with true numbers. A sphere where every node is one of the 124 real cloud functions, plus four hero stats, each alone on screen ≥ 1.4 s.

**Contract.**
- **First frame:** the dark stage (the grid floor fades in via `space`) with a teal scan line at y 0.
- **Last frame:** the dark stage plus a single bright teal point, r 6 with glow, at **(960, 540)**.

**On‑screen copy**
- **Headline:** `Tecnologia que\nnão *dorme*.` (84 px).
- **Stats** (Russo One 170, gradient text `#27ae8f → #15dba8`, then a label in Open Sans 700 30, uppercase, tracking .14em, 80% white):

| # | number | label |
|---|---|---|
| 1 | +260 mil | linhas de código próprio |
| 2 | 124 | funções rodando na nuvem |
| 3 | 361 | evoluções do banco em 10 meses |
| 4 | 129 | tabelas com isolamento por empresa |

- **Chips:** `Criptografia AES-256` (lock) · `26+ rotinas automáticas 24/7` (timer).
- **Sphere caption:** `Cada ponto: uma função rodando na nuvem.`

**Layout**
- **Headline:** HUD, x 120, left, block centre y 220.
- **Stat number:** x 120, centre y 560. **Label:** y 690.
- **Chips:** y 860, at x 120 and x 470.
- **Sphere:** canvas, centre (1360, 520), radius 360.
  - 124 nodes on a Fibonacci sphere, rotating 12°/s about Y with an 18° X tilt; projection f 900.
  - Node r 2.5–5 by depth, teal.
  - Edges to the 3 nearest neighbours at alpha .15. 24 packets run on deterministic edges.
- **Caption:** centred at (1360, 940), Inter 500 18, `#9ca3af`.

**Choreography**
- **0.00–0.40:** the scan line sweeps down, revealing the stage.
- **0.30:** the headline appears. It stays until 7.3.
- **0.40–1.40:** the 124 nodes fly from `rng` positions to their sphere slots (stagger by index, 0.6 s power3.out). Each lands with a micro‑flash.
- **Stats, slot‑roll at T = 0.5, 2.0, 3.5, 5.0:**
  - Each enters from y +60 with blur 8 → 0 over 0.2 s.
  - Its digits resolve over 0.35 s (`KIT.scramble` digits only).
  - It exits at T_next − 0.1 to y −60 with blur.
  - The sphere pulses (all nodes flash) on each T.
  - Stat 4 exits at 6.4.
- **2.20:** the caption appears (paired with "124").
- **2.50:** AES chip. **4.00:** 26+ chip. Both stay until 7.4.
- **6.40–7.40: recap.**
  - A 2×2 mini grid at x 120–900, y 470–760 shows all four numbers (Russo One 64, gradient) and labels (Inter 600 18).
  - Pop stagger .06.
- **7.40–8.00: collapse.**
  - Texts fade (stagger .03) over 7.4–7.7.
  - The sphere nodes collapse into its centre, then that point travels to (960, 540) over 7.6–7.95 (expo.in).
  - The music riser peaks.

**Kit.** `GTR.canvas`, `KIT.scramble`, `KIT.pill`, `KIT.headline`, `KIT.pulse`.

**SFX**
- `whoosh {dur:.4}` and `glitch {dur:.1, db:-12}` at 0.00.
- `type {dur:1.0, rate:24, db:-12}` at 0.40.
- `impact {size:.5}` and `blip {freq:1400}` at 0.50.
- `glitch {dur:.08, db:-10}` at 1.9, 3.4, 4.9.
- `impact {size:.5, db:-4}` at 2.0, 3.5, 5.0.
- `blip` at 2.05 / 3.55 / 5.05 (freq 1600 / 1800 / 2000).
- `pop {db:-6}` at 2.5 and 4.0.
- `swoosh` at 6.40.
- `whoosh {dur:.6, up:false}` at 7.40.
- `ping {freq:1318.5}` at 7.95.

---

### S14 · `prova` · start 80.0 · dur 6.0 · z 28 · pre 0 · post 0  [80–86]

**Purpose.** Positioning and proof: "Performance, não vaidade.", national reach, and growth partners.

**Contract.**
- **First frame:** a white flash (global). "Performance," is mid‑reveal.
- **Last frame:** the dark stage, with the map and logos faded and blurred out.

**On‑screen copy**
- `*Performance*, não vaidade.`
  - Line 1 "Performance," (Russo One 150) in gradient text `#27ae8f → #15dba8` with a shimmer.
  - Line 2 "não vaidade." in white.
- **Subline:** `Medimos o que paga a conta.`
- **Vanity chips** (gray): `3.320 curtidas` (heart) · `48,2K seguidores` (users) · `187,4K alcance` (eye).
- **Money chips** (teal): `Vendas` (banknote) · `ROAS` (chart‑line) · `Retorno` (trending‑up) · `Lucro` (piggy‑bank).
- **Headline B:** `Do Ceará para\n*todo o Brasil*.` (88 px).
- **Eyebrow:** `PARCERIAS DE CRESCIMENTO DA GROWTH TIME`.
- **Logos (11), no names or numbers attached:**
  - clara‑jeans, quids, moov, levoo, clara‑plus, gl, fornelle, uece, lb, chefclaudia, q.
  - **Both pinkcom files are excluded.**

**Choreography**
- **0.00 [bar]:** line 1 (centred, y 420) with fast `revealChars` (stagger .02, dur .4).
  - Vanity chips (bg `rgba(255,255,255,.08)`, text `#9ca3af`) drift in at about (220, 200), (380, 280), (260, 360).
  - Money chips (`KIT.pill` teal) drift in at about (1320, 780), (1500, 840), (1380, 900), (1600, 760).
  - Both sets have slight 3D parallax.
- **0.50:** line 2 (y 590), `revealWords`.
- **1.25: the gag.**
  - "vaidade." goes to `#6b7472`, blur 0 → 6, rotate −8°, y +24, scale .92, opacity .35 (0.6 s, power2.in).
  - At the same moment the vanity chips gray out and fall (y +120, fade) while the money chips glow brighter.
  - The subline appears (Open Sans 700 36, y 760), `revealWords`. Readable 1.6–2.8.
- **2.80–3.10:** part 1 exits (y −40, blur, fade).
- **3.00–3.60: map.**
  - `GTR.img('assets/brazil-map.svg')`, 700 wide, at (160, 190), about 634 tall.
  - Filter: `brightness(0) saturate(100%) invert(64%) sepia(58%) saturate(560%) hue-rotate(110deg) brightness(92%)`, opacity 0 → .32, scale 1.08 → 1.
  - An SVG overlay with the same box and `viewBox 0 0 821 744` holds the landing's arcs **verbatim**:
    - `M602 205 Q470 150 350 235`
    - `M602 205 Q660 300 600 370`
    - `M602 205 Q500 320 430 425`
    - `M602 205 Q520 380 560 525`
    - `M602 205 Q430 430 470 650`
  - Arcs: 2.5 px `#15dba8`, `vector-effect: non-scaling-stroke`. They draw at 3.25 / 3.375 / 3.5 / 3.625 / 3.75, 0.4 s each.
  - Destination dots (r 6) pop with back.out(2.5).
  - A `KIT.pulse` on Ceará at stage **(673, 365)** repeats every beat.
- **3.25:** Headline B (x 1000, left, block centre y 290). Readable 3.7–5.6.
- **4.00:** eyebrow at (1000, 480).
- **4.10–4.60:** `KIT.logoPlate` (170×96) pops in (scale .8 → 1, stagger .04) as two marquee rows, masked to x 1000–1800 with faded edges.
  - Row 1 (6 logos) at y 530, moving left at 60 px/s.
  - Row 2 (5 logos) at y 650, moving right. Its x is `(base ± local·60) mod period`.
  - Light plates are mandatory (moov, chefclaudia and q are dark ink).
- **5.50–6.00:** everything fades and blurs out.

**Kit.** `KIT.headline`, `KIT.pill`, `GTR.img`, SVG, `KIT.pulse`, `KIT.logoPlate`, `KIT.eyebrow`.

**SFX** (no impact at 0)
- `pop` at 0.50.
- `swoosh {up:false, dur:.5, db:-4}` at 1.25.
- `swoosh` at 3.00.
- `blip {db:-10}` at 3.25, 3.5, 3.75, 4.0.
- `pop` at 4.10.

---

### S15 · `cta-final` · start 86.0 · dur 8.0 · z 29 · pre 0.5 · post 0  [85.5–94]

**Purpose.** The end card. The period of the brand promise flies up to become the logo's dot, closing the loop opened in S5.

**Contract.**
- **First visible frame (85.5):** the headline halves are off‑screen left and right, over S14's fading frame.
- **Last frame (94.0):** the **full end card fully visible, no fade**: logo, headline, button, reinforcement line and contacts.

**On‑screen copy**
- **Headline:** `Está na hora de *escalar*` (Russo One 128; 1528 px wide).
  - The period is a DOM circle, 26 px, `#33cc99`.
  - "escalar" has a looping gradient `#27ae8f → #15dba8 → #38cc9c` (3 s loop, `background-position` driven by local) and a glow.
- **Logo:** GT mark (`#e5e7eb`) plus wordmark `GROWTH TIME` (`#9CA3AF`).
- **Button:** `Agende seu diagnóstico gratuito` with an `arrow-right` icon.
- **Reinforcement:** `Sem compromisso · resposta rápida no WhatsApp`.
- **Contacts:** `growthtime.com.br` (globe) · `@growthtimebr` (instagram).

**Geometry**
- `KIT.logoAnim({x:960, y:300, width:460, withText:true, gray:'#e5e7eb'})`. Then set the text fill to `#9CA3AF`.
  - Box top 172, height 256.
  - **Logo dot centre = (1149, 334), r 13.5.**
  - `logoAnim.set()` forces the dot visible after t ≥ 0.95. **Call `set()`, then set `logo.parts.dot.style.opacity = 0` every frame.**
- **Headline:** centred at y 540. Measure the half widths in `build()`; the dot follows "escalar" with an 8 px gap.
- **Button:** centre (960, 690), height 92, padding 0 52 px, radius 999.
- **Reinforcement:** y 790. **Contacts:** y 880.

**Choreography**
- **−0.50–0.00 (`update`): halves lock.**
  - "Está na hora" comes from x −600, rotate −2°, blur 8 → 0.
  - "de *escalar*" plus the dot comes from x +600, rotate +2°.
  - Ease power3.out. **Lock exactly at 0.00 [86.0]** (the section impact and teal flash).
- **0.00–2.00:** hold (readable 2.0 s), push 1 → 1.02.
- **2.00–2.75:**
  - The dot pops (scale 1.4) and flies along a 45° up‑right arc (control point (1400, 300)) into the logo‑dot slot, where it lands with a squash.
  - Meanwhile the headline scales to .8 about its centre over 2.0–2.6.
- **2.20–3.60:** `logoAnim.set((local − 2.2)·1.6)`. The parts arrive by about 3.0 and the wordmark by about 3.5.
- **3.00:** lock pulse (`KIT.pulse`, r 160 from the dot).
  - The button springs in: scale .6 → 1.05 → 1 (back.out).
  - Gradient `135deg #2bb673 → #27ae8f`. Open Sans 700 34, white. Shadow `0 10px 26px rgba(43,182,115,.36)` plus a teal glow.
- **3.50:** one skewed white sheen (skewX −20°, 35% white, 0.7 s) crosses the button. After that, the button's glow pulses on a 4.2 s sine, and a glow blob behind it breathes (scale .6 → 1.25).
- **3.60:** the reinforcement line appears (Open Sans 22, 65% white).
- **4.00 / 4.25:** the contacts pop (Inter 600 30, teal icons, separated by a teal CSS dot).
- **4.50–8.00: hold.**
  - The aurora drifts and the grid scrolls (`space`).
  - Optional texture: from 4.5 to 6.5 a background canvas spawns about 360 tiny teal dots (r 1.5–3.5, alpha .12–.3) on a golden‑angle spiral from the logo dot. A radial mask keeps the ellipse (960, 540, rx 700, ry 380) clean.
  - A small pulse ring fires from the logo dot at 5.0 and 7.0. A final `KIT.pulse` (r 300) fires at 7.5.
  - **No fade:** the last frame is the complete end card.

**Kit.** `KIT.logoAnim`, `KIT.headline` (built as two halves), `KIT.pulse`, `GTR.glow`, DOM button, `GTR.canvas`.

**SFX** (no impact at 0)
- `whoosh {dur:.4, pan:-.6}` and `whoosh {dur:.4, pan:.6}` at −0.40.
- `swoosh {up:true}` at 2.00.
- `ping {freq:1318.5}` at 2.75.
- `shimmer` at 2.80.
- `pop` at 3.00.
- `shimmer` at 3.50.
- `blip {freq:1600}` at 4.00 and `blip {freq:2000}` at 4.25.
- `ping {db:-10}` at 7.50.
- The soundtrack's master applies its own 1.5 s audio fade; the picture holds.

---

## 3. Cross‑scene contracts (summary)

| Handoff | Contract |
|---|---|
| S1 → S2 | Match cut. Phone `{x:620, y:580, w:420}`, rotateY 16°, perspective 1400, identity camera. Headline column at x 1060. Tear settles over S2 0–0.25. |
| S2 → S3 | Whip left. S2 ends at translateX −900 with blur 24. S3 starts at +900 with blur 24 and settles over 0–0.4 in `update`. |
| S3 → S4 | Full‑frame `#000c0d` overlay at 0.85 at the cut. S4 fades it out over 0–0.4. |
| S4 → S5 | Hard cut to black. Music gate 16.0–17.98; SFX gate 16.0–16.45; no flash. |
| S5 → S6 | Gate dive through viewBox gap (472.93, 173.25), screen (1109, 466) → (960, 540), ×40. S6 (z 20) pre 0.5 is visible behind S5 (z 30). |
| S6 → S7 | Full‑frame `#efeae2` plate, dots 1.2 px `rgba(0,0,0,.035)` every 22 px, position 0 0. S7 morphs it into the phone screen rect (302, 175, 355×771, r 46). |
| S7 → S8 | One teal line (3 px, glow) across the full width at y 460. It becomes S8's pipeline. |
| S3 ↔ S8 | Same node positions: ad (180, 250, 340×420), middle node centred at (960, 460), sale node at (1480, 370 / 360). |
| S4 ↔ S9 | The same Revenda Bella card (§1.7): dark in S4, light in S9. |
| S6 ↔ S8 | Chip `Vendas 1 · 4321` is planted in S6 and paid off in S8. |
| S9 → S10 | Guto button at (1758, 958), 56 px. S10's window shows it in the same spot (hard cut on the bar). |
| S10 → S11 | Zoom into the dark TV button, then solid black. S11 opens with a TV power‑on from black. |
| S12 → S13 | Teal scan line down at S12's end; S13 opens with its own scan from y 0. |
| S13 → S14 | Teal point at (960, 540), then the white flash and "Performance," slams in. |
| S14 → S15 | Soft fade; S15's halves slide in over 85.5–86.0 (`update`). |
| Chips | Act I log at y = 96 + (n−1)·58. S6–S9: a single chip at (120, 96) that flips on the proof frame. |

---

## 4. Music arrangement (120 BPM · beat 0.5 s · bar 2 s)

**Chords.** The default progression is **Am F C G** (one bar per chord); sections override it.
- **Act I:** Am F, then Am F Dm E, then Dm E. The E major is the dominant that never resolves: we cut to silence.
- **Reveal:** Fmaj7 (18–20), then Gsus4 (20–22), which resolves deceptively into **Am on the drop** at 22.
- **Guto:** F (thin), then Am F G.
- **Peaks:** C G Am → F G (snare roll) → **C G** under PARABÉNS.
- **Machine:** Am F C G.
- **Ending:** C G Am → F G → **Fmaj7 → Cadd9**, a plagal major ending on the end card.

`chord_notes()` in `soundtrack.py` already parses Fmaj7, Gsus4, Cadd9, Dm and E.

**Sections** (JSON below is authoritative)

| section | span | layers | energy | extras |
|---|---|---|---|---|
| dor-gancho | 0–4 | pad sub ticks halfkick | .55 | Am F, padBright 1400 |
| dor-escalada | 4–12 | + ticks8, bass | .65 | Am F Dm E |
| dor-colapso | 12–16 | pad sub ticks ticks8 kick hats | .75 | Dm E, riserOut 4, roll 1 bar |
| silencio | 16–18 | — | 0 | **gates** |
| revelacao | 18–20 | pad sub | .45 | Fmaj7, padBright 3200, padGain 1.2, riserOut 2 |
| logo | 20–22 | pad sub ticks ticks8 arp | .6 | Gsus4, **impactIn** (lock), riserOut 2, roll 1 bar |
| drop-atender | 22–30 | kick clap hats bass arp pad sub | .85 | **impactIn** (THE DROP) |
| oficial | 30–36 | + hats16 | .85 | F C G, swellOut |
| medir | 36–44 | + openhat | .9 | |
| guto-pensa | 44–46 | pad sub arp ticks | .55 | F, drums out |
| guto-responde | 46–52 | kick clap hats bass arp pad sub | .9 | Am F G, **impactIn**, riserOut 1 |
| pico-dash | 52–58 | full + lead | 1.0 | C G Am, **impactIn** |
| tv-vendas | 58–62 | full + lead | .95 | F G, roll 1 bar into PARABÉNS |
| parabens | 62–66 | full + lead | 1.0 | C G, **impactIn** |
| montagem | 66–72 | kick clap hats hats16 bass arp lead pad sub | .95 | Am F C, swellOut |
| sob-o-capo | 72–80 | pad sub ticks ticks8 halfkick arp | .7 | Am F C G, riserOut 2 |
| final | 80–86 | full + lead | 1.0 | C G Am, **impactIn** |
| cta | 86–90 | pad sub kick clap hats bass lead | .85 | F G, **impactIn** |
| outro | 90–94 | pad sub lead | .45 | Fmaj7 Cadd9, padBright 3000 |

**Silence.** `soundtrack.py` already supports `music.gates`, so no code change is needed:
- `{start:16.0, end:17.98, fade:0.006}` mutes music and its reverb tails.
- `{start:16.0, end:16.45, sfx:true}` also kills SFX tails.
- The first sound after the cut is the `ping` at 16.5 (S5 local 0.5).

**Energy curve:** .55 → .65 → .75 → **0 (silence)** → .45 → .6 → **.85 (DROP)** → .9 → .55 (Guto thinks) → .9 → **1.0 (peak)** → .95 → **1.0 (PARABÉNS)** → .95 → .7 → **1.0 (final)** → .85 → .45.

## 5. Global flashes

| t | colour | a | dur | moment |
|---|---|---|---|---|
| 2.0 | red 239,68,68 | .22 | .25 | "Ninguém responde." slam |
| 15.5 | red | .30 | .20 | collapse strobe |
| 20.0 | teal 21,219,168 | .55 | .50 | GT mark locks |
| 22.0 | white | .85 | .35 | THE DROP (inside the gate) |
| 36.0 | teal | .35 | .30 | light‑speed → rastreio |
| 46.0 | teal | .30 | .30 | Guto answers |
| 52.0 | white | .60 | .30 | peak: dashboard |
| 62.0 | gold 243,179,21 | .45 | .40 | PARABÉNS · Ouro |
| 80.0 | white | .75 | .35 | final drop |
| 86.0 | teal | .40 | .40 | CTA lock |

No flash at 16.0: that cut goes to black and silence.

---

## 6. Claims used and their sources (true facts only)

| On screen | Source |
|---|---|
| 3 canais · 1 caixa (WhatsApp, Instagram Direct, Messenger) | `_shared/wa-provider.ts`, `ConversationList.tsx` |
| API Oficial da Meta · Coexistência (App + Cloud) · Templates aprovados · Mais estável · Janela de 24h sob controle | `wa-provider-registry.ts` UI labels; landing |
| Saúde do número checada a cada 30 min | `whatsapp-cloud-health` cron |
| IA · Atuar sozinha · Fora do expediente · Até com a loja fechada · Pedido fechado pela IA · Respondido pela IA em 4s (stylised demo) | `WaAiAgentCard.tsx` modes; `auto_contraturno` autopilot; `AvailabilityIndicator`; ConversationList gold ring; landing mock |
| 4 dígitos ligam anúncio e número · ROAS real, não estimado · Compra enviada à Meta · Top 3 Criativos | Commit `bdacdb9`; Anúncios caption; `meta-capi-messaging`; mock |
| Guto: chips, loading line, footer · tool names `buscar_cliente` / `vendas_por_mes` / `top_clientes` · "não inventa número" · Cada número conferido na sua base | `copilot/*`, `read-tools.ts`, `knowledge.ts` ("nunca inventa valor"), `validator.ts` |
| Dashboard funnel and KPIs; Modo TV (VENDA REALIZADA, cha‑ching, PARABÉNS "{Nome} bateu a meta do MÊS!", "Seguindo em frente!", Bronze/Prata/Ouro) | `SalesFunnel.tsx`, `TVCelebrationOverlay`, `useTVNewSalesQueue`, `tiered-progress.tsx`; demo numbers from the mock |
| Loja *.atacado.store · Sua sacola · Quantidade por tamanho · pedido mínimo · Link da bio em rodízio · Fluxos (Beta), gatilho "Inativo há X dias", "Comprou?", SMS com janela fechada | `storeSubdomain.ts`, `StoreCartSheet`, `RotationPicker`, `dispatch-engine.ts`, landing tags |
| +260 mil linhas · 124 funções · 361 evoluções em 10 meses · 129 tabelas isoladas · AES‑256 · 26+ rotinas 24/7 | Research counts (262.149 lines; 124 business edge functions; 361 migrations Dez/2025–Set/2026; RLS on 129 tables; `_shared/crypto.ts`; ≥26 cron jobs) |
| Performance, não vaidade · Medimos o que paga a conta · Do Ceará para todo o Brasil · Parcerias de crescimento · Está na hora de escalar · diagnóstico gratuito · growthtime.com.br · @growthtimebr | Landing copy |

**Deliberately avoided**
- ERP, Bling and Tiny.
- "Nível bancário" and any certification claim.
- "Microsserviços" (we say "funções rodando na nuvem").
- AI vendor or model names.
- Comentário → Direct (marked "Em breve").
- The landing's hard‑coded stats (+1.284 leads/mês, 5/5 regiões, the 12‑month ramp).
- Real client or employee names (Pink, Qzito, Monique, Caliane, Dani, Amanda, Ster). **Both Pink.Com logos are excluded.**
- Phone numbers are always masked.
- Sellers are never shown as customers.
- Disparos appears only in a 2‑second montage panel with its **BETA** pill.
- The API Oficial scene never implies bans become impossible.

## 7. Judge must‑fix list: resolution

| Must‑fix | Resolution |
|---|---|
| Pre‑roll frozen tl | Only S6 and S15 have pre‑rolls, both computed in `update()`. All other entrances start at local ≥ 0 (whips are handled at the cut). |
| Mask phone numbers | All unknown leads use the `(85) 9 ••••-3344` form (U+2022 is covered by the fonts). |
| "Ponto final no caos" ≥ 1.2 s | Fully readable 1.125–2.40 (1.28 s). |
| Earlier drop, off the ceiling | Act I is 16 s. S5 is 6 s with the lock at 20.0 and **the drop at 22.0**. Total 94 s. |
| S13 overload | 4 hero stats, each alone 1.4 s, plus 2 chips, a sphere and a recap. "Funções rodando na nuvem". No ticker. |
| Pinkcom logos | Excluded: 11 plates, all on light plates. |
| Glyph safety | Verified against the woff2 cmaps. Icons are used for ✓ ● → ↗ ↘ ⇄ ◀ ⏩. |
| Act I glitch discipline | Heavy tear only at 3.75–4.25 and 15.0–16.0. S2 exits by whip; S3 exits by zoom‑through. |
| Silence gap | `music.gates`: music 16.0–17.98, SFX 16.0–16.45. First sound is the ping at 16.5. The `fx` grain runs over black. |
| End card | Held to the last frame; no fade. |
| Demo‑data consistency | Patrícia's sale is R$ 1.167 (3 × 389). Revenda Bella's ticket médio is R$ 2.340. Carla Mendes appears only as a seller. |
| Readability pass | Scrims on every UI scene. Every headline is ≤ 6 words and readable ≥ 1.2 s. Chips are red ≥ 1.25 s, then OK ≥ 2 s. |
| S11 legend | "faltam N mil", team %, Hoje and Semana update live from the sales script. |
| Duplicate impacts | Scene impacts removed at every section `impactIn` time. |
| Measurement determinism | Dock target and portal points are analytic. Text widths are measured once in `build()`, after the engine's font load. |
| `logoAnim` dot | Hidden every frame after `set()`; the flying period dot replaces it. |
| Earlier product UI | Real GTR UI arrives at 22 s, inside the gate dive at 21.5. |

## 8. Verification stills (`--stills`)

- **Around every handoff:** 3.9, 4.1, 7.95, 8.1, 11.95, 12.1, 15.9, 16.6, 17.8, 20.05, 21.8, 22.05, 29.95, 30.05, 35.9, 36.05, 43.95, 44.1, 51.95, 52.1, 57.95, 58.15, 62.2, 65.95, 66.05, 71.95, 72.05, 79.95, 80.05, 85.8, 86.05, 93.95.
- **Chip flips:** 26.3, 31.5, 39.5, 46.0.
- **Tier crossing:** 61.9.

## 9. Assembling `js/timeline.js`

Build `GTR.TIMELINE` from the JSON below as follows:
- `duration` and `fps` come from the JSON.
- `scenes = [...infra, ...scenes]`.
- `music = {bpm, progression, barsPerChord, gainDb, sections: json.music, gates: json.gates}`.
- `flashes`, `space` and `disclaimer` are copied as they are.

```json
{
  "title": "PONTO FINAL · Do caos à máquina",
  "duration": 94,
  "fps": 60,
  "bpm": 120,
  "progression": ["Am", "F", "C", "G"],
  "barsPerChord": 1,
  "gainDb": 0,
  "music": [
    {"name": "dor-gancho",    "start": 0,  "end": 4,  "layers": ["pad","sub","ticks","halfkick"], "energy": 0.55, "riserOut": 0, "impactIn": false, "swellOut": false, "progression": ["Am","F"], "padBright": 1400},
    {"name": "dor-escalada",  "start": 4,  "end": 12, "layers": ["pad","sub","ticks","ticks8","halfkick","bass"], "energy": 0.65, "riserOut": 0, "impactIn": false, "swellOut": false, "progression": ["Am","F","Dm","E"], "padBright": 1500},
    {"name": "dor-colapso",   "start": 12, "end": 16, "layers": ["pad","sub","ticks","ticks8","kick","hats"], "energy": 0.75, "riserOut": 4, "impactIn": false, "swellOut": false, "progression": ["Dm","E"], "padBright": 1700, "roll": true, "rollBars": 1},
    {"name": "silencio",      "start": 16, "end": 18, "layers": [], "energy": 0, "riserOut": 0, "impactIn": false, "swellOut": false},
    {"name": "revelacao",     "start": 18, "end": 20, "layers": ["pad","sub"], "energy": 0.45, "riserOut": 2, "impactIn": false, "swellOut": false, "progression": ["Fmaj7"], "padBright": 3200, "padGain": 1.2},
    {"name": "logo",          "start": 20, "end": 22, "layers": ["pad","sub","ticks","ticks8","arp"], "energy": 0.6, "riserOut": 2, "impactIn": true, "swellOut": false, "progression": ["Gsus4"], "roll": true, "rollBars": 1},
    {"name": "drop-atender",  "start": 22, "end": 30, "layers": ["kick","clap","hats","bass","arp","pad","sub"], "energy": 0.85, "riserOut": 0, "impactIn": true, "swellOut": false},
    {"name": "oficial",       "start": 30, "end": 36, "layers": ["kick","clap","hats","hats16","bass","arp","pad","sub"], "energy": 0.85, "riserOut": 0, "impactIn": false, "swellOut": true, "progression": ["F","C","G"]},
    {"name": "medir",         "start": 36, "end": 44, "layers": ["kick","clap","hats","hats16","openhat","bass","arp","pad","sub"], "energy": 0.9, "riserOut": 0, "impactIn": false, "swellOut": false},
    {"name": "guto-pensa",    "start": 44, "end": 46, "layers": ["pad","sub","arp","ticks"], "energy": 0.55, "riserOut": 0, "impactIn": false, "swellOut": false, "progression": ["F"], "padBright": 3000},
    {"name": "guto-responde", "start": 46, "end": 52, "layers": ["kick","clap","hats","bass","arp","pad","sub"], "energy": 0.9, "riserOut": 1, "impactIn": true, "swellOut": false, "progression": ["Am","F","G"]},
    {"name": "pico-dash",     "start": 52, "end": 58, "layers": ["kick","clap","hats","hats16","openhat","bass","arp","lead","pad","sub"], "energy": 1.0, "riserOut": 0, "impactIn": true, "swellOut": false, "progression": ["C","G","Am"]},
    {"name": "tv-vendas",     "start": 58, "end": 62, "layers": ["kick","clap","hats","hats16","openhat","bass","arp","lead","pad","sub"], "energy": 0.95, "riserOut": 0, "impactIn": false, "swellOut": false, "progression": ["F","G"], "roll": true, "rollBars": 1},
    {"name": "parabens",      "start": 62, "end": 66, "layers": ["kick","clap","hats","hats16","openhat","bass","arp","lead","pad","sub"], "energy": 1.0, "riserOut": 0, "impactIn": true, "swellOut": false, "progression": ["C","G"]},
    {"name": "montagem",      "start": 66, "end": 72, "layers": ["kick","clap","hats","hats16","bass","arp","lead","pad","sub"], "energy": 0.95, "riserOut": 0, "impactIn": false, "swellOut": true, "progression": ["Am","F","C"]},
    {"name": "sob-o-capo",    "start": 72, "end": 80, "layers": ["pad","sub","ticks","ticks8","halfkick","arp"], "energy": 0.7, "riserOut": 2, "impactIn": false, "swellOut": false, "progression": ["Am","F","C","G"]},
    {"name": "final",         "start": 80, "end": 86, "layers": ["kick","clap","hats","hats16","openhat","bass","arp","lead","pad","sub"], "energy": 1.0, "riserOut": 0, "impactIn": true, "swellOut": false, "progression": ["C","G","Am"]},
    {"name": "cta",           "start": 86, "end": 90, "layers": ["pad","sub","kick","clap","hats","bass","lead"], "energy": 0.85, "riserOut": 0, "impactIn": true, "swellOut": false, "progression": ["F","G"]},
    {"name": "outro",         "start": 90, "end": 94, "layers": ["pad","sub","lead"], "energy": 0.45, "riserOut": 0, "impactIn": false, "swellOut": false, "progression": ["Fmaj7","Cadd9"], "padBright": 3000}
  ],
  "gates": [
    {"start": 16.0, "end": 17.98, "fade": 0.006, "sfx": false},
    {"start": 16.0, "end": 16.45, "fade": 0.005, "sfx": true}
  ],
  "flashes": [
    {"t": 2.0,  "color": "239,68,68",   "a": 0.22, "dur": 0.25},
    {"t": 15.5, "color": "239,68,68",   "a": 0.3,  "dur": 0.2},
    {"t": 20.0, "color": "21,219,168",  "a": 0.55, "dur": 0.5},
    {"t": 22.0, "color": "255,255,255", "a": 0.85, "dur": 0.35},
    {"t": 36.0, "color": "21,219,168",  "a": 0.35, "dur": 0.3},
    {"t": 46.0, "color": "21,219,168",  "a": 0.3,  "dur": 0.3},
    {"t": 52.0, "color": "255,255,255", "a": 0.6,  "dur": 0.3},
    {"t": 62.0, "color": "243,179,21",  "a": 0.45, "dur": 0.4},
    {"t": 80.0, "color": "255,255,255", "a": 0.75, "dur": 0.35},
    {"t": 86.0, "color": "21,219,168",  "a": 0.4,  "dur": 0.4}
  ],
  "scenes": [
    {"id": "dor-caos",        "start": 0,  "dur": 4, "z": 10, "pre": 0,   "post": 0},
    {"id": "dor-banido",      "start": 4,  "dur": 4, "z": 11, "pre": 0,   "post": 0},
    {"id": "dor-dinheiro",    "start": 8,  "dur": 4, "z": 12, "pre": 0,   "post": 0},
    {"id": "dor-sumiu",       "start": 12, "dur": 4, "z": 13, "pre": 0,   "post": 0},
    {"id": "ponto-final",     "start": 16, "dur": 6, "z": 30, "pre": 0,   "post": 0},
    {"id": "fix-ia",          "start": 22, "dur": 8, "z": 20, "pre": 0.5, "post": 0},
    {"id": "fix-oficial",     "start": 30, "dur": 6, "z": 21, "pre": 0,   "post": 0},
    {"id": "fix-rastreio",    "start": 36, "dur": 8, "z": 22, "pre": 0,   "post": 0},
    {"id": "fix-guto",        "start": 44, "dur": 8, "z": 23, "pre": 0,   "post": 0},
    {"id": "dashboard-funil", "start": 52, "dur": 6, "z": 24, "pre": 0,   "post": 0},
    {"id": "modo-tv",         "start": 58, "dur": 8, "z": 25, "pre": 0,   "post": 0},
    {"id": "montagem",        "start": 66, "dur": 6, "z": 26, "pre": 0,   "post": 0},
    {"id": "sob-o-capo",      "start": 72, "dur": 8, "z": 27, "pre": 0,   "post": 0},
    {"id": "prova",           "start": 80, "dur": 6, "z": 28, "pre": 0,   "post": 0},
    {"id": "cta-final",       "start": 86, "dur": 8, "z": 29, "pre": 0.5, "post": 0}
  ],
  "infra": [
    {"id": "space", "start": 0, "dur": 94, "z": 0,   "pre": 0, "post": 0},
    {"id": "fx",    "start": 0, "dur": 94, "z": 100, "pre": 0, "post": 0}
  ],
  "space": {"keys": [
    {"t": 0,    "speed": 0.6, "aurora": 0.25, "danger": 1, "dust": 1, "grid": 0,   "dim": 0},
    {"t": 15.9, "speed": 1.2, "aurora": 0.2,  "danger": 1, "dust": 1, "grid": 0,   "dim": 0},
    {"t": 16.0, "speed": 0,   "aurora": 0,    "danger": 0, "dust": 0, "grid": 0,   "dim": 1},
    {"t": 21.4, "speed": 0,   "aurora": 0,    "danger": 0, "dust": 0, "grid": 0,   "dim": 1},
    {"t": 21.9, "speed": 3,   "aurora": 1,    "danger": 0, "dust": 1, "grid": 0,   "dim": 0},
    {"t": 23.0, "speed": 0.4, "aurora": 1,    "danger": 0, "dust": 1, "grid": 0,   "dim": 0},
    {"t": 71.6, "speed": 0.4, "aurora": 1,    "danger": 0, "dust": 1, "grid": 0,   "dim": 0},
    {"t": 72.3, "speed": 1.2, "aurora": 0.6,  "danger": 0, "dust": 1, "grid": 1,   "dim": 0},
    {"t": 79.6, "speed": 1.2, "aurora": 0.6,  "danger": 0, "dust": 1, "grid": 1,   "dim": 0},
    {"t": 80.0, "speed": 0.4, "aurora": 1,    "danger": 0, "dust": 1, "grid": 0,   "dim": 0},
    {"t": 86.0, "speed": 0.3, "aurora": 1,    "danger": 0, "dust": 1, "grid": 0,   "dim": 0},
    {"t": 87.0, "speed": 0.3, "aurora": 1,    "danger": 0, "dust": 1, "grid": 0.6, "dim": 0},
    {"t": 94.0, "speed": 0.3, "aurora": 1,    "danger": 0, "dust": 1, "grid": 0.6, "dim": 0}
  ]},
  "disclaimer": [[0.4, 15.6], [22.4, 71.6]]
}
```