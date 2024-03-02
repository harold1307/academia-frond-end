import React from "react";
import AddFunciones from "./funciones/add-funciones";
import FuncionesTableServer from "./funciones/table/server";

type Context = {
	searchParams: { [key: string]: string | string[] | undefined };
};

export default function EstructuraOrganica() {
	return (
		<div className='p-2'>
			<div className='mx-4 flex flex-row items-baseline justify-between p-2'>
				<AddFunciones />
			</div>
			<React.Suspense fallback={<h1>Cargando Tabla....</h1>}>
				<FuncionesTableServer />
			</React.Suspense>
		</div>
	);
}
