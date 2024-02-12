import React from "react";
import AlumnosEnClaseTableServer from "./alumnosTable/server";
import AsistenciasTable from "./asistenciasTable";
import { type Asistencias } from "./asistenciasTable/columns";
import Contenido from "./contenido";
import IncidenciaTableServer from "./incidenciasTable/server";
import AddIncidencia from "./incidenciasTable/add-incidencia";

const dataLeccion = {
	id: "23",
	nombre: "NombreCurso1",
	aula: "Aula 42",
	horaInicio: "08:00",
	horaFin: "12:00",
};

const asisData: Asistencias[] = [
	{
		presentes: 0,
		ausentes: 12,
		total: 12,
	},
];
export default function LeccionPage() {
	return (
		<div>
			<div>
				<h3>Lección</h3>
				<h3>
					Aula: {dataLeccion.aula}, hora inicio: {dataLeccion.horaInicio} a{" "}
					{dataLeccion.horaFin}
				</h3>
				<h3>Materia: {dataLeccion.nombre}</h3>
			</div>
			<div className='flex items-start justify-center'>
				<div className='w-7/12'>
					<React.Suspense fallback={<h1>Cargando tabla...</h1>}>
						<AlumnosEnClaseTableServer />
					</React.Suspense>
				</div>
				<div className='flex w-5/12 flex-col items-center justify-center'>
					<AsistenciasTable data={asisData} />
					<Contenido materia={dataLeccion.nombre} />
					<React.Suspense fallback={<h1>Cargando tabla... </h1>}>
						<IncidenciaTableServer />
					</React.Suspense>
					<AddIncidencia />
					<section className='flex w-full flex-col items-start justify-center gap-2 p-4'>
						<h5>Notificaciones</h5>
						<div className='flex w-full items-center justify-start gap-2'>
							<span className='h-4 w-4 bg-red-500'></span>
							<span>
								Error al enviar los datos debido a fallas de conectividad
							</span>
						</div>
						<div className='flex w-full items-center justify-start gap-2'>
							<span className='h-4 w-4 bg-green-500'></span>
							<span>Los datos fueron enviados correctamente</span>
						</div>
						<div className='flex w-full items-center justify-start gap-2'>
							<span className='h-4 w-4 bg-gray-500'></span>
							<span>Los datos están en proceso de ser enviados</span>
						</div>
					</section>
				</div>
			</div>
		</div>
	);
}
