<<<<<<< HEAD
import React from "react";
import RequisitoTable from "./table";
import AddReq from "./addReq";
import { APIserver } from "@/core/api-server";

export const dynamic = "force-dynamic";

export default async function RequisitoPage({ params }: any) {
	const requisitos = await APIserver.requisitos.getById(params?.periodoId);
	return (
		<>
			<div className='mt-4'>
				<React.Suspense fallback={"Cargando tabla..."}>
					<AddReq />
					<RequisitoTable requisitos={requisitos} />
				</React.Suspense>
			</div>
		</>
	);
}
=======
"use client";
import React from "react";
import RequisitoTable from "./table";
import { notFound } from "next/navigation";
import AddReq from "./addReq";

export const dynamic = "force-dynamic";

export default function RequisitoPage({ params }: any) {
	return (
		<>
			<div className='mt-4'>
				<React.Suspense fallback={"Cargando tabla..."}>
					<AddReq />
					<RequisitoTable mallas={MuFieldReq} />
				</React.Suspense>
			</div>
		</>
	);
}

const MuFieldReq = [
	{
		id: "1",
		sede: "central",
		programa: "normal",
		modalidad: "lorem",
		nivel: "ipsum",
		reqTipo: "at amet",
		obligatorio: "no",
		archivo: "file",
		transferir: "no",
		primeraMatricula: "si",
		repite: "si",
	},
	{
		id: "2",
		sede: "central",
		programa: "normal",
		modalidad: "lorem",
		nivel: "ipsum",
		reqTipo: "at amet",
		obligatorio: "no",
		archivo: "file",
		transferir: "no",
		primeraMatricula: "si",
		repite: "si",
	},
	{
		id: "3",
		sede: "central",
		programa: "normal",
		modalidad: "lorem",
		nivel: "ipsum",
		reqTipo: "at amet",
		obligatorio: "no",
		archivo: "file",
		transferir: "no",
		primeraMatricula: "si",
		repite: "si",
	},
	{
		id: "4",
		sede: "central",
		programa: "normal",
		modalidad: "lorem",
		nivel: "ipsum",
		reqTipo: "at amet",
		obligatorio: "no",
		archivo: "file",
		transferir: "no",
		primeraMatricula: "si",
		repite: "si",
	},
	{
		id: "5",
		sede: "central",
		programa: "normal",
		modalidad: "lorem",
		nivel: "ipsum",
		reqTipo: "at amet",
		obligatorio: "no",
		archivo: "file",
		transferir: "no",
		primeraMatricula: "si",
		repite: "si",
	},
];
>>>>>>> 141acad7653eea714b3def88cf98e017bc0e9bb4
