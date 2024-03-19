import { createColumnHelper } from "@tanstack/react-table";

import BaseTableActions from "@/app/_components/table-actions";
import StatusButtonTooltip from "@/app/_components/table/status-button-tooltip";
import { formatDate } from "@/utils";

export type AperturaIngresoNotasTableItem = {
	id: string;
	profesorMateria: {
		profesor: string;
		materia: string;
	};
	motivo: string | null;
	campo: string;

	solicitud: string;
	aprobado: string;
	limite: string;

	estado: string;
	tipo: string;
	cerrada: boolean;
};

const helper = createColumnHelper<AperturaIngresoNotasTableItem>();

export const columns = [
	helper.accessor("id", {}),
	helper.accessor("profesorMateria", {
		header: "Profesor/Materia",
		cell: ({ getValue }) => {
			const { profesor, materia } = getValue();
			return `${profesor} - ${materia}`;
		},
	}),
	helper.accessor("motivo", {
		header: "Motivo",
	}),
	helper.accessor("campo", {
		header: "Campo",
	}),
	helper.accessor("solicitud", {
		header: "Solicitud",
		cell: ({ getValue }) =>
			formatDate(getValue(), {
				day: "2-digit",
				month: "2-digit",
				year: "numeric",
			}),
	}),
	helper.accessor("aprobado", {
		header: "Aprobado",
		cell: ({ getValue }) =>
			formatDate(getValue(), {
				day: "2-digit",
				month: "2-digit",
				year: "numeric",
			}),
	}),
	helper.accessor("limite", {
		header: "Límite",
		cell: ({ getValue }) =>
			formatDate(getValue(), {
				day: "2-digit",
				month: "2-digit",
				year: "numeric",
			}),
	}),
	helper.accessor("estado", {
		header: "Estado",
	}),
	helper.accessor("tipo", {
		header: "Tipo",
	}),
	helper.accessor("cerrada", {
		header: "Cerrada",
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
			// const { replaceSet } = useMutateSearchParams();

			const id = row.getValue("id") as string;
			// const cursoEscuelaEstado = row.getValue("cursoEscuelaEstado") as boolean;
			const cursoEscuelaEstado = true;

			return (
				<BaseTableActions
					updateOptions={{
						// buttonProps: {
						// 	onClick: () =>
						// 		replaceSet(programasEnCursoEscuelaParams.update, id),
						// },
						show: cursoEscuelaEstado,
					}}
					deleteOptions={{
						// buttonProps: {
						// 	onClick: () =>
						// 		replaceSet(programasEnCursoEscuelaParams.delete, id),
						// },
						show: cursoEscuelaEstado,
					}}
				/>
			);
		},
	}),
];
