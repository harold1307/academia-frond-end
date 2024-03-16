"use client";
import React from "react";
import { z } from "zod";

import DeleteModal from "@/app/_components/modals/delete-modal";
import ModalFallback from "@/app/_components/modals/modal-fallback";
import MutateModal from "@/app/_components/modals/mutate-modal";
import { DataTable } from "@/app/_components/table";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/app/_components/ui/form";
import { Input } from "@/app/_components/ui/input";
import { API } from "@/core/api-client";
import type { GrupoClass, GrupoFromAPI } from "@/core/api/grupos";
import { useMutateModule } from "@/hooks/use-mutate-module";
import { useMutateSearchParams } from "@/hooks/use-mutate-search-params";
import type { ZodInferSchema } from "@/utils/types";
import { grupoFields, gruposParams } from "../add-grupo";
import { columns, type GrupoTableItem } from "./columns";

type GrupoTableProps = {
	grupos: GrupoTableItem[];
};

export function GrupoTable({ grupos }: GrupoTableProps) {
	return (
		<section>
			<DataTable<typeof columns, GrupoTableItem[]>
				columns={columns}
				data={grupos}
				hideColumns={{
					id: false,
				}}
			/>
		</section>
	);
}

const schema = z.object<
	ZodInferSchema<Omit<Parameters<GrupoClass["update"]>[0]["data"], "estado">>
>({
	nombre: z.string().optional(),
});

export function UpdateGrupo({ grupos }: { grupos: GrupoFromAPI[] }) {
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
			return API.grupos.update({ id, data });
		},
		onSuccess: response => {
			console.log({ response });
			replaceDelete(gruposParams.update);
			router.refresh();
		},
	});

	const paramGrupoId = React.useMemo(
		() => searchParams.get(gruposParams.update),
		[searchParams],
	);

	if (!paramGrupoId) return null;

	const selectedGrupo = grupos.find(i => i.id === paramGrupoId);

	if (!selectedGrupo) {
		return (
			<ModalFallback
				action='update'
				redirectTo={() => replaceDelete(gruposParams.update)}
			/>
		);
	}

	return (
		<MutateModal
			form={form}
			title='Actualizar grupo'
			disabled={isPending}
			onSubmit={form.handleSubmit(data => mutate({ data, id: paramGrupoId }))}
			dialogProps={{
				defaultOpen: true,
				onOpenChange: open => {
					if (isPending) return;
					if (!open) {
						replaceDelete(gruposParams.update);
						return;
					}
				},
			}}
		>
			{grupoFields.map(f => {
				return (
					<FormField
						control={form.control}
						name={f.name}
						key={f.name}
						disabled={isPending}
						shouldUnregister={true}
						defaultValue={selectedGrupo[f.name]}
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

export function DeleteGrupo({ grupos }: { grupos: GrupoFromAPI[] }) {
	const { searchParams, router, replaceDelete } = useMutateSearchParams();
	const {
		mutation: { isPending, mutate },
	} = useMutateModule({
		mutationFn: (id: string) => {
			return API.grupos.deleteById(id);
		},
		onSuccess: response => {
			console.log({ response });
			replaceDelete(gruposParams.delete);
			router.refresh();
		},
	});

	const paramGrupoId = React.useMemo(
		() => searchParams.get(gruposParams.delete),
		[searchParams],
	);

	if (!paramGrupoId) return null;

	const selectedGrupo = grupos.find(i => i.id === paramGrupoId);

	if (!selectedGrupo) {
		return (
			<ModalFallback
				action='delete'
				redirectTo={() => replaceDelete(gruposParams.delete)}
			/>
		);
	}

	return (
		<DeleteModal
			description={`Estas seguro que deseas eliminar grupo: ${selectedGrupo.nombre}`}
			title='Eliminar grupo'
			onDelete={() => mutate(selectedGrupo.id)}
			disabled={isPending}
			onClose={() => replaceDelete(gruposParams.delete)}
			dialogProps={{
				defaultOpen: true,
				onOpenChange: open => {
					if (isPending) return;
					if (!open) {
						replaceDelete(gruposParams.delete);
						return;
					}
				},
			}}
		/>
	);
}
