/* ============================================================
   Growth Time — "Tudo que já existe, vivo" (motion v2)
   Toda a coreografia acontece nos elementos EXISTENTES:
   - HERO: celular sticky, conversa avança com o scroll (facilpay)
   - VIRADA: scroll dirige o slider de 12 meses que já existe
   - Demais seções: entradas distintas via classes CSS + scrubs locais
   Zero camada visual nova. position:sticky (nunca ScrollTrigger.pin).
   Infra herdada do QA da v1: kill-switch relativo à cadência base,
   gates de pinch-zoom/resize-largura/reduced-motion/lowEnd,
   boot try/catch POR MÓDULO com rollback.
   ============================================================ */
(function () {
  'use strict';
  if (!window.gsap || !window.ScrollTrigger) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return; // página mantém o comportamento atual (autoplay do landing.js)

  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });

  var lowEnd = (navigator.hardwareConcurrency || 8) <= 4 || (navigator.deviceMemory || 8) < 4;
  var lvw = function () { return document.documentElement.clientWidth; }; // layout viewport (pinch-zoom seguro)
  var vh = function () { return window.innerHeight; };
  var html = document.documentElement;

  function qs(s, c) { return (c || document).querySelector(s); }
  function qsa(s, c) { return [].slice.call((c || document).querySelectorAll(s)); }
  function docY(r) { return r.top + window.scrollY; }
  function countUp(el, target, opts) {
    opts = opts || {};
    var o = { v: opts.from || 0 };
    gsap.to(o, {
      v: target, duration: opts.dur || 1.2, ease: 'power3.out',
      onUpdate: function () {
        var n = Math.round(o.v);
        el.textContent = (opts.prefix || '') + (opts.loc ? n.toLocaleString('pt-BR') : n) + (opts.suffix || '');
      },
      onComplete: opts.onDone || null
    });
  }
  /* progress 0..1 de uma seção-trilho (sticky viaja dentro dela) */
  function trackP(el) {
    var r = el.getBoundingClientRect();
    var total = r.height - vh();
    if (total <= 0) return r.top < 0 ? 1 : 0;
    return Math.min(1, Math.max(0, -r.top / total));
  }
  var degraded = false, frameCount = 0;

  /* ================= HERO — conversa scrubada ================= */
  var hero = { ok: false, tier: 0, beat: 0, wm: 0, pStart: 0.1, lastAuto: 0, exited: false, stepIdx: 0 };
  /* roteiro: FONTE ÚNICA no landing.js (1ª venda → "3 semanas depois" → recompra → ouro) */
  var SEQ = window.__gtSeq;
  /* beats: m=msgs visíveis, typ=quem digita, t2/t4/t6=recibo das msgs "me" (índices 1/3/5),
     chip=separador de data, gold=badge cliente ouro, a=annots acesas, step=texto grande (F3) */
  var BEATS = [
    { m: 0, typ: null,   a: [] },
    { m: 0, typ: 'them', a: [],        step: 1 },
    { m: 1, typ: null,   a: [0],       step: 1 },
    { m: 1, typ: 'me',   a: [0],       step: 1 },
    { m: 2, typ: null,   a: [0],       step: 2, t2: 'v' },
    { m: 2, typ: 'them', a: [0, 1],    step: 2, t2: 'b' },
    { m: 3, typ: null,   a: [0, 1, 2], step: 2, t2: 'b' },
    { m: 3, typ: 'me',   a: [0, 1, 2], step: 2, t2: 'b' },
    { m: 4, typ: null,   a: [0, 1, 2, 3], step: 3, t2: 'b', t4: 'v' },
    { m: 4, typ: null,   a: [0, 1, 2, 3], step: 3, t2: 'b', t4: 'b', chip: true },
    { m: 4, typ: 'me',   a: [0, 1, 2, 3], step: 4, t2: 'b', t4: 'b', chip: true },
    { m: 5, typ: null,   a: [0, 1, 2, 3], step: 4, t2: 'b', t4: 'b', chip: true },
    { m: 5, typ: 'them', a: [0, 1, 2, 3], step: 4, t2: 'b', t4: 'b', chip: true },
    { m: 6, typ: null,   a: [0, 1, 2, 3], step: 4, t2: 'b', t4: 'b', t6: 'v', chip: true },
    { m: 6, typ: 'me',   a: [0, 1, 2, 3], step: 4, t2: 'b', t4: 'b', t6: 'b', chip: true },
    { m: 7, typ: null,   a: [0, 1, 2, 3], step: 4, t2: 'b', t4: 'b', t6: 'b', chip: true },
    { m: 7, typ: null,   a: [0, 1, 2, 3], step: 5, t2: 'b', t4: 'b', t6: 'b', chip: true, gold: true },
    { m: 7, typ: null,   a: [0, 1, 2, 3], step: 5, t2: 'b', t4: 'b', t6: 'b', chip: true, gold: true, roas: true },
  ];
  var BMAX = BEATS.length - 1; // 17
  var feedMsgs = [], typThem, typMe, pbarSub, roasEl, heroEl, stageEl, chipDate, chipGold, feedEl, auroraEl;
  var railNodes = [], railLinks = [], railWrap, railCap; // trilho de fases (topo) + nome grande da fase (rodapé, estilo facilpay)
  /* ticks SVG (fonte única no landing.js; fallback embutido) */
  var TICK = window.__gtTick || {
    one: '<svg width="16" height="11" viewBox="0 0 18 12" fill="none"><path d="M3 6.5 6.5 9.7 14 2.3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    two: '<svg width="16" height="11" viewBox="0 0 18 12" fill="none"><path d="M1 6.5 4 9.5 10 2.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M6.5 6.8 9 9.3 15 2.3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };
  var RAIL_LABELS = ['Atrair', 'Atender', 'Vender', 'Follow-up', 'Ouro'];
  var CHECK_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12l5 5 11-11"/></svg>';

  /* ---- hero v3: o ato do celular grande (tier 2) ---- */
  var ACT = 0.12;            // fatia inicial do trilho onde o phone encolhe
  var STEP_GATE = 0.85;      // textos grandes só com o phone quase assentado
  var rigEl, shNear, shFar, glowEl, stepEls = [];
  var POSE = { s: 1, x: 0, y: 0 };          // pose assentada (por breakpoint)
  var rigCur = null;                         // valores correntes (lerp)
  var setRigS, setRigX, setRigY, setShNear, setShFar; // quickSetters
  var liteHero = false;                      // lowEnd/degrade: 3 poses discretas
  var lastPoseCls = '';
  /* textos grandes: vocabulário do funil que já existe na página */
  var STEPS_COPY = [
    ['01 · Atrair',    'Lead chega <span class="hl">pelo anúncio</span>.'],
    ['02 · Atender',   'A <span class="hl">IA</span> atende e qualifica.'],
    ['03 · Vender',    'Vira <span class="hl">pedido</span>.'],
    ['04 · Follow-up', 'Ela volta — <span class="hl">com follow-up automático</span>.'],
    ['05 · Medir',     'Vira <span class="hl">cliente ouro</span>.']
  ];
  function smooth(k) { return k * k * (3 - 2 * k); }
  function clampN(lo, v, hi) { return Math.min(hi, Math.max(lo, v)); }

  function initHero() {
    heroEl = qs('.hero'); stageEl = qs('.hero-stage');
    var feed = qs('#phoneFeed');
    if (!heroEl || !stageEl || !feed) throw new Error('hero: âncoras ausentes');
    if (!SEQ || SEQ.length < 7) throw new Error('hero: window.__gtSeq ausente/curto');
    var supportsClip = window.CSS && CSS.supports && CSS.supports('overflow', 'clip');
    if (!supportsClip) return 0; // sem sticky: landing.js autoplay segue valendo
    /* tiers de viewport:
       full (v3, phone grande) → mobile/tablet vh≥740, desktop vh≥760
       v2+  (sticky atual, conversa estendida) → vh≥660 (desktop ≥720)
       off  → autoplay do landing */
    var desk = lvw() >= 1080, vhNow = vh();
    hero.tier = (vhNow >= (desk ? 760 : 740)) ? 2 : (vhNow >= (desk ? 720 : 660)) ? 1 : 0;
    // reconcilia com o gate pré-paint do head (mesma fórmula; aqui é a verdade final)
    if (hero.tier !== 2) html.classList.remove('mo-hero-v3');
    if (hero.tier === 0) return 0;

    // assume o feed: card-anúncio + 7 msgs + chip de data + badge ouro + 2 typings (census 12 = PROFILES.v3)
    window.__gtHero = true; // mata o autoplay do landing.js (guard em checkPhone/next)
    feedEl = feed;
    feed.innerHTML = '';
    // card de anúncio (CTWA) fixo no topo do chat — "veio do anúncio" nativo
    if (window.__gtBuildAd) feed.appendChild(window.__gtBuildAd());
    SEQ.forEach(function (mss, i) {
      if (mss.chipBefore) {
        chipDate = document.createElement('div'); chipDate.className = 'chip-date';
        chipDate.textContent = mss.chipBefore; feed.appendChild(chipDate);
      }
      var d = document.createElement('div');
      d.className = 'msg ' + mss.k;
      d.innerHTML = mss.t + '<span class="meta" aria-hidden="true">' + mss.at + (mss.k === 'me' ? ' <i class="tick">' + TICK.one + '</i>' : '') + '</span>';
      feed.appendChild(d); feedMsgs.push(d);
      if (mss.goldAfter) {
        chipGold = document.createElement('div'); chipGold.className = 'chip-gold';
        chipGold.textContent = mss.goldAfter; feed.appendChild(chipGold);
      }
    });
    typThem = document.createElement('div'); typThem.className = 'mo-typing'; typThem.innerHTML = '<i></i><i></i><i></i>';
    typMe = document.createElement('div'); typMe.className = 'mo-typing me'; typMe.innerHTML = '<i></i><i></i><i></i>';
    feed.appendChild(typThem); feed.appendChild(typMe);

    // subtítulo do pbar ("online" ⇄ "digitando…")
    pbarSub = qs('.phone .pbar-sub');
    auroraEl = qs('#heroAurora');

    // a-roas começa apagada e vira o fecho da história (beat 9)
    roasEl = qs('.annot.a-roas');
    if (roasEl) roasEl._target = 0;

    if (hero.tier === 2) {
      /* ---- v3: phone grande + ato de escala + textos do processo ---- */
      rigEl = qs('#phoneRig'); shNear = qs('.ph-shadow-near'); shFar = qs('.ph-shadow-far'); glowEl = qs('#glow');
      if (!rigEl) { hero.tier = 1; html.classList.add('mo-hero-sticky'); }
      else {
        html.classList.add('mo-hero-v3');
        window.__gtHeroRig = true; // landing solta phone+glow; motion vira o escritor
        var phEl = qs('.hero .phone');
        if (phEl) phEl.style.transform = ''; // limpa drift inline pré-boot (CSS base assume)
        liteHero = lowEnd;
        if (liteHero) html.classList.add('mo-lite');
        // trilho de fases (premium): trilha de 5 nós que acendem + rótulo grande + selo "desbloqueada"
        // slot reservado (altura fixa por bp = zero CLS); o vocabulário é o do funil que já existe
        var stepsWrap = document.createElement('div');
        stepsWrap.className = 'hero-steps'; stepsWrap.setAttribute('aria-hidden', 'true');
        var rail = document.createElement('div'); rail.className = 'hero-rail';
        var track = document.createElement('div'); track.className = 'rail-track';
        RAIL_LABELS.forEach(function (lb, i) {
          if (i > 0) { var lk = document.createElement('div'); lk.className = 'rail-link'; track.appendChild(lk); railLinks.push(lk); }
          var nd = document.createElement('div'); nd.className = 'rail-node';
          nd.innerHTML = '<div class="rail-dot">' + CHECK_SVG + '</div><div class="rail-lbl">' + lb + '</div>';
          track.appendChild(nd); railNodes.push(nd);
        });
        rail.appendChild(track);
        var cap = document.createElement('div'); cap.className = 'rail-cap';
        STEPS_COPY.forEach(function (sc) {
          var d = document.createElement('div'); d.className = 'hstep';
          d.innerHTML = '<span class="he">' + sc[0] + '</span><div class="ht">' + sc[1] + '</div>';
          cap.appendChild(d); stepEls.push(d);
        });
        rail.appendChild(cap);
        stepsWrap.appendChild(rail);
        stageEl.appendChild(stepsWrap);
        railWrap = stepsWrap; railCap = cap; // some até o phone assentar (sem poluir a abertura grande)
        if (!liteHero) {
          // quickSetter não aceita o shorthand 'scale' — compõe scaleX+scaleY
          var setSX = gsap.quickSetter(rigEl, 'scaleX'), setSY = gsap.quickSetter(rigEl, 'scaleY');
          setRigS = function (v) { setSX(v); setSY(v); };
          setRigX = gsap.quickSetter(rigEl, 'x', 'px');
          setRigY = gsap.quickSetter(rigEl, 'y', 'px');
          setShNear = shNear && gsap.quickSetter(shNear, 'opacity');
          setShFar = shFar && gsap.quickSetter(shFar, 'opacity');
        }
      }
    } else html.classList.add('mo-hero-sticky');

    measureHero();
    applyBeat(0, true);
    hero.ok = true;
    // snap da pose pro estado do scroll atual (reload/âncora no meio = idempotente)
    if (hero.tier === 2 && rigEl) {
      var t0 = poseTargets(effPNow());
      rigCur = { s: t0.s, x: t0.x, y: t0.y, sh: t0.sh };
      writeRig(rigCur, 0);
    }
    return hero.tier;
  }
  /* alvo da pose do rig em função do progresso efetivo do trilho */
  function poseTargets(effP) {
    var k = clampN(0, effP / ACT, 1), e = smooth(k);
    // respiro na ENTRADA (mobile/tablet): empurra o celular grande p/ baixo no scroll 0
    // (y de entrada era 0 -> topo do celular colava no hero-trust); some conforme docka
    var entryY = lvw() < 1080 ? 30 : 0;
    return { s: 1 + (POSE.s - 1) * e, x: POSE.x * e, y: entryY + (POSE.y - entryY) * e, sh: e, phase: k };
  }
  function effPNow() {
    var p = trackP(heroEl);
    return (p - hero.pStart) / (0.97 - hero.pStart);
  }
  function writeRig(v, driftY, translateOnly) {
    if (liteHero || !setRigS) return;
    setRigX(v.x); setRigY(v.y + (driftY || 0)); // translate é barato (sem re-raster)
    if (translateOnly) return;
    setRigS(v.s);
    if (setShNear) setShNear(1 - v.sh);
    if (setShFar) setShFar(v.sh);
  }
  /* pose assentada por breakpoint (+ CSS vars pro renderer discreto degrade/lite) */
  function measurePose() {
    if (hero.tier !== 2 || !rigEl) return;
    var w = lvw();
    if (w >= 1080) {
      POSE = { s: 0.72, x: stageEl.clientWidth * 0.25, y: 0 };
    } else {
      // mobile/tablet: phone PREENCHE e CENTRALIZA entre a faixa do trilho (topo) e o nome da fase (rodapé)
      // — escala adapta à altura real do palco (que agora ocupa a tela): some o branco do rodapé
      var stageH = stageEl.clientHeight || 640;
      var phoneH = (w < 760) ? 620 : 700;
      var topBand = 78, botBand = 98, gap = 18;
      var avail = stageH - topBand - botBand;
      var s = Math.max(0.62, Math.min(0.86, (avail - gap) / phoneH));
      var y = topBand + Math.max(0, (avail - phoneH * s) / 2);
      POSE = { s: s, x: 0, y: y };
    }
    rigEl.style.setProperty('--ph-s', POSE.s);
    rigEl.style.setProperty('--ph-x', POSE.x + 'px');
    rigEl.style.setProperty('--ph-y', POSE.y + 'px');
  }
  function measureHero() {
    if (!hero.ok && !heroEl) return;
    measurePose();
    var heroR = heroEl.getBoundingClientRect();
    var total = heroR.height - vh();
    if (total <= 0) { hero.pStart = 0; return; }
    var stickTop, stickEl;
    if (hero.tier === 2) {
      // espelho do CSS v3 (sticky sempre no stage)
      var w2 = lvw(), h2 = vh();
      // mobile/tablet: palco fixo logo abaixo do nav (espelha o CSS top) e ocupa a tela
      if (w2 < 760) stickTop = 80;
      else if (w2 < 1080) stickTop = 88;
      else stickTop = clampN(40, (h2 - (h2 < 900 ? 690 : 760)) / 2, 120);
      stickEl = stageEl;
    } else {
      stickTop = lvw() < 1080
        ? Math.min(140, Math.max(64, (vh() - 640) / 2))
        : (vh() - 660) / 2;
      stickEl = lvw() < 1080 ? stageEl : qs('.hero > .wrap');
    }
    // sticky engajado desloca gBCR E offsetTop — neutraliza por UM reflow
    // síncrono (set+measure+restore nunca pinta; sem flash) pra medir a
    // posição NATURAL mesmo quando o boot acontece no meio do trilho
    var prevPos = stickEl.style.position;
    stickEl.style.position = 'static';
    var offsetInHero = stickEl.getBoundingClientRect().top - heroEl.getBoundingClientRect().top;
    stickEl.style.position = prevPos;
    hero.pStart = Math.min(0.5, Math.max(0, (offsetInHero - stickTop) / total));
  }
  /* FLIP do feed: o push-up do chat (bottom-anchor) é layout shift de verdade —
     compensa com transform e anima de volta a zero (transform não conta CLS
     e o empurrão fica suave em vez de seco) */
  function flipFeed(mutate, fast) {
    if (!feedEl) { mutate(); return; }
    // referência = msgs visíveis ANTES; usa a primeira que continua visível DEPOIS
    var refs = [], tops = [], i;
    for (i = 0; i < feedMsgs.length; i++) if (feedMsgs[i].classList.contains('on')) { refs.push(feedMsgs[i]); tops.push(feedMsgs[i].getBoundingClientRect().top); }
    mutate();
    var d = null;
    for (i = 0; i < refs.length; i++) if (refs[i].classList.contains('on')) { d = refs[i].getBoundingClientRect().top - tops[i]; break; }
    if (d !== null && Math.abs(d) > 1 && Math.abs(d) < 500) {
      feedEl.style.transition = 'none';
      feedEl.style.transform = 'translateY(' + (-d).toFixed(1) + 'px)';
      void feedEl.offsetWidth; // commit do estado compensado no MESMO frame (zero shift renderizado)
      feedEl.style.transition = 'transform ' + (fast ? '.15s ease-out' : '.32s cubic-bezier(.22,.9,.3,1)');
      feedEl.style.transform = 'translateY(0)';
    }
  }
  function applyBeat(b, fast) {
    var bt = BEATS[b];
    if (fast) { html.classList.add('mo-fast'); perfMaskUntil = performance.now() + 600; }
    flipFeed(function () {
      feedMsgs.forEach(function (mss, i) { mss.classList.toggle('on', i < bt.m); });
      typThem.classList.toggle('on', bt.typ === 'them');
      typMe.classList.toggle('on', bt.typ === 'me');
      // typing fica DEPOIS da última msg visível no fluxo do chat
      var typEl = bt.typ === 'them' ? typThem : bt.typ === 'me' ? typMe : null;
      if (typEl && typEl !== typEl.parentNode.lastElementChild) typEl.parentNode.appendChild(typEl);
      // recibos: toda msg "me" visível vira ✓✓ azul quando já há msg depois dela (lida); senão ✓
      for (var ti = 0; ti < feedMsgs.length; ti++) {
        if (!SEQ[ti] || SEQ[ti].k !== 'me' || ti >= bt.m) continue;
        setTick(feedMsgs[ti], bt.m > ti + 1 ? 'b' : 'v');
      }
      // separador de data + badge ouro (elementos nativos de chat)
      if (chipDate) chipDate.classList.toggle('on', !!bt.chip);
      if (chipGold) chipGold.classList.toggle('on', !!bt.gold);
    }, fast);
    if (pbarSub) pbarSub.textContent = bt.typ === 'them' ? 'digitando…' : 'online agora';
    // annotations existentes (drift continua no landing.js)
    if (window.__heroAnnot) for (var s = 0; s < 4; s++) window.__heroAnnot(s, bt.a.indexOf(s) >= 0);
    if (roasEl) roasEl._target = bt.roas ? 1 : 0;
    hero.beat = b;
    if (fast) { void html.offsetWidth; requestAnimationFrame(function () { html.classList.remove('mo-fast'); }); }
  }
  function setTick(msg, state) {
    if (!msg) return;
    var t = qs('.tick', msg); if (!t) return;
    t.innerHTML = state === 'b' ? TICK.two : TICK.one; // 'b' = lido (✓✓ azul); senão ✓ cinza
    t.classList.toggle('blue', state === 'b');
  }
  function setStep(si) {
    if (si === hero.stepIdx) return;
    hero.stepIdx = si;
    for (var i = 0; i < stepEls.length; i++) stepEls[i].classList.toggle('on', i === si - 1);
    // trilho: nós 0..si-2 concluídos, si-1 ativo; links idem
    for (var n = 0; n < railNodes.length; n++) {
      railNodes[n].classList.toggle('done', n < si - 1);
      railNodes[n].classList.toggle('active', n === si - 1);
    }
    for (var l = 0; l < railLinks.length; l++) railLinks[l].classList.toggle('fill', l < si - 1);
  }
  /* renderer discreto (lowEnd/degrade): 3 poses por classe, transition CSS */
  function renderRigLite(effP, b) {
    if (!rigEl) return;
    var cls = effP < ACT * 0.35 ? 'ph-big' : effP < ACT ? 'ph-mid' : 'ph-dock';
    if (cls !== lastPoseCls) {
      if (lastPoseCls) rigEl.classList.remove(lastPoseCls);
      rigEl.classList.add(cls); lastPoseCls = cls;
    }
    if (railWrap) railWrap.classList.toggle('rail-show', effP >= ACT);
    setStep(effP >= ACT ? (BEATS[b].step || 0) : 0);
  }
  function renderHero() {
    if (!hero.ok || degraded) return;
    var p = trackP(heroEl);
    var effP = (p - hero.pStart) / (0.97 - hero.pStart);
    /* aurora decorativa: desliza p/ cima conforme o scroll (parallax leve; blobs derivam no CSS).
       desktop ≥1080 a aurora é display:none — não escreve transform (evita custo morto) */
    if (auroraEl && effP <= 1.2 && lvw() < 1080) auroraEl.style.transform = 'translate3d(0,' + (clampN(0, effP, 1.05) * -56).toFixed(1) + 'px,0)';
    /* tier 2: beats começam com o ato já em andamento (8% de headroom) */
    var bp = hero.tier === 2 ? clampN(0, (effP - 0.08) / 0.87, 1) : clampN(0, effP, 1);
    var raw = bp * BMAX;
    var b = hero.beat;
    while (b < BMAX && raw > b + 0.55) b++;
    while (b > 0 && raw < b - 0.55) b--;
    if (hero.wm > 0) { if (raw >= hero.wm) hero.wm = 0; else b = Math.max(b, hero.wm); }
    if (b !== hero.beat) applyBeat(b, Math.abs(b - hero.beat) >= 3);

    if (hero.tier === 2) {
      if (liteHero) { renderRigLite(clampN(0, effP, 2), b); return; }
      /* compositor: escritor único do rig (lerp nos VALORES, nunca no scroll) */
      var t = poseTargets(effP);
      if (!rigCur) rigCur = { s: t.s, x: t.x, y: t.y, sh: t.sh };
      var ds = t.s - rigCur.s, dx = t.x - rigCur.x, dy = t.y - rigCur.y, dsh = t.sh - rigCur.sh;
      var settled = Math.abs(ds) < 0.0008 && Math.abs(dx) < 0.15 && Math.abs(dy) < 0.15 && Math.abs(dsh) < 0.004;
      /* drift idle do rig (phone+sombras juntos; landing soltou o phone sob __gtHeroRig) */
      var drift = Math.sin(performance.now() / 2100) * 7;
      if (!settled) {
        if (!actStarted && Math.abs(ds) > 0.002) { actStarted = true; actGraceWins = 2; } // graça do 1º ato no kill-switch
        rigCur.s += ds * 0.16; rigCur.x += dx * 0.16; rigCur.y += dy * 0.16; rigCur.sh += dsh * 0.16;
        writeRig(rigCur, drift);
      } else writeRig(rigCur, drift, true); // assentado: só translate (raster intacto)
      /* glow respira e acompanha a pose (landing soltou via __gtHeroRig) */
      if (glowEl) {
        var nowG = performance.now();
        var g = 1 + Math.sin(nowG / 1500) * 0.08;
        glowEl.style.transform = 'translate(calc(-50% + ' + (rigCur.x * 0.9).toFixed(1) + 'px), calc(-50% + ' + (rigCur.y * 0.5).toFixed(1) + 'px)) scale(' + (g * (0.72 + 0.28 * rigCur.s)).toFixed(3) + ')';
        glowEl.style.opacity = (0.75 + Math.sin(nowG / 1500) * 0.18).toFixed(2);
      }
      /* trilho de fases: só com o phone quase assentado (abertura grande fica limpa) */
      if (railWrap) railWrap.classList.toggle('rail-show', t.phase > STEP_GATE);
      setStep(t.phase > STEP_GATE ? (BEATS[b].step || 0) : 0);
      return;
    }

    /* ----- tier 1 (sticky v2): comportamento atual ----- */
    var exited = p > 0.985;
    if (exited !== hero.exited) {
      hero.exited = exited;
      if (window.__heroAnnot) for (var s = 0; s < 4; s++) window.__heroAnnot(s, !exited && BEATS[hero.beat].a.indexOf(s) >= 0);
      if (roasEl) roasEl._target = (!exited && BEATS[hero.beat].roas) ? 1 : 0;
    }
    if (lvw() >= 1080 && copySet) copySet(clampN(0, effP, 1));
  }
  var copySet = null;
  function initHeroParallax() {
    if (lvw() < 1080 || !hero.ok) return;
    var els = ['.hero-kicker', '.hero h1', '.hero .lead', '.hero-cta', '.hero-trust'].map(function (s) { return qs(s); }).filter(Boolean);
    var setters = els.map(function (el) { return gsap.quickSetter(el, 'y', 'px'); });
    copySet = function (k) { setters.forEach(function (st, i) { st(-k * (8 + i * 6)); }); };
  }
  /* autoplay pra quem não scrolla: avança os beats; scroll real assume com watermark */
  var lastScrollT = performance.now(), lastY = window.scrollY;
  function heroAutoplay(now) {
    if (!hero.ok || degraded || document.hidden) return;
    if (now - lastScrollT < 3000) return;
    var p = trackP(heroEl);
    if (p > 0.4 || hero.beat >= 8) return;
    if (now - hero.lastAuto < 1150) return;
    hero.lastAuto = now;
    applyBeat(hero.beat + 1, false);
    hero.wm = hero.beat;
  }

  /* ================= VIRADA — 12 meses no slider existente ================= */
  var virada = { ok: false, el: null, idx: -1, userDrove: false };
  function initVirada() {
    virada.el = qs('#virada');
    var slider = qs('#ba-slider');
    if (!virada.el || !slider || !window.__baRender) throw new Error('virada: âncoras ausentes');
    if (lvw() < 360 || vh() < 700) return false; // telas muito pequenas: autoplay atual
    html.classList.add('mo-virada');
    window.__baExt = true; // desliga o autoplay do landing.js (guard já existe)
    ['pointerdown', 'keydown', 'input'].forEach(function (ev) {
      slider.addEventListener(ev, function () { virada.userDrove = true; });
    });
    virada.ok = true;
    return true;
  }
  function renderVirada() {
    if (!virada.ok || degraded || virada.userDrove) return;
    var p = trackP(virada.el);
    if (p <= 0 || !window.__baRender) return;
    var ep = Math.min(1, Math.max(0, (p - 0.03) / 0.9));
    window.__baRender(ep);
    var idx = Math.round(ep * 11);
    if (idx !== virada.idx) {
      virada.idx = idx;
      var mEl = qs('#ba-month'), stage = qs('.ba-stage');
      if (mEl) { mEl.classList.remove('tick'); void mEl.offsetWidth; mEl.classList.add('tick'); }
      if (stage) { stage.classList.add('pulse'); setTimeout(function () { stage.classList.remove('pulse'); }, 200); }
    }
  }

  /* ================= seções: triggers + classes ================= */
  function onceTrigger(triggerEl, start, fn, revFn) {
    return ScrollTrigger.create({
      trigger: triggerEl, start: start,
      onEnter: fn,
      onLeaveBack: revFn || null,
    });
  }
  function classTrigger(triggerEl, classEl, start) {
    return onceTrigger(triggerEl, start || 'top 78%',
      function () { classEl.classList.add('go'); },
      function () { classEl.classList.remove('go'); });
  }

  var PAIN_RZ = [-2, 1.6, -1.2]; // rotação residual = o caos ainda existe
  function initPain() {
    var grid = qs('.pain-grid'), pain = qs('.pain'), close = qs('.pain-close');
    if (!grid || !pain) throw new Error('pain: âncoras ausentes');
    pain.setAttribute('data-mo', '');
    var cards = qsa('.pain-card', grid);
    cards.forEach(function (c, i) { c.dataset.rz = String(PAIN_RZ[i] || 0); });
    classTrigger(grid, grid, 'top 78%');
    if (close) onceTrigger(close, 'top 84%',
      function () {
        pain.classList.add('cured');
        cards.forEach(function (c) { c.dataset.rz = '0'; });
        // cards já tomados pelo tilt (mo-settled) curam via GSAP (CSS cuida do resto)
        var settled = cards.filter(function (c) { return c.classList.contains('mo-settled'); });
        if (settled.length) gsap.to(settled, { rotationZ: 0, duration: 0.7, ease: 'back.out(1.4)', stagger: 0.08 });
      },
      function () {
        pain.classList.remove('cured');
        cards.forEach(function (c, i) {
          c.dataset.rz = String(PAIN_RZ[i] || 0);
          if (c.classList.contains('mo-settled')) gsap.to(c, { rotationZ: PAIN_RZ[i] || 0, duration: 0.5, ease: 'power2.out' });
        });
      });
  }

  function initPillars() {
    var pillars = qsa('#pilares .pillar');
    if (!pillars.length) throw new Error('pilares: âncoras ausentes');
    qs('#pilares').setAttribute('data-mo', '');
    // hosts das demos (escopa as cascatas CSS no pilar certo)
    if (pillars[0]) pillars[0].classList.add('mo-bars-host');
    if (pillars[2]) pillars[2].classList.add('mo-steps-host');
    pillars.forEach(function (pil, idx) {
      var done = { count: false };
      onceTrigger(pil, 'top 72%', function () {
        pil.classList.add('go');
        if (idx === 0) { // ATRAIR: barras + 410/305
          pil.classList.add('bars');
          if (!done.count) {
            done.count = true;
            qsa('[data-jcount]', pil).forEach(function (el) {
              var target = parseInt(el.getAttribute('data-jcount'), 10);
              el.textContent = '0';
              countUp(el, target, { dur: 1.1, onDone: function () {
                gsap.fromTo(el, { scale: 1.12 }, { scale: 1, duration: 0.5, ease: 'back.out(2)', clearProps: 'transform' });
              } });
            });
          }
        }
        if (idx === 1) { // ATENDER: typing → chat
          var typ = qs('.mo-typing', pil);
          if (typ && !pil.classList.contains('chat')) {
            typ.classList.add('on');
            setTimeout(function () {
              typ.classList.remove('on');
              if (pil.classList.contains('go')) pil.classList.add('chat');
            }, 650);
          } else pil.classList.add('chat');
        }
        if (idx === 2) pil.classList.add('steps'); // MEDIR: cascata
      }, function () {
        pil.classList.remove('go', 'bars', 'chat', 'steps');
        var typ = qs('.mo-typing', pil); if (typ) typ.classList.remove('on');
      });
    });
    // prepara ATRAIR (valores finais ficam no HTML até a hora de contar)
    qsa('.pvis > div > div > div:nth-child(2)', pillars[0]).forEach(function (el) {
      var v = el.textContent.trim();
      if (/^\d+$/.test(v)) el.setAttribute('data-jcount', v);
    });
    // MEDIR: emojis da jornada levitam (embrulho estrutural, gate .mo-idle)
    if (pillars[2]) qsa('.pvis > div > div', pillars[2]).forEach(wrapLeadingEmoji);
    // prepara ATENDER: typing + tag no resumo (UI nativa de chat)
    var chat = qs('#pilares .pillar.rev .pvis > div');
    if (chat) {
      var sum = chat.lastElementChild; if (sum) sum.classList.add('ia-sum');
      var typ = document.createElement('div');
      typ.className = 'mo-typing'; typ.innerHTML = '<i></i><i></i><i></i>';
      chat.insertBefore(typ, chat.firstChild);
    }
  }

  var sysST = null;
  function initSistema() {
    var win = qs('.sys-window'), outer = qs('.sys-frame-outer'), sec = qs('.sys-sec');
    if (!win || !outer) throw new Error('sistema: âncoras ausentes');
    if (sec) sec.setAttribute('data-mo', '');
    // a janela levanta da mesa: scrub na chegada; ao assentar, transform some (iframe limpo)
    var tween = gsap.fromTo(win, { rotateX: 10, y: 48, scale: 0.88, opacity: 0.35 }, {
      rotateX: 0, y: 0, scale: 1, opacity: 1, ease: 'none',
      scrollTrigger: {
        trigger: outer, start: 'top 92%', end: 'top 40%', scrub: 0.5,
        onEnter: function () { win.classList.add('go'); if (sec) sec.classList.add('go'); },
        onLeave: function () {
          gsap.set(win, { clearProps: 'transform,opacity' });
          if (sysST) { sysST.kill(); sysST = null; }
        },
      },
    });
    sysST = tween.scrollTrigger;
  }

  function initExplica() {
    var acc = qs('#accordion');
    if (!acc) throw new Error('explica: âncoras ausentes');
    qs('.explain-sec').setAttribute('data-mo', '');
    classTrigger(acc, acc, 'top 80%');
    // accordion muda a altura da página: refresh barato (substitui o rebuild da v1)
    qsa('.acc-head', acc).forEach(function (h) {
      h.addEventListener('click', function () { setTimeout(function () { ScrollTrigger.refresh(); measureHero(); }, 420); });
    });
  }

  function initCalc() {
    var sec = qs('#calculadora');
    if (!sec) throw new Error('calc: âncoras ausentes');
    sec.setAttribute('data-mo', '');
    classTrigger(sec, sec, 'top 80%');
    // causa-efeito a cada input (a ferramenta é do usuário; scroll nunca toca)
    var lastSpring = 0;
    qsa('.calc-inputs input, #cf-invest').forEach(function (inp) {
      inp.addEventListener('input', function () {
        var t = Date.now(); if (t - lastSpring < 160) return; lastSpring = t;
        var mv = qs('.calc-multi-val');
        if (mv) gsap.fromTo(mv, { scale: 1.1 }, { scale: 1, duration: 0.6, ease: 'elastic.out(1,.5)' });
        var hi = qs('.calc-m-hi');
        if (hi) { hi.classList.remove('mo-flash'); void hi.offsetWidth; hi.classList.add('mo-flash'); }
      });
    });
  }

  function initGps() {
    var grid = qs('.gps-grid'), bullets = qs('.gps-bullets');
    if (!grid || !bullets) throw new Error('gps: âncoras ausentes');
    qs('.gps').setAttribute('data-mo', '');
    onceTrigger(grid, 'top 76%', function () {
      grid.classList.add('go');
      gsap.fromTo(qsa('.b', bullets), { y: -18, scale: 0.6, opacity: 0 },
        { y: 0, scale: 1, opacity: 1, duration: 0.55, stagger: 0.09, ease: 'back.out(1.9)', overwrite: 'auto' });
    }, function () {
      grid.classList.remove('go');
      gsap.set(qsa('.b', bullets), { clearProps: 'all' });
    });
  }

  var mapDone = false;
  function initMapa() {
    var stage = qs('#mapStage'), sec = qs('.map-sec');
    if (!stage || !sec) throw new Error('mapa: âncoras ausentes');
    sec.setAttribute('data-mo', '');
    classTrigger(sec, sec, 'top 85%');
    var arcs = qsa('.arc', stage);
    var lens = arcs.map(function (a) {
      var mm = (a.getAttribute('style') || '').match(/--len:\s*(\d+)/);
      return mm ? parseFloat(mm[1]) : 600;
    });
    // arcos puxados pelo scroll (reversível) — em leque, janelas sobrepostas
    var tl = gsap.timeline({
      scrollTrigger: { trigger: stage, start: 'top 88%', end: 'center 42%', scrub: 0.5 },
    });
    arcs.forEach(function (a, i) {
      tl.fromTo(a, { strokeDashoffset: lens[i] }, { strokeDashoffset: 0, duration: 0.5, ease: 'power1.inOut' }, i * 0.11);
    });
    // dots + contagem dos widgets: 1x, quando o leque está quase aberto
    onceTrigger(stage, 'top 55%', function () {
      if (mapDone) return; mapDone = true;
      qsa('svg circle[fill="#15dba8"]', stage).forEach(function (c, i) {
        gsap.fromTo(c, { scale: 0, transformOrigin: 'center', transformBox: 'fill-box' },
          { scale: 1, duration: 0.5, delay: 0.2 + i * 0.12, ease: 'back.out(2.5)' });
      });
      qsa('.map-widget b', stage.parentNode === sec ? sec : stage).forEach(function (b) {
        var mtxt = b.textContent.trim().match(/^\+?([\d.]+)$/);
        if (mtxt) countUp(b, parseInt(mtxt[1].replace(/\./g, ''), 10), { dur: 1.4, prefix: '+', loc: true });
      });
    });
  }

  function initConf() {
    var rows = qs('.conf-rows');
    if (!rows) throw new Error('confeccao: âncoras ausentes');
    qs('.conf').setAttribute('data-mo', '');
    classTrigger(rows, rows, 'top 82%');
  }

  function initProva() {
    var grid = qs('.proof-grid');
    if (!grid) throw new Error('prova: âncoras ausentes');
    qs('.proof').setAttribute('data-mo', '');
    classTrigger(grid, grid, 'top 80%');
    // counters autônomos: contam quando o card pousa; 1x = final pra sempre
    var counted = false;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting || counted) return;
        counted = true; io.disconnect();
        qsa('.proof-card', grid).forEach(function (card, i) {
          var span = qs('[data-count]', card);
          if (!span) return;
          var target = parseInt(span.getAttribute('data-count'), 10);
          setTimeout(function () {
            span.textContent = '0';
            var big = qs('.big', card);
            countUp(span, target, { dur: 1.1, onDone: function () {
              if (big) { big.classList.remove('mo-shimmer'); void big.offsetWidth; big.classList.add('mo-shimmer'); }
            } });
            gsap.fromTo(big, { scale: 1.06 }, { scale: 1, duration: 0.45, ease: 'power2.out' });
          }, 280 + i * 160);
        });
      });
    }, { threshold: 0.45 });
    io.observe(grid);
  }

  function splitWords(el, cls) {
    var frag = document.createDocumentFragment(), spans = [];
    [].slice.call(el.childNodes).forEach(function (nd) {
      if (nd.nodeType === 3) {
        nd.textContent.split(/(\s+)/).forEach(function (tk) {
          if (!tk) return;
          if (/^\s+$/.test(tk)) { frag.appendChild(document.createTextNode(' ')); return; }
          var sp = document.createElement('span'); sp.className = cls; sp.textContent = tk;
          frag.appendChild(sp); spans.push(sp);
        });
      } else if (nd.nodeType === 1) {
        var sp2 = document.createElement('span'); sp2.className = cls; sp2.appendChild(nd.cloneNode(true));
        frag.appendChild(sp2); spans.push(sp2);
      }
    });
    el.innerHTML = ''; el.appendChild(frag);
    return spans;
  }

  function initDif() {
    var sec = qs('.dif'), h2 = qs('.dif h2');
    if (!sec || !h2) throw new Error('dif: âncoras ausentes');
    sec.setAttribute('data-mo', '');
    var spans = splitWords(h2, 'mo-w');
    spans.forEach(function (sp) { if (/vaidade/i.test(sp.textContent)) sp.classList.add('dim'); });
    classTrigger(sec, sec, 'top 76%');
  }

  function initCta() {
    var sec = qs('.cta-final'), h2 = qs('.cta-final h2'), btn = qs('.cta-final .btn-cta');
    if (!sec || !h2 || !btn) throw new Error('cta: âncoras ausentes');
    sec.setAttribute('data-mo', '');
    // duas metades EXISTENTES do headline ("Está na hora." + span verde)
    [].slice.call(h2.childNodes).forEach(function (nd) {
      if (nd.nodeType === 3 && nd.textContent.trim()) {
        var sp = document.createElement('span'); sp.className = 'mo-half';
        sp.textContent = nd.textContent; h2.replaceChild(sp, nd);
      } else if (nd.nodeType === 1) nd.classList.add('mo-half');
    });
    var ignited = false;
    onceTrigger(sec, 'top 72%', function () {
      sec.classList.add('go');
      if (!ignited) {
        ignited = true;
        setTimeout(function () {
          if (!sec.classList.contains('go')) return;
          btn.classList.add('mo-shine');
          setTimeout(function () { btn.classList.remove('mo-shine'); btn.classList.add('mo-pulse'); }, 900);
        }, 750);
      } else btn.classList.add('mo-pulse');
    }, function () { sec.classList.remove('go'); btn.classList.remove('mo-pulse', 'mo-shine'); });
    // respiro do glow existente, scrubado
    gsap.fromTo(qs('.cta-glow'), { scale: 0.6, opacity: 0.4 }, {
      scale: 1.25, opacity: 1, ease: 'none',
      scrollTrigger: { trigger: sec, start: 'top 95%', end: 'center 50%', scrub: 0.6 },
    });
    // CTA magnético (desktop/ponteiro fino)
    if (window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
      var qx = gsap.quickTo(btn, 'x', { duration: 0.35, ease: 'power3.out' });
      var qy = gsap.quickTo(btn, 'y', { duration: 0.35, ease: 'power3.out' });
      sec.addEventListener('mousemove', function (e) {
        var r = btn.getBoundingClientRect();
        var dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
        if (Math.hypot(dx, dy) < 150) { qx(dx * 0.25); qy(dy * 0.25); }
        else { qx(0); qy(0); }
      });
      sec.addEventListener('mouseleave', function () { qx(0); qy(0); });
    }
  }

  function initFooter() {
    var f = qs('footer');
    if (!f) return;
    f.setAttribute('data-mo', '');
    classTrigger(f, f, 'top 92%');
  }

  /* ================= motor de cards (ring + spotlight + tilt) ================= */
  var TILT_SEL = ['.pain-card', '.proof-card', '#pilares .pillar .pvis', '.gps-grid .pvis'];
  var RING_SEL = ['.acc-item', '.conf-row', '.calc-inputs', '.calc-result', '.calc-note'];
  var finePtr = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  var idleIO = null;
  function wrapLeadingEmoji(el) {
    var nd = el.firstChild;
    if (!nd || nd.nodeType !== 3) return;
    var m = nd.textContent.match(/^(\S+)\s/);
    if (!m) return;
    var sp = document.createElement('span'); sp.className = 'mo-emo'; sp.textContent = m[1];
    nd.textContent = nd.textContent.slice(m[1].length);
    el.insertBefore(sp, nd);
  }
  function armCard(c, tilt) {
    c.classList.add('mo-card');
    if (!finePtr || lowEnd) return;
    var armed = false;
    // arma no 1º hover: a essa altura a entrance já assentou — o GSAP
    // assume o transform sem brigar com a transition de entrada
    c.addEventListener('pointerenter', function () {
      if (armed || degraded) return; armed = true;
      c.classList.add('mo-settled');
      if (c.dataset.rz) gsap.set(c, { rotation: parseFloat(c.dataset.rz) });
      if (!tilt) return;
      var rx = gsap.quickTo(c, 'rotationX', { duration: 0.4, ease: 'power2.out' });
      var ry = gsap.quickTo(c, 'rotationY', { duration: 0.4, ease: 'power2.out' });
      var qy = gsap.quickTo(c, 'y', { duration: 0.35, ease: 'power2.out' });
      c.addEventListener('pointermove', function (e) {
        if (degraded) return;
        var r = c.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
        ry(px * 6); rx(-py * 5); qy(-5);
        c.style.setProperty('--mx', (px * 100 + 50).toFixed(1) + '%');
        c.style.setProperty('--my', (py * 100 + 50).toFixed(1) + '%');
      });
      c.addEventListener('pointerleave', function () { rx(0); ry(0); qy(0); });
    });
  }
  function initCards() {
    if (!lowEnd && lvw() >= 760) html.classList.add('mo-rich'); // efeitos de paint só onde sobra GPU
    TILT_SEL.forEach(function (sel) { qsa(sel).forEach(function (c) { armCard(c, true); }); });
    RING_SEL.forEach(function (sel) { qsa(sel).forEach(function (c) { armCard(c, false); }); });
    // pais dos cards com tilt precisam de perspective
    qsa('.pain-grid, #pilares .pillar, .gps-grid').forEach(function (p) { p.style.perspective = '1000px'; });
    // loops idle rodam só com a seção visível
    idleIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { e.target.classList.toggle('mo-idle', e.isIntersecting); });
    }, { rootMargin: '60px' });
    qsa('[data-mo]').forEach(function (s) { idleIO.observe(s); });
    // gps: pin levita sem levitar o chip inteiro
    qsa('.gps-bullets .b').forEach(wrapLeadingEmoji);
  }

  /* ================= ritmo de header unificado ================= */
  function initHeads() {
    var secs = qsa('[data-mo]').filter(function (s) { return qs('.sec-head', s); });
    if (!secs.length) return;
    secs.forEach(function (s) {
      onceTrigger(s, 'top 85%',
        function () { s.classList.add('go-head'); },
        function () { s.classList.remove('go-head'); });
    });
    // failsafe: header NUNCA fica invisível (âncora direta / trigger perdido)
    var iv = setInterval(function () {
      var pend = secs.filter(function (s) { return !s.classList.contains('go-head'); });
      if (!pend.length) { clearInterval(iv); return; }
      pend.forEach(function (s) {
        var r = s.getBoundingClientRect();
        if (r.top < vh() * 0.96 && r.bottom > 0) s.classList.add('go-head');
      });
    }, 1500);
  }

  /* ================= extras (já eram conteúdo existente) ================= */
  var mqSet = null;
  function initExtras() {
    // h1 do hero palavra a palavra (junto do reveal do bloco, como na v1)
    var h1 = qs('.hero h1');
    if (h1) {
      var ws = splitWords(h1, 'mo-hw');
      gsap.from(ws, { y: '0.75em', opacity: 0, duration: 0.85, stagger: 0.07, delay: 0.18, ease: 'power3.out', clearProps: 'all' });
    }
    // esteira de LOGOS: velocidade calma e constante — sem inércia de scroll, sem skew
    // (logos não devem entortar nem acelerar; mqSet fica nulo de propósito)
  }
  var boost = 1, skew = 0;
  function renderMarquee() {
    window.__mqBoost = 1;
  }

  /* ================= kill-switch (relativo à cadência base) ================= */
  var perfT0 = performance.now(), frameSum = 0, frameN = 0, slowWins = 0, lastT = 0;
  var baseDts = [], baseDt = 0;
  /* máscaras anti falso-positivo: salto de âncora/reload (applyBeat fast),
     aba oculta (timers throttled) e a 1ª passada do ato da escala (re-raster
     transitório) não contam — lentidão SUSTENTADA continua degradando */
  var perfMaskUntil = 0, actGraceWins = 0, actStarted = false;
  document.addEventListener('visibilitychange', function () { perfMaskUntil = performance.now() + 800; });
  function watchPerf(t) {
    if (lastT) {
      var dt = t - lastT;
      if (dt < 150) {
        if (!baseDt) {
          if (t - perfT0 > 1200) {
            baseDts.push(dt);
            if (baseDts.length >= 48) {
              baseDts.sort(function (a, b) { return a - b; });
              baseDt = baseDts[Math.floor(baseDts.length / 2)];
            }
          }
        } else {
          frameSum += dt; frameN++;
          if (frameN >= 60) {
            var avg = frameSum / frameN;
            frameSum = 0; frameN = 0;
            if (t < perfMaskUntil) { slowWins = 0; }
            else if (actGraceWins > 0) { actGraceWins--; }
            else if (t - perfT0 > 4000 && !degraded) {
              if (avg > Math.max(28, baseDt * 1.7)) { if (++slowWins >= 2) degrade(); }
              else slowWins = 0;
            }
          }
        }
      }
    }
    lastT = t;
  }
  function degrade() {
    degraded = true;
    html.classList.add('mo-degrade');
    window.__baExt = false; // virada volta ao autoplay do landing.js
    window.__mqBoost = 1;
    if (mqSet) mqSet(0);
    // scrubs viram estado final imediato
    if (sysST) { sysST.kill(); gsap.set(qs('.sys-window'), { clearProps: 'transform,opacity' }); qs('.sys-window').classList.add('go'); }
    // hero v3: o GSAP solta o transform do rig (senão inline ganha das classes ph-*)
    if (hero.tier === 2 && rigEl && !liteHero) gsap.set(rigEl, { clearProps: 'transform' });
    // cards: congela loops idle e derruba camadas extras (CSS via .mo-degrade)
    if (idleIO) { idleIO.disconnect(); qsa('.mo-idle').forEach(function (s) { s.classList.remove('mo-idle'); }); }
    // sticky fica (CSS puro; soltar teleporta o usuário); chat passa a passos por scroll throttled
    var lastApply = 0;
    window.addEventListener('scroll', function () {
      var now = performance.now();
      if (now - lastApply < 180) return; lastApply = now;
      if (hero.ok) {
        var p = trackP(heroEl);
        var effP = (p - hero.pStart) / (0.97 - hero.pStart);
        var bp = hero.tier === 2 ? clampN(0, (effP - 0.08) / 0.87, 1) : clampN(0, effP, 1);
        var b = Math.round(bp * BMAX);
        if (b !== hero.beat) applyBeat(b, true);
        if (hero.tier === 2) renderRigLite(clampN(0, effP, 2), b);
      }
    }, { passive: true });
  }

  /* ================= rollback (boot do core falhou) ================= */
  function rollback() {
    window.__gtJourney = false; window.__gtHero = false; window.__baExt = false; window.__gtHeroRig = false;
    html.classList.remove('mo-on', 'mo-hero-sticky', 'mo-hero-v3', 'mo-lite', 'mo-virada', 'mo-degrade', 'mo-fast');
    if (rigEl) { rigEl.classList.remove('ph-big', 'ph-mid', 'ph-dock'); try { gsap.set(rigEl, { clearProps: 'transform' }); } catch (e) { rigEl.style.transform = ''; } }
    qsa('[data-mo]').forEach(function (el) { el.removeAttribute('data-mo'); });
    qsa('.reveal').forEach(function (el) { el.style.opacity = 1; el.style.transform = 'none'; });
  }

  /* ================= boot ================= */
  function start() {
    html.classList.add('mo-on');
    var MODULES = [
      ['hero', function () { if (initHero() === 1) initHeroParallax(); }],
      ['virada', initVirada],
      ['pain', initPain],
      ['pilares', initPillars],
      ['sistema', initSistema],
      ['explica', initExplica],
      ['calc', initCalc],
      ['gps', initGps],
      ['mapa', initMapa],
      ['confeccao', initConf],
      ['prova', initProva],
      ['dif', initDif],
      ['cta', initCta],
      ['footer', initFooter],
      ['extras', initExtras],
      ['cards', initCards],
      ['heads', initHeads],
    ];
    var failed = [];
    MODULES.forEach(function (m) {
      try { m[1](); }
      catch (e) { failed.push(m[0]); if (window.console) console.error('[motion] módulo ' + m[0] + ' falhou (resto segue):', e); }
    });
    window.__gtJourney = true; // guards: counters da prova + arcos do mapa + reveals em [data-mo]

    // aurora: corre só com o stage na tela (pausa no scroll longo = sem custo fora do hero)
    var auEl = qs('#heroAurora'), stEl = qs('.hero-stage');
    if (auEl && stEl && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { auEl.classList.toggle('au-vis', es[0].isIntersecting); }, { rootMargin: '80px' }).observe(stEl);
    }

    gsap.ticker.add(function () {
      frameCount++;
      var now = performance.now();
      if (Math.abs(window.scrollY - lastY) > 3) lastScrollT = now;
      if (!degraded) {
        renderHero();
        renderVirada();
        heroAutoplay(now);
      }
      renderMarquee();
      lastY = window.scrollY;
      watchPerf(now);
      if (frameCount % 240 === 0) measureHero(); // layout acima do hero pode mudar (fontes/iframes)
    });

    // re-medições baratas (sem rebuild pesado: sticky é CSS, progress é gBCR vivo)
    var lastW = lvw();
    window.addEventListener('resize', function () {
      var w = lvw();
      if (w === lastW) return; // barra de URL/teclado só mudam altura
      lastW = w;
      if (window.visualViewport && window.visualViewport.scale > 1.01) return; // pinch-zoom
      measureHero();
      ScrollTrigger.refresh();
    });
    qsa('iframe').forEach(function (f) {
      f.addEventListener('load', function () { setTimeout(function () { ScrollTrigger.refresh(); measureHero(); }, 120); });
    });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ScrollTrigger.refresh(); measureHero(); reAnchor(); });

    // âncora direta (#prova etc.): os trilhos sticky entram DEPOIS do salto
    // inicial do browser — re-ancora enquanto a página assenta (nunca depois)
    var bootT = performance.now();
    function reAnchor() {
      if (!location.hash || performance.now() - bootT > 2500) return;
      var tgt = qs(location.hash);
      if (tgt) tgt.scrollIntoView({ behavior: 'instant', block: 'start' });
    }
    reAnchor();
    setTimeout(reAnchor, 600);

    return failed;
  }

  // handle de inspeção (QA)
  window.__gtMotion = {
    state: function () {
      return {
        booted: html.classList.contains('mo-on'), degraded: degraded, frames: frameCount,
        hero: {
          ok: hero.ok, tier: hero.tier, beat: hero.beat, wm: hero.wm, step: hero.stepIdx,
          pStart: +hero.pStart.toFixed(3), p: hero.ok ? +trackP(heroEl).toFixed(3) : null,
          pose: rigCur ? { s: +rigCur.s.toFixed(3), x: +rigCur.x.toFixed(1), y: +rigCur.y.toFixed(1) } : null,
          lite: liteHero,
        },
        virada: { ok: virada.ok, idx: virada.idx, userDrove: virada.userDrove, p: virada.ok ? +trackP(virada.el).toFixed(3) : null },
        flags: { j: !!window.__gtJourney, h: !!window.__gtHero, ba: !!window.__baExt },
        baseDt: baseDt,
      };
    },
    degrade: degrade,
  };

  try {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
    else start();
  } catch (e) {
    rollback();
    if (window.console) console.error('[motion] boot falhou, página segue sem coreografia:', e);
  }
})();
