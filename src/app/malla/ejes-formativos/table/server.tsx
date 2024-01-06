import { APIserver } from "@/core/api-server";
import EjesFormativosTable from ".";

export default async function EjesFormativosTableServer() {
	const ejes = await APIserver.ejesFormativos.getMany();

	return <EjesFormativosTable ejesFormativos={ejes.data} />;
}
