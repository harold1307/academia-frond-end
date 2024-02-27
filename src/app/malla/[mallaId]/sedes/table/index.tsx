"use client";

// import DeleteModal from "@/app/_components/modals/delete-modal";
import { columns, type SedeTableItem } from "./columns";
import { DataTable } from "./data-table";
// import ModalFallback from "@/app/_components/modals/modal-fallback";
// import { useMutateModule } from "@/hooks/use-mutate-module";
// import { API } from "@/core/api-client";
// import { useMutateSearchParams } from "@/hooks/use-mutate-search-params";

export const lugaresEjecucionParams = {
	update: "actualizarLugarEjecucion",
	delete: "eliminarLugarEjecucion",
} as const;

export default function SedeTable({
	lugaresEjecucion,
}: {
	lugaresEjecucion: SedeTableItem[];
}) {
	return (
		<section>
			<DataTable columns={columns} data={lugaresEjecucion} />
		</section>
	);
}

// const schema = z.object<
// 	ZodInferSchema<Parameters<typeof API.lugaresEjecucion.update>[0]["data"]>
// >({
// 	nombre: z.string().optional(),
// 	codigo: z.string().nullable().optional(),
// });

// type UpdateLugarEjecucion = z.infer<typeof schema>;

// function UpdateLugarEjecucionTableModal(props: {
// 	lugaresEjecucion: LugarEjecucionFromAPI[];
// }) {
// 	const { searchParams, replaceDelete, router } = useMutateSearchParams();

// 	const {
// 		mutation: { mutate: onSubmit, isPending: isSubmitting },
// 		form,
// 	} = useMutateModule({
// 		schema,
// 		mutationFn: async ({
// 			data: { codigo, ...data },
// 			id,
// 		}: {
// 			data: UpdateLugarEjecucion;
// 			id: string;
// 		}) => {
// 			return API.lugaresEjecucion.update({
// 				data: { ...data, codigo: codigo || null },
// 				id,
// 			});
// 		},
// 		onError: console.error,
// 		onSuccess: response => {
// 			console.log({ response });
// 			replaceDelete(lugaresEjecucionParams.update);
// 			router.refresh();
// 		},
// 	});

// 	const paramLugarEjecucionId = React.useMemo(
// 		() => searchParams.get(lugaresEjecucionParams.update),
// 		[searchParams],
// 	);

// 	if (!paramLugarEjecucionId) return null;

// 	const selectedLugarEjecucion = props.lugaresEjecucion.find(
// 		i => i.id === paramLugarEjecucionId,
// 	);

// 	if (!selectedLugarEjecucion) {
// 		return (
// 			<ModalFallback
// 				action='update'
// 				redirectTo={() => replaceDelete(lugaresEjecucionParams.update)}
// 			/>
// 		);
// 	}

// 	return (
// 		<MutateModal
// 			form={form}
// 			title='Actualizar lugarEjecucion'
// 			disabled={isSubmitting}
// 			onSubmit={form.handleSubmit(data =>
// 				onSubmit({ data, id: paramLugarEjecucionId }),
// 			)}
// 			dialogProps={{
// 				defaultOpen: true,
// 				onOpenChange: open => {
// 					if (isSubmitting) return;
// 					if (!open) {
// 						replaceDelete(lugaresEjecucionParams.update);
// 						return;
// 					}
// 				},
// 			}}
// 		>
// 			<FormField
// 				control={form.control}
// 				name='nombre'
// 				defaultValue={selectedLugarEjecucion.nombre}
// 				render={({ field }) => (
// 					<FormItem className='grid grid-cols-12 items-center gap-4 space-y-0'>
// 						<FormLabel className='col-span-3 text-end'>Nombre</FormLabel>
// 						<FormControl>
// 							<Input
// 								{...field}
// 								value={field.value || undefined}
// 								disabled={true}
// 								className='col-span-9'
// 							/>
// 						</FormControl>
// 					</FormItem>
// 				)}
// 			/>
// 			<FormField
// 				control={form.control}
// 				name='codigo'
// 				defaultValue={selectedLugarEjecucion.codigo}
// 				render={({ field }) => (
// 					<FormItem className='grid grid-cols-12 items-center gap-4 space-y-0'>
// 						<FormLabel className='col-span-3 text-end'>Codigo</FormLabel>
// 						<FormControl>
// 							<Input
// 								{...field}
// 								value={field.value || undefined}
// 								className='col-span-9'
// 							/>
// 						</FormControl>
// 					</FormItem>
// 				)}
// 			/>
// 		</MutateModal>
// 	);
// }

// function DeleteLugarEjecucionTableModal(props: {
// 	lugaresEjecucion: LugarEjecucionFromAPI[];
// }) {
// 	const { searchParams, router, replaceDelete } = useMutateSearchParams();

// 	const {
// 		mutation: { mutate, isPending },
// 	} = useMutateModule({
// 		mutationFn: async (id: string) => {
// 			return API.lugaresEjecucion.deleteById(id);
// 		},
// 		onError: console.error,
// 		onSuccess: response => {
// 			console.log({ response });
// 			replaceDelete(lugaresEjecucionParams.delete);
// 			router.refresh();
// 		},
// 	});

// 	const paramLugarEjecucionId = React.useMemo(
// 		() => searchParams.get(lugaresEjecucionParams.delete),
// 		[searchParams],
// 	);

// 	if (!paramLugarEjecucionId) return null;

// 	const selectedLugarEjecucion = props.lugaresEjecucion.find(
// 		i => i.id === paramLugarEjecucionId,
// 	);

// 	if (!selectedLugarEjecucion) {
// 		return (
// 			<ModalFallback
// 				action='delete'
// 				redirectTo={() => replaceDelete(lugaresEjecucionParams.delete)}
// 			/>
// 		);
// 	}

// 	return (
// 		<DeleteModal
// 			description={`Estas seguro que deseas eliminar el lugar de ejecucion: ${selectedLugarEjecucion.nombre}`}
// 			title='Eliminar lugar de ejecucion'
// 			onDelete={() => mutate(selectedLugarEjecucion.id)}
// 			disabled={isPending}
// 			onClose={() => replaceDelete(lugaresEjecucionParams.delete)}
// 			dialogProps={{
// 				defaultOpen: true,
// 				onOpenChange: open => {
// 					if (isPending) return;
// 					if (!open) {
// 						replaceDelete(lugaresEjecucionParams.delete);
// 						return;
// 					}
// 				},
// 			}}
// 		/>
// 	);
// }
