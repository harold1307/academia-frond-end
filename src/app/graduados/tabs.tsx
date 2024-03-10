import { ROUTES } from "@/core/routes";
import Link from "next/link";

export default function GraduadosTabs() {
	const tabs = [
		{
			href: ROUTES.graduados.path,
			label: "Graduados",
		},
		{
			href: ROUTES.graduados.path,
			label: "Segimientos",
		},
		{
			href: ROUTES.graduados.path,
			label: "Tipos de seguimientos",
		},
	];
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
