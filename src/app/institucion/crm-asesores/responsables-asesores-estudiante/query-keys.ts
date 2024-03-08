export const RESPONSABLES_ASESORES_ESTUDIANTE_KEYS = {
	all: ["responsablesAsesoresEstudiante"] as const,
	lists: () => [...RESPONSABLES_ASESORES_ESTUDIANTE_KEYS.all, "list"] as const,
	list: (filters: string) =>
		[...RESPONSABLES_ASESORES_ESTUDIANTE_KEYS.lists(), { filters }] as const,
	details: () =>
		[...RESPONSABLES_ASESORES_ESTUDIANTE_KEYS.all, "detail"] as const,
	detail: (id: number) =>
		[...RESPONSABLES_ASESORES_ESTUDIANTE_KEYS.details(), id] as const,
};
