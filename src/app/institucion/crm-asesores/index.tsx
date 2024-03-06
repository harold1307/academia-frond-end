import React from "react";

import { InstitucionTabs } from "../tabs";
import AddCentroInformacion from "./centros-informacion/add-centro-informacion";
import CentroInformacionTableServer from "./centros-informacion/table/server";
import AddResponsableCrm from "./responsables-crm/add-responsable-crm";
import ResponsableCrmTableServer from "./responsables-crm/table/server";
import CrmAsesoresTabs, { subSeccionParams } from "./tabs";

export default async function CrmAsesores({
	searchParams,
}: {
	searchParams: { [key: string]: string | undefined };
}) {
	const subSeccion = searchParams.subSeccion;

	if (subSeccion === subSeccionParams.responsablesCrm) {
		return (
			<>
				<h1 className='mb-4 text-xl font-semibold'>
					Parametros de la institucion
				</h1>
				<InstitucionTabs seccion='crm-asesores' className={"mb-5"} />
				<CrmAsesoresTabs seccion={subSeccion} className='mb-5' />
				<div className='mt-4'>
					<AddResponsableCrm />
					<React.Suspense fallback={"Cargando tabla..."}>
						<ResponsableCrmTableServer />
					</React.Suspense>
				</div>
			</>
		);
	}

	if (subSeccion === subSeccionParams.asesoresCrm) {
		return (
			<>
				<h1 className='mb-4 text-xl font-semibold'>
					Parametros de la institucion
				</h1>
				<InstitucionTabs seccion='crm-asesores' className={"mb-5"} />
				<CrmAsesoresTabs seccion={subSeccion} className='mb-5' />
				<div className='mt-4'>
					{/* <AddParalelo />
					<React.Suspense fallback={"Cargando tabla..."}>
						<ParaleloTableServer />
					</React.Suspense> */}
				</div>
			</>
		);
	}

	if (subSeccion === subSeccionParams.responsablesAsesoresEstudiante) {
		return (
			<>
				<h1 className='mb-4 text-xl font-semibold'>
					Parametros de la institucion
				</h1>
				<InstitucionTabs seccion='crm-asesores' className={"mb-5"} />
				<CrmAsesoresTabs seccion={subSeccion} className='mb-5' />
				<div className='mt-4'>
					{/* <AddSesion />
					<React.Suspense fallback={"Cargando tabla..."}>
						<SesionTableServer />
					</React.Suspense> */}
				</div>
			</>
		);
	}

	if (subSeccion === subSeccionParams.asesoresEstudiante) {
		// const sesionId = searchParams.sesionId;

		// const sesiones = await APIserver.sesiones.getMany();

		// const sesion = sesionId
		// 	? sesiones.data.find(s => s.id === sesionId)
		// 	: sesiones.data.at(0);

		return (
			<>
				<h1 className='mb-4 text-xl font-semibold'>
					Parametros de la institucion
				</h1>
				<InstitucionTabs seccion='crm-asesores' className={"mb-5"} />
				<CrmAsesoresTabs seccion={subSeccion} className='mb-5' />
				<div className='mt-4'>
					{/* <AddTurno sesionId={sesion?.id} />
					<SelectSesion
						sesiones={sesiones.data.map(p => ({ id: p.id, nombre: p.nombre }))}
						sesionId={sesion?.id}
					/>
					<React.Suspense fallback={"Cargando tabla..."}>
						<TurnoTableServer turnos={sesion?.turnos || []} />
					</React.Suspense> */}
				</div>
			</>
		);
	}

	return (
		<>
			<h1 className='mb-4 text-xl font-semibold'>
				Parametros de la institucion
			</h1>
			<InstitucionTabs seccion='crm-asesores' className={"mb-5"} />
			<CrmAsesoresTabs seccion='centros-informacion' className='mb-5' />
			<div className='mt-4'>
				<AddCentroInformacion />
				<React.Suspense fallback={"Cargando tabla..."}>
					<CentroInformacionTableServer />
				</React.Suspense>
			</div>
		</>
	);
}
