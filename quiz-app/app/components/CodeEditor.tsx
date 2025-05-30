import { langs } from '@uiw/codemirror-extensions-langs';
import { useEffect, useMemo, useState } from 'react';
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
	const [CodeMirror, setCodeMirror] = useState<React.ComponentType<ReactCodeMirrorProps> | null>(null);
	const [theme, setTheme] = useState<any>(null);

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
		// Dynamically import both CodeMirror and theme on client
		Promise.all([
			import('@uiw/react-codemirror'),
			import('@uiw/codemirror-theme-github')
		]).then(([codeMirrorModule, themeModule]) => {
			setCodeMirror(() => codeMirrorModule.default);
			// Handle both named export and default export patterns
			setTheme(themeModule.githubLight || themeModule.default?.githubLight || themeModule.default);
		});
	}, []);

	// Server-side fallback - render syntax highlighted code
	if (!isClient || !CodeMirror || !theme) {
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
					className: 'text-sm px-[1.5rem] py-[0.5rem]',
				}}
			>
				{String(value)}
			</SyntaxHighlighter>
		);
	}

	// Client-side CodeMirror
	return (
		<CodeMirror
			theme={theme}
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