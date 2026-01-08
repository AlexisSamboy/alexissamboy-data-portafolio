/* experiencia.js (FIX DEFINITIVO) - Scrollytelling por IntersectionObserver */
(() => {
  "use strict";

  // ========= DATA (más reciente -> más antiguo) =========
  const XP = [
    {
      year: "2025",
      role: "SOPORTE TÉCNICO INFORMÁTICO",
      org: "Ministerio Público (Procuraduría de la República Dominicana)",
      date: "Agosto 2025 - Presente",
      bullets: [
        "Diagnóstico y reparación de equipos (CPUs e impresoras en red).",
        "Instalación, configuración y mantenimiento de sistemas en dependencias judiciales.",
        "Resolución de incidencias de red, software y hardware (presencial y remoto).",
        "Administración básica de dominios y usuarios en Office 365.",
        "Aplicación de medidas de seguridad informática y respaldo de información.",
        "Gestión de inventarios, solicitudes a almacén y soporte a múltiples usuarios.",
        "Seguimiento de incidencias mediante sistemas de tickets y apoyo en mejora de procesos técnicos."
      ],
      skills: ["Redes","Hardware","Office 365","Seguridad","Tickets","Backups","Soporte remoto"]
    },
    {
      year: "2024",
      role: "SOPORTE TÉCNICO",
      org: "Negosur (Loteka)",
      date: "Junio 2024 - Agosto 2025",
      bullets: [
        "Diagnóstico y reparación de equipos (CPUs, impresoras, escáneres y sistemas POS).",
        "Instalación, configuración y mantenimiento en sucursales.",
        "Resolución de fallos de red, software y hardware (presencial y remoto).",
        "Apoyo en análisis básico de incidencias para mejorar procesos."
      ],
      skills: ["POS","Soporte","Redes","Diagnóstico","Mantenimiento"]
    },
    {
      year: "2024",
      role: "PROFESOR DE PISO",
      org: "Smart Fit Dominicanan",
      date: "2024",
      bullets: [
        "Acompañamiento y orientación a usuarios en rutinas y uso correcto de equipos.",
        "Organización del área y atención directa al cliente."
      ],
      skills: ["Atención al cliente","Comunicación","Organización"]
    },
    {
      year: "2019",
      role: "ASESOR COMERCIAL",
      org: "Urrutia Auto Import",
      date: "2019",
      bullets: [
        "Atención y asesoría a clientes para identificar necesidades y cerrar ventas.",
        "Seguimiento y soporte postventa."
      ],
      skills: ["Ventas","Comunicación","Seguimiento"]
    },
    {
      year: "2019",
      role: "OPERADOR TÉCNICO",
      org: "Trébol Cable",
      date: "2019",
      bullets: [
        "Soporte técnico operativo y resolución de incidencias básicas.",
        "Apoyo a instalaciones y verificación de funcionamiento."
      ],
      skills: ["Soporte","Operación","Instalación"]
    },
    {
      year: "2016",
      role: "SERVICIO AL CLIENTE Y SOPORTE OPERATIVO",
      org: "Dominos Pizza",
      date: "2016",
      bullets: [
        "Atención al cliente y soporte operativo.",
        "Trabajo en equipo y manejo de tiempos en entorno de alta demanda."
      ],
      skills: ["Servicio","Trabajo en equipo","Gestión del tiempo"]
    }
  ];

  // ========= SELECTORES (de tu HTML) =========
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
  const clamp = (n, a, b) => Math.min(b, Math.max(a, n));
  const esc = (v) => String(v)
    .replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;")
    .replaceAll('"',"&quot;").replaceAll("'","&#039;");

  const scrolly = $("#timeline");
  const space  = $("#scrollSpace");
  const stage  = $("#stage");
  const nodes  = $("#nodes");
  const rail   = $("#rail") || stage?.querySelector("aside") || null;

  const cardInner   = $("#cardInner");
  const activeLabel = $("#activeLabel");
  const activeProg  = $("#activeProg");
  const mobileWrap  = $("#mobileTimeline");

  // Si falta algo crítico, no sigas
  if (!space || !stage || !nodes || !cardInner || !activeLabel || !activeProg || !mobileWrap) {
    console.error("[experiencia.js] Faltan IDs requeridos en experiencia.html.");
    return;
  }

  // ========= CSS INYECTADO (namespaced xp-) =========
  function injectCSS(){
    if ($("#xp-css")) return;
    const st = document.createElement("style");
    st.id = "xp-css";
    st.textContent = `
      :root{ --xpProg: 0; --xpTop: 84px; }

      /* Forzamos STICKY (esto revive el pin aunque se rompa tu CSS) */
      #timeline .stage{
        position: sticky !important;
        top: var(--xpTop) !important;
        left: 0 !important;
        width: 100% !important;
        height: calc(100vh - var(--xpTop) - 18px) !important;
        z-index: 5;
      }

      /* Asegura que scrollSpace tenga altura REAL */
      #scrollSpace{ position: relative; }
      #steps{ position: relative; z-index: 1; }
      .xp-step{ height: 120vh; }

      /* Rail / línea */
      .xp-rail{ position: relative; min-height: 100%; }
      .xp-railLine{
        position:absolute; left:74px; top:20px; bottom:20px; width:4px;
        border-radius:999px; background:rgba(255,255,255,.10);
      }
      .xp-railFill{
        position:absolute; left:74px; top:20px; width:4px;
        height: calc((100% - 40px) * var(--xpProg));
        border-radius:999px;
        background: linear-gradient(180deg, rgba(0,212,255,.95), rgba(43,108,255,.9));
        box-shadow: 0 0 22px rgba(0,212,255,.18);
      }
      .xp-traveler{
        position:absolute; left:74px;
        top: calc(20px + (100% - 40px) * var(--xpProg));
        transform: translate(-50%, -50%);
        width:16px; height:16px; border-radius:50%;
        background: rgba(255,255,255,.92);
        border: 2px solid rgba(0,212,255,.65);
        box-shadow: 0 0 0 10px rgba(0,212,255,.10), 0 0 26px rgba(0,212,255,.20);
      }

      /* Nodes + labels (evita choque con .label/.node del index) */
      .xp-nodes{ position:absolute; left:0; top:20px; bottom:20px; width:100%; pointer-events:none; }
      .xp-label{
        position:absolute; left:0; transform: translateY(-50%);
        width:60px; text-align:right;
        font-size:12px; font-weight:900;
        color: rgba(255,255,255,.62);
      }
      .xp-node{
        position:absolute; left:74px; transform: translate(-50%, -50%);
        width:12px; height:12px; border-radius:50%;
        background: rgba(255,255,255,.62);
        border: 1px solid rgba(255,255,255,.14);
        box-shadow: 0 0 0 8px rgba(255,255,255,.04);
        opacity:.55;
        transition:.25s ease;
      }
      .xp-node.is-active{
        opacity:1; background: rgba(255,255,255,.95);
        border-color: rgba(0,212,255,.35);
        box-shadow: 0 0 0 10px rgba(0,212,255,.10), 0 0 24px rgba(0,212,255,.12);
      }

      /* Card content */
      .xp-title{ margin:0; font-size:24px; font-weight:900; line-height:1.12; }
      .xp-org{ margin:8px 0 0; color:rgba(255,255,255,.72); font-weight:700; font-style:italic; font-size:14px; }
      .xp-date{ margin:12px 0 0; color:rgba(255,255,255,.65); font-weight:900; font-size:13px; }
      .xp-divider{ height:1px; margin:18px 0; background: rgba(255,255,255,.08); }

      .xp-bullets{
        margin:0; padding:0; list-style:none;
        display:grid; gap:10px;
        font-size:15px; line-height:1.75;
        color: rgba(255,255,255,.82);
        font-weight:650; max-width:92ch;
      }
      .xp-bullets li{ display:flex; gap:10px; align-items:flex-start; }
      .xp-bullets li::before{
        content:""; width:8px; height:8px; border-radius:50%;
        margin-top:9px; flex:0 0 8px;
        background: linear-gradient(90deg, rgba(0,212,255,.95), rgba(43,108,255,.9));
        box-shadow: 0 0 0 6px rgba(0,212,255,.08);
      }

      .xp-skills{
        margin-top:14px;
        border-radius:18px; border:1px solid rgba(255,255,255,.10);
        background: rgba(0,0,0,.22);
        padding:14px; max-width:92ch;
      }
      .xp-skillsT{
        margin:0 0 10px;
        font-weight:900; color:rgba(255,255,255,.88);
        font-size:12px; letter-spacing:.35px; text-transform:uppercase;
      }
      .xp-chips{ display:flex; flex-wrap:wrap; gap:8px; }
      .xp-chip{
        font-size:12px; font-weight:900;
        color: rgba(255,255,255,.88);
        padding:7px 10px; border-radius:999px;
        border:1px solid rgba(255,255,255,.10);
        background: rgba(255,255,255,.06);
        white-space:nowrap;
      }

      /* Fade */
      .xp-fade{ opacity:0; transform: translateY(8px); transition:.25s ease; }
      .xp-fade.is-in{ opacity:1; transform: translateY(0); }
    `;
    document.head.appendChild(st);
  }

  function getNavTop(){
    const nav = $(".navbar");
    const h = nav ? Math.round(nav.getBoundingClientRect().height) : 72;
    return h + 12;
  }

  // ========= ESTRUCTURA (steps + rail) =========
  function ensureSteps(){
    let steps = $("#steps");
    if (!steps) {
      steps = document.createElement("div");
      steps.id = "steps";
      space.appendChild(steps);
    }
    steps.innerHTML = XP.map(() => `<div class="xp-step"></div>`).join("");
    return steps;
  }

  function ensureRail(){
    if (!rail) return;

    rail.classList.add("xp-rail");

    let line = rail.querySelector(".xp-railLine");
    if (!line) { line = document.createElement("div"); rail.appendChild(line); }
    line.className = "xp-railLine";

    let fill = rail.querySelector(".xp-railFill");
    if (!fill) { fill = document.createElement("div"); rail.appendChild(fill); }
    fill.className = "xp-railFill";

    let traveler = rail.querySelector(".xp-traveler");
    if (!traveler) { traveler = document.createElement("div"); rail.appendChild(traveler); }
    traveler.className = "xp-traveler";

    nodes.classList.add("xp-nodes");
  }

  function buildNodes(){
    nodes.innerHTML = "";
    const total = XP.length;

    XP.forEach((it, i) => {
      const t = total === 1 ? 0 : i / (total - 1);
      const topPct = t * 100;

      const lab = document.createElement("div");
      lab.className = "xp-label";
      lab.style.top = `${topPct}%`;
      lab.textContent = it.year;

      const dot = document.createElement("div");
      dot.className = "xp-node";
      dot.style.top = `${topPct}%`;
      dot.dataset.i = String(i);

      nodes.appendChild(lab);
      nodes.appendChild(dot);
    });
  }

  function setActiveNode(i){
    $$(".xp-node", nodes).forEach(n => n.classList.remove("is-active"));
    const el = nodes.querySelector(`.xp-node[data-i="${i}"]`);
    if (el) el.classList.add("is-active");
  }

  // ========= RENDER CARD =========
  let lastIndex = -1;

  function renderCard(i){
    const it = XP[i];
    if (!it) return;

    activeLabel.textContent = it.role;

    // fade
    cardInner.classList.add("xp-fade");
    cardInner.classList.remove("is-in");

    const bullets = (it.bullets || []).map(b => `<li>${esc(b)}</li>`).join("");
    const chips = (it.skills || []).map(s => `<span class="xp-chip">${esc(s)}</span>`).join("");

    cardInner.innerHTML = `
      <h3 class="xp-title">${esc(it.role)}</h3>
      <p class="xp-org">${esc(it.org)}</p>
      <p class="xp-date">${esc(it.date)}</p>
      <div class="xp-divider"></div>
      <ul class="xp-bullets">${bullets}</ul>
      ${chips ? `
        <div class="xp-skills">
          <p class="xp-skillsT">Skills adquiridas</p>
          <div class="xp-chips">${chips}</div>
        </div>` : ""}
    `;

    requestAnimationFrame(() => cardInner.classList.add("is-in"));
  }

  // ========= MOBILE (lista completa) =========
  function renderMobile(){
    mobileWrap.innerHTML = XP.map((it) => {
      const bullets = (it.bullets || []).map(b => `<li>${esc(b)}</li>`).join("");
      const chips = (it.skills || []).map(s => `<span class="xp-chip">${esc(s)}</span>`).join("");

      return `
        <div style="position:relative; padding-left:18px; margin:16px 0 22px;">
          <span style="position:absolute; left:0; top:10px; width:12px; height:12px; border-radius:50%;
                       background:rgba(255,255,255,.95); border:2px solid rgba(0,212,255,.55);
                       box-shadow:0 0 0 10px rgba(0,212,255,.08);" aria-hidden="true"></span>

          <div style="display:inline-flex; margin:0 0 10px; padding:6px 10px; border-radius:999px;
                      font-weight:900; font-size:12px; color:rgba(255,255,255,.86);
                      border:1px solid rgba(255,255,255,.10); background:rgba(0,0,0,.22);">
            ${esc(it.year)}
          </div>

          <div style="border-radius:18px; border:1px solid rgba(255,255,255,.10);
                      background:linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.04));
                      box-shadow:0 18px 60px rgba(0,0,0,.40); padding:18px;">
            <h3 style="margin:0; font-size:18px; font-weight:900; line-height:1.15;">${esc(it.role)}</h3>
            <p style="margin:8px 0 0; color:rgba(255,255,255,.72); font-weight:700; font-style:italic; font-size:13px;">
              ${esc(it.org)}
            </p>
            <p style="margin:10px 0 0; color:rgba(255,255,255,.62); font-weight:900; font-size:12px;">
              ${esc(it.date)}
            </p>
            <ul style="margin:12px 0 0; padding-left:16px; color:rgba(255,255,255,.82);
                       font-weight:650; font-size:13px; line-height:1.65;">
              ${bullets}
            </ul>
            ${chips ? `<div class="xp-chips" style="margin-top:12px;">${chips}</div>` : ""}
          </div>
        </div>
      `;
    }).join("");
  }

  // ========= PROGRESO (por step visible) =========
  function setProgress(p){
    const prog = clamp(p, 0, 1);
    document.documentElement.style.setProperty("--xpProg", prog.toFixed(4));
    activeProg.textContent = `${Math.round(prog * 100)}%`;
  }

  function computeStepProgress(stepEl){
    // progreso dentro del step usando el centro de viewport
    const r = stepEl.getBoundingClientRect();
    const mid = window.innerHeight * 0.5;
    const t = (mid - r.top) / Math.max(1, r.height);
    return clamp(t, 0, 1);
  }

  function setupObserver(stepsEls){
    let current = 0;

    const io = new IntersectionObserver((entries) => {
      // elegimos el más visible
      let best = null;
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        if (!best || e.intersectionRatio > best.intersectionRatio) best = e;
      }
      if (!best) return;

      const i = Number(best.target.dataset.i || 0);
      current = i;

      if (i !== lastIndex) {
        lastIndex = i;
        renderCard(i);
        setActiveNode(i);
      }

      const within = computeStepProgress(best.target);
      const denom = Math.max(1, XP.length - 1);
      setProgress((i + within) / denom);

    }, {
      root: null,
      threshold: [0.15, 0.25, 0.4, 0.6, 0.75, 0.9]
    });

    stepsEls.forEach((el, i) => {
      el.dataset.i = String(i);
      io.observe(el);
    });

    // fallback por scroll (por si algún navegador no reporta bien)
    const onScroll = () => {
      const denom = Math.max(1, XP.length - 1);
      const step = stepsEls[current] || stepsEls[0];
      const within = step ? computeStepProgress(step) : 0;
      setProgress((current + within) / denom);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    onScroll();
  }

  // ========= INIT =========
  function init(){
    injectCSS();

    // set top offset (nav height)
    const top = getNavTop();
    document.documentElement.style.setProperty("--xpTop", `${top}px`);

    // crea steps reales
    const steps = ensureSteps();
    const stepsEls = $$(".xp-step", steps);

    // rail + nodes
    ensureRail();
    buildNodes();

    // móvil: siempre renderiza (tu CSS decide si se muestra o no)
    renderMobile();

    // default
    renderCard(0);
    setActiveNode(0);
    setProgress(0);

    // observer (esto es lo que “revive” la interactividad)
    setupObserver(stepsEls);

    // por si cambia el alto del nav después
    window.addEventListener("resize", () => {
      const t = getNavTop();
      document.documentElement.style.setProperty("--xpTop", `${t}px`);
    }, { passive: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
