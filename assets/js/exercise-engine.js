export function computeScore(exercise, answers) {
  const byQuestion = exercise.preguntas.map((question, index) => {
    const given = answers[index];
    const correct = given === question.answer;
    return { correct, expected: question.answer, given };
  });

  const correct = byQuestion.filter((q) => q.correct).length;
  const total = exercise.preguntas.length;
  const percent = total === 0 ? 0 : Math.round((correct / total) * 100);

  return { correct, total, percent, byQuestion };
}

export function startSession(exercise) {
  const session = {
    exercise,
    answers: {},
    startedAt: new Date().toISOString(),
    answer(questionIndex, value) {
      session.answers[questionIndex] = value;
    },
    submit() {
      return computeScore(exercise, session.answers);
    },
  };
  return session;
}
