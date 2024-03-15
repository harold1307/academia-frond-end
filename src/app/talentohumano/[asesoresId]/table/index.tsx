"use client";
import React from "react";
import { DataTable } from "./data-table";
import { type EstudiantesTableItem, estudiantesColumns } from "./columns";

interface EstudiantesTableProps {
	data: EstudiantesTableItem[];
}

export default function EstudiantesTable({ data }: EstudiantesTableProps) {
	const estudiantes = React.useMemo(() => {
		return data?.map(
			campoModelosDeContratos =>
				({
					...campoModelosDeContratos,
				}) satisfies EstudiantesTableItem,
		);
	}, [data]);

	return (
		<section className=''>
			<DataTable columns={estudiantesColumns} data={estudiantes} />
		</section>
	);
}
