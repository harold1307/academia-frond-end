import React from "react";

import AddAsignatura from "./add-asignatura";
import AsignaturaTableServer from "./table/server";

export const dynamic = "force-dynamic";

export default function AsignaturaPage() {
	return (
		<>
			<h1 className='mb-4 text-xl font-semibold'>Asignaturas</h1>
			<div>
				<AddAsignatura />
				<React.Suspense fallback={"Cargando tabla..."}>
					<AsignaturaTableServer />
				</React.Suspense>
			</div>
		</>
	);
}
