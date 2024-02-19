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
import { format, parseISO } from "date-fns";

const helper = createColumnHelper<any>();

export const columns = [
	helper.accessor("id", {}),
	helper.accessor("nombre", {
		header: "Nombre/Tipo/Corte",
	}),
	helper.accessor("inicio", {
		header: "Inicio",
		cell: ({ cell }) => {
			const inicio = cell.getValue();
			return (
				<>
					<div>{format(parseISO(inicio), "dd/LL/yyyy")}</div>
				</>
			);
		},
	}),
	helper.accessor("fin", {
		header: "Fin",
		cell: ({ cell }) => {
			const fin = cell.getValue();
			return (
				<>
					<div>{format(parseISO(fin), "dd/LL/yyyy")}</div>
				</>
			);
		},
	}),
	helper.accessor("undefined", {
		header: "Inscritos",
	}),
	helper.accessor("undefined", {
		header: "Materias",
	}),
	helper.accessor("undefined", {
		header: "Matriculas",
	}),
	helper.accessor("fechaMatriculas", {
		header: "Fecha de matriculas",
	}),
	helper.accessor("matriculas", {
		header: "Matriculaciòn",
		cell: ({ getValue }) => (getValue() ? "SI" : "NO"),
	}),
	helper.accessor("estructuraParalelosAgrupadosPorNivel", {
		header: "Estructura por nivel",
		cell: ({ getValue }) => (getValue() ? "SI" : "NO"),
	}),
	helper.accessor("seImpartioNivelacion", {
		header: "Nivelaciòn",
		cell: ({ getValue }) => (getValue() ? "SI" : "NO"),
	}),
	helper.accessor("legalizarMatriculas", {
		header: "Legalizar Matricula",
		cell: ({ getValue }) => (getValue() ? "SI" : "NO"),
	}),
	helper.accessor("legalizacionAutomaticaContraPagos", {
		header: "Legalizaciòn por pago",
		cell: ({ getValue }) => (getValue() ? "SI" : "NO"),
	}),
	helper.accessor("abierto", {
		header: "Cerrado",
		cell: ({ getValue }) => (getValue() ? "NO" : "SI"),
	}),
	helper.accessor("undefined", {
		header: "Vigente",
		cell: ({ row }) => {
			const inicio = row.getValue("inicio");
			const fin = row.getValue("fin");
			const today = new Date(Date.now());
			return <span>{today > inicio && today < fin ? "SI" : "NO"}</span>;
		},
	}),
	helper.accessor("planificacionCargaHoraria", {
		header: "Planif. carga horaria",
		cell: ({ getValue }) => (getValue() ? "SI" : "NO"),
	}),
	helper.accessor("planificacionProfesoresObligatoria", {
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
	helper.accessor("cronogramaNotasCoordinacion", {
		header: "Notas por coordinaciòn",
		cell: ({ getValue }) => (getValue() ? "SI" : "NO"),
	}),
	helper.accessor("automatriculaAlumnosFechaExtraordinaria", {
		header: "Automat. extraordinaria",
		cell: ({ getValue }) => (getValue() ? "SI" : "NO"),
	}),
	helper.accessor("puedenMatricularseArrastre", {
		header: "Automat. con arrastre",
		cell: ({ getValue }) => (getValue() ? "SI" : "NO"),
	}),
	helper.accessor("puedenAutomatricularseSegundasOMasMatriculas", {
		header: "Automat. 2das matriculas",
		cell: ({ getValue }) => (getValue() ? "SI" : "NO"),
	}),
	helper.accessor("numeroMatricula", {
		header: "# matricula",
		cell: ({ getValue }) => (getValue() ? "SI" : "NO"),
	}),
	helper.accessor("numeroMatriculaAutomatico", {
		header: "# matricula automatica",
		cell: ({ getValue }) => (getValue() ? "SI" : "NO"),
	}),
	helper.accessor("numeroMatricularAlLegalizar", {
		header: "# matricula al legalizar",
		cell: ({ getValue }) => (getValue() ? "SI" : "NO"),
	}),
	helper.accessor("numeroSecuencia", {
		header: "Secuencia # especifico",
		cell: ({ getValue }) => (getValue() ? "SI" : "NO"),
	}),
	helper.accessor("EvaluacionDocente", {
		header: "Evaluaciòn al docente",
		cell: ({ getValue }) => (getValue() ? "SI" : "NO"),
	}),
	helper.accessor("calculoCosto.costoPorSesion", {
		header: "Costos por sesiòn",
		cell: ({ getValue }) => (getValue() ? "SI" : "NO"),
	}),
	helper.accessor("calculoCosto.estudiantesEligenOpcionPago", {
		header: "Plan de costos",
		cell: ({ getValue }) => (getValue() ? "SI" : "NO"),
	}),
	helper.accessor("estado", {
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
				<DropdownMenuItem
					onClick={() =>
						router.push(ROUTES.periodo.cronograma(props.periodoId))
					}
				>
					<Clock3 className='mr-2 h-4 w-4' />
					<span>Cronograma matriculas</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => router.push(ROUTES.periodo.requisito(props.periodoId))}
				>
					<List className='mr-2 h-4 w-4' />
					<span>Requisitos matricula</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() =>
						router.push(ROUTES.periodo.subperiodos(props.periodoId))
					}
				>
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
				<DropdownMenuItem
					onClick={() =>
						router.push(ROUTES.periodo.matriculas(props.periodoId))
					}
				>
					<Banknote className='mr-2 h-4 w-4' />
					<span>Matriculas no legalizadas</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() =>
						replaceSet(periodoParams.actualizarCalif, props.periodoId)
					}
				>
					<RefreshCw className='mr-2 h-4 w-4' />
					<span>Actualizar calificaciones</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
