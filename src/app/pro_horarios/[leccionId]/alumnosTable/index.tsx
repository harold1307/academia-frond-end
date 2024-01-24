"use client"
import React from "react";
import { DataTable } from "./data-table";
import { AlumnosEnClase, AlumnosEnClaseColumns, AlumnosEnClaseTableItem } from "./columns";

interface AlumnosEnClaseTableProps {
	data: AlumnosEnClase[]
}


export default function AlumnosEnClaseTable({ data }:AlumnosEnClaseTableProps) {

	const alumnos = React.useMemo(() => {
		return data?.map(
			alumno =>
				({
					...alumno,
				}) satisfies AlumnosEnClaseTableItem,
		);
	}, [data]);

	return (
		<section className=''>
			<DataTable columns={AlumnosEnClaseColumns} data={alumnos} />
		</section>
	);
}