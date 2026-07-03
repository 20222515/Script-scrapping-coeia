const cron = require('node-cron');
const { runIngestion } = require('./ingest');
const config = require('./config');

console.log('══════════════════════════════════════════════════════════');
console.log('  BrandPulse — Scheduler de Ingesta Automática Iniciado');
console.log(`  Patrón Cron: ${config.cronSchedule}`);
console.log(`  RUN_ON_START: ${config.runOnStart}`);
console.log('══════════════════════════════════════════════════════════');

if (config.runOnStart) {
    console.log('\n▶️ Ejecutando ingesta inicial por RUN_ON_START=true...');
    runIngestion().catch(console.error);
} else {
    console.log('\n⏸️ Ingesta inicial omitida. Define RUN_ON_START=true para ejecutarla al arrancar.');
}

cron.schedule(config.cronSchedule, () => {
    console.log('\n⏰ Ejecutando tarea programada por Cron...');
    runIngestion().catch(console.error);
}, {
    scheduled: true,
    timezone: 'America/Lima'
});
