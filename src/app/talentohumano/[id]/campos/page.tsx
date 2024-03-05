import React from "react";
import CamposModelosDeContratosTableServer from "./table/server";

export default function CamposPage() {
	return (
		<div className='px-2 py-4'>
			<h1 className='px-6 my-3 text-lg font-medium'>Detalle modelo de Contrato</h1>
			<React.Suspense fallback={<h1>Cargando tabla...</h1>}>
				<CamposModelosDeContratosTableServer />
			</React.Suspense>
		</div>
	);
}
