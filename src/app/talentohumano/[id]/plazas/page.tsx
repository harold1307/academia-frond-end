import React from "react";
import PlazasTableServer from "./table/server";

export default function PlazasDepartamentos() {
	return (
		<div className='px-2 py-4'>
			<h1 className='my-3 px-6 text-lg font-medium'>
				Plazas laborales del departamento
			</h1>
			<React.Suspense fallback={<h1>Cargando tabla...</h1>}>
				<PlazasTableServer />
			</React.Suspense> 
		</div>
	);
}
