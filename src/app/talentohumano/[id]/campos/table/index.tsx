"use client";
import React from "react";
import { DataTable } from "./data-table";
import {
	type CamposModelosDeContratosTableItem,
	camposModelosDeContratosColumns,
} from "./columns";

interface CamposModelosDeContratosTableProps {
	data: CamposModelosDeContratosTableItem[];
}

export default function CamposModelosDeContratosTable({
	data,
}: CamposModelosDeContratosTableProps) {
	const camposModelosDeContratos = React.useMemo(() => {
		return data?.map(
			campoModelosDeContratos =>
				({
					...campoModelosDeContratos,
				}) satisfies CamposModelosDeContratosTableItem,
		);
	}, [data]);

	return (
		<section className=''>
			<DataTable
				columns={camposModelosDeContratosColumns}
				data={camposModelosDeContratos}
			/>
		</section>
	);
}
