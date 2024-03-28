// @ts-check
import fs from "fs/promises";
import path from "path";
import { createHash } from "crypto";
import { fileURLToPath } from "url";

/**
 * @typedef {Object} FileContent
 * @property {string} name
 * @property {string} content
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @typedef {Object} QAPair
 * @property {string} id - Unique identifier for the QA pair.
 * @property {string} question - The question text.
 * @property {boolean} hasCode - Flag indicating if the question contains code.
 * @property {string[]} options - Array of options for the question.
 * @property {number[]} answerIndexes - Array of indexes indicating the correct answers.
 * @property {string} answer - The answer text.
 * @property {string} topic - The topic related to the question.
 */

/**
 * @typedef {Object} DirDataItem
 * @property {string} name - The name of the item.
 * @property {string} path - The path of the item.
 * @property {"file" | "dir"} type - The type of the item, file or directory.
 */

/**
 * Parses a text string containing Q&A items and returns an array of QAPair objects.
 * @param {string} name - The name of the Q&A items.
 * @param {string} text - The text string containing the Q&A items.
 * @returns {QAPair[]} An array of QAPair objects.
 */
const parseQuestionItems = (name, text) => {
  const lines = text.split("\n");
  /** @type {QAPair[]} */
  const qaPairs = [];
  /** @type {string[]} */
  let currentQuestion = [];
  /** @type {string[]} */
  let currentOptions = [];
  /** @type {string[]} */
  let currentAnswer = [];
  /** @type {number[]} */
  let currentAnswerIndex = [];
  /** @type {boolean} */
  let currentHasCode = false;

  /** @type {RegExp} */
  const optionRegex = /^\s*- \[(?:x|\s)\]\s/;

  /** @type {("question" | "option" | "answer" | null)} */
  let itemType = null;

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

/**
 * Loads the content of all markdown files in a given directory.
 * @async
 * @param {string} directory - The directory to load the markdown files from.
 * @returns {Promise<FileContent[]>} An array of FileContent objects.
 */
const loadContents = async (directory) => {
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

/**
 * Loads content from a GitHub repository.
 * @async
 * @param {string} directory - The repository directory to load the content from.
 * @returns {Promise<FileContent[]>} An array of FileContent objects.
 */
const loadContentFromGItHub = async (directory) => {
  const githubAPIUrl = "https://api.github.com/repos";
  const repo = "arvigeus/AZ-204";

  const repoDir = `${githubAPIUrl}/${repo}/contents/${directory}`;
  console.log(`Loading questions from ${repoDir}`);

  const dirResponse = await fetch(repoDir);
  /**
   * @type {DirDataItem[]}
   * An array of directory data items.
   */
  const dirData = await dirResponse.json();
  const files = dirData.filter(
    (item) =>
      item.type === "file" &&
      item.name.toLowerCase() !== "readme.md" &&
      item.name.endsWith(".md")
  );
  /**
   * @type {FileContent[]}
   * An array of directory data items.
   */
  const items = [];

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

/**
 * Parses an array of files containing Q&A items, extracting topics and data.
 * @param {FileContent[]} files - The files to be parsed.
 * @returns {Object} An object containing topics and data.
 */
const parseQuestionFiles = (files) => {
  const topics = [];
  const data = [];

  for (const { name, content } of files) {
    topics.push(name);
    const items = parseQuestionItems(name, content);
    data.push(...items);
  }

  return { topics, data };
};

/**
 * Serializes an item to a JSON string.
 * @param {any} item - The item to serialize.
 * @returns {string} The serialized string.
 */
const serialize = (item) => JSON.stringify(item, null, 2);

/**
 * Saves the provided topics and data to a file at the specified location.
 * @async
 * @param {string[]} topics - An array of topic names.
 * @param {QAPair[]} data - An array of QAPair items.
 * @param {string} location - The file location to save the data to.
 * @returns {Promise<void>}
 */
const saveData = async (topics, data, location) => {
  const content = `export const topics = ${serialize(
    topics
  )};\n\nexport const data = ${serialize(data)};\n`;

  await fs.writeFile(location, content);
};

/**
 * Loads files either from the disk or from GitHub depending on the NODE_ENV.
 * @async
 * @param {string} dir - The directory containing the files to load.
 * @returns {Promise<FileContent[]>} An array of FileContent objects.
 */
const loadFiles = async (dir) =>
  await (process.env.NODE_ENV !== "production"
    ? loadContents(path.join(dir))
    : loadContentFromGItHub(path.join(dir)));

/**
 * Main function to initialize the process of loading, parsing, and saving Q&A pairs.
 * @async
 * @returns {Promise<void>}
 */
const init = async () => {
  const { topics: qaTopics, data: qaData } = parseQuestionFiles(
    await loadFiles("Questions")
  );

  await saveData(qaTopics, qaData, path.join(process.cwd(), "app", "db.ts"));
};

init()
  .then(() => console.log("Questions saved to database successfully"))
  .catch((err) => console.error(err));
