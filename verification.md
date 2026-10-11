# Verificación del proyecto

## Revisiones

Se revisó el estado general de la aplicación, la comunicación entre sus servicios y los errores mostrados por VS Code.

## Verificación de SPEC para nuevas funcionalidades

### Evidencia de la API en vivo

Con el backend activo se consultaron `http://localhost:8000/docs` y
`http://localhost:8000/openapi.json`. Los contratos observados fueron:

| Funcionalidad | Endpoint | Evidencia de respuesta y parámetros |
|---|---|---|
| Rango y dashboard | `GET /api/metrics/facets` y `GET /api/metrics` | `facets` devuelve `operation_types`, `business_types`, `categories`, `min_date` y `max_date`; `metrics` acepta `start_date`, `end_date`, `category` y `operation_type`. |
| Alertas | `GET /api/metrics/alerts` | Acepta `threshold >= 0`, `group_by=day|week|month`, fechas opcionales y `business_type`; devuelve `period`, `outcome_total`, `baseline_average` e `increase_ratio`. |
| Comparativa B2B/B2C | `GET /api/metrics/categories/top` | Acepta `operation_type`, `limit` entre 1 y 20, fechas y `business_type=B2B|B2C`; devuelve `category`, `operation_type` y `total_amount`. |

También se verificaron respuestas reales:

- `/api/metrics/facets` devolvió `min_date=2025-10-02` y `max_date=2026-09-28`.
- `/api/metrics/alerts?threshold=0.3` devolvió alertas con periodos mensuales y ratios relativos.
- `/api/metrics/categories/top?operation_type=income&limit=5&business_type=B2B` y la misma consulta para `B2C` devolvieron filas de categorías de ingreso.
- `/api/metrics?start_date=2025-10-01&end_date=2025-10-31` devolvió movimientos dentro del intervalo inclusivo.

### Contraste con el frontend

El patrón vigente en `frontend/src/App.tsx` usa `VITE_API_BASE_URL ?? ""`, llama a
`fetch(`${API_BASE_URL}/api/metrics`)`, comprueba `response.ok` y deserializa la
respuesta como movimientos financieros. La SPEC conserva ese punto de entrada y
extiende únicamente los parámetros y respuestas verificadas; no añade llamadas
ni componentes.

### Desajustes resueltos en la SPEC

- El requerimiento llama “media móvil de los 3 períodos anteriores” a la columna
	de alertas, pero la implementación actual calcula `baseline_average` usando
	todos los períodos anteriores disponibles en el rango filtrado. La SPEC usa el
	nombre real y exige mostrarlo como “media base de períodos anteriores”; cambiar
	a una ventana de tres períodos requeriría una modificación posterior del backend.
- El requerimiento limita el umbral a `0.01..1.0`, mientras OpenAPI solo declara
	`threshold >= 0`. La SPEC aplica `0.01..1.0` como restricción de la UI y deja
	documentada la diferencia del servidor.
- `increase_ratio` es un ratio, no un porcentaje. La UI debe multiplicarlo por
	100 para presentar el incremento porcentual.
- `facets` expone categorías globales y no acepta `business_type`; la comparativa
	debe pedir categorías por grupo con `business_type=B2B` y `business_type=B2C`.
- La respuesta de categorías no incluye el porcentaje del grupo. La vista debe
	calcularlo como `total_amount / suma(total_amount) * 100` usando las filas
	recibidas, dejando claro que el total es el de las categorías devueltas.

### Estado de los servicios

- El proyecto está compuesto por un frontend React/Vite y un backend FastAPI definidos en [docker-compose.yml](docker-compose.yml).
- El backend se publica en el puerto `8000` y el frontend en el puerto `5173`.
- El puerto `5678` queda reservado para la depuración de Python mediante `debugpy`.
- Los contenedores se iniciaron con `docker compose up -d` y quedaron en estado `Up`.

### Revisión del backend

- El endpoint `GET /health` de [backend/app/routes.py](backend/app/routes.py) respondió correctamente:

	```text
	{"status":"ok"}
	```

- El endpoint `GET /api/metrics` respondió correctamente al consultarlo directamente en `http://localhost:8000`.
- Los logs de FastAPI confirmaron que Uvicorn inició en `0.0.0.0:8000`.
- No se encontró un fallo en la generación de movimientos financieros ni en las rutas del backend.

### Revisión del frontend

- [frontend/src/App.tsx](frontend/src/App.tsx) realiza la petición `GET /api/metrics` al montar la aplicación.
- La interfaz mostraba el mensaje `No se pudo cargar la informacion financiera` cuando esa petición fallaba.
- Vite iniciaba correctamente en `0.0.0.0:5173`.
- Inicialmente, `GET http://localhost:5173/api/metrics` devolvía `HTTP 502`, aunque la misma ruta funcionaba directamente contra el backend.

### Revisión de errores de desarrollo

- VS Code reportó inicialmente que no podía encontrar los tipos de `vite/client` en `frontend/tsconfig.app.json`.
- La causa era la ausencia de dependencias accesibles localmente y permisos de `frontend/node_modules` pertenecientes a `root`.
- Se corrigieron los permisos y se ejecutó `npm install` en `frontend`.
- Después de instalar las dependencias, la comprobación de errores quedó sin errores reportados.

## Ajustes

El problema principal estaba en la ruta de conexión del proxy de Vite. El frontend intentaba conectar desde su contenedor con `http://backend:8000`, pero en este entorno esa comunicación entre contenedores no funcionaba correctamente, provocando el `502`.

### Cambios realizados

En [docker-compose.yml](docker-compose.yml) se añadió al servicio `frontend`:

```yaml
environment:
  VITE_PROXY_TARGET: http://host.docker.internal:8000
extra_hosts:
  - "host.docker.internal:host-gateway"
```

Esto permite que el contenedor frontend acceda al backend mediante el puerto `8000` publicado en el host.

En [frontend/vite.config.ts](frontend/vite.config.ts), el destino del proxy se hizo configurable:

```ts
target: process.env.VITE_PROXY_TARGET ?? "http://localhost:8000"
```

En Docker, `VITE_PROXY_TARGET=http://host.docker.internal:8000` permite que el contenedor frontend acceda al backend publicado en el host. En ejecución manual fuera de Docker, el fallback `http://localhost:8000` apunta al backend local.

### Reconstrucción y validación final

Después de los cambios se ejecutó:

```bash
docker compose up -d --build
```

Se validaron los siguientes resultados:

```text
GET http://localhost:8000/health       -> HTTP 200
GET http://localhost:5173/             -> HTTP 200
GET http://localhost:5173/api/metrics  -> HTTP 200
```

También se comprobó desde el contenedor frontend que `http://host.docker.internal:8000/health` devuelve `{"status":"ok"}`.

Con estos ajustes, el frontend puede obtener los movimientos financieros del backend a través del proxy de Vite y la pantalla deja de mostrar el mensaje de error de carga.
