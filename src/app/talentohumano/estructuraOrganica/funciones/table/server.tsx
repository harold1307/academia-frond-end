import FuncionesTable from ".";
import { type FuncionesSchema } from "../add-funciones";
const funciones: FuncionesSchema[] = [
	{
		funcion: "juan fernando quintero",
		id: "22",
		enuso: true,
	},
	{
		funcion: "juan",
		id: "23",
		enuso: true,
	},
	{
		funcion: "ramon",
		id: "2333",
		enuso: true,
	},
	{
		funcion: "francisco charco",
		id: "5345",
		enuso: false,
	},
];

export default async function FuncionesTableServer() {
	return <FuncionesTable data={funciones} />;
}
