import { createColumnHelper } from "@tanstack/react-table";
import { useMutateSearchParams } from "@/hooks/use-mutate-search-params";

const helper = createColumnHelper<any>();

export const columns = [
	helper.accessor("id", {}),
	helper.accessor("documento", {
		header: "Documento / Observación",
	}),
	helper.accessor("tipo", {
		header: "Tipo",
	}),
	helper.accessor("archivo", {
		header: "Arcivho",
	}),
	helper.accessor("fecha", {
		header: "Fecha",
	}),
	helper.accessor("visible", {
		header: "Visible",
	}),
];
