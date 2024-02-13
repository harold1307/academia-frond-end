"use client";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default function InteresadosTable({ mallas }) {
	return (
		<section className='my-2'>
			<DataTable columns={columns} data={mallas} />
		</section>
	);
}
