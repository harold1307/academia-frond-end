export const ROUTES = {
	home: "/",
	institucion: "/institucion",
	malla: {
		path: "/malla",
		asignaturasEnMalla: (mallaId: string) =>
			ROUTES.malla.path + `/${mallaId}/asignaturas`,
	},
	asignatura: "/asignatura",
	curso: {
		path: "/curso",
		variantes: (cursoId: string) => ROUTES.curso.path + `/${cursoId}/variantes`,
	},
} as const;
