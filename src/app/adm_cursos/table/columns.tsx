import { createColumnHelper } from "@tanstack/react-table";
import {
	FileSignature,
	Lock,
	StretchHorizontal,
	Unlock,
	X,
} from "lucide-react";

import { Button } from "@/app/_components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { ROUTES } from "@/core/routes";
import { useMutateSearchParams } from "@/hooks/use-mutate-search-params";
import { cursosParams } from "../add-curso";

export type CursoTableItem = {
	id: string;
	estado: boolean;
	nombre: string;
	variantes: number;
};

const helper = createColumnHelper<CursoTableItem>();

export const columns = [
	helper.accessor("id", {}),
	helper.accessor("nombre", {
		header: "Curso",
	}),
	helper.accessor("variantes", {
		header: "Variantes",
	}),
	helper.accessor("estado", {
		header: "Activo",
		cell: ({ getValue }) => (getValue() ? "SI" : "NO"),
	}),
	helper.display({
		id: "actions",
		cell: ({ row }) => {
			const id = row.getValue("id") as string;
			const variantes = row.getValue("variantes") as number;
			const estado = row.getValue("estado") as boolean;

			return (
				<Actions cursoId={id} showDelete={variantes > 0} isActive={estado} />
			);
		},
	}),
];

function Actions(props: {
	cursoId: string;
	showDelete: boolean;
	isActive: boolean;
}) {
	const { replaceSet, router } = useMutateSearchParams();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button>Acciones</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-56'>
				<DropdownMenuItem
					onClick={() => replaceSet(cursosParams.update, props.cursoId)}
				>
					<FileSignature className='mr-2 h-4 w-4' />
					<span>Editar</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => router.push(ROUTES.curso.variantes(props.cursoId))}
				>
					<StretchHorizontal className='mr-2 h-4 w-4' />
					<span>Variantes</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => replaceSet(cursosParams.deactivate, props.cursoId)}
				>
					{props.isActive ? (
						<>
							<Lock className='mr-2 h-4 w-4' />
							<span>Desactivar</span>
						</>
					) : (
						<>
							<Unlock className='mr-2 h-4 w-4' />
							<span>Activar</span>
						</>
					)}
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => replaceSet(cursosParams.delete, props.cursoId)}
				>
					<X className='mr-2 h-4 w-4' />
					<span>Eliminar</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
