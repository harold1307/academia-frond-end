import { createColumnHelper } from "@tanstack/react-table";

export type AreaConocimientoTableItem = {
	id: string;
	nombre: string;
	codigo: string | null;
	enUso: boolean;
};

const helper = createColumnHelper<AreaConocimientoTableItem>();

export const columns = [
	helper.accessor("id", {}),
	helper.accessor("nombre", {
		header: "Nombre",
	}),
	helper.accessor("codigo", {
		header: "Codigo",
	}),
	helper.accessor("enUso", {
		header: "En uso",
		cell: ({ getValue }) => (getValue() ? "SI" : "NO"),
	}),
];
