import React from "react";
import { fontPlay } from "../_components/ui/fonts";
import LupaIcon from "../_components/ui/icons/lupa";
import { Input } from "../_components/ui/input";
import AddCurso from "./add-curso";
import CursoTable from "./table";
import CursoTableServer from "./table/server";

export default function CursoPage() {
	return (
		<>
			<div className='flex flex-col gap-4 justify-center align-center'>
				<div className='pl-6 pr-6 flex items-center justify-between'>
					<AddCurso />
					<div className='w-3/12 h-12 relative flex items-center'>
						<Input className='h-100 rounded-xl shadow-primaryShadow' />
						<div className='absolute right-3 h-5 flex justicy-center items-center' >
							<LupaIcon/>
						</div>
					</div>
				</div>
				<React.Suspense fallback={<h1>Cargando tabla...</h1>}>
					<CursoTableServer />
				</React.Suspense>
			</div>
		</>
	);
}
