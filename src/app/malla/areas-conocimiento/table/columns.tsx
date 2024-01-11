import { createColumnHelper } from "@tanstack/react-table";

import BaseTableActions from "@/app/_components/table-actions";
import { useMutateSearchParams } from "@/hooks/use-mutate-search-params";
import { areasConocimientoParams } from "../add-area";

export type AreaConocimientoTableItem = {
	id: string;
	nombre: string;
	codigo: string | null;
	enUso: boolean;
};

const helper = createColumnHelper<AreaConocimientoTableItem>();

export const columns = [
	helper.accessor("id", {}),
	helper.accessor("nombre", {
		header: "Nombre",
	}),
	helper.accessor("codigo", {
		header: "Codigo",
	}),
	helper.accessor("enUso", {
		header: "En uso",
		cell: ({ getValue }) => (getValue() ? "SI" : "NO"),
	}),
	helper.display({
		id: "actions",
		cell: function Actions({ row }) {
			const { replaceSet } = useMutateSearchParams();
			const enUso = row.getValue("enUso") as boolean;
			const id = row.getValue("id") as string;

			return (
				<BaseTableActions
					updateOptions={{
						show: !enUso,
						buttonProps: {
							onClick: () => {
								replaceSet(areasConocimientoParams.update, id);
							},
						},
					}}
					deleteOptions={{
						show: !enUso,
						buttonProps: {
							onClick: () => {
								replaceSet(areasConocimientoParams.delete, id);
							},
						},
					}}
				/>
			);
		},
	}),
];
