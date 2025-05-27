export type SupportedEditLanguage = 'cs' | 'ps' | 'docker' | 'jsonc' | 'tsql'

export type SupportedLanguage =
	| 'csharp'
	| 'powershell'
	| 'Dockerfile'
	| 'json'
	| 'sql'
	| SupportedEditLanguage

export function isLanguageEditSupported(
	lang: string,
): lang is SupportedEditLanguage {
	return ['cs', 'ps', 'docker', 'jsonc', 'tsql'].includes(lang.toLowerCase())
}

export function isLanguageSupported(
	lang: string,
): lang is SupportedEditLanguage {
	return [
		'csharp',
		'cs',
		'powershell',
		'ps',
		'dockerfile',
		'docker',
		'json',
		'sql',
		'tsql',
	].includes(lang.toLowerCase())
}
