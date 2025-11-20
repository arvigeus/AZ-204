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
	const [mounted, setMounted] = useState(false);
	useEffect(() => {
		setMounted(true);
	}, []);

	return (
		<Markdown
			components={{
				a: (props) => (
					<a className={clsx(props.className, 'text-[var(--color-accent)] underline font-semibold')} {...props}>
						{props.children}
					</a>
				),
				p({ className, children, ...props }) {
					return (
						<p className={clsx(className, 'text-[var(--color-text)]')} {...props}>
							{children}
						</p>
					);
				},
				strong({ className, children, ...props }) {
					return (
						<strong className={clsx(className, 'text-[var(--color-accent)] font-bold')} {...props}>
							{children}
						</strong>
					);
				},
				li({ className, children, ...props }) {
					return (
						<li className={clsx(className, 'text-[var(--color-text)]')} {...props}>
							{children}
						</li>
					);
				},
				pre({ className, children, ...props }) {
					return (
						<pre className={clsx(className, 'my-0 bg-transparent p-0 bg-[var(--color-surface)] text-[var(--color-text)]', 'dark:text-white', 'light:text-[var(--color-text)]')} {...props}>
							{children}
						</pre>
					);
				},
				code({ className, children, ...props }) {
					const match = /language-(\w+)/.exec(className || '');
					if (!match)
						return (
							<code {...props} className={clsx(className, 'text-[var(--color-text)]')}>
								{children}
							</code>
						);
					let language = match[1] || '';
					const code = `${String(children).replace(/\n$/, '')}\n`;
					switch (language) {
						case 'Dockerfile':
							language = 'docker';
							break;
						default:
							break;
					}
					const isYaml = language === 'yaml' || language === 'yml';
					const yamlStyle = {
						background: 'var(--color-surface)',
						color: 'var(--color-text)',
						borderRadius: '0.5rem',
						border: '1px solid var(--color-border)',
						padding: '1em',
						fontFamily: 'monospace',
						fontSize: '1em',
						overflowX: 'auto' as 'auto',
					};
					const highlightedCode = (
						<div className="pt-[0.6rem]">
							<SyntaxHighlighter
								style={isYaml ? {} : ghcolors}
								language={language}
								wrapLongLines
								customStyle={isYaml ? yamlStyle : undefined}
								codeTagProps={{
									className:
										'text-[14px] leading-[1.38] font-[monospace] px-[1.1rem] block text-nowrap! text-[var(--color-text)]',
								}}
							>
								{`${code}\n\n`}
							</SyntaxHighlighter>
						</div>
					);
					// Only render CodeEditor on client after mount
					if (mounted && CodeEditor) {
						if (interactive && isLanguageEditSupported(language)) {
							return (
								<>
									<CodeEditor value={`${code}\n`} lang={language} />
									<div className="mt-4 text-[var(--color-text)] text-xs italic">
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
