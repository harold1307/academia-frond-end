"use client";
import { createColumnHelper } from "@tanstack/react-table";
import { StretchHorizontal } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { format } from "date-fns";

import StatusButtonTooltip from "@/app/_components/table/status-button-tooltip";
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
	// cursoPrevio: boolean;
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
		cell: ({ getValue }) => format(new Date(getValue()), "dd-MM-yyyy"),
	}),
	helper.accessor("materiasCount", {
		header: "Materias",
	}),
	helper.accessor("cursosCount", {
		header: "Cursos",
	}),
	helper.accessor("registroExterno", {
		header: "Registro externo",
		cell: ({ getValue, column }) => (
			<StatusButtonTooltip
				status={getValue()}
				hoverTitle={column.columnDef.header as string}
			/>
		),
	}),
	helper.accessor("registroInterno", {
		header: "Registro interno",
		cell: ({ getValue, column }) => (
			<StatusButtonTooltip
				status={getValue()}
				hoverTitle={column.columnDef.header as string}
			/>
		),
	}),
	helper.accessor("registroOtraSede", {
		header: "Registro otra sede",
		cell: ({ getValue, column }) => (
			<StatusButtonTooltip
				status={getValue()}
				hoverTitle={column.columnDef.header as string}
			/>
		),
	}),
	helper.accessor("costoPorMateria", {
		header: "Costo x materia",
		cell: ({ getValue, column }) => (
			<StatusButtonTooltip
				status={getValue()}
				hoverTitle={column.columnDef.header as string}
			/>
		),
	}),
	// helper.accessor("costoPorMaterias", {
	// 	header: "Costo x materias",
	// }),
	helper.accessor("verificaSesion", {
		header: "Verifica sesion",
		cell: ({ getValue, column }) => (
			<StatusButtonTooltip
				status={getValue()}
				hoverTitle={column.columnDef.header as string}
			/>
		),
	}),
	helper.accessor("rangoEdad", {
		header: "Rango de edad",
		cell: ({ getValue, column }) => (
			<StatusButtonTooltip
				status={getValue()}
				hoverTitle={column.columnDef.header as string}
			/>
		),
	}),
	helper.accessor("edadMinima", {
		header: "Edad minima",
	}),
	helper.accessor("edadMaxima", {
		header: "Edad maxima",
	}),
	helper.accessor("requisitosMalla", {
		header: "Requisitos malla",
		cell: ({ getValue, column }) => (
			<StatusButtonTooltip
				status={getValue()}
				hoverTitle={column.columnDef.header as string}
			/>
		),
	}),
	helper.accessor("pasarRecord", {
		header: "Pasar al record",
		cell: ({ getValue, column }) => (
			<StatusButtonTooltip
				status={getValue()}
				hoverTitle={column.columnDef.header as string}
			/>
		),
	}),
	// helper.accessor("cursoPrevio", {
	// 	header: "Curso previo",
	// 	cell: ({ getValue, column }) => (
	// 		<StatusButtonTooltip
	// 			status={getValue()}
	// 			hoverTitle={column.columnDef.header as string}
	// 		/>
	// 	),
	// }),
	helper.accessor("nivelMinimo", {
		header: "Nivel minimo",
		cell: ({ getValue, column }) => (
			<StatusButtonTooltip
				status={getValue()}
				hoverTitle={column.columnDef.header as string}
			/>
		),
	}),
	helper.accessor("enUso", {
		header: "En uso",
		cell: ({ getValue, column }) => (
			<StatusButtonTooltip
				status={getValue()}
				hoverTitle={column.columnDef.header as string}
			/>
		),
	}),
	helper.accessor("activa", {
		header: "Activa",
		cell: ({ getValue, column }) => (
			<StatusButtonTooltip
				status={getValue()}
				hoverTitle={column.columnDef.header as string}
			/>
		),
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
	update: "actualizarVariante",
	deactivate: "desactivarVariante",
};

function Actions({ varianteCursoId }: { varianteCursoId: string }) {
	const router = useRouter();
	const pathname = usePathname();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button>Acciones</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-56'>
				<DropdownMenuItem
					onClick={() => {
						console.log(pathname);
						router.push(pathname + ROUTES.curso.programas(varianteCursoId));
					}}
				>
					<StretchHorizontal className='mr-2 h-4 w-4' />
					<span>Programas</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() =>
						router.push(pathname + ROUTES.curso.materias(varianteCursoId))
					}
				>
					<StretchHorizontal className='mr-2 h-4 w-4' />
					<span>Materias</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() =>
						router.push(pathname + ROUTES.curso.costos(varianteCursoId))
					}
				>
					<StretchHorizontal className='mr-2 h-4 w-4' />
					<span>Costos</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
