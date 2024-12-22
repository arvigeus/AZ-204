import ReactMarkdown, { type Options } from 'react-markdown'
import remarkGfm from 'remark-gfm'

export type MarkdownOptions = Omit<Options, 'remarkPlugins'>

export const Markdown = (options: MarkdownOptions) => (
	<ReactMarkdown remarkPlugins={[remarkGfm]} {...options} />
)
