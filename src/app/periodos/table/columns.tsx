import { createColumnHelper } from "@tanstack/react-table";
import {
	Banknote,
	Clock3,
	FileSignature,
	List,
	RefreshCw,
	Repeat2,
	UnlockKeyhole,
} from "lucide-react";

import { Button } from "@/app/_components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { periodoParams } from "../addPeriodo";
import { useMutateSearchParams } from "@/hooks/use-mutate-search-params";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/core/routes";

const helper = createColumnHelper<any>();
export const columns = [
	helper.accessor("id", {}),
	helper.accessor("nombreTipoCorte", {
		header: "Nombre/Tipo/Corte",
	}),
	helper.accessor("inicio", {
		header: "inicio",
	}),
	helper.accessor("fin", {
		header: "Fin",
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
		header: "Aprob. Planificaciòn",
		cell: ({ getValue }) => (getValue() ? "SI" : "NO"),
	}),
	helper.accessor("NotasCoord", {
		header: "Notas por coordinaciòn",
		cell: ({ getValue }) => (getValue() ? "SI" : "NO"),
	}),
	helper.accessor("AutoExtraordinaria", {
		header: "Automat. extraordinaria",
		cell: ({ getValue }) => (getValue() ? "SI" : "NO"),
	}),
	helper.accessor("AutoArrastre", {
		header: "Automat. con arrastre",
		cell: ({ getValue }) => (getValue() ? "SI" : "NO"),
	}),
	helper.accessor("AutoSecMatriculas", {
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

			return <Actions periodoId={id} />;
		},
	}),
];

function Actions(props: { periodoId: string }) {
	const { replaceSet } = useMutateSearchParams();
	const router = useRouter();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button>Acciones</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-56'>
				<DropdownMenuItem
					onClick={() => replaceSet(periodoParams.update, props.periodoId)}
				>
					<FileSignature className='mr-2 h-4 w-4' />
					<span>Editar</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() =>
						router.push(ROUTES.periodo.traduccion(props.periodoId))
					}
				>
					<List className='mr-2 h-4 w-4' />
					<span>Traducciòn</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => replaceSet(periodoParams.actividades, props.periodoId)}
				>
					<FileSignature className='mr-2 h-5 w-5' />
					<span>Tipos de actividades distributivo</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => replaceSet(periodoParams.costos, props.periodoId)}
				>
					<Banknote className='mr-2 h-4 w-4' />
					<span>Formato de costos</span>
				</DropdownMenuItem>
				<DropdownMenuItem>
					<Clock3 className='mr-2 h-4 w-4' />
					<span>Cronograma matriculas</span>
				</DropdownMenuItem>
				<DropdownMenuItem>
					<List className='mr-2 h-4 w-4' />
					<span>Requisitos matricula</span>
				</DropdownMenuItem>
				<DropdownMenuItem>
					<List className='mr-2 h-4 w-4' />
					<span>Subperiodos</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => replaceSet(periodoParams.importar, props.periodoId)}
				>
					<Repeat2 className='mr-2 h-4 w-4' />
					<span>Importar planificaciòn</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => replaceSet(periodoParams.habilitar, props.periodoId)}
				>
					<UnlockKeyhole className='mr-2 h-4 w-4' />
					<span>Habilitar matriculas</span>
				</DropdownMenuItem>
				<DropdownMenuItem>
					<Banknote className='mr-2 h-4 w-4' />
					<span>Matriculas no legalizadas</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => replaceSet(periodoParams.actualizarCalif, props.periodoId)}
				>
					<RefreshCw className='mr-2 h-4 w-4' />
					<span>Actualizar calificaciones</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
