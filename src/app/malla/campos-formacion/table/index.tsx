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
	CampoFormacionClass,
	CampoFormacionFromAPI,
} from "@/core/api/campos-formacion";
import { useMutateModule } from "@/hooks/use-mutate-module";
import { useMutateSearchParams } from "@/hooks/use-mutate-search-params";
import type { ZodInferSchema } from "@/utils/types";
import { camposParams } from "../add-campo";
import { columns } from "./columns";
import { DataTable } from "./data-table";

type CamposFormacionTableProps = {
	camposFormacion: CampoFormacionFromAPI[];
};

export default function CamposFormacionTable({
	camposFormacion,
}: CamposFormacionTableProps) {
	return (
		<section>
			<h1 className='text-2xl font-semibold'>Tabla</h1>
			<DataTable columns={columns} data={camposFormacion} />
		</section>
	);
}

const schema = z.object<
	ZodInferSchema<Parameters<CampoFormacionClass["update"]>[0]["campoFormacion"]>
>({
	nombre: z.string().optional(),
});

export function UpdateCampoFormacion({
	camposFormacion,
}: CamposFormacionTableProps) {
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
			return API.camposFormacion.update({ id, campoFormacion: data });
		},
		onError: console.error,
		onSuccess: response => {
			console.log({ response });
			replaceDelete(camposParams.update);
			router.refresh();
		},
	});

	const paramCampoId = React.useMemo(
		() => searchParams.get(camposParams.update),
		[searchParams],
	);

	if (!paramCampoId) return null;

	const selectedCampo = camposFormacion.find(i => i.id === paramCampoId);

	if (!selectedCampo) {
		return (
			<ModalFallback
				action='update'
				redirectTo={() => replaceDelete(camposParams.update)}
			/>
		);
	}

	return (
		<MutateModal
			form={form}
			title='Actualizar campo de formacion'
			disabled={mutation.isPending}
			onSubmit={form.handleSubmit(data =>
				mutation.mutate({ data, id: paramCampoId }),
			)}
			dialogProps={{
				defaultOpen: true,
				onOpenChange: open => {
					if (mutation.isPending) return;
					if (!open) {
						replaceDelete(camposParams.update);
						return;
					}
				},
			}}
		>
			<FormField
				control={form.control}
				name='nombre'
				defaultValue={selectedCampo.nombre}
				render={({ field }) => (
					<FormItem className='grid grid-cols-12 items-center gap-4 space-y-0'>
						<FormLabel className='col-span-3 text-end'>Nombre</FormLabel>
						<FormControl>
							<Input {...field} className='col-span-9' />
						</FormControl>
					</FormItem>
				)}
			/>
		</MutateModal>
	);
}

export function DeleteCampoFormacion({
	camposFormacion,
}: CamposFormacionTableProps) {
	const { searchParams, router, replaceDelete } = useMutateSearchParams();
	const { mutation } = useMutateModule({
		mutationFn: async (id: string) => {
			return API.camposFormacion.deleteById(id);
		},
		onError: console.error,
		onSuccess: response => {
			console.log({ response });
			replaceDelete(camposParams.delete);
			router.refresh();
		},
	});

	const paramCampoId = React.useMemo(
		() => searchParams.get(camposParams.delete),
		[searchParams],
	);

	if (!paramCampoId) return null;

	const selectedEje = camposFormacion.find(i => i.id === paramCampoId);

	if (!selectedEje) {
		return (
			<ModalFallback
				action='delete'
				redirectTo={() => replaceDelete(camposParams.delete)}
			/>
		);
	}

	return (
		<DeleteModal
			description={`Estas seguro que deseas eliminar el campo de formacion: ${selectedEje.nombre}`}
			title='Eliminar campo de formacion'
			onDelete={() => mutation.mutate(selectedEje.id)}
			disabled={mutation.isPending}
			onClose={() => replaceDelete(camposParams.delete)}
			dialogProps={{
				defaultOpen: true,
				onOpenChange: open => {
					if (mutation.isPending) return;
					if (!open) {
						replaceDelete(camposParams.delete);
						return;
					}
				},
			}}
		/>
	);
}
