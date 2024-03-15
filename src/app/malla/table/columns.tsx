import { createColumnHelper } from "@tanstack/react-table";
import { FileSignature, GripHorizontal, X } from "lucide-react";

import StatusButtonTooltip from "@/app/_components/table/status-button-tooltip";
import { Button } from "@/app/_components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { ROUTES } from "@/core/routes";
import { useMutateSearchParams } from "@/hooks/use-mutate-search-params";
import { formatDate } from "@/utils";
import { mallaParams } from "../add-malla";

export type MallaCurricularTableItem = {
	id: string;
	modalidad: string;
	tituloObtenido: string;
	codigo: string | null;
	creditos: number;
	totalHoras: number;
	horasMaterias: number;
	horasProyectoIntegrador: number;
	horasPracticasPreprofesionales: number;
	horasPracticasComunitarias: number;
	niveles: number;
	materias: number;
	materiasAdelantar: number | null;
	modulos: number;
	alumnos: number;
	vigencia: {
		fechaAprobacion: Date;
		fechaLimiteVigencia: Date;
	};
	esVigente: boolean;
	nivelacion: boolean;
	egresan: boolean;
	graduan: boolean;
	tieneMecanismoTitulacion: boolean;
	enUso: boolean;
	activa: boolean;
};

const helper = createColumnHelper<MallaCurricularTableItem>();

export const columns = [
	helper.accessor("id", {}),
	helper.accessor("modalidad", {
		header: "Modalidad",
	}),
	helper.accessor("tituloObtenido", {
		header: "Titulo obtenido",
	}),
	helper.accessor("codigo", {
		header: "Codigo",
	}),
	helper.accessor("creditos", {
		header: "Creditos",
	}),
	helper.accessor("totalHoras", {
		header: "Horas totales",
	}),
	helper.accessor("horasMaterias", {
		header: "Horas materias",
	}),
	helper.accessor("horasProyectoIntegrador", {
		header: "P. integradores",
	}),
	helper.accessor("horasPracticasPreprofesionales", {
		header: "P. preprofesionales",
	}),
	helper.accessor("horasPracticasComunitarias", {
		header: "P. comunitarias",
	}),
	helper.accessor("niveles", {
		header: "Niveles",
	}),
	helper.accessor("materias", {
		header: "Materias",
	}),
	helper.accessor("materiasAdelantar", {
		header: "Materias adelantar",
	}),
	helper.accessor("modulos", {
		header: "Modulos",
	}),
	helper.accessor("vigencia", {
		header: "Aprobada",
		cell: ({ cell }) => {
			const { fechaAprobacion, fechaLimiteVigencia } = cell.getValue();
			return (
				<>
					<div>
						{formatDate(fechaAprobacion, {
							day: "2-digit",
							month: "2-digit",
							year: "numeric",
						})}
					</div>
					<div>
						{formatDate(fechaLimiteVigencia, {
							day: "2-digit",
							month: "2-digit",
							year: "numeric",
						})}
					</div>
				</>
			);
		},
	}),
	helper.accessor("alumnos", {
		header: "Alumnos",
	}),
	helper.accessor("esVigente", {
		header: "Vigente",
		cell: ({ getValue, column }) => (
			<StatusButtonTooltip
				status={getValue()}
				hoverTitle={column.columnDef.header as string}
			/>
		),
	}),
	helper.accessor("nivelacion", {
		header: "Nivelacion",
		cell: ({ getValue, column }) => (
			<StatusButtonTooltip
				status={getValue()}
				hoverTitle={column.columnDef.header as string}
			/>
		),
	}),
	helper.accessor("egresan", {
		header: "Egresan",
		cell: ({ getValue, column }) => (
			<StatusButtonTooltip
				status={getValue()}
				hoverTitle={column.columnDef.header as string}
			/>
		),
	}),
	helper.accessor("graduan", {
		header: "Graduan",
		cell: ({ getValue, column }) => (
			<StatusButtonTooltip
				status={getValue()}
				hoverTitle={column.columnDef.header as string}
			/>
		),
	}),
	helper.accessor("tieneMecanismoTitulacion", {
		header: "Tiene mecanismo de titulacion",
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
			const enUso = row.getValue("enUso") as boolean;

			return <Actions mallaId={id} showDelete={!enUso} />;
		},
	}),
];

function Actions(props: { mallaId: string; showDelete: boolean }) {
	const { replaceSet, router } = useMutateSearchParams();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button>Acciones</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-56'>
				<DropdownMenuItem
					onClick={() => replaceSet(mallaParams.update, props.mallaId)}
				>
					<FileSignature className='mr-2 h-4 w-4' />
					<span>Editar</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() =>
						router.push(ROUTES.malla.asignaturasEnMalla(props.mallaId))
					}
				>
					<GripHorizontal className='mr-2 h-4 w-4' />
					<span>Asignaturas</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() =>
						router.push(ROUTES.malla.lugaresEjecucion(props.mallaId))
					}
				>
					<GripHorizontal className='mr-2 h-4 w-4' />
					<span>Lugares de ejecucion</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => router.push(ROUTES.malla.modulos(props.mallaId))}
				>
					<GripHorizontal className='mr-2 h-4 w-4' />
					<span>Modulos</span>
				</DropdownMenuItem>
				{props.showDelete && (
					<>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={() => replaceSet(mallaParams.delete, props.mallaId)}
						>
							<X className='mr-2 h-4 w-4' />
							<span>Eliminar</span>
						</DropdownMenuItem>
					</>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
