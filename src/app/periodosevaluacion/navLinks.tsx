'use client'
import React from "react"
import Link from "next/link"
import { ROUTES } from "@/core/routes"
import { useSearchParams } from "next/navigation";


const SECTIONS = [
    {
        label: 'Materias de Niveles',
        href: ROUTES.periodoEvaluacion.path + '?section=0',
        section: '0'
    },
    {
        label: 'Materias de Curso',
        href: ROUTES.periodoEvaluacion.path + '?section=1',
        section: '1'
    }
]
export default function PeriodoEvaluacionesNavLinks() {
    const params = useSearchParams()

    return(
        <div>
            <ul className='500 flex items-center justify-start gap-4 border-b-2'>
                {SECTIONS.map(t => (
                    <li key={t.label} className={`p-2 rounded-t border-2 ${params.get('section') === t.section ? 'border-b-0' : ''}`}>
                        <Link href={t.href}>{t.label}</Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}