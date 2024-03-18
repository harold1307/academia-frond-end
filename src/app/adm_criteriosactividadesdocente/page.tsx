import React from "react";

import { AddDocente } from "./add";
import { CriterioActividadDocenteTable } from "./table";

export const dynamic = "force-dynamic";

export default function ActividadDocentePage() {
	return (
		<>
			<h1 className='mb-4 text-xl font-semibold'>
				Criterios de actividades academicas
			</h1>
			<div>
				<AddDocente />
				<React.Suspense fallback={"Cargando tabla..."}>
					<CriterioActividadDocenteTable
						criterioActividades={Array(3)
							.fill(0)
							.map((_, i) => {
								const criterios = {
									investigacion: {
										horas: i * 20,
										criterios: i * 20,
									},
									gestion: {
										horas: i * 30,
										criterios: i * 30,
									},
									practicasComunitarias: {
										horas: i * 40,
										criterios: i * 40,
									},
									practicasPreProfesionales: {
										horas: i * 50,
										criterios: i * 50,
									},
								};

								return {
									id: i.toString(),
									nombre: `Profesor ${i + 1}`,
									identificacion: `123456789-${i}`,
									dedicacionRelacionLaboralCargo: "TIEMPO COMPLETO",
									escalafon: "TITULAR PRINCIPAL",
									conMeritos: i % 2 === 0,
									estudio: i % 2 === 0,
									beca: i % 2 === 0,
									salario: Math.round(i * Math.random() * 10_000),
									docencia: {
										horas: i * 10,
										criterios: i * 10,
									},
									...criterios,
									totalHoras: Object.values(criterios).reduce(
										(acc, c) => acc + c.horas,
										0,
									),
									materias: i + 2,
									portafolio: i + 3,
								};
							})}
					/>
				</React.Suspense>
			</div>
		</>
	);
}
