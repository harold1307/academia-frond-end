import React from "react";

import AddSede from "./add-sede";
import AddCoordinacion from "./coordinaciones/add-coordinacion";
import CoordinacionTableServer from "./coordinaciones/table/server";
import CrmAsesores from "./crm-asesores";
import DatosAcademicos from "./datos-academicos";
import { GruposModulosReportes } from "./grupos";
import SedeTableServer from "./table/server";
import { InstitucionTabs, institucionSeccionParams } from "./tabs";

export const dynamic = "force-dynamic";

type Context = {
	searchParams: { [key: string]: string | undefined };
};

export default function InstitucionPage({ searchParams }: Context) {
	const seccion = searchParams.seccion;

	if (seccion === institucionSeccionParams.coordinaciones) {
		return (
			<>
				<h1 className='mb-4 text-xl font-semibold'>
					Parametros de la institucion
				</h1>
				<InstitucionTabs seccion='coordinaciones' />
				<div className='mt-4'>
					<AddCoordinacion />
					<React.Suspense fallback={"Cargando tabla..."}>
						<CoordinacionTableServer />
					</React.Suspense>
				</div>
			</>
		);
	}

	if (seccion === institucionSeccionParams.datosAcademicos) {
		return <DatosAcademicos searchParams={searchParams} />;
	}

	if (seccion === institucionSeccionParams.crmAsesores) {
		return <CrmAsesores searchParams={searchParams} />;
	}

	if (seccion === institucionSeccionParams.gruposModulosReportes) {
		return <GruposModulosReportes searchParams={searchParams} />;
	}

	return (
		<>
			<h1 className='mb-4 text-xl font-semibold'>
				Parametros de la institucion
			</h1>
			<InstitucionTabs seccion='sedes' />
			<div className='mt-4'>
				<AddSede />
				<React.Suspense fallback={"Cargando tabla..."}>
					<SedeTableServer />
				</React.Suspense>
			</div>
		</>
	);
}
