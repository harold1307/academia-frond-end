"use client";
import { z } from "zod";

import MutateModal from "@/app/_components/modals/mutate-modal";
import { Checkbox } from "@/app/_components/ui/checkbox";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/app/_components/ui/form";
import { Input } from "@/app/_components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/app/_components/ui/select";
import { API } from "@/core/api-client";
import type { CreateAsignaturaEnVarianteCursoParams } from "@/core/api/variantes-curso";
import { useMutateModule } from "@/hooks/use-mutate-module";
import { assertReferenceInput, type Field } from "@/utils/forms";
import type { ZodInferSchema } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { ASIGNATURA_KEYS } from "@/app/asignatura/query-keys";

const schema = z.object<
	ZodInferSchema<
		CreateAsignaturaEnVarianteCursoParams["data"] & {
			asignaturaId: string;
		}
	>
>({
	validaCredito: z.boolean(),
	validaPromedio: z.boolean(),
	horasColaborativas: z.number(),
	horasAsistidasDocente: z.number(),
	horasAutonomas: z.number(),
	horasPracticas: z.number(),
	sumaHoras: z.boolean(),
	creditos: z.number(),
	requeridoAprobar: z.boolean(),
	asistenciaAprobar: z.number(),
	asignaturaId: z.string(),
});

export default function AddAsignaturaEnVarianteCurso({
	varianteCursoId,
}: {
	varianteCursoId: string;
}) {
	const { form, mutation, open, setOpen } = useMutateModule({
		schema,
		mutationFn: async ({ asignaturaId, ...data }) => {
			return API.variantesCurso.createAsignaturaEnVarianteCurso({
				data,
				asignaturaId,
				varianteCursoId,
			});
		},
		onError: console.error,
		onSuccess: response => {
			console.log({ response });
		},
		hookFormProps: {
			defaultValues: {
				validaCredito: false,
				validaPromedio: false,
				sumaHoras: false,
				requeridoAprobar: false,
				horasColaborativas: 0,
				horasAsistidasDocente: 0,
				horasAutonomas: 0,
				horasPracticas: 0,
				creditos: 0,
				asistenciaAprobar: 0,
			},
		},
	});

	const {
		data: asignaturas,
		refetch: refetchAsignaturas,
		isLoading: asignaturasAreLoading,
	} = useQuery({
		queryKey: ASIGNATURA_KEYS.lists(),
		queryFn: () => {
			return API.asignaturas.getMany();
		},
		enabled: false,
	});

	const {
		horasColaborativas,
		horasAsistidasDocente,
		horasAutonomas,
		horasPracticas,
	} = form.watch();

	return (
		<section>
			<h1 className='text-2xl font-semibold'>Adicionar idk</h1>
			<MutateModal
				dialogProps={{
					open,
					onOpenChange: setOpen,
				}}
				disabled={mutation.isPending}
				form={form}
				onSubmit={form.handleSubmit(data => mutation.mutate(data))}
				title='Adicionar idk'
				withTrigger
				triggerLabel='Adicionar idk'
			>
				{fields.map(f =>
					assertReferenceInput(f.name) ? (
						<FormItem
							key={f.name}
							className='grid grid-cols-12 items-center gap-4 space-y-0'
						>
							<FormLabel className='col-span-3 text-end'>{f.label}</FormLabel>
							<FormControl>
								<Input
									type={f.inputType}
									value={
										f.name === "reference-horasTotales"
											? horasColaborativas +
												horasAsistidasDocente +
												horasAutonomas +
												horasPracticas
											: f.name === "reference-horasDocencia"
												? horasColaborativas + horasAsistidasDocente
												: horasAutonomas + horasPracticas
									}
									className='col-span-9'
									disabled={true}
								/>
							</FormControl>
						</FormItem>
					) : (
						<FormField
							control={form.control}
							name={f.name}
							key={f.name}
							render={({ field }) => {
								switch (f.inputType) {
									case "custom-select": {
										const options = asignaturas?.data.map(a => ({
											label: a.nombre,
											value: a.id,
										}));

										return (
											<FormItem className='grid grid-cols-12 items-center gap-4 space-y-0'>
												<FormLabel className='col-span-3 text-end'>
													{f.label}
												</FormLabel>
												<Select
													onValueChange={field.onChange}
													defaultValue={field.value as string}
													disabled={field.disabled}
													onOpenChange={() => refetchAsignaturas()}
												>
													<FormControl>
														<SelectTrigger className='col-span-9'>
															<SelectValue className='w-full' />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{asignaturasAreLoading
															? "Cargando opciones..."
															: options?.length
																? options.map(o =>
																		typeof o === "string" ? (
																			<SelectItem value={o} key={o}>
																				{o}
																			</SelectItem>
																		) : (
																			<SelectItem value={o.value} key={o.value}>
																				{o.label}
																			</SelectItem>
																		),
																	)
																: "No hay resultados"}
													</SelectContent>
												</Select>
											</FormItem>
										);
									}
									case "checkbox": {
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
									}
									default: {
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
														onChange={e =>
															f.inputType === "number"
																? field.onChange(+e.target.value)
																: field.onChange(e.target.value)
														}
														type={f.inputType}
														className='col-span-9'
													/>
												</FormControl>
											</FormItem>
										);
									}
								}
							}}
						/>
					),
				)}
			</MutateModal>
		</section>
	);
}

const fields = [
	{
		name: "asignaturaId",
		inputType: "custom-select",
		label: "Asignatura",
		options: "custom",
	},
	{
		name: "validaCredito",
		inputType: "checkbox",
		label: "Valida para credito",
	},
	{
		name: "validaPromedio",
		inputType: "checkbox",
		label: "Valida para promedio",
	},
	{
		name: "reference-horasTotales",
		label: "Horas totales",
		inputType: "number",
	},
	{
		name: "reference-horasDocencia",
		label: "Horas docencia",
		inputType: "number",
	},
	{
		name: "horasColaborativas",
		label: "Horas colaborativas",
		inputType: "number",
	},
	{
		name: "horasAsistidasDocente",
		label: "Horas asistidas por el docente",
		inputType: "number",
	},
	{
		name: "reference-horasOrgAprendizaje",
		label: "Horas organizacion aprendizaje",
		inputType: "number",
	},
	{ name: "horasAutonomas", label: "Horas autonomas", inputType: "number" },
	{ name: "horasPracticas", label: "Horas practicas", inputType: "number" },
	{ name: "creditos", label: "Creditos", inputType: "number" },
	{
		name: "requeridoAprobar",
		label: "Requerida para aprobar",
		inputType: "checkbox",
	},
	{
		name: "sumaHoras",
		label: "Suma Horas",
		inputType: "checkbox",
	},
	{
		name: "asistenciaAprobar",
		label: "Asistencia para aprobar",
		inputType: "number",
	},
] satisfies Field<keyof z.infer<typeof schema>>[];
