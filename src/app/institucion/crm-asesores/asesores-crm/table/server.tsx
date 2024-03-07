import { APIserver } from "@/core/api-server";
import { formatFullName } from "@/utils";
import AsesorCrmTable, { DeleteAsesorCrm, UpdateAsesorCrm } from ".";

export default async function AsesorCrmTableServer() {
	const asesoresCrm = await APIserver.asesoresCrm.getMany();

	return (
		<>
			<AsesorCrmTable
				asesoresCrm={asesoresCrm.data.map(a => ({
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
					centrosInformacion: a.centrosInformacion.map(
						c => c.centroInformacion.nombre,
					),
					interesados: 0,
					inscritos: 0,
				}))}
			/>
			<UpdateAsesorCrm asesoresCrm={asesoresCrm.data} />
			<DeleteAsesorCrm asesoresCrm={asesoresCrm.data} />
		</>
	);
}
