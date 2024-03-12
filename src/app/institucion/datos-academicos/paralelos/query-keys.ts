export const PARALELO_KEYS = {
	all: ["paralelo"] as const,
	lists: () => [...PARALELO_KEYS.all, "list"] as const,
	list: (filters: string) => [...PARALELO_KEYS.lists(), { filters }] as const,
	details: () => [...PARALELO_KEYS.all, "detail"] as const,
	detail: (id: number) => [...PARALELO_KEYS.details(), id] as const,
};
