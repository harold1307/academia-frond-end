import React from "react";
import AddMateria from "./add-materia";
import MateriasTableServer from "./table/server";
type Context = {
    params: {
        varianteId: string
    }
}
export default function MateriasPage({ params }: Context) {
	return (
		<>
			<div className='flex flex-col gap-4 justify-center align-center'>
				<div className='pl-6 pr-6 flex items-center justify-between'>
					<AddMateria varianteId={params.varianteId}/>
				</div>
				<React.Suspense fallback={<h1>Cargando tabla...</h1>} >
					<MateriasTableServer varianteId={params.varianteId} />
				</React.Suspense>
			</div>
		</>
	);
}