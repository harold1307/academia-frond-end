"use client";
import type { EjeFormativoFromAPI } from "@/core/api/ejes-formativos";
import { columns } from "./columns";
import { DataTable } from "./data-table";

type EjesFormativosTableProps = {
	ejesFormativos: EjeFormativoFromAPI[];
};

export default function EjesFormativosTable({
	ejesFormativos,
}: EjesFormativosTableProps) {
	return (
		<section>
			<h1 className='text-2xl font-semibold'>Tabla</h1>
			<DataTable columns={columns} data={ejesFormativos} />
		</section>
	);
}
