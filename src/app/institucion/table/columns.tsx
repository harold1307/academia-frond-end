import { createColumnHelper } from "@tanstack/react-table";

import BaseTableActions from "@/app/_components/table-actions";
import type { SedeFromAPI } from "@/core/api/sede";
import { useMutateSearchParams } from "@/hooks/use-mutate-search-params";
import { sedeParams } from "../add-sede";
import StatusButtonTooltip from "@/app/_components/table/status-button-tooltip";

export type SedeTableItem = Omit<SedeFromAPI, "createdAt"> & {
	enUso: boolean;
};

const columnHelper = createColumnHelper<SedeTableItem>();

export const columns = [
	columnHelper.accessor("id", {}),
	columnHelper.accessor("nombre", {
		header: "Nombre",
	}),
	// columnHelper.accessor("tipo", {
	// 	header: "Tipo",
	// }),
	columnHelper.accessor("pais", {
		header: "Pais",
	}),
	columnHelper.accessor("provincia", {
		header: "Provincia",
	}),
	columnHelper.accessor("canton", {
		header: "Canton",
	}),
	columnHelper.accessor("alias", {
		header: "Alias",
	}),
	// TODO: esto debe ser dependiendo si la sede esta en uso - como una sede esta en uso??
	columnHelper.accessor("enUso", {
		header: "En uso",
		cell: ({ getValue, column }) => (
			<StatusButtonTooltip
				status={getValue()}
				hoverTitle={column.columnDef.header as string}
			/>
		),
	}),
	columnHelper.display({
		id: "actions",
		cell: function Actions({ row }) {
			const { replaceSet } = useMutateSearchParams();
			const id = row.getValue("id") as string;
			const enUso = row.getValue("enUso") as boolean;

			return (
				<BaseTableActions
					updateOptions={{
						buttonProps: {
							onClick: () => replaceSet(sedeParams.update, id),
						},
					}}
					deleteOptions={{
						buttonProps: {
							onClick: () => replaceSet(sedeParams.delete, id),
						},
						show: !enUso,
					}}
				/>
			);
		},
	}),
];
