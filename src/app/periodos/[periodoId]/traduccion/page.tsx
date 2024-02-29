<<<<<<< HEAD
"use client";
import React from "react";
import TraduccionTable from "./table";
import { notFound } from "next/navigation";
import { APIserver } from "@/core/api-server";
import AddTrad from "./addTraduccion";

export const dynamic = "force-dynamic";

export default function TraduccionPage({ params }: any) {
	return (
		<>
			<div className='mt-4'>
				<React.Suspense fallback={"Cargando tabla..."}>
					<AddTrad />
					<TraduccionTable mallas={MuFieldTrad} />
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
=======
import React from "react";
import TraduccionTable from "./table";
import { notFound } from "next/navigation";
import { APIserver } from "@/core/api-server";
import AddTrad from "./addTraduccion";

export const dynamic = "force-dynamic";

export default function TraduccionPage({ params }: any) {
	return (
		<>
			<div className='mt-4'>
				<React.Suspense fallback={"Cargando tabla..."}>
					<AddTrad />
					<TraduccionTable mallas={MuFieldTrad} />
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
>>>>>>> 141acad7653eea714b3def88cf98e017bc0e9bb4
