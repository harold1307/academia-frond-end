import { APIserver } from "@/core/api-server";
import CentroInformacionTable, {
	DeleteCentroInformacion,
	UpdateCentroInformacion,
} from ".";

export default async function CentroInformacionTableServer() {
	const centrosInformacion = await APIserver.centrosInformacion.getMany();

	return (
		<>
			<CentroInformacionTable
				centrosInformacion={centrosInformacion.data.map(c => ({
					...c,
					activo: c.estado,
				}))}
			/>
			<UpdateCentroInformacion centrosInformacion={centrosInformacion.data} />
			<DeleteCentroInformacion centrosInformacion={centrosInformacion.data} />
		</>
	);
}
