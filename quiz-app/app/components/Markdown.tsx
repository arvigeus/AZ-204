import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import type { ReactMarkdownOptions } from "react-markdown/lib/react-markdown";

export type MarkdownOptions = Omit<ReactMarkdownOptions, "remarkPlugins">;

export const Markdown = (options: MarkdownOptions) => (
  <ReactMarkdown remarkPlugins={[remarkGfm]} {...options} />
);
