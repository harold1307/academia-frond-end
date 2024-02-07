"use client";
import { useState } from "react";
import EyeClose from "../_components/ui/icons/eye-off";
import EyeOpen from "../_components/ui/icons/eye";
import { useMsal } from "@azure/msal-react";

function Login() {
	const [type, setType] = useState("password");
	const [EyeIcon, setEyeIcon] = useState<any>();
	const { instance, inProgress } = useMsal();

	const toggleButton = () => {
		if (type === "text") {
			setType("password");
		} else {
			setType("text");
		}
	};

	return (
		<main className='absolute left-0 top-0 -z-10 h-screen w-full bg-[url(/assets/estudiantes.png)] bg-cover bg-no-repeat'>
			<section className='grid h-full w-full place-items-center bg-[#0d0f82be]'>
				<div className='inset-shadow-blur flex h-4/6 w-96 flex-col justify-around gap-6 rounded-md p-12'>
					<h2 className='text-center text-5xl font-medium'>SGA</h2>
					<form className='flex flex-col items-center gap-6'>
						<div className='flex w-full flex-col gap-2'>
							<label className='text-lg' htmlFor=''>
								Usuario
							</label>
							<input
								type='text'
								name=''
								id=''
								className='rounded-md bg-slate-300 p-2 text-neutral-900 outline-none'
							/>
						</div>
						<div className='flex w-full flex-col gap-2'>
							<label className='text-lg' htmlFor=''>
								Clave
							</label>
							<div className='flex flex-row rounded-md bg-slate-300 text-neutral-900 outline-none'>
								<input
									type={type}
									name=''
									autoComplete='false'
									id=''
									className='h-full w-11/12 rounded-md bg-slate-300 bg-none p-2 outline-none'
								/>
								<button onClick={toggleButton} type='button'>
									{type !== "text" ? <EyeOpen /> : <EyeClose />}
								</button>
							</div>
						</div>
						<button
							className='button-login w-full rounded-md border border-[#0E10A3] bg-[#0E10A3] p-2 backdrop-blur-xl'
							type='submit'
							onClick={() =>
								instance.loginRedirect({
									scopes: ["User.Read", "GroupMember.Read.All"],
								})
							}
						>
							Iniciar Sesión
						</button>
					</form>
					<div className='flex flex-col gap-2'>
						<p className='text-sm'>¿Olvidaste tu clave?</p>
						<p className='cursor-pointer text-sm font-bold text-[#f00] hover:underline'>
							INGRESE AQUÍ
						</p>
						<p className='text-sm'>¿Problema al iniciar Sesión</p>
						<p className='cursor-pointer text-sm font-bold text-[#f00] hover:underline'>
							CONTACTE CON UN ADMINISTRADOR
						</p>
					</div>
				</div>
			</section>
		</main>
	);
}

export default Login;