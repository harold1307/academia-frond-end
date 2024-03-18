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
import { Check, FileSignature, Lock, Mail, Pencil, Plus, PlusCircle, Repeat2, X, } from "lucide-react";
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
        cell: ({ row }) => {
            const asignatura: string = row.getValue("asignatura");
            return <div>
                <h1>{asignatura}</h1>
                <h2 className="text-gray-500">nivel - modelo aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa </h2>
                <section className="flex flex-row justify-center gap-x-2">
                    <button className="w-16 border-2 rounded-lg border-green-700">LMS-P</button>
                    <button className="w-16 border-2 rounded-lg border-blue-950">VC</button>
                    <button className="w-16 border-2 rounded-lg border-blue-950">VP</button>
                    <button className="w-16 border-2 rounded-lg border-amber-500">Ciclo 1</button>
                </section>
            </div>
        }
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
    helper.accessor("aula", {
        header: "Aula",
    }),
    helper.accessor("profesores", {
        header: "Profesor(es)",
        cell: ({ row }) => {
            const profesores = row.getValue("profesores") as string;
            return <div className="flex flex-col gap-y-1 items-start py-4">
                <p>{profesores}</p>
                <p className=" text-gray-500">TEORIA - 13-11-2023 AL 14-01-2024 - 0.0HRS</p>
                <section className="flex flex-row gap-x-3 px-2">
                    <button className="border-2 rounded-lg border-red-600">
                        <X className="text-red-600" />
                    </button>
                    <button className="" >
                        <Pencil />
                    </button>
                    <button className="">
                        <Check />
                    </button>
                    <button className="text-green-700">LMS</button>
                </section>
                <button className="w-28 p-1 flex flex-row justify-evenly items-center border-2 rounded">
                    <PlusCircle />
                    <p>Profesor</p>
                </button>
            </div >
        }
    }),
    //reemplazar plusCircle por mutatemodal
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

// helper.accessor("activo", {
//     header: "Activo",
//     cell: ({ row }) => {
//         const valor = row.getValue("activo") as boolean;

//         return <ToggleTable valor={valor} />;
//     },
// }),