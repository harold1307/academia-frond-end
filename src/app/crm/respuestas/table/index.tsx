"use client";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default function RespuestasTable({ mallas }) {
	return (
		<section className='my-2'>
			<DataTable columns={columns} data={mallas} />
		</section>
	);
}