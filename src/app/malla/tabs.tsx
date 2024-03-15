import { ROUTES } from "@/core/routes";
import { ActiveTab } from "../_components/ui/active-tab";
import { Separator } from "../_components/ui/separator";

export const mallaSeccionParams = {
	mallas: "mallas",
	ejesFormativos: "ejes-formativos",
	areasConocimiento: "areas-de-conocimiento",
	camposFormacion: "campos-de-formacion",
} as const;

const tabs = [
	{
		href: ROUTES.malla.path + "?seccion=mallas",
		label: "Mallas",
	},
	{
		href: ROUTES.malla.path + "?seccion=ejes-formativos",
		label: "Ejes formativos",
	},
	{
		href: ROUTES.malla.path + "?seccion=areas-de-conocimiento",
		label: "Areas de conocimiento",
	},
	{
		href: ROUTES.malla.path + "?seccion=campos-de-formacion",
		label: "Campos de formacion",
	},
];

export default function MallaPageTabs({
	seccion,
	className,
}: {
	seccion: (typeof mallaSeccionParams)[keyof typeof mallaSeccionParams];
	className?: string;
}) {
	return (
		<div className={className}>
			<ul className={"mb-4 flex gap-4"}>
				{tabs.map(t => (
					<li key={t.href}>
						<ActiveTab href={t.href} isActive={t.href.includes(seccion)}>
							{t.label}
						</ActiveTab>
					</li>
				))}
			</ul>
			<Separator />
		</div>
	);
}
