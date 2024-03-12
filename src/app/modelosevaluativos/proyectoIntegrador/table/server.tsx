import { type ProyectoIntegradorSchema } from "../add-proyecto-integrador";
import ProyectoIntegradorTable from ".";

//MockUp data
const proyectosIntegradores: ProyectoIntegradorSchema[] = [
	{
		id: "1",
		nombre: "Modelo1",
		notaMaxima: 10,
		notaParaAprobar: 4,
		decimalesNotaFinal: 2,
		observaciones: "Esta data es de prueba",
	},
	{
		id: "2",
		nombre: "Modelo3",
		notaMaxima: 8,
		notaParaAprobar: 6,
		decimalesNotaFinal: 2,
		observaciones: "Esta data es de prueba",
	},
	{
		id: "3",
		nombre: "Modelo3",
		notaMaxima: 10,
		notaParaAprobar: 7,
		decimalesNotaFinal: 2,
		observaciones: "Esta data es de prueba",
	},
	{
		id: "4",
		nombre: "Modelo4",
		notaMaxima: 3,
		notaParaAprobar: 3,
		decimalesNotaFinal: 2,
		observaciones: "Esta data es de prueba",
	},
];

export default async function ProyectoIntegradorTableServer() {
	//Fetch proyectos integradores

	return <ProyectoIntegradorTable data={proyectosIntegradores} />;
}
