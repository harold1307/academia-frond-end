"use client";
import {
	UnauthenticatedTemplate,
	useAccount,
	useMsal,
} from "@azure/msal-react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "./_components/ui/button";
import KeyIcon from "./_components/ui/icons/key";
import LogoutIcon from "./_components/ui/icons/logout";
import SelectGlobalPeriodo from "./select-global-periodo";
import { formatDate } from "@/utils";

export default function UserSession() {
	const { instance, inProgress } = useMsal();
	const activeAccount = useAccount();
	const router = useRouter();
	const [clock, setClock] = useState<any>("0:00 AM");

	function formatAMPM(date: any) {
		return formatDate(date, {
			hour: "numeric",
			minute: "numeric",
			hour12: true,
		});
	}

	useEffect(() => {
		setInterval(() => {
			setClock(formatAMPM(new Date()));
		}, 1000);
	}, []);

	return (
		<>
			{/* {inProgress !== InteractionStatus.None && <div>Cargando...</div>} */}
			<div className='flex flex-row items-center gap-6'>
				<div className='shadow-default'>
					<Button
						className='rounded-lg border-white'
						size={"icon"}
						variant={"outline"}
						title='Atras'
						onClick={() => router.back()}
					>
						<ArrowLeft className='h-6 w-6' />
					</Button>
				</div>
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
