/* ============================
   script.js (LIMPIO)
   - SIN duplicados
   - con guards para canvas/ctx
   ============================ */

document.addEventListener("DOMContentLoaded", () => {
  /* ============================
     1) PARTICULAS (canvas3d)
     ============================ */
  const canvasNode = document.getElementById("canvas3d");
  const canvas = canvasNode instanceof HTMLCanvasElement ? canvasNode : null;
  const ctx = canvas ? canvas.getContext("2d") : null;

  let particlesArray = [];
  const mouse = { x: null, y: null, radius: 0 };

  function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    mouse.radius = (canvas.height / 80) * (canvas.width / 80);
  }

  class Particle {
    constructor(x, y, dx, dy, size) {
      this.x = x;
      this.y = y;
      this.dx = dx;
      this.dy = dy;
      this.size = size;
    }
    draw() {
      if (!ctx) return;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = "#64ffda";
      ctx.fill();
    }
    update() {
      if (!canvas) return;

      if (this.x > canvas.width || this.x < 0) this.dx *= -1;
      if (this.y > canvas.height || this.y < 0) this.dy *= -1;

      const mx = mouse.x ?? -9999;
      const my = mouse.y ?? -9999;
      const dx = mx - this.x;
      const dy = my - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < mouse.radius + this.size) {
        if (mx < this.x && this.x < canvas.width - this.size * 10) this.x += 10;
        if (mx > this.x && this.x > this.size * 10) this.x -= 10;
        if (my < this.y && this.y < canvas.height - this.size * 10) this.y += 10;
        if (my > this.y && this.y > this.size * 10) this.y -= 10;
      }

      this.x += this.dx;
      this.y += this.dy;
      this.draw();
    }
  }

  function initParticles() {
    if (!canvas) return;
    particlesArray = [];
    const count = Math.floor((canvas.width * canvas.height) / 15000);

    for (let i = 0; i < count; i++) {
      const size = Math.random() * 2 + 1;
      const x = Math.random() * (canvas.width - size * 4) + size * 2;
      const y = Math.random() * (canvas.height - size * 4) + size * 2;
      const dx = Math.random() * 1 - 0.5;
      const dy = Math.random() * 1 - 0.5;
      particlesArray.push(new Particle(x, y, dx, dy, size));
    }
  }

  function connect() {
    if (!canvas || !ctx) return;

    const threshold = (canvas.width / 7) * (canvas.height / 7);

    for (let a = 0; a < particlesArray.length; a++) {
      for (let b = a; b < particlesArray.length; b++) {
        const dx = particlesArray[a].x - particlesArray[b].x;
        const dy = particlesArray[a].y - particlesArray[b].y;
        const dist2 = dx * dx + dy * dy;

        if (dist2 < threshold) {
          const opacity = Math.max(0, 1 - dist2 / 20000); // clamp
          ctx.strokeStyle = `rgba(100,255,218,${opacity})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
          ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function animateParticles() {
    if (!canvas || !ctx) return;
    requestAnimationFrame(animateParticles);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) particlesArray[i].update();
    connect();
  }

  // Solo inicializa partículas si existe canvas + ctx
  if (canvas && ctx) {
    resizeCanvas();
    initParticles();
    animateParticles();

    window.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener("resize", () => {
      resizeCanvas();
      initParticles();
    });
  }

  /* ============================
     2) HERO PARALLAX (suave)
     ============================ */
  (() => {
    const hero = document.getElementById("home");
    const heroImg = document.getElementById("heroBgImg");
    if (!hero || !heroImg) return;

    const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

    const onScroll = () => {
      if (prefersReduced) return;

      const heroRect = hero.getBoundingClientRect();
      const heroH = hero.offsetHeight;
      const vh = window.innerHeight;

      const total = Math.max(1, heroH - vh);
      const scrolled = clamp(-heroRect.top, 0, total);
      const p = scrolled / total;

      const y = -Math.round(p * 80);
      const s = 1.08 + p * 0.02;
      heroImg.style.transform = `translateY(${y}px) scale(${s})`;

      // Canvas opacity solo si canvas existe
      if (canvas) {
        const start = 0.1;
        const end = 0.55;
        const t = clamp((p - 0.2) / 0.8, 0, 1);
        canvas.style.opacity = (start + (end - start) * t).toFixed(3);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  })();

  /* ============================
     3) SCROLL REVEAL (secciones)
     ============================ */
  (() => {
    const revealElements = document.querySelectorAll(".scroll-reveal");
    if (!revealElements.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("active");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealElements.forEach((el) => io.observe(el));
  })();

  /* ============================
     4) REVEAL STAGGER (cards)
     ============================ */
  (() => {
    const cards = document.querySelectorAll(".reveal");
    if (!cards.length) return;

    cards.forEach((el, i) => el.style.setProperty("--delay", `${i * 90}ms`));

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.18 }
    );

    cards.forEach((el) => io.observe(el));
  })();

  /* ============================
     5) STACK MARQUEE
     ============================ */
  (() => {
    const track = document.getElementById("stackTrack");
    if (!track) return;

    const tools = [
      { name: "Power BI", src: "img/tools/power-bi.png" },
      { name: "Excel", src: "img/tools/microsoft-excel.png" },
      { name: "Python", src: "img/tools/python.png" },
      { name: "Pandas", src: "img/tools/pandas.png" },
      { name: "NumPy", src: "img/tools/numpy.png" },
      { name: "Jupyter", src: "img/tools/jupyter.png" },
      { name: "SQL Server", src: "img/tools/microsoft-sql-server.png" },
      { name: "PostgreSQL", src: "img/tools/postgre-sql.png" },
      { name: "MySQL", src: "img/tools/mysql.png" },
      { name: "Tableau", src: "img/tools/tableau.png" },
      { name: "GitHub", src: "img/tools/github.png" },
      { name: "Google Colab", src: "img/tools/google-colab.png" },
      { name: "Power Point", src: "img/tools/power-point.png" },
    ];

    const PX_PER_SEC = 40;
    track.innerHTML = "";

    const makePill = (t) => {
      const pill = document.createElement("span");
      pill.className = "stack-pill";

      const img = document.createElement("img");
      img.className = "stack-pill__logo";
      img.src = t.src;
      img.alt = t.name;
      img.loading = "lazy";
      img.decoding = "async";

      const name = document.createElement("span");
      name.className = "stack-pill__name";
      name.textContent = t.name;

      pill.appendChild(img);
      pill.appendChild(name);
      return pill;
    };

    const frag = document.createDocumentFragment();
    tools.forEach((t, i) => {
      frag.appendChild(makePill(t));
      if (i !== tools.length - 1) {
        const dot = document.createElement("span");
        dot.className = "stack-dot";
        frag.appendChild(dot);
      }
    });
    track.appendChild(frag);

    const original = track.innerHTML;
    track.innerHTML = original + original;

    let anim;
    const start = () => {
      if (anim) anim.cancel();
      const half = track.scrollWidth / 2;
      const duration = (half / PX_PER_SEC) * 1000;

      anim = track.animate(
        [{ transform: "translateX(0)" }, { transform: `translateX(-${half}px)` }],
        { duration, iterations: Infinity, easing: "linear" }
      );
    };

    const shell = track.closest(".stack-marquee__shell");
    shell?.addEventListener("mouseenter", () => anim?.pause());
    shell?.addEventListener("mouseleave", () => anim?.play());

    let to;
    window.addEventListener("resize", () => {
      clearTimeout(to);
      to = setTimeout(start, 150);
    });

    const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (!prefersReduced) start();
  })();

  /* ============================
     6) PROJECTS CAROUSEL
     ============================ */
  (() => {
    const root = document.getElementById("projectsCarousel");
    if (!root) return;

    const viewport = root.querySelector(".pc-viewport");
    const track = root.querySelector(".pc-track");
    if (!viewport || !track) return;

    const cards = Array.from(track.children).filter((el) => el.classList.contains("showcase-card"));
    const prevBtn = root.querySelector(".pc-prev");
    const nextBtn = root.querySelector(".pc-next");
    const dotsWrap = root.querySelector(".pc-dots");
    if (cards.length < 2) return;

    let index = 0;
    let autoplayEnabled = true;
    const INTERVAL = 2200;
    let timer = null;

    const getGap = () => {
      const cs = getComputedStyle(track);
      const gap = parseFloat((cs.gap || cs.columnGap || "0").toString());
      return Number.isFinite(gap) ? gap : 0;
    };

    const getSlideWidth = () => cards[0].getBoundingClientRect().width + getGap();

    const getVisibleCount = () => {
      const vw = viewport.getBoundingClientRect().width;
      const sw = getSlideWidth();
      if (sw <= 0) return 1;
      return Math.max(1, Math.floor((vw + getGap()) / sw));
    };

    const getMaxIndex = () => Math.max(0, cards.length - getVisibleCount());

    const buildDots = () => {
      if (!dotsWrap) return [];
      dotsWrap.innerHTML = "";
      const maxIndex = getMaxIndex();
      const count = maxIndex + 1;

      const dots = [];
      for (let i = 0; i < count; i++) {
        const d = document.createElement("button");
        d.type = "button";
        d.className = "pc-dot" + (i === index ? " is-active" : "");
        d.addEventListener("click", () => {
          index = i;
          update(true);
          restart();
        });
        dotsWrap.appendChild(d);
        dots.push(d);
      }
      return dots;
    };

    let dots = [];
    const updateDots = () => dots.forEach((d, i) => d.classList.toggle("is-active", i === index));

    const update = (snap = false) => {
      const maxIndex = getMaxIndex();
      if (index > maxIndex) index = 0;

      if (maxIndex === 0) {
        track.style.transform = `translateX(0px)`;
        if (prevBtn) prevBtn.style.display = "none";
        if (nextBtn) nextBtn.style.display = "none";
        if (dotsWrap) dotsWrap.style.display = "none";
        stop();
        return;
      } else {
        if (prevBtn) prevBtn.style.display = "";
        if (nextBtn) nextBtn.style.display = "";
        if (dotsWrap) dotsWrap.style.display = "";
      }

      if (snap) track.style.transition = "none";
      track.style.transform = `translateX(-${index * getSlideWidth()}px)`;
      if (snap) requestAnimationFrame(() => (track.style.transition = ""));

      updateDots();
    };

    const next = () => {
      index = index >= getMaxIndex() ? 0 : index + 1;
      update();
    };
    const prev = () => {
      index = index <= 0 ? getMaxIndex() : index - 1;
      update();
    };

    prevBtn?.addEventListener("click", () => {
      prev();
      restart();
    });
    nextBtn?.addEventListener("click", () => {
      next();
      restart();
    });

    const start = () => {
      if (!autoplayEnabled) return;
      stop();
      timer = setInterval(next, INTERVAL);
    };
    const stop = () => {
      if (timer) clearInterval(timer);
      timer = null;
    };
    const restart = () => {
      stop();
      start();
    };

    root.addEventListener("mouseenter", () => {
      autoplayEnabled = false;
      stop();
    });
    root.addEventListener("mouseleave", () => {
      autoplayEnabled = true;
      start();
    });

    const rebuild = () => {
      dots = buildDots();
      update(true);
      restart();
    };

    window.addEventListener("resize", rebuild);

    requestAnimationFrame(() => {
      dots = buildDots();
      update(true);
      start();
    });
  })();
});
/* ===== Tableau Public mini-preview (lazy) ===== */
(() => {
  const minis = document.querySelectorAll('.tableau-mini[data-viz-url]');
  if (!minis.length) return;

  const isCoarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;

  let tableauApiPromise;
  function loadTableauApi() {
    if (tableauApiPromise) return tableauApiPromise;

    tableauApiPromise = new Promise((resolve, reject) => {
      if (window.tableau && window.tableau.Viz) return resolve();

      const s = document.createElement('script');
      s.src = 'https://public.tableau.com/javascripts/api/tableau-2.min.js';
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error('No se pudo cargar la API de Tableau'));
      document.head.appendChild(s);
    });

    return tableauApiPromise;
  }

  function mount(mini) {
    if (mini.dataset.mounted === '1') return;
    mini.dataset.mounted = '1';

    const url = mini.dataset.vizUrl;

    const live = document.createElement('div');
    live.className = 'tableau-live';
    mini.appendChild(live);

    loadTableauApi()
      .then(() => {
        const options = { hideTabs: true };
        new tableau.Viz(live, url, options);
        mini.classList.add('is-live');
      })
      .catch(() => {
        // Si falla, dejamos el preview estático.
        mini.dataset.mounted = '0';
        live.remove();
      });
  }

  // Desktop: carga al hover (se siente “dinámico”)
  if (!isCoarse) {
    minis.forEach(mini => {
      let t;
      mini.addEventListener('mouseenter', () => {
        t = setTimeout(() => mount(mini), 250);
      });
      mini.addEventListener('mouseleave', () => clearTimeout(t));
    });
  }
})();

