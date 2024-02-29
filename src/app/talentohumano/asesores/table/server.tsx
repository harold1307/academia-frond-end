import AsesoresTable from ".";
import { type AsesoresSchema } from "./columns";

const asesores: AsesoresSchema[] = [
	{
		nombre: "Asesor 1",
		id: "127837182",
		emailtelefono: "asesor1@gmail.com",
		activo: false,
	},
	{
		nombre: "Asesor 2",
		id: "12356457",
		emailtelefono: "asesor2@gmail.com",
		activo: true,
	},
];

export default async function AsesoresTableServer() {
	return <AsesoresTable data={asesores} />;
}
