"use client";
import { TipoDuracion } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarIcon, PlusCircle } from "lucide-react";
import type { FieldPath } from "react-hook-form";
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
import type {
	CreateMallaCurricular,
	CreatePracticaComunitariaEnMalla,
	CreatePracticaPreProfesionalEnMalla,
} from "@/core/api/mallas-curriculares";
import { useMutateModule } from "@/hooks/use-mutate-module";
import { cn } from "@/utils";
import {
	NIVELES_PREFIXES,
	assertReferenceInput,
	type Field,
} from "@/utils/forms";
import type { ZodInferSchema } from "@/utils/types";
import { useRouter } from "next/navigation";
import { Button } from "../_components/ui/button";
import { Calendar } from "../_components/ui/calendar";
import { Checkbox } from "../_components/ui/checkbox";
import { Input } from "../_components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "../_components/ui/popover";
import { Textarea } from "../_components/ui/textarea";
import { ASIGNATURA_KEYS } from "../asignatura/query-keys";

export const mallaParams = {
	update: "actualizarMalla",
	delete: "eliminarMalla",
};

const createMallaSchema = z.object<
	ZodInferSchema<
		Omit<
			CreateMallaCurricular,
			| "programaId"
			| "tituloObtenidoId"
			| "codigo"
			| "cantidadArrastres"
			| "porcentajeMinimoPasarNivel"
			| "maximoMateriasAdelantar"
			| "perfilEgreso"
			| "observaciones"
			| "tipoDuracion"
			| "practicasComunitarias"
			| "practicasPreProfesionales"
		> & {
			tipoDuracion?: TipoDuracion | null;
			tituloObtenidoId?: string | null;
			codigo?: string | null;
			cantidadArrastres?: number | null;
			porcentajeMinimoPasarNivel?: number | null;
			maximoMateriasAdelantar?: number | null;
			perfilEgreso?: string | null;
			observaciones?: string | null;
			practicasComunitarias?:
				| (Omit<
						CreatePracticaComunitariaEnMalla,
						"horas" | "creditos" | "registroDesdeNivel"
				  > & {
						horas?: number | null;
						creditos?: number | null;
						registroDesdeNivel?: number | null;
				  })
				| null;
			practicasPreProfesionales?:
				| (Omit<
						CreatePracticaPreProfesionalEnMalla,
						"horas" | "creditos" | "registroDesdeNivel"
				  > & {
						horas?: number | null;
						creditos?: number | null;
						registroDesdeNivel?: number | null;
				  })
				| null;
			"reference-practicasPreProfesionales": boolean;
			"reference-pppLigadasAMaterias"?: boolean;
			"reference-practicasComunitarias": boolean;
			"reference-pcLigadasAMaterias"?: boolean;
			"reference-calculoAvanceNivel": boolean;
			"reference-puedeAdelantarMaterias": boolean;
		}
	>
>({
	modalidadId: z.string(),
	tituloObtenidoId: z.string().nullable().optional(),
	tipoDuracion: z
		.enum(["ANOS", "CREDITOS", "HORAS", "SEMESTRES"] as const)
		.nullable()
		.optional(),
	codigo: z.string().nullable().optional(),
	fechaAprobacion: z.string().datetime(),
	fechaLimiteVigencia: z.string().datetime(),
	cantidadOtrasMateriasMatricula: z.number(),
	limiteSeleccionMateriaPorAdministrativo: z.boolean(),
	cantidadArrastres: z.number().nullable().optional(),
	porcentajeMinimoPasarNivel: z.number().nullable().optional(),
	maximoMateriasAdelantar: z.number().nullable().optional(),
	automatriculaModulos: z.boolean(),
	plantillasSilabo: z.boolean(),
	modeloPlanificacion: z.boolean(),
	perfilEgreso: z.string().nullable().optional(),
	observaciones: z.string().nullable().optional(),

	niveles: z.number({ coerce: true }),
	practicasComunitarias: z
		.object({
			requiereAutorizacion: z.boolean(),
			creditos: z.number().nullable().optional(),
			horas: z.number().nullable().optional(),
			registroDesdeNivel: z.number().min(0).max(10).nullable().optional(),
			registroPracticasAdelantadas: z.boolean(),
			registroMultiple: z.boolean(),
		})
		.nullable()
		.optional(),
	practicasPreProfesionales: z
		.object({
			requiereAutorizacion: z.boolean(),
			creditos: z.number().nullable().optional(),
			horas: z.number().nullable().optional(),
			registroDesdeNivel: z.number().min(0).max(10).nullable().optional(),
			registroPracticasAdelantadas: z.boolean(),
		})
		.nullable()
		.optional(),

	"reference-practicasPreProfesionales": z.boolean(),
	"reference-pppLigadasAMaterias": z.boolean().optional(),
	"reference-practicasComunitarias": z.boolean(),
	"reference-pcLigadasAMaterias": z.boolean().optional(),
	"reference-calculoAvanceNivel": z.boolean(),
	"reference-puedeAdelantarMaterias": z.boolean(),
});

export default function AddMalla({ programaId }: { programaId?: string }) {
	const router = useRouter();

	const {
		mutation: { isPending, mutate },
		form,
		open,
		setOpen,
	} = useMutateModule({
		schema: createMallaSchema,
		mutationFn: async ({
			tipoDuracion,
			codigo,
			cantidadArrastres,
			porcentajeMinimoPasarNivel,
			maximoMateriasAdelantar,
			perfilEgreso,
			observaciones,
			tituloObtenidoId,
			practicasComunitarias,
			practicasPreProfesionales,
			...data
		}) => {
			if (!programaId) return;

			return API.programas.createMalla({
				programaId,
				data: {
					...data,
					tipoDuracion: tipoDuracion || null,
					codigo: codigo || null,
					cantidadArrastres: cantidadArrastres ?? null,
					porcentajeMinimoPasarNivel: porcentajeMinimoPasarNivel ?? null,
					maximoMateriasAdelantar: maximoMateriasAdelantar ?? null,
					perfilEgreso: perfilEgreso || null,
					observaciones: observaciones || null,
					tituloObtenidoId: tituloObtenidoId || null,
					practicasComunitarias: data["reference-practicasComunitarias"]
						? {
								...practicasComunitarias,
								requiereAutorizacion:
									practicasComunitarias?.requiereAutorizacion || false,
								creditos: data["reference-pcLigadasAMaterias"]
									? null
									: practicasComunitarias?.creditos || null,
								horas: data["reference-pcLigadasAMaterias"]
									? null
									: practicasComunitarias?.creditos || null,
								registroDesdeNivel: data["reference-pcLigadasAMaterias"]
									? null
									: practicasComunitarias?.creditos || null,
								registroPracticasAdelantadas:
									practicasComunitarias?.registroPracticasAdelantadas || false,
								registroMultiple:
									practicasComunitarias?.registroMultiple || false,
							}
						: null,
					practicasPreProfesionales: data["reference-practicasPreProfesionales"]
						? {
								...practicasPreProfesionales,
								requiereAutorizacion:
									practicasPreProfesionales?.requiereAutorizacion || false,
								creditos: data["reference-pppLigadasAMaterias"]
									? null
									: practicasPreProfesionales?.creditos || null,
								horas: data["reference-pppLigadasAMaterias"]
									? null
									: practicasPreProfesionales?.creditos || null,
								registroDesdeNivel: data["reference-pppLigadasAMaterias"]
									? null
									: practicasPreProfesionales?.creditos || null,
								registroPracticasAdelantadas:
									practicasPreProfesionales?.registroPracticasAdelantadas ||
									false,
							}
						: null,
				},
			});
		},
		onSuccess: response => {
			console.log({ response });
			router.refresh();
		},
		hookFormProps: {
			defaultValues: {
				limiteSeleccionMateriaPorAdministrativo: false,
				automatriculaModulos: false,
				plantillasSilabo: false,
				modeloPlanificacion: false,
				"reference-practicasPreProfesionales": false,
				"reference-pppLigadasAMaterias": false,
				"reference-practicasComunitarias": false,
				"reference-pcLigadasAMaterias": false,
				"reference-calculoAvanceNivel": false,
				"reference-puedeAdelantarMaterias": false,
				perfilEgreso: "",
				observaciones: "",
			},
			shouldUnregister: true,
		},
	});

	const { niveles, ...formValues } = form.watch();

	console.log(form.formState.errors);

	const {
		data: modalidades,
		isLoading: modalidadesAreLoading,
		refetch: fetchModalidades,
	} = useQuery({
		queryKey: ASIGNATURA_KEYS.list(""),
		queryFn: () => {
			return API.modalidades.getMany();
		},
		enabled: false,
	});

	const {
		data: titulosObtenidos,
		isLoading: titulosObtenidosAreLoading,
		refetch: fetchTitulosObtenidos,
	} = useQuery({
		queryKey: ["titulosObtenidos"],
		queryFn: () => {
			return API.titulosObtenidos.getMany();
		},
		enabled: false,
	});

	return (
		<section className='mb-2'>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>
					<Button variant='outline' disabled={!programaId}>
						<PlusCircle className='mr-2' />
						Agregar
					</Button>
				</DialogTrigger>
				<DialogContent className='max-h-[80%] max-w-max overflow-y-auto sm:max-w-[425px] md:max-w-5xl'>
					<DialogHeader>
						<DialogTitle>Adicionar malla</DialogTitle>
					</DialogHeader>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(data => mutate(data))}
							className='space-y-8'
						>
							{fields.map(f => {
								if (assertReferenceInput(f.name)) {
									if (f.name === "reference-pppLigadasAMaterias") {
										if (!formValues[f.dependsOn]) {
											return null;
										}
									}

									if (f.dependsOn && !formValues[f.dependsOn]) {
										return null;
									}

									return (
										<FormField
											control={form.control}
											name={f.name}
											key={f.name}
											disabled={isPending}
											render={({ field }) => {
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
											}}
										/>
									);
								}

								if (f.dependsOn) {
									if (f.dependsOn === "reference-calculoAvanceNivel") {
										if (
											f.name === "cantidadArrastres" &&
											!formValues[f.dependsOn]
										) {
											return (
												<FormField
													control={form.control}
													name={f.name}
													key={f.name}
													disabled={isPending}
													render={({ field }) => (
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
													)}
												/>
											);
										}

										if (
											f.name === "porcentajeMinimoPasarNivel" &&
											formValues[f.dependsOn]
										) {
											return (
												<FormField
													control={form.control}
													name={f.name}
													key={f.name}
													disabled={isPending}
													render={({ field }) => (
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
													)}
												/>
											);
										}

										return null;
									}

									if (
										f.dependsOn === "reference-practicasPreProfesionales" &&
										!formValues[f.dependsOn]
									) {
										return null;
									}

									if (
										f.dependsOn === "reference-practicasComunitarias" &&
										!formValues[f.dependsOn]
									) {
										return null;
									}

									if (f.dependsOn === "reference-pppLigadasAMaterias") {
										if (!formValues["reference-practicasPreProfesionales"])
											return null;

										if (formValues[f.dependsOn]) return null;
									}

									if (f.dependsOn === "reference-pcLigadasAMaterias") {
										if (!formValues["reference-practicasComunitarias"])
											return null;

										if (formValues[f.dependsOn]) return null;
									}

									if (f.dependsOn === "reference-puedeAdelantarMaterias") {
										if (!formValues[f.dependsOn]) return null;
									}
								}

								return (
									<FormField
										control={form.control}
										name={f.name}
										key={f.name}
										disabled={isPending}
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
														| { label: string; value: string }[]
														| string[]
														| undefined = Array.isArray(f.options)
														? f.options
														: undefined;
													let loading;

													if (f.options === "niveles") {
														options = NIVELES_PREFIXES.slice(0, niveles).map(
															(v, idx) =>
																({
																	value: `${idx + 1}`,
																	label: `${v} NIVEL`,
																}) satisfies {
																	label: string;
																	value: string;
																},
														);
													} else if (f.options === "custom") {
														switch (f.name) {
															case "modalidadId": {
																options = modalidades?.data.map(m => ({
																	label: m.nombre,
																	value: m.id,
																}));

																loading = modalidadesAreLoading;
																break;
															}
															case "tituloObtenidoId": {
																options = titulosObtenidos?.data.map(t => ({
																	label: t.nombre,
																	value: t.id,
																}));

																loading = titulosObtenidosAreLoading;
															}
														}
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
																	if (
																		f.name === "modalidadId" &&
																		!modalidades
																	) {
																		fetchModalidades();
																	}
																	if (
																		f.name === "tituloObtenidoId" &&
																		!titulosObtenidos
																	) {
																		fetchTitulosObtenidos();
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
												case "custom-text-area": {
													return (
														<FormItem className='grid grid-cols-12 items-start gap-4 space-y-0'>
															<FormLabel className='col-span-3 text-end'>
																{f.label}
															</FormLabel>
															<FormControl>
																<Textarea
																	className='col-span-9 resize-none'
																	{...field}
																	value={field.value as string}
																/>
															</FormControl>
														</FormItem>
													);
												}
												case "checkbox": {
													return (
														<FormField
															control={form.control}
															name={f.name}
															key={f.name}
															disabled={isPending}
															shouldUnregister={true}
															render={({ field }) => (
																<FormItem className='grid grid-cols-12 items-center gap-4 space-y-0'>
																	<FormLabel className='col-span-3 text-end'>
																		{f.label}
																	</FormLabel>
																	<FormControl>
																		<Input
																			{...field}
																			value={undefined}
																			onChange={e =>
																				field.onChange(e.target.checked)
																			}
																			checked={field.value as boolean}
																			type={f.inputType}
																			className='col-span-9'
																		/>
																	</FormControl>
																</FormItem>
															)}
														/>
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

const practicasPreProfesionalesFields = [
	{
		name: "reference-practicasPreProfesionales",
		inputType: "checkbox",
		label: "Realizan practicas preprofesionales",
	},
	{
		name: "practicasPreProfesionales.requiereAutorizacion",
		inputType: "checkbox",
		label: "Requiere autorizacion para iniciar practicas",
		dependsOn: "reference-practicasPreProfesionales",
	},
	{
		name: "reference-pppLigadasAMaterias",
		inputType: "checkbox",
		label: "Practicas preprofesionales ligadas a materias",
		dependsOn: "reference-practicasPreProfesionales",
	},
	{
		name: "practicasPreProfesionales.horas",
		inputType: "number",
		label: "Horas de practicas preprofesionales",
		dependsOn: "reference-pppLigadasAMaterias",
	},
	{
		name: "practicasPreProfesionales.creditos",
		inputType: "number",
		label: "Creditos de practicas preprofesionales",
		dependsOn: "reference-pppLigadasAMaterias",
	},
	{
		name: "practicasPreProfesionales.registroDesdeNivel",
		inputType: "custom-select",
		placeholder: "------------",
		label: "Registro de practicas preprofesionales desde",
		options: "niveles",
		dependsOn: "reference-pppLigadasAMaterias",
	},
	{
		name: "practicasPreProfesionales.registroPracticasAdelantadas",
		inputType: "checkbox",
		label: "Registro de practicas preprofesionales adelantadas",
		dependsOn: "reference-practicasPreProfesionales",
	},
] satisfies Field<FieldPath<z.infer<typeof createMallaSchema>>>[];

const practicasComunitariasFields = [
	{
		name: "reference-practicasComunitarias",
		inputType: "checkbox",
		label: "Realizan practicas comunitarias",
	},
	{
		name: "practicasComunitarias.requiereAutorizacion",
		inputType: "checkbox",
		label: "Requiere autorizacion para iniciar practicas",
		dependsOn: "reference-practicasComunitarias",
	},
	{
		name: "reference-pcLigadasAMaterias",
		inputType: "checkbox",
		label: "Practicas comunitarias ligadas a materias",
		dependsOn: "reference-practicasComunitarias",
	},
	{
		name: "practicasComunitarias.horas",
		inputType: "number",
		label: "Horas de practicas comunitarias",
		dependsOn: "reference-pcLigadasAMaterias",
	},
	{
		name: "practicasComunitarias.creditos",
		inputType: "number",
		label: "Creditos de practicas comunitarias",
		dependsOn: "reference-pcLigadasAMaterias",
	},
	{
		name: "practicasComunitarias.registroDesdeNivel",
		inputType: "custom-select",
		placeholder: "------------",
		label: "Registro de practicas comunitarias desde",
		options: "niveles",
		dependsOn: "reference-pcLigadasAMaterias",
	},
	{
		name: "practicasComunitarias.registroPracticasAdelantadas",
		inputType: "checkbox",
		label: "Registro de practicas comunitarias adelantadas",
		dependsOn: "reference-practicasComunitarias",
	},
	{
		name: "practicasComunitarias.registroMultiple",
		inputType: "checkbox",
		label: "Puede registrarse en multiples practicas comunitarias",
		dependsOn: "reference-practicasComunitarias",
	},
] satisfies Field<FieldPath<z.infer<typeof createMallaSchema>>>[];

const fields = [
	{
		name: "modalidadId",
		inputType: "custom-select",
		options: "custom",
		placeholder: "------------",
		label: "Modalidad",
	},
	{
		name: "tituloObtenidoId",
		inputType: "custom-select",
		label: "Titulo obtenido",
		options: "custom",
	},
	{
		name: "tipoDuracion",
		inputType: "custom-select",
		placeholder: "------------",
		options: Object.keys(TipoDuracion),
		label: "Tipo duracion",
	},
	{
		name: "codigo",
		inputType: "text",
		label: "Codigo",
	},
	{
		name: "fechaAprobacion",
		inputType: "custom-date",
		label: "Fecha de aprobacion",
	},
	{
		name: "fechaLimiteVigencia",
		inputType: "custom-date",
		label: "Fecha de limite de vigencia",
	},
	{ name: "niveles", inputType: "number", label: "Niveles de la malla" },
	{
		name: "cantidadOtrasMateriasMatricula",
		inputType: "number",
		label: "Cantidad de otras materias en matricula",
	},
	{
		name: "limiteSeleccionMateriaPorAdministrativo",
		inputType: "checkbox",
		label: "Limite en selección de materias por administrativos",
	},
	{
		name: "reference-calculoAvanceNivel",
		inputType: "checkbox",
		label: "Calculo de avance de nivel por %",
	},
	{
		name: "cantidadArrastres",
		inputType: "number",
		label: "Cantidad de arrastres",
		dependsOn: "reference-calculoAvanceNivel",
	},
	{
		name: "porcentajeMinimoPasarNivel",
		inputType: "number",
		label: "Porcentaje minimo pasar nivel",
		dependsOn: "reference-calculoAvanceNivel",
	},
	...practicasPreProfesionalesFields,
	...practicasComunitariasFields,
	{
		name: "reference-puedeAdelantarMaterias",
		inputType: "checkbox",
		label: "Puede adelantar materias",
	},
	{
		name: "maximoMateriasAdelantar",
		inputType: "number",
		label: "Maximo materias adelantar",
		dependsOn: "reference-puedeAdelantarMaterias",
	},
	{
		name: "automatriculaModulos",
		inputType: "number",
		label: "Automatricula en modulos",
	},
	{
		name: "plantillasSilabo",
		inputType: "number",
		label: "Plantillas de silabo",
	},
	{
		name: "modeloPlanificacion",
		inputType: "checkbox",
		label: "Modelo de planificacion",
	},
	{
		name: "perfilEgreso",
		inputType: "custom-text-area",
		label: "Perfil de egreso",
	},
	{
		name: "observaciones",
		inputType: "custom-text-area",
		label: "Observaciones",
	},
] satisfies Field<FieldPath<z.infer<typeof createMallaSchema>>>[];
