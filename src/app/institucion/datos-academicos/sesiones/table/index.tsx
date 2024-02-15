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
import type { SesionClass, SesionFromAPI } from "@/core/api/sesiones";
import { useMutateModule } from "@/hooks/use-mutate-module";
import { useMutateSearchParams } from "@/hooks/use-mutate-search-params";
import type { ZodInferSchema } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { sesionFields, sesionesParams } from "../add-sesion";
import { columns, type SesionTableItem } from "./columns";
import { DataTable } from "./data-table";
import { SEDE_KEYS } from "@/app/institucion/query-keys";

type SesionTableProps = {
	sesiones: SesionTableItem[];
};

export default function SesionTable({ sesiones }: SesionTableProps) {
	return (
		<section>
			<DataTable columns={columns} data={sesiones} />
		</section>
	);
}

const schema = z.object<
	ZodInferSchema<Omit<Parameters<SesionClass["update"]>[0]["data"], "estado">>
>({
	nombre: z.string().optional(),
	sedeId: z.string().uuid().optional(),
	alias: z.string().optional(),
	lunes: z.boolean().optional(),
	martes: z.boolean().optional(),
	miercoles: z.boolean().optional(),
	jueves: z.boolean().optional(),
	viernes: z.boolean().optional(),
	sabado: z.boolean().optional(),
	domingo: z.boolean().optional(),
});

export function UpdateSesion({ sesiones }: { sesiones: SesionFromAPI[] }) {
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
			return API.sesiones.update({
				id,
				data,
			});
		},
		onError: console.error,
		onSuccess: response => {
			console.log({ response });
			replaceDelete(sesionesParams.update);
			router.refresh();
		},
	});

	const {
		data: sedes,
		isLoading: sedesAreLoading,
		refetch: fetchSedes,
	} = useQuery({
		queryKey: SEDE_KEYS.lists(),
		queryFn: () => {
			return API.sedes.getMany();
		},
		enabled: false,
	});

	const paramSesionId = React.useMemo(
		() => searchParams.get(sesionesParams.update),
		[searchParams],
	);

	if (!paramSesionId) return null;

	const selectedSesion = sesiones.find(i => i.id === paramSesionId);

	if (!selectedSesion) {
		return (
			<ModalFallback
				action='update'
				redirectTo={() => replaceDelete(sesionesParams.update)}
			/>
		);
	}

	return (
		<MutateModal
			form={form}
			title='Actualizar sesion'
			disabled={isPending}
			onSubmit={form.handleSubmit(data => mutate({ data, id: paramSesionId }))}
			dialogProps={{
				defaultOpen: true,
				onOpenChange: open => {
					if (isPending) return;
					if (!open) {
						replaceDelete(sesionesParams.update);
						return;
					}
				},
			}}
		>
			{sesionFields.map(f => {
				if (f.inputType === "custom-select") {
					return (
						<FormField
							control={form.control}
							name={f.name}
							key={f.name}
							disabled={isPending}
							shouldUnregister={true}
							defaultValue={selectedSesion[f.name]}
							render={({ field }) => (
								<FormItem className='grid grid-cols-12 items-center gap-4 space-y-0'>
									<FormLabel className='col-span-3 text-end'>
										{f.label}
									</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value as string}
										disabled={field.disabled}
										onOpenChange={() => {
											if (!sedes) {
												fetchSedes();
											}
										}}
									>
										<FormControl>
											<SelectTrigger className='col-span-9'>
												<SelectValue className='w-full' />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{sedesAreLoading
												? "Cargando opciones..."
												: sedes?.data?.length
													? sedes?.data.map(s => (
															<SelectItem value={s.id} key={s.id}>
																{s.nombre}
															</SelectItem>
														))
													: "No hay resultados"}
										</SelectContent>
									</Select>
								</FormItem>
							)}
						/>
					);
				}

				if (f.inputType === "checkbox") {
					return (
						<FormField
							control={form.control}
							name={f.name}
							key={f.name}
							disabled={isPending}
							shouldUnregister={true}
							defaultValue={selectedSesion[f.name]}
							render={({ field }) => (
								<FormItem className='grid grid-cols-12 items-center gap-4 space-y-0'>
									<FormLabel className='col-span-3 text-end'>
										{f.label}
									</FormLabel>
									<FormControl>
										<Input
											{...field}
											value={undefined}
											onChange={e => field.onChange(e.target.checked)}
											checked={field.value as boolean}
											type={f.inputType}
											className='col-span-9'
										/>
									</FormControl>
								</FormItem>
							)}
						/>
					);
				}

				return (
					<FormField
						control={form.control}
						name={f.name}
						key={f.name}
						disabled={isPending}
						shouldUnregister={true}
						defaultValue={selectedSesion[f.name]}
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

export function DeleteSesion({ sesiones }: { sesiones: SesionFromAPI[] }) {
	const { searchParams, router, replaceDelete } = useMutateSearchParams();
	const {
		mutation: { isPending, mutate },
	} = useMutateModule({
		mutationFn: async (id: string) => {
			return API.sesiones.deleteById(id);
		},
		onError: console.error,
		onSuccess: response => {
			console.log({ response });
			replaceDelete(sesionesParams.delete);
			router.refresh();
		},
	});

	const paramSesionId = React.useMemo(
		() => searchParams.get(sesionesParams.delete),
		[searchParams],
	);

	if (!paramSesionId) return null;

	const selectedSesion = sesiones.find(i => i.id === paramSesionId);

	if (!selectedSesion) {
		return (
			<ModalFallback
				action='delete'
				redirectTo={() => replaceDelete(sesionesParams.delete)}
			/>
		);
	}

	return (
		<DeleteModal
			description={`Estas seguro que deseas eliminar la sesion: ${selectedSesion.nombre}`}
			title='Eliminar sesion'
			onDelete={() => mutate(selectedSesion.id)}
			disabled={isPending}
			onClose={() => replaceDelete(sesionesParams.delete)}
			dialogProps={{
				defaultOpen: true,
				onOpenChange: open => {
					if (isPending) return;
					if (!open) {
						replaceDelete(sesionesParams.delete);
						return;
					}
				},
			}}
		/>
	);
}
