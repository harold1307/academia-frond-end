import { ROUTES } from "@/core/routes";
import { ActiveTab } from "../_components/ui/active-tab";
import { Separator } from "../_components/ui/separator";

export const institucionSeccionParams = {
	sedes: "sedes",
	coordinaciones: "coordinaciones",
	datosAcademicos: "datos-academicos",
	crmAsesores: "crm-asesores",
	gruposModulosReportes: "gpr",
} as const;

const tabs = [
	{
		href: `${ROUTES.institucion}?seccion=${institucionSeccionParams.sedes}`,
		label: "Sedes",
	},
	{
		href: `${ROUTES.institucion}?seccion=${institucionSeccionParams.coordinaciones}`,
		label: "Coordinaciones",
	},
	{
		href: `${ROUTES.institucion}?seccion=${institucionSeccionParams.gruposModulosReportes}`,
		label: "Grupos, Modulos y Reportes",
	},
	{
		href: `${ROUTES.institucion}?seccion=${institucionSeccionParams.datosAcademicos}`,
		label: "Datos Academicos",
	},
	{
		href: `${ROUTES.institucion}?seccion=${institucionSeccionParams.crmAsesores}`,
		label: "Crm y Asesores",
	},
];

export function InstitucionTabs({
	seccion,
	className,
}: {
	seccion: (typeof institucionSeccionParams)[keyof typeof institucionSeccionParams];
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
