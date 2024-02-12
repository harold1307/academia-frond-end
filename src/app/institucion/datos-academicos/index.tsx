import React from "react";

import { APIserver } from "@/core/api-server";
import { InstitucionTabs } from "../tabs";
import AddModalidad from "./modalidades/add-modalidad";
import ModalidadTableServer from "./modalidades/table/server";
import AddSesion from "./sesiones/add-sesion";
import SesionTableServer from "./sesiones/table/server";
import DatosAcademicosTabs, { subSeccionParams } from "./tabs";
import AddTurno from "./turnos/add-turno";
import SelectSesion from "./turnos/select-sesion";
import TurnoTableServer from "./turnos/table/server";
import AddUbicacion from "./ubicaciones/add-ubicacion";
import SelectSede from "./ubicaciones/select-sede";
import UbicacionTableServer from "./ubicaciones/table/server";

export default async function DatosAcademicos({
	searchParams,
}: {
	searchParams: { [key: string]: string | undefined };
}) {
	const subSeccion = searchParams.subSeccion;

	if (subSeccion === subSeccionParams.modalidades) {
		return (
			<>
				<h1 className='mb-4 text-xl font-semibold'>
					Parametros de la institucion
				</h1>
				<InstitucionTabs seccion='datos-academicos' className={"mb-5"} />
				<DatosAcademicosTabs seccion='modalidades' className='mb-5' />
				<div className='mt-4'>
					<AddModalidad />
					<React.Suspense fallback={"Cargando tabla..."}>
						<ModalidadTableServer />
					</React.Suspense>
				</div>
			</>
		);
	}

	if (subSeccion === subSeccionParams.paralelos) {
		return (
			<>
				<h1 className='mb-4 text-xl font-semibold'>
					Parametros de la institucion
				</h1>
				<InstitucionTabs seccion='datos-academicos' className={"mb-5"} />
				<DatosAcademicosTabs seccion='paralelos' className='mb-5' />
				<div className='mt-4'>
					<AddModalidad />
					<React.Suspense fallback={"Cargando tabla..."}>
						<ModalidadTableServer />
					</React.Suspense>
				</div>
			</>
		);
	}

	if (subSeccion === subSeccionParams.sesiones) {
		return (
			<>
				<h1 className='mb-4 text-xl font-semibold'>
					Parametros de la institucion
				</h1>
				<InstitucionTabs seccion='datos-academicos' className={"mb-5"} />
				<DatosAcademicosTabs seccion='sesiones' className='mb-5' />
				<div className='mt-4'>
					<AddSesion />
					<React.Suspense fallback={"Cargando tabla..."}>
						<SesionTableServer />
					</React.Suspense>
				</div>
			</>
		);
	}

	if (subSeccion === subSeccionParams.turnos) {
		const sesionId = searchParams.sesionId;

		const sesiones = await APIserver.sesiones.getMany();

		const sesion = sesionId
			? sesiones.data.find(s => s.id === sesionId)
			: sesiones.data.at(0);

		return (
			<>
				<h1 className='mb-4 text-xl font-semibold'>
					Parametros de la institucion
				</h1>
				<InstitucionTabs seccion='datos-academicos' className={"mb-5"} />
				<DatosAcademicosTabs seccion='turnos' className='mb-5' />
				<div className='mt-4'>
					<AddTurno sesionId={sesion?.id} />
					<SelectSesion
						sesiones={sesiones.data.map(p => ({ id: p.id, nombre: p.nombre }))}
						sesionId={sesion?.id}
					/>
					<React.Suspense fallback={"Cargando tabla..."}>
						<TurnoTableServer turnos={sesion?.turnos || []} />
					</React.Suspense>
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
			<InstitucionTabs seccion='datos-academicos' className={"mb-5"} />
			<DatosAcademicosTabs seccion='ubicaciones' className='mb-5' />
			<div className='mt-4'>
				<AddUbicacion sedeId={sedeId} />
				<SelectSede
					sedes={sedes.data.map(p => ({ id: p.id, nombre: p.nombre }))}
					sedeId={sedeId}
				/>
				<React.Suspense fallback={"Cargando tabla..."}>
					<UbicacionTableServer sedeId={sedeId} />
				</React.Suspense>
			</div>
		</>
	);
}
