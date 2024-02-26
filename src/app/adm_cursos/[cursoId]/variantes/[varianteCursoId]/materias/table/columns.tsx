"use client";
import { createColumnHelper } from "@tanstack/react-table";

import BaseTableActions from "@/app/_components/table-actions";
import StatusButtonTooltip from "@/app/_components/table/status-button-tooltip";
import { useMutateSearchParams } from "@/hooks/use-mutate-search-params";

export type MateriaTableItem = {
	id: string;
	asignaturaModelo: string;
	horas: number;
	creditos: number;
	asistenciaAprobar: number;
	calificar: boolean;
	notaMaxima: number;
	notaParaAprobar: number;
	requeridaAprobar: boolean;
	sumaHoras: boolean;

	varianteEstado: boolean;
};

const helper = createColumnHelper<MateriaTableItem>();

export const materiasColumns = [
	helper.accessor("id", {}),
	helper.accessor("varianteEstado", {}),
	helper.accessor("asignaturaModelo", {
		header: "Asignatura / Modelo",
	}),
	helper.accessor("horas", {
		header: "Horas",
	}),
	helper.accessor("creditos", {
		header: "Créditos",
	}),
	helper.accessor("asistenciaAprobar", {
		header: "Asistencia",
	}),
	helper.accessor("calificar", {
		header: "Califica",
		cell: ({ getValue, column }) => (
			<StatusButtonTooltip
				status={getValue()}
				hoverTitle={column.columnDef.header as string}
			/>
		),
	}),
	helper.accessor("notaMaxima", {
		header: "Nota Máxima",
	}),
	helper.accessor("notaParaAprobar", {
		header: "Nota Aprobar",
	}),
	helper.accessor("requeridaAprobar", {
		header: "Requerida",
		cell: ({ getValue, column }) => (
			<StatusButtonTooltip
				status={getValue()}
				hoverTitle={column.columnDef.header as string}
			/>
		),
	}),
	helper.accessor("sumaHoras", {
		header: "Suma Horas",
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

			const estado = row.getValue("varianteEstado") as boolean;
			const id = row.getValue("id") as string;

			return (
				<BaseTableActions
					updateOptions={{
						buttonProps: {
							onClick: () => replaceSet(materiasParams.update, id),
						},
						show: !estado,
					}}
					deleteOptions={{
						buttonProps: {
							onClick: () => replaceSet(materiasParams.deactivate, id),
						},
						show: !estado,
					}}
				/>
			);
		},
	}),
];

export const materiasParams = {
	update: "actualizarMateria",
	deactivate: "desactivarMateria",
};
