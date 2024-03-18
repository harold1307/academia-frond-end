"use client";

import { DataTable } from "@/app/_components/table";
import {
	columns,
	type CriterioActividadInvesticacionTableItem,
} from "./columns";

export function CriterioActividadInvestigacionTable({
	criterioActividades,
}: {
	criterioActividades: CriterioActividadInvesticacionTableItem[];
}) {
	return (
		<section>
			<DataTable<typeof columns, CriterioActividadInvesticacionTableItem[]>
				columns={columns}
				data={criterioActividades}
				hideColumns={{
					id: false,
				}}
			/>
		</section>
	);
}
