export const CURSO_KEYS = {
	all: ["curso"] as const,
	lists: () => [...CURSO_KEYS.all, "list"] as const,
	list: (filters: string) => [...CURSO_KEYS.lists(), { filters }] as const,
	details: () => [...CURSO_KEYS.all, "detail"] as const,
	detail: (id: number) => [...CURSO_KEYS.details(), id] as const,
};
