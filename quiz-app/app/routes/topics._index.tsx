import type { MetaFunction } from 'react-router';
import { Link } from 'react-router';

import { InputStyle } from '~/components/Input';
import { topics } from '~/lib/qa';

export const meta: MetaFunction = () => {
	return [{ title: 'Developing Solutions for Microsoft Azure: Topics' }];
};

export default function Index() {
	return (
		<ul className="list-none p-0">
			{topics.map((topic: string, idx: number) => (
				<li key={`${topic}-${idx}`} className="mb-2">
					<Link
						className={`${InputStyle} text-[var(--color-accent)] font-semibold underline`}
						to={`/topics/${topic}?seed=${Math.floor(Math.random() * 1e9)}`}
					>
						{topic}{' '}
					</Link>
				</li>
			))}
		</ul>
	);
}
