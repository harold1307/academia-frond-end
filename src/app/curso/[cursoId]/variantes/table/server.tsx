import { APIserver } from "@/core/api-server";
import VarianteCursoTable from ".";
import type { VarianteCursoTableItem } from "./columns";

type VarianteCursoTableServerProps = {
	cursoId: string;
};

export default async function VarianteCursoTableServer({
	cursoId,
}: VarianteCursoTableServerProps) {
	const curso = await APIserver.cursos.getCursoWithVariantesByCursoId(cursoId);

	const variantes = curso.data.variantes.map(
		v =>
			({
				id: v.id,
				nombre: v.nombre,
				codigo: v.codigoBase,
				aprobada: v.fechaAprobacion,
				materiasCount: 0,
				cursosCount: 0,
				registroExterno: v.registroExterno,
				registroInterno: v.registroInterno,
				registroOtraSede: v.registroDesdeOtraSede,
				costoPorMateria: v.costoPorMateria,
				verificaSesion: v.verificarSesion,
				rangoEdad: v.verificarEdad,
				edadMinima: v.edadMinima,
				edadMaxima: v.edadMaxima,
				requisitosMalla: v.cumpleRequisitosMalla,
				pasarRecord: v.pasarRecord,
				cursoPrevio: v.aprobarCursoPrevio,
				nivelMinimo: false,
				enUso: false,
				activa: v.estado,
			}) satisfies VarianteCursoTableItem,
	);

	return <VarianteCursoTable data={variantes} />;
}
