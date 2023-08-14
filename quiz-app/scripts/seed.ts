import fs from "fs/promises";
import path from "path";
import { createHash } from "crypto";

import type { QAPair } from "~/types/QAPair";

type FileContent = {
  name: string;
  content: string;
};

const parseItem = (name: string, text: string, idCounter: number): QAPair[] => {
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
    const isDebug =
      currentQuestion.length > 0 &&
      currentQuestion[0].includes(
        "You have an application registered in Azure AD and you have configured `appsettings.json`"
      );

    if (line.startsWith("Question:")) {
      if (currentQuestion.length > 0) {
        const question = currentQuestion.join("\n").trimEnd();
        // if (isDebug) console.log("Question: " + question);
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
        if (isDebug) console.log("Option: " + line);
        currentOptions.push(line.replace(optionRegex, ""));
        itemType = "option";
        if (/^(\s*- \[x\])/.test(line))
          currentAnswerIndex.push(currentOptions.length - 1);
      } else {
        switch (itemType) {
          case "question":
            currentQuestion.push(line);
            // if (isDebug) console.log("Question: " + line);
            if (/^```(cs|ps)$/.test(line.trim())) currentHasCode = true;
            break;
          case "answer":
            // if (isDebug) console.log("Answer: " + line);
            currentAnswer.push(line);
            break;
          case "option":
            // if (isDebug) console.log("Option: " + line);
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

const parseFiles = (files: FileContent[]) => {
  const topics = [];
  const data = [];

  for (const { name, content } of files) {
    topics.push(name);
    const items = parseItem(name, content, data.length);
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

const init = async (directory: string): Promise<void> => {
  const files = await (process.env.NODE_ENV !== "production"
    ? loadContents(directory)
    : loadContentFromGItHub(directory));

  const { topics, data } = parseFiles(files);

  await saveData(topics, data);
};

init(path.join("Questions"))
  .then(() => console.log("Questions saved to database successfully"))
  .catch((err) => console.error(err));
