import { notFound } from "next/navigation";

import { APIserver } from "@/core/api-server";
import MateriasTable, { DeactivateMateriasModal, UpdateMateriaModal } from ".";

interface MateriasTableServerProps {
	varianteId: string;
}

export default async function MateriasTableServer({
	varianteId,
}: MateriasTableServerProps) {
	const varianteWithAsignaturas =
		await APIserver.variantesCurso.getByIdWithAsignaturas(varianteId);

	if (!varianteWithAsignaturas.data) return notFound();

	return (
		<>
			<MateriasTable
				tableData={varianteWithAsignaturas.data.asignaturas.map(a => ({
					asignaturaModelo: a.asignatura.nombre,
					asistenciaAprobar: a.asistenciaAprobar || 0, // implementar con modelo evaluativo
					creditos: a.creditos,
					id: a.id,
					horas:
						a.horasAsistidasDocente +
						a.horasAutonomas +
						a.horasColaborativas +
						a.horasPracticas,
					requeridaAprobar: a.requeridoAprobar,
					sumaHoras: a.sumaHoras,
					notaParaAprobar: a.notaMinima || 0, // implementar con modelo evaluativo
					calificar:
						!!a.modeloEvaluativoId ||
						(!a.modeloEvaluativoId &&
							(a.notaMaxima !== null || a.notaMinima !== null)),
					notaMaxima: a.notaMaxima || 0, // implementar con modelo evaluativo
					varianteEstado: varianteWithAsignaturas.data?.estado ?? false,
				}))}
			/>
			<UpdateMateriaModal materias={varianteWithAsignaturas.data.asignaturas} />
			<DeactivateMateriasModal
				materias={varianteWithAsignaturas.data.asignaturas}
			/>
		</>
	);
}
