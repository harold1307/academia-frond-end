import { notFound } from "next/navigation";
import React from "react";

import { APIserver } from "@/core/api-server";
import AddAsignaturaEnMalla from "./add-asignatura-en-malla";
import AsignaturaEnMallaTableServer from "./table/server";

type Context = {
	params: {
		mallaId: string;
	};
};

export const dynamic = "force-dynamic";

export default async function AsignaturasEnMallaPage({ params }: Context) {
	const asignaturas = await APIserver.asignaturas.getMany();
	const malla = await APIserver.mallasCurriculares.getById(params.mallaId);

	if (!malla.data) {
		console.log("Malla no existe");
		return notFound();
	}

	return (
		<>
			<div className='mt-4'>
				<AddAsignaturaEnMalla
					mallaCurricularId={params.mallaId}
					mallaNiveles={malla.data.niveles.map(n => ({
						id: n.id,
						nivel: n.nivel,
					}))}
					asignaturas={asignaturas.data}
				/>
				<React.Suspense fallback={"Cargando tabla..."}>
					<AsignaturaEnMallaTableServer mallaId={params.mallaId} />
				</React.Suspense>
			</div>
		</>
	);
}
