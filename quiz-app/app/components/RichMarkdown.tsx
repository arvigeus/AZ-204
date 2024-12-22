import clsx from 'clsx'
import { lazy, Suspense } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
const CodeEditor = lazy(() => import('./CodeEditor'))
import { Markdown } from '~/components/Markdown'
import ghcolors from '~/lib/ghcolors'

import {
	isLanguageEditSupported,
	isLanguageSupported,
} from '~/lib/languageServer'

interface RichMarkdownProps {
	interactive?: boolean
	children: string
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
				)
			},
			code({ className, children, ...props }) {
				const match = /language-(\w+)/.exec(className || '')

				if (!match)
					return (
						<code {...props} className={className}>
							{children}
						</code>
					)

				let language = match[1] || ''
				const code = String(children).replace(/\n$/, '')

				// Fix language for highlighter
				switch (language) {
					case 'Dockerfile':
						language = 'docker'
						break
					default:
						break
				}

				if (interactive && isLanguageEditSupported(language))
					return (
						<Suspense
							fallback={
								<SyntaxHighlighter
									style={ghcolors}
									language={language}
									wrapLongLines
									codeTagProps={{
										className: 'text-sm px-[1.5rem] py-[0.5rem]',
									}}
								>
									{code}
								</SyntaxHighlighter>
							}
						>
							<CodeEditor value={code + '\n'} lang={language} />
						</Suspense>
					)

				if (isLanguageSupported(language))
					return (
						<Suspense
							fallback={
								<SyntaxHighlighter
									style={ghcolors}
									language={language}
									wrapLongLines
									codeTagProps={{
										className: 'text-sm px-[1.5rem] py-[0.5rem]',
									}}
								>
									{code + '\n'}
								</SyntaxHighlighter>
							}
						>
							<CodeEditor readOnly value={code + '\n'} lang={language} />
						</Suspense>
					)

				return (
					<SyntaxHighlighter
						style={ghcolors}
						language={language}
						wrapLongLines
						codeTagProps={{
							className: 'text-sm px-[1.5rem] py-[0.5rem]',
						}}
					>
						{code}
					</SyntaxHighlighter>
				)
			},
		}}
	>
		{children}
	</Markdown>
)
