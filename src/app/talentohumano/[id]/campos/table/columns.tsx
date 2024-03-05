import { createColumnHelper } from "@tanstack/react-table";

export type CamposModelosDeContratosTableItem = {
	nombredescripcion: string;
	codigo: string;
	tipo: string;
};

const helper = createColumnHelper<CamposModelosDeContratosTableItem>();

export const camposModelosDeContratosColumns = [
	helper.accessor("nombredescripcion", {
		header: "Nombre/Descripción",
	}),
	helper.accessor("codigo", {
		header: "Código",
	}),
	helper.accessor("tipo", {
		header: "Tipo",
	}),
];
