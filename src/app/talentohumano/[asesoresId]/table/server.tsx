import { type EstudiantesTableItem } from "./columns";
import EstudiantesTable from ".";

//MockUp data
const estudiantes: EstudiantesTableItem[] = [
	{
		nombre: "Nombre",
		id: "123415",
		emailtelefono: "juancito@gmail.com",
	},
	{
		nombre: "Nombre",
		id: "123415",
		emailtelefono: "juancito@gmail.com",
	},
	{
		nombre: "Nombre",
		id: "123415",
		emailtelefono: "juancito@gmail.com",
	},
	{
		nombre: "Nombre",
		id: "123415",
		emailtelefono: "juancito@gmail.com",
	},
	{
		nombre: "Nombre",
		id: "123415",
		emailtelefono: "juancito@gmail.com",
	},
	{
		nombre: "Nombre",
		id: "123415",
		emailtelefono: "juancito@gmail.com",
	},
	{
		nombre: "Nombre",
		id: "123415",
		emailtelefono: "juancito@gmail.com",
	},
	{
		nombre: "Nombre",
		id: "123415",
		emailtelefono: "juancito@gmail.com",
	},
	{
		nombre: "Nombre",
		id: "123415",
		emailtelefono: "juancito@gmail.com",
	},
	{
		nombre: "Nombre",
		id: "123415",
		emailtelefono: "juancito@gmail.com",
	},
	{
		nombre: "Nombre",
		id: "123415",
		emailtelefono: "juancito@gmail.com",
	},
	{
		nombre: "Nombre",
		id: "123415",
		emailtelefono: "juancito@gmail.com",
	},
	{
		nombre: "Nombre2",
		id: "123415",
		emailtelefono: "juancito@gmail.com",
	},
];

export default async function EstudiantesTableServer() {
	return <EstudiantesTable data={estudiantes} />;
}
