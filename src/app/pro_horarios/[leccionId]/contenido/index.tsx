'use client'
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { ChangeEvent, ReactEventHandler, useState } from "react";

type ContenidoProps = {
    materia: string
}

export default function Contenido({ materia }:ContenidoProps) {

    const [content, setContent] = useState({
        tema: '',
        estrategia: '',
        obs: ''
    })

    const contentHandler = (e:ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setContent({
            ...content,
            [e.target.name]: e.target.value
        })
    }

    const saveContent = () => {
        console.log('Save', content)
    }
    return(
        <section className='w-full p-4 flex items-start justify-center flex-col gap-4'>
            <span>Materia: {materia}</span>
            <div className='w-full h-32'>
                <span>Tema y Subtema</span>
                <Input className="h-28 m-0" onChange={(e) => contentHandler(e)} type='custom-text-area' name='tema' placeholder="Sin Contenido"/>
            </div>
            <div className='w-full h-32'>
                <span>Estrategias Metodológicas</span>
                <Input className="h-28 m-0" onChange={(e) => contentHandler(e)} type='custom-text-area' name='estrategia' placeholder="Sin Contenido" />
            </div>
            <div className='w-full h-36'>
                <span>Observaciones</span>
                <Input className="h-28 m-0" onChange={(e) => contentHandler(e)} type='custom-text-area' name='obs' placeholder="Sin Observaciones" />
            </div>
            <Button onClick={saveContent}>
                Guardar
            </Button>
        </section>
    )
}