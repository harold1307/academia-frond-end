import React from "react";
import { Button } from "@/app/_components/ui/button";
import MateriasTableServer from "./table/server";

export default function HorarioIdPage() {
    return (
        <div>
            <div>
                <h1>Horarios de clases</h1>
                <h4>Programa:</h4>
                <h4>Nivel:</h4>
                <h4>Modalidad:</h4>
                <h4>Fecha:</h4>
            </div>
            <div className='w-full'>
                <ul className='my-2 flex w-full items-center justify-start gap-4'>
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
            <React.Suspense fallback={<h1>Cargando tabla...</h1>}>
                <MateriasTableServer />
            </React.Suspense>
        </div>
    );
}
