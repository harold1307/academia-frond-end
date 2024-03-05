export const ROUTES = {
	home: "/",
	institucion: "/institucion",
	malla: {
		path: "/malla",
		asignaturasEnMalla: (mallaId: string) =>
			ROUTES.malla.path + `/${mallaId}/asignaturas`,
		lugaresEjecucion: (mallaId: string) =>
			ROUTES.malla.path + `/${mallaId}/sedes`,
		modulos: (mallaId: string) => ROUTES.malla.path + `/${mallaId}/modulos`,
	},
	asignatura: "/asignatura",
	curso: {
		path: "/curso",
		variantes: (cursoId: string) => ROUTES.curso.path + `/${cursoId}/variantes`,
		programas: (varianteId: string) => `/${varianteId}/programas`,
		materias: (varianteId: string) => `/${varianteId}/materias`,
		costos: (varianteId: string) => `/${varianteId}/costos`,
		asignaturasVariantes: (cursoId: string, varianteCursoId: string) =>
			ROUTES.curso.path +
			`/${cursoId}/variantes/${varianteCursoId}/asignaturas`,
	},
	modelosEvaluativos: {
		path: "/modelosevaluativos",
		modeloCampos: (modeloEvaluativoId: string) =>
			`/${modeloEvaluativoId}/campos`,
		modelologica: (modeloEvaluativoId: string) =>
			`/${modeloEvaluativoId}/logica`,
	},
	proHorarios: {
		path: "/pro_horarios",
		detalleHorario: (horarioId: string) =>
			ROUTES.proHorarios.path + `/${horarioId}`,
	},
	admHorarios: {
		path: "/adm_horarios",
		detalleHorario: (horarioId: string) =>
			ROUTES.admHorarios.path + `/${horarioId}`,
	},
	periodoEvaluacion: {
		path: "/periodosevaluacion",
		materias: (sectionId: string) =>
			ROUTES.periodoEvaluacion.path + `?section=${sectionId}/cronograma`,
	},
	talentoHumano: {
		path: "/talentohumano",
		modeloCampos: (modeloDeContratoId: string) =>
			`/${modeloDeContratoId}/campos`,
		estudiantes: (asesorId: string) =>
			`/${asesorId}/estudiantes`,
		plazas: (departamentosId: string) =>
			`/${departamentosId}/plazas`
	}
} as const;
