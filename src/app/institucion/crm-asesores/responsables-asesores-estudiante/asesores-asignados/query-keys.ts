export const ASESORES_ASIGNADOS_KEYS = {
	all: ["asesoresAsignados"] as const,
	lists: () => [...ASESORES_ASIGNADOS_KEYS.all, "list"] as const,
	list: (filters: string) =>
		[...ASESORES_ASIGNADOS_KEYS.lists(), { filters }] as const,
	details: () => [...ASESORES_ASIGNADOS_KEYS.all, "detail"] as const,
	detail: (id: number) => [...ASESORES_ASIGNADOS_KEYS.details(), id] as const,
};
