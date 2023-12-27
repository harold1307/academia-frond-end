export const ASIGNATURA_KEYS = {
	all: ["asignatura"] as const,
	lists: () => [...ASIGNATURA_KEYS.all, "list"] as const,
	list: (filters: string) => [...ASIGNATURA_KEYS.lists(), { filters }] as const,
	details: () => [...ASIGNATURA_KEYS.all, "detail"] as const,
	detail: (id: number) => [...ASIGNATURA_KEYS.details(), id] as const,
};
