import AlternativaEvaluacionTable from ".";
import { type AlternativasEvaluacionSchema } from "../add-alternativas-evaluacion";

//MockUp data
const alternativasSoluciones: AlternativasEvaluacionSchema[] = [
	{
		id: "1",
		nombre: "Modelo1",
		codigo: "CD",
	},
	{
		id: "2",
		nombre: "Modelo3",
		codigo: "CDMG",
	},
	{
		id: "3",
		nombre: "Modelo3",
		codigo: "CGRD",
	},
	{
		id: "4",
		nombre: "Modelo4",
		codigo: "CAFD",
	},
];

export default async function AlternativaEvaluacionTableServer() {
	//Fetch alternativas evaluaciones

	return <AlternativaEvaluacionTable data={alternativasSoluciones} />;
}
