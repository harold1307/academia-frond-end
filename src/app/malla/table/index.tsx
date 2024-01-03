"use client";
import { Modalidad, TipoDuracion } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { z } from "zod";

import ModalFallback from "@/app/_components/modals/modal-fallback";
import MutateModal from "@/app/_components/modals/mutate-modal";
import { API } from "@/core/api-client";
import { UpdateMallaData } from "@/core/api/malla-curricular";
import { useMutateModule } from "@/hooks/use-mutate-module";
import { useMutateSearchParams } from "@/hooks/use-mutate-search-params";
import { mallaParams } from "../add-malla";
import { MALLA_KEYS } from "../query-keys";
import type { MallaCurricularTableItem } from "./columns";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default function MallaCurricularTable() {
	const { isLoading, data } = useQuery({
		queryKey: MALLA_KEYS.lists(),
		queryFn: async () => {
			const data = await API.mallas.getMany();

			return data.data;
		},
	});

	const mallas = React.useMemo(() => {
		return data?.map(malla => {
			const obj = {
				credits: 0,
				totalHours: 0,
			};

			malla.asignaturasEnMalla.forEach(a => {
				obj.credits += a.creditos;
				obj.totalHours +=
					a.horasAsistidasDocente +
					a.horasAutonomas +
					a.horasColaborativas +
					a.horasPracticas +
					a.horasSemanales;
			});

			return {
				...malla,
				...obj,
				coursesCount: malla.asignaturasEnMalla.length,
				coursesHours: 0,
				approved: {
					fechaAprobacion: new Date(malla.fechaAprobacion),
					fechaLimiteVigencia: new Date(malla.fechaLimiteVigencia),
				},
				isCurrent:
					new Date(malla.fechaLimiteVigencia).valueOf() > new Date().valueOf(),
				isUsed: !!malla.asignaturasEnMalla.length,
				modulesCount: 0,
				onlineCoursesCount: 0,
				studentsUsingCount: 0,
			} satisfies MallaCurricularTableItem;
		});
	}, [data]);

	if (isLoading) {
		return "Cargando tabla...";
	}

	if (isLoading && !mallas) {
		return "WTF";
	}

	if (!mallas) return "Ha ocurrido un error en el fetch";

	return (
		<section>
			<h1 className='text-2xl font-semibold'>Tabla</h1>
			<DataTable columns={columns} data={mallas} />
		</section>
	);
}

const schema: z.ZodType<UpdateMallaData> = z.object({
	modalidad: z.nativeEnum(Modalidad).optional(),
	tituloObtenido: z.string().optional(),
	tipoDuracion: z.nativeEnum(TipoDuracion).optional(),
	fechaAprobacion: z.string().datetime().optional(),
	fechaLimiteVigencia: z.string().datetime().optional(),
	niveles: z.number().optional(),
	maximoMateriasMatricula: z.number().optional(),
	cantidadLibreOpcionEgreso: z.number().optional(),
	cantidadOptativasEgreso: z.number().optional(),
	cantidadArrastres: z.number().optional(),
	practicasLigadasMaterias: z.boolean().optional(),
	horasPractica: z.number().optional(),
	registroPracticasDesde: z.number().optional(),
	horasVinculacion: z.number().optional(),
	registroVinculacionDesde: z.number().optional(),
	registroProyectosDesde: z.number().optional(),
	usaNivelacion: z.boolean().optional(),
	plantillasSilabo: z.boolean().optional(),
	perfilEgreso: z.string().optional(),
	observaciones: z.string().optional(),
});

// la malla no es editable por cualquiera
function UpdateMallaModal(props: { mallas: MallaCurricularTableItem[] }) {
	const { replaceDelete, replaceSet, searchParams } = useMutateSearchParams();
	const { form, mutation, open, setOpen } = useMutateModule({
		schema,
		invalidateQueryKey: MALLA_KEYS.lists(),
		mutationFn: async (params: {
			id: string;
			data: z.infer<typeof schema>;
		}) => {
			return API.mallas.update({ id: params.id, mallaCurricular: params.data });
		},
		onError: console.error,
		onSuccess: response => {
			console.log({ response });
		},
	});

	const paramMallaId = React.useMemo(
		() => searchParams.get(mallaParams.update),
		[searchParams],
	);

	if (!paramMallaId) return null;

	const selectedMalla = props.mallas.find(i => i.id === paramMallaId);

	if (!selectedMalla) {
		return (
			<ModalFallback
				action='update'
				redirectTo={() => replaceDelete(mallaParams.update)}
			/>
		);
	}

	return null;
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
}
