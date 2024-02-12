import { createColumnHelper } from "@tanstack/react-table";

import BaseTableActions from "@/app/_components/table-actions";
import StatusButtonTooltip from "@/app/_components/table/status-button-tooltip";
import { useMutateSearchParams } from "@/hooks/use-mutate-search-params";
import { sesionesParams } from "../add-sesion";
import { formatDateToTurnoTime } from "../../turnos/table/columns";

export type SesionTableItem = {
	id: string;
	nombre: string;
	alias: string;
	sede: string;
	lunes: boolean;
	martes: boolean;
	miercoles: boolean;
	jueves: boolean;
	viernes: boolean;
	sabado: boolean;
	domingo: boolean;

	comienza?: Date | undefined;
	termina?: Date | undefined;
	turnosActivos: number;
	enUso: boolean;
	activo: boolean;
};

const helper = createColumnHelper<SesionTableItem>();

export const columns = [
	helper.accessor("id", {}),
	helper.accessor("nombre", {
		header: "Nombre",
	}),
	helper.accessor("alias", {
		header: "Alias",
	}),
	helper.accessor("sede", {
		header: "Sede",
	}),
	helper.accessor("lunes", {
		header: "Lunes",
		cell: ({ getValue, column }) => (
			<StatusButtonTooltip
				status={getValue()}
				hoverTitle={column.columnDef.header as string}
			/>
		),
	}),
	helper.accessor("martes", {
		header: "Martes",
		cell: ({ getValue, column }) => (
			<StatusButtonTooltip
				status={getValue()}
				hoverTitle={column.columnDef.header as string}
			/>
		),
	}),
	helper.accessor("miercoles", {
		header: "Miercoles",
		cell: ({ getValue, column }) => (
			<StatusButtonTooltip
				status={getValue()}
				hoverTitle={column.columnDef.header as string}
			/>
		),
	}),
	helper.accessor("jueves", {
		header: "Jueves",
		cell: ({ getValue, column }) => (
			<StatusButtonTooltip
				status={getValue()}
				hoverTitle={column.columnDef.header as string}
			/>
		),
	}),
	helper.accessor("viernes", {
		header: "Viernes",
		cell: ({ getValue, column }) => (
			<StatusButtonTooltip
				status={getValue()}
				hoverTitle={column.columnDef.header as string}
			/>
		),
	}),
	helper.accessor("sabado", {
		header: "Sabado",
		cell: ({ getValue, column }) => (
			<StatusButtonTooltip
				status={getValue()}
				hoverTitle={column.columnDef.header as string}
			/>
		),
	}),
	helper.accessor("domingo", {
		header: "Domingo",
		cell: ({ getValue, column }) => (
			<StatusButtonTooltip
				status={getValue()}
				hoverTitle={column.columnDef.header as string}
			/>
		),
	}),
	helper.accessor("comienza", {
		header: "Comienza",
		cell: ({ getValue }) => {
			const date = getValue();
			return date ? formatDateToTurnoTime(date) : "00:00";
		},
	}),
	helper.accessor("termina", {
		header: "Termina",
		cell: ({ getValue }) => {
			const date = getValue();
			return date ? formatDateToTurnoTime(date) : "00:00";
		},
	}),
	helper.accessor("turnosActivos", {
		header: "Turnos activos",
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
							onClick: () => replaceSet(sesionesParams.update, id),
						},
					}}
					deleteOptions={{
						buttonProps: {
							onClick: () => replaceSet(sesionesParams.delete, id),
						},
						show: !enUso,
					}}
				/>
			);
		},
	}),
];
