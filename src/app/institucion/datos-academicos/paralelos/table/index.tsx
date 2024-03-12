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
import type { ParaleloClass, ParaleloFromAPI } from "@/core/api/paralelos";
import { useMutateModule } from "@/hooks/use-mutate-module";
import { useMutateSearchParams } from "@/hooks/use-mutate-search-params";
import type { ZodInferSchema } from "@/utils/types";
import { paraleloFields, paralelosParams } from "../add-paralelo";
import { PARALELO_KEYS } from "../query-keys";
import { columns, type ParaleloTableItem } from "./columns";
import { DataTable } from "./data-table";

type ParaleloTableProps = {
	paralelos: ParaleloTableItem[];
};

export default function ParaleloTable({ paralelos }: ParaleloTableProps) {
	return (
		<section>
			<DataTable columns={columns} data={paralelos} />
		</section>
	);
}

const schema = z.object<
	ZodInferSchema<Omit<Parameters<ParaleloClass["update"]>[0]["data"], "estado">>
>({
	nombre: z.string().optional(),
	orden: z.number().optional(),
});

export function UpdateParalelo({
	paralelos,
}: {
	paralelos: Omit<ParaleloFromAPI, "sesion">[];
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
			return API.paralelos.update({
				id,
				data,
			});
		},
		onSuccess: response => {
			console.log({ response });
			replaceDelete(paralelosParams.update);
			router.refresh();
		},
		invalidateQueryKey: PARALELO_KEYS.all,
	});

	const paramParaleloId = React.useMemo(
		() => searchParams.get(paralelosParams.update),
		[searchParams],
	);

	if (!paramParaleloId) return null;

	const selectedParalelo = paralelos.find(i => i.id === paramParaleloId);

	if (!selectedParalelo) {
		return (
			<ModalFallback
				action='update'
				redirectTo={() => replaceDelete(paralelosParams.update)}
			/>
		);
	}

	return (
		<MutateModal
			form={form}
			title='Actualizar paralelo'
			disabled={isPending}
			onSubmit={form.handleSubmit(data =>
				mutate({ data, id: paramParaleloId }),
			)}
			dialogProps={{
				defaultOpen: true,
				onOpenChange: open => {
					if (isPending) return;
					if (!open) {
						replaceDelete(paralelosParams.update);
						return;
					}
				},
			}}
		>
			{paraleloFields.map(f => {
				return (
					<FormField
						control={form.control}
						name={f.name}
						key={f.name}
						disabled={isPending}
						shouldUnregister={true}
						defaultValue={selectedParalelo[f.name]}
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
											onChange={e => field.onChange(+e.target.value)}
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

export function DeleteParalelo({
	paralelos,
}: {
	paralelos: Omit<ParaleloFromAPI, "sesion">[];
}) {
	const { searchParams, router, replaceDelete } = useMutateSearchParams();
	const {
		mutation: { isPending, mutate },
	} = useMutateModule({
		mutationFn: (id: string) => {
			return API.paralelos.deleteById(id);
		},
		onSuccess: response => {
			console.log({ response });
			replaceDelete(paralelosParams.delete);
			router.refresh();
		},
		invalidateQueryKey: PARALELO_KEYS.all,
	});

	const paramParaleloId = React.useMemo(
		() => searchParams.get(paralelosParams.delete),
		[searchParams],
	);

	if (!paramParaleloId) return null;

	const selectedParalelo = paralelos.find(i => i.id === paramParaleloId);

	if (!selectedParalelo) {
		return (
			<ModalFallback
				action='delete'
				redirectTo={() => replaceDelete(paralelosParams.delete)}
			/>
		);
	}

	return (
		<DeleteModal
			description={`Estas seguro que deseas eliminar la paralelo: ${selectedParalelo.nombre}`}
			title='Eliminar paralelo'
			onDelete={() => mutate(selectedParalelo.id)}
			disabled={isPending}
			onClose={() => replaceDelete(paralelosParams.delete)}
			dialogProps={{
				defaultOpen: true,
				onOpenChange: open => {
					if (isPending) return;
					if (!open) {
						replaceDelete(paralelosParams.delete);
						return;
					}
				},
			}}
		/>
	);
}
