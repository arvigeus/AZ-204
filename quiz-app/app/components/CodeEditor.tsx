import CodeMirror from "@uiw/react-codemirror";
import type { ReactCodeMirrorProps } from "@uiw/react-codemirror";
import { githubLight } from "@uiw/codemirror-theme-github";
import { langs } from "@uiw/codemirror-extensions-langs";

import { InputStyle } from "~/components/Input";
import { useMemo } from "react";

export type SupportedEditLanguage = "cs" | "ps" | "docker" | "jsonc";

export type SupportedLanguage =
  | "csharp"
  | "powershell"
  | "Dockerfile"
  | "json"
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
  return ["cs", "ps", "docker", "jsonc"].includes(lang.toLowerCase());
}

export function isLanguageSupported(
  lang: string
): lang is SupportedEditLanguage {
  return [
    "csharp",
    "cs",
    "powershell",
    "ps",
    "dockerfile",
    "docker",
    "json",
  ].includes(lang.toLowerCase());
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
      case "jsonc":
        return langs.json();
      default:
        return langs.csharp();
    }
  }, [lang]);
  return (
    <CodeMirror
      theme={githubLight}
      extensions={[languate]}
      {...props}
      className={InputStyle}
      basicSetup={{
        lineNumbers: false,
        foldGutter: false,
        highlightActiveLine: false,
      }}
    />
  );
};
