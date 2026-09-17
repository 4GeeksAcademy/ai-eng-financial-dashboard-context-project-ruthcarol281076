# Reglas de arquitectura

## Alcance
Aplica a cambios en `backend/`, `frontend/` y `docker-compose.yml`.

## Reglas

- Mantener la separacion entre frontend React/Vite y backend FastAPI.
- Usar `backend/app/main.py` como punto de composicion de FastAPI: middleware y registro de routers deben configurarse ahi.
- Mantener las rutas HTTP en `backend/app/routes.py` hasta que el crecimiento justifique separar routers, servicios y modelos en modulos propios.
- No duplicar logica de calculo entre componentes React. Los calculos financieros y formateadores deben vivir en `frontend/src/lib/financial-utils.ts` o en una utilidad especializada.
- Mantener los tipos de dominio sincronizados entre `backend/app/routes.py` y `frontend/src/lib/financial-types.ts`. Si cambia el contrato de la API, actualizar ambos lados y sus pruebas en el mismo cambio.
- Consumir la API desde el frontend mediante `/api/...` y conservar el proxy de Vite. Usar `VITE_API_BASE_URL` solo cuando se necesite una API externa.
- No introducir una base de datos, persistencia o una nueva capa de servicios sin documentar primero el cambio de arquitectura y su impacto en los tests.
- Los cambios de Docker deben funcionar con `docker compose up -d --build` y conservar los puertos documentados: frontend `5173`, backend `8000` y debug `5678`.
- Tratar `host.docker.internal` como una adaptacion del entorno actual. Si se modifica la topologia Docker, probar tanto la comunicacion del navegador como la del contenedor frontend hacia el backend.

## Fuentes

- `backend/app/main.py`
- `backend/app/routes.py`
- `frontend/src/App.tsx`
- `frontend/src/lib/financial-types.ts`
- `frontend/src/lib/financial-utils.ts`
- `frontend/vite.config.ts`
- `docker-compose.yml`
