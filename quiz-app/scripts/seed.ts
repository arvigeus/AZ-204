import fs from "fs/promises";
import path from "path";
import { v4 } from "uuid";

import type { QAPair } from "~/types/QAPair";

type FileContent = {
  name: string;
  content: string;
};

const parseItem = (name: string, text: string): QAPair[] => {
  const lines = text.split("\n");
  const qaPairs: QAPair[] = [];
  let currentQuestion: string[] = [];
  let currentOptions: string[] = [];
  let currentAnswer: string[] = [];
  let currentAnswerIndex = [];

  const optionRegex = /^\s*- \[(?:x|\s)\]|^[a-zA-Z0-9]+[),]\s/;

  let itemType: "question" | "option" | "answer" | null = null;

  for (const line of lines) {
    if (line.startsWith("Question:")) {
      if (currentQuestion.length > 0) {
        qaPairs.push({
          id: v4(),
          question: currentQuestion.join("\n").trimEnd(),
          answer: currentAnswer.join("\n").trimEnd(),
          options: [...currentOptions],
          answerIndexes: currentAnswerIndex,
          topic: name,
        });
        currentQuestion = [];
        currentAnswer = [];
        currentOptions = [];
        currentAnswerIndex = [];
        itemType = null;
      }

      currentQuestion = [line.replace("Question:", "").trimStart()];
      itemType = "question";
    } else if (line.startsWith("Answer:")) {
      currentAnswer = [line.replace("Answer:", "").trimStart()];
      itemType = "answer";
    } else {
      if (optionRegex.test(line)) {
        currentOptions.push(line.replace(optionRegex, ""));
        itemType = "option";
        if (/^(\s*- \[x\])/.test(line))
          currentAnswerIndex.push(currentOptions.length - 1);
      } else {
        switch (itemType) {
          case "question":
            currentQuestion.push(line);
            break;
          case "answer":
            currentAnswer.push(line);
            break;
          case "option":
            if (line.trim() !== "") currentOptions.push(line);
            break;
          default:
            break;
        }
      }
    }
  }

  // For QA pair without trailing empty line
  if (currentQuestion.length > 0) {
    qaPairs.push({
      id: v4(),
      question: currentQuestion.join("\n").trimEnd(),
      answer: currentAnswer.join("\n").trimEnd(),
      options: [...currentOptions],
      answerIndexes: currentAnswerIndex,
      topic: name,
    });
  }

  return qaPairs;
};

const loadContents = async (dirPath: string): Promise<FileContent[]> => {
  const fileNames = await fs.readdir(dirPath);

  const filePromises = fileNames
    .filter((fileName) => fileName.toLowerCase() !== "readme.md")
    .map(async (fileName) => {
      const filePath = path.join(dirPath, fileName);
      const content = await fs.readFile(filePath, "utf-8");
      const name = path.parse(fileName).name; // remove extension

      return { name, content };
    });

  return await Promise.all(filePromises);
};

const parseFiles = (files: FileContent[]) => {
  const topics = [];
  const data = [];

  for (const { name, content } of files) {
    topics.push(name);
    const items = parseItem(name, content);
    data.push(...items);
  }

  return { topics, data };
};

const saveData = async (topics: string[], data: any[]) => {
  const dbPath = path.join(process.cwd(), "app", "db.ts");
  const serializedTopics = JSON.stringify(topics, null, 2);
  const serializedData = JSON.stringify(data, null, 2);
  const content = `export const topics = ${serializedTopics};\n\nexport const data = ${serializedData};\n`;

  await fs.writeFile(dbPath, content);
};

const init = async (dirPath: string): Promise<void> => {
  const files = await loadContents(dirPath);

  const { topics, data } = parseFiles(files);

  await saveData(topics, data);
};

init(path.join(process.cwd(), "..", "Questions"))
  .then(() => console.log("Questions saved to database successfully"))
  .catch((err) => console.error(err));
