import { APIserver } from "@/core/api-server";
import CoordinacionTable, { DeleteCoordinacion, UpdateCoordinacion } from ".";
import type { CoordinacionTableItem } from "./columns";

export default async function CoordinacionTableServer() {
	const coordinaciones = await APIserver.coordinaciones.getMany();
	const sedes = await APIserver.sedes.getMany();

	return (
		<>
			<CoordinacionTable
				coordinaciones={coordinaciones.data.map(
					c =>
						({
							...c,
							programas: c.programas.map(p => ({
								id: p.id,
								programa: p.nombre,
								inscritos: 0,
								egresados: 0,
								graduados: 0,
								retirados: 0,
							})),
							profesores: 0,
						}) satisfies CoordinacionTableItem,
				)}
			/>
			<UpdateCoordinacion
				coordinaciones={coordinaciones.data}
				sedes={sedes.data}
			/>
			<DeleteCoordinacion coordinaciones={coordinaciones.data} />
		</>
	);
}
