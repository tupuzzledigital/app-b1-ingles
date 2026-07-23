import { loadReading } from '../content-loader.js';
import { getSettings } from '../store.js';

const TEXTS = {
  title: 'Reading',
  themeLabel: 'Tema',
  difficultyLabel: 'Dificultad',
  allThemes: 'Todos los temas',
  allDifficulties: 'Todas',
  empty: 'No hay textos disponibles con estos filtros.',
};

function difficultyDots(level) {
  return '●'.repeat(level) + '○'.repeat(3 - level);
}

function matchesExam(item, exam) {
  if (!exam) return true;
  return item.examen === exam || item.examen === 'AMBOS';
}

function buildLabeledSelect(labelText, options) {
  const label = document.createElement('label');
  label.append(document.createTextNode(labelText));
  const select = document.createElement('select');
  options.forEach(({ value, text }) => {
    const opt = document.createElement('option');
    opt.value = value;
    opt.textContent = text;
    select.append(opt);
  });
  label.append(select);
  return { label, select };
}

function buildCard(item) {
  const a = document.createElement('a');
  a.href = `#/reading/${item.id}`;
  a.className = 'reading-card';

  const h3 = document.createElement('h3');
  h3.textContent = item.titulo;

  const difficulty = document.createElement('span');
  difficulty.textContent = difficultyDots(item.dificultad);
  difficulty.setAttribute('aria-label', `Dificultad ${item.dificultad} de 3`);

  const badge = document.createElement('span');
  badge.className = 'badge';
  badge.textContent = item.tema;

  a.append(h3, difficulty, badge);
  return a;
}

export async function renderList(container) {
  container.replaceChildren();

  const h1 = document.createElement('h1');
  h1.textContent = TEXTS.title;
  container.append(h1);

  const { items } = await loadReading();
  const settings = getSettings();
  const examItems = items.filter((item) => matchesExam(item, settings.exam));

  const temas = [...new Set(examItems.map((item) => item.tema))].sort();

  const themeOptions = [
    { value: 'all', text: TEXTS.allThemes },
    ...temas.map((tema) => ({ value: tema, text: tema })),
  ];
  const difficultyOptions = [
    { value: 'all', text: TEXTS.allDifficulties },
    { value: '1', text: '1' },
    { value: '2', text: '2' },
    { value: '3', text: '3' },
  ];

  const { label: themeLabel, select: themeSelect } = buildLabeledSelect(TEXTS.themeLabel, themeOptions);
  const { label: difficultyLabel, select: difficultySelect } = buildLabeledSelect(
    TEXTS.difficultyLabel,
    difficultyOptions
  );

  const filters = document.createElement('div');
  filters.className = 'reading-filters';
  filters.append(themeLabel, difficultyLabel);
  container.append(filters);

  const list = document.createElement('div');
  list.className = 'reading-list';
  container.append(list);

  function renderCards() {
    list.replaceChildren();
    const theme = themeSelect.value;
    const difficulty = difficultySelect.value;

    const filtered = examItems.filter((item) => {
      if (theme !== 'all' && item.tema !== theme) return false;
      if (difficulty !== 'all' && item.dificultad !== Number(difficulty)) return false;
      return true;
    });

    if (filtered.length === 0) {
      const p = document.createElement('p');
      p.textContent = TEXTS.empty;
      list.append(p);
      return;
    }

    filtered.forEach((item) => list.append(buildCard(item)));
  }

  themeSelect.addEventListener('change', renderCards);
  difficultySelect.addEventListener('change', renderCards);

  renderCards();
}
