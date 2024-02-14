import React from "react";
import CarrerasDataTableServer from "./table/server";

export default function CarrerasPage() {
	return (
		<div>
			<React.Suspense fallback={<h1>Cargando tabla...</h1>}>
				<CarrerasDataTableServer />
			</React.Suspense>
		</div>
	);
}
