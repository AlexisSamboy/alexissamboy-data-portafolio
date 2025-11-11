/* =========================================================
   Portafolio — JS principal (vanilla)
   Listo para pegar en /assets/js/main.js
   - Radar con Chart.js
   - Animaciones y UX
   - Página de Habilidades (barras, herramientas, donuts)
   - Contador de visitas con CountAPI (con throttle diario)
========================================================= */

/* =====================
   CONFIG
===================== */
const CONFIG = {
  EMAIL: "alexissamboy1998@gmail.com",
  GITHUB_URL: "https://github.com/AlexisSamboy",
  LINKEDIN_URL: "https://www.linkedin.com/in/alexis-samboy-herrera/",
  CV_URL: "./assets/docs/Alexis_Samboy_CV.pdf",
  AVATAR_URL: "./assets/img/alexis-samboy-analista-datos.png",
  GA_MEASUREMENT_ID: "" // p.ej. G-XXXX
};

/* =====================
   DATA (ejemplo)
===================== */
const TOOLS = [
  { name:'Anaconda', desc:'Entorno para ciencia de datos (conda, entornos, paquetes).', icon:'package' },
  { name:'Jupyter Notebook', desc:'Narrativas reproducibles, EDA y visualizaciones.', icon:'book-open' },
  { name:'Google Colab', desc:'GPU en la nube para prototipos rápidos.', icon:'cloud' },
  { name:'scikit-learn', desc:'ML clásico: regresión, clasificación y clustering.', icon:'cpu' },
  { name:'TensorFlow (básico)', desc:'NN básicas y keras para prototipos.', icon:'activity' },
  { name:'Pandas', desc:'ETL y manipulación de datos.', icon:'table' },
  { name:'Matplotlib / Seaborn', desc:'Visualización en Python.', icon:'bar-chart-2' },
  { name:'R & RStudio', desc:'Análisis estadístico con tidyverse.', icon:'code' },
  { name:'ggplot2 / dplyr', desc:'Visualización y manipulación en R.', icon:'pie-chart' }
];

const COURSES = [
  { name:'Curso de Excel intermedio — ITLA (2025)', pct:90 },
  { name:'Certificación en Liderazgo — Fundación Carlos Slim (2025)', pct:100 },
  { name:'Cert. Evaluador de KPI — Fundación Carlos Slim (2025)', pct:100 },
  { name:'Curso Microsoft Power BI — UASD (2024)', pct:100 },
  { name:'Curso Microsoft Excel Avanzado — UASD (2024)', pct:100 },
  { name:'Desarrollo de procesos ETL con Python & pandas — UBITS (2024)', pct:85 },
  { name:'Introducción a la ciencia de datos — UBITS (2024)', pct:100 },
  { name:'Introducción a la programación con Python 1 — Coursera (2024)', pct:100 },
  { name:'Programación en Python — ITLA (2024)', pct:100 },
  { name:'Programación con Python: Curso práctico — UASD (2024)', pct:100 },
  { name:'Servicio técnico y soporte de computadoras — Udemy (2024)', pct:100 },
  { name:'Introducción a la programación — ITLA (2021)', pct:100 },
  { name:'Técnico en paquetes Microsoft — Infotep (2013)', pct:100 }
];

/* =====================
   HELPERS
===================== */
const $id = (id) => document.getElementById(id);

/* =====================
   INIT
===================== */
document.addEventListener("DOMContentLoaded", () => {
  // Chart.js Radar (si existe canvas #radar)
  try { initRadar(); } catch(e){ /* noop */ }

  // Feather icons
  if (window.feather && feather.replace) feather.replace();

  // Animaciones / UX generales
  revealOnScroll();
  initRipple();
  initMagnetic('.btn-magnetic');

  // Página de habilidades
  if (document.body.dataset.page === 'skills') {
    initSkillsPage();
  }

  // Contador de visitas
  updateVisits();

  // Año en footer (si existe)
  const y = $id('year'); if (y) y.textContent = new Date().getFullYear();

  // Google Analytics (opcional)
  if (CONFIG.GA_MEASUREMENT_ID) {
    injectGA(CONFIG.GA_MEASUREMENT_ID);
  }
});

/* =====================
   Google Analytics (opcional)
===================== */
function injectGA(ID){
  if (document.getElementById("ga-gtag")) return;
  const s1 = document.createElement("script");
  s1.id = "ga-gtag";
  s1.async = true;
  s1.src = `https://www.googletagmanager.com/gtag/js?id=${ID}`;
  document.head.appendChild(s1);

  const s2 = document.createElement("script");
  s2.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date()); gtag('config', '${ID}');
  `;
  document.head.appendChild(s2);
}

/* =====================
   RADAR (Chart.js)
===================== */
function initRadar(){
  const canvas = $id('radar');
  if (!canvas || !window.Chart) return;

  new Chart(canvas, {
    type:'radar',
    data:{
      labels:['Power BI','Excel Avanzado','Python (pandas)','SQL Avanzado','MySQL','sklearn (ML)','Visualización','Soporte Técnico'],
      datasets:[{
        label:'Nivel',
        data:[80,85,70,78,74,55,82,88],
        backgroundColor:'rgba(34,211,238,.35)',
        borderColor:'rgba(34,211,238,1)',
        borderWidth:1
      }]
    },
    options:{
      responsive:true,
      scales:{
        r:{
          angleLines:{ color:'#334155' },
          grid:{ color:'#334155' },
          suggestedMin:0,
          suggestedMax:100,
          pointLabels:{ color:'#9CA3AF', font:{ size:11 } },
          ticks:{ color:'#64748B', backdropColor:'transparent' }
        }
      },
      plugins:{
        legend:{ labels:{ color:'#E5E7EB' } },
        tooltip:{ enabled:true }
      }
    }
  });
}

/* =====================
   SKILLS PAGE
===================== */
function initSkillsPage(){
  revealOnScroll();
  animateBars();
  renderTools();
  renderCourseDonuts();
}

/* Barras con contador (para tarjetas .skill) */
function animateBars(){
  const cards = document.querySelectorAll('.skill');
  if(!cards.length) return;

  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        const level = entry.target.querySelector('.level');
        const bar = entry.target.querySelector('.sbar > span');
        const target = parseInt(level.dataset.target,10) || 0;

        // contador animado
        animateCounter(level, 0, target, 900);

        // barra animada
        bar.style.transition = 'width 1s cubic-bezier(.2,.6,.2,1)';
        requestAnimationFrame(()=> bar.style.width = target + '%');

        io.unobserve(entry.target);
      }
    });
  }, { threshold:.35 });

  cards.forEach(c => io.observe(c));
}

/* Render herramientas en #tools */
function renderTools(){
  const wrap = $id('tools'); if(!wrap) return;

  wrap.innerHTML = TOOLS.map(t => `
    <article class="tool reveal" data-animate="fade-up" tabindex="0">
      <div class="krow"><i data-feather="${t.icon}"></i><strong>${t.name}</strong></div>
      <small class="skills-muted">${t.desc}</small>
    </article>
  `).join('');

  if (window.feather) feather.replace();
  revealOnScroll();
}

/* Donuts de cursos en #donuts y tooltip #courseTip */
function renderCourseDonuts(){
  const mount = $id('donuts'); if(!mount) return;

  mount.innerHTML = COURSES.map(c => {
    const deg = Math.round(360 * (c.pct/100));
    return `
      <figure class="donut-item" tabindex="0" data-name="${c.name}" data-pct="${c.pct}">
        <div class="donut" style="background:conic-gradient(#22D3EE ${deg}deg, rgba(34,211,238,.15) ${deg}deg)">
          <div class="inner">${c.pct}%</div>
        </div>
        <figcaption class="donut-label">${c.name}</figcaption>
      </figure>
    `;
  }).join('');

  const tip = document.getElementById('courseTip');
  const show = (el) => { if(!tip) return; tip.style.display='block'; tip.textContent = `${el.dataset.name} — ${el.dataset.pct}%`; };
  const hide = () => { if(tip) tip.style.display='none'; };

  mount.addEventListener('mousemove', (e)=>{ const item = e.target.closest('.donut-item'); if(item) show(item); });
  mount.addEventListener('mouseleave', hide);
  mount.addEventListener('focusin', (e)=>{ const item = e.target.closest('.donut-item'); if(item) show(item); });
  mount.addEventListener('focusout', hide);

  revealOnScroll();
}

/* =====================
   Animaciones / UX
===================== */
function revealOnScroll(){
  const els = document.querySelectorAll('.reveal:not(.in)');
  if (!('IntersectionObserver' in window)) { els.forEach(el => el.classList.add('in')); return; }

  const io = new IntersectionObserver((entries)=>{
    entries.forEach((e)=>{
      if(e.isIntersecting){
        const delay = +e.target.dataset.delay || 0;
        setTimeout(()=> e.target.classList.add('in'), delay);
        io.unobserve(e.target);
      }
    });
  }, { threshold:.15 });

  els.forEach(el => io.observe(el));
}

function initRipple(){
  document.addEventListener('click', (e)=>{
    const btn = e.target.closest('.ripple');
    if(!btn) return;
    btn.classList.add('active');
    setTimeout(()=>btn.classList.remove('active'), 300);
  });
}

function initMagnetic(selector){
  const nodes = document.querySelectorAll(selector);
  nodes.forEach(btn=>{
    const strength = 12;
    btn.addEventListener('mousemove', (e)=>{
      const r = btn.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width/2);
      const y = e.clientY - (r.top + r.height/2);
      btn.style.setProperty('--tx', `${(x/strength).toFixed(1)}px`);
      btn.style.setProperty('--ty', `${(y/strength).toFixed(1)}px`);
      btn.classList.add('magnet');
    });
    btn.addEventListener('mouseleave', ()=>{
      btn.classList.remove('magnet');
      btn.style.removeProperty('--tx'); btn.style.removeProperty('--ty');
    });
  });
}

/* =====================
   Utilidad: contador animado
===================== */
function animateCounter(node, from, to, duration = 800) {
  const start = performance.now();
  function tick(now) {
    const t = Math.min(1, (now - start) / duration);
    const val = Math.round(from + (to - from) * t);
    node.textContent = val.toLocaleString('es-DO');
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/* =====================
   VISITS COUNTER (CountAPI)
===================== */
async function updateVisits() {
  const el = document.getElementById('visits');
  if (!el) return;

  const NAMESPACE = 'alexissamboy-portfolio'; // puedes personalizarlo
  const KEY = 'visits';                       // o hacerlo por página: `visits_${document.body.dataset.page||'index'}`
  const BASE = 'https://api.countapi.xyz';

  // Evitar múltiples incrementos el mismo día (por usuario)
  const today = new Date().toISOString().slice(0,10);
  const dayKey = 'as-visit-today';
  const alreadyCountedToday = localStorage.getItem(dayKey) === today;

  try {
    const url = alreadyCountedToday
      ? `${BASE}/get/${encodeURIComponent(NAMESPACE)}/${encodeURIComponent(KEY)}`
      : `${BASE}/hit/${encodeURIComponent(NAMESPACE)}/${encodeURIComponent(KEY)}`;

    const res = await fetch(url, { cache: 'no-store' });
    const data = await res.json();

    if (!alreadyCountedToday) localStorage.setItem(dayKey, today);

    animateCounter(el, 0, data.value ?? 0, 700);
  } catch (e) {
    // Fallback local si falla la red/API
    const k = 'as-portfolio-visits';
    const prev = parseInt(localStorage.getItem(k) || '0', 10) + 1;
    localStorage.setItem(k, String(prev));
    animateCounter(el, 0, prev, 700);
  }
}
