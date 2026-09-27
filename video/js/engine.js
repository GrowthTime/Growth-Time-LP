/* ============================================================
   GTR motion — engine
   - GTR.scene({id, build(root, ctx)})  registers a scene.
     build() creates DOM inside `root` and returns
       { tl?: gsap.timeline({paused:true}), update?: (local, global) => void }
     Both are driven ONLY by seek(t); never by wall-clock time.
   - GTR.TIMELINE = { duration, fps, scenes:[{id,start,dur,z,pre,post}] }
     set by js/timeline.js — the edit decision list.
   - ctx.cue(name, localT, opts) registers a sound-design cue; the audio
     tool (tools/soundtrack.py) turns cues into SFX hits on the mix.
   Modes:  ?render=1  → headless capture (render tool calls __seek)
           ?t=12.3    → freeze at a time (debug)
           default    → player with audio + scrub bar
   ============================================================ */
(function () {
  const GTR = (window.GTR = window.GTR || {});
  const defs = {};
  const built = [];
  GTR.cues = [];
  GTR.t = 0;

  GTR.scene = (def) => {
    if (!def || !def.id) throw new Error('scene needs an id');
    defs[def.id] = def;
  };

  function makeCtx(entry, root) {
    return {
      id: entry.id,
      W: GTR.W,
      H: GTR.H,
      start: entry.start,
      dur: entry.dur,
      root,
      cue: (name, tLocal, opts = {}) => {
        GTR.cues.push(Object.assign({ t: +(entry.start + tLocal).toFixed(4), name, scene: entry.id }, opts));
      },
      tl: (opts = {}) => gsap.timeline(Object.assign({ paused: true, defaults: { ease: 'power3.out' } }, opts)),
      rand: GTR.rng('scene:' + entry.id),
    };
  }

  GTR.build = async () => {
    const stage = document.getElementById('stage');
    const T = GTR.TIMELINE;
    if (!T) throw new Error('GTR.TIMELINE missing (js/timeline.js)');
    try { await document.fonts.ready; } catch (e) {}
    // make sure every face we use is actually loaded before measuring text
    const faces = ['400 40px "Russo One"', '400 20px Inter', '700 20px Inter', '800 20px Inter', '400 20px "Open Sans"', '700 20px "Open Sans"', '20px "Noto Color Emoji"'];
    await Promise.all(faces.map((f) => document.fonts.load(f, 'AÇãé0😀').catch(() => null)));

    for (const entry of T.scenes) {
      const def = defs[entry.id];
      if (!def) {
        console.warn('[GTR] timeline references missing scene', entry.id);
        continue;
      }
      const root = GTR.h('div', { class: `scene scene-${entry.id}`, 'data-scene': entry.id }, stage);
      root.style.zIndex = entry.z != null ? entry.z : 1;
      const ctx = makeCtx(entry, root);
      let res = {};
      try {
        res = (await def.build(root, ctx)) || {};
      } catch (err) {
        console.error('[GTR] build failed for scene', entry.id, err);
        root.innerHTML = '';
      }
      built.push({ entry, def, root, ctx, tl: res.tl || null, update: res.update || null, active: true,
                   pre: entry.pre || 0, post: entry.post || 0 });
    }
    await Promise.all(GTR.pending);
    GTR.duration = T.duration;
    GTR.fps = T.fps || 60;
    GTR.cues.sort((a, b) => a.t - b.t);
    GTR.ready = true;
    GTR.seek(0);
  };

  GTR.seek = (t) => {
    GTR.t = t;
    for (const s of built) {
      const local = t - s.entry.start;
      const active = local >= -s.pre && local < s.entry.dur + s.post;
      if (active !== s.active) {
        s.root.style.display = active ? '' : 'none';
        s.active = active;
      }
      if (!active) continue;
      try {
        if (s.tl) s.tl.seek(Math.max(0, local), false);
        if (s.update) s.update(local, t);
      } catch (err) {
        if (!s.errored) console.error('[GTR] seek failed in scene', s.entry.id, err);
        s.errored = true;
      }
    }
  };

  GTR.list = () => built.map((s) => ({ id: s.entry.id, start: s.entry.start, dur: s.entry.dur, z: s.entry.z }));

  /* ---------------- boot ---------------- */
  const params = new URLSearchParams(location.search);
  const RENDER = params.has('render');
  // the render tool waits on this
  window.__gtr = { ready: false };
  window.__seek = (t) => GTR.seek(t);

  function fit() {
    if (RENDER) return;
    const stage = document.getElementById('stage');
    const s = Math.min(window.innerWidth / GTR.W, window.innerHeight / GTR.H);
    stage.style.transform = `scale(${s})`;
  }

  async function boot() {
    if (RENDER) {
      document.body.classList.add('render');
      const a = document.getElementById('soundtrack');
      if (a) a.remove();
    }
    gsap.ticker.lagSmoothing(0);
    fit();
    window.addEventListener('resize', fit);
    await GTR.build();
    window.__gtr = { ready: true, duration: GTR.duration, fps: GTR.fps, cues: GTR.cues, scenes: GTR.list(), music: GTR.TIMELINE.music || null };
    if (RENDER) return;
    if (params.has('t')) {
      GTR.seek(parseFloat(params.get('t')) || 0);
      document.body.classList.add('started', 'paused');
      return;
    }
    player();
  }

  /* ---------------- interactive player ---------------- */
  function player() {
    const audio = document.getElementById('soundtrack');
    const scrub = document.getElementById('scrub');
    const timeEl = document.getElementById('time');
    const btn = document.getElementById('playBtn');
    const overlay = document.getElementById('startOverlay');
    scrub.max = GTR.duration;
    scrub.step = 1 / 60;
    let playing = false;
    let t0 = 0, wall0 = 0;
    let hasAudio = false;
    if (audio && audio.dataset.src) {
      hasAudio = true;
      audio.addEventListener('error', () => { hasAudio = false; });
      audio.src = audio.dataset.src;
    }

    const now = () => performance.now() / 1000;
    const current = () => (playing ? (hasAudio && !audio.paused ? audio.currentTime : t0 + (now() - wall0)) : t0);
    const iconPlay = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4v16l13-8z"/></svg>';
    const iconPause = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg>';

    function setPlaying(v) {
      if (v === playing) return;
      if (v) {
        if (t0 >= GTR.duration - 0.05) t0 = 0;
        wall0 = now();
        if (hasAudio) {
          audio.currentTime = t0;
          audio.play().catch(() => { hasAudio = false; });
        }
      } else {
        t0 = current();
        if (hasAudio) audio.pause();
      }
      playing = v;
      btn.innerHTML = v ? iconPause : iconPlay;
      btn.setAttribute('aria-label', v ? 'Pausar' : 'Reproduzir');
      document.body.classList.toggle('paused', !v);
    }
    function seekTo(t) {
      t0 = Math.max(0, Math.min(GTR.duration, t));
      wall0 = now();
      if (hasAudio) audio.currentTime = t0;
      GTR.seek(t0);
    }
    function loop() {
      let t = current();
      if (playing && t >= GTR.duration) {
        t = GTR.duration;
        setPlaying(false);
        t0 = GTR.duration;
      }
      if (playing) GTR.seek(t);
      scrub.value = t;
      timeEl.textContent = `${GTR.fmt.time(t)} / ${GTR.fmt.time(GTR.duration)}`;
      requestAnimationFrame(loop);
    }
    btn.innerHTML = iconPlay;
    btn.addEventListener('click', () => setPlaying(!playing));
    scrub.addEventListener('input', () => seekTo(parseFloat(scrub.value)));
    overlay.addEventListener('click', () => {
      document.body.classList.add('started');
      setPlaying(true);
    });
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space') { e.preventDefault(); document.body.classList.add('started'); setPlaying(!playing); }
      if (e.code === 'ArrowRight') seekTo(current() + (e.shiftKey ? 5 : 1));
      if (e.code === 'ArrowLeft') seekTo(current() - (e.shiftKey ? 5 : 1));
    });
    document.body.classList.add('paused');
    requestAnimationFrame(loop);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
