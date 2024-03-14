import { createColumnHelper } from "@tanstack/react-table";

import BaseTableActions from "@/app/_components/table-actions";
import StatusButtonTooltip from "@/app/_components/table/status-button-tooltip";
import { Button } from "@/app/_components/ui/button";
import { useMutateSearchParams } from "@/hooks/use-mutate-search-params";
import { asesoresEstudianteParams } from "../add-asesor-estudiante";

export type AsesorEstudianteTableItem = {
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
	activo: boolean;
};

const helper = createColumnHelper<AsesorEstudianteTableItem>();

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
		id: "estudiantesAction",
		cell: function Asesores({ getValue }) {
			// const asesores = getValue();

			return <Button>Estudiantes</Button>;
		},
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

			return (
				<BaseTableActions
					updateOptions={{
						buttonProps: {
							onClick: () => replaceSet(asesoresEstudianteParams.update, id),
						},
						show: true,
					}}
					deleteOptions={{
						show: false,
					}}
				/>
			);
		},
	}),
];
