import { notFound } from "next/navigation";
import React from "react";

import { APIserver } from "@/core/api-server";
import AddMateria from "./add-materia";
import MateriasTableServer from "./table/server";

export const dynamic = "force-dynamic";

type Context = {
	params: {
		varianteCursoId: string;
	};
};

export default async function MateriasPage({ params }: Context) {
	const variante = await APIserver.variantesCurso.getByIdWithAsignaturas(
		params.varianteCursoId,
	);

	if (!variante.data) return notFound();

	return (
		<>
			<div className='align-center flex flex-col justify-center gap-4'>
				<div className='flex items-center justify-between pl-6 pr-6'>
					{!variante.data.estado && (
						<AddMateria varianteId={params.varianteCursoId} />
					)}
				</div>
				<React.Suspense fallback={<h1>Cargando tabla...</h1>}>
					<MateriasTableServer varianteId={params.varianteCursoId} />
				</React.Suspense>
			</div>
		</>
	);
}
