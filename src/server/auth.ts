import { PrismaAdapter } from "@next-auth/prisma-adapter";
import {
	getServerSession,
	type DefaultSession,
	type NextAuthOptions,
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
	callbacks: {
		session: ({ session, user }) => ({
			...session,
			user: {
				...session.user,
				id: user.id,
			},
		}),
		signIn: params => {
			console.log({ params });

			return true;
		},
	},
	adapter: PrismaAdapter(db),
	providers: [
		AzureADProvider({
			clientId: env.AZURE_AD_CLIENT_ID,
			clientSecret: env.AZURE_AD_CLIENT_SECRET,
			// tenantId: env.AZURE_AD_TENANT_ID,

			// docs -> https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/azure-ad.ts
			profile: async (profile, tokens) => {
				const profilePhotoSize = 48;
				// https://docs.microsoft.com/en-us/graph/api/profilephoto-get?view=graph-rest-1.0#examples
				const response = await fetch(
					`https://graph.microsoft.com/v1.0/me/photos/${profilePhotoSize}x${profilePhotoSize}/$value`,
					{ headers: { Authorization: `Bearer ${tokens.access_token}` } },
				);

				console.log(tokens.access_token);

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
					scope: "openid profile email User.Read GroupMember.Read.All",
				},
			},
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
