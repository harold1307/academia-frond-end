"use client";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";
import { z } from "zod";

import { API } from "@/core/api-client";
import useDebounce from "@/hooks/use-debounce";
import { useMutateModule } from "@/hooks/use-mutate-module";
import { formatFullName } from "@/utils";
import type { Field } from "@/utils/forms";
import type { ZodInferSchema } from "@/utils/types";
import MutateModal from "../_components/modals/mutate-modal";
import { ComboboxForm } from "../_components/ui/combobox";
import { FormField, FormItem, FormLabel } from "../_components/ui/form";

export const cursosParams = {} as const;

const schema = z.object<ZodInferSchema<{ usuarioId: string }>>({
	usuarioId: z.string(),
});

export function AddDocente() {
	const router = useRouter();
	const [searchTerm, setSearchTerm] = React.useState<string | undefined>();
	const debouncedSearchTerm = useDebounce(searchTerm, 1000);

	const { form, mutation, open, setOpen } = useMutateModule({
		schema,
		mutationFn: async data => {
			console.log({ data });
		},
		onSuccess: response => {
			console.log({ response });
			router.refresh();
		},
	});

	const { data: usuarios, isLoading: usuariosAreLoading } = useQuery({
		queryKey: ["usuarios", debouncedSearchTerm],
		queryFn: () => {
			if (!debouncedSearchTerm) return;

			return API.usuarios.getMany({
				filters: {
					fullTextSearch: debouncedSearchTerm,
					tipo: "PROFESOR",
				},
			});
		},
		enabled: !!debouncedSearchTerm,
	});

	return (
		<section>
			{/* <h1 className='text-2xl font-semibold'>Adicionar curso</h1> */}
			<MutateModal
				dialogProps={{
					open,
					onOpenChange: setOpen,
				}}
				disabled={mutation.isPending}
				form={form}
				onSubmit={form.handleSubmit(data => mutation.mutate(data))}
				title='Adicionar docente'
				withTrigger
				triggerLabel='Agregar'
			>
				{fields.map(f => (
					<FormField
						control={form.control}
						name={f.name}
						key={f.name}
						render={({ field }) => (
							<FormItem className='grid grid-cols-12 items-center gap-4 space-y-0'>
								<FormLabel className='col-span-3 text-end'>Persona</FormLabel>
								<ComboboxForm
									value={field.value}
									setValue={v => form.setValue("usuarioId", v)}
									emptyText={
										usuariosAreLoading
											? "Cargando..."
											: !searchTerm
												? "Escribe para buscar..."
												: "No hay resultados"
									}
									options={
										usuarios?.data.map(u => ({
											label: formatFullName(
												u.nombres,
												u.primerApellido,
												u.segundoApellido,
											),
											value: u.id,
										})) || []
									}
									placeholder='Buscar persona'
									inputOnChange={e => setSearchTerm(e)}
									inputValue={searchTerm}
								/>
							</FormItem>
						)}
					/>
				))}
			</MutateModal>
		</section>
	);
}

export const fields = [
	{
		name: "usuarioId",
		inputType: "custom-select",
		label: "Profesor",
		options: "custom",
	},
] satisfies Field<keyof z.infer<typeof schema>>[];
