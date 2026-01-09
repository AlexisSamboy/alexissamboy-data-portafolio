# 🎧 Análisis del comportamiento de escucha de Spotify

Proyecto de análisis de datos basado en el **historial completo de reproducciones de Spotify**, utilizando **Python (Pandas)** para la limpieza y transformación de datos, y **Power BI** para la visualización y análisis interactivo.

El objetivo es identificar patrones de consumo musical, comportamiento del usuario y evolución de gustos a lo largo del tiempo, a partir de datos reales.

---

## 📌 Objetivos del Proyecto

- Analizar hábitos de escucha musical en el tiempo.
- Identificar artistas, canciones y álbumes más reproducidos.
- Explorar patrones por:
  - Hora del día
  - Día de la semana
  - Mes y año
- Preparar un conjunto de datos limpio y estructurado para visualizar en Power BI
- Demostrar habilidades prácticas de **Análisis de datos** aplicadas a datos reales

---

## 📂 Fuente de Datos

Los datos fueron obtenidos directamente desde Spotify mediante la solicitud del **historial completo de cuenta**.

- Formato: `JSON`
- Archivos:
  - Historial de transmisión (audio)
  - Historial de streaming (Video – no incluido en la fase inicial del análisis)

---

## 📊 Diccionario de Datos – Historial de Reproducción

### 🕒 Identificación y Tiempo

| Campo | Descripción |
|------|------------|
| `ts` | Marca de tiempo (UTC) en la que finalizó la reproducción |
| `nombre de usuario` | Nombre de usuario de Spotify |
| `plataforma` | Plataforma o dispositivo utilizado (Android, iOS, Chromecast, Web, etc.) |
| `ms_played` | Duración de la reproducción en milisegundos |
| `conn_país` | Código del país desde donde se realizó la conexión |

---

### 🎵 Detalles del Contenido

| Campo | Descripción |
|------|------------|
| `master_metadata_nombre_pista` | Nombre de la canción |
| `master_metadata_album_artist_name` | Nombre del artista o banda |
| `master_metadata_album_album_name` | Nombre del álbum |
| `spotify_track_uri` | Identificador único (URI) de la pista |
| `nombre_episodio` | Nombre del episodio (si es podcast) |
| `episodio_show_name` | Nombre del programa del podcast |

---

### 🧠 Comportamiento del Usuario

| Campo | Descripción |
|------|------------|
| `razón_inicio` | Motivo por el cual inició la reproducción |
| `razón_end` | Motivo por el cual finalizó la reproducción |
| `barajar` | Indica si el modo aleatorio estaba activado |
| `saltado` | Indica si la canción fue saltada |
| `modo_incógnito` | Indica si la sesión fue privada |

---

### 🌐 Conectividad y Red

| Campo | Descripción |
|------|------------|
| `ip_addr_decrypt` | Dirección IP registrada durante la reproducción |
| `user_agent_decrypt` | Navegador o agente de usuario |
| `fuera de línea` | Indica si la reproducción fue sin conexión |
| `marca de tiempo_fuera de línea` | Marca de tiempo asociada a la reproducción offline |

---

## 🛠️ Tecnologías Utilizadas

- **Pitón**
  - Pandas
  - JSON
- **Google Colab**
- **Power BI**
- **Git y GitHub**

---

## 📈 Estado del Proyecto

🔄 En desarrollo  
- [x] Carga de datos
- [x] Limpieza básica
- [x] Renombrado de columnas
- [ ] Ingeniería de características
- [ ] Análisis exploratorio
- [ ] Panel de control en Power BI

---

## 👤 Autor

**Alexis V. Samboy Herrera**  
Proyecto personal de análisis de datos con fines de aprendizaje y portafolio profesional.
