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
import { type CargosSchema } from "../add-cargos";
import { useMutateSearchParams } from "@/hooks/use-mutate-search-params";

export type CargosTableItem = CargosSchema;

const helper = createColumnHelper<CargosTableItem>();

export const CargosColumns = [
	helper.accessor("cargos", {
		header: "Cargos",
	}),
	helper.accessor("asignados", {
		header: "Asignados",
		cell: ({ getValue }) => {
			const nombres = getValue();
			return <Asignados nombres={nombres} />;
		},
	}),
	helper.accessor("id", {
		header: "ID",
	}),
	helper.accessor("multiple", {
		header: "Multiple",
		cell: ({ getValue }) => (getValue() ? "SI" : "NO"),
	}),
	helper.accessor("paraprofesores", {
		header: "Para Profesores",
		cell: ({ getValue }) => (getValue() ? "SI" : "NO"),
	}),
	helper.accessor("paraadministrativos", {
		header: "Para Administrativos",
		cell: ({ getValue }) => (getValue() ? "SI" : "NO"),
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

			return <Actions cargosId={id} />;
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

export const cargosParams = {
	update: "actualizarcargos",
	deactivate: "desactivarcargos",
};

function Asignados({ nombres }: { nombres: string[] }) {
	return (
		<div className='w-full rounded border p-2'>
			<h2>Personas:</h2>
			{nombres.map(nombre=><p className="w-full">{nombre}</p>)}
		</div>
	);
}

function Actions({ cargosId }: { cargosId: string }) {
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
					onClick={() => replaceSet(cargosParams.update, cargosId)}
				>
					<FileSignature className='mr-2 h-4 w-4' />
					<span>Editar</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => replaceSet(cargosParams.deactivate, cargosId)}
				>
					<Lock className='mr-2 h-4 w-4' />
					<span>Eliminar</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
