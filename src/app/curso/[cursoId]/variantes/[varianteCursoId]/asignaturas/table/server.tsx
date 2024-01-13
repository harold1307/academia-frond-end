import { notFound } from "next/navigation";

import { APIserver } from "@/core/api-server";
import AsignaturaEnVarianteCursoTable from ".";
import type { AsignaturaEnVarianteCursoTableItem } from "./columns";

export default async function AsignaturaEnVarianteCursoTableServer({
	varianteCursoId,
}: {
	varianteCursoId: string;
}) {
	const variante =
		await APIserver.variantesCurso.getByIdWithAsignaturas(varianteCursoId);

	if (!variante.data) return notFound();

	const tableItems = variante.data.asignaturasEnVarianteCurso.map(
		a =>
			({
				id: a.id,
				nombre: "??????",
				horas:
					a.horasAsistidasDocente +
					a.horasAutonomas +
					a.horasColaborativas +
					a.horasPracticas,
				creditos: a.creditos,
				asistencia: a.asistenciaAprobar,
				califica: false, // se implementa con modelo evaluativo
				notaMaxima: 0, // se implementa con modelo evaluativo
				notaAprobar: 0, // se implementa con modelo evaluativo
				requerida: a.requeridoAprobar,
				sumaHoras: a.sumaHoras,
			}) satisfies AsignaturaEnVarianteCursoTableItem,
	);

	return <AsignaturaEnVarianteCursoTable tableItems={tableItems} />;
}
