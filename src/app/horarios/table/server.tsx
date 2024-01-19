import HorariosTable from ".";
import { Week } from "./columns";

//MockUp data
const horarios:Week[] = [
    {
        lunes: {
            id: '23',
            nombre: 'NombreCurso1',
            aula: 'Aula 42',
            horaInicio: '08:00',
            horaFin: '12:00'
        },
        martes: '',
        miercoles: {
            id: '78',
            nombre: 'NombreCurso21',
            aula: 'Aula 431',
            horaInicio: '13:00',
            horaFin: '16:00'
        },
        jueves: '',
        viernes: {
            id: '12',
            nombre: 'NombreCurso798',
            aula: 'Aula 13',
            horaInicio: '18:00',
            horaFin: '22:00'
        },
        sabado: '',
        domingo: ''
    }
]
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

//Llenar la primera fila de datos con las fechas de la semana actual
for(let i = 0; i <week.length; i++) {
    week[i].push(new Date(currentDate.setDate(first + i)).toUTCString())
}
horarios.unshift(Object.fromEntries(week) as Week)


export default async function HorariosTableServer() {
	//Fetch horarios

	return <HorariosTable data={horarios} />;
}
