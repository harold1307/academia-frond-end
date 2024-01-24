import React from "react";
import HorariosTableServer from "./table/server";
import { Button } from "@/app/_components/ui/button";

export default function HorarioIdPage() {
    return(
        <div>
            <div>
                <h1>Horarios de clases</h1>
                <h4>Programa:</h4>
                <h4>Nivel:</h4>
                <h4>Modalidad:</h4>
                <h4>Fecha:</h4>
            </div>
            <div className='w-full'>
                <ul className='w-full flex items-center justify-start gap-4 my-2'>
                    <li>
                        <Button>Adicionar</Button>
                    </li>
                    <li>
                        <Button>Materias</Button>
                    </li>
                    <li>
                        <Button>Imprimir</Button>
                    </li>
                    <li>
                        <Button>Limpiar</Button>
                    </li>
                </ul>
            </div>
            <React.Suspense fallback={<h1>Cargando tabla...</h1>} >
                <HorariosTableServer />
            </React.Suspense>
        </div>
    )
}