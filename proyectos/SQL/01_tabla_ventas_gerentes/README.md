# 🧾 Consultas SQL básicas — Base de Ventas (SQL Server)

Colección de consultas para demostrar dominio básico de SQL usando una base de datos de ventas.

## ✅ Qué demuestro aquí
- Exploración de tablas (SELECT)
- Selección de columnas y alias
- Columnas calculadas (ventas = precio * cantidad)
- Filtros: WHERE, IN, AND/OR
- Búsquedas: LIKE
- Fechas: BETWEEN
- DISTINCT + COUNT DISTINCT
- Agregaciones: AVG, MIN, MAX, SUM
- GROUP BY + HAVING
- JOINS: LEFT JOIN (ventas + productos + gerentes)
- Detección de registros huérfanos (ventas sin gerente)

## 📂 Archivos
- `queries_ventas_basico.sql` → consultas organizadas por secciones

## ▶️ Cómo ejecutarlo (SQL Server / SSMS)
1. Abre SSMS y selecciona tu instancia.
2. Asegúrate de tener la base `VENTAS`.
3. Ejecuta el archivo `queries_ventas_basico.sql`.
