"use client";
import { useQuery } from "@tanstack/react-query";
import React from "react";

import { ASIGNATURA_EN_MALLA_KEYS } from "../query-keys";
import { DataTable } from "./data-table";
import { columns, type AsignaturaEnMallaTableItem, helper } from "./columns";
import { API } from "@/core/api-client";
import { IDK } from "@/app/malla/add-malla";

export default function AsignaturaEnMallaTable({
	mallaId,
}: {
	mallaId: string;
}) {
	const [cols, setCols] = React.useState(columns);
	const { isLoading, data } = useQuery({
		queryKey: ASIGNATURA_EN_MALLA_KEYS.list(JSON.stringify({ mallaId })),
		queryFn: async () => {
			const data = await API.mallas.getMallaWithAsignaturasByMallaId(mallaId);

			return data.data;
		},
	});

	const mallas = React.useMemo(() => {
		if (!data) return;

		const totalNiveles = data?.niveles;

		const nivelesPrefixes = IDK.slice(0, totalNiveles);

		setCols([
			...columns,
			...nivelesPrefixes.map(prefix => ({
				accessorKey: prefix + " NIVEL",
				id: prefix + " NIVEL",
				header: prefix + " NIVEL",
			})),
		]);

		const groupByEje = data?.asignaturasEnMalla.reduce(
			(acc, curr) => {
				const key = curr.ejeFormativo;
				const currentNivel = nivelesPrefixes.at(curr.nivel - 1);

				if (!currentNivel) return acc;

				const newAcc = {
					...acc,
				} as Record<
					string,
					Array<{
						nivel: (typeof nivelesPrefixes)[number];
						asignaturas: string[];
					}>
				>;

				if (!newAcc[key as keyof object]) {
					newAcc[key as keyof object] = [
						{
							nivel: currentNivel,
							asignaturas: [],
						},
					];
				}

				const existsNivel = newAcc[key as keyof object]?.find(
					c => c.nivel === currentNivel,
				);

				if (!existsNivel) {
					newAcc[key as keyof object]?.push({
						nivel: currentNivel,
						asignaturas: [],
					});
				}

				const securedInsideArrIdx = newAcc[key as keyof object]!.findIndex(
					o => o.nivel === currentNivel,
				)!;

				newAcc[key as keyof object]!.at(securedInsideArrIdx)!.asignaturas.push(
					curr.asignatura.nombre,
				);

				return newAcc;
			},
			{} as Record<
				string,
				Array<{
					nivel: (typeof nivelesPrefixes)[number];
					asignaturas: string[];
				}>
			>,
		);

		console.log({ groupByEje });

		return Object.entries(groupByEje || {}).map(([eje, asignaturas], idx) => {
			const groupByNivel = asignaturas.reduce(
				(acc, curr) => {
					const key = curr.nivel;

					const newAcc = {
						...acc,
					} as Record<(typeof nivelesPrefixes)[number], Array<string>>;

					if (!newAcc[key]) {
						newAcc[key] = curr.asignaturas;
					}

					return newAcc;
				},
				{} as Record<(typeof nivelesPrefixes)[number], Array<string>>,
			);

			const res = {
				id: idx,
				ejeFormativo: eje,
			};

			Object.entries(groupByNivel).forEach(([nivel, asignaturas]) => {
				// @ts-expect-error idk
				res[(nivel + " NIVEL") as keyof object] = asignaturas;
			});

			return res;
		});
	}, [data]);

	console.log(mallas);

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
			<DataTable columns={cols as any} data={mallas} />
		</section>
	);
}
