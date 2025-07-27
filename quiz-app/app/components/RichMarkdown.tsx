import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

import { Markdown } from '~/components/Markdown';
import ghcolors from '~/lib/ghcolors';

import {
	isLanguageEditSupported,
	isLanguageSupported,
} from '~/lib/languageServer';
import type { CodeEditorProps } from './CodeEditor';

interface RichMarkdownProps {
	interactive?: boolean;
	children: string;
}

// Dynamic import hook for client-only components
const useCodeEditor = () => {
	const [CodeEditor, setCodeEditor] =
		useState<React.ComponentType<CodeEditorProps> | null>(null);

	useEffect(() => {
		import('./CodeEditor').then((module) => {
			setCodeEditor(() => module.default);
		});
	}, []);

	return CodeEditor;
};

export const RichMarkdown = ({ interactive, children }: RichMarkdownProps) => {
	const CodeEditor = useCodeEditor();

	return (
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
						<div className="pt-[0.6rem]">
							<SyntaxHighlighter
								style={ghcolors}
								language={language}
								wrapLongLines
								codeTagProps={{
									className:
										'text-[14px] leading-[1.38] font-[monospace] px-[1.1rem] block text-nowrap!',
								}}
							>
								{`${code}\n\n`}
							</SyntaxHighlighter>
						</div>
					);

					// Only render CodeEditor on client after component is loaded
					if (CodeEditor) {
						if (interactive && isLanguageEditSupported(language)) {
							return (
								<>
									<CodeEditor value={`${code}\n`} lang={language} />

									<div className="mt-4 text-gray-400 text-xs italic">
										Note: On the real exam you don't have to write code
									</div>
								</>
							);
						}

						if (isLanguageSupported(language)) {
							return (
								<CodeEditor readOnly value={`${code}\n`} lang={language} />
							);
						}
					}

					return highlightedCode;
				},
			}}
		>
			{children}
		</Markdown>
	);
};
