export interface QAPair {
	id: string;
	question: string;
	hasCode: boolean;
	options: string[];
	answerIndexes: number[];
	answer: string;
	topic: string;
}
