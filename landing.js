/* Growth Time — landing interactions (mobile-first, facilpay-dynamic) */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var vh = function () { return window.innerHeight || document.documentElement.clientHeight; };
  var now = function () { return performance.now(); };

  /* ---------- NAV ---------- */
  var nav = document.getElementById('nav');
  function onNav() { nav.classList.toggle('scrolled', window.scrollY > 24); }

  /* ---------- Marquee (rAF) ---------- */
  var items = ['API oficial Meta', 'Confecção & Atacado', 'Tráfego Pago', 'Agentes de IA', 'Disparo em massa', 'CRM no WhatsApp', 'ROAS rastreável', 'Moda Feminina', 'Calçados', 'Semijoias', 'Cosméticos', 'Multi-nicho'];
  var track = document.getElementById('marquee');
  if (track) {
    var h = items.map(function (t) { return '<span class="it">' + t + '</span>'; }).join('');
    track.innerHTML = h + h;
    var mqW = 0;
    setTimeout(function () { mqW = track.scrollWidth / 2; }, 50);
    if (!reduce) {
      var mq0 = now();
      (function mq(t) {
        if (mqW) { var x = ((t - mq0) * 0.045) % mqW; track.style.transform = 'translateX(' + (-x) + 'px)'; }
        requestAnimationFrame(mq);
      })(mq0);
    }
  }

  /* ---------- Visibility helper ---------- */
  function inView(el, frac) {
    var r = el.getBoundingClientRect();
    return r.top < vh() * (frac == null ? 0.86 : frac) && r.bottom > 0;
  }

  /* ---------- Reveal (rAF tween) ---------- */
  function tweenReveal(el) {
    if (reduce) { el.style.opacity = 1; el.style.transform = 'none'; el.classList.add('in'); return; }
    el.classList.add('in');
    var dm = (el.className.match(/\bd(\d)\b/) || [])[1];
    var delay = dm ? parseInt(dm) * 100 : 0, dur = 720, start = null;
    (function f(t) {
      if (start === null) start = t;
      var e = t - start;
      if (e < delay) { el.style.opacity = 0; requestAnimationFrame(f); return; }
      var k = 1 - Math.pow(1 - Math.min((e - delay) / dur, 1), 3);
      el.style.opacity = k; el.style.transform = 'translateY(' + (26 * (1 - k)).toFixed(1) + 'px)';
      if (k < 1) requestAnimationFrame(f); else { el.style.opacity = ''; el.style.transform = ''; }
    })(null);
  }
  var revs = [].slice.call(document.querySelectorAll('.reveal'));
  function checkReveal() { for (var i = revs.length - 1; i >= 0; i--) if (inView(revs[i])) { tweenReveal(revs[i]); revs.splice(i, 1); } }

  /* ---------- Count-up ---------- */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-count')), suffix = el.getAttribute('data-suffix') || '';
    if (reduce) { el.textContent = target + suffix; return; }
    var dur = 1400, start = now();
    (function tick(t) {
      var p = Math.min((t - start) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    })(now());
  }
  var counters = [].slice.call(document.querySelectorAll('[data-count]'));
  function checkCounters() { for (var i = counters.length - 1; i >= 0; i--) if (inView(counters[i], 0.98)) { animateCount(counters[i]); counters.splice(i, 1); } }

  /* ---------- HERO: phone float + glow + annotations + conversation ---------- */
  var heroPhone = document.querySelector('.hero .phone');
  var feed = document.getElementById('phoneFeed');
  var glow = document.getElementById('glow');
  var annots = [].slice.call(document.querySelectorAll('.annot'));
  // drift params per annotation
  annots.forEach(function (a, i) {
    a._ax = 7 + (i % 3) * 4; a._ay = 9 + (i % 2) * 6; a._ph = i * 1.3; a._sp = 0.0007 + (i % 4) * 0.00018;
    a._op = 0; a._target = a.classList.contains('a-roas') ? 1 : 0;
  });
  var heroStage = document.getElementById('heroStage');
  var h0 = now();
  if (!reduce) (function heroLoop(t) {
    var dt = t - h0;
    var sy = window.scrollY || 0;
    var par = Math.max(-60, -sy * 0.12); // parallax lift
    if (heroPhone) heroPhone.style.transform = 'translateX(-50%) translateY(' + (Math.sin(dt / 2100) * 9 + par * 0.4).toFixed(2) + 'px)';
    if (glow) { var g = 1 + Math.sin(dt / 1500) * 0.08; glow.style.transform = 'translate(-50%,-50%) scale(' + g.toFixed(3) + ')'; glow.style.opacity = (0.75 + Math.sin(dt / 1500) * 0.18).toFixed(2); }
    annots.forEach(function (a) {
      a._op += (a._target - a._op) * 0.08;
      var dx = Math.sin(dt * a._sp + a._ph) * a._ax;
      var dy = Math.cos(dt * a._sp * 1.1 + a._ph) * a._ay + par * 0.55;
      a.style.opacity = a._op.toFixed(3);
      a.style.transform = 'translate(' + dx.toFixed(1) + 'px,' + dy.toFixed(1) + 'px) scale(' + (0.9 + a._op * 0.1).toFixed(3) + ')';
    });
    requestAnimationFrame(heroLoop);
  })(h0);
  else { annots.forEach(function (a) { a.style.opacity = 1; }); }

  // natural WhatsApp conversation (no "I saw the ad" text — that's the external annotation)
  var SEQ = [
    { k: 'them', t: 'Oi! Vocês têm grade no atacado? 👗', at: '12:01', step: 0 },
    { k: 'me', t: 'Oi! 💚 Temos sim — grade P ao GG, mínimo 10 peças', at: '12:01', step: 1 },
    { k: 'them', t: 'Perfeito! Quero fechar 🔥', at: '12:02', step: 2 },
    { k: 'me', t: 'Show! Já montei seu pedido 🚀', at: '12:02', step: 3 }
  ];
  function setAnnot(step, on) { annots.forEach(function (a) { if (a.getAttribute('data-step') == step) a._target = on ? 1 : 0; }); }
  function buildMsg(m) {
    var d = document.createElement('div');
    d.className = 'msg ' + m.k;
    d.innerHTML = m.t + '<span class="meta">' + m.at + (m.k === 'me' ? ' ✓✓' : '') + '</span>';
    d.style.opacity = 0; d.style.transform = 'translateY(10px) scale(.96)';
    return d;
  }
  function popIn(el) {
    var s = null, dur = 420;
    (function f(t) { if (s === null) s = t; var k = 1 - Math.pow(1 - Math.min((t - s) / dur, 1), 3); el.style.opacity = k; el.style.transform = 'translateY(' + (10 * (1 - k)).toFixed(1) + 'px) scale(' + (0.96 + 0.04 * k).toFixed(3) + ')'; if (k < 1) requestAnimationFrame(f); else { el.style.opacity = ''; el.style.transform = ''; } })(null);
  }
  var playing = false, started = false;
  function playPhone() {
    if (!feed) return;
    feed.innerHTML = '';
    annots.forEach(function (a) { if (!a.classList.contains('a-roas')) a._target = 0; });
    var i = 0;
    (function next() {
      if (i >= SEQ.length) { setTimeout(function () { playing = false; if (inView(heroPhone, 0.98)) start2(); }, 3000); return; }
      var m = SEQ[i], el = buildMsg(m); feed.appendChild(el);
      if (reduce) { el.style.opacity = ''; el.style.transform = ''; } else popIn(el);
      setAnnot(m.step, true);
      i++;
      setTimeout(next, i === 1 ? 700 : 1350);
    })();
  }
  function start2() { if (playing) return; playing = true; playPhone(); }
  function checkPhone() {
    if (started || !heroPhone || !feed) return;
    if (inView(heroPhone, 0.95)) {
      started = true;
      if (reduce) { SEQ.forEach(function (m) { var e = buildMsg(m); e.style.opacity = ''; e.style.transform = ''; feed.appendChild(e); setAnnot(m.step, true); }); }
      else start2();
    }
  }

  /* ---------- Embedded system: desktop + mobile frames with toggle ---------- */
  var sysFrame = document.getElementById('sysFrame'), sysVp = document.getElementById('sysViewport');
  var sysPhoneFrame = document.getElementById('sysPhoneFrame'), sysPhoneVp = document.getElementById('sysPhoneViewport');
  var sysDesktop = document.getElementById('sysDesktop'), sysMobile = document.getElementById('sysMobile');
  var sysToggle = document.getElementById('sysToggle'), sysHint = document.getElementById('sysHint');
  var sysFullBtn = document.querySelector('.sys-full-btn');
  var SYS_W = 1240, SYS_H = 760;       // desktop logical
  var SYSM_W = 414, SYSM_H = 820;      // mobile logical
  var device = 'desktop';
  function fitSys() {
    if (device === 'desktop' && sysFrame && sysVp) {
      var w = sysVp.clientWidth, scale = w / SYS_W;
      sysFrame.style.width = SYS_W + 'px'; sysFrame.style.height = SYS_H + 'px';
      sysFrame.style.transform = 'scale(' + scale + ')';
      sysVp.style.height = (SYS_H * scale) + 'px';
    }
    if (device === 'mobile' && sysPhoneFrame && sysPhoneVp) {
      var pw = sysPhoneVp.clientWidth, ps = pw / SYSM_W;
      sysPhoneFrame.style.width = SYSM_W + 'px'; sysPhoneFrame.style.height = SYSM_H + 'px';
      sysPhoneFrame.style.transform = 'scale(' + ps + ')';
      sysPhoneVp.style.height = (SYSM_H * ps) + 'px';
    }
  }
  function setDevice(d) {
    device = d;
    if (d === 'mobile' && sysPhoneFrame && !sysPhoneFrame.src) {
      sysPhoneFrame.src = sysPhoneFrame.getAttribute('data-src');
    }
    if (sysDesktop) sysDesktop.hidden = d !== 'desktop';
    if (sysMobile) sysMobile.hidden = d !== 'mobile';
    if (sysToggle) [].slice.call(sysToggle.children).forEach(function (b) { b.classList.toggle('active', b.getAttribute('data-device') === d); });
    if (sysHint) sysHint.textContent = d === 'mobile' ? '📱 Assim a vendedora usa no celular' : '👆 Navegue pelo Dashboard, Mensagens e Mkt & Ads';
    if (sysFullBtn) sysFullBtn.href = d === 'mobile' ? 'system/index.html?view=mobile' : 'system/index.html';
    requestAnimationFrame(function () { requestAnimationFrame(fitSys); });
  }
  if (sysToggle) [].slice.call(sysToggle.children).forEach(function (b) {
    b.addEventListener('click', function () { setDevice(b.getAttribute('data-device')); });
  });
  if (sysPhoneFrame) sysPhoneFrame.addEventListener('load', fitSys);

  /* ---------- Modo TV embutido: formato 16:9 fixo, escala pelo tamanho ---------- */
  var tvFrame = document.getElementById('accTvFrame'), tvVp = document.getElementById('accTvVp');
  var TV_W = 1280;
  function fitTV() {
    if (!tvFrame || !tvVp) return;
    var w = tvVp.clientWidth; if (!w) return;
    tvFrame.style.transform = 'scale(' + (w / TV_W) + ')';
  }
  if (tvFrame) tvFrame.addEventListener('load', fitTV);

  /* ---------- Map arcs + widget parallax ---------- */
  var mapStage = document.getElementById('mapStage'), mapDone = false;
  function drawArc(a, delay) {
    var len = parseFloat((a.getAttribute('style').match(/--len:\s*(\d+)/) || [])[1]) || 600;
    if (reduce) { a.style.strokeDashoffset = 0; return; }
    var dur = 1200, start = null;
    (function f(t) { if (start === null) start = t; var e = t - start; if (e < delay) { requestAnimationFrame(f); return; } var p = Math.min((e - delay) / dur, 1); a.style.strokeDashoffset = len * Math.pow(1 - p, 3); if (p < 1) requestAnimationFrame(f); })(null);
  }
  function checkMap() {
    if (mapDone || !mapStage) return;
    if (inView(mapStage, 0.7)) { mapDone = true; mapStage.querySelectorAll('.arc').forEach(function (a, i) { drawArc(a, i * 200); }); }
  }
  var mapWidgets = [].slice.call(document.querySelectorAll('.map-widget'));
  if (!reduce && mapStage) (function mw() {
    var r = mapStage.getBoundingClientRect();
    var prog = (vh() - r.top) / (vh() + r.height); // 0..1 as it passes
    mapWidgets.forEach(function (w, i) { w.style.transform = 'translateY(' + ((prog - 0.5) * (6 + i * 3)).toFixed(1) + 'px)'; });
    requestAnimationFrame(mw);
  })();

  /* ---------- Before / After: 12-month evolution scrubber ---------- */
  var slider = document.getElementById('ba-slider'), baPlayed = false, userTouched = false;
  if (slider) {
    var fat = document.getElementById('m-fat'), leads = document.getElementById('m-leads'),
        roas = document.getElementById('m-roas'), resp = document.getElementById('m-resp'),
        lblA = document.getElementById('lbl-antes'), lblD = document.getElementById('lbl-depois'),
        monthEl = document.getElementById('ba-month'), dateEl = document.getElementById('ba-date'),
        scaleEl = document.getElementById('ba-scale'), baStage = document.querySelector('.ba-stage');
    var MONTHS = 12;
    var MES = ['jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez', 'jan', 'fev', 'mar', 'abr', 'mai'];
    var YEAR = [2025, 2025, 2025, 2025, 2025, 2025, 2025, 2026, 2026, 2026, 2026, 2026];
    // build scale dots
    if (scaleEl && !scaleEl.children.length) for (var d = 0; d < MONTHS; d++) scaleEl.appendChild(document.createElement('span'));
    var dots = [].slice.call(scaleEl ? scaleEl.children : []);
    var lerp = function (a, b, t) { return a + (b - a) * t; };
    function render(idx) {
      var t = idx / (MONTHS - 1);
      // smooth growth curve (slow then accelerating)
      var g = Math.pow(t, 1.35);
      fat.textContent = 'R$ ' + Math.round(lerp(18, 620, g)) + ' mil';
      leads.textContent = Math.round(lerp(40, 1850, g)).toLocaleString('pt-BR');
      roas.textContent = lerp(1.2, 7.2, g).toFixed(1).replace('.', ',') + 'x';
      var mins = lerp(240, 0.2, g);
      resp.textContent = mins >= 60 ? (mins / 60).toFixed(1).replace('.', ',') + ' h' : Math.max(1, Math.round(mins)) + ' min';
      var col = t < 0.4 ? '#8a8a86' : '#27ae8f';
      [fat, leads, roas, resp].forEach(function (el) { el.style.color = col; });
      // month + date readout
      monthEl.textContent = 'Mês ' + (idx + 1);
      dateEl.textContent = MES[idx] + ' ' + YEAR[idx];
      lblA.classList.toggle('on', t < 0.5); lblD.classList.toggle('on', t >= 0.5);
      dots.forEach(function (dot, i) { dot.classList.toggle('on', i <= idx); });
    }
    function stop() { userTouched = true; }
    slider.addEventListener('input', function () { stop(); render(parseInt(this.value, 10)); });
    ['pointerdown', 'keydown'].forEach(function (ev) { slider.addEventListener(ev, stop); });
    render(0); window.__baRender = function (p) { render(Math.round(p * (MONTHS - 1))); };
    // animation starts as soon as the stage is on screen — quick play through the year
    window.__checkBA = function () {
      if (baPlayed || !baStage || !inView(baStage, 0.82)) return;
      baPlayed = true;
      if (reduce) { slider.value = MONTHS - 1; render(MONTHS - 1); return; }
      var start = now(), dur = 1700;
      (function play(t) {
        if (userTouched) return;
        var p = Math.min((t - start) / dur, 1);
        var e = 1 - Math.pow(1 - p, 2);
        var idx = Math.round(e * (MONTHS - 1));
        slider.value = idx; render(idx);
        if (p < 1) requestAnimationFrame(play);
      })(now());
    };
  }

  /* ---------- Explainer accordion (rAF height tween) ---------- */
  var accItems = [].slice.call(document.querySelectorAll('.acc-item'));
  accItems.forEach(function (item) {
    var head = item.querySelector('.acc-head');
    var body = item.querySelector('.acc-body');
    var inner = item.querySelector('.acc-inner');
    head.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');
      // close siblings (single-open accordion)
      accItems.forEach(function (o) {
        if (o !== item && o.classList.contains('open')) tweenAcc(o, false);
      });
      tweenAcc(item, !isOpen);
    });
  });
  function tweenAcc(item, open) {
    var body = item.querySelector('.acc-body');
    var inner = item.querySelector('.acc-inner');
    var head = item.querySelector('.acc-head');
    item.classList.toggle('open', open);
    head.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) { var lz = item.querySelector('iframe[data-src]'); if (lz && !lz.src) lz.src = lz.getAttribute('data-src'); requestAnimationFrame(fitTV); }
    var target = open ? inner.offsetHeight : 0;
    var startH = body.offsetHeight;
    if (reduce) { body.style.height = open ? 'auto' : '0px'; return; }
    var start = null, dur = 320;
    (function f(t) {
      if (start === null) start = t;
      var p = Math.min((t - start) / dur, 1);
      var k = 1 - Math.pow(1 - p, 3);
      body.style.height = (startH + (target - startH) * k) + 'px';
      if (p < 1) requestAnimationFrame(f);
      else body.style.height = open ? 'auto' : '0px';
    })(null);
  }
  function tickAll() { onNav(); checkReveal(); checkCounters(); checkMap(); checkPhone(); if (window.__checkBA) window.__checkBA(); }
  window.addEventListener('scroll', tickAll, { passive: true });
  window.addEventListener('resize', function () { tickAll(); fitSys(); fitTV(); });
  fitSys();
  if (sysFrame) sysFrame.addEventListener('load', fitSys);
  var ls = now();
  (function loop(t) { tickAll(); if (t - ls < 8000) requestAnimationFrame(loop); })(ls);
})();

/* ---------- Calculadora de investimento reverso ---------- */
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var invest = $('cf-invest');
  if (!invest) return;
  var fTicket = $('cf-ticket'), fVida = $('cf-vida'), fMargem = $('cf-margem'), fConv = $('cf-conv'),
      fQualif = $('cf-qualif'), fCpc = $('cf-cpc');
  var oInvVal = $('cf-inv-val'), oContatos = $('cf-contatos'), oQual = $('cf-qual'),
      oVendas = $('cf-vendas'), oLtv = $('cf-ltv'), oFat = $('cf-fat'), oLucro = $('cf-lucro'), oSobra = $('cf-sobra'),
      oMulti = $('cf-multi'), oTag = $('cf-tag'), tierBox = $('cf-tier');

  function num(el, def) { var v = parseFloat(el.value); return isFinite(v) ? v : def; }
  function clampPct(v) { return Math.max(0, Math.min(100, v)); }
  function nf(n) { return Math.round(n).toLocaleString('pt-BR'); }
  function brl(n) { return 'R$ ' + Math.round(n).toLocaleString('pt-BR'); }

  // faixas de retorno: [R mínimo, rótulo, cor]
  var TIERS = [
    [3,         'Excelência',    '#2bb673'],
    [2,         'Bom',           '#27ae8f'],
    [1.5,       'Pode melhorar', '#f3b315'],
    [1,         'No limite',     '#bd6b2f'],
    [-Infinity, 'Prejuízo',      '#ef4444']
  ];
  function tierFor(R) { for (var i = 0; i < TIERS.length; i++) if (R >= TIERS[i][0]) return TIERS[i]; return TIERS[4]; }

  function calc() {
    var I = num(invest, 5000);
    var ticket = Math.max(0, num(fTicket, 0));
    var vida = Math.max(1, num(fVida, 1));
    var margem = clampPct(num(fMargem, 0)) / 100;
    var conv = clampPct(num(fConv, 0)) / 100;
    var qualif = clampPct(num(fQualif, 0)) / 100;
    var cpc = Math.max(0, num(fCpc, 0));

    var contatos = cpc > 0 ? I / cpc : 0;
    var qual = contatos * qualif;
    var vendas = qual * conv;
    var ltv = ticket * vida;
    var fat = vendas * ltv;
    var lucro = fat * margem;
    var sobra = lucro - I;
    var R = I > 0 ? lucro / I : 0;

    oInvVal.textContent = brl(I);
    oContatos.textContent = nf(contatos);
    oQual.textContent = nf(qual);
    oVendas.textContent = nf(vendas);
    oLtv.textContent = brl(ltv);
    oFat.textContent = brl(fat);
    oLucro.textContent = brl(lucro);
    oSobra.textContent = (sobra >= 0 ? '+' : '−') + brl(Math.abs(sobra));
    oSobra.style.color = sobra >= 0 ? '#27ae8f' : '#ef4444';

    oMulti.textContent = R.toFixed(1).replace('.', ',');
    var t = tierFor(R);
    oTag.textContent = t[1];
    tierBox.style.setProperty('--tier-col', t[2]);
  }

  [fTicket, fVida, fMargem, fConv, fQualif, fCpc, invest].forEach(function (el) {
    el.addEventListener('input', calc);
  });
  calc();
})();
