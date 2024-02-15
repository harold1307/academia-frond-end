import { APIserver } from "@/core/api-server";
import UbicacionTable, { DeleteUbicacion, UpdateUbicacion } from ".";
import type { UbicacionTableItem } from "./columns";

export default async function UbicacionTableServer({
	sedeId,
}: {
	sedeId?: string;
}) {
	const ubicaciones = await APIserver.ubicaciones.getMany({
		sedeId,
	});

	return (
		<>
			<UbicacionTable
				ubicaciones={
					sedeId
						? ubicaciones.data.map(
								u =>
									({
										...u,
										activo: u.estado,
										virtual: u.entornoVirtual,
									}) satisfies UbicacionTableItem,
							)
						: []
				}
			/>
			<UpdateUbicacion ubicaciones={ubicaciones.data} />
			<DeleteUbicacion ubicaciones={ubicaciones.data} />
		</>
	);
}
