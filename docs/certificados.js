// ===========================
// CERTIFICADOS (EDITA ESTO)
// ===========================
const CERTS = [
  {
    title: "Google Data Analytics (Foundations)",
    issuer: "Google",
    date: "2025-11-10",
    type: "image", // "image" | "pdf"
    file: "./assets/certs/google-data-analytics.png",
    thumb: "./assets/certs/thumbs/google-data-analytics.jpg",
    verify: "https://example.com/verify/ABC123",
    tags: ["Analytics", "Data", "Foundations"]
  },
  {
    title: "SQL for Data Analysis",
    issuer: "Coursera",
    date: "2025-09-22",
    type: "pdf",
    file: "./assets/certs/sql-data-analysis.pdf",
    thumb: "./assets/certs/thumbs/sql-data-analysis.jpg",
    verify: "ID: SQL-2025-0091",
    tags: ["SQL", "Joins", "Queries"]
  },
  {
    title: "Power BI Dashboarding",
    issuer: "Microsoft",
    date: "2025-07-05",
    type: "image",
    file: "./assets/certs/powerbi-dashboard.png",
    thumb: "./assets/certs/thumbs/powerbi-dashboard.jpg",
    verify: "ID: MS-PL300-XXXX",
    tags: ["Power BI", "DAX", "Dashboards"]
  }
];

// ✅ FORZADO: al entrar, SIEMPRE más recientes primero (independiente del filtro)
CERTS.sort((a, b) => new Date(b.date) - new Date(a.date));

// ---------- helpers ----------
const $ = (sel) => document.querySelector(sel);

const grid = $("#grid");
const q = $("#q");
const issuerSel = $("#issuer");
const sortSel = $("#sort");
const countEl = $("#count");

// stats
const statTotal = $("#statTotal");
const statIssuers = $("#statIssuers");
const statLatest = $("#statLatest");
const statTopTag = $("#statTopTag");

// modal elements
const modal = $("#modal");
const viewerMedia = $("#viewerMedia");
const vTitle = $("#vTitle");
const vMeta = $("#vMeta");
const vIssuer = $("#vIssuer");
const vDate = $("#vDate");
const vVerify = $("#vVerify");
const vTags = $("#vTags");
const downloadBtn = $("#downloadBtn");
const closeBtn = $("#closeBtn");
const prevBtn = $("#prevBtn");
const nextBtn = $("#nextBtn");

let filtered = [...CERTS];
let currentIndex = 0;

// ---------- init ----------
function init() {
  // fuerza el selector en "new" al cargar (por si el navegador recuerda estado)
  sortSel.value = "new";

  // fill issuer dropdown
  const issuers = Array.from(new Set(CERTS.map(c => c.issuer))).sort((a,b)=>a.localeCompare(b));
  for (const i of issuers) {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = i;
    issuerSel.appendChild(opt);
  }

  // stats
  statTotal.textContent = CERTS.length;
  statIssuers.textContent = issuers.length;

  const sortedByDate = [...CERTS].sort((a,b)=> new Date(b.date) - new Date(a.date));
  statLatest.textContent = sortedByDate[0] ? fmtDate(sortedByDate[0].date) : "—";

  const tagCount = {};
  CERTS.forEach(c => (c.tags||[]).forEach(t => tagCount[t] = (tagCount[t]||0)+1));
  const top = Object.entries(tagCount).sort((a,b)=>b[1]-a[1])[0];
  statTopTag.textContent = top ? top[0] : "—";

  // listeners
  q.addEventListener("input", applyFilters);
  issuerSel.addEventListener("change", applyFilters);
  sortSel.addEventListener("change", applyFilters);

  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });

  prevBtn.addEventListener("click", () => step(-1));
  nextBtn.addEventListener("click", () => step(+1));

  document.addEventListener("keydown", (e) => {
    if (!modal.classList.contains("open")) return;
    if (e.key === "Escape") closeModal();
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(+1);
  });

  applyFilters();
}

function fmtDate(d){
  try{
    const dt = new Date(d + "T00:00:00");
    return dt.toLocaleDateString("es-DO", { year:"numeric", month:"short", day:"2-digit" });
  } catch { return d; }
}

function applyFilters() {
  const query = q.value.trim().toLowerCase();
  const issuer = issuerSel.value;

  filtered = CERTS.filter(c => {
    const blob = `${c.title} ${c.issuer} ${(c.tags||[]).join(" ")} ${c.verify||""}`.toLowerCase();
    const okQ = !query || blob.includes(query);
    const okI = issuer === "all" || c.issuer === issuer;
    return okQ && okI;
  });

  // sort
  const s = sortSel.value;
  if (s === "new") filtered.sort((a,b)=> new Date(b.date) - new Date(a.date));
  if (s === "old") filtered.sort((a,b)=> new Date(a.date) - new Date(b.date));
  if (s === "az")  filtered.sort((a,b)=> a.title.localeCompare(b.title));

  renderGrid();
  countEl.textContent = filtered.length;
}

function renderGrid() {
  grid.innerHTML = "";

  filtered.forEach((c, idx) => {
    const card = document.createElement("article");
    card.className = "card";
    card.tabIndex = 0;

    const badgeText = c.type === "pdf" ? "PDF" : "CERT";
    const badgeClass = c.type === "pdf" ? "badge pdf" : "badge";

    card.innerHTML = `
      <div class="thumb">
        <span class="${badgeClass}">${badgeText}</span>
        <img src="${c.thumb || c.file}" alt="${escapeHtml(c.title)}" loading="lazy" />
      </div>
      <div class="card-body">
        <h3 class="card-title">${escapeHtml(c.title)}</h3>
        <p class="meta">
          <span>🏢 ${escapeHtml(c.issuer)}</span>
          <span>📅 ${fmtDate(c.date)}</span>
        </p>
        <div class="tags">
          ${(c.tags||[]).slice(0,3).map(t => `<span class="chip">${escapeHtml(t)}</span>`).join("")}
        </div>
      </div>
    `;

    card.addEventListener("click", () => openModal(idx));
    card.addEventListener("keydown", (e) => { if (e.key === "Enter") openModal(idx); });

    grid.appendChild(card);
  });

  if (filtered.length === 0) {
    const empty = document.createElement("div");
    empty.style.cssText = "grid-column:1/-1; padding:22px; border:1px solid rgba(255,255,255,.1); border-radius:18px; background:rgba(255,255,255,.05); color:rgba(255,255,255,.75); font-weight:800;";
    empty.textContent = "No hay resultados con ese filtro. Prueba otra palabra o emisor.";
    grid.appendChild(empty);
  }
}

function openModal(idx) {
  currentIndex = idx;
  const c = filtered[currentIndex];

  vTitle.textContent = c.title;
  vMeta.textContent = `${c.issuer} • ${fmtDate(c.date)}`;
  vIssuer.textContent = c.issuer;
  vDate.textContent = fmtDate(c.date);

  // verify: si es link, lo ponemos clickeable
  vVerify.innerHTML = formatVerify(c.verify);

  vTags.textContent = (c.tags && c.tags.length) ? c.tags.join(" • ") : "—";

  // download
  downloadBtn.href = c.file;
  downloadBtn.setAttribute("download", `AlexisSamboy-${slug(c.title)}${getExt(c.file)}`);

  // media
  viewerMedia.innerHTML = "";
  if (c.type === "pdf") {
    const iframe = document.createElement("iframe");
    iframe.src = c.file;
    iframe.title = c.title;
    viewerMedia.appendChild(iframe);
  } else {
    const img = document.createElement("img");
    img.src = c.file;
    img.alt = c.title;
    img.loading = "eager";
    viewerMedia.appendChild(img);
  }

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  viewerMedia.innerHTML = "";
}

function step(dir) {
  if (!filtered.length) return;
  currentIndex = (currentIndex + dir + filtered.length) % filtered.length;
  openModal(currentIndex);
}

// utils
function escapeHtml(str=""){
  return String(str).replace(/[&<>"']/g, s => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[s]));
}
function slug(str=""){
  return String(str).toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");
}
function getExt(file=""){
  const m = String(file).match(/\.[a-z0-9]+$/i);
  return m ? m[0] : (file.includes(".") ? "" : ".png");
}
function formatVerify(v){
  if (!v) return "—";
  const val = String(v);
  if (/^https?:\/\//i.test(val)) {
    const safe = escapeHtml(val);
    return `<a href="${safe}" target="_blank" rel="noopener noreferrer">Abrir verificación ↗</a>`;
  }
  return escapeHtml(val);
}

init();
