import React from "react";

import { AperturaIngresoNotaTable } from "./table";
// import AddAsignatura from "./add-asignatura";
// import AsignaturaTableServer from "./table/server";

export const dynamic = "force-dynamic";

export default function AperturaIngresoNotasPage() {
	return (
		<>
			<h1 className='mb-4 text-xl font-semibold'>
				Solicitudes de apertura de ingresos de notas
			</h1>
			<div>
				{/* <AddAsignatura /> */}
				<React.Suspense fallback={"Cargando tabla..."}>
					<AperturaIngresoNotaTable
						aperturaIngresoNotas={Array(3)
							.fill(0)
							.map((_, i) => ({
								id: i.toString(),
								profesorMateria: {
									profesor: `Profesor ${i + 1}`,
									materia: `Materia ${i + 1}`,
								},
								motivo: `Motivo ${i + 1}`,
								solicitud: new Date().toISOString(),
								aprobado: new Date().toISOString(),
								limite: new Date().toISOString(),

								estado: i % 2 === 0 ? "APROBADO" : "PENDIENTE",
								tipo: "P",
								cerrada: i % 2 === 0,
								campo: `Campo ${i + 1}`,
							}))}
					/>
				</React.Suspense>
			</div>
		</>
	);
}
