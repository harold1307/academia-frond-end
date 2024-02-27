export const PERIODOS_KEYS = {
	all: ["periodos"] as const,
	lists: () => [...PERIODOS_KEYS.all, "list"] as const,
	list: (filters: string) => [...PERIODOS_KEYS.lists(), { filters }] as const,
	details: () => [...PERIODOS_KEYS.all, "detail"] as const,
	detail: (id: number) => [...PERIODOS_KEYS.details(), id] as const,
};
