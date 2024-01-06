"use client";
import type { AreaConocimientoFromAPI } from "@/core/api/areas-conocimiento";
import { columns } from "./columns";
import { DataTable } from "./data-table";

type AreasConocimientoTableProps = {
	areasConocimiento: AreaConocimientoFromAPI[];
};

export default function AreasConocimientoTable({
	areasConocimiento,
}: AreasConocimientoTableProps) {
	return (
		<section>
			<h1 className='text-2xl font-semibold'>Tabla</h1>
			<DataTable columns={columns} data={areasConocimiento} />
		</section>
	);
}
