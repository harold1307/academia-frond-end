import { notFound } from "next/navigation";

import { APIserver } from "@/core/api-server";
import SedeTable from ".";
import type { SedeTableItem } from "./columns";

export default async function SedeTableServer({
	mallaId,
}: {
	mallaId: string;
}) {
	const malla =
		await APIserver.mallas.getMallaWithLugaresEjecucionByMallaId(mallaId);

	if (!malla.data) return notFound();

	const parsed = malla.data.lugaresEjecucion.map(
		l =>
			({
				codigo: l.codigo || "",
				sede: l.institucion.nombre,
				inscritos: 0,
				egresados: 0,
				graduados: 0,
			}) satisfies SedeTableItem,
	);

	return <SedeTable lugaresEjecucion={parsed} />;
}
