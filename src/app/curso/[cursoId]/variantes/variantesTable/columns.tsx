import { Button } from "@/app/_components/ui/button";
import { ROUTES } from "@/core/routes";
import { useMutateSearchParams } from "@/hooks/use-mutate-search-params";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/app/_components/ui/dropdown-menu";
import { createColumnHelper } from "@tanstack/react-table";
import { FileSignature, Lock, StretchHorizontal } from "lucide-react";

export type VariantesTableItem = {
	id: string
	nombre: string
    codigoBase: string
    registroExterno: boolean
    registroInterno: boolean
    registroDesdeOtraSede: boolean
    costoPorMateria: boolean
    costoPorCantidadDeMateria: boolean
    verificaSesion: boolean
    verificaRangoDeEdad: boolean
    edadMinima: number | undefined
    edadMaxima: number | undefined
    cumpleRequisitosDeMalla: boolean
    pasarAlRecord: boolean
    aprobarCursoPrevio: boolean
    nivelMinimo: boolean
    nivel: string | undefined
    fechaAprobacion: Date
	enUso: boolean
	activo: boolean
    descripcion: string
};

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
		cell: ({ getValue }) => (getValue().toDateString())
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
	helper.accessor("costoPorCantidadDeMateria", {
        header: 'Costo x cant. materia',
		cell: ({ getValue }) => (getValue() ? 'SI' : 'NO')
	}),
	helper.accessor("verificaSesion", {
        header: 'Verifica Sesión',
		cell: ({ getValue }) => (getValue() ? 'SI' : 'NO')
	}),
	helper.accessor("verificaRangoDeEdad", {
        header: 'Rango de Edad',
		cell: ({ getValue }) => (getValue() ? 'SI' : 'NO')
	}),
	helper.accessor("edadMinima", {
        header: 'Edad Mínima'
	}),
	helper.accessor("edadMaxima", {
		header: 'Edad Máxima'
	}),
	helper.accessor("cumpleRequisitosDeMalla", {
        header: 'Requisitos Malla',
		cell: ({ getValue }) => (getValue() ? 'SI' : 'NO')
	}),
	helper.accessor("pasarAlRecord", {
        header: 'Pasar al Record',
		cell: ({ getValue }) => (getValue() ? 'SI' : 'NO')
	}),
	helper.accessor("aprobarCursoPrevio", {
        header: 'Curso Previo',
		cell: ({ getValue }) => (getValue() ? 'SI' : 'NO')
	}),
	helper.accessor("nivelMinimo", {
        header: 'Nivel Mínimo',
		cell: ({ getValue }) => (getValue() ? 'SI' : 'NO')
	}),
	// helper.accessor("nivel", {}),
	helper.accessor("enUso", {
        header: 'En Uso',
		cell: ({ getValue }) => (getValue() ? 'SI' : 'NO')
	}),
	helper.accessor("activo", {
        header: 'Activo',
		cell: ({ getValue }) => (getValue() ? 'SI' : 'NO')
	}),
	// helper.accessor("descripcion", {
    //     header: 'Descripcion',
	// }),
	helper.display({
		id: "actions",
		cell: ({ row }) => {
			const id = row.getValue("id") as string;

			return <Actions
              cursoId={id} 
              showDelete={true} 
            />;
		},
	}),
];

const variantesParams = {
	update: 'actualizarVariante',
	deactivate: 'desactivarVariante'
}
function Actions(props: { cursoId: string; showDelete: boolean }) {
	const { replaceSet, router } = useMutateSearchParams();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button>Acciones</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-56'>
				<DropdownMenuItem
					onClick={() => replaceSet(variantesParams.update, props.cursoId)}
				>
					<FileSignature className='mr-2 h-4 w-4' />
					<span>Editar</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => router.push(ROUTES.configCurso.variantes(props.cursoId))}
				>
					<StretchHorizontal className='mr-2 h-4 w-4' />
					<span>programas</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => router.push(ROUTES.configCurso.variantes(props.cursoId))}
				>
					<StretchHorizontal className='mr-2 h-4 w-4' />
					<span>Materias</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => router.push(ROUTES.configCurso.variantes(props.cursoId))}
				>
					<StretchHorizontal className='mr-2 h-4 w-4' />
					<span>Costos</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => replaceSet(variantesParams.deactivate, props.cursoId)}
				>
					<Lock className='mr-2 h-4 w-4' />
					<span>Desactivar</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
