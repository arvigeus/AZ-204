import {
  useLoaderData,
  useActionData,
  useNavigation,
  Form,
  Link,
} from "@remix-run/react";
import { json } from "@remix-run/node";
import type { ActionFunctionArgs } from "@remix-run/node";
import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { useState, useMemo, useEffect, useRef } from "react";
import clsx from "clsx";

import { getQA, getQAById, topics } from "~/lib/qa";

import { Button, LoadingButton, NextButton } from "~/components/Button";
import { AnswerOptions } from "~/components/AnswerOptions";
import { RichMarkdown } from "~/components/RichMarkdown";
import { TextInput } from "~/components/Input";

export const meta: MetaFunction = () => {
  return [{ title: "Developing Solutions for Microsoft Azure: Quiz" }];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const topic = url.searchParams.get("topic");

  const data = url.searchParams.has("id")
    ? getQAById(url.searchParams.get("id")!.toString())
    : getQA(topic);

  if (!data)
    throw new Response(null, {
      status: 404,
      statusText: "Not Found",
    });

  return { data, topic };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const payload = await request.formData();
  const topic = payload.get("topic");
  // const id = payload.get("id");
  const answered = new Set<number>(
    payload
      .get("answered")
      ?.toString()
      ?.split(",")
      .map((i) => parseInt(i, 10))
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

  useEffect(() => {
    const currentURL = new URL(window.location.href);
    const searchParams = new URLSearchParams(currentURL.search);

    searchParams.delete("index");
    searchParams.set("id", data.id);
    currentURL.search = searchParams.toString();

    window.history.replaceState({}, null!, currentURL.toString());
  });

  const answerSet = useRef(new Set<number>());

  const answered = useMemo(() => {
    answerSet.current.delete(data.index);
    answerSet.current.add(data.index);
    return Array.from(answerSet.current).join(",");
  }, [data.index]);

  const handleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleSubmit = () => {
    setCheckedValues([]);
    setShowAnswer(false);
    setShowDropdown(false);
    // window.scrollTo(0, 0);
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
    <Form method="post" onSubmit={handleSubmit}>
      <h2 className="mt-0 text-center">
        <Link to={`?topic=${encodeURIComponent(data.topic)}`}>
          {data.topic}
        </Link>{" "}
        <Link
          to={`/topics`}
          title="More topics"
          className="float-right no-underline text-5xl"
        >
          →
        </Link>
      </h2>
      <input type="hidden" name="id" value={data.id} />
      <input type="hidden" name="answered" value={answered} />
      <input type="hidden" name="type" value={data.topic} />
      <div className="text-2x">
        <div className="font-bold -mb-4">Question: </div>
        <RichMarkdown interactive children={data.question} />
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
      {data.answerIndexes && data.answerIndexes.length > 1 && (
        <div className="italic text-gray-400 text-xs">
          Note: This question has more than one correct answer
        </div>
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
        <div className="font-bold">Answer: </div>
        <RichMarkdown children={data.answer} />
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
  );
}
