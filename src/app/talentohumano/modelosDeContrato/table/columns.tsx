"use client";
import { createColumnHelper } from "@tanstack/react-table";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { Button } from "@/app/_components/ui/button";
import { Lock, FileSignature, PlusCircle } from "lucide-react";
import { useMutateSearchParams } from "@/hooks/use-mutate-search-params";
import { ModeloDeContratoSchema } from "../add-modeloDeContrato";
import { useState } from "react";

export type ModeloDeContratoTableItem = ModeloDeContratoSchema;

const helper = createColumnHelper<ModeloDeContratoTableItem>();

export const ModeloDeContratoColumns = [
	helper.accessor("id", { header: "ID" }),
	helper.accessor("nombredescripcion", {
		header: "Nombre/Descripcion",
	}),
	helper.accessor("paraprofesores", {
		header: "Para Profesores",
		cell: ({ getValue }) => (getValue() ? "SI" : "NO"),
	}),
	helper.accessor("archivo", {
		header: "Archivo",
	}),
	helper.accessor("campos", {
		header: "Campos",
	}),
	helper.accessor("activo", {
		header: "Activo",
		cell: ({ getValue }) => {
			const value = getValue();
			return <Switcher value={value} />;
		},
	}),
	helper.display({
		id: "actions",
		cell: ({ row }) => {
			const id = row.getValue("id") as string;

			return <Actions modeloDeContratoId={id} />;
		},
	}),
];

function Switcher({ value }: { value: boolean }) {
	const [valor, setValor] = useState(value);

	return (
		<Button
			className='m-2 h-8 w-8 border border-current bg-transparent p-2 text-current hover:text-black'
			onClick={() => setValor(!valor)}
		>
			{valor ? "SI" : "NO"}
		</Button>
	);
}

export const modeloDeContratoParams = {
	update: "actualizarModeloDeContrato",
	deactivate: "desactivarModeloDeContrato",
};

function Actions({ modeloDeContratoId }: { modeloDeContratoId: string }) {
	const { replaceSet } = useMutateSearchParams();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button>Acciones</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-56'>
				<DropdownMenuItem
					onClick={() =>
						replaceSet(modeloDeContratoParams.update, modeloDeContratoId)
					}
				>
					<FileSignature className='mr-2 h-4 w-4' />
					<span>Editar</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() =>
						replaceSet(modeloDeContratoParams.deactivate, modeloDeContratoId)
					}
				>
					<Lock className='mr-2 h-4 w-4' />
					<span>Eliminar</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
