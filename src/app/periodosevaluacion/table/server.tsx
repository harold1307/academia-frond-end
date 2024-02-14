import { APIserver } from "@/core/api-server";
import CronogramasTable from ".";

const PeriodosEvaluativos = [
	{
		nombre: "Modelo 2023 Orientativo",
		cronogramas: [
			{
				nombre: "Cronograma 1",
				materias: [
					{
						id: "1",
						campo: "Administración",
						inicio: "01-04-2024",
						fin: "01-12-2024",
						tipo: "Aristobulo del Valle",
					},
					{
						id: "2",
						campo: "Evaluación Parcial",
						inicio: "01-04-2024",
						fin: "01-12-2024",
						tipo: "Aristobulo del Valle",
					},
				],
			},
		],
	},
	{
		nombre: "Modelo 2023 Ciclo 2",
		cronogramas: [
			{
				nombre: "Cronograma 1",
				materias: [
					{
						id: "1",
						campo: "Administración",
						inicio: "01-04-2024",
						fin: "01-12-2024",
						tipo: "Aristobulo del Valle",
					},
					{
						id: "2",
						campo: "Evaluación Parcial",
						inicio: "01-04-2024",
						fin: "01-12-2024",
						tipo: "Aristobulo del Valle",
					},
				],
			},
		],
	},
];

//Fetch aqui
export default async function PeriodosEvaluativosTableServer() {
	//const Periodos = APIserver.

	return <CronogramasTable data={PeriodosEvaluativos} />;
}
