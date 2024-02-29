import { APIserver } from "@/core/api-server";
import AsignaturaTable, {
	DeleteAsignaturaTableModal,
	UpdateAsignaturaTableModal,
} from ".";

export default async function AsignaturaTableServer() {
	const asignaturas = await APIserver.asignaturas.getMany();

	return (
		<>
			<AsignaturaTable
				asignaturas={asignaturas.data.map(a => ({
					...a,
					mallas: 0,
					record: 0,
				}))}
			/>
			<UpdateAsignaturaTableModal asignaturas={asignaturas.data} />
			<DeleteAsignaturaTableModal asignaturas={asignaturas.data} />
		</>
	);
}
