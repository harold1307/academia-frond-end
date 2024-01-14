"use client"
import React from "react";
import { ProgramaTableItem, programasColumns } from "./columns";
import { DataTable } from "./data-table";

interface ProgramasTableProps {
	varianteId: string
}

const isLoading = false
const data = {
	programas: [
		{
			todosLosProgramas: false,
			programa: 'Enfermeria',
			modalidad: 'Presencial',
			malla: 'Malla1',
			registroExterno: true
		}
	]
}

export default function ProgramasTable({ varianteId }:ProgramasTableProps) {

	// const { isLoading, data } = useQuery({
	//	fetch programas
	// });

	const programas = React.useMemo(() => {
		return data?.programas?.map(
			curso =>
				({
					...curso,
				}) satisfies ProgramaTableItem,
		);
	}, [data]);

	if (isLoading) {
		return "Cargando tabla...";
	}

	if (isLoading && !programas) {
		return "WTF";
	}

	if (!programas) return "Ha ocurrido un error en el fetch";

	return (
		<section className=''>
			<DataTable columns={programasColumns} data={programas} />
			{/* <UpdateVarianteModal variantes={programas} /> */}
			{/* <DeactivateVariatneModal variantes={programas}/> */}
		</section>
	);
}