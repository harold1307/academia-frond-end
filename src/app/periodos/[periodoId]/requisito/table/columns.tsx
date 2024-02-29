import { createColumnHelper } from "@tanstack/react-table";
import { FileSignature, XCircle } from "lucide-react";

import { Button } from "@/app/_components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { useMutateSearchParams } from "@/hooks/use-mutate-search-params";
import { reqParams } from "../addReq";
import { type RequisitoMatriculacionFromAPI } from "@/core/api/requisitos-matriculacion";

const helper = createColumnHelper<RequisitoMatriculacionFromAPI>();

export const columns = [
	helper.accessor("id", {}),
	helper.accessor("sede.nombre", {
		header: "Sede",
	}),
	helper.accessor("programa", {
		header: "Programa",
	}),
	helper.accessor("modalidad.nombre", {
		header: "Modalidad",
	}),
	helper.accessor("obligatorio", {
		header: "Nivel",
	}),
	helper.accessor("tipoDocumentoId", {
		header: "Requisito/Tipo",
	}),
	helper.accessor("obligatorio", {
		header: "Obligatorio",
		cell: ({ getValue }) => (getValue() ? "SI" : "NO"),
	}),
	helper.accessor("primeraMatricula", {
		header: "Archivo",
		cell: ({ getValue }) => (getValue() ? "SI" : "NO"),
	}),
	helper.accessor("transferenciaIES", {
		header: "Transf. otra IES",
		cell: ({ getValue }) => (getValue() ? "SI" : "NO"),
	}),
	helper.accessor("repitenMaterias", {
		header: "Primera Matricula",
		cell: ({ getValue }) => (getValue() ? "SI" : "NO"),
	}),
	helper.accessor("obligatorio", {
		header: "Repite",
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

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button>Acciones</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-56'>
				<DropdownMenuItem
					onClick={() => replaceSet(reqParams.update, props.periodoId)}
				>
					<FileSignature className='mr-2 h-4 w-4' />
					<span>Editar</span>
				</DropdownMenuItem>
				<DropdownMenuItem>
					<XCircle className='mr-2 h-4 w-4' />
					<span>Eliminar</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
