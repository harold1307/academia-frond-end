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
		<div className='flex flex-col gap-4 justify-center align-center'>
			<div className='pl-6 pr-6 flex items-center justify-between'>
				<AddVariante cursoId={curso.data.id} />
				<div className='w-3/12 h-12 relative flex items-center'>
					<Input className='h-100 rounded-xl shadow-primaryShadow' />
					<div className='absolute right-3 h-5 flex justicy-center items-center' >
						<LupaIcon/>
					</div>
				</div>
			<div className='mt-4'>
				<React.Suspense fallback={"Cargando tabla..."}>
					<VarianteCursoTableServer cursoId={params.cursoId} />
				</React.Suspense>
			</div>
		</div>
  </div>
	);
}
