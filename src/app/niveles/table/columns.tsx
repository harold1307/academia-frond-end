import { Button } from "@/app/_components/ui/button";
import { ROUTES } from "@/core/routes";
import { useMutateSearchParams } from "@/hooks/use-mutate-search-params";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { createColumnHelper } from "@tanstack/react-table";
import { FileSignature, Lock, Mail, Plus, Repeat2 } from "lucide-react";
import Link from "next/link";

export type NivelesAcademicosSchema = {
	id: string;
	horarios: boolean;                      //horarios
	profesores: boolean;                    //profesores 
	cuposMaterias: boolean;                 //cuposMaterias
	planificacionProfesores: boolean;       //planificacionProfesores
	paralelo: string;                       //paraleloId
	// cupo: number;                           //NO ESTAN EN LA API
	// matriculados: number;                   //NO ESTAN EN LA API
	// retirados: number;                      //NO ESTAN EN LA API
	// disponibles: number;                    //NO ESTAN EN LA API
	// cumplimientoComunitarias: boolean;      //NO ESTAN EN LA API
	// cumplimientoPreprofesionales: boolean;  //NO ESTAN EN LA API
	cumplimientoMaterias: boolean;          //validaCumplimientoMaterias
	proyectosIntegradores: boolean;         //estudiantesRegistranProyectosIntegradores
	nivelMalla: string;                     //nivelMallaId
	sesionModalidad: string;                //sesionId
	inicioFin: string;                      //fechaInicio + fechaFin
	fechaAgregaciones: string;              //inicioAgrupaciones + limiteAgrupaciones
	fechasMatricula: string;                //limiteOrdinaria + limiteExtraordinaria + limiteEspecial
	seleccionMaterias: boolean;             //estudiantesPuedenSeleccionarMaterias
	seleccionHorarios: boolean;              //estudiantesPuedenSeleccionarMateriasOtrosHorarios
	seleccionModalidad: boolean;             //estudiantesPuedenSeleccionarMateriasOtrasModalidades
	matriculacion: boolean;                 //matriculacion
};
export type nivelesAcademicosTableItem = NivelesAcademicosSchema;

const helper = createColumnHelper<nivelesAcademicosTableItem>();

export const nivelesAcademicosColumns = [
	helper.accessor("id", {}),
	helper.accessor("horarios", {
		header: "Horarios",
		cell: ({ getValue }) => (getValue() ? "SI" : "NO"),
	}),
	helper.accessor("profesores", {
		header: "Profesores",
		cell: ({ getValue }) => (getValue() ? "SI" : "NO"),
	}),
	helper.accessor("cuposMaterias", {
		header: "Cupos y materias",
		cell: ({ getValue }) => (getValue() ? "SI" : "NO"),
	}),
	helper.accessor("planificacionProfesores", {
		header: "Planif. profesores",
		cell: ({ getValue }) => (getValue() ? "SI" : "NO"),
	}),
	helper.accessor("paralelo", {
		header: "Paralelo",
	}),
	// helper.accessor("cupo", {
	// 	header: "Cupo",
	// }),
	// helper.accessor("matriculados", {
	// 	header: "Matriculados",
	// }),
	// helper.accessor("retirados", {
	// 	header: "Retirados",
	// }),
	// helper.accessor("disponibles", {
	// 	header: "Disponibles",
	// }),
	helper.accessor("nivelMalla", {
		header: "Nivel Malla",
	}),
	helper.accessor("sesionModalidad", {
		header: "Jornada",
	}),
	helper.accessor("inicioFin", {
		header: "Inicio / Fin",
	}),
	helper.accessor("fechaAgregaciones", {
		header: "Agregaciones",
	}),
	helper.accessor("fechasMatricula", {
		header: "Regular / Extraordinaria / Especial",
	}),
	helper.accessor("seleccionMaterias", {
		header: "Seleccion de materias",
	}),
	helper.accessor("seleccionHorarios", {
		header: "Otros horarios",
	}),
	helper.accessor("seleccionModalidad", {
		header: "Otras modalidades",
	}),
	helper.accessor("matriculacion", {
		header: "Matriculación",
		cell: ({ getValue }) => (getValue() ? "SI" : "NO"),
	}),
	helper.display({
		id: "materias",
		cell: ({ row }) => {
			const id = row.getValue("id") as string;
			return (
				<Button variant="success">
					<Link href={ROUTES.niveles.materias(id)} > Materias </Link>
				</Button>
			);
		},
	}),
	helper.display({
		id: "actions",
		cell: ({ row }) => {
			const id = row.getValue("id") as string;

			return <Actions id={id} />;
		},
	}),
];

export const horariosParams = {
	mensaje: "message",
};

function Actions({ id }: { id: string }) {
	const { replaceSet, router } = useMutateSearchParams();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button>Acciones </Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-56'>
				<DropdownMenuItem
				>
					<FileSignature className='mr-2 h-4 w-4' />
					<span>Editar</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => replaceSet(horariosParams.mensaje, id)}
				>
					<Mail className='mr-2 h-4 w-4' />
					<span>Mensaje</span>
				</DropdownMenuItem>
				<DropdownMenuItem>
					<Plus className='mr-2 h-4 w-4' />
					<span>Duplicar paralelo</span>
				</DropdownMenuItem>
				<DropdownMenuItem>
					<Repeat2 className='mr-2 h-4 w-4' />
					<span>Cambiar modelo</span>
				</DropdownMenuItem>
				<DropdownMenuItem>
					<Lock className='mr-2 h-4 w-4' />
					<span>Impresión</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
