# BrandPulse — Riesgos y Limitaciones

## 1. Restricciones de Scraping en Stores

### App Store (Apple)

| Riesgo | Severidad | Detalle |
|--------|-----------|---------|
| **Sin API oficial pública para reseñas** | Alta | Apple no ofrece una API pública de reseñas. La librería `app-store-scraper` usa el feed RSS público (`/rss/customerreviews/`), que tiene limitaciones. |
| **Límite de 500 reseñas por feed RSS** | Alta | El feed RSS de Apple devuelve un máximo de 500 reseñas recientes por país. No hay paginación más allá de ese límite. |
| **Sin filtro por versión en el feed** | Media | El feed RSS no permite filtrar por versión de app. La versión se extrae del campo de la reseña cuando está disponible, pero no siempre lo está. |
| **Cambios en la estructura del feed** | Media | Apple puede modificar el formato del feed RSS sin previo aviso. Requiere monitoreo y mantenimiento del parser. |
| **Bloqueo por IP** | Media | Scraping agresivo puede resultar en bloqueo temporal de IP. Mitigación: rate limiting de 1 req/2 seg + rotación de IPs si es necesario. |

**Mitigación**: 
- Usar App Store Connect API (requiere cuenta de desarrollador del cliente) como fuente primaria cuando esté disponible.
- El feed RSS como fallback.
- Implementar caché de 4 horas para evitar requests redundantes.
- Alertar si el scraper falla 3 veces consecutivas.

### Google Play Store

| Riesgo | Severidad | Detalle |
|--------|-----------|---------|
| **Scraping no oficial** | Alta | `google-play-scraper` hace scraping del sitio web de Google Play. No hay API pública oficial para reseñas. |
| **Rate limiting de Google** | Alta | Google implementa rate limiting agresivo. Más de 10 requests/minuto desde la misma IP puede resultar en bloqueo temporal o CAPTCHA. |
| **Cambios en el DOM de Play Store** | Media | Google actualiza la estructura HTML periódicamente, lo que puede romper el scraper. La librería se actualiza regularmente pero hay ventanas de inactividad. |
| **Paginación limitada** | Baja | Máximo ~5000 reseñas por consulta (150 páginas × ~40 reseñas). Suficiente para la mayoría de casos. |

**Mitigación**:
- Rate limiting estricto: máximo 2 requests/segundo con delays aleatorios (1-3 seg).
- Monitoreo de versión de `google-play-scraper` y actualización automática.
- Cola de retry con backoff exponencial (1s, 4s, 16s, 64s).
- Proxy rotation si el volumen de clientes supera 10 apps.

### Alternativas Futuras

| Alternativa | Viabilidad | Consideraciones |
|-------------|-----------|-----------------|
| **Google Play Developer API** | Viable con cuenta del cliente | Requiere que el cliente comparta acceso a su consola de Google Play. Provee reseñas con respuestas del desarrollador. |
| **App Store Connect API** | Viable con cuenta del cliente | Requiere que el cliente provea API key de App Store Connect. Acceso completo a reseñas y métricas. |
| **Data.ai / Sensor Tower / AppFollow** | Viable (de pago) | APIs comerciales con datos consolidados. Costo: $500-2000/mes dependiendo del plan. Eliminan el riesgo de scraping. |
| **AppFollow API** | Recomendada para MVP+ | API especializada en monitoreo de reseñas. Plan "Startup" desde $111/mes. Incluye webhooks, histórico y traducción. |

---

## 2. Sesgo de Reseñas

### El problema del "sesgo de autoselección"

| Tipo de sesgo | Impacto | Detalle |
|---------------|---------|---------|
| **Sesgo de extremos** | Alto | Los usuarios que escriben reseñas tienden a ser los más satisfechos (5★) o los más insatisfechos (1★). La "mayoría silenciosa" (3-4★) está subrepresentada. |
| **Sesgo de recencia** | Medio | Usuarios tienden a escribir reseñas inmediatamente después de una experiencia extrema, no después de uso continuado estable. |
| **Sesgo de volumen** | Alto | Solo ~1-3% de usuarios activos escriben reseñas. Para una app con 500K usuarios activos, las ~500 reseñas representan ~0.1% de la base. |
| **Sesgo de plataforma** | Medio | Usuarios de Android escriben ~3x más reseñas que iOS para apps bancarias en Latinoamérica. El perfil demográfico difiere entre plataformas. |
| **Sesgo cultural** | Bajo | En mercados hispanos, las reseñas tienden a ser más emocionales y menos detalladas que en mercados anglosajones. |

### Mitigaciones implementadas en BrandPulse

1. **Indicador de representatividad**: Cada reporte incluye el ratio reseñas/usuarios activos (cuando el cliente provee MAU) para contextualizar las conclusiones.
2. **Distribución de ratings**: Siempre mostrar la distribución completa 1-5★, no solo el promedio, para visualizar el sesgo de extremos.
3. **Disclaimer en reportes**: Todo resumen ejecutivo incluye: "Este análisis se basa en las reseñas públicas de la tienda de aplicaciones, que representan una fracción autoseleccionada de la base de usuarios."
4. **Normalización por volumen**: Health Score pondera por volumen relativo, no absoluto — una semana con 5 reseñas negativas de 10 totales pesa más que una con 50 negativas de 500.
5. **Comparación temporal, no absoluta**: La plataforma enfatiza deltas y tendencias (comparación con período anterior) sobre valores absolutos.

---

## 3. Latencia entre Evento de Marca y Reacción en Reseñas

### Patrón temporal observado

```
Intensidad de reacción en reseñas

100% |    ╭╮
     |   ╱  ╲
 75% |  ╱    ╲
     | ╱      ╲
 50% |╱        ╲
     │          ╲
 25% |           ╲────────────
     |                        ─────────
  0% └──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──
     Hito D3  S1  S2  S3  S4  S5  S6  S7  S8

D = Día, S = Semana
```

| Ventana | Comportamiento | Riesgo |
|---------|---------------|--------|
| **Día 1-3** | Pico de reacciones iniciales (early adopters, usuarios más activos). Alta carga emocional. | Sobrerreacción: decisiones basadas en primeras reseñas que no representan la tendencia. |
| **Semana 1-2** | Mayor volumen de reseñas. Usuarios casuales empiezan a notar el cambio. | Volumen alto puede saturar la cola de procesamiento LLM. |
| **Semana 3-4** | Volumen normalizado. Mezcla de adaptación + fricción residual. | Riesgo de "falsa recuperación": si se observa mejora, puede ser simplemente menor volumen de quejas, no satisfacción real. |
| **Semana 5-8** | Reseñas de usuarios que se adaptaron. Feedback más racional. | Los usuarios más insatisfechos ya migraron a la competencia — sesgo de supervivencia. |
| **Mes 3+** | Estado estable. Reseñas reflejan la experiencia normalizada. | Si el problema persiste, las reseñas lo reflejarán de forma crónica. |

### Mitigaciones implementadas

1. **No generar reportes ejecutivos antes del día 7**: Las conclusiones de los primeros 3 días son demasiado volátiles para presentar al cliente.
2. **Bandas de confianza**: Las primeras 2 semanas muestran bandas de incertidumbre más amplias en los gráficos.
3. **Alerta de "muestra insuficiente"**: Si el período tiene <30 reseñas, el dashboard muestra un banner: "Muestra insuficiente para conclusiones robustas".
4. **Periodos de comparación ajustados**: La comparativa pre/post usa el mismo número de días en ambos lados del hito para evitar sesgos de ventana.

---

## 4. Límites de Contexto del LLM en Análisis Masivo

### Contexto técnico

| Modelo | Contexto máximo | Tokens de entrada efectivos | Costo por 1M tokens (input) |
|--------|-----------------|---------------------------|---------------------------|
| GPT-4o | 128K tokens | ~100K tokens (dejando margen) | $2.50 |
| GPT-4o-mini | 128K tokens | ~100K tokens | $0.15 |
| text-embedding-3-small | 8,191 tokens | 8K | $0.02 |

### Limitaciones y mitigaciones

| Limitación | Impacto | Mitigación |
|-----------|---------|------------|
| **Batch de clustering limitado** | Un batch de 20 reseñas (~3K tokens) es manejable. 100+ reseñas en un solo batch reduce la calidad de clasificación. | Batches fijos de 20 reseñas. Clustering consolidado post-procesamiento. |
| **Resumen ejecutivo con mucho contexto** | Un resumen mensual puede requerir agregar datos de 500+ reseñas. Pasar todas las reseñas sería ~75K tokens. | Pre-agregar métricas numéricas + pasar solo 10-15 reseñas representativas (seleccionadas por diversidad de topic + sentimiento). |
| **Consistencia entre batches** | Diferentes batches de 20 reseñas pueden clasificarse con criterios ligeramente distintos (el LLM no tiene memoria entre llamadas). | Categorías fijas predefinidas (no generativas). Prompt con definiciones explícitas de cada categoría. Post-procesamiento de normalización. |
| **Alucinaciones en resúmenes** | El LLM puede inventar datos o exagerar tendencias si el contexto no es claro. | Resumen ejecutivo recibe SOLO datos numéricos pre-calculados (no texto libre). El LLM redacta sobre datos, no los genera. |
| **Costo a escala** | 50K reseñas/mes × $0.003/reseña = $150/mes. 500K reseñas/mes = $1,500/mes. | Tier de modelo por volumen: >10K reseñas/mes → GPT-4o-mini para sentimiento individual, GPT-4o solo para resúmenes. |
| **Latencia de procesamiento** | GPT-4o: ~2-3 seg/reseña. 500 reseñas = ~20 min. | Procesamiento asíncrono con cola BullMQ. Workers paralelos (hasta 5 concurrentes respetando rate limits de OpenAI). |
| **Rate limits de OpenAI** | Tier 5: 10K RPM, 12M TPM. Tier 1 (nuevo): 500 RPM, 200K TPM. | Implementar rate limiter propio alineado al tier contratado. Escalar tier con OpenAI según necesidad. |

### Estimación de costos por escenario

| Escenario | Reseñas/mes | Costo LLM/mes | Modelo |
|-----------|------------|---------------|--------|
| MVP (2 clientes, 4 apps) | ~2,000 | ~$6 | GPT-4o |
| Growth (10 clientes, 20 apps) | ~15,000 | ~$45 | GPT-4o |
| Scale (50 clientes, 100 apps) | ~100,000 | ~$150 (mix) | GPT-4o (resúmenes) + GPT-4o-mini (sentimiento) |
| Enterprise (200+ clientes) | ~500,000 | ~$500 (mix) | GPT-4o-mini (bulk) + GPT-4o (resúmenes) |

---

## 5. Otros Riesgos

### Legales y de Compliance

| Riesgo | Severidad | Mitigación |
|--------|-----------|------------|
| **Términos de servicio de stores** | Alta | El scraping de reseñas públicas de Google Play y App Store es una zona gris legal. Las reseñas son contenido público, pero el scraping puede violar ToS. | 
| **GDPR / Protección de datos** | Media | Las reseñas contienen pseudónimos de usuarios. No se recopila PII directamente, pero se almacenan nombres de autor de la reseña. Evaluar si aplica derecho al olvido. |
| **Propiedad intelectual** | Baja | Las reseñas son propiedad de los usuarios, no de la store. El uso analítico (no republicación) es generalmente aceptable. |

**Recomendación**: Para el MVP, el scraping público es aceptable. Para producción, migrar a APIs oficiales (App Store Connect + Google Play Developer API) requiriendo credenciales del cliente.

### Operativos

| Riesgo | Severidad | Mitigación |
|--------|-----------|------------|
| **Dependencia de OpenAI** | Alta | Si OpenAI tiene downtime o cambia precios, el pipeline se detiene. | Implementar fallback a Azure OpenAI Service (mismo modelo, diferente endpoint). |
| **Calidad del análisis en español** | Media | GPT-4o maneja español correctamente, pero slang regional peruano ("chévere", "al toque", "asu") puede reducir precisión. | Incluir ejemplos de slang en los prompts + glosario de términos regionales. |
| **Mantenimiento de scrapers** | Media | Los scrapers pueden romperse sin previo aviso cuando las stores actualizan su frontend. | Monitoreo con alertas: si un scraper falla >3 veces en 24h, notificar al equipo de mantenimiento. |
| **Escalabilidad del equipo** | Baja | Solo 1-2 personas pueden operar la plataforma inicialmente. | Documentación operativa completa + runbooks para incidentes comunes. |
