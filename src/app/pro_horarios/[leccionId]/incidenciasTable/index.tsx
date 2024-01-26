"use client"
import React from "react";
import { DataTable } from "./data-table";
import { Incidencias, IncidenciasTableItem, incidenciasColumn } from "./columns";

interface IncidenciasTableProps {
	data: Incidencias[]
}


export default function IncidenciasTable({ data }:IncidenciasTableProps) {

	const incidencias = React.useMemo(() => {
		return data?.map(
			incidencia =>
				({
					...incidencia,
				}) satisfies IncidenciasTableItem,
		);
	}, [data]);

	return (
		<section className='w-full'>
			<DataTable columns={incidenciasColumn} data={data} />
		</section>
	);
}