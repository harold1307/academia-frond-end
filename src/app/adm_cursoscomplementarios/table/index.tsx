"use client";

import { columns, type CursoEscuelaTableItem } from "./columns";
import { DataTable } from "./data-table";

export type CursoEscuelaTableProps = {
	data: CursoEscuelaTableItem[];
};

export default function CursoTable({ data }: CursoEscuelaTableProps) {
	return (
		<section className=''>
			{/* <h1 className='text-2xl font-semibold'>Tabla</h1> */}
			<DataTable columns={columns} data={data} />
			{/* <UpdateCursoModal cursos={data} />
			<DeactivateCursoModal cursos={data} />
			<DeleteAsignaturaTableModal cursos={data} /> */}
		</section>
	);
}
