export const CURSO_ESCUELA_KEYS = {
	all: ["curso_escuela"] as const,
	lists: () => [...CURSO_ESCUELA_KEYS.all, "list"] as const,
	list: (filters: string) =>
		[...CURSO_ESCUELA_KEYS.lists(), { filters }] as const,
	details: () => [...CURSO_ESCUELA_KEYS.all, "detail"] as const,
	detail: (id: number) => [...CURSO_ESCUELA_KEYS.details(), id] as const,
};
