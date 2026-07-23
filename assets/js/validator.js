const REQUIRED_FIELDS = ['id', 'titulo', 'examen', 'tema', 'dificultad', 'texto', 'tipo', 'preguntas'];
const VALID_EXAMENES = ['PET', 'EOI', 'AMBOS'];
const VALID_TIPOS = ['multiple_choice', 'true_false', 'matching', 'gapped'];

function validateQuestion(q, index) {
  if (!q || typeof q.q !== 'string' || !q.q.trim()) {
    return `pregunta ${index}: falta el campo "q"`;
  }
  if (!Array.isArray(q.options) || q.options.length === 0) {
    return `pregunta ${index}: "options" debe ser un array no vacío`;
  }
  if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= q.options.length) {
    return `pregunta ${index}: "answer" (${q.answer}) fuera de rango`;
  }
  return null;
}

export function validateReadingRow(row, index) {
  for (const field of REQUIRED_FIELDS) {
    const value = row[field];
    if (value === undefined || value === null || String(value).trim() === '') {
      return { valid: false, errors: [`fila ${index}: falta el campo obligatorio "${field}"`], warnings: [] };
    }
  }

  const examen = String(row.examen).trim().toUpperCase();
  if (!VALID_EXAMENES.includes(examen)) {
    return { valid: false, errors: [`fila ${index}: "examen" inválido (${row.examen})`], warnings: [] };
  }

  const tipo = String(row.tipo).trim().toLowerCase();
  if (!VALID_TIPOS.includes(tipo)) {
    return { valid: false, errors: [`fila ${index}: "tipo" inválido (${row.tipo})`], warnings: [] };
  }

  const warnings = [];
  let dificultad = parseInt(row.dificultad, 10);
  if (!Number.isInteger(dificultad) || dificultad < 1 || dificultad > 3) {
    warnings.push(`fila ${index}: "dificultad" fuera de rango (${row.dificultad}), normalizada a 2`);
    dificultad = 2;
  }

  let preguntas;
  try {
    preguntas = JSON.parse(row.preguntas);
  } catch (err) {
    return { valid: false, errors: [`fila ${index}: "preguntas" no es JSON válido (${err.message})`], warnings: [] };
  }

  if (!Array.isArray(preguntas) || preguntas.length === 0) {
    return { valid: false, errors: [`fila ${index}: "preguntas" debe ser un array no vacío`], warnings: [] };
  }

  for (let i = 0; i < preguntas.length; i++) {
    const error = validateQuestion(preguntas[i], i);
    if (error) {
      return { valid: false, errors: [`fila ${index}: ${error}`], warnings: [] };
    }
  }

  const item = {
    id: String(row.id).trim(),
    titulo: String(row.titulo).trim(),
    examen,
    tema: String(row.tema).trim(),
    dificultad,
    texto: String(row.texto),
    tipo,
    preguntas,
  };

  return { valid: true, item, errors: [], warnings };
}

export function validateReadingBatch(rows) {
  const items = [];
  const errors = [];
  const warnings = [];
  const seenIds = new Set();

  rows.forEach((row, i) => {
    const result = validateReadingRow(row, i + 1);
    warnings.push(...result.warnings);

    if (!result.valid) {
      errors.push(...result.errors);
      return;
    }

    if (seenIds.has(result.item.id)) {
      warnings.push(`fila ${i + 1}: id duplicado "${result.item.id}", se ignora`);
      return;
    }

    seenIds.add(result.item.id);
    items.push(result.item);
  });

  return { items, errors, warnings };
}
