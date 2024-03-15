import { APIserver } from "@/core/api-server";
import { DeleteGrupo, GrupoTable, UpdateGrupo } from ".";

export async function GrupoTableServer() {
	const grupos = await APIserver.grupos.getMany();

	return (
		<>
			<GrupoTable grupos={grupos.data} />
			<UpdateGrupo grupos={grupos.data} />
			<DeleteGrupo grupos={grupos.data} />
		</>
	);
}
