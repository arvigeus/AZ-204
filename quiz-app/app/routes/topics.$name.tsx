import clsx from 'clsx';
import { type FormEventHandler, useState } from 'react';
import type { LoaderFunctionArgs, MetaFunction } from 'react-router';
import { Form, Link, useLoaderData, useParams } from 'react-router';

import { AnswerOptions } from '~/components/AnswerOptions';
import { Button } from '~/components/Button';
import { TextInput } from '~/components/Input';
import { RichMarkdown } from '~/components/RichMarkdown';
import { getQuestionsByTopic } from '~/lib/qa';

export const loader = async ({ params }: LoaderFunctionArgs) => {
	return getQuestionsByTopic(params.name || '');
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
		question?.answerIndexes &&
		question.answerIndexes.length > 0 &&
		question.answerIndexes.length === checkedValues.length &&
		question.answerIndexes.every((value) => checkedValues.includes(value));

	const buttonColor = showAnswer || isCorrectlyAnswered ? 'green' : 'blue';

	const handleSubmit: FormEventHandler<HTMLFormElement | HTMLButtonElement> = (
		e,
	) => {
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
				<Link to={'/topics'}>← Back to Topics</Link>
			</h2>
			{question ? (
				<>
					<div className="text-2x">
						<span className="font-bold">
							{params.name} ({index + 1} / {questions.length}):{' '}
						</span>
						<RichMarkdown interactive>{question.question}</RichMarkdown>
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
						<div className="text-gray-400 text-xs italic">
							Note: This question has more than one correct answer
						</div>
					)}
					{(!question.options || !question.options.length) &&
						!question.hasCode && <TextInput />}

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
						<Button bgColor={buttonColor} type="submit" onSubmit={handleSubmit}>
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
