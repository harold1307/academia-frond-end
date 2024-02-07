import React from "react";
import AddMateria from "./add-materia";
import MateriasTableServer from "./table/server";

type Context = {
	params: {
		varianteCursoId: string;
	};
};

export default function MateriasPage({ params }: Context) {
	return (
		<>
			<div className='align-center flex flex-col justify-center gap-4'>
				<div className='flex items-center justify-between pl-6 pr-6'>
					<AddMateria varianteId={params.varianteCursoId} />
				</div>
				<React.Suspense fallback={<h1>Cargando tabla...</h1>}>
					<MateriasTableServer varianteId={params.varianteCursoId} />
				</React.Suspense>
			</div>
		</>
	);
}
