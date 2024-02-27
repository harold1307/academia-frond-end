"use client";
import { TipoDuracion } from "@prisma/client";
import React from "react";
import { z } from "zod";

import ModalFallback from "@/app/_components/modals/modal-fallback";
import { API } from "@/core/api-client";
import type { UpdateMallaData } from "@/core/api/mallas-curriculares";
import { useMutateModule } from "@/hooks/use-mutate-module";
import { useMutateSearchParams } from "@/hooks/use-mutate-search-params";
import { mallaParams } from "../add-malla";
import { MALLA_KEYS } from "../query-keys";
import type { MallaCurricularTableItem } from "./columns";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { ZodInferSchema } from "@/utils/types";
import DeleteModal from "@/app/_components/modals/delete-modal";
import { formatDate } from "@/utils";

export default function MallaCurricularTable({
	mallas,
	programaName,
}: {
	mallas: MallaCurricularTableItem[];
	programaName: string;
}) {
	return (
		<section>
			<DataTable columns={columns} data={mallas} />
			<DeleteMalla mallas={mallas} programaName={programaName} />
		</section>
	);
}

// const schema = z.object<ZodInferSchema<UpdateMallaData>>({
// 	tituloObtenidoId: z.string().nullable().optional(),
// 	tipoDuracion: z
// 		.enum(["ANOS", "CREDITOS", "HORAS", "SEMESTRES"] as const)
// 		.nullable()
// 		.optional(),
// 	fechaAprobacion: z.string().datetime().optional(),
// 	fechaLimiteVigencia: z.string().datetime().optional(),
// 	cantidadLibreOpcionEgreso: z.number().optional(),
// 	cantidadOptativasEgreso: z.number().optional(),
// 	cantidadArrastres: z.number().nullable().optional(),
// 	practicasLigadasMaterias: z.boolean().optional(),
// 	horasPractica: z.number().optional(),
// 	registroPracticasDesde: z.number().optional(),
// 	horasVinculacion: z.number().optional(),
// 	registroVinculacionDesde: z.number().optional(),
// 	registroProyectosDesde: z.number().optional(),
// 	usaNivelacion: z.boolean().optional(),
// 	plantillasSilabo: z.boolean().optional(),
// 	perfilEgreso: z.string().nullable().optional(),
// 	observaciones: z.string().nullable().optional(),
// });

type UpdateMallaProps = {
	mallas: MallaCurricularTableItem[];
	programaName: string;
};

// la malla no es editable por cualquiera
// function UpdateMallaModal(props: { mallas: MallaCurricularTableItem[] }) {
// 	const { replaceDelete, replaceSet, searchParams } = useMutateSearchParams();
// 	const { form, mutation, open, setOpen } = useMutateModule({
// 		schema,
// 		invalidateQueryKey: MALLA_KEYS.lists(),
// 		mutationFn: async (params: {
// 			id: string;
// 			data: z.infer<typeof schema>;
// 		}) => {
// 			return API.mallasCurriculares.update({
// 				id: params.id,
// 				data: params.data,
// 			});
// 		},
// 		onError: console.error,
// 		onSuccess: response => {
// 			console.log({ response });
// 		},
// 	});

// 	const paramMallaId = React.useMemo(
// 		() => searchParams.get(mallaParams.update),
// 		[searchParams],
// 	);

// 	if (!paramMallaId) return null;

// 	const selectedMalla = props.mallas.find(i => i.id === paramMallaId);

// 	if (!selectedMalla) {
// 		return (
// 			<ModalFallback
// 				action='update'
// 				redirectTo={() => replaceDelete(mallaParams.update)}
// 			/>
// 		);
// 	}

// return null;
// <MutateModal
// 	form={form}
// 	title='Actualizar asignatura'
// 	disabled={mutation.isPending}
// 	onSubmit={form.handleSubmit(data =>
// 		mutation.mutate({ data, id: paramMallaId }),
// 	)}
// 	dialogProps={{
// 		defaultOpen: true,
// 		onOpenChange: open => {
// 			if (mutation.isPending) return;
// 			if (!open) {
// 				replaceDelete(mallaParams.update);
// 				return;
// 			}
// 		},
// 	}}
// >
// 	<FormField
// 		control={form.control}
// 		name='nombre'
// 		defaultValue={selectedMalla.nombre}
// 		render={({ field }) => (
// 			<FormItem className='grid grid-cols-12 items-center gap-4 space-y-0'>
// 				<FormLabel className='col-span-3 text-end'>Nombre</FormLabel>
// 				<FormControl>
// 					<Input
// 						{...field}
// 						value={field.value || undefined}
// 						disabled={true}
// 						className='col-span-9'
// 					/>
// 				</FormControl>
// 			</FormItem>
// 		)}
// 	/>
// 	<FormField
// 		control={form.control}
// 		name='codigo'
// 		defaultValue={selectedMalla.codigo}
// 		render={({ field }) => (
// 			<FormItem className='grid grid-cols-12 items-center gap-4 space-y-0'>
// 				<FormLabel className='col-span-3 text-end'>Codigo</FormLabel>
// 				<FormControl>
// 					<Input
// 						{...field}
// 						value={field.value || undefined}
// 						className='col-span-9'
// 					/>
// 				</FormControl>
// 			</FormItem>
// 		)}
// 	/>
// </MutateModal>
// }

export function DeleteMalla({ mallas, programaName }: UpdateMallaProps) {
	const { searchParams, router, replaceDelete } = useMutateSearchParams();
	const { mutation } = useMutateModule({
		mutationFn: (id: string) => {
			return API.mallasCurriculares.deleteById(id);
		},
		onSuccess: response => {
			console.log({ response });
			replaceDelete(mallaParams.delete);
			router.refresh();
		},
	});

	const paramMallaId = React.useMemo(
		() => searchParams.get(mallaParams.delete),
		[searchParams],
	);

	if (!paramMallaId) return null;

	const selectedMalla = mallas.find(i => i.id === paramMallaId);

	if (!selectedMalla) {
		return (
			<ModalFallback
				action='delete'
				redirectTo={() => replaceDelete(mallaParams.delete)}
			/>
		);
	}

	return (
		<DeleteModal
			description={`Estas seguro que deseas eliminar la malla: ${programaName}, ${
				selectedMalla.modalidad
			} del ${formatDate(selectedMalla.vigencia.fechaAprobacion, {
				day: "2-digit",
				month: "2-digit",
				year: "numeric",
			})}`}
			title='Eliminar malla'
			onDelete={() => mutation.mutate(selectedMalla.id)}
			disabled={mutation.isPending}
			onClose={() => replaceDelete(mallaParams.delete)}
			dialogProps={{
				defaultOpen: true,
				onOpenChange: open => {
					if (mutation.isPending) return;
					if (!open) {
						replaceDelete(mallaParams.delete);
						return;
					}
				},
			}}
		/>
	);
}
