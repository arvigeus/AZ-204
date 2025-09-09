import { type LoaderFunctionArgs, redirect } from 'react-router';
import { data } from '~/lib/qa';

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const url = new URL(request.url);
	const id = url.searchParams.get('id');

	if (!id) throw new Response('Missing id parameter', { status: 400 });

	const question = data.find((item) => item.id === id);
	if (!question) throw new Response('Invalid id parameter', { status: 400 });

	const title = encodeURIComponent(`Report a problem: ${question.id}`);

	// Check if issue already exists
	const searchUrl = `https://api.github.com/search/issues?q=repo:arvigeus/AZ-204+type:issue+in:title+${encodeURIComponent(title)}`;

	try {
		const searchResponse = await fetch(searchUrl);
		if (searchResponse.ok) {
			const searchData = (await searchResponse.json()) as {
				items?: Array<{ html_url: string }>;
			};
			if (
				searchData.items &&
				searchData.items.length > 0 &&
				searchData.items[0].html_url
			) {
				return redirect(searchData.items[0].html_url);
			}
		}
	} catch (error) {
		// If search fails, continue with creating new issue
		console.error('Failed to search for existing issues:', error);
	}

	const fullBody = `<!--- Describe the issue -->\n\n---\n\n${question.question}\n\n${
		question.options.length > 0
			? `${question.options
					.map(
						(option, index) =>
							`- [${question.answerIndexes.includes(index) ? 'x' : ' '}] ${option}`,
					)
					.join('\n')}\n\n`
			: ''
	}Answer: ${question.answer}`;
	const maxBodyLength = 4000;
	const body =
		fullBody.length > maxBodyLength
			? encodeURIComponent(
					`${fullBody.substring(0, maxBodyLength)}...\n\n[Content truncated due to length]`,
				)
			: encodeURIComponent(fullBody);

	const githubIssueUrl = `https://github.com/arvigeus/AZ-204/issues/new?title=${title}&body=${body}`;

	return redirect(githubIssueUrl);
};
