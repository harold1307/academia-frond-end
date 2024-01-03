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
		label: "Curso",
		href: ROUTES.curso,
	},
];

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
