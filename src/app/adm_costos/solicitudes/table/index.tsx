"use client";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import React from "react";

export default function SolicitudesTable({ especies }: { especies: any }) {
	return (
		<section className='my-2'>
			<DataTable columns={columns} data={especies} />
		</section>
	);
}
