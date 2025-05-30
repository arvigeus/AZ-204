import { langs } from '@uiw/codemirror-extensions-langs';
import { githubLight } from '@uiw/codemirror-theme-github';
import { type ComponentType, useEffect, useMemo, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

import { InputStyle } from '~/components/Input';
import ghcolors from '~/lib/ghcolors';

import type { ReactCodeMirrorProps } from '@uiw/react-codemirror';
import type { SupportedLanguage } from '~/lib/languageServer';

type CodeEditorProps = Omit<
	ReactCodeMirrorProps,
	'extensions' | 'theme' | 'basicSetup'
> & {
	lang: SupportedLanguage;
};

const CodeEditor = ({ lang, value = '', ...props }: CodeEditorProps) => {
	const [isClient, setIsClient] = useState(false);
	const [CodeMirror, setCodeMirror] =
		useState<ComponentType<ReactCodeMirrorProps> | null>(null);

	const languageExtension = useMemo(() => {
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

	useEffect(() => {
		setIsClient(true);
		// Dynamically import CodeMirror only on client
		import('@uiw/react-codemirror').then((module) => {
			setCodeMirror(() => module.default);
		});
	}, []);

	// Server-side fallback - render syntax highlighted code
	if (!isClient || !CodeMirror) {
		// Map your languages to Prism language names
		const getPrismLanguage = (lang: SupportedLanguage): string => {
			switch (lang) {
				case 'ps':
				case 'powershell':
					return 'powershell';
				case 'docker':
				case 'Dockerfile':
					return 'docker';
				case 'jsonc':
					return 'json';
				case 'sql':
				case 'tsql':
					return 'sql';
				default:
					return 'csharp';
			}
		};

		return (
			<SyntaxHighlighter
				style={ghcolors}
				language={getPrismLanguage(lang)}
				wrapLongLines
				codeTagProps={{
					className: 'text-sm px-6 py-2',
				}}
			>
				{String(value)}
			</SyntaxHighlighter>
		);
	}

	// Client-side CodeMirror
	return (
		<CodeMirror
			theme={githubLight}
			extensions={[languageExtension]}
			value={value}
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
