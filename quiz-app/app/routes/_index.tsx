import {
  useLoaderData,
  useActionData,
  useNavigation,
  Form,
  Link,
} from "@remix-run/react";
import { json } from "@remix-run/node";
import type { ActionArgs } from "@remix-run/node";
import type {
  V2_MetaFunction as MetaFunction,
  LoaderArgs,
} from "@remix-run/node";
import { useState, useMemo, useRef } from "react";
import clsx from "clsx";
import Markdown from "markdown-to-jsx";

import { getQA, getQAById, topics } from "~/lib/qa";

import { Button, LoadingButton, NextButton } from "~/components/Button";
import { AnswerOptions } from "~/components/AnswerOptions";
import { RichMarkdown } from "~/components/RichMarkdown";
import { TextInput } from "~/components/Input";

export const meta: MetaFunction = () => {
  return [{ title: "Developing Solutions for Microsoft Azure: Quiz" }];
};

export let loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url);
  const topic = url.searchParams.get("topic");

  const data =
    process.env.NODE_ENV !== "production" && url.searchParams.has("id")
      ? getQAById(url.searchParams.get("id")!.toString())
      : getQA(topic);

  if (!data)
    throw new Response(null, {
      status: 404,
      statusText: "Not Found",
    });

  return { data, topic };
};

export let action = async ({ request }: ActionArgs) => {
  const payload = await request.formData();
  const topic = payload.get("topic");
  // const id = payload.get("id");
  const answered = new Set<string>(
    payload.get("answered")?.toString()?.split(",")
  );
  const data = getQA(topic?.toString(), answered);
  return json(data);
};

export default function Index() {
  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();

  const [checkedValues, setCheckedValues] = useState<number[]>([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const data = actionData || loaderData.data;

  const answerSet = useRef(new Set<string>());

  const answered = useMemo(() => {
    answerSet.current.delete(data.id);
    answerSet.current.add(data.id);
    return Array.from(answerSet.current).join(",");
  }, [data.id]);

  const handleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleSubmit = () => {
    setCheckedValues([]);
    setShowAnswer(false);
    setShowDropdown(false);
    return false;
  };

  const isLoading = navigation.state === "submitting";
  const isCorrectlyAnswered =
    data.answerIndexes &&
    data.answerIndexes.length > 0 &&
    data.answerIndexes.length == checkedValues.length &&
    data.answerIndexes.every((value) => checkedValues.includes(value));

  const buttonColor = showAnswer || isCorrectlyAnswered ? "green" : "blue";

  return (
    <div className="antialiased text-gray-700 bg-gray-100 flex w-full h-screen justify-center pt-12">
      <div className="w-full max-w-xl p-3 flex flex-col justify-between">
        <main className="flex-grow prose">
          <h1 className="font-bold text-5xl text-center text-indigo-700">
            AZ-204 Quiz
          </h1>
          <div className="bg-white p-12 rounded-lg shadow-lg w-full mt-8">
            <Form method="post" onSubmit={handleSubmit}>
              <h2 className="mt-0 text-center">
                <Link to={`?topic=${encodeURIComponent(data.topic)}`}>
                  {data.topic}
                </Link>
              </h2>
              <input type="hidden" name="id" value={data.id} />
              <input type="hidden" name="answered" value={answered} />
              <input type="hidden" name="type" value={data.topic} />
              <div className="text-2x">
                <span className="font-bold">Question: </span>
                <RichMarkdown children={data.question} />
              </div>
              {data.options && data.options.length > 0 && (
                <AnswerOptions
                  name="answers"
                  options={data.options}
                  checkedValues={checkedValues}
                  setCheckedValues={setCheckedValues}
                  showAnswer={showAnswer}
                  answerIndexes={data.answerIndexes}
                  disabled={showAnswer}
                />
              )}
              {(!data.options || !data.options.length) && !data.hasCode && (
                <TextInput />
              )}

              <div
                className={clsx(
                  "transition-[height] transition-[opacity] duration-500 ease-in-out mt-4 overflow-hidden",
                  showAnswer ? "h-auto opacity-100" : "h-0 opacity-0"
                )}
              >
                <span className="font-bold">Answer: </span>
                <Markdown children={data.answer} />
              </div>
              <div className="flex justify-between mt-12">
                <Button
                  type="button"
                  disabled={isLoading}
                  onClick={() => setShowAnswer((ans) => !ans)}
                  bgColor={buttonColor}
                  className={clsx(isLoading ? "invisible" : "visible")}
                >
                  {!showAnswer ? "Show" : "Hide"} Answer
                </Button>
                {isLoading ? (
                  <LoadingButton text="Loading" />
                ) : (
                  <NextButton
                    bgColor={buttonColor}
                    showDropdown={showDropdown}
                    onToggleDropdown={handleDropdown}
                    text="Next"
                    topic={loaderData.topic}
                    entries={topics}
                  />
                )}
              </div>
            </Form>
          </div>
          <small className="block text-center mt-2">
            Exam revision: April 28, 2023
          </small>
        </main>
        <footer className="text-center">
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
