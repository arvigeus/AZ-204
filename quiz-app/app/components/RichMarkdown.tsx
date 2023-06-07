import Markdown from "markdown-to-jsx";
import { Children, useEffect, useRef } from "react";
import type { ReactNode, ReactElement } from "react";
import clsx from "clsx";

import hljs from "highlight.js";

import CodeEditor from "~/components/CodeEditor";

interface CodeWrapperProps {
  children: ReactNode;
  className: string;
}

function CodeBlock({ children, className, ...props }: CodeWrapperProps) {
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!codeRef.current) return;
    hljs.highlightElement(codeRef.current);
  }, [children]);

  return (
    <pre className="bg-transparent p-0 my-0">
      <code ref={codeRef} className={clsx(className, "!py-2 !px-6")} {...props}>
        {children}
      </code>
    </pre>
  );
}

const InlineCode = ({ children, ...props }: CodeWrapperProps) => {
  return <code {...props}>{children}</code>;
};

const CodeWrapper = ({ children, ...props }: CodeWrapperProps) => {
  if (Children.count(children) === 1) {
    const child = Children.only(children) as ReactElement;
    if (child.type === InlineCode) {
      const value = child.props.children as string;
      const { className } = child.props; // Getting all properties of the code element

      const language = className ? className.split("-")[1] : null;

      if (language && ["cs", "ps", "Dockerfile"].includes(language))
        return <CodeEditor value={value + "\n"} lang={language} />;
      // NOTE: Use `csharp` or `powershell` to create immutable code block
      else return <CodeBlock {...props}>{value}</CodeBlock>;
    }
  }

  return <pre {...props}>{children}</pre>;
};

const interactiveOverrides = {
  pre: {
    component: CodeWrapper,
  },
  code: {
    component: InlineCode,
  },
};

const staticOverrides = {
  pre: {
    component: CodeBlock,
  },
  code: {
    component: InlineCode,
  },
};

interface RichMarkdownProps {
  interactive?: boolean;
  children: string;
}

export function RichMarkdown({ interactive, children }: RichMarkdownProps) {
  return (
    <Markdown
      options={{
        overrides: interactive ? interactiveOverrides : staticOverrides,
      }}
    >
      {children}
    </Markdown>
  );
}
