import { logger } from './logger.js';
import { defineRoute, start } from './router.js';

const TEXTS = {
  welcome: 'Bienvenida',
  notFound: 'Ruta no encontrada',
};

function renderHome() {
  const app = document.getElementById('app');
  app.replaceChildren();
  const h1 = document.createElement('h1');
  h1.textContent = 'App B1';
  const p = document.createElement('p');
  p.textContent = TEXTS.welcome;
  app.append(h1, p);
}

function renderNotFound() {
  const app = document.getElementById('app');
  app.replaceChildren();
  const p = document.createElement('p');
  p.textContent = TEXTS.notFound;
  app.append(p);
}

defineRoute('', renderHome);
defineRoute('notFound', renderNotFound);

start();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch((err) => {
    logger.error('sw registration failed', err);
  });
}

logger.info('app bootstrap ok');
