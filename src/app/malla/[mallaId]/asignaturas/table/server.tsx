import { notFound } from "next/navigation";

import { APIserver } from "@/core/api-server";
import type { MallaCurricularWithAsignaturasFromAPI } from "@/core/api/malla-curricular";
import AsignaturaEnMallaTable from ".";
import { NIVELES_PREFIXES } from "@/utils/forms";

export default async function AsignaturaEnMallaTableServer({
	mallaId,
}: {
	mallaId: string;
}) {
	const malla = await APIserver.mallas.getMallaWithAsignaturasByMallaId(
		mallaId,
		{ asignaturas_esAnexo: false },
	);

	if (!malla.data) return notFound();

	// console.log(JSON.stringify(malla.data, null, 2));

	const totalNiveles = malla.data.niveles;

	const nivelesPrefixes = NIVELES_PREFIXES.slice(0, totalNiveles);

	const groupByEje = malla.data.asignaturasEnMalla.reduce(
		(acc, curr) => {
			if (!curr.ejeFormativo) return acc;

			const key = curr.ejeFormativo.nombre;
			const currentNivel = nivelesPrefixes.at(curr.nivel - 1);

			if (!currentNivel) return acc;

			const newAcc = {
				...acc,
			} as Record<
				string,
				Array<{
					nivel: (typeof nivelesPrefixes)[number];
					asignaturas: MallaCurricularWithAsignaturasFromAPI["asignaturasEnMalla"][number][];
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
				curr,
			);

			return newAcc;
		},
		{} as Record<
			string,
			Array<{
				nivel: (typeof nivelesPrefixes)[number];
				asignaturas: MallaCurricularWithAsignaturasFromAPI["asignaturasEnMalla"][number][];
			}>
		>,
	);

	// console.log(JSON.stringify({ groupByEje }), null, 2);

	const tableRows = Object.entries(groupByEje || {}).map(
		([eje, asignaturas], idx) => {
			const groupByNivel = asignaturas.reduce(
				(acc, curr) => {
					const key = curr.nivel;

					const newAcc = {
						...acc,
					} as Record<
						(typeof nivelesPrefixes)[number],
						Array<
							MallaCurricularWithAsignaturasFromAPI["asignaturasEnMalla"][number]
						>
					>;

					if (!newAcc[key]) {
						newAcc[key] = curr.asignaturas;
					}

					return newAcc;
				},
				{} as Record<
					(typeof nivelesPrefixes)[number],
					Array<
						MallaCurricularWithAsignaturasFromAPI["asignaturasEnMalla"][number]
					>
				>,
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
		},
	);

	return <AsignaturaEnMallaTable tableRows={tableRows} malla={malla.data} />;
}
