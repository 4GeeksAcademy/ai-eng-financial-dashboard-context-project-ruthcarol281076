## Hallazgos prioritarios

| Tipo | Convención o patrón identificado | Impacto para futuros colaboradores/agentes | Fuente |
|---|---|---|---|
| Riesgo alto | El frontend dependía originalmente de `http://backend:8000`, pero en este entorno Docker esa comunicación produjo `502`. Se corrigió usando `host.docker.internal`. | La configuración actual puede comportarse distinto en Linux, Codespaces, Docker Desktop o CI. Conviene documentar y probar ambas topologías. | `docker-compose.yml`, `vite.config.ts` |
| Riesgo alto | CORS permite cualquier origen y credenciales: `allow_origins=["*"]` y `allow_credentials=True`. | Es permisivo para desarrollo, pero no debería trasladarse sin cambios a producción. | `main.py` |
| Riesgo alto | La generación de datos usa `random.seed(42)` sobre el generador global. | Puede afectar otras operaciones aleatorias y no es ideal bajo concurrencia. Debe preferirse un generador local, por ejemplo `random.Random(seed)`. | `routes.py` |
| Riesgo medio | Los datos dependen de `date.today()`, mientras que el encabezado del frontend muestra `2024 - Full Year`. | La interfaz puede mostrar un periodo distinto al de los datos reales generados. | `routes.py`, `App.tsx` |
| Riesgo medio | El backend contiene modelos, generación mock, filtros, agregaciones y endpoints en un único archivo. | Los cambios futuros pueden producir un módulo difícil de mantener y probar. | `routes.py` |
| Riesgo medio | El backend usa `float` para importes financieros. | Los cálculos monetarios pueden sufrir errores de precisión. Para datos reales convendría `Decimal` o enteros en unidades mínimas. | `routes.py`, `financial-types.ts` |
| Riesgo medio | El frontend consume solamente `/api/metrics`, aunque el backend expone endpoints adicionales de resumen, alertas, comparación y categorías. | Puede producirse divergencia entre la API implementada y la funcionalidad visible. | `App.tsx`, `routes.py` |
| Riesgo medio | La comunicación usa tipos duplicados en Python y TypeScript, sin generación automática de contrato. | Un cambio en el modelo Pydantic puede dejar el frontend desactualizado sin error de compilación inmediato. | `routes.py`, `financial-types.ts` |
| Riesgo medio | `depends_on` solo controla el orden de inicio, no la disponibilidad real del backend. No hay `healthcheck` en Compose. | El frontend puede iniciar antes de que FastAPI esté listo y mostrar errores transitorios. | `docker-compose.yml` |
| Riesgo medio | El contenedor frontend monta el código fuente y un volumen anónimo para `node_modules`. | Puede crear diferencias entre dependencias dentro del contenedor y las visibles para VS Code; de hecho, se detectó un problema de permisos y tipos de Vite. | `docker-compose.yml`, `.gitignore` |
| Riesgo bajo | El proceso del backend expone `debugpy` y usa `--reload`. | Es adecuado para desarrollo, pero no debe usarse como configuración de producción. | `Dockerfile` |
| Riesgo bajo | El build frontend genera un chunk superior a 500 kB. | Actualmente no bloquea el build, pero puede afectar carga inicial y rendimiento. | `package.json`, resultado de `npm run build` |

## Convenciones útiles

| Convención | Aplicación en el proyecto | Beneficio | Fuente |
|---|---|---|---|
| Arranque unificado | Los servicios se levantan con `docker compose up --build` o `docker compose up -d --build`. | Reduce la configuración manual y mantiene backend y frontend reproducibles. | `README.es.md`, `docker-compose.yml` |
| Puertos documentados | Frontend en `5173`, API en `8000`, debug en `5678`. | Facilita el diagnóstico y la configuración de Codespaces. | `README.es.md`, `docker-compose.yml` |
| Entry point claro del backend | FastAPI se inicia como `app.main:app`. | Los colaboradores saben dónde registrar middleware y routers. | `Dockerfile`, `main.py` |
| Router centralizado | Las rutas se registran mediante `app.include_router(router)`. | Mantiene el punto de montaje de la API explícito. | `main.py`, `routes.py` |
| Tipado estricto en frontend | TypeScript usa `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch` y `verbatimModuleSyntax`. | Detecta errores estructurales antes de ejecutar la aplicación. | `tsconfig.app.json` |
| Alias de imports | Se usa `@/components`, `@/lib` y alias `@/*`. | Evita rutas relativas frágiles y hace más legibles los imports. | `vite.config.ts`, `tsconfig.app.json`, `components.json` |
| Separación básica de responsabilidades | `App.tsx` coordina carga y estado; `financial-utils.ts` calcula métricas; los componentes renderizan UI. | Facilita modificar cálculos sin alterar directamente los gráficos. | `App.tsx`, `financial-utils.ts`, `dashboard` |
| Tests de lógica financiera | Las funciones de KPIs, agregación y formateo tienen tests unitarios. | Protege cálculos importantes y sirve como ejemplo para nuevas pruebas. | `financial-utils.test.ts` |
| Tests de endpoints | Los endpoints principales tienen cobertura con `TestClient`. | Define el comportamiento esperado de filtros y respuestas. | `test_routes.py` |
| Validación de calidad | El frontend dispone de scripts para `test`, `build`, `lint` y cobertura. | Establece una rutina clara antes de entregar cambios. | `package.json`, `eslint.config.js` |
| Exclusión de artefactos | Se excluyen `node_modules`, builds, caches, entornos virtuales y archivos locales. | Evita subir artefactos generados o secretos accidentales. | `.gitignore`, `.gitignore` |
| Instrucciones de trabajo | `AGENTS.md` exige revisar reglas, skills y memory bank antes de actuar. | Define una expectativa explícita para agentes y colaboradores. | `AGENTS.md` |

## Validación ejecutada

- `npm test`: **5 pruebas pasaron**.
- `npm run build`: **compilación exitosa**, con advertencia de chunk grande.
- `npm run lint`: **sin errores**.
- `pytest` local: no pudo recopilar pruebas porque el entorno local no tenía instalado `fastapi`; el contenedor backend sí instala las dependencias desde `requirements.txt`.
- No se modificaron archivos durante esta revisión.