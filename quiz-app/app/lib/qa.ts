import type { QAPair } from "~/types/QAPair";

// @ts-expect-error db.ts may not be visible
import { data } from "~/db";
export { topics } from "~/db";

export const getQA = (topic?: string | null | undefined): QAPair => {
  const questions = topic
    ? data.filter((item: QAPair) => topic === item.topic)
    : data;

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
