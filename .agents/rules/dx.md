# Reglas de experiencia de desarrollo

## Nombre
Experiencia de desarrollo y flujo de agentes.

## Alcance
Aplica al trabajo diario de colaboradores y agentes en el workspace.

## Justificacion
La validacion depende de Docker Compose, las dependencias locales del frontend y los archivos de instrucciones para agentes. Un flujo comun reduce diagnosticos incompletos y diferencias entre entornos.

## Guia especifica del proyecto
Antes de editar revisa `AGENTS.md` y `.agents/rules/`; para validar la aplicacion usa `docker compose up -d --build`, `docker compose ps`, los logs de los servicios y los scripts definidos en `frontend/package.json`.

## Reglas

- Antes de editar, revisar `AGENTS.md`, `.agents/rules/`, `.agents/skills/` y `memory-bank/` si existen.
- Preferir Docker Compose para validar la integracion completa y los comandos locales del `package.json` para el ciclo rapido del frontend.
- Usar `docker compose up -d --build` para iniciar o reconstruir servicios y `docker compose ps` para comprobar su estado.
- Revisar primero `docker compose logs --tail=...` cuando el frontend muestre un error de API o un contenedor no responda.
- Mantener las dependencias declaradas en `frontend/package.json` y `backend/requirements.txt`; no depender de instalaciones globales.
- Mantener los artefactos generados fuera del control de versiones: `node_modules`, `dist`, caches, entornos virtuales y archivos `.env` estan ignorados por el repositorio.
- No guardar secretos en el repositorio. Usar `.env` local y documentar solo variables no sensibles o ejemplos.
- Para cambios de frontend respetar el alias `@`, ESLint, TypeScript estricto y los patrones existentes de componentes UI.
- Para cambios de backend conservar hot reload y `debugpy` como facilidades de desarrollo, pero no asumir que son configuracion de produccion.
- Tras corregir una incidencia, registrar la causa, el cambio aplicado y una prueba reproducible; no limitarse a indicar que el servicio "funciona".
- Mantener los cambios enfocados y no reformatear archivos no relacionados con la tarea.

## Fuentes

- `AGENTS.md`
- `README.es.md`
- `docker-compose.yml`
- `frontend/package.json`
- `backend/requirements.txt`
- `.gitignore`
- `frontend/.gitignore`
- `frontend/eslint.config.js`
- `frontend/tsconfig.app.json`
- `verification.md`
