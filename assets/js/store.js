import { logger } from './logger.js';

const SETTINGS_KEY = 'b1.settings';
const ATTEMPTS_KEY = 'b1.attempts';
const MAX_ATTEMPTS = 200;

const DEFAULT_SETTINGS = { exam: null, theme: 'auto', fontSize: 'M', createdAt: null };

function readJson(key, fallback) {
  const raw = localStorage.getItem(key);
  if (raw === null) return fallback;
  try {
    return JSON.parse(raw);
  } catch (err) {
    logger.error(`no se pudo parsear ${key}`, err);
    return fallback;
  }
}

function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    logger.error(`no se pudo guardar ${key}`, err);
    return false;
  }
}

export function getSettings() {
  return { ...DEFAULT_SETTINGS, ...readJson(SETTINGS_KEY, {}) };
}

export function saveSettings(partial) {
  return writeJson(SETTINGS_KEY, { ...getSettings(), ...partial });
}

function readAttempts() {
  return readJson(ATTEMPTS_KEY, []);
}

export function getAttempts({ exerciseId, mode, limit } = {}) {
  let attempts = readAttempts()
    .slice()
    .sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt));

  if (exerciseId) attempts = attempts.filter((a) => a.exerciseId === exerciseId);
  if (mode) attempts = attempts.filter((a) => a.mode === mode);
  if (typeof limit === 'number') attempts = attempts.slice(0, limit);

  return attempts;
}

export function appendAttempt(attempt) {
  const attempts = readAttempts();
  attempts.push(attempt);
  const ok = writeJson(ATTEMPTS_KEY, attempts);
  if (ok) pruneAttempts();
  return ok;
}

export function pruneAttempts() {
  const attempts = readAttempts();
  if (attempts.length <= MAX_ATTEMPTS) return;

  const bestByExercise = new Map();
  for (const a of attempts) {
    const current = bestByExercise.get(a.exerciseId);
    if (!current || (a.result?.percent ?? 0) > (current.result?.percent ?? 0)) {
      bestByExercise.set(a.exerciseId, a);
    }
  }
  const protectedIds = new Set([...bestByExercise.values()].map((a) => a.id));

  const oldestFirst = attempts.slice().sort((a, b) => new Date(a.startedAt) - new Date(b.startedAt));
  let toRemove = attempts.length - MAX_ATTEMPTS;
  const removeIds = new Set();
  for (const a of oldestFirst) {
    if (toRemove <= 0) break;
    if (protectedIds.has(a.id)) continue;
    removeIds.add(a.id);
    toRemove -= 1;
  }

  writeJson(ATTEMPTS_KEY, attempts.filter((a) => !removeIds.has(a.id)));
}

export function clearAll() {
  Object.keys(localStorage)
    .filter((key) => key.startsWith('b1.'))
    .forEach((key) => localStorage.removeItem(key));
}
