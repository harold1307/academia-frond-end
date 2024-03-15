import React from "react";
import CortesTable from "./table";
import { APIserver } from "@/core/api-server";
import RetirosTable from "./table";

async function RetirosPage() {
	return (
		<>
			<div className='mt-4'>
                <h1 className="my-4 text-xl">Retiros de matriculas</h1>
				<React.Suspense fallback={"Cargando tabla..."}>
					<RetirosTable retiros={MURetiros} />
				</React.Suspense>
			</div>
		</>
	);
}

const MURetiros = [
	{
		id: "1",
		estudiante: "PRUEBA",
		nivel: 1,
		sede: "PRINCIPAL",
		sesion: "EN LINEA",
		programa: "ADMINISTRACION",
		fecha: "10-11-2022",
        motivo: 'Lorem ipsum dolor at amete'
	},
	{
		id: "2",
		estudiante: "PRUEBA2",
		nivel: 1,
		sede: "PRINCIPAL",
		sesion: "EN LINEA",
		programa: "ADMINISTRACION",
		fecha: "10-11-2022",
        motivo: 'Lorem ipsum dolor at amete 2'
	},
];

export default RetirosPage;
