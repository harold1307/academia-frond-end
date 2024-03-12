import Link from "next/link";

import { ROUTES } from "@/core/routes";
import { getServerAuthSession } from "@/server/auth";
import FileUpload from "./_components/ui/icons/file-up";
import LupaIcon from "./_components/ui/icons/lupa";
import PdfIcon from "./_components/ui/icons/pdf";
import QrCode from "./_components/ui/icons/qr-code";

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
		label: "Cursos y Escuelas",
		href: ROUTES.cursoEscuelas.path,
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
	{
		label: "Periodos Lectivos",
		href: ROUTES.periodo.path,
	},
	{
		label: "CRM",
		href: ROUTES.crm.path,
	},
	{
		label: "adm. costos",
		href: ROUTES.admCostos.path,
	},
	// {
	// 	label: "Mis Horarios",
	// 	href: ROUTES.horarios.path
	// }
];

export const dynamic = "force-dynamic";

export default async function Home() {
	const session = await getServerAuthSession();
	// console.log(session);
	return (
		<>
			<section className='m-auto mt-2 sm:w-full lg:w-11/12'>
				<section className='flex justify-end pt-4'>
					<div className='shadow-default flex w-60 flex-row items-center gap-4 rounded-lg border border-slate-500 p-2 px-3'>
						<input
							type='text'
							name=''
							className='h-full w-full bg-inherit outline-none'
						/>
						<LupaIcon className='w-8' />
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
									<FileUpload className='w-12' />
									Subir imagen
								</div>
								<div className='flex flex-col items-center gap-4'>
									<QrCode className='w-12' />
									Ver codigo QR
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
								<PdfIcon className='w-12' />
								Manual Team
							</section>
							<section className='shadow-default m-auto flex flex-col items-center justify-around gap-2 rounded-md p-6 px-10 text-center font-bold'>
								<PdfIcon className='w-12' />
								Manual Team
							</section>
							<section className='shadow-default m-auto flex flex-col items-center justify-around gap-2 rounded-md p-6 px-10 text-center font-bold'>
								<PdfIcon className='w-12' />
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
													<QrCode className='w-16' />
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
													<QrCode className='w-16' />
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
													<QrCode className='w-16' />
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
