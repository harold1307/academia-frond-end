"use client";
import { createColumnHelper } from "@tanstack/react-table";
import { FileSignature, Lock } from "lucide-react";

import StatusButtonTooltip from "@/app/_components/table/status-button-tooltip";
import { Button } from "@/app/_components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { useMutateSearchParams } from "@/hooks/use-mutate-search-params";

export type MateriaTableItem = {
	id: string;
	asignaturaModelo: string;
	horas: number;
	creditos: number;
	asistenciaAprobar: number;
	calificar: boolean;
	notaMaxima: number;
	notaParaAprobar: number;
	requeridaAprobar: boolean;
	sumaHoras: boolean;
};

const helper = createColumnHelper<MateriaTableItem>();

export const materiasColumns = [
	helper.accessor("id", {}),
	helper.accessor("asignaturaModelo", {
		header: "Asignatura / Modelo",
	}),
	helper.accessor("horas", {
		header: "Horas",
	}),
	helper.accessor("creditos", {
		header: "Créditos",
	}),
	helper.accessor("asistenciaAprobar", {
		header: "Asistencia",
	}),
	helper.accessor("calificar", {
		header: "Califica",
		cell: ({ getValue, column }) => (
			<StatusButtonTooltip
				status={getValue()}
				hoverTitle={column.columnDef.header as string}
			/>
		),
	}),
	helper.accessor("notaMaxima", {
		header: "Nota Máxima",
	}),
	helper.accessor("notaParaAprobar", {
		header: "Nota Aprobar",
	}),
	helper.accessor("requeridaAprobar", {
		header: "Requerida",
		cell: ({ getValue, column }) => (
			<StatusButtonTooltip
				status={getValue()}
				hoverTitle={column.columnDef.header as string}
			/>
		),
	}),
	helper.accessor("sumaHoras", {
		header: "Suma Horas",
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
			const programaId = row.getValue("id") as string;
			return <Actions programaId={programaId} showDelete={true} />;
		},
	}),
];

export const materiasParams = {
	update: "actualizarMateria",
	deactivate: "desactivarMateria",
};
function Actions(props: { programaId: string; showDelete: boolean }) {
	const { replaceSet } = useMutateSearchParams();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button>Acciones</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-56'>
				<DropdownMenuItem
					onClick={() => replaceSet(materiasParams.update, props.programaId)}
				>
					<FileSignature className='mr-2 h-4 w-4' />
					<span>Editar</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() =>
						replaceSet(materiasParams.deactivate, props.programaId)
					}
				>
					<Lock className='mr-2 h-4 w-4' />
					<span>Desactivar</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
