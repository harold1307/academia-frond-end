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
		path: '/modelosevaluativos',
		modeloCampos: (modeloEvaluativoId:string) => `/${modeloEvaluativoId}/campos`,
		modelologica: (modeloEvaluativoId:string) => `/${modeloEvaluativoId}/logica`
	},
	proHorarios : {
		path: '/horarios',
		detalleHorario: (horarioId:string) => ROUTES.proHorarios.path + `/${horarioId}`
	}
} as const;
