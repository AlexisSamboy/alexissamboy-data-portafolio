// ======== DATA (más reciente primero) ========
const EXPERIENCES = [
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
      "Medidas de seguridad informática y respaldos.",
      "Inventarios, solicitudes a almacén y soporte multiusuario.",
      "Seguimiento por tickets y apoyo en mejora de procesos."
    ],
    skills: ["Redes", "Hardware", "Office 365", "Seguridad", "Tickets", "Backups", "Soporte remoto"]
  },
  {
    year: "2024",
    role: "SOPORTE TÉCNICO",
    org: "Negosur (Loteka)",
    date: "Junio 2024 - Agosto 2025",
    bullets: [
      "Diagnóstico y reparación (CPUs, impresoras, escáneres y sistemas POS).",
      "Instalación, configuración y mantenimiento en sucursales.",
      "Resolución de fallos de red, software y hardware (presencial y remoto).",
      "Análisis básico de incidencias para mejorar procesos."
    ],
    skills: ["POS", "Redes", "Hardware", "Troubleshooting", "Soporte en sucursales"]
  },
  {
    year: "2024",
    role: "PROFESOR DE PISO",
    org: "Smart Fit Dominicanan",
    date: "2024",
    bullets: [
      "Acompañamiento a clientes en piso.",
      "Apoyo operativo y coordinación.",
      "Comunicación efectiva y enfoque en servicio."
    ],
    skills: ["Servicio", "Comunicación", "Trabajo en equipo"]
  },
  {
    year: "2019",
    role: "ASESOR COMERCIAL",
    org: "Urrutía Auto Import",
    date: "2019",
    bullets: [
      "Atención al cliente y negociación.",
      "Seguimiento de solicitudes y soporte comercial."
    ],
    skills: ["Ventas", "Negociación", "Atención al cliente", "Seguimiento"]
  },
  {
    year: "2019",
    role: "OPERADOR TÉCNICO",
    org: "Trébol Cable",
    date: "2019",
    bullets: [
      "Soporte técnico operativo y resolución de incidencias.",
      "Coordinación y cumplimiento de tareas técnicas."
    ],
    skills: ["Soporte", "Operaciones", "Incidencias"]
  },
  {
    year: "2016",
    role: "SERVICIO AL CLIENTE Y SOPORTE OPERATIVO",
    org: "Domino's Pizza",
    date: "2016",
    bullets: [
      "Atención al cliente y soporte operativo.",
      "Trabajo bajo presión y foco en calidad."
    ],
    skills: ["Servicio", "Rapidez", "Trabajo bajo presión"]
  }
];

// ======== DOM (desktop scrolly) ========
const scrollSpace = document.getElementById("scrollSpace");
const stage = document.getElementById("stage");
const scrolly = document.getElementById("timeline");
const topbar = document.querySelector(".topbar");

const rail = document.getElementById("rail");
const nodesRoot = document.getElementById("nodes");
const burstLayer = document.getElementById("burstLayer");

const activeLabel = document.getElementById("activeLabel");
const activeProg = document.getElementById("activeProg");
const cardInner = document.getElementById("cardInner");

// ======== DOM (mobile list) ========
const mobileTimeline = document.getElementById("mobileTimeline");

const isMobile = () => window.matchMedia("(max-width: 680px)").matches;

// ======== CONFIG ========
const SEGMENT_VH = 100;
const BURST_LIMIT = 7;

let lastIdx = -1;
let raf = 0;

// ======== HELPERS ========
function esc(s=""){
  return String(s).replace(/[&<>"']/g, (c)=>({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[c]));
}
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function rand(min, max){ return Math.random() * (max - min) + min; }
function colorClass(i){ return ["cyan","blue","pink"][i % 3]; }

// ======== MOBILE BUILD ========
function buildMobileTimeline(){
  if (!mobileTimeline) return;

  mobileTimeline.innerHTML = EXPERIENCES.map(exp => `
    <div class="mItem">
      <span class="mDot"></span>
      <div class="mYear">${esc(exp.year)}</div>
      <div class="mCard">
        <h3 class="mRole">${esc(exp.role)}</h3>
        <div class="mOrg">${esc(exp.org)}</div>
        <div class="mDate">${esc(exp.date)}</div>
        <ul class="mBullets">
          ${exp.bullets.slice(0, 5).map(b => `<li>${esc(b)}</li>`).join("")}
        </ul>
        <div class="mSkills">
          ${exp.skills.slice(0, 8).map(s => `<span class="mChip">${esc(s)}</span>`).join("")}
        </div>
      </div>
    </div>
  `).join("");
}

// ======== DESKTOP HEIGHT ========
function setScrollHeight(){
  if (!scrollSpace) return;
  const segments = EXPERIENCES.length + 1;
  scrollSpace.style.height = `${segments * SEGMENT_VH}vh`;
}

// ======== NODES ========
function buildNodes(){
  if (!nodesRoot) return;

  nodesRoot.innerHTML = "";
  const n = EXPERIENCES.length;

  for (let i = 0; i < n; i++){
    const pos = (i + 0.5) / n;
    const node = document.createElement("div");
    node.className = "node";
    node.style.top = `calc(20px + (100% - 40px) * ${pos})`;

    const label = document.createElement("div");
    label.className = "label";
    label.style.top = node.style.top;
    label.textContent = EXPERIENCES[i].year;

    nodesRoot.appendChild(label);
    nodesRoot.appendChild(node);
  }
}

// ======== CARD RENDER ========
function renderCard(idx){
  const exp = EXPERIENCES[idx];
  if (!exp || !cardInner) return;

  activeLabel.textContent = exp.role;

  const html = `
    <h2 class="role">${esc(exp.role)}</h2>
    <div class="org">${esc(exp.org)}</div>
    <div class="date">${esc(exp.date)}</div>

    <div class="divider"></div>

    <ul class="bullets">
      ${exp.bullets.map(b => `<li>${esc(b)}</li>`).join("")}
    </ul>

    <div class="skillsBox">
      <div class="t">Skills adquiridas</div>
      <div class="chips">
        ${exp.skills.map(s => `<span class="chip">${esc(s)}</span>`).join("")}
      </div>
    </div>
  `;

  cardInner.classList.remove("in");
  setTimeout(() => {
    cardInner.innerHTML = html;
    requestAnimationFrame(() => cardInner.classList.add("in"));
  }, 70);
}

// ======== SKILL BURST ========
function spawnSkillBurst(idx){
  if (!rail || !burstLayer) return;

  burstLayer.innerHTML = "";

  const exp = EXPERIENCES[idx];
  if (!exp?.skills?.length) return;

  const nodes = nodesRoot.querySelectorAll(".node");
  const activeNode = nodes[idx];
  if (!activeNode) return;

  const railRect = rail.getBoundingClientRect();
  const nodeRect = activeNode.getBoundingClientRect();

  const y = (nodeRect.top - railRect.top) + (nodeRect.height / 2);

  const skills = exp.skills.slice(0, BURST_LIMIT);

  skills.forEach((name, i) => {
    const orb = document.createElement("div");
    orb.className = `skillOrb ${colorClass(i)}`;
    orb.textContent = name;

    const tx = rand(24, 140);
    const ty = rand(-80, 80);

    orb.style.top = `${y}px`;
    orb.style.setProperty("--tx", `${tx.toFixed(0)}px`);
    orb.style.setProperty("--ty", `${ty.toFixed(0)}px`);
    orb.style.animationDelay = `${(i * 0.06).toFixed(2)}s`;

    burstLayer.appendChild(orb);
  });
}

// ======== PIN STAGE (desktop) ========
function updateStagePin(){
  if (!stage || !scrollSpace || !scrolly) return;

  const navH = topbar ? topbar.getBoundingClientRect().height : 64;
  const stageTop = Math.round(navH + 10);
  document.documentElement.style.setProperty("--stageTop", `${stageTop}px`);

  const spaceRect = scrollSpace.getBoundingClientRect();
  const spaceTop = spaceRect.top + window.scrollY;
  const spaceH = scrollSpace.offsetHeight;

  const stageH = Math.max(520, window.innerHeight - stageTop - 18);

  const startY = spaceTop;
  const endY = spaceTop + spaceH - stageH;

  const y = window.scrollY;

  const scrollyRect = scrolly.getBoundingClientRect();
  const left = Math.round(scrollyRect.left);
  const width = Math.round(scrollyRect.width);

  if (y < startY) {
    stage.classList.remove("is-fixed", "is-bottom");
    stage.style.left = "";
    stage.style.width = "";
    stage.style.height = `${stageH}px`;
  } else if (y >= startY && y < endY) {
    stage.classList.add("is-fixed");
    stage.classList.remove("is-bottom");
    stage.style.left = `${left}px`;
    stage.style.width = `${width}px`;
    stage.style.height = `${stageH}px`;
  } else {
    stage.classList.remove("is-fixed");
    stage.classList.add("is-bottom");
    stage.style.left = "";
    stage.style.width = "";
    stage.style.height = `${stageH}px`;
  }
}

// ======== UPDATE (desktop) ========
function update(){
  raf = 0;
  if (!scrollSpace || !nodesRoot) return;

  updateStagePin();

  const rect = scrollSpace.getBoundingClientRect();
  const viewH = window.innerHeight || 800;

  const total = rect.height - viewH;
  const passed = -rect.top;
  const prog = clamp(total > 0 ? passed / total : 0, 0, 1);

  document.documentElement.style.setProperty("--prog", prog.toFixed(4));
  if (activeProg) activeProg.textContent = `${Math.round(prog * 100)}%`;

  const n = EXPERIENCES.length;
  const seg = prog * n;
  const idx = clamp(Math.floor(seg), 0, n - 1);

  const nodeEls = nodesRoot.querySelectorAll(".node");
  nodeEls.forEach((el, i) => el.classList.toggle("active", i === idx));

  if (idx !== lastIdx){
    lastIdx = idx;
    renderCard(idx);
    spawnSkillBurst(idx);
  }
}

function onScroll(){
  if (raf) return;
  raf = requestAnimationFrame(update);
}

// ======== INIT ========
function init(){
  // Siempre construimos la vista móvil (si existe contenedor)
  buildMobileTimeline();

  // Si es móvil, NO inicializamos scrollytelling (está oculto por CSS)
  if (isMobile()) return;

  // Desktop scrollytelling
  setScrollHeight();
  buildNodes();
  renderCard(0);
  spawnSkillBurst(0);

  requestAnimationFrame(() => {
    if (cardInner) cardInner.classList.add("in");
    update();
  });

  window.addEventListener("scroll", onScroll, { passive: true });
}

init();

// Reaccionar al resize: si cambia a móvil/desktop, recargar lógica simple
window.addEventListener("resize", () => {
  // reconstruye móvil siempre
  buildMobileTimeline();

  // si pasamos a desktop, re-init básico
  if (!isMobile()){
    setScrollHeight();
    buildNodes();
    lastIdx = -1;
    update();
  }
});
