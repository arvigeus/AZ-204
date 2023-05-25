import type { QAPair } from "~/types/QAPair";

// @ts-expect-error db.ts may not be visible
import { data } from "~/db";
export { topics } from "~/db";

export const getQA = (
  topic?: string | null | undefined,
  answered?: string[] | null | undefined
): QAPair => {
  let questions: QAPair[] = topic
    ? data.filter((item: QAPair) => topic === item.topic)
    : data;

  if (answered) {
    const chances = convertToChances(answered);

    const filtered = questions.filter(
      (item) => !chances[item.id] || Math.random() > chances[item.id]
    );

    if (filtered.length > 0) questions = filtered;
  }

  const question = getRandomElement<QAPair>(questions);

  return shuffleQA(question);
};

const getRandomElement = <T>(array: T[]): T =>
  array[Math.floor(Math.random() * array.length)];

function shuffleQA(question: QAPair): QAPair {
  if (!question.options.length) return question;

  const answers = question.answerIndexes.map((i) => question.options[i]);

  const arrayCopy = [...question.options];
  for (let i = arrayCopy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arrayCopy[i], arrayCopy[j]] = [arrayCopy[j], arrayCopy[i]];
  }
  return {
    ...question,
    options: arrayCopy,
    answerIndexes: answers.map((i) => arrayCopy.indexOf(i)),
  };
}

function convertToChances<T>(arr: T[]): { [key: string]: number } {
  const chances: { [key: string]: number } = {};

  if (arr.length === 0) return chances;

  const step = 1 / arr.length;
  for (let i = 0; i < arr.length; i++) {
    chances[arr[i] as any] = (i + 1) * step;
  }
  return chances;
}
