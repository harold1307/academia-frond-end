'use client'
import { Button } from "@/app/_components/ui/button";
import { ROUTES } from "@/core/routes";
import { useMutateSearchParams } from "@/hooks/use-mutate-search-params";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/app/_components/ui/dropdown-menu";
import { createColumnHelper } from "@tanstack/react-table";
import { FileSignature, Lock, StretchHorizontal } from "lucide-react";
import { VarianteCurso } from "@prisma/client";
import { usePathname, useRouter } from "next/navigation";

export type VariantesTableItem = VarianteCurso

const helper = createColumnHelper<VariantesTableItem>();

export const variantesColumns = [
	helper.accessor("id", {}),
	helper.accessor("nombre", {
		header: "Nombre",
	}),
	helper.accessor("codigoBase", {
		header: "Código",
	}),
	helper.accessor("fechaAprobacion", {
		header: 'Aprobado',
	}),
	helper.accessor("registroExterno", {
        header: 'Registro Externo',
		cell: ({ getValue }) => (getValue() ? 'SI' : 'NO')
	}),
	helper.accessor("registroInterno", {
        header: 'Registro Interno',
		cell: ({ getValue }) => (getValue() ? 'SI' : 'NO')
	}),
	helper.accessor("registroDesdeOtraSede", {
        header: 'Registro otra Sede',
		cell: ({ getValue }) => (getValue() ? 'SI' : 'NO')
	}),
	helper.accessor("costoPorMateria", {
        header: 'Costo x Materia',
		cell: ({ getValue }) => (getValue() ? 'SI' : 'NO')
	}),
	helper.accessor("verificarSesion", {
        header: 'Verifica Sesión',
		cell: ({ getValue }) => (getValue() ? 'SI' : 'NO')
	}),
	helper.accessor("verificarEdad", {
        header: 'Rango de Edad',
		cell: ({ getValue }) => (getValue() ? 'SI' : 'NO')
	}),
	helper.accessor("edadMinima", {
        header: 'Edad Mínima'
	}),
	helper.accessor("edadMaxima", {
		header: 'Edad Máxima'
	}),
	helper.accessor("pasarRecord", {
        header: 'Pasar al Record',
		cell: ({ getValue }) => (getValue() ? 'SI' : 'NO')
	}),
	helper.accessor("aprobarCursoPrevio", {
        header: 'Curso Previo',
		cell: ({ getValue }) => (getValue() ? 'SI' : 'NO')
	}),
	helper.display({
		id: "actions",
		cell: ({ row }) => {
			const varianteId = row.getValue("id") as string;
			return <Actions
			  varianteId={varianteId}
              showDelete={true} 
            />;
		},
	}),
];

export const variantesParams = {
	update: 'actualizarVariante',
	deactivate: 'desactivarVariante',

}

function Actions(props: { varianteId: string, showDelete: boolean }) {
	const { replaceSet, router } = useMutateSearchParams();
	const pathname = usePathname()

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button>Acciones</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-56'>
				<DropdownMenuItem
					onClick={() => replaceSet(variantesParams.update, props.varianteId)}
				>
					<FileSignature className='mr-2 h-4 w-4' />
					<span>Editar</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => {
						console.log(pathname)
						router.push(pathname + ROUTES.configCurso.programas(props.varianteId))}
					}
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
					onClick={() => replaceSet(variantesParams.deactivate, props.varianteId)}
				>
					<Lock className='mr-2 h-4 w-4' />
					<span>Desactivar</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
