import React from "react";
import { notFound } from "next/navigation";
import SubperiodosTable from "./table";
import AddSubperiodo from "./add-subperiodo";
import { APIserver } from "@/core/api-server";
import { type PeriodoLectivoFromAPI } from "@/core/api/periodos-lectivos";
import { Context } from "vm";

export const dynamic = "force-dynamic";

export default async function SubperiodosPage({ params }: Context) {
	const subperiodos = await APIserver.subperiodos.getById(params?.periodoId);
	console.log(subperiodos, params);
	if (!subperiodos) {
		console.log("Subperiodo no existe");
		return notFound();
	}
	return (
		<>
			<div className='mt-4'>
				<React.Suspense fallback={"Cargando tabla..."}>
					<AddSubperiodo periodoId={params.periodoId} />
					<SubperiodosTable subperiodos={subperiodos} />
				</React.Suspense>
			</div>
		</>
	);
}
