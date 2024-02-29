"use client";
import { createColumnHelper } from "@tanstack/react-table";

// import BaseTableActions from "@/app/_components/table-actions";
// import { useMutateSearchParams } from "@/hooks/use-mutate-search-params";
// import { lugaresEjecucionParams } from ".";

export type SedeTableItem = {
	id: string;
	sede: string;
	codigo: string;
	inscritos: number;
	egresados: number;
	graduados: number;
};

const helper = createColumnHelper<SedeTableItem>();

export const columns = [
	helper.accessor("id", {}),
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
	// helper.display({
	// 	id: "actions",
	// 	cell: function Actions({ row }) {
	// 		const { replaceSet } = useMutateSearchParams();
	// 		const enUso = row.getValue("enUso") as boolean;
	// 		const id = row.getValue("id") as string;

	// 		return (
	// 			<BaseTableActions
	// 				updateOptions={{
	// 					buttonProps: {
	// 						onClick: () => {
	// 							replaceSet(lugaresEjecucionParams.update, id);
	// 						},
	// 					},
	// 				}}
	// 				deleteOptions={{
	// 					show: !enUso,
	// 					buttonProps: {
	// 						onClick: () => {
	// 							replaceSet(lugaresEjecucionParams.delete, id);
	// 						},
	// 					},
	// 				}}
	// 			/>
	// 		);
	// 	},
	// }),
];
