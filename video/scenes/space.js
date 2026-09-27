/* Global background layer (z 0, whole film). Content scenes can stay
   transparent over it so the backdrop never cuts. Mood is keyframed in
   GTR.TIMELINE.space = { keys: [{t, speed, aurora, danger, grid, dust, dim}] }
   (linear interpolation; speed is integrated so the star-dust flight is
   continuous and deterministic). */
GTR.scene({
  id: 'space',
  build(root, ctx) {
    const { h, lerp, clamp, noise } = GTR;
    const cfg = (GTR.TIMELINE.space && GTR.TIMELINE.space.keys) || [{ t: 0, speed: 0.3, aurora: 1, danger: 0, grid: 0, dust: 1, dim: 0 }];
    const keys = cfg.slice().sort((a, b) => a.t - b.t);
    const DEF = { speed: 0.3, aurora: 1, danger: 0, grid: 0, dust: 1, dim: 0 };
    const val = (t, k) => {
      if (t <= keys[0].t) return keys[0][k] ?? DEF[k];
      for (let i = 0; i < keys.length - 1; i++) {
        const a = keys[i], b = keys[i + 1];
        if (t <= b.t) return lerp(a[k] ?? DEF[k], b[k] ?? DEF[k], GTR.E('sine.inOut')((t - a.t) / (b.t - a.t || 1)));
      }
      return keys[keys.length - 1][k] ?? DEF[k];
    };
    // ∫ speed dt, numerically on a 1/60 s grid, cached — deterministic for any seek order
    const DT = 1 / 60;
    const cum = [0];
    const distAt = (t) => {
      const i = Math.max(0, Math.floor(t / DT));
      while (cum.length <= i + 1) {
        const j = cum.length - 1;
        cum.push(cum[j] + val(j * DT, 'speed') * DT);
      }
      return cum[i] + (cum[i + 1] - cum[i]) * ((t / DT) - i);
    };

    root.style.background = 'radial-gradient(130% 90% at 50% 35%, #0b2b29 0%, #041c1c 45%, #001516 75%, #000c0d 100%)';
    const teal = [
      GTR.glow(root, { x: 520, y: 330, r: 640, color: '21,219,168', a: 0.22 }),
      GTR.glow(root, { x: 1440, y: 720, r: 720, color: '56,204,156', a: 0.18 }),
      GTR.glow(root, { x: 1100, y: 170, r: 540, color: '6,103,103', a: 0.2 }),
    ];
    const red = [
      GTR.glow(root, { x: 700, y: 420, r: 700, color: '239,68,68', a: 0.34 }),
      GTR.glow(root, { x: 1400, y: 760, r: 640, color: '249,115,22', a: 0.2 }),
    ];
    const grid = KIT.gridFloor(root, { top: 600, color: 'rgba(21,219,168,0.18)' });
    const { ctx: c } = GTR.canvas(root);
    const dim = h('div', { style: { position: 'absolute', inset: '0', background: '#000', opacity: 0 } }, root);

    // star dust in a 3D box, camera flies along +z
    const r = GTR.rng('space-dust');
    const N = 260, DEPTH = 3000;
    const pts = Array.from({ length: N }, () => ({ x: (r() - 0.5) * 4200, y: (r() - 0.5) * 2600, z: r() * DEPTH, s: 0.6 + r() * 1.6, tw: r() * 10 }));
    return {
      update(local, t) {
        const au = val(t, 'aurora'), dg = val(t, 'danger'), gr = val(t, 'grid'), du = val(t, 'dust'), dm = val(t, 'dim');
        teal.forEach((b, i) => {
          const dx = noise(i * 3.1, t * 0.07) * 170, dy = noise(i * 7.7 + 11, t * 0.07) * 120;
          b.style.transform = `translate(${dx}px,${dy}px) scale(${1 + noise(i + 5, t * 0.1) * 0.12})`;
          b.style.opacity = au * (1 - dg * 0.8);
        });
        red.forEach((b, i) => {
          const dx = noise(i * 5.3 + 40, t * 0.12) * 200, dy = noise(i * 2.2 + 70, t * 0.12) * 140;
          b.style.transform = `translate(${dx}px,${dy}px)`;
          b.style.opacity = dg;
        });
        grid.el.style.opacity = gr;
        if (gr > 0.001) grid.update(distAt(t) * 400);
        dim.style.opacity = dm;
        c.clearRect(0, 0, 1920, 1080);
        if (du > 0.001) {
          const d = distAt(t) * 900;
          const F = 900;
          for (const q of pts) {
            let z = (q.z - d) % DEPTH;
            if (z < 0) z += DEPTH;
            z += 40;
            const sx = 960 + (q.x / z) * F, sy = 540 + (q.y / z) * F;
            if (sx < -20 || sx > 1940 || sy < -20 || sy > 1100) continue;
            const near = clamp(1 - z / DEPTH);
            const a = du * (0.15 + near * 0.85) * (0.55 + 0.3 * Math.sin(t * 2 + q.tw));
            const rad = q.s * (0.4 + near * 2.2);
            const col = dg > 0.5 ? '255,140,120' : '21,219,168';
            c.fillStyle = `rgba(${col},${clamp(a)})`;
            c.beginPath();
            c.arc(sx, sy, rad, 0, Math.PI * 2);
            c.fill();
          }
        }
      },
    };
  },
});
