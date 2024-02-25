import React from "react";
import PeriodosLectivosTables from "./table";
import AddPeriodo from "./addPeriodo";
import CortesPage from "./cortes/page";
import { APIserver } from "@/core/api-server";

export const dynamic = "force-dynamic";

type Context = {
	searchParams: { [key: string]: string | string[] | undefined };
};

export default async function PeriodoPage({ searchParams }: Context) {
	const seccion = searchParams.seccion;
	const periodos = await APIserver.periodos.getMany();
	console.log(periodos.data[0]?.calculoCosto)
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
				<PeriodosLectivosTables periodos={periodos.data} />
			</div>
		</>
	);
}
