import { ROUTES } from "@/core/routes";
import Link from "next/link";

const tabs = [
	{
		href: ROUTES.malla.path,
		label: "Malla",
	},
	{
		href: ROUTES.malla.path + "?seccion=ejesFormativos",
		label: "Ejes Formativos",
	},
	{
		href: ROUTES.malla.path + "?seccion=areasConocimiento",
		label: "Areas de conocimiento",
	},
	{
		href: ROUTES.malla.path + "?seccion=camposFormacion",
		label: "Campos de formacion",
	},
];

export default function MallaPageTabs() {
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
