import clsx from 'clsx';
import { useEffect, useMemo, useRef, useState } from 'react';
import type {
	ActionFunctionArgs,
	LoaderFunctionArgs,
	MetaFunction,
} from 'react-router';
import {
	Form,
	Link,
	useActionData,
	useLoaderData,
	useNavigation,
} from 'react-router';

import { AnswerOptions } from '~/components/AnswerOptions';
import { Button, LoadingButton, NextButton } from '~/components/Button';
import { TextInput } from '~/components/Input';
import { RichMarkdown } from '~/components/RichMarkdown';
import { type Question, getQA, getQAById, topics } from '~/lib/qa';

export const meta: MetaFunction = () => {
	return [{ title: 'Developing Solutions for Microsoft Azure: Quiz' }];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const url = new URL(request.url);
	const topic = url.searchParams.get('topic');

	const id = url.searchParams.get('id');
	const data = id != null ? getQAById(id) : getQA(topic);

	if (!data)
		throw new Response(null, {
			status: 404,
			statusText: 'Not Found',
		});

	return { data, topic };
};

export const action = async ({ request }: ActionFunctionArgs) => {
	const payload = await request.formData();
	const topic = payload.get('topic');
	// const id = payload.get("id");
	const answered = new Set<number>(
		payload
			.get('answered')
			?.toString()
			?.split(',')
			.map((i) => Number.parseInt(i, 10)),
	);
	const data = getQA(topic?.toString(), answered);
	return data;
};

export default function Index() {
	const loaderData = useLoaderData<typeof loader>();
	const actionData = useActionData<typeof action>();

	const data = actionData || loaderData.data;

	useEffect(() => {
		const currentURL = new URL(window.location.href);
		const searchParams = new URLSearchParams(currentURL.search);
		searchParams.delete('index');
		searchParams.set('id', data.id);
		currentURL.search = searchParams.toString();
		window.history.replaceState({}, data.id, currentURL.toString());
	});

	const answerSet = useRef(new Set<number>());

	const answered = useMemo(() => {
		answerSet.current.delete(data.index);
		answerSet.current.add(data.index);
		return Array.from(answerSet.current).join(',');
	}, [data.index]);

	return (
		<QuestionForm
			key={data.id}
			data={data}
			answered={answered}
			topic={loaderData.topic}
		/>
	);
}

function QuestionForm({
	data,
	answered,
	topic,
}: {
	data: Question;
	answered: string;
	topic: string | null;
}) {
	const [checkedValues, setCheckedValues] = useState<number[]>([]);
	const [showAnswer, setShowAnswer] = useState(false);
	const navigation = useNavigation();

	const handleSubmit = () => {
		window.history.pushState({}, data.id, window.location.href);
		window.scrollTo({ top: 0, behavior: 'smooth' });
		return false;
	};

	const isLoading = navigation.state === 'submitting';
	const isCorrectlyAnswered =
		data.answerIndexes &&
		data.answerIndexes.length > 0 &&
		data.answerIndexes.length === checkedValues.length &&
		data.answerIndexes.every((value) => checkedValues.includes(value));

	const buttonColor = showAnswer || isCorrectlyAnswered ? 'green' : 'blue';

	return (
		<Form method="post" onSubmit={handleSubmit}>
			<h2 className="relative mt-0 text-center">
				<Link to={`?topic=${encodeURIComponent(data.topic)}`} className="text-[var(--color-accent)] font-semibold underline">
					{data.topic}
				</Link>{' '}
				<Link
					to={'/topics'}
					title="More topics"
					className="-right-4 -top-4 absolute scale-75 no-underline"
				>
					<svg
						role="img"
						aria-label="Open book"
						width="64px"
						height="64px"
						viewBox="0 0 64 64"
						xmlns="http://www.w3.org/2000/svg"
						style={{ color: 'var(--color-accent)' }}
					>
						<polyline
							points="50.83 18.04 55.47 18.04 55.47 51.97 8.53 51.97 8.53 18.04 13.05 18.04"
							fill="none"
							stroke="var(--color-accent)"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="3"
						/>
						<path
							d="M49.83,47V12c-13.57.44-17.89,6-17.89,6s-5.44-6.23-17.88-6V47a44.38,44.38,0,0,1,17.88,5S41.8,47.33,49.83,47Z"
							fill="none"
							stroke="var(--color-accent)"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="3"
						/>
						<line
							x1="31.94"
							x2="31.94"
							y1="18.04"
							y2="51.97"
							fill="none"
							stroke="var(--color-accent)"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="3"
						/>
					</svg>
				</Link>
			</h2>
			<input type="hidden" name="id" value={data.id} />
			<input type="hidden" name="answered" value={answered} />
			<input type="hidden" name="type" value={data.topic} />
			<div className="text-2x">
				<div className="-mb-4 font-bold text-[var(--color-accent)]">Question: </div>
				<RichMarkdown interactive>{data.question}</RichMarkdown>
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
				<div className="text-gray-400 text-xs italic">
					Note: This question has more than one correct answer
				</div>
			)}
			{(!data.options || !data.options.length) && !data.hasCode && (
				<TextInput />
			)}

			<div
				className={clsx(
					'mt-4 overflow-hidden transition-opacity duration-500 ease-in-out',
					showAnswer ? 'h-auto opacity-100' : 'h-0 opacity-0',
				)}
			>
				<div className="font-bold text-[var(--color-accent)]">Answer: </div>
				<RichMarkdown>{data.answer}</RichMarkdown>
			</div>
			<div className="tems-center mt-12 grid grid-cols-1 gap-y-4 sm:grid-cols-3">
				<Button
					type="button"
					className="sm:justify-self-start"
					disabled={isLoading}
					onClick={() => setShowAnswer((ans) => !ans)}
					bgColor={isLoading ? 'gray' : buttonColor}
				>
					{!showAnswer ? 'Show' : 'Hide'} Answer
				</Button>
				<a
					href={`/report?id=${data.id}`}
					target="_blank"
					className="inline-flex transform items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 text-sm shadow-xs transition-all duration-200 hover:border-gray-400 hover:bg-gray-50 hover:shadow-md focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:justify-self-center"
					rel="noreferrer"
				>
					<svg
						role="alert"
						width="25px"
						height="25px"
						fill="none"
						viewBox="-.5 0 25 25"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="m10.881 16.15c0-0.1479 0.0292-0.2944 0.0861-0.4309 0.057-0.1366 0.1403-0.2605 0.2454-0.3646s0.2298-0.1864 0.3668-0.2421c0.1371-0.0557 0.2837-0.0837 0.4317-0.0824 0.2182 4e-3 0.4304 0.0721 0.6101 0.196 0.1796 0.1239 0.3189 0.2981 0.4001 0.5006 0.0813 0.2026 0.1009 0.4246 0.0567 0.6383-0.0443 0.2137-0.1506 0.4096-0.3056 0.5633-0.155 0.1536-0.3518 0.2581-0.5659 0.3005s-0.436 0.0207-0.6378-0.0624c-0.2019-0.083-0.3747-0.2237-0.497-0.4045-0.1223-0.1807-0.1886-0.3935-0.1906-0.6118zm0.3599-2.73-0.14-5.22c-0.0133-0.12548 0-0.25235 0.039-0.37237 0.0389-0.12003 0.1026-0.23054 0.187-0.32434 0.0844-0.09381 0.1876-0.16881 0.3028-0.22016 0.1153-0.05134 0.2401-0.07788 0.3662-0.07788 0.1262 0 0.251 0.02654 0.3663 0.07788 0.1152 0.05135 0.2184 0.12635 0.3028 0.22016 0.0844 0.0938 0.1481 0.20431 0.187 0.32434 0.039 0.12002 0.0523 0.24689 0.039 0.37237l-0.13 5.22c0 0.2015-0.08 0.3949-0.2226 0.5374-0.1425 0.1425-0.3359 0.2226-0.5374 0.2226-0.2016 0-0.3949-0.0801-0.5374-0.2226s-0.2227-0.3359-0.2227-0.5374z"
							fill="currentColor"
						/>
						<path
							d="m12 21.5c5.1086 0 9.25-4.1414 9.25-9.25 0-5.1086-4.1414-9.25-9.25-9.25-5.1086 0-9.25 4.1414-9.25 9.25 0 5.1086 4.1414 9.25 9.25 9.25z"
							stroke="currentColor"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="1.5"
						/>
					</svg>
					Report a problem
				</a>
				{isLoading ? (
					<LoadingButton className="sm:justify-self-end" text="Loading" />
				) : (
					<NextButton
						className="sm:justify-self-end"
						bgColor={buttonColor}
						text="Next"
						topic={topic}
						entries={topics}
					/>
				)}
			</div>
		</Form>
	);
}
