import clsx from 'clsx';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

import { Markdown } from '~/components/Markdown';
import ghcolors from '~/lib/ghcolors';
import CodeEditor from './CodeEditor';

import {
	isLanguageEditSupported,
	isLanguageSupported,
} from '~/lib/languageServer';

interface RichMarkdownProps {
	interactive?: boolean;
	children: string;
}

export const RichMarkdown = ({ interactive, children }: RichMarkdownProps) => (
	<Markdown
		components={{
			pre({ className, children, ...props }) {
				return (
					<pre
						className={clsx(className, 'my-0 bg-transparent p-0')}
						{...props}
					>
						{children}
					</pre>
				);
			},
			code({ className, children, ...props }) {
				const match = /language-(\w+)/.exec(className || '');

				if (!match)
					return (
						<code {...props} className={className}>
							{children}
						</code>
					);

				let language = match[1] || '';
				const code = `${String(children).replace(/\n$/, '')}\n`;

				// Fix language for highlighter
				switch (language) {
					case 'Dockerfile':
						language = 'docker';
						break;
					default:
						break;
				}

				const highlightedCode = (
					<SyntaxHighlighter
						style={ghcolors}
						language={language}
						wrapLongLines
						codeTagProps={{
							className: 'text-sm px-6 py-2',
						}}
					>
						{code}
					</SyntaxHighlighter>
				);

				if (interactive && isLanguageEditSupported(language))
					return <CodeEditor value={`${code}\n`} lang={language} />;

				if (isLanguageSupported(language))
					return <CodeEditor readOnly value={`${code}\n`} lang={language} />;

				return highlightedCode;
			},
		}}
	>
		{children}
	</Markdown>
);
