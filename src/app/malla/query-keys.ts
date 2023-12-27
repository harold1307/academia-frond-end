export const MALLA_KEYS = {
	all: ["malla"] as const,
	lists: () => [...MALLA_KEYS.all, "list"] as const,
	list: (filters: string) => [...MALLA_KEYS.lists(), { filters }] as const,
	details: () => [...MALLA_KEYS.all, "detail"] as const,
	detail: (id: number) => [...MALLA_KEYS.details(), id] as const,
};
