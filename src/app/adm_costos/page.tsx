import React from "react";
import { APIserver } from "@/core/api-server";
import CostosTable from "./table";
import AddCostos from "./addCostos";
import EspeciesPage from "./especies_valoradas/page";
import SolicitudesPage from "./solicitudes/page";
import GrupoCostosPage from "./grupo_costos/page";
import ProgramaPage from "./programa/page";
export const dynamic = "force-dynamic";

type Context = {
	searchParams: { [key: string]: string | string[] | undefined };
};

export default async function CostosPage({ searchParams }: Context) {
	const seccion = searchParams.seccion;
	if (seccion === "especiesValoradas") {
		return (
			<>
				<div className='mt-4'>
					<React.Suspense fallback={"Cargando tabla..."}>
						<EspeciesPage />
					</React.Suspense>
				</div>
			</>
		);
	}
	if (seccion === "solicitudes") {
		return (
			<>
				<div className='mt-4'>
					<React.Suspense fallback={"Cargando tabla..."}>
						<SolicitudesPage />
					</React.Suspense>
				</div>
			</>
		);
	}
	if (seccion === "programa") {
		return (
			<>
				<div className='mt-4'>
					<React.Suspense fallback={"Cargando tabla..."}>
						<ProgramaPage searchParams={searchParams} />
					</React.Suspense>
				</div>
			</>
		);
	}
	if (seccion === "grupoCostos") {
		return (
			<>
				<div className='mt-4'>
					<React.Suspense fallback={"Cargando tabla..."}>
						<GrupoCostosPage />
					</React.Suspense>
				</div>
			</>
		);
	}

	return (
		<>
			<div className='mt-4'>
				<AddCostos />
				<CostosTable costos={MuCostos} />
			</div>
		</>
	);
}

const MuCostos = [
	{
		id: 1,
		nombre: "Test",
		codigo: "EXT",
		codigoExt: "",
		iva: "Sin IVA",
		valor: 0,
		precioLibre: true,
		estudiante: false,
		activo: false,
	},
];
