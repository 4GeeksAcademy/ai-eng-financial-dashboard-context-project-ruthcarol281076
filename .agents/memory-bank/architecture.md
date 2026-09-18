# Arquitectura del Financial Dashboard
- La arquitectura comunica el cliente web con la API de FastAPI a través del proxy de Vite o mediante variables de entorno:

## flowchart LR
- Flujo de ejecución
```mermaid
    Browser["Navegador Web"]
    Frontend["React + Vite (:5173)"]
    Proxy["Proxy Vite (/api)"]
    Backend["FastAPI + Uvicorn (:8000)"]

    Browser -->|Acceso al dashboard| Frontend
    Frontend -->|fetch /api/metrics| Proxy
    Proxy -->|Redirige a http://backend:8000/api/metrics| Backend
    Backend -->|Devuelve lista JSON de movimientos| Frontend
```

## Orden de ejecución
1. **Petición desde el cliente:** El componente principal `App.tsx:15-22` invoca `fetch(`${API_BASE_URL}/api/metrics`)`.
2. **Proxy de desarrollo:** Si `API_BASE_URL` no está definida, la petición se dirige a `/api/metrics`. El archivo `vite.config.ts:10-16` intercepta cualquier ruta con prefijo `/api` y la reenvía internamente al contenedor `http://backend:8000`.
3. **CORS:** El backend en `main.py:7-14` tiene habilitado `CORSMiddleware` con `allow_origins=["*"]`, lo que permite conexiones directas desde orígenes externos si se configura una URL absoluta mediante `VITE_API_BASE_URL`.

## Ejecución para visualizar el Financial Dashboard en el navegador

#### Opción A: Usando Docker Compose (recomendada)
- Levanta ambos contenedores simultáneamente sin necesidad de instalar dependencias locales:
```bash
docker compose up --build
```
- Una vez levantado, los servicios quedan disponibles en:
* **Frontend:** [http://localhost:5173](http://localhost:5173)
* **Backend:** [http://localhost:8000](http://localhost:8000)
* **Documentación interactiva de la API (Swagger):** [http://localhost:8000/docs](http://localhost:8000/docs)
* **Puerto de depuración Python (debugpy):** `localhost:5678`

#### Opción B: Ejecución manual por separado
1. **Backend:**
   ```bash
   cd backend
   python -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```
2. **Frontend** (en otra terminal):
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

#### Comandos de prueba y validación
- **Tests del backend:**
  ```bash
  cd backend && pytest
  ```
- **Tests del frontend:**
  ```bash
  cd frontend && npm test
  ```