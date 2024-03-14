import { createColumnHelper } from "@tanstack/react-table";

import BaseTableActions from "@/app/_components/table-actions";
import { Constants } from "@/core/constants";
import { useMutateSearchParams } from "@/hooks/use-mutate-search-params";
import { gruposParams } from "../add-grupo";

export type GrupoTableItem = {
	id: string;
	nombre: string;
	usuarios: number;
	activos: number;
	inactivos: number;
};

const helper = createColumnHelper<GrupoTableItem>();

export const columns = [
	helper.accessor("id", {}),
	helper.accessor("nombre", {
		header: "Nombre",
	}),
	helper.accessor("usuarios", {
		header: "Usuarios",
	}),
	helper.accessor("activos", {
		header: "Activos",
	}),
	helper.accessor("inactivos", {
		header: "Inactivos",
	}),
	helper.display({
		id: "actions",
		cell: function Actions({ row }) {
			const { replaceSet } = useMutateSearchParams();

			const { activos, id, inactivos, nombre, usuarios } = row.original;

			const canUpdate = !Object.keys(Constants.STATIC_GROUPS).includes(nombre);
			const canDelete =
				!Object.keys(Constants.STATIC_GROUPS).includes(nombre) &&
				!activos &&
				!inactivos &&
				!usuarios;

			return (
				<BaseTableActions
					updateOptions={{
						buttonProps: {
							onClick: () => replaceSet(gruposParams.update, id),
						},
						show: canUpdate,
					}}
					deleteOptions={{
						buttonProps: {
							onClick: () => replaceSet(gruposParams.delete, id),
						},
						show: canDelete,
					}}
				/>
			);
		},
	}),
];
