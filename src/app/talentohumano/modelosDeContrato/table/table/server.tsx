import ModeloDeContratoTable from ".";
import { type ModeloDeContratoSchema } from "../add-modeloDeContrato";

const modeloDeContrato: ModeloDeContratoSchema[] = [
	{
		id: "123",
		nombredescripcion: "Modelo 1",
		paraprofesores: false,
		archivo: "",
		campos: "",
		activo: true,
	},
	{
		id: "1333",
		nombredescripcion: "Modelo 2",
		paraprofesores: true,
		archivo: "",
		campos: "",
		activo: true,
	},
];

export default async function ModeloDeContratoTableServer() {
	return <ModeloDeContratoTable data={modeloDeContrato} />;
}
