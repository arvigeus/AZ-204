export type SupportedEditLanguage = "cs" | "ps" | "docker" | "jsonc";

export type SupportedLanguage =
  | "csharp"
  | "powershell"
  | "Dockerfile"
  | "json"
  | SupportedEditLanguage;

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
