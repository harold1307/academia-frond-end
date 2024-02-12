import type { TurnoFromAPI } from "@/core/api/turnos";
import TurnoTable, { DeleteTurno, UpdateTurno } from ".";
import type { TurnoTableItem } from "./columns";

export default async function TurnoTableServer({
	turnos,
}: {
	turnos: Omit<TurnoFromAPI, "sesion">[];
}) {
	return (
		<>
			<TurnoTable
				turnos={turnos.map(t => {
					return {
						...t,
						activo: t.estado,
						comienza: new Date(t.comienza),
						termina: new Date(t.termina),
					} satisfies TurnoTableItem;
				})}
			/>
			<UpdateTurno turnos={turnos} />
			<DeleteTurno turnos={turnos} />
		</>
	);
}
