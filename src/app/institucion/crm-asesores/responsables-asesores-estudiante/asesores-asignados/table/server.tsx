import { notFound } from "next/navigation";

import { APIserver } from "@/core/api-server";
import { formatFullName } from "@/utils";
import AsesorAsignadoTable, { DeleteAsesorAsignado } from ".";

export default async function AsesorAsignadoTableServer({
	responsableId,
}: {
	responsableId: string;
}) {
	const responsablesAsesorEstudiante =
		await APIserver.responsablesAsesoresEstudiante.getByIdWithAsesores(
			responsableId,
		);

	if (!responsablesAsesorEstudiante.data) return notFound();

	return (
		<>
			<AsesorAsignadoTable
				asesoresAsignados={responsablesAsesorEstudiante.data?.asesores.map(
					({ asesorEstudiante: a }) => ({
						id: a.id,
						persona: formatFullName(
							a.administrativo.usuario.nombres,
							a.administrativo.usuario.primerApellido,
							a.administrativo.usuario.segundoApellido,
						),
						emailTelefono: {
							email: a.administrativo.usuario.email,
							telefono: a.administrativo.usuario.telefonoMovil,
						},
						identificacion: a.administrativo.usuario.cedula,
						administrativo: a.administrativo.estado,
						bienestar: a.seguimientoBienestar,
						expediente: a.seguimientoExpediente,
						estudiantes: a.estudiantesCount,
					}),
				)}
			/>
			<DeleteAsesorAsignado
				asesoresAsignados={responsablesAsesorEstudiante?.data.asesores}
			/>
		</>
	);
}
