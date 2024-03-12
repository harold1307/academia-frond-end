"use client";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { z } from "zod";

import MutateModal from "@/app/_components/modals/mutate-modal";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/app/_components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/app/_components/ui/select";
import { API } from "@/core/api-client";
import type { CreateAsesorRelationParams } from "@/core/api/responsables-asesores-estudiante";
import { useMutateModule } from "@/hooks/use-mutate-module";
import { formatFullName } from "@/utils";
import type { Field } from "@/utils/forms";
import type { ZodInferSchema } from "@/utils/types";
import { ASESORES_ESTUDIANTE_KEYS } from "../../asesores-estudiante/query-keys";
import { ASESORES_ASIGNADOS_KEYS } from "./query-keys";

const schema = z.object<
	ZodInferSchema<
		Omit<CreateAsesorRelationParams, "responsableAsesorEstudianteId">
	>
>({
	asesorEstudianteId: z.string().uuid(),
});

export const asesoresAsignadosParams = {
	delete: "eliminarAsesoresAsignados",
};

export default function AddAsesorAsignado({
	responsableId,
}: {
	responsableId: string;
}) {
	const router = useRouter();
	const {
		form,
		mutation: { isPending, mutate },
		open,
		setOpen,
	} = useMutateModule({
		schema,
		mutationFn: ({ asesorEstudianteId }) => {
			return API.responsablesAsesoresEstudiante.createAsesorRelation({
				asesorEstudianteId,
				responsableAsesorEstudianteId: responsableId,
			});
		},
		onSuccess: response => {
			console.log({ response });
			router.refresh();
		},
		invalidateQueryKey: ASESORES_ASIGNADOS_KEYS.all,
	});

	const { data: usuarios, isLoading: usuariosAreLoading } = useQuery({
		queryKey: ASESORES_ESTUDIANTE_KEYS.lists(),
		queryFn: () => {
			return API.asesoresEstudiante.getMany();
		},
	});

	return (
		<section className='mb-2'>
			<MutateModal
				dialogProps={{
					open,
					onOpenChange: setOpen,
				}}
				disabled={isPending}
				form={form}
				onSubmit={form.handleSubmit(data => mutate(data))}
				title='Adicionar asesor a responsable'
				withTrigger
				triggerLabel='Agregar'
			>
				{asesoresAsignadosFields.map(f => {
					return (
						<FormField
							control={form.control}
							name={f.name}
							key={f.name}
							disabled={isPending}
							shouldUnregister={true}
							render={({ field }) => {
								return (
									<FormItem className='grid grid-cols-12 items-center gap-4 space-y-0'>
										<FormLabel className='col-span-3 text-end'>
											{f.label}
										</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value as string}
											disabled={field.disabled}
										>
											<FormControl>
												<SelectTrigger className='col-span-9'>
													<SelectValue className='w-full' />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{usuariosAreLoading
													? "Cargando opciones..."
													: usuarios?.data?.length
														? usuarios?.data.map(o => (
																<SelectItem value={o.id} key={o.id}>
																	{formatFullName(
																		o.administrativo.usuario.nombres,
																		o.administrativo.usuario.primerApellido,
																		o.administrativo.usuario.segundoApellido,
																	)}
																</SelectItem>
															))
														: "No hay resultados"}
											</SelectContent>
										</Select>
									</FormItem>
								);
							}}
						/>
					);
				})}
			</MutateModal>
		</section>
	);
}

export const asesoresAsignadosFields = [
	{
		name: "asesorEstudianteId",
		label: "Persona",
		inputType: "custom-select",
		options: "custom",
	},
] satisfies Field<keyof z.infer<typeof schema>>[];
