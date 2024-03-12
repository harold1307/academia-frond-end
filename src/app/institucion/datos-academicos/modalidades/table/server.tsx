import { APIserver } from "@/core/api-server";
import ModalidadTable, { DeleteModalidad, UpdateModalidad } from ".";

export default async function ModalidadTableServer() {
	const modalidades = await APIserver.modalidades.getMany();

	return (
		<>
			<ModalidadTable modalidades={modalidades.data} />
			<UpdateModalidad modalidades={modalidades.data} />
			<DeleteModalidad modalidades={modalidades.data} />
		</>
	);
}
