"use client";
import React from "react";

import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/app/_components/ui/card";
import type {
	AsignaturaEnNivelMallaFromAPI,
	MallaCurricularFromAPI,
} from "@/core/api/mallas-curriculares";
import { NIVELES_PREFIXES } from "@/utils/forms";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default function AsignaturaEnMallaTable({
	tableRows,
	malla,
}: {
	tableRows: {
		[x: "id" | "ejeFormativo" | string]:
			| AsignaturaEnNivelMallaFromAPI[]
			| string;
	};
	malla: MallaCurricularFromAPI;
}) {
	const [cols, setCols] = React.useState(columns);

	React.useEffect(() => {
		// const totalNiveles = malla.niveles;

		// const nivelesPrefixes = NIVELES_PREFIXES.slice(0, totalNiveles.length);

		setCols([
			...columns,
			...malla.niveles.map(nivel => ({
				accessorKey: nivel.id,
				header: NIVELES_PREFIXES[nivel.nivel - 1] + " NIVEL",
				id: nivel.id,

				// @ts-expect-error not well typed because dynamic columns
				cell: ({ getValue }) =>
					(
						getValue() as MallaCurricularFromAPI["niveles"][number]
					).asignaturas.map(a => (
						<AsignaturaEnMalla asignaturaEnMalla={a} key={a.id} />
					)),
			})),
			// ...nivelesPrefixes.map(prefix => ({
			// 	accessorKey: prefix + " NIVEL",
			// 	id: prefix + " NIVEL",
			// 	header: prefix + " NIVEL",
			// 	// @ts-expect-error not well typed because dynamic columns
			// 	cell: ({ getValue }) =>
			// 		(getValue() as MallaCurricularFromAPI["niveles"]).map(a => (
			// 			<AsignaturaEnMalla asignaturaEnMalla={a.asignaturas} key={a.id} />
			// 		)),
			// })),
			{
				accessorKey: "total",
				id: "total",
				header: "TOTAL",
			},
		]);
	}, [malla]);

	return (
		<section>
			<h1 className='text-2xl font-semibold'>Tabla</h1>
			<DataTable columns={cols as any} data={tableRows as any} />
		</section>
	);
}

type AsignaturaEnMallaProps = {
	asignaturaEnMalla: MallaCurricularFromAPI["niveles"][number]["asignaturas"][number];
};

function AsignaturaEnMalla({ asignaturaEnMalla }: AsignaturaEnMallaProps) {
	const {
		identificacion,
		asignatura,
		horasAsistidasDocente,
		horasAutonomas,
		horasColaborativas,
		horasPracticas,
		maximaCantidadHorasSemanalas,
		creditos,
	} = asignaturaEnMalla;

	const horasTotales =
		horasAsistidasDocente +
		horasAutonomas +
		horasColaborativas +
		horasPracticas;

	return (
		<Card className='w-fit'>
			<CardHeader className='p-4'>
				<CardTitle className='text-sm'>
					{identificacion + " - " + asignatura.nombre}
				</CardTitle>
				<CardDescription>
					Hrs: {horasTotales} Cred: {creditos} H.Sem:{" "}
					{maximaCantidadHorasSemanalas}
				</CardDescription>
			</CardHeader>
		</Card>
	);
}
