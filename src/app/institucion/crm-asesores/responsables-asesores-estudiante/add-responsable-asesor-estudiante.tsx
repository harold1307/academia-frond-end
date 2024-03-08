"use client";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";
import { z } from "zod";

import MutateModal from "@/app/_components/modals/mutate-modal";
import { ComboboxForm } from "@/app/_components/ui/combobox";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/app/_components/ui/form";
import { API } from "@/core/api-client";
import type { CreateResponsableAsesorEstudiante } from "@/core/api/responsables-asesores-estudiante";
import useDebounce from "@/hooks/use-debounce";
import { useMutateModule } from "@/hooks/use-mutate-module";
import { formatFullName } from "@/utils";
import type { Field } from "@/utils/forms";
import type { ZodInferSchema } from "@/utils/types";
import { RESPONSABLES_ASESORES_ESTUDIANTE_KEYS } from "./query-keys";
import { Checkbox } from "@/app/_components/ui/checkbox";

const schema = z.object<ZodInferSchema<CreateResponsableAsesorEstudiante>>({
	administrativoId: z.string().uuid(),
	seguimientoBienestar: z.boolean(),
	seguimientoExpediente: z.boolean(),
});

export const responsablesAsesorEstudianteParams = {
	delete: "eliminarResponsableAsesorEstudiante",
};

export default function AddResponsableAsesorEstudiante() {
	const [searchTerm, setSearchTerm] = React.useState<string | undefined>();
	const debouncedSearchTerm = useDebounce(searchTerm, 1000);

	const router = useRouter();
	const {
		form,
		mutation: { isPending, mutate },
		open,
		setOpen,
	} = useMutateModule({
		schema,
		mutationFn: data => {
			return API.usuarios.createResponsableAsesorEstudiante({
				userId: data.administrativoId,
				data,
			});
		},
		onSuccess: response => {
			console.log({ response });
			setSearchTerm(undefined);
			router.refresh();
		},
		invalidateQueryKey: RESPONSABLES_ASESORES_ESTUDIANTE_KEYS.all,

		hookFormProps: {
			defaultValues: {
				seguimientoBienestar: false,
				seguimientoExpediente: false,
				administrativoId: "",
			},
		},
	});

	const {
		data: usuarios,
		isLoading: usuariosAreLoading,
		refetch: fetchUsuarios,
	} = useQuery({
		queryKey: ["usuarios", debouncedSearchTerm],
		queryFn: () => {
			if (!debouncedSearchTerm) return;

			return API.usuarios.getMany({
				filters: {
					fullTextSearch: debouncedSearchTerm,
					tipo: "ADMINISTRATIVO",
				},
			});
		},
		enabled: !!debouncedSearchTerm,
	});

	return (
		<section className='mb-2'>
			<MutateModal
				dialogProps={{
					open,
					onOpenChange: setOpen,
				}}
				disabled={isPending}
				form={form}
				onSubmit={form.handleSubmit(data => mutate(data))}
				title='Adicionar responsable de asesor de estudiante'
				withTrigger
				triggerLabel='Agregar'
			>
				{responsableAsesorEstudianteFields.map(f => {
					return (
						<FormField
							control={form.control}
							name={f.name}
							key={f.name}
							disabled={isPending}
							shouldUnregister={true}
							render={({ field }) => {
								if (f.inputType === "checkbox") {
									return (
										<FormItem className='grid grid-cols-12 items-center gap-4 space-y-0'>
											<FormLabel className='col-span-3 text-end'>
												{f.label}
											</FormLabel>
											<FormControl>
												<Checkbox
													checked={field.value as boolean}
													onCheckedChange={field.onChange}
												/>
											</FormControl>
										</FormItem>
									);
								}

								return (
									<FormItem className='grid grid-cols-12 items-center gap-4 space-y-0'>
										<FormLabel className='col-span-3 text-end'>
											{f.label}
										</FormLabel>
										<ComboboxForm
											value={field.value as string}
											setValue={v => form.setValue("administrativoId", v)}
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
								);
							}}
						/>
					);
				})}
			</MutateModal>
		</section>
	);
}

export const responsableAsesorEstudianteFields = [
	{
		name: "administrativoId",
		label: "Persona",
		inputType: "custom-combobox",
		options: "custom",
	},
	{
		name: "seguimientoBienestar",
		label: "Seguimiento bienestar",
		inputType: "checkbox",
	},
	{
		name: "seguimientoExpediente",
		label: "Seguimiento expediente",
		inputType: "checkbox",
	},
] satisfies Field<keyof z.infer<typeof schema>>[];
