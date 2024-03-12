"use client";
import React from "react";

import DeleteModal from "@/app/_components/modals/delete-modal";
import ModalFallback from "@/app/_components/modals/modal-fallback";
import { DataTable } from "@/app/_components/table";
import { API } from "@/core/api-client";
import type { CursoEscuelaFromAPI } from "@/core/api/curso-escuelas";
import { useMutateModule } from "@/hooks/use-mutate-module";
import { useMutateSearchParams } from "@/hooks/use-mutate-search-params";
import { cursosEscuelaParams } from "../add-curso-escuela";
import { columns, type CursoEscuelaTableItem } from "./columns";

export type CursoEscuelaTableProps = {
	data: CursoEscuelaTableItem[];
};

export default function CursoTable({ data }: CursoEscuelaTableProps) {
	return (
		<section className=''>
			<DataTable<typeof columns, CursoEscuelaTableItem[]>
				columns={columns}
				data={data}
				hideColumns={{
					id: false,
					estado: false,
				}}
			/>
		</section>
	);
}

// const schema = z.object<
// 	ZodInferSchema<Parameters<typeof API.cursoEscuelas.update>[0]["data"]>
// >({
// 	nombre: z.string().optional(),
// 	estado: z.boolean().optional(),
// });

// export function UpdateCursoModal({ cursos }: { cursos: CursoEscuelaFromAPI[] }) {
// 	const { searchParams, replaceDelete, router } = useMutateSearchParams();

// 	const { form, mutation } = useMutateModule({
// 		schema,
// 		mutationFn: async ({
// 			id,
// 			data,
// 		}: {
// 			id: string;
// 			data: z.infer<typeof schema>;
// 		}) => {
// 			return API.cursos.update({
// 				id,
// 				data: data,
// 			});
// 		},
// 		onError: console.error,
// 		onSuccess: response => {
// 			console.log({ response });
// 			replaceDelete(cursosEscuelaParams.update);
// 			router.refresh();
// 		},
// 	});

// 	const paramCursoId = React.useMemo(
// 		() => searchParams.get(cursosEscuelaParams.update),
// 		[searchParams],
// 	);

// 	if (!paramCursoId) return null;

// 	const selectedCurso = cursos.find(i => i.id === paramCursoId);

// 	if (!selectedCurso) {
// 		return (
// 			<ModalFallback
// 				action='update'
// 				redirectTo={() => replaceDelete(cursosEscuelaParams.update)}
// 			/>
// 		);
// 	}

// 	return (
// 		<MutateModal
// 			form={form}
// 			title='Actualizar curso'
// 			disabled={mutation.isPending}
// 			onSubmit={form.handleSubmit(data =>
// 				mutation.mutate({ data, id: paramCursoId }),
// 			)}
// 			dialogProps={{
// 				defaultOpen: true,
// 				onOpenChange: open => {
// 					if (mutation.isPending) return;
// 					if (!open) {
// 						replaceDelete(cursosEscuelaParams.update);
// 						return;
// 					}
// 				},
// 			}}
// 		>
// 			{fields.map(f => (
// 				<FormField
// 					control={form.control}
// 					name={f.name}
// 					key={f.name}
// 					defaultValue={selectedCurso[f.name] || undefined}
// 					render={({ field }) => (
// 						<FormItem className='grid grid-cols-12 items-center gap-4 space-y-0'>
// 							<FormLabel className='col-span-3 text-end'>{f.label}</FormLabel>
// 							<FormControl>
// 								<Input
// 									{...field}
// 									value={field.value || undefined}
// 									type={f.inputType}
// 									className='col-span-9'
// 								/>
// 							</FormControl>
// 						</FormItem>
// 					)}
// 				/>
// 			))}
// 		</MutateModal>
// 	);
// }

export function DeactivateCursoEscuela({
	cursos,
}: {
	cursos: CursoEscuelaFromAPI[];
}) {
	const { searchParams, replaceDelete, router } = useMutateSearchParams();

	const { mutation } = useMutateModule({
		mutationFn: ({ id, estado }: { id: string; estado: boolean }) => {
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
			replaceDelete(cursosEscuelaParams.deactivate);
			router.refresh();
		},
	});

	const paramCursoId = React.useMemo(
		() => searchParams.get(cursosEscuelaParams.deactivate),
		[searchParams],
	);

	if (!paramCursoId) return null;

	const selectedCurso = cursos.find(i => i.id === paramCursoId);

	if (!selectedCurso) {
		return (
			<ModalFallback
				action='delete'
				redirectTo={() => replaceDelete(cursosEscuelaParams.deactivate)}
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
			onClose={() => replaceDelete(cursosEscuelaParams.deactivate)}
			dialogProps={{
				defaultOpen: true,
				onOpenChange: open => {
					if (mutation.isPending) return;
					if (!open) {
						replaceDelete(cursosEscuelaParams.deactivate);
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

export function DeleteCursoEscuela(props: { cursos: CursoEscuelaFromAPI[] }) {
	const { searchParams, router, replaceDelete } = useMutateSearchParams();

	const {
		mutation: { mutate, isPending },
	} = useMutateModule({
		mutationFn: (id: string) => {
			return API.cursos.deleteById(id);
		},
		onError: console.error,
		onSuccess: response => {
			console.log({ response });
			replaceDelete(cursosEscuelaParams.delete);
			router.refresh();
		},
	});

	const paramCursoId = React.useMemo(
		() => searchParams.get(cursosEscuelaParams.delete),
		[searchParams],
	);

	if (!paramCursoId) return null;

	const selectedCurso = props.cursos.find(i => i.id === paramCursoId);

	if (!selectedCurso) {
		return (
			<ModalFallback
				action='delete'
				redirectTo={() => replaceDelete(cursosEscuelaParams.delete)}
			/>
		);
	}

	return (
		<DeleteModal
			description={`Estas seguro que deseas eliminar el curso: ${selectedCurso.nombre}`}
			title='Eliminar curso'
			onDelete={() => mutate(selectedCurso.id)}
			disabled={isPending}
			onClose={() => replaceDelete(cursosEscuelaParams.delete)}
			dialogProps={{
				defaultOpen: true,
				onOpenChange: open => {
					if (isPending) return;
					if (!open) {
						replaceDelete(cursosEscuelaParams.delete);
						return;
					}
				},
			}}
		/>
	);
}
