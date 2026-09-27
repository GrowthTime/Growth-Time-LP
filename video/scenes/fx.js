/* Global finishing layer (always on top): film grain, vignette and
   cut flashes. Flash times come from GTR.TIMELINE.flashes:
   [{t, color:'255,255,255', a:0.8, dur:0.35}] */
GTR.scene({
  id: 'fx',
  build(root, ctx) {
    const { h } = GTR;
    root.style.pointerEvents = 'none';
    // grain: one pre-baked alpha-noise plate (bigger than the frame), jittered with a
    // compositor-only transform at 24 fps — near-zero cost per frame.
    const PW = 1920 + 256, PH = 1080 + 256;
    const plate = document.createElement('canvas');
    plate.width = PW; plate.height = PH;
    Object.assign(plate.style, { position: 'absolute', left: '-128px', top: '-128px', width: `${PW}px`, height: `${PH}px`, pointerEvents: 'none' });
    {
      const g = plate.getContext('2d');
      const img = g.createImageData(PW, PH);
      const r = GTR.rng('grain');
      for (let i = 0; i < PW * PH; i++) {
        const v = r() - 0.5;
        const c = v > 0 ? 255 : 0;
        img.data[i * 4] = img.data[i * 4 + 1] = img.data[i * 4 + 2] = c;
        img.data[i * 4 + 3] = Math.floor(Math.abs(v) * 2 * 30);
      }
      g.putImageData(img, 0, 0);
    }
    // in render mode grain + vignette are added by ffmpeg (tools/render.mjs) — far cheaper
    const RENDER = document.body.classList.contains('render');
    if (!RENDER) root.appendChild(plate);
    if (!RENDER) h('div', { style: { position: 'absolute', inset: '0', background: 'radial-gradient(140% 110% at 50% 50%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.35) 100%)' } }, root);
    const flash = h('div', { style: { position: 'absolute', inset: '0', opacity: 0 } }, root);
    // discreet disclaimer while demo UI/data is on screen: GTR.TIMELINE.disclaimer = [[t0, t1], ...]
    // small dark pill of its own so it stays legible over light UI panels too
    const note = h('div', { class: 'ui', style: { position: 'absolute', left: '20px', bottom: '16px', padding: '5px 12px', borderRadius: '999px', background: 'rgba(0,21,22,0.55)', fontSize: '14px', fontWeight: 500, letterSpacing: '0.02em', color: 'rgba(255,255,255,0.72)', opacity: 0 } }, root);
    note.textContent = 'Imagens e dados ilustrativos';
    const ranges = GTR.TIMELINE.disclaimer || [];
    const flashes = (GTR.TIMELINE.flashes || []).map((f) => Object.assign({ color: '255,255,255', a: 0.75, dur: 0.35 }, f));
    let lastTile = -1;
    return {
      update(local, t) {
        const fi = Math.floor(t * 24);
        if (!RENDER && fi !== lastTile) {
          lastTile = fi;
          const rr = GTR.rng(fi + 1);
          plate.style.transform = `translate(${Math.floor(rr() * 256) - 128}px, ${Math.floor(rr() * 256) - 128}px)`;
        }
        let a = 0, col = '255,255,255';
        for (const f of flashes) {
          if (t >= f.t && t < f.t + f.dur) {
            const k = 1 - (t - f.t) / f.dur;
            const v = f.a * k * k;
            if (v > a) { a = v; col = f.color; }
          }
        }
        let na = 0;
        for (const [a0, a1] of ranges) na = Math.max(na, GTR.win(t, a0, a1, 0.4, 0.4));
        note.style.opacity = na;
        flash.style.background = `rgb(${col})`;
        flash.style.opacity = a;
        flash.style.display = a > 0.002 ? 'block' : 'none';
        note.style.display = na > 0.002 ? 'block' : 'none';
      },
    };
  },
});
