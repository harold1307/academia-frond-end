import { notFound } from "next/navigation";
import React from "react";

import { APIserver } from "@/core/api-server";
import CursoEscuelaName from "../curso-escuela-name";
import AddProgramaEnCursoEscuela from "./add-programa";
import ProgramaEnCursoEscuelaTableServer from "./table/server";

type Context = {
	params: {
		cursoEscuelaId: string;
	};
};

export const dynamic = "force-dynamic";

export default async function CursosEscuelasPage({ params }: Context) {
	const curso = await APIserver.cursoEscuelas.getById(params.cursoEscuelaId);

	if (!curso.data) return notFound();

	return (
		<>
			<h1 className='text-xl font-semibold'>
				Programas que se pueden registrar en el curso
			</h1>
			<CursoEscuelaName cursoEscuela={curso.data} />
			<div className='mt-4'>
				<AddProgramaEnCursoEscuela
					cursoEscuelaId={params.cursoEscuelaId}
					cursoEscuelaEstado={curso.data.estado}
				/>
				<React.Suspense fallback={"Cargando tabla..."}>
					<ProgramaEnCursoEscuelaTableServer
						cursoEscuelaId={params.cursoEscuelaId}
					/>
				</React.Suspense>
			</div>
		</>
	);
}
