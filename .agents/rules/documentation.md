# Reglas de documentacion

## Alcance
Aplica a cambios de arquitectura, ejecucion, API, Docker, contratos de datos y decisiones que afecten a colaboradores o agentes.

## Reglas

- Mantener `README.md` y `README.es.md` alineados cuando cambien comandos, puertos, variables de entorno o pasos de ejecucion.
- Documentar siempre los puntos de entrada: `backend/app/main.py`, `frontend/index.html` y `frontend/src/main.tsx`.
- Si se cambia una ruta, documentar metodo, endpoint, filtros, forma de respuesta y ejemplo de validacion.
- Mantener documentados los puertos `5173`, `8000` y `5678`, y la URL de Swagger `http://localhost:8000/docs`.
- Explicar cualquier variable `VITE_*`, especialmente la diferencia entre `VITE_API_BASE_URL` para el navegador y `VITE_PROXY_TARGET` para el servidor Vite.
- Registrar en `verification.md` las revisiones, ajustes, evidencias y comandos de validacion cuando se repare una integracion o un problema de entorno.
- Las afirmaciones tecnicas de la documentacion deben poder rastrearse a un archivo del repositorio o a la salida de un comando de validacion.
- No documentar datos mock como datos reales. Indicar cuando una respuesta procede de `generate_mock_movements`.
- Actualizar la documentacion de agentes si se crean nuevas reglas, skills, convenciones o memorias del proyecto.

## Fuentes

- `README.md`
- `README.es.md`
- `AGENTS.md`
- `verification.md`
- `backend/app/main.py`
- `backend/app/routes.py`
- `frontend/src/main.tsx`
- `frontend/vite.config.ts`
