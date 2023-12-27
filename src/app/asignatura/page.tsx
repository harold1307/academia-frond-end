import AddAsignatura from "./add-asignatura";
import AsignaturaTable from "./table";

export default function AsignaturaPage() {
	return (
		<>
			<div className='mt-4'>
				<AddAsignatura />
				<AsignaturaTable />
			</div>
		</>
	);
}
