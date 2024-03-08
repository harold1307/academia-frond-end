import { notFound } from "next/navigation";
import React from "react";

import { APIserver } from "@/core/api-server";
import AddPrograma from "./add-programa";
import ProgramasTableServer from "./table/server";

type Context = {
	params: {
		varianteCursoId: string;
	};
};

export const dynamic = "force-dynamic";

export default async function ProgramaPage({ params }: Context) {
	const variante = await APIserver.variantesCurso.getByIdWithProgramas(
		params.varianteCursoId,
	);

	if (!variante.data) return notFound();

	return (
		<>
			<div className='align-center flex flex-col justify-center gap-4'>
				<div className='flex items-center justify-between pl-6 pr-6'>
					<AddPrograma
						varianteId={params.varianteCursoId}
						varianteEstado={variante.data.estado}
					/>
				</div>
				<React.Suspense fallback={<h1>Cargando tabla...</h1>}>
					<ProgramasTableServer varianteId={params.varianteCursoId} />
				</React.Suspense>
			</div>
		</>
	);
}
