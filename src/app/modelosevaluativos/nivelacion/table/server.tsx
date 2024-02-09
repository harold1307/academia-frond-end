import { APIserver } from "@/core/api-server";
import VarianteCursoTable from ".";
import ModeloEvaluativoTable from ".";
import { NivelacionSchema } from "../add-nivelacion";
import NivelacionTable from ".";

//MockUp data
const nivelaciones: NivelacionSchema[] = [
	{
		id: "1",
		nombre: "Modelo1",
		notaMaxima: 10,
		notaParaAprobar: 4,
		decimalesNotaFinal: 2,
		logicaModelo: "",
		observaciones: "Esta data es de prueba",
	},
	{
		id: "2",
		nombre: "Modelo2",
		notaMaxima: 10,
		notaParaAprobar: 6,
		decimalesNotaFinal: 1,
		logicaModelo: "",
		observaciones: "Esta data también es de prueba",
	},
];

export default async function NivelacionTableServer() {
	//Fetch nivelaciones

	return <NivelacionTable data={nivelaciones} />;
}
