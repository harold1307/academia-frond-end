import React from "react";
import AddCostos from "./add-costos";
import CostosTableServer from "./table/server";
type Context = {
    params: {
        varianteId: string
    }
}
export default function CostosPage({ params }: Context) {
	return (
		<>
			<div className='flex flex-col gap-4 justify-center align-center'>
				<div className='pl-6 pr-6 flex items-center justify-between'>
					<AddCostos varianteId={params.varianteId}/>
					{/* <div className='w-3/12 h-12 relative flex items-center'>
						<Input className='h-100 rounded-xl shadow-primaryShadow' />
						<div className='absolute right-3 h-5 flex justicy-center items-center' >
							<LupaIcon/>
						</div>
					</div> */}
				</div>
				<React.Suspense fallback={<h1>Cargando tabla...</h1>} >
					<CostosTableServer varianteId={params.varianteId} />
				</React.Suspense>
			</div>
		</>
	);
}