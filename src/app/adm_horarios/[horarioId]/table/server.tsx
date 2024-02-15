import HorariosTable from ".";
import { Week } from "./columns";

//MockUp data
const horarios: [] = [];

export default async function HorariosTableServer() {
	//Fetch horarios

	return <HorariosTable data={horarios} />;
}
