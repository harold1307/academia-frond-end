export const SEDE_KEYS = {
	all: ["institucion"] as const,
	lists: () => [...SEDE_KEYS.all, "list"] as const,
	list: (filters: string) => [...SEDE_KEYS.lists(), { filters }] as const,
	details: () => [...SEDE_KEYS.all, "detail"] as const,
	detail: (id: number) => [...SEDE_KEYS.details(), id] as const,
};
