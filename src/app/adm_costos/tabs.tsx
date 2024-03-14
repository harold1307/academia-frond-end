import { ROUTES } from "@/core/routes";
import Link from "next/link";

const tabs = [
	{
		href: ROUTES.admCostos.path,
		label: "Otros rubros",
	},
	{
		href: ROUTES.admCostos.path + "?seccion=especiesValoradas",
		label: "Especies valoradas",
	},
	{
		href: ROUTES.admCostos.path + "?seccion=solicitudes",
		label: "Solicitudes",
	},
	{
		href: ROUTES.admCostos.path + "?seccion=programa",
		label: "Programa",
	},
	{
		href: ROUTES.admCostos.path + "?seccion=grupoCostos",
		label: "Grupo de costos",
	},
];

export default function CostosPageTabs() {
	return (
		<ul className='mt-4 flex gap-2'>
			{tabs.map(t => (
				<li
					key={t.label}
					className='rounded-md p-2 hover:underline focus:border focus:border-slate-400'
				>
					<Link href={t.href}>{t.label}</Link>
				</li>
			))}
		</ul>
	);
}
