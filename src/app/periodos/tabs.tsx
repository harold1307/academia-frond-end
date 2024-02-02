import { ROUTES } from "@/core/routes";
import Link from "next/link";

const tabs = [
	{
		href: 'periodos',
		label: "Malla",
	},
	{
		href: 'cortes',
		label: "Ejes Formativos",
	},
];

export default function PeriodosPageTabs() {
	return (
		<ul className='flex gap-2'>
			{tabs.map(t => (
				<li key={t.label}>
					<Link href={t.href}>{t.label}</Link>
				</li>
			))}
		</ul>
	);
}
