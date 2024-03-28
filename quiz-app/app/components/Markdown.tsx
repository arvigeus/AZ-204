import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import type { Options } from "react-markdown";

export type MarkdownOptions = Omit<Options, "remarkPlugins">;

export const Markdown = (options: MarkdownOptions) => (
  <ReactMarkdown remarkPlugins={[remarkGfm]} {...options} />
);
