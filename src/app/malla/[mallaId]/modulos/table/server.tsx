import { APIserver } from "@/core/api-server";
import MallaModulosTable from ".";
import type { ModuloTableItem } from "./columns";

export default async function MallaModulosTableServer({
	mallaId,
}: {
	mallaId: string;
}) {
	const modulos =
		await APIserver.mallasCurriculares.getMallaWithAsignaturasByMallaId(
			mallaId,
			{
				asignaturas_esAnexo: true,
			},
		);

	const tableItems = modulos.data.asignaturasEnMalla.map(
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
				requeridaEgreso: a.requeridaEgreso,
				validaCreditos: a.validaCredito,
				validaPromedio: a.validaPromedio,
			}) satisfies ModuloTableItem,
	);

	return (
		<>
			<MallaModulosTable modulos={tableItems} />
		</>
	);
}
