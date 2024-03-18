"use client";

import { DataTable } from "@/app/_components/table";
import {
	columns,
	type CriterioActividadPracticaComunitariaTableItem,
} from "./columns";

export function CriterioActividadPracticaComunitariaTable({
	criterioActividades,
}: {
	criterioActividades: CriterioActividadPracticaComunitariaTableItem[];
}) {
	return (
		<section>
			<DataTable<
				typeof columns,
				CriterioActividadPracticaComunitariaTableItem[]
			>
				columns={columns}
				data={criterioActividades}
				hideColumns={{
					id: false,
				}}
			/>
		</section>
	);
}
