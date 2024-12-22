import { type MetaFunction } from '@remix-run/node'
import { Link } from '@remix-run/react'

import { InputStyle } from '~/components/Input'
import { topics } from '~/lib/qa'

export const meta: MetaFunction = () => {
	return [{ title: 'Developing Solutions for Microsoft Azure: Topics' }]
}

export default function Index() {
	return (
		<ul className="list-none p-0">
			{topics.map((topic: string, index: number) => (
				<li key={index} className="mb-2">
					<Link className={InputStyle} to={`/topics/${topic}`}>
						{topic}{' '}
					</Link>
				</li>
			))}
		</ul>
	)
}
