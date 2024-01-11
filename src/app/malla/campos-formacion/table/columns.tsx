import { createColumnHelper } from "@tanstack/react-table";

import BaseTableActions from "@/app/_components/table-actions";
import { useMutateSearchParams } from "@/hooks/use-mutate-search-params";
import { camposParams } from "../add-campo";

export type CamposFormacionTableItem = {
	id: string;
	nombre: string;
	enUso: boolean;
};

const helper = createColumnHelper<CamposFormacionTableItem>();

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
								replaceSet(camposParams.update, id);
							},
						},
					}}
					deleteOptions={{
						show: !enUso,
						buttonProps: {
							onClick: () => {
								replaceSet(camposParams.delete, id);
							},
						},
					}}
				/>
			);
		},
	}),
];
