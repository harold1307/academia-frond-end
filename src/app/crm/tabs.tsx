import { ROUTES } from "@/core/routes";
import Link from "next/link";

const tabs = [
	{
		href: ROUTES.crm.path,
		label: "Admisiones",
	},
	{
		href: ROUTES.crm.inscritos,
		label: "Inscritos",
	},
	{
		href: ROUTES.crm.respuestas,
		label: "Tipos de respuestas",
	},
	{
		href: ROUTES.crm.seguimiento,
		label: "Seguimiento",
	},
];

export default function CrmPageTabs() {
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
