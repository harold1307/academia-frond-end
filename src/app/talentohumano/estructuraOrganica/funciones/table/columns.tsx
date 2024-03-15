"use client";
import { createColumnHelper } from "@tanstack/react-table";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { Button } from "@/app/_components/ui/button";
import { Lock, FileSignature } from "lucide-react";
import { useState } from "react";
import { type FuncionesSchema } from "../add-funciones";
import { useMutateSearchParams } from "@/hooks/use-mutate-search-params";

export type FuncionesTableItem = FuncionesSchema;

const helper = createColumnHelper<FuncionesTableItem>();

export const FuncionesColumns = [
	helper.accessor("funcion", {
		header: "Funcion",
	}),

	helper.accessor("id", {
		header: "ID",
	}),
	helper.accessor("enuso", {
		header: "En Uso",
		cell: ({ getValue }) => {
			const value = getValue();
			return <Switcher value={value} />;
		},
	}),

	helper.display({
		id: "actions",
		cell: ({ row }) => {
			const id = row.getValue("id") as string;

			return <Actions funcionesId={id} />;
		},
	}),
];

function Switcher({ value }: { value: boolean }) {
	const [valor, setValor] = useState(value);

	return (
		<Button
			className='m-4 h-8 w-8 border border-current bg-transparent p-2 text-current hover:text-black'
			onClick={() => setValor(!valor)}
		>
			{valor ? "SI" : "NO"}
		</Button>
	);
}

export const funcionesParams = {
	update: "actualizarfunciones",
	deactivate: "desactivarfunciones",
};

function Actions({ funcionesId }: { funcionesId: string }) {
	const { replaceSet } = useMutateSearchParams();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button className='hover:bg-slate-300 hover:text-slate-800'>
					Acciones
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-56'>
				<DropdownMenuItem
					onClick={() => replaceSet(funcionesParams.update, funcionesId)}
				>
					<FileSignature className='mr-2 h-4 w-4' />
					<span>Editar</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => replaceSet(funcionesParams.deactivate, funcionesId)}
				>
					<Lock className='mr-2 h-4 w-4' />
					<span>Eliminar</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
