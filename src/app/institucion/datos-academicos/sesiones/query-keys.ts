export const SESIONES_KEYS = {
	all: ["sesiones"] as const,
	lists: () => [...SESIONES_KEYS.all, "list"] as const,
	list: (filters: string) => [...SESIONES_KEYS.lists(), { filters }] as const,
	details: () => [...SESIONES_KEYS.all, "detail"] as const,
	detail: (id: number) => [...SESIONES_KEYS.details(), id] as const,
};
