import { columns } from "./columns";
import { DataTable } from "./data-table";

export default function RequisitoTable({ mallas }) {
	return (
		<section>
			<DataTable columns={columns} data={mallas} />
		</section>
	);
}
