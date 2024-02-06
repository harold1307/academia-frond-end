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
import type { EjeFormativoFromAPI } from "@/core/api/ejes-formativos";
import { useMutateModule } from "@/hooks/use-mutate-module";
import { useMutateSearchParams } from "@/hooks/use-mutate-search-params";
import type { ZodInferSchema } from "@/utils/types";
import { ejesFormativosParams } from "../add-eje";
import { columns } from "./columns";
import { DataTable } from "./data-table";

type EjesFormativosTableProps = {
	ejesFormativos: EjeFormativoFromAPI[];
};

export default function EjesFormativosTable({
	ejesFormativos,
}: EjesFormativosTableProps) {
	return (
		<section>
			<h1 className='text-2xl font-semibold'>Tabla</h1>
			<DataTable columns={columns} data={ejesFormativos} />
		</section>
	);
}

type UpdateEjeFormativoProps = {
	ejesFormativos: EjeFormativoFromAPI[];
};

const schema = z.object<
	ZodInferSchema<
		Partial<
			Omit<EjeFormativoFromAPI, "id" | "enUso" | "updatedAt" | "createdAt">
		>
	>
>({
	nombre: z.string().optional(),
});

export function UpdateEjeFormativo({
	ejesFormativos,
}: UpdateEjeFormativoProps) {
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
			return API.ejesFormativos.update({ id, data });
		},
		onError: console.error,
		onSuccess: response => {
			console.log({ response });
			replaceDelete(ejesFormativosParams.update);
			router.refresh();
		},
	});

	const paramEjeId = React.useMemo(
		() => searchParams.get(ejesFormativosParams.update),
		[searchParams],
	);

	if (!paramEjeId) return null;

	const selectedEje = ejesFormativos.find(i => i.id === paramEjeId);

	if (!selectedEje) {
		return (
			<ModalFallback
				action='update'
				redirectTo={() => replaceDelete(ejesFormativosParams.update)}
			/>
		);
	}

	return (
		<MutateModal
			form={form}
			title='Actualizar eje formativo'
			disabled={mutation.isPending}
			onSubmit={form.handleSubmit(data =>
				mutation.mutate({ data, id: paramEjeId }),
			)}
			dialogProps={{
				defaultOpen: true,
				onOpenChange: open => {
					if (mutation.isPending) return;
					if (!open) {
						replaceDelete(ejesFormativosParams.update);
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
		</MutateModal>
	);
}

export function DeleteEjeFormativo({
	ejesFormativos,
}: UpdateEjeFormativoProps) {
	const { searchParams, router, replaceDelete } = useMutateSearchParams();
	const { mutation } = useMutateModule({
		mutationFn: async (id: string) => {
			return API.ejesFormativos.deleteById(id);
		},
		onError: console.error,
		onSuccess: response => {
			console.log({ response });
			replaceDelete(ejesFormativosParams.delete);
			router.refresh();
		},
	});

	const paramEjeId = React.useMemo(
		() => searchParams.get(ejesFormativosParams.delete),
		[searchParams],
	);

	if (!paramEjeId) return null;

	const selectedEje = ejesFormativos.find(i => i.id === paramEjeId);

	if (!selectedEje) {
		return (
			<ModalFallback
				action='delete'
				redirectTo={() => replaceDelete(ejesFormativosParams.delete)}
			/>
		);
	}

	return (
		<DeleteModal
			description={`Estas seguro que deseas eliminar el eje formativo: ${selectedEje.nombre}`}
			title='Eliminar eje formativo'
			onDelete={() => mutation.mutate(selectedEje.id)}
			disabled={mutation.isPending}
			onClose={() => replaceDelete(ejesFormativosParams.delete)}
			dialogProps={{
				defaultOpen: true,
				onOpenChange: open => {
					if (mutation.isPending) return;
					if (!open) {
						replaceDelete(ejesFormativosParams.delete);
						return;
					}
				},
			}}
		/>
	);
}
