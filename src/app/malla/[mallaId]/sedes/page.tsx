import { notFound } from "next/navigation";
import React from "react";

import { APIserver } from "@/core/api-server";
import MallaName from "../asignaturas/malla-name";
import AddSede from "./add-sede";
import SedeTableServer from "./table/server";

type Context = {
	params: {
		mallaId: string;
	};
};

export const dynamic = "force-dynamic";

export default async function SedesPage({ params }: Context) {
	const malla =
		await APIserver.mallasCurriculares.getMallaWithLugaresEjecucionByMallaId(
			params.mallaId,
		);

	if (!malla.data) return notFound();

	return (
		<>
			<h1 className='text-xl font-semibold'>
				Informacion del lugar de ejecucion
			</h1>
			<MallaName malla={malla.data} />
			<div className='mt-4'>
				<AddSede mallaId={params.mallaId} />
				<React.Suspense fallback={"Cargando tabla..."}>
					<SedeTableServer mallaId={params.mallaId} />
				</React.Suspense>
			</div>
		</>
	);
}
