import clsx from 'clsx';
import { type FormEventHandler, useState, useEffect, useMemo } from 'react';
import type { LoaderFunctionArgs, MetaFunction } from 'react-router';
import { Form, Link, useLoaderData, useParams } from 'react-router';
import { useSearchParams } from 'react-router';

import { AnswerOptions } from '~/components/AnswerOptions';
import { Button } from '~/components/Button';
import { TextInput } from '~/components/Input';
import { RichMarkdown } from '~/components/RichMarkdown';
import { getQuestionsByTopic } from '~/lib/qa';

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
	const url = new URL(request.url);
	const seed = url.searchParams.get('seed');
	return getQuestionsByTopic(params.name || '', seed ? parseInt(seed, 10) : undefined);
};

export const meta: MetaFunction = ({ params }) => {
	return [
		{ title: `Developing Solutions for Microsoft Azure: ${params.name}` },
	];
};

export default function Topic() {
	const loaderQuestions = useLoaderData<typeof loader>();
	// Memoize questions so they don't reshuffle on theme change or unrelated re-renders
	const questions = useMemo(() => loaderQuestions, [loaderQuestions]);
	const params = useParams();
	const [searchParams, setSearchParams] = useSearchParams();

	// Memoize initial index calculation
	const initialIndex = useMemo(() => {
		const questionId = searchParams.get('id');
		return questionId ? questions.findIndex(q => q.id === questionId) : 0;
	}, [questions, searchParams]);
	const [index, setIndex] = useState(initialIndex);

	useEffect(() => {
		// Only update URL when index changes due to user action
		if (questions[index]) {
			setSearchParams(paramsObj => ({
				...paramsObj,
				id: questions[index].id,
			}));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [index]);

	const [checkedValues, setCheckedValues] = useState<number[]>([]);
	const [showAnswer, setShowAnswer] = useState(false);

	const question = questions[index] ?? null;

	const isCorrectlyAnswered =
		question?.answerIndexes?.length > 0 &&
		question.answerIndexes.length === checkedValues.length &&
		question.answerIndexes.every((value) => checkedValues.includes(value));

	const buttonColor = showAnswer || isCorrectlyAnswered ? 'green' : 'blue';

	const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault();
		setCheckedValues([]);
		setShowAnswer(false);
		if (index < questions.length - 1) {
			setIndex(index + 1);
		}
		return false;
	};

	return (
		<Form method="post" onSubmit={handleSubmit}>
			<h2 className="mt-0 text-center">
				<Link
					to={'/topics'}
					className="text-[var(--color-accent)] font-semibold underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] transition-colors duration-300"
					style={{ color: 'var(--color-accent)' }}
					>
					← Back to Topics
				</Link>
			</h2>
			{question ? (
				<>
					<div className="text-2x">
						<span
							className="font-bold text-[var(--color-accent)] transition-colors duration-300"
							style={{ color: 'var(--color-accent)' }}
						>
							{params.name} ({index + 1} / {questions.length}):{' '}
						</span>
						<RichMarkdown interactive>{question.question}</RichMarkdown>
					</div>
						{question.options?.length > 0 && (
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
						{question.answerIndexes?.length > 1 && (
							<div className="text-gray-400 text-xs italic">
								Note: This question has more than one correct answer
							</div>
						)}
					{(!question.options?.length) && !question.hasCode && <TextInput />}

					<div
						className={clsx(
							'mt-4 overflow-hidden transition-opacity duration-500 ease-in-out',
							showAnswer ? 'h-auto opacity-100' : 'h-0 opacity-0',
						)}
					>
						<div className="font-bold">Answer: </div>
						<RichMarkdown>{question.answer}</RichMarkdown>
					</div>
					<div className="mt-12 flex justify-between">
												<Button
													type="button"
													onClick={() => setShowAnswer((ans) => !ans)}
													bgColor={buttonColor}
												>
													{!showAnswer ? 'Show' : 'Hide'} Answer
												</Button>
												<Button bgColor={buttonColor} type="submit">
													Next
												</Button>
					</div>
				</>
			) : (
				<div className="text-center text-7xl italic">All done! 🎉</div>
			)}
		</Form>
	);
}
