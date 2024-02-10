import { notFound } from "next/navigation";

import { APIserver } from "@/core/api-server";
import type { AsignaturaEnNivelMallaFromAPI } from "@/core/api/asignaturas-niveles-malla";
import AsignaturaEnMallaTable from ".";

export default async function AsignaturaEnMallaTableServer({
	mallaId,
}: {
	mallaId: string;
}) {
	const malla =
		await APIserver.mallasCurriculares.getMallaWithAsignaturasByMallaId(
			mallaId,
			{ asignaturas_esAnexo: false },
		);

	if (!malla.data) return notFound();

	const ejes: { id: string; nombre: string }[] = [];

	const nivelesEnMalla = malla.data.niveles;

	malla.data.niveles.forEach(nivel => {
		nivel.asignaturas.forEach(asignatura => {
			if (ejes.some(e => e.id === asignatura.ejeFormativoId)) return;

			ejes.push({
				id: asignatura.ejeFormativoId,
				nombre: asignatura.ejeFormativo.nombre,
			});
		});
	});

	ejes.sort((a, b) => a.nombre.localeCompare(b.nombre));

	const columns: {
		[x: "id" | "ejeFormativo" | string]:
			| (AsignaturaEnNivelMallaFromAPI & { nivel: number })[]
			| string;
	}[] = ejes.map(eje => {
		const niveles = nivelesEnMalla
			.sort((a, b) => a.nivel - b.nivel)
			.reduce(
				(prev, curr) => {
					const newPrev = prev;

					let nivel = newPrev[curr.id as keyof object];

					if (!nivel) {
						nivel = [];
						newPrev[curr.id as keyof object] = nivel;
					}

					curr.asignaturas.forEach(a => {
						if (a.ejeFormativoId === eje.id) {
							nivel?.push({ ...a, nivel: curr.nivel });
						}
					});

					return newPrev;
				},
				{} as Record<
					string,
					(AsignaturaEnNivelMallaFromAPI & { nivel: number })[]
				>,
			);

		return {
			id: eje.id,
			ejeFormativo: eje.nombre,
			...niveles,
		};
	});

	return (
		<AsignaturaEnMallaTable tableRows={columns as any} malla={malla.data} />
	);
}
