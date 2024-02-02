import type { MallaCurricular } from "@prisma/client";
import { createColumnHelper } from "@tanstack/react-table";
import { format } from "date-fns";
import { FileSignature, GripHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/app/_components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { ROUTES } from "@/core/routes";

export type MallaCurricularTableItem = Omit<
	MallaCurricular,
	"createdAt" | "fechaAprobacion" | "fechaLimiteVigencia"
> & {
	credits: number;
	coursesCount: number;
	totalHours: number;
	coursesHours: number;
	approved: {
		fechaAprobacion: Date;
		fechaLimiteVigencia: Date;
	};
	isCurrent: boolean;
	isUsed: boolean;
	modulesCount: number;
	onlineCoursesCount: number;
	studentsUsingCount: number;
};

const helper = createColumnHelper<any>();

export const columns = [
	helper.accessor("id", {}),
	helper.accessor("nombreTipoCorte", {
		header: "Nombre/Tipo/Corte",
	}),
	helper.accessor("inicio", {
		header: "inicio",
		/* cell: ({ cell }) => {
			const { fechaAprobacion, fechaLimiteVigencia } = cell.getValue();
			return (
				<>
					<div>{format(fechaAprobacion, "dd/LL/yyyy")}</div>
					<div>{format(fechaLimiteVigencia, "dd/LL/yyyy")}</div>
				</>
			);
		}, */
	}),
	helper.accessor("fin", {
		header: "Fin",
		/* cell: ({ cell }) => {
			const { fechaAprobacion, fechaLimiteVigencia } = cell.getValue();
			return (
				<>
					<div>{format(fechaAprobacion, "dd/LL/yyyy")}</div>
					<div>{format(fechaLimiteVigencia, "dd/LL/yyyy")}</div>
				</>
			);
		}, */
	}),
	helper.accessor("inscritos", {
		header: "Inscritos",
	}),
	helper.accessor("materias", {
		header: "Materias",
	}),
	helper.accessor("matriculas", {
		header: "Matriculas",
	}),
	helper.accessor("fechaMatriculas", {
		header: "Fecha de matriculas",
	}),
	helper.accessor("matriculacion", {
		header: "Matriculaciòn",
	}),
	helper.accessor("estrucuraNivel", {
		header: "Estructura por nivel",
	}),
	helper.accessor("nivelacion", {
		header: "Nivelaciòn",
	}),
	helper.accessor("legalizarMatricula", {
		header: "Legalizar Matricula",
	}),
	helper.accessor("legalizacionPago", {
		header: "Legalizaciòn por pago",
	}),
	helper.accessor("cerrado", {
		header: "Cerrado",
	}),
	helper.accessor("vigente", {
		header: "Vigente",
	}),
	helper.accessor("planifCargaHoraria", {
		header: "Planif. carga horaria",
	}),
	helper.accessor("planifProfObl", {
		header: "Planif. profesores obl.",
		cell: ({ getValue }) => (getValue() ? "SI" : "NO"),
	}),
	helper.accessor("planifProfTotal", {
		header: "Planif. profesores total",
		cell: ({ getValue }) => (getValue() ? "SI" : "NO"),
	}),
	helper.accessor("AprobPlanif", {
		header: "Notas por coordinaciòn",
		cell: ({ getValue }) => (getValue() ? "SI" : "NO"),
	}),
	helper.accessor("NotasCoord", {
		header: "Automat. extraordinaria",
		cell: ({ getValue }) => (getValue() ? "SI" : "NO"),
	}),
	helper.accessor("AutoExtraordinaria", {
		header: "Automat. con arrastre",
		cell: ({ getValue }) => (getValue() ? "SI" : "NO"),
	}),
	helper.accessor("AutoArrastre", {
		header: "Automat. 2das matriculas",
		cell: ({ getValue }) => (getValue() ? "SI" : "NO"),
	}),
	helper.accessor("matricula", {
		header: "# matricula",
		cell: ({ getValue }) => (getValue() ? "SI" : "NO"),
	}),
	helper.accessor("AutoMatriculas", {
		header: "# matricula automatica",
		cell: ({ getValue }) => (getValue() ? "SI" : "NO"),
	}),
	helper.accessor("matriculaLegal", {
		header: "# matricula al legalizar",
		cell: ({ getValue }) => (getValue() ? "SI" : "NO"),
	}),
	helper.accessor("Secuencia", {
		header: "Secuencia # especifico",
		cell: ({ getValue }) => (getValue() ? "SI" : "NO"),
	}),
	helper.accessor("EvaluacionDocente", {
		header: "Evaluaciòn al docente",
		cell: ({ getValue }) => (getValue() ? "SI" : "NO"),
	}),
	helper.accessor("CostoSeccion", {
		header: "Costos por sesiòn",
		cell: ({ getValue }) => (getValue() ? "SI" : "NO"),
	}),
	helper.accessor("PlanCostos", {
		header: "Plan de costos",
		cell: ({ getValue }) => (getValue() ? "SI" : "NO"),
	}),
	helper.accessor("Activo", {
		header: "Activo",
		cell: ({ getValue }) => (getValue() ? "SI" : "NO"),
	}),
	helper.display({
		id: "actions",
		cell: ({ row }) => {
			const id = row.getValue("id") as string;

			return <Actions mallaId={id} />;
		},
	}),
];

function Actions(props: { mallaId: string }) {
	const router = useRouter();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button>Acciones</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-56'>
				<DropdownMenuItem
				// onClick={() => onClick(cursosParams.update, props.cursoId)}
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
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
