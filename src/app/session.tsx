"use client";
import {
	UnauthenticatedTemplate,
	useAccount,
	useMsal,
} from "@azure/msal-react";
import { useEffect, useState } from "react";

import KeyIcon from "./_components/ui/icons/key";
import LogoutIcon from "./_components/ui/icons/logout";
import SelectGlobalPeriodo from "./select-global-periodo";

export default function UserSession() {
	const { instance, inProgress } = useMsal();
	const activeAccount = useAccount();
	const [clock, setClock] = useState<any>(formatAMPM(new Date()));

	function formatAMPM(date: any) {
		let hours = date.getHours();
		let minutes = date.getMinutes();
		const ampm = hours >= 12 ? "PM" : "AM";
		hours = hours % 12;
		hours = hours ? hours : 12; // the hour '0' should be '12'
		minutes = minutes < 10 ? "0" + minutes : minutes;
		const strTime = hours + ":" + minutes + " " + ampm;
		return strTime;
	}

	useEffect(() => {
		setTimeout(() => {
			setClock(formatAMPM(new Date()));
		}, 1000);
	}, [clock]);

	return (
		<>
			{/* {inProgress !== InteractionStatus.None && <div>Cargando...</div>} */}
			<div className='flex flex-row items-center gap-6'>
				<section className='shadow-default flex flex-row items-center gap-4 rounded-xl border border-slate-500 p-2 px-4'>
					<div className='cursor-pointer rounded-xl border border-slate-300 p-2 px-4'>
						<span className='font-bold'>Correo:</span> {activeAccount?.username}
					</div>
					<div className='cursor-pointer rounded-xl border border-slate-300 p-2 px-4'>
						<span className='font-bold'>Usuario:</span> {activeAccount?.name}
					</div>
					<div className='cursor-pointer rounded-xl border border-slate-300 p-2 px-4'>
						<KeyIcon className='w-6' />
					</div>
					<div
						onClick={() =>
							instance.logoutRedirect({
								postLogoutRedirectUri: "http://localhost:3000/",
							})
						}
						className='cursor-pointer rounded-xl border border-slate-300 p-2 px-4'
						title='Logout'
					>
						<LogoutIcon className='w-6' />
					</div>
				</section>
				<SelectGlobalPeriodo />
				<p className='text-lg font-bold'>{clock}</p>
			</div>
			<UnauthenticatedTemplate>
				{/* <Button
					onClick={() =>
						instance.loginRedirect({
							scopes: ["User.Read", "GroupMember.Read.All"],
						})
					}
				>
					Iniciar sesion
				</Button> */}
			</UnauthenticatedTemplate>
		</>
	);
}
