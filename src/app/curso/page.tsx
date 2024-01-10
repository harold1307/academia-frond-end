import { fontPlay } from "../_components/ui/fonts";
import LupaIcon from "../_components/ui/icons/lupa";
import { Input } from "../_components/ui/input";
import AddCurso from "./add-curso";
import CursoTable from "./table";

export default function CursoPage() {
	return (
		<>
			<div className='flex flex-col gap-4 justify-center align-center'>
				<h1 className={` ${fontPlay.className} antialiased w-100 text-center text-4xl`}>Configuración de Cursos</h1>
				<div className='pl-6 pr-6 flex items-center justify-between'>
					<AddCurso />
					<div className='w-3/12 h-12 relative flex items-center'>
						<Input className='h-100 rounded-xl'
						 style={{
							boxShadow: '0 0 25px rgba(67, 84, 234, .7)'
						}} />
						<div className='absolute right-3 h-5 flex justicy-center items-center' >
							<LupaIcon/>
						</div>
					</div>
					{/* searchBar */}
				</div>
				<CursoTable />
			</div>
		</>
	);
}
