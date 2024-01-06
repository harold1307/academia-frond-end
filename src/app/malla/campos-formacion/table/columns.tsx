import { createColumnHelper } from "@tanstack/react-table";

export type CamposFormacionTableItem = {
	id: string;
	nombre: string;
	enUso: boolean;
};

const helper = createColumnHelper<CamposFormacionTableItem>();

export const columns = [
	helper.accessor("id", {}),
	helper.accessor("nombre", {
		header: "Nombre",
	}),
	helper.accessor("enUso", {
		header: "En uso",
		cell: ({ getValue }) => (getValue() ? "SI" : "NO"),
	}),
	helper.display({
		id: "actions",
	}),
];
