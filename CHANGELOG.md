# Changelog

## [Unreleased]

### Sprint 1 — Esqueleto PWA

- Iconos PWA (192, 512, maskable, apple-touch, favicon).
- `manifest.json` instalable.
- CSS base con tema claro/oscuro automático (`prefers-color-scheme`).
- `logger.js` con niveles configurables vía `localStorage`.
- `router.js` basado en hash con ruta `notFound`.
- `app.js` de arranque, registra el Service Worker.
- `sw.js` con estrategia cache-first y limpieza de cachés antiguas.
- Verificado: instalación y funcionamiento offline en iOS y PC. Pendiente probar instalación en Android por falta de dispositivo.

### Sprint 2 — Carga y validación de contenido

- PapaParse vendorizado localmente (sin CDN).
- `csv-parser.js`: elimina BOM, detecta separador `,`/`;`, ignora filas comentadas.
- `validator.js`: valida filas y lotes de `reading.csv` (campos obligatorios, `examen`, `tipo`, `dificultad`, JSON de `preguntas`, rango de `answer`, IDs duplicados).
- `content-loader.js`: orquesta la carga de `reading.csv` + `version.txt`.
- Vista de diagnóstico `#/debug`.
- `content/reading.csv` inicial con 4 textos semilla (uno por tipo de ejercicio) y `content/reading.template.csv`.
- 12 tests unitarios en `tests/test.html`, verificados en verde.

### Sprint 3 — Store y motor de ejercicios (parte 1)

- `router.js`: soporte de rutas con parámetros (`:id`).
- `store.js`: `getSettings`/`saveSettings`, `getAttempts`/`appendAttempt` con `pruneAttempts` (límite 200, protegiendo la mejor nota por ejercicio), `clearAll`.
- `ui-components.js`: `button()` y `toast()`.
- `exercise-engine.js`: `startSession`/`computeScore` para `multiple_choice` y `true_false`.
- Vista `reading-exercise.js`: ejercicio completo desde `#/reading/:id`, guarda el intento y navega a `#/result/:id` (placeholder JSON hasta el Sprint 4). Maneja el caso de ejercicio inexistente.
- 16 tests unitarios en `tests/test.html`, verificados en verde.
- Verificado en producción: completar un ejercicio real y ver el resultado con score correcto.
