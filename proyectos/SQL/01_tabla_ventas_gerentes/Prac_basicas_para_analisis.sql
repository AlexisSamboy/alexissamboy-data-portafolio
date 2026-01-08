USE VENTAS

SELECT * FROM YTProducto

-- Explorando el SET de datos

select * from YTVentas

-- Filtrando algunas columnas
select 
FECHA,
PRECIO,
CIUDAD
from YTVentas

--Renombrado de algunas columnas

SELECT 
Id_producto as 'Codigo_Producto',
fecha,
precio as 'precio_unitario',
Cantidad
FROM YTVentas

-- Creando columnas calculadas
SELECT 
Id_producto as 'Codigo_Producto',
fecha,
precio as 'precio_unitario',
Cantidad,
cantidad * precio as 'Total'
FROM YTVentas

--Ordenar los resultados de mayor total al menor

SELECT 
Id_producto as 'Codigo_Producto',
fecha,
precio as 'precio_unitario',
Cantidad,
cantidad * precio as 'Total'
FROM YTVentas
ORDER BY 'Total' desc

--Filtrar los datos que tengan solo id = 1

SELECT 
Id_producto as 'Codigo_Producto',
fecha,
precio as 'precio_unitario',
Cantidad,
cantidad * precio as 'Total'
FROM YTVentas
WHERE Id_producto = 1
ORDER BY 'Total' desc

--Filtrar los datos que tengan solo id = 1 o 2

SELECT 
Id_producto as 'Codigo_Producto',
fecha,
precio as 'precio_unitario',
Cantidad,
cantidad * precio as 'Total'
FROM YTVentas
WHERE Id_producto = 1 or Id_producto = 2
ORDER BY 'Total' desc

--Filtrar los datos que tengan (1,2,3, y 4)

SELECT 
Id_producto as 'Codigo_Producto',
fecha,
precio as 'precio_unitario',
Cantidad,
cantidad * precio as 'Total'
FROM YTVentas
WHERE Id_producto in (1,2,3,4)
ORDER BY 'Total' desc

--Filtrar los datos que sean de Tiendas y Pagos de Tarjeta de Credito

SELECT * FROM YTVentas
WHERE [Tipo de Compra] = 'Tienda' and [Método de Pago] = ' Tarjeta de Credito'

-- Consulta de tabla Gerentes

SELECT * FROM YTGerente

-- Buscar Gerente el cual sea apellido perez

SELECT * FROM YTGerente
WHERE Gerente like '%Perez'

-- Buscar Gerente el cual su nombre y apellido tenga la letra "A"

SELECT * FROM YTGerente
WHERE Gerente like '%a%'

-- Buscar Gerente el cual su nombre inicia con la letra  "J"

SELECT * FROM YTGerente
WHERE Gerente like 'j%'

-- Buscar Gerente el cual su nombre y apellido no contenga la letra "A"

SELECT * FROM YTGerente
WHERE Gerente not like '%a%'

-- Filtrar los datos dentro de un rango de fecha del 1 al 31 de noviembre del 2022

SELECT * FROM YTVentas
WHERE fecha between '2022-12-01' and '2022-12-31'

-- Obtener los distintos datos dentro de una columna 

SELECT distinct [Método de Pago] FROM YTVentas

-- Obtener el conteo de los distintos datos dentro de una columna 

SELECT count (distinct [Método de Pago]) as 'cantidad de metodos de pagos' FROM YTVentas

-- Obtener metricas agregadas (Promedio, Suma, Minimo, Maximo)

SELECT
	avg(precio) as 'Promedio de precio unitario',
	min(precio) as 'Precio minimo',
	max(precio) as 'Precio maximo',
	sum(precio * Cantidad) as 'Total de ventas'
FROM YTVentas

-- Obtener el total de ventas por ciudad y ordenarla de manera de descendente 

SELECT 
	Ciudad,
	sum(precio * Cantidad) as 'Total de ventas'
FROM YTVentas
GROUP BY Ciudad --Siempre es necesario ordenar por la condicion que elija filtrar
ORDER BY 'Total de ventas' desc

-- Filtrar ciudades donde el total de ventas sea superior a 100,000

SELECT 
	Ciudad,
	sum(precio * Cantidad) as 'Total de ventas'
FROM YTVentas
GROUP BY Ciudad
HAVING sum(precio * Cantidad) > 100000 -- Para utilizar el filtrado de having es necesario un group by y la condicion a filtrar
ORDER BY 'Total de ventas' desc

--Unir la tabla de ventas con productos y gerentes utilzando LEFT JOIN o sea la tabla de la derecha con la izquierda

SELECT * FROM YTVentas
left join YTProducto on YTVentas.Id_producto = YTVentas.ID_producto
left join YTGerente on YTVentas.Id_gerente = YTVentas.Id_gerente

--Buscar registro en YTVentas que no tenga un gerente asignado

SELECT * FROM YTVentas
left join YTProducto on YTVentas.Id_producto = YTVentas.ID_producto
left join YTGerente on YTVentas.Id_gerente = YTVentas.Id_gerente

--Buscar registro en YTVentas tomando como referencia la tabla gerentes

SELECT * FROM YTVentas
right join YTGerente on YTVentas.Id_gerente = YTGerente.Id_gerente

--Buscar registro en YTGerentes donde solo vengan los gerente que si tienen datos registrados

SELECT * FROM YTVentas
inner join YTGerente on YTVentas.Id_gerente = YTGerente.Id_gerente
order by YTGerente.Id_gerente

--Buscar todos los registros incluso si no hay coincidencias en alguna de las tablas

SELECT * FROM YTVentas
full outer join YTGerente on YTVentas.Id_gerente = YTGerente.Id_gerente
order by YTGerente.Id_gerente

--SUB QUERY o SUB CONSULTAS

