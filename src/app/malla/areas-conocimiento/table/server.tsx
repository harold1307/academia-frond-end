import { APIserver } from "@/core/api-server";
import AreasConocimientoTable, {
	DeleteAreaConocimiento,
	UpdateAreaConocimiento,
} from ".";

export default async function AreasConocimientoTableServer() {
	const areas = await APIserver.areasConocimiento.getMany();

	return (
		<>
			<AreasConocimientoTable areasConocimiento={areas.data} />
			<UpdateAreaConocimiento areasConocimiento={areas.data} />
			<DeleteAreaConocimiento areasConocimiento={areas.data} />
		</>
	);
}
