import { createColumnHelper } from "@tanstack/react-table";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { Button } from "@/app/_components/ui/button";
import { Lock, FileSignature } from "lucide-react";

export type TalentoHumano = {
	nombre: string;
	departamento: string;
	id: string;
	emailtelefono: string;
	datos: string;
	etnia: string;
	asesor: boolean;
	discapacidad: boolean;
	admin: boolean;
	profesor: boolean;
	foto: boolean;
};

export type TalentoHumanoTableItem = TalentoHumano;

const helper = createColumnHelper<TalentoHumanoTableItem>();

export const TalentoHumanoColumns = [
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
		cell: ({ getValue }) => {
			const value = (getValue() ? "SI" : "NO") as string;
			return <Border value={value} />;
		},
	}),
	helper.accessor("discapacidad", {
		header: "Discapacidad",
		cell: ({ getValue }) => {
			const value = (getValue() ? "SI" : "NO") as string;
			return <Border value={value} />;
		},
	}),
	helper.accessor("admin", {
		header: "Admin",
		cell: ({ getValue }) => {
			const value = (getValue() ? "SI" : "NO") as string;
			return <Border value={value} />;
		},
	}),
	helper.accessor("profesor", {
		header: "Profesor",
		cell: ({ getValue }) => {
			const value = (getValue() ? "SI" : "NO") as string;
			return <Border value={value} />;
		},
	}),
	helper.accessor("foto", {
		header: "Foto",
		cell: ({ getValue }) => {
			const value = (getValue() ? "SI" : "NO") as string;
			return <Border value={value} />;
		},
	}),
	helper.display({
		id: "actions",
		cell: ({ row }) => {
			const id = row.getValue("id") as string;

			return <Actions id={id} />;
		},
	}),
];

function Border({ value }: { value: string }) {
	return (
		<span className='border border-current rounded bg-transparent text-current p-1.5'>
			{value}
		</span>
	);
}

function Actions({ id }: { id: string }) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button>Acciones</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-56'>
				<DropdownMenuItem>
					<FileSignature className='mr-2 h-4 w-4' />
					<span>Editar</span>
				</DropdownMenuItem>
				<DropdownMenuItem>
					<Lock className='mr-2 h-4 w-4' />
					<span>Desactivar</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
