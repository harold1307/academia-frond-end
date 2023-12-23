"use client";
import {
	EventType,
	PublicClientApplication,
	type AuthenticationResult,
} from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { QueryClientProvider } from "@tanstack/react-query";
import React from "react";

import { queryClient } from "@/core/react-query";
import { env } from "@/env.mjs";

export default function Providers({ children }: React.PropsWithChildren) {
	const [msalInstance] = React.useState(
		new PublicClientApplication({
			auth: {
				clientId: env.NEXT_PUBLIC_MSAL_PUBLIC_CLIENT_ID,
			},
		}),
	);

	React.useEffect(() => {
		const accounts = msalInstance.getAllAccounts();
		const activeAccount = msalInstance.getActiveAccount();

		if (accounts.length > 0 && !activeAccount) {
			msalInstance.setActiveAccount(accounts[0] || null);
		}

		const eventCallback = msalInstance.addEventCallback(event => {
			if (
				(event.eventType === EventType.LOGIN_SUCCESS ||
					event.eventType === EventType.ACQUIRE_TOKEN_SUCCESS) &&
				event.payload
			) {
				const account = (event.payload as AuthenticationResult).account;
				msalInstance.setActiveAccount(account);
			}

			if (event.eventType === EventType.LOGOUT_SUCCESS) {
				msalInstance.setActiveAccount(null);
			}
		});

		return () => {
			if (eventCallback) {
				msalInstance.removeEventCallback(eventCallback);
			}
		};
	}, [msalInstance]);

	return (
		<QueryClientProvider client={queryClient}>
			<MsalProvider instance={msalInstance}>{children}</MsalProvider>
		</QueryClientProvider>
	);
}
