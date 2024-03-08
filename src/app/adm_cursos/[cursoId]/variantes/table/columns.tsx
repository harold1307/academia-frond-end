"use client";
import { useMutation } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";
import { format } from "date-fns";
import { Lock, StretchHorizontal, Unlock } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import StatusButtonTooltip from "@/app/_components/table/status-button-tooltip";
import { Button } from "@/app/_components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { useToast } from "@/app/_components/ui/use-toast";
import { API } from "@/core/api-client";
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
			const status = row.getValue("activa") as boolean;

			return <Actions varianteCursoId={id} status={status} />;
		},
	}),
];

export const variantesParams = {
	update: "actualizarVariante",
	deactivate: "desactivarVariante",
};

function Actions({
	varianteCursoId,
	status,
}: {
	varianteCursoId: string;
	status: boolean;
}) {
	const { toast } = useToast();
	const router = useRouter();
	const pathname = usePathname();

	const { mutate } = useMutation({
		mutationFn: (estado: boolean) => {
			return API.variantesCurso.update({ varianteCursoId, data: { estado } });
		},
		onSuccess: data => {
			toast({
				title: `Variante ${data.data.estado ? "activada" : "desactivada"}`,
			});
			router.refresh();
		},
		onError: err => {
			toast({
				title: "Error",
				description: err.message,
				variant: "destructive",
			});
		},
	});

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
				<DropdownMenuItem onClick={() => mutate(!status)}>
					{status ? (
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
				{/* <DropdownMenuSeparator /> */}
				{/* <DropdownMenuItem
					onClick={() => replaceSet(mallaParams.delete, props.mallaId)}
				>
					<X className='mr-2 h-4 w-4' />
					<span>Eliminar</span>
				</DropdownMenuItem> */}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
