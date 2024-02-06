import { notFound } from "next/navigation";

import { APIserver } from "@/core/api-server";
import MallaModulosTable from ".";
import type { ModuloTableItem } from "./columns";

export default async function MallaModulosTableServer({
	mallaId,
}: {
	mallaId: string;
}) {
	const malla = await APIserver.mallasCurriculares.getById(mallaId);

	if (!malla.data) return notFound();

	const tableItems = malla.data.modulos.map(
		a =>
			({
				id: a.id,
				nombre: a.asignatura.nombre,
				horasAsistidas: a.horasAsistidasDocente,
				horasAutonomas: a.horasAutonomas,
				horasColaborativas: a.horasColaborativas,
				horasPracticas: a.horasPracticas,
				costo: a.costoEnMatricula,
				creditos: a.creditos,
				horas:
					a.horasAsistidasDocente +
					a.horasAutonomas +
					a.horasColaborativas +
					a.horasPracticas,
				matriculacion: a.permiteMatriculacion,
				requeridaEgreso: a.requeridaParaGraduar,
				validaCreditos: a.validaParaCredito,
				validaPromedio: a.validaParaPromedio,
			}) satisfies ModuloTableItem,
	);

	return (
		<>
			<MallaModulosTable modulos={tableItems} />
		</>
	);
}
