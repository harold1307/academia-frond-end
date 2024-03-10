import { APIserver } from "@/core/api-server";
import GraduadosTable from "./graduados";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

type Context = {
	searchParams: { [key: string]: string | string[] | undefined };
};

export default async function Page({ searchParams }: Context) {
	const section = searchParams.section;
	console.log("section", section);

	const graduados = await APIserver.usuarios.getMany({
		filters: {
			tipo: "ALUMNO",
			// alumno_estado: "EGRESADO",
		},
	});

	return (
		<>
			<Suspense fallback={"Cargando tabla..."}>
				<div className='mt-4'>
					<GraduadosTable graduados={graduados.data} />
				</div>
			</Suspense>
		</>
	);
}
