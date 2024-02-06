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
import type { CursoFromAPI } from "@/core/api/cursos";
import { useMutateModule } from "@/hooks/use-mutate-module";
import { useMutateSearchParams } from "@/hooks/use-mutate-search-params";
import type { ZodInferSchema } from "@/utils/types";
import { cursosParams, fields } from "../add-curso";
import { columns } from "./columns";
import { DataTable } from "./data-table";

interface CursoTableProps {
	data: CursoFromAPI[];
}

export default function CursoTable({ data }: CursoTableProps) {
	return (
		<section className=''>
			{/* <h1 className='text-2xl font-semibold'>Tabla</h1> */}
			<DataTable
				columns={columns}
				data={data.map(d => ({ ...d, variantes: d.variantesCount }))}
			/>
			<UpdateCursoModal cursos={data} />
			<DeactivateCursoModal cursos={data} />
			<DeleteAsignaturaTableModal cursos={data} />
		</section>
	);
}

const schema = z.object<
	ZodInferSchema<Parameters<typeof API.cursos.update>[0]["data"]>
>({
	nombre: z.string().optional(),
	estado: z.boolean().optional(),
});

function UpdateCursoModal({ cursos }: { cursos: CursoFromAPI[] }) {
	const { searchParams, replaceDelete, router } = useMutateSearchParams();

	const { form, mutation } = useMutateModule({
		schema,
		mutationFn: async ({
			id,
			data,
		}: {
			id: string;
			data: z.infer<typeof schema>;
		}) => {
			return API.cursos.update({
				id,
				data: data,
			});
		},
		onError: console.error,
		onSuccess: response => {
			console.log({ response });
			replaceDelete(cursosParams.update);
			router.refresh();
		},
	});

	const paramCursoId = React.useMemo(
		() => searchParams.get(cursosParams.update),
		[searchParams],
	);

	if (!paramCursoId) return null;

	const selectedCurso = cursos.find(i => i.id === paramCursoId);

	if (!selectedCurso) {
		return (
			<ModalFallback
				action='update'
				redirectTo={() => replaceDelete(cursosParams.update)}
			/>
		);
	}

	return (
		<MutateModal
			form={form}
			title='Actualizar curso'
			disabled={mutation.isPending}
			onSubmit={form.handleSubmit(data =>
				mutation.mutate({ data, id: paramCursoId }),
			)}
			dialogProps={{
				defaultOpen: true,
				onOpenChange: open => {
					if (mutation.isPending) return;
					if (!open) {
						replaceDelete(cursosParams.update);
						return;
					}
				},
			}}
		>
			{fields.map(f => (
				<FormField
					control={form.control}
					name={f.name}
					key={f.name}
					defaultValue={selectedCurso[f.name] || undefined}
					render={({ field }) => (
						<FormItem className='grid grid-cols-12 items-center gap-4 space-y-0'>
							<FormLabel className='col-span-3 text-end'>{f.label}</FormLabel>
							<FormControl>
								<Input
									{...field}
									value={field.value || undefined}
									type={f.inputType}
									className='col-span-9'
								/>
							</FormControl>
						</FormItem>
					)}
				/>
			))}
		</MutateModal>
	);
}

function DeactivateCursoModal({ cursos }: { cursos: CursoFromAPI[] }) {
	const { searchParams, replaceDelete, router } = useMutateSearchParams();

	const { mutation } = useMutateModule({
		mutationFn: async ({ id, estado }: { id: string; estado: boolean }) => {
			return API.cursos.update({
				id,
				data: {
					estado: !estado,
				},
			});
		},
		onError: console.error,
		onSuccess: response => {
			console.log({ response });
			replaceDelete(cursosParams.deactivate);
			router.refresh();
		},
	});

	const paramCursoId = React.useMemo(
		() => searchParams.get(cursosParams.deactivate),
		[searchParams],
	);

	if (!paramCursoId) return null;

	const selectedCurso = cursos.find(i => i.id === paramCursoId);

	if (!selectedCurso) {
		return (
			<ModalFallback
				action='delete'
				redirectTo={() => replaceDelete(cursosParams.deactivate)}
			/>
		);
	}

	const config = selectedCurso.estado
		? {
				action: "desactivar",
				upperAction: "Desactivar",
				pendingAction: "Desactivando...",
			}
		: {
				action: "activar",
				upperAction: "Activar",
				pendingAction: "Activando...",
			};

	return (
		<DeleteModal
			description={`Estas seguro que deseas ${config.action} el curso: ${selectedCurso.nombre}`}
			title={`${config.upperAction} curso`}
			onDelete={() =>
				mutation.mutate({ id: selectedCurso.id, estado: selectedCurso.estado })
			}
			disabled={mutation.isPending}
			onClose={() => replaceDelete(cursosParams.deactivate)}
			dialogProps={{
				open: true,
				onOpenChange: open => {
					if (mutation.isPending) return;
					if (!open) {
						replaceDelete(cursosParams.deactivate);
						return;
					}
				},
			}}
			deleteButtonLabel={
				mutation.isPending ? config.pendingAction : config.upperAction
			}
		/>
	);
}

function DeleteAsignaturaTableModal(props: { cursos: CursoFromAPI[] }) {
	const { searchParams, router, replaceDelete } = useMutateSearchParams();

	const {
		mutation: { mutate, isPending },
	} = useMutateModule({
		mutationFn: async (id: string) => {
			return API.cursos.deleteById(id);
		},
		onError: console.error,
		onSuccess: response => {
			console.log({ response });
			replaceDelete(cursosParams.delete);
			router.refresh();
		},
	});

	const paramCursoId = React.useMemo(
		() => searchParams.get(cursosParams.delete),
		[searchParams],
	);

	if (!paramCursoId) return null;

	const selectedCurso = props.cursos.find(i => i.id === paramCursoId);

	if (!selectedCurso) {
		return (
			<ModalFallback
				action='delete'
				redirectTo={() => replaceDelete(cursosParams.delete)}
			/>
		);
	}

	return (
		<DeleteModal
			description={`Estas seguro que deseas eliminar el curso: ${selectedCurso.nombre}`}
			title='Eliminar curso'
			onDelete={() => mutate(selectedCurso.id)}
			disabled={isPending}
			onClose={() => replaceDelete(cursosParams.delete)}
			dialogProps={{
				defaultOpen: true,
				onOpenChange: open => {
					if (isPending) return;
					if (!open) {
						replaceDelete(cursosParams.delete);
						return;
					}
				},
			}}
		/>
	);
}
