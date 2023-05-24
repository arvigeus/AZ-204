export interface QAPair {
  id: string;
  question: string;
  options: string[];
  answerIndexes: number[];
  answer: string;
  topic: string;
}
