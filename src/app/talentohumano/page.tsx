import React from "react";
import AddPersonal from "./personal/add-personal";
import PersonalTableServer from "./personal/table/server";
import ModeloDeContratoTableServer from "./modelosDeContrato/table/server";
import AddModeloDeContrato from "./modelosDeContrato/add-modeloDeContrato";
import AddAsesores from "./asesores/add-asesores";
import AsesoresTableServer from "./asesores/table/server";
import SearchBar from "./personal/searchbar";
import { FiltroTipos } from "./personal/filtros/filtroTipos";
import { FiltroSedes } from "./personal/filtros/filtroSedes";
import { FiltroGrupos } from "./personal/filtros/filtroGrupos";

type Context = {
	searchParams: { [key: string]: string | string[] | undefined };
};

export default function PersonalPage({ searchParams }: Context) {
	const section = searchParams.section;

	if (section === "1") {
		return (
			<div className='p-2'>
				<AddAsesores />
				<React.Suspense fallback={<h1>Cargando Tabla....</h1>}>
					<AsesoresTableServer />
				</React.Suspense>
			</div>
		);
	}
	if (section === "2") {
		return (
			<div className='p-2'>
				<React.Suspense fallback={<h1>Cargando Tabla....</h1>}></React.Suspense>
			</div>
		);
	}
	if (section === "3") {
		return (
			<div className='p-2'>
				<AddModeloDeContrato />
				<React.Suspense fallback={<h1>Cargando Tabla....</h1>}>
					<ModeloDeContratoTableServer />
				</React.Suspense>
			</div>
		);
	}

	return (
		<div className='p-2'>
			<div className='mx-4 flex flex-row items-baseline justify-between p-2'>
				<AddPersonal />
				<div className='flex flex-row gap-2'>
					<FiltroSedes />
					<FiltroGrupos />
					<FiltroTipos />
				</div>
				<div>
					<SearchBar />
				</div>
			</div>
			<React.Suspense fallback={<h1>Cargando Tabla...</h1>}>
				<PersonalTableServer />
			</React.Suspense>
		</div>
	);
}
