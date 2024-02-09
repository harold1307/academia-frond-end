"use client";
import React from "react";
import { DataTable } from "./data-table";
import { WeekTableItem, weekColumns } from "./columns";

interface HorariosTable {
	data: any[];
}

export default function HorariosTable({ data }: HorariosTable) {
	const horarios = React.useMemo(() => {
		return data?.map(
			horariosTable =>
				({
					...horariosTable,
				}) satisfies WeekTableItem,
		);
	}, [data]);

	return (
		<section className=''>
			<DataTable columns={weekColumns} data={horarios} />
		</section>
	);
}
