export const CENTROS_INFORMACION_KEYS = {
	all: ["centrosInformacion"] as const,
	lists: () => [...CENTROS_INFORMACION_KEYS.all, "list"] as const,
	list: (filters: string) =>
		[...CENTROS_INFORMACION_KEYS.lists(), { filters }] as const,
	details: () => [...CENTROS_INFORMACION_KEYS.all, "detail"] as const,
	detail: (id: number) => [...CENTROS_INFORMACION_KEYS.details(), id] as const,
};
