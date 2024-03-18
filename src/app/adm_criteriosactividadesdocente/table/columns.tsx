import { createColumnHelper } from "@tanstack/react-table";
import { GripHorizontal, Repeat2, X } from "lucide-react";

import StatusButtonTooltip from "@/app/_components/table/status-button-tooltip";
import { Button } from "@/app/_components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";

export type CriterioActividadDocenteTableItem = {
	id: string;
	nombre: string;
	identificacion: string;
	dedicacionRelacionLaboralCargo: string;
	escalafon: string;
	conMeritos: boolean;
	estudio: boolean;
	beca: boolean;
	salario: number;
	docencia: {
		horas: number;
		criterios: number;
	};
	investigacion: {
		horas: number;
		criterios: number;
	};
	gestion: {
		horas: number;
		criterios: number;
	};
	practicasComunitarias: {
		horas: number;
		criterios: number;
	};
	practicasPreProfesionales: {
		horas: number;
		criterios: number;
	};
	totalHoras: number;
	materias: number;
	portafolio: number;
};

const helper = createColumnHelper<CriterioActividadDocenteTableItem>();

export const columns = [
	helper.accessor("id", {}),
	helper.accessor("nombre", {
		header: "Nombre",
	}),
	helper.accessor("identificacion", {
		header: "Identificación",
	}),
	helper.accessor("dedicacionRelacionLaboralCargo", {
		header: "Dedicación",
	}),
	helper.accessor("escalafon", {
		header: "Escalafón",
	}),
	helper.accessor("conMeritos", {
		header: "C. méritos",
		cell: ({ getValue, column }) => (
			<StatusButtonTooltip
				status={getValue()}
				hoverTitle={column.columnDef.header as string}
			/>
		),
	}),
	helper.accessor("estudio", {
		header: "Estudio",
		cell: ({ getValue, column }) => (
			<StatusButtonTooltip
				status={getValue()}
				hoverTitle={column.columnDef.header as string}
			/>
		),
	}),
	helper.accessor("beca", {
		header: "Beca",
		cell: ({ getValue, column }) => (
			<StatusButtonTooltip
				status={getValue()}
				hoverTitle={column.columnDef.header as string}
			/>
		),
	}),
	helper.accessor("salario", {
		header: "Salario",
	}),
	helper.group({
		header: "Docencia",
		columns: [
			helper.accessor("docencia.horas", {
				header: "Horas",
			}),
			helper.accessor("docencia.criterios", {
				header: "Criterios",
			}),
		],
	}),
	helper.group({
		header: "Investigación",
		columns: [
			helper.accessor("investigacion.horas", {
				header: "Horas",
			}),
			helper.accessor("investigacion.criterios", {
				header: "Criterios",
			}),
		],
	}),
	helper.group({
		header: "Gestión",
		columns: [
			helper.accessor("gestion.horas", {
				header: "Horas",
			}),
			helper.accessor("gestion.criterios", {
				header: "Criterios",
			}),
		],
	}),
	helper.group({
		header: "Prácticas comunitarias",
		columns: [
			helper.accessor("practicasComunitarias.horas", {
				header: "Horas",
			}),
			helper.accessor("practicasComunitarias.criterios", {
				header: "Criterios",
			}),
		],
	}),
	helper.group({
		header: "Prácticas preprofesionales",
		columns: [
			helper.accessor("practicasPreProfesionales.horas", {
				header: "Horas",
			}),
			helper.accessor("practicasPreProfesionales.criterios", {
				header: "Criterios",
			}),
		],
	}),
	helper.accessor("totalHoras", {
		header: "Total horas",
	}),
	helper.accessor("materias", {
		header: "Materias",
	}),
	helper.accessor("portafolio", {
		header: "Portafolio",
	}),
	helper.display({
		id: "actions",
		cell: ({ row }) => {
			const id = row.getValue("id") as string;
			// const enUso = row.getValue("enUso") as boolean;

			return <Actions docenteId={id} showDelete={true} />;
		},
	}),
];

function Actions({
	docenteId,
	showDelete,
}: {
	docenteId: string;
	showDelete: boolean;
}) {
	// const { replaceSet, router } = useMutateSearchParams();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button>Acciones</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-56'>
				<DropdownMenuItem
				// onClick={() => replaceSet(mallaParams.update, props.docenteId)}
				>
					<GripHorizontal className='mr-2 h-4 w-4' />
					<span>Criterios</span>
				</DropdownMenuItem>
				<DropdownMenuItem
				// onClick={() =>
				// 	router.push(ROUTES.malla.asignaturasEnMalla(props.docenteId))
				// }
				>
					<GripHorizontal className='mr-2 h-4 w-4' />
					<span>Materias</span>
				</DropdownMenuItem>
				<DropdownMenuItem
				// onClick={() =>
				// 	router.push(ROUTES.malla.lugaresEjecucion(props.docenteId))
				// }
				>
					<GripHorizontal className='mr-2 h-4 w-4' />
					<span>Carga semanal</span>
				</DropdownMenuItem>
				<DropdownMenuItem
				// onClick={() => router.push(ROUTES.malla.modulos(props.docenteId))}
				>
					<Repeat2 className='mr-2 h-4 w-4' />
					<span>Cambio datos distributivo</span>
				</DropdownMenuItem>
				<DropdownMenuItem
				// onClick={() => router.push(ROUTES.malla.modulos(props.docenteId))}
				>
					<Repeat2 className='mr-2 h-4 w-4' />
					<span>Cambio coordinacion</span>
				</DropdownMenuItem>
				{showDelete && (
					<>
						<DropdownMenuSeparator />
						<DropdownMenuItem
						// onClick={() => replaceSet(mallaParams.delete, docenteId)}
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
