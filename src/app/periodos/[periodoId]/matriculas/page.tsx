"use client";
import React from "react";
import MatriculasTable from "./table";

export const dynamic = "force-dynamic";

export default function MatriculasPage({ params }: any) {
	return (
		<>
			<div className='mt-4'>
				<React.Suspense fallback={"Cargando tabla..."}>
					<MatriculasTable mallas={MuFieldMatriculas} />
				</React.Suspense>
			</div>
		</>
	);
}

const MuFieldMatriculas = [
	{
		id: "1",
		programa: "prueba",
		modalidad: "remoto",
		email: "",
		telefonos: "",
		fechaMatricula: "22/05/22",
	},
	{
		id: "2",
		programa: "prueba",
		modalidad: "",
		email: "",
		telefonos: "",
		fechaMatricula: "22/05/22",
	},
	{
		id: "3",
		programa: "prueba",
		modalidad: "",
		email: "",
		telefonos: "",
		fechaMatricula: "22/05/22",
	},
];
