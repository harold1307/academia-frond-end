import { Button } from "@/app/_components/ui/button";
import { ROUTES } from "@/core/routes";
import { useMutateSearchParams } from "@/hooks/use-mutate-search-params";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/app/_components/ui/dropdown-menu";
import { createColumnHelper } from "@tanstack/react-table";
import { FileSignature, Lock, StretchHorizontal } from "lucide-react";
import { VarianteCurso } from "@prisma/client";
import { ProgramaSchema } from "../add-programa";

export type ProgramaTableItem = ProgramaSchema


const helper = createColumnHelper<ProgramaTableItem>();

export const programasColumns = [
	helper.accessor("id", {}),
    helper.accessor("programa", {
        header: "Programa",
    }),
	helper.accessor("modalidad", {
		header: "Modalidad",
	}),
	helper.accessor("malla", {
		header: 'Malla',
		// cell: ({ getValue }) => (getValue().toDateString())
	}),
	helper.accessor("todosLosProgramas", {
        header: 'Todos Los Programas',
		cell: ({ getValue }) => (getValue() ? 'SI' : 'NO')
	}),
	helper.accessor("registroExterno", {
        header: 'Registro Externo',
		cell: ({ getValue }) => (getValue() ? 'SI' : 'NO')
	}),
	
	helper.display({
		id: "actions",
		cell: ({ row }) => {
			const programaId = row.getValue("id") as string;
			// const cursoId = row.getValue("cursoId") as string
			return <Actions
            //   cursoId={cursoId} 
			  programaId={programaId}
              showDelete={true} 
            />;
		},
	}),
];

export const programasParams = {
	update: 'actualizarVariante',
	deactivate: 'desactivarVariante',

}
function Actions(props: { programaId: string, showDelete: boolean }) {
	const { replaceSet, router } = useMutateSearchParams();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button>Acciones</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-56'>
				<DropdownMenuItem
					onClick={() => replaceSet(programasParams.update, props.programaId)}
				>
					<FileSignature className='mr-2 h-4 w-4' />
					<span>Editar</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => replaceSet(programasParams.deactivate, props.programaId)}
				>
					<Lock className='mr-2 h-4 w-4' />
					<span>Desactivar</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
