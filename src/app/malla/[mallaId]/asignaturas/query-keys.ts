export const ASIGNATURA_EN_MALLA_KEYS = {
	all: ["asignaturaEnMalla"] as const,
	lists: () => [...ASIGNATURA_EN_MALLA_KEYS.all, "list"] as const,
	list: (filters: string) =>
		[...ASIGNATURA_EN_MALLA_KEYS.lists(), { filters }] as const,
	details: () => [...ASIGNATURA_EN_MALLA_KEYS.all, "detail"] as const,
	detail: (id: number) => [...ASIGNATURA_EN_MALLA_KEYS.details(), id] as const,
};
