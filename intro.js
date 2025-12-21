(() => {
  // ✅ Cambia aquí la página a la que quieres entrar
  const REDIRECT_URL = "portafolio.html";

  // Duraciones (ms)
  const AUTO_ENTER_MS = 10000; // 10 segundos antes de entrar
  const TRANSITION_MS = 950;   // debe igualar el CSS de la transición

  const intro = document.getElementById("intro");
  const canvas = document.getElementById("fx");
  const ctx = canvas.getContext("2d", { alpha: true });

  const logoWrap = document.getElementById("logoWrap");
  const enterBtn = document.getElementById("enterBtn");
  const skipBtn = document.getElementById("skipBtn");
  const bar = document.getElementById("bar");
  const typingEl = document.getElementById("typing");

  const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  let W = 0, H = 0;
  let DPR = Math.min(window.devicePixelRatio || 1, 2);
  let particles = [];
  let startTime = performance.now();
  let mouse = { x: 0, y: 0, active: false };
  let entering = false;
  let rafId = 0;

  function ensureTransitionOverlay() {
    // Si no existe en HTML, lo crea automáticamente
    let overlay = document.querySelector(".page-transition");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.className = "page-transition";
      overlay.setAttribute("aria-hidden", "true");
      const ring = document.createElement("div");
      ring.className = "neon-ring";
      overlay.appendChild(ring);
      document.body.appendChild(overlay);
    }
  }

  function resize() {
    W = canvas.clientWidth = window.innerWidth;
    H = canvas.clientHeight = window.innerHeight;
    canvas.width = Math.floor(W * DPR);
    canvas.height = Math.floor(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  function rand(a, b) { return a + Math.random() * (b - a); }

  function getCenter() {
    const r = logoWrap.getBoundingClientRect();
    return {
      cx: r.left + r.width / 2,
      cy: r.top + r.height / 2,
      radius: Math.min(r.width, r.height) * 0.52
    };
  }

  function initParticles() {
    particles.length = 0;
    const { cx, cy, radius } = getCenter();

    const n = prefersReduced ? 60 : 160;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      const ringR = radius + rand(10, 34);

      const tx = cx + Math.cos(a) * ringR;
      const ty = cy + Math.sin(a) * ringR;

      const x = rand(0, W);
      const y = rand(0, H);

      particles.push({
        x, y,
        vx: 0, vy: 0,
        tx, ty,
        a,
        s: rand(0.8, 2.2),
        o: rand(0.35, 0.95),
        hue: rand(200, 340),
      });
    }
  }

  function drawBackgroundGlow() {
    const { cx, cy } = getCenter();
    const g = ctx.createRadialGradient(cx, cy, 10, cx, cy, Math.min(W, H) * 0.5);
    g.addColorStop(0, "rgba(43,108,255,0.12)");
    g.addColorStop(0.5, "rgba(124,58,237,0.08)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }

  function step(t) {
    const elapsed = t - startTime;
    ctx.clearRect(0, 0, W, H);
    drawBackgroundGlow();

    const { cx, cy, radius } = getCenter();

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      const ringR = radius + 18 + (i % 7) * 2.2;
      p.tx = cx + Math.cos(p.a + elapsed * 0.0002) * ringR;
      p.ty = cy + Math.sin(p.a + elapsed * 0.0002) * ringR;

      // spring to target
      const dx = p.tx - p.x;
      const dy = p.ty - p.y;
      p.vx += dx * 0.0032;
      p.vy += dy * 0.0032;

      // mouse repulsion
      if (mouse.active) {
        const mx = mouse.x - p.x;
        const my = mouse.y - p.y;
        const d2 = mx * mx + my * my;
        const r = 120;
        if (d2 < r * r) {
          const f = (1 - d2 / (r * r)) * 0.9;
          const inv = 1 / (Math.sqrt(d2) + 0.001);
          p.vx -= (mx * inv) * f * 1.8;
          p.vy -= (my * inv) * f * 1.8;
        }
      }

      // friction
      p.vx *= 0.86;
      p.vy *= 0.86;

      p.x += p.vx;
      p.y += p.vy;

      // draw particle
      ctx.beginPath();
      ctx.fillStyle = `hsla(${p.hue}, 90%, 65%, ${p.o})`;
      ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2);
      ctx.fill();
    }

    // subtle links (data network)
    if (!prefersReduced) {
      for (let i = 0; i < particles.length; i += 2) {
        const p = particles[i];
        for (let j = i + 6; j < i + 16 && j < particles.length; j++) {
          const q = particles[j];
          const dx = q.x - p.x, dy = q.y - p.y;
          const d = Math.hypot(dx, dy);
          if (d < 80) {
            ctx.strokeStyle = `rgba(255,255,255,${(1 - d / 80) * 0.08})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      }
    }

    // logo tilt
    if (mouse.active && !prefersReduced) {
      const rx = ((mouse.y / H) - 0.5) * -10;
      const ry = ((mouse.x / W) - 0.5) * 10;
      logoWrap.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
    } else {
      logoWrap.style.transform = `rotateX(0deg) rotateY(0deg)`;
    }

    // 🔥 importante: si ya estamos saliendo, NO seguir renderizando
    if (!entering) {
      rafId = requestAnimationFrame(step);
    }
  }

  function typewriter(text, speed = 18) {
    if (prefersReduced) return;
    let i = 0;
    typingEl.textContent = "";
    const tick = () => {
      if (entering) return;
      typingEl.textContent = text.slice(0, i++);
      if (i <= text.length) setTimeout(tick, speed);
    };
    tick();
  }

  function goIn() {
    if (entering) return;
    entering = true;

    // 🔥 clave para que NO se trabe: parar el raf del canvas
    if (rafId) cancelAnimationFrame(rafId);

    // evita tilt raro al final
    mouse.active = false;
    logoWrap.style.transform = `rotateX(0deg) rotateY(0deg)`;

    document.body.classList.add("is-leaving");

    const ms = prefersReduced ? 200 : TRANSITION_MS;
    setTimeout(() => {
      window.location.href = REDIRECT_URL;
    }, ms);
  }

  function startProgress() {
    const t0 = performance.now();
    const tick = (now) => {
      if (entering) return;
      const p = Math.min(1, (now - t0) / AUTO_ENTER_MS);
      bar.style.width = `${Math.floor(p * 100)}%`;
      if (p < 1) requestAnimationFrame(tick);
      else goIn();
    };
    requestAnimationFrame(tick);
  }

  // Events
  window.addEventListener("resize", () => {
    resize();
    initParticles();
  });

  window.addEventListener("mousemove", (e) => {
    if (entering) return;
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  });

  window.addEventListener("mouseleave", () => { mouse.active = false; });

  enterBtn.addEventListener("click", goIn);
  skipBtn.addEventListener("click", goIn);

  // click en cualquier parte para saltar (sin duplicar el click del botón)
  document.addEventListener("click", (e) => {
    if (entering) return;
    const isButton = e.target.closest("button");
    if (!isButton) goIn();
  }, { capture: true });

  // Init
  ensureTransitionOverlay();
  resize();
  initParticles();
  rafId = requestAnimationFrame(step);

  typewriter("Data Analyst · SQL · Power BI · Python · Dashboards", 18);

  if (prefersReduced) {
    bar.style.width = "100%";
    setTimeout(goIn, 900);
  } else {
    startProgress();
  }
})();
