import React from "react";
import { notFound } from "next/navigation";
import CronogramaTable from "./table";
import AddCronograma from "./addCronograma";
import { APIserver } from "@/core/api-server";

export const dynamic = "force-dynamic";

export default async function CronogramaPage({ params }: any) {
	const cronograma =
		await APIserver.periodos.getByIdWithCronogramasMatriculacion(
			params.periodoId,
		);

	if (!cronograma) {
		console.log("cronograma no existe");
		return notFound();
	}
	return (
		<>
			<div className='mt-4'>
				<React.Suspense fallback={"Cargando tabla..."}>
					<AddCronograma />
					<CronogramaTable cronograma={cronograma.data} />
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
