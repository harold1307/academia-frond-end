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
import { type AlternativasEvaluacionSchema } from "../add-alternativas-evaluacion";

export type AlternativaEvaluacionTableItem = AlternativasEvaluacionSchema;

const helper = createColumnHelper<AlternativaEvaluacionTableItem>();

export const alternativaEvaluacionColumns = [
	helper.accessor("id", {}),
	helper.accessor("nombre", {
		header: "Nombre",
	}),
	helper.accessor("codigo", {
		header: "Código",
	}),
	helper.display({
		id: "actions",
		cell: ({ row }) => {
			const id = row.getValue("id") as string;

			return <Actions alternativaEvaluacionId={id} />;
		},
	}),
];

export const alternativaEvaluacionParams = {
	update: "actualizaralternativaevaluacion",
	deactivate: "desactivaralternativaevaluacion",
};

function Actions({
	alternativaEvaluacionId,
}: {
	alternativaEvaluacionId: string;
}) {
	const { replaceSet } = useMutateSearchParams();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button>Acciones</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-56'>
				<DropdownMenuItem
					onClick={() =>
						replaceSet(
							alternativaEvaluacionParams.update,
							alternativaEvaluacionId,
						)
					}
				>
					<FileSignature className='mr-2 h-4 w-4' />
					<span>Editar</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() =>
						replaceSet(
							alternativaEvaluacionParams.deactivate,
							alternativaEvaluacionId,
						)
					}
				>
					<Lock className='mr-2 h-4 w-4' />
					<span>Desactivar</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
