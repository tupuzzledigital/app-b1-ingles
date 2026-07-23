import { logger } from './logger.js';
import { defineRoute, start } from './router.js';
import { loadReading } from './content-loader.js';
import { getAttempts } from './store.js';
import { renderExercise } from './views/reading-exercise.js';

const TEXTS = {
  welcome: 'Bienvenida',
  notFound: 'Ruta no encontrada',
  debugTitle: 'Diagnóstico de contenido',
  debugVersion: 'Versión de contenido',
  debugValidItems: 'Items válidos',
  debugErrors: 'Errores',
  debugBack: 'Volver',
  resultTitle: 'Resultado (provisional)',
  resultNotFound: 'Intento no encontrado',
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

async function renderDebug() {
  const app = document.getElementById('app');
  app.replaceChildren();

  const h1 = document.createElement('h1');
  h1.textContent = TEXTS.debugTitle;
  app.append(h1);

  const { items, errors, version } = await loadReading();

  const versionP = document.createElement('p');
  versionP.textContent = `${TEXTS.debugVersion}: ${version}`;
  app.append(versionP);

  const itemsP = document.createElement('p');
  itemsP.textContent = `${TEXTS.debugValidItems}: ${items.length}`;
  app.append(itemsP);

  const errorsP = document.createElement('p');
  errorsP.textContent = `${TEXTS.debugErrors}: ${errors.length}`;
  app.append(errorsP);

  if (errors.length > 0) {
    const ul = document.createElement('ul');
    errors.slice(0, 5).forEach((error) => {
      const li = document.createElement('li');
      li.textContent = error;
      ul.append(li);
    });
    app.append(ul);
  }

  const backLink = document.createElement('a');
  backLink.href = '#/';
  backLink.textContent = TEXTS.debugBack;
  app.append(backLink);
}

function renderResultPlaceholder(params) {
  const app = document.getElementById('app');
  app.replaceChildren();

  const attempt = getAttempts().find((a) => a.id === params.id);

  const h1 = document.createElement('h1');
  h1.textContent = TEXTS.resultTitle;
  app.append(h1);

  const pre = document.createElement('pre');
  pre.textContent = attempt ? JSON.stringify(attempt.result, null, 2) : TEXTS.resultNotFound;
  app.append(pre);

  const backLink = document.createElement('a');
  backLink.href = '#/';
  backLink.textContent = TEXTS.debugBack;
  app.append(backLink);
}

defineRoute('', renderHome);
defineRoute('debug', renderDebug);
defineRoute('reading/:id', (params) => {
  renderExercise(document.getElementById('app'), params.id);
});
defineRoute('result/:id', renderResultPlaceholder);
defineRoute('notFound', renderNotFound);

start();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch((err) => {
    logger.error('sw registration failed', err);
  });
}

logger.info('app bootstrap ok');
