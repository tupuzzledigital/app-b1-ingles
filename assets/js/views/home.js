import { getAttempts } from '../store.js';

const TEXTS = {
  title: 'App B1',
  reading: 'Reading',
  listening: 'Listening',
  grammar: 'Grammar',
  vocabulary: 'Vocabulary',
  writing: 'Writing',
  speaking: 'Speaking',
  comingSoon: 'Próximamente',
  progress: 'Mi progreso',
  settings: 'Ajustes',
};

function buildCard({ label, href, disabled = false, badge = null }) {
  const el = document.createElement(disabled ? 'div' : 'a');
  el.className = disabled ? 'home-card home-card-disabled' : 'home-card';
  if (!disabled) el.href = href;

  const span = document.createElement('span');
  span.textContent = label;
  el.append(span);

  if (badge) {
    const badgeEl = document.createElement('span');
    badgeEl.className = 'badge';
    badgeEl.textContent = badge;
    el.append(badgeEl);
  }

  return el;
}

export function renderHome(container) {
  container.replaceChildren();

  const header = document.createElement('div');
  header.className = 'home-header';

  const h1 = document.createElement('h1');
  h1.textContent = TEXTS.title;

  const settingsLink = document.createElement('a');
  settingsLink.href = '#/settings';
  settingsLink.className = 'home-settings-link';
  settingsLink.textContent = '⚙️';
  settingsLink.setAttribute('aria-label', TEXTS.settings);

  header.append(h1, settingsLink);
  container.append(header);

  const grid = document.createElement('div');
  grid.className = 'home-grid';

  grid.append(buildCard({ label: TEXTS.reading, href: '#/reading' }));
  grid.append(buildCard({ label: TEXTS.listening, disabled: true, badge: TEXTS.comingSoon }));
  grid.append(buildCard({ label: TEXTS.grammar, disabled: true, badge: TEXTS.comingSoon }));
  grid.append(buildCard({ label: TEXTS.vocabulary, disabled: true, badge: TEXTS.comingSoon }));
  grid.append(buildCard({ label: TEXTS.writing, disabled: true, badge: TEXTS.comingSoon }));
  grid.append(buildCard({ label: TEXTS.speaking, disabled: true, badge: TEXTS.comingSoon }));

  const hasAttempts = getAttempts({ limit: 1 }).length > 0;
  grid.append(buildCard({ label: TEXTS.progress, href: '#/progress', disabled: !hasAttempts }));

  container.append(grid);
}
