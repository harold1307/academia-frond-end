import { notFound } from "next/navigation";

import AddVariante from "./add-variante";
import { APIserver } from "@/core/api-server";
import VarianteTable from "./variantesTable";

type Context = {
	params: {
		cursoId: string;
	};
};

export const dynamic = "force-dynamic";

export default async function CursosVariantesPage({ params }: Context) {
	// const curso = await APIserver.cursos.getCursoWithVariantesByCursoId(
	// 	params.cursoId,
	// );

	// if (!curso) return notFound();

	return (
		<>
			<div className='mt-4'>
				<AddVariante cursoId={params.cursoId} />
				<VarianteTable />
			</div>
		</>
	);
}
