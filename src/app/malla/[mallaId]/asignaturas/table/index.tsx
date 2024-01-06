"use client";
import React from "react";

import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/app/_components/ui/card";
import type { MallaCurricularWithAsignaturasFromAPI } from "@/core/api/malla-curricular";
import { NIVELES_PREFIXES } from "@/utils/forms";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default function AsignaturaEnMallaTable({
	tableRows,
	malla,
}: {
	tableRows: any;
	malla: MallaCurricularWithAsignaturasFromAPI;
}) {
	const [cols, setCols] = React.useState(columns);

	React.useEffect(() => {
		const totalNiveles = malla.niveles;

		const nivelesPrefixes = NIVELES_PREFIXES.slice(0, totalNiveles);

		setCols([
			...columns,
			...nivelesPrefixes.map(prefix => ({
				accessorKey: prefix + " NIVEL",
				id: prefix + " NIVEL",
				header: prefix + " NIVEL",
				// @ts-expect-error not well typed because dynamic columns
				cell: ({ getValue }) =>
					(
						getValue() as MallaCurricularWithAsignaturasFromAPI["asignaturasEnMalla"]
					).map(a => <AsignaturaEnMalla asignaturaEnMalla={a} key={a.id} />),
			})),
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
			<DataTable columns={cols as any} data={tableRows} />
		</section>
	);
}

type AsignaturaEnMallaProps = {
	asignaturaEnMalla: MallaCurricularWithAsignaturasFromAPI["asignaturasEnMalla"][number];
};

function AsignaturaEnMalla({ asignaturaEnMalla }: AsignaturaEnMallaProps) {
	const {
		identificacion,
		asignatura,
		horasAsistidasDocente,
		horasAutonomas,
		horasColaborativas,
		horasPracticas,
		horasSemanales,
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
					Hrs: {horasTotales} Cred: {creditos} H.Sem: {horasSemanales}
				</CardDescription>
			</CardHeader>
		</Card>
	);
}
