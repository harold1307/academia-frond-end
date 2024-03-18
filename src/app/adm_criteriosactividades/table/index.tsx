"use client";

import { DataTable } from "@/app/_components/table";
import { columns, type CriterioActividadDocenciaTableItem } from "./columns";

export function CriterioActividadTable({
	criterioActividades,
}: {
	criterioActividades: CriterioActividadDocenciaTableItem[];
}) {
	return (
		<section>
			<DataTable<typeof columns, CriterioActividadDocenciaTableItem[]>
				columns={columns}
				data={criterioActividades}
				hideColumns={{
					id: false,
				}}
			/>
		</section>
	);
}
