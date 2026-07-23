import { saveSettings } from '../store.js';
import { go } from '../router.js';

const TEXTS = {
  title: '¿Qué examen preparas?',
  pet: 'PET',
  eoi: 'EOI',
  unknown: 'Aún no lo sé',
  privacy: 'Tu progreso se guarda solo en este dispositivo. Si cambias de móvil, empezarás de cero.',
};

function chooseExam(exam) {
  saveSettings({ exam, createdAt: new Date().toISOString() });
  go('/');
}

export function renderOnboarding(container) {
  container.replaceChildren();

  const h1 = document.createElement('h1');
  h1.textContent = TEXTS.title;
  container.append(h1);

  const options = document.createElement('div');
  options.className = 'onboarding-options';

  [
    { label: TEXTS.pet, exam: 'PET' },
    { label: TEXTS.eoi, exam: 'EOI' },
    { label: TEXTS.unknown, exam: 'AMBOS' },
  ].forEach(({ label, exam }) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-primary onboarding-btn';
    btn.textContent = label;
    btn.addEventListener('click', () => chooseExam(exam));
    options.append(btn);
  });

  container.append(options);

  const privacy = document.createElement('p');
  privacy.className = 'onboarding-privacy';
  privacy.textContent = TEXTS.privacy;
  container.append(privacy);
}
