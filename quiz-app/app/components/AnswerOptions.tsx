import clsx from 'clsx';
import type { ChangeEventHandler, Dispatch, FC, SetStateAction } from 'react';
import { InputStyle } from '~/components/Input';
import { Markdown } from '~/components/Markdown';

interface AnswerOptionsProps {
	name: string;
	options: string[];
	checkedValues: number[];
	setCheckedValues: Dispatch<SetStateAction<number[]>>;
	showAnswer: boolean;
	answerIndexes: number[];
	disabled?: boolean;
}

export const AnswerOptions: FC<AnswerOptionsProps> = ({
	name,
	options,
	checkedValues,
	setCheckedValues,
	showAnswer,
	answerIndexes,
	disabled,
}) => {
	const handleChange: ChangeEventHandler<HTMLInputElement> = async (event) => {
		const { checked, value, type } = event.target;

		const index = Number.parseInt(value, 10);

		if (type === 'checkbox') {
			if (checked) {
				// Add to checked values
				setCheckedValues((prev) => [...prev, index]);
			} else {
				// Remove from checked values
				setCheckedValues((prev) => prev.filter((v) => v !== index));
			}
		} else if (type === 'radio') {
			if (checked) {
				// Set checked value to the selected radio button
				setCheckedValues([index]);
			}
		}
	};

	return (
		<ul className="list-none p-0">
			{options.map((option: string, index: number) => (
				<li key={option} className="mb-2">
					<label
						className={clsx(
							InputStyle,
							'border-[var(--color-border)]',
							(showAnswer || checkedValues.includes(index)) &&
								answerIndexes.includes(index)
								? 'bg-green-200 border border-[var(--color-border)]'
								: checkedValues.includes(index)
									? 'bg-red-200 border border-[var(--color-border)]'
									: 'bg-[var(--color-surface)] text-[var(--color-text)]',
						)}
					>
						<input
							type={answerIndexes.length < 2 ? 'radio' : 'checkbox'}
							checked={checkedValues.includes(index)}
							onChange={handleChange}
							className="hidden"
							value={index}
							name={name}
							disabled={disabled}
						/>
						<Markdown
							components={{
								p({ node, className, children, ...props }) {
									return (
										<p className={clsx(className, 'my-0! text-[var(--color-text)] ')} {...props}>
											{children}
										</p>
									);
								},
							}}
						>
							{option}
						</Markdown>
					</label>
				</li>
			))}
		</ul>
	);
};
