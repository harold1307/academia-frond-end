import React from "react";
import AddModeloEvaluativo from "./modelos/add-modelo";
import ModelosEvaluativosTableServer from "./modelos/table/server";


type Context = {
	searchParams: { [key: string]: string | string[] | undefined };
};

export default function ModelosEvaluativosPage({ searchParams }:Context) {
    const section = searchParams.section

    if(section === '1') {
        return(
            <h1>section 2</h1>
        )
    }
    if(section === '2') {
        return(
            <h1>section 3</h1>
        )
    }
    if(section === '3') {
        return(
            <h1>section 4</h1>
            )
        }
        
        
    return(
        <div>
            <AddModeloEvaluativo />
            <React.Suspense fallback={<h1>Cargando tabla...</h1>}>
                <ModelosEvaluativosTableServer />
            </React.Suspense>
        </div>
    )
}