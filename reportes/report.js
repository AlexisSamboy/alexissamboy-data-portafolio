/* ===========================
   UTILIDADES BÁSICAS
=========================== */
const $ = (s, p = document) => p.querySelector(s);
const $$ = (s, p = document) => [...p.querySelectorAll(s)];
const pad = (n) => String(n).padStart(2, "0");
const fmt = (x) =>
  x.toLocaleString("es-ES", { maximumFractionDigits: 0 });

function ymd(d) {
  const dt = new Date(d);
  return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}`;
}

function parseQuery() {
  const u = new URL(location.href);
  return Object.fromEntries(u.searchParams.entries());
}
function setQuery(params) {
  const u = new URL(location.href);
  Object.entries(params).forEach(([k, v]) => {
    if (v == null || v === "") u.searchParams.delete(k);
    else u.searchParams.set(k, v);
  });
  history.replaceState(null, "", u.toString());
}

/* ===========================
   CANAL DE SINCRONIZACIÓN
=========================== */
function createChannel(name) {
  if ("BroadcastChannel" in window) return new BroadcastChannel(name);
  // Fallback con storage events
  return {
    postMessage: (data) => {
      localStorage.setItem("__bc:" + name, JSON.stringify({ t: Date.now(), data }));
      setTimeout(() => localStorage.removeItem("__bc:" + name), 0);
    },
    addEventListener: (ev, cb) => {
      window.addEventListener("storage", (e) => {
        if (e.key === "__bc:" + name && e.newValue) {
          try {
            cb({ data: JSON.parse(e.newValue).data });
          } catch {}
        }
      });
    },
    close: () => {},
  };
}
const channel = createChannel("portfolio-report-sync");
const syncBadge = $("#syncBadge");

/* ===========================
   DATOS DEMO (2 REPORTES)
=========================== */
const demo = {
  ventas: {
    title: "Ventas Retail — Demo",
    subtitle:
      "KPIs por fecha, categoría y segmento. Usa filtros y abre otra pestaña para ver la sincronización.",
    // dimensiones: date, categoria, segmento, valor
    segments: ["online", "tienda", "corporativo"],
    categories: ["Electrónica", "Hogar", "Deportes", "Moda", "Alimentos"],
    makeData() {
      // 6 meses de datos diarios
      const arr = [];
      const start = new Date();
      start.setMonth(start.getMonth() - 6);
      for (let d = new Date(start); d <= new Date(); d.setDate(d.getDate() + 1)) {
        for (const cat of this.categories) {
          for (const seg of this.segments) {
            const base =
              200 + Math.sin(d.getTime() / 5.2e8) * 80 + (cat.length * 5);
            const noise = (Math.random() - 0.5) * 60;
            const segMult = seg === "online" ? 1 : seg === "tienda" ? 0.85 : 0.6;
            arr.push({
              date: ymd(d),
              categoria: cat,
              segmento: seg,
              valor: Math.max(10, Math.round((base + noise) * segMult)),
            });
          }
        }
      }
      return arr;
    },
  },

  clientes: {
    title: "Clientes & Retención — Demo",
    subtitle:
      "Altas por fecha, vertical y canal. KPIs de volumen y distribución.",
    segments: ["web", "referidos", "ads"],
    categories: ["B2B", "B2C", "Educación", "Salud"],
    makeData() {
      const arr = [];
      const start = new Date();
      start.setMonth(start.getMonth() - 6);
      for (let d = new Date(start); d <= new Date(); d.setDate(d.getDate() + 1)) {
        for (const cat of this.categories) {
          for (const seg of this.segments) {
            const base =
              60 + Math.cos(d.getTime() / 4.3e8) * 20 + (cat.length * 3);
            const noise = (Math.random() - 0.5) * 20;
            const segMult = seg === "web" ? 1 : seg === "referidos" ? 0.9 : 0.7;
            arr.push({
              date: ymd(d),
              categoria: cat,
              segmento: seg,
              valor: Math.max(1, Math.round((base + noise) * segMult)),
            });
          }
        }
      }
      return arr;
    },
  },
};

/* ===========================
   ESTADO
=========================== */
const state = {
  id: "ventas", // ventas | clientes
  from: null,
  to: null,
  segment: null,
  data: [],
};

const KEY = "report-demo-state";

/* ===========================
   UI + CHARTS
=========================== */
let lineChart, barChart, pieChart;

function destroyCharts() {
  [lineChart, barChart, pieChart].forEach((c) => c && c.destroy && c.destroy());
}

function initNavLinks() {
  const base = location.pathname.replace(/reporte\.html$/i, "reporte.html");
  $("#linkVentas").href = `${base}?id=ventas`;
  $("#linkClientes").href = `${base}?id=clientes`;
}

function fillSegmentOptions(cfg) {
  const sel = $("#segment");
  sel.innerHTML = `<option value="">Todos</option>` +
    cfg.segments.map(s => `<option value="${s}">${s}</option>`).join("");
  $("#segmentLabel").textContent = state.id === "ventas" ? "Segmento" : "Canal";
}

function loadFromStorage() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || "{}");
    if (saved[state.id]) {
      const s = saved[state.id];
      state.from = s.from || state.from;
      state.to = s.to || state.to;
      state.segment = s.segment || state.segment;
    }
  } catch {}
}

function persist() {
  const saved = JSON.parse(localStorage.getItem(KEY) || "{}");
  saved[state.id] = { from: state.from, to: state.to, segment: state.segment };
  localStorage.setItem(KEY, JSON.stringify(saved));
}

function applyToInputs() {
  $("#from").value = state.from || "";
  $("#to").value = state.to || "";
  $("#segment").value = state.segment || "";
}

function pulseSync() {
  syncBadge.classList.remove("pulse");
  // reflow
  void syncBadge.offsetWidth;
  syncBadge.classList.add("pulse");
}

/* ====== FILTRADO ====== */
function filterData(rows) {
  return rows.filter((r) => {
    if (state.from && r.date < state.from) return false;
    if (state.to && r.date > state.to) return false;
    if (state.segment && r.segmento !== state.segment) return false;
    return true;
  });
}

/* ====== KPIs ====== */
function renderKPIs(rows) {
  const vals = rows.map((r) => r.valor);
  const total = vals.reduce((a, b) => a + b, 0);
  const avg = vals.length ? total / vals.length : 0;
  $("#kpiTotal").textContent = fmt(total);
  $("#kpiAvg").textContent = fmt(avg);
  $("#kpiMax").textContent = fmt(Math.max(0, ...vals));
  $("#kpiMin").textContent = fmt(vals.length ? Math.min(...vals) : 0);
}

/* ====== CHARTS ====== */
function groupByDate(rows) {
  const map = new Map();
  rows.forEach((r) => {
    map.set(r.date, (map.get(r.date) || 0) + r.valor);
  });
  const out = [...map.entries()]
    .sort((a, b) => (a[0] < b[0] ? -1 : 1))
    .map(([date, value]) => ({ date, value }));
  return out;
}

function groupByCategory(rows) {
  const map = new Map();
  rows.forEach((r) => {
    map.set(r.categoria, (map.get(r.categoria) || 0) + r.valor);
  });
  const out = [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);
  return { labels: out.map((x) => x[0]), values: out.map((x) => x[1]) };
}

function groupBySegment(rows, cfg) {
  const map = new Map();
  cfg.segments.forEach((s) => map.set(s, 0));
  rows.forEach((r) => map.set(r.segmento, (map.get(r.segmento) || 0) + r.valor));
  return { labels: [...map.keys()], values: [...map.values()] };
}

function renderCharts(rows, cfg) {
  destroyCharts();

  // Line
  const series = groupByDate(rows);
  const ctxL = $("#lineChart").getContext("2d");
  lineChart = new Chart(ctxL, {
    type: "line",
    data: {
      labels: series.map((d) => d.date),
      datasets: [
        {
          label: "Total",
          data: series.map((d) => d.value),
          borderWidth: 2,
          borderColor: "#22d3ee",
          tension: 0.3,
          pointRadius: 0,
          fill: true,
          backgroundColor: "rgba(34,211,238,.15)",
        },
      ],
    },
    options: {
      responsive: true,
      animation: { duration: 700 },
      scales: {
        x: { ticks: { color: "#9ca3af" }, grid: { color: "rgba(51,65,85,.35)" } },
        y: { ticks: { color: "#9ca3af" }, grid: { color: "rgba(51,65,85,.35)" } },
      },
      plugins: {
        legend: { labels: { color: "#e5e7eb" } },
        tooltip: { enabled: true },
      },
    },
  });

  // Bar
  const cat = groupByCategory(rows);
  const ctxB = $("#barChart").getContext("2d");
  barChart = new Chart(ctxB, {
    type: "bar",
    data: {
      labels: cat.labels,
      datasets: [
        {
          label: "Top categorías",
          data: cat.values,
          borderWidth: 1,
          backgroundColor: "rgba(96,165,250,.5)",
          borderColor: "#60a5fa",
        },
      ],
    },
    options: {
      responsive: true,
      animation: { duration: 700 },
      scales: {
        x: { ticks: { color: "#9ca3af" }, grid: { color: "rgba(51,65,85,.35)" } },
        y: { ticks: { color: "#9ca3af" }, grid: { color: "rgba(51,65,85,.35)" } },
      },
      plugins: { legend: { labels: { color: "#e5e7eb" } } },
    },
  });

  // Pie/Doughnut por segmento
  const seg = groupBySegment(rows, cfg);
  const ctxP = $("#pieChart").getContext("2d");
  pieChart = new Chart(ctxP, {
    type: "doughnut",
    data: {
      labels: seg.labels,
      datasets: [
        {
          data: seg.values,
          backgroundColor: ["#22d3ee", "#60a5fa", "#34d399", "#f59e0b"],
          borderColor: "#0f172a",
        },
      ],
    },
    options: {
      responsive: true,
      animation: { duration: 700 },
      plugins: {
        legend: { labels: { color: "#e5e7eb" } },
        tooltip: { enabled: true },
      },
    },
  });
}

/* ====== TABLA ====== */
function renderTable(rows) {
  const head = $("#tblHead");
  const body = $("#tblBody");
  head.innerHTML = `<tr><th>Fecha</th><th>Categoría</th><th>Segmento</th><th>Valor</th></tr>`;
  body.innerHTML = rows
    .slice(-500) // evita tablas gigantes
    .reverse()
    .map(
      (r) =>
        `<tr><td>${r.date}</td><td>${r.categoria}</td><td>${r.segmento}</td><td>${fmt(
          r.valor
        )}</td></tr>`
    )
    .join("");
}

/* ===========================
   RENDER PRINCIPAL
=========================== */
function updateUI() {
  const cfg = demo[state.id];
  $("#reportTitle").textContent = cfg.title;
  $("#reportSubtitle").textContent = cfg.subtitle;

  const rows = filterData(state.data);
  renderKPIs(rows);
  renderCharts(rows, cfg);
  renderTable(rows);
}

/* ===========================
   EVENTOS & SYNC
=========================== */
function collectInputsToState() {
  state.from = $("#from").value || null;
  state.to = $("#to").value || null;
  state.segment = $("#segment").value || null;
}

$("#apply").addEventListener("click", () => {
  collectInputsToState();
  persist();
  setQuery({ from: state.from, to: state.to, segment: state.segment, id: state.id });
  channel.postMessage({ type: "filters", payload: { ...state } });
  updateUI();
});

$("#reset").addEventListener("click", () => {
  state.from = state.to = state.segment = null;
  applyToInputs();
  persist();
  setQuery({ from: null, to: null, segment: null, id: state.id });
  channel.postMessage({ type: "filters", payload: { ...state } });
  updateUI();
});

channel.addEventListener("message", (e) => {
  const msg = e.data || {};
  if (msg.type === "filters") {
    const s = msg.payload || {};
    if (s.id !== state.id) return; // solo sincroniza el mismo reporte
    state.from = s.from || null;
    state.to = s.to || null;
    state.segment = s.segment || null;
    applyToInputs();
    setQuery({ from: state.from, to: state.to, segment: state.segment, id: state.id });
    pulseSync();
    updateUI();
  }
});

/* ===========================
   INICIALIZACIÓN
=========================== */
(function init() {
  initNavLinks();

  // lee id + filtros desde URL
  const q = parseQuery();
  state.id = ["ventas", "clientes"].includes(q.id) ? q.id : "ventas";

  // Configura segmentos y datos
  const cfg = demo[state.id];
  fillSegmentOptions(cfg);
  state.data = cfg.makeData();

  // Rango por defecto (últimos 60 días)
  const today = ymd(new Date());
  const d60 = new Date(); d60.setDate(d60.getDate() - 60);
  const defFrom = ymd(d60);

  state.from = q.from || defFrom;
  state.to = q.to || today;
  state.segment = q.segment || "";

  // intenta cargar persistencia y combinar con URL (URL manda)
  loadFromStorage();
  if (q.from) state.from = q.from;
  if (q.to) state.to = q.to;
  if (q.segment !== undefined) state.segment = q.segment;

  applyToInputs();
  setQuery({ id: state.id, from: state.from, to: state.to, segment: state.segment });
  persist();
  updateUI();
})();
