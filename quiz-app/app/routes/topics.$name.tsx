import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { Form, Link, useLoaderData, useParams } from "@remix-run/react";
import { useState } from "react";
import clsx from "clsx";

import { AnswerOptions } from "~/components/AnswerOptions";
import { Button } from "~/components/Button";
import { TextInput } from "~/components/Input";
import { RichMarkdown } from "~/components/RichMarkdown";
import { getQuestionsByTopic } from "~/lib/qa";

export const loader = async ({ params }: LoaderFunctionArgs) => {
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

  const question = index < questions.length ? questions[index] : null;

  const isCorrectlyAnswered =
    question &&
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
    // window.scrollTo(0, 0);
    return false;
  };

  return (
    <Form method="post" onSubmit={handleSubmit}>
      <h2 className="mt-0 text-center">
        <Link to={`/topics`}>← Back to Topics</Link>
      </h2>
      {question ? (
        <>
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
            <Button bgColor={buttonColor} type="submit" onSubmit={handleSubmit}>
              Next
            </Button>
          </div>
        </>
      ) : (
        <div className="text-7xl italic text-center">All done! 🎉</div>
      )}
    </Form>
  );
}
