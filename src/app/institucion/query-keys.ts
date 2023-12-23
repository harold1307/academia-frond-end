export const INSTITUCION_KEYS = {
	all: ["institucion"] as const,
	lists: () => [...INSTITUCION_KEYS.all, "list"] as const,
	list: (filters: string) =>
		[...INSTITUCION_KEYS.lists(), { filters }] as const,
	details: () => [...INSTITUCION_KEYS.all, "detail"] as const,
	detail: (id: number) => [...INSTITUCION_KEYS.details(), id] as const,
};
