import { langs } from '@uiw/codemirror-extensions-langs';
import { githubLight } from '@uiw/codemirror-theme-github';
import CodeMirror, { type ReactCodeMirrorProps } from '@uiw/react-codemirror';

import { useMemo } from 'react';
import { InputStyle } from '~/components/Input';

import type { SupportedLanguage } from '~/lib/languageServer';

type CodeEditorProps = Omit<
    ReactCodeMirrorProps,
    'extensions' | 'theme' | 'basicSetup'
> & {
    lang: SupportedLanguage;
};
const CodeEditor = ({ lang, ...props }: CodeEditorProps) => {
    const languate = useMemo(() => {
        switch (lang) {
            case 'ps':
            case 'powershell':
                return langs.powershell();
            case 'docker':
            case 'Dockerfile':
                return langs.dockerfile();
            case 'jsonc':
                return langs.json();
            case 'sql':
                return langs.sql();
            case 'tsql':
                return langs.sql();
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

export default CodeEditor;