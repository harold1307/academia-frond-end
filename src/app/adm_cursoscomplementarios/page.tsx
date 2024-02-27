import React from "react";

import AddCursoEscuela from "./add-curso-escuela";
import CursoEscuelaTableServer from "./table/server";

export const dynamic = "force-dynamic";

export default function CursoEscuelasComplementariasPage() {
	return (
		<>
			<h1 className='mb-4 text-xl font-semibold'>
				Cursos y escuelas complementarias
			</h1>
			<div className='mt-4'>
				<AddCursoEscuela />
				<React.Suspense fallback={"Cargando tabla..."}>
					<CursoEscuelaTableServer />
				</React.Suspense>
			</div>
		</>
	);
}
