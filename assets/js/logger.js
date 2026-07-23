const LEVELS = ['debug', 'info', 'warn', 'error'];

function getActiveLevel() {
  const stored = localStorage.getItem('b1.logLevel');
  return LEVELS.includes(stored) ? stored : 'info';
}

function log(level, ...args) {
  const activeLevel = getActiveLevel();
  if (LEVELS.indexOf(level) < LEVELS.indexOf(activeLevel)) return;
  console[level]('[B1]', ...args);
}

export const logger = {
  debug: (...args) => log('debug', ...args),
  info: (...args) => log('info', ...args),
  warn: (...args) => log('warn', ...args),
  error: (...args) => log('error', ...args),
};
