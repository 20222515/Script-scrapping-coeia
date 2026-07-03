# BrandPulse — Estructura de Carpetas del Proyecto

## Árbol Completo

```
brandpulse/
├── README.md
├── docker-compose.yml
├── .env.example
├── .gitignore
│
├── frontend/                          # React SPA (Vite)
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   ├── public/
│   │   ├── favicon.ico
│   │   └── minsait-logo.svg
│   └── src/
│       ├── main.jsx                   # Entry point
│       ├── App.jsx                    # Router principal
│       ├── index.css                  # Tokens de diseño globales
│       ├── assets/
│       │   ├── fonts/
│       │   └── images/
│       ├── components/                # Componentes reutilizables
│       │   ├── layout/
│       │   │   ├── Sidebar.jsx
│       │   │   ├── Sidebar.module.css
│       │   │   ├── Header.jsx
│       │   │   ├── Header.module.css
│       │   │   ├── PageWrapper.jsx
│       │   │   └── PageWrapper.module.css
│       │   ├── charts/
│       │   │   ├── HealthScoreChart.jsx
│       │   │   ├── SentimentDonut.jsx
│       │   │   ├── TopicBarChart.jsx
│       │   │   ├── TimelineComparison.jsx
│       │   │   └── RatingDistribution.jsx
│       │   ├── cards/
│       │   │   ├── MetricCard.jsx
│       │   │   ├── MetricCard.module.css
│       │   │   ├── AlertCard.jsx
│       │   │   └── ClientCard.jsx
│       │   ├── tables/
│       │   │   ├── ReviewsTable.jsx
│       │   │   └── ReviewsTable.module.css
│       │   ├── filters/
│       │   │   ├── DateRangePicker.jsx
│       │   │   ├── RatingFilter.jsx
│       │   │   ├── SentimentFilter.jsx
│       │   │   └── TopicFilter.jsx
│       │   ├── modals/
│       │   │   ├── NewClientModal.jsx
│       │   │   ├── NewMilestoneModal.jsx
│       │   │   └── ExportModal.jsx
│       │   └── common/
│       │       ├── Button.jsx
│       │       ├── Badge.jsx
│       │       ├── Loader.jsx
│       │       ├── EmptyState.jsx
│       │       └── Tooltip.jsx
│       ├── pages/
│       │   ├── Dashboard.jsx          # Vista global
│       │   ├── Dashboard.module.css
│       │   ├── ClientDetail.jsx       # Detalle del cliente
│       │   ├── AppDashboard.jsx       # Dashboard de impacto de app
│       │   ├── AppDashboard.module.css
│       │   ├── ReviewExplorer.jsx     # Explorador de reseñas
│       │   ├── Comparison.jsx         # Comparativa pre/post
│       │   ├── Reports.jsx            # Reportes periódicos
│       │   ├── Alerts.jsx             # Gestión de alertas
│       │   ├── Settings.jsx           # Configuración
│       │   └── Login.jsx
│       ├── hooks/
│       │   ├── useHealthScore.js
│       │   ├── useReviews.js
│       │   ├── useAlerts.js
│       │   ├── useComparison.js
│       │   └── useExport.js
│       ├── stores/
│       │   ├── authStore.js           # Zustand store para auth
│       │   ├── clientStore.js
│       │   └── filterStore.js
│       ├── services/
│       │   ├── api.js                 # Axios instance + interceptors
│       │   ├── clientsApi.js
│       │   ├── reviewsApi.js
│       │   ├── reportsApi.js
│       │   └── alertsApi.js
│       └── utils/
│           ├── formatters.js          # Formateo de fechas, números
│           ├── colors.js              # Paleta Minsait + helpers
│           ├── constants.js
│           └── validators.js
│
├── backend/                           # API + Workers (Node.js)
│   ├── package.json
│   ├── tsconfig.json
│   ├── Dockerfile
│   ├── .env.example
│   └── src/
│       ├── index.ts                   # Entry point (Express server)
│       ├── config/
│       │   ├── database.ts            # Conexión PostgreSQL (pg-pool)
│       │   ├── redis.ts               # Conexión Redis
│       │   ├── openai.ts              # Cliente OpenAI
│       │   └── env.ts                 # Variables de entorno validadas (zod)
│       ├── routes/
│       │   ├── index.ts               # Router principal
│       │   ├── clients.ts
│       │   ├── apps.ts
│       │   ├── reviews.ts
│       │   ├── milestones.ts
│       │   ├── reports.ts
│       │   ├── alerts.ts
│       │   ├── ingestion.ts
│       │   └── auth.ts
│       ├── controllers/
│       │   ├── clientsController.ts
│       │   ├── appsController.ts
│       │   ├── reviewsController.ts
│       │   ├── milestonesController.ts
│       │   ├── reportsController.ts
│       │   ├── alertsController.ts
│       │   ├── ingestionController.ts
│       │   └── authController.ts
│       ├── services/
│       │   ├── clientService.ts
│       │   ├── reviewService.ts
│       │   ├── healthScoreService.ts
│       │   ├── comparisonService.ts
│       │   ├── alertService.ts
│       │   ├── reportService.ts
│       │   └── exportService.ts       # Generación PDF/PPT
│       ├── middleware/
│       │   ├── auth.ts                # JWT verification
│       │   ├── rbac.ts                # Role-based access control
│       │   ├── rateLimiter.ts
│       │   ├── errorHandler.ts
│       │   └── validator.ts           # Validación con zod
│       ├── models/
│       │   ├── client.ts
│       │   ├── app.ts
│       │   ├── review.ts
│       │   ├── milestone.ts
│       │   ├── llmAnalysis.ts
│       │   ├── periodReport.ts
│       │   ├── alertConfig.ts
│       │   └── alertEvent.ts
│       ├── jobs/
│       │   ├── queue.ts               # BullMQ queue setup
│       │   ├── workers/
│       │   │   ├── ingestionWorker.ts
│       │   │   ├── analysisWorker.ts
│       │   │   └── reportWorker.ts
│       │   └── schedulers/
│       │       ├── ingestionScheduler.ts   # Cron cada 6h
│       │       ├── reportScheduler.ts      # Cron semanal/mensual
│       │       └── alertScheduler.ts       # Cron cada hora
│       ├── websocket/
│       │   └── alertSocket.ts         # WebSocket para alertas real-time
│       └── utils/
│           ├── logger.ts              # Winston logger
│           ├── hash.ts
│           └── pagination.ts
│
├── pipeline/                          # Pipeline LLM + Connectors
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── connectors/
│       │   ├── base.ts                # Interfaz base del conector
│       │   ├── playStore.ts           # google-play-scraper wrapper
│       │   ├── appStore.ts            # app-store-scraper wrapper
│       │   └── index.ts              # Factory de conectores
│       ├── llm/
│       │   ├── client.ts             # OpenAI client wrapper
│       │   ├── prompts/
│       │   │   ├── sentimentPrompt.ts
│       │   │   ├── topicPrompt.ts
│       │   │   ├── mentionDetectionPrompt.ts
│       │   │   └── executiveSummaryPrompt.ts
│       │   ├── parsers/
│       │   │   ├── sentimentParser.ts  # Parseo del output del LLM
│       │   │   ├── topicParser.ts
│       │   │   └── summaryParser.ts
│       │   └── embeddings.ts          # Generación de embeddings
│       ├── processors/
│       │   ├── reviewProcessor.ts     # Orquesta el análisis individual
│       │   ├── batchProcessor.ts      # Clustering temático en batch
│       │   ├── summaryProcessor.ts    # Genera resúmenes de período
│       │   └── alertEvaluator.ts      # Evalúa umbrales de alerta
│       └── utils/
│           ├── textCleaner.ts         # Normalización de texto
│           ├── rateLimiter.ts         # Rate limiting OpenAI
│           └── costTracker.ts         # Tracking de costos LLM
│
├── shared/                            # Código compartido
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── types/
│       │   ├── client.ts
│       │   ├── app.ts
│       │   ├── review.ts
│       │   ├── milestone.ts
│       │   ├── analysis.ts
│       │   ├── report.ts
│       │   ├── alert.ts
│       │   └── api.ts                 # Request/Response types
│       ├── constants/
│       │   ├── sentiments.ts
│       │   ├── topics.ts
│       │   ├── milestoneTypes.ts
│       │   └── roles.ts
│       └── validators/
│           ├── clientSchema.ts        # Zod schemas
│           ├── reviewSchema.ts
│           └── milestoneSchema.ts
│
├── infra/                             # Infraestructura
│   ├── terraform/                     # IaC para Azure
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   ├── outputs.tf
│   │   ├── modules/
│   │   │   ├── container-apps/
│   │   │   ├── postgresql/
│   │   │   ├── redis/
│   │   │   ├── storage/
│   │   │   └── monitoring/
│   │   └── environments/
│   │       ├── dev.tfvars
│   │       ├── staging.tfvars
│   │       └── prod.tfvars
│   ├── docker/
│   │   ├── Dockerfile.backend
│   │   ├── Dockerfile.pipeline
│   │   └── docker-compose.dev.yml
│   ├── migrations/                    # Migraciones SQL
│   │   ├── 001_create_clients.sql
│   │   ├── 002_create_apps.sql
│   │   ├── 003_create_milestones.sql
│   │   ├── 004_create_reviews.sql
│   │   ├── 005_create_llm_analyses.sql
│   │   ├── 006_create_period_reports.sql
│   │   ├── 007_create_alerts.sql
│   │   ├── 008_create_ingestion_logs.sql
│   │   ├── 009_create_views.sql
│   │   └── 010_seed_data.sql
│   └── scripts/
│       ├── deploy.sh
│       ├── migrate.sh
│       └── seed.sh
│
└── docs/                              # Documentación
    ├── 01_arquitectura.md
    ├── 02_base_de_datos.md
    ├── 03_estructura_carpetas.md
    ├── 04_flujos_usuario.md
    ├── 05_prompts_llm.md
    ├── 06_casos_simulados.md
    ├── 07_riesgos.md
    └── 08_mvp.md
```

## Convenciones

| Aspecto | Convención |
|---------|-----------|
| **Nombrado de archivos** | camelCase para TS/JS, kebab-case para CSS |
| **Componentes React** | PascalCase, un componente por archivo |
| **CSS** | CSS Modules (`.module.css`) para componentes, `index.css` para globals |
| **Tests** | Co-located: `Component.test.tsx` junto al componente |
| **Variables de entorno** | Prefijo `VITE_` para frontend, sin prefijo para backend |
| **Monorepo** | Workspaces de npm (`npm workspaces`) para `shared`, `pipeline`, `backend` |
