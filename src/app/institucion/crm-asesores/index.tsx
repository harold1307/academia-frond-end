import { notFound } from "next/navigation";
import React from "react";

import { APIserver } from "@/core/api-server";
import { formatFullName } from "@/utils";
import { InstitucionTabs } from "../tabs";
import AddAsesorCrm from "./asesores-crm/add-asesor-crm";
import AsesorCrmTableServer from "./asesores-crm/table/server";
import AddAsesorEstudiante from "./asesores-estudiante/add-asesor-estudiante";
import AsesorEstudianteTableServer from "./asesores-estudiante/table/server";
import AddCentroInformacion from "./centros-informacion/add-centro-informacion";
import CentroInformacionTableServer from "./centros-informacion/table/server";
import AddResponsableAsesorEstudiante from "./responsables-asesores-estudiante/add-responsable-asesor-estudiante";
import AddAsesorAsignado from "./responsables-asesores-estudiante/asesores-asignados/add-asesor-asignado";
import AsesorAsignadoTableServer from "./responsables-asesores-estudiante/asesores-asignados/table/server";
import ResponsableAsesorEstudianteTableServer from "./responsables-asesores-estudiante/table/server";
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
					<AddAsesorCrm />
					<React.Suspense fallback={"Cargando tabla..."}>
						<AsesorCrmTableServer />
					</React.Suspense>
				</div>
			</>
		);
	}

	if (subSeccion === subSeccionParams.responsablesAsesoresEstudiante) {
		const responsableId = searchParams.rId;

		if (responsableId) {
			const responsable =
				await APIserver.responsablesAsesoresEstudiante.getByIdWithAsesores(
					responsableId,
				);

			if (!responsable.data) return notFound();

			return (
				<>
					<h1 className='text-xl font-semibold'>Asesores asignados</h1>
					<h2 className='text-lg font-medium'>
						Responsable:{" "}
						{formatFullName(
							responsable.data.administrativo.usuario.nombres,
							responsable.data.administrativo.usuario.primerApellido,
							responsable.data.administrativo.usuario.segundoApellido,
						)}
					</h2>
					<div className='mt-4'>
						<AddAsesorAsignado responsableId={responsableId} />
						<React.Suspense fallback={"Cargando tabla..."}>
							<AsesorAsignadoTableServer responsableId={responsableId} />
						</React.Suspense>
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
				<CrmAsesoresTabs seccion={subSeccion} className='mb-5' />
				<div className='mt-4'>
					<AddResponsableAsesorEstudiante />
					<React.Suspense fallback={"Cargando tabla..."}>
						<ResponsableAsesorEstudianteTableServer />
					</React.Suspense>
				</div>
			</>
		);
	}

	if (subSeccion === subSeccionParams.asesoresEstudiante) {
		return (
			<>
				<h1 className='mb-4 text-xl font-semibold'>
					Parametros de la institucion
				</h1>
				<InstitucionTabs seccion='crm-asesores' className={"mb-5"} />
				<CrmAsesoresTabs seccion={subSeccion} className='mb-5' />
				<div className='mt-4'>
					<AddAsesorEstudiante />
					<React.Suspense fallback={"Cargando tabla..."}>
						<AsesorEstudianteTableServer />
					</React.Suspense>
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
