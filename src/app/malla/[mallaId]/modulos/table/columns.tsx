"use client";
import { createColumnHelper } from "@tanstack/react-table";


export type ModuloTableItem = {
	id: string;
	nombre: string;
	horas: number;
	horasAsistidas: number;
	horasColaborativas: number;
	horasPracticas: number;
	horasAutonomas: number;
	creditos: number;
	matriculacion: boolean;
	costo: boolean;
	requeridaEgreso: boolean;
	validaCreditos: boolean;
	validaPromedio: boolean;
};

const helper = createColumnHelper<ModuloTableItem>();

export const columns = [
	helper.accessor("id", {}),
	helper.accessor("nombre", {
		header: "Modulo",
	}),
	helper.accessor("horas", {
		header: "Horas",
	}),
	helper.accessor("horasAsistidas", {
		header: "Horas asistidas",
	}),
	helper.accessor("horasColaborativas", {
		header: "Horas colaborativas",
	}),
	helper.accessor("horasPracticas", {
		header: "Horas practicas",
	}),
	helper.accessor("horasAutonomas", {
		header: "Horas autonomas",
	}),
	helper.accessor("creditos", {
		header: "Creditos",
	}),
	helper.accessor("matriculacion", {
		header: "Matriculacion",
		cell: ({ getValue }) => (getValue() ? "SI" : "NO"),
	}),
	helper.accessor("costo", {
		header: "Costo",
		cell: ({ getValue }) => (getValue() ? "SI" : "NO"),
	}),
	helper.accessor("requeridaEgreso", {
		header: "Obl. graduar",
		cell: ({ getValue }) => (getValue() ? "SI" : "NO"),
	}),
	helper.accessor("validaCreditos", {
		header: "Valida creditos",
		cell: ({ getValue }) => (getValue() ? "SI" : "NO"),
	}),
	helper.accessor("validaPromedio", {
		header: "Valida promedio",
		cell: ({ getValue }) => (getValue() ? "SI" : "NO"),
	}),
	// helper.display({
	// 	id: "actions",
	// 	cell: function Actions({ row }) {
	// 		const { replaceSet } = useMutateSearchParams();
	// 		const id = row.getValue("id") as string;

	// 		return (
	// 			<BaseTableActions
	// 				updateOptions={{
	// 					show: false,
	// 					buttonProps: {
	// 						onClick: () => {
	// 							// replaceSet(coordinacionesParams.update, id);
	// 						},
	// 					},
	// 				}}
	// 				deleteOptions={{
	// 					show: true,
	// 					buttonProps: {
	// 						onClick: () => {
	// 							replaceSet(mallaModulosParams.delete, id);
	// 						},
	// 					},
	// 				}}
	// 			/>
	// 		);
	// 	},
	// }),
];
