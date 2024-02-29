import React from "react";
import AddPrograma from "./add-programa";
import ProgramasTableServer from "./table/server";
type Context = {
	params: {
		varianteId: string;
	};
};
export default function ProgramaPage({ params }: Context) {
	return (
		<>
			<div className='align-center flex flex-col justify-center gap-4'>
				<div className='flex items-center justify-between pl-6 pr-6'>
					<AddPrograma varianteId={params.varianteId} />
				</div>
				<React.Suspense fallback={<h1>Cargando tabla...</h1>}>
					<ProgramasTableServer varianteId={params.varianteId} />
				</React.Suspense>
			</div>
		</>
	);
}
