import { ActiveTab } from "@/app/_components/ui/active-tab";
import { Separator } from "@/app/_components/ui/separator";
import { ROUTES } from "@/core/routes";
import { seccionParams } from "../tabs";

export const subSeccionParams = {
	centrosInformacion: "centros-informacion",
	responsablesCrm: "responsables-crm",
	asesoresCrm: "asesores-crm",
	responsablesAsesoresEstudiante: "responsables-asesores",
	asesoresEstudiante: "asesores-estudiantes",
} as const;

const tabs = [
	{
		href: `${ROUTES.institucion}?seccion=${seccionParams.crmAsesores}&subSeccion=${subSeccionParams.centrosInformacion}`,
		label: "Centros de informacion",
	},
	{
		href: `${ROUTES.institucion}?seccion=${seccionParams.crmAsesores}&subSeccion=${subSeccionParams.responsablesCrm}`,
		label: "Responsables de CRM",
	},
	{
		href: `${ROUTES.institucion}?seccion=${seccionParams.crmAsesores}&subSeccion=${subSeccionParams.asesoresCrm}`,
		label: "Asesores de CRM",
	},
	{
		href: `${ROUTES.institucion}?seccion=${seccionParams.crmAsesores}&subSeccion=${subSeccionParams.responsablesAsesoresEstudiante}`,
		label: "Responsables de asesores de estudiante",
	},
	{
		href: `${ROUTES.institucion}?seccion=${seccionParams.crmAsesores}&subSeccion=${subSeccionParams.asesoresEstudiante}`,
		label: "Asesores de estudiantes",
	},
];

export default function CrmAsesoresTabs({
	seccion,
	className,
}: {
	seccion: (typeof subSeccionParams)[keyof typeof subSeccionParams];
	className?: string;
}) {
	return (
		<div className={className}>
			<ul className='mb-4 flex gap-4'>
				{tabs.map(t => (
					<li key={t.href}>
						<ActiveTab
							href={t.href}
							isActive={
								t.href.includes(seccion) &&
								t.href.includes(seccionParams.crmAsesores)
							}
						>
							{t.label}
						</ActiveTab>
					</li>
				))}
			</ul>
			<Separator />
		</div>
	);
}
