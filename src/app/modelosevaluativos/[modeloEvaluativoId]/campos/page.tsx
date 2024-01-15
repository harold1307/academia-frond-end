import React from "react";
import CamposModelosEvaluativosTableServer from "./table/server";

export default function ModelosEvaluativosCampos() {
    return(
        <div>
            Detalle modelo evaluativo
            <React.Suspense fallback={<h1>Cargando tabla...</h1>} >
                <CamposModelosEvaluativosTableServer />
            </React.Suspense>
        </div>
    )
}