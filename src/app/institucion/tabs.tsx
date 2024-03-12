import { ROUTES } from "@/core/routes";
import { ActiveTab } from "../_components/ui/active-tab";
import { Separator } from "../_components/ui/separator";

export const seccionParams = {
	sedes: "sedes",
	coordinaciones: "coordinaciones",
	datosAcademicos: "datos-academicos",
	crmAsesores: "crm-asesores",
} as const;

const tabs = [
	{
		href: `${ROUTES.institucion}?seccion=${seccionParams.sedes}`,
		label: "Sedes",
	},
	{
		href: `${ROUTES.institucion}?seccion=${seccionParams.coordinaciones}`,
		label: "Coordinaciones",
	},
	{
		href: `${ROUTES.institucion}?seccion=${seccionParams.datosAcademicos}`,
		label: "Datos Academicos",
	},
	{
		href: `${ROUTES.institucion}?seccion=${seccionParams.crmAsesores}`,
		label: "Crm y Asesores",
	},
];

export function InstitucionTabs({
	seccion,
	className,
}: {
	seccion: (typeof seccionParams)[keyof typeof seccionParams];
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
