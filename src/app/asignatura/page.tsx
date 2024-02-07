import React from "react";

import AddAsignatura from "./add-asignatura";
import AsignaturaTableServer from "./table/server";

export const dynamic = "force-dynamic";

export default function AsignaturaPage() {
	return (
		<>
			<div className='mt-4'>
				<AddAsignatura />
				<React.Suspense fallback={"Cargando tabla..."}>
					<AsignaturaTableServer />
				</React.Suspense>
			</div>
		</>
	);
}
