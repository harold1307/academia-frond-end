"use client";
import React from "react";
import { notFound } from "next/navigation";
import SubperiodosTable from "./table";
import AddSubperiodo from "./add-subperiodo";

export const dynamic = "force-dynamic";

export default function SubperiodosPage({ params }: any) {
	//const traduccion = await APIserver.periodos.getMany();
	const malla = MuFieldSubs.filter(res => res.id == params.periodoId);

	if (!malla) {
		console.log("Malla no existe");
		return notFound();
	}
	return (
		<>
			<div className='mt-4'>
				<React.Suspense fallback={"Cargando tabla..."}>
					<AddSubperiodo />
					<SubperiodosTable mallas={MuFieldSubs} />
				</React.Suspense>
			</div>
		</>
	);
}

const MuFieldSubs = [
	{
		id: "1",
		nombre: "prueba",
		inicio: "18/12/24",
		fin: "18/12/25",
	},
	{
		id: "2",
		nombre: "prueba",
		inicio: "18/12/24",
		fin: "18/12/25",
	},
	{
		id: "3",
		nombre: "prueba",
		inicio: "18/12/24",
		fin: "18/12/25",
	},
	{
		id: "4",
		nombre: "prueba",
		inicio: "18/12/24",
		fin: "18/12/25",
	},
];
