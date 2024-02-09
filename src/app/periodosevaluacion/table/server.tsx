import { APIserver } from "@/core/api-server";
import MateriasDeNivelTable from ".";

const PeriodosMaterias = [
   {
      id:'1',
      campo: 'Administración',
      inicio: '01-04-2024',
      fin:'01-12-2024',
      tipo: 'Aristobulo del Valle'
   },{
      id:'2',
      campo: 'Evaluación Parcial',
      inicio: '01-04-2024',
      fin:'01-12-2024',
      tipo: 'Aristobulo del Valle'
   }
]

//Fetch aqui
export default async function MateriasDeNivelTableServer () {
   //const Periodos = APIserver.

   return <MateriasDeNivelTable data={PeriodosMaterias} />
}