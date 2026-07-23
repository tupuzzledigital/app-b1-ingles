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
