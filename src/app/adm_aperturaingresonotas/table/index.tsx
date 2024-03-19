"use client";

import { DataTable } from "@/app/_components/table";
import { columns, type AperturaIngresoNotasTableItem } from "./columns";

export function AperturaIngresoNotaTable({
	aperturaIngresoNotas,
}: {
	aperturaIngresoNotas: AperturaIngresoNotasTableItem[];
}) {
	return (
		<section>
			<DataTable<typeof columns, AperturaIngresoNotasTableItem[]>
				columns={columns}
				data={aperturaIngresoNotas}
				hideColumns={{
					id: false,
				}}
			/>
		</section>
	);
}
