# CREAR SPECS PARA AGREGAR FUNCIONALIDADES
Aplicar todo el proceso para cada una de las funcionalidades.

## FUNCIONALIDAD 1 — Filtro de rango de fechas en el dashboard principal
 - El equipo de finanzas quiere centrarse en períodos concretos sin ver todos los datos históricos a la vez. 
 - Añade dos inputs de fecha en la parte superior del dashboard — una fecha de inicio y una fecha de fin — que filtren todos los datos que se muestran actualmente en la página. 
 - Las fechas se envían a la API en formato YYYY-MM-DD. Ambos inputs son opcionales; cuando están vacíos, el dashboard muestra todos los datos disponibles. 
 - El rango de fechas disponible (la fecha más antigua y la más reciente del dataset) debe mostrarse cerca de los inputs como referencia para que el usuario sepa qué rango es válido.
 - Endpoint relevante: GET /api/metrics/facets (para obtener el rango de fechas disponible) y la extensión de filtros sobre el endpoint de métricas existente.

## FUNCIONALIDAD 2 — Tabla de alertas de anomalías en el dashboard principal
  - Bajo los gráficos existentes, añade una tabla que destaque los períodos en los que el gasto subió de forma inesperada. 
  - La tabla tiene cuatro columnas: período, outcome registrado, media móvil de los 3 períodos anteriores e incremento porcentual. 
  - El umbral de alerta es configurable por el usuario mediante un input numérico (un ratio entre 0.01 y 1.0, por defecto 0.3). 
  - Si no se detectan anomalías para el umbral actual, la tabla debe mostrar un mensaje explícito de estado vacío — no simplemente desaparecer. 
  - La tabla también debe respetar el rango de fechas establecido en la Funcionalidad 1 si está activo.
  - Endpoint relevante: GET /api/metrics/alerts?threshold=<ratio>

## FUNCIONALIDAD 3 - Vista comparativa B2B vs B2C
  - Crea una nueva página en el dashboard para comparar el rendimiento de ingresos entre las dos líneas de negocio: B2B y B2C. 
  - La vista tiene dos secciones en paralelo. Cada sección muestra una tabla con las 5 categorías de ingreso principales de esa línea de negocio, mostrando nombre de categoría, total de ingresos y porcentaje sobre el total del grupo. 
  - Bajo ambas secciones, un único gráfico compara visualmente el total de ingresos de B2B frente a B2C. 
  - El usuario puede filtrar la comparativa por un rango de fechas (mismo formato YYYY-MM-DD). Las categorías disponibles para cada grupo deben obtenerse del endpoint de facetas.
  - Endpoints relevantes: GET /api/metrics/categories/top?operation_type=income&limit=5 y GET /api/metrics/facets

## CONTEXTO
 - Este repo tiene frontend y backend predefinidos. 
 - Explora la documentación disponible de Swagger/OpenAPI en /docs, generada por FastAPI. 
 - El backend expone una base funcional bastante más amplia que la que consume el frontend.

## PROCESO - INSTRUCCIONES 
### FASE 1
 - Verifica los patrones frontend existentes para crear SPECS, debemos verificar cada tipo y regla contra evidencia de la API en vivo y rechazar suposiciones que no puedan ser verificables en archivos del repo. 
 - TypeScript estricto - sin any, sin object.
 - Con el backend en marcha mapea los endpoints, formas de respuesta, y parámetros de query de la funcionalidad usando /docs. 
 - Contrastar con patrones de fetch existentes en el frontend, crea un punto de verificación para que me muestres el contraste o evidencia. 
 - Resaltar los desajustes entre el wording del requerimiento y los campos reales de la API, estos desajustes se deben resolver en la SPEC. 
 - Commit: verification.md

### FASE 2
 - Redactar los tipos (.ts) y los archivos markdown (.md) en frontend/specs/: 
   . frontend/specs/api-types.ts con interfaces para las respuestas usadas para FacetsResponse- referencia de rango de fechas y vista B2B vs B2C.
   . frontend/specs/param-types.ts con tipos de parametros de query: DateRangeFilter - fechas opcionales de inicio/fin como string en formato YYYY-MM-DD; AlertsParam - threshold mas filtro de fecha; TopCategoriesParams - tipo de operación, limit y filtro de fechas.
 - Especificación de componentes (components.md): Documento que describe qué componentes React deberían crearse, sus props, layouts y cómo se comportan los estados vacíos.
  - Contrato de datos (README.md): Documentación general que conecta los endpoints, los tipos y los casos límite de cada funcionalidad. 
  - JSDoc aplicado a cada propiedad: significado, valores válidos, formato cuando aplique.
  - Commits: solo tipos verificados contra OpenAPI.

### FASE 3
  - Redactar frontend/specs/components.md , alinear propiedaddes de componentes con tipos, resolver ambiguedades que surjan.
  - Commit: spec de componentes.

### FASE 4
  - Redactar frontend/specs/README.md cubriendo la funcionalidad: 
    . Endpoint(s) que consume cada una de las rutas verificadas. 
	. Tipos TypeScript de cada petición y rspuesta.
	. Valores válidos y restricciones de cada parámetro.
	. Al menos dos casos límite por funcionalidad y que debe mostrar la UI.
	. Que la lectura de este documento sea como si se le entregara a una sesión nueva de un agente.
	. Ejecuta npx tsc --noEmit y corrige errores de tipos.
	. Commit: README de contrato de datos.
    
## RESTRICCIONES
  - Solo generar la SPEC, nada de codigo, no implementes componentes React ni llamadas a la API en este proyecto.