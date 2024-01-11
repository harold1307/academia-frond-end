import { APIserver } from "@/core/api-server";
import CamposFormacionTable, {
	DeleteCampoFormacion,
	UpdateCampoFormacion,
} from ".";

export default async function CamposFormacionTableServer() {
	const campos = await APIserver.camposFormacion.getMany();

	return (
		<>
			<CamposFormacionTable camposFormacion={campos.data} />
			<UpdateCampoFormacion camposFormacion={campos.data} />
			<DeleteCampoFormacion camposFormacion={campos.data} />
		</>
	);
}
