import React from "react";

import AddSede from "./add-sede";
import AddCoordinacion from "./coordinaciones/add-coordinacion";
import CoordinacionTableServer from "./coordinaciones/table/server";
import DatosAcademicos from "./datos-academicos";
import SedeTableServer from "./table/server";
import { InstitucionTabs, seccionParams } from "./tabs";

export const dynamic = "force-dynamic";

type Context = {
	searchParams: { [key: string]: string | undefined };
};

export default function InstitucionPage({ searchParams }: Context) {
	const seccion = searchParams.seccion;

	if (seccion === seccionParams.coordinaciones) {
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

	if (seccion === seccionParams.datosAcademicos) {
		return <DatosAcademicos searchParams={searchParams} />;
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
