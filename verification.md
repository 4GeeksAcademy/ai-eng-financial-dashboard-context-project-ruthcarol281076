# Verificación del proyecto

## Revisiones

Se revisó el estado general de la aplicación, la comunicación entre sus servicios y los errores mostrados por VS Code.

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
target: process.env.VITE_PROXY_TARGET ?? "http://backend:8000"
```

El valor `VITE_PROXY_TARGET` se usa en Docker, mientras que `http://backend:8000` permanece como valor predeterminado para otros entornos de ejecución.

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
