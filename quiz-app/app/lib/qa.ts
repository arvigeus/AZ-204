import { data } from '~/db';
import type { QAPair } from '~/types/QAPair';

export { topics } from '~/db';
export { data };

export type Question = QAPair & { index: number };

export const getQA = (
	topic?: string | null | undefined,
	answeredIndexes?: Set<number> | null | undefined,
): Question | null => {
	let questions: QAPair[] = topic
		? data.filter((item) => topic === item.topic)
		: data;

	if (questions.length === 0) return null;

	if (answeredIndexes?.size) {
		const answeredIds = new Set<string>();
		for (const i of answeredIndexes)
			if (i >= 0 && i < data.length && data[i]) answeredIds.add(data[i].id);

		if (topic) {
			const availableIds = new Set(questions.map((q) => q.id));
			for (const key of answeredIds.keys())
				if (!availableIds.has(key)) answeredIds.delete(key);
		}

		const answers = Array.from(answeredIds);

		const chances = convertToChances(
			answers,
			answers.length === questions.length,
		);

		const filtered = questions.filter(
			(item) => !chances[item.id] || Math.random() > chances[item.id],
		);

		if (filtered.length > 0) questions = filtered;
	}

	const question = getRandomElement<QAPair>(questions);
	const index = data.findIndex((item) => item.id === question.id);

	return shuffleQA({ ...question, index });
};

export const getQAById = (id: string) => {
	const index = data.findIndex((item) => item.id === id);
	if (index < 0 || !data[index]) return null;
	return shuffleQA({ ...data[index], index });
};

export const getQuestionsByTopic = (topic: string): QAPair[] => {
	const questions: QAPair[] = data.filter((item) => topic === item.topic);

	if (questions.length === 0) return [];

	return shuffleArray(questions);
};

const getRandomElement = <T>(array: T[]): T =>
	array[Math.floor(Math.random() * array.length)];

function shuffleQA(question: Question): Question {
	if (!question.options.length) return question;

	const answers = question.answerIndexes.map((i) => question.options[i]);

	const options = shuffleArray(question.options);
	return {
		...question,
		options,
		answerIndexes: answers.map((i) => options.indexOf(i)),
	};
}

function shuffleArray<T>(arr: T[]): T[] {
	const arrayCopy = [...arr];
	for (let i = arrayCopy.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[arrayCopy[i], arrayCopy[j]] = [arrayCopy[j] as T, arrayCopy[i] as T];
	}
	return arrayCopy;
}

function convertToChances(
	arr: string[],
	startFromZero?: boolean,
): { [key: string]: number } {
	const chances: { [key: string]: number } = {};

	if (arr.length === 0) return chances;

	const step =
		startFromZero && arr.length > 1 ? 1 / (arr.length - 1) : 1 / arr.length;

	chances[arr[0]] = startFromZero ? 0 : step;
	const multiplier = startFromZero ? 0 : 1;
	for (let i = 1; i < arr.length; i++) {
		chances[arr[i]] = (i + multiplier) * step;
	}
	return chances;
}
