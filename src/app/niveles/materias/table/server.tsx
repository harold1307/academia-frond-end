import { APIserver } from "@/core/api-server";
import MateriasTable from ".";
import { notFound } from "next/navigation";
import { ApiError } from "next/dist/server/api-utils";
import { MateriasSchema, MateriasTableItem } from "./columns";

interface MockUpDataI {
    materias: MateriasSchema[];
}
const data: MockUpDataI = {
    materias: [
        {
            id: "1",
            asignatura: "test",
            planificacion: "",
            capacidad: 20,
            matriculados: 20,
            lms: 43,
            creditos: 56,
            horas: 34,
            horasSemanales: 70,
            aula: "",
            inicioFin: "01/01/2024 01/01/2025",
            profesores: "pablo",
        },
    ],
};

const dateFormat = (date: string) => {
    return new Date(date).toLocaleString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
export default async function MateriasTableServer() {

    //if (!nivel.data) return notFound();
    // console.log(tabledata)
    return <MateriasTable data={data.materias} />;
}
