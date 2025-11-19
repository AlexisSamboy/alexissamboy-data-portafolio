# 📞 Marketing Bancario – Predicción de Conversión de Clientes

Proyecto de análisis de datos y modelado predictivo para identificar **qué perfil de clientes tiene mayor probabilidad de adquirir un depósito a plazo** ofrecido por un banco.

[Abrir en Colab]()
https://colab.research.google.com/drive/1p33c3wVr_m2uktXDrwvBB6v9mD8k4FmJ?usp=sharing

---

## 🎯 Objetivo de negocio

Una entidad bancaria contrata a una empresa de marketing para realizar campañas telefónicas con el fin de ofrecer un **certificado de depósito a término**.

Las llamadas son costosas (tiempo de agentes, telefonía, etc.), por lo que el banco quiere **priorizar a los clientes con mayor potencial de conversión**.

> **Pregunta guía:**  
> **¿Qué perfil tienen los clientes con mayor potencial de conversión?**

---

## 🧾 Sobre el dataset

- **Fuente:** Plataforma Kaggle (dataset de marketing bancario).  
- **Archivo principal:** `dataset_banco.csv`  
- **Tamaño:** 45,215 filas y 17 columnas.  
- **Tipo de problema:** Clasificación binaria (`"yes"` / `"no"`).

Cada registro corresponde a un cliente contactado y contiene:

- **16 características (features)** relacionadas con el cliente y la campaña.
- **1 variable objetivo (`y`)** que indica si el cliente aceptó (`"yes"`) o no (`"no"`) el producto.

---

## 🧱 Diccionario de variables

> *Descripción basada en la documentación del dataset.*

| #  | Columna      | Descripción                                                                                     | Tipo / Categorías (ejemplos)                                                                 |
|----|--------------|-------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------|
| 1  | `age`        | Edad del cliente.                                                                               | Numérica.                                                                                    |
| 2  | `job`        | Tipo de trabajo.                                                                                | `"admin."`, `"blue-collar"`, `"entrepreneur"`, `"management"`, `"student"`, etc.            |
| 3  | `marital`    | Estado civil.                                                                                   | `"married"`, `"single"`, `"divorced"`.                                                       |
| 4  | `education`  | Nivel educativo.                                                                                | `"primary"`, `"secondary"`, `"tertiary"`, `"unknown"`.                                      |
| 5  | `default`    | ¿Tiene impago en crédito por defecto?                                                           | `"yes"`, `"no"`, `"unknown"`.                                                               |
| 6  | `balance`    | Saldo promedio anual en la cuenta corriente (en euros).                                         | Numérica.                                                                                    |
| 7  | `housing`    | ¿Tiene préstamo de vivienda?                                                                    | `"yes"`, `"no"`, `"unknown"`.                                                               |
| 8  | `loan`       | ¿Tiene préstamo personal?                                                                       | `"yes"`, `"no"`, `"unknown"`.                                                               |
| 9  | `contact`    | Medio de contacto utilizado.                                                                    | `"cellular"`, `"telephone"`.                                                                |
| 10 | `day`        | Día del mes en el que se realizó el último contacto.                                            | Numérica (1–31).                                                                            |
| 11 | `month`      | Mes del año del último contacto.                                                                | `"jan"`, `"feb"`, ..., `"dec"`.                                                             |
| 12 | `duration`   | Duración (en segundos) del último contacto telefónico.                                          | Numérica. **Solo conocida después de la llamada.**                                          |
| 13 | `campaign`   | Número de contactos realizados durante esta campaña para este cliente.                          | Numérica.                                                                                    |
| 14 | `pdays`      | Días desde el último contacto en una campaña anterior (`999` significa “no fue contactado”).   | Numérica.                                                                                    |
| 15 | `previous`   | Número de contactos realizados en campañas anteriores.                                          | Numérica.                                                                                    |
| 16 | `poutcome`   | Resultado de la campaña de marketing anterior.                                                  | `"success"`, `"failure"`, `"other"`, `"unknown"`.                                           |
| 17 | `y`          | **Variable objetivo**: ¿el cliente contrató el depósito a plazo?                                | `"yes"` (convirtió) / `"no"` (no convirtió).                                                |

---

## 🧪 Metodología del proyecto

El análisis se desarrolla por etapas, cada una en un notebook de Colab/Jupyter:

1. **01_limpieza_datos.ipynb**  
   - Revisión de tipos de datos.  
   - Tratamiento de valores nulos, outliers y categorías `"unknown"`.  
   - Generación del dataset limpio: `data/processed/datos_limpios.csv`.

2. **02_analisis_exploratorio.ipynb**  
   - Distribuciones de variables numéricas y categóricas.  
   - Análisis de correlaciones.  
   - Comparación de perfiles entre clientes que dijeron `"yes"` vs `"no"`.

3. **03_modelado_basico.ipynb**  
   - División entrenamiento/prueba.  
   - Modelos de clasificación (por ejemplo: Regresión Logística, Árboles de Decisión).  
   - Métricas iniciales: accuracy, precisión, recall, F1-score.

4. **04_modelo_final_y_metricas.ipynb**  
   - Ajuste del mejor modelo.  
   - Importancia de variables.  
   - Interpretación de resultados desde el punto de vista de negocio.

5. **(Opcional) 05_preparacion_para_dashboard.ipynb**  
   - Creación de un dataset resumen para usar en Power BI o Excel.  

---

## 📁 Estructura de la carpeta del proyecto

   └─ 01_marketing_bancario/
      ├─ README.md
      ├─ data/
      │  ├─ bruto/
      │  ├─ data_limpia/
      │  └─ resultado/
      ├─ notebooks/
      └─ conclusiones/
