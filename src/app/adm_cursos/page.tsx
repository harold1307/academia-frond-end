import React from "react";
import LupaIcon from "../_components/ui/icons/lupa";
import { Input } from "../_components/ui/input";
import AddCurso from "./add-curso";
import CursoTableServer from "./table/server";

export const dynamic = "force-dynamic";

export default function CursoPage() {
	return (
		<>
			<div className='align-center flex flex-col justify-center gap-4'>
				<div className='flex items-center justify-between pl-6 pr-6'>
					<AddCurso />
					<div className='relative flex h-12 w-3/12 items-center'>
						<Input className='h-100 rounded-xl shadow-primaryShadow' />
						<div className='justicy-center absolute right-3 flex h-5 items-center'>
							<LupaIcon />
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
