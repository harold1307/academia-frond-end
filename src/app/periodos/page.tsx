import React from "react";
import PeriodosLectivosTables from "./table";
import AddPeriodo from "./addPeriodo";
import CortesPage from "./cortes/page";

export const dynamic = "force-dynamic";

type Context = {
	searchParams: { [key: string]: string | string[] | undefined };
};

export default async function MallaPage({ searchParams }: Context) {
	const seccion = searchParams.seccion;

	if (seccion === "cortes") {
		return (
			<>
				<div className='mt-4'>
					<React.Suspense fallback={"Cargando tabla..."}>
						<CortesPage />
					</React.Suspense>
				</div>
			</>
		);
	}
	return (
		<>
			<div className='mt-4'>
				<AddPeriodo />
				<PeriodosLectivosTables />
			</div>
		</>
	);
}
