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
import type { TurnoClass, TurnoFromAPI } from "@/core/api/turnos";
import { useMutateModule } from "@/hooks/use-mutate-module";
import { useMutateSearchParams } from "@/hooks/use-mutate-search-params";
import type { ZodInferSchema } from "@/utils/types";
import { turnoFields, turnosParams } from "../add-turno";
import { columns, formatDateToTurnoTime, type TurnoTableItem } from "./columns";
import { DataTable } from "./data-table";

type TurnoTableProps = {
	turnos: TurnoTableItem[];
};

export default function TurnoTable({ turnos }: TurnoTableProps) {
	return (
		<section>
			<DataTable columns={columns} data={turnos} />
		</section>
	);
}

const schema = z.object<
	ZodInferSchema<Omit<Parameters<TurnoClass["update"]>[0]["data"], "estado">>
>({
	horas: z.number().int().optional(),
	comienza: z.string().datetime().optional(),
	termina: z.string().datetime().optional(),
});

export function UpdateTurno({
	turnos,
}: {
	turnos: Omit<TurnoFromAPI, "sesion">[];
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
			return API.turnos.update({
				id,
				data,
			});
		},
		onError: console.error,
		onSuccess: response => {
			console.log({ response });
			replaceDelete(turnosParams.update);
			router.refresh();
		},
	});

	const paramTurnoId = React.useMemo(
		() => searchParams.get(turnosParams.update),
		[searchParams],
	);

	if (!paramTurnoId) return null;

	const selectedTurno = turnos.find(i => i.id === paramTurnoId);

	if (!selectedTurno) {
		return (
			<ModalFallback
				action='update'
				redirectTo={() => replaceDelete(turnosParams.update)}
			/>
		);
	}

	return (
		<MutateModal
			form={form}
			title='Actualizar turno'
			disabled={isPending}
			onSubmit={form.handleSubmit(data => mutate({ data, id: paramTurnoId }))}
			dialogProps={{
				defaultOpen: true,
				onOpenChange: open => {
					if (isPending) return;
					if (!open) {
						replaceDelete(turnosParams.update);
						return;
					}
				},
			}}
		>
			{turnoFields.map(f => {
				return (
					<FormField
						control={form.control}
						name={f.name}
						key={f.name}
						disabled={isPending}
						shouldUnregister={true}
						defaultValue={
							f.name === "comienza" || f.name === "termina"
								? formatDateToTurnoTime(selectedTurno[f.name])
								: selectedTurno[f.name]
						}
						render={({ field }) => {
							if (f.inputType === "time") {
								return (
									<FormItem className='grid grid-cols-12 items-center gap-4 space-y-0'>
										<FormLabel className='col-span-3 text-end'>
											{f.label}
										</FormLabel>
										<FormControl>
											<Input
												{...field}
												type={f.inputType}
												className='col-span-9 w-48'
											/>
										</FormControl>
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

export function DeleteTurno({
	turnos,
}: {
	turnos: Omit<TurnoFromAPI, "sesion">[];
}) {
	const { searchParams, router, replaceDelete } = useMutateSearchParams();
	const {
		mutation: { isPending, mutate },
	} = useMutateModule({
		mutationFn: async (id: string) => {
			return API.turnos.deleteById(id);
		},
		onError: console.error,
		onSuccess: response => {
			console.log({ response });
			replaceDelete(turnosParams.delete);
			router.refresh();
		},
	});

	const paramTurnoId = React.useMemo(
		() => searchParams.get(turnosParams.delete),
		[searchParams],
	);

	if (!paramTurnoId) return null;

	const selectedTurno = turnos.find(i => i.id === paramTurnoId);

	if (!selectedTurno) {
		return (
			<ModalFallback
				action='delete'
				redirectTo={() => replaceDelete(turnosParams.delete)}
			/>
		);
	}

	const comienzaDate = new Date(selectedTurno.comienza);
	const terminaDate = new Date(selectedTurno.termina);

	const nombre = `TURNO [${formatDateToTurnoTime(
		comienzaDate,
	)} a ${formatDateToTurnoTime(terminaDate)}]`;

	return (
		<DeleteModal
			description={`Estas seguro que deseas eliminar la turno: ${nombre}`}
			title='Eliminar turno'
			onDelete={() => mutate(selectedTurno.id)}
			disabled={isPending}
			onClose={() => replaceDelete(turnosParams.delete)}
			dialogProps={{
				defaultOpen: true,
				onOpenChange: open => {
					if (isPending) return;
					if (!open) {
						replaceDelete(turnosParams.delete);
						return;
					}
				},
			}}
		/>
	);
}
