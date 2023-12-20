"use client";
import React from "react";

import { MsalProvider } from "@azure/msal-react";
import {
	PublicClientApplication,
	EventType,
	type AuthenticationResult,
} from "@azure/msal-browser";

export const msalInstance = new PublicClientApplication({
	auth: {
		clientId: "52c54331-8908-420c-a2ec-29b0f163e9b1",
	},
});

msalInstance.initialize().then(() => {
	// Account selection logic is app dependent. Adjust as needed for different use cases.
	const accounts = msalInstance.getAllAccounts();
	console.log({ accounts });
	if (accounts.length > 0) {
		msalInstance.setActiveAccount(accounts[0] || null);
	}

	msalInstance.addEventCallback(event => {
		if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
			const account = (event.payload as AuthenticationResult).account;
			console.log({ account });
			msalInstance.setActiveAccount(account);
		}
	});
});

export default function Providers({ children }: React.PropsWithChildren) {
	return <MsalProvider instance={msalInstance}>{children}</MsalProvider>;
}
