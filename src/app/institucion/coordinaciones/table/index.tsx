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
import type {
	CoordinacionClass,
	CoordinacionFromAPI,
} from "@/core/api/coordinaciones";
import type { SedeFromAPI } from "@/core/api/sede";
import { useMutateModule } from "@/hooks/use-mutate-module";
import { useMutateSearchParams } from "@/hooks/use-mutate-search-params";
import type { ZodInferSchema } from "@/utils/types";
import { coordinacionesParams } from "../add-coordinacion";
import { columns, type CoordinacionTableItem } from "./columns";
import { DataTable } from "./data-table";

type CoordinacionTableProps = {
	coordinaciones: CoordinacionTableItem[];
};

export default function CoordinacionTable({
	coordinaciones,
}: CoordinacionTableProps) {
	return (
		<section>
			<DataTable columns={columns} data={coordinaciones} />
		</section>
	);
}

const schema = z.object<
	ZodInferSchema<Parameters<CoordinacionClass["update"]>[0]["data"]>
>({
	nombre: z.string().optional(),
	alias: z.string().optional(),
});

export function UpdateCoordinacion({
	coordinaciones,
	sedes,
}: {
	coordinaciones: CoordinacionFromAPI[];
	sedes: SedeFromAPI[];
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
			return API.coordinaciones.update({ id, data });
		},
		onError: console.error,
		onSuccess: response => {
			console.log({ response });
			replaceDelete(coordinacionesParams.update);
			router.refresh();
		},
	});

	const paramCoordinacionId = React.useMemo(
		() => searchParams.get(coordinacionesParams.update),
		[searchParams],
	);

	if (!paramCoordinacionId) return null;

	const selectedCoordinacion = coordinaciones.find(
		i => i.id === paramCoordinacionId,
	);

	if (!selectedCoordinacion) {
		return (
			<ModalFallback
				action='update'
				redirectTo={() => replaceDelete(coordinacionesParams.update)}
			/>
		);
	}

	return (
		<MutateModal
			form={form}
			title='Actualizar coordinacion'
			disabled={isPending}
			onSubmit={form.handleSubmit(data =>
				mutate({ data, id: paramCoordinacionId }),
			)}
			dialogProps={{
				defaultOpen: true,
				onOpenChange: open => {
					if (isPending) return;
					if (!open) {
						replaceDelete(coordinacionesParams.update);
						return;
					}
				},
			}}
		>
			<FormItem className='grid grid-cols-12 items-center gap-4 space-y-0'>
				<FormLabel className='col-span-3 text-end'>Sede</FormLabel>
				<Select value={selectedCoordinacion.sedeId} disabled={true}>
					<FormControl>
						<SelectTrigger className='col-span-9'>
							<SelectValue className='w-full' />
						</SelectTrigger>
					</FormControl>
					<SelectContent>
						{sedes.map(sede => (
							<SelectItem value={sede.id} key={sede.id}>
								{sede.nombre}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</FormItem>
			<FormField
				control={form.control}
				name={"nombre"}
				defaultValue={selectedCoordinacion.nombre}
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
				name={"alias"}
				defaultValue={selectedCoordinacion.alias}
				render={({ field }) => (
					<FormItem className='grid grid-cols-12 items-center gap-4 space-y-0'>
						<FormLabel className='col-span-3 text-end'>Alias</FormLabel>
						<FormControl>
							<Input {...field} className='col-span-9' />
						</FormControl>
					</FormItem>
				)}
			/>
		</MutateModal>
	);
}

export function DeleteCoordinacion({
	coordinaciones,
}: {
	coordinaciones: CoordinacionFromAPI[];
}) {
	const { searchParams, router, replaceDelete } = useMutateSearchParams();
	const {
		mutation: { isPending, mutate },
	} = useMutateModule({
		mutationFn: async (id: string) => {
			return API.coordinaciones.deleteById(id);
		},
		onError: console.error,
		onSuccess: response => {
			console.log({ response });
			replaceDelete(coordinacionesParams.delete);
			router.refresh();
		},
	});

	const paramCoordinacionId = React.useMemo(
		() => searchParams.get(coordinacionesParams.delete),
		[searchParams],
	);

	if (!paramCoordinacionId) return null;

	const selectedCoordinacion = coordinaciones.find(
		i => i.id === paramCoordinacionId,
	);

	if (!selectedCoordinacion) {
		return (
			<ModalFallback
				action='delete'
				redirectTo={() => replaceDelete(coordinacionesParams.delete)}
			/>
		);
	}

	return (
		<DeleteModal
			description={`Estas seguro que deseas eliminar la coordinacion: ${selectedCoordinacion.nombre}`}
			title='Eliminar coordinacion'
			onDelete={() => mutate(selectedCoordinacion.id)}
			disabled={isPending}
			onClose={() => replaceDelete(coordinacionesParams.delete)}
			dialogProps={{
				defaultOpen: true,
				onOpenChange: open => {
					if (isPending) return;
					if (!open) {
						replaceDelete(coordinacionesParams.delete);
						return;
					}
				},
			}}
		/>
	);
}
