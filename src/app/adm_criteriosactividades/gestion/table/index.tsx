"use client";

import { DataTable } from "@/app/_components/table";
import { columns, type CriterioActividadGestionTableItem } from "./columns";

export function CriterioActividadGestionTable({
	criterioActividades,
}: {
	criterioActividades: CriterioActividadGestionTableItem[];
}) {
	return (
		<section>
			<DataTable<typeof columns, CriterioActividadGestionTableItem[]>
				columns={columns}
				data={criterioActividades}
				hideColumns={{
					id: false,
				}}
			/>
		</section>
	);
}
