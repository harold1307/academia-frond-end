"use client";
import { createColumnHelper } from "@tanstack/react-table";
import { FileSignature, GripHorizontal, Lock, StretchHorizontal } from "lucide-react";
import { useParams, usePathname, useRouter } from "next/navigation";

import { Button } from "@/app/_components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { ROUTES } from "@/core/routes";
import { ModelosEvaluativoSchema } from "../add-modelo";
import { useMutateSearchParams } from "@/hooks/use-mutate-search-params";

export type ModelosEvaluativosTableItem = ModelosEvaluativoSchema

const helper = createColumnHelper<ModelosEvaluativosTableItem>();

export const modelosEvaluativosColumns = [
	helper.accessor("id", {}),
	helper.accessor("nombre", {
		header: "Nombre",
	}),
	// helper.accessor("fecha", {
	// 	header: "Codigo",
	// }),
	helper.accessor("notaParaAprobar", {
		header: "Nota Aprobar",
	}),
	helper.accessor("notaParaRecuperacion", {
		header: "Nota Recuperación",
	}),
	helper.accessor("notaMaxima", {
		header: "Nota Máxima",
	}),
	helper.accessor("porcentajeAsistenciaAprobar", {
		header: "Asistencia Aprobar",
	}),
	helper.accessor("decimalesNotaFinal", {
		header: "Decimales Nota Final",
	}),
	// helper.accessor("campos", {
	// 	header: "Campos",
	// }),
	helper.accessor("examenComplexivo", {
		header: "Examen",
        cell: ({ getValue }) => (getValue() ? 'SI' : 'NO')
	}),
	helper.accessor("defineMaximos", {
		header: "Máximos",
        cell: ({ getValue }) => (getValue() ? 'SI' : 'NO')
	}),
	helper.accessor("camposActualizanEstado", {
		header: "EstadoCampos",
        cell: ({ getValue }) => (getValue() ? 'SI' : 'NO')
	}),
	helper.display({
		id: "actions",
		cell: ({ row }) => {
			const id = row.getValue("id") as string;

			return <Actions modeloEvaluativoId={id} />;
		},
	}),
];

export const modelosEvaluativosParams = {
	update: 'actualizarmodeloevaluativo',
	deactivate: 'desactivarmodeloevaluativo',
    clone: 'clonemodeloevaluativo'
}

function Actions({ modeloEvaluativoId }: { modeloEvaluativoId: string }) {
	const { replaceSet } = useMutateSearchParams();

	const router = useRouter();
	const { cursoId } = useParams<{ cursoId: string }>();
  const pathname = usePathname()
  
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button>Acciones</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-56'>
                <DropdownMenuItem
                    onClick={() => replaceSet(modelosEvaluativosParams.update, modeloEvaluativoId)}
                >
                    <FileSignature className='mr-2 h-4 w-4' />
                    <span>Editar</span>
                </DropdownMenuItem>
                <DropdownMenuItem
					onClick={() => {
						router.push(pathname + ROUTES.modelosEvaluativos.modeloCampos(modeloEvaluativoId))}
					}
				>
					<StretchHorizontal className='mr-2 h-4 w-4' />
					<span>Campos del Modelo</span>
				</DropdownMenuItem>
                <DropdownMenuItem
					onClick={() => {
						router.push(pathname + ROUTES.modelosEvaluativos.modelologica(modeloEvaluativoId))}
					}
				>
					<StretchHorizontal className='mr-2 h-4 w-4' />
					<span>Lógica de cálculo</span>
				</DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => replaceSet(modelosEvaluativosParams.clone, modeloEvaluativoId)}
                >
                    <Lock className='mr-2 h-4 w-4' />
                    <span>Clonar</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => replaceSet(modelosEvaluativosParams.deactivate, modeloEvaluativoId)}
                >
                    <Lock className='mr-2 h-4 w-4' />
                    <span>Desactivar</span>
                </DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
