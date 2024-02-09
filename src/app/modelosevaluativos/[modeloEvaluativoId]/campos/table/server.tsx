import { APIserver } from "@/core/api-server";
import VarianteCursoTable from ".";
import ModeloEvaluativoTable from ".";
import { CamposModelosEvaluativosTableItem } from "./columns";
import CamposModelosEvaluativosTable from ".";

//MockUp data
const modelosEvaluativos: CamposModelosEvaluativosTableItem[] = [
	{
		orden: 1,
		campo: "NombreCampo1",
		alternativasDeEvaluacion: "Alternativas1",
		notaMinima: 5,
		notaMaxima: 10,
		decimales: 2,
		dependiente: false,
		maximos: false,
		impresion: true,
	},
	{
		orden: 2,
		campo: "NombreCampo2",
		alternativasDeEvaluacion: "Alternativas2",
		notaMinima: 20,
		notaMaxima: 50,
		decimales: 2,
		dependiente: true,
		maximos: false,
		impresion: true,
	},
];

export default async function CamposModelosEvaluativosTableServer() {
	//Fetch modelos evaluativos

	return <CamposModelosEvaluativosTable data={modelosEvaluativos} />;
}
