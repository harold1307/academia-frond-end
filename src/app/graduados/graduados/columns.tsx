import { Button } from "@/app/_components/ui/button";
import { useMutateSearchParams } from "@/hooks/use-mutate-search-params";
import {
	DropdownMenu,
	DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { createColumnHelper } from "@tanstack/react-table";

const helper = createColumnHelper<any>();

export const columns = [
	helper.accessor("id", {}),
	helper.accessor("nombre", {
		header: "Estudiante",
	}),
	helper.accessor("contactos", {
		header: "Email / Telefonos",
	}),
	helper.accessor("programa", {
		header: "Programa",
	}),
	helper.accessor("nota", {
		header: "Nota graduación",
	}),
	helper.accessor("inicio", {
		header: "Inicio programa",
	}),
	helper.accessor("fin", {
		header: "Fin programa",
	}),
	helper.accessor("fecha", {
		header: "Fecha graduación",
	}),
	helper.accessor("acta", {
		header: "No. Acta",
	}),
	helper.accessor("tesis", {
		header: "Link tesis",
	}),
	helper.accessor("rector", {
		header: "Rector",
	}),
	helper.accessor("senecyt", {
		header: "Reg. Senecyt",
	}),
	helper.display({
		id: "actions",
		cell: ({ row }) => {
			const id = row.getValue("id") as string;
			return <Actions graduadoId={id} />;
		},
	}),
];

function Actions(props: { graduadoId: string }) {
	const { replaceSet } = useMutateSearchParams();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button>Acciones</Button>
			</DropdownMenuTrigger>
		</DropdownMenu>
	);
}
