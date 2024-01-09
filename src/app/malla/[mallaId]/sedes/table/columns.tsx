import { createColumnHelper } from "@tanstack/react-table";

export type SedeTableItem = {
	sede: string;
	codigo: string;
	inscritos: number;
	egresados: number;
	graduados: number;
};

const helper = createColumnHelper<SedeTableItem>();

export const columns = [
	helper.accessor("sede", {
		header: "Sede",
	}),
	helper.accessor("codigo", {
		header: "Codigo",
	}),
	helper.accessor("inscritos", {
		header: "Inscritos",
	}),
	helper.accessor("egresados", {
		header: "Egresados",
	}),
	helper.accessor("graduados", {
		header: "Graduados",
	}),
];
