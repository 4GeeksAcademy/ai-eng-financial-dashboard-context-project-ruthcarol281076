# Financial Metrics Dashboard

<!-- hide -->

By [@marcogonzalo](https://github.com/marcogonzalo) and [other contributors](https://github.com/4GeeksAcademy/ai-eng-financial-dashboard-context-project/graphs/contributors) at [4Geeks Academy](https://4geeksacademy.com/)

[![build by developers](https://img.shields.io/badge/build_by-Developers-blue)](https://4geeks.com)
[![4Geeks Academy](https://img.shields.io/twitter/follow/4geeksacademy?style=social&logo=x)](https://x.com/4geeksacademy)

_Estas instrucciones están [disponibles en español](./README.es.md)._

**Before you start**: 📗 [Read the instructions](https://4geeks.com/lesson/how-to-start-a-project) on how to start a coding project.

<!-- endhide -->

---

_Financial metrics dashboard with a React + TypeScript frontend and a FastAPI backend._

## Recommended steps

1. Fork this repository to your account.
2. Open your fork in GitHub Codespaces or clone it and run it in your local environment.
3. Run your AI agent to inspect both frontend and backend.
4. Document the proposed rules and memory bank in your fork.
5. Refine and validate the rules until they fit the project's real workflow.

## Expected agents directory structure

```text
./.agents
└─ /rules
   └─ <rule-name>.md
└─ /skills
   └─ /<skill-name>
      └─ /SKILL.md
```

## How to run locally

```bash
docker compose up --build
```

The frontend uses the Vite proxy for `/api` by default, so no extra environment variables are required in local development or Codespaces.
If you need to target a different backend origin from the browser, set
`VITE_API_BASE_URL` in `frontend/.env.local`. For the Vite server-side proxy,
use `VITE_PROXY_TARGET` instead.

- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- API documentation: http://localhost:8000/docs

The local backend accepts only the frontend origins `http://localhost:5173` and
`http://127.0.0.1:5173`, and allows the hosts `localhost`, `127.0.0.1` and
`testserver`. Override these values with `CORS_ALLOWED_ORIGINS` and
`ALLOWED_HOSTS` as comma-separated lists when needed. `APP_ENV=production`
enables production-only transport behavior; use HTTPS before enabling it.

Docker Compose is the development workflow: it keeps `debugpy` on port `5678`
and enables `--reload`. The backend image's default command is production-safe:
it runs Uvicorn without debugpy or reload and uses a non-root user.

### Backend security and performance

The backend uses explicit CORS origins and allowed hosts through
`CORS_ALLOWED_ORIGINS` and `ALLOWED_HOSTS`, plus defensive response headers.
Production defaults are restrictive and should be replaced with the real HTTPS
origins and hosts. The mock dataset uses a local random generator and a daily
cache, so requests do not mutate global random state or regenerate the same
dataset unnecessarily. Mock data from `generate_mock_movements` is not real
financial data.

The production-safe backend image runs as a non-root user without `debugpy` or
`--reload`. Docker Compose intentionally keeps those development features for
local debugging only.

### Agent skills

Project-specific agent skills live under `.agents/skills/`:

- `accessibility`: WCAG and rendered accessibility audits.
- `backend-engineer`: backend security, API and performance guidance.
- `dashboard-deployment`: Docker Compose, production image, health checks,
  proxy validation and deployment troubleshooting.
- `vercel-react-best-practices`: React and frontend performance guidance.

After adding or moving a skill, run `Developer: Reload Window` from the VS Code
Command Palette so the agent refreshes its skill catalog.

### Validation

Run the backend checks from the repository root:

```bash
pytest backend/tests/test_routes.py
python -m compileall backend/app
```

Run the frontend checks from `frontend/`:

```bash
npm run lint
npm test
npm run build
```

With services running, validate both the backend and the Vite proxy:

```bash
curl http://localhost:8000/health
curl http://localhost:8000/api/metrics
curl http://localhost:5173/api/metrics
```

The complete deployment procedure and troubleshooting checklist is in
[`.agents/skills/dashboard-deployment/SKILL.md`](.agents/skills/dashboard-deployment/SKILL.md).

### Manual startup in two terminals

Use this workflow when Docker or Docker Compose is unavailable, when you need to debug only one service, or when you want to inspect frontend and backend logs independently. Install Python 3.13+, Node.js, and npm first.

In terminal 1, start the backend:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

In terminal 2, start the frontend:

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173. In this local setup, Vite proxies `/api` requests to `http://localhost:8000`, so `VITE_PROXY_TARGET` is not required. The normal manual backend command does not open the debug port `5678`; use the Docker Compose workflow when that debug configuration is needed.

---

This and many other projects are built by students as part of the [Career Programs](https://4geeksacademy.com/compare-programs) at [4Geeks Academy](https://4geeksacademy.com). By [@marcogonzalo](https://github.com/marcogonzalo) and [other contributors](https://github.com/4GeeksAcademy/ai-eng-financial-dashboard-context-project/graphs/contributors). Find out more about [AI Engineering](https://4geeksacademy.com/en/coding-bootcamps/ai-engineering), [Data Science & Machine Learning](https://4geeksacademy.com/en/coding-bootcamps/data-science-ml), [Cybersecurity](https://4geeksacademy.com/en/coding-bootcamps/cybersecurity) and [Full-Stack Software Developer with AI](https://4geeksacademy.com/en/coding-bootcamps/full-stack-developer).
