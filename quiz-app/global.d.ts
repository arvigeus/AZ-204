declare module "~/db" {
  export const qa: {
    topics: string[];
    data: {
      id: string;
      question: string;
      hasCode: boolean;
      options: string[];
      answerIndexes: number[];
      answer: string;
      topic: string;
    }[];
  };
}
