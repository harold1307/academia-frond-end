import React from "react";
import TalentoHumanoTable from "./table/server";

export default function HorariosPage() {
	return (
		<>
			<React.Suspense fallback={<h1>Cargando Tabla...</h1>}>
				<TalentoHumanoTable />
			</React.Suspense>
		</>
	);
}
