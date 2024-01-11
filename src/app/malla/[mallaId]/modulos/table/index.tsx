"use client";
import { type ModuloTableItem, columns } from "./columns";
import { DataTable } from "./data-table";

type MallaModulosTableProps = {
	modulos: ModuloTableItem[];
};

export default function MallaModulosTable({ modulos }: MallaModulosTableProps) {
	return (
		<section>
			<h1 className='text-2xl font-semibold'>Tabla</h1>
			<DataTable columns={columns} data={modulos} />
		</section>
	);
}
