import { ActiveTab } from "@/app/_components/ui/active-tab";
import { Separator } from "@/app/_components/ui/separator";
import { ROUTES } from "@/core/routes";
import { institucionSeccionParams } from "../tabs";

export const gruposSubSeccionParams = {
	grupos: "grupos",
	asignacionModulos: "am",
	modulos: "modulos",
} as const;

const tabs = [
	{
		href: `${ROUTES.institucion}?seccion=${institucionSeccionParams.gruposModulosReportes}&subSeccion=${gruposSubSeccionParams.grupos}`,
		label: "Grupos",
	},
	{
		href: `${ROUTES.institucion}?seccion=${institucionSeccionParams.gruposModulosReportes}&subSeccion=${gruposSubSeccionParams.asignacionModulos}`,
		label: "Asignacion de Modulos",
	},
	{
		href: `${ROUTES.institucion}?seccion=${institucionSeccionParams.gruposModulosReportes}&subSeccion=${gruposSubSeccionParams.modulos}`,
		label: "Modulos",
	},
];

export function GruposModulosReportesTabs({
	seccion,
	className,
}: {
	seccion: (typeof gruposSubSeccionParams)[keyof typeof gruposSubSeccionParams];
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
								t.href.includes(institucionSeccionParams.gruposModulosReportes)
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
