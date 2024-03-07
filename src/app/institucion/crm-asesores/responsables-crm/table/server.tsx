import { APIserver } from "@/core/api-server";
import { formatFullName } from "@/utils";
import ResponsableCrmTable, { DeleteResponsableCrm } from ".";
import type { ResponsableCrmTableItem } from "./columns";

export default async function ResponsableCrmTableServer() {
	const responsablesCrm = await APIserver.responsablesCrm.getMany();

	return (
		<>
			<ResponsableCrmTable
				responsablesCrm={responsablesCrm.data.map(
					r =>
						({
							id: r.id,
							persona: formatFullName(
								r.administrativo.usuario.nombres,
								r.administrativo.usuario.primerApellido,
								r.administrativo.usuario.segundoApellido,
							),
							activo: r.estado,
							emailTelefono: {
								email: r.administrativo.usuario.email,
								telefono: r.administrativo.usuario.telefonoMovil,
							},
							identificacion: r.administrativo.usuario.cedula,
							administrativo: r.administrativo.estado,
						}) satisfies ResponsableCrmTableItem,
				)}
			/>
			<DeleteResponsableCrm responsablesCrm={responsablesCrm.data} />
		</>
	);
}
