# Contexto del Financial Dashboard

## Resumen
- Es un **panel de control (dashboard) de métricas financieras** para visualizar el rendimiento económico de un negocio a lo largo del año.

## Características Clave
- **Generación de movimientos financieros:** El backend crea registros sintéticos de operaciones (`income` o gastos `outcome`), categorizados (`sales`, `suppliers`, `operational`, `administrative`, `others`) y divididos por modelo de negocio (`B2B` o `B2C`).
- **Cálculo de KPIs ejecutivos:** En pantalla calcula y muestra cuatro indicadores clave:
  . **Total Income:** Ingresos brutos acumulados.
  . **Total Outcome:** Gastos totales acumulados.
  . **Profit:** Beneficio neto (ingresos menos gastos).
  . **Profit Margin:** Margen porcentual de beneficio sobre ingresos.
- **Visualización de tendencias:**
  . Gráfico temporal interactivo de líneas comparando **Ingresos vs. Gastos mes a mes**.
  . Gráfico de evolución del **Margen de beneficio (%)**.
- **Motor analítico en backend:** Dispone de endpoints preparados para agrupaciones periódicas (día, semana, mes), detección de picos anómalos de gasto (`alerts`), desglose de categorías más costosas (`top categories`) y comparativas entre periodos.

## Personas de Usuario
- **UserPerson1** Necesidades del tipo de usuario UserPerson1.
- **UserPerson2** Necesidades del tipo de usuario UserPerson2.

## Métricas de Éxito
- Ejemplo1: Usuarios activos diarios (DAU) > 1000
- Ejemplo2: Tasa de finalización de tareas > 75%