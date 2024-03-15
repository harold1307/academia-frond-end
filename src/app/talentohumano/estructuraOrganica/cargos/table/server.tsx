import CargosTable from ".";
import { type CargosSchema } from "../add-cargos";
const cargos: CargosSchema[] = [
	{
		cargos: "Cargo Numero Uno Descripcion",
		id: "22",
		asignados: ["juan roman riquelme", "marcelo gallardo"],
		multiple: false,
		paraprofesores: true,
		paraadministrativos: false,
		enuso: true,
	},
	{
		cargos: "Cargo Laaaaaaargo",
		id: "12",
		asignados: ["Fideo Di Maria", "lucas adragna"],
		multiple: true,
		paraprofesores: true,
		paraadministrativos: true,
		enuso: false,
	},
	{
		cargos: "Cargo 2",
		id: "43",
		asignados: ["fernando ezequiel cavenaghi", "lionel messi"],
		multiple: false,
		paraprofesores: true,
		paraadministrativos: false,
		enuso: true,
	},
	{
		cargos: "Cargo 5",
		id: "56",
		asignados: ["fernando ezequiel cavenaghi", "lionel messi"],
		multiple: false,
		paraprofesores: false,
		paraadministrativos: false,
		enuso: false,
	},
];

export default async function CargosTableServer() {
	return <CargosTable data={cargos} />;
}
