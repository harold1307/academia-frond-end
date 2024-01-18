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
import { ProyectoIntegradorSchema } from "../add-proyecto-integrador";

export type ProyectoIntegradorTableItem = ProyectoIntegradorSchema

const helper = createColumnHelper<ProyectoIntegradorTableItem>();

export const proyectoIntegradorColumns = [
	helper.accessor("id", {}),
	helper.accessor("nombre", {
		header: "Nombre",
	}),
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

			return <Actions proyectoIntegradorId={id} />;
		},
	}),
];

export const proyectoIntegradorParams = {
	update: 'actualizarproyectointegrador',
	deactivate: 'desactivarproyectointegrador',
}

function Actions({ proyectoIntegradorId }: { proyectoIntegradorId: string }) {
	const { replaceSet } = useMutateSearchParams();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button>Acciones</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-56'>
                <DropdownMenuItem
                    onClick={() => replaceSet(proyectoIntegradorParams.update, proyectoIntegradorId)}
                >
                    <FileSignature className='mr-2 h-4 w-4' />
                    <span>Editar</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => replaceSet(proyectoIntegradorParams.deactivate, proyectoIntegradorId)}
                >
                    <Lock className='mr-2 h-4 w-4' />
                    <span>Desactivar</span>
                </DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
