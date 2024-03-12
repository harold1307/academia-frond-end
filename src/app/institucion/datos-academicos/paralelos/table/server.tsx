import { APIserver } from "@/core/api-server";
import ParaleloTable, { DeleteParalelo, UpdateParalelo } from ".";
import type { ParaleloTableItem } from "./columns";

export default async function ParaleloTableServer() {
	const paralelos = await APIserver.paralelos.getMany();

	return (
		<>
			<ParaleloTable
				paralelos={paralelos.data.map(p => p satisfies ParaleloTableItem)}
			/>
			<UpdateParalelo paralelos={paralelos.data} />
			<DeleteParalelo paralelos={paralelos.data} />
		</>
	);
}
