"use client";

import { columns, type CriterioActividadDocenteTableItem } from "./columns";
import { DataTable } from "./data-table";

export function CriterioActividadDocenteTable({
	criterioActividades,
}: {
	criterioActividades: CriterioActividadDocenteTableItem[];
}) {
	return (
		<section>
			<DataTable
				columns={columns}
				data={criterioActividades}
				hideColumns={{
					id: false,
				}}
			/>
		</section>
	);
}
