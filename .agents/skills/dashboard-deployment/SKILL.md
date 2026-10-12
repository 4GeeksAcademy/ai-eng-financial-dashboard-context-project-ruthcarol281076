---
name: dashboard-deployment
description: Deploy and validate this financial dashboard with Docker Compose locally or as a production-safe backend container. Use when starting services, configuring ports and environment variables, building images, checking health endpoints, validating the Vite proxy, or troubleshooting deployment failures.
license: MIT
metadata:
  author: project-local
  version: "1.0"
---

# Dashboard Deployment

Use this skill for deployment work in this repository. Keep the React accessibility work, lazy-loaded charts, API contracts, and backend security defaults intact.

## Repository and service map

- Frontend entry point: `frontend/src/main.tsx`
- Vite configuration and `/api` proxy: `frontend/vite.config.ts`
- Backend entry point: `backend/app/main.py`
- Backend routes: `backend/app/routes.py`
- Local orchestration: `docker-compose.yml`
- Backend image: `backend/Dockerfile`
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8000`
- Python debug port for development only: `5678`
- API documentation: `http://localhost:8000/docs`

## Deployment safety rules

- Work from the repository root.
- Run `docker compose config` before starting services.
- Do not expose port `5678` outside local development.
- Do not use `--reload`, `debugpy`, source-code bind mounts, or development credentials in production.
- Do not use `allow_origins=["*"]` or enable credentials without an explicit authentication design.
- Keep `APP_ENV`, `ALLOWED_HOSTS`, and `CORS_ALLOWED_ORIGINS` explicit in non-local environments.
- Do not remove `sr-only` tables, ARIA regions, skip links, `Suspense`, lazy-loaded charts, or `accessibilityLayer={false}` to fix deployment issues.
- Treat data from `generate_mock_movements` as mock data, not financial production data.
- Never report a deployment as healthy until the service is reachable from the same network context as its consumer.

## Preflight checks

Run from the repository root:

```bash
git status --short
docker --version
docker compose version
docker compose config
```

For code changes, run the relevant tests before starting containers:

```bash
pytest backend/tests/test_routes.py
cd frontend && npm run lint && npm test && npm run build
```

## Local Docker Compose deployment

Build and start the development services:

```bash
docker compose up --build
```

The Compose backend intentionally enables `debugpy` on `5678` and Uvicorn `--reload` for local development. The frontend uses `VITE_PROXY_TARGET=http://host.docker.internal:8000` and `extra_hosts` so its `/api` proxy reaches the backend published on the host.

Environment variables supported by the backend:

- `APP_ENV=development` for the local Compose workflow.
- `ALLOWED_HOSTS=localhost,127.0.0.1,backend` for the current Compose network.
- `CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173` for browser requests from the local frontend.
- `VITE_PROXY_TARGET` controls the Vite server-side proxy target. It is not the same as `VITE_API_BASE_URL`, which controls browser-side API origins.

## Production-safe backend image

The default `backend/Dockerfile` command runs Uvicorn without debugpy or `--reload` and uses a non-root user:

```bash
docker build -t financial-dashboard-backend ./backend
docker run --rm \
  -p 8000:8000 \
  -e APP_ENV=production \
  -e ALLOWED_HOSTS=localhost,127.0.0.1 \
  -e CORS_ALLOWED_ORIGINS=https://dashboard.example.com \
  financial-dashboard-backend
```

Replace example hosts and origins with the real deployment values. Use HTTPS before relying on production transport headers. Do not publish `5678` and do not mount `./backend:/app` in this mode.

If a production frontend is deployed separately, configure its server-side proxy or browser API origin deliberately. Do not assume the local `host.docker.internal` route exists in a cloud environment.

## Post-deployment validation

Validate the backend from the host:

```bash
curl -fsS http://localhost:8000/health
curl -fsS -I http://localhost:8000/docs
curl -fsS http://localhost:8000/openapi.json
curl -fsS http://localhost:8000/api/metrics
```

Validate the frontend proxy separately:

```bash
curl -fsS -I http://localhost:5173/
curl -fsS http://localhost:5173/api/metrics
```

Confirm all of the following:

- `/health` returns HTTP 200 and `{"status":"ok"}`.
- `/docs` and `/openapi.json` are reachable only when documentation is intended to be exposed.
- `/api/metrics` returns HTTP 200, the expected response shape, 360 mock movements, and chronological order.
- `http://localhost:5173/api/metrics` succeeds through the Vite proxy.
- Security headers are present and CORS allows only configured origins.
- The dashboard keeps loading, error, empty, keyboard, and accessible data-table behavior.

For a response-shape check without extra dependencies:

```bash
curl -fsS http://localhost:8000/api/metrics > /tmp/financial-metrics.json
python -c 'import json; data=json.load(open("/tmp/financial-metrics.json")); assert len(data) == 360; assert data == sorted(data, key=lambda item: item["create_date"]); print(len(data))'
```

## Troubleshooting

### Port already in use

Identify the process using the port before changing configuration:

```bash
lsof -i :5173
lsof -i :8000
lsof -i :5678
```

Use an alternate published port only when necessary, and update the consumer URL or proxy target consistently.

### Frontend proxy returns 502

Check that the backend is healthy from the host, that `VITE_PROXY_TARGET` matches the network context, and that `host.docker.internal` is declared for Docker Linux. Test the backend directly before testing `/api` through Vite.

### CORS or TrustedHost rejects a request

Inspect the browser Origin and Host headers. Set comma-separated `CORS_ALLOWED_ORIGINS` and `ALLOWED_HOSTS` explicitly. Do not solve the issue with wildcards in a deployment that handles credentials or private data.

### BuildKit reports `parent snapshot ... does not exist`

Retry the build without cache:

```bash
docker compose build --no-cache backend
```

If the same internal snapshot error remains, record it as an environment/BuildKit failure. Do not claim the image was built successfully and do not remove Docker resources without explicit approval.

### Backend container starts but requests fail

Inspect logs and verify the process is listening on `0.0.0.0:8000`:

```bash
docker compose logs backend
docker compose ps
```

Then repeat `/health` from the host and from the frontend container if the proxy is involved.

## Completion checklist

- `docker compose config` passes.
- Development services start with expected ports and no unexpected public debug exposure.
- Production image uses non-root Uvicorn without reload/debug.
- `/health`, `/docs`, `/openapi.json`, and `/api/metrics` are validated from the relevant network context.
- Backend tests and frontend lint/tests/build pass when code or image inputs changed.
- Deployment notes and failures are recorded in `verification.md` and `.agents/memory-bank/progress.md`.
