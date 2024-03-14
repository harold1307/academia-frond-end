export const RESPONSABLES_CRM_KEYS = {
	all: ["responsablesCrm"] as const,
	lists: () => [...RESPONSABLES_CRM_KEYS.all, "list"] as const,
	list: (filters: string) =>
		[...RESPONSABLES_CRM_KEYS.lists(), { filters }] as const,
	details: () => [...RESPONSABLES_CRM_KEYS.all, "detail"] as const,
	detail: (id: number) => [...RESPONSABLES_CRM_KEYS.details(), id] as const,
};
