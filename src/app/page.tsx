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
		label: "Periodos de Evaluación",
		href: ROUTES.periodoEvaluacion.path + "?section=0",
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
			<section className='mt-2'>
				<h1 className='text-4xl font-bold'>Modulos</h1>
				<ul className='list-disc'>
					{modulos.map(m => (
						<li key={m.href} className='text-lg'>
							<Link href={m.href} className='hover:underline'>
								{m.label}
							</Link>
						</li>
					))}
				</ul>
			</section>
		</>
	);
}
