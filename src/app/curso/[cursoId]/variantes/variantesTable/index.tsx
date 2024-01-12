"use client"
import React from "react";
import { VariantesTableItem, variantesColumns } from "./columns";

import { DataTable } from "./data-table";

//MockUp
import { MUVariantes as data, isLoading } from "@/utils/mockupData";

export default function VarianteTable() {
	// fetch variantes

	const variantes = React.useMemo(() => {
		return data?.map(
			curso =>
				({
					...curso,
				}) satisfies VariantesTableItem,
		);
	}, [data]);

	if (isLoading) {
		return "Cargando tabla...";
	}

	if (isLoading && !variantes) {
		return "WTF";
	}

	if (!variantes) return "Ha ocurrido un error en el fetch";

	return (
		<section className=''>
			{/* <h1 className='text-2xl font-semibold'>Tabla</h1> */}
			<DataTable columns={variantesColumns} data={variantes} />
			{/* <UpdateCursoModal cursos={cursos} /> */}
			{/* <DeactivateCursoModal cursos={cursos} /> */}
		</section>
	);
}