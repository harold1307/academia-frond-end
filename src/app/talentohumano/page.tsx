import React from "react";
import TalentoHumanoTableServer from "./table/server";

export default function TalentoHumanoPage() {
	return (
		<>
			<React.Suspense fallback={<h1>Cargando Tabla...</h1>}>
				<TalentoHumanoTableServer />
			</React.Suspense>
		</>
	);
}
