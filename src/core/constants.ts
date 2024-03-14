class ConstantsClass {
	STATIC_GROUPS = {
		ADMINISTRATIVOS: "ADMINISTRATIVOS",
		PROFESORES: "PROFESORES",
		ALUMNOS: "ALUMNOS",
		EMPLEADORES: "EMPLEADORES",
	} as const;
}

export const Constants = new ConstantsClass();
