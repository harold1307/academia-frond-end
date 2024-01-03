"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Asignatura } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
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
import { ROUTES } from "@/core/routes";
import { getParamName } from "@/utils";
import type { CreateAsignatura } from "../add-asignatura";
import { ASIGNATURA_KEYS } from "../query-keys";
import { columns, type AsignaturaTableItem } from "./columns";
import { DataTable } from "./data-table";

export default function AsignaturaTable() {
	const { data, isLoading } = useQuery({
		queryKey: ASIGNATURA_KEYS.lists(),
		queryFn: async () => {
			return (await API.asignaturas.getMany()).data;
		},
	});

	const asignaturas = React.useMemo(
		() =>
			data?.map(
				a =>
					({
						...a,
						isUsed: a.enUso,
					}) satisfies AsignaturaTableItem,
			) || [],
		[data],
	);

	if (isLoading) {
		return "Cargando tabla...";
	}

	if (isLoading && !data) {
		return "WTF";
	}

	if (!data) return "Ha ocurrido un error en el fetch";

	return (
		<section>
			<h1 className='text-2xl font-semibold'>Tabla</h1>
			<DataTable columns={columns} data={asignaturas} />
			<UpdateAsignaturaTableModal asignaturas={data} />
			<DeleteAsignaturaTableModal asignaturas={data} />
		</section>
	);
}

type UpdateAsignatura = Partial<CreateAsignatura>;

const schema: z.ZodType<UpdateAsignatura> = z.object({
	name: z.string().optional(),
	codigo: z
		.string()
		.nullable()
		.optional()
		.transform(c => c || undefined),
});

function UpdateAsignaturaTableModal(props: { asignaturas: Asignatura[] }) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const queryClient = useQueryClient();

	const { mutate: onSubmit, isPending: isSubmitting } = useMutation({
		mutationFn: async ({
			data,
			id,
		}: {
			data: UpdateAsignatura;
			id: string;
		}) => {
			return API.asignaturas.update({ asignatura: data, id });
		},
		onError: console.error,
		onSuccess: response => {
			console.log({ response });
			queryClient.invalidateQueries({
				queryKey: ASIGNATURA_KEYS.lists(),
			});
			router.replace(ROUTES.asignatura);
		},
	});

	const form = useForm<UpdateAsignatura>({
		resolver: zodResolver(schema),
		disabled: isSubmitting,
	});

	const paramAsignaturaId = React.useMemo(
		() =>
			searchParams.get(
				getParamName({ action: "actualizar", module: "Asignatura" }),
			),
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
				redirectTo={() => router.replace(ROUTES.asignatura)}
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
						router.replace(ROUTES.asignatura);
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

function DeleteAsignaturaTableModal(props: { asignaturas: Asignatura[] }) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const queryClient = useQueryClient();

	const { mutate: onSubmit, isPending: isSubmitting } = useMutation({
		mutationFn: async (id: string) => {
			return API.asignaturas.deleteById(id);
		},
		onError: console.error,
		onSuccess: response => {
			console.log({ response });
			queryClient.invalidateQueries({
				queryKey: ASIGNATURA_KEYS.lists(),
			});
			router.replace(ROUTES.asignatura);
		},
	});

	const paramAsignaturaId = React.useMemo(
		() =>
			searchParams.get(
				getParamName({
					action: "eliminar",
					module: "Asignatura",
				}),
			),
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
				redirectTo={() => router.replace(ROUTES.asignatura)}
			/>
		);
	}

	return (
		<DeleteModal
			description={`Estas seguro que deseas eliminar la asignatura: ${selectedAsignatura.nombre}`}
			title='Eliminar asignatura'
			onDelete={() => onSubmit(selectedAsignatura.id)}
			disabled={isSubmitting}
			onClose={() => router.replace(ROUTES.asignatura)}
			dialogProps={{
				open: true,
				onOpenChange: open => {
					if (isSubmitting) return;
					if (!open) {
						router.replace(ROUTES.asignatura);
						return;
					}
				},
			}}
		/>
	);
}
