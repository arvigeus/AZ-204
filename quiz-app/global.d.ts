declare module '~/db' {
	export const topics: string[];
	export const data: {
		id: string;
		question: string;
		hasCode: boolean;
		options: string[];
		answerIndexes: number[];
		answer: string;
		topic: string;
	}[];
}
