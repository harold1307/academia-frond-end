import { createColumnHelper } from "@tanstack/react-table";

import BaseTableActions from "@/app/_components/table-actions";
import { useMutateSearchParams } from "@/hooks/use-mutate-search-params";
import { paralelosParams } from "../add-paralelo";

export type ParaleloTableItem = {
	id: string;
	nombre: string;
	orden: number;
	enUso: boolean;
};

const helper = createColumnHelper<ParaleloTableItem>();

export const columns = [
	helper.accessor("id", {}),
	helper.accessor("nombre", { header: "Nombre" }),
	helper.accessor("orden", { header: "Orden" }),
	helper.accessor("enUso", { header: "En uso" }),
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
							onClick: () => replaceSet(paralelosParams.update, id),
						},
					}}
					deleteOptions={{
						buttonProps: {
							onClick: () => replaceSet(paralelosParams.delete, id),
						},
						show: !enUso,
					}}
				/>
			);
		},
	}),
];
