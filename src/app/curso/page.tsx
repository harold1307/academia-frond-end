import AddCurso from "./add-curso";
import CursoTable from "./table";

export default function CursoPage() {
	return (
		<>
			<div className='flex flex-col gap-4 justify-center align-center'>
				<h1 className='w-100 text-center text-4xl'>Configuración de Cursos</h1>
				<div>
					<AddCurso />
					{/* searchBar */}
				</div>
				<CursoTable />
			</div>
		</>
	);
}
