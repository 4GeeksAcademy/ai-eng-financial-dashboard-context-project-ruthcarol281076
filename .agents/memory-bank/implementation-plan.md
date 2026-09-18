# Implementation Plan del Financial Dashboard

## Recomendaciones a partir de este punto
- Documentar una matriz de entornos Docker y añadir un `healthcheck` del backend. 
- Después convendría separar la lógica de dominio de `routes.py` y generar o validar automáticamente el contrato TypeScript desde el esquema OpenAPI de FastAPI.