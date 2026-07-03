# BrandPulse — Flujos de Usuario Principales

## Flujo A: Analista de Minsait Configurando un Nuevo Cliente

### Contexto
Un analista de Minsait recibe el encargo de monitorear el impacto de marca de un nuevo cliente. Debe configurar el cliente, sus apps y el hito de marca en BrandPulse.

### Diagrama de Flujo

```mermaid
sequenceDiagram
    actor Analista as Analista Minsait
    participant UI as BrandPulse UI
    participant API as Backend API
    participant DB as PostgreSQL
    participant SC as Scraper Service
    participant LLM as Pipeline LLM

    Analista->>UI: Login con credenciales Minsait
    UI->>API: POST /auth/login
    API-->>UI: JWT token (rol: analyst)

    Note over Analista,UI: Paso 1: Crear cliente

    Analista->>UI: Clic "Nuevo Cliente"
    UI->>UI: Abre modal de configuración
    Analista->>UI: Llena nombre, industria, logo
    Analista->>UI: Configura idioma, zona horaria, emails
    UI->>API: POST /api/clients
    API->>DB: INSERT INTO clients
    API-->>UI: Cliente creado ✓

    Note over Analista,UI: Paso 2: Registrar apps

    Analista->>UI: Clic "Agregar App"
    Analista->>UI: Ingresa URL de Play Store / App Store
    UI->>API: POST /api/clients/:id/apps
    API->>SC: Validar que la app existe en la store
    SC-->>API: Metadata de la app (nombre, icono)
    API->>DB: INSERT INTO apps
    API-->>UI: App registrada ✓

    Analista->>UI: Repite para segunda store (iOS / Android)

    Note over Analista,UI: Paso 3: Definir hito de marca

    Analista->>UI: Clic "Definir Hito"
    Analista->>UI: Selecciona tipo (migración/rebranding)
    Analista->>UI: Ingresa fecha, nombre, descripción
    Analista->>UI: Agrega metadata (versión anterior, cambios clave)
    UI->>API: POST /api/apps/:id/milestones
    API->>DB: INSERT INTO milestones
    API-->>UI: Hito registrado ✓

    Note over Analista,UI: Paso 4: Configurar alertas

    Analista->>UI: Navega a "Alertas"
    Analista->>UI: Configura umbral: "Health Score < 60"
    Analista->>UI: Configura umbral: "Negativas > 40%"
    UI->>API: POST /api/alerts/config
    API->>DB: INSERT INTO alert_configs
    API-->>UI: Alertas configuradas ✓

    Note over Analista,UI: Paso 5: Ingesta inicial

    Analista->>UI: Clic "Ejecutar Primera Ingesta"
    UI->>API: POST /api/ingestion/trigger
    API->>SC: Iniciar scraping de reseñas
    SC->>DB: INSERT reseñas (batch)
    SC->>LLM: Encolar para análisis
    API-->>UI: Ingesta iniciada (barra de progreso)
    
    LLM->>LLM: Análisis sentimiento + topics
    LLM->>DB: INSERT llm_analyses
    
    UI->>API: GET /api/ingestion/status (polling)
    API-->>UI: Progreso: 347/500 reseñas procesadas
    API-->>UI: Completado ✓

    Note over Analista,UI: Paso 6: Verificación

    Analista->>UI: Navega al Dashboard de la app
    UI->>API: GET /api/apps/:id/health-score
    UI->>API: GET /api/apps/:id/topics
    API-->>UI: Datos iniciales del dashboard
    Analista->>UI: Verifica que los datos se muestran correctamente
```

### Pantallas Involucradas

| Paso | Pantalla | Acción principal |
|------|---------|-----------------|
| 1 | `/settings` → Modal "Nuevo Cliente" | Formulario con nombre, industria, logo, config |
| 2 | `/clients/:id` → Modal "Agregar App" | URL de store + validación automática |
| 3 | `/apps/:id/dashboard` → Modal "Definir Hito" | Tipo, fecha, descripción, metadata |
| 4 | `/apps/:id/alerts` | Configuración de umbrales y canales |
| 5 | `/apps/:id/dashboard` → Botón "Ejecutar Ingesta" | Barra de progreso + log en tiempo real |
| 6 | `/apps/:id/dashboard` | Verificación visual de datos |

### Tiempo Estimado del Flujo
- **Configuración manual**: ~10 minutos
- **Ingesta inicial (500 reseñas)**: ~5 minutos (scraping) + ~15 minutos (análisis LLM)
- **Total hasta dashboard funcional**: ~30 minutos

---

## Flujo B: Visualización de Impacto Post-Lanzamiento

### Contexto
Han pasado 30 días desde el hito de marca. El analista de Minsait necesita preparar una presentación para el cliente con los resultados del impacto. Navega al dashboard de la app para extraer insights y exportar un reporte.

### Diagrama de Flujo

```mermaid
sequenceDiagram
    actor Analista as Analista Minsait
    participant UI as BrandPulse UI
    participant API as Backend API
    participant DB as PostgreSQL
    participant EX as Export Service

    Analista->>UI: Login y navegar a cliente "BanBif"
    UI->>API: GET /api/clients/banbif/apps
    API-->>UI: Lista de apps con indicadores

    Note over Analista,UI: Vista 1: Dashboard de Impacto

    Analista->>UI: Seleccionar "BanBif App"
    UI->>API: GET /api/apps/:id/health-score?period=monthly
    UI->>API: GET /api/apps/:id/comparison
    UI->>API: GET /api/apps/:id/topics?period=last_30d
    UI->>API: GET /api/apps/:id/alerts
    API-->>UI: Health Score: 72 → 58 (caída 14pts)
    API-->>UI: Comparativa pre/post con delta
    API-->>UI: Top topics + alertas activas

    Analista->>UI: Observa alerta activa: "Health Score cayó debajo de 60"
    Analista->>UI: Observa top topic negativo: "UX - navegación confusa"

    Note over Analista,UI: Vista 2: Comparativa Pre/Post

    Analista->>UI: Navegar a tab "Comparativa"
    UI->>API: GET /api/apps/:id/comparison?milestone_id=xxx
    API-->>UI: Métricas lado a lado (pre vs post)

    Note right of UI: PRE (60 días antes):<br/>Rating: 4.1 | Positivas: 62%<br/>POST (30 días después):<br/>Rating: 3.4 | Positivas: 38%

    Analista->>UI: Filtrar por topic "UX"
    UI->>API: GET /api/apps/:id/reviews?topic=ux&phase=post
    API-->>UI: 127 reseñas sobre UX post-lanzamiento

    Note over Analista,UI: Vista 3: Explorador de Reseñas

    Analista->>UI: Clic en "Ver reseñas" del topic "UX"
    UI->>API: GET /api/apps/:id/reviews?topic=ux&sentiment=negative&limit=20
    API-->>UI: Reseñas con sentimiento, topic, mención de cambio

    Analista->>UI: Lee reseñas representativas
    Analista->>UI: Marca 3 reseñas como "destacadas" para el reporte

    Note over Analista,UI: Vista 4: Reporte Periódico

    Analista->>UI: Navegar a "Reportes"
    UI->>API: GET /api/apps/:id/reports?period_type=monthly
    API-->>UI: Reporte del mes con resumen ejecutivo generado

    Analista->>UI: Lee resumen ejecutivo del LLM
    Analista->>UI: Edita/ajusta redacción si es necesario

    Note over Analista,UI: Vista 5: Exportación

    Analista->>UI: Clic "Exportar Reporte"
    UI->>UI: Modal: seleccionar formato (PDF / PPT)
    Analista->>UI: Selecciona PPT + marca "incluir reseñas destacadas"
    UI->>API: POST /api/apps/:id/reports/export
    API->>EX: Generar PPT con datos + gráficas
    EX->>EX: Renderizar slides con marca Minsait
    EX-->>API: URL del archivo generado
    API-->>UI: Descarga lista ✓
    Analista->>UI: Descarga el PPT
```

### Pantallas y Datos Mostrados

#### Dashboard de Impacto (`/apps/:id/dashboard`)

```
┌─────────────────────────────────────────────────────────────────┐
│  BanBif App — Dashboard de Impacto                              │
├─────────────┬──────────────┬──────────────┬────────────────────┤
│ Health Score│  Avg Rating  │  Total       │  Alertas           │
│    58/100   │    ★ 3.4     │  Reviews     │  2 activas         │
│   ▼ -14pts  │   ▼ -0.7     │    847       │  ⚠ Score < 60      │
│             │              │   ▲ +23%     │  ⚠ Negativas > 40% │
├─────────────┴──────────────┴──────────────┴────────────────────┤
│                                                                 │
│  [Gráfica: Health Score por semana — línea temporal]            │
│  ████████████████████████╮                                      │
│                           ╲                                     │
│                            ╲██████████████                      │
│  ──────────────────────── HITO ─────────────────────           │
│  Semana -8  -6  -4  -2   0   +2  +4  +6  +8                   │
│                                                                 │
├────────────────────────────┬────────────────────────────────────┤
│ Top Positivos              │ Top Negativos                      │
│ 1. Seguridad (+12%)       │ 1. UX - navegación (-31%)          │
│ 2. Velocidad (+8%)        │ 2. Estabilidad - crashes (-22%)    │
│ 3. Biometría (+15%)       │ 3. Funciones perdidas (-18%)       │
├────────────────────────────┴────────────────────────────────────┤
│ Resumen ejecutivo (generado por IA)                             │
│ "En los primeros 30 días post-migración, BanBif App registró   │
│  una caída significativa en percepción de usuario..."           │
└─────────────────────────────────────────────────────────────────┘
```

#### Comparativa Pre/Post (`/apps/:id/comparison`)

```
┌──────────────────────────────────────────────────────────┐
│  Comparativa: Pre-migración vs Post-migración            │
│  Hito: Migración app v3.0 (15 Mar 2026)                 │
├────────────────────┬──────────┬──────────┬──────────────┤
│ Métrica            │ PRE      │ POST     │ Delta        │
├────────────────────┼──────────┼──────────┼──────────────┤
│ Rating promedio    │ 4.1      │ 3.4      │ ▼ -0.7      │
│ Health Score       │ 72       │ 58       │ ▼ -14       │
│ % Positivas        │ 62%      │ 38%      │ ▼ -24pp     │
│ % Negativas        │ 18%      │ 41%      │ ▲ +23pp     │
│ Menciones cambio   │ 2%       │ 34%      │ ▲ +32pp     │
│ Topic #1 positivo  │ Fácil uso│ Seguridad│ —           │
│ Topic #1 negativo  │ Lentitud │ UX       │ —           │
│ Volumen semanal    │ 45       │ 89       │ ▲ +98%      │
└────────────────────┴──────────┴──────────┴──────────────┘
```

### Estructura del PPT Exportado

| Slide # | Contenido |
|---------|-----------|
| 1 | Portada con logo Minsait + nombre del cliente + período |
| 2 | Resumen ejecutivo (texto generado por LLM) |
| 3 | Health Score timeline con línea vertical del hito |
| 4 | Tabla comparativa pre/post (métricas principales) |
| 5 | Distribución de sentimiento (donut chart pre vs post) |
| 6 | Top 5 topics positivos con tendencia |
| 7 | Top 5 topics negativos con tendencia |
| 8 | Reseñas destacadas (3-5 reseñas textuales seleccionadas) |
| 9 | Menciones explícitas al cambio de marca (% y ejemplos) |
| 10 | Recomendaciones accionables |
| 11 | Próximos pasos y siguiente período de monitoreo |

---

## Diagrama de Estados de una Reseña

```mermaid
stateDiagram-v2
    [*] --> Scraped: Ingesta desde store
    Scraped --> Pending: Deduplicación OK
    Scraped --> Duplicate: Ya existe en BD
    Duplicate --> [*]
    Pending --> Processing: Worker toma de la cola
    Processing --> Analyzed: LLM completa análisis
    Processing --> Failed: Error en LLM o timeout
    Failed --> Pending: Retry (max 3 intentos)
    Analyzed --> Completed: Embedding generado
    Completed --> [*]
```
