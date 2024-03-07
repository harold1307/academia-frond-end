"use client";
import React from "react";
import { z } from "zod";

import ModalFallback from "@/app/_components/modals/modal-fallback";
import MutateModal from "@/app/_components/modals/mutate-modal";
import { Checkbox } from "@/app/_components/ui/checkbox";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/app/_components/ui/form";
import { API } from "@/core/api-client";
import type {
	AsesorEstudianteClass,
	AsesorEstudianteFromAPI,
} from "@/core/api/asesores-estudiante";
import { useMutateModule } from "@/hooks/use-mutate-module";
import { useMutateSearchParams } from "@/hooks/use-mutate-search-params";
import type { Field } from "@/utils/forms";
import type { ZodInferSchema } from "@/utils/types";
import { asesoresEstudianteParams } from "../add-asesor-estudiante";
import { ASESORES_ESTUDIANTE_KEYS } from "../query-keys";
import { columns, type AsesorEstudianteTableItem } from "./columns";
import { DataTable } from "./data-table";

type AsesorEstudianteTableProps = {
	asesoresEstudiante: AsesorEstudianteTableItem[];
};

export default function AsesorEstudianteTable({
	asesoresEstudiante,
}: AsesorEstudianteTableProps) {
	return (
		<section>
			<DataTable columns={columns} data={asesoresEstudiante} />
		</section>
	);
}

const schema = z.object<
	ZodInferSchema<
		Omit<Parameters<AsesorEstudianteClass["update"]>[0]["data"], "estado">
	>
>({
	seguimientoBienestar: z.boolean().optional(),
	seguimientoExpediente: z.boolean().optional(),
});

export function UpdateAsesorEstudiante({
	asesoresEstudiante,
}: {
	asesoresEstudiante: AsesorEstudianteFromAPI[];
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
			return API.asesoresEstudiante.update({
				id,
				data,
			});
		},
		onSuccess: response => {
			console.log({ response });
			replaceDelete(asesoresEstudianteParams.update);
			router.refresh();
		},
		invalidateQueryKey: ASESORES_ESTUDIANTE_KEYS.all,
	});

	const paramAsesorEstudianteId = React.useMemo(
		() => searchParams.get(asesoresEstudianteParams.update),
		[searchParams],
	);

	if (!paramAsesorEstudianteId) return null;

	const selectedAsesorEstudiante = asesoresEstudiante.find(
		i => i.id === paramAsesorEstudianteId,
	);

	if (!selectedAsesorEstudiante) {
		return (
			<ModalFallback
				action='update'
				redirectTo={() => replaceDelete(asesoresEstudianteParams.update)}
			/>
		);
	}

	return (
		<MutateModal
			form={form}
			title='Actualizar asesor de estudiante'
			disabled={isPending}
			onSubmit={form.handleSubmit(data =>
				mutate({ data, id: paramAsesorEstudianteId }),
			)}
			dialogProps={{
				defaultOpen: true,
				onOpenChange: open => {
					if (isPending) return;
					if (!open) {
						replaceDelete(asesoresEstudianteParams.update);
						return;
					}
				},
			}}
		>
			{asesorEstudianteFields.map(f => {
				return (
					<FormField
						control={form.control}
						name={f.name}
						key={f.name}
						disabled={isPending}
						defaultValue={selectedAsesorEstudiante[f.name]}
						shouldUnregister={true}
						render={({ field }) => {
							return (
								<FormItem className='grid grid-cols-12 items-center gap-4 space-y-0'>
									<FormLabel className='col-span-3 text-end'>
										{f.label}
									</FormLabel>
									<FormControl>
										<Checkbox
											checked={field.value as boolean}
											onCheckedChange={field.onChange}
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

const asesorEstudianteFields = [
	{
		name: "seguimientoBienestar",
		label: "Seguimiento bienestar",
		inputType: "checkbox",
	},
	{
		name: "seguimientoExpediente",
		label: "Seguimiento expediente",
		inputType: "checkbox",
	},
] satisfies Field<keyof z.infer<typeof schema>>[];
