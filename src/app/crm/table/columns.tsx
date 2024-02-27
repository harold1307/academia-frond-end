import { createColumnHelper } from "@tanstack/react-table";
import { FileSignature, XCircle } from "lucide-react";

import { Button } from "@/app/_components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { useMutateSearchParams } from "@/hooks/use-mutate-search-params";

const helper = createColumnHelper<any>();

export const columns = [
	helper.accessor("id", {}),
	helper.accessor("preinscripto", {
		header: "Pre inscriptos",
	}),
	helper.accessor("cedula", {
		header: "Cedula",
	}),
	helper.accessor("registradoPor", {
		header: "Registrado por / Programas de interes",
	}),
	helper.accessor("emailTel", {
		header: "Email / Telefonos",
	}),
	helper.accessor("codigo", {
		header: "Codigo promoción",
	}),
	helper.accessor("registro", {
		header: "Registro",
	}),
	helper.accessor("seguimiento", {
		header: "Seguimientos",
	}),
	helper.display({
		id: "actions",
		cell: ({ row }) => {
			const id = row.getValue("id") as string;

			return <Actions periodoId={id} />;
		},
	}),
];

function Actions(props: { periodoId: string }) {
	const { replaceSet } = useMutateSearchParams();

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
					<XCircle className='mr-2 h-4 w-4' />
					<span>Eliminar</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
