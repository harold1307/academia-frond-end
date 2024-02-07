import React from "react";

import { APIserver } from "@/core/api-server";
import AddMalla from "./add-malla";
import AddArea from "./areas-conocimiento/add-area";
import AreasConocimientoTableServer from "./areas-conocimiento/table/server";
import AddCampo from "./campos-formacion/add-campo";
import CamposFormacionTableServer from "./campos-formacion/table/server";
import AddEje from "./ejes-formativos/add-eje";
import EjesFormativosTableServer from "./ejes-formativos/table/server";
import SelectPrograma from "./select-programa";
import MallaCurricularTableServer from "./table/server";

export const dynamic = "force-dynamic";

type Context = {
	searchParams: { [key: string]: string | undefined };
};

export default async function MallaPage({ searchParams }: Context) {
	const seccion = searchParams.seccion;

	if (seccion === "ejesFormativos") {
		return (
			<>
				<div className='mt-4'>
					<AddEje />
					<React.Suspense fallback={"Cargando tabla..."}>
						<EjesFormativosTableServer />
					</React.Suspense>
				</div>
			</>
		);
	}

	if (seccion === "areasConocimiento") {
		return (
			<>
				<div className='mt-4'>
					<AddArea />
					<React.Suspense fallback={"Cargando tabla..."}>
						<AreasConocimientoTableServer />
					</React.Suspense>
				</div>
			</>
		);
	}

	if (seccion === "camposFormacion") {
		return (
			<>
				<div className='mt-4'>
					<AddCampo />
					<React.Suspense fallback={"Cargando tabla..."}>
						<CamposFormacionTableServer />
					</React.Suspense>
				</div>
			</>
		);
	}

	const programaId = searchParams.programaId;

	const programas = await APIserver.programas.getMany();

	return (
		<>
			<div className='mt-4'>
				<AddMalla programaId={programaId} />
				<SelectPrograma
					programas={programas.data.map(p => ({ id: p.id, nombre: p.nombre }))}
					programaId={programaId}
				/>
				<MallaCurricularTableServer programaId={programaId} />
			</div>
		</>
	);
}
