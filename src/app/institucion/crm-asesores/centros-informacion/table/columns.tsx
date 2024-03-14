import { createColumnHelper } from "@tanstack/react-table";

import BaseTableActions from "@/app/_components/table-actions";
import StatusButtonTooltip from "@/app/_components/table/status-button-tooltip";
import { useMutateSearchParams } from "@/hooks/use-mutate-search-params";
import { centrosInformacionParams } from "../add-centro-informacion";

export type CentroInformacionTableItem = {
	id: string;
	nombre: string;
	activo: boolean;
	enUso: boolean;
};

const helper = createColumnHelper<CentroInformacionTableItem>();

export const columns = [
	helper.accessor("id", {}),
	helper.accessor("nombre", {
		header: "Nombre",
	}),
	helper.accessor("activo", {
		header: "Activo",
		cell: ({ getValue, column }) => (
			<StatusButtonTooltip
				status={getValue()}
				hoverTitle={column.columnDef.header as string}
			/>
		),
	}),
	helper.accessor("enUso", {
		header: "En uso",
		cell: ({ getValue, column }) => (
			<StatusButtonTooltip
				status={getValue()}
				hoverTitle={column.columnDef.header as string}
			/>
		),
	}),
	helper.display({
		id: "actions",
		cell: function Actions({ row }) {
			const { replaceSet } = useMutateSearchParams();
			const id = row.getValue("id") as string;
			const enUso = row.getValue("enUso") as boolean;

			return (
				<BaseTableActions
					updateOptions={{
						buttonProps: {
							onClick: () => replaceSet(centrosInformacionParams.update, id),
						},
						show: !enUso,
					}}
					deleteOptions={{
						buttonProps: {
							onClick: () => replaceSet(centrosInformacionParams.delete, id),
						},
						show: !enUso,
					}}
				/>
			);
		},
	}),
];
