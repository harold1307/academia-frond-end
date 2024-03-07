import { createColumnHelper } from "@tanstack/react-table";

import BaseTableActions from "@/app/_components/table-actions";
import StatusButtonTooltip from "@/app/_components/table/status-button-tooltip";
import { useMutateSearchParams } from "@/hooks/use-mutate-search-params";
import { asesoresAsignadosParams } from "../add-asesor-asignado";

export type AsesorAsignadoTableItem = {
	id: string;
	persona: string;
	identificacion: string | null;
	emailTelefono: {
		email: string | null;
		telefono: string | null;
	};
	estudiantes: number;
	administrativo: boolean;
	bienestar: boolean;
	expediente: boolean;
};

const helper = createColumnHelper<AsesorAsignadoTableItem>();

export const columns = [
	helper.accessor("id", {}),
	helper.accessor("persona", {
		header: "Persona",
	}),
	helper.accessor("identificacion", {
		header: "Identificación",
	}),
	helper.accessor("emailTelefono", {
		header: "Email / Teléfono",
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
	helper.accessor("estudiantes", {
		header: "Estudiantes",
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
	helper.accessor("bienestar", {
		header: "Bienestar",
		cell: ({ getValue, column }) => (
			<StatusButtonTooltip
				status={getValue()}
				hoverTitle={column.columnDef.header as string}
			/>
		),
	}),
	helper.accessor("expediente", {
		header: "Expediente",
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

			return (
				<BaseTableActions
					updateOptions={{
						show: false,
					}}
					deleteOptions={{
						buttonProps: {
							onClick: () => replaceSet(asesoresAsignadosParams.delete, id),
						},
					}}
				/>
			);
		},
	}),
];
