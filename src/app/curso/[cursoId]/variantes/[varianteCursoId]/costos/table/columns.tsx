"use client";
import { Button } from "@/app/_components/ui/button";
import { useMutateSearchParams } from "@/hooks/use-mutate-search-params";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { createColumnHelper } from "@tanstack/react-table";
import { FileSignature, Lock } from "lucide-react";
import { CostosSchema } from "../add-costos";

export type CostosTableItem = CostosSchema;

const helper = createColumnHelper<CostosTableItem>();

export const costosColumns = [
	helper.accessor("id", {}),
	helper.accessor("tipo", {
		header: "Tipo",
	}),
	helper.accessor("programa", {
		header: "Programa",
	}),
	helper.accessor("modalidad", {
		header: "Modalidad",
	}),
	helper.accessor("codigoExterno", {
		header: "Código Externo",
	}),
	helper.accessor("iva", {
		header: "IVA",
	}),
	helper.accessor("porcientoPrimeraCuota", {
		header: "% Primera Cuota",
	}),
	helper.accessor("valorTotal", {
		header: "Valor Total",
	}),
	helper.accessor("descuentoFicha", {
		header: "Descuento Ficha",
		cell: ({ getValue }) => (getValue() ? "SI" : "NO"),
	}),
	helper.accessor("cronogramaFecha", {
		header: "Cronograma de Fecha",
		cell: ({ getValue }) => (getValue() ? "SI" : "NO"),
	}),
	helper.accessor("fechaDesdeMatricula", {
		header: "Fecha Desde Matrícula",
		cell: ({ getValue }) => (getValue() ? "SI" : "NO"),
	}),
	helper.accessor("generacionManual", {
		header: "Manual",
		cell: ({ getValue }) => (getValue() ? "SI" : "NO"),
	}),
	helper.accessor("aplicaBecaAuto", {
		header: "Beca Automática",
		cell: ({ getValue }) => (getValue() ? "SI" : "NO"),
	}),

	helper.display({
		id: "actions",
		cell: ({ row }) => {
			const costoId = row.getValue("id") as string;
			return <Actions costoId={costoId} showDelete={true} />;
		},
	}),
];

export const costosParams = {
	update: "actualizarCosto",
	deactivate: "desactivarCosto",
};
function Actions(props: { costoId: string; showDelete: boolean }) {
	const { replaceSet, router } = useMutateSearchParams();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button>Acciones</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-56'>
				<DropdownMenuItem
					onClick={() => replaceSet(costosParams.update, props.costoId)}
				>
					<FileSignature className='mr-2 h-4 w-4' />
					<span>Editar</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => replaceSet(costosParams.deactivate, props.costoId)}
				>
					<Lock className='mr-2 h-4 w-4' />
					<span>Desactivar</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
