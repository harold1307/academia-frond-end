import React from "react";
import HorariosTableHandler from "./table/horarios-table-handler";
import HorariosTableServer from "./table/server";

export default function HorariosPage() {
	return (
		<>
			<HorariosTableHandler />
			<React.Suspense fallback={<h1>Cargando Tabla...</h1>}>
				<HorariosTableServer />
			</React.Suspense>
		</>
	);
}
