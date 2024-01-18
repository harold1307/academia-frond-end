import HorariosTable from ".";
import { Week } from "./columns";

//MockUp data
const horarios:Week[] = []
const week:any[] = [
    ['lunes'],
    ['martes'],
    ['miercoles'],
    ['jueves'],
    ['viernes'],
    ['sabado'],
    ['domingo'],
]

//Obtener la semana actual
const currentDate = new Date
const first = currentDate.getDate() - (currentDate.getDay() - 1)
const last = first + 6

const firstDay = new Date(currentDate.setDate(first)).toUTCString()
const lastDay = new Date(currentDate.setDate(last)).toUTCString()

//Llenar la primera fila de datos con las fechas de la semana actual
for(let i = 0; i <week.length; i++) {
    week[i].push(new Date(currentDate.setDate(first + i)).toUTCString())
}
horarios.push(Object.fromEntries(week) as Week)


export default async function HorariosTableServer() {
	//Fetch horarios

	return <HorariosTable data={horarios} />;
}
