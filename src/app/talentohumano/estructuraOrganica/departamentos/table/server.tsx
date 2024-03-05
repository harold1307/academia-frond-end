import DepartamentosTable from ".";
import { type DepartamentosSchema } from "../add-departamentos";
const departamentos: DepartamentosSchema[] = [
	{
		id: "22",
		nivel: "1",
		departamento: "Departamento Numero Uno Descripcion",
		subordinado: ["juan roman riquelme", "marcelo gallardo"],
		responsable: "Maria",
		plazas: "1",
		activo: false,
	},
	{
		nivel: "1",
		departamento: "Departamento Laaaaaaargo",
		subordinado: ["Fideo Di Maria", "lucas adragna"],
		responsable: "Ramon",
		plazas: "4",
		id: "12",
		activo: true,
	},
	{
		id: "43",
		nivel: "2",
		departamento: "Departamento 2",
		subordinado: ["fernando ezequiel cavenaghi", "lionel messi"],
		responsable: "Jose",
		plazas: "2",
		activo: false,
	},
	{
		id: "56",
		nivel: "3",
		departamento: "Departamento 5",
		subordinado: ["fernando ezequiel cavenaghi", "lionel messi"],
		responsable: "Alguien",
		plazas: "4",
		activo: false,
	},
];

export default async function DepartamentosTableServer() {
	return <DepartamentosTable data={departamentos} />;
}
