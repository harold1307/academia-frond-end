import React from "react";
import SelectMalla from "./select-malla";
import Plantillas from "./plantillas";
import HorariosAdminTableServer from "./table/server";
import Niveles from "./niveles";

export default function Adm_HorariosPage() {
	return (
		<div>
			<Plantillas />
			<div className='flex h-16 w-full flex-col items-center justify-center'>
				<React.Suspense fallback={<h1>Cargando mallas </h1>}>
					<SelectMalla />
				</React.Suspense>
				<Niveles />
			</div>
			<React.Suspense fallback={<h1>Cargando tabla...</h1>}>
				<HorariosAdminTableServer />
			</React.Suspense>
		</div>
	);
}
