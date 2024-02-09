import React from "react";
import AddModeloEvaluativo from "./modelos/add-modelo";
import ModelosEvaluativosTableServer from "./modelos/table/server";
import AddProyectoIntegrador from "./proyectoIntegrador/add-proyecto-integrador";
import ProyectoIntegradorTableServer from "./proyectoIntegrador/table/server";
import NivelacionTableServer from "./nivelacion/table/server";
import AddNivelacion from "./nivelacion/add-nivelacion";
import AddAlternativaEvaluacion from "./alternativasEvaluacion/add-alternativas-evaluacion";
import AlternativaEvaluacionTableServer from "./alternativasEvaluacion/table/server";

type Context = {
	searchParams: { [key: string]: string | string[] | undefined };
};

export default function ModelosEvaluativosPage({ searchParams }: Context) {
	const section = searchParams.section;

	if (section === "1") {
		return (
			<div>
				<AddProyectoIntegrador />
				<React.Suspense fallback={<h1>Cargando Tabla....</h1>}>
					<ProyectoIntegradorTableServer />
				</React.Suspense>
			</div>
		);
	}
	if (section === "2") {
		return (
			<div>
				<AddNivelacion />
				<React.Suspense fallback={<h1>Cargando tabla...</h1>}>
					<NivelacionTableServer />
				</React.Suspense>
			</div>
		);
	}
	if (section === "3") {
		return (
			<div>
				<AddAlternativaEvaluacion />
				<React.Suspense fallback={<h1>Cargando tabla...</h1>}>
					<AlternativaEvaluacionTableServer />
				</React.Suspense>
			</div>
		);
	}

	return (
		<div>
			<AddModeloEvaluativo />
			<React.Suspense fallback={<h1>Cargando tabla...</h1>}>
				<ModelosEvaluativosTableServer />
			</React.Suspense>
		</div>
	);
}
