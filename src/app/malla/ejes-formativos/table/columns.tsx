import { createColumnHelper } from "@tanstack/react-table";

import BaseTableActions from "@/app/_components/table-actions";
import { useMutateSearchParams } from "@/hooks/use-mutate-search-params";
import { ejesFormativosParams } from "../add-eje";

export type EjeFormativoTableItem = {
	id: string;
	nombre: string;
	enUso: boolean;
};

const helper = createColumnHelper<EjeFormativoTableItem>();

export const columns = [
	helper.accessor("id", {}),
	helper.accessor("nombre", {
		header: "Nombre",
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
								replaceSet(ejesFormativosParams.update, id);
							},
						},
					}}
					deleteOptions={{
						show: !enUso,
						buttonProps: {
							onClick: () => {
								replaceSet(ejesFormativosParams.delete, id);
							},
						},
					}}
				/>
			);
		},
	}),
];
