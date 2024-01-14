"use client";
import { createColumnHelper } from "@tanstack/react-table";
import { GripHorizontal, StretchHorizontal } from "lucide-react";
import { useParams, usePathname, useRouter } from "next/navigation";

import { Button } from "@/app/_components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { ROUTES } from "@/core/routes";

export type VarianteCursoTableItem = {
	id: string;
	nombre: string;
	codigo: string;
	aprobada: string;
	materiasCount: number; // viene de asignaciones en variantes de curso
	cursosCount: number; // viene de cursos y escuelas
	registroExterno: boolean;
	registroInterno: boolean;
	registroOtraSede: boolean;
	costoPorMateria: boolean;
	// costoPorMaterias: boolean;
	verificaSesion: boolean;
	rangoEdad: boolean;
	edadMinima: number | null;
	edadMaxima: number | null;
	requisitosMalla: boolean;
	pasarRecord: boolean;
	cursoPrevio: boolean;
	nivelMinimo: boolean;
	enUso: boolean;
	activa: boolean;
};

const helper = createColumnHelper<VarianteCursoTableItem>();

export const columns = [
	helper.accessor("id", {}),
	helper.accessor("nombre", {
		header: "Nombre / Nivel",
	}),
	helper.accessor("codigo", {
		header: "Codigo",
	}),
	helper.accessor("aprobada", {
		header: "Aprobada",
	}),
	helper.accessor("materiasCount", {
		header: "Materias",
	}),
	helper.accessor("cursosCount", {
		header: "Cursos",
	}),
	helper.accessor("registroExterno", {
		header: "Registro externo",
	}),
	helper.accessor("registroInterno", {
		header: "Registro interno",
	}),
	helper.accessor("registroOtraSede", {
		header: "Registro otra sede",
	}),
	helper.accessor("costoPorMateria", {
		header: "Costo x materia",
	}),
	// helper.accessor("costoPorMaterias", {
	// 	header: "Costo x materias",
	// }),
	helper.accessor("verificaSesion", {
		header: "Verifica sesion",
	}),
	helper.accessor("rangoEdad", {
		header: "Rango de edad",
	}),
	helper.accessor("edadMinima", {
		header: "Edad minima",
	}),
	helper.accessor("edadMaxima", {
		header: "Edad maxima",
	}),
	helper.accessor("requisitosMalla", {
		header: "Requisitos malla",
	}),
	helper.accessor("pasarRecord", {
		header: "Pasar al record",
	}),
	helper.accessor("cursoPrevio", {
		header: "Curso previo",
	}),
	helper.accessor("nivelMinimo", {
		header: "Nivel minimo",
	}),
	helper.accessor("enUso", {
		header: "En uso",
	}),
	helper.accessor("activa", {
		header: "Activa",
	}),
	helper.display({
		id: "actions",
		cell: ({ row }) => {
			const id = row.getValue("id") as string;

			return <Actions varianteCursoId={id} />;
		},
	}),
];

export const variantesParams = {
	update: 'actualizarVariante',
	deactivate: 'desactivarVariante',

}

function Actions({ varianteCursoId }: { varianteCursoId: string }) {
	const router = useRouter();
	const { cursoId } = useParams<{ cursoId: string }>();
  const pathname = usePathname()
  
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button>Acciones</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-56'>
				<DropdownMenuItem
					onClick={() => {
						console.log(pathname)
						router.push(pathname + ROUTES.curso.programas(varianteCursoId))}
					}
				>
					<StretchHorizontal className='mr-2 h-4 w-4' />
					<span>programas</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => router.push(pathname + ROUTES.curso.materias(varianteCursoId))}
				>
					<StretchHorizontal className='mr-2 h-4 w-4' />
					<span>Materias</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => router.push(pathname + ROUTES.curso.costos(varianteCursoId))}
				>
					<StretchHorizontal className='mr-2 h-4 w-4' />
					<span>Costos</span>
				</DropdownMenuItem>
				<DropdownMenuItem
				 //onClick={() => onClick(cursosParams.update, props.cursoId)}
				>
					<GripHorizontal className='mr-2 h-4 w-4' />
					<span>Programas</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() =>
						router.push(
							ROUTES.curso.asignaturasVariantes(cursoId, varianteCursoId),
						)
					}
				>
					<GripHorizontal className='mr-2 h-4 w-4' />
					<span>Materias</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
