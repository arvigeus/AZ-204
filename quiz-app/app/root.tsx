import highlight from 'highlight.js/styles/github.css?url';
import type { LinksFunction } from 'react-router';
import {
	Link,
	Links,
	Meta,
	Outlet,
	Scripts,
	// ScrollRestoration,
} from 'react-router';
import stylesheet from '~/tailwind.css?url';
import { useEffect, useState, useCallback, useMemo } from 'react';

export const links: LinksFunction = () => [
	{ rel: 'stylesheet', href: stylesheet },
	{ rel: 'stylesheet', href: highlight },
];

export default function App() {
	/**
	 * Theme state: true for dark, false for light
	 */
	const [isDark, setIsDark] = useState(false);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
		const storedTheme = localStorage.getItem('theme');
		if (storedTheme === 'dark') {
			document.documentElement.classList.add('dark');
			setIsDark(true);
		} else {
			document.documentElement.classList.remove('dark');
			setIsDark(false);
		}
	}, []);

	const toggleTheme = useCallback(() => {
		setIsDark((prev) => {
			const newTheme = !prev;
			if (newTheme) {
				document.documentElement.classList.add('dark');
				localStorage.setItem('theme', 'dark');
			} else {
				document.documentElement.classList.remove('dark');
				localStorage.setItem('theme', 'light');
			}
			return newTheme;
		});
	}, []);

	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width,initial-scale=1" />
				<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
				<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
				<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
				<link rel="manifest" href="/site.webmanifest" />
				<Meta />
				<Links />
			</head>
			<body className="h-screen w-full antialiased bg-[var(--color-bg)] text-[var(--color-text)]">
				<a href="#main-content" className="skip-link absolute left-2 top-2 z-50 bg-[var(--color-accent)] text-white px-4 py-2 rounded focus:translate-y-0 focus:outline focus:outline-2 focus:outline-[var(--color-accent)] -translate-y-20 transition-transform duration-200" tabIndex={0}>
					Skip to main content
				</a>
				<div className="flex h-screen w-full justify-center pt-6 antialiased bg-[var(--color-bg)] text-[var(--color-text)]">
					<div className="flex w-full max-w-3xl flex-col justify-between p-3">
						<main id="main-content" className="prose max-w-3xl grow">
							<div className="flex justify-between items-center">
								<div className="flex flex-col items-center w-full">
									<h1 className="font-bold text-5xl text-[var(--color-accent)]">
										<Link
											to="/"
											className="flex justify-center text-[var(--color-accent)] font-semibold underline"
										>
											AZ-204 Quiz
										</Link>
									</h1>
								</div>
								{mounted && (
									<button
										type="button"
										className="ml-4 rounded px-3 py-2 border shadow transition bg-[var(--color-surface)] text-[var(--color-text)] border-[var(--color-border)] hover:bg-[var(--color-bg)]"
										onClick={toggleTheme}
										aria-label="Toggle dark mode"
										tabIndex={0}
									>
										{isDark ? '🌙 Dark' : '☀️ Light'}
									</button>
								)}
							</div>
							<div className="mt-6 w-full rounded-lg p-8 shadow-lg bg-[var(--color-surface)]">
								<Outlet />
							</div>
							<small className="mt-2 block text-center">
								Exam revision: April 11, 2025
							</small>
						</main>
						<footer className="mt-6 text-center">
							<div className="flex items-center justify-center">
								<a
									href="https://github.com/arvigeus/AZ-204"
									target="_blank"
									title="Viewing existing code on GitHub"
									rel="noreferrer"
									aria-label="GitHub repository"
								>
									<svg
										role="img"
										aria-label="GitHub"
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										viewBox="0 0 24 24"
									>
										<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
									</svg>
								</a>
							</div>
						</footer>
					</div>
				</div>
				{/* <ScrollRestoration /> */}
				<Scripts />
			</body>
		</html>
	);
}
