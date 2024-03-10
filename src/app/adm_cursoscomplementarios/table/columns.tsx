import { createColumnHelper } from "@tanstack/react-table";

import StatusButtonTooltip from "@/app/_components/table/status-button-tooltip";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { formatDate } from "@/utils";
import { Button } from "@/app/_components/ui/button";
import { useMutateSearchParams } from "@/hooks/use-mutate-search-params";
import { cursosEscuelaParams } from "../add-curso-escuela";
import {
	FileSignature,
	Folder,
	FolderOpen,
	StretchHorizontal,
	X,
} from "lucide-react";
import { ROUTES } from "@/core/routes";

export type CursoEscuelaTableItem = {
	id: string;
	cursoCodigoSesion: {
		curso: string;
		sesion: string;
		codigo: string;
	};
	inicioFinLimite: {
		inicio: string;
		fin: string;
		limite: string;
	};
	profesoresAulasParaleloNivel: {
		profesores: string[];
		aulas: string[];
		paralelos: string;
		nivel: string;
	};
	cupo: number;
	registrados: number;
	retirados: number;
	materias: number;
	costo: boolean;
	costoPorMateria: boolean;
	pasarRecord: boolean;
	preRequisito: boolean;
	evaluaProfesor: boolean;
	registroExterno: boolean;
	registroInterno: boolean;
	registroDesdeOtraSede: boolean;
	verificaSesion: boolean;
	especificaEdad: boolean;
	edadMinima: number | null;
	edadMaxima: number | null;
	diasVencimiento: number;
	legalizar: boolean;
	evaluacion: boolean;
	autoregistro: boolean;

	estado: boolean;
};

const helper = createColumnHelper<CursoEscuelaTableItem>();

export const columns = [
	helper.accessor("id", {}),
	helper.accessor("estado", {}),
	helper.accessor("cursoCodigoSesion", {
		header: "Curso / Codigo / Sesion",
		cell: ({ getValue }) => {
			const { curso, codigo, sesion } = getValue();
			return `${curso} - ${codigo} - ${sesion}`;
		},
	}),
	helper.accessor("inicioFinLimite", {
		header: "Inicio / Fin / Limite",
		cell: function Dates({ getValue }) {
			const obj = getValue();

			return (
				<div>
					{Object.values(obj).map((v, idx) => (
						<div key={idx}>
							{formatDate(v, {
								day: "2-digit",
								month: "2-digit",
								year: "numeric",
							})}
						</div>
					))}
				</div>
			);
		},
	}),
	helper.accessor("profesoresAulasParaleloNivel", {
		header: "Profesores / Aulas / Paralelos / Nivel",
		cell: ({ getValue }) => {
			const _ = getValue();

			return "m";
		},
	}),
	helper.accessor("cupo", {
		header: "Cupo",
	}),
	helper.accessor("registrados", {
		header: "Registrados",
	}),
	helper.accessor("retirados", {
		header: "Retirados",
	}),
	helper.accessor("materias", {
		header: "Materias",
	}),
	helper.accessor("costo", {
		header: "Costo",
		cell: ({ getValue, column }) => (
			<StatusButtonTooltip
				status={getValue()}
				hoverTitle={column.columnDef.header as string}
			/>
		),
	}),
	helper.accessor("costoPorMateria", {
		header: "Costo por materia",
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
	helper.accessor("preRequisito", {
		header: "Pre requisito",
		cell: ({ getValue, column }) => (
			<StatusButtonTooltip
				status={getValue()}
				hoverTitle={column.columnDef.header as string}
			/>
		),
	}),
	helper.accessor("evaluaProfesor", {
		header: "Se evalua al profesor",
		cell: ({ getValue, column }) => (
			<StatusButtonTooltip
				status={getValue()}
				hoverTitle={column.columnDef.header as string}
			/>
		),
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
	helper.accessor("registroDesdeOtraSede", {
		header: "Registro desde otra sede",
		cell: ({ getValue, column }) => (
			<StatusButtonTooltip
				status={getValue()}
				hoverTitle={column.columnDef.header as string}
			/>
		),
	}),
	helper.accessor("verificaSesion", {
		header: "Verifica sesion",
		cell: ({ getValue, column }) => (
			<StatusButtonTooltip
				status={getValue()}
				hoverTitle={column.columnDef.header as string}
			/>
		),
	}),
	helper.accessor("especificaEdad", {
		header: "Especifica edad",
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
	helper.accessor("diasVencimiento", {
		header: "Dias vencimiento",
	}),
	helper.accessor("legalizar", {
		header: "Legalizar",
		cell: ({ getValue, column }) => (
			<StatusButtonTooltip
				status={getValue()}
				hoverTitle={column.columnDef.header as string}
			/>
		),
	}),
	helper.accessor("evaluacion", {
		header: "Evaluacion",
		cell: ({ getValue, column }) => (
			<StatusButtonTooltip
				status={getValue()}
				hoverTitle={column.columnDef.header as string}
			/>
		),
	}),
	helper.accessor("autoregistro", {
		header: "Auto registro",
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
			const estado = row.getValue("estado") as boolean;

			return <Actions cursoId={id} showDelete={true} isActive={estado} />;
		},
	}),
];

function Actions({
	isActive,
	cursoId,
	showDelete,
}: {
	cursoId: string;
	showDelete: boolean;
	isActive: boolean;
}) {
	const { replaceSet, router } = useMutateSearchParams();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button>Acciones</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-56'>
				<DropdownMenuItem
					onClick={() => replaceSet(cursosEscuelaParams.update, cursoId)}
				>
					<FileSignature className='mr-2 h-4 w-4' />
					<span>Editar</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => replaceSet(cursosEscuelaParams.deactivate, cursoId)}
				>
					{isActive ? (
						<>
							<Folder className='mr-2 h-4 w-4' />
							<span>Cerrar</span>
						</>
					) : (
						<>
							<FolderOpen className='mr-2 h-4 w-4' />
							<span>Abrir</span>
						</>
					)}
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => router.push(ROUTES.cursoEscuelas.programas(cursoId))}
				>
					<StretchHorizontal className='mr-2 h-4 w-4' />
					<span>Programas</span>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					onClick={() => replaceSet(cursosEscuelaParams.delete, cursoId)}
				>
					<X className='mr-2 h-4 w-4' />
					<span>Eliminar</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
