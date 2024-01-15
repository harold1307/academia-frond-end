import { PrismaAdapter } from "@next-auth/prisma-adapter";
import {
	getServerSession,
	type DefaultSession,
	type NextAuthOptions,
	type TokenSet,
} from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";

import { env } from "../env.mjs";
import { db } from "./db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
	interface Session extends DefaultSession {
		user: {
			id: string;
			// ...other properties
			// role: UserRole;
		} & DefaultSession["user"];
		error?: "RefreshAccessTokenError" | "NotFoundAccountError";
	}

	// interface User {
	//   // ...other properties
	//   // role: UserRole;
	// }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
	secret: env.NEXTAUTH_SECRET,
	callbacks: {
		session: async ({ session, user }) => {
			const account = await db.account.findFirstOrThrow({
				where: { userId: user.id, provider: "azure-ad" },
			});

			if (account.expires_at! * 1000 < Date.now()) {
				// If the access token has expired, try to refresh it
				try {
					// https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration
					// We need the `token_endpoint`.
					const response = await fetch(
						"https://login.microsoftonline.com/common/oauth2/v2.0/token",
						{
							headers: { "Content-Type": "application/x-www-form-urlencoded" },
							body: new URLSearchParams({
								client_id: env.AZURE_AD_CLIENT_ID,
								client_secret: env.AZURE_AD_CLIENT_SECRET,
								grant_type: "refresh_token",
								refresh_token: account.refresh_token || "",
							}),
							method: "POST",
						},
					);

					const tokens: TokenSet = await response.json();

					if (!response.ok) throw tokens;

					await db.account.update({
						data: {
							access_token: tokens.access_token,
							// @ts-expect-error azure-ad returns expires_in and ext_expires_in fields
							expires_at: Math.floor(Date.now() / 1000 + tokens.expires_in),
							refresh_token: tokens.refresh_token ?? account.refresh_token,
							id_token: tokens.id_token,
						},
						where: {
							provider_providerAccountId: {
								provider: "azure-ad",
								providerAccountId: account.providerAccountId,
							},
						},
					});
				} catch (error) {
					console.error("Error refreshing access token", error);
					// The error property will be used client-side to handle the refresh token error
					session.error = "RefreshAccessTokenError";
				}
			}
			return {
				...session,
				user: {
					...session.user,
					id: user.id,
				},
			};
		},
		signIn: async ({ account, user }) => {
			console.log({ user });
			const isUserInDb = await db.user.findUnique({
				where: {
					email: user.email || undefined,
				},
			});

			// only allow users created by us
			if (!isUserInDb) return false;

			// using `updateMany` because `update` needs to find record by unique field
			await db.account.updateMany({
				where: {
					userId: user.id,
				},
				data: {
					...account,
				},
			});

			return true;
		},
	},
	// for debugging next-auth inside functionality
	// logger: {
	// 	debug: console.debug,
	// 	error: console.error,
	// 	warn: console.warn,
	// },
	adapter: { ...PrismaAdapter(db) },
	providers: [
		AzureADProvider({
			clientId: env.AZURE_AD_CLIENT_ID,
			clientSecret: env.AZURE_AD_CLIENT_SECRET,

			// docs -> https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/azure-ad.ts
			profile: async (profile, tokens) => {
				const profilePhotoSize = 48;
				// https://docs.microsoft.com/en-us/graph/api/profilephoto-get?view=graph-rest-1.0#examples
				const response = await fetch(
					`https://graph.microsoft.com/v1.0/me/photos/${profilePhotoSize}x${profilePhotoSize}/$value`,
					{ headers: { Authorization: `Bearer ${tokens.access_token}` } },
				);

				// Confirm that profile photo was returned
				let image;
				// TODO: Do this without Buffer
				if (response.ok && typeof Buffer !== "undefined") {
					try {
						const pictureBuffer = await response.arrayBuffer();
						const pictureBase64 = Buffer.from(pictureBuffer).toString("base64");
						image = `data:image/jpeg;base64, ${pictureBase64}`;
					} catch {}
				}

				return {
					id: profile.sub,
					name: profile.name,
					email: profile.email,
					image: image ?? null,
				};
			},
			authorization: {
				params: {
					scope: "openid profile email offline_access User.Read",
				},
			},
			// Seems to be the option we need because the user is created first in Talento Humano module
			// and then they can sign in to the application. Pending on how it works with Matricula.
			allowDangerousEmailAccountLinking: true,
		}),
		/**
		 * ...add more providers here.
		 *
		 * Most other providers require a bit more work than the Discord provider. For example, the
		 * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
		 * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
		 *
		 * @see https://next-auth.js.org/providers/github
		 */
	],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
