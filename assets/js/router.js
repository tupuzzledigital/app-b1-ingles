import { logger } from './logger.js';

const routes = [];
let notFoundHandler = () => logger.warn('router: no notFound handler registered');

function compilePattern(pattern) {
  const paramNames = [];
  const regexBody = pattern
    .split('/')
    .map((segment) => {
      if (segment.startsWith(':')) {
        paramNames.push(segment.slice(1));
        return '([^/]+)';
      }
      return segment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    })
    .join('/');
  return { regex: new RegExp(`^${regexBody}$`), paramNames };
}

export function defineRoute(pattern, handler) {
  if (pattern === 'notFound') {
    notFoundHandler = handler;
    return;
  }
  const { regex, paramNames } = compilePattern(pattern);
  routes.push({ regex, paramNames, handler });
}

export function go(path) {
  location.hash = `#/${path.replace(/^\/+/, '')}`;
}

function currentPath() {
  return location.hash.replace(/^#\/?/, '');
}

function handleNavigation() {
  const path = currentPath();
  for (const route of routes) {
    const match = path.match(route.regex);
    if (match) {
      const params = {};
      route.paramNames.forEach((name, i) => {
        params[name] = decodeURIComponent(match[i + 1]);
      });
      route.handler(params);
      return;
    }
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
