import { createColumnHelper } from "@tanstack/react-table";

import BaseTableActions from "@/app/_components/table-actions";
import StatusButtonTooltip from "@/app/_components/table/status-button-tooltip";
import { useMutateSearchParams } from "@/hooks/use-mutate-search-params";

export type ProgramaEnVarianteTableItem = {
	id: string;
	programa: string;
	modalidad: string | null;
	malla: boolean;
	registro: boolean;
	varianteEstado: boolean;
};

const helper = createColumnHelper<ProgramaEnVarianteTableItem>();

export const programasColumns = [
	helper.accessor("id", {}),
	helper.accessor("varianteEstado", {}),
	helper.accessor("programa", {
		header: "Programa",
	}),
	helper.accessor("modalidad", {
		header: "Modalidad",
	}),
	helper.accessor("malla", {
		header: "Malla",
		cell: ({ getValue, column }) => (
			<StatusButtonTooltip
				status={getValue()}
				hoverTitle={column.columnDef.header as string}
			/>
		),
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
			const varianteEstado = row.getValue("varianteEstado") as boolean;

			return (
				<BaseTableActions
					updateOptions={{
						buttonProps: {
							onClick: () => replaceSet(programasEnVarianteParams.update, id),
						},
						show: !varianteEstado,
					}}
					deleteOptions={{
						buttonProps: {
							onClick: () => replaceSet(programasEnVarianteParams.delete, id),
						},
						show: !varianteEstado,
					}}
				/>
			);
		},
	}),
];

export const programasEnVarianteParams = {
	update: "actualizarPrograma",
	delete: "eliminarPrograma",
};
