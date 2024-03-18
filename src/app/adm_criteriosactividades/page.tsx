import { PlusCircle } from "lucide-react";
import React from "react";

import { Button } from "../_components/ui/button";
import { CriterioActividadGestionTable } from "./gestion/table";
import { CriterioActividadInvestigacionTable } from "./investigacion/table";
import { CriterioActividadPracticaComunitariaTable } from "./practicas-comunitarias/table";
import { CriterioActividadPracticaPreProfesionalTable } from "./practicas-pre-profesionales/table";
import { CriterioActividadTable } from "./table";
import { CriterioActividadTabs, criterioActividadSeccionParams } from "./tabs";

export const dynamic = "force-dynamic";

type Context = {
	searchParams: { [key: string]: string | undefined };
};

const data = Array(10)
	.fill(0)
	.map((_, i) => ({
		id: i.toString(),
		criterio: `Criterio ${i + 1}`,
		tiempoDedicacion: `${i + 1} horas`,
		aprobacion: i % 2 === 0,
	}));

export default function AsignaturaPage({ searchParams }: Context) {
	const { seccion } = searchParams;

	if (seccion === criterioActividadSeccionParams.investigacion) {
		return (
			<>
				<h1 className='mb-4 text-xl font-semibold'>
					Criterios de actividades academicas
				</h1>
				<CriterioActividadTabs seccion={seccion} />
				<div className='mt-4'>
					{/* <AddCoordinacion /> */}
					<Button variant='outline' className='mb-2'>
						<PlusCircle className='mr-2' />
						Agregar
					</Button>
					<React.Suspense fallback={"Cargando tabla..."}>
						<CriterioActividadInvestigacionTable
							criterioActividades={data.slice(0, 3)}
						/>
					</React.Suspense>
				</div>
			</>
		);
	}

	if (seccion === criterioActividadSeccionParams.gestion) {
		return (
			<>
				<h1 className='mb-4 text-xl font-semibold'>
					Criterios de actividades academicas
				</h1>
				<CriterioActividadTabs seccion={seccion} />
				<div className='mt-4'>
					{/* <AddCoordinacion /> */}
					<Button variant='outline' className='mb-2'>
						<PlusCircle className='mr-2' />
						Agregar
					</Button>
					<React.Suspense fallback={"Cargando tabla..."}>
						<CriterioActividadGestionTable
							criterioActividades={data.slice(3, 6)}
						/>
					</React.Suspense>
				</div>
			</>
		);
	}

	if (seccion === criterioActividadSeccionParams.practicasComunitarias) {
		return (
			<>
				<h1 className='mb-4 text-xl font-semibold'>
					Criterios de actividades academicas
				</h1>
				<CriterioActividadTabs seccion={seccion} />
				<div className='mt-4'>
					{/* <AddCoordinacion /> */}
					<Button variant='outline' className='mb-2'>
						<PlusCircle className='mr-2' />
						Agregar
					</Button>
					<React.Suspense fallback={"Cargando tabla..."}>
						<CriterioActividadPracticaComunitariaTable
							criterioActividades={data.slice(6, 9)}
						/>
					</React.Suspense>
				</div>
			</>
		);
	}

	if (seccion === criterioActividadSeccionParams.practicasPreProfesionales) {
		return (
			<>
				<h1 className='mb-4 text-xl font-semibold'>
					Criterios de actividades academicas
				</h1>
				<CriterioActividadTabs seccion={seccion} />
				<div className='mt-4'>
					{/* <AddCoordinacion /> */}
					<Button variant='outline' className='mb-2'>
						<PlusCircle className='mr-2' />
						Agregar
					</Button>
					<React.Suspense fallback={"Cargando tabla..."}>
						<CriterioActividadPracticaPreProfesionalTable
							criterioActividades={data.slice(9, -1)}
						/>
					</React.Suspense>
				</div>
			</>
		);
	}

	return (
		<>
			<h1 className='mb-4 text-xl font-semibold'>
				Criterios de actividades academicas
			</h1>
			<CriterioActividadTabs seccion='docencia' />
			<div className='mt-4'>
				{/* <AddAsignatura /> */}
				<Button variant='outline' className='mb-2'>
					<PlusCircle className='mr-2' />
					Agregar
				</Button>
				<React.Suspense fallback={"Cargando tabla..."}>
					<CriterioActividadTable criterioActividades={data} />
				</React.Suspense>
			</div>
		</>
	);
}
