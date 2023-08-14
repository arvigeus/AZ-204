import CodeMirror from "@uiw/react-codemirror";
import type { ReactCodeMirrorProps } from "@uiw/react-codemirror";
import { githubLight } from "@uiw/codemirror-theme-github";
import { langs } from "@uiw/codemirror-extensions-langs";

import { InputStyle } from "~/components/Input";
import { useMemo } from "react";
import clsx from "clsx";

export type SupportedEditLanguage = "cs" | "ps" | "docker";

export type SupportedLanguage =
  | "csharp"
  | "powershell"
  | "Dockerfile"
  | SupportedEditLanguage;

type CodeEditorProps = Omit<
  ReactCodeMirrorProps,
  "extensions" | "theme" | "basicSetup"
> & {
  lang: SupportedLanguage;
};

export function isLanguageEditSupported(
  lang: string
): lang is SupportedEditLanguage {
  return ["cs", "ps", "docker"].includes(lang);
}

export function isLanguageSupported(
  lang: string
): lang is SupportedEditLanguage {
  return ["csharp", "cs", "powershell", "ps", "Dockerfile", "docker"].includes(
    lang
  );
}

export const CodeEditor = ({ lang, ...props }: CodeEditorProps) => {
  const languate = useMemo(() => {
    switch (lang) {
      case "ps":
      case "powershell":
        return langs.powershell();
      case "docker":
      case "Dockerfile":
        return langs.dockerfile();
      default:
        return langs.csharp();
    }
  }, [lang]);
  return (
    <CodeMirror
      theme={githubLight}
      extensions={[languate]}
      {...props}
      className={clsx(InputStyle, "rounded-lg")}
      basicSetup={{
        lineNumbers: false,
        foldGutter: false,
        highlightActiveLine: false,
      }}
    />
  );
};
