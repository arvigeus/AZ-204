import type { LinksFunction } from "@remix-run/node";
import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  // ScrollRestoration,
} from "@remix-run/react";

import stylesheet from "~/tailwind.css?url";
import highlight from "highlight.js/styles/github.css?url";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  { rel: "stylesheet", href: highlight },
];

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest"></link>
        <Meta />
        <Links />
      </head>
      <body className="antialiased text-gray-700 bg-gray-100 w-full h-screen ">
        <div className="antialiased text-gray-700 bg-gray-100 flex w-full h-screen justify-center pt-6">
          <div className="w-full max-w-3xl p-3 flex flex-col justify-between">
            <main className="flex-grow prose max-w-3xl">
              <h1 className="font-bold text-5xl text-center text-indigo-700">
                <Link to="/">AZ-204 Quiz</Link>
              </h1>
              <div className="bg-white p-8 rounded-lg shadow-lg w-full mt-6">
                <Outlet />
              </div>
              <small className="block text-center mt-2">
                Exam revision: August 21, 2023
              </small>
            </main>
            <footer className="text-center mt-6">
              <div className="flex justify-center items-center">
                <a
                  href="https://github.com/arvigeus/AZ-204"
                  target="_blank"
                  title="Viewing existing code on GitHub"
                  rel="noreferrer"
                >
                  <svg
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
