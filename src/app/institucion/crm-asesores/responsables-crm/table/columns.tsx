import { createColumnHelper } from "@tanstack/react-table";

import BaseTableActions from "@/app/_components/table-actions";
import StatusButtonTooltip from "@/app/_components/table/status-button-tooltip";
import { useMutateSearchParams } from "@/hooks/use-mutate-search-params";
import { responsablesCrmParams } from "../add-responsable-crm";

export type ResponsableCrmTableItem = {
	id: string;
	persona: string;
	identificacion: string | null;
	emailTelefono: {
		email: string | null;
		telefono: string | null;
	};
	administrativo: boolean;
	activo: boolean;
};

const helper = createColumnHelper<ResponsableCrmTableItem>();

export const columns = [
	helper.accessor("id", {}),
	helper.accessor("persona", {
		header: "Persona",
	}),
	helper.accessor("identificacion", {
		header: "Identificacion",
	}),
	helper.accessor("emailTelefono", {
		header: "Email/Telefono",
		cell: ({ getValue }) => {
			const { email, telefono } = getValue();
			return (
				<div>
					<div>{email}</div>
					<div>{telefono}</div>
				</div>
			);
		},
	}),
	helper.accessor("administrativo", {
		header: "Administrativo",
		cell: ({ getValue, column }) => (
			<StatusButtonTooltip
				status={getValue()}
				hoverTitle={column.columnDef.header as string}
			/>
		),
	}),
	helper.accessor("activo", {
		header: "Activo",
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
			const enUso = row.getValue("enUso") as boolean;

			return (
				<BaseTableActions
					updateOptions={{
						show: false,
					}}
					deleteOptions={{
						buttonProps: {
							onClick: () => replaceSet(responsablesCrmParams.delete, id),
						},
					}}
				/>
			);
		},
	}),
];
