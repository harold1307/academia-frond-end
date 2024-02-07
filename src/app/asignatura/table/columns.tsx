import { createColumnHelper } from "@tanstack/react-table";
import { FileSignature, X } from "lucide-react";

import { Button } from "@/app/_components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { useMutateSearchParams } from "@/hooks/use-mutate-search-params";

export type AsignaturaTableItem = {
	id: string;
	nombre: string;
	codigo: string | null;
	enUso: boolean; // si esta ligada a una malla
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
	helper.accessor("enUso", {
		header: "Uso",
		cell: ({ getValue }) => (getValue() ? "SI" : "NO"),
	}),
	helper.display({
		id: "actions",
		cell: ({ row }) => {
			const id = row.getValue("id") as string;
			const enUso = row.getValue("enUso") as string;

			return <Actions asignaturaId={id} showDelete={!enUso} />;
		},
	}),
];

export const asignaturasParams = {
	update: "actualizarAsignatura",
	delete: "eliminarAsignatura",
};

function Actions(props: { asignaturaId: string; showDelete: boolean }) {
	const { replaceSet } = useMutateSearchParams();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button>Acciones</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-56'>
				<DropdownMenuItem
					onClick={() =>
						replaceSet(asignaturasParams.update, props.asignaturaId)
					}
				>
					<FileSignature className='mr-2 h-4 w-4' />
					<span>Editar</span>
				</DropdownMenuItem>
				{props.showDelete && (
					<DropdownMenuItem
						onClick={() =>
							replaceSet(asignaturasParams.delete, props.asignaturaId)
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
