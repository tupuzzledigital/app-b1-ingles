import { getAttempts } from '../store.js';
import { loadReading } from '../content-loader.js';

const TEXTS = {
  notFound: 'Intento no encontrado',
  back: 'Volver',
  retry: 'Reintentar',
  other: 'Otro texto',
  yourAnswer: 'Tu respuesta',
  correctAnswer: 'Respuesta correcta',
  noAnswer: 'Sin responder',
};

function optionLabel(options, index) {
  if (index === null || index === undefined || !options[index]) return TEXTS.noAnswer;
  return options[index];
}

function buildQuestionReview(question, byQuestion) {
  const li = document.createElement('li');
  li.className = byQuestion.correct ? 'review-correct' : 'review-incorrect';

  const statement = document.createElement('p');
  statement.textContent = question.q;
  li.append(statement);

  const given = document.createElement('p');
  given.textContent = `${TEXTS.yourAnswer}: ${optionLabel(question.options, byQuestion.given)}`;
  li.append(given);

  if (!byQuestion.correct) {
    const expected = document.createElement('p');
    expected.textContent = `${TEXTS.correctAnswer}: ${optionLabel(question.options, byQuestion.expected)}`;
    li.append(expected);
  }

  if (question.explanation) {
    const explanation = document.createElement('p');
    explanation.className = 'review-explanation';
    explanation.textContent = question.explanation;
    li.append(explanation);
  }

  return li;
}

export async function renderResult(container, attemptId) {
  container.replaceChildren();

  const attempt = getAttempts().find((a) => a.id === attemptId);
  if (!attempt) {
    const p = document.createElement('p');
    p.textContent = TEXTS.notFound;
    const back = document.createElement('a');
    back.href = '#/';
    back.textContent = TEXTS.back;
    container.append(p, back);
    return;
  }

  const { items } = await loadReading();
  const exercise = items.find((item) => item.id === attempt.exerciseId);

  const h1 = document.createElement('h1');
  h1.textContent = `${attempt.result.correct}/${attempt.result.total} — ${attempt.result.percent}%`;
  container.append(h1);

  const progress = document.createElement('progress');
  progress.max = 100;
  progress.value = attempt.result.percent;
  container.append(progress);

  if (exercise) {
    const ul = document.createElement('ul');
    ul.className = 'review-list';
    attempt.result.byQuestion.forEach((byQuestion, index) => {
      ul.append(buildQuestionReview(exercise.preguntas[index], byQuestion));
    });
    container.append(ul);
  }

  const actions = document.createElement('div');
  actions.className = 'result-actions';

  const retryBtn = document.createElement('a');
  retryBtn.className = 'btn btn-primary';
  retryBtn.href = `#/reading/${attempt.exerciseId}`;
  retryBtn.textContent = TEXTS.retry;

  const otherBtn = document.createElement('a');
  otherBtn.className = 'btn btn-secondary';
  otherBtn.href = '#/reading';
  otherBtn.textContent = TEXTS.other;

  actions.append(retryBtn, otherBtn);
  container.append(actions);
}
