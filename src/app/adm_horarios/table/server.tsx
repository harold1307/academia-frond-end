import { notFound } from "next/navigation";
import { APIserver } from "@/core/api-server";
import CursoTable from ".";
import ProgramasTable from ".";
import HorariosAdminTable from ".";
import { type HorariosAdminSchema } from "./columns";

export default async function HorariosAdminTableServer() {
	//Fetch programas
	// const materiasNivel = await APIserver.nivelesAcademicos.getMany()
	// if (!programas.data) return notFound();
	// return <HorariosAdminTable data={materiasNivel.data} />;
}
