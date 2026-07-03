# BrandPulse — Casos de Análisis Simulados

## Caso A: BanBif — Migración de App Bancaria

### Contexto

BanBif es un banco peruano que migró su aplicación móvil a una nueva versión (v3.0) el **15 de marzo de 2026**. La migración incluyó:
- Rediseño completo de la interfaz (UX/UI)
- Nuevo motor de pagos y transferencias
- Autenticación biométrica (huella y rostro)
- Nuevo onboarding para clientes existentes
- Migración forzada: la versión anterior dejó de funcionar el día del lanzamiento

### Dimensiones de Análisis

| Dimensión | Indicadores monitoreados |
|-----------|------------------------|
| **UX** | Facilidad de navegación, curva de aprendizaje, accesibilidad de funciones clave |
| **Performance** | Estabilidad (crashes), velocidad de carga, consumo de recursos |
| **Features** | Funciones mantenidas vs. eliminadas, nuevas funcionalidades |
| **Trust** | Percepción de seguridad, confianza en transacciones, biometría |
| **Onboarding** | Migración de cuenta, primera sesión, configuración inicial |

### Métricas Simuladas: Primeros 30 Días (15 Mar — 14 Abr 2026)

| Métrica | PRE (60d antes) | POST Día 1-30 | Delta |
|---------|-----------------|---------------|-------|
| Total reseñas | 267 | 312 | +17% |
| Rating promedio | 4.1 | 3.4 | -0.7 |
| Health Score | 72 | 58 | -14 pts |
| % Positivas | 62% | 38% | -24pp |
| % Negativas | 18% | 41% | +23pp |
| % Neutras | 20% | 21% | +1pp |
| Menciones al cambio | 2% | 34% | +32pp |
| Reviews/día promedio | 4.5 | 10.4 | +131% |

#### Distribución Temática (POST 30d)

| Topic | % del total | Sentimiento predominante | Reseña representativa |
|-------|------------|------------------------|----------------------|
| UX | 31% | 78% negativo | "No encuentro dónde hacer transferencias, antes estaba en la pantalla principal" |
| Performance | 22% | 85% negativo | "La app se cierra sola cada vez que veo mi estado de cuenta" |
| Features | 18% | 71% negativo | "Quitaron el acceso rápido a transferencias. ¿Por qué eliminan lo que funcionaba?" |
| Trust | 15% | 82% positivo | "Lo bueno es que ahora tiene huella digital, me siento más seguro" |
| Onboarding | 10% | 67% negativo | "Me tomó 20 minutos configurar la app de nuevo. Tuve que ir al banco." |
| Support | 4% | 90% negativo | "Llamé al banco y no saben explicar cómo usar la nueva app" |

#### Hallazgos Hipotéticos

1. **Pico de insatisfacción en Semana 1**: 68% de reseñas negativas (día 1-7), bajando a 35% en Semana 4 — curva de adaptación típica.
2. **Crash en Android 11**: 47 reseñas mencionan crashes específicos en dispositivos con Android 11 o inferior al consultar estados de cuenta.
3. **Biometría como ancla positiva**: De las 119 reseñas positivas del período, 47 (39%) mencionan la autenticación biométrica como mejora valorada.
4. **Efecto "funciones perdidas"**: 56 reseñas (18%) reclaman funciones que existían en v2.x y fueron eliminadas o reubicadas. Las más mencionadas: transferencias rápidas (23 menciones), pago de servicios en 1 clic (17 menciones), widget de saldo (16 menciones).
5. **Onboarding deficiente**: 31 usuarios reportan haber necesitado ir físicamente al banco para completar la migración de su cuenta.

### Métricas Simuladas: Días 31-60 (15 Abr — 14 May 2026)

| Métrica | POST Día 1-30 | POST Día 31-60 | Delta |
|---------|---------------|----------------|-------|
| Total reseñas | 312 | 198 | -37% |
| Rating promedio | 3.4 | 3.7 | +0.3 |
| Health Score | 58 | 65 | +7 pts |
| % Positivas | 38% | 49% | +11pp |
| % Negativas | 41% | 30% | -11pp |
| Menciones al cambio | 34% | 19% | -15pp |

#### Hallazgos del Período

1. **Estabilización**: El volumen de reseñas vuelve a niveles normales. La "crisis de adaptación" se disipa.
2. **Hotfix v3.1 (semana 5)**: BanBif lanzó una actualización que corrigió crashes en Android 11 y reintrodujo el acceso rápido a transferencias. Impacto visible: +0.3 en rating promedio en los 5 días posteriores.
3. **Shift temático**: UX baja del 31% al 18% de menciones negativas. Performance baja del 22% al 9%. Trust sube al 22% de menciones positivas.
4. **Usuarios "convertidos"**: 23 reseñas incluyen frases como "al principio no me gustó pero ya me acostumbré" — señal de adaptación activa.

### Métricas Simuladas: Días 61-90 (15 May — 13 Jun 2026)

| Métrica | POST Día 31-60 | POST Día 61-90 | Delta |
|---------|----------------|----------------|-------|
| Total reseñas | 198 | 156 | -21% |
| Rating promedio | 3.7 | 4.0 | +0.3 |
| Health Score | 65 | 71 | +6 pts |
| % Positivas | 49% | 58% | +9pp |
| % Negativas | 30% | 22% | -8pp |
| Menciones al cambio | 19% | 8% | -11pp |

#### Hallazgos del Período

1. **Recuperación casi completa**: Health Score a 1 punto del baseline pre-migración (72). Rating a 0.1 del baseline (4.1).
2. **Nueva normalidad**: Solo 8% de reseñas mencionan el cambio. La migración dejó de ser tema.
3. **Topics positivos emergentes**: "Diseño moderno" (14% positivas), "rapidez" (12% positivas) — features de la v3 empiezan a valorarse.
4. **Riesgo residual**: 7% de reseñas aún mencionan funciones eliminadas que no fueron reintroducidas (widget de saldo, pago de servicios rápido).

### Curva de Impacto (Visualización)

```
Health Score
100 |
 90 |
 80 |  ████████████████
 72 |──────────────────╮                                              ███
 70 |                   ╲                                        ████
 65 |                    ╲                              ████████
 60 |                     ╲                        ████
 58 |                      ╲██████████████████████
 50 |                       
 40 |
    └────────────────────┼──────────────────┼──────────────────┼────────
    -60d                 HITO              +30d               +60d    +90d
                      15 Mar 2026
```

---

## Caso B: Agora — Rebranding Corporativo Completo

### Contexto

Agora es una empresa de retail (supermercados/marketplaces) que realizó un **rebranding corporativo completo** el **1 de abril de 2026**. El cambio incluyó:
- Nuevo nombre comercial (previamente "AgoraMarket" → ahora "Agora")
- Nuevo logotipo e identidad visual
- Nuevos colores corporativos en toda la app
- Actualización del nombre y screenshots en las stores
- Campaña de comunicación en redes sociales y tiendas físicas

### Dimensiones de Percepción a Monitorear

| Dimensión | Qué medir | Por qué importa |
|-----------|-----------|-----------------|
| **Reconocimiento** | ¿Los usuarios reconocen que es la misma app? | Un rebranding puede causar confusión y desinstalaciones |
| **Afinidad visual** | ¿Gusta el nuevo diseño/logo/colores? | Primera impresión emocional con la nueva identidad |
| **Continuidad funcional** | ¿La app sigue funcionando igual? | Miedo a que "cambio visual = cambio funcional" |
| **Confianza** | ¿Se mantiene la confianza en la marca? | Riesgo de percepción de empresa "inestable" |
| **Diferenciación** | ¿La nueva marca se percibe como mejor/diferente? | ROI del rebranding |

### Indicadores de Éxito de la Nueva Identidad

| Indicador | Meta a 90 días | Cómo medirlo en BrandPulse |
|-----------|---------------|---------------------------|
| Reconocimiento de marca | <5% reseñas de confusión post-día 30 | % reseñas con menciones tipo "no reconozco", "¿es la misma app?" |
| Afinidad visual positiva | >60% sentimiento positivo en topic VISUAL_IDENTITY | Filtro por topic + sentimiento |
| Health Score estable | Caída máxima de 8 puntos vs baseline | Health Score semanal |
| Rating estable | Caída máxima de 0.3 vs baseline | Rating promedio semanal |
| Engagement positivo con nueva marca | >20% reseñas que mencionan "nuevo" con sentimiento positivo | Detección de menciones + sentimiento |

### Señales de Alerta Temprana

| Señal | Umbral | Acción recomendada |
|-------|--------|-------------------|
| Confusión de identidad | >10% reseñas mencionan "no reconozco la app" | Reforzar comunicación in-app sobre el cambio |
| Desinstalaciones percibidas | >5% reseñas dicen "pensé que era otra app y la borré" | Push notification explicativa + ASO update |
| Rechazo visual | >40% de topic VISUAL_IDENTITY es negativo | A/B testing de elementos visuales, considerar ajustes |
| Caída de confianza | Health Score cae >15 puntos | Comunicado oficial + atención al cliente proactiva |
| Nostalgia por marca anterior | >15% reseñas con "antes era mejor", "prefería el logo anterior" | Plan de transición visual gradual |

### Métricas Simuladas: Primeros 30 Días (1 Abr — 30 Abr 2026)

| Métrica | PRE (60d antes) | POST Día 1-30 | Delta |
|---------|-----------------|---------------|-------|
| Total reseñas | 189 | 234 | +24% |
| Rating promedio | 4.3 | 4.0 | -0.3 |
| Health Score | 78 | 72 | -6 pts |
| % Positivas | 68% | 55% | -13pp |
| % Negativas | 12% | 24% | +12pp |
| Menciones al cambio de marca | 1% | 42% | +41pp |
| Menciones positivas al cambio | — | 58% | — |
| Menciones negativas al cambio | — | 31% | — |

#### Distribución Temática (POST 30d)

| Topic | % del total | Sentimiento predominante | Reseña representativa |
|-------|------------|------------------------|----------------------|
| Visual Identity | 38% | 58% positivo | "El nuevo logo me gusta, se ve más profesional y limpio" |
| UX | 22% | 45% negativo | "Cambió la app entera? No encuentro mis favoritos guardados" |
| Trust | 15% | 73% positivo | "Me preocupé cuando vi el nombre nuevo, pero todo funciona igual" |
| Features | 12% | 50/50 | "Ojalá con el cambio de imagen también mejoren las promociones" |
| Performance | 8% | 60% negativo | "Desde la actualización tarda más en cargar" |
| Other | 5% | neutro | "¿Agora y AgoraMarket son lo mismo?" |

#### Hallazgos Hipotéticos del Período

1. **Confusión inicial controlada**: 11% de reseñas en semana 1 expresan confusión ("¿es la misma app?", "¿me descargué otra app?"). Baja a 3% en semana 4 — dentro de umbral aceptable.
2. **Polarización visual**: De las 89 reseñas sobre identidad visual, 52 (58%) son positivas ("moderno", "profesional", "elegante") y 28 (31%) son negativas ("genérico", "pierden identidad", "antes era más colorido"). Las negativas se concentran en usuarios con >2 años de antigüedad.
3. **Funcionalidad intacta = confianza**: 35 reseñas mencionan explícitamente alivio de que "la app sigue funcionando igual" — señal de que la comunicación del cambio fue parcialmente efectiva.
4. **Oportunidad de comunicación**: 18 reseñas preguntan explícitamente "¿por qué el cambio?" — oportunidad para un comunicado in-app que explique la visión detrás del rebranding.
5. **Impacto en ASO**: Rating promedio en la store bajó 0.3 puntos. Si bien menor a la caída de BanBif (-0.7), conviene monitorear porque los nuevos screenshots y descripción de la store podrían estar atrayendo un perfil diferente de usuario.

### Métricas Simuladas: Días 31-60 (1 May — 30 May 2026)

| Métrica | POST Día 1-30 | POST Día 31-60 | Delta |
|---------|---------------|----------------|-------|
| Total reseñas | 234 | 178 | -24% |
| Rating promedio | 4.0 | 4.2 | +0.2 |
| Health Score | 72 | 76 | +4 pts |
| % Positivas | 55% | 63% | +8pp |
| % Negativas | 24% | 17% | -7pp |
| Menciones al cambio | 42% | 22% | -20pp |
| Confusión de identidad | 3% | <1% | -2pp |

#### Hallazgos del Período

1. **Adaptación completada**: La confusión de identidad es prácticamente nula. Usuarios internalizaron el nuevo nombre.
2. **Visual Identity se vuelve positivo**: 71% de menciones de identidad visual son ahora positivas vs 58% en el período anterior.
3. **Efecto halo del rebranding**: 14 reseñas mencionan que la app "se siente más premium" o "más seria" — el rebranding elevó la percepción de calidad sin cambios funcionales.
4. **Topic emergente**: "Promociones" aparece como nuevo topic negativo (8%) — usuarios esperaban que el rebranding viniera acompañado de mejoras en ofertas.

### Métricas Simuladas: Días 61-90 (31 May — 29 Jun 2026)

| Métrica | POST Día 31-60 | POST Día 61-90 | Delta |
|---------|----------------|----------------|-------|
| Total reseñas | 178 | 152 | -15% |
| Rating promedio | 4.2 | 4.4 | +0.2 |
| Health Score | 76 | 80 | +4 pts |
| % Positivas | 63% | 70% | +7pp |
| % Negativas | 17% | 13% | -4pp |
| Menciones al cambio | 22% | 7% | -15pp |

#### Hallazgos del Período

1. **Superación del baseline**: Health Score (80) supera el baseline pre-rebranding (78) por primera vez. El rebranding fue exitoso.
2. **Rating récord**: 4.4 es el rating más alto registrado — el rebranding elevó la percepción general.
3. **Nueva identidad consolidada**: Solo 7% menciona el cambio, y de esas, 78% son positivas.
4. **ROI del rebranding**: La percepción de "marca premium" se instaló. 23% de reseñas positivas usan adjetivos como "profesional", "moderno", "de confianza" — un aumento de 15pp vs el período pre.

### Comparativa de Curvas: BanBif vs Agora

```
Health Score
100 |
 80 |──Agora──╮                     ╭──────────Agora (superó baseline)
 78 |          ╲               ╭───╯
 72 |──BanBif──╲──────╮  ╭───╯─────────────BanBif (casi recuperó)
 70 |           ╲      ╲╱
 65 |            ╲    ╱╲
 60 |             ╲  ╱   BanBif recuperando
 58 |              ╲╱
 50 |              Agora: caída moderada (rebranding)
    |              BanBif: caída profunda (migración funcional)
    └──────────────┼──────────────┼──────────────┼────────
                  HITO          +30d            +60d     +90d

Conclusión: El rebranding (cambio de identidad) genera menor impacto negativo
que la migración funcional (cambio de experiencia), pero ambos siguen la misma
curva de recuperación en forma de "U" con estabilización entre 60-90 días.
```

---

## Resumen Comparativo de Ambos Casos

| Dimensión | BanBif (Migración) | Agora (Rebranding) |
|-----------|-------------------|-------------------|
| **Caída máxima Health Score** | -14 pts (severa) | -6 pts (moderada) |
| **Caída máxima Rating** | -0.7 (severa) | -0.3 (moderada) |
| **Pico de menciones al cambio** | 34% | 42% |
| **Tiempo de recuperación** | ~75 días | ~50 días |
| **Topic #1 negativo** | UX (funcional) | Visual Identity (emocional) |
| **Topic #1 positivo** | Trust/biometría | Imagen premium |
| **¿Superó el baseline?** | No (a 1 punto) | Sí (+2 puntos) |
| **Tipo de insatisfacción** | Funcional y técnica | Emocional y perceptual |
| **Riesgo principal** | Pérdida de funcionalidad | Pérdida de reconocimiento |
| **Acción correctiva clave** | Hotfix + reintroducir features | Comunicación del "por qué" |
