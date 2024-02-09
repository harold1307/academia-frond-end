import { notFound } from "next/navigation";
import { APIserver } from "@/core/api-server";
import CursoTable from ".";
import { ProgramaSchema } from "../add-programa";
import ProgramasTable from ".";

interface MockUpDataI {
	programas: ProgramaSchema[];
}
const data: MockUpDataI = {
	programas: [
		{
			id: "1",
			todosLosProgramas: false,
			programa: "programaA",
			modalidad: "PRESENCIAL",
			malla: "MallaB",
			registroExterno: true,
		},
	],
};

interface ProgramasTableServerProps {
	varianteId: string;
}
export default async function ProgramasTableServer({
	varianteId,
}: ProgramasTableServerProps) {
	//Fetch programas

	// if (!programas.data) return notFound();

	return <ProgramasTable data={data.programas} />;
}
