import clsx from 'clsx';
import {
	type ButtonHTMLAttributes,
	type FC,
	useEffect,
	useRef,
	useState,
} from 'react';
import { useResults } from '~/root';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	bgColor: 'blue' | 'green' | 'gray';
}

const btnStyle =
	'flex items-center justify-center text-center font-medium text-xs sm:text-sm px-2.5 py-4 sm:px-5 sm:py-2.5 shadow-xs transition-all duration-200 focus:outline-hidden focus:ring-2 focus:ring-offset-2';

const getColor = (color: ButtonProps['bgColor']) => {
	switch (color) {
		case 'blue':
			return 'bg-blue-600 hover:bg-blue-700 hover:shadow-md border border-blue-700 text-white focus:ring-blue-500';
		case 'green':
			return 'bg-green-600 hover:bg-green-700 hover:shadow-md border border-green-700 text-white focus:ring-green-500';
		case 'gray':
			return 'bg-gray-300 hover:bg-gray-300 hover:shadow-md border border-gray-300 text-white';
		default:
			return '';
	}
};

export const Button: FC<ButtonProps> = ({ bgColor, className, ...props }) => {
	const style = clsx(btnStyle, getColor(bgColor), 'rounded-lg', className);
	return <button className={style} {...props} />;
};

type LoadingButtonProps = Omit<
	ButtonHTMLAttributes<HTMLButtonElement>,
	'disabled' | 'type'
> & { text: string };

export const LoadingButton: FC<LoadingButtonProps> = ({
	text,
	className,
	...props
}) => {
	const style = clsx(btnStyle, getColor('gray'), 'rounded-lg', className);
	return (
		<button disabled type="button" className={style} {...props}>
			<svg
				aria-hidden="true"
				className="mr-3 inline h-4 w-4 animate-spin text-gray-400"
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
					fill="#6366f1"
				/>
			</svg>
			{text}
		</button>
	);
};

type NextButtonProps = {
	className?: string;
	bgColor: ButtonProps['bgColor'];
	text: string;
	topic?: string | null;
	entries: string[];
	userPutcorrectAnswer: Boolean;
	shouldUpdateTotalAnswers: Boolean;
};

export const NextButton: FC<NextButtonProps> = ({
	className,
	bgColor,
	text,
	topic,
	entries,
	userPutcorrectAnswer,
	shouldUpdateTotalAnswers
}) => {
	const [showDropdown, setShowDropdown] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setShowDropdown(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	const getMainButtonColor = (color: ButtonProps['bgColor']) =>
		color === 'blue'
			? 'bg-blue-600 hover:bg-blue-700 border-blue-700 text-white'
			: 'bg-green-600 hover:bg-green-700 border-green-700 text-white';

	const getDropdownButtonColor = (color: ButtonProps['bgColor']) =>
		color === 'blue'
			? 'bg-blue-700 hover:bg-blue-800 border-blue-700 text-white'
			: 'bg-green-700 hover:bg-green-800 border-green-700 text-white';

	const getFocusRing = (color: ButtonProps['bgColor']) =>
		color === 'blue' ? 'focus:ring-blue-500' : 'focus:ring-green-500';

	const increaseTotalQuestions = useResults((state:any) => state.increaseTotalQuestions)
	const increaseCorrectAnswer = useResults((state:any) => state.increaseCorrectAnswer)


	const handleNextClick = () => {
		if (shouldUpdateTotalAnswers) {
			increaseTotalQuestions();

		}
		if (userPutcorrectAnswer) {
			increaseCorrectAnswer();
		}
	}
	

	return (
		<div
			className={clsx(
				'flex h-auto rounded-lg shadow-xs transition-all duration-200 hover:shadow-md',
				'focus-within:ring-2 focus-within:ring-offset-2',
				className,
				getFocusRing(bgColor),
			)}
		>
			<button
				type="submit"
				name="topic"
				value={topic ?? ''}
				className={clsx(
					'flex h-full w-full items-center justify-center rounded-l-lg border border-r-0 py-4 focus:z-10 focus:outline-hidden',
					'px-2.5 py-1 font-medium text-xs sm:px-5 sm:py-2.5 sm:text-sm',
					getMainButtonColor(bgColor),
				)}
									onClick={handleNextClick}

			>
				{text}
				<svg
					aria-hidden="true"
					className="-mr-1 ml-2 h-5 w-5"
					fill="currentColor"
					viewBox="0 0 20 20"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						fillRule="evenodd"
						d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
						clipRule="evenodd"
					/>
				</svg>
			</button>
			<div className="relative flex" ref={dropdownRef}>
				<button
					onClick={() => setShowDropdown((prev) => !prev)}
					type="button"
					className={clsx(
						'flex h-full items-center justify-center rounded-r-lg border focus:z-10 focus:outline-hidden sm:w-11',
						getDropdownButtonColor(bgColor),
					)}
				>
					<svg
						className="h-4 w-4"
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
						/>
					</svg>
				</button>

				<div
					className={clsx(
						'absolute right-0 z-10 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg',
						'divide-y divide-gray-100',
						{ hidden: !showDropdown },
					)}
				>
					<ul
						className="m-0 list-none px-0 py-1 text-gray-700 text-sm"
						aria-labelledby="dropdownDefaultButton"
					>
						{entries.map((entry) => (
							<li key={entry} className="box-border p-0">
								<button
									type="submit"
									name="topic"
									value={entry}
									className="block w-full px-4 py-2 text-left transition-colors duration-150 hover:bg-gray-50 focus:bg-gray-50 focus:outline-hidden"
									role="menuitem"
									// onClick={increasePopulation}
									// onClick={() => console.log("next")}

								>
									{entry}
								</button>
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
};
