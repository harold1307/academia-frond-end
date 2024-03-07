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
import type {
	CentroInformacionClass,
	CentroInformacionFromAPI,
} from "@/core/api/centros-informacion";
import { useMutateModule } from "@/hooks/use-mutate-module";
import { useMutateSearchParams } from "@/hooks/use-mutate-search-params";
import type { ZodInferSchema } from "@/utils/types";
import {
	centroInformacionFields,
	centrosInformacionParams,
} from "../add-centro-informacion";
import { CENTROS_INFORMACION_KEYS } from "../query-keys";
import { columns, type CentroInformacionTableItem } from "./columns";
import { DataTable } from "./data-table";

type CentroInformacionTableProps = {
	centrosInformacion: CentroInformacionTableItem[];
};

export default function CentroInformacionTable({
	centrosInformacion,
}: CentroInformacionTableProps) {
	return (
		<section>
			<DataTable columns={columns} data={centrosInformacion} />
		</section>
	);
}

const schema = z.object<
	ZodInferSchema<
		Omit<Parameters<CentroInformacionClass["update"]>[0]["data"], "estado">
	>
>({
	nombre: z.string().optional(),
});

export function UpdateCentroInformacion({
	centrosInformacion,
}: {
	centrosInformacion: CentroInformacionFromAPI[];
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
			return API.centrosInformacion.update({
				id,
				data,
			});
		},
		onSuccess: response => {
			console.log({ response });
			replaceDelete(centrosInformacionParams.update);
			router.refresh();
		},
		invalidateQueryKey: CENTROS_INFORMACION_KEYS.all,
	});

	const paramCentroInformacionId = React.useMemo(
		() => searchParams.get(centrosInformacionParams.update),
		[searchParams],
	);

	if (!paramCentroInformacionId) return null;

	const selectedCentroInformacion = centrosInformacion.find(
		i => i.id === paramCentroInformacionId,
	);

	if (!selectedCentroInformacion) {
		return (
			<ModalFallback
				action='update'
				redirectTo={() => replaceDelete(centrosInformacionParams.update)}
			/>
		);
	}

	return (
		<MutateModal
			form={form}
			title='Actualizar centro de informacion'
			disabled={isPending}
			onSubmit={form.handleSubmit(data =>
				mutate({ data, id: paramCentroInformacionId }),
			)}
			dialogProps={{
				defaultOpen: true,
				onOpenChange: open => {
					if (isPending) return;
					if (!open) {
						replaceDelete(centrosInformacionParams.update);
						return;
					}
				},
			}}
		>
			{centroInformacionFields.map(f => {
				return (
					<FormField
						control={form.control}
						name={f.name}
						key={f.name}
						disabled={isPending}
						shouldUnregister={true}
						defaultValue={selectedCentroInformacion[f.name]}
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

export function DeleteCentroInformacion({
	centrosInformacion,
}: {
	centrosInformacion: CentroInformacionFromAPI[];
}) {
	const { searchParams, router, replaceDelete } = useMutateSearchParams();
	const {
		mutation: { isPending, mutate },
	} = useMutateModule({
		mutationFn: (id: string) => {
			return API.centrosInformacion.deleteById(id);
		},
		onSuccess: response => {
			console.log({ response });
			replaceDelete(centrosInformacionParams.delete);
			router.refresh();
		},
		invalidateQueryKey: CENTROS_INFORMACION_KEYS.all,
	});

	const paramCentroInformacionId = React.useMemo(
		() => searchParams.get(centrosInformacionParams.delete),
		[searchParams],
	);

	if (!paramCentroInformacionId) return null;

	const selectedCentroInformacion = centrosInformacion.find(
		i => i.id === paramCentroInformacionId,
	);

	if (!selectedCentroInformacion) {
		return (
			<ModalFallback
				action='delete'
				redirectTo={() => replaceDelete(centrosInformacionParams.delete)}
			/>
		);
	}

	return (
		<DeleteModal
			description={`Estas seguro que deseas eliminar el centro de informacion: ${selectedCentroInformacion.nombre}`}
			title='Eliminar centro de informacion'
			onDelete={() => mutate(selectedCentroInformacion.id)}
			disabled={isPending}
			onClose={() => replaceDelete(centrosInformacionParams.delete)}
			dialogProps={{
				defaultOpen: true,
				onOpenChange: open => {
					if (isPending) return;
					if (!open) {
						replaceDelete(centrosInformacionParams.delete);
						return;
					}
				},
			}}
		/>
	);
}
