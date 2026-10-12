# Contrato de datos de las nuevas funcionalidades

Este documento es el punto de entrada para una sesión nueva de agente. Define los contratos que debe consumir una futura implementación React. Esta entrega genera solo tipos y documentación: no implementa componentes, fetch, rutas ni cambios de backend.

## Fuente de verdad y patrón existente

La fuente verificada es el OpenAPI generado por FastAPI en `http://localhost:8000/docs` y `http://localhost:8000/openapi.json`, contrastado con `backend/app/routes.py`. El frontend actual, en `frontend/src/App.tsx`, usa `VITE_API_BASE_URL ?? ""`, llama a `/api/metrics`, comprueba `response.ok` y deserializa una lista de movimientos. Las futuras llamadas deben conservar ese patrón y el proxy `/api` de Vite.

Los tipos de respuesta están en `api-types.ts` y los parámetros en `param-types.ts`. Todos los campos API conservan `snake_case` porque deben coincidir con JSON y query parameters reales. No usar `any` ni `object`.

## Tipos comunes

- `OperationType`: `income | outcome`.
- `BusinessType`: `B2B | B2C`.
- `Category`: `suppliers | sales | operational | administrative | others`.
- `GroupBy`: `day | week | month`.
- `DateRangeFilter`: `start_date?` y `end_date?`, strings `YYYY-MM-DD`; omitir la query cuando estén vacíos.

## Funcionalidad 1: rango del dashboard

### Endpoints

1. `GET /api/metrics/facets`
   - Sin parámetros.
   - Responde `FacetsResponse` con `operation_types`, `business_types`, `categories`, `min_date` y `max_date`.
   - `min_date` y `max_date` son strings `YYYY-MM-DD`. En la verificación viva fueron `2025-10-02` y `2026-09-28`.
2. `GET /api/metrics`
   - Responde `FinancialMovement[]`.
   - Acepta `start_date`, `end_date`, `category` y `operation_type`, todos opcionales.
   - El filtro de fecha es inclusivo. Sin fechas devuelve todos los movimientos disponibles.

### Flujo esperado

Cargar facetas para mostrar el rango válido cerca de los inputs. Enviar el mismo `DateRangeFilter` al endpoint que alimenta los KPI y gráficos actuales. No enviar parámetros vacíos. Validar localmente que `start_date <= end_date`.

### Casos límite

- Sin inicio ni fin: mostrar todos los datos y el rango de referencia de facetas.
- Solo inicio o solo fin: aplicar un límite abierto, sin inventar la fecha faltante.
- Inicio posterior al fin: mostrar validación local y evitar una petición.
- Intervalo válido sin movimientos: conservar la estructura del dashboard y mostrar estado vacío explícito.

## Funcionalidad 2: alertas de anomalías

### Endpoint

`GET /api/metrics/alerts` responde `MetricsAlert[]` y acepta:

| Parámetro | Tipo y valores | Default |
|---|---|---|
| `threshold` | número, OpenAPI garantiza `>= 0`; la UI debe limitarlo a `0.01..1.0` | `0.3` |
| `group_by` | `day | week | month` | `month` |
| `start_date`, `end_date` | fecha opcional `YYYY-MM-DD` | omitidos |
| `business_type` | `B2B | B2C` opcional | omitido |

`MetricsAlert` contiene `period`, `outcome_total`, `baseline_average` e `increase_ratio`. La tabla debe mapear esos nombres reales a sus etiquetas de negocio. `increase_ratio` es una proporción: `0.3` se presenta como `30%`.

### Desajuste del requisito

El requerimiento describe una media móvil de los tres períodos anteriores. La implementación verificada calcula `baseline_average` como la media de todos los períodos anteriores disponibles en el resumen filtrado. La SPEC no debe prometer una ventana de tres hasta que el backend cambie; la etiqueta recomendada es `Media base`.

### Casos límite

- `[]`: mostrar `No se detectaron anomalías con el umbral actual.`; no ocultar la tabla.
- Umbral `0.01`: aceptar en la UI y mostrar muchas alertas si la API las devuelve.
- Umbral `1.0`: aceptar en la UI; si no hay resultados, mostrar el estado vacío.
- Rango de fechas activo: enviarlo junto con `threshold` y mantener la tabla limitada al rango.
- Error HTTP o respuesta inválida: mostrar error inline y conservar el control de umbral.

## Funcionalidad 3: comparación B2B vs B2C

### Endpoints

1. `GET /api/metrics/facets`
   - Proporciona `categories` y `business_types` globales.
   - No acepta `business_type`; no entrega facetas separadas por grupo.
2. `GET /api/metrics/categories/top`
   - Para B2B: `operation_type=income&limit=5&business_type=B2B`.
   - Para B2C: `operation_type=income&limit=5&business_type=B2C`.
   - Añadir `start_date` y `end_date` cuando exista filtro.
   - Responde `TopCategoryItem[]`, con `category`, `operation_type` y `total_amount`.

La consulta real de categorías permite `operation_type=income|outcome`, `limit` entero entre `1` y `20` con default `5`, fechas opcionales y `business_type=B2B|B2C`. La vista fija `income`, `5`, y hace dos consultas, una por grupo.

### Transformaciones de UI

- Cada tabla muestra como máximo cinco filas ordenadas por el backend.
- El porcentaje de una fila se calcula como `total_amount / suma(total_amount de las filas del grupo) * 100`. No viene en la respuesta API.
- El total de cada grupo para el gráfico se deriva de la suma de sus filas. Esta decisión refleja el contrato actual y puede cambiar si se incorpora un endpoint de resumen por grupo.
- El modelo combinado de página es `BusinessComparisonResponse`, que agrupa `b2b` y `b2c`; es un modelo frontend derivado, no una respuesta JSON directa.

### Casos límite

- Un grupo sin categorías: mostrar una tabla vacía explícita para ese grupo y total cero.
- Ambos grupos sin categorías: mostrar `No hay ingresos para comparar en este rango.` en el gráfico.
- Un único resultado en un grupo: calcular su porcentaje como 100% y no rellenar filas artificiales.
- Rango sin datos para una línea: mantener ambas secciones y mostrar cero solo para la línea vacía.
- Facetas con una categoría no presente en el grupo: no mostrarla; `facets` es global y la respuesta filtrada por `business_type` es la fuente de las filas.

## Reglas de implementación futura

- No convertir nombres API a sinónimos como `revenue`, `expense` o `profitValue` dentro de los tipos de contrato.
- Construir query strings con `URLSearchParams` y omitir opcionales vacíos.
- No calcular datos financieros duplicados en varios componentes; centralizar transformaciones en una utilidad.
- Representar explícitamente `loading`, `error`, `empty` y `ready` en cada sección.
- Mantener `start_date` y `end_date` inclusivos y en formato ISO `YYYY-MM-DD`.
- Validar cualquier cambio futuro contra `/docs`, `backend/app/routes.py` y `verification.md` antes de modificar estos tipos.

## Validación realizada

Desde `frontend/` se ejecutaron:

```bash
./node_modules/.bin/tsc --noEmit
./node_modules/.bin/tsc --noEmit --strict --skipLibCheck --ignoreConfig specs/api-types.ts specs/param-types.ts
```

Ambos comandos terminaron sin errores después de usar la dependencia local de TypeScript. La SPEC no requiere instalar dependencias ni cambiar el build del frontend.
