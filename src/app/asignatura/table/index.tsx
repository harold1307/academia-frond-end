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
import type { AsignaturaFromAPI } from "@/core/api/asignaturas";
import { useMutateModule } from "@/hooks/use-mutate-module";
import { useMutateSearchParams } from "@/hooks/use-mutate-search-params";
import type { ZodInferSchema } from "@/utils/types";
import { asignaturasParams, columns } from "./columns";
import { DataTable } from "./data-table";

type AsignaturaTableProps = {
	asignaturas: AsignaturaFromAPI[];
};

export default function AsignaturaTable({ asignaturas }: AsignaturaTableProps) {
	return (
		<section>
			<h1 className='text-2xl font-semibold'>Tabla</h1>
			<DataTable columns={columns} data={asignaturas} />
			<UpdateAsignaturaTableModal asignaturas={asignaturas} />
			<DeleteAsignaturaTableModal asignaturas={asignaturas} />
		</section>
	);
}

const schema = z.object<
	ZodInferSchema<Parameters<typeof API.asignaturas.update>[0]["data"]>
>({
	nombre: z.string().optional(),
	codigo: z.string().nullable().optional(),
});

type UpdateAsignatura = z.infer<typeof schema>;

function UpdateAsignaturaTableModal(props: {
	asignaturas: AsignaturaFromAPI[];
}) {
	const { searchParams, replaceDelete, router } = useMutateSearchParams();

	const {
		mutation: { mutate: onSubmit, isPending: isSubmitting },
		form,
	} = useMutateModule({
		schema,
		mutationFn: async ({
			data: { codigo, ...data },
			id,
		}: {
			data: UpdateAsignatura;
			id: string;
		}) => {
			return API.asignaturas.update({
				data: { ...data, codigo: codigo || null },
				id,
			});
		},
		onError: console.error,
		onSuccess: response => {
			console.log({ response });
			replaceDelete(asignaturasParams.update);
			router.refresh();
		},
	});

	const paramAsignaturaId = React.useMemo(
		() => searchParams.get(asignaturasParams.update),
		[searchParams],
	);

	if (!paramAsignaturaId) return null;

	const selectedAsignatura = props.asignaturas.find(
		i => i.id === paramAsignaturaId,
	);

	if (!selectedAsignatura) {
		return (
			<ModalFallback
				action='update'
				redirectTo={() => replaceDelete(asignaturasParams.update)}
			/>
		);
	}

	return (
		<MutateModal
			form={form}
			title='Actualizar asignatura'
			disabled={isSubmitting}
			onSubmit={form.handleSubmit(data =>
				onSubmit({ data, id: paramAsignaturaId }),
			)}
			dialogProps={{
				defaultOpen: true,
				onOpenChange: open => {
					if (isSubmitting) return;
					if (!open) {
						replaceDelete(asignaturasParams.update);
						return;
					}
				},
			}}
		>
			<FormField
				control={form.control}
				name='nombre'
				defaultValue={selectedAsignatura.nombre}
				render={({ field }) => (
					<FormItem className='grid grid-cols-12 items-center gap-4 space-y-0'>
						<FormLabel className='col-span-3 text-end'>Nombre</FormLabel>
						<FormControl>
							<Input
								{...field}
								value={field.value || undefined}
								disabled={true}
								className='col-span-9'
							/>
						</FormControl>
					</FormItem>
				)}
			/>
			<FormField
				control={form.control}
				name='codigo'
				defaultValue={selectedAsignatura.codigo}
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

function DeleteAsignaturaTableModal(props: {
	asignaturas: AsignaturaFromAPI[];
}) {
	const { searchParams, router, replaceDelete } = useMutateSearchParams();

	const {
		mutation: { mutate, isPending },
	} = useMutateModule({
		mutationFn: async (id: string) => {
			return API.asignaturas.deleteById(id);
		},
		onError: console.error,
		onSuccess: response => {
			console.log({ response });
			replaceDelete(asignaturasParams.delete);
			router.refresh();
		},
	});

	const paramAsignaturaId = React.useMemo(
		() => searchParams.get(asignaturasParams.delete),
		[searchParams],
	);

	if (!paramAsignaturaId) return null;

	const selectedAsignatura = props.asignaturas.find(
		i => i.id === paramAsignaturaId,
	);

	if (!selectedAsignatura) {
		return (
			<ModalFallback
				action='delete'
				redirectTo={() => replaceDelete(asignaturasParams.delete)}
			/>
		);
	}

	return (
		<DeleteModal
			description={`Estas seguro que deseas eliminar la asignatura: ${selectedAsignatura.nombre}`}
			title='Eliminar asignatura'
			onDelete={() => mutate(selectedAsignatura.id)}
			disabled={isPending}
			onClose={() => replaceDelete(asignaturasParams.delete)}
			dialogProps={{
				defaultOpen: true,
				onOpenChange: open => {
					if (isPending) return;
					if (!open) {
						replaceDelete(asignaturasParams.delete);
						return;
					}
				},
			}}
		/>
	);
}
