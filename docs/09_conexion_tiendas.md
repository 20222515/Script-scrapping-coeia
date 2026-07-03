# Conexión a App Store y Google Play Store

Para ingestar reseñas de forma automatizada hacia la plataforma BrandPulse, la mejor arquitectura es separar esta tarea en un **Microservicio Backend en Node.js**. Las aplicaciones del lado del cliente (Frontend como tu prototipo en HTML/JS) no pueden conectarse directamente a estas tiendas debido a restricciones de seguridad (CORS) y al manejo de claves API.

A continuación te presento dos enfoques y el código exacto para implementarlo.

---

## 1. Instalación de Dependencias

Para el backend usaremos dos librerías comunitarias muy sólidas que facilitan enormemente el trabajo sin requerir la compleja configuración de las APIs oficiales de desarrollador (que a menudo requieren cuentas corporativas complejas de configurar).

Ejecuta esto en tu servidor Node.js:
```bash
npm install google-play-scraper app-store-scraper axios dotenv
```

---

## 2. Código del Servicio de Ingesta (Node.js)

Crea un archivo llamado `review-scraper.js`. Este script extraerá las reseñas de ambas tiendas y te las dejará en un formato JSON listo para ser enviado a un LLM para su análisis.

```javascript
// review-scraper.js
const gplay = require('google-play-scraper');
const appStore = require('app-store-scraper');

/**
 * 1. OBTENER RESEÑAS DE GOOGLE PLAY STORE
 * @param {string} appId - El ID de la app (ej. 'com.banbif.app')
 */
async function getPlayStoreReviews(appId, maxReviews = 100) {
    try {
        console.log(`[Google Play] Buscando reseñas para: ${appId}`);
        const reviews = await gplay.reviews({
            appId: appId,
            lang: 'es',
            country: 'pe', // Perú
            sort: gplay.sort.NEWEST,
            num: maxReviews
        });

        // Formateo para BrandPulse
        return reviews.data.map(r => ({
            source: 'playstore',
            id: r.id,
            userName: r.userName,
            rating: r.score,
            date: new Date(r.date).toISOString(),
            text: r.text,
            version: r.version || 'Desconocida'
        }));
    } catch (error) {
        console.error('[Google Play] Error:', error.message);
        return [];
    }
}

/**
 * 2. OBTENER RESEÑAS DE APPLE APP STORE
 * @param {string} appId - El ID numérico de la app en iOS (ej. '123456789')
 */
async function getAppStoreReviews(appId, maxReviews = 100) {
    try {
        console.log(`[App Store] Buscando reseñas para: ${appId}`);
        // app-store-scraper pagina por 50, así que pedimos páginas
        const pages = Math.ceil(maxReviews / 50);
        let allReviews = [];

        for (let i = 1; i <= pages; i++) {
            const reviews = await appStore.reviews({
                id: appId,
                country: 'pe', // Perú
                page: i
            });
            allReviews = allReviews.concat(reviews);
        }

        // Formateo para BrandPulse
        return allReviews.slice(0, maxReviews).map(r => ({
            source: 'appstore',
            id: r.id,
            userName: r.userName,
            rating: r.score,
            date: new Date(r.updated).toISOString(), // o r.url
            text: r.text,
            version: r.version || 'Desconocida'
        }));
    } catch (error) {
        console.error('[App Store] Error:', error.message);
        return [];
    }
}

/**
 * 3. PIPELINE DE EJECUCIÓN UNIFICADO
 */
async function runBrandPulseIngestion() {
    // Ejemplo: IDs ficticios de BanBif
    const PLAYSTORE_ID = 'pe.com.banbif.pnappmobile'; // BanBif real
    const APPSTORE_ID = '6736497481';        // BanBif real

    const [androidReviews, iosReviews] = await Promise.all([
        getPlayStoreReviews(PLAYSTORE_ID, 50),
        getAppStoreReviews(APPSTORE_ID, 50)
    ]);

    const unifiedReviews = [...androidReviews, ...iosReviews];
    
    // Ordenar por fecha (más recientes primero)
    unifiedReviews.sort((a, b) => new Date(b.date) - new Date(a.date));

    console.log(`✅ Ingesta completada. Total reseñas extraídas: ${unifiedReviews.length}`);
    
    // Aquí es donde conectarías con OpenAI/Anthropic:
    // const analyzedReviews = await analyzeSentimentWithLLM(unifiedReviews);
    // await saveToDatabase(analyzedReviews);

    return unifiedReviews;
}

// Ejecutar
runBrandPulseIngestion().then(data => {
    // Ver la primera reseña extraída
    if(data.length > 0) console.log("Ejemplo de reseña:", data[0]);
});
```

---

## 3. ¿Cómo integrar esto en la arquitectura de BrandPulse?

1. **Frontend (Prototipo actual):**
   El botón de "Ejecutar Ingesta" en `app.js` debería hacer un `fetch()` a tu backend, no ejecutar la lógica localmente.
   ```javascript
   // En app.js
   async function handleIngest() {
       const btn = document.getElementById('btn-ingest');
       btn.disabled = true;
       
       try {
           // Llamada al backend
           const response = await fetch('https://tu-api.minsait.com/ingest', { method: 'POST' });
           const result = await response.json();
           
           // Actualizar el UI con las nuevas reseñas...
       } catch (error) {
           console.error("Falló la ingesta", error);
       }
   }
   ```

2. **Backend (El código de arriba):**
   Envuelves el código en un servidor Express.js o en una Azure Function / AWS Lambda. Cuando recibe la petición, ejecuta el scraping, pasa los textos a ChatGPT (o Claude) para sacar el `Sentimiento` y el `Topic`, lo guarda en PostgreSQL y devuelve el OK al frontend.

> **APIs Oficiales vs Scraping**: Las librerías sugeridas hacen *scraping* de los endpoints públicos. Esto es excelente para un MVP porque no requiere tokens ni permisos complejos. Para una versión Enterprise definitiva, Minsait debería solicitar a BanBif/Agora que los añadan como analistas en sus cuentas de **App Store Connect API** y **Google Play Developer API**, donde el acceso es mediante JWT (JSON Web Tokens) y Google Service Accounts.
