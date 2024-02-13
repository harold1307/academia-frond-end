import { createColumnHelper } from "@tanstack/react-table";

const helper = createColumnHelper<any>();

export const columns = [
	helper.accessor("id", {}),
	helper.accessor("fecha", {
		header: "Fecha",
	}),
	helper.accessor("hora", {
		header: "Hora",
	}),
	helper.accessor("inscrito", {
		header: "Inscrito",
	}),
	helper.accessor("Ultimo seguimiento", {
		header: "Ultimo seguimiento",
	}),
];
