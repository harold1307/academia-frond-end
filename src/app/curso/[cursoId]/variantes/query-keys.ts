export const VARIANTES_KEYS = {
	all: ["variante"] as const,
	lists: () => [...VARIANTES_KEYS.all, "list"] as const,
	list: (filters: string) => [...VARIANTES_KEYS.lists(), { filters }] as const,
	details: () => [...VARIANTES_KEYS.all, "detail"] as const,
	detail: (id: number) => [...VARIANTES_KEYS.details(), id] as const,
};
