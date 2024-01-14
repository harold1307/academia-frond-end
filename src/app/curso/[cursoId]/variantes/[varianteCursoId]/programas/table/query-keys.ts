export const PROGRAMAS_KEYS = {
	all: ["programas"] as const,
	lists: () => [...PROGRAMAS_KEYS.all, "list"] as const,
	list: (filters: string) => [...PROGRAMAS_KEYS.lists(), { filters }] as const,
	details: () => [...PROGRAMAS_KEYS.all, "detail"] as const,
	detail: (id: number) => [...PROGRAMAS_KEYS.details(), id] as const,
};