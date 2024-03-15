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
import { type PersonalSchema } from "../add-personal";
import { useMutateSearchParams } from "@/hooks/use-mutate-search-params";

export type PersonalTableItem = PersonalSchema;

const helper = createColumnHelper<PersonalTableItem>();

export const PersonalColumns = [
	helper.accessor("nombre", {
		header: "Nombre",
	}),
	helper.accessor("departamento", {
		header: "Departamento",
	}),
	helper.accessor("id", {
		header: "ID",
	}),
	helper.accessor("emailtelefono", {
		header: "Email/Telefono",
	}),
	helper.accessor("datos", {
		header: "Datos",
	}),
	helper.accessor("etnia", {
		header: "Etnia",
	}),
	helper.accessor("asesor", {
		header: "Asesor",
		cell: ({ getValue }) => (getValue() ? "SI" : "NO"),
		// return <Border value={value} />;,
	}),
	helper.accessor("discapacidad", {
		header: "Discapacidad",
		cell: ({ getValue }) => (getValue() ? "SI" : "NO"),
		// return <Border value={value} />;
	}),
	helper.accessor("admin", {
		header: "Admin",
		cell: ({ getValue }) => {
			const value = getValue();
			return <Switcher value={value} />;
		},
	}),
	helper.accessor("profesor", {
		header: "Profesor",
		cell: ({ getValue }) => (getValue() ? "SI" : "NO"),
		// return <Border value={value} />;
	}),
	helper.accessor("foto", {
		header: "Foto",
		cell: ({ getValue }) => (getValue() ? "SI" : "NO"),
		// return <Border value={value} />;
	}),
	helper.display({
		id: "actions",
		cell: ({ row }) => {
			const id = row.getValue("id") as string;

			return <Actions personalId={id} />;
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

export const personalParams = {
	update: "actualizarpersonal",
	deactivate: "desactivarpersonal",
};

function Actions({ personalId }: { personalId: string }) {
	const { replaceSet } = useMutateSearchParams();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
			<Button className="hover:bg-slate-300 hover:text-slate-800">Acciones</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-56'>
				<DropdownMenuItem
					onClick={() => replaceSet(personalParams.update, personalId)}
				>
					<FileSignature className='mr-2 h-4 w-4' />
					<span>Editar</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => replaceSet(personalParams.deactivate, personalId)}
				>
					<Lock className='mr-2 h-4 w-4' />
					<span>Desactivar</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
