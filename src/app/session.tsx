"use client";
import {
	AuthenticatedTemplate,
	UnauthenticatedTemplate,
	useAccount,
	useMsal,
} from "@azure/msal-react";

import { Button } from "./_components/ui/button";
import { InteractionStatus } from "@azure/msal-browser";

export default function UserSession() {
	const { instance, inProgress } = useMsal();
	const activeAccount = useAccount();

	return (
		<>
			{inProgress !== InteractionStatus.None && <div>Cargando...</div>}
			<AuthenticatedTemplate>
				<section>
					<div>
						<span className='font-bold'>Correo:</span> {activeAccount?.username}
					</div>
					<div>
						<span className='font-bold'>Usuario:</span> {activeAccount?.name}
					</div>
					<Button
						onClick={() =>
							instance.logoutRedirect({
								postLogoutRedirectUri: "http://localhost:3000/",
							})
						}
						variant='destructive'
					>
						Cerrar sesion
					</Button>
				</section>
			</AuthenticatedTemplate>
			<UnauthenticatedTemplate>
				<Button
					onClick={() =>
						instance.loginRedirect({
							scopes: ["User.Read", "GroupMember.Read.All"],
						})
					}
				>
					Iniciar sesion
				</Button>
			</UnauthenticatedTemplate>
		</>
	);
}
