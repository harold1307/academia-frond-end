import { APIserver } from "@/core/api-server";
import VarianteCursoTable from ".";
import ModeloEvaluativoTable from ".";
import { type ModelosEvaluativoSchema } from "../add-modelo";

//MockUp data
const modelosEvaluativos: ModelosEvaluativoSchema[] = [
	{
		id: "1",
		nombre: "Modelo1",
		examenComplexivo: true,
		notaMaxima: 10,
		notaParaAprobar: 4,
		notaParaRecuperacion: 6,
		porcentajeAsistenciaAprobar: 75,
		decimalesNotaFinal: 2,
		defineMaximos: true,
		camposActualizanEstado: false,
		observaciones: "Esta data es de prueba",
	},
	{
		id: "2",
		nombre: "Modelo2",
		examenComplexivo: true,
		notaMaxima: 10,
		notaParaAprobar: 6,
		notaParaRecuperacion: 6,
		porcentajeAsistenciaAprobar: 80,
		decimalesNotaFinal: 1,
		defineMaximos: false,
		camposActualizanEstado: false,
		observaciones: "Esta data también es de prueba",
	},
];

export default async function ModelosEvaluativosTableServer() {
	//Fetch modelos evaluativos

	return <ModeloEvaluativoTable data={modelosEvaluativos} />;
}
