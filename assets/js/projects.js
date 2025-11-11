// ===== Datos de proyectos (ejemplo) =====
const PROJECTS = [
  {
    id:'p1',
    title:'Análisis de Ventas con Power BI y Excel',
    description:'KPIs de ingresos, márgenes y top productos por categoría y región.',
    tags:['Power BI','Excel','DAX','ETL'],
    github:'https://github.com/tu-usuario/ventas-powerbi',
    chart:{ type:'bar', labels:['Q1','Q2','Q3','Q4'], data:[420,560,610,710] }
  },
  {
    id:'p2',
    title:'Exploración de Datos con Python y Pandas',
    description:'Limpieza, EDA y visualización de patrones. Métricas de distribución.',
    tags:['Python','pandas','matplotlib'],
    github:'https://github.com/tu-usuario/eda-pandas',
    chart:{ type:'line', labels:['Ene','Feb','Mar','Abr','May','Jun'], data:[12,19,15,23,28,31] }
  },
  {
    id:'p3',
    title:'Dashboard de Clientes con SQL y Tableau',
    description:'Cohortes, retención y LTV. Consultas con CTEs y funciones ventana.',
    tags:['SQL','CTE','Tableau'],
    github:'https://github.com/tu-usuario/sql-tableau-clientes',
    chart:{ type:'doughnut', labels:['Activos','Inactivos','Nuevos'], data:[62,23,15] }
  }
];

// ===== Helper SVG (GitHub) =====
const GH_ICON = `
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2a10 10 0 00-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.2-3.37-1.2-.45-1.17-1.1-1.48-1.1-1.48-.9-.63.07-.62.07-.62 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.9.83.09-.64.35-1.09.64-1.34-2.22-.26-4.56-1.11-4.56-4.93 0-1.09.39-1.98 1.03-2.68-.1-.26-.45-1.3.1-2.7 0 0 .84-.27 2.75 1.02a9.58 9.58 0 015 0c1.9-1.29 2.74-1.02 2.74-1.02.55 1.4.2 2.44.1 2.7.64.7 1.03 1.59 1.03 2.68 0 3.83-2.34 4.66-4.57 4.92.36.31.68.92.68 1.86v2.75c0 .27.18.58.69.48A10 10 0 0012 2z"/>
  </svg>`;

// ===== Render de tarjetas =====
const grid = document.getElementById('cards');
grid.innerHTML = PROJECTS.map(p => `
  <article class="card reveal" id="${p.id}">
    <div class="card-head">
      <h3>${p.title}</h3>
      <p class="desc">${p.description}</p>
      <div class="chips" aria-label="Tecnologías">
        ${p.tags.map(t=>`<span class="chip">${t}</span>`).join('')}
      </div>
    </div>
    <div class="chart-wrap">
      <canvas id="chart-${p.id}" width="400" height="210" aria-label="Gráfico del proyecto ${p.title}" role="img"></canvas>
    </div>
    <div class="card-foot">
      <a class="btn" href="${p.github}" target="_blank" rel="noopener">
        ${GH_ICON} Ver más en GitHub
      </a>
    </div>
  </article>
`).join('');

// ===== Reveal on scroll =====
const revealEls = document.querySelectorAll('.reveal');
const ioReveal = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){ e.target.classList.add('in'); ioReveal.unobserve(e.target); }
  })
}, { threshold:.12 });
revealEls.forEach(el=>ioReveal.observe(el));

// ===== Crear charts al entrar en viewport =====
const created = new Set();
const ioCharts = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(!entry.isIntersecting) return;
    const card = entry.target;
    const pid = card.id;
    if(created.has(pid)) return;

    const cfg = PROJECTS.find(p=>p.id===pid);
    if(!cfg) return;
    const canvas = document.getElementById(`chart-${pid}`);
    if(!canvas || !window.Chart) return; // guard por si falla el CDN

    const ctx = canvas.getContext('2d');
    const border = 'rgba(34,211,238,1)';   // cyan
    const fill   = 'rgba(34,211,238,.25)';
    const grid   = '#334155'; const tick='#9CA3AF';

    const baseOpts = {
      responsive:true,
      animation:{ duration:900, easing:'easeOutQuart' },
      scales:{
        x:{ grid:{color:grid}, ticks:{color:tick} },
        y:{ grid:{color:grid}, ticks:{color:tick}, beginAtZero:true }
      },
      plugins:{ legend:{ display:false }, tooltip:{ enabled:true } }
    };

    if(cfg.chart.type==='bar'){
      new Chart(ctx,{ type:'bar',
        data:{ labels:cfg.chart.labels, datasets:[{ data:cfg.chart.data, backgroundColor:fill, borderColor:border, borderWidth:1, hoverBackgroundColor:'rgba(34,211,238,.4)'}]},
        options: baseOpts
      });
    }else if(cfg.chart.type==='line'){
      new Chart(ctx,{ type:'line',
        data:{ labels:cfg.chart.labels, datasets:[{ data:cfg.chart.data, borderColor:border, backgroundColor:fill, fill:true, tension:.35, pointRadius:0 }]},
        options: baseOpts
      });
    }else if(cfg.chart.type==='doughnut'){
      new Chart(ctx,{ type:'doughnut',
        data:{ labels:cfg.chart.labels, datasets:[{ data:cfg.chart.data, backgroundColor:[border,'rgba(96,165,250,1)','rgba(2,132,199,1)'], borderColor:'#0b1220', borderWidth:2 }]},
        options:{ cutout:'62%', plugins:{ legend:{ display:false }}, animation:{ animateRotate:true, duration:1000, easing:'easeOutQuart' } }
      });
    }

    created.add(pid);
    ioCharts.unobserve(card);
  });
}, { threshold:.35 });
document.querySelectorAll('.card').forEach(c=>ioCharts.observe(c));

// Año en footer
const y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();
