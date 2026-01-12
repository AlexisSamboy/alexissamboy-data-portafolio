/* =========================================================
   SQL BÁSICO (Práctica) - Base de Datos de Ventas
   Autor: Alexis V. Samboy H. -- Analista de Datos Junior
   Objetivo: practicar SELECT, WHERE, LIKE, BETWEEN,
             DISTINCT, agregaciones, GROUP BY y JOIN.
========================================================= */

USE VENTAS;
GO

/* 1) Ver tablas (explorar datos) */
SELECT TOP 50 * FROM YTProducto;
SELECT TOP 50 * FROM YTVentas;
SELECT TOP 50 * FROM YTGerente;


/* 2) Seleccionar solo algunas columnas */
SELECT
    fecha,
    precio,
    ciudad
FROM YTVentas;


/* 3) Poner nombres (alias) y crear una columna calculada */
SELECT
    Id_producto AS Codigo_Producto,
    fecha,
    precio AS Precio_Unitario,
    cantidad,
    (cantidad * precio) AS Total
FROM YTVentas
ORDER BY Total DESC;  


/* 4) Filtrar con WHERE (solo producto 1) */
SELECT
    Id_producto AS Codigo_Producto,
    fecha,
    precio,
    cantidad,
    (cantidad * precio) AS Total
FROM YTVentas
WHERE Id_producto = 1
ORDER BY Total DESC;


/* 5) Filtrar con IN (producto 1,2,3,4) */
SELECT
    Id_producto AS Codigo_Producto,
    fecha,
    precio,
    cantidad,
    (cantidad * precio) AS Total
FROM YTVentas
WHERE Id_producto IN (1,2,3,4)
ORDER BY Total DESC;


/* 6) Filtrar por tipo de compra y método de pago */
SELECT TOP 50 *
FROM YTVentas
WHERE [Tipo de Compra] = 'Tienda'
  AND [Método de Pago] = 'Tarjeta de Credito';


/* 7) LIKE (búsqueda por texto) */
-- Gerentes con apellido Perez
SELECT TOP 50 *
FROM YTGerente
WHERE Gerente LIKE '%Perez%';

-- Gerentes que empiezan con J
SELECT TOP 50 *
FROM YTGerente
WHERE Gerente LIKE 'J%';


/* 8) BETWEEN (rango de fechas) */
SELECT TOP 50 *
FROM YTVentas
WHERE fecha BETWEEN '2022-12-01' AND '2022-12-31';


/* 9) DISTINCT (valores únicos) */
SELECT DISTINCT [Método de Pago]
FROM YTVentas;


/* 10) Agregaciones (promedio, min, max, total ventas) */
SELECT
    AVG(precio) AS Promedio_Precio,
    MIN(precio) AS Precio_Minimo,
    MAX(precio) AS Precio_Maximo,
    SUM(precio * cantidad) AS Total_Ventas
FROM YTVentas;


/* 11) Total de ventas por ciudad (GROUP BY) */
SELECT
    ciudad,
    SUM(precio * cantidad) AS Total_Ventas
FROM YTVentas
GROUP BY ciudad
ORDER BY Total_Ventas DESC;


/* 12) Filtrar ciudades con ventas mayores a 100,000 (HAVING) */
SELECT
    ciudad,
    SUM(precio * cantidad) AS Total_Ventas
FROM YTVentas
GROUP BY ciudad
HAVING SUM(precio * cantidad) > 100000
ORDER BY Total_Ventas DESC;


/* 13) JOIN (unir ventas con productos y gerentes)
*/
SELECT TOP 100
    YTVentas.Fecha,
    YTVentas.ciudad,
    YTVentas.precio,
    YTVentas.cantidad,
    (YTVentas.precio * YTVentas.cantidad) AS Total,
    YTProducto.Producto AS Producto,          
    YTGerente.Gerente                   
FROM YTVentas 
LEFT JOIN YTProducto 
    ON YTVentas.Id_producto = YTProducto.Id_producto
LEFT JOIN YTGerente 
    ON YTVentas.Id_gerente = YTGerente.Id_gerente
ORDER BY YTVentas.fecha DESC;


/* 14) Ventas sin gerente asignado */
SELECT TOP 100
    v.*
FROM YTVentas v
LEFT JOIN YTGerente g
    ON v.Id_gerente = g.Id_gerente
WHERE g.Id_gerente IS NULL;
