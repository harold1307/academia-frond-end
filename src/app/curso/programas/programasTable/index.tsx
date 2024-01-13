"use client"
import React from "react";


import { useRouter } from "next/navigation";
import { usePathname, useSearchParams } from "next/navigation";
import { VarianteCurso } from "@prisma/client";
import { useMutateModule } from "@/hooks/use-mutate-module";
import { z } from "zod";
import { API } from "@/core/api-client";
import ModalFallback from "@/app/_components/modals/modal-fallback";
import MutateModal from "@/app/_components/modals/mutate-modal";
import { FormControl, FormField, FormItem, FormLabel } from "@/app/_components/ui/form";
import { Input } from "@/app/_components/ui/input";

//MockUp
import { useQuery } from "@tanstack/react-query";
import { DatePickerDemo } from "@/app/_components/date-picker";
import { CreateVarianteCurso } from "@/core/api/cursos";
import { ZodInferSchema } from "@/utils/types";
import { AnyNaptrRecord } from "dns";
import DeleteModal from "@/app/_components/modals/delete-modal";
import { PROGRAMAS_KEYS } from "./query-keys";
import { ProgramaTableItem, programasColumns } from "./columns";
import { DataTable } from "./data-table";

interface ProgramasTableProps {
	varianteId: string
}

const isLoading = false
const data = {
	programas: [
		{
			todosLosProgramas: false,
			programa: 'Enfermeria',
			modalidad: 'Presencial',
			malla: 'Malla1',
			registroExterno: true
		}
	]
}

export default function ProgramasTable({ varianteId }:ProgramasTableProps) {

	// const { isLoading, data } = useQuery({
		
	// 	queryKey: PROGRAMAS_KEYS.lists(),
	// 	queryFn: async () => {
	// 		const data = await API.cursos.getCursoWithVariantesByCursoId(programaId);

	// 		return data.data;
	// 	},
	// });

	const programas = React.useMemo(() => {
		return data?.programas?.map(
			curso =>
				({
					...curso,
				}) satisfies ProgramaTableItem,
		);
	}, [data]);

	if (isLoading) {
		return "Cargando tabla...";
	}

	if (isLoading && !programas) {
		return "WTF";
	}

	if (!programas) return "Ha ocurrido un error en el fetch";

	return (
		<section className=''>
			<DataTable columns={programasColumns} data={programas} />
			{/* <UpdateVarianteModal variantes={programas} /> */}
			{/* <DeactivateVariatneModal variantes={programas}/> */}
		</section>
	);
}