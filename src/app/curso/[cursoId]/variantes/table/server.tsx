import { notFound } from "next/navigation";
import { APIserver } from "@/core/api-server";
import VarianteTable from ".";
interface VariantesTableServerProps {
    cursoId:string
}
export default async function VariantesTableServer({ cursoId }:VariantesTableServerProps) {
	const cursoWithVariantes = await APIserver.cursos.getCursoWithVariantesByCursoId(cursoId)

	if (!cursoWithVariantes.data) return notFound();

	return <VarianteTable data={cursoWithVariantes.data} />;
}
