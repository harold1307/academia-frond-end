import { createColumnHelper } from "@tanstack/react-table";
import { FileSignature, X } from "lucide-react";

import StatusButtonTooltip from "@/app/_components/table/status-button-tooltip";
import { Button } from "@/app/_components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { useMutateSearchParams } from "@/hooks/use-mutate-search-params";
import { asesoresCrmParams } from "../add-asesor-crm";

export type AsesorCrmTableItem = {
	id: string;
	persona: string;
	identificacion: string | null;
	emailTelefono: {
		email: string | null;
		telefono: string | null;
	};
	centrosInformacion: string[];
	interesados: number;
	inscritos: number;
	administrativo: boolean;
};

const helper = createColumnHelper<AsesorCrmTableItem>();

export const columns = [
	helper.accessor("id", {}),
	helper.accessor("persona", {
		header: "Persona",
	}),
	helper.accessor("identificacion", {
		header: "Identificación",
	}),
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
	helper.accessor("centrosInformacion", {
		header: "Centros de información",
		cell: ({ getValue }) => {
			const centros = getValue();
			return <div>{centros.join(", ")}</div>;
		},
	}),
	helper.accessor("interesados", {
		header: "Interesados",
	}),
	helper.accessor("inscritos", {
		header: "Inscritos",
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
	helper.display({
		id: "actions",
		cell: ({ row }) => {
			const id = row.getValue("id") as string;

			return <Actions asesorId={id} showDelete={true} />;
		},
	}),
];

function Actions({
	asesorId,
	showDelete,
}: {
	asesorId: string;
	showDelete: boolean;
}) {
	const { replaceSet } = useMutateSearchParams();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button>Acciones</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-56'>
				<DropdownMenuItem
					onClick={() => replaceSet(asesoresCrmParams.update, asesorId)}
				>
					<FileSignature className='mr-2 h-4 w-4' />
					<span>Editar</span>
				</DropdownMenuItem>
				{/* <DropdownMenuItem
					onClick={() =>
						router.push(ROUTES.malla.asignaturasEnMalla(asesorId))
					}
				>
					<Repeat2 className='mr-2 h-4 w-4' />
					<span>Asignaturas</span>
				</DropdownMenuItem> */}
				<DropdownMenuSeparator />
				{showDelete && (
					<DropdownMenuItem
						onClick={() => replaceSet(asesoresCrmParams.delete, asesorId)}
					>
						<X className='mr-2 h-4 w-4' />
						<span>Eliminar</span>
					</DropdownMenuItem>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
