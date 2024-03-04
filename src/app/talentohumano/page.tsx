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
import EstructuraOrganica from "./estructuraOrganica/estructuraOrganica";
import FuncionesTableServer from "./estructuraOrganica/funciones/table/server";
import AddFunciones from "./estructuraOrganica/funciones/add-funciones";
import CargosTableServer from "./estructuraOrganica/cargos/table/server";
import AddCargos from "./estructuraOrganica/cargos/add-cargos";
import DepartamentosTableServer from "./estructuraOrganica/departamentos/table/server";
import AddDepartamentos from "./estructuraOrganica/departamentos/add-departamentos";

type Context = {
	searchParams: { [key: string]: string | string[] | undefined };
};

export default function PersonalPage({ searchParams }: Context) {
	const section = searchParams.section;

	if (section === "1") {
		return (
			<div className='p-2'>
				<div className='mx-4 flex flex-row items-baseline justify-between p-2'>
					<AddAsesores />
					<SearchBar />
				</div>
				<React.Suspense fallback={<h1>Cargando Tabla....</h1>}>
					<AsesoresTableServer />
				</React.Suspense>
			</div>
		);
	}

	if (section === "2?subsection=0" || section === "2") {
		return (
			<div className='py-2'>
				<div>
					<EstructuraOrganica />
				</div>

				<div className='p-2'>
					<div className='mx-4 flex flex-row items-baseline justify-between p-2'>
						<AddDepartamentos />
					</div>
					<React.Suspense fallback={<h1>Cargando Tabla...</h1>}>
						<DepartamentosTableServer />
					</React.Suspense>
				</div>
			</div>
		);
	}
	if (section === "2?subsection=1") {
		return (
			<div className='py-2'>
				<div>
					<EstructuraOrganica />
				</div>

				<div className='p-2'>
					<div className='mx-4 flex flex-row items-baseline justify-between p-2'>
						<AddCargos />
					</div>
					
					<React.Suspense fallback={<h1>Cargando Tabla...</h1>}>
						<CargosTableServer />
					</React.Suspense>
				</div>
			</div>
		);
	}
	if (section === "2?subsection=2") {
		return (
			<div className='py-2'>
				<div>
					<EstructuraOrganica />
				</div>

				<div className='p-2'>
					<div className='mx-4 flex flex-row items-baseline justify-between p-2'>
						<AddFunciones />
					</div>
					<React.Suspense fallback={<h1>Cargando Tabla...</h1>}>
						<FuncionesTableServer />
					</React.Suspense>
				</div>
			</div>
		);
	}

	if (section === "3") {
		return (
			<div className='p-2'>
				<div className='mx-4 flex flex-row items-baseline justify-between p-2'>
					<AddModeloDeContrato />
				</div>
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
