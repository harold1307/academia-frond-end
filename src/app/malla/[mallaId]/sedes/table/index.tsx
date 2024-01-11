import { columns, type SedeTableItem } from "./columns";
import { DataTable } from "./data-table";

export default function SedeTable({
	lugaresEjecucion,
}: {
	lugaresEjecucion: SedeTableItem[];
}) {
	return (
		<section>
			<h1 className='text-2xl font-semibold'>Tabla</h1>
			<DataTable columns={columns} data={lugaresEjecucion} />
		</section>
	);
}
