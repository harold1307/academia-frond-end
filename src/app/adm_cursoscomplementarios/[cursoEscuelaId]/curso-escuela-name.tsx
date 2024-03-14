import type { CursoEscuelaFromAPI } from "@/core/api/curso-escuelas";

export default async function CursoEscuelaName({
	cursoEscuela,
}: {
	cursoEscuela: CursoEscuelaFromAPI;
}) {
	const cursoEscuelaName = cursoEscuela.nombre;

	return <h2 className='text-lg font-medium'>Curso: {cursoEscuelaName}</h2>;
}
