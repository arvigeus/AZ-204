import type {
  V2_MetaFunction as MetaFunction,
  LoaderArgs,
} from "@remix-run/node";
import { Form, Link, useLoaderData, useParams } from "@remix-run/react";
import { useState } from "react";
import clsx from "clsx";

import { AnswerOptions } from "~/components/AnswerOptions";
import { Button } from "~/components/Button";
import { TextInput } from "~/components/Input";
import { RichMarkdown } from "~/components/RichMarkdown";
import { getQuestionsByTopic } from "~/lib/qa";

export let loader = async ({ params }: LoaderArgs) => {
  return getQuestionsByTopic(params.name || "");
};

export const meta: MetaFunction = ({ params }) => {
  return [
    { title: `Developing Solutions for Microsoft Azure: ${params.name}` },
  ];
};

export default function Topic() {
  const questions = useLoaderData<typeof loader>();
  const params = useParams();

  const [index, setIndex] = useState(0);

  const [checkedValues, setCheckedValues] = useState<number[]>([]);
  const [showAnswer, setShowAnswer] = useState(false);

  const question = questions[index];

  const isCorrectlyAnswered =
    question.answerIndexes &&
    question.answerIndexes.length > 0 &&
    question.answerIndexes.length == checkedValues.length &&
    question.answerIndexes.every((value) => checkedValues.includes(value));

  const buttonColor = showAnswer || isCorrectlyAnswered ? "green" : "blue";

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setCheckedValues([]);
    setShowAnswer(false);
    setIndex((index) => index + 1);
    window.scrollTo(0, 0);
    return false;
  };

  return (
    <div className="antialiased text-gray-700 bg-gray-100 flex w-full h-screen justify-center pt-6">
      <div className="w-full max-w-3xl p-3 flex flex-col justify-between">
        <main className="flex-grow prose max-w-3xl">
          <h1 className="font-bold text-5xl text-center text-indigo-700">
            <Link to="/">AZ-204 Quiz</Link>
          </h1>
          <div className="bg-white p-12 rounded-lg shadow-lg w-full mt-8">
            <Form method="post" onSubmit={handleSubmit}>
              <h2 className="mt-0 text-center">
                <Link to={`/topics`}>← Back to Topics</Link>
              </h2>
              <input type="hidden" name="id" value={question.id} />
              <input type="hidden" name="type" value={question.topic} />
              <div className="text-2x">
                <span className="font-bold">
                  {params.name} ({index + 1} / {questions.length}):{" "}
                </span>
                <RichMarkdown interactive children={question.question} />
              </div>
              {question.options && question.options.length > 0 && (
                <AnswerOptions
                  name="answers"
                  options={question.options}
                  checkedValues={checkedValues}
                  setCheckedValues={setCheckedValues}
                  showAnswer={showAnswer}
                  answerIndexes={question.answerIndexes}
                  disabled={showAnswer}
                />
              )}
              {question.answerIndexes && question.answerIndexes.length > 1 && (
                <div className="italic text-gray-400 text-xs">
                  Note: This question has more than one correct answer
                </div>
              )}
              {(!question.options || !question.options.length) &&
                !question.hasCode && <TextInput />}

              <div
                className={clsx(
                  "transition-[height] transition-[opacity] duration-500 ease-in-out mt-4 overflow-hidden",
                  showAnswer ? "h-auto opacity-100" : "h-0 opacity-0"
                )}
              >
                <div className="font-bold">Answer: </div>
                <RichMarkdown children={question.answer} />
              </div>
              <div className="flex justify-between mt-12">
                <Button
                  type="button"
                  onClick={() => setShowAnswer((ans) => !ans)}
                  bgColor={buttonColor}
                >
                  {!showAnswer ? "Show" : "Hide"} Answer
                </Button>
                <Button
                  bgColor={buttonColor}
                  type="submit"
                  onSubmit={handleSubmit}
                >
                  Next
                </Button>
              </div>
            </Form>
          </div>
          <small className="block text-center mt-2">
            Exam revision: April 28, 2023
          </small>
        </main>
        <footer className="text-center mt-6">
          <div className="flex justify-center items-center">
            <a
              href="https://github.com/arvigeus/AZ-204"
              target="_blank"
              title="Viewing existing code on GitHub"
              rel="noreferrer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
