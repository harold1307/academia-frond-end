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
import { periodoParams } from "@/app/periodos/addPeriodo";
import { cronogramaParams } from "../addCronograma";

const helper = createColumnHelper<any>();

export const columns = [
	helper.accessor("id", {}),
	helper.accessor("sede", {
		header: "Sede",
	}),
	helper.accessor("programa", {
		header: "Programa",
	}),
	helper.accessor("modalidad", {
		header: "Modalidad",
	}),
	helper.accessor("nivel", {
		header: "Nivel",
	}),
	helper.accessor("inicio", {
		header: "Inicio",
	}),
	helper.accessor("fin", {
		header: "Fin",
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
					onClick={() => replaceSet(cronogramaParams.update, props.periodoId)}
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
