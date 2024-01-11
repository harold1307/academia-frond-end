import React from "react";

import { APIserver } from "@/core/api-server";
import AddModulo from "./add-modulo";
import MallaModulosTableServer from "./table/server";

type Context = {
	params: {
		mallaId: string;
	};
};

export default async function MallaModulosPage({ params }: Context) {
	const asignaturas = await APIserver.asignaturas.getMany();

	return (
		<>
			<div className='mt-4'>
				<AddModulo mallaId={params.mallaId} asignaturas={asignaturas.data} />
				<React.Suspense fallback={"Cargando tabla..."}>
					<MallaModulosTableServer mallaId={params.mallaId} />
				</React.Suspense>
			</div>
		</>
	);
}
