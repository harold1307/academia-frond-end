import { APIserver } from "@/core/api-server";
import SesionTable, { DeleteSesion, UpdateSesion } from ".";
import type { SesionTableItem } from "./columns";

export default async function SesionTableServer() {
	const sesiones = await APIserver.sesiones.getMany();

	return (
		<>
			<SesionTable
				sesiones={sesiones.data.map(s => {
					const activeTurnos = s.turnos.filter(t => t.estado);
					const sortedComienzaTurnoDates = activeTurnos
						.map(t => new Date(t.comienza))
						.sort((a, b) => a.valueOf() - b.valueOf());

					const sortedTerminaTurnoDates = activeTurnos
						.map(t => new Date(t.termina))
						.sort((a, b) => b.valueOf() - a.valueOf());

					return {
						...s,
						activo: s.estado,
						comienza: sortedComienzaTurnoDates[0],
						termina: sortedTerminaTurnoDates[0],
						turnosActivos: activeTurnos.length,
						sede: s.sede.nombre,
					} satisfies SesionTableItem;
				})}
			/>
			<UpdateSesion sesiones={sesiones.data} />
			<DeleteSesion sesiones={sesiones.data} />
		</>
	);
}
