import { columns } from "./colums";
import { DataTable } from "./data-table";

export default function TraduccionTable({ mallas }) {
	return (
		<section>
			<h1 className='text-2xl font-semibold mb-5'>Traducción</h1>
			<DataTable columns={columns} data={mallas} />
		</section>
	);
}
