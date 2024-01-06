import { APIserver } from "@/core/api-server";
import CamposFormacionTable from ".";

export default async function CamposFormacionTableServer() {
	const campos = await APIserver.camposFormacion.getMany();

	return <CamposFormacionTable camposFormacion={campos.data} />;
}
