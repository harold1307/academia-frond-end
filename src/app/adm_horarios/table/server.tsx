import { notFound } from "next/navigation";
import { APIserver } from "@/core/api-server";
import CursoTable from ".";
import ProgramasTable from ".";
import HorariosAdminTable from ".";
import { HorariosAdminSchema } from "./columns";

interface MockUpDataI {
	horarios: HorariosAdminSchema[];
}
const data: MockUpDataI = {
	horarios: [
		{
			id: "1",
			horarios: true,
			profesores: true,
			cupos: true,
			planificacion: true,
			paralelo: "paralelo1",
			cupo: 30,
			matriculados: 23,
			retirados: 0,
			disponibles: 30,
			nivelMalla: "2do nivel",
			sesionModalidad: "presencial",
			malla: 2023,
			inicioFin: "10-10-2023/01-01-2024",
			agregaciones: "10-12-2023/02-01-2024",
			matReg: "02-01-2024",
			matExt: "01-02-2024",
			matEsp: "01-01-2024",
			matriculacion: true,
		},
	],
};

export default async function HorariosAdminTableServer() {
	//Fetch programas

	// if (!programas.data) return notFound();

	return <HorariosAdminTable data={data.horarios} />;
}
