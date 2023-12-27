import { createColumnHelper } from "@tanstack/react-table";

import { Button } from "@/app/_components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { FileSignature, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/core/routes";
import { getParamName } from "@/utils";

export type AsignaturaTableItem = {
	id: string;
	nombre: string;
	codigo: string | null;
	isUsed: boolean; // si esta ligada a una malla
};

const helper = createColumnHelper<AsignaturaTableItem>();

export const columns = [
	helper.accessor("id", {}),
	helper.accessor("nombre", {
		header: "Nombre",
	}),
	helper.accessor("codigo", {
		header: "Codigo",
	}),
	helper.accessor("isUsed", {
		header: "Uso",
		cell: ({ getValue }) => (getValue() ? "SI" : "NO"),
	}),
	helper.display({
		id: "actions",
		cell: ({ row }) => {
			const id = row.getValue("id") as string;
			const isUsed = row.getValue("isUsed") as string;

			return <Actions asignaturaId={id} showDelete={!isUsed} />;
		},
	}),
];

function Actions(props: { asignaturaId: string; showDelete: boolean }) {
	const router = useRouter();
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button>Acciones</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-56'>
				<DropdownMenuItem
					onClick={() =>
						router.replace(
							ROUTES.asignatura +
								`?${getParamName({
									action: "actualizar",
									module: "Asignatura",
								})}=${props.asignaturaId}`,
						)
					}
				>
					<FileSignature className='mr-2 h-4 w-4' />
					<span>Editar</span>
				</DropdownMenuItem>
				{props.showDelete && (
					<DropdownMenuItem
						onClick={() =>
							router.replace(
								ROUTES.asignatura +
									`?${getParamName({
										action: "eliminar",
										module: "Asignatura",
									})}=${props.asignaturaId}`,
							)
						}
					>
						<X className='mr-2 h-4 w-4' />
						<span>Eliminar</span>
					</DropdownMenuItem>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
