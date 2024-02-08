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
import { subperiodoParams } from "../add-subperiodo";

const helper = createColumnHelper<any>();

export const columns = [
	helper.accessor("id", {}),
	helper.accessor("nombre", {
		header: "Nombre",
	}),
	helper.accessor("programa", {
		header: "Programa",
	}),
	helper.accessor("modalidad", {
		header: "Modalidad",
	}),
	helper.accessor("email", {
		header: "Email",
	}),
	helper.accessor("telefonos", {
		header: "Telefonos",
	}),
	helper.accessor("fechaMatricula", {
		header: "Fecha Matricula",
	}),
];

