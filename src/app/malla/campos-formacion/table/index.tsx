"use client";
import type { CampoFormacionFromAPI } from "@/core/api/campos-formacion";
import { columns } from "./columns";
import { DataTable } from "./data-table";

type CamposFormacionTableProps = {
	camposFormacion: CampoFormacionFromAPI[];
};

export default function CamposFormacionTable({
	camposFormacion,
}: CamposFormacionTableProps) {
	return (
		<section>
			<h1 className='text-2xl font-semibold'>Tabla</h1>
			<DataTable columns={columns} data={camposFormacion} />
		</section>
	);
}
