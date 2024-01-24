import { ROUTES } from "@/core/routes"
import Link from "next/link"

export type HorarioCardT = {
    id: string
    horaInicio: string
    horaFin: string
    nombre: string
    aula:string
}

export type HorarioCardProps = {
    data: HorarioCardT
}

export default function HorarioCard({ data }:HorarioCardProps) {


    return(
        <div className="p-4 border-2 rounded-md flex items-center justify-center flex-col">
            <span>{data.horaInicio} a {data.horaFin}</span>
            <br />
            <span>{data.nombre}</span>
            <br />
            <span>{data.aula}</span>
            <br />
            <Link className="border-2 rounded-md p-2" href={ROUTES.proHorarios.detalleHorario(data.id)}>
                Ir a la clase
            </Link>
        </div>
    )

}