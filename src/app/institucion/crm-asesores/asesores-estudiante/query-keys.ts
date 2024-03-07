export const ASESORES_ESTUDIANTE_KEYS = {
	all: ["asesoresEstudiante"] as const,
	lists: () => [...ASESORES_ESTUDIANTE_KEYS.all, "list"] as const,
	list: (filters: string) =>
		[...ASESORES_ESTUDIANTE_KEYS.lists(), { filters }] as const,
	details: () => [...ASESORES_ESTUDIANTE_KEYS.all, "detail"] as const,
	detail: (id: number) => [...ASESORES_ESTUDIANTE_KEYS.details(), id] as const,
};
