import { ROUTES } from "@/core/routes";
import Link from "next/link";

const tabs = [
	{
		href: ROUTES.periodo.path,
		label: "Periodos",
	},
	{
		href: ROUTES.periodo.path + "?seccion=cortes",
		label: "Cortes",
	},
];

export default function PeriodosPageTabs() {
	return (
		<ul className='flex gap-2 mt-4'>
			{tabs.map(t => (
				<li key={t.label} className="focus:border focus:border-slate-400 p-2 rounded-md">
					<Link href={t.href}>{t.label}</Link>
				</li>
			))}
		</ul>
	);
}
