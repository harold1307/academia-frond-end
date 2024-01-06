import { createColumnHelper } from "@tanstack/react-table";

export type EjeFormativoTableItem = {
	id: string;
	nombre: string;
	enUso: boolean;
};

const helper = createColumnHelper<EjeFormativoTableItem>();

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
