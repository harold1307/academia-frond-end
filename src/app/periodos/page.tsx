import React from "react";
import PeriodosLectivosTables from "./table";
import AddPeriodo from "./addPeriodo";

export const dynamic = "force-dynamic";

type Context = {
	searchParams: { [key: string]: string | string[] | undefined };
};

export default async function MallaPage({ searchParams }: Context) {
	const seccion = searchParams.seccion;

	if (seccion === "ejesFormativos") {
		return (
			<>
				<div className='mt-4'>
					<React.Suspense fallback={"Cargando tabla..."}>
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
