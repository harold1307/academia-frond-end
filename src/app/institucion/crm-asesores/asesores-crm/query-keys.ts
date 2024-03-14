export const ASESORES_CRM_KEYS = {
	all: ["asesoresCrm"] as const,
	lists: () => [...ASESORES_CRM_KEYS.all, "list"] as const,
	list: (filters: string) =>
		[...ASESORES_CRM_KEYS.lists(), { filters }] as const,
	details: () => [...ASESORES_CRM_KEYS.all, "detail"] as const,
	detail: (id: number) => [...ASESORES_CRM_KEYS.details(), id] as const,
};
