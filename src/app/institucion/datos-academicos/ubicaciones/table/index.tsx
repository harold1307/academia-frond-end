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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/app/_components/ui/select";
import { API } from "@/core/api-client";
import type { UbicacionClass, UbicacionFromAPI } from "@/core/api/ubicaciones";
import { useMutateModule } from "@/hooks/use-mutate-module";
import { useMutateSearchParams } from "@/hooks/use-mutate-search-params";
import type { ZodInferSchema } from "@/utils/types";
import { ubicacionFields, ubicacionesParams } from "../add-ubicacion";
import { columns, type UbicacionTableItem } from "./columns";
import { DataTable } from "./data-table";

type UbicacionTableProps = {
	ubicaciones: UbicacionTableItem[];
};

export default function UbicacionTable({ ubicaciones }: UbicacionTableProps) {
	return (
		<section>
			<DataTable columns={columns} data={ubicaciones} />
		</section>
	);
}

const schema = z.object<
	ZodInferSchema<
		Omit<Parameters<UbicacionClass["update"]>[0]["data"], "estado">
	>
>({
	nombre: z.string().optional(),
	capacidad: z.number().optional(),
	entornoVirtual: z.boolean().optional(),
	tipo: z.enum(["AULA", "LABORATORIO", "TALLER", "SALON"] as const).optional(),
});

export function UpdateUbicacion({
	ubicaciones,
}: {
	ubicaciones: UbicacionFromAPI[];
}) {
	const { searchParams, router, replaceDelete } = useMutateSearchParams();
	const {
		form,
		mutation: { isPending, mutate },
	} = useMutateModule({
		schema,
		mutationFn: async ({
			id,
			data,
		}: {
			id: string;
			data: z.infer<typeof schema>;
		}) => {
			return API.ubicaciones.update({ id, data });
		},
		onError: console.error,
		onSuccess: response => {
			console.log({ response });
			replaceDelete(ubicacionesParams.update);
			router.refresh();
		},
	});

	const paramUbicacionId = React.useMemo(
		() => searchParams.get(ubicacionesParams.update),
		[searchParams],
	);

	if (!paramUbicacionId) return null;

	const selectedUbicacion = ubicaciones.find(i => i.id === paramUbicacionId);

	if (!selectedUbicacion) {
		return (
			<ModalFallback
				action='update'
				redirectTo={() => replaceDelete(ubicacionesParams.update)}
			/>
		);
	}

	return (
		<MutateModal
			form={form}
			title='Actualizar ubicacion'
			disabled={isPending}
			onSubmit={form.handleSubmit(data =>
				mutate({ data, id: paramUbicacionId }),
			)}
			dialogProps={{
				defaultOpen: true,
				onOpenChange: open => {
					if (isPending) return;
					if (!open) {
						replaceDelete(ubicacionesParams.update);
						return;
					}
				},
			}}
		>
			{ubicacionFields.map(f => {
				return (
					<FormField
						control={form.control}
						name={f.name}
						key={f.name}
						disabled={isPending}
						shouldUnregister={true}
						defaultValue={selectedUbicacion[f.name]}
						render={({ field }) => {
							if (f.inputType === "custom-select") {
								return (
									<FormItem className='grid grid-cols-12 items-center gap-4 space-y-0'>
										<FormLabel className='col-span-3 text-end'>
											{f.label}
										</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value as string}
											disabled={field.disabled}
										>
											<FormControl>
												<SelectTrigger className='col-span-9'>
													<SelectValue className='w-full' />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{f.options.map(o => (
													<SelectItem value={o} key={o}>
														{o}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</FormItem>
								);
							}

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
											onChange={e =>
												f.inputType === "number"
													? field.onChange(+e.target.value)
													: field.onChange(e.target.value)
											}
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

export function DeleteUbicacion({
	ubicaciones,
}: {
	ubicaciones: UbicacionFromAPI[];
}) {
	const { searchParams, router, replaceDelete } = useMutateSearchParams();
	const {
		mutation: { isPending, mutate },
	} = useMutateModule({
		mutationFn: async (id: string) => {
			return API.ubicaciones.deleteById(id);
		},
		onError: console.error,
		onSuccess: response => {
			console.log({ response });
			replaceDelete(ubicacionesParams.delete);
			router.refresh();
		},
	});

	const paramUbicacionId = React.useMemo(
		() => searchParams.get(ubicacionesParams.delete),
		[searchParams],
	);

	if (!paramUbicacionId) return null;

	const selectedUbicacion = ubicaciones.find(i => i.id === paramUbicacionId);

	if (!selectedUbicacion) {
		return (
			<ModalFallback
				action='delete'
				redirectTo={() => replaceDelete(ubicacionesParams.delete)}
			/>
		);
	}

	return (
		<DeleteModal
			description={`Estas seguro que deseas eliminar la ubicacion: ${selectedUbicacion.nombre}`}
			title='Eliminar ubicacion'
			onDelete={() => mutate(selectedUbicacion.id)}
			disabled={isPending}
			onClose={() => replaceDelete(ubicacionesParams.delete)}
			dialogProps={{
				defaultOpen: true,
				onOpenChange: open => {
					if (isPending) return;
					if (!open) {
						replaceDelete(ubicacionesParams.delete);
						return;
					}
				},
			}}
		/>
	);
}
