import React from "react";
import SelectNivel from "./select-nivel";
import AddNivelAcademico from "./add-nivelacademico";
import NivelesTableServer from "./table/server";
import Niveles from "./niveles";
import { APIserver } from "@/core/api-server";

type Context = {
	searchParams: { [key: string]: string | undefined };
};

export default async function NivelesPage({ searchParams }: Context) {
	const programa = await APIserver.programas.getMany()
	const programaId = searchParams.programaId
	return (
		<div>
			{/* <div className='flex h-16 w-full flex-col items-center justify-center'>
				<React.Suspense fallback={<h1>Cargando mallas </h1>}>
					<SelectNivel />
				</React.Suspense>
				<Niveles />
			</div> */}
			<React.Suspense fallback={<h1>Cargando tabla...</h1>}>
				<AddNivelAcademico />
				<SelectNivel programa={programa.data.map((e) => ({ id: e.id, nombre: e.nombre }))} programaId={programaId} />
				<NivelesTableServer programaId={programaId} />
			</React.Suspense>
		</div>
	);
}
