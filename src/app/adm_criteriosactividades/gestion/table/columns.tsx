import { createColumnHelper } from "@tanstack/react-table";

import StatusButtonTooltip from "@/app/_components/table/status-button-tooltip";

export type CriterioActividadGestionTableItem = {
	id: string;
	criterio: string;
	tiempoDedicacion: string;
	aprobacion: boolean;
};

const helper = createColumnHelper<CriterioActividadGestionTableItem>();

export const columns = [
	helper.accessor("id", {}),
	helper.accessor("criterio", {
		header: "Criterio",
	}),
	helper.accessor("tiempoDedicacion", {
		header: "Tiempo de dedicación",
	}),
	helper.accessor("aprobacion", {
		header: "Aprobación",
		cell: ({ getValue, column }) => (
			<StatusButtonTooltip
				status={getValue()}
				hoverTitle={column.columnDef.header as string}
			/>
		),
	}),
];
