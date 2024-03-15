import { createColumnHelper } from "@tanstack/react-table";
import { FileSignature, RefreshCcw, XCircle } from "lucide-react";

import { Button } from "@/app/_components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { useMutateSearchParams } from "@/hooks/use-mutate-search-params";
import { ROUTES } from "@/core/routes";

const helper = createColumnHelper<any>();

export const columns = [
	helper.accessor("id", {}),
	helper.accessor("estudiante", {
		header: "Estudiante",
	}),
	helper.accessor("nivel", {
		header: "Nivel",
	}),
	helper.accessor("sesion", {
		header: "Sesion",
	}),
	helper.accessor("programa", {
		header: "Programa",
	}),
	helper.accessor("fecha", {
		header: "Fecha",
	}),
	helper.display({
		id: "detalles",
		cell: ({ row }) => {
			const id = row.getValue("id") as string;

			return <Details retiroId={id} />;
		},
	}),
	helper.display({
		id: "actions",
		cell: ({ row }) => {
			const id = row.getValue("id") as string;

			return <Actions retiroId={id} />;
		},
	}),
];

function Actions(props: { retiroId: string }) {
	const { replaceSet } = useMutateSearchParams();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button>Acciones</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-56'>
				<DropdownMenuItem>
					<RefreshCcw className='mr-2 h-4 w-4' />
					<span>Continuar</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

function Details(props: { retiroId: string }) {
	const { replaceSet } = useMutateSearchParams();
	return (
		<Button
			onClick={() => replaceSet("motivo", props.retiroId)}
			className='bg-blue-500 hover:bg-blue-400'
		>
			Detalles
		</Button>
	);
}
