import { createColumnHelper } from "@tanstack/react-table";
import { useMutateSearchParams } from "@/hooks/use-mutate-search-params";

const helper = createColumnHelper<any>();

export const columns = [
	helper.accessor("id", {}),
	helper.accessor("fecha", {
		header: "Fecha",
	}),
	helper.accessor("referencia", {
		header: "Referencia",
	}),
	helper.accessor("tipo", {
		header: "Tipo",
	}),
	helper.accessor("motivo", {
		header: "Motivo",
	}),
	helper.accessor("cuenta", {
		header: "Cuenta Banco",
	}),
	helper.accessor("procesado", {
		header: "Procesado",
	}),
	helper.accessor("autorizado", {
		header: "Autorizado",
	}),
	helper.accessor("valor", {
		header: "Valor",
	}),
];
