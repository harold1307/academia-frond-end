import { Button } from "@/app/_components/ui/button";
import { ROUTES } from "@/core/routes";
import { useMutateSearchParams } from "@/hooks/use-mutate-search-params";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/app/_components/ui/dropdown-menu";
import { createColumnHelper } from "@tanstack/react-table";
import { FileSignature, Lock, StretchHorizontal } from "lucide-react";
import { VarianteCurso } from "@prisma/client";

export type ProgramaTableItem = any


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
			const varianteId = row.getValue("id") as string;
			// const cursoId = row.getValue("cursoId") as string
			return <Actions
            //   cursoId={cursoId} 
			  varianteId={varianteId}
              showDelete={true} 
            />;
		},
	}),
];

export const programasParams = {
	update: 'actualizarVariante',
	deactivate: 'desactivarVariante',

}
function Actions(props: { varianteId: string, showDelete: boolean }) {
	const { replaceSet, router } = useMutateSearchParams();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button>Acciones</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-56'>
				<DropdownMenuItem
					onClick={() => replaceSet(programasParams.update, props.varianteId)}
				>
					<FileSignature className='mr-2 h-4 w-4' />
					<span>Editar</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => router.push(ROUTES.configCurso.programas(props.varianteId))}
				>
					<StretchHorizontal className='mr-2 h-4 w-4' />
					<span>programas</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => router.push(ROUTES.configCurso.variantes(props.varianteId))}
				>
					<StretchHorizontal className='mr-2 h-4 w-4' />
					<span>Materias</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => router.push(ROUTES.configCurso.variantes(props.varianteId))}
				>
					<StretchHorizontal className='mr-2 h-4 w-4' />
					<span>Costos</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => replaceSet(programasParams.deactivate, props.varianteId)}
				>
					<Lock className='mr-2 h-4 w-4' />
					<span>Desactivar</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
