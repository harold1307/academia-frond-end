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
	AreaConocimientoClass,
	AreaConocimientoFromAPI,
} from "@/core/api/areas-conocimiento";
import { useMutateModule } from "@/hooks/use-mutate-module";
import { useMutateSearchParams } from "@/hooks/use-mutate-search-params";
import type { ZodInferSchema } from "@/utils/types";
import { areasConocimientoParams } from "../add-area";
import { columns } from "./columns";
import { DataTable } from "./data-table";

type AreasConocimientoTableProps = {
	areasConocimiento: AreaConocimientoFromAPI[];
};

export default function AreasConocimientoTable({
	areasConocimiento,
}: AreasConocimientoTableProps) {
	return (
		<section>
			<h1 className='text-2xl font-semibold'>Tabla</h1>
			<DataTable columns={columns} data={areasConocimiento} />
		</section>
	);
}

const schema = z.object<
	ZodInferSchema<Parameters<AreaConocimientoClass["update"]>[0]["data"]>
>({
	codigo: z.string().nullable().optional(),
	nombre: z.string().optional(),
});

export function UpdateAreaConocimiento({
	areasConocimiento,
}: AreasConocimientoTableProps) {
	const { searchParams, router, replaceDelete } = useMutateSearchParams();
	const { form, mutation } = useMutateModule({
		schema,
		mutationFn: async ({
			id,
			data,
		}: {
			id: string;
			data: z.infer<typeof schema>;
		}) => {
			return API.areasConocimiento.update({ id, data });
		},
		onError: console.error,
		onSuccess: response => {
			console.log({ response });
			replaceDelete(areasConocimientoParams.update);
			router.refresh();
		},
	});

	const paramAreaId = React.useMemo(
		() => searchParams.get(areasConocimientoParams.update),
		[searchParams],
	);

	if (!paramAreaId) return null;

	const selectedEje = areasConocimiento.find(i => i.id === paramAreaId);

	if (!selectedEje) {
		return (
			<ModalFallback
				action='update'
				redirectTo={() => replaceDelete(areasConocimientoParams.update)}
			/>
		);
	}

	return (
		<MutateModal
			form={form}
			title='Actualizar area de conocimiento'
			disabled={mutation.isPending}
			onSubmit={form.handleSubmit(data =>
				mutation.mutate({ data, id: paramAreaId }),
			)}
			dialogProps={{
				defaultOpen: true,
				onOpenChange: open => {
					if (mutation.isPending) return;
					if (!open) {
						replaceDelete(areasConocimientoParams.update);
						return;
					}
				},
			}}
		>
			<FormField
				control={form.control}
				name='nombre'
				defaultValue={selectedEje.nombre}
				render={({ field }) => (
					<FormItem className='grid grid-cols-12 items-center gap-4 space-y-0'>
						<FormLabel className='col-span-3 text-end'>Nombre</FormLabel>
						<FormControl>
							<Input {...field} className='col-span-9' />
						</FormControl>
					</FormItem>
				)}
			/>
			<FormField
				control={form.control}
				name='codigo'
				defaultValue={selectedEje.codigo}
				render={({ field }) => (
					<FormItem className='grid grid-cols-12 items-center gap-4 space-y-0'>
						<FormLabel className='col-span-3 text-end'>Codigo</FormLabel>
						<FormControl>
							<Input
								{...field}
								value={field.value || undefined}
								className='col-span-9'
							/>
						</FormControl>
					</FormItem>
				)}
			/>
		</MutateModal>
	);
}

export function DeleteAreaConocimiento({
	areasConocimiento,
}: AreasConocimientoTableProps) {
	const { searchParams, router, replaceDelete } = useMutateSearchParams();
	const { mutation } = useMutateModule({
		mutationFn: async (id: string) => {
			return API.areasConocimiento.deleteById(id);
		},
		onError: console.error,
		onSuccess: response => {
			console.log({ response });
			replaceDelete(areasConocimientoParams.delete);
			router.refresh();
		},
	});

	const paramAreaId = React.useMemo(
		() => searchParams.get(areasConocimientoParams.delete),
		[searchParams],
	);

	if (!paramAreaId) return null;

	const selectedEje = areasConocimiento.find(i => i.id === paramAreaId);

	if (!selectedEje) {
		return (
			<ModalFallback
				action='delete'
				redirectTo={() => replaceDelete(areasConocimientoParams.delete)}
			/>
		);
	}

	return (
		<DeleteModal
			description={`Estas seguro que deseas eliminar el area de conocimiento: ${selectedEje.nombre}`}
			title='Eliminar area de conocimiento'
			onDelete={() => mutation.mutate(selectedEje.id)}
			disabled={mutation.isPending}
			onClose={() => replaceDelete(areasConocimientoParams.delete)}
			dialogProps={{
				defaultOpen: true,
				onOpenChange: open => {
					if (mutation.isPending) return;
					if (!open) {
						replaceDelete(areasConocimientoParams.delete);
						return;
					}
				},
			}}
		/>
	);
}
