import AddCurso from "./add-curso";
import CursoTable from "./table";

export default function CursoPage() {
	return (
		<>
			<div className='mt-4'>
				<AddCurso />
				<CursoTable />
			</div>
		</>
	);
}
