"use client";
import {
	AuthenticatedTemplate,
	UnauthenticatedTemplate,
	useAccount,
	useMsal,
} from "@azure/msal-react";

import { Button } from "./_components/ui/button";
import { InteractionStatus } from "@azure/msal-browser";
import { useEffect, useState } from "react";

export default function UserSession() {
	const { instance, inProgress } = useMsal();
	const activeAccount = useAccount();
	const [clock, setClock] = useState<any>();

	useEffect(() => {
		const date = new Date();
		console.log(date.toLocaleTimeString());
		setClock(date.toLocaleTimeString());
	}, [clock]);

	return (
		<>
			{inProgress !== InteractionStatus.None && <div>Cargando...</div>}
			<AuthenticatedTemplate>
				<div className='flex flex-row items-center gap-6'>
					<section className='shadow-default flex flex-row items-center gap-4 rounded-xl border border-slate-500 p-2 px-4'>
						<div className='cursor-pointer rounded-xl border border-slate-300 p-2 px-4'>
							<span className='font-bold'>Correo:</span>{" "}
							{activeAccount?.username}
						</div>
						<div className='cursor-pointer rounded-xl border border-slate-300 p-2 px-4'>
							<span className='font-bold'>Usuario:</span> {activeAccount?.name}
						</div>
						<div className='cursor-pointer rounded-xl border border-slate-300 p-2 px-4'>
							<img src='/assets/icons/key.png' className='w-6' alt='' />
						</div>
						<div
							onClick={() =>
								instance.logoutRedirect({
									postLogoutRedirectUri: "http://localhost:3000/",
								})
							}
							className='cursor-pointer rounded-xl border border-slate-300 p-2 px-4'
						>
							<img src='/assets/icons/logout.png' className='w-6' alt='' />
						</div>
					</section>
					<div className='shadow-default flex flex-row items-center gap-2 rounded-lg border border-slate-300 p-2'>
						<img src='/assets/icons/rounded.png' alt='' className='w-7' />
						Período de Prueba
					</div>
					<p className='text-lg font-bold'>{clock}</p>
				</div>
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
