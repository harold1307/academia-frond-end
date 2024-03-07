"use client";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";
import { z } from "zod";

import MutateModal from "@/app/_components/modals/mutate-modal";
import { Checkbox } from "@/app/_components/ui/checkbox";
import { ComboboxForm } from "@/app/_components/ui/combobox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/app/_components/ui/form";
import { ScrollArea } from "@/app/_components/ui/scroll-area";
import { API } from "@/core/api-client";
import type {
  CreateAsesorCrm,
  CreateAsesorCrmEnCentroInformacion,
} from "@/core/api/asesores-crm";
import useDebounce from "@/hooks/use-debounce";
import { useMutateModule } from "@/hooks/use-mutate-module";
import { formatFullName } from "@/utils";
import type { ZodInferSchema } from "@/utils/types";
import { CENTROS_INFORMACION_KEYS } from "../centros-informacion/query-keys";
import { ASESORES_CRM_KEYS } from "./query-keys";

const schema = z.object<
	ZodInferSchema<
		CreateAsesorCrm & Omit<CreateAsesorCrmEnCentroInformacion, "asesorCrmId">
	>
>({
	administrativoId: z.string().uuid(),
	centroInformacionIds: z.array(z.string().uuid()),
});

export const asesoresCrmParams = {
	update: "actualizarAsesorCrm",
	delete: "eliminarAsesorCrm",
};

export default function AddAsesorCrm() {
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
			return API.usuarios.createAsesorCrm({
				data,
				userId: data.administrativoId,
			});
		},
		onSuccess: response => {
			console.log({ response });
			router.refresh();
		},
		invalidateQueryKey: ASESORES_CRM_KEYS.all,
	});

	const { data: usuarios, isLoading: usuariosAreLoading } = useQuery({
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

	const { data: centrosInformacion } = useQuery({
		queryKey: CENTROS_INFORMACION_KEYS.lists(),
		queryFn: () => {
			return API.centrosInformacion.getMany();
		},
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
				title='Adicionar asesor de CRM'
				withTrigger
				triggerLabel='Agregar'
			>
				<FormField
					control={form.control}
					name={"administrativoId"}
					disabled={isPending}
					shouldUnregister={true}
					render={({ field }) => {
						return (
							<FormItem className='grid grid-cols-12 items-center gap-4 space-y-0'>
								<FormLabel className='col-span-3 text-end'>Persona</FormLabel>
								<ComboboxForm
									value={field.value}
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
				<FormField
					control={form.control}
					name='centroInformacionIds'
					defaultValue={[]}
					render={() => (
						<FormItem className='grid grid-cols-12 items-center gap-4 space-y-0'>
							<FormLabel className='col-span-3 self-baseline text-end'>
								Centros de informacion
							</FormLabel>
							<ScrollArea className='h-[200px] w-[350px] rounded-md border p-4'>
								{centrosInformacion?.data.map(item => (
									<FormField
										key={item.id}
										control={form.control}
										name='centroInformacionIds'
										render={({ field }) => {
											return (
												<FormItem
													key={item.id}
													className='flex flex-row items-start space-x-3 space-y-0'
												>
													<FormControl>
														<Checkbox
															checked={field.value?.includes(item.id)}
															onCheckedChange={checked => {
																return checked
																	? field.onChange([...field.value, item.id])
																	: field.onChange(
																			field.value?.filter(
																				value => value !== item.id,
																			),
																		);
															}}
														/>
													</FormControl>
													<FormLabel className='font-normal'>
														{item.nombre}
													</FormLabel>
												</FormItem>
											);
										}}
									/>
								))}
							</ScrollArea>
						</FormItem>
					)}
				/>
			</MutateModal>
		</section>
	);
}

// export const asesorCrmFields = [
// 	{
// 		name: "administrativoId",
// 		label: "Persona",
// 		inputType: "custom-combobox",
// 		options: "custom",
// 	},
// 	{
// 		name: "centroInformacionIds",
// 		label: "Persona",
// 		inputType: "custom-multi-select",
// 		options: "custom",
// 	},
// ] satisfies Field<keyof z.infer<typeof schema>>[];
