/// <reference types="vite/client" />
/// <reference types="react-router" />

// Enhance TypeScript's built-in typings.
import '@total-typescript/ts-reset';

declare global {
	/**
	 * A global `process` object is only available during build to access NODE_ENV.
	 */
	const process: { env: { NODE_ENV: 'production' | 'development' } };
}

declare module 'react-router' {
	interface AppLoadContext
		extends Awaited<ReturnType<typeof createAppLoadContext>> {
		// to change context type, change the return of createAppLoadContext() instead
	}

	// TODO: remove this once we've migrated our loaders to `Route.LoaderArgs`
	interface LoaderFunctionArgs {
		context: AppLoadContext;
	}

	// TODO: remove this once we've migrated our loaders to `Route.ActionArgs`
	interface ActionFunctionArgs {
		context: AppLoadContext;
	}
}
