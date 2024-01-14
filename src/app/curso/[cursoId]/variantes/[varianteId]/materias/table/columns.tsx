'use client'
import { Button } from "@/app/_components/ui/button";
import { ROUTES } from "@/core/routes";
import { useMutateSearchParams } from "@/hooks/use-mutate-search-params";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/app/_components/ui/dropdown-menu";
import { createColumnHelper } from "@tanstack/react-table";
import { FileSignature, Lock, StretchHorizontal } from "lucide-react";
import { VarianteCurso } from "@prisma/client";
// import { ProgramaSchema } from "../add-programa";
import { MateriaSchema } from "../add-materia";

export type MateriaTableItem = MateriaSchema


const helper = createColumnHelper<MateriaTableItem>();

export const materiasColumns = [
	helper.accessor("id", {}),
    helper.accessor("asginatura", {
        header: "Asignatura",
    }),
	helper.accessor("horas", {
		header: "Horas",
	}),
	helper.accessor("creditos", {
		header: 'Créditos',
	}),
	helper.accessor("asistenciaAprobar", {
        header: 'Asistencia',
	}),
	helper.accessor("calificar", {
        header: 'Califica',
		cell: ({ getValue }) => (getValue() ? 'SI' : 'NO')
	}),
	helper.accessor("notaMaxima", {
        header: 'Nota Máxima',
	}),
	helper.accessor("notaParaAprobar", {
        header: 'Nota Aprobar',
	}),
	helper.accessor("requeridaAprobar", {
        header: 'Requerida',
		cell: ({ getValue }) => (getValue() ? 'SI' : 'NO')
	}),
	helper.accessor("sumaHoras", {
        header: 'Suma Horas',
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

export const materiasParams = {
	update: 'actualizarMateria',
	deactivate: 'desactivarMateria',

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
					onClick={() => replaceSet(materiasParams.update, props.programaId)}
				>
					<FileSignature className='mr-2 h-4 w-4' />
					<span>Editar</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => replaceSet(materiasParams.deactivate, props.programaId)}
				>
					<Lock className='mr-2 h-4 w-4' />
					<span>Desactivar</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
