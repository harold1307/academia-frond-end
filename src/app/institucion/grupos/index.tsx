import React from "react";

import { APIserver } from "@/core/api-server";
import { InstitucionTabs, institucionSeccionParams } from "../tabs";
import { AddGrupo } from "./grupos/add-grupo";
import { GrupoTableServer } from "./grupos/table/server";
import { GruposModulosReportesTabs, gruposSubSeccionParams } from "./tabs";

export async function GruposModulosReportes({
	searchParams,
}: {
	searchParams: { [key: string]: string | undefined };
}) {
	const subSeccion = searchParams.subSeccion;

	if (subSeccion === gruposSubSeccionParams.asignacionModulos) {
		return (
			<>
				<h1 className='mb-4 text-xl font-semibold'>
					Parametros de la institucion
				</h1>
				<InstitucionTabs
					seccion={institucionSeccionParams.gruposModulosReportes}
					className={"mb-5"}
				/>
				<GruposModulosReportesTabs seccion={subSeccion} className='mb-5' />
				<div className='mt-4'>
					{/* <AddModalidad />
					<React.Suspense fallback={"Cargando tabla..."}>
						<ModalidadTableServer />
					</React.Suspense> */}
				</div>
			</>
		);
	}

	if (subSeccion === gruposSubSeccionParams.modulos) {
		return (
			<>
				<h1 className='mb-4 text-xl font-semibold'>
					Parametros de la institucion
				</h1>
				<InstitucionTabs
					seccion={institucionSeccionParams.gruposModulosReportes}
					className={"mb-5"}
				/>
				<GruposModulosReportesTabs seccion={subSeccion} className='mb-5' />
				<div className='mt-4'>
					{/* <AddParalelo />
					<React.Suspense fallback={"Cargando tabla..."}>
						<ParaleloTableServer />
					</React.Suspense> */}
				</div>
			</>
		);
	}

	const sedes = await APIserver.sedes.getMany();
	const sedeId = searchParams.sedeId || sedes.data.at(0)?.id;

	return (
		<>
			<h1 className='mb-4 text-xl font-semibold'>
				Parametros de la institucion
			</h1>
			<InstitucionTabs
				seccion={institucionSeccionParams.gruposModulosReportes}
				className={"mb-5"}
			/>
			<GruposModulosReportesTabs seccion='grupos' className='mb-5' />
			<div className='mt-4'>
				<AddGrupo />
				<React.Suspense fallback={"Cargando tabla..."}>
					<GrupoTableServer />
				</React.Suspense>
			</div>
		</>
	);
}
