import BaseTableActions from "@/app/_components/table-actions";
import { useMutateSearchParams } from "@/hooks/use-mutate-search-params";
import { createColumnHelper } from "@tanstack/react-table";
import { modalidadesParams } from "../add-modalidad";

export type ModalidadTableItem = {
	id: string;
	nombre: string;
	alias: string | null;
	enUso: boolean;
};

const helper = createColumnHelper<ModalidadTableItem>();

export const columns = [
	helper.accessor("id", {}),
	helper.accessor("nombre", {
		header: "Nombre",
	}),
	helper.accessor("alias", {
		header: "Alias",
	}),
	helper.accessor("enUso", {}),
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
							onClick: () => replaceSet(modalidadesParams.update, id),
						},
					}}
					deleteOptions={{
						buttonProps: {
							onClick: () => replaceSet(modalidadesParams.delete, id),
						},
						show: !enUso,
					}}
				/>
			);
		},
	}),
];
