"use client"
import React from "react";
import { DataTable } from "./data-table";
import { MateriasDeNivelTableItem, MateriasDeNivelColumns } from "./columns";

interface MateriasDeNivelTableProps {
	data: MateriasDeNivelTableItem[]
}


export default function MateriasDeNivelTable({ data }: MateriasDeNivelTableProps) {

	const MateriasDeNivel = React.useMemo(() => {
		return data?.map(
			MateriasDeNivel =>
				({
					...MateriasDeNivel,
				}) satisfies MateriasDeNivelTableItem,
		);
	}, [data]);
   console.log(MateriasDeNivelColumns)
	return (
		<section className=''>
			<DataTable columns={MateriasDeNivelColumns} data={MateriasDeNivel} />
		</section>
	);
}