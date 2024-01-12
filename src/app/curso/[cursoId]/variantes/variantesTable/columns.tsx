import { createColumnHelper } from "@tanstack/react-table";

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
    descripcion: string
};

const helper = createColumnHelper<VariantesTableItem>();

export const variantesColumns = [
	helper.accessor("id", {}),
	helper.accessor("nombre", {
		header: "Curso",
	}),
	helper.accessor("codigoBase", {
		header: "Código Base",
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
        header: 'Registro desde otra Sede',
		cell: ({ getValue }) => (getValue() ? 'SI' : 'NO')
	}),
	helper.accessor("costoPorMateria", {
        header: 'Costo por Materia',
		cell: ({ getValue }) => (getValue() ? 'SI' : 'NO')
	}),
	helper.accessor("costoPorCantidadDeMateria", {
        header: 'Costo por Cantidad de materia',
		cell: ({ getValue }) => (getValue() ? 'SI' : 'NO')
	}),
	helper.accessor("verificaSesion", {
        header: 'Verifica Sesión',
		cell: ({ getValue }) => (getValue() ? 'SI' : 'NO')
	}),
	helper.accessor("verificaRangoDeEdad", {
        header: 'Verifica rango de Edad',
		cell: ({ getValue }) => (getValue() ? 'SI' : 'NO')
	}),
	helper.accessor("edadMinima", {
        header: 'Edad Mínima'
	}),
	helper.accessor("edadMaxima", {
		header: 'Edad Máxima'
	}),
	helper.accessor("cumpleRequisitosDeMalla", {
        header: 'Cumple req. de Malla',
		cell: ({ getValue }) => (getValue() ? 'SI' : 'NO')
	}),
	helper.accessor("pasarAlRecord", {
        header: 'Pasar al Record',
		cell: ({ getValue }) => (getValue() ? 'SI' : 'NO')
	}),
	helper.accessor("aprobarCursoPrevio", {
        header: 'Aprobar Curso Previo',
		cell: ({ getValue }) => (getValue() ? 'SI' : 'NO')
	}),
	helper.accessor("nivelMinimo", {
        header: 'Nivel Mínimo',
		cell: ({ getValue }) => (getValue() ? 'SI' : 'NO')
	}),
	helper.accessor("nivel", {
        header: 'Nivel',
	}),
	helper.accessor("fechaAprobacion", {
        header: 'fecha de Aprobación',
        cell: ({ getValue }) => (getValue().toDateString())
	}),
	// helper.accessor("descripcion", {
    //     header: 'Descripcion',
	// }),
	helper.display({
		id: "actions",
		cell: ({ row }) => {
			const id = row.getValue("id") as string;

			return <VariantesActions
            //   cursoId={id} 
            //   showDelete={true} 
            />;
		},
	}),
];

function VariantesActions() {
    return (
        <span>ola</span>
    )
}
// function Actions(props: { cursoId: string; showDelete: boolean }) {
// 	const { replaceSet, router } = useMutateSearchParams();

// 	return (
// 		<DropdownMenu>
// 			<DropdownMenuTrigger asChild>
// 				<Button>Acciones</Button>
// 			</DropdownMenuTrigger>
// 			<DropdownMenuContent className='w-56'>
// 				<DropdownMenuItem
// 					onClick={() => replaceSet(cursosParams.update, props.cursoId)}
// 				>
// 					<FileSignature className='mr-2 h-4 w-4' />
// 					<span>Editar</span>
// 				</DropdownMenuItem>
// 				<DropdownMenuItem
// 					onClick={() => router.push(ROUTES.configCurso.variantes(props.cursoId))}
// 				>
// 					<StretchHorizontal className='mr-2 h-4 w-4' />
// 					<span>Variantes</span>
// 				</DropdownMenuItem>
// 				<DropdownMenuItem
// 					onClick={() => replaceSet(cursosParams.deactivate, props.cursoId)}
// 				>
// 					<Lock className='mr-2 h-4 w-4' />
// 					<span>Desactivar</span>
// 				</DropdownMenuItem>
// 			</DropdownMenuContent>
// 		</DropdownMenu>
// 	);
// }
