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
import { Input } from "@/app/_components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/app/_components/ui/select";
import { ToggleSwitch } from "@/app/_components/ui/toggle";
import { useToast } from "@/app/_components/ui/use-toast";
import { ASIGNATURA_KEYS } from "@/app/asignatura/query-keys";
import { MODELOS_EVALUATIVOS_KEYS } from "@/app/modelosevaluativos/query-keys";
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
		Omit<
			CreateAsignaturaEnVarianteCurso,
			| "cantidadDecimales"
			| "notaMaxima"
			| "notaMinima"
			| "modeloEvaluativoId"
			| "varianteCursoId"
		> & {
			calificar: boolean;

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
	cantidadDecimales: z.number().nullable().optional(),
	notaMaxima: z.number().nullable().optional(),
	notaMinima: z.number().nullable().optional(),

	asignaturaId: z.string().uuid(),
	modeloEvaluativoId: z.string().uuid().nullable().optional(),

	calificar: z.boolean(),
});

export default function AddMateria({ varianteId }: AddMateriaProps) {
	const router = useRouter();
	const { toast } = useToast();

	const { form, mutation, open, setOpen } = useMutateModule({
		schema: createAsignaturaEnVarianteSchema,
		mutationFn: ({
			asignaturaId,
			calificar,
			modeloEvaluativoId,
			cantidadDecimales,
			notaMaxima,
			notaMinima,
			...data
		}) => {
			return API.variantesCurso.createAsignaturaEnVarianteCurso({
				varianteCursoId: varianteId,
				asignaturaId,
				data: {
					modeloEvaluativoId: calificar ? modeloEvaluativoId ?? null : null,
					cantidadDecimales: calificar ? cantidadDecimales ?? null : null,
					notaMaxima: calificar ? notaMaxima ?? null : null,
					notaMinima: calificar ? notaMinima ?? null : null,
					...data,
				},
			});
		},
		onError: err => {
			toast({
				title: "Error",
				description: err.message,
				variant: "destructive",
			});
		},
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
				calificar: false,
				cantidadDecimales: 0,
				notaMaxima: 0,
				notaMinima: 0,
				asistenciaAprobar: 0,

				horasAsistidasDocente: 0,
				horasAutonomas: 0,
				horasColaborativas: 0,
				horasPracticas: 0,
				creditos: 0,
			},
		},
	});

	const {
		data: asignaturas,
		refetch: fetchAsignaturas,
		isLoading: asignaturasAreLoading,
	} = useQuery({
		queryKey: ASIGNATURA_KEYS.lists(),
		queryFn: () => {
			return API.asignaturas.getMany();
		},
		enabled: false,
	});

	const {
		data: modelosEvaluativos,
		refetch: fetchModelosEvaluativos,
		isLoading: modelosEvaluativosAreLoading,
	} = useQuery({
		queryKey: MODELOS_EVALUATIVOS_KEYS.lists(),
		queryFn: () => {
			return API.modelosEvaluativos.getMany();
		},
		enabled: false,
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
				onSubmit={form.handleSubmit(data => mutation.mutate(data))}
				title={`Adicionar materia en variante de curso`}
				withTrigger
				triggerLabel='Agregar'
			>
				{/* <div className='flex w-full flex-wrap items-start justify-start gap-8 px-8'> */}
				{/* </div> */}

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
							render={({ field }) => {
								return (
									<FormItem className='grid grid-cols-12 items-center gap-4 space-y-0'>
										<FormLabel className='col-span-3 text-end'>
											{f.label}
										</FormLabel>
										<FormControl>
											<ToggleSwitch
												checked={field.value as boolean}
												onCheckedChange={field.onChange}
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
									let options:
										| { label: string; value: string }[]
										| string[]
										| undefined = undefined;
									let loading;

									if (f.name === "asignaturaId") {
										options = asignaturas?.data.map(a => ({
											value: a.id,
											label: a.nombre,
										}));

										loading = asignaturasAreLoading;
									}

									if (f.name === "modeloEvaluativoId") {
										options = modelosEvaluativos?.data.map(a => ({
											value: a.id,
											label: a.nombre,
										}));

										loading = modelosEvaluativosAreLoading;
									}

									return (
										<FormItem className='grid grid-cols-12 items-center gap-4 space-y-0'>
											<FormLabel className='col-span-3 text-end'>
												{f.label}
											</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value as string}
												disabled={field.disabled}
												onOpenChange={() => {
													if (f.name === "asignaturaId" && !asignaturas) {
														fetchAsignaturas();
													}
													if (
														f.name === "modeloEvaluativoId" &&
														!modelosEvaluativos
													) {
														fetchModelosEvaluativos();
													}
												}}
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
													{loading
														? "Cargando opciones..."
														: options?.length
															? options.map(o => (
																	<SelectItem value={o.value} key={o.value}>
																		{o.label}
																	</SelectItem>
																))
															: "No hay resultados"}
												</SelectContent>
											</Select>
										</FormItem>
									);
								}}
							/>
						) : null
					) : (["notaMaxima", "notaMinima", "cantidadDecimales"].includes(
							f.name,
					  ) &&
							form.getValues("calificar") === true) ||
					  !["notaMaxima", "notaMinima", "cantidadDecimales"].includes(
							f.name,
					  ) ? (
						<FormField
							control={form.control}
							name={f.name}
							key={f.name}
							render={({ field }) => {
								return (
									<FormItem className='grid grid-cols-12 items-center gap-4 space-y-0'>
										<FormLabel className='col-span-3 text-end'>
											{f.label}
										</FormLabel>
										<FormControl>
											<Input
												{...field}
												onChange={e => field.onChange(+e.target.value)}
												value={field.value ?? undefined}
												type={f.inputType}
											/>
										</FormControl>
									</FormItem>
								);
							}}
						/>
					) : null,
				)}
				{/* {form.getValues("calificar") === true ? <h1>ola</h1> : null} */}
			</MutateModal>
		</section>
	);
}

export const materiaFields = [
	{
		name: "asignaturaId",
		inputType: "custom-select",
		options: "custom",
		label: "Asignatura",
	},
	// {
	// 	name: "lms",
	// 	inputType: "custom-select",
	// 	options: ["Lms1", "Lms2", "Lms3"],
	// 	label: "Lms",
	// },
	// {
	// 	name: "plantillaLms",
	// 	inputType: "custom-select",
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
		label: "Horas Organización Aprendizaje",
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
		options: "custom",
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
		label: "Asistencia para aprobar",
	},
] satisfies Field<keyof z.infer<typeof createAsignaturaEnVarianteSchema>>[];
