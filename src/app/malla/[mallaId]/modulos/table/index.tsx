"use client";
import { columns, type ModuloTableItem } from "./columns";
import { DataTable } from "./data-table";

type MallaModulosTableProps = {
	modulos: ModuloTableItem[];
};

export const mallaModulosParams = {
	delete: "eliminarModulo",
} as const;

export default function MallaModulosTable({ modulos }: MallaModulosTableProps) {
	return (
		<section>
			<DataTable columns={columns} data={modulos} />
		</section>
	);
}
