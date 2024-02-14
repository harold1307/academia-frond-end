import React from "react"
import { fontPlay } from "../_components/ui/fonts"
import ModelosEvaluativosNavLinks from "./navLinks"
import PeriodoEvaluacionesNavLinks from "./navLinks"

export default function ModelosEvaluativosLayout( { children }:React.PropsWithChildren) {

    return(
        <div>
            <div>
                <h1 className={`${fontPlay.className} antialiased w-100 text-center text-4xl`}>Periodos de Evaluación</h1>
                <PeriodoEvaluacionesNavLinks />
            </div>
            {children}
        </div>
    )
}