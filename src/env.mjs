import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	/**
	 * Specify your server-side environment variables schema here. This way you can ensure the app
	 * isn't built with invalid env vars.
	 */
	server: {
		NODE_ENV: z.enum(["development", "test", "production"]),
		DATABASE_URL: z.string(),
		API_URL: z.string(),
		AZURE_AD_CLIENT_ID: z.string(),
		AZURE_AD_CLIENT_SECRET: z.string(),
		NEXTAUTH_SECRET: z.string(),
		NEXTAUTH_URL: z.string(),
		SKIP_FETCH_PARSE: z.boolean({ coerce: true }).optional(),
	},

	/**
	 * Specify your client-side environment variables schema here. This way you can ensure the app
	 * isn't built with invalid env vars. To expose them to the client, prefix them with
	 * `NEXT_PUBLIC_`.
	 */
	client: {
		// NEXT_PUBLIC_CLIENTVAR: z.string().min(1),
		NEXT_PUBLIC_API_URL: z.string(),
		NEXT_PUBLIC_MSAL_PUBLIC_CLIENT_ID: z.string(),
		NEXT_PUBLIC_SKIP_FETCH_PARSE: z.boolean({ coerce: true }).optional(),
	},

	/**
	 * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
	 * middlewares) or client-side so we need to destruct manually.
	 */
	runtimeEnv: {
		// NEXT_PUBLIC_CLIENTVAR: process.env.NEXT_PUBLIC_CLIENTVAR,
		// DATABASE_URL: process.env.DATABASE_URL,
		NODE_ENV: process.env.NODE_ENV,
		DATABASE_URL: process.env.DATABASE_URL,
		API_URL: process.env.API_URL,
		AZURE_AD_CLIENT_ID: process.env.AZURE_AD_CLIENT_ID,
		AZURE_AD_CLIENT_SECRET: process.env.AZURE_AD_CLIENT_SECRET,
		NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
		NEXTAUTH_URL: process.env.NEXTAUTH_URL,
		SKIP_FETCH_PARSE: process.env.SKIP_FETCH_PARSE,

		NEXT_PUBLIC_SKIP_FETCH_PARSE: process.env.NEXT_PUBLIC_SKIP_FETCH_PARSE,
		NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
		NEXT_PUBLIC_MSAL_PUBLIC_CLIENT_ID:
			process.env.NEXT_PUBLIC_MSAL_PUBLIC_CLIENT_ID,
	},
	/**
	 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
	 * This is especially useful for Docker builds.
	 */
	skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
