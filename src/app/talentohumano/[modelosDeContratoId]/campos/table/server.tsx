import { type CamposModelosDeContratosTableItem } from "./columns";
import CamposModelosDeContratosTable from ".";

//MockUp data
const modelosDeContratos: CamposModelosDeContratosTableItem[] = [
	{
		nombredescripcion: "Nombre",
		codigo: "Codigo123",
		tipo: "Texto",
	},
	{
		nombredescripcion: "Nombre2",
		codigo: "Codigo1234",
		tipo: "Texto",
	},
];

export default async function CamposModelosDeContratosTableServer() {
	return <CamposModelosDeContratosTable data={modelosDeContratos} />;
}
