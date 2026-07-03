// ═══════════════════════════════════════════════════════════════════════════════
// BrandPulse — Motor de ingesta de reseñas (Scraping + Gemini AI)
// ═══════════════════════════════════════════════════════════════════════════════
//
// Flujo:
//   1. Descarga reseñas nuevas de Google Play y App Store.
//   2. Normaliza esquema, topics e IDs.
//   3. Deduplica contra reviews_db.json.
//   4. Clasifica sentimiento, topic y mención de hito con Gemini o heurística.
//   5. Guarda reviews_db.json y regenera prototype/data.js.
//
// Uso desde /backend: node ingest.js
// Uso desde raíz:     npm run ingest
// ═══════════════════════════════════════════════════════════════════════════════

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const gplay = require('google-play-scraper');
const appStore = require('app-store-scraper');
const config = require('./config');

const DB_PATH = path.resolve(__dirname, config.dbPath);
const DATA_PATH = path.resolve(__dirname, '../prototype/data.js');
const LOG_DIR = path.resolve(__dirname, '../logs');

function ensureDir(dirPath) {
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
}

function logStoreError(clientKey, source, error) {
    ensureDir(LOG_DIR);
    const line = JSON.stringify({
        timestamp: new Date().toISOString(),
        client: clientKey,
        source,
        error: String(error && error.message ? error.message : error)
    });
    fs.appendFileSync(path.join(LOG_DIR, 'ingestion-errors.log'), `${line}\n`, 'utf-8');
}

// ─── Base de datos JSON persistente ──────────────────────────────────────────

function createEmptyDb() {
    return {
        lastRun: null,
        clients: Object.fromEntries(
            Object.keys(config.clients).map(clientKey => [clientKey, { reviews: [] }])
        )
    };
}

function loadDb() {
    const db = fs.existsSync(DB_PATH)
        ? JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'))
        : createEmptyDb();

    if (!db.clients) db.clients = {};
    for (const clientKey of Object.keys(config.clients)) {
        if (!db.clients[clientKey]) db.clients[clientKey] = { reviews: [] };
        if (!Array.isArray(db.clients[clientKey].reviews)) db.clients[clientKey].reviews = [];
        db.clients[clientKey].reviews = db.clients[clientKey].reviews
            .map(review => normalizeReview(review, clientKey, review.source || 'historical'))
            .filter(Boolean);
    }
    return db;
}

function saveDb(db) {
    db.lastRun = new Date().toISOString();
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
    console.log(`💾 BD guardada: ${DB_PATH}`);
}

// ─── Normalización y deduplicación ───────────────────────────────────────────

function normalizeSource(source) {
    const s = String(source || '').toLowerCase();
    if (s.includes('google') || s.includes('play')) return 'google_play';
    if (s.includes('app')) return 'app_store';
    return s || 'unknown';
}

function displaySource(source) {
    return source === 'google_play' ? 'Google Play'
        : source === 'app_store' ? 'App Store'
            : 'Fuente desconocida';
}

function normalizeTopic(topic) {
    const topicMap = {
        'Estabilidad / Crashes': 'Estabilidad',
        'Soporte / Atención': 'Soporte',
        'Cashback / Recompensas': 'Cashback',
        'Fallos Técnicos / Login': 'Login',
        'Login / Acceso': 'Login',
        'Pagos / QR': 'Pagos',
        'Diseño / Visual': 'Visual',
        'Crashes': 'Estabilidad',
        'Atención': 'Soporte',
        'Recompensas': 'Cashback'
    };

    const normalized = topicMap[topic] || topic || 'UX';
    return config.validTopics.includes(normalized) ? normalized : 'UX';
}

function normalizeSentiment(sentiment) {
    return ['positive', 'neutral', 'negative'].includes(sentiment) ? sentiment : 'neutral';
}

function dateFormatted(dateIso) {
    const d = new Date(dateIso);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
}

function stableId(parts) {
    return crypto.createHash('sha1').update(parts.join('|')).digest('hex').slice(0, 16);
}

function normalizeReview(rawReview, clientKey, source) {
    const normalizedSource = normalizeSource(source || rawReview.source);
    const content = String(rawReview.content || rawReview.text || rawReview.review || '').trim();
    if (!content || content.length < 3) return null;

    const rawDate = rawReview.date || rawReview.updated || rawReview.reviewCreatedVersionDate || Date.now();
    const date = new Date(rawDate);
    const dateIso = Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
    const ratingNumber = Number(rawReview.rating || rawReview.score || 0);
    const rating = Math.max(1, Math.min(5, Number.isFinite(ratingNumber) ? ratingNumber : 1));
    const user = String(rawReview.user || rawReview.userName || rawReview.author || 'Usuario anónimo');
    const clientConfig = config.clients[clientKey] || {};

    const id = String(
        rawReview.id ||
        rawReview.reviewId ||
        `${normalizedSource}-${stableId([clientKey, normalizedSource, user, dateIso, content.slice(0, 120)])}`
    );

    return {
        id,
        client: clientKey,
        source: normalizedSource,
        sourceLabel: displaySource(normalizedSource),
        url: normalizedSource === 'google_play' ? clientConfig.playStoreUrl
            : normalizedSource === 'app_store' ? clientConfig.appStoreUrl
                : rawReview.url || '',
        user,
        userName: user,
        rating,
        date: dateIso,
        dateFormatted: rawReview.dateFormatted || dateFormatted(dateIso),
        content,
        text: content,
        sentiment: normalizeSentiment(rawReview.sentiment),
        topic: normalizeTopic(rawReview.topic),
        mention: Boolean(rawReview.mention),
        classificationSource: rawReview.classificationSource || 'heuristic',
        classificationError: rawReview.classificationError || null
    };
}

function buildReviewKey(review) {
    return [
        review.client,
        normalizeSource(review.source),
        review.id || '',
        review.user || review.userName || '',
        review.date || '',
        String(review.content || review.text || '').slice(0, 120)
    ].join('|').toLowerCase();
}

function mergeReviews(existingReviews, newReviews) {
    const map = new Map();
    for (const review of [...existingReviews, ...newReviews]) {
        const normalized = normalizeReview(review, review.client, review.source);
        if (!normalized) continue;
        map.set(buildReviewKey(normalized), normalized);
    }
    return Array.from(map.values()).sort((a, b) => new Date(b.date) - new Date(a.date));
}

// ─── Scraping ────────────────────────────────────────────────────────────────

async function scrapePlayStore(clientKey) {
    const client = config.clients[clientKey];
    try {
        console.log(`  [Google Play] Buscando reseñas de ${client.name}...`);
        const result = await gplay.reviews({
            appId: client.playStoreId,
            lang: 'es',
            country: 'pe',
            sort: gplay.sort.NEWEST,
            num: config.reviewsPerStore
        });

        const data = Array.isArray(result && result.data) ? result.data : [];
        console.log(`  [Google Play] ${data.length} reseñas obtenidas`);
        return data.map(r => normalizeReview({
            id: r.id ? `gplay-${r.id}` : undefined,
            user: r.userName,
            rating: r.score,
            content: r.text,
            date: r.date,
            url: client.playStoreUrl
        }, clientKey, 'google_play')).filter(Boolean);
    } catch (error) {
        console.error(`  ⚠️  Error Google Play (${client.name}): ${error.message}`);
        logStoreError(clientKey, 'google_play', error);
        return [];
    }
}

async function scrapeAppStore(clientKey) {
    const client = config.clients[clientKey];
    try {
        console.log(`  [App Store] Buscando reseñas de ${client.name}...`);
        const pages = Math.max(1, Math.ceil(config.reviewsPerStore / 50));
        let all = [];
        for (let page = 1; page <= pages; page++) {
            const result = await appStore.reviews({ id: client.appStoreId, country: 'pe', page });
            all = all.concat(Array.isArray(result) ? result : []);
        }

        const sliced = all.slice(0, config.reviewsPerStore);
        console.log(`  [App Store] ${sliced.length} reseñas obtenidas`);
        return sliced.map(r => normalizeReview({
            id: r.id ? `appstore-${r.id}` : undefined,
            user: r.userName || r.author,
            rating: r.score,
            content: r.text || r.review,
            date: r.updated || r.date,
            url: client.appStoreUrl
        }, clientKey, 'app_store')).filter(Boolean);
    } catch (error) {
        console.error(`  ⚠️  Error App Store (${client.name}): ${error.message}`);
        logStoreError(clientKey, 'app_store', error);
        return [];
    }
}

// ─── Clasificación ──────────────────────────────────────────────────────────

function validateClassification(result) {
    if (!result || typeof result !== 'object') throw new Error('Clasificación vacía o inválida');
    if (!['positive', 'neutral', 'negative'].includes(result.sentiment)) {
        throw new Error(`Sentiment inválido: ${result.sentiment}`);
    }
    if (!config.validTopics.includes(result.topic)) {
        throw new Error(`Topic inválido: ${result.topic}`);
    }
    if (typeof result.mention !== 'boolean') {
        throw new Error('mention debe ser boolean');
    }
}

async function classifyWithGemini(reviewText, clientKey) {
    if (!config.useGemini) {
        throw new Error('Gemini disabled by USE_GEMINI=false');
    }
    if (!config.geminiApiKey) {
        throw new Error('Falta GEMINI_API_KEY en variables de entorno');
    }

    const client = config.clients[clientKey];
    const prompt = `Analiza la siguiente reseña de la app "${client.name}".

Debes clasificar:
1. sentiment: positive, neutral o negative.
2. topic: uno de los topics válidos.
3. mention: true si la reseña menciona directa o indirectamente el hito/cambio de marca, false si no.

Topics válidos:
${config.validTopics.join(', ')}

Hito:
${client.hitoTitle}

Fecha del hito:
${client.hitoDate}

Palabras clave del hito:
${client.hitoKeywords.join(', ')}

Reseña:
${JSON.stringify(reviewText)}`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${config.geminiModel}:generateContent`;
    const body = {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
            temperature: 0,
            responseMimeType: 'application/json',
            responseSchema: {
                type: 'object',
                properties: {
                    sentiment: { type: 'string', enum: ['positive', 'neutral', 'negative'] },
                    topic: { type: 'string', enum: config.validTopics },
                    mention: { type: 'boolean' }
                },
                required: ['sentiment', 'topic', 'mention']
            }
        }
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-goog-api-key': config.geminiApiKey
        },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini HTTP ${response.status}: ${errorText}`);
    }

    const json = await response.json();
    const raw = json && json.candidates && json.candidates[0]
        && json.candidates[0].content && json.candidates[0].content.parts
        && json.candidates[0].content.parts[0] && json.candidates[0].content.parts[0].text;

    if (!raw) throw new Error('Gemini no devolvió contenido clasificable');

    const result = JSON.parse(String(raw).replace(/```json/g, '').replace(/```/g, '').trim());
    result.topic = normalizeTopic(result.topic);
    validateClassification(result);

    return {
        sentiment: result.sentiment,
        topic: result.topic,
        mention: result.mention,
        classificationSource: 'gemini',
        classificationError: null
    };
}

function classifyHeuristic(reviewText, clientKey, error = null) {
    const text = String(reviewText || '').toLowerCase();
    const client = config.clients[clientKey];

    const negativeWords = [
        'malo', 'malísima', 'malisima', 'pésimo', 'pesimo', 'horrible',
        'no funciona', 'error', 'falla', 'fallas', 'crash', 'se cierra',
        'lento', 'demora', 'no abre', 'no puedo', 'problema', 'bloqueado'
    ];

    const positiveWords = [
        'excelente', 'buena', 'bueno', 'rápida', 'rapida', 'mejoró',
        'mejoro', 'útil', 'util', 'fácil', 'facil', 'genial', 'perfecto'
    ];

    let sentiment = 'neutral';
    if (negativeWords.some(word => text.includes(word))) sentiment = 'negative';
    else if (positiveWords.some(word => text.includes(word))) sentiment = 'positive';

    const topicRules = [
        { topic: 'Login', words: ['login', 'iniciar sesión', 'iniciar sesion', 'ingresar', 'clave', 'contraseña', 'otp', 'token'] },
        { topic: 'Performance', words: ['lento', 'demora', 'carga', 'velocidad', 'rápida', 'rapida'] },
        { topic: 'Estabilidad', words: ['crash', 'se cierra', 'no abre', 'cuelga', 'congela'] },
        { topic: 'Transacciones', words: ['transferencia', 'transacción', 'transaccion', 'operación', 'operacion', 'yape', 'plin'] },
        { topic: 'Pagos', words: ['pagar', 'pago', 'qr', 'tarjeta'] },
        { topic: 'Cashback', words: ['cashback', 'recompensa', 'beneficio'] },
        { topic: 'Ahorro', words: ['ahorro', 'ahorrar', 'descuento'] },
        { topic: 'Soporte', words: ['soporte', 'atención', 'atencion', 'atienden', 'ayuda', 'reclamo'] },
        { topic: 'Visual', words: ['diseño', 'diseno', 'interfaz', 'visual', 'pantalla'] },
        { topic: 'Seguridad', words: ['seguridad', 'biometría', 'biometria', 'huella', 'rostro'] }
    ];

    const matchedRule = topicRules.find(rule => rule.words.some(word => text.includes(word)));
    const mention = client.hitoKeywords.some(keyword => text.includes(keyword.toLowerCase()));

    return {
        sentiment,
        topic: matchedRule ? matchedRule.topic : 'UX',
        mention,
        classificationSource: 'heuristic',
        classificationError: error ? String(error.message || error) : null
    };
}

async function classifyReview(review, clientKey) {
    try {
        return await classifyWithGemini(review.content, clientKey);
    } catch (error) {
        return classifyHeuristic(review.content, clientKey, error);
    }
}

// ─── Métricas ────────────────────────────────────────────────────────────────

function splitPrePostReviews(reviews, hitoDate, preDays = 60, postDays = 30) {
    const hito = new Date(hitoDate);
    if (Number.isNaN(hito.getTime())) return { pre: [], post: [] };

    const preStart = new Date(hito);
    preStart.setDate(preStart.getDate() - preDays);

    const postEnd = new Date(hito);
    postEnd.setDate(postEnd.getDate() + postDays);

    return {
        pre: reviews.filter(review => {
            const date = new Date(review.date);
            return date >= preStart && date < hito;
        }),
        post: reviews.filter(review => {
            const date = new Date(review.date);
            return date >= hito && date <= postEnd;
        })
    };
}

function computeMetrics(reviews) {
    const total = reviews.length;
    if (!total) {
        return { total: 0, avgRating: '0.0', posPct: 0, negPct: 0, neuPct: 0, mentionPct: 0, healthScore: 0 };
    }

    const avgRatingNumber = reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / total;
    const positive = reviews.filter(review => review.sentiment === 'positive').length;
    const negative = reviews.filter(review => review.sentiment === 'negative').length;
    const neutral = reviews.filter(review => review.sentiment === 'neutral').length;
    const mentions = reviews.filter(review => review.mention === true).length;

    const posPct = Math.round((positive / total) * 100);
    const negPct = Math.round((negative / total) * 100);
    const neuPct = Math.max(0, 100 - posPct - negPct) || Math.round((neutral / total) * 100);
    const mentionPct = Math.round((mentions / total) * 100);

    // Health Score interno del prototipo:
    // 50% rating promedio normalizado (1-5 -> 0-100) + 50% balance de sentimiento.
    // No es una métrica estándar externa; sirve para comparar evolución dentro del dashboard.
    const ratingScore = (avgRatingNumber / 5) * 100;
    const sentimentScore = Math.max(0, Math.min(100, posPct - negPct + 50));
    const healthScore = Math.max(0, Math.min(100, Math.round((ratingScore * 0.5) + (sentimentScore * 0.5))));

    return { total, avgRating: avgRatingNumber.toFixed(1), posPct, negPct, neuPct, mentionPct, healthScore };
}

function getTopTopics(reviews, topN = 3) {
    if (!reviews.length) return [];
    const counts = {};
    for (const review of reviews) {
        const topic = normalizeTopic(review.topic);
        counts[topic] = (counts[topic] || 0) + 1;
    }
    return Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, topN)
        .map(([name, count], i) => ({
            name,
            pct: Math.round((count / reviews.length) * 100),
            count,
            rank: i + 1
        }));
}

function metricType(value, threshold = 60) {
    return Number(value) >= threshold ? 'positive' : 'negative';
}

function formatReviewsForFrontend(reviews) {
    return reviews.map(review => ({
        rating: review.rating,
        text: review.content,
        sentiment: review.sentiment,
        topic: normalizeTopic(review.topic),
        mention: review.mention,
        date: review.dateFormatted || dateFormatted(review.date),
        source: displaySource(review.source),
        url: review.url,
        classificationSource: review.classificationSource,
        classificationError: review.classificationError
    }));
}

function buildChartData(reviews, mode, hitoDate) {
    const months = {};
    for (const review of reviews) {
        const date = new Date(review.date);
        if (Number.isNaN(date.getTime())) continue;
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        if (!months[key]) months[key] = [];
        months[key].push(review);
    }

    const sortedKeys = Object.keys(months).sort().slice(-6);
    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

    if (!sortedKeys.length) {
        return [{ week: 'Sin datos', pre: 0, post: null, rating: 0 }];
    }

    if (mode === 'general') {
        return sortedKeys.map(key => {
            const metrics = computeMetrics(months[key]);
            const monthIdx = Number(key.split('-')[1]) - 1;
            return { week: monthNames[monthIdx], pre: metrics.healthScore, post: null, rating: Number(metrics.avgRating) };
        });
    }

    const hitoKey = hitoDate ? `${hitoDate.slice(0, 4)}-${hitoDate.slice(5, 7)}` : null;
    return sortedKeys.map(key => {
        const metrics = computeMetrics(months[key]);
        const monthIdx = Number(key.split('-')[1]) - 1;
        const point = { week: monthNames[monthIdx], pre: null, post: null, rating: Number(metrics.avgRating) };
        if (hitoKey && key === hitoKey) {
            point.pre = metrics.healthScore;
            point.post = metrics.healthScore;
        } else if (hitoKey && key < hitoKey) {
            point.pre = metrics.healthScore;
        } else {
            point.post = metrics.healthScore;
        }
        return point;
    });
}

function generateAlerts(metrics, clientName) {
    const alerts = [];
    if (metrics.healthScore < 60) {
        alerts.push({ title: `Health Score crítico (${metrics.healthScore})`, desc: `El índice de ${clientName} está por debajo del umbral de 60 pts.`, time: 'Actual' });
    }
    if (metrics.negPct > 40) {
        alerts.push({ title: `Alto % de negativos (${metrics.negPct}%)`, desc: `Más del 40% de las reseñas son negativas.`, time: 'Actual' });
    }
    if (!alerts.length) {
        alerts.push({ title: 'Sin alertas críticas', desc: `Los indicadores de ${clientName} están dentro de los rangos esperados.`, time: 'Actual' });
    }
    return alerts;
}

function buildContext(clientKey, reviews, context) {
    const clientConfig = config.clients[clientKey];
    const relevantReviews = context === 'hito'
        ? reviews.filter(review => review.mention === true)
        : reviews;
    const workingReviews = relevantReviews.length ? relevantReviews : reviews;
    const metrics = computeMetrics(workingReviews);
    const { pre, post } = splitPrePostReviews(reviews, clientConfig.hitoDate);
    const preMetrics = computeMetrics(pre);
    const postMetrics = computeMetrics(post);

    return {
        title: context === 'hito' ? clientConfig.hitoTitle : 'Vista General',
        date: context === 'hito' ? clientConfig.hitoDate : `${reviews.length} reseñas acumuladas`,
        metrics: [
            { label: 'Health Score', value: `${metrics.healthScore}/100`, delta: context === 'hito' ? 'hito' : 'acumulado', type: metricType(metrics.healthScore), tooltip: 'Índice interno: 50% rating normalizado + 50% balance de sentimiento.' },
            { label: 'Avg Rating', value: metrics.avgRating, delta: context === 'hito' ? 'hito' : 'acumulado', type: Number(metrics.avgRating) >= 3.5 ? 'positive' : 'negative', tooltip: 'Promedio de estrellas (1-5) en App Store y Google Play.' },
            { label: 'Total Reseñas', value: metrics.total.toLocaleString(), delta: context === 'hito' ? 'hito' : 'total', type: 'positive', tooltip: 'Volumen total de reseñas procesadas en este contexto.' },
            { label: 'Menciones Cambio', value: `${metrics.mentionPct}%`, delta: context === 'hito' ? 'hito' : 'acumulado', type: metrics.mentionPct > 20 ? 'positive' : 'negative', tooltip: '% de reseñas que mencionan cambios, actualizaciones o hitos.' }
        ],
        chartData: buildChartData(reviews, context, clientConfig.hitoDate),
        sentiment: { positive: metrics.posPct, negative: metrics.negPct, neutral: metrics.neuPct },
        topics: getTopTopics(workingReviews),
        alerts: generateAlerts(metrics, clientConfig.name),
        comparison: {
            pre: {
                score: preMetrics.healthScore,
                rating: preMetrics.avgRating,
                positive: `${preMetrics.posPct}%`,
                mentions: `${preMetrics.mentionPct}%`,
                total: preMetrics.total
            },
            post: {
                score: postMetrics.healthScore,
                rating: postMetrics.avgRating,
                positive: `${postMetrics.posPct}%`,
                mentions: `${postMetrics.mentionPct}%`,
                total: postMetrics.total
            }
        },
        reviews: formatReviewsForFrontend(workingReviews.slice(0, 10))
    };
}

function generateDataJs(db) {
    const output = {};
    const allReviews = [];

    for (const [clientKey, clientData] of Object.entries(db.clients)) {
        const reviews = mergeReviews([], clientData.reviews)
            .map(review => ({ ...review, topic: normalizeTopic(review.topic) }));
        db.clients[clientKey].reviews = reviews;
        allReviews.push(...reviews);

        output[clientKey] = {
            general: buildContext(clientKey, reviews, 'general'),
            hito: buildContext(clientKey, reviews, 'hito')
        };
    }

    output.metadata = {
        generatedAt: new Date().toISOString(),
        totalReviews: allReviews.length,
        geminiClassified: allReviews.filter(r => r.classificationSource === 'gemini').length,
        heuristicClassified: allReviews.filter(r => r.classificationSource === 'heuristic').length,
        classificationErrors: allReviews.filter(r => r.classificationError).length,
        clients: Object.keys(config.clients)
    };

    const jsContent = `// Auto-generado por BrandPulse Ingest — ${new Date().toLocaleString('es-PE')}\n// NO editar manualmente. Este archivo se regenera cada vez que se ejecuta la ingesta.\n\nconst mockData = ${JSON.stringify(output, null, 4)};\n`;
    fs.writeFileSync(DATA_PATH, jsContent, 'utf-8');
    console.log(`📊 data.js regenerado: ${DATA_PATH}`);
}

// ─── Pipeline principal ──────────────────────────────────────────────────────

async function processClient(db, clientKey) {
    const client = config.clients[clientKey];
    console.log(`\n📱 Procesando: ${client.name}`);
    console.log('─'.repeat(50));

    const playReviews = await scrapePlayStore(clientKey);
    const appReviews = await scrapeAppStore(clientKey);
    const scraped = [...playReviews, ...appReviews];
    console.log(`  ✅ Descargadas: ${scraped.length} reseñas`);

    const existingReviews = db.clients[clientKey].reviews.map(review => normalizeReview(review, clientKey, review.source)).filter(Boolean);
    const existingKeys = new Set(existingReviews.map(buildReviewKey));
    const newReviews = scraped.filter(review => !existingKeys.has(buildReviewKey(review)));
    console.log(`  🆕 Nuevas no duplicadas: ${newReviews.length}`);

    let geminiCount = 0;
    let heuristicCount = 0;
    let errorCount = 0;

    for (let i = 0; i < newReviews.length; i++) {
        const review = newReviews[i];
        const classification = await classifyReview(review, clientKey);
        review.sentiment = classification.sentiment;
        review.topic = normalizeTopic(classification.topic);
        review.mention = Boolean(classification.mention);
        review.classificationSource = classification.classificationSource;
        review.classificationError = classification.classificationError;

        if (review.classificationSource === 'gemini') geminiCount++;
        else heuristicCount++;
        if (review.classificationError) errorCount++;

        if (config.useGemini && review.classificationSource === 'gemini') {
            await new Promise(resolve => setTimeout(resolve, 200));
        }
        if ((i + 1) % 10 === 0) console.log(`     ... ${i + 1}/${newReviews.length} reseñas procesadas`);
    }

    db.clients[clientKey].reviews = mergeReviews(existingReviews, newReviews);
    console.log(`  🤖 Clasificadas con Gemini: ${geminiCount}`);
    console.log(`  🧠 Clasificadas con heurística: ${heuristicCount}`);
    console.log(`  ⚠️  Errores de clasificación: ${errorCount}`);
    console.log(`  📦 Total acumulado: ${db.clients[clientKey].reviews.length} reseñas`);
}

async function runIngestion() {
    console.log('\n══════════════════════════════════════════════════════════');
    console.log('  BrandPulse — Ingesta Automática de Reseñas');
    console.log(`  ${new Date().toLocaleString('es-PE')}`);
    console.log('══════════════════════════════════════════════════════════\n');

    const db = loadDb();
    for (const clientKey of Object.keys(config.clients)) {
        try {
            await processClient(db, clientKey);
        } catch (error) {
            console.error(`  ⚠️  Error procesando ${clientKey}: ${error.message}`);
            logStoreError(clientKey, 'pipeline', error);
        }
    }

    saveDb(db);
    generateDataJs(db);

    console.log('\n══════════════════════════════════════════════════════════');
    console.log('  ✅ Ingesta completada');
    console.log('══════════════════════════════════════════════════════════\n');
}

module.exports = {
    runIngestion,
    loadDb,
    saveDb,
    normalizeReview,
    normalizeTopic,
    normalizeSentiment,
    buildReviewKey,
    mergeReviews,
    classifyWithGemini,
    classifyHeuristic,
    splitPrePostReviews,
    computeMetrics,
    generateDataJs
};

if (require.main === module) {
    runIngestion().catch(error => {
        console.error(error);
        process.exitCode = 1;
    });
}
