import { APIserver } from "@/core/api-server";
import { formatFullName } from "@/utils";
import ResponsableAsesorEstudianteTable, {
	DeleteResponsableAsesorEstudiante,
} from ".";

export default async function ResponsableAsesorEstudianteTableServer() {
	const responsablesAsesorEstudiante =
		await APIserver.responsablesAsesoresEstudiante.getMany();

	return (
		<>
			<ResponsableAsesorEstudianteTable
				responsablesAsesorEstudiante={responsablesAsesorEstudiante.data.map(
					a => ({
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
						asesores: a.asesoresCount,
					}),
				)}
			/>
			<DeleteResponsableAsesorEstudiante
				responsablesAsesorEstudiante={responsablesAsesorEstudiante.data}
			/>
		</>
	);
}
