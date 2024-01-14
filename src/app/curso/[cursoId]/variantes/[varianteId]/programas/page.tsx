import React from "react";
import AddPrograma from "./add-programa";
import ProgramasTableServer from "./table/server";
type Context = {
    params: {
        varianteId: string
    }
}
export default function ProgramaPage({ params }: Context) {
	return (
		<>
			<div className='flex flex-col gap-4 justify-center align-center'>
				<div className='pl-6 pr-6 flex items-center justify-between'>
					<AddPrograma varianteId={params.varianteId}/>
				</div>
				<React.Suspense fallback={<h1>Cargando tabla...</h1>} >
					<ProgramasTableServer varianteId={params.varianteId} />
				</React.Suspense>
			</div>
		</>
	);
}