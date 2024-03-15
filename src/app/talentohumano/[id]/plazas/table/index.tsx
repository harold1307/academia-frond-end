"use client";
import React from "react";
import { DataTable } from "./data-table";
import {
	type PlazasDepartamentosTableItem,
	PlazasDepartamentosColumns,
} from "./columns";

interface PlazasDepartamentosTableProps {
	data: PlazasDepartamentosTableItem[];
}

export default function PlazasDepartamentosTable({
	data,
}: PlazasDepartamentosTableProps) {
	const camposModelosDeContratos = React.useMemo(() => {
		return data?.map(
			plazasDepartamentos =>
				({
					...plazasDepartamentos,
				}) satisfies PlazasDepartamentosTableItem,
		);
	}, [data]);

	return (
		<section className=''>
			<DataTable
				columns={PlazasDepartamentosColumns}
				data={camposModelosDeContratos}
			/>
		</section>
	);
}
