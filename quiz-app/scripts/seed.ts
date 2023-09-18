import fs from "fs/promises";
import path from "path";
import { createHash } from "crypto";

import type { QAPair } from "~/types/QAPair";
import type { KnowledgeItem } from "~/types/KnowledgeItem";

type FileContent = {
  name: string;
  content: string;
};

const parseQuestionItems = (name: string, text: string): QAPair[] => {
  const lines = text.split("\n");
  const qaPairs: QAPair[] = [];
  let currentQuestion: string[] = [];
  let currentOptions: string[] = [];
  let currentAnswer: string[] = [];
  let currentAnswerIndex = [];
  let currentHasCode = false;

  const optionRegex = /^\s*- \[(?:x|\s)\]\s/;

  let itemType: "question" | "option" | "answer" | null = null;

  for (const line of lines) {
    if (line.startsWith("Question:")) {
      if (currentQuestion.length > 0) {
        const question = currentQuestion.join("\n").trimEnd();
        qaPairs.push({
          id: createHash("sha256").update(question).digest("hex"),
          question,
          answer: currentAnswer.join("\n").trimEnd(),
          options: [...currentOptions],
          answerIndexes: currentAnswerIndex,
          hasCode: currentHasCode,
          topic: name,
        });
        currentQuestion = [];
        currentAnswer = [];
        currentOptions = [];
        currentAnswerIndex = [];
        currentHasCode = false;
        itemType = null;
      }

      currentQuestion = [line.replace("Question:", "").trimStart()];
      itemType = "question";
    } else if (line.startsWith("Answer:")) {
      currentAnswer = [line.replace("Answer:", "").trimStart()];
      itemType = "answer";
    } else if (line.trim() === "---") {
      if (itemType === "question") currentQuestion.push(line);
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
            if (/^```(cs|ps|Dockerfile|jsonc)$/i.test(line.trim()))
              currentHasCode = true;
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
    const question = currentQuestion.join("\n").trimEnd();
    if (currentOptions.length > 0 && currentAnswerIndex.length === 0)
      throw new Error(`Question '${question}' has missing answer`);
    qaPairs.push({
      id: createHash("sha256").update(question).digest("hex"),
      question,
      answer: currentAnswer.join("\n").trimEnd(),
      options: [...currentOptions],
      answerIndexes: currentAnswerIndex,
      hasCode: currentHasCode,
      topic: name,
    });
  }

  return qaPairs;
};

const parseKnowledgeItems = (text: string): KnowledgeItem[] => {
  const lines = text.split("\n").slice(2); // Skip the first two lines (title)
  const knowledgeItems: KnowledgeItem[] = [];

  let currentQuestion: string[] = [];
  let currentType: string | null = null;
  let currentHint: string | null = null;

  for (const line of lines) {
    if (line.startsWith("---")) {
      // End of a question
      if (currentType && currentQuestion.length > 0) {
        knowledgeItems.push({
          question: currentQuestion.join("\n").trim(),
          type: currentType,
          hint: currentHint,
        });
      }
      // Reset
      currentQuestion = [];
      currentType = null;
      currentHint = null;
    } else if (line.includes(":") && currentQuestion.length === 0) {
      // Type and Question
      const [type, question] = line.split(":", 2);
      currentType = type.trim();
      currentQuestion.push(question.trim());
    } else if (line.startsWith("<!--") && line.endsWith("-->")) {
      // Hint
      currentHint = line.replace("<!--", "").replace("-->", "").trim();
    } else if (currentQuestion.length > 0) {
      // Continuation of a question
      currentQuestion.push(line.trim());
    }
  }

  return knowledgeItems;
};

const loadContents = async (directory: string): Promise<FileContent[]> => {
  const dirPath = path.join(__dirname, "..", "..", directory);
  console.log(`Loading questions from ${dirPath}`);
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

const loadContentFromGItHub = async (
  directory: string
): Promise<FileContent[]> => {
  const githubAPIUrl = "https://api.github.com/repos";
  const repo = "arvigeus/AZ-204";

  const repoDir = `${githubAPIUrl}/${repo}/contents/${directory}`;
  console.log(`Loading questions from ${repoDir}`);

  const dirResponse = await fetch(repoDir);
  const dirData = (await dirResponse.json()) as {
    name: string;
    path: string;
    type: "file" | "dir";
  }[];
  const files = dirData.filter(
    (item) =>
      item.type === "file" &&
      item.name.toLowerCase() !== "readme.md" &&
      item.name.endsWith(".md")
  );

  const items: FileContent[] = [];

  for (const file of files) {
    const url = `${githubAPIUrl}/${repo}/contents/${file.path}`;
    const response = await fetch(url);
    const data = await response.json();
    const name = file.name.replace(/\.[^/.]+$/, "");
    const content = Buffer.from(data.content, "base64").toString("utf-8");

    items.push({ name, content });
  }

  return items;
};

const parseQuestionFiles = (files: FileContent[]) => {
  const topics = [];
  const data = [];

  for (const { name, content } of files) {
    topics.push(name);
    const items = parseQuestionItems(name, content);
    data.push(...items);
  }

  return { topics, data };
};

const parseKnowledgeFiles = (files: FileContent[]) => {
  const topics = [];
  const data = [];

  for (const { name, content } of files) {
    topics.push(name);
    const items = parseKnowledgeItems(content);
    data.push(...items);
  }

  return { topics, data };
};

const serialize = (item: any): string => JSON.stringify(item, null, 2);

const saveData = async (
  qaTopics: string[],
  qaData: QAPair[],
  kcTopics: string[],
  kcData: KnowledgeItem[],
  location: string
) => {
  const content = `export const qa = {topics:${serialize(
    qaTopics
  )},data:${serialize(qaData)}}\n\nexport const kc = {topics:${serialize(
    kcTopics
  )},data:${serialize(kcData)}}`;

  await fs.writeFile(location, content);
};

const loadFiles = async (dir: string): Promise<FileContent[]> =>
  await (process.env.NODE_ENV !== "production"
    ? loadContents(path.join(dir))
    : loadContentFromGItHub(path.join(dir)));

const init = async (): Promise<void> => {
  const { topics: qaTopics, data: qaData } = parseQuestionFiles(
    await loadFiles("Questions")
  );
  const { topics: kcTopics, data: kcData } = parseKnowledgeFiles(
    await loadFiles("Knowledge Check")
  );

  await saveData(
    qaTopics,
    qaData,
    kcTopics,
    kcData,
    path.join(process.cwd(), "app", "db.ts")
  );
};

init()
  .then(() => console.log("Questions saved to database successfully"))
  .catch((err) => console.error(err));
