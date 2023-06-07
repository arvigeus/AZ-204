import CodeMirror from "@uiw/react-codemirror";
import type { ReactCodeMirrorProps } from "@uiw/react-codemirror";
import { githubLight } from "@uiw/codemirror-theme-github";
import { langs } from "@uiw/codemirror-extensions-langs";

import { InputStyle } from "~/components/Input";
import { useMemo } from "react";

type CodeEditorProps = Omit<
  ReactCodeMirrorProps,
  "extensions" | "theme" | "basicSetup"
> & {
  lang: "cs" | "ps" | "Dockerfile";
};

function CodeEditor({ lang, ...props }: CodeEditorProps) {
  const languate = useMemo(() => {
    switch (lang) {
      case "ps":
        return langs.powershell();
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
      className={InputStyle}
      basicSetup={{
        lineNumbers: false,
        foldGutter: false,
        highlightActiveLine: false,
      }}
    />
  );
}
export default CodeEditor;
