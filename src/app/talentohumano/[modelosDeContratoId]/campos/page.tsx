import React from "react";
import CamposModelosDeContratosTableServer from "./table/server";

export default function ModelosDeContratosCampos() {
	return (
		<div className='p-2'>
			<h1 className='px-6 font-medium text-lg'>Detalle modelo de Contrato</h1>
			<React.Suspense fallback={<h1>Cargando tabla...</h1>}>
				<CamposModelosDeContratosTableServer />
			</React.Suspense>
		</div>
	);
}
