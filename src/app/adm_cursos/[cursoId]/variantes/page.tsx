import LupaIcon from "@/app/_components/ui/icons/lupa";
import { Input } from "@/app/_components/ui/input";
import { notFound } from "next/navigation";
import React from "react";

import { APIserver } from "@/core/api-server";
import AddVariante from "./add-variante";
import VarianteCursoTableServer from "./table/server";

type Context = {
	params: {
		cursoId: string;
	};
};

export const dynamic = "force-dynamic";

export default async function CursosVariantesPage({ params }: Context) {
	const curso = await APIserver.cursos.getCursoWithVariantesByCursoId(
		params.cursoId,
	);

	if (!curso) return notFound();
	return (
		<div className='align-center flex flex-col justify-center gap-4'>
			<div className='flex items-center justify-between pl-6 pr-6'>
				<AddVariante cursoId={curso.data.id} />
				<div className='relative flex h-12 w-3/12 items-center'>
					<Input className='h-100 rounded-xl shadow-primaryShadow' />
					<div className='justicy-center absolute right-3 flex h-5 items-center'>
						<LupaIcon />
					</div>
				</div>
			</div>
			<div className='mt-4'>
				<React.Suspense fallback={"Cargando tabla..."}>
					<VarianteCursoTableServer cursoId={params.cursoId} />
				</React.Suspense>
			</div>
		</div>
	);
}
