(() => {
  const canvas = document.getElementById("ambient");
  if (!canvas) return;

  const ctx = canvas.getContext("2d", { alpha: true });
  let w = 0, h = 0, dpr = 1;

  const mouse = { x: -9999, y: -9999, active: false };
  const particles = [];
  const COUNT = 70;         // sube/baja según rendimiento
  const LINK_DIST = 140;    // distancia de unión
  const SPEED = 0.32;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth = window.innerWidth;
    h = canvas.clientHeight = window.innerHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function rand(min, max){ return Math.random() * (max - min) + min; }

  function seed() {
    particles.length = 0;
    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x: rand(0, w),
        y: rand(0, h),
        vx: rand(-SPEED, SPEED),
        vy: rand(-SPEED, SPEED),
        r: rand(1.2, 2.6),
        a: rand(0.25, 0.85),
        c: Math.random() < 0.5 ? "cyan" : "blue",
      });
    }
  }

  function onMove(e) {
    const t = e.touches ? e.touches[0] : e;
    mouse.x = t.clientX;
    mouse.y = t.clientY;
    mouse.active = true;
  }
  function onLeave() {
    mouse.active = false;
    mouse.x = -9999; mouse.y = -9999;
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);

    // fondo suave (glow)
    const g1 = ctx.createRadialGradient(w*0.2, h*0.2, 0, w*0.2, h*0.2, Math.min(w,h)*0.55);
    g1.addColorStop(0, "rgba(43,108,255,0.22)");
    g1.addColorStop(1, "rgba(43,108,255,0.00)");
    ctx.fillStyle = g1; ctx.fillRect(0,0,w,h);

    const g2 = ctx.createRadialGradient(w*0.8, h*0.35, 0, w*0.8, h*0.35, Math.min(w,h)*0.55);
    g2.addColorStop(0, "rgba(0,212,255,0.16)");
    g2.addColorStop(1, "rgba(0,212,255,0.00)");
    ctx.fillStyle = g2; ctx.fillRect(0,0,w,h);

    // líneas entre partículas
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // movimiento
      p.x += p.vx;
      p.y += p.vy;

      // rebote suave
      if (p.x < -20) p.x = w + 20;
      if (p.x > w + 20) p.x = -20;
      if (p.y < -20) p.y = h + 20;
      if (p.y > h + 20) p.y = -20;

      // efecto mouse: pequeña atracción
      if (mouse.active) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 220) {
          p.x += dx * 0.0009;
          p.y += dy * 0.0009;
        }
      }

      // dibuja punto
      ctx.beginPath();
      ctx.fillStyle = p.c === "cyan"
        ? `rgba(0,212,255,${p.a})`
        : `rgba(43,108,255,${p.a})`;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();

      // conexiones
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.hypot(dx, dy);

        if (dist < LINK_DIST) {
          const alpha = (1 - dist / LINK_DIST) * 0.18;
          ctx.strokeStyle = `rgba(0,212,255,${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", () => { resize(); seed(); });
  window.addEventListener("mousemove", onMove, { passive: true });
  window.addEventListener("touchmove", onMove, { passive: true });
  window.addEventListener("mouseleave", onLeave);

  resize();
  seed();
  draw();
})();
