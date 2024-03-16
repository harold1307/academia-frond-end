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

export type MateriasSchema = {
    id: string;
    asignatura: string;
    planificacion: string;
    capacidad: number;
    matriculados: number;
    lms: number;
    creditos: number;
    horas: number;
    horasSemanales: number;
    aula: string;
    inicioFin: string;
    profesores: string;
};
export type MateriasTableItem = MateriasSchema;

const helper = createColumnHelper<MateriasTableItem>();

export const materiasColumns = [
    helper.accessor("id", {}),
    helper.accessor("asignatura", {
        header: "Asignatura",
    }),
    helper.accessor("planificacion", {
        header: "Planificacion",
    }),
    helper.accessor("capacidad", {
        header: "Capacidad",
    }),
    helper.accessor("matriculados", {
        header: "Matriculados",
        cell: ({ getValue }) => (getValue() ? "SI" : "NO"),
    }),
    helper.accessor("lms", {
        header: "LMS",
    }),
    helper.accessor("creditos", {
        header: "Creditos",
    }),
    helper.accessor("horas", {
        header: "Horas",
    }),
    helper.accessor("horasSemanales", {
        header: "Horas semanales",
    }),
    helper.accessor("inicioFin", {
        header: "Inicio / Fin",
    }),
    helper.accessor("profesores", {
        header: "Profesor(es)",
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
                    <span>Tomaron la materia</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Repeat2 className='mr-2 h-4 w-4' />
                    <span>Calificacion tardia</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Lock className='mr-2 h-4 w-4' />
                    <span>Actualizar record</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Lock className='mr-2 h-4 w-4' />
                    <span>Cambiar aula</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Lock className='mr-2 h-4 w-4' />
                    <span>Cambiar modelo</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Lock className='mr-2 h-4 w-4' />
                    <span>Dividir materia</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Lock className='mr-2 h-4 w-4' />
                    <span>Eliminar calificaciones</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Lock className='mr-2 h-4 w-4' />
                    <span>Unificar en LMS</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Lock className='mr-2 h-4 w-4' />
                    <span>Dias a calificar</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Lock className='mr-2 h-4 w-4' />
                    <span>Fechas sin asistencias</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Lock className='mr-2 h-4 w-4' />
                    <span>Cerrar la materia</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Lock className='mr-2 h-4 w-4' />
                    <span>Reportes</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}