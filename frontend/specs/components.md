# Especificación de componentes

Esta especificación describe la UI que deberá implementarse en una fase posterior. No crea componentes ni llamadas a la API.

## Convenciones comunes

- `DateRangeFilter` representa fechas inclusivas opcionales y debe serializar `start_date` y `end_date` como `YYYY-MM-DD`.
- Los inputs de fecha deben aceptar vacío. Un filtro vacío no se envía en la query.
- El rango de referencia se muestra junto al filtro como `min_date .. max_date` y procede de `FacetsResponse`.
- Cada estado de carga conserva el espacio reservado por su contenido; cada error se muestra en el área de la funcionalidad sin ocultar el resto del dashboard.
- Los porcentajes se presentan con formato legible, pero los contratos conservan números (`number`) y no cadenas formateadas.

## Funcionalidad 1: filtro del dashboard

### `DashboardDateRangeFilter`

**Props**

| Prop | Tipo | Comportamiento |
|---|---|---|
| `value` | `DateRangeFilter` | Valores actuales de inicio y fin. |
| `facets` | `FacetsResponse \| null` | Muestra `min_date` y `max_date` cuando están disponibles. |
| `disabled` | `boolean` | Deshabilita ambos inputs durante la carga inicial de facetas. |
| `onChange` | `(next: DateRangeFilter) => void` | Notifica cambios sin enviar strings vacíos. |

**Layout y comportamiento**

- Se ubica sobre los KPI y gráficos, con dos inputs etiquetados `Fecha de inicio` y `Fecha de fin`.
- Debe aplicar el mismo `DateRangeFilter` al endpoint de métricas usado por los KPI y gráficos.
- Si solo existe un límite, filtra desde o hasta ese límite.
- Si el inicio es posterior al fin, mantiene los valores visibles y muestra un error de validación local; no dispara una petición inválida.
- Si las facetas no cargan, muestra un estado de referencia no disponible y permite decidir si los inputs siguen habilitados.

### `DashboardDataState`

El coordinador de la pantalla debe representar `loading`, `error`, `empty` y `ready`. Una respuesta vacía con un filtro válido muestra un estado vacío explícito para el dashboard, no valores inventados ni datos mock adicionales.

## Funcionalidad 2: alertas de anomalías

### `AlertsThresholdControl`

**Props**

| Prop | Tipo | Comportamiento |
|---|---|---|
| `value` | `number` | Ratio actual; inicia en `0.3`. |
| `min` | `0.01` | Límite de UI requerido por la funcionalidad. |
| `max` | `1.0` | Límite de UI requerido por la funcionalidad. |
| `onChange` | `(threshold: number) => void` | Actualiza el ratio y solicita recarga de alertas. |
| `disabled` | `boolean` | Evita cambios durante la petición. |

El input es numérico y debe rechazar valores fuera de `0.01..1.0` antes de consultar. OpenAPI solo garantiza `threshold >= 0`; esta restricción adicional es responsabilidad de la UI.

### `AnomalyAlertsTable`

**Props**

| Prop | Tipo | Comportamiento |
|---|---|---|
| `alerts` | `MetricsAlert[]` | Filas devueltas por `/api/metrics/alerts`. |
| `loading` | `boolean` | Muestra filas skeleton sin cambiar la altura de la tabla. |
| `error` | `string \| null` | Muestra un error inline y conserva el control de umbral. |
| `threshold` | `number` | Permite contextualizar el estado actual de la consulta. |

**Columnas**

| Etiqueta UI | Prop API | Presentación |
|---|---|---|
| Período | `period` | Texto de periodo, por ejemplo `2025-12`. |
| Outcome registrado | `outcome_total` | Importe monetario. |
| Media base | `baseline_average` | Media de períodos anteriores según el backend actual. |
| Incremento porcentual | `increase_ratio` | `increase_ratio * 100`, con símbolo `%`. |

La tabla aparece debajo de los gráficos. Si `alerts` es `[]`, muestra el mensaje explícito `No se detectaron anomalías con el umbral actual.`. No debe desaparecer ni confundirse con un error.

El mismo `DateRangeFilter` del dashboard se envía a la consulta de alertas. El backend actual calcula la base con todos los períodos anteriores presentes en el rango, no con una ventana fija de tres; la etiqueta y la documentación deben reflejar ese contrato.

## Funcionalidad 3: comparación B2B vs B2C

### `BusinessComparisonPage`

Página independiente accesible desde la navegación del dashboard. Recibe el `DateRangeFilter` de la vista comparativa, que puede ser distinto del filtro de la página principal.

**Props**

| Prop | Tipo | Comportamiento |
|---|---|---|
| `facets` | `FacetsResponse` | Valida las fechas y las categorías globales disponibles. |
| `dateRange` | `DateRangeFilter` | Fechas activas para ambas líneas. |
| `onDateRangeChange` | `(next: DateRangeFilter) => void` | Actualiza el rango y recarga B2B y B2C. |
| `groups` | `BusinessComparisonResponse` | Modelo derivado con una sección por negocio. |
| `loading` | `boolean` | Mantiene ambas secciones y el gráfico en estado de carga. |
| `error` | `string \| null` | Error de la carga comparativa. |

### `BusinessCategoryTable`

Renderiza una sección para `B2B` y otra para `B2C`, en paralelo en escritorio y apiladas en pantallas estrechas.

- Solicita `operation_type=income`, `limit=5` y `business_type` específico.
- Cada fila muestra `category`, `total_amount` y el porcentaje calculado sobre la suma de las categorías recibidas.
- Si la respuesta de un grupo es vacía, esa sección muestra `No hay categorías de ingreso para este rango.`.
- No debe presentar categorías del otro grupo como sustituto.
- La lista global de categorías procede de `facets`; el resultado filtrado por grupo procede de `/categories/top`.

### `BusinessIncomeComparisonChart`

Se ubica debajo de las dos tablas y compara un único total de ingresos para B2B y B2C.

- Usa la suma de `total_amount` de las filas devueltas por cada grupo, salvo que una futura respuesta de resumen proporcione un total explícito.
- Debe mantener las dos series identificadas aunque una tenga total cero.
- Con ambos grupos vacíos muestra `No hay ingresos para comparar en este rango.`.
- Con un solo grupo vacío muestra el grupo vacío con cero y conserva la comparación del grupo disponible.
