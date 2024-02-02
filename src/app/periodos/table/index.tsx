'use client'
import React from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useQuery } from "@tanstack/react-query";
import { PERIODOS_KEYS } from "../query_keys";
import { API } from "@/core/api-client";
import { MALLA_KEYS } from "@/app/malla/query-keys";
import { MUPeriodos } from "@/utils/mockupData";

export default function PeriodosLectivosTables() {
	/* const { isLoading, data } = useQuery({
		queryKey: MALLA_KEYS.lists(),
		queryFn: async () => {
			const data = await API.mallas.getMany();

			return data.data;
		},
	});

	const mallas = React.useMemo(() => {
		return data?.map(malla => {
			const obj = {
				credits: 0,
				totalHours: 0 + malla.horasPractica + malla.horasVinculacion,
				coursesHours: 0,
			};

			const asignaturas = malla.asignaturasEnMalla.filter(a => !a.esAnexo);
			const modulos = malla.asignaturasEnMalla.filter(a => a.esAnexo);

			asignaturas.forEach(a => {
				obj.credits += a.creditos;
				obj.totalHours +=
					a.horasAsistidasDocente +
					a.horasAutonomas +
					a.horasColaborativas +
					a.horasPracticas +
					a.horasSemanales;

				obj.coursesHours +=
					a.horasAsistidasDocente +
					a.horasAutonomas +
					a.horasColaborativas +
					a.horasPracticas +
					a.horasSemanales;
			});

			return {
				...malla,
				...obj,
				coursesCount: asignaturas.length,
				approved: {
					fechaAprobacion: new Date(malla.fechaAprobacion),
					fechaLimiteVigencia: new Date(malla.fechaLimiteVigencia),
				},
				isCurrent:
					new Date(malla.fechaLimiteVigencia).valueOf() > new Date().valueOf(),
				isUsed: false, // si hay alumnos dentro
				modulesCount: modulos.length,
				onlineCoursesCount: 0,
				studentsUsingCount: 0,
			} satisfies any;
		});
	}, [data]);

	if (isLoading) {
		return "Cargando tabla...";
	}

	if (isLoading && !mallas) {
		return "WTF";
	}

	if (!mallas) return "Ha ocurrido un error en el fetch"; */

	return (
		<section>
			<h1 className='text-2xl font-semibold'>Periodos lectivos</h1>
			<DataTable columns={columns} data={MUPeriodos} />
		</section>
	);
}
