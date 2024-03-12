"use client";
import React from "react";
import { z } from "zod";

import DeleteModal from "@/app/_components/modals/delete-modal";
import ModalFallback from "@/app/_components/modals/modal-fallback";
import MutateModal from "@/app/_components/modals/mutate-modal";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/app/_components/ui/form";
import { Input } from "@/app/_components/ui/input";
import { API } from "@/core/api-client";
import type { ModalidadClass, ModalidadFromAPI } from "@/core/api/modalidades";
import { useMutateModule } from "@/hooks/use-mutate-module";
import { useMutateSearchParams } from "@/hooks/use-mutate-search-params";
import type { ZodInferSchema } from "@/utils/types";
import { modalidadFields, modalidadesParams } from "../add-modalidad";
import { columns, type ModalidadTableItem } from "./columns";
import { DataTable } from "./data-table";
import { MODALIDAD_KEYS } from "../query-keys";

type ModalidadTableProps = {
	modalidades: ModalidadTableItem[];
};

export default function ModalidadTable({ modalidades }: ModalidadTableProps) {
	return (
		<section>
			<DataTable columns={columns} data={modalidades} />
		</section>
	);
}

const schema = z.object<
	ZodInferSchema<
		Omit<Parameters<ModalidadClass["update"]>[0]["data"], "estado">
	>
>({
	nombre: z.string().optional(),
	alias: z.string().nullable().optional(),
});

export function UpdateModalidad({
	modalidades,
}: {
	modalidades: ModalidadFromAPI[];
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
			return API.modalidades.update({
				id,
				data: { ...data, alias: data.alias || null },
			});
		},
		onSuccess: response => {
			console.log({ response });
			replaceDelete(modalidadesParams.update);
			router.refresh();
		},
		invalidateQueryKey: MODALIDAD_KEYS.all,
	});

	const paramModalidadId = React.useMemo(
		() => searchParams.get(modalidadesParams.update),
		[searchParams],
	);

	if (!paramModalidadId) return null;

	const selectedModalidad = modalidades.find(i => i.id === paramModalidadId);

	if (!selectedModalidad) {
		return (
			<ModalFallback
				action='update'
				redirectTo={() => replaceDelete(modalidadesParams.update)}
			/>
		);
	}

	return (
		<MutateModal
			form={form}
			title='Actualizar modalidad'
			disabled={isPending}
			onSubmit={form.handleSubmit(data =>
				mutate({ data, id: paramModalidadId }),
			)}
			dialogProps={{
				defaultOpen: true,
				onOpenChange: open => {
					if (isPending) return;
					if (!open) {
						replaceDelete(modalidadesParams.update);
						return;
					}
				},
			}}
		>
			{modalidadFields.map(f => {
				return (
					<FormField
						control={form.control}
						name={f.name}
						key={f.name}
						disabled={isPending}
						shouldUnregister={true}
						defaultValue={selectedModalidad[f.name]}
						render={({ field }) => {
							return (
								<FormItem className='grid grid-cols-12 items-center gap-4 space-y-0'>
									<FormLabel className='col-span-3 text-end'>
										{f.label}
									</FormLabel>
									<FormControl>
										<Input
											{...field}
											value={
												typeof field.value === "boolean"
													? undefined
													: field.value || undefined
											}
											onChange={e => field.onChange(e.target.value)}
											type={f.inputType}
											className='col-span-9'
										/>
									</FormControl>
								</FormItem>
							);
						}}
					/>
				);
			})}
		</MutateModal>
	);
}

export function DeleteModalidad({
	modalidades,
}: {
	modalidades: ModalidadFromAPI[];
}) {
	const { searchParams, router, replaceDelete } = useMutateSearchParams();
	const {
		mutation: { isPending, mutate },
	} = useMutateModule({
		mutationFn: (id: string) => {
			return API.modalidades.deleteById(id);
		},
		onSuccess: response => {
			console.log({ response });
			replaceDelete(modalidadesParams.delete);
			router.refresh();
		},
		invalidateQueryKey: MODALIDAD_KEYS.all,
	});

	const paramModalidadId = React.useMemo(
		() => searchParams.get(modalidadesParams.delete),
		[searchParams],
	);

	if (!paramModalidadId) return null;

	const selectedModalidad = modalidades.find(i => i.id === paramModalidadId);

	if (!selectedModalidad) {
		return (
			<ModalFallback
				action='delete'
				redirectTo={() => replaceDelete(modalidadesParams.delete)}
			/>
		);
	}

	return (
		<DeleteModal
			description={`Estas seguro que deseas eliminar la modalidad: ${selectedModalidad.nombre}`}
			title='Eliminar modalidad'
			onDelete={() => mutate(selectedModalidad.id)}
			disabled={isPending}
			onClose={() => replaceDelete(modalidadesParams.delete)}
			dialogProps={{
				defaultOpen: true,
				onOpenChange: open => {
					if (isPending) return;
					if (!open) {
						replaceDelete(modalidadesParams.delete);
						return;
					}
				},
			}}
		/>
	);
}
