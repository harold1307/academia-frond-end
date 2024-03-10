import { notFound } from "next/navigation";

import { APIserver } from "@/core/api-server";
import CursoTable, { DeactivateCursoEscuela, DeleteCursoEscuela } from ".";
import type { CursoEscuelaTableItem } from "./columns";

export default async function CursoEscuelaTableServer() {
	const cursos = await APIserver.cursoEscuelas.getMany();

	if (!cursos.data) return notFound();

	return (
		<>
			<CursoTable
				data={cursos.data.map(
					c =>
						({
							...c,
							autoregistro: false,
							cursoCodigoSesion: {
								curso: c.nombre,
								codigo: c.codigo || "",
								sesion: c.tema,
							},
							inicioFinLimite: {
								inicio: c.fechaInicio,
								fin: c.fechaFin,
								limite: c.fechaLimiteRegistro,
							},
							profesoresAulasParaleloNivel: {
								profesores: [],
								aulas: [],
								paralelos: c.paraleloId,
								nivel: "",
							},
							cupo: c.cupos || 0,
							costo: false,
							diasVencimiento: c.diasLimitePago,
							especificaEdad: c.edadMaxima !== null,
							registrados: 0,
							retirados: 0,
							materias: 0,
							preRequisito: c.cumpleRequisitosMalla,
							legalizar: c.legalizarMatriculas,
							evaluacion: c.evaluaProfesor,
						}) satisfies CursoEscuelaTableItem,
				)}
			/>
			<DeactivateCursoEscuela cursos={cursos.data} />
			<DeleteCursoEscuela cursos={cursos.data} />
		</>
	);
}
