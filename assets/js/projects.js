/* ====== DATA (ejemplos) ======
   Coloca tus MP4 o GIF en /assets/media/ y actualiza las rutas.
*/
const PROJECTS = [
  {
    id: "ventas-bi",
    title: "Análisis de Ventas — Power BI + Excel",
    desc: "KPIs, serie temporal y desglose por categoría. Flujo ETL en Excel y modelo de datos simple.",
    tags: ["Power BI", "Excel", "DAX", "ETL", "KPI"],
    // Cambia por tus archivos locales:
    preview: "./assets/media/ventas-bi.mp4",
    poster: "./assets/media/ventas-bi_poster.jpg",
    github: "https://github.com/AlexisSamboy/proyecto_powerbi",
    readme: "https://github.com/AlexisSamboy/proyecto_powerbi#readme"
  },
  {
    id: "churn-py",
    title: "Exploración de Churn — Python + pandas",
    desc: "EDA, limpieza, cohortes y baseline de clasificación (Regresión Logística).",
    tags: ["Python", "pandas", "EDA", "ML"],
    preview: "./assets/media/churn_py.mp4",
    poster: "./assets/media/churn_py_poster.jpg",
    github: "https://github.com/AlexisSamboy/proyecto_churn",
    readme: "https://github.com/AlexisSamboy/proyecto_churn#readme"
  },
  {
    id: "clientes-sql",
    title: "Consultas de Clientes — SQL",
    desc: "CTEs, ventanas y KPIs de clientes. Scripts reproducibles con datos de ejemplo.",
    tags: ["SQL", "MySQL", "KPIs"],
    // Si no tienes aún el media, deja vacío para ver el fallback:
    preview: "",
    poster: "./assets/media/sql_poster.jpg",
    github: "https://github.com/AlexisSamboy/proyecto_sql",
    readme: "https://github.com/AlexisSamboy/proyecto_sql#readme"
  }
];

/* ====== RENDER ====== */
const $ = (s, sc=document) => sc.querySelector(s);
const $$ = (s, sc=document) => [...sc.querySelectorAll(s)];
const cardsMount = $("#cards");

function tagHtml(t){ return `<span class="pj-tag">${t}</span>`; }

function mediaHtml(item){
  // Video si hay preview; si no, poster; si tampoco, fallback.
  if (item.preview) {
    return `
      <div class="pj-media">
        <video muted autoplay playsinline loop preload="metadata"
               ${item.poster ? `poster="${item.poster}"` : ""}>
          <source src="${item.preview}" type="video/mp4"/>
        </video>
      </div>`;
  }
  if (item.poster) {
    return `<div class="pj-media"><img src="${item.poster}" alt=""></div>`;
  }
  return `<div class="pj-media pj-empty">Preview no disponible</div>`;
}

function cardHtml(item){
  return `
  <article class="pj-card" data-tags="${item.tags.join(",")}">
    ${mediaHtml(item)}
    <div class="pj-body">
      <h3 class="pj-title">${item.title}</h3>
      <p class="pj-desc">${item.desc}</p>
      <div class="pj-tags">${item.tags.map(tagHtml).join("")}</div>
      <div class="pj-actions">
        <a href="#" class="btn" data-open="${item.id}">Vista previa</a>
        <a href="${item.github}" target="_blank" rel="noopener" class="btn btn--ghost">GitHub</a>
      </div>
    </div>
  </article>`;
}

function render(list){
  cardsMount.innerHTML = list.map(cardHtml).join("");
}

/* ====== BUSCAR / FILTRAR ====== */
const input = $("#q");
const chips = $$("#chips .chip");
let currentFilter = "*";
let query = "";

function applyFilters(){
  const q = query.toLowerCase();
  const filtered = PROJECTS.filter(p => {
    const matchesText = !q || (p.title+ " " + p.desc + " " + p.tags.join(" ")).toLowerCase().includes(q);
    const matchesTag = currentFilter === "*" || p.tags.includes(currentFilter);
    return matchesText && matchesTag;
  });
  render(filtered);
}

input.addEventListener("input", e => { query = e.target.value.trim(); applyFilters(); });

chips.forEach(btn=>{
  btn.addEventListener("click", ()=>{
    chips.forEach(x=>x.classList.remove("is-active"));
    btn.classList.add("is-active");
    currentFilter = btn.dataset.filter;
    applyFilters();
  });
});

/* ====== MODAL ====== */
const modal = $("#pj-modal");
const mMedia = $("#pjm-media");
const mTitle = $("#pjm-title");
const mDesc  = $("#pjm-desc");
const mTags  = $("#pjm-tags");
const mGit   = $("#pjm-github");
const mRead  = $("#pjm-readme");

function openModal(id){
  const p = PROJECTS.find(x => x.id === id);
  if(!p) return;

  // Media en modal (igual lógica que en card)
  mMedia.innerHTML = p.preview
    ? `<video muted autoplay playsinline loop controls preload="metadata" ${p.poster ? `poster="${p.poster}"` : ""}>
         <source src="${p.preview}" type="video/mp4"/>
       </video>`
    : (p.poster ? `<img src="${p.poster}" alt="">` : `<div class="pj-empty" style="height:100%">Preview no disponible</div>`);

  mTitle.textContent = p.title;
  mDesc.textContent  = p.desc;
  mTags.innerHTML    = p.tags.map(tagHtml).join("");
  mGit.href = p.github || "#";
  mRead.href = p.readme || p.github || "#";

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal(){
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  mMedia.innerHTML = "";
}

document.addEventListener("click", e=>{
  const openBtn = e.target.closest("[data-open]");
  if(openBtn){
    e.preventDefault();
    openModal(openBtn.dataset.open);
  }
  if(e.target.matches("[data-close]")) closeModal();
});

document.addEventListener("keydown", e=>{
  if(e.key === "Escape") closeModal();
});

/* ====== INIT ====== */
render(PROJECTS);
