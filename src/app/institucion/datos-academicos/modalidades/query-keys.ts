export const MODALIDAD_KEYS = {
	all: ["modalidad"] as const,
	lists: () => [...MODALIDAD_KEYS.all, "list"] as const,
	list: (filters: string) => [...MODALIDAD_KEYS.lists(), { filters }] as const,
	details: () => [...MODALIDAD_KEYS.all, "detail"] as const,
	detail: (id: number) => [...MODALIDAD_KEYS.details(), id] as const,
};
