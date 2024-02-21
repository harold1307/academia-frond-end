import React from "react";
import SelectMalla from "./select-malla";
import Plantillas from "./plantillas";
import HorariosAdminTableServer from "./table/server";
import Niveles from "./niveles";
import { useSearchParams } from "next/navigation";
import SelectPrograma from "../malla/select-programa";
import { APIserver } from "@/core/api-server";

type Context = {
	searchParams: { [key: string]: string | undefined };
};

export default async function Adm_HorariosPage({ searchParams } : Context) {

	const programaId = searchParams.programasId

	const programas = await APIserver.programas.getMany()
	
	
	return (
		<div>
			<Plantillas />
					<SelectPrograma 
						programas={programas.data.map(p => ({ id: p.id, nombre: p.nombre }))}
						programaId={programaId}
					/>
			<div className='flex h-16 w-full flex-col items-center justify-center'>
				<React.Suspense fallback={<h1>Cargando mallas </h1>}>
				</React.Suspense>
				<Niveles programaId={programaId} />
			</div>
			<React.Suspense fallback={<h1>Cargando tabla...</h1>}>
				<HorariosAdminTableServer />
			</React.Suspense>
		</div>
	);
}
