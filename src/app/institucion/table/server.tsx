import { APIserver } from "@/core/api-server";
import SedeTable, { DeleteSedeModal, UpdateSedeTableModal } from ".";
import type { SedeTableItem } from "./columns";

export default async function SedeTableServer() {
	const sedes = await APIserver.sedes.getMany();

	return (
		<>
			<SedeTable sedes={sedes.data.map(c => c satisfies SedeTableItem)} />
			<UpdateSedeTableModal sedees={sedes.data} />
			<DeleteSedeModal sedees={sedes.data} />
		</>
	);
}
