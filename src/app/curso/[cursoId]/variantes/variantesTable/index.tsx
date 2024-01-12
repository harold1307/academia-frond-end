"use client"
import React from "react";
import { VariantesTableItem, variantesColumns, variantesParams } from "./columns";

import { DataTable } from "./data-table";

import { useRouter } from "next/router";
import { usePathname, useSearchParams } from "next/navigation";
import { VarianteCurso } from "@prisma/client";
import { useMutateModule } from "@/hooks/use-mutate-module";
import { z } from "zod";
import { API } from "@/core/api-client";
import ModalFallback from "@/app/_components/modals/modal-fallback";
import MutateModal from "@/app/_components/modals/mutate-modal";
import { varianteCursoFields, varianteCursoSchema } from "../add-variante";
import { FormControl, FormField, FormItem, FormLabel } from "@/app/_components/ui/form";
import { Input } from "@/app/_components/ui/input";

//MockUp
import { MUVariantes as data, isLoading } from "@/utils/mockupData";

export default function VarianteTable() {
	// fetch variantes

	const variantes = React.useMemo(() => {
		return data?.map(
			curso =>
				({
					...curso,
				}) satisfies VariantesTableItem,
		);
	}, [data]);

	if (isLoading) {
		return "Cargando tabla...";
	}

	if (isLoading && !variantes) {
		return "WTF";
	}

	if (!variantes) return "Ha ocurrido un error en el fetch";

	return (
		<section className=''>
			<DataTable columns={variantesColumns} data={variantes} />
		</section>
	);
}