import clsx from 'clsx';
import { type ChangeEvent, useEffect, useRef, useState } from 'react';

export const InputStyle =
	'block mt-4 rounded-lg py-2 px-6 text-lg wrap-break-word bg-[var(--color-surface)] text-[var(--color-text)] ';

export const TextInput = () => {
	const [text, setText] = useState<string>('');
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	useEffect(() => {
		if (textareaRef.current) {
			textareaRef.current.style.height = 'auto';
			textareaRef.current.style.height = `${
				textareaRef.current.scrollHeight + 2
			}px`;
		}
	}, []);

	const onChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
		setText(event.target.value);
	};

	return (
		<textarea
			placeholder="Your answer here..."
			ref={textareaRef}
			value={text}
			className={clsx(InputStyle, 'w-full resize-none focus:outline-hidden')}
			onChange={onChangeHandler}
		/>
	);
};
