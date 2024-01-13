import { notFound } from "next/navigation";
import React from "react";

import { APIserver } from "@/core/api-server";
import AddVariante from "./add-variante";
import VarianteCursoTableServer from "./table/server";

type Context = {
	params: {
		cursoId: string;
	};
};

export const dynamic = "force-dynamic";

export default async function CursosVariantesPage({ params }: Context) {
	const curso = await APIserver.cursos.getCursoWithVariantesByCursoId(
		params.cursoId,
	);

	if (!curso) return notFound();

	return (
		<>
			<div className='mt-4'>
				<AddVariante cursoId={curso.data.id} />
				<React.Suspense fallback={"Cargando tabla..."}>
					<VarianteCursoTableServer cursoId={params.cursoId} />
				</React.Suspense>
			</div>
		</>
	);
}
