import { logger } from './logger.js';
import { defineRoute, go, start } from './router.js';
import { loadReading } from './content-loader.js';
import { getSettings } from './store.js';
import { renderHome } from './views/home.js';
import { renderOnboarding } from './views/onboarding.js';
import { renderList } from './views/reading-list.js';
import { renderExercise } from './views/reading-exercise.js';
import { renderResult } from './views/result.js';

const TEXTS = {
  notFound: 'Ruta no encontrada',
  debugTitle: 'Diagnóstico de contenido',
  debugVersion: 'Versión de contenido',
  debugValidItems: 'Items válidos',
  debugErrors: 'Errores',
  debugBack: 'Volver',
};

function appContainer() {
  return document.getElementById('app');
}

function renderNotFound() {
  const app = appContainer();
  app.replaceChildren();
  const p = document.createElement('p');
  p.textContent = TEXTS.notFound;
  app.append(p);
}

async function renderDebug() {
  const app = appContainer();
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

function renderHomeRoute() {
  if (!getSettings().exam) {
    go('onboarding');
    return;
  }
  renderHome(appContainer());
}

defineRoute('', renderHomeRoute);
defineRoute('onboarding', () => renderOnboarding(appContainer()));
defineRoute('debug', renderDebug);
defineRoute('reading', () => renderList(appContainer()));
defineRoute('reading/:id', (params) => renderExercise(appContainer(), params.id));
defineRoute('result/:id', (params) => renderResult(appContainer(), params.id));
defineRoute('notFound', renderNotFound);

start();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch((err) => {
    logger.error('sw registration failed', err);
  });
}

logger.info('app bootstrap ok');
