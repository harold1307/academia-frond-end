import AddVariante from "./add-variante";
import LupaIcon from "@/app/_components/ui/icons/lupa";
import { Input } from "@/app/_components/ui/input";
import VariantesTableServer from "./table/server";
import React from "react";

type Context = {
	params: {
		cursoId: string;
	};
};

export const dynamic = "force-dynamic";

export default async function CursosVariantesPage({ params }: Context) {

	return (
		<div className='flex flex-col gap-4 justify-center align-center'>
			<div className='pl-6 pr-6 flex items-center justify-between'>
				<AddVariante cursoId={params.cursoId} />
				<div className='w-3/12 h-12 relative flex items-center'>
					<Input className='h-100 rounded-xl shadow-primaryShadow' />
					<div className='absolute right-3 h-5 flex justicy-center items-center' >
						<LupaIcon/>
					</div>
				</div>
			</div>
			<React.Suspense fallback={<h1>Cargando tabla...</h1>} >
				<VariantesTableServer cursoId={params.cursoId} />
			</React.Suspense>
		</div>
	);
}
