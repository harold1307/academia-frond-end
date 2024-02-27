import React from "react";
import AddPersonal from "./personal/add-personal";
import PersonalTableServer from "./personal/table/server";
import ModeloDeContratoTableServer from "./modelosDeContrato/table/table/server";
import AddModeloDeContrato from "./modelosDeContrato/table/add-modeloDeContrato";

type Context = {
	searchParams: { [key: string]: string | string[] | undefined };
};

export default function PersonalPage({ searchParams }: Context) {
	const section = searchParams.section;

	if (section === "1") {
		return (
			<div>
				<React.Suspense fallback={<h1>Cargando Tabla....</h1>}>
					<h1>Algo</h1>
				</React.Suspense>
			</div>
		);
	}
	if (section === "2") {
		return (
			<div>
				<React.Suspense fallback={<h1>Cargando Tabla....</h1>}>
					<h1>Algo2</h1>
				</React.Suspense>
			</div>
		);
	}
	if (section === "3") {
		return (
			<div>
				<AddModeloDeContrato />
				<React.Suspense fallback={<h1>Cargando Tabla....</h1>}>
					<ModeloDeContratoTableServer />
				</React.Suspense>
			</div>
		);
	}

	return (
		<>
			<AddPersonal />
			<React.Suspense fallback={<h1>Cargando Tabla...</h1>}>
				<PersonalTableServer />
			</React.Suspense>
		</>
	);
}
