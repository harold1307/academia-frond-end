// import LupaIcon from "../_components/ui/icons/lupa";
// import { Input } from "../_components/ui/input";
// import AddCurso from "./add-curso";
// import CursoTable from "./cursosTable";

import React from "react";
import AddPrograma from "./add-programa";
import ProgramasTable from "./table";
import ProgramasTableServer from "./table/server";
type Context = {
    params: {
        varianteId: string
    }
}
export default function CursoPage({ params }: Context) {
	return (
		<>
			<div className='flex flex-col gap-4 justify-center align-center'>
				<div className='pl-6 pr-6 flex items-center justify-between'>
					<AddPrograma varianteId={params.varianteId}/>
					{/* <div className='w-3/12 h-12 relative flex items-center'>
						<Input className='h-100 rounded-xl shadow-primaryShadow' />
						<div className='absolute right-3 h-5 flex justicy-center items-center' >
							<LupaIcon/>
						</div>
					</div> */}
				</div>
				<React.Suspense fallback={<h1>Cargando tabla...</h1>} >

				</React.Suspense>
				<ProgramasTableServer varianteId={params.varianteId} />
			</div>
		</>
	);
}