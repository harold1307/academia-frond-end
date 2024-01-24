"use client"
import { Input } from "@/app/_components/ui/input"
import { createColumnHelper } from "@tanstack/react-table"
import Image from "next/image"
import { useEffect, useState } from "react"

//Schema hasta tenerlo en Prisma
export type AlumnosEnClase = {
    id: string
    foto: string
    asistencia: boolean
    porcentajeAsistencia: number
    estudiante: string
    evaluaciones: string
}
export type AlumnosEnClaseTableItem = AlumnosEnClase

const helper = createColumnHelper<AlumnosEnClaseTableItem>();

export const AlumnosEnClaseColumns = [
	helper.accessor("id", {}),
	helper.accessor("foto", {
		header: "Foto",
        cell: ({ getValue }) => {
			const value = getValue()
			return (
                <div className='flex justify-center'>
                    <Image src={value} width={32} height={32} alt='foto alumno border-2'/>
                </div>
            )
		}
	}),
	helper.accessor("asistencia", {
		header: "Asistencia",
        cell: ({ getValue, row }) => {
			const value = getValue()
			const id = row.getValue("id") as string;
            return <PresentarAsistencia alumnoId={id} asistValue={value} />
		}
	}),
    helper.accessor("porcentajeAsistencia", {
        header: "% asistencia",
    }),
    helper.accessor("estudiante", {
        header: "Estudiante"
    }),
    helper.accessor("evaluaciones", {
        header: "Evaluaciones"
    })
    
];

type PresentarAsistenciaProps = {
    alumnoId:string
    asistValue:boolean
}

function PresentarAsistencia ({ alumnoId, asistValue = false }:PresentarAsistenciaProps) {
    const [asistencia, setAsistencia] = useState(asistValue)

    useEffect(() => {
        console.log('update asistencia del alumno ', alumnoId, ' ', asistencia)
        setAsistencia(asistencia)
    }, [asistencia])

    return (
        <div className='flex justify-center items-center'>
            <Input id={alumnoId} type="checkbox" onClick={() => setAsistencia(!asistencia)} />
        </div>
    )
}