import fetch from "node-fetch";
import NodeCache from "node-cache";
import { uuid } from "uuidv4";
import fs from "fs/promises";
import path from "path";

const cache = new NodeCache();
const githubAPIUrl = "https://api.github.com/repos";

export interface QAPair {
  id: string;
  question: string;
  options: string[];
  answerIndexes: number[];
  answer: string;
  topic: string;
}

interface GitHubContentItem {
  name: string;
  path: string;
  type: "file" | "dir";
}

interface FileItem {
  name: string;
  path: string;
}

const getRandomElement = <T>(array: T[]): T =>
  array[Math.floor(Math.random() * array.length)];

const parseQA = (name: string, text: string): QAPair[] => {
  const lines = text.split("\n");
  const qaPairs: QAPair[] = [];
  let currentQuestion: string[] = [];
  let currentOptions: string[] = [];
  let currentAnswer: string[] = [];
  let currentAnswerIndex = [];

  const optionRegex = /^\s*- \[(?:x|\s)\]|^[a-zA-Z0-9]+[),]\s/;

  for (const line of lines) {
    if (line.startsWith("Question:")) {
      currentQuestion = [line.replace("Question:", "").trim()];
    } else if (line.startsWith("Answer:")) {
      currentAnswer = [line.replace("Answer:", "").trim()];
    } else if (
      line.trim() === "" &&
      currentQuestion.length > 0 &&
      currentAnswer.length > 0
    ) {
      qaPairs.push({
        id: uuid(),
        question: currentQuestion.join("\n"),
        answer: currentAnswer.join("\n"),
        options: [...currentOptions],
        answerIndexes: currentAnswerIndex,
        topic: name,
      });
      currentQuestion = [];
      currentAnswer = [];
      currentOptions = [];
      currentAnswerIndex = [];
    } else {
      const trimmedLine = line.trimEnd();
      if (optionRegex.test(trimmedLine)) {
        currentOptions.push(trimmedLine.replace(optionRegex, ""));
        if (/^(\s*- \[x\])/.test(trimmedLine))
          currentAnswerIndex.push(currentOptions.length - 1);
      } else {
        if (currentQuestion.length > 0) currentQuestion.push(trimmedLine);
        if (currentAnswer.length > 0) currentAnswer.push(trimmedLine);
      }
    }
  }

  // For QA pair without trailing empty line
  if (currentQuestion.length > 0 && currentAnswer.length > 0) {
    qaPairs.push({
      id: uuid(),
      question: currentQuestion.join("\n"),
      answer: currentAnswer.join("\n"),
      options: [...currentOptions],
      answerIndexes: currentAnswerIndex,
      topic: name,
    });
  }

  return qaPairs;
};

const getQAFromFile = async (
  repo: string,
  name: string,
  pathToFile: string,
  isDev: boolean
): Promise<QAPair[]> => {
  let fileContent: string;

  if (isDev) {
    fileContent = await fs.readFile(pathToFile, "utf-8");
  } else {
    const url = `${githubAPIUrl}/${repo}/contents/${pathToFile}`;
    const response = await fetch(url);
    const data = await response.json();
    fileContent = Buffer.from(data.content, "base64").toString("utf-8");
  }

  return parseQA(name.replace(/\.[^/.]+$/, ""), fileContent);
};

export const getTopics = async (
  repo: string,
  directory: string
): Promise<string[]> => {
  if (cache.has("")) {
    const cachedData = cache.get("") as string[] | undefined;
    if (cachedData && cachedData.length > 0) {
      return cachedData;
    }
  }

  const isDev = process.env.NODE_ENV === "development";
  let files;

  if (isDev) {
    const dirPath = path.join(process.cwd(), "..", directory);
    files = (await fs.readdir(dirPath)).filter(
      (file) => file.toLowerCase() !== "readme.md" && file.endsWith(".md")
    );
  } else {
    const dirUrl = `${githubAPIUrl}/${repo}/contents/${directory}`;
    const dirResponse = await fetch(dirUrl);
    const dirData = (await dirResponse.json()) as GitHubContentItem[];
    files = dirData
      .filter(
        (item) =>
          item.type === "file" &&
          item.name.toLowerCase() !== "readme.md" &&
          item.name.endsWith(".md")
      )
      .map((file) => file.name);
  }

  files = files.map((file) => file.replace(/\.[^/.]+$/, ""));

  cache.set("", files);

  return files;
};

export const getQA = async (
  repo: string,
  directory: string,
  topic?: string | null | undefined
): Promise<QAPair> => {
  const isDev = process.env.NODE_ENV === "development";
  let files: GitHubContentItem[] | FileItem[];

  if (isDev) {
    const dirPath = path.join(process.cwd(), "..", directory);
    files = (await fs.readdir(dirPath))
      .map((name) => ({ name, path: path.join(dirPath, name) }))
      .filter(
        (file) =>
          file.name.toLowerCase() !== "readme.md" && file.name.endsWith(".md")
      );
  } else {
    const dirUrl = `${githubAPIUrl}/${repo}/contents/${directory}`;
    const dirResponse = await fetch(dirUrl);
    const dirData = (await dirResponse.json()) as GitHubContentItem[];
    files = dirData.filter(
      (item) =>
        item.type === "file" &&
        item.name.toLowerCase() !== "readme.md" &&
        item.name.endsWith(".md")
    );
  }

  let file;
  if (topic) file = files.find((f) => f.name == `${topic}.md`);
  if (!file) file = getRandomElement<GitHubContentItem | FileItem>(files);

  if (cache.has(file.path)) {
    const cachedData = cache.get(file.path) as QAPair[] | undefined;
    if (cachedData && cachedData.length > 0) {
      return shuffleQA(getRandomElement(cachedData));
    } else {
      // Remove file from cache if it doesn't contain any QA pairs
      cache.del(file.path);
      // Recursive call to find another file
      return await getQA(repo, directory);
    }
  } else {
    const qaList = await getQAFromFile(repo, file.name, file.path, isDev);
    cache.set(file.path, qaList);
    if (qaList.length > 0) {
      return shuffleQA(getRandomElement(qaList));
    } else {
      // Recursive call to find another file
      return await getQA(repo, directory);
    }
  }
};

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
