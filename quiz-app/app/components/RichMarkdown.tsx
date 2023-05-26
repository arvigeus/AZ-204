import Markdown from "markdown-to-jsx";

import CodeEditor from "~/components/CodeEditor";

interface CodeWrapperProps {
  children: string;
  className: string;
}

const PreWrapper = ({ children }: any) => children;

const CodeWrapper = ({ children, className, ...props }: CodeWrapperProps) => {
  const language = className ? className.split("-")[1] : null;

  // NOTE: Use `csharp` or `powershell` to create immutable code block

  if (!language || !["cs", "ps"].includes(language))
    return (
      <pre>
        <code className={className} {...props}>
          {children}
        </code>
      </pre>
    );

  const value = children.trim()
    ? children
    : `${language === "cs" ? "//" : "#"} Enter your code here`;

  // @ts-expect-error lang is checked
  return <CodeEditor value={value} lang={language} />;
};

const overrides = {
  pre: {
    component: PreWrapper,
  },
  code: {
    component: CodeWrapper,
  },
};

interface RichMarkdownProps {
  children: string;
}

export function RichMarkdown({ children }: RichMarkdownProps) {
  return (
    <Markdown
      options={{
        overrides,
      }}
    >
      {children}
    </Markdown>
  );
}
