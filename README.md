# Impacto de Marca / BrandPulse

Proyecto para recolectar reseñas de Google Play y App Store, clasificarlas por sentimiento/topic/mención de hito, y generar un dashboard comparativo para BanBif y Agora.

## Apps monitoreadas

| Marca | Google Play package | App Store ID |
|---|---|---|
| BanBif | `pe.com.banbif.pnappmobile` | `6736497481` |
| Agora | `pe.indigital.tunki.user` | `1478814349` |

## Instalación

```bash
npm install
cp .env.example .env
```

Edita `.env` y agrega tu API key:

```env
GEMINI_API_KEY=tu_api_key
USE_GEMINI=true
```

No subas `.env` a GitHub. Si una API key antigua quedó expuesta, revócala/rotala antes de usar este proyecto.

## Scripts principales

```bash
npm run check      # Revisa sintaxis JS
npm run validate   # Valida configuración, métricas y reviews_db.json
npm run ingest     # Ejecuta scraping + clasificación + regeneración de data.js
npm run scheduler  # Ejecuta el scheduler cron
npm start          # Alias del scheduler
```

## Modo de prueba sin Gemini

Para probar scraping, deduplicación, métricas y dashboard sin consumir Gemini:

```env
USE_GEMINI=false
```

En ese modo, las reseñas se clasifican con heurística y quedan marcadas con:

- `classificationSource: "heuristic"`
- `classificationError: "Gemini disabled by USE_GEMINI=false"`

## Flujo de datos

1. `backend/ingest.js` descarga reseñas recientes de Google Play y App Store.
2. Normaliza cada reseña al esquema estándar.
3. Deduplica contra `prototype/reviews_db.json`.
4. Clasifica cada nueva reseña con Gemini o heurística.
5. Guarda la base acumulada.
6. Regenera `prototype/data.js` para el dashboard.

## Métrica Health Score

`healthScore` es una métrica interna del prototipo, no un estándar externo. Se calcula como:

```txt
50% rating promedio normalizado + 50% balance de sentimiento
```

El balance de sentimiento se calcula como:

```txt
sentimentScore = positivePct - negativePct + 50
```

El resultado final se limita al rango 0–100.

## Métricas pre/post hito

La comparación usa datos reales:

- Pre-hito: 60 días antes de `hitoDate`.
- Post-hito: 30 días desde `hitoDate`.

No se usan valores simulados para `comparison.pre` ni `comparison.post`.

## Dashboard

Abre `prototype/index.html` en el navegador después de ejecutar `npm run ingest` o `npm run validate`.

El login actual en `prototype/app.js` es solo para prototipo local. No debe usarse en producción. Para publicar el dashboard se necesita autenticación real en backend, sesiones seguras y contraseñas hasheadas.

## Python scraper

`app_store_reviews.py` se mantiene como herramienta auxiliar para App Store. El pipeline principal para actualizar el dashboard es Node (`backend/ingest.js`).

Para usar el scraper Python auxiliar:

```bash
pip install -r requirements.txt
python app_store_reviews.py
```
