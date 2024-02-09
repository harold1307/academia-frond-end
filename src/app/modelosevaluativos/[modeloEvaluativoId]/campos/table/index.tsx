"use client";
import React from "react";
import { DataTable } from "./data-table";
import {
	CamposModelosEvaluativosTableItem,
	camposModelosEvaluativosColumns,
} from "./columns";

interface CamposModelosEvaluativosTableProps {
	data: CamposModelosEvaluativosTableItem[];
}

export default function CamposModelosEvaluativosTable({
	data,
}: CamposModelosEvaluativosTableProps) {
	const camposModelosEvaluativos = React.useMemo(() => {
		return data?.map(
			campoModeloEvaluativo =>
				({
					...campoModeloEvaluativo,
				}) satisfies CamposModelosEvaluativosTableItem,
		);
	}, [data]);

	return (
		<section className=''>
			<DataTable
				columns={camposModelosEvaluativosColumns}
				data={camposModelosEvaluativos}
			/>
		</section>
	);
}
