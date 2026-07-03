const fs = require('fs');
const path = require('path');
const config = require('./config');
const {
    loadDb,
    normalizeTopic,
    splitPrePostReviews,
    computeMetrics,
    buildReviewKey
} = require('./ingest');

function assert(condition, message) {
    if (!condition) throw new Error(message);
}

function validateConfig() {
    for (const clientKey of ['banbif', 'agora']) {
        const client = config.clients[clientKey];
        assert(client, `Falta cliente ${clientKey}`);
        assert(client.playStoreId, `Falta playStoreId en ${clientKey}`);
        assert(client.appStoreId, `Falta appStoreId en ${clientKey}`);
        assert(client.hitoDate, `Falta hitoDate en ${clientKey}`);
        assert(Array.isArray(client.hitoKeywords) && client.hitoKeywords.length, `Faltan hitoKeywords en ${clientKey}`);
    }
}

function validateMetrics() {
    const empty = computeMetrics([]);
    assert(empty.total === 0, 'computeMetrics([]) debe devolver total 0');
    assert(empty.healthScore === 0, 'computeMetrics([]) debe devolver healthScore 0');

    const reviews = [
        { rating: 5, sentiment: 'positive', mention: true, date: '2026-03-01T00:00:00.000Z' },
        { rating: 1, sentiment: 'negative', mention: false, date: '2026-03-20T00:00:00.000Z' }
    ];
    const metrics = computeMetrics(reviews);
    assert(metrics.total === 2, 'computeMetrics debe contar 2 reseñas');
    assert(metrics.posPct === 50, 'computeMetrics debe calcular 50% positivo');
    assert(metrics.negPct === 50, 'computeMetrics debe calcular 50% negativo');

    const split = splitPrePostReviews(reviews, '2026-03-15', 60, 30);
    assert(split.pre.length === 1, 'splitPrePostReviews debe separar pre correctamente');
    assert(split.post.length === 1, 'splitPrePostReviews debe separar post correctamente');
}

function validateDataset() {
    const dbPath = path.resolve(__dirname, config.dbPath);
    assert(fs.existsSync(dbPath), 'No existe reviews_db.json');

    const db = loadDb();
    const seen = new Set();

    for (const [clientKey, clientData] of Object.entries(db.clients)) {
        assert(config.clients[clientKey], `Cliente no configurado en dataset: ${clientKey}`);
        assert(Array.isArray(clientData.reviews), `reviews debe ser array en ${clientKey}`);

        for (const review of clientData.reviews) {
            assert(review.content && review.content.length >= 3, `Reseña sin content válido en ${clientKey}`);
            assert(review.rating >= 1 && review.rating <= 5, `Rating fuera de rango en ${clientKey}: ${review.rating}`);
            assert(['positive', 'neutral', 'negative'].includes(review.sentiment), `Sentiment inválido: ${review.sentiment}`);
            assert(config.validTopics.includes(normalizeTopic(review.topic)), `Topic inválido: ${review.topic}`);
            assert(typeof review.mention === 'boolean', `mention debe ser boolean en ${clientKey}`);
            assert(['gemini', 'heuristic'].includes(review.classificationSource), `classificationSource inválido: ${review.classificationSource}`);
            const key = buildReviewKey(review);
            assert(!seen.has(key), `Reseña duplicada detectada: ${review.id}`);
            seen.add(key);
        }
    }
}

function main() {
    validateConfig();
    validateMetrics();
    validateDataset();
    console.log('✅ Validación completada: configuración, métricas y dataset OK.');
}

if (require.main === module) {
    try {
        main();
    } catch (error) {
        console.error(`❌ Validación fallida: ${error.message}`);
        process.exit(1);
    }
}

module.exports = { main };
