// ═══════════════════════════════════════════════════════════════════════════════
// BrandPulse — Configuración de clientes y apps a monitorear
// ═══════════════════════════════════════════════════════════════════════════════

try {
    require('dotenv').config();
} catch (_) {
    // dotenv es opcional para permitir validaciones de sintaxis sin instalar dependencias.
}

const boolFromEnv = (value, fallback = false) => {
    if (value === undefined || value === null || value === '') return fallback;
    return String(value).toLowerCase() === 'true';
};

module.exports = {
    geminiApiKey: process.env.GEMINI_API_KEY || '',
    geminiModel: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
    useGemini: boolFromEnv(process.env.USE_GEMINI, true),
    runOnStart: boolFromEnv(process.env.RUN_ON_START, false),

    // Cuántas reseñas nuevas buscar por tienda en cada ejecución.
    reviewsPerStore: Number(process.env.REVIEWS_PER_STORE || 100),

    // Periodo de ejecución automática. Nota: */14 corre en días calendario 1, 15, 29, etc.
    cronSchedule: process.env.CRON_SCHEDULE || '0 9 */14 * *',

    // Ruta donde se guarda la base de datos JSON persistente.
    dbPath: '../prototype/reviews_db.json',

    // Topics válidos para la clasificación IA.
    validTopics: [
        'UX', 'Performance', 'Estabilidad', 'Seguridad', 'Soporte',
        'Features', 'Compatibilidad', 'Login', 'Transacciones',
        'Cashback', 'Pagos', 'Visual', 'Ahorro', 'Ecosistema'
    ],

    clients: {
        banbif: {
            name: 'BanBif',
            playStoreId: 'pe.com.banbif.pnappmobile',
            appStoreId: '6736497481',
            playStoreUrl: 'https://play.google.com/store/apps/details?id=pe.com.banbif.pnappmobile',
            appStoreUrl: 'https://apps.apple.com/pe/app/nueva-banbif-app/id6736497481',
            hitoDate: '2026-03-15',
            hitoTitle: 'Nueva BanBif App v3.0',
            hitoKeywords: [
                'nueva app', 'actualización', 'actualizaron', 'versión nueva',
                'rediseño', 'v3', 'nueva versión', 'cambió', 'cambiaron'
            ]
        },
        agora: {
            name: 'Agora',
            playStoreId: 'pe.indigital.tunki.user',
            appStoreId: '1478814349',
            playStoreUrl: 'https://play.google.com/store/apps/details?id=pe.indigital.tunki.user',
            appStoreUrl: 'https://apps.apple.com/pe/app/agora-ahorra-y-disfruta/id1478814349',
            hitoDate: '2026-04-01',
            hitoTitle: 'Integración oh! pay + Puntos Agora',
            hitoKeywords: [
                'oh! pay', 'puntos', 'nueva funcionalidad', 'integración',
                'actualización', 'actualizaron', 'cambió', 'nuevo diseño'
            ]
        }
    }
};
