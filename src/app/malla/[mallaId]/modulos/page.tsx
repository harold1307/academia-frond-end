import React from "react";

import AddModulo from "./add-modulo";
import MallaModulosTableServer from "./table/server";

type Context = {
	params: {
		mallaId: string;
	};
};

export default async function MallaModulosPage({ params }: Context) {
	return (
		<>
			<div className='mt-4'>
				<AddModulo mallaCurricularId={params.mallaId} />
				<React.Suspense fallback={"Cargando tabla..."}>
					<MallaModulosTableServer mallaId={params.mallaId} />
				</React.Suspense>
			</div>
		</>
	);
}
