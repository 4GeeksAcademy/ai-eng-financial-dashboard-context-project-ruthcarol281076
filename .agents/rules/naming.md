# Reglas de naming y organizacion

## Alcance
Aplica a nombres de archivos, funciones, tipos, componentes, endpoints y variables.

## Reglas

- En Python usar `snake_case` para funciones y variables; reservar `PascalCase` para modelos Pydantic y tipos de dominio.
- En TypeScript usar `camelCase` para funciones, variables y propiedades; usar `PascalCase` para componentes React, interfaces y tipos.
- Nombrar componentes React por responsabilidad y usar archivos en `kebab-case`, por ejemplo `kpi-card.tsx` para `KPICard`.
- Mantener los tipos financieros con los nombres de contrato existentes: `FinancialMovement`, `OperationType`, `Category`, `BusinessType`, `KPIMetrics` y `MonthlyDataPoint`.
- Usar `income` y `outcome` de forma consistente en API, tipos, calculos y UI. No introducir sinonimos como `revenue`, `expense` o `profitValue` sin una razon de compatibilidad documentada.
- Nombrar endpoints bajo `/api/metrics` y usar nombres descriptivos para operaciones derivadas: `/facets`, `/summary`, `/categories/top`, `/comparison`, `/alerts`, `/b2b` y `/b2c`.
- Usar el alias `@/` para imports del frontend cuando el modulo este dentro de `src`; evitar cadenas largas de imports relativos.
- Mantener los nombres de las funciones de dominio descriptivos: `computeKPIs`, `computeMonthlyData`, `filter_movements`, `summarize_movements` y similares.
- No usar nombres de una sola letra para datos de negocio, filtros o parametros publicos.

## Fuentes

- `backend/app/routes.py`
- `frontend/src/lib/financial-types.ts`
- `frontend/src/lib/financial-utils.ts`
- `frontend/src/components/dashboard/`
- `frontend/vite.config.ts`
- `frontend/tsconfig.app.json`
