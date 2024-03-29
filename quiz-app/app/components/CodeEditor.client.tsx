import CodeMirror from "@uiw/react-codemirror";
import type { ReactCodeMirrorProps } from "@uiw/react-codemirror";
import { githubLight } from "@uiw/codemirror-theme-github";
import { langs } from "@uiw/codemirror-extensions-langs";

import { InputStyle } from "~/components/Input";
import { useMemo } from "react";

import type { SupportedLanguage } from "~/lib/languageServer";

type CodeEditorProps = Omit<
  ReactCodeMirrorProps,
  "extensions" | "theme" | "basicSetup"
> & {
  lang: SupportedLanguage;
};
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
