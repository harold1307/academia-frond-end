import type { TipoUbicacion } from "@prisma/client";

import BaseTableActions from "@/app/_components/table-actions";
import StatusButtonTooltip from "@/app/_components/table/status-button-tooltip";
import { useMutateSearchParams } from "@/hooks/use-mutate-search-params";
import { createColumnHelper } from "@tanstack/react-table";
import { ubicacionesParams } from "../add-ubicacion";

export type UbicacionTableItem = {
	id: string;
	nombre: string;
	tipo: TipoUbicacion;
	capacidad: number;
	virtual: boolean;
	enUso: boolean;
	activo: boolean;
};

const helper = createColumnHelper<UbicacionTableItem>();

export const columns = [
	helper.accessor("id", {}),
	helper.accessor("nombre", {
		header: "Nombre",
	}),
	helper.accessor("tipo", {
		header: "Tipo",
	}),
	helper.accessor("capacidad", {
		header: "Capacidad",
	}),
	helper.accessor("virtual", {
		header: "Virtual",
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
	helper.accessor("activo", {
		header: "Activo",
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
							onClick: () => replaceSet(ubicacionesParams.update, id),
						},
					}}
					deleteOptions={{
						buttonProps: {
							onClick: () => replaceSet(ubicacionesParams.delete, id),
						},
						show: !enUso,
					}}
				/>
			);
		},
	}),
];
