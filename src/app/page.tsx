import Link from "next/link";

import { ROUTES } from "@/core/routes";
import { getServerAuthSession } from "@/server/auth";

const modulos = [
	{
		label: "Institucion",
		href: ROUTES.institucion,
	},
	{
		label: "Malla",
		href: ROUTES.malla.path,
	},
	{
		label: "Asignatura",
		href: ROUTES.asignatura,
	},
	{
		label: "Configuración de Cursos",
		href: ROUTES.curso.path,
	},
	{
		label: "Modelos Evaluativos",
		href: ROUTES.modelosEvaluativos.path + "?section=0",
	},
	{
		label: "Mis Horarios (profesor)",
		href: ROUTES.proHorarios.path,
	},
	{
		label: "Mis Horarios (admin)",
		href: ROUTES.admHorarios.path,
	},
	{
		label: "Mis Horarios (admin)",
		href: ROUTES.admHorarios.path,
	},
	// {
	// 	label: "Mis Horarios",
	// 	href: ROUTES.horarios.path
	// }
];

export const dynamic = "force-dynamic";

export default async function Home() {
	const session = await getServerAuthSession();
	console.log(session);
	return (
		<>
			<section className='m-auto mt-2 sm:w-full lg:w-11/12'>
				<section className='flex justify-end pt-4'>
					<div className='shadow-default w-60 rounded-lg border border-slate-500 p-2 px-3 flex flex-row items-center gap-4'>
						<input
							type='text'
							name=''
							className='h-full w-full bg-inherit outline-none'
						/>
						<svg
						className="w-6"
							xmlns='http://www.w3.org/2000/svg'
							viewBox='0 0 24 24'
							fill='currentColor'
						>
							<path d='M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z'></path>
						</svg>
					</div>
				</section>
				<main className='flex w-full flex-row gap-10'>
					<article className='border-default h-max w-3/12 translate-y-36'>
						<div className='flex -translate-y-32 flex-col items-center'>
							<img
								src='/assets/avatar.jpg'
								alt=''
								className='m-auto h-[280px] w-64 rounded-full object-cover'
							/>
							<section className='my-6 flex flex-row items-center gap-4'>
								<div className='flex flex-col items-center gap-4'>
									<img src='/assets/icons/upload.png' alt='' className='w-10' />
									Subir imagen
								</div>
								<div className='flex flex-col items-center gap-4'>
									<img
										src='/assets/icons/qr_code.png'
										alt=''
										className='w-10'
									/>
									Subir imagen
								</div>
							</section>
						</div>
						<div className='m-auto w-11/12 -translate-y-28'>
							<h3 className='my-4 text-3xl font-semibold'>Rodriguez Ana</h3>
							<p className='text-gray-300'>Nº Identificador 90010064</p>
							<ul className='my-2 list-disc pl-6'>
								<li className='text-balance w-full'>Nº Estudiante: 16310</li>
								<li className='text-balance w-full'>
									Correo institucional: anarodriguez@iste.edu.ec
								</li>
								<li className='text-balance w-full'>
									Correo Personal: iste.tecnologia.gmail.com
								</li>
							</ul>
							<p className='text-xl'>Preparación alto rendimiento Hibrido</p>
							<ul className='list-disc pl-6'>
								<li>Sábado, Domingo matutino regular</li>
							</ul>
						</div>
						<div className='m-auto flex w-11/12 -translate-y-24 flex-col items-center gap-6'>
							<h3 className='my-6 text-4xl font-bold'>PDF</h3>
							<section className='shadow-default m-auto flex flex-col items-center justify-around gap-2 rounded-md p-6 px-10 text-center font-bold'>
								<img src='/assets/icons/PDF.png' alt='' className='w-14' />
								Manual Team
							</section>
							<section className='shadow-default m-auto flex flex-col items-center justify-around gap-2 rounded-md p-6 px-10 text-center font-bold'>
								<img src='/assets/icons/PDF.png' alt='' className='w-14' />
								Manual Team
							</section>
							<section className='shadow-default m-auto flex flex-col items-center justify-around gap-2 rounded-md p-6 px-10 text-center font-bold'>
								<img src='/assets/icons/PDF.png' alt='' className='w-14' />
								Manual Team
							</section>
						</div>
					</article>
					<div className='flex w-9/12 flex-col gap-12'>
						<h1 className='my-6 text-center text-5xl'>Módulos</h1>
						<section className='border-default h-max py-12'>
							<div className='m-auto w-11/12'>
								<h2 className='mb-12 text-4xl'>Mis actividades</h2>
								<ul className='grid list-disc grid-cols-1 gap-10 md:grid-cols-[repeat(auto-fit,minmax(255px,1fr))]'>
									{modulos.map(m => (
										<li
											key={m.href}
											className='shadow-default h-48 list-none rounded-xl text-lg transition-all duration-150 hover:-translate-y-[5px]'
										>
											<Link href={m.href} className=''>
												<div className='m-auto flex h-full w-11/12 flex-row items-center justify-around gap-10'>
													<img
														src='/assets/icons/doc_2.png'
														className='w-14 text-white'
														alt=''
													/>
													<span className='flex w-6/12 flex-col'>
														<p className='font-bold'>{m.label}</p>
														<p className='text-sm text-white/50'>Descripciòn</p>
													</span>
												</div>
											</Link>
										</li>
									))}
								</ul>
							</div>
						</section>
						<section className='border-default h-max py-12'>
							<div className='m-auto w-11/12'>
								<h2 className='mb-12 text-4xl'>Académico</h2>
								<ul className='grid list-disc grid-cols-1 gap-10 md:grid-cols-[repeat(auto-fit,minmax(255px,1fr))]'>
									{modulos.map(m => (
										<li
											key={m.href}
											className='shadow-default h-48 list-none rounded-xl text-lg transition-all duration-150 hover:-translate-y-[5px]'
										>
											<Link href={m.href} className=''>
												<div className='m-auto flex h-full w-11/12 flex-row items-center justify-around gap-10'>
													<img
														src='/assets/icons/doc.png'
														className='w-16 text-white'
														alt=''
													/>
													<span className='flex w-6/12 flex-col'>
														<p className='font-bold'>{m.label}</p>
														<p className='text-sm text-white/50'>Descripciòn</p>
													</span>
												</div>
											</Link>
										</li>
									))}
								</ul>
							</div>
						</section>
						<section className='border-default h-max w-full py-12 xl:w-8/12'>
							<div className='m-auto w-11/12'>
								<h2 className='mb-12 text-4xl'>Documentos</h2>
								<ul className='grid list-disc grid-cols-1 gap-10 md:grid-cols-[repeat(auto-fit,minmax(255px,1fr))]'>
									{modulos.slice(0, 2).map(m => (
										<li
											key={m.href}
											className='shadow-default h-48 list-none rounded-xl text-lg transition-all duration-150 hover:-translate-y-[5px]'
										>
											<Link href={m.href} className=''>
												<div className='m-auto flex h-full w-11/12 flex-row items-center justify-around gap-10'>
													<img
														src='/assets/icons/safety.png'
														className='w-14 text-white'
														alt=''
													/>
													<span className='flex w-6/12 flex-col'>
														<p className='font-bold'>{m.label}</p>
														<p className='text-sm text-white/50'>Descripciòn</p>
													</span>
												</div>
											</Link>
										</li>
									))}
								</ul>
							</div>
						</section>
					</div>
				</main>
			</section>
		</>
	);
}
