"use client";
import React from "react";
import { DataTable } from "./data-table";
import {
	type Asistencias,
	type AsistenciasTableItem,
	asistenciasColumns,
} from "./columns";

interface AsistenciasTableProps {
	data: Asistencias[];
}

export default function AsistenciasTable({ data }: AsistenciasTableProps) {
	const asistencias = React.useMemo(() => {
		return data?.map(
			asistencia =>
				({
					...asistencia,
				}) satisfies AsistenciasTableItem,
		);
	}, [data]);

	return (
		<section className='w-full'>
			<DataTable columns={asistenciasColumns} data={data} />
		</section>
	);
}
