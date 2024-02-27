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
import MallaPageTabs, { mallaSeccionParams } from "./tabs";

export const dynamic = "force-dynamic";

type Context = {
	searchParams: { [key: string]: string | undefined };
};

export default async function MallaPage({ searchParams }: Context) {
	const seccion = searchParams.seccion;

	if (seccion === mallaSeccionParams.ejesFormativos) {
		return (
			<>
				<h1 className='mb-4 text-xl font-semibold'>Mallas curriculares</h1>
				<MallaPageTabs seccion={seccion} />
				<div className='mt-4'>
					<AddEje />
					<React.Suspense fallback={"Cargando tabla..."}>
						<EjesFormativosTableServer />
					</React.Suspense>
				</div>
			</>
		);
	}

	if (seccion === mallaSeccionParams.areasConocimiento) {
		return (
			<>
				<h1 className='mb-4 text-xl font-semibold'>Mallas curriculares</h1>
				<MallaPageTabs seccion={seccion} />
				<div className='mt-4'>
					<AddArea />
					<React.Suspense fallback={"Cargando tabla..."}>
						<AreasConocimientoTableServer />
					</React.Suspense>
				</div>
			</>
		);
	}

	if (seccion === mallaSeccionParams.camposFormacion) {
		return (
			<>
				<h1 className='mb-4 text-xl font-semibold'>Mallas curriculares</h1>
				<MallaPageTabs seccion={seccion} />
				<div className='mt-4'>
					<AddCampo />
					<React.Suspense fallback={"Cargando tabla..."}>
						<CamposFormacionTableServer />
					</React.Suspense>
				</div>
			</>
		);
	}

	const programas = await APIserver.programas.getMany();

	const programaId = searchParams.programaId || programas.data.at(0)?.id;

	return (
		<>
			<h1 className='mb-4 text-xl font-semibold'>Mallas curriculares</h1>
			<MallaPageTabs seccion={"mallas"} />
			<div className='mt-4'>
				<AddMalla programaId={programaId} />
				<SelectPrograma
					programas={programas.data.map(p => ({ id: p.id, nombre: p.nombre }))}
					programaId={programaId}
				/>
				<React.Suspense fallback={"Cargando tabla..."}>
					<MallaCurricularTableServer
						programaId={programaId}
						programaName={
							programas.data.find(p => p.id === programaId)?.nombre || ""
						}
					/>
				</React.Suspense>
			</div>
		</>
	);
}
