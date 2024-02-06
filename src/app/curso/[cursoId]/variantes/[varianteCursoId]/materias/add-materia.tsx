"use client";
import { useRouter } from "next/navigation";
import { z } from "zod";

import MutateModal from "@/app/_components/modals/mutate-modal";
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
import type { CreateAsignaturaEnVarianteCurso } from "@/core/api/variantes-curso";
import { useMutateModule } from "@/hooks/use-mutate-module";
import { assertReferenceInput, type Field } from "@/utils/forms";
import type { ZodInferSchema } from "@/utils/types";

type AddMateriaProps = {
	varianteId: string;
};

export const createAsignaturaEnVarianteSchema = z.object<
	ZodInferSchema<
		CreateAsignaturaEnVarianteCurso & {
			calificar: boolean;

			asistenciaAprobar?: number | null;
			cantidadDecimales?: number | null;
			notaMaxima?: number | null;
			notaMinima?: number | null;
			modeloEvaluativoId?: string | null;
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
	asistenciaAprobar: z.number().nullable(),
	cantidadDecimales: z.number().nullable(),
	notaMaxima: z.number().nullable(),
	notaMinima: z.number().nullable(),

	asignaturaId: z.string().uuid(),
	varianteCursoId: z.string().uuid(),
	modeloEvaluativoId: z.string().uuid().nullable(),

	calificar: z.boolean(),
});

export default function AddMateria({ varianteId }: AddMateriaProps) {
	const router = useRouter();

	const { form, mutation, open, setOpen } = useMutateModule({
		schema: createAsignaturaEnVarianteSchema,
		mutationFn: async ({ asignaturaId, ...data }) => {
			return API.variantesCurso.createAsignaturaEnVarianteCurso({
				varianteCursoId: varianteId,
				asignaturaId,
				data,
			});
		},
		onError: console.error,
		onSuccess: response => {
			console.log({ response });
			router.refresh();
		},
		hookFormProps: {
			defaultValues: {
				validaCredito: false,
				validaPromedio: false,
				sumaHoras: false,
				requeridoAprobar: false,
			},
		},
	});

	const {
		horasAsistidasDocente,
		horasAutonomas,
		horasColaborativas,
		horasPracticas,
	} = form.watch();

	console.log(form.formState.errors);
	return (
		<section>
			<MutateModal
				dialogProps={{
					open,
					onOpenChange: setOpen,
				}}
				disabled={mutation.isPending}
				form={form}
				onSubmit={form.handleSubmit(
					data => console.log("Falta implementar lógica", data),
					// mutation.mutate(data)
				)}
				title={`Adicionar Materia en variante de curso ${varianteId}`}
				withTrigger
				triggerLabel='Adicionar Materia en variante de curso'
			>
				<div className='flex w-full flex-wrap items-start justify-start gap-8 px-8'>
					{materiaFields.map(f =>
						assertReferenceInput(f.name) ? (
							<FormItem
								key={f.name}
								className='grid grid-cols-12 items-center gap-4 space-y-0'
							>
								<FormLabel className='col-span-3 text-end'>{f.label}</FormLabel>
								<FormControl>
									<Input
										type={f.inputType}
										placeholder={f.placeholder}
										value={
											f.name === "reference-horas"
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
						) : f.inputType === "checkbox" ? (
							<FormField
								control={form.control}
								name={f.name}
								key={f.name}
								defaultValue={false}
								render={({ field }) => {
									return (
										<FormItem
											className='flex h-16 w-60 items-center justify-between gap-4 space-y-0 rounded-2xl border-2 p-4'
											style={{
												boxShadow: "0 0 20px rgba(67, 84, 234, .7)",
											}}
										>
											<FormLabel className='col-span-3 text-start'>
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
													type={f.inputType}
												/>
											</FormControl>
										</FormItem>
									);
								}}
							/>
						) : f.inputType === "custom-select" ? (
							(f.name === "modeloEvaluativoId" &&
								form.getValues("calificar") === true) ||
							f.name !== "modeloEvaluativoId" ? (
								<FormField
									control={form.control}
									name={f.name}
									key={f.name}
									render={({ field }) => {
										const options = f.options ? f.options : ["A", "B"];
										return (
											<FormItem className='grid w-full grid-cols-12 items-center gap-4 space-y-0'>
												<FormLabel className='col-span-3 w-2/12 text-end'>
													{f.label}
												</FormLabel>
												<Select
													onValueChange={field.onChange}
													defaultValue={field.value as string}
													disabled={field.disabled}
												>
													<FormControl>
														<SelectTrigger className='col-span-9'>
															<SelectValue
																placeholder={f.placeholder}
																className='w-full'
															/>
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{options.map(o =>
															typeof o === "string" ? (
																<SelectItem value={o} key={o}>
																	{o}
																</SelectItem>
															) : (
																<SelectItem value={o} key={o}>
																	{o}
																</SelectItem>
															),
														)}
													</SelectContent>
												</Select>
											</FormItem>
										);
									}}
								/>
							) : null
						) : ([
								"notaParaAprobar",
								"notaMaxima",
								"cantidadDecimales",
						  ].includes(f.name) &&
								form.getValues("calificar") === true) ||
						  !["notaParaAprobar", "notaMaxima", "cantidadDecimales"].includes(
								f.name,
						  ) ? (
							<FormField
								control={form.control}
								name={f.name}
								key={f.name}
								render={({ field }) => {
									return (
										<FormItem className='flex w-full items-center justify-start gap-2'>
											<FormLabel className='text-md col-span-3 w-[12%] text-start'>
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
													type={f.inputType}
												/>
											</FormControl>
										</FormItem>
									);
								}}
							/>
						) : null,
					)}
					{form.getValues("calificar") === true ? <h1>ola</h1> : null}
				</div>
			</MutateModal>
		</section>
	);
}

export const materiaFields = [
	{
		name: "asignaturaId",
		inputType: "custom-select",
		placeholder: "-----",
		options: ["asignatura1", "asignatura2", "asignatura3"],
		label: "Asignatura",
	},
	// {
	// 	name: "lms",
	// 	inputType: "custom-select",
	// 	placeholder: "-----",
	// 	options: ["Lms1", "Lms2", "Lms3"],
	// 	label: "Lms",
	// },
	// {
	// 	name: "plantillaLms",
	// 	inputType: "custom-select",
	// 	placeholder: "-----",
	// 	options: ["PlantillaLms1", "PlantillaLms2", "PlantillaLms3"],
	// 	label: "Plantilla Lms",
	// },
	{
		name: "validaCredito",
		inputType: "checkbox",
		label: "Valida para Créditos",
	},
	{
		name: "validaPromedio",
		inputType: "checkbox",
		label: "Valida para Promedios",
	},
	{
		name: "reference-horas",
		inputType: "number",
		label: "Horas",
	},
	{
		name: "reference-horasDocencia",
		inputType: "number",
		label: "Horas Docencia",
	},
	{
		name: "horasColaborativas",
		inputType: "number",
		label: "Horas Colaborativas",
	},
	{
		name: "horasAsistidasDocente",
		inputType: "number",
		label: "Horas asistidas por el docente",
	},
	{
		name: "reference-horasOrganizacionAprendizaje",
		inputType: "number",
		label: "Horas Oragnización Aprendizaje",
	},
	{
		name: "horasAutonomas",
		inputType: "number",
		label: "Horas Autónomas",
	},
	{
		name: "horasPracticas",
		inputType: "number",
		label: "Horas Prácticas",
	},
	{
		name: "creditos",
		inputType: "number",
		label: "Créditos",
	},
	{
		name: "requeridoAprobar",
		inputType: "checkbox",
		label: "Requerida",
	},
	{
		name: "sumaHoras",
		inputType: "checkbox",
		label: "Suma Horas",
	},
	{
		name: "calificar",
		inputType: "checkbox",
		label: "Califica",
	},
	{
		name: "modeloEvaluativoId",
		inputType: "custom-select",
		options: ["modelo1", "modelo2", "modelo3"],
		placeholder: "------",
		label: "Modelo Evaluativo",
	},
	{
		name: "notaMaxima",
		inputType: "number",
		label: "Nota Máxima",
	},
	{
		name: "notaMinima",
		inputType: "number",
		label: "Nota Aprobar",
	},
	{
		name: "cantidadDecimales",
		inputType: "number",
		label: "Cantidad de Decimales",
	},
	{
		name: "asistenciaAprobar",
		inputType: "number",
		label: "Asistencia",
	},
] satisfies Field<keyof z.infer<typeof createAsignaturaEnVarianteSchema>>[];
