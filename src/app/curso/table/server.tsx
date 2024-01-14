import { notFound } from "next/navigation";
import { APIserver } from "@/core/api-server";
import CursoTable from ".";

export default async function CursoTableServer() {
	const cursos = await APIserver.cursos.getMany()

	if (!cursos.data) return notFound();

	return <CursoTable data={cursos.data} />;
}
