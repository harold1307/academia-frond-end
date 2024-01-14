import { createColumnHelper } from "@tanstack/react-table";

export type AsignaturaEnVarianteCursoTableItem = {
	id: string;
	nombre: string;
	horas: number;
	creditos: number;
	asistencia: number;
	califica: boolean;
	notaMaxima: number;
	notaAprobar: number;
	requerida: boolean;
	sumaHoras: boolean;
};

const helper = createColumnHelper<AsignaturaEnVarianteCursoTableItem>();

export const columns = [
	helper.accessor("id", {}),
	helper.accessor("nombre", {
		header: "Asignatura / Modelo",
	}),
	helper.accessor("horas", {
		header: "Horas",
	}),
	helper.accessor("creditos", {
		header: "Creditos",
	}),
	helper.accessor("asistencia", {
		header: "Asistencia",
	}),
	helper.accessor("califica", {
		header: "Califica",
	}),
	helper.accessor("notaMaxima", {
		header: "Nota maxima",
	}),
	helper.accessor("notaAprobar", {
		header: "Nota aprobar",
	}),
	helper.accessor("requerida", {
		header: "Requerida",
	}),
	helper.accessor("sumaHoras", {
		header: "Suma Horas",
	}),
];
