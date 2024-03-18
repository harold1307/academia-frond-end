"use client";

import { DataTable } from "@/app/_components/table";
import {
	columns,
	type CriterioActividadPracticaPreProfesionalTableItem,
} from "./columns";

export function CriterioActividadPracticaPreProfesionalTable({
	criterioActividades,
}: {
	criterioActividades: CriterioActividadPracticaPreProfesionalTableItem[];
}) {
	return (
		<section>
			<DataTable<
				typeof columns,
				CriterioActividadPracticaPreProfesionalTableItem[]
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
