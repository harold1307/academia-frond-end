import { APIserver } from "@/core/api-server";
import AddAsignaturaEnMalla from "./add-asignatura-en-malla";
import AsignaturaEnMallaTable from "./table";

type Context = {
	params: {
		mallaId: string;
	};
};

export const dynamic = "force-dynamic";

export default async function AsignaturasEnMallaPage({ params }: Context) {
	const asignaturas = await APIserver.asignaturas.getMany();
	const malla = await APIserver.mallas.getById(params.mallaId);

	console.log(asignaturas);

	if (!malla) {
		console.log("Malla no existe");
	}

	return (
		<>
			<div className='mt-4'>
				<AddAsignaturaEnMalla
					mallaId={params.mallaId}
					mallaNiveles={malla.data?.niveles}
					asignaturas={asignaturas.data}
				/>
				<AsignaturaEnMallaTable mallaId={params.mallaId} />
			</div>
		</>
	);
}
