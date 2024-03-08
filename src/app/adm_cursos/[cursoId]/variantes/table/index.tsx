"use client";
import { DataTable } from "@/app/_components/table";
import { columns, type VarianteCursoTableItem } from "./columns";

type VarianteCursoTableProps = {
	data: VarianteCursoTableItem[];
};

export default function VarianteCursoTable({ data }: VarianteCursoTableProps) {
	return (
		<section>
			{/* <h1 className='text-2xl font-semibold'>Tabla</h1> */}
			<DataTable<typeof columns, VarianteCursoTableItem[]>
				columns={columns}
				data={data}
				hideColumns={{
					id: false,
				}}
			/>
		</section>
	);
}
