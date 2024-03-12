import React from "react";

import { APIserver } from "@/core/api-server";
import { notFound } from "next/navigation";
import MallaName from "../asignaturas/malla-name";
import AddModulo from "./add-modulo";
import MallaModulosTableServer from "./table/server";

type Context = {
	params: {
		mallaId: string;
	};
};

export const dynamic = "force-dynamic";

export default async function MallaModulosPage({ params }: Context) {
	const malla = await APIserver.mallasCurriculares.getById(params.mallaId);

	if (!malla.data) return notFound();

	return (
		<>
			<h1 className='text-xl font-semibold'>Modulos anexos al programa</h1>
			<MallaName malla={malla.data} />
			<div className='mt-4'>
				<AddModulo mallaCurricularId={params.mallaId} />
				<React.Suspense fallback={"Cargando tabla..."}>
					<MallaModulosTableServer mallaId={params.mallaId} />
				</React.Suspense>
			</div>
		</>
	);
}
