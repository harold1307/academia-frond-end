import React from "react";
import AddAsignaturaEnVarianteCurso from "./add-asignatura-en-variante-curso";
import AsignaturaEnVarianteCursoTableServer from "./table/server";

type Context = {
	params: {
		cursoId: string;
		varianteCursoId: string;
	};
};

export default function AsignaturasEnVarianteCursoPage({ params }: Context) {
	return (
		<>
			<div className='mt-4'>
				<AddAsignaturaEnVarianteCurso
					varianteCursoId={params.varianteCursoId}
				/>
				<React.Suspense fallback={"Cargando tabla..."}>
					<AsignaturaEnVarianteCursoTableServer
						varianteCursoId={params.varianteCursoId}
					/>
				</React.Suspense>
			</div>
		</>
	);
}
