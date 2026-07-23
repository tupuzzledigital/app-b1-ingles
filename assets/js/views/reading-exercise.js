import { logger } from '../logger.js';
import { go } from '../router.js';
import { loadReading } from '../content-loader.js';
import { startSession } from '../exercise-engine.js';
import { appendAttempt } from '../store.js';

const TEXTS = {
  notFoundTitle: 'Ejercicio no encontrado',
  back: 'Volver',
  submit: 'Enviar',
};

function renderNotFound(container) {
  const h2 = document.createElement('h2');
  h2.textContent = TEXTS.notFoundTitle;
  const back = document.createElement('a');
  back.href = '#/';
  back.textContent = TEXTS.back;
  container.append(h2, back);
}

function renderText(container, texto) {
  const article = document.createElement('article');
  article.lang = 'en';
  texto.split(/\n\n+/).forEach((paragraph) => {
    const p = document.createElement('p');
    p.textContent = paragraph.trim();
    article.append(p);
  });
  container.append(article);
}

function renderQuestion(question, index) {
  const fieldset = document.createElement('fieldset');
  const legend = document.createElement('legend');
  legend.textContent = question.q;
  fieldset.append(legend);

  question.options.forEach((option, optionIndex) => {
    const label = document.createElement('label');
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = `q${index}`;
    input.value = String(optionIndex);
    label.append(input, document.createTextNode(option));
    fieldset.append(label);
  });

  return fieldset;
}

function readAnswers(form, exercise) {
  const answers = {};
  exercise.preguntas.forEach((_, index) => {
    const checked = form.querySelector(`input[name="q${index}"]:checked`);
    answers[index] = checked ? Number(checked.value) : null;
  });
  return answers;
}

export async function renderExercise(container, exerciseId) {
  container.replaceChildren();

  const { items } = await loadReading();
  const exercise = items.find((item) => item.id === exerciseId);

  if (!exercise) {
    renderNotFound(container);
    return;
  }

  const session = startSession(exercise);

  const h1 = document.createElement('h1');
  h1.textContent = exercise.titulo;
  container.append(h1);

  renderText(container, exercise.texto);

  const form = document.createElement('form');
  exercise.preguntas.forEach((question, index) => {
    form.append(renderQuestion(question, index));
  });

  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.textContent = TEXTS.submit;
  form.append(submitBtn);

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const answers = readAnswers(form, exercise);
    Object.entries(answers).forEach(([index, value]) => session.answer(Number(index), value));
    const result = session.submit();

    const attempt = {
      id: crypto.randomUUID(),
      exerciseId: exercise.id,
      mode: 'practice',
      startedAt: session.startedAt,
      finishedAt: new Date().toISOString(),
      result,
    };

    if (!appendAttempt(attempt)) {
      logger.error('no se pudo guardar el intento', attempt);
    }

    go(`result/${attempt.id}`);
  });

  container.append(form);
}
