import type { Institucion } from "@prisma/client";
import { createColumnHelper } from "@tanstack/react-table";

import BaseTableActions from "@/app/_components/table-actions";
import { useMutateSearchParams } from "@/hooks/use-mutate-search-params";
import { institucionParams } from "../add-institucion";

export type InstitucionTableItem = Omit<Institucion, "createdAt"> & {
	enUso: boolean;
};

const columnHelper = createColumnHelper<InstitucionTableItem>();

export const columns = [
	columnHelper.accessor("id", {}),
	columnHelper.accessor("nombre", {
		header: "Nombre",
	}),
	columnHelper.accessor("tipo", {
		header: "Tipo",
	}),
	columnHelper.accessor("pais", {
		header: "Pais",
	}),
	columnHelper.accessor("provincia", {
		header: "Provincia",
	}),
	columnHelper.accessor("canton", {
		header: "Canton",
	}),
	columnHelper.accessor("codigo", {
		header: "Codigo",
	}),
	// TODO: esto debe ser dependiendo si la institucion esta en uso - como una institucion esta en uso??
	columnHelper.accessor("enUso", {
		header: "En uso",
		cell: ({ getValue }) => (getValue() ? "SI" : "NO"),
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
							onClick: () => replaceSet(institucionParams.update, id),
						},
						show: !enUso,
					}}
					deleteOptions={{
						buttonProps: {
							onClick: () => replaceSet(institucionParams.delete, id),
						},
						show: !enUso,
					}}
				/>
			);
		},
	}),
];
