"use client";
import React from "react";
import { DataTable } from "./data-table";
import { type TalentoHumanoTableItem, TalentoHumanoColumns } from "./columns";

interface TalentoHumanoTable {
	data: any[];
}

export default function TalentoHumanoTable({ data }: TalentoHumanoTable) {
	const talentoHumano = React.useMemo(() => {
		return data?.map(
			TalentoHumanoTable =>
				({
					...TalentoHumanoTable,
				}) satisfies TalentoHumanoTableItem,
		);
	}, [data]);

	return (
		<section className=''>
			<DataTable columns={TalentoHumanoColumns} data={talentoHumano} />
		</section>
	);
}
