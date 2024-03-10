import { notFound } from "next/navigation";

import { APIserver } from "@/core/api-server";
import ProgramasEnCursoEscuelaTable, {
	DeactivateProgramaModal,
	UpdateProgramaModal,
} from ".";
import type { ProgramaEnCursoEscuelaTableItem } from "./columns";

interface ProgramasTableServerProps {
	cursoEscuelaId: string;
}
export default async function ProgramaEnCursoEscuelaTableServer({
	cursoEscuelaId,
}: ProgramasTableServerProps) {
	const cursoEscuela =
		await APIserver.cursoEscuelas.getByIdWithProgramas(cursoEscuelaId);

	if (!cursoEscuela.data) return notFound();

	const parsed = cursoEscuela.data.programas.map(
		p =>
			({
				id: p.id,
				programa: p.programa.nombre,
				modalidad: p.modalidad?.nombre ?? null,
				// malla: !!p.malla,
				registro: p.registroExterno,
				cursoEscuelaEstado: !!cursoEscuela.data?.estado,
				nivelDesde: p.nivelDesde,
				nivelHasta: p.nivelHasta,
			}) satisfies ProgramaEnCursoEscuelaTableItem,
	);

	return (
		<>
			<ProgramasEnCursoEscuelaTable data={parsed} />
			<UpdateProgramaModal
				programasEnCursoEscuela={cursoEscuela.data.programas}
			/>
			<DeactivateProgramaModal programas={parsed} />
		</>
	);
}
