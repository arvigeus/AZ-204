import {
  useLoaderData,
  useActionData,
  useNavigation,
  Form,
} from "@remix-run/react";
import { json } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import type { V2_MetaFunction as MetaFunction } from "@remix-run/node";
import { useState } from "react";
import clsx from "clsx";
import Markdown from "markdown-to-jsx";

import type { QAPair } from "../lib/qa";
import { getQA, getTopics } from "../lib/qa";

export const meta: MetaFunction = () => {
  return [{ title: "Developing Solutions for Microsoft Azure: Quiz" }];
};

export let loader = async () => {
  const data = await Promise.all([getQA(), getTopics()]);
  return json({
    question: data[0],
    topics: data[1],
  });
};

export let action: ActionFunction = async ({ request }) => {
  const payload = await request.formData();
  const topic = payload.get("topic");
  const data = await getQA(topic?.toString());
  return json(data);
};

export default function Index() {
  const initialData = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();

  const [checkedValues, setCheckedValues] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const data = (actionData as QAPair) || initialData.question;
  const { topics } = initialData;

  const answerStyle = clsx("mt-4", showAnswer ? "visible" : "invisible");

  const handleChange = async (event) => {
    const { checked, value } = event.target;

    if (checked) {
      // Add to checked values
      setCheckedValues((prev) => [...prev, value]);
    } else {
      // Remove from checked values
      setCheckedValues((prev) => prev.filter((v) => v !== value));
    }
  };

  const handleSubmit = () => {
    setCheckedValues([]);
    setShowAnswer(false);
    setShowDropdown(false);
    return false;
  };

  const isLoading = navigation.state === "submitting";

  const btnStyle = clsx(
    "min-w-[30%] flex items-center justify-center text-center bg-blue-700 focus:ring-2 font-medium text-xs sm:text-sm px-2.5 py-1 sm:px-5 sm:py-2.5 inline-flex items-center",
    isLoading
      ? "text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
      : "text-white bg-blue-700 hover:bg-blue-800 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
  );

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
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={`https://github.com/arvigeus/AZ-204/blob/master/Topics/${data.topic}.md`}
                >
                  {data.topic}
                </a>
              </h2>
              <input type="hidden" name="id" value={data.id} />
              <input type="hidden" name="type" value={data.topic} />
              <div className="text-2x">
                <span className="font-bold">Question: </span>
                <Markdown children={data.question} />
              </div>
              {data.options && data.options.length > 0 && (
                <ul className="list-none">
                  {data.options.map((option: string, index: number) => (
                    <li key={index} className="mb-2">
                      <label
                        className={clsx(
                          "block mt-4 border border-gray-300 rounded-lg py-2 px-6 text-lg",
                          (showAnswer || checkedValues.includes(`${index}`)) &&
                            data.answerIndexes.includes(index)
                            ? "bg-green-200"
                            : checkedValues.includes(`${index}`)
                            ? "bg-red-200"
                            : "bg-transparent"
                        )}
                      >
                        <input
                          type={
                            data.answerIndexes.length < 2 ? "checkbox" : "radio"
                          }
                          checked={checkedValues.includes(`${index}`)}
                          onChange={handleChange}
                          className="hidden"
                          value={index}
                        />
                        <Markdown children={option} />
                      </label>
                    </li>
                  ))}
                </ul>
              )}
              <div className={answerStyle}>
                <span className="font-bold">Answer: </span>
                <Markdown children={data.answer} />
              </div>
              <div className="flex justify-between mt-12">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => setShowAnswer(true)}
                  className={`${btnStyle} ${clsx(
                    showAnswer || isLoading ? "invisible" : "visible"
                  )} rounded-lg`}
                >
                  Show Answer
                </button>
                {isLoading ? (
                  <button
                    disabled
                    type="button"
                    className={`${btnStyle} rounded-lg`}
                  >
                    <svg
                      aria-hidden="true"
                      role="status"
                      className="inline w-4 h-4 mr-3 text-gray-200 animate-spin dark:text-gray-600"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="#1C64F2"
                      />
                    </svg>{" "}
                    Loading
                  </button>
                ) : (
                  <div className="flex flex-row">
                    <button
                      type="submit"
                      className={`${btnStyle} rounded-l-lg`}
                    >
                      Next
                      <svg
                        aria-hidden="true"
                        className="w-5 h-5 ml-2 -mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </button>
                    <div className="relative">
                      <button
                        onClick={handleDropdown}
                        data-dropdown-toggle="dropdown"
                        className="text-white bg-blue-800 hover:bg-blue-900 focus:ring-4 focus:outline-none focus:ring-blue-400 font-medium rounded-r-lg text-sm pr-4 py-2.5 text-center inline-flex items-center dark:bg-blue-500 dark:hover:bg-blue-800 dark:focus:ring-blue-900"
                        type="button"
                      >
                        <span className="invisible">|</span>
                        <svg
                          className="w-4 h-4 ml-2"
                          aria-hidden="true"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          ></path>
                        </svg>
                      </button>

                      <div
                        className={clsx(
                          "absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700",
                          { hidden: !showDropdown }
                        )}
                      >
                        <ul
                          className="px-0 py-1 m-0 text-sm text-gray-700 dark:text-gray-200 list-none"
                          aria-labelledby="dropdownDefaultButton"
                        >
                          {topics.map((option, index) => (
                            <li key={index} className="p-0 box-border">
                              <button
                                type="submit"
                                name="topic"
                                value={option}
                                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white w-full text-left"
                                role="menuitem"
                              >
                                {option}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
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
