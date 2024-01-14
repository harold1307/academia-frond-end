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
	configCurso: {
		path: "/curso",
		variantes: (cursoId: string) => ROUTES.configCurso.path + `/${cursoId}/variantes`,
		programas: (varianteId: string) => `/${varianteId}/programas`,
		materias: (varianteId: string) => `/${varianteId}/materias`
	},
} as const;
