import { notFound } from "next/navigation";
import { APIserver } from "@/core/api-server";
import { MateriaSchema } from "../add-materia";
import MateriasTable from ".";

interface MockUpDataI {
	programas:MateriaSchema[]
}
const data:MockUpDataI = {
	programas: [ 
        {
            id: '1',
            asginatura: 'asignatura1',
            lms: 'Lms1',
            plantillaLms: 'PlantillaLms1',
            validaParaCreditos: true,
            validaParaPromedios: true,
            horas: 2,
            horasDocencia: 3,
            horasColaborativas: 8,
            horasAsistidasPorDocente: 1,
            horasOrganizacionAprendizaje: 1,
            horasAutonomas:6,
            horasPracticas:7,
            creditos:9,
            requeridaAprobar: true,
            sumaHoras: true,
            calificar: false,
            modeloEvaluativo: 'modelo3',
            notaMaxima: 10,
            notaParaAprobar: 7,
            cantidadDecimales: 1,
            asistenciaAprobar: 75,
        }
	]
}

interface MateriasTableServerProps {
    varianteId:string
}
export default async function MateriasTableServer({ varianteId }:MateriasTableServerProps) {
	//Fetch programas

	// if (!programas.data) return notFound();

	return <MateriasTable data={data.programas} />;
}
