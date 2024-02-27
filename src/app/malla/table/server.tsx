import { APIserver } from "@/core/api-server";
import MallaCurricularTable from ".";
import type { MallaCurricularTableItem } from "./columns";

export default async function MallaCurricularTableServer({
	programaId,
	programaName,
}: {
	programaId?: string;
	programaName: string;
}) {
	if (!programaId) {
		return <div>Debes seleccionar un programa para ver sus mallas</div>;
	}

	const mallas = await APIserver.mallasCurriculares.getMany({
		programaId,
	});

	const tableData = mallas.data.map(malla => {
		const obj = {
			creditos: 0,
			totalHoras:
				0 +
				(malla.practicaPreProfesional?.horas || 0) +
				(malla.practicaComunitaria?.horas || 0),
			modulos: 0,
			materias: 0,
			horasMaterias: 0,
		};

		malla.niveles.forEach(nivel => {
			nivel.asignaturas.forEach(a => {
				obj.materias += 1;

				obj.creditos += a.creditos;
				obj.totalHoras +=
					a.horasAsistidasDocente +
					a.horasAutonomas +
					a.horasColaborativas +
					a.horasPracticas +
					a.maximaCantidadHorasSemanalas;

				obj.horasMaterias +=
					a.horasAsistidasDocente +
					a.horasAutonomas +
					a.horasColaborativas +
					a.horasPracticas +
					a.maximaCantidadHorasSemanalas;
			});
		});

		return {
			...malla,
			...obj,
			vigencia: {
				fechaAprobacion: new Date(malla.fechaAprobacion),
				fechaLimiteVigencia: new Date(malla.fechaLimiteVigencia),
			},
			esVigente:
				new Date(malla.fechaLimiteVigencia).valueOf() > new Date().valueOf(),
			activa: malla.estado,
			alumnos: 0,
			egresan: false,
			graduan: false,
			horasPracticasComunitarias: malla.practicaComunitaria?.horas || 0,
			horasPracticasPreprofesionales: malla.practicaPreProfesional?.horas || 0,
			niveles: malla.niveles.length,
			horasProyectoIntegrador: 0,
			tituloObtenido: malla.tituloObtenido?.nombre || "",
			nivelacion: false,
			materiasAdelantar: malla.maximoMateriasAdelantar,
			tieneMecanismoTitulacion: false,
			modalidad: malla.modalidad.nombre,
		} satisfies MallaCurricularTableItem;
	});

	return (
		<MallaCurricularTable mallas={tableData} programaName={programaName} />
	);
}
