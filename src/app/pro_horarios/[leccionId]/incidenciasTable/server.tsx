import { notFound } from "next/navigation";
import { APIserver } from "@/core/api-server";
import CursoTable from ".";
import { Incidencias } from "./columns";

const incidencias:Incidencias[] = [
    {
        id: '1',
        descripcion: 'Desc Inc 1',
        tipo: 'Tipo1'
    }
]

export default async function IncidenciaTableServer() {


	return <CursoTable data={incidencias} />;
}
