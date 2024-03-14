import { notFound } from "next/navigation";

import { APIserver } from "@/core/api-server";
import ProgramasEnVarianteTable, {
	DeactivateProgramaModal,
	UpdateProgramaModal,
} from ".";
import type { ProgramaEnVarianteTableItem } from "./columns";

interface ProgramasTableServerProps {
	varianteId: string;
}
export default async function ProgramasTableServer({
	varianteId,
}: ProgramasTableServerProps) {
	const variante =
		await APIserver.variantesCurso.getByIdWithProgramas(varianteId);

	if (!variante.data) return notFound();

	const parsed = variante.data.programas.map(
		p =>
			({
				id: p.id,
				programa: p.programa.nombre,
				modalidad: p.modalidad?.nombre ?? null,
				malla: !!p.malla,
				registro: p.registroExterno,
				varianteEstado: !!variante.data?.estado,
			}) satisfies ProgramaEnVarianteTableItem,
	);

	return (
		<>
			<ProgramasEnVarianteTable data={parsed} />
			<UpdateProgramaModal programasEnVariante={variante.data.programas} />
			<DeactivateProgramaModal programas={parsed} />
		</>
	);
}
