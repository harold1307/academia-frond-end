import React from "react";
import MateriasDeNivelTableServer from "./table/server";
import CarrerasDataTableServer from "./cronograma/table/server";
import PeriodosEvaluativosTableServer from "./table/server";


type Context = {
	searchParams: { [key: string]: string | string[] | undefined };
};

export default function PeriodoEvaluacion({ searchParams } : Context) {
    const section = searchParams.section

    if(section === '0') {
        return(
            <div>
                <React.Suspense fallback={<h1>Cargando tabla...</h1>} >
                    <PeriodosEvaluativosTableServer />  
                </React.Suspense>
            </div>
        )
    } 

    if(section === '1') {
        return(
            <div>
                <React.Suspense fallback={<h1>Cargando tabla...</h1>} >
                    <MateriasDeNivelTableServer />
                </React.Suspense>
            </div>
        )
    }
    
        return(
        <div>
            <React.Suspense fallback={<h1>Cargando tabla...</h1>} >
                <CarrerasDataTableServer />
            </React.Suspense>
        </div>
    )
}

