import { createColumnHelper } from "@tanstack/react-table";

import BaseTableActions from "@/app/_components/table-actions";
import StatusButtonTooltip from "@/app/_components/table/status-button-tooltip";
import { useMutateSearchParams } from "@/hooks/use-mutate-search-params";
import { NIVELES_PREFIXES } from "@/utils/forms";
import { programasEnCursoEscuelaParams } from "../add-programa";

export type ProgramaEnCursoEscuelaTableItem = {
	id: string;
	programa: string;
	modalidad: string | null;
	nivelDesde: number | null;
	nivelHasta: number | null;
	registro: boolean;

	cursoEscuelaEstado: boolean;
};

const helper = createColumnHelper<ProgramaEnCursoEscuelaTableItem>();

export const columns = [
	helper.accessor("id", {}),
	helper.accessor("cursoEscuelaEstado", {}),
	helper.accessor("programa", {
		header: "Programa",
	}),
	helper.accessor("modalidad", {
		header: "Modalidad",
	}),
	helper.accessor("nivelDesde", {
		header: "Nivel desde",
		cell: ({ getValue }) => {
			const value = getValue();

			return value !== null ? NIVELES_PREFIXES[value - 1] : "";
		},
	}),
	helper.accessor("nivelHasta", {
		header: "Nivel hasta",
		cell: ({ getValue }) => {
			const value = getValue();

			return value !== null ? NIVELES_PREFIXES[value - 1] : "";
		},
	}),
	helper.accessor("registro", {
		header: "Registro",
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
			const cursoEscuelaEstado = row.getValue("cursoEscuelaEstado") as boolean;

			return (
				<BaseTableActions
					updateOptions={{
						buttonProps: {
							onClick: () =>
								replaceSet(programasEnCursoEscuelaParams.update, id),
						},
						show: cursoEscuelaEstado,
					}}
					deleteOptions={{
						buttonProps: {
							onClick: () =>
								replaceSet(programasEnCursoEscuelaParams.delete, id),
						},
						show: cursoEscuelaEstado,
					}}
				/>
			);
		},
	}),
];
