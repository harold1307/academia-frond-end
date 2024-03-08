"use client";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { z } from "zod";

import DeleteModal from "@/app/_components/modals/delete-modal";
import ModalFallback from "@/app/_components/modals/modal-fallback";
import MutateModal from "@/app/_components/modals/mutate-modal";
import { Checkbox } from "@/app/_components/ui/checkbox";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/app/_components/ui/form";
import { ScrollArea } from "@/app/_components/ui/scroll-area";
import { API } from "@/core/api-client";
import type { AsesorCrmClass, AsesorCrmFromAPI } from "@/core/api/asesores-crm";
import { useMutateModule } from "@/hooks/use-mutate-module";
import { useMutateSearchParams } from "@/hooks/use-mutate-search-params";
import { formatFullName } from "@/utils";
import type { ZodInferSchema } from "@/utils/types";
import { CENTROS_INFORMACION_KEYS } from "../../centros-informacion/query-keys";
import { asesoresCrmParams } from "../add-asesor-crm";
import { ASESORES_CRM_KEYS } from "../query-keys";
import { columns, type AsesorCrmTableItem } from "./columns";
import { DataTable } from "./data-table";

type AsesorCrmTableProps = {
	asesoresCrm: AsesorCrmTableItem[];
};

export default function AsesorCrmTable({ asesoresCrm }: AsesorCrmTableProps) {
	return (
		<section>
			<DataTable columns={columns} data={asesoresCrm} />
		</section>
	);
}

const schema = z.object<
	ZodInferSchema<
		Omit<Parameters<AsesorCrmClass["update"]>[0]["data"], "estado">
	>
>({
	centroInformacionIds: z.array(z.string().uuid()),
});

export function UpdateAsesorCrm({
	asesoresCrm,
}: {
	asesoresCrm: AsesorCrmFromAPI[];
}) {
	const { searchParams, router, replaceDelete } = useMutateSearchParams();
	const {
		form,
		mutation: { isPending, mutate },
	} = useMutateModule({
		schema,
		mutationFn: ({
			id,
			data,
		}: {
			id: string;
			data: z.infer<typeof schema>;
		}) => {
			return API.asesoresCrm.update({
				id,
				data,
			});
		},
		onSuccess: response => {
			console.log({ response });
			replaceDelete(asesoresCrmParams.update);
			router.refresh();
		},
		invalidateQueryKey: ASESORES_CRM_KEYS.all,
	});

	const { data: centrosInformacion, isLoading: centrosInformacionAreLoading } =
		useQuery({
			queryKey: CENTROS_INFORMACION_KEYS.lists(),
			queryFn: () => {
				return API.centrosInformacion.getMany();
			},
		});

	const paramAsesorCrmId = React.useMemo(
		() => searchParams.get(asesoresCrmParams.update),
		[searchParams],
	);

	if (!paramAsesorCrmId) return null;

	const selectedAsesorCrm = asesoresCrm.find(i => i.id === paramAsesorCrmId);

	if (!selectedAsesorCrm) {
		return (
			<ModalFallback
				action='update'
				redirectTo={() => replaceDelete(asesoresCrmParams.update)}
			/>
		);
	}

	return (
		<MutateModal
			form={form}
			title='Actualizar asesor de CRM'
			disabled={isPending}
			onSubmit={form.handleSubmit(data =>
				mutate({ data, id: paramAsesorCrmId }),
			)}
			dialogProps={{
				defaultOpen: true,
				onOpenChange: open => {
					if (isPending) return;
					if (!open) {
						replaceDelete(asesoresCrmParams.update);
						return;
					}
				},
			}}
		>
			<FormField
				control={form.control}
				name='centroInformacionIds'
				defaultValue={selectedAsesorCrm.centrosInformacion.map(
					i => i.centroInformacionId,
				)}
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
	);
}

export function DeleteAsesorCrm({
	asesoresCrm,
}: {
	asesoresCrm: AsesorCrmFromAPI[];
}) {
	const { searchParams, router, replaceDelete } = useMutateSearchParams();
	const {
		mutation: { isPending, mutate },
	} = useMutateModule({
		mutationFn: (id: string) => {
			return API.asesoresCrm.deleteById(id);
		},
		onSuccess: response => {
			console.log({ response });
			replaceDelete(asesoresCrmParams.delete);
			router.refresh();
		},
		invalidateQueryKey: ASESORES_CRM_KEYS.all,
	});

	const paramAsesorCrmId = React.useMemo(
		() => searchParams.get(asesoresCrmParams.delete),
		[searchParams],
	);

	if (!paramAsesorCrmId) return null;

	const selectedAsesorCrm = asesoresCrm.find(i => i.id === paramAsesorCrmId);

	if (!selectedAsesorCrm) {
		return (
			<ModalFallback
				action='delete'
				redirectTo={() => replaceDelete(asesoresCrmParams.delete)}
			/>
		);
	}

	const fullName = formatFullName(
		selectedAsesorCrm.administrativo.usuario.nombres,
		selectedAsesorCrm.administrativo.usuario.primerApellido,
		selectedAsesorCrm.administrativo.usuario.segundoApellido,
	);

	return (
		<DeleteModal
			description={`Estas seguro que deseas eliminar el asesor de CRM: ${fullName}`}
			title='Eliminar asesor de CRM'
			onDelete={() => mutate(selectedAsesorCrm.id)}
			disabled={isPending}
			onClose={() => replaceDelete(asesoresCrmParams.delete)}
			dialogProps={{
				defaultOpen: true,
				onOpenChange: open => {
					if (isPending) return;
					if (!open) {
						replaceDelete(asesoresCrmParams.delete);
						return;
					}
				},
			}}
		/>
	);
}
