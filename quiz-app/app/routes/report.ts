import { type LoaderFunctionArgs, redirect } from '@remix-run/node'
import { data } from '~/lib/qa'

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const url = new URL(request.url)
	const id = url.searchParams.get('id')

	if (!id) throw new Response('Missing id parameter', { status: 400 })

	const index = data.findIndex((item) => item.id == id)
	if (index < 0) throw new Response('Invalid id parameter', { status: 400 })

	const question = data[index]!

	const title = encodeURIComponent(`Report a problem: ${question.id}`)
	const fullBody = `${question.question}\n\n${
		question.options.length > 0
			? question.options
					.map(
						(option, index) =>
							`- [${question.answerIndexes.includes(index) ? 'x' : ' '}] ${option}`,
					)
					.join('\n') + '\n\n'
			: ''
	}Answer: ${question.answer}`
	const maxBodyLength = 1500 // Conservative limit
	const body =
		fullBody.length > maxBodyLength
			? encodeURIComponent(
					`${fullBody.substring(0, maxBodyLength)}...\n\n[Content truncated due to length]`,
				)
			: encodeURIComponent(fullBody)

	const githubIssueUrl = `https://github.com/arvigeus/AZ-204/issues/new?title=${title}&body=${body}`

	return redirect(githubIssueUrl)
}
