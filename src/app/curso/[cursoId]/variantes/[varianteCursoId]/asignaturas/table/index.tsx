"use client";

import { type AsignaturaEnVarianteCursoTableItem, columns } from "./columns";
import { DataTable } from "./data-table";

type AsignaturaEnVarianteCursoTableProps = {
	tableItems: AsignaturaEnVarianteCursoTableItem[];
};

export default function AsignaturaEnVarianteCursoTable({
	tableItems,
}: AsignaturaEnVarianteCursoTableProps) {
	return (
		<section className=''>
			{/* <h1 className='text-2xl font-semibold'>Tabla</h1> */}
			<DataTable columns={columns} data={tableItems} />
		</section>
	);
}
