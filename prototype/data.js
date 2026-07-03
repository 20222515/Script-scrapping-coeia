// Auto-generado por BrandPulse Ingest — 3/7/2026, 8:53:20 p. m.
// NO editar manualmente. Este archivo se regenera cada vez que se ejecuta la ingesta.

const mockData = {
    "banbif": {
        "general": {
            "title": "Vista General",
            "date": "12 reseñas acumuladas",
            "metrics": [
                {
                    "label": "Health Score",
                    "value": "39/100",
                    "delta": "acumulado",
                    "type": "negative",
                    "tooltip": "Índice interno: 50% rating normalizado + 50% balance de sentimiento."
                },
                {
                    "label": "Avg Rating",
                    "value": "2.7",
                    "delta": "acumulado",
                    "type": "negative",
                    "tooltip": "Promedio de estrellas (1-5) en App Store y Google Play."
                },
                {
                    "label": "Total Reseñas",
                    "value": "12",
                    "delta": "total",
                    "type": "positive",
                    "tooltip": "Volumen total de reseñas procesadas en este contexto."
                },
                {
                    "label": "Menciones Cambio",
                    "value": "42%",
                    "delta": "acumulado",
                    "type": "positive",
                    "tooltip": "% de reseñas que mencionan cambios, actualizaciones o hitos."
                }
            ],
            "chartData": [
                {
                    "week": "Mar",
                    "pre": 43,
                    "post": null,
                    "rating": 2.8
                },
                {
                    "week": "Abr",
                    "pre": 25,
                    "post": null,
                    "rating": 2.5
                },
                {
                    "week": "May",
                    "pre": 41,
                    "post": null,
                    "rating": 2.6
                }
            ],
            "sentiment": {
                "positive": 33,
                "negative": 58,
                "neutral": 9
            },
            "topics": [
                {
                    "name": "UX",
                    "pct": 25,
                    "count": 3,
                    "rank": 1
                },
                {
                    "name": "Estabilidad",
                    "pct": 17,
                    "count": 2,
                    "rank": 2
                },
                {
                    "name": "Seguridad",
                    "pct": 17,
                    "count": 2,
                    "rank": 3
                }
            ],
            "alerts": [
                {
                    "title": "Health Score crítico (39)",
                    "desc": "El índice de BanBif está por debajo del umbral de 60 pts.",
                    "time": "Actual"
                },
                {
                    "title": "Alto % de negativos (58%)",
                    "desc": "Más del 40% de las reseñas son negativas.",
                    "time": "Actual"
                }
            ],
            "comparison": {
                "pre": {
                    "score": 0,
                    "rating": "0.0",
                    "positive": "0%",
                    "mentions": "0%",
                    "total": 0
                },
                "post": {
                    "score": 43,
                    "rating": "2.8",
                    "positive": "40%",
                    "mentions": "100%",
                    "total": 5
                }
            },
            "reviews": [
                {
                    "rating": 5,
                    "text": "Muy óptima para operaciones diarias. Las transferencias con Plin son instantáneas y el Face ID funciona perfecto.",
                    "sentiment": "positive",
                    "topic": "UX",
                    "mention": false,
                    "date": "15 May 2026",
                    "source": "App Store",
                    "url": "https://apps.apple.com/pe/app/nueva-banbif-app/id6736497481",
                    "classificationSource": "heuristic",
                    "classificationError": null
                },
                {
                    "rating": 1,
                    "text": "La app se cierra cada vez que intento abrirla. Ya la reinstalé y sigue igual. Tengo un Samsung A14 con Android 13.",
                    "sentiment": "negative",
                    "topic": "Estabilidad",
                    "mention": false,
                    "date": "12 May 2026",
                    "source": "Google Play",
                    "url": "https://play.google.com/store/apps/details?id=pe.com.banbif.pnappmobile",
                    "classificationSource": "heuristic",
                    "classificationError": null
                },
                {
                    "rating": 4,
                    "text": "Me gusta la función de Voicebank para hacer transferencias por voz. Innovador. Solo le falta mejorar la velocidad de carga.",
                    "sentiment": "positive",
                    "topic": "Features",
                    "mention": false,
                    "date": "10 May 2026",
                    "source": "App Store",
                    "url": "https://apps.apple.com/pe/app/nueva-banbif-app/id6736497481",
                    "classificationSource": "heuristic",
                    "classificationError": null
                },
                {
                    "rating": 2,
                    "text": "Me exigen cambiar configuraciones de seguridad del teléfono para que funcione. Muy intrusivo. Ningún otro banco me pide eso.",
                    "sentiment": "negative",
                    "topic": "Seguridad",
                    "mention": false,
                    "date": "8 May 2026",
                    "source": "Google Play",
                    "url": "https://play.google.com/store/apps/details?id=pe.com.banbif.pnappmobile",
                    "classificationSource": "heuristic",
                    "classificationError": null
                },
                {
                    "rating": 1,
                    "text": "Pésimo servicio. Llevo una semana sin poder entrar. Llamé a soporte y solo me dicen que resetee el celular. No soluciona nada.",
                    "sentiment": "negative",
                    "topic": "Soporte",
                    "mention": false,
                    "date": "3 May 2026",
                    "source": "Google Play",
                    "url": "https://play.google.com/store/apps/details?id=pe.com.banbif.pnappmobile",
                    "classificationSource": "heuristic",
                    "classificationError": null
                },
                {
                    "rating": 3,
                    "text": "La app funciona bien en general pero al consultar movimientos a veces se queda cargando por mucho tiempo.",
                    "sentiment": "neutral",
                    "topic": "Performance",
                    "mention": false,
                    "date": "25 Abr 2026",
                    "source": "Google Play",
                    "url": "https://play.google.com/store/apps/details?id=pe.com.banbif.pnappmobile",
                    "classificationSource": "heuristic",
                    "classificationError": null
                },
                {
                    "rating": 2,
                    "text": "Me dice que mi modelo de celular no es compatible. Tengo un Xiaomi Redmi Note 12 que es bastante actual. Absurdo.",
                    "sentiment": "negative",
                    "topic": "Compatibilidad",
                    "mention": false,
                    "date": "20 Abr 2026",
                    "source": "Google Play",
                    "url": "https://play.google.com/store/apps/details?id=pe.com.banbif.pnappmobile",
                    "classificationSource": "heuristic",
                    "classificationError": null
                },
                {
                    "rating": 5,
                    "text": "Excelente mejora. El token digital integrado es mucho más seguro que el anterior. Ya no tengo que esperar el SMS.",
                    "sentiment": "positive",
                    "topic": "Seguridad",
                    "mention": true,
                    "date": "21 Mar 2026",
                    "source": "App Store",
                    "url": "https://apps.apple.com/pe/app/nueva-banbif-app/id6736497481",
                    "classificationSource": "heuristic",
                    "classificationError": null
                },
                {
                    "rating": 1,
                    "text": "Actualizaron la app y ahora se cierra sola. No puedo ver mi estado de cuenta ni hacer transferencias. Ya reinstalé 3 veces.",
                    "sentiment": "negative",
                    "topic": "Estabilidad",
                    "mention": true,
                    "date": "18 Mar 2026",
                    "source": "Google Play",
                    "url": "https://play.google.com/store/apps/details?id=pe.com.banbif.pnappmobile",
                    "classificationSource": "heuristic",
                    "classificationError": null
                },
                {
                    "rating": 5,
                    "text": "La nueva versión se ve mucho más moderna. El reconocimiento facial es más rápido y las transferencias con Plin son instantáneas ahora.",
                    "sentiment": "positive",
                    "topic": "UX",
                    "mention": true,
                    "date": "17 Mar 2026",
                    "source": "App Store",
                    "url": "https://apps.apple.com/pe/app/nueva-banbif-app/id6736497481",
                    "classificationSource": "heuristic",
                    "classificationError": null
                }
            ]
        },
        "hito": {
            "title": "Nueva BanBif App v3.0",
            "date": "2026-03-15",
            "metrics": [
                {
                    "label": "Health Score",
                    "value": "43/100",
                    "delta": "hito",
                    "type": "negative",
                    "tooltip": "Índice interno: 50% rating normalizado + 50% balance de sentimiento."
                },
                {
                    "label": "Avg Rating",
                    "value": "2.8",
                    "delta": "hito",
                    "type": "negative",
                    "tooltip": "Promedio de estrellas (1-5) en App Store y Google Play."
                },
                {
                    "label": "Total Reseñas",
                    "value": "5",
                    "delta": "hito",
                    "type": "positive",
                    "tooltip": "Volumen total de reseñas procesadas en este contexto."
                },
                {
                    "label": "Menciones Cambio",
                    "value": "100%",
                    "delta": "hito",
                    "type": "positive",
                    "tooltip": "% de reseñas que mencionan cambios, actualizaciones o hitos."
                }
            ],
            "chartData": [
                {
                    "week": "Mar",
                    "pre": 43,
                    "post": 43,
                    "rating": 2.8
                },
                {
                    "week": "Abr",
                    "pre": null,
                    "post": 25,
                    "rating": 2.5
                },
                {
                    "week": "May",
                    "pre": null,
                    "post": 41,
                    "rating": 2.6
                }
            ],
            "sentiment": {
                "positive": 40,
                "negative": 60,
                "neutral": 0
            },
            "topics": [
                {
                    "name": "UX",
                    "pct": 40,
                    "count": 2,
                    "rank": 1
                },
                {
                    "name": "Seguridad",
                    "pct": 20,
                    "count": 1,
                    "rank": 2
                },
                {
                    "name": "Estabilidad",
                    "pct": 20,
                    "count": 1,
                    "rank": 3
                }
            ],
            "alerts": [
                {
                    "title": "Health Score crítico (43)",
                    "desc": "El índice de BanBif está por debajo del umbral de 60 pts.",
                    "time": "Actual"
                },
                {
                    "title": "Alto % de negativos (60%)",
                    "desc": "Más del 40% de las reseñas son negativas.",
                    "time": "Actual"
                }
            ],
            "comparison": {
                "pre": {
                    "score": 0,
                    "rating": "0.0",
                    "positive": "0%",
                    "mentions": "0%",
                    "total": 0
                },
                "post": {
                    "score": 43,
                    "rating": "2.8",
                    "positive": "40%",
                    "mentions": "100%",
                    "total": 5
                }
            },
            "reviews": [
                {
                    "rating": 5,
                    "text": "Excelente mejora. El token digital integrado es mucho más seguro que el anterior. Ya no tengo que esperar el SMS.",
                    "sentiment": "positive",
                    "topic": "Seguridad",
                    "mention": true,
                    "date": "21 Mar 2026",
                    "source": "App Store",
                    "url": "https://apps.apple.com/pe/app/nueva-banbif-app/id6736497481",
                    "classificationSource": "heuristic",
                    "classificationError": null
                },
                {
                    "rating": 1,
                    "text": "Actualizaron la app y ahora se cierra sola. No puedo ver mi estado de cuenta ni hacer transferencias. Ya reinstalé 3 veces.",
                    "sentiment": "negative",
                    "topic": "Estabilidad",
                    "mention": true,
                    "date": "18 Mar 2026",
                    "source": "Google Play",
                    "url": "https://play.google.com/store/apps/details?id=pe.com.banbif.pnappmobile",
                    "classificationSource": "heuristic",
                    "classificationError": null
                },
                {
                    "rating": 5,
                    "text": "La nueva versión se ve mucho más moderna. El reconocimiento facial es más rápido y las transferencias con Plin son instantáneas ahora.",
                    "sentiment": "positive",
                    "topic": "UX",
                    "mention": true,
                    "date": "17 Mar 2026",
                    "source": "App Store",
                    "url": "https://apps.apple.com/pe/app/nueva-banbif-app/id6736497481",
                    "classificationSource": "heuristic",
                    "classificationError": null
                },
                {
                    "rating": 2,
                    "text": "La nueva interfaz se ve bonita pero no encuentro dónde están las opciones que usaba antes. Cambiaron todo de lugar.",
                    "sentiment": "negative",
                    "topic": "UX",
                    "mention": true,
                    "date": "16 Mar 2026",
                    "source": "App Store",
                    "url": "https://apps.apple.com/pe/app/nueva-banbif-app/id6736497481",
                    "classificationSource": "heuristic",
                    "classificationError": null
                },
                {
                    "rating": 1,
                    "text": "Después de la actualización no puedo ingresar. Me pide cambiar configuraciones de seguridad del celular y aún así no funciona.",
                    "sentiment": "negative",
                    "topic": "Compatibilidad",
                    "mention": true,
                    "date": "16 Mar 2026",
                    "source": "Google Play",
                    "url": "https://play.google.com/store/apps/details?id=pe.com.banbif.pnappmobile",
                    "classificationSource": "heuristic",
                    "classificationError": null
                }
            ]
        }
    },
    "agora": {
        "general": {
            "title": "Vista General",
            "date": "10 reseñas acumuladas",
            "metrics": [
                {
                    "label": "Health Score",
                    "value": "42/100",
                    "delta": "acumulado",
                    "type": "negative",
                    "tooltip": "Índice interno: 50% rating normalizado + 50% balance de sentimiento."
                },
                {
                    "label": "Avg Rating",
                    "value": "2.7",
                    "delta": "acumulado",
                    "type": "negative",
                    "tooltip": "Promedio de estrellas (1-5) en App Store y Google Play."
                },
                {
                    "label": "Total Reseñas",
                    "value": "10",
                    "delta": "total",
                    "type": "positive",
                    "tooltip": "Volumen total de reseñas procesadas en este contexto."
                },
                {
                    "label": "Menciones Cambio",
                    "value": "50%",
                    "delta": "acumulado",
                    "type": "positive",
                    "tooltip": "% de reseñas que mencionan cambios, actualizaciones o hitos."
                }
            ],
            "chartData": [
                {
                    "week": "Abr",
                    "pre": 43,
                    "post": null,
                    "rating": 2.8
                },
                {
                    "week": "May",
                    "pre": 41,
                    "post": null,
                    "rating": 2.6
                }
            ],
            "sentiment": {
                "positive": 40,
                "negative": 60,
                "neutral": 0
            },
            "topics": [
                {
                    "name": "Cashback",
                    "pct": 20,
                    "count": 2,
                    "rank": 1
                },
                {
                    "name": "Transacciones",
                    "pct": 20,
                    "count": 2,
                    "rank": 2
                },
                {
                    "name": "Seguridad",
                    "pct": 20,
                    "count": 2,
                    "rank": 3
                }
            ],
            "alerts": [
                {
                    "title": "Health Score crítico (42)",
                    "desc": "El índice de Agora está por debajo del umbral de 60 pts.",
                    "time": "Actual"
                },
                {
                    "title": "Alto % de negativos (60%)",
                    "desc": "Más del 40% de las reseñas son negativas.",
                    "time": "Actual"
                }
            ],
            "comparison": {
                "pre": {
                    "score": 0,
                    "rating": "0.0",
                    "positive": "0%",
                    "mentions": "0%",
                    "total": 0
                },
                "post": {
                    "score": 43,
                    "rating": "2.8",
                    "positive": "40%",
                    "mentions": "100%",
                    "total": 5
                }
            },
            "reviews": [
                {
                    "rating": 5,
                    "text": "Excelente para pagar en plazaVea e Inkafarma. El cashback se acumula rápido y lo puedo usar en cualquier tienda del grupo.",
                    "sentiment": "positive",
                    "topic": "Cashback",
                    "mention": false,
                    "date": "14 May 2026",
                    "source": "Google Play",
                    "url": "https://play.google.com/store/apps/details?id=pe.indigital.tunki.user",
                    "classificationSource": "heuristic",
                    "classificationError": null
                },
                {
                    "rating": 1,
                    "text": "No me deja iniciar sesión desde hace 3 días. Ya reinstalé la app, limpié caché y nada. Mi dinero está ahí atrapado.",
                    "sentiment": "negative",
                    "topic": "Login",
                    "mention": false,
                    "date": "12 May 2026",
                    "source": "App Store",
                    "url": "https://apps.apple.com/pe/app/agora-ahorra-y-disfruta/id1478814349",
                    "classificationSource": "heuristic",
                    "classificationError": null
                },
                {
                    "rating": 4,
                    "text": "La cuenta Ahorra Más tiene una tasa de interés bastante buena comparada con otros bancos. La app funciona bien para transferencias.",
                    "sentiment": "positive",
                    "topic": "Ahorro",
                    "mention": false,
                    "date": "10 May 2026",
                    "source": "Google Play",
                    "url": "https://play.google.com/store/apps/details?id=pe.indigital.tunki.user",
                    "classificationSource": "heuristic",
                    "classificationError": null
                },
                {
                    "rating": 2,
                    "text": "Hice una recarga desde mi tarjeta BCP y el dinero no aparece en Agora. Ya pasaron 48 horas. El soporte solo me dice que espere.",
                    "sentiment": "negative",
                    "topic": "Transacciones",
                    "mention": false,
                    "date": "8 May 2026",
                    "source": "App Store",
                    "url": "https://apps.apple.com/pe/app/agora-ahorra-y-disfruta/id1478814349",
                    "classificationSource": "heuristic",
                    "classificationError": null
                },
                {
                    "rating": 1,
                    "text": "La seguridad es muy básica, solo una clave de 6 dígitos. Para una app que maneja dinero real debería tener biometría obligatoria.",
                    "sentiment": "negative",
                    "topic": "Seguridad",
                    "mention": false,
                    "date": "3 May 2026",
                    "source": "App Store",
                    "url": "https://apps.apple.com/pe/app/agora-ahorra-y-disfruta/id1478814349",
                    "classificationSource": "heuristic",
                    "classificationError": null
                },
                {
                    "rating": 5,
                    "text": "Pagué en Promart con puntos Agora por primera vez y fue increíble. Descuento aplicado al instante. Así sí vale la pena.",
                    "sentiment": "positive",
                    "topic": "Cashback",
                    "mention": true,
                    "date": "8 Abr 2026",
                    "source": "Google Play",
                    "url": "https://play.google.com/store/apps/details?id=pe.indigital.tunki.user",
                    "classificationSource": "heuristic",
                    "classificationError": null
                },
                {
                    "rating": 2,
                    "text": "Recargué S/200 desde mi tarjeta Interbank y el saldo no aparece en Agora. Ya mandé correo a sac@agora.pe y nadie responde.",
                    "sentiment": "negative",
                    "topic": "Transacciones",
                    "mention": true,
                    "date": "4 Abr 2026",
                    "source": "App Store",
                    "url": "https://apps.apple.com/pe/app/agora-ahorra-y-disfruta/id1478814349",
                    "classificationSource": "heuristic",
                    "classificationError": null
                },
                {
                    "rating": 1,
                    "text": "Me bloquearon la cuenta sin razón después de la actualización. No puedo acceder a mi dinero. Esto es gravísimo.",
                    "sentiment": "negative",
                    "topic": "Seguridad",
                    "mention": true,
                    "date": "3 Abr 2026",
                    "source": "Google Play",
                    "url": "https://play.google.com/store/apps/details?id=pe.indigital.tunki.user",
                    "classificationSource": "heuristic",
                    "classificationError": null
                },
                {
                    "rating": 1,
                    "text": "Desde que integraron oh! pay no puedo pagar con puntos en plazaVea. Me da error en el QR cada vez que lo intento.",
                    "sentiment": "negative",
                    "topic": "Pagos",
                    "mention": true,
                    "date": "3 Abr 2026",
                    "source": "Google Play",
                    "url": "https://play.google.com/store/apps/details?id=pe.indigital.tunki.user",
                    "classificationSource": "heuristic",
                    "classificationError": null
                },
                {
                    "rating": 5,
                    "text": "Al fin unificaron todo. Ahora puedo usar mis puntos Agora directo con oh! pay en Inkafarma. Muy práctico.",
                    "sentiment": "positive",
                    "topic": "Ecosistema",
                    "mention": true,
                    "date": "2 Abr 2026",
                    "source": "App Store",
                    "url": "https://apps.apple.com/pe/app/agora-ahorra-y-disfruta/id1478814349",
                    "classificationSource": "heuristic",
                    "classificationError": null
                }
            ]
        },
        "hito": {
            "title": "Integración oh! pay + Puntos Agora",
            "date": "2026-04-01",
            "metrics": [
                {
                    "label": "Health Score",
                    "value": "43/100",
                    "delta": "hito",
                    "type": "negative",
                    "tooltip": "Índice interno: 50% rating normalizado + 50% balance de sentimiento."
                },
                {
                    "label": "Avg Rating",
                    "value": "2.8",
                    "delta": "hito",
                    "type": "negative",
                    "tooltip": "Promedio de estrellas (1-5) en App Store y Google Play."
                },
                {
                    "label": "Total Reseñas",
                    "value": "5",
                    "delta": "hito",
                    "type": "positive",
                    "tooltip": "Volumen total de reseñas procesadas en este contexto."
                },
                {
                    "label": "Menciones Cambio",
                    "value": "100%",
                    "delta": "hito",
                    "type": "positive",
                    "tooltip": "% de reseñas que mencionan cambios, actualizaciones o hitos."
                }
            ],
            "chartData": [
                {
                    "week": "Abr",
                    "pre": 43,
                    "post": 43,
                    "rating": 2.8
                },
                {
                    "week": "May",
                    "pre": null,
                    "post": 41,
                    "rating": 2.6
                }
            ],
            "sentiment": {
                "positive": 40,
                "negative": 60,
                "neutral": 0
            },
            "topics": [
                {
                    "name": "Cashback",
                    "pct": 20,
                    "count": 1,
                    "rank": 1
                },
                {
                    "name": "Transacciones",
                    "pct": 20,
                    "count": 1,
                    "rank": 2
                },
                {
                    "name": "Seguridad",
                    "pct": 20,
                    "count": 1,
                    "rank": 3
                }
            ],
            "alerts": [
                {
                    "title": "Health Score crítico (43)",
                    "desc": "El índice de Agora está por debajo del umbral de 60 pts.",
                    "time": "Actual"
                },
                {
                    "title": "Alto % de negativos (60%)",
                    "desc": "Más del 40% de las reseñas son negativas.",
                    "time": "Actual"
                }
            ],
            "comparison": {
                "pre": {
                    "score": 0,
                    "rating": "0.0",
                    "positive": "0%",
                    "mentions": "0%",
                    "total": 0
                },
                "post": {
                    "score": 43,
                    "rating": "2.8",
                    "positive": "40%",
                    "mentions": "100%",
                    "total": 5
                }
            },
            "reviews": [
                {
                    "rating": 5,
                    "text": "Pagué en Promart con puntos Agora por primera vez y fue increíble. Descuento aplicado al instante. Así sí vale la pena.",
                    "sentiment": "positive",
                    "topic": "Cashback",
                    "mention": true,
                    "date": "8 Abr 2026",
                    "source": "Google Play",
                    "url": "https://play.google.com/store/apps/details?id=pe.indigital.tunki.user",
                    "classificationSource": "heuristic",
                    "classificationError": null
                },
                {
                    "rating": 2,
                    "text": "Recargué S/200 desde mi tarjeta Interbank y el saldo no aparece en Agora. Ya mandé correo a sac@agora.pe y nadie responde.",
                    "sentiment": "negative",
                    "topic": "Transacciones",
                    "mention": true,
                    "date": "4 Abr 2026",
                    "source": "App Store",
                    "url": "https://apps.apple.com/pe/app/agora-ahorra-y-disfruta/id1478814349",
                    "classificationSource": "heuristic",
                    "classificationError": null
                },
                {
                    "rating": 1,
                    "text": "Me bloquearon la cuenta sin razón después de la actualización. No puedo acceder a mi dinero. Esto es gravísimo.",
                    "sentiment": "negative",
                    "topic": "Seguridad",
                    "mention": true,
                    "date": "3 Abr 2026",
                    "source": "Google Play",
                    "url": "https://play.google.com/store/apps/details?id=pe.indigital.tunki.user",
                    "classificationSource": "heuristic",
                    "classificationError": null
                },
                {
                    "rating": 1,
                    "text": "Desde que integraron oh! pay no puedo pagar con puntos en plazaVea. Me da error en el QR cada vez que lo intento.",
                    "sentiment": "negative",
                    "topic": "Pagos",
                    "mention": true,
                    "date": "3 Abr 2026",
                    "source": "Google Play",
                    "url": "https://play.google.com/store/apps/details?id=pe.indigital.tunki.user",
                    "classificationSource": "heuristic",
                    "classificationError": null
                },
                {
                    "rating": 5,
                    "text": "Al fin unificaron todo. Ahora puedo usar mis puntos Agora directo con oh! pay en Inkafarma. Muy práctico.",
                    "sentiment": "positive",
                    "topic": "Ecosistema",
                    "mention": true,
                    "date": "2 Abr 2026",
                    "source": "App Store",
                    "url": "https://apps.apple.com/pe/app/agora-ahorra-y-disfruta/id1478814349",
                    "classificationSource": "heuristic",
                    "classificationError": null
                }
            ]
        }
    },
    "metadata": {
        "generatedAt": "2026-07-03T20:53:20.397Z",
        "totalReviews": 22,
        "geminiClassified": 0,
        "heuristicClassified": 22,
        "classificationErrors": 0,
        "clients": [
            "banbif",
            "agora"
        ]
    }
};
