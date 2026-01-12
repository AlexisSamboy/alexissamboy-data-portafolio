# 📊 Dashboard de Ventas (SQL Server → Power BI) — Nivel Básico

Este proyecto muestra un flujo básico de análisis de datos: **SQL Server** para almacenamiento y consultas, y **Power BI** para modelado y visualización.

---

## 🎯 Objetivo
Analizar ventas para responder preguntas simples:
- ¿Cuánto se vendió en total?
- ¿Cómo varían las ventas por mes?
- ¿Qué productos y ciudades aportan más?
- ¿Qué métodos de pago se usan más?

---

## 🗂️ Datos (SQL Server)
Tablas utilizadas:
- **YTVentas** (hechos): fecha, producto, gerente, ciudad, cantidad, precio, método de pago
- **YTProducto** (dimensión): catálogo de productos
- **YTGerente** (dimensión): catálogo de gerentes

Archivos:
- `sql/schema.sql` → crea la base de datos y tablas
- `sql/queries_ventas_basico.sql` → consultas básicas de práctica

---

## 🔎 Consultas SQL realizadas (básicas)
- Exploración de tablas (`SELECT *`)
- Selección de columnas específicas
- Renombrado con alias
- Columna calculada: **Total = Cantidad * Precio**
- Ordenamiento por total

---

## ⚙️ Power BI (ETL + Modelo)
- Conexión directa a SQL Server (modo Import)
- Limpieza en Power Query: tipos de datos, recorte de textos, eliminación de nulos en columnas clave
- Modelo: FactVentas relacionada con DimProducto y DimGerente
- Tabla calendario (DimFecha) para análisis por tiempo

---

## 📈 Dashboard (Página 1)
Incluye:
- KPIs: Total Ventas, Órdenes, Total Cantidad, Ticket Promedio
- Ventas por mes
- Top productos
- Ventas por ciudad
- Distribución por método de pago

---

## 🖼️ Capturas
(Agrega aquí imágenes del dashboard)
- `img/vision-general.png`
