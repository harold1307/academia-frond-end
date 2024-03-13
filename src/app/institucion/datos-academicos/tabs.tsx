import { ActiveTab } from "@/app/_components/ui/active-tab";
import { ROUTES } from "@/core/routes";
import { institucionSeccionParams } from "../tabs";
import { Separator } from "@/app/_components/ui/separator";

export const subSeccionParams = {
	ubicaciones: "ubicaciones",
	modalidades: "modalidades",
	sesiones: "sesiones",
	turnos: "turnos",
	paralelos: "paralelos",
} as const;

const tabs = [
	{
		href: `${ROUTES.institucion}?seccion=${institucionSeccionParams.datosAcademicos}&subSeccion=${subSeccionParams.ubicaciones}`,
		label: "Ubicaciones",
	},
	{
		href: `${ROUTES.institucion}?seccion=${institucionSeccionParams.datosAcademicos}&subSeccion=${subSeccionParams.modalidades}`,
		label: "Modalidades",
	},
	{
		href: `${ROUTES.institucion}?seccion=${institucionSeccionParams.datosAcademicos}&subSeccion=${subSeccionParams.sesiones}`,
		label: "Sesiones",
	},
	{
		href: `${ROUTES.institucion}?seccion=${institucionSeccionParams.datosAcademicos}&subSeccion=${subSeccionParams.turnos}`,
		label: "Turnos",
	},
	{
		href: `${ROUTES.institucion}?seccion=${institucionSeccionParams.datosAcademicos}&subSeccion=${subSeccionParams.paralelos}`,
		label: "Paralelos",
	},
];

export default function DatosAcademicosTabs({
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
								t.href.includes(institucionSeccionParams.datosAcademicos)
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
