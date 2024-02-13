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
	periodo: {
		path: "/periodos",
		cortes: "/periodos?seccion=cortes",
		traduccion: (periodoId: string) =>
			ROUTES.periodo.path + `/${periodoId}/traduccion`,
		cronograma: (periodoId: string) =>
			ROUTES.periodo.path + `/${periodoId}/cronograma`,
		requisito: (periodoId: string) =>
			ROUTES.periodo.path + `/${periodoId}/requisito`,
		subperiodos: (periodoId: string) =>
			ROUTES.periodo.path + `/${periodoId}/subperiodos`,
		matriculas: (periodoId: string) =>
			ROUTES.periodo.path + `/${periodoId}/matriculas`,
	},
	crm: {
		path: "/crm",
		inscritos: '/crm?seccion=inscritos',
		respuestas: "/crm?seccion=respuestas",
		seguimiento: "/crm?seccion=seguimiento",
		documentos: (crmId: string) => ROUTES.crm.path + `/${crmId}/documentos`,
		depositos: (crmId: string) => ROUTES.crm.path + `/${crmId}/depositos`,
	},
} as const;
