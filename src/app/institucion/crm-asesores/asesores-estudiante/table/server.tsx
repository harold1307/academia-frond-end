import { APIserver } from "@/core/api-server";
import { formatFullName } from "@/utils";
import AsesorEstudianteTable, { UpdateAsesorEstudiante } from ".";

export default async function AsesorEstudianteTableServer() {
	const asesoresEstudiante = await APIserver.asesoresEstudiante.getMany();

	return (
		<>
			<AsesorEstudianteTable
				asesoresEstudiante={asesoresEstudiante.data.map(a => ({
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
					activo: a.estado,
					bienestar: a.seguimientoBienestar,
					expediente: a.seguimientoExpediente,
					estudiantes: a.estudiantesCount,
				}))}
			/>
			<UpdateAsesorEstudiante asesoresEstudiante={asesoresEstudiante.data} />
		</>
	);
}
