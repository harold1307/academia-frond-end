"use client";
import { columns, type VarianteCursoTableItem } from "./columns";
import { DataTable } from "./data-table";

type VarianteCursoTableProps = {
	data: VarianteCursoTableItem[];
};

export default function VarianteCursoTable({ data }: VarianteCursoTableProps) {
	return (
		<section className=''>
			{/* <h1 className='text-2xl font-semibold'>Tabla</h1> */}
			<DataTable columns={columns} data={data} />
		</section>
	);
}
