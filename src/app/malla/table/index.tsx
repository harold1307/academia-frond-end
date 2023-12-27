"use client";
import { useQuery } from "@tanstack/react-query";
import React from "react";

import { API } from "@/core/api-client";
import { MALLA_KEYS } from "../query-keys";
import { columns, type MallaCurricularTableItem } from "./columns";
import { DataTable } from "./data-table";

export default function MallaCurricularTable() {
	const { isLoading, data } = useQuery({
		queryKey: MALLA_KEYS.lists(),
		queryFn: async () => {
			const data = await API.mallas.getMany();

			return data.data;
		},
	});

	const mallas = React.useMemo(() => {
		return data?.map(
			malla =>
				({
					...malla,
					credits: 0,
					coursesCount: 0,
					totalHours: 0,
					coursesHours: 0,
					approved: {
						fechaAprobacion: new Date(malla.fechaAprobacion),
						fechaLimiteVigencia: new Date(malla.fechaLimiteVigencia),
					},
					isCurrent:
						new Date(malla.fechaLimiteVigencia).valueOf() >
						new Date().valueOf(),
					isUsed: true,
					modulesCount: 0,
					onlineCoursesCount: 0,
					studentsUsingCount: 0,
				}) satisfies MallaCurricularTableItem,
		);
	}, [data]);

	if (isLoading) {
		return "Cargando tabla...";
	}

	if (isLoading && !mallas) {
		return "WTF";
	}

	if (!mallas) return "Ha ocurrido un error en el fetch";

	return (
		<section>
			<h1 className='text-2xl font-semibold'>Tabla</h1>
			<DataTable columns={columns} data={mallas} />
		</section>
	);
}
