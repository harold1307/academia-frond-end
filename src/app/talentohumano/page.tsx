import React from "react";
import AddPersonal from "./personal/add-personal";
import TalentoHumanoTableServer from "./personal/table/server";

type Context = {
	searchParams: { [key: string]: string | string[] | undefined };
};

export default function TalentoHumanoPage({ searchParams }: Context) {
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
				<React.Suspense fallback={<h1>Cargando Tabla....</h1>}>
					<h1>Algo3</h1>
				</React.Suspense>
			</div>
		);
	}

	return (
		<>
			<AddPersonal />
			<React.Suspense fallback={<h1>Cargando Tabla...</h1>}>
				<TalentoHumanoTableServer />
			</React.Suspense>
		</>
	);
}
