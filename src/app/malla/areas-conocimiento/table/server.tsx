import { APIserver } from "@/core/api-server";
import AreasConocimientoTable from ".";

export default async function AreasConocimientoTableServer() {
	const areas = await APIserver.areasConocimiento.getMany();

	return <AreasConocimientoTable areasConocimiento={areas.data} />;
}
