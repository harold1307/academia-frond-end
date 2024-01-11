import { APIserver } from "@/core/api-server";
import EjesFormativosTable, { DeleteEjeFormativo, UpdateEjeFormativo } from ".";

export default async function EjesFormativosTableServer() {
	const ejes = await APIserver.ejesFormativos.getMany();

	return (
		<>
			<EjesFormativosTable ejesFormativos={ejes.data} />
			<UpdateEjeFormativo ejesFormativos={ejes.data} />
			<DeleteEjeFormativo ejesFormativos={ejes.data} />
		</>
	);
}
