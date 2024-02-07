"use client";
import React from "react";
import TraduccionTable from "./table";
import { notFound } from "next/navigation";
import { APIserver } from "@/core/api-server";

export const dynamic = "force-dynamic";

export default function TraduccionPage({ params }: any) {
	//const traduccion = await APIserver.periodos.getMany();
	const malla = MuFieldTrad.filter(res => res.id == params.periodoId);

	if (!malla) {
		console.log("Malla no existe");
		return notFound();
	}
	return (
		<>
			<div className='mt-4'>
				<React.Suspense fallback={"Cargando tabla..."}>
					<TraduccionTable mallas={malla} />
				</React.Suspense>
			</div>
		</>
	);
}

const MuFieldTrad = [
	{ id: "1", nombre: "Periodo Prueba MT", idioma: "ingles" },
	{ id: "2", nombre: "Periodo Prueba MT", idioma: "ingles" },
	{ id: "3", nombre: "Periodo Prueba MT", idioma: "ingles" },
	{ id: "4", nombre: "Periodo Prueba MT", idioma: "ingles" },
	{ id: "5", nombre: "Periodo Prueba MT", idioma: "ingles" },
];
