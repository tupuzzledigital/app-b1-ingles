import { logger } from './logger.js';

const routes = new Map();
let notFoundHandler = () => logger.warn('router: no notFound handler registered');

export function defineRoute(path, handler) {
  if (path === 'notFound') {
    notFoundHandler = handler;
    return;
  }
  routes.set(path, handler);
}

export function go(path) {
  location.hash = `#/${path.replace(/^\/+/, '')}`;
}

function currentPath() {
  const hash = location.hash.replace(/^#\/?/, '');
  return hash;
}

function handleNavigation() {
  const path = currentPath();
  const handler = routes.get(path);
  if (handler) {
    handler();
    return;
  }
  notFoundHandler();
}

window.addEventListener('hashchange', handleNavigation);

export function start() {
  if (!location.hash) {
    location.hash = '#/';
    return;
  }
  handleNavigation();
}
