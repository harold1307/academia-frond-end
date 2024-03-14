import React from "react";

import AddTrad from "./addTraduccion";
import TraduccionTable from "./table";

export const dynamic = "force-dynamic";

export default function TraduccionPage({ params }: any) {
	return (
		<>
			<div className='mt-4'>
				<React.Suspense fallback={"Cargando tabla..."}>
					<AddTrad />
					<TraduccionTable mallas={MuFieldTrad} />
				</React.Suspense>
			</div>
		</>
	);
}

const MuFieldTrad = [
	{ id: "1", nombre: "Periodo Prueba MT", idioma: "ingles" },
	{ id: "2", nombre: "Periodo Prueba MT", idioma: "ingles" },
	{ id: "3", nombre: "Periodo Prueba MT", idioma: "ingles" },
	{ id: "4", nombre: "Periodo Prueba MT", idioma: "ingles" },
	{ id: "5", nombre: "Periodo Prueba MT", idioma: "ingles" },
];
