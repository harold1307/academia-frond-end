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
import { useRouter } from "next/navigation";
import { ROUTES } from "@/core/routes";
import { crmParams } from "../addInscritos";

const helper = createColumnHelper<any>();

export const columns = [
	helper.accessor("id", {}),
	helper.accessor("nombre", {
		header: "Nombre",
	}),
	helper.accessor("identificacion", {
		header: "Identificación",
	}),
	helper.accessor("emailTel", {
		header: "Email / Teléfonos",
	}),
	helper.accessor("asesorPrograma", {
		header: "Asesor / Programa",
	}),
	helper.accessor("codigo", {
		header: "Codigo promoción",
	}),
	helper.accessor("vencido", {
		header: "Vencido",
	}),
	helper.accessor("matricula", {
		header: "Matricula",
	}),
	helper.accessor("matriculaHabilitada", {
		header: "Hab. Matricula",
	}),
	helper.accessor("foto", {
		header: "Foto",
	}),
	helper.accessor("seguimiento", {
		header: "Seguimientos",
	}),
	helper.accessor("activo", {
		header: "Activo",
	}),
	helper.display({
		id: "actions",
		cell: ({ row }) => {
			const id = row.getValue("id") as string;

			return <Actions id={id} />;
		},
	}),
];

function Actions(props: { id: string }) {
	const { replaceSet } = useMutateSearchParams();
	const navigate = useRouter();
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button>Acciones</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-56'>
				<DropdownMenuItem
					onClick={() => navigate.push(ROUTES.crm.documentos(props.id))}
				>
					<FileSignature className='mr-2 h-4 w-4' />
					<span>Documentos</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => replaceSet(crmParams.actualizarUniforme, props.id)}
				>
					<XCircle className='mr-2 h-4 w-4' />
					<span>Uniforme</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => navigate.push(ROUTES.crm.depositos(props.id))}
				>
					<XCircle className='mr-2 h-4 w-4' />
					<span>Depositos o transferencias</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => replaceSet(crmParams.seguimientos, props.id)}
				>
					<XCircle className='mr-2 h-4 w-4' />
					<span>Seguimientos</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => replaceSet(crmParams.agendarSeguimiento, props.id)}
				>
					<XCircle className='mr-2 h-4 w-4' />
					<span>Agendar seguimiento</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
