# app-b1-ingles

App de preparación al B1 de inglés (Cambridge PET / EOI), sin backend, servida como PWA estática.

En producción: https://b1ingles.diviferreiro.com

## Requisitos

- Un navegador moderno.
- Para clonar y editar: [GitHub Desktop](https://desktop.github.com/) o Git CLI.
- Node.js es opcional, solo hace falta si se ejecutan los tests con `node --test`.

## Clonar el repositorio

Con GitHub Desktop: File → Clone repository → `tupuzzledigital/app-b1-ingles`.

Con Git CLI:

```
git clone https://github.com/tupuzzledigital/app-b1-ingles.git
```

## Arrancar en local

Desde la raíz del repo, con Python instalado:

```
python -m http.server 8000
```

Y abrir `http://localhost:8000`. Alternativa: extensión "Live Server" de VS Code.

## Desplegar

El despliegue es automático: cualquier `push` a `main` se publica en GitHub Pages y queda disponible en `https://b1ingles.diviferreiro.com` en 1-2 minutos.
