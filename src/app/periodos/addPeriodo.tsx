"use client";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarIcon, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/app/_components/ui/dialog";
import {
	Form,
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
import { type CreatePeriodoLectivo } from "@/core/api/periodos-lectivos";
import { useMutateModule } from "@/hooks/use-mutate-module";
import { cn } from "@/utils";
import type { Field } from "@/utils/forms";
import type { ReplaceNullableToOptional, ZodInferSchema } from "@/utils/types";
import { Button } from "../_components/ui/button";
import { Calendar } from "../_components/ui/calendar";
import { Input } from "../_components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "../_components/ui/popover";
import { ToggleSwitch } from "../_components/ui/toggle";

export const periodoParams = {
	add: "agregarPeriodo",
	update: "actualizarPeriodo",
	actividades: "actividadesHabilitadas",
	costos: "formatoCostos",
	habilitar: "habilitarMatricula",
	importar: "importarPlanificacion",
	actualizarCalif: "actualizarCalificaciones",
	subPeriodos: "actualizarSubperiodos",
} as const;

const schema = z.object<
	ZodInferSchema<
		ReplaceNullableToOptional<
			CreatePeriodoLectivo & {
				"dummy-fechaEnMatriculas": boolean;
				"dummy-estructuraParalelos": boolean;
				"dummy-planificacionProfesoresObligatoria": boolean;
				"dummy-legalizarMatriculas": boolean;
				"dummy-numeroMatricula": boolean;
				"dummy-numeroSecuencia": boolean;
			}
		>
	>
>({
	nombre: z.string(),
	inicio: z.string().datetime(),
	fin: z.string().datetime(),
	tipo: z.enum(["GRADO", "POSGRADO"] as const),
	limiteMatriculaOrdinaria: z.string().datetime().optional(),
	limiteMatriculaExtraordinaria: z.string().datetime().optional(),
	limiteMatriculaEspecial: z.string().datetime().optional(),
	automatriculaAlumnosFechaExtraordinaria: z.boolean().optional(),
	estudianteSeleccionaParaleloAutomatricula: z.boolean().optional(),
	seImpartioNivelacion: z.boolean(),
	planificacionCargaHoraria: z.boolean(),
	planificacionProfesoresFormaTotal: z.boolean().optional(),
	aprobacionPlanificacionProfesores: z.boolean().optional(),
	legalizacionAutomaticaContraPagos: z.boolean().optional(),
	numeroSecuencia: z.number().optional(),
	corteId: z.string().uuid().optional(),
	cronogramaNotasCoordinacion: z.boolean(),
	puedenAutomatricularseSegundasOMasMatriculas: z.boolean(),
	puedenMatricularseArrastre: z.boolean(),
	numeroMatriculaAutomatico: z.boolean().optional(),
	numeroMatricularAlLegalizar: z.boolean().optional(),

	"dummy-fechaEnMatriculas": z.boolean(),
	"dummy-estructuraParalelos": z.boolean(),
	"dummy-planificacionProfesoresObligatoria": z.boolean(),
	"dummy-legalizarMatriculas": z.boolean(),
	"dummy-numeroMatricula": z.boolean(),
	"dummy-numeroSecuencia": z.boolean(),
});

export default function AddPeriodo() {
	const router = useRouter();

	const {
		mutation: { mutate, isPending },
		form,
		open,
		setOpen,
	} = useMutateModule({
		mutationFn: ({
			limiteMatriculaOrdinaria,
			limiteMatriculaExtraordinaria,
			limiteMatriculaEspecial,
			automatriculaAlumnosFechaExtraordinaria,
			estudianteSeleccionaParaleloAutomatricula,
			planificacionProfesoresFormaTotal,
			aprobacionPlanificacionProfesores,
			legalizacionAutomaticaContraPagos,
			numeroSecuencia,
			corteId,
			numeroMatriculaAutomatico,
			numeroMatricularAlLegalizar,
			...data
		}) => {
			return API.periodos.create({
				...data,
				limiteMatriculaOrdinaria: data["dummy-fechaEnMatriculas"]
					? limiteMatriculaOrdinaria ?? null
					: null,
				limiteMatriculaExtraordinaria: data["dummy-fechaEnMatriculas"]
					? limiteMatriculaExtraordinaria ?? null
					: null,
				limiteMatriculaEspecial: data["dummy-fechaEnMatriculas"]
					? limiteMatriculaEspecial ?? null
					: null,
				automatriculaAlumnosFechaExtraordinaria: data["dummy-fechaEnMatriculas"]
					? automatriculaAlumnosFechaExtraordinaria ?? null
					: null,

				estudianteSeleccionaParaleloAutomatricula: data[
					"dummy-estructuraParalelos"
				]
					? estudianteSeleccionaParaleloAutomatricula ?? null
					: null,

				planificacionProfesoresFormaTotal: data[
					"dummy-planificacionProfesoresObligatoria"
				]
					? planificacionProfesoresFormaTotal ?? null
					: null,
				aprobacionPlanificacionProfesores: data[
					"dummy-planificacionProfesoresObligatoria"
				]
					? aprobacionPlanificacionProfesores ?? null
					: null,

				legalizacionAutomaticaContraPagos: data["dummy-legalizarMatriculas"]
					? legalizacionAutomaticaContraPagos ?? null
					: null,

				corteId: corteId ?? null,
				numeroSecuencia: data["dummy-numeroSecuencia"]
					? numeroSecuencia ?? null
					: null,

				numeroMatriculaAutomatico: data["dummy-numeroMatricula"]
					? numeroMatriculaAutomatico ?? null
					: null,
				numeroMatricularAlLegalizar: data["dummy-numeroMatricula"]
					? numeroMatricularAlLegalizar ?? null
					: null,
			});
		},
		schema,
		hookFormProps: {
			defaultValues: {
				cronogramaNotasCoordinacion: false,
				legalizacionAutomaticaContraPagos: false,
				numeroMatriculaAutomatico: false,
				numeroMatricularAlLegalizar: false,
				puedenAutomatricularseSegundasOMasMatriculas: false,
				puedenMatricularseArrastre: false,
				seImpartioNivelacion: false,
				planificacionCargaHoraria: false,

				"dummy-fechaEnMatriculas": false,
				"dummy-estructuraParalelos": false,
				"dummy-planificacionProfesoresObligatoria": false,
				"dummy-legalizarMatriculas": false,
				"dummy-numeroMatricula": false,
				"dummy-numeroSecuencia": false,
			},
		},
		onError: console.error,
		onSuccess: response => {
			console.log({ response });
			router.refresh();
		},
	});

	const {
		data: cortes,
		isLoading: cortesAreLoading,
		refetch: fetchCortes,
	} = useQuery({
		queryKey: ["cortes"],
		queryFn: () => {
			return API.cortes.getMany();
		},
		enabled: false,
	});
	const formValues = form.watch();
	// console.log(form.formState.errors);
	// console.log({
	// 	legalizacionAutomaticaContraPagos:
	// 		formValues.legalizacionAutomaticaContraPagos,
	// 	limiteMatriculaEspecial: formValues.limiteMatriculaEspecial,
	// 	limiteMatriculaExtraordinaria: formValues.limiteMatriculaExtraordinaria,
	// 	limiteMatriculaOrdinaria: formValues.limiteMatriculaOrdinaria,
	// 	estudianteSeleccionaParaleloAutomatricula:
	// 		formValues.estudianteSeleccionaParaleloAutomatricula,
	// });

	return (
		<section>
			<h1 className='text-2xl font-semibold'>Periodos lectivos</h1>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>
					<button className='flex flex-row items-center gap-2 rounded-md border border-slate-400 p-2 hover:bg-slate-200 hover:text-slate-800'>
						<PlusCircle /> Agregar
					</button>
				</DialogTrigger>
				<DialogContent className='max-h-[80%] max-w-xs overflow-y-scroll sm:max-w-[425px] md:max-w-2xl'>
					<DialogHeader>
						<DialogTitle>Adicionar periodo</DialogTitle>
					</DialogHeader>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(data => mutate(data))}
							className='space-y-8'
						>
							{fields.map(f => {
								if (f.dependsOn && !formValues[f.dependsOn]) {
									return null;
								}

								return (
									<FormField
										control={form.control}
										name={f.name}
										key={f.name}
										shouldUnregister={true}
										render={({ field }) => {
											switch (f.inputType) {
												case "custom-date": {
													return (
														<FormItem className='grid grid-cols-12 items-center gap-4 space-y-0'>
															<FormLabel className='col-span-3 text-end'>
																{f.label}
															</FormLabel>
															<Popover>
																<PopoverTrigger asChild>
																	<FormControl>
																		<Button
																			variant={"outline"}
																			className={cn(
																				"col-span-9 w-[240px] pl-3 text-left font-normal",
																				!field.value && "text-muted-foreground",
																			)}
																			disabled={field.disabled}
																		>
																			{field.value ? (
																				format(
																					field.value as unknown as Date,
																					"PPP",
																				)
																			) : (
																				<span>Pick a date</span>
																			)}
																			<CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
																		</Button>
																	</FormControl>
																</PopoverTrigger>
																<PopoverContent
																	className='w-auto p-0'
																	align='start'
																>
																	<Calendar
																		mode='single'
																		selected={field.value as unknown as Date}
																		onSelect={date =>
																			field.onChange(date?.toISOString())
																		}
																		disabled={date =>
																			date < new Date() || !!field.disabled
																		}
																		initialFocus
																	/>
																</PopoverContent>
															</Popover>
														</FormItem>
													);
												}
												case "custom-select": {
													let options:
														| string[]
														| undefined
														| { value: string; label: string }[] =
														f.name === "tipo" ? f.options : undefined;
													let loading: boolean | undefined = undefined;

													if (f.name === "corteId") {
														options = cortes?.data.map(c => ({
															value: c.id,
															label: c.nombre,
														}));

														loading = cortesAreLoading;
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
																	if (f.name === "corteId" && !cortes) {
																		fetchCortes();
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
																			? options.map(o =>
																					typeof o === "string" ? (
																						<SelectItem value={o} key={o}>
																							{o}
																						</SelectItem>
																					) : (
																						<SelectItem
																							value={o.value}
																							key={o.value}
																						>
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
												case "custom-toggle": {
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
																	placeholder={f.placeholder}
																	className='col-span-9'
																/>
															</FormControl>
														</FormItem>
													);
												}
											}
										}}
									/>
								);
							})}
							<DialogFooter>
								<Button disabled={isPending} type='submit' variant='success'>
									Guardar
								</Button>
								<Button
									disabled={isPending}
									variant='destructive'
									type='button'
									onClick={() => setOpen(false)}
								>
									Cancelar
								</Button>
							</DialogFooter>
						</form>
					</Form>
				</DialogContent>
			</Dialog>
		</section>
	);
}

const fields = [
	{
		name: "nombre",
		inputType: "text",
		placeholder: "",
		label: "Nombre",
	},
	{ name: "inicio", inputType: "custom-date", label: "Inicio" },
	{ name: "fin", inputType: "custom-date", label: "Fin" },
	{
		name: "dummy-fechaEnMatriculas",
		inputType: "custom-toggle",
		label: "Usa fecha en matriculas",
	},
	{
		name: "limiteMatriculaOrdinaria",
		inputType: "custom-date",
		placeholder: "",
		label: "Limite matricula ordinaria",
		dependsOn: "dummy-fechaEnMatriculas",
	},
	{
		name: "limiteMatriculaExtraordinaria",
		inputType: "custom-date",
		placeholder: "",
		label: "Limite matricula extraordinaria",
		dependsOn: "dummy-fechaEnMatriculas",
	},
	{
		name: "limiteMatriculaEspecial",
		inputType: "custom-date",
		placeholder: "",
		label: "Limite matricula especial",
		dependsOn: "dummy-fechaEnMatriculas",
	},
	{
		name: "tipo",
		inputType: "custom-select",
		options: ["GRADO", "POSGRADO"],
		label: "Tipo de periodo",
	},
	{
		name: "corteId",
		inputType: "custom-select",
		options: "custom",
		label: "Corte",
	},
	{
		name: "dummy-estructuraParalelos",
		inputType: "custom-toggle",
		label: "Estructura de paralelos agrupados por nivel",
	},
	{
		name: "estudianteSeleccionaParaleloAutomatricula",
		inputType: "custom-toggle",
		label: "Estudiante seleccione paralelo en automatricula",
		dependsOn: "dummy-estructuraParalelos",
	},
	{
		name: "seImpartioNivelacion",
		inputType: "custom-toggle",
		label: "Se impartio nivelacion",
	},
	{
		name: "planificacionCargaHoraria",
		inputType: "custom-toggle",
		placeholder: "",
		label: "Planificacion carga horaria",
	},
	{
		name: "dummy-planificacionProfesoresObligatoria",
		inputType: "custom-toggle",
		label: "Planificacion de profesores obligatoria",
	},
	{
		name: "planificacionProfesoresFormaTotal",
		inputType: "custom-toggle",
		label: "Planificacion de profesores de forma total",
	},
	{
		name: "aprobacionPlanificacionProfesores",
		inputType: "custom-toggle",
		label: "Aprobacion de planificacion de profesores",
	},
	{
		name: "cronogramaNotasCoordinacion",
		inputType: "custom-toggle",
		label: "Cronograma por coordinacion",
	},
	{
		name: "dummy-legalizarMatriculas",
		inputType: "custom-toggle",
		label: "Legalizar Matricula",
	},
	{
		name: "legalizacionAutomaticaContraPagos",
		inputType: "custom-toggle",
		label: "Legalizaciòn por pago",
		dependsOn: "dummy-legalizarMatriculas",
	},
	{
		name: "automatriculaAlumnosFechaExtraordinaria",
		inputType: "custom-toggle",
		label: "Automat. extraordinaria",
	},
	{
		name: "puedenMatricularseArrastre",
		inputType: "custom-toggle",
		label: "Automat. con arrastre",
	},
	{
		name: "puedenAutomatricularseSegundasOMasMatriculas",
		inputType: "custom-toggle",
		label: "Automat. 2das matriculas",
	},
	{
		name: "dummy-numeroMatricula",
		inputType: "custom-toggle",
		label: "Numero de Matricula",
	},
	{
		name: "dummy-numeroSecuencia",
		inputType: "custom-toggle",
		label: "Secuencia desde numero especifico",
	},
	{
		name: "numeroSecuencia",
		inputType: "number",
		label: "Numero secuencia",
		dependsOn: "dummy-numeroSecuencia",
	},
	{
		name: "numeroMatriculaAutomatico",
		inputType: "custom-toggle",
		label: "Numero de matricula automatica",
	},
	{
		name: "numeroMatricularAlLegalizar",
		inputType: "custom-toggle",
		label: "Numero de matricula al legalizar",
	},
] satisfies Field<keyof z.infer<typeof schema>>[];
