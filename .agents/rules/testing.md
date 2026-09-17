# Reglas de testing

## Alcance
Aplica a cualquier cambio de comportamiento en backend, frontend o contratos de API.

## Reglas

- Ejecutar las pruebas del frontend con `cd frontend && npm test` cuando se modifique calculo, formateo o comportamiento de componentes.
- Ejecutar `cd backend && pytest` cuando se modifique una ruta, un modelo, un filtro, una agregacion o la generacion de datos.
- Para cada endpoint nuevo o cambio de respuesta, agregar o actualizar una prueba en `backend/tests/test_routes.py`.
- Para cada cambio en `financial-utils.ts`, agregar o actualizar una prueba en `frontend/src/lib/financial-utils.test.ts`.
- Cubrir los limites de filtros de fecha, filtros combinados, resultados vacios, porcentajes sin ingresos y agrupaciones entre anos.
- Mantener la comprobacion de orden cronologico cuando una ruta devuelve movimientos o series temporales.
- Antes de cerrar cambios del frontend ejecutar `npm run lint` y `npm run build`; el build incluye la comprobacion de TypeScript.
- Validar la integracion con `curl http://localhost:8000/health` y `curl http://localhost:5173/api/metrics` cuando se toquen Docker, Vite, CORS o el proxy.
- No considerar suficiente una prueba directa al backend si el cambio afecta la ruta `/api` del frontend: validar tambien el proxy.
- Si una prueba no puede ejecutarse por dependencias ausentes, registrar el bloqueo y distinguirlo de un fallo del codigo.

## Fuentes

- `backend/tests/test_routes.py`
- `frontend/src/lib/financial-utils.test.ts`
- `frontend/package.json`
- `backend/requirements.txt`
- `frontend/vite.config.ts`
- `docker-compose.yml`
