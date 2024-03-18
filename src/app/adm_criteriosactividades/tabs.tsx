import { ROUTES } from "@/core/routes";
import { ActiveTab } from "../_components/ui/active-tab";
import { Separator } from "../_components/ui/separator";

export const criterioActividadSeccionParams = {
	docencia: "docencia",
	investigacion: "investigacion",
	gestion: "gestion",
	practicasComunitarias: "pc",
	practicasPreProfesionales: "pp",
} as const;

const tabs = [
	{
		href: `${ROUTES.criterioActividad.path}?seccion=${criterioActividadSeccionParams.docencia}`,
		label: "DOCENCIA",
	},
	{
		href: `${ROUTES.criterioActividad.path}?seccion=${criterioActividadSeccionParams.investigacion}`,
		label: "INVESTIGACION",
	},
	{
		href: `${ROUTES.criterioActividad.path}?seccion=${criterioActividadSeccionParams.gestion}`,
		label: "GESTION",
	},
	{
		href: `${ROUTES.criterioActividad.path}?seccion=${criterioActividadSeccionParams.practicasComunitarias}`,
		label: "PRACTICAS COMUNITARIAS",
	},
	{
		href: `${ROUTES.criterioActividad.path}?seccion=${criterioActividadSeccionParams.practicasPreProfesionales}`,
		label: "PRACTICAS PREPROFESIONALES",
	},
];

export function CriterioActividadTabs({
	seccion,
	className,
}: {
	seccion: (typeof criterioActividadSeccionParams)[keyof typeof criterioActividadSeccionParams];
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
