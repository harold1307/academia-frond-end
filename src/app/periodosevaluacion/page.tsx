import React from "react";
import MateriasDeNivelTableServer from "./table/server";
//import CamposModelosEvaluativosTableServer from "./table/server";


type Context = {
	searchParams: { [key: string]: string | string[] | undefined };
};

export default function PeriodoEvaluacion({ searchParams } : Context) {
    const section = searchParams.section

    if(section === '0') {
        return(
            <div>
                Periodo de Evaluación
                <React.Suspense fallback={<h1>Cargando tabla...</h1>} >
                    <MateriasDeNivelTableServer />
                </React.Suspense>
            </div>
        )
    } 

    if(section === '1') {
        return(
            <div>
                Periodo de Evaluación
                <React.Suspense fallback={<h1>Cargando tabla...</h1>} >
                    <MateriasDeNivelTableServer />
                    <h1>he</h1>
                </React.Suspense>
            </div>
        )
    }
    
        return(
        <div>
            Periodo de Evaluación
            <React.Suspense fallback={<h1>Cargando tabla...</h1>} >
                <MateriasDeNivelTableServer />
                <h1>he</h1>
            </React.Suspense>
        </div>
    )
}

