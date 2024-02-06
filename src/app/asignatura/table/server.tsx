import { APIserver } from "@/core/api-server";
import AsignaturaTable from ".";

export default async function AsignaturaTableServer() {
	const asignaturas = await APIserver.asignaturas.getMany();

	return <AsignaturaTable asignaturas={asignaturas.data} />;
}
