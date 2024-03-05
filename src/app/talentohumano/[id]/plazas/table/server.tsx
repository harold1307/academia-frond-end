import PlazasDepartamentosTable from ".";
import { type PlazasDepartamentosSchema } from "../add-plazas";

const plazasDepartamentos: PlazasDepartamentosSchema[] = [
	{
		id: "123",
		cargo: "cargo 1",
		persona: "juan carlos",
		tienecontrato: "",
		responsable: true,
		plazas: "",
		contrato: "contrato 1",
		activo: true,
	},
	{
		id: "1333",
		cargo: "cargo 2",
		persona: "juan carlos",
		tienecontrato: "",
		responsable: true,
		plazas: "",
		contrato: "contrato 2",
		activo: true,
	},
];

export default async function PlazasDepartamentosTableServer() {
	return <PlazasDepartamentosTable data={plazasDepartamentos} />;
}
