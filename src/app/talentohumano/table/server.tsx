import TalentoHumanoTable from ".";
import { type TalentoHumano } from "./columns";

const talentoHumano: TalentoHumano[] = [
	{
		nombre: "jorge",
		departamento: "fisica",
		id: "22",
		emailtelefono: "jorgedelprado@gmail.com",
		datos: "algo",
		etnia: "argentino",
		asesor: true,
		discapacidad: false,
		admin: false,
		profesor: true,
		foto: true,
	},
];

export default async function HorariosTableServer() {
	//Fetch horarios

	return <TalentoHumanoTable data={talentoHumano} />;
}
