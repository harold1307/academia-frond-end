import { createColumnHelper } from "@tanstack/react-table";

export type CamposModelosEvaluativosTableItem = {
	orden: number;
	campo: string;
	alternativasDeEvaluacion: string;
	notaMinima: number;
	notaMaxima: number;
	decimales: number;
	dependiente: boolean;
	maximos: boolean;
	impresion: boolean;
};

const helper = createColumnHelper<CamposModelosEvaluativosTableItem>();

export const camposModelosEvaluativosColumns = [
	helper.accessor("orden", {
		header: "Orden",
	}),
	helper.accessor("campo", {
		header: "Campo",
	}),
	helper.accessor("alternativasDeEvaluacion", {
		header: "Alternativas de Evaluación",
	}),
	helper.accessor("notaMinima", {
		header: "Nota Mínima",
	}),
	helper.accessor("notaMaxima", {
		header: "Nota Máxima",
	}),
	helper.accessor("decimales", {
		header: "Decimales",
	}),
	helper.accessor("dependiente", {
		header: "Dependiente",
		cell: ({ getValue }) => (getValue() ? "SI" : "NO"),
	}),
	helper.accessor("maximos", {
		header: "Máximos",
		cell: ({ getValue }) => (getValue() ? "SI" : "NO"),
	}),
	helper.accessor("impresion", {
		header: "Impresión",
		cell: ({ getValue }) => (getValue() ? "SI" : "NO"),
	}),
];
