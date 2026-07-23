const BOM = '﻿';

function stripBom(text) {
  return text.startsWith(BOM) ? text.slice(BOM.length) : text;
}

function detectDelimiter(text) {
  const firstLine = text.split(/\r?\n/, 1)[0] ?? '';
  const commaCount = (firstLine.match(/,/g) ?? []).length;
  const semicolonCount = (firstLine.match(/;/g) ?? []).length;
  return semicolonCount > commaCount ? ';' : ',';
}

export function parseCsv(rawText) {
  const hasBom = rawText.startsWith(BOM);
  const text = stripBom(rawText);
  const delimiter = detectDelimiter(text);

  const parsed = Papa.parse(text, {
    header: true,
    skipEmptyLines: true,
    delimiter,
    transformHeader: (h) => h.trim().toLowerCase(),
  });

  const rows = parsed.data.filter((row) => {
    const firstValue = Object.values(row)[0];
    return typeof firstValue !== 'string' || !firstValue.trim().startsWith('#');
  });

  return { rows, meta: { delimiter, hasBom } };
}
