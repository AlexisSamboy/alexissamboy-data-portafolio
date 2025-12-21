// Configuración Global de Estilos para Chart.js
Chart.defaults.color = '#a0a0a0';
Chart.defaults.font.family = "'Space Grotesk', sans-serif";

// Variables de color del CSS
const neonCyan = '#00f3ff';
const neonPurple = '#bc13fe';
const gridColor = 'rgba(255, 255, 255, 0.05)';

// 1. GRÁFICO DE TRÁFICO (Línea con relleno)
const ctxTraffic = document.getElementById('trafficChart').getContext('2d');

// Crear gradiente para el relleno
const gradientTraffic = ctxTraffic.createLinearGradient(0, 0, 0, 400);
gradientTraffic.addColorStop(0, 'rgba(0, 243, 255, 0.5)'); // Cyan transparente
gradientTraffic.addColorStop(1, 'rgba(0, 243, 255, 0)');

new Chart(ctxTraffic, {
    type: 'line',
    data: {
        labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:59'],
        datasets: [{
            label: 'Usuarios Activos',
            data: [120, 190, 300, 500, 450, 600, 750],
            borderColor: neonCyan,
            backgroundColor: gradientTraffic,
            borderWidth: 2,
            fill: true,
            tension: 0.4 // Curvas suaves
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false } // Ocultar leyenda
        },
        scales: {
            y: { grid: { color: gridColor }, beginAtZero: true },
            x: { grid: { color: gridColor } }
        }
    }
});

// 2. GRÁFICO DE BARRAS (Distribución)
const ctxSource = document.getElementById('sourceChart').getContext('2d');

new Chart(ctxSource, {
    type: 'bar',
    data: {
        labels: ['SQL', 'Python', 'R', 'Excel', 'Tableau'],
        datasets: [{
            label: 'Frecuencia de Uso',
            data: [85, 90, 60, 40, 75],
            backgroundColor: [
                neonPurple,
                neonCyan,
                '#ff0055', // Un rosa neón extra
                '#ffffff',
                '#4d4dff'
            ],
            borderRadius: 5
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false }
        },
        scales: {
            y: { grid: { display: false } },
            x: { grid: { color: gridColor } }
        }
    }
});

// 3. GRÁFICO DE RADAR (Performance)
const ctxPerf = document.getElementById('performanceChart').getContext('2d');

new Chart(ctxPerf, {
    type: 'radar',
    data: {
        labels: ['Limpieza', 'Modelado', 'Viz', 'Comunicación', 'Estadística'],
        datasets: [{
            label: 'Skillset Actual',
            data: [95, 80, 90, 85, 75],
            backgroundColor: 'rgba(188, 19, 254, 0.2)', // Purple transparente
            borderColor: neonPurple,
            pointBackgroundColor: neonCyan,
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: neonPurple
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            r: {
                angleLines: { color: gridColor },
                grid: { color: gridColor },
                pointLabels: { color: '#fff', font: { size: 12 } },
                ticks: { display: false, backdropColor: 'transparent' }
            }
        }
    }
});