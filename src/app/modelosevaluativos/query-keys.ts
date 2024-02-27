export const MODELOS_EVALUATIVOS_KEYS = {
	all: ["modelos_evaluativos"] as const,
	lists: () => [...MODELOS_EVALUATIVOS_KEYS.all, "list"] as const,
	list: (filters: string) =>
		[...MODELOS_EVALUATIVOS_KEYS.lists(), { filters }] as const,
	details: () => [...MODELOS_EVALUATIVOS_KEYS.all, "detail"] as const,
	detail: (id: number) => [...MODELOS_EVALUATIVOS_KEYS.details(), id] as const,
};
