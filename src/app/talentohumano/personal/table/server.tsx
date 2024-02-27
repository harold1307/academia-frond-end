import PersonalTable from ".";
import { type PersonalSchema } from "../add-personal";

const personal: PersonalSchema[] = [
	{
		nombre: "jorge",
		departamento: "fisica",
		id: "22",
		emailtelefono: "123123asd",
		datos: "cosa",
		etnia: "argentino",
		asesor: true,
		discapacidad: false,
		admin: false,
		profesor: true,
		foto: true,
	},
	{
		nombre: "juan",
		departamento: "geografia",
		id: "123",
		emailtelefono: "juansimon@gmail.com",
		datos: "algo",
		etnia: "argentino",
		asesor: true,
		discapacidad: false,
		admin: false,
		profesor: true,
		foto: true,
	},
	{
		nombre: "ramon",
		departamento: "quimica",
		id: "2333",
		emailtelefono: "ramon@gmail.com",
		datos: "algo",
		etnia: "uruguayo",
		asesor: true,
		discapacidad: false,
		admin: false,
		profesor: true,
		foto: true,
	},
	{
		nombre: "francisco",
		departamento: "biologia",
		id: "5345",
		emailtelefono: "franciscobiologia@gmail.com",
		datos: "algo",
		etnia: "brasilero",
		asesor: false,
		discapacidad: false,
		admin: true,
		profesor: true,
		foto: false,
	},
];

export default async function PersonalTableServer() {
	return <PersonalTable data={personal} />;
}
