import { logger } from './logger.js';
import { parseCsv } from './csv-parser.js';
import { validateReadingBatch } from './validator.js';

async function fetchText(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`${url} respondió ${response.status}`);
  }
  return response.text();
}

export async function loadReading() {
  let csvText;
  try {
    csvText = await fetchText('/content/reading.csv');
  } catch (err) {
    logger.error('no se pudo cargar reading.csv', err);
    return { items: [], errors: ['no_content'], warnings: [], version: 'unknown' };
  }

  let version = 'unknown';
  try {
    version = (await fetchText('/content/version.txt')).trim();
  } catch (err) {
    logger.warn('no se pudo cargar version.txt', err);
  }

  const { rows } = parseCsv(csvText);
  const { items, errors, warnings } = validateReadingBatch(rows);

  return { items, errors, warnings, version };
}
