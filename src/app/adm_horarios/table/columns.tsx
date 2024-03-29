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
import { FileSignature, Lock, StretchHorizontal } from "lucide-react";
import Link from "next/link";

export type HorariosAdminSchema = {
	id: string;
	horarios: boolean;
	profesores: boolean;
	cupos: boolean;
	planificacion: boolean;
	paralelo: string;
	cupo: number;
	matriculados: number;
	retirados: number;
	disponibles: number;
	nivelMalla: string;
	sesionModalidad: string;
	malla: number;
	inicioFin: string;
	agregaciones: string;
	matReg: string;
	matExt: string;
	matEsp: string;
	matriculacion: boolean;
};
export type HorariosAdminTableItem = HorariosAdminSchema;

const helper = createColumnHelper<HorariosAdminTableItem>();

export const horariosAdminColumns = [
	helper.accessor("id", {}),
	helper.accessor("horarios", {
		header: "Horarios",
		cell: ({ getValue }) => (getValue() ? "SI" : "NO"),
	}),
	helper.accessor("profesores", {
		header: "Profesores",
		cell: ({ getValue }) => (getValue() ? "SI" : "NO"),
	}),
	helper.accessor("cupos", {
		header: "Cupos",
		cell: ({ getValue }) => (getValue() ? "SI" : "NO"),
	}),
	helper.accessor("planificacion", {
		header: "Planificación",
		cell: ({ getValue }) => (getValue() ? "SI" : "NO"),
	}),
	helper.accessor("paralelo", {
		header: "Paralelo",
	}),
	helper.accessor("cupo", {
		header: "Cupo",
	}),
	helper.accessor("matriculados", {
		header: "Matriculados",
	}),
	helper.accessor("retirados", {
		header: "Retirados",
	}),
	helper.accessor("disponibles", {
		header: "Disponibles",
	}),
	helper.accessor("nivelMalla", {
		header: "Nivel Malla",
	}),
	helper.accessor("sesionModalidad", {
		header: "Sesión / Modalidad",
	}),
	helper.accessor("malla", {
		header: "Malla",
	}),
	helper.accessor("inicioFin", {
		header: "Inicio / Fin",
	}),
	helper.accessor("agregaciones", {
		header: "Agregaciones",
	}),
	helper.accessor("matReg", {
		header: "Mat. Reg.",
	}),
	helper.accessor("matExt", {
		header: "Mat. Ext.",
	}),
	helper.accessor("matEsp", {
		header: "Mat. Esp.",
	}),
	helper.accessor("matriculacion", {
		header: "Matriculación",
		cell: ({ getValue }) => (getValue() ? "SI" : "NO"),
	}),
	helper.display({
		id: "horario",
		cell: ({ row }) => {
			const id = row.getValue("id") as string;
			return (
				<Link href={ROUTES.admHorarios.detalleHorario(id)}> Horario </Link>
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
				<Button>Acciones</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-56'>
				<DropdownMenuItem
					onClick={() => replaceSet(horariosParams.mensaje, id)}
				>
					<FileSignature className='mr-2 h-4 w-4' />
					<span>Mensaje</span>
				</DropdownMenuItem>
				<DropdownMenuItem>
					<Lock className='mr-2 h-4 w-4' />
					<span>Impresión</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
