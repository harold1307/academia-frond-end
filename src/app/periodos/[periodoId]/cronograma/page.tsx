"use client";
import React from "react";
import { notFound } from "next/navigation";
import CronogramaTable from "./table";
import AddCronograma from "./addCronograma";

export const dynamic = "force-dynamic";

export default function CronogramaPage({ params }: any) {
	//const traduccion = await APIserver.periodos.getMany();
	const malla = MuFieldCrono.filter(res => res.id == params.periodoId);

	if (!malla) {
		console.log("Malla no existe");
		return notFound();
	}
	return (
		<>
			<div className='mt-4'>
				<React.Suspense fallback={"Cargando tabla..."}>
					<AddCronograma />
					<CronogramaTable mallas={MuFieldCrono} />
				</React.Suspense>
			</div>
		</>
	);
}

const MuFieldCrono = [
	{
		id: "2",
		sede: "principal",
		programa: "Programa prueba con mencion en pruebas",
		modalidad: "presencial",
		nivel: "nivelacion",
		inicio: "fecha",
		fin: "fecha",
	},
	{
		id: "3",
		sede: "principal",
		programa: "Programa prueba con mencion en pruebas",
		modalidad: "presencial",
		nivel: "nivelacion",
		inicio: "fecha",
		fin: "fecha",
	},
	{
		id: "4",
		sede: "principal",
		programa: "Programa prueba con mencion en pruebas",
		modalidad: "presencial",
		nivel: "nivelacion",
		inicio: "fecha",
		fin: "fecha",
	},
	{
		id: "5",
		sede: "principal",
		programa: "Programa prueba con mencion en pruebas",
		modalidad: "presencial",
		nivel: "nivelacion",
		inicio: "fecha",
		fin: "fecha",
	},
	{
		id: "6",
		sede: "principal",
		programa: "Programa prueba con mencion en pruebas",
		modalidad: "presencial",
		nivel: "nivelacion",
		inicio: "fecha",
		fin: "fecha",
	},
];
