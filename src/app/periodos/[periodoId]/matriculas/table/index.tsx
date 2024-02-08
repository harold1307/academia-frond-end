import { columns } from "./columns";
import { DataTable } from "./data-table";

export default function MatriculasTable({ mallas }) {
	return (
		<section>
			<h1 className='mb-5 text-2xl font-semibold'>Matriculas no legalizadas</h1>
			<DataTable columns={columns} data={mallas} />
		</section>
	);
}
