import { createColumnHelper } from "@tanstack/react-table";

import BaseTableActions from "@/app/_components/table-actions";
import StatusButtonTooltip from "@/app/_components/table/status-button-tooltip";
import { Button } from "@/app/_components/ui/button";
import { useMutateSearchParams } from "@/hooks/use-mutate-search-params";
import { responsablesAsesorEstudianteParams } from "../add-responsable-asesor-estudiante";

export type ResponsableAsesorEstudianteTableItem = {
	id: string;
	persona: string;
	identificacion: string | null;
	emailTelefono: {
		email: string | null;
		telefono: string | null;
	};
	bienestar: boolean;
	expediente: boolean;
	administrativo: boolean;
	asesores: number;
};

const helper = createColumnHelper<ResponsableAsesorEstudianteTableItem>();

export const columns = [
	helper.accessor("id", {}),
	helper.accessor("persona", { header: "Persona" }),
	helper.accessor("identificacion", { header: "Identificación" }),
	helper.accessor("emailTelefono", {
		header: "Email/Teléfono",
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
	helper.accessor("bienestar", {
		header: "Seguimiento bienestar",
		cell: ({ getValue, column }) => (
			<StatusButtonTooltip
				status={getValue()}
				hoverTitle={column.columnDef.header as string}
			/>
		),
	}),
	helper.accessor("expediente", {
		header: "Seguimiento expediente",
		cell: ({ getValue, column }) => (
			<StatusButtonTooltip
				status={getValue()}
				hoverTitle={column.columnDef.header as string}
			/>
		),
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
	helper.accessor("asesores", {
		header: "",
		cell: function Asesores({ getValue, row }) {
			const { replaceSet } = useMutateSearchParams();

			const id = row.getValue("id") as string;
			const asesores = getValue();

			return (
				<Button onClick={() => replaceSet("rId", id)}>
					Asesores - {asesores}
				</Button>
			);
		},
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
							onClick: () =>
								replaceSet(responsablesAsesorEstudianteParams.delete, id),
						},
					}}
				/>
			);
		},
	}),
];
