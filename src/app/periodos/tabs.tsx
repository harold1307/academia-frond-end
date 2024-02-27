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
