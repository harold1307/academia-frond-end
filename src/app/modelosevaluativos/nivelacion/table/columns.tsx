"use client";
import { createColumnHelper } from "@tanstack/react-table";
import { FileSignature, Lock } from "lucide-react";

import { Button } from "@/app/_components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { useMutateSearchParams } from "@/hooks/use-mutate-search-params";
import { NivelacionSchema } from "../add-nivelacion";

export type NivelacionTableItem = NivelacionSchema;

const helper = createColumnHelper<NivelacionTableItem>();

export const nivelacionColumns = [
	helper.accessor("id", {}),
	helper.accessor("nombre", {
		header: "Nombre",
	}),
	// helper.accessor("fecha", {
	// 	header: "Fecha",
	// }),
	helper.accessor("notaParaAprobar", {
		header: "Nota Aprobar",
	}),
	helper.accessor("notaMaxima", {
		header: "Nota Máxima",
	}),
	helper.accessor("decimalesNotaFinal", {
		header: "Decimales Nota Final",
	}),
	helper.display({
		id: "actions",
		cell: ({ row }) => {
			const id = row.getValue("id") as string;

			return <Actions nivelacionId={id} />;
		},
	}),
];

export const nivelacionParams = {
	update: "actualizarnivelacion",
	deactivate: "desactivarnivelacion",
};

function Actions({ nivelacionId }: { nivelacionId: string }) {
	const { replaceSet } = useMutateSearchParams();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button>Acciones</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-56'>
				<DropdownMenuItem
					onClick={() => replaceSet(nivelacionParams.update, nivelacionId)}
				>
					<FileSignature className='mr-2 h-4 w-4' />
					<span>Editar</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => replaceSet(nivelacionParams.deactivate, nivelacionId)}
				>
					<Lock className='mr-2 h-4 w-4' />
					<span>Desactivar</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
