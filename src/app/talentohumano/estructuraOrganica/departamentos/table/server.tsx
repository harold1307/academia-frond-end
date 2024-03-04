import DepartamentosTable from ".";
import { type DepartamentosSchema } from "../add-departamentos";
const departamentos: DepartamentosSchema[] = [
	{
		id: "22",
		nivel: "inicial",
		departamento: "Departamento Numero Uno Descripcion",
		subordinado: ["juan roman riquelme", "marcelo gallardo"],
		responsable: true,
		activo: false,
	},
	{
		nivel: "inicial",
		departamento: "Departamento Laaaaaaargo",
		subordinado: ["Fideo Di Maria", "lucas adragna"],
		responsable: true,
		id: "12",
		activo: true,
	},
	{
		id: "43",
		nivel: "inicial",
		departamento: "Departamento 2",
		subordinado: ["fernando ezequiel cavenaghi", "lionel messi"],
		responsable: true,
		activo: false,
	},
	{
		id: "56",
		nivel: "inicial",
		departamento: "Departamento 5",
		subordinado: ["fernando ezequiel cavenaghi", "lionel messi"],
		responsable: false,
		activo: false,
	},
];

export default async function DepartamentosTableServer() {
	return <DepartamentosTable data={departamentos} />;
}
